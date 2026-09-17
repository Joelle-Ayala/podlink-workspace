# PODLINK ECOSYSTEM AUDIT CONTEXT V3

Produced: 2026-09-16. Method: direct read-only inspection of the actual repository at
`podlink-workspace` (git main @ `04bee89ef`), plus read-only checks of live production
(podlink.ai, app.podlink.ai, Railway deployment metadata, Vercel deployment metadata).
No production code, feeds, Railway config, OAuth grants, or billing were modified.
Business/GTM context incorporated from `PODLINK_EXTERNAL_CONTEXT.md` (owner-provided);
where repo canon and that file conflict, the conflict is called out explicitly.

Statuses used: ✅ Live · 🟡 Partial · 🔵 Built but hidden · ⚪ Planned/scoped only ·
🔴 Legacy/debt · ❌ Missing.

Environment variable NAMES appear below; no values or secrets are reproduced anywhere.

---

# 1. Executive summary

**What PodLink actually is today (verified in code + live):** a three-app composite —

1. **`web/`** — a custom Next.js 16 / React 19 / Tailwind 4 marketing site on Vercel at
   **podlink.ai** (✅ live, 20 routes incl. 8 feature pages, 6 service pages, 18 case
   studies, /work, /claude, /studio, /report/[hash], legal pages, llms.txt).
2. **`magicai/`** — the product app at **app.podlink.ai** on Railway: a MagicAI
   **v10.8.1** Laravel fork (verified `magicai/version.txt` = 10.81) carrying all the
   custom podcast work: OP3 analytics dashboard, RSS episode ingestion, Whisper
   transcript pipeline, YouTube OAuth + Analytics (incl. demographics), public Show
   Report, contact discovery, and a **live 8-tool read-only MCP server** at
   app.podlink.ai/mcp (OAuth 2.1 + DCR + PKCE, ToolAnnotations, rate-limited).
3. **`biolink/`** — vendored **66biolinks v68.0.0** (AltumCode, non-Laravel) at
   **podlink.fm** as the public link-page/smart-link layer, front-door-redirected into
   the main app (register/login/homepage 302 to app.podlink.ai / podlink.ai), joined by
   email-keyed SSO and a read-only cross-DB stats bridge into the dashboard/report/MCP.

**Intended product** (external context + repo canon agree): a podcast growth operating
system — software (free OP3 analytics wedge → paid tiers) + productized services
(evolved from the Minting House agency) + later commerce, marketplace, and media. The
repo's positioning canon has already converged on a sharper wedge than the generic
suite: **"the report is the product"** — the shareable, sponsor-checkable Show Report,
with "talk to your podcast" (Claude/MCP over analytics + transcripts) as second act and
AI content tools as the "oh, bonus" layer. This is validated externally in
`claude/cross-channel-report-validation.md` and expressed on the live homepage
(REPORT_BAND, verified live 2026-09-16; see §36).

**Live vs partial vs planned, at the highest level:**
- ✅ Live: marketing site with claims-audited copy; OP3 dashboard; episode sync;
  transcripts (Whisper, credit-metered, FULLTEXT-searchable); episode detail page;
  Show Report public page + share toggle; YouTube connect + views + demographics;
  Biolink read bridge (page views/clicks in dashboard, report, MCP); contact discovery
  P1 (keyless contact cards; Podcast Index search inert until keys); MCP server with 8
  read-only tools; legal drafts (privacy, terms) live but awaiting founder read.
- 🔵 Built but hidden: /pricing (noindex, decoupled flip checklist), /features/mcp
  marketing page (index-flip gated), MagicAI Teams (setting-gated off), personal API
  keys (setting-gated off), full launch comms package (staged, gated on founder GO).
- ⚪ Planned/scoped only: clips rendering, social posting/analytics, CRM/outreach send
  layer, sponsor/media-kit tools, commerce, marketplace, Podcast Memory chat UI.
- ❌ Missing entirely (no schema, no code): clip, social_post, campaign, sponsor,
  advertiser, merchant, product/order/conversion (commerce sense), placement/case-study
  CMS models, contact/deal/pipeline.

**ICPs:** the site serves two funnels ("two doors" on the homepage): DIY podcasters
(software, free-first) and done-for-you services buyers (6 service pages with real
tiered pricing). The external context's high-ticket ICP lanes (agencies/networks, PR
firms, associations, VC/PE, founders) have **no dedicated /solutions/* or /partners/*
pages yet** (verified absent) — the largest single gap between the strategy file and
the built site.

**Biggest technical risks:** (1) three parallel auth/billing/analytics stacks (MagicAI,
Biolink, plus Stripe-not-yet-wired pricing) — bridged, not unified; (2) Biolink
`track_links` 90-day default retention silently truncating the bridge's data window;
(3) vendor-fork upgrade paths (MagicAI v11, 66biolinks updates) versus customizations;
(4) episode↔YouTube pairing is naive title-matching; (5) one-show-per-user constraint
(`podcast_shows.user_id` unique) blocks multi-show/Studio/agency use until migrated.

**Site/product mismatches** are small and mostly deliberate (claims were truth-audited
in `claude/feature-claims-truth-audit.md`): clips pages sell the *service* and describe
AI clip tooling in honest future/DIY terms; pricing page is noindex until limits are
enforced in the app. Details in §21 and §42.

---

# 2. MagicAI foundation

**Version/fork:** MagicAI **v10.8.1** (`magicai/version.txt` = `10.81`, normalized by
`app/Helpers/helpers.php:1098`). Laravel ^10, PHP ^8.2. Vendor updater config intact
(`config/magicaiupdater.php` → api.liquid-themes.com). PodLink customizations are
additive and isolated in upstream extension points (`routes/custom_routes_web.php`
hook, `config/podlink.php`, `routes/mcp.php`, new controllers/services/migrations), so
the fork is upgrade-tolerant in principle; §38 covers the practical upgrade gate.

**Critical structural fact: the extension marketplace is installed but EMPTY.** The
registry knows ~106 extension slugs (`app/Domains/Marketplace/…`,
`MarketplaceServiceProvider.php:135–241`) but `app/Extensions/` contains no code and
the seed DB has no extension rows. Every extension-gated feature below is therefore
"upstream-catalog, not present" — it would require purchasing/installing the extension,
not just flipping a switch.

Inventory (installed state verified in code + seed dump; live DB settings can differ):

| Capability | Status | Evidence / notes |
|---|---|---|
| AI writer templates, documents, workbook | ✅ enabled core | `routes/panel.php:217–351`; seed `feature_ai_writer=1` |
| AI chat (multi-model), PDF/File chat, vision | ✅ enabled core | `feature_ai_chat=1`, `feature_ai_pdf=1`, `feature_ai_vision=1` |
| AI Article Wizard, AI RSS generator, rewriter, code | ✅ enabled core | seed flags =1 |
| Image generation (DALL·E 3; SD service present) | ✅ enabled core | Pro image extensions (Flux, Midjourney…) ❌ not installed |
| Speech-to-text (Whisper) | ✅ enabled core | PodLink transcript pipeline builds on the same Whisper entity/metering |
| TTS / voiceover | ✅ enabled core | OpenAI TTS seeded on; ElevenLabs voice-clone 🔵 code present, disabled + keyless |
| BrandVoice (company/product voice) | ✅ enabled core | `Dashboard/BrandController`, `Services/User/BrandService` |
| AI Video core | 🟡 | core flag on, but Video Studio / UGC hubs are empty shells (their content extensions ❌ absent) — dead pages if reached by URL |
| Chatbots / external embed chat | 🔵 disabled | controllers + models exist; user routes commented out; `chatbot_status='disabled'`; menu hard-hidden |
| Newsletters / email marketing | ❌ not installed | only transactional mail; Mailchimp extension absent |
| Social media suite (connect/schedule/publish/analytics) | ❌ not installed | `social-media*` extensions absent; SDKs vendored but unused; `SocialMediaAccounts` model = footer links only |
| AI Agents (builder, channels) | ❌ not installed | only residue (plan-limit migrations, avatar seeder) |
| CRM (contacts/deals/pipelines) | ❌ not in this fork | zero CRM code; v11 "AI-Powered CRM" is upstream-only. Verified separately (canon `contact-discovery-p3-amendment.md`): v11's CRM is a pipeline CRM, NOT an email sequencer |
| Gmail/Outlook mailbox integration | ❌ not installed | `ai-agent-gmail/outlook` extensions absent |
| Teams / workspaces | 🔵 built, hidden | full core code; `team_functionality=0` seed → admin toggle is the Studio-tier enabler |
| Credits system + shared credit pool | ✅ core | `Services/Credits/CreditsService`; shared-pool gated by setting |
| Plans/subscriptions/trials/coupons | ✅ core, ⚠ unwired | Stripe via cashier + ~11 other gateways in code; seed `stripe_active='0'`; PodLink tiers exist only as marketing config (`config/marketing.php` pricing marked PLACEHOLDER, no Stripe products) |
| Mobile REST API (Passport) + Swagger | ✅ core | `routes/api.php`; personal API keys 🔵 hidden (`user_api_option=0`) |
| Outbound webhooks/automation platform | ❌ | none |
| MCP | ✅ custom PodLink build | see §11 — this is the fork's real public API surface |

**Generic features that should probably remain hidden** (align with external-context
§8 "don't be generic AI tools for podcasters"): AI code generator, DeFi leftovers
(`app/Services/DeFi/` 🔴), generic chat-image, Video/UGC hub shells, article
wizard/RSS generator until reframed as podcast-native workflows.

---

# 3. BioLink / 66biolinks foundation

**Version:** 66biolinks **v68.0.0** (code 6800) — `biolink/update/info.php`,
`app/includes/product.php`; Altum framework (custom PHP, not Laravel); deployed as
Railway service `biolink-public` (php:8.4-apache) serving podlink.fm
(`biolink/RAILWAY-NOTES.md`).

**Plugin reality check:** all 15 plugin dirs (`plugins/pro-blocks`, `ultimate-blocks`,
`payment-blocks`, `teams`, `pwa`, `aix`, …) are config-stubs with `status =>
'inexistent'` — **no plugin code shipped**. Only the default block set exists.

| Capability | Status | Notes |
|---|---|---|
| Biolink pages, ~19 default blocks | ✅ | incl. Spotify, YouTube, SoundCloud, Twitch, Vimeo, TikTok-video embeds. ❌ No Apple Podcasts, RSS, or generic audio-player block (those live in absent ultimate-blocks) |
| Short links / redirects / file / vCard / event link types | ✅ | `app/controllers/l/Link.php` (2,434 lines) |
| Click/pageview analytics | ✅ | `track_links` events + denormalized `links.clicks`; bot-filtered (WhichBrowser), `is_unique` via 24h cookie, GeoLite2 city/country. ⚠ Cron deletes rows older than plan `track_links_retention` (default **90 days**) — bounds the PodLink bridge |
| UTM capture + 9 pixel providers | ✅ | facebook, GA, GTM, linkedin, pinterest, twitter, quora, tiktok, snapchat |
| QR codes | ✅ full subsystem | |
| Custom domains | ✅ upstream | admin-api for domains exists |
| Templates/themes | ✅ upstream | single UI theme `themes/altum` + PodLink override CSS |
| User-level API | ✅ upstream | Bearer `users.api_key` (auto-generated per user); gates: site setting AND plan setting; 60 req/60s hardcoded. `ApiStatistics` exposes per-link stats incl. overview/pageviews/visitors — **native alternative to the DB bridge existed**; bridge chosen anyway (one query path, no per-user key management). Worth recording as a deliberate trade |
| Payment/commerce blocks | ❌ | only default `paypal` block; Stripe/product blocks in absent payment-blocks plugin |
| Own SaaS billing (plans, ~20 payment webhooks, invoices, affiliates) | 🔵 present, bypassed | front-door redirects only; `/plan` deliberately still live; processors' enablement lives in DB (not repo-verifiable). Risk flagged §38 |
| White-label/branding | ✅ | PodLink logos in `uploads/main/*.svg`, `podlink-overrides.css` in all three wrappers |
| SEO on public pages | 🟡 | title/meta/OG per plan setting; canonical set; **no JSON-LD on public bio pages** |

**PodLink customizations inside biolink/** (all comment-marked, verified complete by
repo-wide 'podlink' search): `app/controllers/Index.php` (302 → podlink.ai; env
`HOMEPAGE_REDIRECT_URL`, kill-switch `HOMEPAGE_REDIRECT_DISABLED`), `Blog.php` (bare
/blog redirect), `Login.php` (→ app.podlink.ai/login; SSO one-time-code path kept;
`?podlink_native=1` admin escape), `Register.php` (→ app register; team-invite flow
kept native), sidebar/menu "Back to Podlink" links, wrapper CSS include, custom
`docker-entrypoint.sh` (Apache on $PORT; config from `DATABASE_*`, `SITE_URL`),
`Dockerfile`, `RAILWAY-NOTES.md`.

---

# 4. Merged architecture

```
                       ┌────────────────────────────────────────────┐
 podlink.ai  (Vercel)  │  web/  Next.js 16 marketing site           │
   - all public pages  │  /report/[hash] fetches ──┐                │
   - llms.txt, sitemap └───────────────────────────┼────────────────┘
                                                   │  public JSON (30-min cache)
 app.podlink.ai (Railway svc podlink-workspace)    ▼
   ┌───────────────────────────────────────────────────────────────┐
   │ magicai/  Laravel (MagicAI v10.8.1 fork)                      │
   │  auth: Laravel + Passport (OAuth AS for MCP)                  │
   │  dashboard: analytics / podlink page / discovery / AI tools   │
   │  MCP: /mcp Streamable HTTP, 8 read-only tools                 │
   │  services: Op3Service · EpisodeSyncService · YouTube* ·       │
   │            BiolinkStatsRepository · Discovery/*               │
   │  worker svc (podlink-worker): queue:work --timeout=900        │
   │            + scheduler loop (TranscribeEpisodeJob)            │
   └───────┬────────────────────────────┬──────────────────────────┘
           │ MySQL (Railway svc MySQL:  │ Redis (Railway svc Redis:
           │  magicai DB + biolink DB   │  cache, queue,
           │  on the same instance)     │  retry_after 960)
           ▼                            ▼
   ┌───────────────────────────────────────────────────────────────┐
   │ biolink/  66biolinks v68 (Railway svc biolink-public)         │
   │  podlink.fm public pages + click tracking (track_links)       │
   │  SSO: admin-api/sso/login (email-keyed, one-time login code)  │
   └───────────────────────────────────────────────────────────────┘
   Bridge: magicai `biolink` DB connection (BIOLINK_DB_* env as Railway
   reference vars) → BiolinkStatsRepository ONLY, SELECT-only, pinned
   schema (users/links/track_links), 6h drift guard → 'unavailable'.
   External APIs: OP3 (bearer), YouTube Data v3 + Analytics v2 (OAuth),
   OpenAI (Whisper/generation), Podcast Index (inert until keys).
```

**Repos/dirs:** one GitHub monorepo `Joelle-Ayala/podlink-workspace` (private):
`web/` (Vercel project `podlink`, deploys on push), `magicai/` (Railway app + worker,
watch-path filtered, predeploy `php artisan migrate --force`), `biolink/` (Railway
biolink-public), `claude/` (canon docs, §40).

**Identity:** one human = a MagicAI user + a Biolink user, joined **only by email**
via SSO (`biolink/app/controllers/admin-api/AdminApiSSO.php` finds-or-creates by
email). Email change in one app desyncs the other unless sso/update is called — known
debt. Sessions/billing are per-app; the strategy is MagicAI-as-authoritative with
Biolink billing bypassed at the front door.

**Domains:** podlink.ai (Vercel), app.podlink.ai (Railway magicai), podlink.fm
(Railway biolink; root 302 → podlink.ai). GA4 + Search Console (both domains) + Bing
configured (session-verified earlier; weekly GSC pull is a manual Monday task by
standing decision — the in-app scheduler tool is banned after freezing the desktop app
twice).

Technical debt summary lives in §38.

---

# 5. Canonical podcast data model

Custom migrations (all in `magicai/database/migrations/`, exactly six):

- `2026_07_09_000001_create_podcast_shows_table.php` — `podcast_shows`: user_id (FK,
  **unique → ONE SHOW PER USER**), rss_feed_url, op3_show_uuid, + later
  `episodes_last_synced_at` (…000002), `report_share_hash` (unique) +
  `report_enabled_at` (2026_09_02…).
- `2026_08_23_000001_create_episodes_table.php` — `episodes`: podcast_show_id FK, guid
  (unique per show; sha1 fallback), title, description, pub_date, audio_url,
  duration_seconds, **youtube_video_id** (nullable — the audio↔video join),
  timestamps; index (show, pub_date).
- `2026_08_23_000003_create_youtube_connections_table.php` — `youtube_connections`:
  user_id (FK, unique), channel_id/title, uploads_playlist_id, encrypted access +
  refresh tokens, token_expires_at.
- `2026_08_31_000001_create_episode_transcripts_table.php` — `episode_transcripts`:
  episode_id (FK, unique), status enum, body (longText, **FULLTEXT**), language,
  provider ('whisper-1'), audio_seconds, word_count, credits_charged, error,
  completed_at.

Models: `PodcastShow` (belongsTo User, hasMany Episode, `reportEnabled()`), `Episode`
(hasOne EpisodeTranscript), `EpisodeTranscript` (status helpers), `YoutubeConnection`
(encrypted+hidden tokens, `tokenIsExpired()`).

**Canonical-Episode readiness:** Episode↔audio ✅ (enclosure), Episode↔YouTube full
video 🟡 (single `youtube_video_id` column; naive title pairing; no confidence score,
no manual-override UI), Episode↔transcript ✅. Episode↔Shorts/TikTok/IG/FB/X/
LinkedIn/Twitch/newsletter/clips/smart-links/sponsorship/commerce: ❌ **no asset,
social_post, clip, or link-attribution tables exist**. The model is a clean spine for
"True Episode Audience v1" (audio + one YouTube video) but a derivative-asset table
(episode_id, platform, external_id, url, type) is the missing keystone for everything
in external-context §6-later and §13.

**Explicitly absent entities** (checked against full migration + model lists): clip,
social_post, campaign, sponsor, advertiser, merchant, product/order/conversion
(commerce), contact, deal, pipeline, placement, case_study, work/portfolio. (Stock
MagicAI `Company`/`Product` models are BrandVoice fixtures; `user_orders` is stock
billing — neither is a podcast entity.)

**Multi-tenancy limits:** shows and YouTube connections are keyed to a single user
(both unique on user_id) — no workspace/team ownership of a show. Turning on MagicAI
Teams (🔵) gives seat-sharing of AI tools but does NOT make shows team-scoped; Studio/
agency tier needs a show-ownership migration (user_id → workspace/team or a pivot).

---

# 6. OP3

✅ Live. `magicai/app/Services/Op3Service.php` (422 lines): API client for
`https://op3.dev/api/1` (bearer `services.op3.api_token`, env `OP3_API_TOKEN`).
Methods: `showByFeedOrGuid` / `showByFeedUrl` (urlsafe-base64 feed URL),
`downloadsForShow` (monthly downloads, weekly average, num_weeks),
`topAppsForShow` (last-3-months absolute counts → % share, top 10),
`recentEpisodes`, `inspectFeed` (extracts `<podcast:guid>`, detects whether
enclosures carry the `https://op3.dev/e/` prefix, feed title), `fetchFeedBody`
(UA "Podlink/1.0"). Caching: 1 hour on API GETs and feed inspection; failures log and
return null (graceful-null philosophy — matches OP3's no-SLA community status, risk R3
in canon).

Flow: user pastes RSS on the Analytics page → `AnalyticsController@connect` creates
the one `podcast_shows` row → `inspectFeed` decides state: no-OP3-prefix (honest
"add the OP3 prefix at your host" instructions — **PodLink never modifies feeds**),
prefix-but-no-uuid (one-shot re-resolution + write-back via `UserShowResolver`), or
resolved (stats render). Storage: only `op3_show_uuid` persisted; downloads/apps are
cache-through, not warehoused. ⚠ Consequence: no historical snapshotting on PodLink's
side — trend charts beyond OP3's own window aren't possible yet; a small
downloads-snapshot table is the cheap fix when charts are wanted.

UI: `views/default/panel/user/analytics/index.blade.php` (downloads card, top-apps,
episodes list w/ transcribe buttons, report toggle, biolink card, YouTube cards,
Find-Shows cross-link). Privacy: OP3 is aggregate-only; nothing user-identifying sent
except the feed URL. Known bugs: none open; the geography endpoint is not consumed yet
(OP3 offers it; dashboard doesn't show it — cheap win).

# 7. YouTube — HIGH PRIORITY

Status: 🟡→✅ substantially built and live; demographics real-data verify pending a
scoped reconnect (founder tap).

- **OAuth**: `YouTubeOAuthService` (Socialite Google from explicit `services.youtube.*`
  config; env names `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, redirect). Scopes:
  `youtube.readonly` + `yt-analytics.readonly` (added for ML2; pre-scope connections
  get an honest `needs_reconnect` state rather than silent failure). Offline access +
  forced consent; refresh-token preservation when Google withholds a new one; tokens
  encrypted at rest (`youtube_connections`, encrypted cast + hidden).
- **Channel/videos**: `YouTubeAnalyticsService` — `syncChannel` (channels?mine=true),
  `videos` (uploads playlist, up to 200, 1h cache), `videoStats` (views in 50-id
  chunks), `viewsByVideoId`.
- **Episode matching**: `pairEpisodes` — normalized exact-title match + ≥15-char
  prefix; writes `episodes.youtube_video_id`. ❌ No manual mapping UI, no confidence
  scoring, no auto-rematch on new uploads. This is the weakest link for "True Episode
  Audience" accuracy claims.
- **Demographics (ML2)**: `demographics()` — YouTube Analytics API v2 reports:
  viewerPercentage × ageGroup,gender (deliberately WITHOUT subscribedStatus to avoid
  the 200% double-count), views × country top-10, 90-day window, 6h cache; returns
  ok | needs_reconnect (401/403) | no_data. Rendered as a 3-state dashboard card and a
  consented ok-shape-only "Audience" section on the public Show Report.
- ❌ Not built: watch time / AVD / traffic sources / retention / subscribers-gained
  (the API v2 client can fetch these — same auth, new metric params; genuinely cheap),
  Shorts as a distinct surface, upload/publish (write scope deliberately out).
- Quota: read-only scopes, per-user OAuth (each user consumes their own quota
  context); 1h/6h caches keep calls low. No quota-exhaustion handling beyond graceful
  errors.

**True-Audience readiness: one migration away from headline-grade.** Downloads
(OP3) + paired YouTube views already render side-by-side on episode rows, episode
detail, and the Show Report. The gap to the external-context vision is watch-time
metrics (cheap), pairing robustness (moderate), Shorts/derivative assets (needs the
asset table, §5).

# 8. Social

❌ Not built, by explicit sequencing decision — and the upstream shortcut does not
exist in this install (social-media extensions absent, §2).

Verified prep that DOES exist (`claude/tiktok-meta-app-review-prep.md`,
`claude/media-kit-demographics-spec.md`):
- **Instagram**: `instagram_manage_insights` demographics verified REAL (age brackets,
  gender, 45 cities+countries; requires Business account + FB Page, 100+ followers,
  owner-only). App-review application drafts written; blocked on founder identity
  fields.
- **TikTok**: Display API verified to have **NO audience demographics** (reach/counts
  only: user.info.basic/stats/video.list). The earlier media-kit spec was corrected —
  do not promise TikTok demographics anywhere.
- Meta/TikTok app submissions: prepared, gated on founder taps + external comms gate.

Episode → Asset → Social-Post → Analytics chain: ❌ no tables (§5). Any social layer
(native build or future extension purchase) should land on the derivative-asset table
first, or attribution will be unrecoverable later.

# 9. Twitch

Embeds only. Biolink ships a `twitch` embed block (✅, default set). No Twitch OAuth,
account linkage, video sync, analytics, or episode mapping anywhere (❌, verified by
search). Matches external context ("may later be another source").

# 10. AI content engine

Upstream core (✅ enabled, generic): writer templates incl. blog/SEO-adjacent
templates, article wizard, rewriter, AI chat, PDF/file chat, vision, image gen, TTS,
speech-to-text, BrandVoice, YouTube-caption-to-content generator, AI RSS.

PodLink-native (✅ custom): episode transcription pipeline (§12), transcript-aware
MCP tools, show-notes generation via templates (marketed at /features/show-notes with
honest copy).

❌ Not built (and marketed honestly as such after the claims audit): clip moment
identification, clip rendering, thumbnails-for-clips, social calendars/repurposing
automation, newsletter generation as a wired flow (template exists; no send layer).
`clips-and-social` feature page copy was explicitly reframed (truth-audit row 8) to
sell the service and describe software in future/DIY terms.

# 11. MCP — architecture and total feature coverage

**State: ✅ LIVE in production** at `https://app.podlink.ai/mcp` (Streamable HTTP,
JSON mode forced). Stack: `php-mcp/laravel` 4.0.0 / `php-mcp/server` 3.3.0 / schema
1.0.2. Auth: OAuth 2.1 with PKCE; Laravel Passport as authorization server; RFC 9728
protected-resource discovery + RFC 8414 AS metadata + **RFC 7591 dynamic client
registration** (`routes/ai.php`, `Mcp/OAuthDiscoveryController`,
`Mcp/ClientRegistrationController`); e2e-verified from claude.ai as a custom
connector. ChatGPT-connector test matrix staged (`claude/launch/
listings-and-rehearsal.md` §5). Rate limits (RouteServiceProvider named limiters):
`mcp` = 60/min + 2,000/day per user (env `MCP_RATE_LIMIT_PER_MINUTE` / `_PER_DAY`),
`mcp-register` = 10/hr per IP, plus `throttle:api` on the group; unauthenticated
requests → 401 (live-verified 2026-09-16).

**Registered tools — the complete surface is `routes/mcp.php` (attribute discovery
OFF; no tool accepts identity parameters; tenancy via `ResolvesMcpUser` +
`UserShowResolver`/`PodlinkPageResolver`; every tool carries ToolAnnotations
readOnlyHint:true, openWorldHint:false):**

| Tool | Input | Backing service | Gate tier (canon) |
|---|---|---|---|
| get_show_overview | — | Op3Service + UserShowResolver | FREE |
| get_top_apps | — | Op3Service | FREE |
| list_episodes | limit 1–50 | EpisodeSyncService/Episode | FREE |
| get_podlink_page | — | PodlinkPageResolver | FREE |
| search_transcripts | query, limit 1–20 | FULLTEXT over episode_transcripts | FREE |
| get_transcript | episode_ref, part | EpisodeTranscript (paged) | FREE |
| get_page_stats | — | BiolinkStatsRepository (bridge) | FREE |
| get_recent_performance | — | composite: last-5 episodes + honest computed observations (view outliers ≥2×/≤0.4× median when ≥3 rows; ≥14-day cadence gap; transcript coverage; notes[] names absent sources) | FREE |

All 8 confirmed deployed (Railway deploy `04bee89ef` SUCCESS 2026-09-12T23:08Z).
⚠ Stale header comment in `routes/mcp.php` still says get_page_stats "NOT built" —
fix to preserve the review-in-one-screen guarantee. Authed `tools/list` re-verify
pending a fresh OAuth token (previous token file wiped by Windows temp cleanup;
requires the founder's browser session).

**Coverage matrix** (underlying service / MCP read / create / execute):

| Domain | Service exists | MCP read | MCP create | MCP execute |
|---|---|---|---|---|
| Show / RSS | ✅ | ✅ overview | ❌ | ❌ |
| Episodes | ✅ | ✅ list | ❌ | ❌ |
| Transcripts | ✅ | ✅ search+fetch | ❌ (no transcribe-trigger tool) | ❌ |
| OP3 analytics | ✅ | ✅ | — | — |
| YouTube analytics | ✅ | 🟡 only via get_recent_performance views; no dedicated tool | ❌ | ❌ |
| Unified/True Audience | 🟡 | 🟡 partial via recent_performance | ❌ | ❌ |
| Podlink page / smart links | ✅ (bridge read) | ✅ stats + URL | ❌ writes (deliberate: v1.2+ behind explicit scopes, never bundled with reads) | ❌ |
| AI content / blog / newsletter / clips / images / video | 🟡 generic upstream | ❌ | ❌ | ❌ |
| Social scheduling/publishing/analytics | ❌ | ❌ | ❌ | ❌ |
| CRM / guest & sponsor outreach | ❌ | ❌ | ❌ | ❌ |
| Advertisers/merchants/products/offers/campaigns/commerce/marketplace | ❌ | ❌ | ❌ | ❌ |

**Architecture verdict:** the preferred pattern from external-context §10 (domain
services → web AND MCP) is genuinely what's built — `UserShowResolver` mirrors
`AnalyticsController@index` 1:1, and BiolinkStatsRepository feeds dashboard, public
report, and MCP identically. READ tier is done; CREATE/EXECUTE tiers exist only as
canon policy (Amendment 2026-08-27b: page:write v1.2+ at earliest, separate granular
scopes, user re-consent, never bundled). Passport `scopes_supported` currently empty —
scope machinery must be introduced before any write tool.

Canonical positioning claim (post-research, canon-locked): **"the podcast analytics
connector"** — the unscoped "first podcast MCP" claim is retired (Springcast,
Transistor, Descript, Riverside, Castmagic shipped MCP surfaces); directory-scoped
first-claims only if re-verified on listing day.

# 12. Transcript/archive ingestion

✅ Built and live (custom; MagicAI File-Chat/embeddings NOT used for this).

Sources: audio transcription via Whisper only. ❌ RSS `<podcast:transcript>` ingestion
not implemented (external context prefers it as first source — gap worth logging as a
cost saver). ❌ manual upload, ❌ YouTube captions as transcript source (upstream
caption service exists but isn't wired into episode_transcripts).

Pipeline: `TranscribeEpisodeJob` (queue, timeout 900s, tries 1; worker runs
`--timeout=900`, Redis `retry_after` 960): download audio (400MB ceiling) → duration
cap `podlink.transcribe_max_seconds` (default 5400s) → owner credit precheck →
ffmpeg re-encode to 32kbps mono if >24MB (explicit failure if ffmpeg absent; present
in Railway image) → OpenAI Whisper-1 verbose_json → meter credits via the same Entity
driver as dashboard STT → store body + word_count, status pending→processing→
completed/failed. Trigger: per-episode button (dashboard + episode page);
`auto_transcribe_new` config default OFF (billing decision). Storage: plain text in
`episode_transcripts.body`, FULLTEXT-indexed; language + provider recorded; ❌ no
speaker labels, no timestamps, no chunking, no embeddings/vector store. Search:
MySQL FULLTEXT (dashboard + `search_transcripts` MCP tool). Deletion: cascades with
episode. Sync: episodes hourly-throttled via `episodes_last_synced_at`.

# 13. Podcast Memory / Content Intelligence / Growth Agent

- **Podcast Memory** ("ask your podcast anything"): 🟡 closer than it looks — via MCP
  + Claude/ChatGPT it EXISTS today for connected users (search_transcripts +
  get_transcript + analytics tools = archive Q&A with episode references). What's
  missing for an in-product version: timestamps in transcripts (Whisper verbose_json
  segments are received but not persisted — persist segments to unlock
  timestamp-cited answers), chunking/embeddings if semantic search is wanted (MagicAI
  PDF/File-chat embeddings primitives exist upstream and could be repurposed), and a
  chat UI scoped to the archive. Effort: moderate; the data spine exists.
- **Content Intelligence** (moments/quotes/evergreen/clip candidates): ⚪ nothing
  built; feasible as prompt-layer over existing transcripts + FULLTEXT; clip-moment
  output has nowhere to land until an asset/clip table exists (§5).
- **Growth Agent** (proactive recommendations): ⚪ not built; `get_recent_performance`
  is the seed (honest computed observations pattern — outliers, cadence, coverage).
  Dependencies: performance snapshot history (§6 warehousing gap), social/asset
  performance (absent), seasonality (needs snapshots). Effort: large; sequence after
  unified analytics per external context.

Strategic note: the honest-observations discipline in get_recent_performance (compute
only what the data supports; name absent sources) is the right foundation for agent
recommendations and is already canon.

# 14. PodLink Services

✅ Live as a marketing + intake funnel; fulfillment is off-platform (agency ops).

`web/src/content/services.ts` — 6 services, each with template-complete pages
(`/services/[slug]`): podcast-editing ($275/$950/$1,800 tiers), podcast-clips,
podcast-advertising, podcast-sponsorship (20% / $2,500 / $950), 
get-booked-on-podcasts, podcast-growth. Page template (per canon
`services-page-template.md`, approved S1–S3): trust strip, fit qualifier,
why-Podlink, from-price card in flow + full tier tables collapsed in DOM
(founder-delegated hybrid pricing decision), cost FAQs first (~44 service FAQs
total), process steps, proof section, placements strip, DIY cross-link to the
matching software feature.

Intake: /contact with "we reply within 2 business days" promise + HubSpot booking CTA
(founder decision: "not just email"); support@podlink.ai wired. ❌ No checkout/payment
for services (no Stripe payment links); no client portal; no proposals/invoices in
product. Megaphone hosting: not mentioned on the site; see §16. Historical Minting
House pricing in the external context (episode $115/$195, clips $30–$135, booking
$350 + $999 setup, contractor $150/ep) is HISTORICAL input only — current live prices
are the services.ts tiers; treat any other figure as stale.

Cross-sells: services→software via DIY links and /work; software→services via the
homepage services door and clips feature page. Automated trigger-based cross-sell: ❌
(§31 lists the detectable events).

# 15. Podcast CRM / Outreach

❌ No CRM in the installed fork (verified §2). Decision record
(`claude/contact-discovery-p3-amendment.md`, supersedes the locked spec file):
MagicAI v11's "AI-Powered CRM" was verified to be a **pipeline CRM, not an email
sequencer** — adopt-later candidate for pipeline UI (price TBD in admin; v11 upgrade
gate on the customized fork), while the SEND layer stays a custom Laravel +
Gmail/Outlook OAuth build gated behind OAuth app verification, CAN-SPAM compliance,
and a ~75-day domain warm-up. Dogfood-internally-first (external context §9) is the
locked sequencing.

What exists toward it (P1, ✅ live): `Discovery/PodcastIndexClient` (search/byterm,
keyless-inert, attribution honored) + `Discovery/ContactCardService` (RSS
itunes:owner/managingEditor/webMaster + bounded own-site crawl for emails/
booking-link hints, unverified-labeled) + `/dashboard/user/discovery` "Find Shows"
page. This is the guest-booking pipeline's top-of-funnel primitive. Pipeline stages,
contact storage, sequencing, reply detection: ⚪ all future (P2–P4 in canon).

# 16. Megaphone

❌ Nothing in the repo: no Megaphone API client, no references in magicai/, biolink/,
or web/ (verified by search). External context: several managed shows live in the
Minting House Megaphone org — that's an operational asset outside the codebase.
Unverifiable from here: which shows, whether OP3 prefixes could be added (requires
approval + host-side change; expressly out of scope for any build task). Opportunity:
Megaphone has a public API; a hosting-side integration is unscoped ⚪.

---

# 17. Headless Shopify / commerce

❌ Absent entirely. No Storefront/Admin API code, no cart/checkout/products/
collections/webhooks/orders/bundles anywhere in web/, magicai/, or biolink/ (verified;
the only "products" are MagicAI BrandVoice fixtures and Biolink's plugin-gated absent
commerce blocks). A Shopify MCP connector exists in the founder's Claude workspace
(ops-side), which is unrelated to product code. Everything in external-context §12
(gear, kits, bundles, software+gear cross-sells) is ⚪ greenfield. Note for planners:
`web/` is a clean Next.js host for a headless storefront; nothing blocks it
technically except priority.

# 18. Advertiser/creator marketplace

❌ No schema readiness: none of Merchant, ConnectedCommerceAccount, Creator (as
distinct from user), ConnectedMediaAccount (beyond youtube_connections), Product,
Offer, Campaign, Asset, TrackingLink, Conversion, Order, Payout exist (§5). What DOES
exist that a future marketplace builds on: verified-audience primitives (OP3
downloads — independently checkable; YouTube demographics — consented; Biolink
click-through data), the public Show Report as a proto media-kit, and Biolink's
UTM/pixel/click infrastructure as a tracking-link seed. Trust model, deal types,
managed-marketplace-first: all ⚪ strategy-only (external context §13). Canon
concurs: marketplace must not displace OP3+YouTube priority.

# 19. Billing / entitlements

**Authoritative system (intended): MagicAI/Stripe. Current reality: nothing is
wired.** 

- MagicAI: full plans/credits/trials/coupons machinery ✅ in code; Stripe seeded
  inactive; **no PodLink Stripe products/prices exist**; `config/marketing.php`
  pricing (Free / $19 Creator / $49 Pro, annual=10×) is explicitly PLACEHOLDER and
  differs from the decided web pricing below — 🔴 conflict to reconcile at flip time.
- Decided pricing (canon `podlink-pricing-v2.md` §7 CLOSED, founder-approved):
  **Free** ~10 bio links, no episode report; **14-day reverse trial**; **Pro**; 
  **Studio** $2/episode past 40, hard-capped. Web `/pricing` (Free/Pro/Studio,
  "Annual is 8× monthly") is 🔵 live-but-noindex, flip gated on its own 5-condition
  checklist (3/5 done; admin plan ladder = founder tap B5 outstanding; decoupled from
  the external-comms gate by founder decision).
- Credits: Whisper transcription meters real credits today (`credits_charged` per
  transcript) — the only live consumption billing.
- Biolink billing: 🔵 present, bypassed, `/plan` page still routable (🔴 risk: a user
  could theoretically buy a Biolink plan if processors were ever enabled in its admin
  DB — keep processors off; consider hiding /plan).
- Teams/seats: 🔵 upstream, off. Service payments: ❌ none in-product. Ecommerce: ❌.
- Feature gating: MCP FREE-READ RULE is canon (connection + analytics/episode reads
  free on every plan, metered; exports/writes paid-gated; every new tool declares its
  tier in `PODLINK-MCP-SCOPING.md` before build — v1.2-lite declarations filed in
  `claude/mcp-scoping-amendment-2026-09-12.md`).

# 20. Onboarding

Verified route flow: podlink.ai (Hero CTA "Start free") → app.podlink.ai/register
(MagicAI, email verification per settings) → generic MagicAI dashboard →
**Podcast Analytics** (`/dashboard/user/analytics`): paste RSS → connect → OP3 state
machine (prefix instructions if absent — honest, but a real wait/effort step since
the user must change their host settings) → episodes appear (hourly sync) →
transcribe buttons → YouTube connect (OAuth) → report toggle → **My Podlink Page**
(`/dashboard/user/podlink`) → SSO one-time-code hop to podlink.fm editor.

Friction inventory: (1) generic MagicAI dashboard/branding between signup and the
podcast surfaces — menu shows AI-suite items before podcast items; (2) no guided
first-run wizard (connect-your-feed isn't forced or suggested at first login); (3)
OP3 prefix is a host-side manual step (unavoidable, but no email nudge/follow-up
exists); (4) SSO hop to a visibly different app for page editing; (5) pre-signup
value: ❌ none — no public feed-inspector teaser ("see your top apps free before
signup"), an obvious PLG lever given `inspectFeed` already exists keyless. The
Show Report solves post-signup shareable value well.

# 21. Website/public experience

20 routes live (`web/src/app/`), all template-disciplined and claims-audited:

| Page | Purpose / CTA | Mismatch notes |
|---|---|---|
| `/` | dual-funnel: hero ("Record the episode. Podlink does the other four hours"), TWO_DOORS (software/services), REPORT_BAND (Show Report + Connect Claude, live), what-it-does groups, how-it-works, 8 FAQs, CTA band | none known post-audit |
| `/features` + 8 feature pages | download-analytics, transcripts, show-notes, templates, multilingual, clips-and-social, newsletter, link-in-bio; trust strip, ink problem band, steps, host chips, Free-only price card | clips/newsletter copy deliberately honest re: what's DIY vs service |
| `/features/mcp` (+ `/setup`) | Claude/ChatGPT connector marketing + setup docs | 🔵 noindex until index-flip checklist; /setup IS sitemapped |
| `/claude` | Cluster-A SEO landing: talk-to-your-podcast, 3-step connect, why-OP3, 5 FAQs, HowTo+FAQPage schema | zero directory claims until listing day (deliberate) |
| `/pricing` | Free/Pro/Studio + comparison + 9 FAQs | 🔵 noindex until limits enforced (5-condition flip) |
| `/services` + 6 pages | see §14 | — |
| `/work`, `/case-studies` (+18 slugs) | proof hub; placements list; clearance gating (`SHOW_UNCLEARED_PROOF`, `visibleCaseStudies()`) | tranche-2 template pass pending (task #19) |
| `/studio` | multi-show/agency teaser | product multi-show ❌ (§5) — page sells direction, watch claims |
| `/about` | company story | founder-story v2 section drafted, HELD for sign-off |
| `/contact` | 2-business-day promise + HubSpot booking | — |
| `/changelog`, `/resources/podcast-guest-pitch-template` | drip surface; lead magnet | pitch-template page unsitemapped until download real |
| `/report/[hash]` | public Show Report consumer (revalidate 900, noindex) | — |
| `/legal/terms`, `/legal/privacy` | v1 drafts live | governing-law state TODO; founder read = tap B1 |

SEO plumbing: sitemap with deliberate omissions (pricing, /features/mcp, pitch
template), robots, llms.txt, JSON-LD (Organization w/ parentOrganization "Minting
House", WebSite, SoftwareApplication free-offer, FAQPage, BreadcrumbList), GA4 + GSC
both domains + Bing. Keyword strategy canon: Cluster A (MCP/connector — top-priority
land-grab), B (podcast-AI volume), C (services).

# 22. Historical proof/media archive

Current state: proof is **static content in `web/src/content/proof.ts` +
`placements.ts`** — 18 case-study slugs (incl. DocSend, CVS Health, Belfort, Koii,
T3 Live, Mudrex, ShiftPixy, Qualsights…), 6 testimonials, showsWorkedWith /
brandsWorkedWith arrays, verified placements list feeding /work, with a clearance
gate for unapproved items. Belfort story: founder explicitly cleared sharing (canon
Q1 RESOLVED). ❌ No CMS/data model (no placement/case_study/media tables anywhere);
no per-placement pages with embeds; no rights/indexability fields beyond the
clearance boolean; no Drive/Descript ingestion. The external-context Proof Library
schema (Client→Placement→Podcast→Episode→Media→Clips→Transcript→Topics→Services→
Results→rights) is ⚪ entirely future. SSR/crawlability of what exists: ✅ (Next.js
static, canonical URLs, OG, sitemap, breadcrumbs on case studies). Launch-day
curation guidance (best logos/clips first, thin records noindex) matches canon
practice already — the clearance gate is exactly that mechanism.

# 23. Public embeds

Biolink pages: official embed blocks available today for Spotify, YouTube,
SoundCloud, Twitch, Vimeo, TikTok video (✅ default blocks; no Apple Podcasts embed
without the absent plugin). Marketing site: no third-party media embeds currently on
case-study pages (❌ — cheap proof upgrade: official YouTube/Spotify embeds of
cleared placements). No rehosting of third-party media anywhere (✅ rights-safe).

# 24. PodLink Media Engine

Support inventory for a PodLink-owned show: blog ❌ on podlink.ai (no /blog; Biolink's
vendor blog exists on podlink.fm but is redirect-bypassed at index and off-brand —
do not build there); newsletter send ❌; social publishing ❌; YouTube analytics ✅
(dogfood-ready); transcripts ✅; Show Report ✅ (the PodLink show should run its own
public report as a living case study — zero build needed); SEO/AEO surface ✅ (llms.txt
+ schema + changelog + drip calendar). Verdict: the engine can *measure and prove*
a PodLink show today, but *distribution* (posting, newsletter) remains manual/
external. That matches the launch-content plan (drips are manually published on GO).

# 25. Feature-drip launch readiness

Canon: `claude/feature-drip-calendar.md` + `claude/launch/drip-cadence-v2.md` —
every drip is a mini-launch package; public dates only for shipped, verify-passed
reveals; roadmap stays dateless. External comms are HARD-GATED on founder GO;
code/site ships proceed on checklists (founder decision, recorded).

| Release | Build | Deps left | Hideable | Demo-ready | Launch assets |
|---|---|---|---|---|---|
| OP3 free analytics | ✅ | — | n/a live | needs B4 demo data | drip #1 published |
| Podlink pages/smart links | ✅ | — | live | yes | in listings pack |
| Transcripts | ✅ | founder click-verify | live | after click-verify | drip #2 staged |
| Show Report (hero) | ✅ | — | opt-in default off | needs B4 | hero copy live in repo |
| YouTube connect + True Audience v1 | ✅/🟡 | scoped reconnect verify; pairing UI | live | partial | drip slot reserved |
| Demographics (ML2) | ✅ | real-data verify | live | after reconnect | in report band |
| MCP connector | ✅ | directory submissions = comms gate; B6 not needed (that's discovery) | live | test cases staged | listings + /claude + video script + one-pager staged |
| Contact discovery | ✅ P1 | Podcast Index keys (B6) for search half | live | cards demo-able keyless | not yet dripped |
| AI Content Kit | 🟡 generic | podcast-native packaging | yes | partial | ⚪ |
| Clips | ❌ software | asset table + render pipeline OR service-led | n/a | service proof exists | service pages live |
| Social scheduling/analytics | ❌ | build or buy extension; asset table first | n/a | no | app-review drafts staged |
| Attribution | ❌ | tracking-link schema | n/a | no | ⚪ |
| Podcast Memory (in-product) | 🟡 via MCP | timestamps, chat UI | n/a | via Claude demo | /claude page serves this story |
| Outreach CRM | ❌ (P1 only) | see §15 gates | n/a | no | ⚪ |
| Teams/Studio | 🔵 upstream toggle | show-ownership migration | yes | no | /studio page live |
| Sponsor/media-kit | 🟡 (report IS proto) | demographics verify + kit framing | opt-in | after B4 | ⚪ |
| Commerce / marketplace | ❌ | everything | n/a | no | ⚪ |

BUILD priority (canon, engineering): pairing robustness + snapshots → asset/clip
table → Memory timestamps → send-layer gates. RELEASE priority (canon, comms):
already sequenced in drip calendar; MCP + Show Report lead.

# 26. Sellable product inventory

| Item | Status | Price today | Type | Payment path | Self-serve |
|---|---|---|---|---|---|
| Free tier | ✅ live | $0 | — | — | ✅ |
| Pro subscription | 🔵 priced, unwired | web pricing (noindex) | recurring | ❌ no Stripe products | ❌ |
| Studio | 🔵 priced ($2/ep>40 capped), unwired | " | recurring+usage | ❌ | ❌ |
| Credits top-ups | 🟡 machinery exists | unset | one-time | ❌ inactive | ❌ |
| Podcast editing | ✅ sold via contact | $275/$950/$1,800 | recurring/one-time | invoice/off-platform | ❌ |
| Clips service | ✅ | tiers on page | " | " | ❌ |
| Advertising | ✅ | tiers on page | " | " | ❌ |
| Sponsorship | ✅ | 20% / $2,500 / $950 | " | " | ❌ |
| Guest booking | ✅ | tiers on page | " | " | ❌ |
| Growth | ✅ | tiers on page | " | " | ❌ |
| Hosting (Megaphone) | ❌ not offered on site | — | — | — | — |
| Gear/bundles/commerce | ❌ | — | — | — | — |
| Advertiser campaigns / marketplace | ❌ | — | — | — | — |

# 27. Funnel/cross-sell infrastructure

✅ exists: landing pages (all §21), HubSpot booking link on /contact, support@ alias,
GA4 conversion surface, llms.txt/AEO, changelog as retention surface, lead magnet
page (pitch template — download not yet real), Claude-connector funnel
(/claude → /features/mcp/setup → app OAuth).
❌ absent: email capture forms (no newsletter signup anywhere on web/), automated
email sequences, HubSpot↔product sync (HubSpot is CRM-of-record for services only,
via founder's account; historical deal data per external context: 10 closed-won
podcast-appearance deals, 9 valued, $74,250 total, $8,250 avg — treated as strategy
input, not re-verified this audit), coupons (machinery 🔵), checkout (§19), trials
wiring (reverse-trial decided, unbuilt), upsell prompts in-product, abandoned-flow
recovery, retargeting pixels on web/ (none installed), payment links, attribution
beyond GA4 defaults.

# 28. DIY / DWY / DFY map

| Job | DIY (software) | DWY | DFY (service) |
|---|---|---|---|
| Setup/OP3 | ✅ honest instructions | ❌ no concierge offer | (implicit in services) |
| Analytics/report | ✅ free | — | ✅ inside growth/advertising retainers |
| Editing | ❌ no in-app editor | ❌ | ✅ $275+ |
| Clips | 🟡 transcript+ideas only | ❌ | ✅ service |
| Publishing/social | ❌ | ❌ | ✅ within services |
| Content/notes | ✅ AI tools | — | ✅ |
| Guesting | 🟡 discovery P1 + pitch template | ⚪ natural DWY gap | ✅ service |
| YouTube | ✅ connect/analytics | ❌ | ✅ via production |
| Hosting | ❌ | ❌ | 🟡 Megaphone ops off-site |
| Sponsorship | 🟡 report as proof | ❌ | ✅ service |

The DWY column is almost empty — a known monetization gap between free software and
$1k+ services (external-context value-ladder logic would put a productized
"launch/setup with you" offer here).

# 29. Time-to-value + effort reduction

| Value moment | Mandatory steps today | Waits/effort | Reduction opportunities |
|---|---|---|---|
| See download analytics | register → paste RSS → add OP3 prefix at host → wait for data | host-side change; OP3 accrues from prefix-add forward | pre-signup feed inspector (keyless, exists as code); email nudge after connect; show top-apps even pre-prefix from historical OP3 if show already prefixed |
| Podlink page | register → SSO hop → editor | minutes | template pre-fill from RSS (art, title, latest-episode links) — data already parsed |
| Transcript | click per episode | queue + Whisper time | auto-transcribe-new toggle exists (default off, billing) — could be on for first episode free |
| YouTube views | OAuth connect | seconds; pairing quality varies | pairing UI + confidence |
| Show Report | toggle | instant | — already excellent |
| Claude connector | OAuth via /setup docs | minutes | one-click deep link in dashboard |
| Content kit | pick template, paste | low | episode-aware prefill from transcript |

# 30. Proof assets

In-repo/live: 18 case studies (clearance-gated), 6 testimonials, shows/brands
worked-with lists, verified placements (`claude/placements-verified.md` +
`placements.ts`), founder story raw + evidence table (Belfort cleared; Oracle-NetSuite
nuance gated), clips inventory doc (`claude/clips-inventory.md`), asset shot-list
(`claude/asset-shot-list.md`). Missing/pending: real-data analytics screenshots
(blocked on B4 demo/OP3 data), demo video (script staged), brand concept pick
(board delivered, founder choice pending), Drive/Descript archive (inaccessible this
audit — external context asserts it exists).

# 31. Cross-sell trigger data (detectable today)

Already detectable in DB/services: show connected (podcast_shows row), OP3 prefix
present/absent (inspectFeed), YouTube not connected (no youtube_connections row),
high-performing episode (view outliers — computed in get_recent_performance),
transcript completed (status), transcript coverage low, cadence gap ≥14 days,
report enabled + being viewed (cache hits not logged — add counter ⚪), page stats
top links, episodes with no YouTube pair, demographics available (sponsor-readiness
signal), credit exhaustion. Not yet detectable: clip reuse, social absence (no
integrations), multi-show/multi-user (schema-blocked), hosting need, marketplace
interest. ❌ No event/notification system consumes any of these yet — the triggers
are queryable but nothing fires.

# 32. Fulfillment / unit-economics inputs

Captured in repo/canon: Whisper cost metering per transcript (credits_charged,
word_count, audio_seconds — real unit data accrues with use); MCP rate ceilings
(60/min, 2k/day) bound AI-read cost; `claude/podlink-saas-cac-model.html` +
`claude/saas-outbound-profitability.md` hold the founder's CAC/outbound math;
services margins: ❌ not in repo (agency-side); contractor rates only as historical
external-context figures ($150/ep etc. — stale-marked); turnaround/SLA:
`claude/pricing-sla-decision-sheet.md` holds decisions. Payment fees/inventory/
shipping: n/a (no commerce). Absent where stated absent.

# 33. Enterprise/channel revenue readiness

| Channel | Product ready | Service ready | Reporting/proof | Landing page | Studio/API/MCP |
|---|---|---|---|---|---|
| Podcast agencies/networks | 🟡 single-show only (§5 blocker) | ✅ ops heritage | Show Report ✅ | /studio teaser only | MCP read ✅; Teams 🔵 |
| PR/exec-comms resellers | n/a | ✅ guest-booking is live service | placements ✅ | ❌ none | ❌ white-label |
| Funded founders | 🟡 | ✅ get-booked service | ✅ Belfort/DocSend etc. | ❌ /founders absent | — |
| Associations/conferences | ❌ | 🟡 capability, unpackaged | 🟡 | ❌ | — |
| VC/PE portfolio | ❌ | 🟡 | 🟡 | ❌ | — |
| Higher ed / healthcare | ❌ | ❌ | ❌ | ❌ | — |

# 34. ICP launch-gate readiness (offer / page / ≥3 proof / 2–3 content)

- Agencies/networks: offer 🟡 (/studio hints) · page ❌ · proof ✅ · content ❌ → NOT GO
- PR agencies: offer ⚪ (external context has it) · page ❌ · proof ✅ · content ❌ → NOT GO
- Founders (guesting): offer ✅ (service page) · page 🟡 (service page ≠ /founders) · proof ✅ · content 🟡 (pitch template) → CLOSEST to GO
- Associations, conferences, VC/PE, higher ed, healthcare: ❌ across the board → NOT GO
Per the launch-gate rule (external context §22), only the founder-guesting lane is
near outbound-ready; everything else needs pages + content first.

# 35. Release ↔ outbound ↔ content alignment matrix

| Release | Best ICP | Site proof needed | Demo asset | Outbound CTA | Content angle | Service cross-sell |
|---|---|---|---|---|---|---|
| OP3 analytics | indie podcasters | live report w/ real data (B4) | dashboard shots | "free analytics a sponsor can check" | why OP3/open data | growth |
| Show Report | podcasters + sponsors-adjacent | same | report URL | "your show, on a link" | report-is-the-product story (validated pain) | sponsorship |
| True Audience/YouTube | video-first podcasters | paired episode rows | episode page | "see audio+video together" | Chartable-gap | production |
| Demographics | sponsor-seeking shows | audience section | report | "know your audience" | media-kit content | sponsorship |
| Transcripts | archive-heavy shows | episode page | drip #2 package | "your archive, searchable" | repurposing | clips |
| MCP connector | AI-forward podcasters | /claude + setup | video (script staged) | "ask your podcast" | Cluster-A SEO | — |
| Discovery | guest-seeking founders | Find Shows | cards demo | "find shows + contacts" | guesting guides | get-booked |
| Studio/Teams | agencies | multi-show (blocked) | ⚪ | "one login, all shows" | agency ops | network partner |
| Outreach CRM | agencies/founders | ⚪ | ⚪ | "pipeline for guesting" | dogfood story | booking |
| Podcast Memory | power users | Claude demo | recording | "chat with archive" | AEO | — |
| Commerce/marketplace | later | ⚪ | ⚪ | ⚪ | ⚪ | ⚪ |

---

# 36. Railway/deployment

Railway project `podlink` (id b3c2f406-7b7b-40ab-af0f-8e1612a7358a), env
`production` (1f8555a4-…f255). Services:
- **podlink-workspace** (5a20bb87) — magicai Laravel app; deploys from GitHub main
  with watch-path filtering (non-magicai commits show SKIPPED); predeploy
  `php artisan migrate --force`; custom `docker-entrypoint.sh` (config:cache
  deliberately disabled). Latest deploy: SUCCESS @ 2026-09-12T23:08Z, commit
  `04bee89ef` (MCP v1.2-lite) — **8-tool MCP surface is live**.
- **podlink-worker** (3e23d3bf) — `queue:work --timeout=900` + scheduler loop
  (timeout raised for long transcriptions; Redis `retry_after` 960).
- **biolink-public** (e614e767) — 66biolinks Apache container for podlink.fm.
- **MySQL** (408e67da) — hosts both `magicai` and `biolink` databases.
- **Redis** (648545de) — cache + queue.

Env var NAMES in play (no values): `OP3_API_TOKEN`, `YOUTUBE_CLIENT_ID/SECRET`,
`OPENAI_API_KEY` (upstream naming), `PODLINK_TRANSCRIBE_MAX_SECONDS`,
`PODCASTINDEX_KEY/SECRET` (unset — discovery search inert),
`BIOLINK_DB_HOST/PORT/DATABASE/USERNAME/PASSWORD` (set as Railway cross-service
reference vars `${{biolink-public.*}}` — no literal creds anywhere),
`MCP_RATE_LIMIT_PER_MINUTE/PER_DAY`, `MCP_DCR_RATE_LIMIT_PER_HOUR`,
`HOMEPAGE_REDIRECT_URL/DISABLED` + `BLOG_REDIRECT_*` (biolink), `DATABASE_*`,
`SITE_URL` (biolink), Redis/queue standard vars.

**Vercel** (team joelle-ayala-s-projects, project `podlink` →
podlink.ai): deploys on push from the same monorepo. ⚠ Finding (2026-09-16): Vercel
never built commit `04bee89ef` (pushed 2026-09-12; no failed build — the webhook
event was simply missed), so the homepage REPORT_BAND sat in-repo but not live for
four days. **RESOLVED same day:** the docs commit `0fb4be99b` (this audit) triggered
a fresh production build (READY) and the band is verified live on podlink.ai
(cache-busted match on "used to take a day" + #show-report). Lesson recorded:
always confirm a Vercel deployment EXISTS for the pushed sha, not just that the
push succeeded.

Known operational history: app deploys lag worker (verify per-service); 502s during
container swap; SKIPPED = watch-path miss (normal); desktop scheduler tooling is
BANNED (froze the client twice) — GSC pulls are manual Mondays.

# 37. Security/privacy

- **Multi-tenancy**: every MCP tool and dashboard route resolves the user
  server-side; NO identity parameters accepted anywhere (canon R1 discipline);
  episode routes `abort_unless` tenancy; bridge reads are keyed by authenticated
  email and asserted server-side; two-account cross-read tests were part of MCP
  verification.
- **OAuth**: YouTube tokens encrypted at rest + hidden from serialization; read-only
  scopes only; MCP is OAuth 2.1 + PKCE with DCR rate-limited 10/hr/IP.
- **Public surfaces**: report hash = bin2hex(random_bytes(20)) (40 hex chars),
  default OFF, instant kill purges `public-report:{hash}` cache; report JSON is
  R5-sanitized (safeText caps); /report pages noindex.
- **Rate limits**: /mcp 60/min + 2,000/day per user + unauth 401 (live-verified);
  api group 60/min per-IP unauth (x-ratelimit headers verified).
- **RSS/OP3**: read-only; PodLink never rewrites feeds (explicit product stance).
- **Biolink**: SSO endpoint requires an admin Bearer api_key; native login/register
  bypassed but still present (`?podlink_native=1` escape documented); its own
  admin-api surface (users/plans/payments) is powerful — treat that admin api_key as
  a crown-jewel secret. Bridge is SELECT-only from a repository class with a pinned
  schema + drift guard.
- **Stripe**: inactive; no card surfaces live. **Gmail/Outlook/outbound sending**:
  none (deliberately gated future). **Action confirmation**: all MCP tools read-only;
  write tools, when they come, are canon-bound to explicit granular scopes +
  re-consent.
- Hygiene items: upstream `/test*` + `debug/{token?}` routes registered
  unconditionally in `routes/web.php` (🔴 close before scale); Biolink `/plan` and
  vendor marketing pages still routable on podlink.fm; `magicai.sql` seed dump in
  repo contains vendor-default settings (no PodLink secrets observed, but the file's
  presence in git deserves review).

# 38. Technical debt / DO-NOT-TOUCH-BEFORE-LAUNCH

Debt register:
1. 🔴 Triple auth/billing stacks (MagicAI, Biolink, unwired Stripe) — bridged by
   design; unify never, manage forever. DO NOT attempt consolidation pre-launch.
2. 🔴 Biolink `track_links` 90-day retention default silently bounds
   pageviews_30d-style stats long-term trends; decide retention policy (set -1 for
   PodLink plans or snapshot into magicai DB).
3. 🔴 `podcast_shows.user_id` UNIQUE = single-show ceiling; blocks Studio/agencies.
   Migration is straightforward but touches every resolver — schedule deliberately,
   post-launch.
4. 🔴 Naive episode↔YouTube title pairing; no manual override.
5. 🔴 Vendor upgrade gates: MagicAI v11 (wanted eventually for pipeline CRM) requires
   re-verifying every custom touchpoint; 66biolinks updates can silently break the
   pinned bridge schema (drift guard catches; runbook documented).
6. 🔴 Upstream residue: DeFi services, duplicate ElevenLabs services, duplicate
   payment architectures, empty Video/UGC hub routes, extension seeders, /test +
   debug routes, liquid-themes defaults inside `magicai.sql`.
7. 🔴 Biolink vendor surfaces still live on podlink.fm (blog posts, directory,
   tools, /plan, affiliate, chrome-extension) and advertised by its Sitemap.php —
   brand/SEO leakage risk; bare /blog and / are redirected, the rest are not.
8. 🔴 Stale comment in `routes/mcp.php` header (says v1.2 tools not built).
9. 🔴 `config/marketing.php` pricing vs web pricing.ts conflict (both placeholder-
   flagged, but two sources of truth exist until Stripe wiring picks one).
10. 🔴 No transcript timestamps persisted (verbose_json discarded) — re-transcribing
    later to get them would double Whisper spend; persist segments soon.
11. 🔴 Windows sandbox/bash outage on the ops machine (since Sept 8 Windows update)
    — ops currently PowerShell-only; not product debt but affects automation.

**DO NOT TOUCH before launch:** feed URLs/enclosures (never add OP3 prefixes
programmatically), live client feeds and YouTube grants (external-context hard rule),
Biolink vendor core beyond the marked customization points, MagicAI updater/vendor
dirs, Railway service topology, the banned scheduler tool, Passport/OAuth config
(MCP e2e is verified — churn risks connector breakage), migrations already applied.

# 39. Master feature inventory

Legend: Src = M(agicAI core) / B(iolink) / C(ustom) / X(extension-absent). Eff =
effort to expose (S/M/L). Imp = strategic importance (H/M/L).

| Feature | Cat | Src | Installed | Live | Visible | Status | Deps | Upstream avail | Eff | Imp | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| OP3 dashboard | analytics | C | ✅ | ✅ | ✅ | ✅ | OP3 token | — | — | H | keep; add geography + snapshots |
| Episode sync | data | C | ✅ | ✅ | ✅ | ✅ | — | — | — | H | keep |
| Transcripts pipeline | AI | C | ✅ | ✅ | ✅ | ✅ | ffmpeg, credits | — | — | H | persist timestamps |
| Episode detail page | product | C | ✅ | ✅ | ✅ | ✅ | — | — | — | M | — |
| Show Report public | product | C | ✅ | ✅ | opt-in | ✅ | — | — | — | H | hero; B4 demo data |
| YouTube connect+views | analytics | C | ✅ | ✅ | ✅ | ✅ | env keys | — | — | H | pairing UI next |
| Demographics ML2 | analytics | C | ✅ | ✅ | ✅ | 🟡 verify | reconnect | — | S | H | founder reconnect |
| Watch time/AVD/traffic | analytics | C | ❌ | — | — | ⚪ | same API | — | S | H | build next |
| Biolink bridge stats | analytics | C | ✅ | ✅ | ✅ | ✅ | ref vars | — | — | M | retention decision |
| MCP server 8 tools | platform | C | ✅ | ✅ | ✅ | ✅ | — | — | — | H | directory submissions on GO |
| MCP write tools | platform | C | ❌ | — | — | ⚪ policy | scopes infra | — | M | v1.2+ per canon |
| Discovery P1 | growth | C | ✅ | ✅ | ✅ | 🟡 half-inert | B6 keys | — | S | M | keys = tap |
| Podlink pages | product | B | ✅ | ✅ | ✅ | ✅ | — | — | — | H | — |
| QR/UTM/pixels | product | B | ✅ | ✅ | ✅ | ✅ | — | — | — | M | — |
| Custom domains | product | B | ✅ | ✅ | 🟡 | ✅ | plan gating | — | S | M | package into Pro |
| Biolink user API | platform | B | ✅ | 🔵 | setting | 🔵 | settings | — | S | L | leave off |
| AI writer/chat/templates | AI | M | ✅ | ✅ | ✅ | ✅ | — | — | — | M | curate podcast-native |
| BrandVoice | AI | M | ✅ | ✅ | ✅ | ✅ | — | — | — | M | — |
| Image gen | AI | M | ✅ | ✅ | ✅ | ✅ | — | Pro exts exist | — | L | keep basic |
| TTS/STT | AI | M | ✅ | ✅ | ✅ | ✅ | — | — | — | M | — |
| Voice clone | AI | M | ✅ | ❌ | ❌ | 🔵 | ElevenLabs key | — | S | L | leave off |
| Teams/workspaces | platform | M | ✅ | ❌ | ❌ | 🔵 | setting + show-ownership migration | — | M | H | Studio enabler |
| Personal API keys | platform | M | ✅ | ❌ | ❌ | 🔵 | setting | — | S | L | leave off (MCP is the API) |
| Chatbot embed | AI | M | 🟡 | ❌ | ❌ | 🔵 | ext missing | ext | M | L | skip |
| Plans/credits/Stripe | billing | M | ✅ | 🟡 | 🟡 | 🟡 | Stripe products, B5 | — | M | H | wire at flip |
| Social suite | social | X | ❌ | — | — | ⚪ | purchase or build | ✅ upstream | L | H later | asset table first |
| AI Agents | AI | X | ❌ | — | — | ⚪ | purchase | ✅ | L | M | later |
| CRM | crm | X | ❌ | — | — | ⚪ | v11 upgrade | ✅ v11 | L | M | adopt-later decision filed |
| Newsletter send | marketing | X | ❌ | — | — | ⚪ | purchase/build | ✅ | M | M | later |
| Marketing site 20 routes | web | C | ✅ | ✅ | ✅ | ✅ | — | — | — | H | current (REPORT_BAND live 2026-09-16) |
| /pricing | web | C | ✅ | ✅ | noindex | 🔵 | 5-condition flip | — | S | H | B5 then flip |
| /features/mcp | web | C | ✅ | ✅ | noindex | 🔵 | index-flip list | — | S | H | flip near listing day |
| Case studies/work | proof | C | ✅ | ✅ | ✅ | ✅ | tranche-2 templates | — | M | H | task #19 |
| Solutions/ICP pages | web | — | ❌ | — | — | ❌ | copy + proof wiring | — | M | H | biggest GTM gap |
| Commerce/marketplace | commerce | — | ❌ | — | — | ❌ | everything | — | XL | M later | per strategy |

# 40. Roadmap consolidation

No CLAUDE.md at repo root. Canon lives in `claude/` (WORK-CANON.md is the constitution:
lockstep rule — MCP/product/frontend express the same shipped truth; external-comms-only
launch gate; P1 sequencing). Key documents and their standing:

- `claude/WORK-CANON.md` — governing rules; current.
- `claude/PODLINK-MCP-SCOPING.md` + `claude/mcp-scoping-amendment-2026-09-12.md`
  (sibling governs until merged; main file was editor-locked) — MCP phases,
  acceptance criteria (free-read rule, read/write split, rate limits, first-call
  wow, demo account, least-privilege copy, transcripts moat), v1.2-lite gate tiers.
- `claude/launch/README.md` — definitive launch checklist; staged table; founder
  taps B1–B8 (B1 legal read, B2 Team org, B3 support mailbox check, B4 OP3 demo
  data + test creds, B5 admin plan ladder, B6 Podcast Index key, B7 HubSpot link
  [wired on /contact], B8 GO). Plus go-day-runbook.md, listings-and-rehearsal.md
  (metadata pack + per-directory fields + ChatGPT test cases), drip-cadence-v2.md,
  drip-2-transcripts-package.md, linkedin-one-pager.md, launch-video-script.md.
- `claude/podlink-pricing-v2.md` (§7 closed w/ founder decisions),
  pricing-page-template.md (flip checklist 3/5).
- `claude/feed-ingestion-show-report-spec.md`, media-kit-demographics-spec.md
  (TikTok correction applied), contact-discovery-spec.md + p3-amendment (amendment
  governs), tiktok-meta-app-review-prep.md.
- Voice/positioning: voice-guide.md (§7–8 divergence rules), founder-voice-guide.md
  (Q1 Belfort resolved), founder-story-raw.md (verbatim addendum + evidence table),
  cross-channel-report-validation.md (reports-pain → hero), buyer-personas-messaging,
  gtm-plan/gtm-coherence-audit/outbound-operating-system, seo-gsc-plan.md.
- `claude/app-handoff-docs/01–18` — earlier planning series (product brief, domain
  architecture, tier packaging, extension license matrix, onboarding spec, security
  brief…). Status: partially superseded by shipped reality; treat as background, not
  current truth, where they conflict with code.
- `claude/JOELLE-TODO.md` — founder task ledger; `claude/SESSION_LOG.md` — build log.
- Older strategy (funnel-architecture, growth-plan-8-levers, index-study-1,
  podlink-ml3-build-vs-buy, backup-product-research, podcast-data-vendors,
  producer-universe-count) — inputs, dated, mostly still-relevant analyses.

External-context conflicts called out: (1) MagicAI CRM/agents/social described there
as "appears to have" — installed fork verifiably does NOT (v11/extension-only);
(2) historical service prices vs live services.ts tiers (live wins); (3) feature-wave
list vs canon drip calendar (canon is the operative sequence); (4) "PodLink page +
smart links" as future wave — actually live today.

# 41. Important file map (selected; paths relative to repo root)

- `magicai/version.txt` — vendor version marker (10.81).
- `magicai/routes/mcp.php` — COMPLETE MCP tool surface. `magicai/routes/ai.php` —
  MCP OAuth discovery + DCR. `magicai/config/mcp.php`, `config/mcp_oauth.php`.
- `magicai/app/Mcp/Tools/*` (8), `app/Mcp/Support/{UserShowResolver,
  PodlinkPageResolver}.php`, `app/Mcp/Concerns/ResolvesMcpUser.php`,
  `app/Http/Middleware/Mcp/AuthenticateMcpRequest.php`.
- `magicai/app/Services/{Op3Service,EpisodeSyncService,YouTubeOAuthService,
  YouTubeAnalyticsService}.php`, `app/Services/Biolink/BiolinkStatsRepository.php`,
  `app/Services/Discovery/{PodcastIndexClient,ContactCardService}.php`.
- `magicai/app/Http/Controllers/Dashboard/{AnalyticsController,PodlinkController,
  DiscoveryController,YouTubeConnectController}.php`,
  `app/Http/Controllers/PublicReportController.php`.
- `magicai/app/Jobs/TranscribeEpisodeJob.php`. Models:
  `app/Models/{PodcastShow,Episode,EpisodeTranscript,YoutubeConnection}.php`.
- Custom migrations: the six 2026_* files listed in §5.
- `magicai/config/podlink.php`, `config/marketing.php`, `config/database.php`
  (biolink connection), `routes/panel.php` (custom routes ~118–200),
  `routes/api.php:30` (public report), `app/Services/Common/MenuService.php`
  (menu insertions + hiding logic).
- `biolink/app/controllers/l/Link.php` (public pages + tracking),
  `biolink/app/controllers/admin-api/AdminApiSSO.php` (SSO), customized
  `Index/Blog/Login/Register.php`, `biolink/RAILWAY-NOTES.md`,
  `biolink/app/includes/biolink_blocks.php`, `biolink/app/controllers/Cron.php`
  (retention), `biolink/app/traits/Apiable.php` + `app/controllers/api/*`.
- `web/src/app/**` (20 page.tsx), `web/src/content/{home,features,services,pricing,
  proof,placements,mcp,contact,changelog,about,resources}.ts`, `web/src/lib/seo.ts`,
  `web/src/app/sitemap.ts`, `web/public/llms.txt`.
- Root: `BRAND.md`, `PRICING.md`, deploy one-shots (`import-seed-once.php`,
  `provision-passport-once.php`, `create-biolink-db.php`, `predeploy.php`,
  `docker-entrypoint.sh`), `magicai.sql` (seed dump — review for repo hygiene).
- `claude/**` — canon (see §40).

# 42. Final readiness summary

**Ready today (✅):** marketing site + services funnel; OP3 analytics; episode
sync/detail; transcripts + search; Show Report; YouTube views + demographics;
Biolink pages + bridge; MCP server (8 read tools, OAuth, rate-limited, live);
discovery contact cards; legal drafts; full staged launch-comms package.

**Built but hidden (🔵):** /pricing (noindex), /features/mcp page, MagicAI Teams,
personal API keys, Biolink user API, voice clone, chatbot embed, Biolink billing.

**Almost ready (🟡, days not weeks):** demographics real-data verify (one founder
reconnect); pricing flip (B5 + Stripe products); discovery search (B6 keys);
watch-time metrics (same API); transcript timestamps (persist segments).

**Partial:** True-Audience pairing (naive), Podcast Memory (exists via MCP, no
in-product UI), sponsor/media-kit (report is the proto).

**Documented/scoped only (⚪):** MCP write tools + scopes, outreach CRM P2–P4,
social layer, clips software, attribution, commerce, marketplace, media engine
distribution, solutions/ICP pages.

**Missing (❌):** derivative-asset/clip/social schema; multi-show ownership; email
capture + sequences; in-product event triggers; Megaphone/Shopify/Twitch integr.

**Highest-priority tests:** authed MCP tools/list re-verify (needs fresh OAuth via
founder session); demographics with a reconnected channel; transcript click-verify
(founder); Show Report with real OP3 data (B4); two-account bridge cross-read
(re-run after any bridge change); /pricing flip checklist items.

**Actual launch blockers (external-comms launch):** founder taps B1–B8 only.
Everything ship-side is live or staged. (The missed Vercel build of 04bee89ef was
caught during this audit and resolved 2026-09-16 — homepage hero band verified
live; see §36.)

**Safe to save for later launches:** discovery search reveal (post-B6), demographics
drip (post-verify), pricing index flip, Teams/Studio, any directory-scoped
first-claims (re-verify on listing day), clips software story.

**Highest-leverage already-paid-for upstream:** Teams toggle (Studio tier), BrandVoice
(podcast-native packaging), File-chat embeddings primitives (Podcast Memory), article
wizard→show-notes-to-blog flow, Biolink custom domains + QR + pixels (Pro packaging),
Biolink user API (only if bridge ever retired), v11 pipeline CRM (adopt-later).

**Biggest architectural risks to future MCP/agent/marketplace:** missing asset/
attribution schema (everything downstream depends on it); single-show-per-user;
no performance snapshots (agents need history); scope machinery absent for write
tools; email-string identity join between the two apps; Biolink data retention.

**Biggest strategy↔site mismatches:** no ICP/solutions front doors for the five
high-ticket lanes (§33–34) despite validated demand history; DWY rung of the value
ladder empty; no email capture anywhere on the funnel; proof library is static
content, not the structured Work Library the strategy envisions.

# 43. Strategic-framework evidence section

Verified facts organized as inputs for later framework analysis (no strategy
authored here):

- **Funnels/value ladder (Brunson):** live rungs = Free software → (unwired Pro/
  Studio) → services $275–$2,500+/mo → (historical) $8,250-avg booking deals. Gaps:
  paid-tier wiring, DWY rung, ascension triggers (§31 detectable but unconsumed).
  Two-door homepage is the funnel fork; Show Report is the shareable-artifact loop.
- **Offer value (Hormozi):** time-to-value data in §29; the report replaces a
  "day of API wizardry + spreadsheets" (founder-verbatim pain, externally
  validated); effort reducers shipped (one-click report, connector) vs remaining
  (OP3 host-side step, no pre-signup taste). Proof assets §30; fulfillment-cost
  capture §32 (Whisper metering real; services margins off-repo).
- **Positioning (Dunford):** competitive alternatives verified in canon: Chartable
  dead (gap story), pod.link name-collision on brand SERP (GSC plan addresses),
  MCP competitor set (Springcast/Transistor/Descript/Riverside/Castmagic) — claim
  narrowed to "the podcast analytics connector"; differentiated capability =
  independently checkable OP3 numbers + cross-channel report + read-only connector.
- **Story/media (Gerhardt):** founder story filed w/ evidence gates (Belfort
  cleared, Oracle-NetSuite nuance); two voice layers codified (founder vs brand,
  divergence rules); "what to be known for" = the report/checkable-numbers wedge.
- **Message clarity (Laja/Wynter):** claims-truth audit completed across features;
  services cost-FAQs-first pattern; objections handled in 100+ FAQs sitewide;
  friction inventory §20.
- **SEO/AEO (Patel):** llms.txt, schema set, Cluster A/B/C keyword strategy,
  /claude land-grab page, sitemap discipline w/ deliberate noindex gates, GSC/Bing
  wired, manual weekly pull cadence.
- **PLG (Poyar/Verna):** activation metric decided = Activated Shows/week; free
  wedge live; reverse-trial decided (14-day); PQL-ready signals in §31; retention
  moat = transcripts + report habit; monetization gap = Stripe unwired.
- **Marketplace (Chen):** cold-start assets = managed-shows beta network (external
  context §5), verified-audience data spine, services demand side; single-player
  utility already strong (analytics/report); managed-first sequencing agreed; no
  schema yet (§18) — build only after True Audience.

— END —
