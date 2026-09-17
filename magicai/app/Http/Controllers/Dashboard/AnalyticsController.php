<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Jobs\TranscribeEpisodeJob;
use App\Models\Episode;
use App\Models\EpisodeTranscript;
use App\Models\PodcastShow;
use App\Models\YoutubeConnection;
use App\Services\Biolink\BiolinkStatsRepository;
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
        BiolinkStatsRepository $biolinkStats,
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

        $youtubeDemographics = null;
        $youtubeWatchStats = null;

        if ($youtubeConfigured) {
            $youtubeConnection = YoutubeConnection::query()->where('user_id', $user->id)->first();

            if ($youtubeConnection !== null) {
                $youtubeVideos = $youtubeAnalytics->videos($youtubeConnection);
                $youtubeViews = $youtubeAnalytics->viewsByVideoId($youtubeVideos);

                // ML2 expanded: channel audience demographics (age/gender/geo).
                $youtubeDemographics = $youtubeAnalytics->demographics($youtubeConnection);

                // Sprint 2: channel watch metrics (views/watch time/AVD/subs, 90d).
                $youtubeWatchStats = $youtubeAnalytics->watchStats($youtubeConnection);

                // Naive title pairing — writes episodes.youtube_video_id only
                // where it is still null, and logs every match.
                if ($show !== null && $youtubeVideos !== []) {
                    if ($youtubeAnalytics->pairEpisodes($show, $youtubeVideos) > 0) {
                        $episodes = $episodeSync->recent($show, 10);
                    }
                }
            }
        }

        // Sprint 2: rolling-30d download trend from the daily snapshots.
        // Empty until history accrues; the blade renders nothing below 7 points.
        $downloadTrend = [];

        if ($show !== null && filled($show->op3_show_uuid)) {
            $downloadTrend = \App\Models\AnalyticsSnapshot::query()
                ->where('podcast_show_id', $show->id)
                ->where('source', 'op3')
                ->where('scope', 'show')
                ->orderBy('captured_on')
                ->limit(60)
                ->get(['captured_on', 'metrics'])
                ->map(static fn ($snapshot): array => [
                    'date'  => $snapshot->captured_on->toDateString(),
                    'value' => (int) data_get($snapshot->metrics, 'monthly_downloads', 0),
                ])
                ->filter(static fn (array $point): bool => $point['value'] > 0)
                ->values()
                ->all();
        }

        // Sprint E: one cheap EXISTS to drive the "Next steps" ladder card.
        $hasCompletedTranscript = $show !== null && EpisodeTranscript::query()
            ->where('status', EpisodeTranscript::STATUS_COMPLETED)
            ->whereIn('episode_id', $show->episodes()->select('id'))
            ->exists();

        return view('panel.user.analytics.index', [
            'show'              => $show,
            'showTitle'         => $showTitle,
            'hasCompletedTranscript' => $hasCompletedTranscript,
            'downloadTrend'     => $downloadTrend,
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
            'youtubeDemographics' => $youtubeDemographics,
            'youtubeWatchStats'   => $youtubeWatchStats,
            // Biolink bridge (amendment 08-27b): page views + link clicks
            // for the user's own Podlink page, keyed by the SSO email.
            'biolinkStats' => $biolinkStats->configured()
                ? $biolinkStats->statsForEmail((string) $user->email)
                : null,
        ]);
    }

    /**
     * Episode detail — the per-episode report v1 (spec: "the row that the
     * episode report hangs off"). Metadata + paired YouTube views +
     * transcript access, strictly for the requesting user's own show.
     */
    public function episode(
        Request $request,
        Episode $episode,
        YouTubeOAuthService $youtubeOauth,
        YouTubeAnalyticsService $youtubeAnalytics,
    ): View {
        $user = $request->user();

        $ownsEpisode = PodcastShow::query()
            ->where('user_id', $user->id)
            ->where('id', $episode->podcast_show_id)
            ->exists();

        abort_unless($ownsEpisode, 404);

        $episode->loadMissing('transcript');

        $youtubeViews = null;
        $youtubeVideos = [];
        $youtubeConnected = false;
        $watchStats = null;

        if ($youtubeOauth->isConfigured()) {
            $connection = YoutubeConnection::query()->where('user_id', $user->id)->first();

            if ($connection !== null) {
                $youtubeConnected = true;
                // Cached (1h) — also feeds the manual pairing UI (sprint C).
                $youtubeVideos = $youtubeAnalytics->videos($connection);

                if (filled($episode->youtube_video_id)) {
                    $youtubeViews = $youtubeAnalytics->viewsByVideoId($youtubeVideos)[$episode->youtube_video_id] ?? null;

                    // Sprint 2: per-video watch metrics (90d, cached; null = omit).
                    $watchStats = $youtubeAnalytics->episodeWatchStats($connection, (string) $episode->youtube_video_id);
                }
            }
        }

        // Sprint 2: timed transcript segments (empty for pre-09-16 transcripts).
        $segments = $episode->transcript?->isCompleted()
            ? $episode->transcript->segments()->limit(3000)->get()
            : collect();

        return view('panel.user.analytics.episode', [
            'episode'          => $episode,
            'transcript'       => $episode->transcript,
            'segments'         => $segments,
            'youtubeViews'     => $youtubeViews,
            'youtubeWatch'     => $watchStats,
            'youtubeVideos'    => $youtubeVideos,
            'youtubeConnected' => $youtubeConnected,
        ]);
    }

    /**
     * Manual episode↔YouTube pairing (sprint C). Three explicit modes:
     *  - manual: pair this episode to a chosen video from the user's own
     *    connected channel (validated against the channel's video list).
     *  - clear: record "this episode has no video" — sticky; automatic
     *    matching will not re-pair it.
     *  - auto: hand the episode back to automatic matching.
     * A manual decision is never overwritten by the automatic matcher.
     */
    public function youtubePair(
        Request $request,
        Episode $episode,
        YouTubeOAuthService $youtubeOauth,
        YouTubeAnalyticsService $youtubeAnalytics,
    ): RedirectResponse {
        $user = $request->user();

        $ownsEpisode = PodcastShow::query()
            ->where('user_id', $user->id)
            ->where('id', $episode->podcast_show_id)
            ->exists();

        abort_unless($ownsEpisode, 404);

        $data = $request->validate([
            'mode'     => 'required|in:manual,clear,auto',
            'video_id' => 'nullable|string|max:32',
        ]);

        if ($data['mode'] === 'clear') {
            $episode->forceFill([
                'youtube_video_id'         => null,
                'youtube_paired_manually'  => true,
                'youtube_match_confidence' => null,
            ])->save();

            return back()->with('message', __('Pairing removed. Automatic matching will leave this episode alone.'));
        }

        if ($data['mode'] === 'auto') {
            $episode->forceFill([
                'youtube_video_id'         => null,
                'youtube_paired_manually'  => false,
                'youtube_match_confidence' => null,
            ])->save();

            return back()->with('message', __('Episode returned to automatic matching. It re-pairs on the next analytics visit.'));
        }

        // mode = manual: the chosen video must exist on the user's own channel.
        if (blank($data['video_id'] ?? null)) {
            return back()->with('error', __('Pick a video to pair.'));
        }

        if (! $youtubeOauth->isConfigured()) {
            return back()->with('error', __('YouTube is not configured.'));
        }

        $connection = YoutubeConnection::query()->where('user_id', $user->id)->first();

        if ($connection === null) {
            return back()->with('error', __('Connect your YouTube channel first.'));
        }

        $videos = collect($youtubeAnalytics->videos($connection));
        $video = $videos->firstWhere('video_id', $data['video_id']);

        if ($video === null) {
            return back()->with('error', __('That video was not found on your connected channel.'));
        }

        $alreadyOn = Episode::query()
            ->where('podcast_show_id', $episode->podcast_show_id)
            ->where('id', '!=', $episode->id)
            ->where('youtube_video_id', $data['video_id'])
            ->first();

        if ($alreadyOn !== null) {
            return back()->with('error', __('That video is already paired to ":title". Remove that pairing first.', ['title' => (string) $alreadyOn->title]));
        }

        $episode->forceFill([
            'youtube_video_id'         => $data['video_id'],
            'youtube_paired_manually'  => true,
            'youtube_match_confidence' => null,
        ])->save();

        return back()->with('message', __('Episode paired to the selected video.'));
    }

    /**
     * User-triggered transcription of a single episode (spec §3: backfill
     * is per-episode and credit-gated, never automatic). Tenancy: the
     * episode must belong to the requesting user's own show.
     */
    public function transcribe(Request $request, Episode $episode): RedirectResponse
    {
        $user = $request->user();

        $ownsEpisode = PodcastShow::query()
            ->where('user_id', $user->id)
            ->where('id', $episode->podcast_show_id)
            ->exists();

        abort_unless($ownsEpisode, 404);

        if (blank($episode->audio_url)) {
            return back()->with('error', __('This episode has no audio file to transcribe.'));
        }

        $transcript = EpisodeTranscript::query()->firstOrCreate(
            ['episode_id' => $episode->id],
            ['status' => EpisodeTranscript::STATUS_PENDING],
        );

        if ($transcript->isCompleted()) {
            return back()->with('message', __('This episode is already transcribed.'));
        }

        if ($transcript->status === EpisodeTranscript::STATUS_PROCESSING) {
            return back()->with('message', __('Transcription is already running for this episode.'));
        }

        // Re-queue failed rows; leave already-pending rows queued once.
        if ($transcript->status === EpisodeTranscript::STATUS_FAILED) {
            $transcript->update(['status' => EpisodeTranscript::STATUS_PENDING, 'error' => null]);
        }

        TranscribeEpisodeJob::dispatch($transcript->id);

        return back()->with('message', __('Transcription queued — it appears here when it finishes. Credits are metered like Speech to Text.'));
    }

    /**
     * Show Report share toggle (spec §4): opt-in public link, default off.
     * Enabling mints an unguessable hash once; disabling kills the URL
     * (and the 30-min cache entry) immediately.
     */
    public function toggleReport(Request $request): RedirectResponse
    {
        $user = $request->user();

        $show = PodcastShow::query()->where('user_id', $user->id)->first();

        if ($show === null) {
            return back()->with('error', __('Connect your podcast first.'));
        }

        if ($show->reportEnabled()) {
            \Illuminate\Support\Facades\Cache::forget('public-report:' . $show->report_share_hash);
            $show->update(['report_enabled_at' => null]);

            return back()->with('message', __('Public report link disabled. The URL no longer works.'));
        }

        $show->update([
            'report_share_hash' => $show->report_share_hash ?: bin2hex(random_bytes(20)),
            'report_enabled_at' => now(),
        ]);

        return back()->with('message', __('Public report link enabled — share it with a sponsor or client.'));
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
