<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Mcp\Support\UserShowResolver;
use App\Models\YoutubeConnection;
use App\Services\EpisodeSyncService;
use App\Services\Op3Service;
use App\Services\YouTubeAnalyticsService;

/**
 * MCP tool: get_recent_performance (growth-research acceptance criterion 4
 * — the FIRST-CALL WOW: "how your last 5 episodes did + what's unusual",
 * zero setup, composed entirely from existing reads).
 *
 * Observations are COMPUTED and honest — simple comparisons against the
 * episode set itself (view outliers vs the median, cadence gaps,
 * transcript coverage), never invented narrative. Where a data source is
 * absent the summary says so plainly. GATE TIER: free read.
 */
class GetRecentPerformanceTool
{
    use ResolvesMcpUser;

    private const EPISODES = 5;

    public function __construct(
        private readonly UserShowResolver $shows,
        private readonly EpisodeSyncService $episodeSync,
        private readonly YouTubeAnalyticsService $youtubeAnalytics,
        private readonly Op3Service $op3,
    ) {
    }

    /** @return array<string, mixed> */
    public function __invoke(): array
    {
        $user = $this->mcpUser();

        $context = $this->shows->resolve($user);
        $show = $context['show'];

        if ($show === null) {
            return $this->shows->notConnectedPayload('no_show_connected');
        }

        $this->episodeSync->syncIfStale($show);
        $episodes = $this->episodeSync->recent($show, self::EPISODES);

        if ($episodes->isEmpty()) {
            return [
                'connected' => true,
                'status' => 'no_episodes',
                'message' => 'The feed is connected but no episodes have synced yet — they appear within an hour of publishing.',
            ];
        }

        // YouTube views where a connection + pairing exist.
        $views = [];

        try {
            $connection = YoutubeConnection::query()->where('user_id', $user->id)->first();

            if ($connection !== null) {
                $videos = $this->youtubeAnalytics->videos($connection);
                $views = $this->youtubeAnalytics->viewsByVideoId($videos);
            }
        } catch (\Throwable) {
            $views = [];
        }

        $rows = $episodes->map(function ($episode) use ($views): array {
            $videoId = $episode->youtube_video_id;

            return [
                'episode_ref' => (string) $episode->id,
                'title' => $this->safeText($episode->title),
                'pub_date' => $episode->pub_date?->toDateString(),
                'youtube_views' => $videoId !== null ? ($views[$videoId] ?? null) : null,
                'transcribed' => $episode->transcript?->isCompleted() ?? false,
            ];
        })->values();

        // Show-level downloads (OP3 is show-level in v1 — say so).
        $downloads = filled($show->op3_show_uuid)
            ? $this->op3->downloadsForShow((string) $show->op3_show_uuid)
            : null;

        return [
            'connected' => true,
            'status' => 'ok',
            'show_title' => $this->safeText($context['show_title']),
            'show_downloads' => $downloads,
            'episodes' => $rows->all(),
            'observations' => $this->observations($rows->all()),
            'notes' => array_values(array_filter([
                $downloads === null ? 'Download numbers appear once the OP3 prefix is active at the host.' : null,
                $views === [] ? 'YouTube views appear once a channel is connected in the dashboard.' : null,
                'Downloads are show-level in v1; per-episode splits are on the roadmap.',
            ])),
        ];
    }

    /**
     * Honest, computed observations — comparisons within this episode set
     * only. No causal claims, no invented trends.
     *
     * @param  list<array<string, mixed>>  $episodes
     * @return list<string>
     */
    private function observations(array $episodes): array
    {
        $out = [];

        // View outliers vs the median of episodes that HAVE views.
        $viewRows = array_values(array_filter($episodes, fn (array $e): bool => is_int($e['youtube_views'])));

        if (count($viewRows) >= 3) {
            $values = array_map(fn (array $e): int => $e['youtube_views'], $viewRows);
            sort($values);
            $median = $values[intdiv(count($values), 2)];

            if ($median > 0) {
                foreach ($viewRows as $row) {
                    if ($row['youtube_views'] >= $median * 2) {
                        $out[] = sprintf('"%s" has roughly %.1fx the median YouTube views of your recent episodes.', $row['title'] ?? 'An episode', $row['youtube_views'] / $median);
                    } elseif ($row['youtube_views'] <= $median * 0.4) {
                        $out[] = sprintf('"%s" is well below your recent median YouTube views.', $row['title'] ?? 'An episode');
                    }
                }
            }
        }

        // Cadence gap: compare the two most recent publish dates.
        $dates = array_values(array_filter(array_map(
            fn (array $e): ?string => is_string($e['pub_date']) ? $e['pub_date'] : null,
            $episodes,
        )));

        if (count($dates) >= 2) {
            try {
                $gap = \Carbon\Carbon::parse($dates[0])->diffInDays(\Carbon\Carbon::parse($dates[1]));

                if ($gap >= 14) {
                    $out[] = sprintf('There was a %d-day gap before the latest episode — longer than usual matters to app algorithms.', $gap);
                }
            } catch (\Throwable) {
                // dates unparsable — skip the observation, never guess
            }
        }

        // Transcript coverage.
        $transcribed = count(array_filter($episodes, fn (array $e): bool => (bool) $e['transcribed']));

        if ($transcribed === 0) {
            $out[] = 'None of these episodes are transcribed yet — transcripts unlock search and grounded show notes (one click each in the dashboard).';
        } elseif ($transcribed < count($episodes)) {
            $out[] = sprintf('%d of %d recent episodes are transcribed.', $transcribed, count($episodes));
        }

        if ($out === []) {
            $out[] = 'Nothing unusual in this set — recent episodes are performing consistently with each other.';
        }

        return array_slice($out, 0, 5);
    }
}
