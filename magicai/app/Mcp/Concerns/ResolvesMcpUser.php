<?php

declare(strict_types=1);

namespace App\Mcp\Concerns;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

/**
 * Tenancy gate for every Podlink MCP tool.
 *
 * MCP-SERVER-SCOPING.md §2, non-negotiable: every tool resolves its data
 * through the authenticated request context. No tool accepts a user id,
 * email, handle or show uuid as input, and no tool may be given one.
 *
 * The bearer token has already been validated by
 * App\Http\Middleware\Mcp\AuthenticateMcpRequest before any tool runs; this
 * trait is the second, in-tool assertion of the same fact, so that a tool can
 * never silently execute unauthenticated (e.g. if the middleware is ever
 * dropped from config/mcp.php by accident).
 */
trait ResolvesMcpUser
{
    /**
     * The Podlink user this tool call belongs to.
     *
     * @throws \RuntimeException when the request is not authenticated.
     */
    protected function mcpUser(): User
    {
        $guard = (string) config('mcp_oauth.guard', 'api');

        $user = Auth::guard($guard)->user() ?? Auth::user();

        if (! $user instanceof User) {
            throw new RuntimeException(
                'This Podlink connector is not signed in. Reconnect the connector and sign in to your Podlink account.'
            );
        }

        return $user;
    }

    /**
     * Trim and hard-cap a string that came from a third-party RSS feed or the
     * OP3 API before it enters the model's context (MCP-SERVER-SCOPING.md R5:
     * prompt injection via podcast metadata).
     */
    protected function safeText(mixed $value, int $limit = 300): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $clean = trim(preg_replace('/\s+/u', ' ', strip_tags($value)) ?? '');

        if ($clean === '') {
            return null;
        }

        return mb_strlen($clean) > $limit
            ? mb_substr($clean, 0, $limit) . '…'
            : $clean;
    }
}
