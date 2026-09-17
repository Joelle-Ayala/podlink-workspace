<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\AnalyticsSnapshot;
use App\Models\PodcastShow;
use App\Models\YoutubeConnection;
use App\Services\Op3Service;
use App\Services\YouTubeAnalyticsService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Daily analytics snapshots (sprint D — the smallest useful history).
 *
 * Per show, per day:
 *  - op3/show: monthly downloads + weekly average (when OP3 is resolved)
 *  - youtube/show: total views across paired episodes
 *  - youtube/episode: views per paired episode
 *
 * Read paths are the SAME cached services the dashboard uses (1h caches),
 * so a daily run adds at most one uncached OP3 + YouTube fetch per show.
 * Failures are per-show and logged; one bad feed never stops the run.
 * This command captures history only — it powers nothing user-facing yet.
 */
class SnapshotAnalyticsCommand extends Command
{
    protected $signature = 'podlink:snapshot-analytics';

    protected $description = 'Capture daily OP3 + YouTube metric snapshots for every connected show';

    public function handle(Op3Service $op3, YouTubeAnalyticsService $youtube): int
    {
        $today = now()->toDateString();
        $shows = 0;

        PodcastShow::query()->with('user')->chunkById(50, function ($chunk) use ($op3, $youtube, $today, &$shows): void {
            foreach ($chunk as $show) {
                try {
                    $this->snapshotShow($show, $op3, $youtube, $today);
                    $shows++;
                } catch (\Throwable $e) {
                    Log::warning('Analytics snapshot failed for show', [
                        'show_id' => $show->id,
                        'reason'  => mb_substr($e->getMessage(), 0, 300),
                    ]);
                }
            }
        });

        $this->info("Snapshots captured for {$shows} show(s).");

        return self::SUCCESS;
    }

    private function snapshotShow(PodcastShow $show, Op3Service $op3, YouTubeAnalyticsService $youtube, string $today): void
    {
        if (filled($show->op3_show_uuid)) {
            $downloads = $op3->downloadsForShow($show->op3_show_uuid);

            if (is_array($downloads) && $downloads !== []) {
                AnalyticsSnapshot::query()->updateOrCreate(
                    [
                        'podcast_show_id' => $show->id,
                        'captured_on'     => $today,
                        'source'          => 'op3',
                        'scope'           => 'show',
                        'episode_id'      => null,
                    ],
                    ['metrics' => $downloads],
                );
            }
        }

        $connection = YoutubeConnection::query()->where('user_id', $show->user_id)->first();

        if ($connection === null) {
            return;
        }

        $videos = $youtube->videos($connection);

        if ($videos === []) {
            return;
        }

        $views = $youtube->viewsByVideoId($videos);

        $paired = $show->episodes()
            ->whereNotNull('youtube_video_id')
            ->get(['id', 'youtube_video_id']);

        $totalViews = 0;
        $counted = 0;

        foreach ($paired as $episode) {
            $episodeViews = $views[$episode->youtube_video_id] ?? null;

            if ($episodeViews === null) {
                continue;
            }

            $totalViews += $episodeViews;
            $counted++;

            AnalyticsSnapshot::query()->updateOrCreate(
                [
                    'podcast_show_id' => $show->id,
                    'captured_on'     => $today,
                    'source'          => 'youtube',
                    'scope'           => 'episode',
                    'episode_id'      => $episode->id,
                ],
                ['metrics' => ['views' => $episodeViews]],
            );
        }

        if ($counted > 0) {
            $showMetrics = ['total_views_paired' => $totalViews, 'paired_episodes' => $counted];

            // Sprint 2: channel watch metrics ride along when available
            // (6h-cached read; 'ok' shape only — states are not history).
            $watch = $youtube->watchStats($connection);

            if (($watch['status'] ?? null) === 'ok') {
                $showMetrics['watch_minutes_90d'] = $watch['watch_minutes'];
                $showMetrics['avg_view_duration_seconds_90d'] = $watch['avg_view_duration_seconds'];
                $showMetrics['subscribers_net_90d'] = $watch['subscribers_net'];
            }

            AnalyticsSnapshot::query()->updateOrCreate(
                [
                    'podcast_show_id' => $show->id,
                    'captured_on'     => $today,
                    'source'          => 'youtube',
                    'scope'           => 'show',
                    'episode_id'      => null,
                ],
                ['metrics' => $showMetrics],
            );
        }
    }
}
