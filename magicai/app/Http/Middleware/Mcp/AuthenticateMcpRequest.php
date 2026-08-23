<?php

declare(strict_types=1);

namespace App\Http\Middleware\Mcp;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bearer-token gate for the /mcp transport endpoint.
 *
 * Why not just `auth:api`? Because the MCP authorization spec (2026-07-28,
 * building on RFC 9728) requires an unauthorized MCP request to answer 401
 * with a `WWW-Authenticate` header carrying `resource_metadata=<url>`. That
 * header is how a client that has never seen this server discovers where the
 * protected-resource metadata lives, and from there the authorization server,
 * and from there the DCR endpoint. Laravel's stock `auth` middleware throws
 * AuthenticationException and emits a bare `{"message":"Unauthenticated."}`
 * with no such header, which leaves a fresh claude.ai connector with nothing
 * to bootstrap from.
 *
 * This middleware is additive: it does not modify, replace or re-register the
 * `auth` alias, and it does not touch the guard configuration the mobile app
 * uses. It only reads the existing Passport-backed `api` guard.
 */
class AuthenticateMcpRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! (bool) config('mcp_oauth.enabled', true)) {
            return $this->error(
                'service_unavailable',
                'The Podlink MCP server is not enabled on this instance.',
                503,
                withChallenge: false,
            );
        }

        $guard = (string) config('mcp_oauth.guard', 'api');

        if (Auth::guard($guard)->guest()) {
            return $this->error(
                'invalid_token',
                'Authentication required. Connect this client to a Podlink account first.',
                401,
            );
        }

        // Make the authenticated user the default for the rest of the request
        // so that request()->user() / Auth::user() inside tool handlers resolve
        // to the token's owner rather than to a (non-existent) web session.
        Auth::shouldUse($guard);

        return $next($request);
    }

    private function error(string $code, string $description, int $status, bool $withChallenge = true): JsonResponse
    {
        $response = new JsonResponse([
            'error' => $code,
            'error_description' => $description,
        ], $status);

        if ($withChallenge) {
            $response->headers->set('WWW-Authenticate', sprintf(
                'Bearer realm="%s", error="%s", error_description="%s", resource_metadata="%s"',
                $this->escape((string) config('mcp_oauth.resource_name', 'Podlink')),
                $code,
                $this->escape($description),
                url('/.well-known/oauth-protected-resource'),
            ));
        }

        return $response;
    }

    /**
     * Quoted-string values in an HTTP auth challenge cannot contain raw
     * double quotes or backslashes.
     */
    private function escape(string $value): string
    {
        return str_replace(['\\', '"'], ['', "'"], $value);
    }
}
