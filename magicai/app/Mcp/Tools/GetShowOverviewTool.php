<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Mcp\Support\PodlinkPageResolver;
use App\Mcp\Support\UserShowResolver;
use App\Services\Op3Service;

/**
 * MCP tool: get_show_overview
 *
 * THIN WRAPPER over Op3Service + PodcastShow. Composes exactly what
 * AnalyticsController::index() composes for the dashboard, minus the view.
 *
 * Input: none. The show is resolved from the authenticated user
 * (MCP-SERVER-SCOPING.md §2 — no identity parameters, ever).
 */
class GetShowOverviewTool
{
    use ResolvesMcpUser;

    public function __construct(
        private readonly Op3Service $op3,
        private readonly UserShowResolver $shows,
        private readonly PodlinkPageResolver $pages,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        $user = $this->mcpUser();

        $context = $this->shows->resolve($user);
        $show = $context['show'];

        if ($show === null) {
            return $this->shows->notConnectedPayload('no_show_connected') + [
                'podlink_page_url' => $this->pages->urlFor($user),
            ];
        }

        $downloads = null;
        $prefixActive = (bool) ($context['feed_info']['prefix_detected'] ?? false);

        if (filled($show->op3_show_uuid)) {
            $downloads = $this->op3->downloadsForShow((string) $show->op3_show_uuid);
        }

        return [
            'connected' => true,
            'status' => $downloads === null ? 'no_op3_data' : 'ok',
            'show_title' => $this->safeText($context['show_title']),
            'rss_feed_url' => $show->rss_feed_url,

            // Derived live from feed inspection on every call (1h cached in
            // Op3Service), not from a stored flag — the user may have just
            // added or removed the prefix at their host.
            'op3_prefix_active' => $prefixActive,
            'op3_configured' => $this->op3->isConfigured(),
            'op3_prefix' => Op3Service::PREFIX,

            'podlink_page_url' => $this->pages->urlFor($user),

            'stats' => [
                'monthly_downloads' => $downloads['monthly_downloads'] ?? null,
                'weekly_avg' => $downloads['weekly_avg_downloads'] ?? null,
                'weeks_measured' => $downloads['num_weeks'] ?? null,

                // MCP-SERVER-SCOPING.md §1 asks for weekly_downloads[4].
                // Op3Service exposes no per-week series today — it only reads
                // /queries/show-download-counts, which returns a weekly AVERAGE
                // plus numWeeks. Returning null is the honest answer; deriving
                // four numbers from an average would be a fabricated stat.
                // A real series needs a new OP3 query in Op3Service — out of P0
                // scope, tracked as an open item in MCP-P0-SPIKE-STATUS.md.
                'weekly_downloads' => null,
            ],

            'setup_url' => $downloads === null ? $this->shows->dashboardAnalyticsUrl() : null,
            'message' => $downloads === null
                ? 'The feed is connected but OP3 has no download counts for it yet. '
                    . ($prefixActive
                        ? 'The OP3 prefix is on the feed, so stats should start appearing as episodes are downloaded.'
                        : 'The OP3 prefix (https://op3.dev/e/) is not on this feed yet — add it at the podcast host.')
                : null,
        ];
    }
}
