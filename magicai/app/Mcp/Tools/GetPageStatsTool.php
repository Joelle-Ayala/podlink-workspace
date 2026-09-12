<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Services\Biolink\BiolinkStatsRepository;

/**
 * MCP tool: get_page_stats (v1.1 — scoping O1, unblocked by the Biolink
 * read bridge, amendment 08-27b).
 *
 * Page views, unique visitors and top link clicks for the signed-in
 * user's OWN podlink.fm page. Tenant key = the authenticated user's email
 * (the SSO binding) — no identity parameters, per the file-header rule.
 * GATE TIER: free read (free-read acquisition rule).
 */
class GetPageStatsTool
{
    use ResolvesMcpUser;

    public function __construct(private readonly BiolinkStatsRepository $stats)
    {
    }

    /** @return array<string, mixed> */
    public function __invoke(): array
    {
        $user = $this->mcpUser();

        $stats = $this->stats->statsForEmail((string) $user->email);

        if (($stats['status'] ?? null) === 'unavailable') {
            return [
                'status' => 'unavailable',
                'message' => 'Podlink page statistics are not available right now. Try again later.',
            ];
        }

        if (($stats['status'] ?? null) !== 'ok') {
            return [
                'status' => 'no_page',
                'message' => 'No Podlink page found for this account yet. Open the Podlink dashboard and set up your page first.',
                'setup_url' => route('dashboard.user.podlink'),
            ];
        }

        return [
            'status' => 'ok',
            'window' => 'last 30 days (views); lifetime (link clicks)',
            'pageviews_30d' => (int) ($stats['pageviews_30d'] ?? 0),
            'unique_visitors_30d' => (int) ($stats['visitors_30d'] ?? 0),
            'page_url' => $this->safeText($stats['page_url'] ?? null, 500),
            'top_links' => array_map(
                fn (array $link): array => [
                    'url' => $this->safeText($link['url'] ?? null, 500),
                    'clicks' => (int) ($link['clicks'] ?? 0),
                ],
                $stats['top_links'] ?? [],
            ),
        ];
    }
}
