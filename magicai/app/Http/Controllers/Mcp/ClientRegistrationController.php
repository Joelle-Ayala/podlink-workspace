<?php

declare(strict_types=1);

namespace App\Http\Controllers\Mcp;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Passport\ClientRepository;

/**
 * RFC 7591 — OAuth 2.0 Dynamic Client Registration.
 *
 * POST /oauth/register
 *
 * Creates a PUBLIC Passport client (no secret) for a remote MCP client that
 * has never talked to this server before. This is the endpoint claude.ai hits
 * after reading /.well-known/oauth-authorization-server.
 *
 * ── SAFETY NOTES (this endpoint shares tables with the live mobile app) ─────
 *
 * The mobile app authenticates through Passport's PASSWORD grant using an
 * existing `oauth_clients` row with password_client = 1. Everything created
 * here is a different shape entirely:
 *
 *   secret                 = NULL  -> public client
 *   password_client        = 0
 *   personal_access_client = 0
 *   user_id                = NULL
 *
 * Passport 12.4.3's Bridge\ClientRepository::handlesGrant() then restricts
 * such a row, without any extra configuration on our side, to exactly the
 * grants we want:
 *
 *   authorization_code -> allowed  (`! $record->firstParty()`, and firstParty
 *                                   is password_client || personal_access_client)
 *   refresh_token      -> allowed  (default branch)
 *   password           -> REFUSED  (requires password_client = 1)
 *   client_credentials -> REFUSED  (requires a secret)
 *   personal_access    -> REFUSED  (requires personal_access_client + secret)
 *
 * And league/oauth2-server v8's AuthCodeGrant requires a PKCE code challenge
 * for public clients by default, so authorization_code here is always
 * authorization_code + PKCE.
 *
 * NOTHING in this file writes to Passport's configuration, calls
 * Passport::enablePasswordGrant()/tokensCan(), or modifies an existing client.
 * It only INSERTs new rows. That is the whole point: MCP-P0-AUDIT.md Q2 flags
 * "breaking real mobile-app logins" as the single biggest risk in this plan.
 *
 * ── OPEN-REGISTRATION EXPOSURE ─────────────────────────────────────────────
 *
 * DCR is unauthenticated by design; anyone can create a client row. That is
 * acceptable because a registered client is inert until a real user completes
 * the interactive login + consent screen at /oauth/authorize, and PKCE binds
 * the code to the registering client. Mitigations applied here:
 *   * per-IP throttle (`throttle:mcp-register`, see RouteServiceProvider)
 *   * redirect-URI validation (absolute, no fragment, https / loopback-http /
 *     private-use scheme only, length- and count-capped)
 *   * every row is name-prefixed so connector clients can be identified and
 *     bulk-revoked later
 *   * every registration is logged
 */
class ClientRegistrationController
{
    /** Hosts accepted for a plain-http (loopback) redirect URI. */
    private const LOOPBACK_HOSTS = ['127.0.0.1', 'localhost', '::1', '[::1]'];

    private const SUPPORTED_GRANT_TYPES = ['authorization_code', 'refresh_token'];

    private const SUPPORTED_RESPONSE_TYPES = ['code'];

    public function __invoke(Request $request, ClientRepository $clients): JsonResponse
    {
        if (! (bool) config('mcp_oauth.enabled', true)) {
            abort(404);
        }

        if (! (bool) config('mcp_oauth.dynamic_registration.enabled', true)) {
            return $this->error(
                'invalid_client_metadata',
                'Dynamic client registration is disabled on this server.',
                403,
            );
        }

        // -- redirect_uris ---------------------------------------------------

        $redirectUris = $request->input('redirect_uris');

        if (! is_array($redirectUris) || $redirectUris === []) {
            return $this->error(
                'invalid_redirect_uri',
                'redirect_uris is required and must be a non-empty array of absolute URIs.',
            );
        }

        $maxUris = (int) config('mcp_oauth.dynamic_registration.max_redirect_uris', 5);

        if (count($redirectUris) > $maxUris) {
            return $this->error(
                'invalid_redirect_uri',
                sprintf('At most %d redirect_uris may be registered.', $maxUris),
            );
        }

        $clean = [];

        foreach ($redirectUris as $uri) {
            if (! is_string($uri)) {
                return $this->error('invalid_redirect_uri', 'Every redirect_uris entry must be a string.');
            }

            $uri = trim($uri);

            if (($problem = $this->rejectRedirectUri($uri)) !== null) {
                return $this->error('invalid_redirect_uri', $problem);
            }

            $clean[] = $uri;
        }

        $clean = array_values(array_unique($clean));

        // -- grant_types / response_types / auth method ----------------------

        $grantTypes = $request->input('grant_types', self::SUPPORTED_GRANT_TYPES);

        if (! is_array($grantTypes) || array_diff($grantTypes, self::SUPPORTED_GRANT_TYPES) !== []) {
            return $this->error(
                'invalid_client_metadata',
                'Only the authorization_code and refresh_token grant types are supported.',
            );
        }

        if (! in_array('authorization_code', $grantTypes, true)) {
            return $this->error(
                'invalid_client_metadata',
                'The authorization_code grant type is required.',
            );
        }

        $responseTypes = $request->input('response_types', self::SUPPORTED_RESPONSE_TYPES);

        if (! is_array($responseTypes) || array_diff($responseTypes, self::SUPPORTED_RESPONSE_TYPES) !== []) {
            return $this->error(
                'invalid_client_metadata',
                'Only the "code" response type is supported.',
            );
        }

        $authMethod = $request->input('token_endpoint_auth_method', 'none');

        if ($authMethod !== 'none') {
            return $this->error(
                'invalid_client_metadata',
                'This server only issues public clients; token_endpoint_auth_method must be "none".',
            );
        }

        // -- client_name -----------------------------------------------------

        $submittedName = $request->input('client_name');
        $submittedName = is_string($submittedName) && trim($submittedName) !== ''
            ? trim($submittedName)
            : (string) config('mcp_oauth.dynamic_registration.default_client_name', 'Unnamed MCP client');

        $prefix = (string) config('mcp_oauth.dynamic_registration.client_name_prefix', 'MCP Connector: ');
        $storedName = mb_substr($prefix . strip_tags($submittedName), 0, 191);

        // -- create ----------------------------------------------------------

        // Passport 12 stores redirect URIs in a single TEXT column and splits
        // them on ',' (Bridge\Client::__construct). rejectRedirectUri() already
        // refuses any URI containing a comma, so this join is lossless.
        //
        // Named arguments are deliberate: they make the three false flags
        // (personalAccess / password / confidential) impossible to misread, and
        // a future Passport signature change fails loudly at boot rather than
        // silently minting a confidential or first-party client.
        $client = $clients->create(
            userId: null,
            name: $storedName,
            redirect: implode(',', $clean),
            provider: (string) config('auth.guards.' . config('mcp_oauth.guard', 'api') . '.provider', 'users'),
            personalAccess: false,
            password: false,
            confidential: false,
        );

        Log::info('MCP dynamic client registration', [
            'client_id' => $client->getKey(),
            'client_name' => $storedName,
            'redirect_uris' => $clean,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'client_id' => (string) $client->getKey(),
            'client_id_issued_at' => $client->created_at?->getTimestamp() ?? time(),
            'client_name' => $submittedName,
            'redirect_uris' => $clean,
            'grant_types' => self::SUPPORTED_GRANT_TYPES,
            'response_types' => self::SUPPORTED_RESPONSE_TYPES,
            'token_endpoint_auth_method' => 'none',
        ], 201, [], JSON_UNESCAPED_SLASHES);
    }

    /**
     * @return string|null  null when the URI is acceptable, otherwise the reason.
     */
    private function rejectRedirectUri(string $uri): ?string
    {
        if ($uri === '') {
            return 'A redirect URI may not be empty.';
        }

        $maxLength = (int) config('mcp_oauth.dynamic_registration.max_redirect_uri_length', 2000);

        if (mb_strlen($uri) > $maxLength) {
            return sprintf('A redirect URI may not exceed %d characters.', $maxLength);
        }

        if (str_contains($uri, ',')) {
            // Not a spec rule — a storage rule. See the create() comment above.
            return 'A redirect URI may not contain a comma.';
        }

        $parts = parse_url($uri);

        if ($parts === false || ! isset($parts['scheme'])) {
            return 'A redirect URI must be an absolute URI including a scheme.';
        }

        if (isset($parts['fragment'])) {
            return 'A redirect URI may not contain a fragment component.';
        }

        $scheme = strtolower((string) $parts['scheme']);
        $host = strtolower((string) ($parts['host'] ?? ''));

        if ($scheme === 'https') {
            return $host === '' ? 'An https redirect URI must include a host.' : null;
        }

        if ($scheme === 'http') {
            if (! (bool) config('mcp_oauth.dynamic_registration.allow_loopback_http', true)) {
                return 'Plain http redirect URIs are not accepted.';
            }

            return in_array($host, self::LOOPBACK_HOSTS, true)
                ? null
                : 'Plain http redirect URIs are only accepted for loopback addresses.';
        }

        if (! (bool) config('mcp_oauth.dynamic_registration.allow_private_use_schemes', true)) {
            return 'Only https and loopback http redirect URIs are accepted.';
        }

        return preg_match('/^[a-z][a-z0-9+.\-]*$/', $scheme) === 1
            ? null
            : 'The redirect URI scheme is not a valid URI scheme.';
    }

    private function error(string $code, string $description, int $status = 400): JsonResponse
    {
        return response()->json([
            'error' => $code,
            'error_description' => $description,
        ], $status, [], JSON_UNESCAPED_SLASHES);
    }
}
