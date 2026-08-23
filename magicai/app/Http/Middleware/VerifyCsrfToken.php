<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    use ChatbotCsrf;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // '*',
        'pdf/getContent',
        'stripe/*',
        'webhooks/*',
        'dashboard/*',
        'dashboard/user/payment/iyzico/*',
        'chatbot/*',
        'generator/webhook/fal-ai',
        'dashboard/admin/config/more',
        'translations/lang/update-all',
        'social-media/*',
        'chatbot/instagram/*',

        // ---- Podlink MCP server (ML2.5) ------------------------------------
        // Defense-in-depth: these endpoints are already registered under the
        // `api` middleware group (routes/ai.php + config/mcp.php), which does
        // not include VerifyCsrfToken. They are listed here so that a future
        // accidental move into the `web` group cannot silently 419 every
        // JSON-RPC / discovery / DCR call. See MCP-P0-AUDIT.md Q5.
        // NOTE: only 'oauth/register' is excluded — /oauth/authorize's consent
        // POST must keep its CSRF protection.
        'mcp',
        'mcp/*',
        '.well-known/*',
        'oauth/register',
    ];
}
