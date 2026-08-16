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

use Altum\Language;
use Altum\Meta;
use Altum\Models\BlogPosts;
use Altum\Models\BlogPostsCategories;
use Altum\Response;
use Altum\Title;

defined('ALTUMCODE') || die();

class Blog extends Controller {

    public function index() {

        /* PodLink: the stock Biolink blog is generic "link-in-bio SaaS" marketing
         * content unrelated to podlink.ai. It has no transactional data or user
         * accounts behind it (unlike /plan, /directory, /contact, /affiliate,
         * /chrome-extension, which were deliberately left untouched - see the
         * redirect-engineering report), so redirecting the blog INDEX is low risk.
         *
         * CORRECTION (this used to claim the whole Blog controller was reachable
         * only via the literal "blog" path - that is not the same as saying only
         * ONE URL shape lands here). Router::parse_controller() dispatches every
         * request under the reserved "blog" segment to THIS controller's index()
         * method - Router::parse_method() only peels a leading param off into a
         * distinct method when a PUBLIC method of that name exists on the class,
         * and Blog's only other public method is ratings_ajax(). So /blog,
         * /blog/{post-slug}, /blog/category/{slug} and /blog/feed all execute this
         * same index() body; params[0]/params[1] are branched on further down
         * (feed / category / post-slug / index-listing). Redirecting unconditionally
         * here would have swallowed real posts, categories and the RSS feed too -
         * not just the marketing listing page. Gated below to fire only when there
         * is no first param, i.e. only the bare /blog index.
         *
         * app/controllers/Sitemap.php (~lines 72, 115-124) still writes blog,
         * blog/{post} and blog/category/{slug} URLs into sitemap.xml. Those are
         * deliberately left alone here - they still resolve to real content (posts/
         * categories keep rendering, unaffected by this gate), so nothing currently
         * turns those sitemap entries into soft-404s. If a decision is later made to
         * take down the blog entirely, Sitemap.php needs a matching change or Google
         * gets handed a sitemap of URLs that all redirect off-domain.
         *
         * This can never shadow /{username} bio pages either way - they resolve to
         * a completely different controller (Altum\Controllers\Link under path "l")
         * before Blog::index() is ever reached.
         *
         * IMPORTANT - what "reversible" actually means here: the Railway service
         * (biolink-public) currently only carries DATABASE_* + SITE_URL. Neither
         * BLOG_REDIRECT_URL nor BLOG_REDIRECT_DISABLED exists there yet, and
         * setting/changing a Railway variable triggers a redeploy of the service -
         * so "reversible via env var" still costs a redeploy, it just doesn't
         * require a code change/PR. There is no truly zero-deploy kill switch today.
         *
         * The disable flag is a separate, explicit-truthy variable (not an empty
         * string) on purpose - see Index.php for the same reasoning. Set
         * BLOG_REDIRECT_DISABLED=1 to turn this off. BLOG_REDIRECT_URL only
         * controls the destination and defaults to https://podlink.ai.
         *
         * Host guard: only redirects when the request Host matches SITE_URL's host,
         * so a local docker-compose boot (no env passed at all, see
         * docker-compose.yml) does not 301 to production podlink.ai - see Index.php
         * for the full explanation.
         *
         * Shipping as a 302 first, same rationale as Index.php: a 301 is
         * effectively permanent in the browser cache, and rollback here is
         * redeploy-only, so a 301 on day one would be very hard to walk back.
         * Promote to 301 by flipping $blog_redirect_status below after ~2 weeks
         * clean.
         *
         * Query string is preserved for consistency with the homepage redirect
         * (e.g. /blog?utm_source=... keeps its attribution params). */
        $blog_redirect_disabled = in_array(strtolower((string) getenv('BLOG_REDIRECT_DISABLED')), ['1', 'true', 'yes'], true);

        $blog_redirect_url = getenv('BLOG_REDIRECT_URL');
        if($blog_redirect_url === false) {
            $blog_redirect_url = 'https://podlink.ai';
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

        /* Only the bare /blog index - NOT /blog/{post}, /blog/category/{slug}, or
         * /blog/feed, all of which also flow through this same method (see above). */
        if(!$blog_redirect_disabled && !empty($blog_redirect_url) && $is_production_host && empty($this->params[0])) {
            /* TODO(~2 weeks after ship): change 302 to 301 once confirmed stable. */
            $blog_redirect_status = 302;

            $blog_redirect_target = $blog_redirect_url;
            if(!empty($_SERVER['QUERY_STRING'])) {
                $blog_redirect_target .= (str_contains($blog_redirect_target, '?') ? '&' : '?') . $_SERVER['QUERY_STRING'];
            }

            header('Location: ' . $blog_redirect_target, true, $blog_redirect_status);
            die();
        }

        if(!settings()->content->blog_is_enabled) {
            throw_404();
        }

        $language = Language::$name;

        /* Blog RSS */
        if(isset($this->params[0]) && $this->params[0] == 'feed') {
            /* Set the header as xml so the browser can read it properly */
            header('Content-Type: text/xml');
            header('X-Robots-Tag: noindex');

            $blog_posts = db()->where('is_published', 1)->get('blog_posts', null, ['blog_post_id', 'title', 'description', 'url', 'language', 'datetime']);

            /* Prepare the view */
            $data = [
                'blog_posts' => $blog_posts
            ];

            $view = new \Altum\View('blog/blog_rss', (array) $this);

            echo $view->run($data);

            die();
        }

        /* Blog post */
        if(isset($this->params[0]) && $this->params[0] != 'category') {
            $url = query_clean($this->params[0]);

            $blog_post_query = "
                SELECT * 
                FROM `blog_posts`
                WHERE ((`url` = '{$url}' AND `language` = '{$language}') OR (`url` = '{$url}' AND `language` IS NULL)) AND `is_published` = 1
            ";
            $blog_post = \Altum\Cache::cache_function_result('blog_post?hash=' . md5($blog_post_query), ['blog_posts', 'blog_post_' . md5($url)], function() use ($blog_post_query) {
                return database()->query($blog_post_query)->fetch_object() ?? null;
            });

            if(!$blog_post) {
                throw_404();
            }

            /* Transform content if needed */
            $blog_post->content = json_decode($blog_post->content) ? convert_editorjs_json_to_html($blog_post->content) : output_blog_post_content($blog_post->content);

            /* Get the blog post category */
            $blog_posts_category = \Altum\Cache::cache_function_result('blog_posts_category?hash=' . md5($blog_post->blog_posts_category_id ?? ''), 'blog_posts_categories', function() use ($blog_post) {
                return $blog_post->blog_posts_category_id ? db()->where('blog_posts_category_id', $blog_post->blog_posts_category_id)->getOne('blog_posts_categories') : null;
            });

            /* Add a new view to the post */
            $cookie_name = 'blog_post_view_' . $blog_post->blog_post_id;
            if(!isset($_COOKIE[$cookie_name])) {
                db()->where('blog_post_id', $blog_post->blog_post_id)->update('blog_posts', ['total_views' => db()->inc()]);
                setcookie($cookie_name, (int) true, time()+60*60*24*1);
            }

            /* Set a custom title */
            Title::set(sprintf(l('blog.blog_post.title'), $blog_post->title));

            /* Meta */
            Meta::set_description($blog_post->description);
            Meta::set_keywords($blog_post->keywords);
            if($blog_post->image) {
                Meta::set_social_image(\Altum\Uploads::get_full_url('blog') . $blog_post->image);
            }

            /* Disable automated link language alternate */
            Meta::set_link_alternate(false);

            /* Get all the categories */
            $blog_posts_categories = settings()->content->blog_categories_widget_is_enabled ? (new BlogPostsCategories())->get_blog_posts_categories_by_language($language) : [];

            /* Get popular posts */
            $blog_posts_popular = settings()->content->blog_popular_widget_is_enabled ? (new BlogPosts())->get_popular_blog_posts_by_language($language) : [];

            /* Prepare the view */
            $data = [
                'blog_post' => $blog_post,
                'blog_posts_category' => $blog_posts_category,
                'blog_posts_categories' => $blog_posts_categories,
                'blog_posts_popular' => $blog_posts_popular,
            ];

            $view = new \Altum\View('blog/blog_post', (array) $this);

            $this->add_view_content('content', $view->run($data));
        }

        /* Blog category */
        else if(isset($this->params[0], $this->params[1]) && $this->params[0] == 'category') {
            $url = query_clean($this->params[1]);

            $blog_posts_category_query = "
                SELECT * 
                FROM `blog_posts_categories`
                WHERE (`url` = '{$url}' AND `language` = '{$language}') OR (`url` = '{$url}' AND `language` IS NULL)
                ORDER BY `language` DESC
            ";
            $blog_posts_category = \Altum\Cache::cache_function_result('blog_posts_category?hash=' . md5($blog_posts_category_query), 'blog_posts_categories', function() use ($blog_posts_category_query) {
                return database()->query($blog_posts_category_query)->fetch_object() ?? null;
            });

            if(!$blog_posts_category) {
                throw_404();
            }

            /* Get the posts */
            /* Prepare the filtering system */
            $filters = (new \Altum\Filters());
            $filters->set_default_order_by('datetime', $this->user->preferences->default_order_type ?? settings()->main->default_order_type);
            $filters->set_default_results_per_page($this->user->preferences->default_results_per_page ?? settings()->main->default_results_per_page);

            /* Prepare the paginator */
            $total_rows_query = "SELECT COUNT(*) AS `total` FROM `blog_posts` WHERE `blog_posts_category_id` = {$blog_posts_category->blog_posts_category_id} AND (`language` = '{$language}' OR `language` IS NULL) AND `is_published` = 1 {$filters->get_sql_where()}";
            $total_rows = \Altum\Cache::cache_function_result('blog_posts_count?hash=' . md5($total_rows_query), 'blog_posts', function() use ($total_rows_query) {
                return database()->query($total_rows_query)->fetch_object()->total ?? 0;
            });
            $paginator = (new \Altum\Paginator($total_rows, $filters->get_results_per_page(), $_GET['page'] ?? 1, url('blog/category/' . $blog_posts_category->url . '?' . $filters->get_get() . '&page={{PAGE}}')));

            /* Blog posts query */
            $blog_posts_result_query = "
                SELECT * 
                FROM `blog_posts`
                WHERE `blog_posts_category_id` = {$blog_posts_category->blog_posts_category_id} AND (`language` = '{$language}' OR `language` IS NULL) AND `is_published` = 1 {$filters->get_sql_where()}
                {$filters->get_sql_order_by()}
                {$paginator->get_sql_limit()}
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

            /* Prepare the pagination view */
            $pagination = (new \Altum\View('partials/pagination', (array) $this))->run(['paginator' => $paginator]);

            /* Get all the categories */
            $blog_posts_categories = settings()->content->blog_categories_widget_is_enabled ? (new BlogPostsCategories())->get_blog_posts_categories_by_language($language) : [];

            /* Get popular posts */
            $blog_posts_popular = settings()->content->blog_popular_widget_is_enabled ? (new BlogPosts())->get_popular_blog_posts_by_language($language) : [];

            /* Set a custom title */
            Title::set(sprintf(l('blog.blog_posts_category.title'), $blog_posts_category->title));

            /* Meta */
            Meta::set_description($blog_posts_category->description);

            /* Disable automated link language alternate */
            Meta::set_link_alternate(false);

            /* Prepare the view */
            $data = [
                'blog_posts_category' => $blog_posts_category,
                'blog_posts' => $blog_posts,
                'pagination' => $pagination,
                'blog_posts_categories' => $blog_posts_categories,
                'blog_posts_popular' => $blog_posts_popular,
            ];

            $view = new \Altum\View('blog/blog_posts_category', (array) $this);

            $this->add_view_content('content', $view->run($data));
        }

        /* Blog index */
        else {

            /* Get the posts */
            /* Prepare the filtering system */
            $filters = (new \Altum\Filters([], ['title']));
            $filters->set_default_order_by('datetime', $this->user->preferences->default_order_type ?? settings()->main->default_order_type);
            $filters->set_default_results_per_page($this->user->preferences->default_results_per_page ?? settings()->main->default_results_per_page);

            /* Prepare the paginator */
            $total_rows_query = "SELECT COUNT(*) AS `total` FROM `blog_posts` WHERE (`language` = '{$language}' OR `language` IS NULL) AND `is_published` = 1 {$filters->get_sql_where()}";
            $total_rows = \Altum\Cache::cache_function_result('blog_posts_count?hash=' . md5($total_rows_query), 'blog_posts', function() use ($total_rows_query) {
                return database()->query($total_rows_query)->fetch_object()->total ?? 0;
            });
            $paginator = (new \Altum\Paginator($total_rows, $filters->get_results_per_page(), $_GET['page'] ?? 1, url('blog?' . $filters->get_get() . '&page={{PAGE}}')));

            /* Blog posts query */
            $blog_posts_result_query = "
                SELECT * 
                FROM `blog_posts`
                WHERE (`language` = '{$language}' OR `language` IS NULL) AND `is_published` = 1 {$filters->get_sql_where()}
                {$filters->get_sql_order_by()}
                {$paginator->get_sql_limit()}
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

            /* Prepare the pagination view */
            $pagination = (new \Altum\View('partials/pagination', (array) $this))->run(['paginator' => $paginator]);

            /* Get all the categories */
            $blog_posts_categories = settings()->content->blog_categories_widget_is_enabled ? (new BlogPostsCategories())->get_blog_posts_categories_by_language($language) : [];

            /* Get popular posts */
            $blog_posts_popular = settings()->content->blog_popular_widget_is_enabled ? (new BlogPosts())->get_popular_blog_posts_by_language($language) : [];

            if(!empty($_GET['search'])) {
                /* Set a custom title */
                Title::set(sprintf(l('blog.title_search'), input_clean($_GET['search'])));

                /* Meta */
                Meta::set_robots('noindex');
            }

            /* Prepare the view */
            $data = [
                'blog_posts' => $blog_posts,
                'pagination' => $pagination,
                'filters' => $filters,
                'blog_posts_categories' => $blog_posts_categories,
                'blog_posts_popular' => $blog_posts_popular,
            ];

            $view = new \Altum\View('blog/index', (array) $this);

            $this->add_view_content('content', $view->run($data));
        }
    }

    public function ratings_ajax() {

        if(empty($_POST)) {
            throw_404();
        }

        if(!settings()->content->blog_is_enabled || !settings()->content->blog_ratings_is_enabled) {
            throw_404();
        }

        /* Check for any errors */
        $required_fields = ['blog_post_id', 'rating'];
        foreach($required_fields as $field) {
            if(!isset($_POST[$field]) || trim($_POST[$field]) === '') {
                Response::json(l('global.error_message.empty_fields'), 'error');
            }
        }

        if(!\Altum\Csrf::check('global_token')) {
            Response::json(l('global.error_message.invalid_csrf_token'), 'error');
        }

        $blog_post_id = (int) $_POST['blog_post_id'];
        $_POST['rating'] = isset($_POST['rating']) && in_array($_POST['rating'], range(1,5)) ? (int) $_POST['rating'] : 5;

        $ip = get_ip();
        $ip_binary = $ip ? inet_pton($ip) : null;

        /* Make sure the blog post exists */
        if(!$blog_post = db()->where('blog_post_id', $blog_post_id)->getOne('blog_posts', ['blog_post_id', 'url', 'total_ratings', 'average_rating'])) {
            Response::json(l('global.error_message.basic'), 'error');
        }

        /* Check if rating exists for this tool & IP */
        $existing_rating = db()->where('blog_post_id', $blog_post_id)->where('ip_binary', $ip_binary)->getOne('blog_posts_ratings', ['rating']);

        /* Current stats */
        $current_total_score = $blog_post->total_ratings * $blog_post->average_rating;

        /* Update rating */
        if($existing_rating) {
            $old_rating = $existing_rating->rating;
            $difference = $_POST['rating'] - $old_rating;
            $new_total_ratings = $blog_post->total_ratings;
        } else {
            $difference = $_POST['rating'];
            $new_total_ratings = $blog_post->total_ratings + 1;
        }

        $new_total_score = $current_total_score + $difference;
        $new_average_rating = number_format($new_total_score / $new_total_ratings, 2, '.', '');

        /* Update tool usage stats */
        db()->where('blog_post_id', $blog_post_id)->update('blog_posts', [
            'total_ratings' => $new_total_ratings,
            'average_rating' => $new_average_rating
        ]);

        /* Insert or update rating */
        if($existing_rating) {
            db()->where('blog_post_id', $blog_post_id)->where('ip_binary', $ip_binary)->update('blog_posts_ratings', [
                'user_id' => is_logged_in() ? user()->user_id : null,
                'rating' => $_POST['rating'],
                'datetime' => get_date()
            ]);
        } else {
            db()->insert('blog_posts_ratings', [
                'user_id' => is_logged_in() ? user()->user_id : null,
                'blog_post_id' => $blog_post_id,
                'ip_binary' => $ip_binary,
                'rating' => $_POST['rating'],
                'datetime' => get_date()
            ]);
        }

        /* Clear the cache */
        cache()->deleteItemsByTag('blog_post_' . md5($blog_post->url));

        /* Set a nice success message */
        Response::json('', 'success', ['new_total_ratings' => $new_total_ratings, 'new_average_rating' => nr($new_average_rating, 2, false)]);

    }

}
