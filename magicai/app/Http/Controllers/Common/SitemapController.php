<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;
use Throwable;

class SitemapController extends Controller
{
    /**
     * Change-frequency strings accepted in config('marketing.sitemap'),
     * mapped explicitly so a typo in config can never emit an invalid
     * <changefreq> value into the XML.
     */
    private const FREQUENCIES = [
        'always'  => Url::CHANGE_FREQUENCY_ALWAYS,
        'hourly'  => Url::CHANGE_FREQUENCY_HOURLY,
        'daily'   => Url::CHANGE_FREQUENCY_DAILY,
        'weekly'  => Url::CHANGE_FREQUENCY_WEEKLY,
        'monthly' => Url::CHANGE_FREQUENCY_MONTHLY,
        'yearly'  => Url::CHANGE_FREQUENCY_YEARLY,
        'never'   => Url::CHANGE_FREQUENCY_NEVER,
    ];

    public function index()
    {
        $sitemap = $this->crawl();

        $this->addStaticRoutes($sitemap);

        $sitemap->writeToFile(public_path('sitemap.xml'));

        // add sitemap.xml to the robots.txt file
        $robots = public_path('robots.txt');
        $robot = file_get_contents($robots);
        if (strpos($robot, 'sitemap.xml') === false) {
            $robot .= "\nSitemap: " . url('sitemap.xml');
            file_put_contents($robots, $robot);
        } else {
            $robot = str_replace('Sitemap: ' . url('sitemap.xml'), '', $robot);
            $robot .= "\nSitemap: " . url('sitemap.xml');
            file_put_contents($robots, $robot);
        }

        return response()->file(public_path('sitemap.xml'));
    }

    /**
     * Crawl the site for linked pages.
     *
     * The crawler makes live HTTP requests back into this same app. On the
     * Railway container (Apache prefork, small worker pool) that can time out
     * or starve, and previously any failure here took the whole /sitemap.xml
     * response down with it. A failed crawl now degrades to an empty sitemap
     * that addStaticRoutes() still populates, so the marketing pages are
     * always listed even when crawling is unavailable.
     */
    protected function crawl(): Sitemap
    {
        try {
            return SitemapGenerator::create(config('app.url'))->getSitemap();
        } catch (Throwable $e) {
            Log::warning('[sitemap] crawl failed, falling back to static routes only: ' . $e->getMessage());

            return Sitemap::create();
        }
    }

    /**
     * Merge the statically declared routes from config('marketing.sitemap').
     *
     * WHY THIS EXISTS: the crawler only finds pages that are LINKED from the
     * homepage. The marketing pages (/features, /pricing) hang off a
     * DB-driven nav (Setting::menu_options, edited in the admin panel), so
     * until a human adds those menu rows the crawler cannot see them and they
     * never reach sitemap.xml. Listing them here decouples indexability from
     * the nav. Adding a future marketing page is one line of config.
     */
    protected function addStaticRoutes(Sitemap $sitemap): void
    {
        $routes = config('marketing.sitemap', []);

        if (! is_array($routes)) {
            return;
        }

        foreach ($routes as $route) {
            $path = is_array($route) ? ($route['path'] ?? null) : $route;

            if (! is_string($path) || $path === '') {
                continue;
            }

            // A page still flagged draft renders <meta robots="noindex">, so
            // listing it here would only earn a Search Console warning.
            $draftFlag = is_array($route) ? ($route['draft_flag'] ?? null) : null;

            if (is_string($draftFlag) && config($draftFlag)) {
                continue;
            }

            $path = '/' . ltrim($path, '/');

            // The crawler stores URLs path-relative, so dedupe on the path.
            // hasUrl() has been on Spatie\Sitemap\Sitemap for many major
            // versions, but the call is guarded: vendor/ is committed and
            // pinned here, and an unguarded call would be an upgrade landmine.
            if (method_exists($sitemap, 'hasUrl') && $sitemap->hasUrl($path)) {
                continue;
            }

            $frequency = is_array($route) ? ($route['frequency'] ?? 'monthly') : 'monthly';
            $priority = is_array($route) ? ($route['priority'] ?? 0.8) : 0.8;

            $sitemap->add(
                Url::create($path)
                    ->setPriority((float) $priority)
                    ->setChangeFrequency(self::FREQUENCIES[$frequency] ?? Url::CHANGE_FREQUENCY_MONTHLY)
            );
        }
    }
}
