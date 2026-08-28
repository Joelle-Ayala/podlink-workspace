<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domains\Marketplace\Http\Middleware\NewExtensionInstalled;
use App\Http\Middleware\ViewSharedMiddleware;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/dashboard';

    public function boot(): void
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Podlink MCP server (ML2.5) — OAuth 2.1 discovery + Dynamic Client
            // Registration. Registered under the `api` group *before* web.php so
            // the machine-consumed JSON endpoints never pick up CSRF, session,
            // LocaleMiddleware or ThemeMiddleware. See MCP-P0-AUDIT.md Q5.
            // NOTE: the /mcp transport endpoint itself is registered by
            // php-mcp/laravel from config/mcp.php, not from this file.
            Route::middleware('api')
                ->group(base_path('routes/ai.php'));

            Route::middleware([
                'web',  ViewSharedMiddleware::class, NewExtensionInstalled::class,
            ])->group(base_path('routes/web.php'));
        });
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', static function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // ---- Podlink MCP server (ML2.5) ------------------------------------
        // Per-user throttle for MCP tool traffic. An agent loop can fire tool
        // calls far faster than a human; this is the R2 mitigation. Applied via
        // `throttle:mcp` in config/mcp.php -> transports.http_integrated.middleware.
        RateLimiter::for('mcp', static function (Request $request) {
            $guard = (string) config('mcp_oauth.guard', 'api');
            $identifier = $request->user($guard)?->getAuthIdentifier();
            $key = $identifier ? 'mcp-user:' . $identifier : 'mcp-ip:' . $request->ip();

            // Burst limit + daily hard cap (growth-research criterion 3):
            // the per-minute limit bounds agent-loop burn rate, the per-day
            // cap bounds total daily exposure per account. Both 429 with
            // Retry-After, which MCP clients handle as a normal tool error.
            return [
                Limit::perMinute((int) config('mcp_oauth.rate_limits.tool_calls_per_minute', 60))->by($key),
                Limit::perDay((int) config('mcp_oauth.rate_limits.tool_calls_per_day', 2000))->by('daily:' . $key),
            ];
        });

        // Dynamic Client Registration is an unauthenticated, world-writable
        // endpoint by design (RFC 7591). Keep it on a tight per-IP budget.
        RateLimiter::for('mcp-register', static function (Request $request) {
            return Limit::perHour((int) config('mcp_oauth.rate_limits.registrations_per_hour', 10))
                ->by('mcp-dcr:' . $request->ip());
        });
    }
}
