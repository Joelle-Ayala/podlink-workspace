<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirects legacy Podlink marketing routes away from the app host.
 *
 * app.podlink.ai (and its Railway container host) used to also serve the
 * podlink.ai marketing site. Now that podlink.ai is its own site, anyone
 * still hitting the old marketing paths on the app host should land on the
 * real marketing site — or, for the bare "/", on /login or /dashboard —
 * instead of a stale copy of the landing page.
 *
 * Kill switch: set APP_MARKETING_REDIRECT_DISABLED=1 to disable this
 * middleware entirely (e.g. to temporarily restore the old behaviour)
 * without a deploy that removes it.
 */
class RedirectLegacyMarketing
{
    /**
     * Hosts (or host suffixes) this middleware applies to.
     *
     * @var list<string>
     */
    private const APP_HOSTS = [
        'app.podlink.ai',
        'railway.app',
    ];

    /**
     * Legacy marketing path (no leading/trailing slash) => equivalent path
     * on podlink.ai.
     *
     * Only the routes actually served by routes/web.php + custom_routes_web.php's
     * marketing group as of the 2026-08-19 handoff. Everything else on this
     * host (dashboard, login, register, admin, oauth, mcp, install-extension,
     * api, webhooks, assets/uploads, blog, legal pages, etc.) is left alone.
     *
     * @var array<string, string>
     */
    private const LEGACY_MARKETING_PATHS = [
        'features' => '/features',
        'pricing'  => '/pricing',
    ];

    private const MARKETING_SITE = 'https://podlink.ai';

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->isAppHost($request->getHost())) {
            return $next($request);
        }

        if (env('APP_MARKETING_REDIRECT_DISABLED') == '1') {
            return $next($request);
        }

        if ($request->is('/')) {
            $destination = Auth::check() ? '/dashboard' : '/login';

            return redirect($destination);
        }

        $path = trim($request->path(), '/');

        if (array_key_exists($path, self::LEGACY_MARKETING_PATHS)) {
            return redirect()->away(self::MARKETING_SITE . self::LEGACY_MARKETING_PATHS[$path], 302);
        }

        // Not a legacy marketing route — pass through, but this host is not
        // meant to be indexed (it's the app, not the marketing site).
        $response = $next($request);
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        return $response;
    }

    /**
     * Whether the given host is the app host (or its Railway container host)
     * this middleware guards.
     */
    private function isAppHost(string $host): bool
    {
        foreach (self::APP_HOSTS as $suffix) {
            if ($host === $suffix || str_ends_with($host, '.' . $suffix)) {
                return true;
            }
        }

        return false;
    }
}
