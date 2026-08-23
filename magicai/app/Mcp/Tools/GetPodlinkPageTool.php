<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Mcp\Support\PodlinkPageResolver;

/**
 * MCP tool: get_podlink_page
 *
 * Returns the authenticated user's public Podlink page URL. Input: none.
 *
 * URL CONSTRUCTION ONLY. This tool never touches the Biolink Admin API — that
 * key can create/update/delete any account and must not be reachable from a
 * code path an autonomous agent can trigger. See PodlinkPageResolver for the
 * full reasoning and for what happens while the page handle is not stored on
 * the MagicAI side.
 */
class GetPodlinkPageTool
{
    use ResolvesMcpUser;

    public function __construct(private readonly PodlinkPageResolver $pages)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        return $this->pages->forUser($this->mcpUser());
    }
}
