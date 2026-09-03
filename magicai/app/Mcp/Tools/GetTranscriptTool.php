<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Models\Episode;
use App\Models\EpisodeTranscript;
use App\Models\PodcastShow;

/**
 * MCP tool: get_transcript (v1.1, scoping amendment 2026-08-25)
 *
 * One episode's transcript, chunked so a long episode never blows out the
 * client's context. `episode_ref` is an episode id (from list_episodes or
 * search_transcripts) resolved STRICTLY within the authenticated user's own
 * show — it is a content locator, not an identity parameter, and it cannot
 * reach outside the token's account (MCP-SERVER-SCOPING.md §2 / R1).
 *
 * GATE TIER: reads free (creation was the metered step); exports stay paid.
 */
class GetTranscriptTool
{
    use ResolvesMcpUser;

    /** Characters per part — sized to stay well inside client context caps. */
    private const PART_SIZE = 30000;

    /**
     * @param  string  $episode_ref  The episode id, as returned by list_episodes or search_transcripts.
     * @param  int  $part  Which part of a long transcript to return, starting at 1.
     * @return array<string, mixed>
     */
    public function __invoke(string $episode_ref, int $part = 1): array
    {
        $user = $this->mcpUser();

        // TENANCY: user id comes from the authenticated request, never a param.
        $show = PodcastShow::query()->where('user_id', $user->id)->first();

        if ($show === null) {
            return [
                'connected' => false,
                'status' => 'no_show_connected',
                'message' => 'No podcast is connected to this Podlink account yet.',
                'setup_url' => route('dashboard.user.analytics.index'),
            ];
        }

        $ref = trim($episode_ref);

        // Resolve inside THIS show only — id first, guid as a fallback.
        $episode = Episode::query()
            ->where('podcast_show_id', $show->id)
            ->where(function ($q) use ($ref) {
                if (ctype_digit($ref)) {
                    $q->where('id', (int) $ref);
                }

                $q->orWhere('guid', $ref);
            })
            ->first();

        if ($episode === null) {
            return [
                'connected' => true,
                'status' => 'episode_not_found',
                'message' => 'No episode with that reference exists on this show. Use list_episodes or search_transcripts to get a valid episode_ref.',
            ];
        }

        $transcript = EpisodeTranscript::query()->where('episode_id', $episode->id)->first();

        if ($transcript === null || $transcript->status === EpisodeTranscript::STATUS_FAILED) {
            return [
                'connected' => true,
                'status' => 'not_transcribed',
                'episode_title' => $this->safeText($episode->title),
                'message' => 'This episode has not been transcribed. Press Transcribe on it in the Podlink dashboard (credits are metered like Speech to Text), then ask again.',
                'setup_url' => route('dashboard.user.analytics.index'),
            ];
        }

        if (! $transcript->isCompleted()) {
            return [
                'connected' => true,
                'status' => 'transcription_in_progress',
                'episode_title' => $this->safeText($episode->title),
                'message' => 'Transcription is running for this episode — usually a few minutes. Ask again shortly.',
            ];
        }

        $body = (string) $transcript->body;
        $totalParts = max(1, (int) ceil(mb_strlen($body) / self::PART_SIZE));
        $part = max(1, min($totalParts, $part));

        $chunk = mb_substr($body, ($part - 1) * self::PART_SIZE, self::PART_SIZE);

        return [
            'connected' => true,
            'status' => 'ok',
            'episode_ref' => (string) $episode->id,
            'episode_title' => $this->safeText($episode->title),
            'pub_date' => $episode->pub_date?->toDateString(),
            'language' => $transcript->language,
            'word_count' => $transcript->word_count,
            'part' => $part,
            'total_parts' => $totalParts,
            // Spoken third-party content: tags stripped, whitespace kept
            // readable. No truncation beyond the chunking itself.
            'text' => trim(strip_tags($chunk)),
            'hint' => $totalParts > 1 && $part < $totalParts
                ? sprintf('This transcript has %d parts. Call get_transcript again with part=%d for the next one.', $totalParts, $part + 1)
                : null,
        ];
    }
}
