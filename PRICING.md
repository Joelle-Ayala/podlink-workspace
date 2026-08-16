# Podlink Pricing — research, proposal, and how to ship it

Prepared: 2026-08-16
Scope: MagicAI install at `/home/claude/podlink/magicai` (deployed copy at `/root/podlink/magicai`), Biolink install at `/root/podlink/biolink`.
Status: research + strategy. No code written, no Stripe objects created, no DB rows inserted.

**Two things to read before anything else:**

1. **`BIOLINK_CREATOR_PLAN_ID` and `BIOLINK_PRO_PLAN_ID` do not exist.** They are in neither codebase, neither `.env.example`, nor Biolink's `config.php`. See §1.6. The "a Creator and Pro tier are already half-assumed somewhere" premise is not supported by the code. That does not make Creator/Pro wrong as names — it just means nothing is wired and nothing constrains us.
2. **Competitor prices in §2 could not be fetched live.** This sandbox's egress proxy returns 403 CONNECT for competitor domains, and `WebFetch` requires an interactive approval that a background agent cannot obtain. §2 is therefore built from model knowledge (training cutoff May 2026 — roughly 3 months stale) plus search-result corroboration, with a per-row confidence flag and a verification URL. **Verify the six rows marked `VERIFY` before any number goes on a public page.** Verification is ~20 minutes of manual browsing.

---

## Part 1 — What the codebase can already meter and gate

### 1.1 The `plans` table: what a plan can express

Model: `/home/claude/podlink/magicai/app/Models/Plan.php`
Base migration: `/home/claude/podlink/magicai/database/migrations/2019_05_02_122941_create_plans_table.php`
Admin form (authoritative list of what a human can set): `/home/claude/podlink/magicai/app/Livewire/Admin/Finance/Plan/SubscriptionPlanCreate.php` (lines 50–105)

The table has accumulated ~60 columns across 40+ migrations. The ones that matter for us:

**Commercial / identity**

| Column | Type | Notes |
|---|---|---|
| `name`, `description`, `features` | string / text / text | `features` is a **comma-separated string**, exploded and rendered as bullets — `resources/views/default/components/plan-details-card.blade.php:73-81` |
| `price` | double | `isFree()` is `price === 0` (`Plan.php:322`) |
| `currency` | string | default `USD` |
| `frequency` | string | `monthly` \| `yearly` \| `lifetime_monthly` \| `lifetime_yearly` \| `lifetime` \| `prepaid` — `app/Enums/Plan/FrequencyEnum.php` |
| `type` | string | `subscription` \| `prepaid` (token pack) — `app/Enums/Plan/TypeEnum.php` |
| `is_featured` | bool | draws the highlight border on the pricing card |
| `active`, `hidden`, `hidden_url` | bool / string | `hidden` + `hidden_url` = private plan reachable only by URL (`PrivatePlanController`) |
| `max_subscribe`, `last_date` | int / date | cap total subscribers; expire a plan on a date. Useful for a founding-member offer |
| `trial_days` | int | free-trial days |
| `stripe_product_id` | string | legacy; the live mapping lives in `gatewayproducts` (§1.7) |
| `price_tax_included` | bool | |
| `affiliate_status` | bool | whether the plan pays affiliate commission |

**Metering — separated credits (the default system)**

| Column | Type | Notes |
|---|---|---|
| `ai_models` | json | The core quota. Shape: `{engine_slug: {model_slug: {credit: float, isUnlimited: bool}}}`. Read by `Plan::getCredit()` (`Plan.php:246`). Units differ per model — see §1.3 |
| `default_ai_model` | string | |
| `reset_credits_on_renewal` | bool | **Defaults to `false`.** Without this, credits accumulate instead of resetting monthly. Any plan sold as "N per month" must set this `true` — migration `2025_01_24_145331_...` |
| `max_tokens` | bigint | per-request token ceiling |
| `multi_model_support`, `model_council_support` | bool | |

**Metering — shared credit pool (added 2026-04, the modern system)**

| Column | Type | Notes |
|---|---|---|
| `credit_system_type` | string | `separated` \| `shared` |
| `shared_credits_amount` | float | **one number of credits per plan** |
| `shared_credit_model_overrides` | json | per-model unit-cost override |
| `shared_credit_feature_limits` | json | per-feature caps within the pool — consumed at `app/Domains/Entity/Concerns/HasCreditLimit.php:444` |

Service: `app/Services/SharedCredit/SharedCreditService.php`. Gated globally by the setting `shared_credit_system_enabled` (`SharedCreditService::isEnabled()`, line 20) — **currently off unless someone has flipped it in admin**. Design docs: `docs/shared-credit-pool-v2.md`, `docs/shared-credit-migration-plan.md`.

**Feature gates (boolean, per plan)**

| Column | Type | What it gates |
|---|---|---|
| `open_ai_items` | json | Per-**template** on/off, keyed by `OpenAIGenerator.slug`. This is where "AI show notes / sponsor reads / newsletter" live |
| `plan_ai_tools` | json | Per-**tool** on/off (AI Writer, Chat, Image, etc.) |
| `plan_features` | json | Per-**feature** on/off. The whitelist is hardcoded in `MenuService::planFeatureMenu()` (`app/Services/Common/MenuService.php:5332-5378`): `api_keys`, `brand_voice`, `support`, `integration` (WordPress), `custom_templates_extension`, `chat_training_extension`, `creative_suite`, `ai_influencer`, `url_to_video`, `viral_clips`, `influencer_avatar` |
| `user_api` | bool | personal API key |
| `plan_type` | string | `regular` \| `premium` \| `pro` \| `vip` \| `enterprise` (`app/Enums/AccessType.php`) |

**Seats**

| Column | Notes |
|---|---|
| `is_team_plan` (bool), `plan_allow_seat` (int) | Seat count is pushed onto the team at `app/Http/Controllers/Team/TeamController.php:42-50` and `app/Http/Controllers/Dashboard/UserController.php:148` |

**Per-surface numeric limits already shipped** (each is its own column, `-1` = unlimited): `voice_call_seconds_limit`, `video_dubbing_seconds_limit`, `deep_research_request_limit`, `ugc_videos_limit`, `ugc_creator_videos_limit`, `ai_captions_access` + `ai_captions_minutes`, `chatbot_limit` + `chatbot_channels` + `chatbot_human_agent`, `social_media_agent_limits` `{agents, monthly_posts}`, `blogpilot_limits` `{agents, monthly_posts}`, `social_media_automation_limits` `{automations}`, `marketing_bot_limits` `{max_contacts, monthly_messages, channels}`, `ai_agent_workflow_limit` / `channel_limit` / `message_limit` / `memory_limit`.

**The pattern to notice:** every time MagicAI shipped a new surface it added *a new plan column plus its own enforcement*. There is no generic "limit X per month" primitive. A Podlink-specific limit ("episodes per month") would follow the same path: migration + column + enforcement call site.

### 1.2 How entitlements are enforced

**Feature/template access** — `app/Http/Middleware/CheckTemplateTypeAndPlan.php`.
Applied per-route in `routes/panel.php` (lines 156, 187–188, 197, 206, 229, 270–271, 305, …). It resolves a slug from the route (there's a hardcoded route-name → slug map at lines 40–75 for routes without a `{slug}` param), then:
- admins bypass entirely;
- no plan (free user) → allowed if the slug is in the `free_open_ai_items` setting, else allowed only if the template is not `premium`;
- has a plan → `$plan->checkOpenAiItem($slug)` (`Plan.php:294`), which merges `open_ai_items` + `plan_ai_tools` + `plan_features` and checks for `=== true`;
- failure → redirect to `dashboard.user.payment.subscription` with "If you want to use premium service, update your plan."

**Credit balance** — `app/Domains/Entity/Concerns/HasCreditLimit.php` (~500 lines). `getCredit()` resolves the balance (shared pool if the user is on shared credits, else plan/user/team merged separated credits), `hasCreditBalance()` checks it, `decreaseCredit()` (line 420) spends it. Team balances merge with user balances (lines 88–120). Guests get an IP rate limit (`guest_user_daily_message_limit`).

**Free-tier template whitelist** — the `free_open_ai_items` setting, edited at Admin → Finance → Free Feature (`AdminController::freeFeature` line 238 / `freeFeatureSave` line 257, route `dashboard.admin.finance.free.feature`). This is how you make a template usable with no plan at all.

### 1.3 The unit problem (read this before designing tiers)

Credit units are **per-driver**, defined by which `Calculate` trait the driver uses (`app/Domains/Entity/Concerns/Calculate/`):

| Trait | Unit | Used by |
|---|---|---|
| `HasWords` | output words | text models |
| `HasImages` | images | image models |
| `HasMinutes` | **input audio minutes** (`getInputMinute() * creditIndex`) | `AiCaptionsDriver`, ElevenLabs music, Minimax music |
| `HasSpeechToText` | **output transcript word count** (`count(preg_split(...)) * creditIndex`) | `OpenAI/Whisper1Driver` — the transcription path |
| `HasSeconds`, `HasCharacters`, `HasPlagiarism`, `HasPresentation`, … | as named | |

**Consequence:** "transcript minutes" is *not* a unit the transcription path measures. Whisper is billed by transcript **words out**, not audio **minutes in** (`app/Domains/Entity/Concerns/Calculate/HasSpeechToText.php`). A 60-minute interview and a 60-minute meditation episode will consume wildly different credit. Selling "5 hours of transcription/month" would be selling something the meter does not measure. Either change the trait (new code) or don't sell minutes.

### 1.4 What the Podlink-specific code lets us gate — the honest answer: almost nothing

Podlink-specific files, in full:
- `app/Models/PodcastShow.php`
- `database/migrations/2026_07_09_000001_create_podcast_shows_table.php`
- `app/Services/Op3Service.php`
- `app/Http/Controllers/Dashboard/AnalyticsController.php`
- `app/Http/Controllers/Dashboard/PodlinkController.php`
- `app/Http/Controllers/Marketing/MarketingController.php`, `config/marketing.php`, `routes/custom_routes_web.php`

Findings:

- **Number of shows cannot be gated — it is hardcoded to 1.** The migration declares `$table->unique('user_id')` with the comment `// One connected show per user (M5 scope).`, and `AnalyticsController::connect()` uses `updateOrCreate(['user_id' => $user->id], ...)`. A multi-show tier needs a migration to drop the unique index, a plan column, and enforcement. **New code.**
- **Episodes per month cannot be gated — there is no episode record.** No episodes table, no episode model, no episode migration. `Op3Service::recentEpisodes()` reads episodes live from the OP3 API and hands them to a Blade view; nothing is persisted. An episode quota requires a whole persistence layer. **New code, and not small.**
- **Transcript minutes** — see §1.3. **New code** (change the trait, or add an audio-duration probe).
- **Analytics access is completely ungated.** `routes/panel.php:132-133` registers `dashboard.user.analytics.index` and `.connect` with **no** `CheckTemplateTypeAndPlan` middleware. Any logged-in user, including a free one, gets the full OP3 dashboard. Gating it needs either a new `plan_features` key (the whitelist in `MenuService::planFeatureMenu()` is hardcoded — editing it is a MagicAI-core edit that an upgrade could clobber) or a small explicit check in the controller. **New code, but ~10 lines.**
- **The podlink.fm page is completely ungated.** `routes/panel.php:129` → `PodlinkController::redirect()`, no middleware. Same fix, same size.
- **What IS gateable today, for free:** the AI templates (show notes, titles, descriptions, guest intros, sponsor reads, social posts, clips copy, newsletter) — because they are ordinary `OpenAIGenerator` rows and are covered by `open_ai_items` + `CheckTemplateTypeAndPlan`. Plus brand voice, WordPress export, personal API key, custom templates, seats, and the credit balance itself.

### 1.5 Plan seed data — there is none in this checkout

`import-seed-once.php` imports `magicai.sql` via `mysqli::multi_query`, guarded to run only while `settings_two` is empty. **`magicai.sql` is not present in this working copy** (`.gitignore:7` says it is *supposed* to be committed while the repo is private — the file is simply absent here; there is also no `.git` directory in this copy, so I cannot check history). `database/seeders/` has 16 seeders, none of which is a plan seeder. `PlanFactory` is not used outside tests.

So: **plan rows on production come from whatever `magicai.sql` contained** (a stock MagicAI demo dump, most likely, with demo plans). Before inserting anything, someone must look at the live `plans` table. That is open question Q1.

### 1.6 `BIOLINK_CREATOR_PLAN_ID` / `BIOLINK_PRO_PLAN_ID` — they do not exist

Searched `/home/claude/podlink` and `/root/podlink` (both installs, all file types): **zero occurrences.** What actually exists:

- `config/services.php:70-73` — only `biolink.base_url` and `biolink.admin_api_key`.
- `.env.example:64-66` — only `BIOLINK_BASE_URL`, `BIOLINK_ADMIN_API_KEY`.
- `app/Http/Controllers/Dashboard/PodlinkController.php` — POSTs `email`, `name`, `password` (a random throwaway), `redirect` to `{base}/admin-api/sso/login`, then redirects the browser to the returned magic-login URL.

And on the Biolink side, `/root/podlink/biolink/app/controllers/admin-api/AdminApiSSO.php`:
- `login()` creates missing users with the plan **hardcoded to `'free'`** and `settings()->plan_free->settings` (lines ~100–112);
- `update()` accepts **only** `new_email` and `name` — it cannot change a plan;
- `delete()` deletes a user.

Biolink's `users.plan_id` is a string (`'free'` or a numeric id from Biolink's own plans table) — `/root/podlink/biolink/app/models/User.php:70-74, 149, 208`.

**What this implies for tier structure: nothing was pre-decided.** The names "Creator" and "Pro" have no anchor in the code. What it *does* tell us is the shape of the work: to give paying Podlink customers an upgraded podlink.fm page, someone must either (a) patch `AdminApiSSO` to accept `plan_id` on login/update, or (b) write `biolink.users.plan_id` directly — which is viable, because `create-biolink-db.php` proves magicai's DB user sits on the same MySQL server as the `biolink` database and can create/modify it.

### 1.7 Stripe wiring — you do **not** create products by hand

`app/Services/PaymentGateways/StripeService.php::saveProduct()` (line 200) creates the Stripe **product** and **price** from a `Plan` row: `unit_amount = (int) ($plan->price * 100)`, `currency` from the gateway config, `recurring.interval = month|year` derived from `plan->frequency`. On a price change it deactivates every old price on the product, creates a new one, writes an `OldGatewayProducts` history row, and calls `updateUserData()` to migrate/cancel existing subscribers.

It is invoked from `PaymentProcessController::saveGatewayProducts()` (line 617), which loops every active gateway, which is called from `AdminController::paymentPlansSave()` (line 1070). Result: **saving a plan in the admin panel creates the Stripe objects automatically**, for every active gateway. Mapping is stored in `gatewayproducts` (`App\Models\GatewayProducts`, table `gatewayproducts`, columns `plan_id`, `plan_name`, `gateway_code`, `gateway_title`, `product_id`, `price_id`, `payload`).

A `price = 0` plan is handled by `FreeService::saveProduct()` (`app/Services/PaymentGateways/FreeService.php:47`), which mints a fake product id `FPP-XXXXXXXXXXXXX` and `price_id = 'Not Needed'`. So **a $0 plan row is a first-class, supported thing** — that is how the free tier should be built.

### 1.8 The existing pricing Blade section

Views: `resources/views/default/landing-page/pricing/{section,item-content,item-trigger}.blade.php`

- `section.blade.php` renders a tab strip (Monthly / Annual / Lifetime / Pre-Paid — each tab only appears if that collection is non-empty) over four grids. Grid is `grid-cols-3` (hardcoded, `max-md:grid-cols-1`) — **a 4-tier row will wrap awkwardly.**
- Data it expects, all injected by `IndexController` (line 48, 101) via `App\Services\Finance\PlanService`: `$plansSubscriptionMonthly`, `$plansSubscriptionAnnual`, `$plansSubscriptionLifetime`, `$plansPrepaid`, `$currency`, plus `$fSectSettings` for `pricing_title`, `pricing_description`, `pricing_save_percent`.
- `PlanService::getPlans()` (line 22) is `Cache::rememberForever('active_plans_cache_v1')` over `Plan::where('active', true)->where('hidden', false)->orderBy('price')`. Cache is busted by `Plan::saved`/`deleted` hooks (`Plan.php:141-149`), so admin edits propagate.
- `item-content.blade.php` renders the price via `displayPlanPrice($plan, currency())` (`app/Helpers/helpers.php:1002`, handles discounts and symbol side), a CTA to `route('register', ['plan' => $plan->id])`, and `<x-plan-details-card>`.
- `plan-details-card.blade.php` renders **"Access {N} Features"** with a hover popover listing every AI template with a check or cross, then the `plan->features` comma-string as bullets. This is generic AI-SaaS chrome, not podcast-market copy.

**The toggle:** `$fSectSettings->pricing_active` — column added in `database/migrations/2023_06_02_124117_create_frontend_sections_statuses_titles_table.php:43` (`default(1)`), alongside `pricing_title` (default "Flexible Pricing."), `pricing_description`, `pricing_save_percent` (default "Save 30%").

**How a human flips it:** Admin panel → Frontend → Section Settings (`GET /dashboard/admin/frontend/section-settings`, `routes/panel.php:775`; form field `pricing_active` at `resources/views/default/panel/admin/frontend/section_settings.blade.php:587-597`; saved by `AdminController::frontendSectionSettingsSave`, assignment at line 1692). Consumed at `resources/views/default/index.blade.php:20` via `@includeWhen($fSectSettings->pricing_active == 1, ...)`.

**Note:** the default is already `1`. If pricing is invisible on the live homepage today, the likely cause is *no active non-hidden subscription plans exist* (empty collections → empty tabs), not the toggle. Confirm against the live DB (Q1).

### 1.9 Is there a `/pricing` route? No.

- `routes/web.php` has no `/pricing`. The only pricing surfaces are the homepage anchor `#pricing` (`section.blade.php` sets `id="pricing"`) and the **logged-in** page `dashboard.user.payment.subscription` → `PlanAndPricingController` (`routes/panel.php:344`), which renders `panel.user.finance.subscriptionPlans`.
- `routes/custom_routes_web.php` **already has the stub, commented out**:
  ```php
  //   Route::get('pricing', 'pricing')->name('marketing.pricing');
  ```
- `MarketingController::features()` currently points its secondary CTA at `route('index') . '#pricing'` with the comment *"Points at the homepage pricing section until the standalone /pricing page ships; swap the URL then, nothing else changes."*

The intent to ship `/pricing` as a marketing page is already recorded in the code. Follow it.

---

## Part 2 — The market

### 2.1 Verification status (read first)

Live fetching failed. `curl` → `CONNECT tunnel failed, response 403` (egress policy; confirmed via `$HTTPS_PROXY/__agentproxy/status`, which logged policy denials for `podsqueeze.com`, and previously for `podlink.ai` and `podlink.fm`). `WebFetch` → `PROVENANCE_REQUIRED` on every attempt. `WebSearch` returns titles and URLs only, no page content.

Confidence key: **[C]** corroborated by a 2026 search-result title in this session · **[K]** model knowledge, cutoff May 2026 · **VERIFY** = must be checked before publishing.

### 2.2 Competitor table

| Product | Category | Free tier | Paid tiers (monthly) | Annual | Primary metering unit | Conf. | Source to verify |
|---|---|---|---|---|---|---|---|
| **Opus Clip** | Clips | Yes — ~60 upload min/mo, watermark | Starter ~$15, Pro ~$29 | ~35–40% off (≈$9 / $19) | **Upload minutes → credits/mo** | **[C]** title: "Free, Starter $15, Pro $29" | https://www.opus.pro/pricing |
| **Descript** | Editing + transcription | Yes — ~1 hr transcription/mo, watermarked export | Hobbyist ~$19, Creator ~$35, Business ~$65 | ~30% off (≈$12 / $24 / $50) | **Transcription hours per seat/mo + seats** | [K] VERIFY | https://www.descript.com/pricing |
| **Castmagic** | Podcast AI repurposing | No — trial only | Starter ~$39, Professional ~$79, Enterprise custom | ~20% off | **Hours of audio uploaded/mo** | [K] VERIFY (2026 sources suggest a move toward custom quotes) | https://www.castmagic.io/pricing |
| **Podsqueeze** | Podcast AI repurposing | Trial (a free episode) | Basic ~$18, Pro ~$36, Business ~$72 | ~2 months free | **Episodes/mo** | [K] VERIFY | https://podsqueeze.com/pricing |
| **Swell AI** | Podcast AI repurposing | No — trial | Starter ~$27, Pro ~$59–79, Agency ~$199+ | ~2 months free | **Transcription hours/mo (+ shows on higher tiers)** | [K] VERIFY | https://www.swellai.com/pricing |
| **Capsho** | Podcast AI repurposing | No — trial | ~$39–49, ~$79–99 | ~2 months free | **Episodes/mo** | [K] VERIFY | https://www.capsho.com/pricing |
| **Podium** | AI show notes | Yes — a few episodes/mo | ~$9–19 entry, ~$39 pro | — | **Episodes/mo (+ episode length cap)** | [K] VERIFY | https://podium.page/pricing |
| **Riverside** | Recording + Magic Clips | Yes — ~2 hrs/mo, watermarked | Standard ~$19, Pro ~$29, Business custom | ~$15 / ~$24 | **Recording hours + AI transcription hours** | [K] | https://riverside.fm/pricing |
| **Buzzsprout** | Hosting | Yes — 2 hrs/mo, episodes expire at 90 days | $12 (3 hrs), $18 (6 hrs), $24 (12 hrs); +$4/extra hr | minimal | **Upload hours/mo** | [K] | https://www.buzzsprout.com/pricing |
| **Transistor** | Hosting | No — 14-day trial | Starter $19, Professional $49, Business $99 | ~2 months free | **Monthly downloads** (≈25k / 75k / 200k); unlimited shows on all | [K] | https://transistor.fm/pricing |
| **Captivate** | Hosting | No — 7-day trial | ~$19, ~$49, ~$99 | ~2 months free | **Monthly downloads** (≈12k / 60k / 150k); unlimited shows | [K] | https://www.captivate.fm/pricing |
| **Podpage** | Podcast website | **Yes** — full site on a `podpage.com` subdomain | Pro ~$12, Business/Elite ~$29 | ~2 months free | **Features; custom domain is the paid line** | [K] | https://www.podpage.com/pricing |
| **Chartable** | Analytics | — | **Discontinued** (Spotify sunset) | — | — | [K] | — |
| **Podtrac** | Analytics | Yes — free measurement | Enterprise/publisher deals | — | — | [K] | https://analytics.podtrac.com |
| **OP3** | Analytics | **Free, open source** | — | — | — | [K] — it's Podlink's own data source | https://op3.dev |

### 2.3 The pattern

**1. The market meters on volume of audio in, never on outputs.** Three units, and only three: **episodes/month** (Podsqueeze, Capsho, Podium), **hours/minutes of audio** (Castmagic, Swell, Descript, Riverside, Opus, Buzzsprout), or **downloads** (Transistor, Captivate — but that's hosting, not our category). Nobody meters "AI credits" in this category. Podcasters do not think in credits, and a credits meter reads as a tell that you don't know how much your own product costs to run.

**2. Price points cluster hard in two bands.**
- **Entry $15–$29.** Opus $15, Podsqueeze $18, Descript $19, Riverside $19, Buzzsprout $18, Transistor $19, Captivate $19, Swell $27, Opus Pro $29.
- **Serious $39–$79.** Castmagic $39/$79, Podsqueeze $36/$72, Capsho $39–99, Swell $59–79, Transistor $49, Captivate $49, Descript Business $65.
- Then a gap, then **agency/enterprise $99–$199+**.
- `$19` and `$49` are the two most-occupied numbers in the whole table. `$29` is the most contested. Anything at `$25` or `$45` reads as a competitor undercut rather than a considered price.

**3. A free tier is standard on the consumer-facing end and absent on the pro-tool end.** Free: Opus, Descript, Riverside, Buzzsprout, Podium, Podpage. No free: Castmagic, Swell, Capsho, Transistor, Captivate. The free ones limit by **volume + a visible watermark/subdomain**, not by removing features. Buzzsprout's is the sharpest: full product, 2 hours/month, and episodes are **deleted after 90 days** — a decay mechanic rather than a wall.

**4. Annual is ~2 months free (16.7%), or "pay 10× monthly".** Near-universal. Opus and Descript discount harder (30–40%), which is a clip/editing-tool convention rather than a podcast one. `pricing_save_percent` defaults to "Save 30%" in the DB — that default is wrong for this market and should be changed to "2 months free".

**5. Standalone podcast analytics is a dead business.** Chartable is gone; Podtrac's measurement is free; OP3 is free and open. **Do not put analytics behind a paywall** — the market has priced it at zero and Podlink didn't build the measurement anyway (OP3 did). Analytics is Podlink's best free-tier hook, not a paid feature.

**6. The link-in-bio precedent is unambiguous: page free, custom domain paid.** Podpage, Linktree, Beacons, Bio.link all do exactly this. It maps cleanly onto podlink.fm and needs no argument.

---

## Part 3 — Recommended tiers

### 3.1 The metering decision

**Meter on the credit pool. Market it in episodes. Do not promise minutes.**

Reasoning:
- Episodes/month is what the market uses and what a podcaster understands — but §1.4 shows the codebase has no episode record at all. Enforcing it is a persistence-layer project, not a launch task.
- Audio hours would be the second choice — but §1.3 shows the transcription path bills by transcript **words out**, not audio minutes in. Selling hours would be selling an unmeasured unit.
- The **shared credit pool** (`credit_system_type = 'shared'`, `shared_credits_amount`) is a single number per plan, already built, already enforced in `HasCreditLimit`, already has a top-up path and transaction ledger. It is the only monthly quota this codebase can enforce on day one.

So: set the pool, then state the *guidance* in episodes on the pricing page — **"about 4 episodes a month"**, not "4 episodes a month". Then calibrate: measure real credit burn per episode for the first 60 days and restate the guidance. This is honest, shippable now, and leaves the door open to a real episode counter later.

**This is a real compromise and it should be named as one.** See §3.6.

### 3.2 The tiers

| | **Free** | **Creator** | **Pro** ★ | **Studio** |
|---|---|---|---|---|
| **Monthly** | $0 | **$19** | **$49** | **$129** |
| **Annual** | $0 | **$190/yr** ($15.83/mo) | **$490/yr** ($40.83/mo) | **$1,290/yr** ($107.50/mo) |
| **One-line** | "See what Podlink does to one episode." | "One show, published properly, every week." | "The show is the business now." | "You run other people's shows." |
| **Target** | Anyone with a feed; evaluating | Solo host, weekly or fortnightly, no team | Solo/duo host monetising — sponsors, newsletter, clips | Producer, agency, network, or a show with staff |
| **Guidance** | ~1 episode / month | **~4 episodes / month** | **~12 episodes / month** | **~40 episodes / month** |
| `shared_credits_amount` | 1 × E | 4 × E | 14 × E *(deliberate ~15% headroom)* | 45 × E |
| `reset_credits_on_renewal` | `true` | `true` | `true` | `true` |
| **Shows** | 1 *(hard limit — §1.4)* | 1 | 1 | 1 **at launch** — see §3.5 |
| **OP3 analytics** | ✅ **full** | ✅ | ✅ | ✅ |
| **Transcripts** | ✅ | ✅ | ✅ | ✅ |
| **Show notes / titles / descriptions** | ✅ | ✅ | ✅ | ✅ |
| **Guest intros** | — | ✅ | ✅ | ✅ |
| **Sponsor reads** | — | — | ✅ | ✅ |
| **Social posts** | 1 platform | all platforms | all platforms | all platforms |
| **Clips** | 1 clip / episode, Podlink watermark | ✅ | ✅ | ✅ |
| **Newsletter drafts** | — | ✅ | ✅ | ✅ |
| **Brand voice / templates** | — | ✅ | ✅ | ✅ |
| **Multilingual output** | — | — | ✅ | ✅ |
| **100+ AI template library** | ✅ | ✅ | ✅ | ✅ |
| **podlink.fm page** | ✅ `podlink.fm/yourshow`, Podlink badge | ✅ badge removed | ✅ + **custom domain** | ✅ + custom domain |
| **Seats** (`plan_allow_seat`) | 1 | 1 | **2** | **5** |
| **WordPress export** (`integration`) | — | — | ✅ | ✅ |
| **Personal API key** (`user_api`) | — | — | — | ✅ |
| **Support** | docs / community | email | priority email | priority + onboarding call |
| **Trial** (`trial_days`) | n/a | 0 (free tier is the trial) | **7** | **7** |
| `is_featured` | 0 | 0 | **1** | 0 |
| `plan_type` | `regular` | `regular` | `pro` | `enterprise` |

**E** = measured credits consumed by one average episode's full output set. It is not known yet. Pick a provisional value from a manual run-through before launch (Q3), and re-derive after 30 days of real data.

### 3.3 Why these numbers

- **$19 / $49** land on the two most-occupied price points in §2.3 and read as a category-native podcast tool rather than an AI-credits novelty. $19 sits beside Buzzsprout, Transistor, Captivate, Descript and Riverside — the tools a Podlink customer already pays for. That adjacency is the point: "the same as your host, for the part your host doesn't do."
- **$49 for Pro** is the same shelf as Transistor Professional and Captivate Pro. A host paying $19 for hosting will pay $49 for the thing that gets them sponsors — that is the tier where the product stops being a convenience and starts being revenue.
- **$129 for Studio** deliberately clears the $99 agency crowd. It is the only tier where seats (5) and the API key are real, and it should feel like a different product, not a bigger bucket. If it doesn't sell, the answer is a sales conversation, not a discount.
- **Annual = 10× monthly** (~17% off), matching the podcast-market convention. Set `pricing_save_percent` to `"2 months free"`, not the stock `"Save 30%"`.
- **Pro gets ~15% credit headroom** (14E for "~12 episodes") because the guidance→credits mapping is an estimate. Under-delivering on the flagship tier in month one is far more expensive than the credits.

### 3.4 The free tier

It must be genuinely useful — the shipped FAQ and every marketing CTA say "Start free" (`resources/views/default/marketing/partials/{hero,cta,feature-block}.blade.php`, `MarketingController::primaryCta()`).

**Free gets the whole "Understand" half of the product, permanently and unlimited: full OP3 download analytics, apps, countries, per-episode trends.** Reasons: it costs Podlink no AI spend (OP3 is a free API), the market prices analytics at zero anyway (§2.3 point 5), it requires the user to connect their feed and add the OP3 prefix — which is the single highest-intent onboarding action available and creates real switching cost — and it makes Podlink useful on the days you don't publish, which is most days.

**The upgrade pressure is volume plus polish, never capability.** One episode of AI output per month, one clip with a Podlink watermark, one social platform, and a `podlink.fm/yourshow` page carrying a small Podlink badge. A free user sees exactly what the product does to their own episode, and then wants it for the next three.

Two things free does *not* get, and both are deliberate: the newsletter draft and brand voice. Newsletter is the clearest single "this saves me an evening" moment — it is the best upgrade trigger in the set. Brand voice is what makes output stop sounding like a chatbot; withholding it means free output is *good but generic*, which is the correct feeling to leave someone with.

Implementation note: the "1 episode/month" free quota is enforced as `shared_credits_amount = 1 × E` on a `price = 0` plan (handled by `FreeService`, §1.7) with `reset_credits_on_renewal = true`. It is **not** the "no plan" path — a free user should be subscribed to an actual Free plan row so that `$user->relationPlan` exists and `checkOpenAiItem()` governs. Leaving free users planless routes them through the `free_open_ai_items` setting branch of `CheckTemplateTypeAndPlan` (line ~105), which is a coarser, harder-to-reason-about control surface.

### 3.5 Where podlink.fm sits

| Tier | podlink.fm | Biolink plan |
|---|---|---|
| Free | `podlink.fm/yourshow`, small Podlink badge | Biolink `free` |
| Creator | same URL, **badge removed** | Biolink "Creator" plan row |
| Pro | **+ custom domain** (`links.yourshow.com`) | Biolink "Pro" plan row |
| Studio | + custom domain | Biolink "Pro" plan row |

This is the Podpage/Linktree convention exactly (§2.3 point 6) and matches what the shipped FAQ already promises: *"Use the free `podlink.fm/yourshow` handle or point your own domain at it."* (`resources/views/default/marketing/features/index.blade.php:172`). **Do not gate the page itself** — it is a distribution asset. Every free user's page is a `podlink.fm` link in a podcast bio.

If you want the two env var names to exist and mean something, this is where they go: `BIOLINK_CREATOR_PLAN_ID` / `BIOLINK_PRO_PLAN_ID` hold the ids of two rows in Biolink's own plans table, and Podlink writes `biolink.users.plan_id` on subscription change. Mechanics in §4.5.

### 3.6 What NOT to gate

1. **OP3 download analytics.** Podlink did not build the measurement, OP3 did, and OP3 is free. Charging for a free open-source data source is the kind of thing a podcaster will notice and post about. It is also the best free hook we have.
2. **Connecting the feed, or the number of episodes imported.** Back-catalogue import is advertised (`config/marketing.php`: *"your whole back catalogue imports in seconds"*). Metering it punishes the exact user we want — someone with 200 episodes and a real audience.
3. **Transcripts.** They are the substrate everything else is generated from and they are the cheapest thing in the stack. A transcript paywall makes the product feel like it is nickel-and-diming the input.
4. **The 100+ template library.** It is the purchased MagicAI surface, it costs nothing to expose, and hiding it makes the paid tiers look thin rather than the free tier look generous.
5. **Number of platforms you can publish to** — beyond the one-platform free limit. Charging per platform is a 2015 social-scheduler move and it teaches the user to think in channel counts.
6. **The podlink.fm page itself.** §3.5.
7. **History and exports.** Never delete or lock a user's past output on downgrade, and never gate copy/export. Buzzsprout's 90-day free-tier deletion works because it is a *host* — losing your archive on a *tool* is a betrayal, and the churn story writes itself.
8. **Seats on Free and Creator, in the sense of "you may not share this."** The FAQ already promises *"Can my producer or editor work in this with me? Yes."* Solo tiers are one seat because that's the plan shape, but the honest framing on the pricing page is "1 seat" as a fact, not "collaboration: ✗" as a feature denial — and Pro at 2 seats should be presented as *"bring your producer"*.

### 3.7 The counter-argument to my own recommendation

**The strongest objection: the metering unit is a fiction, and fictions leak.**

I am recommending you sell "about 4 episodes a month" while the system enforces a credit pool whose relationship to an episode is (a) unmeasured today and (b) genuinely variable — a 90-minute panel with four guests, a full clip set and multilingual output will burn several times what a 20-minute solo monologue burns. The first support ticket that says *"I've done three episodes and it says I'm out"* is not a bug, it is the pricing model working as designed, and there is no good reply. Every named competitor avoids this by metering the **input** (episodes or hours), which is the thing the customer already counts.

The honest alternative is to **build the episode counter first** — a `podcast_episodes` table, an increment on generation, an `episodes_per_month` plan column — and ship pricing two or three weeks later against a unit that means what it says. That is real work (§1.4), but it is bounded, and it is work you will do eventually regardless, because you cannot sell to agencies without it.

**A second, sharper objection: the tier ladder promises things the product may not yet deliver at each rung.** Sponsor reads as the Pro unlock assumes sponsor reads are good enough to be worth $30/month more than Creator. Multilingual as a Pro unlock assumes non-English output is production-quality. Neither was verifiable from the code — they are `OpenAIGenerator` template rows, and a template row's quality is a prompt, not an architecture. If either disappoints, the $49 tier has no spine and everyone stays at $19.

**A third: $129 Studio is priced for a customer that cannot use it.** Studio's implied buyer runs multiple shows. `podcast_shows` has `unique('user_id')`. Until that migration lands, Studio is 5 seats and an API key on a single feed, and a producer with six clients will look at it, understand that immediately, and leave. **Either ship the multi-show migration before Studio, or launch with three tiers (Free / Creator / Pro) and hold Studio back.** Three tiers also fits the pricing grid's hardcoded `grid-cols-3` (§1.8) without a CSS fight — which is a suspiciously convenient coincidence, and probably the right call.

**My honest position:** ship **Free / Creator $19 / Pro $49** now, with credit-pool metering and episode-shaped guidance, because zero pricing is costing more every day than an imperfect meter will. Then, inside 60 days, build the episode counter and the multi-show migration, and use them to launch Studio properly. Do not let Studio be the reason nothing ships this month.

---

## Part 4 — How to ship it

### 4.1 Order of operations

Do these in order. Steps 1–2 are read-only and must happen before anything is created.

**1. Audit the live `plans` table.** (`SELECT id, name, price, frequency, type, active, hidden, credit_system_type, shared_credits_amount, reset_credits_on_renewal FROM plans ORDER BY price;`) `magicai.sql` is not in this checkout (§1.5), so nobody currently knows what plan rows production has. If stock MagicAI demo plans are sitting there `active = 1`, they will appear on the homepage the moment `pricing_active` is on. Deactivate or delete them **via the admin panel**, not SQL — deletion goes through `PaymentProcessController::deletePaymentPlan()`, which cancels dependent subscriptions properly.

**2. Check the shared-credit switch.** `SELECT shared_credit_system_enabled FROM settings;` — `SharedCreditService::isEnabled()` reads it. The whole §3.1 metering plan depends on it being on. If it is off, turn it on in admin and smoke-test one generation before building plans. If it cannot be turned on safely, fall back to per-model `ai_models` credits (separated system) — see 4.7.

**3. Set shared credit unit costs.** Admin → Finance → Shared Credit Costs (`routes/panel.php:614`, `SharedCreditCostController`). Set the per-entity unit cost for the models Podlink actually uses (Whisper transcription, the text model behind show notes/titles/newsletter, the clips path). This determines what **E** is.

**4. Measure E.** Run one representative episode end-to-end on an admin account with the shared system on and read the delta off `shared_credit_transactions`. Do it twice — once with a 25-minute solo episode, once with a 75-minute interview — and take the higher number as E. Everything in §3.2 is `n × E`.

### 4.2 Create the plans (this also creates Stripe)

**Do not touch Stripe by hand.** Per §1.7, saving a plan in admin calls `StripeService::saveProduct()`, which creates the product and the recurring price and records the mapping in `gatewayproducts`. Creating Stripe objects manually will desync `gatewayproducts` and break checkout.

Go to **Admin → Finance → Plans → Create** (`/dashboard/admin/finance/plan/create`, `Admin\Finance\PlanController::create`, 4-step Livewire wizard `SubscriptionPlanCreate`). Create **six** rows (three tiers × monthly + annual; Free only needs one):

| # | `name` | `price` | `frequency` | `type` | Stripe product name it will create |
|---|---|---|---|---|---|
| 1 | `Free` | `0` | `monthly` | `subscription` | (FreeService — no Stripe object) |
| 2 | `Creator` | `19` | `monthly` | `subscription` | Podlink Creator — Monthly |
| 3 | `Creator Annual` | `190` | `yearly` | `subscription` | Podlink Creator — Annual |
| 4 | `Pro` | `49` | `monthly` | `subscription` | Podlink Pro — Monthly |
| 5 | `Pro Annual` | `490` | `yearly` | `subscription` | Podlink Pro — Annual |
| 6 | *(hold Studio — §3.7)* | | | | |

**Per-row settings inside the wizard:**

*Step 1 (basics + limits)* — `active = 1`; `hidden = 0`; `description` = the one-liner from §3.2; `features` = **comma-separated** bullet string (this is what renders on the card, §1.8) e.g. `Full OP3 download analytics,Transcripts on every episode,AI show notes & titles,Guest intros,Clips & social posts,Episode newsletter,Brand voice & templates,podlink.fm page — no badge`; `is_featured = 1` **on Pro monthly and Pro annual only**; `credit_system_type = shared`; `shared_credits_amount` = `n × E` per §3.2; **`reset_credits_on_renewal = 1` on every single row** (default is `0` — this is the single easiest thing to get wrong, and getting it wrong means quotas never reset); `trial_days` = 0 / 0 / 7 / 7; `plan_allow_seat` = 1 / 1 / 2; `is_team_plan` = false on Free+Creator, true on Pro (needed for the second seat); `user_api = 0` on all three; `plan_type` = `regular` / `regular` / `pro`; `affiliate_status = 1` on paid rows.

*Step 2 (AI tools + features)* — enable `brand_voice` on Creator and Pro (off on Free); `integration` (WordPress) on Pro only; `api_keys` off everywhere for now; `support` on paid.

*Step 3 (`open_ai_items`, per-template)* — this is the tier ladder from §3.2. Enable the podcast templates per tier: show notes / titles / descriptions on all three; guest intros on Creator+Pro; sponsor reads on Pro only; newsletter on Creator+Pro; multilingual on Pro only. **You need the exact `OpenAIGenerator.slug` values from the live DB** — they are seed data, not in this checkout (Q2).

*Step 4 (per-model credits)* — with `credit_system_type = shared`, step 4 is largely bypassed; leave defaults.

**After saving each row:** verify in Stripe that exactly one product and one active price were created at the right amount and interval, and that `gatewayproducts` has a row with a real `price_id` (not `Not Needed`) for `gateway_code = 'stripe'`.

### 4.3 Turn the pricing section on

1. **Admin → Frontend → Section Settings** (`/dashboard/admin/frontend/section-settings`). Set `pricing_active = 1` (it likely already is — §1.8).
2. On the same form set:
   - `pricing_title` → e.g. `Pricing that scales with your show, not your workload.`
   - `pricing_description` → one line, podcast-native.
   - `pricing_save_percent` → **`2 months free`** (stock default is `Save 30%`, which is wrong for this market — §2.3 point 4).
3. Save. `Plan::saved` busts `PlanService`'s `rememberForever` cache automatically (`Plan.php:141`), so the homepage picks it up on the next request. `config:cache` is deliberately disabled on this deployment (`docker-entrypoint.sh`), so no cache step is needed.
4. Load `/` and confirm the Monthly/Annual tabs render and the annual tab shows the badge.

With **three** tiers this fits the hardcoded `grid-cols-3` in `landing-page/pricing/section.blade.php` with no CSS work. With four it will not.

### 4.4 Ship `/pricing` as a marketing page — yes, do it

The homepage section is enough to start taking money, but not enough to sell. Reasons a dedicated page is worth the day:

- **The stock card is wrong for this market.** `plan-details-card.blade.php` leads with *"Access 47 Features"* and a hover popover of AI template checkboxes (§1.8). A podcaster does not buy "47 features"; they buy "four episodes a month, done."
- **`grid-cols-3` is hardcoded**, which caps the homepage section at three tiers forever.
- **The intent is already recorded in the code** — the route is stubbed in `routes/custom_routes_web.php` and `MarketingController::features()` has the swap-the-URL comment.
- SEO: `/pricing` is a real commercial-intent landing page. An anchor is not.

**Do both.** Homepage section for the scroller, `/pricing` for the buyer.

**Mechanics:**

1. **Route** — uncomment the stub in `routes/custom_routes_web.php`: `Route::get('pricing', 'pricing')->name('pricing');` (inside the existing `marketing.` group, so the name is `marketing.pricing`).
2. **Controller** — add `MarketingController::pricing()` returning `view('marketing.pricing.index', [...])` with meta, `config('marketing.pricing')`, and `$primaryCta`.
3. **Copy** — add a `'pricing' => [...]` block to `config/marketing.php` (tiers, FAQ items, comparison rows). Same rationale as the existing `groups` block: versioned, survives a MagicAI upgrade, no admin toggle needed.
4. **View** — `resources/views/default/marketing/pricing/index.blade.php`, `@extends('marketing.layout')`, content in `@section('marketing')`.
5. **Swap the features-page CTA** from `route('index') . '#pricing'` to `route('marketing.pricing')` (`MarketingController.php:39`) and add `/pricing` to the header/footer nav.

**Prices: hardcode them in `config/marketing.php`, do not read the `plans` table.** The marketing page is copy, and reading live plan rows would couple a public page to admin edits and to `PlanService`'s cache. Accept the duplication; it is two numbers, and the mismatch risk is a launch-checklist item, not an architecture problem.

### 4.5 The CSS constraint — this is the part that will bite

**There is no asset build on deploy.** Both stylesheets say so in their headers, `.gitignore` documents `/public/build` as committed, and `docker-entrypoint.sh` never runs `npm run build`. **Any Tailwind utility class not already in the committed `public/build/assets/*.css` renders as nothing.**

What exists to build with — the complete `pl-*` inventory in `public/themes/default/assets/css/frontend/podlink-marketing.css`:

`pl-page` `pl-wrap` `pl-section` (`--alt` `--ink` `--tight`) `pl-section-head` (`--center`) `pl-hero` (`__inner` `__note`) `pl-h1`–`pl-h4` `pl-lead` `pl-text` `pl-eyebrow` `pl-muted` `pl-center` `pl-link` `pl-badge` (`--neutral` `--solid`) `pl-btn` (`--primary` `--secondary` `--outline` `--ghost` `--lg` `--sm` `--block` `--disabled`) `pl-btn-row` (`--center`) `pl-card` (`__body` `__foot` `__icon` `__title` `--interactive`) `pl-grid` (`--2` `--4`) `pl-group` (`__head` `__intro` `__grid`) `pl-feature` (`--reverse` `__body` `__media` `__list` `__cta`) `pl-faq` (`__item` `__q` `__a`) `pl-cta` (`__inner` `__note`) `pl-strip` (`__item` `__label` `__value` `__logo`) `pl-mock` (`__label` `__line` `__bar` `__bars`) `pl-shot` (`--bleed` `--ink` `__chrome`) `pl-field` `pl-label` `pl-input` `pl-select` `pl-textarea` `pl-form-inline` `pl-help` `pl-error` `pl-sr-only` `pl-mb-0`
Plus `pl-focusable` and `pl-visually-hidden` in `podlink-tokens.css`.

**Note there is no `.pl-grid--3` and no table classes.** A three-column price row and a feature-comparison table both need **new hand-written CSS** appended to `podlink-marketing.css`. That is fine and expected — it is a plain stylesheet served straight from `public/` — but it must be *written*, not composed from Tailwind utilities.

Rules when writing it:
- Colour tokens are **bare HSL triplets**: `color: hsl(var(--pl-text-primary));`, `background: hsl(var(--pl-accent) / 12%);`. Never `var(--pl-accent)` directly — it renders nothing.
- **The orange trap:** `#FF8C00` on white is 2.33:1 — fails AA for text *and* for UI. Orange is a **fill**, never text-on-light. For orange text/icons on light use `--pl-accent-text-safe`. Filled buttons must be **ink on orange**, never white on orange. All measured and documented in the `podlink-tokens.css` header.
- Non-colour tokens are literal: `padding: var(--pl-space-6);`.
- **Bump `config('marketing.asset_version')`** (currently `'2'`, `config/marketing.php:36`) whenever either stylesheet changes — it is the only cache-buster, since the files are served unhashed.
- The marketing layout already `@push('css')`es `podlink-marketing.css`, and `layout/app.blade.php:98` already loads `podlink-tokens.css`. Nothing new to wire.

Suggested new classes: `.pl-grid--3`, `.pl-price`, `.pl-price__tier`, `.pl-price__amount`, `.pl-price__period`, `.pl-price__note`, `.pl-price--featured`, `.pl-price__list`, `.pl-price__list li[data-included]`, `.pl-toggle` (monthly/annual — pure CSS with a hidden checkbox, no JS, matching the `<details>`-based FAQ precedent), `.pl-compare` + `.pl-compare__row` + `.pl-compare__cell`.

### 4.6 podlink.fm plan mapping

Per §1.6 there is no existing mechanism. Two options:

**(a) Patch Biolink's admin API (cleaner).** Add `plan_id` handling to `AdminApiSSO::login()` and `::update()` in `/root/podlink/biolink/app/controllers/admin-api/AdminApiSSO.php` — `User::create()` already takes `$plan_id` and a plan-settings JSON as arguments (line ~149, 208), so `login()` only needs to pass through a POST param instead of the hardcoded `'free'`, and `update()` needs `plan_id` added to its `$to_update` whitelist. Then Podlink POSTs the mapped plan on subscription change. **Downside:** patching a purchased AltumCode script; an update wipes it. Keep the diff in git and re-apply.

**(b) Write `biolink.users.plan_id` directly.** `create-biolink-db.php` proves magicai's DB user sits on the same MySQL instance and can create the `biolink` database. A small Podlink service could `UPDATE biolink.users SET plan_id = ?, plan_settings = ? WHERE email = ?` on subscribe/cancel. **Downside:** cross-application DB writes, bypassing Biolink's own plan-expiry logic (`User.php:70-74` downgrades expired plans on read — which actually works in our favour as a safety net).

Either way: create two plan rows in **Biolink's** admin first, then put their ids in `BIOLINK_CREATOR_PLAN_ID` / `BIOLINK_PRO_PLAN_ID`, add them to `config/services.php` under `biolink`, and to `.env.example`. That is the moment those two names stop being aspirational.

**This is not launch-blocking.** Ship pricing with the podlink.fm page identical across tiers, and describe custom domain as "coming to Pro" — or omit it from the table entirely until it works. Do not list a feature the code cannot deliver.

### 4.7 Fallback if shared credits can't be switched on

Set `credit_system_type = separated` and use step 4 of the plan wizard to set per-model credits in `ai_models`. The user then sees several separate balances (words / images / minutes) instead of one number, which is a materially worse pricing story — but it works today and needs no setting change. Keep `reset_credits_on_renewal = 1` either way. If you go this route, the pricing page should stop talking about quotas at all and sell on **feature tiers only**, because a multi-balance meter cannot be explained in a pricing table.

### 4.8 Pre-launch checklist

- [ ] Live `plans` table audited; stock/demo plans deactivated via admin
- [ ] `shared_credit_system_enabled` confirmed on; one generation smoke-tested
- [ ] Shared credit unit costs set for the Podlink model set
- [ ] **E** measured from two real episodes; `shared_credits_amount` derived
- [ ] `reset_credits_on_renewal = 1` verified on **every** plan row
- [ ] Stripe: one product + one active price per paid row; `gatewayproducts.price_id` populated for `stripe`
- [ ] End-to-end test purchase on each paid tier (test mode), incl. `STRIPE_WEBHOOK_SECRET` delivery
- [ ] Downgrade path tested — confirm past outputs remain visible (§3.6 point 7)
- [ ] Free plan assigns on register (`route('register', ['plan' => $id])` from the card) and `$user->relationPlan` resolves
- [ ] `pricing_active = 1`; `pricing_save_percent = "2 months free"`
- [ ] Prices in `config/marketing.php` match the `plans` rows
- [ ] `marketing.asset_version` bumped after CSS changes
- [ ] Features-page secondary CTA repointed to `route('marketing.pricing')`
- [ ] Pricing page checked at 375px, 768px, 1440px

---

## Open questions for Joelle

**Q1 — What is actually in the live `plans` table?** `magicai.sql` isn't in this checkout and there's no `.git` here. If stock MagicAI demo plans are sitting there `active = 1`, they appear the instant pricing is switched on. Need a `SELECT` before anything else. *(Blocks 4.1.)*

**Q2 — What are the real `OpenAIGenerator.slug` values for the Podlink templates?** The per-tier gating in step 3 of the plan wizard is keyed on them, and they're seed data I can't see. Need the list from the live DB, or from `magicai.sql`. *(Blocks 4.2 step 3.)*

**Q3 — Is `shared_credit_system_enabled` on, and if not, are you comfortable turning it on?** The whole "one number of credits" story depends on it. If it's off and risky to flip, we drop to §4.7 and the pricing page sells feature tiers with no quota story at all — which is a meaningfully weaker page.

**Q4 — Three tiers now, or wait for Studio?** My recommendation is Free / Creator $19 / Pro $49 this month, Studio once the multi-show migration lands (§3.7). Three tiers also happens to fit the homepage's hardcoded `grid-cols-3`. Say the word if you want Studio at launch anyway and I'll price it as a contact-sales tier instead of a self-serve one.

**Q5 — How good are sponsor reads and multilingual, really?** They're the two Pro unlocks carrying the $30 gap over Creator. If either is a thin prompt, the $49 tier has no spine. I could not assess template quality from the code.

**Q6 — Grandfathering.** Are there existing users on plans today? `StripeService::saveProduct()` deactivates old prices and calls `updateUserData()` on a price change, which can cancel live subscriptions. If anyone is paying, we need an explicit migration plan before touching their plan row.

**Q7 — Does anything already promise a price?** I found no price anywhere in the codebase, but if a price has been quoted in a newsletter, a Discord, or to a beta cohort, it constrains the $19/$49 choice and I should know before this ships.

**Q8 — Should I verify the §2 competitor numbers?** Six rows are marked VERIFY and I couldn't fetch them from this sandbox (egress policy). It's ~20 minutes of manual browsing, or you can approve web fetching and I'll redo the table properly. **No number from §2 should appear in public copy until this is done.**
