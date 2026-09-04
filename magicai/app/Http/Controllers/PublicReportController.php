<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\PodcastShow;
use App\Models\YoutubeConnection;
use App\Services\EpisodeSyncService;
use App\Services\Op3Service;
use App\Services\YouTubeAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/**
 * Show Report v1 — the PUBLIC data endpoint (spec §4 + 09-02 hero amendment:
 * "the report is the product"). podlink.ai/report/{hash} renders this.
 *
 * Access model: the share hash is an unguessable locator for a show whose
 * OWNER enabled sharing (opt-in, default off). It is not an identity
 * parameter — it cannot enumerate or reach anything the owner didn't
 * explicitly publish. Disabling sharing kills the URL immediately.
 *
 * Everything here is read-only, composed from the same services the
 * dashboard uses, and cached 30 minutes so a shared link can't hammer OP3.
 */
class PublicReportController extends Controller
{
    private const CACHE_MINUTES = 30;

    public function __construct(
        private readonly Op3Service $op3,
        private readonly EpisodeSyncService $episodeSync,
        private readonly YouTubeAnalyticsService $youtubeAnalytics,
    ) {
    }

    public function show(string $hash): JsonResponse
    {
        if (strlen($hash) < 16 || strlen($hash) > 64 || ! ctype_alnum($hash)) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $payload = Cache::remember(
            'public-report:' . $hash,
            now()->addMinutes(self::CACHE_MINUTES),
            fn (): ?array => $this->compose($hash),
        );

        if ($payload === null) {
            return response()->json(['error' => 'not_found'], 404);
        }

        return response()->json($payload);
    }

    /** @return array<string, mixed>|null */
    private function compose(string $hash): ?array
    {
        $show = PodcastShow::query()
            ->where('report_share_hash', $hash)
            ->whereNotNull('report_enabled_at')
            ->first();

        if ($show === null) {
            return null;
        }

        $feedInfo = $this->op3->inspectFeed($show->rss_feed_url);
        $title = $feedInfo['title'] ?? null;

        $downloads = null;
        $topApps = null;

        if (filled($show->op3_show_uuid)) {
            $downloads = $this->op3->downloadsForShow((string) $show->op3_show_uuid);
            $topApps = $this->op3->topAppsForShow((string) $show->op3_show_uuid);
        }

        // Episodes from the persisted table; hourly-throttled sync keeps a
        // shared report from going stale without hammering the feed.
        $this->episodeSync->syncIfStale($show);
        $episodes = $this->episodeSync->recent($show, 10);

        // Cross-channel: YouTube views per paired episode, when the owner
        // has a connection. Degrades to audio-only silently.
        $views = [];

        try {
            $connection = YoutubeConnection::query()->where('user_id', $show->user_id)->first();

            if ($connection !== null) {
                $videos = $this->youtubeAnalytics->videos($connection);
                $views = $this->youtubeAnalytics->viewsByVideoId($videos);
            }
        } catch (\Throwable) {
            $views = [];
        }

        return [
            'show_title' => $this->clean($title),
            'measured_by' => 'OP3 (op3.dev) — the open, independently operated podcast prefix. These numbers are checkable by anyone.',
            'op3_active' => filled($show->op3_show_uuid),
            'downloads' => $downloads,
            'top_apps' => $topApps,
            'youtube_connected' => $views !== [],
            'episodes' => $episodes->map(function ($episode) use ($views): array {
                $videoId = $episode->youtube_video_id;

                return [
                    'title' => $this->clean($episode->title),
                    'pub_date' => $episode->pub_date?->toDateString(),
                    'youtube_views' => $videoId !== null ? ($views[$videoId] ?? null) : null,
                    'transcribed' => $episode->transcript?->isCompleted() ?? false,
                ];
            })->values()->all(),
            'generated_at' => now()->toIso8601String(),
            'shared_since' => $show->report_enabled_at?->toDateString(),
        ];
    }

    /** Feed-sourced text: strip tags, cap length (same R5 posture as MCP). */
    private function clean(?string $value, int $limit = 300): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = trim(preg_replace('/\s+/u', ' ', strip_tags(html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8'))) ?? '');

        return $clean === '' ? null : mb_substr($clean, 0, $limit);
    }
}
