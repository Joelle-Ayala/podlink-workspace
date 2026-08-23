<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| php-mcp/laravel configuration — Podlink MCP server (ML2.5)
|--------------------------------------------------------------------------
|
| ✅ RECONCILED 2026-08-23 against the INSTALLED php-mcp/laravel v4.0.0
| (vendor/php-mcp/laravel/config/mcp.php + src/McpServiceProvider.php).
|
| The key fact that drove this pass: McpServiceProvider::register() calls
| mergeConfigFrom(), and Laravel's mergeConfigFrom is a SHALLOW array_merge at
| the TOP LEVEL ONLY. Every top-level key defined here (server, discovery,
| cache, transports, session, pagination_limit, capabilities, logging) REPLACES
| the package's default wholesale — nested keys are NOT backfilled. So any
| sub-key the package reads must either be present here or degrade safely.
|
| Audited, one by one:
|   * cache.store / session.store / logging.channel = null -> Laravel's
|     CacheManager::store(null) and LogManager::channel(null) both fall back to
|     the configured default. SAFE.
|   * transports.http_integrated.{sse_poll_interval, cors_origin, event_store}
|     and capabilities.experimental were ABSENT; the package reads them with a
|     config() default, so they resolved correctly — but they are now written
|     out explicitly below so a future package change cannot surprise us.
|
| Verified against vendor source, not docs:
|   * enable_json_response IS honoured — StreamableHttpServerTransport.php:150
|     branches on it, so Apache/mod_php never holds an SSE stream open.
|   * stateless=true makes GET /mcp return 405 and each POST self-contained.
|   * Mcp::tool(Class)->name()->description()->inputSchema() matches
|     Blueprints\ToolBlueprint exactly.
|   * A class-string handler resolves via HandlerResolver to __invoke() and is
|     instantiated through the Laravel container, so constructor DI works.
|
| Podlink-specific values that must survive any reconcile:
|   * transports.http_integrated.enabled          = true
|   * transports.http_integrated.route_prefix     = 'mcp'
|   * transports.http_integrated.middleware       = api group + MCP auth + throttle
|   * *.enable_json_response                      = true   (Apache/mod_php, no SSE)
|   * transports.http_dedicated.enabled           = false  (no second process on Railway)
|   * discovery.auto_discover                     = false  (tools are registered
|                                                           explicitly in routes/mcp.php)
|
| HARD RULE: never `config:cache` this app (igaster theme engine — see
| docker-entrypoint.sh). Nothing here requires it.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Server identity
    |--------------------------------------------------------------------------
    |
    | Shown to MCP clients during `initialize`, and on the consent screen.
    | Canonical brand casing is "Podlink" (MCP-SERVER-SCOPING.md O5).
    |
    */

    'server' => [
        'name' => (string) env('MCP_SERVER_NAME', 'Podlink'),
        'version' => (string) env('MCP_SERVER_VERSION', '1.0.0'),
        'instructions' => 'Podcast analytics for the signed-in Podlink account. '
            . 'All tools are read-only and scoped to the authenticated user; '
            . 'they never accept a user id, email, handle or show uuid.',
    ],

    /*
    |--------------------------------------------------------------------------
    | Capabilities
    |--------------------------------------------------------------------------
    |
    | v1 is tools-only and read-only. Resources/prompts stay off until there is
    | a reason to turn them on — smaller surface, smaller blast radius (R5).
    |
    */

    'capabilities' => [
        'tools' => true,
        'toolsListChanged' => false,

        'resources' => false,
        'resourcesSubscribe' => false,
        'resourcesListChanged' => false,

        'prompts' => false,
        'promptsListChanged' => false,

        'logging' => false,
        'completions' => false,

        // Package default is null; set explicitly (see the mergeConfigFrom
        // note in the header — nested keys are never backfilled).
        'experimental' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | Element discovery
    |--------------------------------------------------------------------------
    |
    | Attribute scanning is switched OFF on purpose:
    |
    |  * MagicAI is a large vendor codebase; scanning app/ on boot is wasted
    |    work on every Apache request and risks reflecting over vendor-ish code.
    |  * Explicit registration in routes/mcp.php keeps the whole tool surface
    |    readable in one file — which matters when the review criterion is
    |    "prove no tool leaks another tenant's data" (R1).
    |
    | If discovery is ever re-enabled, keep `directories` pinned to app/Mcp.
    |
    */

    'discovery' => [
        'auto_discover' => false,
        'base_path' => base_path(),
        'directories' => ['app/Mcp'],
        'exclude_dirs' => ['vendor', 'node_modules', 'storage', 'bootstrap/cache', 'themes'],
        'definitions_file' => base_path('routes/mcp.php'),
        'save_to_cache' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Sessions
    |--------------------------------------------------------------------------
    |
    | Cache-backed so nothing is written to the ephemeral Railway filesystem.
    | The HTTP transport below runs stateless where the package supports it, so
    | this is mostly a fallback.
    |
    */

    'session' => [
        'driver' => (string) env('MCP_SESSION_DRIVER', 'cache'),
        'ttl' => (int) env('MCP_SESSION_TTL', 3600),
        'store' => env('MCP_SESSION_STORE'), // null => config('cache.default')
        'lottery' => [2, 100],
    ],

    /*
    |--------------------------------------------------------------------------
    | Transports
    |--------------------------------------------------------------------------
    */

    'transports' => [

        // Not used in production. Kept enabled so `php artisan mcp:serve
        // --transport=stdio` stays available for local debugging.
        'stdio' => [
            'enabled' => true,
        ],

        /*
        | Integrated HTTP — the production transport.
        |
        | Registers POST/GET/DELETE /mcp on the app's own router. Middleware is
        | the app's `api` group (throttle:api + SubstituteBindings — NO CSRF,
        | NO LocaleMiddleware, NO ThemeMiddleware), then our bearer-token gate,
        | then the per-user MCP throttle. See MCP-P0-AUDIT.md Q5.
        |
        | enable_json_response = true is a hard requirement here: production is
        | Apache + mod_php (mpm_prefork), where a persistent SSE stream pins one
        | worker per connection. JSON mode keeps every call a short-lived
        | request/response. See MCP-P0-AUDIT.md Q3.
        */
        'http_integrated' => [
            'enabled' => true,
            'route_prefix' => 'mcp',
            'middleware' => [
                'api',
                \App\Http\Middleware\Mcp\AuthenticateMcpRequest::class,
                'throttle:mcp',
            ],
            'domain' => env('MCP_HTTP_DOMAIN'),
            'legacy' => false,
            'stateless' => (bool) env('MCP_HTTP_STATELESS', true),
            'enable_json_response' => true,

            // Read by StreamableHttpServerTransport. Written out explicitly
            // because mergeConfigFrom does not backfill nested keys.
            //  * event_store: null -> no resumability store (we are stateless).
            //  * cors_origin: '*' is the package default. The bearer token, not
            //    the browser origin, is what protects /mcp; MCP clients are not
            //    browsers and send no cookies (the `api` group has no session).
            //  * sse_poll_interval: only used by GET /mcp, which returns 405
            //    while stateless=true. Kept for completeness.
            'event_store' => null,
            'cors_origin' => env('MCP_HTTP_CORS_ORIGIN', '*'),
            'sse_poll_interval' => 1,
        ],

        /*
        | Dedicated ReactPHP server — OFF.
        |
        | Railway runs one Apache container for this service; a second
        | long-lived process would need its own service/process manager, and
        | the Railway custom-domain limit is already hit. Revisit only if JSON
        | mode under Apache proves insufficient.
        */
        'http_dedicated' => [
            'enabled' => false,
            'host' => '127.0.0.1',
            'port' => 8090,
            'path_prefix' => 'mcp',
            'legacy' => false,
            'stateless' => true,
            'enable_json_response' => true,
            'event_store' => null,
            'ssl_context_options' => [],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache
    |--------------------------------------------------------------------------
    */

    'cache' => [
        'store' => env('MCP_CACHE_STORE'), // null => config('cache.default')
        'prefix' => 'mcp_',
        'ttl' => 3600,
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    |
    | Left on the default stack channel deliberately: adding a dedicated `mcp`
    | channel would mean editing config/logging.php, which is outside this
    | changeset's blast radius. Add it in P1 if the logs get noisy.
    |
    */

    'logging' => [
        'channel' => env('MCP_LOG_CHANNEL'), // null => default stack
        'level' => (string) env('MCP_LOG_LEVEL', 'info'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    'pagination_limit' => 50,

];
