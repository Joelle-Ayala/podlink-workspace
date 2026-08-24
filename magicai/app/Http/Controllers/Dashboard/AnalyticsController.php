<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PodcastShow;
use App\Models\YoutubeConnection;
use App\Services\EpisodeSyncService;
use App\Services\Op3Service;
use App\Services\YouTubeAnalyticsService;
use App\Services\YouTubeOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Podcast Analytics (M5) — download stats via the OP3 open prefix.
 *
 * The user connects their RSS feed once; we resolve the show on OP3 via
 * the feed's <podcast:guid> and then read download counts, top apps and
 * recent episodes from the OP3 API. Everything degrades gracefully:
 * no feed → connect state, no OP3 data → onboarding callout.
 */
class AnalyticsController extends Controller
{
    public function index(
        Request $request,
        Op3Service $op3,
        EpisodeSyncService $episodeSync,
        YouTubeOAuthService $youtubeOauth,
        YouTubeAnalyticsService $youtubeAnalytics,
    ): View {
        $user = $request->user();

        $show = PodcastShow::query()->where('user_id', $user->id)->first();

        $feedInfo = null;
        $showTitle = null;
        $downloads = null;
        $topApps = null;
        $episodes = null;

        if ($show !== null) {
            $feedInfo = $op3->inspectFeed($show->rss_feed_url);
            $showTitle = $feedInfo['title'] ?? null;

            // The feed may have gained its <podcast:guid> (or OP3 may have
            // learned about the show) since the user connected — retry once.
            if (blank($show->op3_show_uuid)) {
                $resolved = filled($feedInfo['podcast_guid'] ?? null)
                    ? $op3->showByFeedOrGuid((string) $feedInfo['podcast_guid'])
                    : null;

                // Ported from the earlier build: OP3 can also match on the
                // feed URL itself — covers feeds without a <podcast:guid>.
                $resolved ??= $op3->showByFeedUrl($show->rss_feed_url);

                if (filled($resolved['show_uuid'] ?? null)) {
                    $show->update(['op3_show_uuid' => $resolved['show_uuid']]);
                    $showTitle = $resolved['title'] ?? $showTitle;
                }
            }

            if (filled($show->op3_show_uuid)) {
                $downloads = $op3->downloadsForShow($show->op3_show_uuid);
                $topApps = $op3->topAppsForShow($show->op3_show_uuid);
            }

            // Episode persistence (spec §3): the feed is the source of truth
            // for the episode list now, not OP3. Throttled to hourly.
            $episodeSync->syncIfStale($show);
            $episodes = $episodeSync->recent($show, 10);

            // Graceful fallback: a show whose feed has never parsed keeps the
            // old OP3-reported list rather than showing an empty section.
            if ($episodes->isEmpty() && filled($show->op3_show_uuid)) {
                $episodes = collect($op3->recentEpisodes($show->op3_show_uuid) ?? [])
                    ->map(static fn (array $episode): array => [
                        'title'            => $episode['title'] ?? null,
                        'pub_date'         => $episode['pub_date'] ?? null,
                        'youtube_video_id' => null,
                    ]);
            }
        }

        // ── YouTube (ML2-lite) ──────────────────────────────────────────
        $youtubeConfigured = $youtubeOauth->isConfigured();
        $youtubeConnection = null;
        $youtubeVideos = [];
        $youtubeViews = [];

        if ($youtubeConfigured) {
            $youtubeConnection = YoutubeConnection::query()->where('user_id', $user->id)->first();

            if ($youtubeConnection !== null) {
                $youtubeVideos = $youtubeAnalytics->videos($youtubeConnection);
                $youtubeViews = $youtubeAnalytics->viewsByVideoId($youtubeVideos);

                // Naive title pairing — writes episodes.youtube_video_id only
                // where it is still null, and logs every match.
                if ($show !== null && $youtubeVideos !== []) {
                    if ($youtubeAnalytics->pairEpisodes($show, $youtubeVideos) > 0) {
                        $episodes = $episodeSync->recent($show, 10);
                    }
                }
            }
        }

        return view('panel.user.analytics.index', [
            'show'              => $show,
            'showTitle'         => $showTitle,
            'op3Configured'     => $op3->isConfigured(),
            'prefixDetected'    => (bool) ($feedInfo['prefix_detected'] ?? false),
            'downloads'         => $downloads,
            'topApps'           => $topApps,
            'episodes'          => $episodes,
            'op3Prefix'         => Op3Service::PREFIX,
            'hosts'             => $this->podcastHosts(),
            'youtubeConfigured' => $youtubeConfigured,
            'youtubeConnection' => $youtubeConnection,
            'youtubeVideos'     => $youtubeVideos,
            'youtubeViews'      => $youtubeViews,
        ]);
    }

    public function connect(Request $request, Op3Service $op3, EpisodeSyncService $episodeSync): RedirectResponse
    {
        $data = $request->validate([
            'rss_feed_url' => 'required|url|starts_with:http|max:2048',
        ]);

        $user = $request->user();

        $existing = PodcastShow::query()->where('user_id', $user->id)->first();
        $feedChanged = $existing !== null && $existing->rss_feed_url !== $data['rss_feed_url'];

        $show = PodcastShow::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'rss_feed_url'            => $data['rss_feed_url'],
                'op3_show_uuid'           => null,
                'episodes_last_synced_at' => null,
            ],
        );

        // Pointing at a different feed means a different show — the old
        // episode rows no longer belong to it.
        if ($feedChanged) {
            $show->episodes()->delete();
        }

        // Bypass the feed cache — the user likely just changed something.
        $feedInfo = $op3->inspectFeed($show->rss_feed_url, fresh: true);

        // Connect is one of the two sync triggers (the other is a stale
        // analytics page load) — pull the episode list in immediately.
        $episodeSync->sync($show);

        $resolved = filled($feedInfo['podcast_guid'] ?? null)
            ? $op3->showByFeedOrGuid((string) $feedInfo['podcast_guid'])
            : null;

        // Ported from the earlier build: fall back to OP3's feed-URL lookup
        // for feeds that carry no <podcast:guid> tag.
        $resolved ??= $op3->showByFeedUrl($show->rss_feed_url);

        if (filled($resolved['show_uuid'] ?? null)) {
            $show->update(['op3_show_uuid' => $resolved['show_uuid']]);

            return redirect()
                ->route('dashboard.user.analytics.index')
                ->with(['message' => __('Podcast connected. Your download stats will appear below.'), 'type' => 'success']);
        }

        return redirect()
            ->route('dashboard.user.analytics.index')
            ->with(['message' => __('Feed saved. OP3 has no stats for this show yet — follow the setup steps below to start measuring downloads.'), 'type' => 'info']);
    }

    /**
     * Host-specific instructions for adding the OP3 prefix to the RSS feed.
     * Each host puts the "media prefix" setting in a different place.
     *
     * Ported from the earlier (2026-06-30) M5 build; copy adapted.
     *
     * @return array<string, array{name: string, steps: list<string>, note?: string}>
     */
    private function podcastHosts(): array
    {
        return [
            'spotify_for_podcasters' => [
                'name'  => 'Spotify for Podcasters (Anchor)',
                'steps' => [
                    'Go to podcasters.spotify.com and log in.',
                    'Click Settings → Distribution → RSS Feed.',
                    'In the "Media file prefix" field, paste: https://op3.dev/e/',
                    'Click Save. The prefix is applied automatically to all episodes.',
                ],
                'note'  => 'Changes apply immediately. No episodes need to be re-uploaded.',
            ],
            'buzzsprout' => [
                'name'  => 'Buzzsprout',
                'steps' => [
                    'Go to your Buzzsprout dashboard and click Podcast Settings.',
                    'Scroll to "Podcast Statistics" → "Third-party tracking".',
                    'Enter https://op3.dev/e/ in the prefix field.',
                    'Click Save Settings.',
                ],
                'note'  => 'Buzzsprout applies the prefix to all future and existing episode URLs.',
            ],
            'megaphone' => [
                'name'  => 'Megaphone',
                'steps' => [
                    'Log in to Megaphone and open your podcast.',
                    'Go to Settings → Distribution.',
                    'Find "Measurement" and add https://op3.dev/e/ as a prefix.',
                    'Save changes.',
                ],
                'note'  => 'Contact Megaphone support if you do not see the prefix field.',
            ],
            'transistor' => [
                'name'  => 'Transistor.fm',
                'steps' => [
                    'Go to your Transistor dashboard → Podcast Settings → Tracking.',
                    'Add https://op3.dev/e/ as a download tracking prefix.',
                    'Save. Transistor applies it to all episode audio URLs in your RSS feed.',
                ],
                'note'  => 'Transistor already uses OP3 internally — adding the prefix yourself unlocks the stats on this page.',
            ],
            'acast' => [
                'name'  => 'Acast',
                'steps' => [
                    'Log in to Acast → Show Settings → Distribution.',
                    'Find "Prefix URL" or "Download analytics" settings.',
                    'Add https://op3.dev/e/ as a prefix.',
                    'Save and publish.',
                ],
                'note'  => 'Contact Acast support if you cannot find the prefix setting.',
            ],
            'captivate' => [
                'name'  => 'Captivate.fm',
                'steps' => [
                    'In Captivate, go to your podcast → Settings → Analytics.',
                    'Find the "Third-Party Prefix" field.',
                    'Paste https://op3.dev/e/ and save.',
                ],
                'note'  => 'All episodes including back catalog will be tracked going forward.',
            ],
            'rss_com' => [
                'name'  => 'RSS.com',
                'steps' => [
                    'Log in to RSS.com → Podcast Settings → Advanced.',
                    'Look for "Media file prefix" or "Download tracking".',
                    'Add https://op3.dev/e/ and save.',
                ],
            ],
            'other' => [
                'name'  => 'Other / Self-hosted',
                'steps' => [
                    'Find the setting in your podcast host for "media prefix", "download prefix", or "tracking prefix".',
                    'Add https://op3.dev/e/ before all episode audio URLs.',
                    'If your host does not support a global prefix, manually prepend it to each episode\'s audio file URL.',
                    'Example: change https://example.com/ep1.mp3 to https://op3.dev/e/example.com/ep1.mp3',
                ],
                'note'  => 'The slash after /e/ matters — do not omit it.',
            ],
        ];
    }
}
