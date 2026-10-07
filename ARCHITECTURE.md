# Podlink Architecture (living doc)

Last verified against production: **2026-09-26**. Multiple agents commit to this
repo (Claude/Cowork, ChatGPT/Codex, the CoS bot, design sessions). **Lockstep
rule: any commit that changes something described here updates this file in the
same push.** Point-in-time depth lives in
`claude/PODLINK_ECOSYSTEM_AUDIT_CONTEXT_V3.md` (2026-09-16 snapshot); this file
is the current map. Docs rank: product truth > BRAND.md values > web/DESIGN.md
> skills (per the 09-21 design-OS ruling).

## 1. The three apps, one monorepo

| Dir | What | Serves | Deploys via |
|---|---|---|---|
| `web/` | Next.js 16 marketing site | **podlink.ai** | Vercel (team joelle-ayala-s-projects, project `podlink`), builds every push to main |
| `magicai/` | MagicAI v10.8.1 Laravel fork = the product app | **app.podlink.ai** | Railway service `podlink-workspace` (watch-path: magicai/ only) + `podlink-worker` (queue `--timeout=900` + scheduler loop) |
| `biolink/` | 66biolinks v68 (Altum PHP, vendored) | **podlink.fm** | Railway service `biolink-public` |

Railway project `podlink` (b3c2f406-…), env `production` (1f8555a4-…); shared
**MySQL** (holds BOTH the `magicai` and `biolink` databases) and **Redis**
(cache + queue, `retry_after` 960). Railway predeploy on the app service runs
`php artisan migrate --force`. `podlink.fm/` 302s to podlink.ai; its
`/login`+`/register` 302 to app.podlink.ai (SSO magic-link path kept).

## 2. Identity & tenancy

One human = one MagicAI user + one Biolink user, joined **by email only** via
Biolink `admin-api/sso/login` (`PodlinkController` sends logged-in users to
their podlink.fm editor). Every dashboard route and MCP tool resolves the user
server-side; **no identity parameters anywhere** (canon R1). `podcast_shows`
and `youtube_connections` are UNIQUE per user_id → one show per account (known
Studio blocker).

## 3. Custom domain surface (inside magicai/)

- **Data**: `podcast_shows` → `episodes` (guid-keyed, `youtube_video_id` +
  `youtube_paired_manually` + `youtube_match_confidence`) → `episode_transcripts`
  (FULLTEXT body) → `transcript_segments` (ms timing, post-09-16 transcriptions);
  `analytics_snapshots` (daily op3/youtube history, since 09-17);
  `youtube_connections` (encrypted tokens).
- **Services**: `Op3Service` (op3.dev, 1h cache, prefix `https://op3.dev/e/`,
  NEVER modifies feeds) · `EpisodeSyncService` (RSS→episodes, hourly throttle) ·
  `YouTubeOAuthService`/`YouTubeAnalyticsService` (Data v3 + Analytics v2:
  views, demographics, watch stats; confidence-scored pairing ≥70 with manual
  override sticky) · `Biolink/BiolinkStatsRepository` (**the only** consumer of
  the read-only `biolink` DB connection — `BIOLINK_DB_*` are Railway reference
  vars; pinned schema users/links/track_links + 6h drift guard; note Biolink
  cron retains `track_links` only ~90 days by default) ·
  `Discovery/PodcastIndexClient` + `ContactCardService` (Find Shows).
- **Jobs/schedule**: `TranscribeEpisodeJob` (Whisper, credit-metered, ffmpeg
  refit, 400MB/90-min caps) · `podlink:snapshot-analytics` daily 04:10 UTC via
  `app/Console/CustomScheduler.php` (upstream extension point — don't edit the
  vendor Kernel).
- **Public API** (`routes/api.php`): `GET api/public/report/{hash}` (Show
  Report JSON, 30-min cache) · `GET api/public/feed-inspect` (powers
  podlink.ai/analyze; 15/min/IP, SSRF-guarded, read-only).
- **MCP server**: `/mcp` Streamable HTTP; OAuth 2.1 + PKCE + DCR (Passport =
  AS; discovery in `routes/ai.php`). **`routes/mcp.php` is the complete tool
  surface** (8 read-only tools, all FREE tier); limits 60/min + 2,000/day per
  user, DCR 10/hr/IP. Write tools require new granular scopes + re-consent
  (canon, not built).
- **Marketing redirects**: `RedirectLegacyMarketing` 301s app-host `/features`
  + `/pricing` → podlink.ai (config/marketing.php pricing array is SUPERSEDED
  — never copy numbers from it).

## 4. The license mechanism (incident 2026-09-18 — read before touching)

`ApplicationStatus` middleware (web group) gates EVERY app web route on
`storage/app/portal` (serialized MagicAI license state). That path is now a
**symlink to the `app/Extensions` Railway volume** (docker-entrypoint.sh), and
boot bootstraps the file from `LIQUID_LICENSE_DOMAIN_KEY` or
`MAGICAI_PURCHASE_CODE` if missing. If the app ever 302s everything to
`/license` again: check the volume file + those env names first. The same
volume also carries the `.env` stub for extension-written settings.

## 5. Env var names that matter (NAMES only — never commit values)

App: `OP3_API_TOKEN`, `OPENAI_API_KEY`, `YOUTUBE_CLIENT_ID/SECRET`,
`PODCASTINDEX_KEY/SECRET`, `BIOLINK_DB_*` (reference vars),
`BIOLINK_ADMIN_API_KEY` (crown-jewel: Biolink admin-api), `MAGICAI_PURCHASE_CODE`,
`MCP_RATE_LIMIT_PER_MINUTE/PER_DAY`, `MCP_DCR_RATE_LIMIT_PER_HOUR`,
`PODLINK_TRANSCRIBE_MAX_SECONDS`, `PODLINK_AUTO_TRANSCRIBE_NEW` (default off —
billing decision), `STRIPE_*` (present, not wired to plans yet), Passport keys.
Biolink: `DATABASE_*`, `SITE_URL`, `HOMEPAGE_REDIRECT_*`, `BLOG_REDIRECT_*`.

## 6. Verification rules (learned the hard way)

1. A push is not a deploy: confirm a **Vercel deployment EXISTS for the pushed
   sha** (09-12: a webhook miss silently kept prod stale) AND the **Railway
   deploy is SUCCESS per service** (app lags worker; SKIPPED = watch-path miss,
   normal for non-magicai commits).
2. Verify live with cache-busted requests; migrations confirmed in the
   predeploy log, not assumed.
3. No local toolchain on the ops machine (no php/composer/node) — Vercel build
   is the web type-check; Railway boot is the Laravel smoke test.
4. Never `git add -A`; explicit paths only. `[skip ci]` on docs-only commits.
5. The desktop scheduler tool is BANNED (froze the client twice); recurring ops
   (GSC Monday pull) are manual.
6. Claims: nothing ships that the claims matrix
   (`claude/feature-claims-truth-audit.md`) can't support; unshipped = roadmap
   tense; assistant claims say "Claude or any MCP-capable assistant".

## 7. Standing constraints

- External comms (posts/submissions/PR) hard-gated on Joelle's GO; code/site
  ships proceed on their own checklists. No "Minting House" in user-facing
  copy. No emails to anyone.
- Do not touch: live client RSS feeds/OP3 prefixes, client OAuth grants,
  customer billing, Railway topology, vendor cores beyond marked customization
  points, applied migrations.
- Vendor upgrade gates: MagicAI v11 and 66biolinks updates require
  re-verifying every custom touchpoint (see V3 audit §38 debt register).

## 8. Measurement (2026-10-07)

**One GA4 property** (`G-6BJQCTFXZZ`, property "Podlink") across all three
surfaces: podlink.ai (web layout.tsx), app.podlink.ai (magicai
`panel/layout/partials/head.blade.php` — covers auth + dashboard — and the
frontend `layout/app.blade.php`), podlink.fm public pages
(`biolink_wrapper.php`, preview-gated). **app.podlink.ai is a subdomain**: the
`.podlink.ai` `_ga` cookie spans it, so it carries the tag only — no
cross-domain config. **podlink.fm is a separate domain**: its tag and the
podlink.ai tag both set `linker: { domains: ['podlink.ai','podlink.fm'] }` so
.fm→.ai journeys stay one session and don't double-count as referrals.
(Optional belt-and-braces: mirror the domain list in GA4 Admin → data stream →
Configure tag settings → Configure your domains — founder console.)
**HubSpot tracking** (`js.hs-scripts.com/20159837.js`, portal "minting
house") runs on podlink.ai only — associates visits with CRM contacts once a
form identifies them; not on the app dashboard or creators' .fm pages.
**Search Console stays two domain properties by design** (podlink.ai — which
already covers app.* — and podlink.fm); the weekly Monday ops pull reads BOTH
and reports them side-by-side so the founder gets one combined view at the
reporting layer.

## 8b. Where the deeper docs live

`claude/WORK-CANON.md` (rules) · `claude/PODLINK_ECOSYSTEM_AUDIT_CONTEXT_V3.md`
(full 43-section audit) · `claude/LAUNCH-SPRINT-1-REPORT.md` + `claude/launch/`
(launch package + runbook + founder taps B1–B8) · `BRAND.md` (brand values,
magicai-side CSS system) · `web/DESIGN.md` (web design OS) ·
`web/docs/design/` (design org: DECISIONS, PAPERCUTS, audit) ·
`claude/SESSION_LOG.md` (build log).
