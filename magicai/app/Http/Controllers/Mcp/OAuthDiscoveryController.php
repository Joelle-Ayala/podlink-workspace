<?php

declare(strict_types=1);

namespace App\Http\Controllers\Mcp;

use Illuminate\Http\JsonResponse;

/**
 * OAuth 2.1 discovery documents for the Podlink MCP server.
 *
 * php-mcp/laravel ships no OAuth surface (that is laravel/mcp's
 * Mcp::oauthRoutes(), and laravel/mcp cannot run on Laravel 10 — see
 * MCP-P0-AUDIT.md Q1). These two documents are the hand-built replacement.
 * They are pure JSON descriptions of endpoints Passport ALREADY exposes:
 * nothing here changes Passport's behaviour, grants, clients or config.
 *
 * Standards:
 *  - RFC 9728 (OAuth 2.0 Protected Resource Metadata) — /.well-known/oauth-protected-resource
 *  - RFC 8414 (OAuth 2.0 Authorization Server Metadata) — /.well-known/oauth-authorization-server
 *  - MCP authorization spec 2026-07-28 (MCP server = OAuth resource server)
 *
 * Both are unauthenticated, cookie-free, machine-consumed JSON. They are
 * registered under the `api` middleware group (routes/ai.php) so they never
 * pick up CSRF, the app's LocaleMiddleware or the igaster ThemeMiddleware.
 */
class OAuthDiscoveryController
{
    /**
     * RFC 9728 §3 — Protected Resource Metadata.
     *
     * `resource` and `authorization_servers` are the only required members.
     * Everything else is advisory and is omitted when not configured, because
     * an empty-but-present member is worse than an absent one for clients that
     * treat presence as a contract.
     */
    public function protectedResource(): JsonResponse
    {
        $this->abortIfDisabled();

        $document = [
            'resource' => $this->resourceUrl(),
            'authorization_servers' => [$this->issuer()],
            'bearer_methods_supported' => ['header'],
            'resource_name' => (string) config('mcp_oauth.resource_name', 'Podlink'),
        ];

        if (filled($scopes = (array) config('mcp_oauth.scopes_supported', []))) {
            $document['scopes_supported'] = array_values($scopes);
        }

        if (filled($docs = config('mcp_oauth.documentation_url'))) {
            $document['resource_documentation'] = (string) $docs;
        }

        return $this->json($document);
    }

    /**
     * RFC 8414 §2 — Authorization Server Metadata.
     *
     * Every endpoint advertised here is an EXISTING Passport route:
     *   /oauth/authorize  -> Laravel\Passport\Http\Controllers\AuthorizationController
     *   /oauth/token      -> Laravel\Passport\Http\Controllers\AccessTokenController
     * plus /oauth/register, the RFC 7591 endpoint added by this changeset.
     *
     * `scopes_supported` is intentionally absent unless configured — this app
     * has never called Passport::tokensCan(), so Passport rejects any scope
     * identifier other than '*'. Advertising a scope we would then refuse is a
     * guaranteed `invalid_scope` at the authorize step. See config/mcp_oauth.php.
     */
    public function authorizationServer(): JsonResponse
    {
        $this->abortIfDisabled();

        $issuer = $this->issuer();

        $document = [
            'issuer' => $issuer,
            'authorization_endpoint' => $issuer . '/oauth/authorize',
            'token_endpoint' => $issuer . '/oauth/token',
            'response_types_supported' => ['code'],
            'response_modes_supported' => ['query'],
            'grant_types_supported' => ['authorization_code', 'refresh_token'],

            // Passport's AuthCodeGrant is built on league/oauth2-server v8,
            // which requires PKCE for public clients by default and supports
            // S256. `plain` is deliberately not advertised (OAuth 2.1 forbids
            // it for new deployments).
            'code_challenge_methods_supported' => ['S256'],

            // DCR-created clients are public: no secret, so no client
            // authentication at the token endpoint.
            'token_endpoint_auth_methods_supported' => ['none'],
        ];

        if ((bool) config('mcp_oauth.dynamic_registration.enabled', true)) {
            $document['registration_endpoint'] = $issuer . '/oauth/register';
        }

        if (filled($scopes = (array) config('mcp_oauth.scopes_supported', []))) {
            $document['scopes_supported'] = array_values($scopes);
        }

        if (filled($docs = config('mcp_oauth.documentation_url'))) {
            $document['service_documentation'] = (string) $docs;
        }

        return $this->json($document);
    }

    /**
     * RFC 8414 issuer identifier: https origin, no trailing slash, no path.
     */
    private function issuer(): string
    {
        $configured = config('mcp_oauth.issuer');

        return rtrim((string) (filled($configured) ? $configured : url('/')), '/');
    }

    /**
     * RFC 9728 resource identifier: the MCP endpoint clients actually call.
     * Must match the URL pasted into the connector settings.
     */
    private function resourceUrl(): string
    {
        $configured = config('mcp_oauth.resource');

        if (filled($configured)) {
            return rtrim((string) $configured, '/');
        }

        $prefix = trim((string) config('mcp.transports.http_integrated.route_prefix', 'mcp'), '/');

        return $this->issuer() . '/' . $prefix;
    }

    private function abortIfDisabled(): void
    {
        abort_unless((bool) config('mcp_oauth.enabled', true), 404);
    }

    /**
     * @param  array<string, mixed>  $document
     */
    private function json(array $document): JsonResponse
    {
        return response()
            ->json($document, 200, [], JSON_UNESCAPED_SLASHES)
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
