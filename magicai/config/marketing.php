<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Podlink marketing site content
|--------------------------------------------------------------------------
|
| Single source of truth for the hardcoded marketing pages (/features and,
| later, the per-feature detail pages and /pricing). Kept in config — not in
| the database — on purpose:
|
|   * it is versioned and reviewable in git,
|   * it survives a MagicAI script upgrade (the updater replaces app/ and
|     resources/views/default/; it does not ship a config/marketing.php),
|   * no admin toggle is needed for a page to exist.
|
| NOTE: config:cache is deliberately DISABLED for this deployment (see
| docker-entrypoint.sh, "DO NOT config:cache"), so edits here take effect on
| the next request after deploy — no cache clearing step.
|
| Every feature carries a stable `slug`; the detail pages at /features/{slug}
| can be added later without touching the index page.
|
*/

return [

    /*
     * Cache-buster for the hand-written Podlink stylesheets:
     *   public/themes/default/assets/css/frontend/podlink-tokens.css     (global tokens)
     *   public/themes/default/assets/css/frontend/podlink-marketing.css  (.pl-page)
     * Both are served straight from public/ with no content hash (the container
     * runs no asset build), so bump this whenever either file changes.
     */
    'asset_version' => '3',

    /*
    |--------------------------------------------------------------------------
    | Static routes for sitemap.xml
    |--------------------------------------------------------------------------
    |
    | App\Http\Controllers\Common\SitemapController CRAWLS the site
    | (Spatie\Sitemap\SitemapGenerator::create(config('app.url'))), so it only
    | ever discovers pages that are LINKED from the homepage. The marketing
    | pages hang off a DB-driven nav an admin has to populate, so a brand-new
    | page is invisible to the crawler — and absent from sitemap.xml — until
    | that menu row exists.
    |
    | Anything listed here is merged into the sitemap unconditionally, so a new
    | marketing page is one line of config away from being crawlable. The
    | controller dedupes against whatever the crawler already found.
    |
    | Only list paths that ALWAYS return 200 for guests. Deliberately NOT here:
    | /privacy-policy and /terms — PageController aborts 404 on those when the
    | `privacy_enable` setting is off, and a 404 in a sitemap is an own-goal.
    |
    | `draft_flag` is an optional dotted config path. While that flag is truthy
    | the entry is SKIPPED, which keeps the sitemap honest about pages that are
    | still rendering noindex. It exists so there is exactly ONE switch to flip
    | at go-live rather than two that can silently disagree.
    |
    */
    'sitemap' => [
        ['path' => '/', 'priority' => 1.0, 'frequency' => 'weekly'],
        ['path' => '/features', 'priority' => 0.9, 'frequency' => 'monthly'],
        ['path' => '/pricing', 'priority' => 0.9, 'frequency' => 'monthly', 'draft_flag' => 'marketing.pricing.draft'],
    ],

    'groups' => [

        'publish' => [
            'anchor' => 'publish',
            'title'  => 'Publish & Distribute',
            'intro'  => 'Point Podlink at the feed you already have. Nothing moves, nothing breaks, and every episode from here on is measured, transcribed and ready to be repurposed.',
            'spotlight' => [
                'title'     => 'Keep your podcast host. Add the part that was missing.',
                'body'      => '<p class="pl-text">Podlink is not another podcast host, and switching hosts is not a growth strategy. Paste your RSS URL and your whole back catalogue imports in seconds — artwork, episodes, descriptions, the lot. You keep publishing exactly where you publish today.</p>',
                'bullets'   => [
                    'Works with Buzzsprout, Transistor, Libsyn, Captivate, Acast, Anchor and anything else that produces a standard RSS feed.',
                    'Back catalogue imported on connect, so you can start repurposing episodes you published two years ago.',
                    'New episodes are picked up automatically — the workspace is waiting for you before you have finished uploading.',
                ],
                'mock'      => 'lines',
                'mockLabel' => 'Feed connected',
                'reverse'   => false,
            ],
            'features' => [
                [
                    'slug'  => 'connect-your-feed',
                    'icon'  => 'rss',
                    'title' => 'Connect your existing feed',
                    'body'  => 'Paste an RSS URL and Podlink imports the whole back catalogue. No migration, no re-uploading, no downtime on your show.',
                ],
                [
                    'slug'  => 'episode-workspace',
                    'icon'  => 'upload',
                    'title' => 'One workspace per episode',
                    'body'  => 'Audio, transcript, show notes, clips, newsletter draft and social copy on a single screen — instead of five tabs and a shared drive.',
                ],
                [
                    'slug'  => 'analytics-prefix',
                    'icon'  => 'shield',
                    'title' => 'Measurement that travels with the episode',
                    'body'  => 'Add the OP3 prefix once in your host and every episode reports to an open, auditable analytics endpoint. No lock-in, no black box.',
                ],
            ],
        ],

        'understand' => [
            'anchor' => 'understand',
            'title'  => 'Understand',
            'intro'  => 'Numbers you can put in front of a sponsor, and a searchable record of every word you said.',
            'spotlight' => [
                'title'     => 'Download analytics you can actually defend',
                'body'      => '<p class="pl-text">Podlink reads your download data from <strong>OP3</strong> — the open, independently operated podcast prefix. Not our own counter, not a number we would like you to believe. When a sponsor asks how you measure, you have an answer that stands up.</p>',
                'bullets'   => [
                    'Downloads, unique listeners, and the trend line per episode and across the show.',
                    'Breakdowns by listening app and country, so you know whether that Apple Podcasts push actually moved anything.',
                    'A public, verifiable measurement source — the same data a sponsor could check themselves.',
                    'Episode-over-episode comparison that shows which topics and title patterns carried.',
                ],
                'mock'      => 'bars',
                'mockLabel' => 'Downloads · last 30 days',
                'reverse'   => true,
            ],
            'features' => [
                [
                    'slug'  => 'download-analytics',
                    'icon'  => 'chart',
                    'title' => 'OP3 download analytics',
                    'body'  => 'Downloads, unique listeners, apps and countries — measured by an open prefix you control, not an in-house counter.',
                ],
                [
                    'slug'  => 'transcripts',
                    'icon'  => 'transcript',
                    'title' => 'Accurate transcripts',
                    'body'  => 'Every episode transcribed with speaker labels and timestamps on arrival. Search the archive, quote yourself correctly, give search engines something to index.',
                ],
            ],
        ],

        'create' => [
            'anchor' => 'create',
            'title'  => 'Create',
            'intro'  => 'The post-production writing that eats your evening, done in the time it takes to make coffee — in your voice, not a chatbot’s.',
            'spotlight' => [
                'title'     => 'Show notes that are finished, not a first draft',
                'body'      => '<p class="pl-text">Podlink writes from the transcript, so the summary reflects what was actually said. You get a structured set of notes with chapters, takeaways and every link and name that came up — formatted the way your show formats things, because you told it once.</p>',
                'bullets'   => [
                    'Episode summary, chapter timestamps and key takeaways, generated from the transcript rather than guessed at.',
                    'Names, companies, books and URLs mentioned in the episode, pulled out and listed.',
                    'Titles ranked for clarity, and descriptions sized to fit Apple Podcasts and Spotify without truncation.',
                    'Your template and tone of voice applied every time — no re-prompting, no re-editing.',
                ],
                'mock'      => 'lines',
                'mockLabel' => 'Episode 148 · Show notes',
                'reverse'   => false,
            ],
            'features' => [
                [
                    'slug'  => 'ai-show-notes',
                    'icon'  => 'sparkles',
                    'title' => 'AI show notes',
                    'body'  => 'Summary, chapter timestamps, key takeaways, and every link and name mentioned — drawn from the transcript, not invented.',
                ],
                [
                    'slug'  => 'titles-and-descriptions',
                    'icon'  => 'headline',
                    'title' => 'Titles &amp; descriptions',
                    'body'  => 'Ten title options per episode, ranked for clarity over clickbait, plus a description that fits every directory’s character limit.',
                ],
                [
                    'slug'  => 'guest-intros',
                    'icon'  => 'mic',
                    'title' => 'Guest intros',
                    'body'  => 'Paste a bio and get a warm, factual 30-second introduction you can read cold — including the pronunciation note you always forget to ask for.',
                ],
                [
                    'slug'  => 'sponsor-reads',
                    'icon'  => 'megaphone',
                    'title' => 'Sponsor reads',
                    'body'  => 'Turn a sponsor brief into a host-read script that sounds like you and covers the required disclosures. 15, 30 and 60-second cuts from one brief.',
                ],
                [
                    'slug'  => 'templates',
                    'icon'  => 'template',
                    'title' => 'Templates &amp; brand voice',
                    'body'  => 'Set your structure and tone once. Every episode after that comes out in your format, so editing is a read-through instead of a rewrite.',
                ],
                [
                    'slug'  => 'multilingual',
                    'icon'  => 'globe',
                    'title' => 'Multilingual output',
                    'body'  => 'Publish notes, descriptions and social copy in the languages your audience listens in. Translate a whole episode’s output set in one pass.',
                ],
            ],
        ],

        'grow' => [
            'anchor' => 'grow',
            'title'  => 'Grow',
            'intro'  => 'Every episode is a week of marketing material. Podlink cuts it, writes it, and gives it somewhere to live.',
            'spotlight' => [
                'title'     => 'One episode in, a week of promotion out',
                'body'      => '<p class="pl-text">The reason most shows do not grow is not the audio — it is that nobody had two spare hours to cut clips and write posts. Podlink finds the moments worth clipping, captions them, writes the copy around them, and drafts the newsletter that goes with the episode.</p>',
                'bullets'   => [
                    'Clip suggestions ranked by how well the moment stands on its own, cut to vertical with burned-in captions.',
                    'Post copy written per platform — LinkedIn, X, Instagram and TikTok read very differently.',
                    'An episode newsletter with the hook, three things worth knowing, the links and a listen button.',
                    'A podlink.fm page that keeps every listen link, latest episode and CTA in one place you can put in a bio.',
                ],
                'mock'      => 'lines',
                'mockLabel' => 'Episode 148 · 6 clips, 9 posts',
                'reverse'   => true,
            ],
            'features' => [
                [
                    'slug'  => 'clips-and-social',
                    'icon'  => 'scissors',
                    'title' => 'Clips &amp; social posts',
                    'body'  => 'Podlink finds the moments worth clipping, cuts them to vertical with captions, and writes the post that goes with each one.',
                ],
                [
                    'slug'  => 'newsletter',
                    'icon'  => 'mail',
                    'title' => 'Episode newsletter',
                    'body'  => 'A ready-to-send issue per episode: the hook, the three things worth knowing, the links, a listen button. Paste it in and send.',
                ],
                [
                    'slug'  => 'link-in-bio',
                    'icon'  => 'link',
                    'title' => 'Your podlink.fm page',
                    'body'  => 'A fast, branded link-in-bio page with every place your show is available, your latest episodes and whatever you are pointing people at.',
                ],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | /pricing
    |--------------------------------------------------------------------------
    |
    | *** EVERY LIMIT AND FEATURE SPLIT BELOW IS A PLACEHOLDER. ***
    |
    | *** SUPERSEDED (launch sprint 1, 2026-09-16): this page is no longer
    | reachable — RedirectLegacyMarketing 301s app-host /pricing (and
    | /features) to podlink.ai. The pricing SOURCE OF TRUTH is
    | claude/podlink-pricing-v2.md §7 (founder-approved: Free / Pro / Studio,
    | 14-day reverse trial, Studio $2/ep past 40 hard-capped) as rendered by
    | web/src/content/pricing.ts. The Creator-$19/Pro-$49 ladder below is the
    | OLD draft — do NOT copy numbers from here into anything. This array is
    | kept only because the Blade template still references its structure. ***
    |
    | The page STRUCTURE is final; the tier CONTENT is not. Nothing here is
    | wired to a real plan: no Stripe price IDs, no `plans` table rows, no
    | checkout. The CTAs point at registration, exactly like every other
    | marketing CTA. Fill the numbers in once the plan rows are decided —
    | it is all in this one array, no Blade edits required.
    |
    | While `draft` is true the page renders normally but the marketing layout
    | emits <meta name="robots" content="noindex, follow">, so placeholder
    | prices cannot be indexed. GO-LIVE = set `draft` to false AND uncomment
    | the /pricing line in the `sitemap` array near the top of this file.
    |
    | PRICING RULES (fixed, do not drift):
    |   * three tiers: Free / Creator $19 / Pro $49
    |   * annual = 10x monthly, i.e. `annual_multiplier` below
    |   * the savings label is "2 months free" — NOT a percentage. It is the
    |     literal truth of a 10x multiplier and it survives a price change.
    |
    | `price_annual` is DERIVED in MarketingController (monthly x
    | annual_multiplier). Set it explicitly on a tier only to override.
    |
    */
    'pricing' => [

        'draft' => true,

        'currency' => '$',

        'annual_multiplier' => 10,

        'billing' => [
            'legend'        => 'Billing period',
            'monthly_label' => 'Monthly',
            'annual_label'  => 'Annual',
            'save_label'    => '2 months free',
        ],

        /*
         * Tier order is load-bearing: the `values` arrays in `comparison`
         * below are positional and must stay aligned with this list.
         */
        'tiers' => [
            [
                'slug'          => 'free',
                'name'          => 'Free',
                'tagline'       => 'For the show you are still figuring out.',
                'price_monthly' => 0,
                'featured'      => false,
                'badge'         => null,
                'cta_label'     => 'Start free',
                'note'          => 'Free forever. No card required.',
                'features'      => [
                    'One connected show',                 // PLACEHOLDER
                    'OP3 download analytics',
                    'Transcripts for 2 episodes a month', // PLACEHOLDER
                    'AI show notes, titles and descriptions',
                    'podlink.fm page on a podlink.fm handle',
                ],
            ],
            [
                'slug'          => 'creator',
                'name'          => 'Creator',
                'tagline'       => 'For the show that publishes every week.',
                'price_monthly' => 19,
                'featured'      => true,
                'badge'         => 'Most popular',
                'cta_label'     => 'Start free trial',
                'note'          => 'Everything in Free, plus:',
                'features'      => [
                    'Transcripts and notes for every episode', // PLACEHOLDER
                    'Clips and per-platform social posts',
                    'Episode newsletter drafts',
                    'Templates and brand voice',
                    'Guest intros',
                    'Your own domain on your podlink.fm page',
                ],
            ],
            [
                'slug'          => 'pro',
                'name'          => 'Pro',
                'tagline'       => 'For networks, teams and multi-show studios.',
                'price_monthly' => 49,
                'featured'      => false,
                'badge'         => null,
                'cta_label'     => 'Start free trial',
                'note'          => 'Everything in Creator, plus:',
                'features'      => [
                    'Up to 3 connected shows',      // PLACEHOLDER
                    'Sponsor read scripts',
                    'Multilingual output',
                    'Producer and editor seats',    // PLACEHOLDER
                    'Priority processing and support',
                ],
            ],
        ],

        /*
         * Feature comparison table.
         *
         * `values` is POSITIONAL — one entry per tier, in `tiers` order
         * (Free, Creator, Pro). Use:
         *   true   -> included      (renders a tick + "Included" for AAT)
         *   false  -> not included  (renders a dash + "Not included")
         *   string -> literal value (renders as text)
         */
        'comparison' => [
            'caption'      => 'Feature comparison across the Free, Creator and Pro plans.',
            'feature_head' => 'Feature',
            'scroll_hint'  => 'Scroll sideways to compare all three plans',
            'sections'     => [
                [
                    'title' => 'Publish & Distribute',
                    'rows'  => [
                        ['label' => 'Connected shows', 'values' => ['1', '1', '3']],                     // PLACEHOLDER
                        ['label' => 'Import an existing RSS feed', 'values' => [true, true, true]],
                        ['label' => 'Back catalogue import', 'values' => [true, true, true]],
                        ['label' => 'Episode workspace', 'values' => [true, true, true]],
                        ['label' => 'Producer / editor seats', 'values' => [false, false, true]],        // PLACEHOLDER
                    ],
                ],
                [
                    'title' => 'Understand',
                    'rows'  => [
                        ['label' => 'OP3 download analytics', 'values' => [true, true, true]],
                        ['label' => 'App and country breakdown', 'values' => [false, true, true]],       // PLACEHOLDER
                        ['label' => 'Episode-over-episode comparison', 'values' => [false, true, true]], // PLACEHOLDER
                        ['label' => 'Transcribed episodes', 'values' => ['2 a month', 'Unlimited', 'Unlimited']], // PLACEHOLDER
                        ['label' => 'Archive-wide transcript search', 'values' => [false, true, true]],  // PLACEHOLDER
                    ],
                ],
                [
                    'title' => 'Create',
                    'rows'  => [
                        ['label' => 'AI show notes', 'values' => [true, true, true]],
                        ['label' => 'Titles and descriptions', 'values' => [true, true, true]],
                        ['label' => 'Guest intros', 'values' => [false, true, true]],                    // PLACEHOLDER
                        ['label' => 'Sponsor read scripts', 'values' => [false, false, true]],           // PLACEHOLDER
                        ['label' => 'Templates and brand voice', 'values' => [false, true, true]],       // PLACEHOLDER
                        ['label' => 'Multilingual output', 'values' => [false, false, true]],            // PLACEHOLDER
                    ],
                ],
                [
                    'title' => 'Grow',
                    'rows'  => [
                        ['label' => 'Clips per episode', 'values' => ['—', '6', '12']],                  // PLACEHOLDER
                        ['label' => 'Per-platform social posts', 'values' => [false, true, true]],       // PLACEHOLDER
                        ['label' => 'Episode newsletter drafts', 'values' => [false, true, true]],       // PLACEHOLDER
                        ['label' => 'podlink.fm page', 'values' => [true, true, true]],
                        ['label' => 'Custom domain on podlink.fm', 'values' => [false, true, true]],     // PLACEHOLDER
                        ['label' => 'Remove Podlink badge', 'values' => [false, true, true]],            // PLACEHOLDER
                    ],
                ],
                [
                    'title' => 'Support',
                    'rows'  => [
                        ['label' => 'Help centre and email support', 'values' => [true, true, true]],
                        ['label' => 'Priority processing', 'values' => [false, false, true]],            // PLACEHOLDER
                        ['label' => 'Onboarding session', 'values' => [false, false, true]],             // PLACEHOLDER
                    ],
                ],
            ],
        ],

        'faq' => [
            [
                'q' => 'What happens when the free plan runs out for the month?',
                'a' => '<p>Nothing breaks and nothing is deleted. You keep your analytics, your published episodes and your podlink.fm page — you just wait for the next month or move up a plan to carry on generating.</p>',
            ],
            [
                'q' => 'How does annual billing work?',
                'a' => '<p>You pay for ten months and get twelve. That is where "2 months free" comes from — it is the literal arithmetic, not a rounded-up percentage. You can switch between monthly and annual whenever you like.</p>',
            ],
            [
                'q' => 'Do I need to change podcast hosts to pay for Podlink?',
                'a' => '<p>No. Podlink is not a host and never asks you to become one of ours. Every plan works off the RSS feed you already publish, wherever you publish it.</p>',
            ],
            [
                'q' => 'Can I change or cancel my plan?',
                'a' => '<p>Upgrade, downgrade or cancel from your dashboard at any time. Downgrades take effect at the end of the period you have already paid for, so you never lose time you bought.</p>',
            ],
            [
                'q' => 'Do you offer anything for networks with more than three shows?',
                'a' => '<p>Yes — get in touch and we will size it properly rather than making you buy three Pro seats.</p>',
            ],
        ],

        'cta' => [
            'title' => 'Start on Free. Move up when the show does.',
            'lead'  => 'Connect your feed, publish an episode, and see what comes back before you spend anything.',
            'note'  => 'Keep your podcast host. Cancel any time.',
        ],
    ],
];
