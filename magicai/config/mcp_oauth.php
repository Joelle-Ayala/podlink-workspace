<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Podlink MCP — OAuth 2.1 surface (ML2.5)
|--------------------------------------------------------------------------
|
| php-mcp/laravel provides the MCP transport and tool layer but NOT the
| OAuth 2.1 discovery / Dynamic Client Registration surface that remote MCP
| clients (claude.ai custom connectors) require. That surface is hand-built
| in app/Http/Controllers/Mcp/ on top of the Passport install that already
| authenticates the native mobile app.
|
| HARD RULE: nothing in this file may change how the existing password-grant
| mobile clients behave. We only ever ADD new public (secret-less) clients.
|
| HARD RULE: this app must never be `config:cache`d (igaster theme engine —
| see docker-entrypoint.sh). This file is read through config() at runtime
| like every other config file here, so that rule is unaffected.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Master switch
    |--------------------------------------------------------------------------
    |
    | When false the discovery documents and the registration endpoint return
    | 404 / 403 and /mcp answers 503. Note the Railway gotcha: an env-var
    | change requires a CODE deploy, not a redeploy — so treat this as "set it
    | once at rollout", not as a live toggle.
    |
    */

    'enabled' => (bool) env('MCP_OAUTH_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Guard used to authenticate MCP tool calls
    |--------------------------------------------------------------------------
    |
    | 'api' is the Passport-backed guard already configured in config/auth.php.
    | Do not point this at 'web' — MCP traffic is bearer-token, cookie-free.
    |
    */

    'guard' => (string) env('MCP_OAUTH_GUARD', 'api'),

    /*
    |--------------------------------------------------------------------------
    | Identifiers advertised in the discovery documents
    |--------------------------------------------------------------------------
    |
    | issuer   — RFC 8414 issuer identifier. MUST be an https origin with no
    |            query/fragment and no trailing slash. Defaults to the app URL.
    | resource — RFC 9728 resource identifier: the canonical MCP endpoint URL
    |            that users paste into their connector settings
    |            (https://app.podlink.ai/mcp).
    |
    */

    'issuer' => env('MCP_OAUTH_ISSUER'),

    'resource' => env('MCP_RESOURCE_URL'),

    'resource_name' => (string) env('MCP_RESOURCE_NAME', 'Podlink'),

    'documentation_url' => env('MCP_DOCS_URL'),

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    |
    | DELIBERATELY EMPTY. This app has never called Passport::tokensCan(), so
    | Passport::$scopes is empty and Passport's ScopeRepository rejects every
    | scope identifier except '*'. If we advertised scopes here, a client that
    | echoed them back on /oauth/authorize would get `invalid_scope`.
    |
    | Leaving this empty means the discovery documents omit `scopes_supported`
    | entirely, and well-behaved clients then request no scope at all — which
    | Passport accepts (empty default scope).
    |
    | To light scopes up later: add a dedicated service provider that calls
    | Passport::tokensCan([...]) and re-run the mobile-login regression test,
    | because tokensCan() is a GLOBAL Passport mutation.
    |
    */

    'scopes_supported' => [],

    /*
    |--------------------------------------------------------------------------
    | Dynamic Client Registration (RFC 7591)
    |--------------------------------------------------------------------------
    */

    'dynamic_registration' => [

        'enabled' => (bool) env('MCP_DCR_ENABLED', true),

        // Every DCR-created oauth_clients row gets this prefix on its name.
        // There is no `is_mcp_client` column in Passport 12's oauth_clients
        // table, so this prefix is the ONLY way to identify (and bulk-revoke)
        // connector clients later. Do not change it casually.
        'client_name_prefix' => (string) env('MCP_DCR_CLIENT_PREFIX', 'MCP Connector: '),

        'default_client_name' => 'Unnamed MCP client',

        'max_redirect_uris' => 5,

        'max_redirect_uri_length' => 2000,

        // https is always allowed. Native/desktop MCP clients also need
        // loopback http and private-use-scheme callbacks.
        'allow_loopback_http' => true,

        'allow_private_use_schemes' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate limits
    |--------------------------------------------------------------------------
    |
    | Wired up as the `mcp` and `mcp-register` named limiters in
    | App\Providers\RouteServiceProvider::configureRateLimiting().
    |
    */

    'rate_limits' => [
        'tool_calls_per_minute' => (int) env('MCP_RATE_LIMIT_PER_MINUTE', 60),
        // Daily hard cap per user (growth-research criterion 3: an agent loop
        // must never burn more than a bounded day's worth of calls).
        'tool_calls_per_day' => (int) env('MCP_RATE_LIMIT_PER_DAY', 2000),
        'registrations_per_hour' => (int) env('MCP_DCR_RATE_LIMIT_PER_HOUR', 10),
    ],

];
