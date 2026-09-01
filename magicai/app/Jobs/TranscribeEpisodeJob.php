<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Domains\Entity\Enums\EntityEnum;
use App\Domains\Entity\Facades\Entity;
use App\Models\Episode;
use App\Models\EpisodeTranscript;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

/**
 * Transcript pipeline (feed-ingestion-show-report-spec.md §3).
 *
 * Downloads an episode's audio, transcribes it through the SAME Whisper
 * entity the dashboard's speech-to-text uses, and meters credits
 * IDENTICALLY (word count × credit index, decremented on the show owner).
 *
 * Guard rails, in order:
 *  - transcript row is the lock: only pending/failed rows are processed
 *  - duration cap (default 90 min — spec's cost-control recommendation)
 *  - owner must have credit balance BEFORE any download starts
 *  - Whisper's 25MB request limit: oversized audio is re-encoded to a
 *    small mono file via ffmpeg when available, otherwise the job fails
 *    with an explicit, user-visible reason (never a silent hang)
 *
 * Dispatch paths: user-triggered per episode (AnalyticsController) —
 * backfill is NEVER automatic (spec: cost). Auto-transcribe of newly
 * synced episodes exists behind PODLINK_AUTO_TRANSCRIBE_NEW (default
 * OFF) so turning it on is a decision, not a surprise bill.
 */
class TranscribeEpisodeJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /** OpenAI hard request cap, minus headroom. */
    private const MAX_UPLOAD_BYTES = 24 * 1024 * 1024;

    /** Absolute download ceiling — refuse absurd enclosures outright. */
    private const MAX_DOWNLOAD_BYTES = 400 * 1024 * 1024;

    public int $timeout = 900;

    public int $tries = 1;

    public function __construct(public readonly int $transcriptId) {}

    public function handle(): void
    {
        $transcript = EpisodeTranscript::query()->find($this->transcriptId);

        if ($transcript === null || $transcript->isCompleted() || $transcript->status === EpisodeTranscript::STATUS_PROCESSING) {
            return;
        }

        $episode = $transcript->episode()->with('show')->first();
        $owner = $episode?->show?->user_id ? User::find($episode->show->user_id) : null;

        if ($episode === null || $owner === null || blank($episode->audio_url)) {
            $this->fail_($transcript, 'Episode, owner or audio URL missing.');

            return;
        }

        $maxSeconds = (int) config('podlink.transcribe_max_seconds', 5400);

        if ($episode->duration_seconds !== null && $episode->duration_seconds > $maxSeconds) {
            $this->fail_($transcript, sprintf('Episode is %d minutes; the transcription cap is %d minutes.', intdiv($episode->duration_seconds, 60), intdiv($maxSeconds, 60)));

            return;
        }

        $driver = Entity::driver(EntityEnum::WHISPER_1)->forUser($owner);

        if (! $driver->hasCreditBalance()) {
            $this->fail_($transcript, 'Not enough credits to transcribe this episode.');

            return;
        }

        $transcript->update(['status' => EpisodeTranscript::STATUS_PROCESSING, 'error' => null]);

        $path = null;

        try {
            $path = $this->download($episode->audio_url);
            $path = $this->fitUnderUploadCap($path);

            $response = OpenAI::audio()->transcribe([
                'file'            => fopen($path, 'rb'),
                'model'           => EntityEnum::WHISPER_1->value,
                'response_format' => 'verbose_json',
            ]);

            $text = trim((string) $response->text);

            if ($text === '') {
                $this->fail_($transcript, 'Transcription returned no text.');

                return;
            }

            // Meter EXACTLY like the dashboard speech-to-text flow.
            $driver->input($text)->calculateCredit()->decreaseCredit();

            $transcript->update([
                'status'          => EpisodeTranscript::STATUS_COMPLETED,
                'body'            => $text,
                'language'        => substr((string) ($response->language ?? ''), 0, 16) ?: null,
                'provider'        => EntityEnum::WHISPER_1->value,
                'audio_seconds'   => isset($response->duration) ? (int) round((float) $response->duration) : $episode->duration_seconds,
                'word_count'      => countWords($text),
                'credits_charged' => $driver->calculate(),
                'error'           => null,
                'completed_at'    => now(),
            ]);

            Log::info('Episode transcribed', [
                'episode_id' => $episode->id,
                'words'      => countWords($text),
            ]);
        } catch (\Throwable $e) {
            $this->fail_($transcript, mb_substr($e->getMessage(), 0, 1000));
        } finally {
            if ($path !== null && is_file($path)) {
                @unlink($path);
            }
        }
    }

    private function download(string $url): string
    {
        $target = tempnam(sys_get_temp_dir(), 'podlink-ep-');

        if ($target === false) {
            throw new \RuntimeException('Could not create a temp file.');
        }

        $response = Http::timeout(300)
            ->withOptions(['sink' => $target, 'allow_redirects' => ['max' => 5]])
            ->get($url);

        if (! $response->successful()) {
            throw new \RuntimeException('Audio download failed (HTTP ' . $response->status() . ').');
        }

        $size = filesize($target) ?: 0;

        if ($size === 0) {
            throw new \RuntimeException('Audio download was empty.');
        }

        if ($size > self::MAX_DOWNLOAD_BYTES) {
            throw new \RuntimeException('Audio file is too large to process.');
        }

        return $target;
    }

    /**
     * Whisper rejects uploads over ~25MB. Typical episodes exceed that, so
     * re-encode to 32kbps mono MP3 (a 90-minute episode lands ~21MB) when
     * ffmpeg is present. Without ffmpeg, small files pass through and big
     * ones fail with an explicit reason.
     */
    private function fitUnderUploadCap(string $path): string
    {
        if ((filesize($path) ?: 0) <= self::MAX_UPLOAD_BYTES) {
            return $path;
        }

        $ffmpeg = trim((string) @shell_exec('command -v ffmpeg 2>/dev/null'));

        if ($ffmpeg === '') {
            throw new \RuntimeException('Audio exceeds the 25MB transcription limit and ffmpeg is not available to compress it.');
        }

        $compressed = $path . '.mp3';
        $cmd = sprintf(
            '%s -y -i %s -ac 1 -b:a 32k -vn %s 2>&1',
            escapeshellcmd($ffmpeg),
            escapeshellarg($path),
            escapeshellarg($compressed),
        );

        @shell_exec($cmd);

        if (! is_file($compressed) || (filesize($compressed) ?: 0) === 0) {
            throw new \RuntimeException('Audio compression failed.');
        }

        @unlink($path);

        if ((filesize($compressed) ?: 0) > self::MAX_UPLOAD_BYTES) {
            throw new \RuntimeException('Audio is still over the 25MB transcription limit after compression.');
        }

        return $compressed;
    }

    private function fail_(EpisodeTranscript $transcript, string $reason): void
    {
        $transcript->update([
            'status' => EpisodeTranscript::STATUS_FAILED,
            'error'  => $reason,
        ]);

        Log::warning('Episode transcription failed', [
            'transcript_id' => $transcript->id,
            'reason'        => $reason,
        ]);
    }
}
