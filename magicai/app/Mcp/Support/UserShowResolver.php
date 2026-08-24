<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Models\PodcastShow;
use App\Models\User;
use App\Services\Op3Service;

/**
 * Resolves "which show does this user have connected, and what does OP3 know
 * about it" — a 1:1 mirror of what
 * App\Http\Controllers\Dashboard\AnalyticsController::index() composes for the
 * dashboard, including the one-shot re-resolution of a missing op3_show_uuid.
 *
 * MCP tools are THIN WRAPPERS (MCP-SERVER-SCOPING.md §1): they must return the
 * same numbers the dashboard shows, degrade the same way, and hit OP3 through
 * the same 1-hour-cached Op3Service. This class exists so that logic lives in
 * exactly one place across the three analytics tools instead of three.
 */
class UserShowResolver
{
    public function __construct(private readonly Op3Service $op3)
    {
    }

    /**
     * @return array{
     *     show: \App\Models\PodcastShow|null,
     *     feed_info: array{podcast_guid: ?string, prefix_detected: bool, title: ?string}|null,
     *     show_title: string|null
     * }
     */
    public function resolve(User $user): array
    {
        // TENANCY: the only place a user id ever enters a query in this
        // package, and it comes from the authenticated request, never a param.
        $show = PodcastShow::query()->where('user_id', $user->id)->first();

        if ($show === null) {
            return ['show' => null, 'feed_info' => null, 'show_title' => null];
        }

        $feedInfo = $this->op3->inspectFeed($show->rss_feed_url);
        $showTitle = $feedInfo['title'] ?? null;

        // The feed may have gained its <podcast:guid> (or OP3 may have learned
        // about the show) since the user connected — retry once. Mirrors
        // AnalyticsController::index() exactly, including the write-back.
        if (blank($show->op3_show_uuid)) {
            $resolved = filled($feedInfo['podcast_guid'] ?? null)
                ? $this->op3->showByFeedOrGuid((string) $feedInfo['podcast_guid'])
                : null;

            $resolved ??= $this->op3->showByFeedUrl($show->rss_feed_url);

            if (filled($resolved['show_uuid'] ?? null)) {
                $show->update(['op3_show_uuid' => $resolved['show_uuid']]);
                $showTitle = $resolved['title'] ?? $showTitle;
            }
        }

        return [
            'show' => $show,
            'feed_info' => $feedInfo,
            'show_title' => $showTitle,
        ];
    }

    /**
     * The structured "not connected" payload. Never fabricate numbers — mirror
     * the M5 graceful state and hand back the dashboard URL that fixes it.
     *
     * @return array<string, mixed>
     */
    public function notConnectedPayload(string $reason): array
    {
        return [
            'connected' => false,
            'status' => $reason,
            'message' => match ($reason) {
                'no_show_connected' => 'No podcast is connected to this Podlink account yet. '
                    . 'Connect an RSS feed in the Podlink dashboard to start measuring downloads.',
                'no_op3_data' => 'This podcast is connected but OP3 has no download data for it yet. '
                    . 'The OP3 prefix (https://op3.dev/e/) has to be added at the podcast host, '
                    . 'and stats appear once episodes are downloaded through it.',
                default => 'Podcast analytics are not available for this account yet.',
            },
            'setup_url' => $this->dashboardAnalyticsUrl(),
        ];
    }

    public function dashboardAnalyticsUrl(): string
    {
        return route('dashboard.user.analytics.index');
    }

    /**
     * The "connected but OP3 has no data yet" payload — same underlying
     * condition and message as notConnectedPayload('no_op3_data'), but with
     * connected:true. A show that's linked to a Podlink account but simply
     * hasn't produced OP3 data yet is still connected; get_show_overview
     * already reflects that (status: 'no_op3_data' alongside connected:true).
     * This keeps get_top_apps and list_episodes consistent with it instead of
     * reporting connected:false for a show the user has in fact connected.
     *
     * @return array<string, mixed>
     */
    public function connectedNoOp3DataPayload(?string $showTitle): array
    {
        return [
            'connected' => true,
            'status' => 'no_op3_data',
            'show_title' => $showTitle,
            'message' => 'This podcast is connected but OP3 has no download data for it yet. '
                . 'The OP3 prefix (https://op3.dev/e/) has to be added at the podcast host, '
                . 'and stats appear once episodes are downloaded through it.',
            'setup_url' => $this->dashboardAnalyticsUrl(),
        ];
    }
}
