<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Mcp\Support\UserShowResolver;
use App\Services\Op3Service;

/**
 * MCP tool: get_top_apps
 *
 * THIN WRAPPER over Op3Service::topAppsForShow(). Input: none — the show is
 * resolved from the authenticated user.
 *
 * Op3Service (post-efe2fb3d, verified 2026-08-08 against the live OP3 swagger)
 * reads OP3's `appDownloads` — ABSOLUTE download counts over the last three
 * calendar months — and computes each app's percentage share from them. This
 * tool passes both through unchanged: `downloads` is the real count, and
 * `share_pct` is the derived percentage. Values are read defensively so a
 * future Op3Service shape change degrades to null rather than throwing.
 */
class GetTopAppsTool
{
    use ResolvesMcpUser;

    public function __construct(
        private readonly Op3Service $op3,
        private readonly UserShowResolver $shows,
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
            return $this->shows->notConnectedPayload('no_show_connected');
        }

        if (blank($show->op3_show_uuid)) {
            return $this->shows->connectedNoOp3DataPayload($this->safeText($context['show_title']));
        }

        $apps = $this->op3->topAppsForShow((string) $show->op3_show_uuid);

        if ($apps === null) {
            return $this->shows->connectedNoOp3DataPayload($this->safeText($context['show_title']));
        }

        return [
            'connected' => true,
            'status' => 'ok',
            'show_title' => $this->safeText($context['show_title']),
            'window' => 'last_3_calendar_months',
            'apps' => array_map(
                fn (array $app): array => [
                    // App names come from OP3, not from the user's feed, but
                    // they still land in the model's context — cap them (R5).
                    'app' => $this->safeText($app['app'] ?? null, 120),
                    'downloads' => isset($app['downloads']) && is_numeric($app['downloads'])
                        ? (int) $app['downloads']
                        : null,
                    'share_pct' => isset($app['share']) && is_numeric($app['share'])
                        ? (float) $app['share']
                        : null,
                ],
                $apps,
            ),
            'note' => 'Downloads are absolute counts over the last three calendar months; '
                . 'share_pct is each app\'s percentage of that total. Highest first, top 10.',
        ];
    }
}
