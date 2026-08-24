<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Mcp\Support\UserShowResolver;
use App\Services\Op3Service;

/**
 * MCP tool: list_episodes
 *
 * THIN WRAPPER over Op3Service::recentEpisodes(). The only input is `limit`;
 * the show is resolved from the authenticated user (MCP-SERVER-SCOPING.md §2).
 */
class ListEpisodesTool
{
    use ResolvesMcpUser;

    private const DEFAULT_LIMIT = 20;

    private const MAX_LIMIT = 50;

    public function __construct(
        private readonly Op3Service $op3,
        private readonly UserShowResolver $shows,
    ) {
    }

    /**
     * @param  int  $limit  How many episodes to return, newest first (1-50).
     * @return array<string, mixed>
     */
    public function __invoke(int $limit = self::DEFAULT_LIMIT): array
    {
        $user = $this->mcpUser();

        $limit = max(1, min(self::MAX_LIMIT, $limit));

        $context = $this->shows->resolve($user);
        $show = $context['show'];

        if ($show === null) {
            return $this->shows->notConnectedPayload('no_show_connected');
        }

        if (blank($show->op3_show_uuid)) {
            return $this->shows->connectedNoOp3DataPayload($this->safeText($context['show_title']));
        }

        $episodes = $this->op3->recentEpisodes((string) $show->op3_show_uuid, $limit);

        if ($episodes === null) {
            return $this->shows->connectedNoOp3DataPayload($this->safeText($context['show_title']));
        }

        return [
            'connected' => true,
            'status' => 'ok',
            'show_title' => $this->safeText($context['show_title']),
            'limit' => $limit,
            'count' => count($episodes),
            'episodes' => array_map(
                // Titles come from a third-party RSS feed via OP3 and land in
                // the model's context — strip tags and truncate (R5).
                fn (array $episode): array => [
                    'id' => $this->safeText($episode['id'] ?? null, 200),
                    'title' => $this->safeText($episode['title'] ?? null),
                    'pubdate' => $this->safeText($episode['pub_date'] ?? null, 64),
                ],
                $episodes,
            ),
        ];
    }
}
