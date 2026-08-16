<?php
/*
 * Copyright (c) 2026 AltumCode (https://altumcode.com/)
 *
 * This software is licensed exclusively by AltumCode and is sold only via https://altumcode.com/.
 * Unauthorized distribution, modification, or use of this software without a valid license is not permitted and may be subject to applicable legal actions.
 *
 * 🌍 View all other existing AltumCode projects via https://altumcode.com/
 * 📧 Get in touch for support or general queries via https://altumcode.com/contact
 * 📤 Download the latest version via https://altumcode.com/downloads
 *
 * 🐦 X/Twitter: https://x.com/AltumCode
 * 📘 Facebook: https://facebook.com/altumcode
 * 📸 Instagram: https://instagram.com/altumcode
 */

namespace Altum\Controllers;

use Altum\Cache;
use Altum\Models\Domain;
use Firebase\JWT\JWT;

defined('ALTUMCODE') || die();

class Index extends Controller {

    public function index() {

        /* PodLink: this Biolink install (podlink.fm) only exists to serve public
         * /{username} bio pages and short links for the real product at podlink.ai.
         * The stock Biolink marketing homepage (pricing, testimonials, "3+ creators", etc.)
         * describes the wrong product and must not be shown at the root path.
         *
         * This check only ever runs from the Index controller, which the router only
         * dispatches to when the request has NO path segments (or the literal "/index").
         * It is never reached for /{username} lookups, which resolve to a completely
         * separate controller (Altum\Controllers\Link under the "l" path) before this
         * class is even loaded - see Altum\Router::parse_controller(). So this cannot
         * shadow bio link pages.
         *
         * IMPORTANT - what "reversible" actually means here: the Railway service
         * (biolink-public) currently only carries DATABASE_* + SITE_URL. Neither
         * HOMEPAGE_REDIRECT_URL nor HOMEPAGE_REDIRECT_DISABLED exists there yet, and
         * setting/changing a Railway variable triggers a redeploy of the service - so
         * "reversible via env var" still costs a redeploy, it just doesn't require a
         * code change/PR. There is no truly zero-deploy kill switch today.
         *
         * The disable flag is a separate, explicit-truthy variable (not an empty
         * string) on purpose: an empty string is what IaC/UI tooling routinely
         * strips or normalizes away, which would silently re-enable the redirect.
         * Set HOMEPAGE_REDIRECT_DISABLED=1 to turn this off. HOMEPAGE_REDIRECT_URL
         * only controls the destination and defaults to https://podlink.ai.
         *
         * Host guard: only redirects when the request Host matches SITE_URL's host.
         * docker-compose passes no env at all (see docker-compose.yml), so SITE_URL
         * is whatever is in the locally bind-mounted config.php - blank in the
         * committed template - which this guard will never match against a real
         * Host header. Without this guard, a local docker-compose boot would 301
         * straight to production podlink.ai using the default destination. Custom
         * creator domains never reach this controller in the first place (they're
         * routed to Altum\Controllers\Link under path "l" - see the domain lookup in
         * Router::parse_controller()), so this guard has no effect on them either way.
         *
         * Shipping as a 302 first: a 301 gets cached by browsers essentially
         * permanently, and combined with the redeploy-only rollback above, would
         * make this very hard to walk back for anyone who already hit it. Promote
         * to 301 by flipping $homepage_redirect_status below once this has run
         * clean for ~2 weeks.
         *
         * Query string is preserved (podlink.fm/?utm_source=... keeps its
         * attribution params on the podlink.ai side) - the root path carries real
         * marketing traffic, so this was worth the extra line. */
        $homepage_redirect_disabled = in_array(strtolower((string) getenv('HOMEPAGE_REDIRECT_DISABLED')), ['1', 'true', 'yes'], true);

        $homepage_redirect_url = getenv('HOMEPAGE_REDIRECT_URL');
        if($homepage_redirect_url === false) {
            $homepage_redirect_url = 'https://podlink.ai';
        }

        /* A blank SITE_URL means an unconfigured install - that is the committed
         * config.php template, i.e. a local `docker-compose up`, which passes no env.
         * Never redirect there, or local dev bounces straight to production podlink.ai.
         *
         * Deliberately NOT comparing the request Host to the SITE_URL host: this service
         * is also reachable on biolink-public-production.up.railway.app, and an equality
         * test would let that host fall through and serve the stock Biolink marketing
         * homepage - the exact page this redirect exists to suppress. Every host Railway
         * routes here should redirect. */
        $site_host = strtolower((string) parse_url(SITE_URL, PHP_URL_HOST));
        $is_production_host = (bool) $site_host;

        if(!$homepage_redirect_disabled && !empty($homepage_redirect_url) && $is_production_host) {
            /* TODO(~2 weeks after ship): change 302 to 301 once confirmed stable. */
            $homepage_redirect_status = 302;

            $homepage_redirect_target = $homepage_redirect_url;

            /* Forward the visitor's own query string so ?utm_source= attribution
             * survives the hop - but strip "altum", which is not the visitor's:
             * it is the internal rewrite param .htaccess uses to carry the path
             * (see Router::parse_url). Leaking it produced podlink.ai?altum=blog. */
            $forwarded_query = '';
            if(!empty($_SERVER['QUERY_STRING'])) {
                parse_str($_SERVER['QUERY_STRING'], $forwarded_params);
                unset($forwarded_params['altum']);
                $forwarded_query = http_build_query($forwarded_params);
            }

            if($forwarded_query !== '') {
                $homepage_redirect_target .= (str_contains($homepage_redirect_target, '?') ? '&' : '?') . $forwarded_query;
            }

            header('Location: ' . $homepage_redirect_target, true, $homepage_redirect_status);
            die();
        }

        /* Custom index redirect if set */
        if(!empty(settings()->main->index_url)) {
            header('Location: ' . settings()->main->index_url); die();
        }

        /* Opengraph image */
        if(settings()->main->opengraph) {
            \Altum\Meta::set_social_image(\Altum\Uploads::get_full_url('opengraph') . settings()->main->opengraph);
        }

        /* Canonical */
        \Altum\Meta::set_canonical_url(url());

        /* Fix on /index to / */
        \Altum\Router::$original_request = '';

        /* Plans View */
        $view = new \Altum\View('partials/plans', (array) $this);
        $this->add_view_content('plans', $view->run());

        /* Check if the cache exists */
        $cache_instance = cache()->getItem('index_stats');

        /* Set cache if not existing */
        if(!$cache_instance->isHit()) {

            $total_users = database()->query("SELECT MAX(`user_id`) AS `total` FROM `users`")->fetch_object()->total ?? 0;
            $total_links = database()->query("SELECT MAX(`link_id`) AS `total` FROM `links`")->fetch_object()->total ?? 0;
            $total_qr_codes = database()->query("SELECT MAX(`qr_code_id`) AS `total` FROM `qr_codes`")->fetch_object()->total ?? 0;
            $total_track_links = database()->query("SELECT MAX(`id`) AS `total` FROM `track_links`")->fetch_object()->total ?? 0;

            $stats = [
                'total_users' => $total_users,
                'total_links' => $total_links,
                'total_qr_codes' => $total_qr_codes,
                'total_track_links' => $total_track_links,
                'total_documents' => $total_documents ?? null,
                'total_images' => $total_images ?? null,
                'images' => $images ?? [],
            ];

            /* Save to cache */
            cache()->save($cache_instance->set($stats)->expiresAfter(3600));

        } else {

            /* Get cache */
            $stats = $cache_instance->get();
            extract($stats);

        }

        if(settings()->main->display_index_latest_blog_posts) {
            $language = \Altum\Language::$name;

            /* Blog posts query */
            $blog_posts_result_query = "
                SELECT * 
                FROM `blog_posts`
                WHERE (`language` = '{$language}' OR `language` IS NULL) AND `is_published` = 1 
                ORDER BY `blog_post_id` DESC
                LIMIT 3
            ";

            $blog_posts = \Altum\Cache::cache_function_result('blog_posts?hash=' . md5($blog_posts_result_query), 'blog_posts', function() use ($blog_posts_result_query) {
                $blog_posts_result = database()->query($blog_posts_result_query);

                /* Iterate over the blog posts */
                $blog_posts = [];

                while($row = $blog_posts_result->fetch_object()) {
                    /* Transform content if needed */
                    $row->content = json_decode($row->content) ? convert_editorjs_json_to_html($row->content) : output_blog_post_content($row->content);

                    $blog_posts[] = $row;
                }

                return $blog_posts;
            });
        }

        $tools_categories = require APP_PATH . 'includes/tools/categories.php';
        $enabled_tools = count(array_filter((array) settings()->tools->available_tools));

        /* Get the available domains to use */
        $domains = (new Domain())->get_available_additional_domains();

        /* Main View */
        $view = new \Altum\View('index/index', (array) $this);
        $this->add_view_content('content', $view->run([
            'total_users' => $total_users,
            'total_links' => $total_links,
            'total_qr_codes' => $total_qr_codes,
            'total_track_links' => $total_track_links,
            'total_documents' => $total_documents ?? null,
            'total_images' => $total_images ?? null,
            'images' => $images ?? null,
            'blog_posts' => $blog_posts ?? [],
            'tools_categories' => $tools_categories,
            'enabled_tools' => $enabled_tools,
            'domains' => $domains,
        ]));

    }

}
