# Podlink — Session Handoff for Chief of Staff

**Session date:** 2026-08-16
**Scope going in:** "podlink frontend website is weak" — redirect podlink.fm, add feature pages, add pricing, fix branding
**Scope going out:** the marketing site was moved off MagicAI entirely, and three conflicts with canonical planning docs were found

Read §5 first if you only read one section. It contains a shipped error and a
root cause that affects every future session.

---

## 1. Headline changes

1. **`podlink.fm` root now redirects to `podlink.ai`.** Live and verified.
2. **The marketing site left MagicAI.** `podlink.ai` is now a standalone Next.js
   app; `app.podlink.ai` remains the MagicAI install. This was a founder decision
   made mid-session, not a default.
3. **`podlink.ai` is currently DOWN** (302 → `/license`) and will stay down until
   DNS cuts over to Vercel. Root cause in §4. It is not a code fault.
4. **Three conflicts found against `GOAL_STATE.md` / `FUNNEL-ARCHITECTURE.md`,
   including inverted pricing tiers that were shipped.** See §5.

---

## 2. Architecture: before → after

| Surface | Before | After |
|---|---|---|
| `podlink.ai` | MagicAI (Railway) — same container as the app | **Next.js 16 on Vercel** (repo `web/`) — not yet deployed |
| `app.podlink.ai` | MagicAI (Railway) | unchanged, still the licensed install |
| `podlink.fm` | Biolink (Railway) — stock marketing homepage at root | Biolink, root 302s to podlink.ai; `/{handle}` pages unchanged |
| `shop.podlink.ai` | not built | planned (per FUNNEL-ARCHITECTURE) — not started |

**Why it moved.** `podlink.ai` and `app.podlink.ai` were two custom domains on
**one** Railway service — one container, one Laravel app. That coupling caused:

- MagicAI's licence check gating the marketing homepage (§4)
- no asset build on deploy → all marketing CSS hand-written, no Tailwind
- the nav living in a DB table (`settings.menu_options`), not in code
- a copy change requiring a redeploy of the product

All four are gone. Deploys are now independent.

**Repo layout.** The Next site lives at `podlink-workspace/web/` in the existing
repo. Railway watch patterns were set (`magicai/**`, `biolink/**`) so `web/`
pushes no longer trigger Railway rebuilds. Deployments are fully independent
despite the shared repo; splitting the repo later is possible but not required.

---

## 3. What shipped

### Commits (all pushed to `main`)

| Commit | What |
|---|---|
| `6ad6df8a9` | biolink: redirect podlink.fm root + `/blog` index to podlink.ai (302) |
| `17c8554de` | biolink: strip internal `altum` param from the forwarded query string |
| `4c2288e25` | magicai: Blade marketing system + brand tokens (now superseded for marketing; see §6) |
| `80f2c1ad3` | web: new standalone podlink.ai marketing site (Next.js) |

### podlink.fm redirect — verified live

```
podlink.fm/                     302 → https://podlink.ai
podlink.fm/?utm_source=test     302 → https://podlink.ai?utm_source=test
podlink.fm/blog                 302 → https://podlink.ai
podlink.fm/blog/feed            200   (RSS intact)
podlink.fm/directory            200
podlink.fm/<unknown-handle>     404   (routing intact, not swallowed)
```

- Gated on `empty($this->params[0])` so only the bare `/blog` index redirects;
  posts, categories and the feed still render.
- **302 on purpose, not 301.** A 301 is client-cached until the user clears site
  data and the kill switch costs a redeploy. **Promote to 301 ~2026-08-30** —
  there is a `TODO` in both files.
- Kill switches: `HOMEPAGE_REDIRECT_DISABLED` / `BLOG_REDIRECT_DISABLED` = `1`.
- **Accepted collateral, undecided:** a non-exclusive custom domain with no
  `custom_index_url` defaults to the podlink.fm root, so a creator's branded
  domain would chain `theirdomain.com → podlink.fm → podlink.ai`. None attached
  today. Needs a product decision.
- Also: `biolink-public-production.up.railway.app` is a live public host serving
  duplicate `/{handle}` pages. Consider removing that service domain.

### New marketing site (`web/`)

Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict.
**21 static pages, production build green.** Not yet deployed (§7).

- Routes: `/`, `/features`, `/features/[slug]` ×8, `/pricing`,
  `/legal/{terms,privacy}`
- Feature slugs (stable): `download-analytics`, `transcripts`, `show-notes`,
  `templates`, `multilingual`, `clips-and-social`, `newsletter`, `link-in-bio`
- All copy is typed data in `src/content/` — editing copy never touches a component
- Design system in `src/components/`; server components except `SiteHeader`
- `src/lib/site.ts` is the single source of truth for cross-domain CTAs into the app
- SEO: per-page metadata + canonicals, JSON-LD (Organization, WebSite,
  SoftwareApplication, FAQPage, BreadcrumbList), sitemap derived from the feature
  list, robots, favicon/icon/apple-icon
- **A real OG image** at `/opengraph-image` — the old site had the meta tag wired
  with nothing behind it, so every shared link previewed blank
- Poppins self-hosted (woff2 in `src/fonts/`), not fetched from Google

**Deliberately not indexed:** `/pricing` ships `noindex` and is excluded from the
sitemap (limits are placeholders — 27 `TODO(pricing): unverified limit` markers in
`web/src/content/pricing.ts`). `/legal/*` are noindex placeholders.

**No fabricated social proof anywhere.** The old site's stock testimonials and
customer counts were not carried over and nothing invented replaced them. Proof
elements are verifiable product facts. This matches the standing rule in
`FUNNEL-ARCHITECTURE.md` §10, which was enforced before that doc was found.

**Vendor strings audited clean.** MagicAI / LiquidThemes / Biolink / AltumCode /
CodeCanyon appear only in code comments, never in customer-visible output.

---

## 4. The `/license` incident — resolved by architecture, not by licensing

`podlink.ai/` returned 200 until 11:38 UTC and 302 → `/license` after the 12:06
deploy. **The deploy was not the cause.** Evidence: same container, same code —
`app.podlink.ai/` 200, `app.podlink.ai/features` 200, `podlink.ai/` 302.

**Root cause.** `magicai/app/Domains/Marketplace/Repositories/ExtensionRepository.php::check()`
sends `x-domain: request()->getHost()` to Liquid Portal and caches the answer
per-host for 24h. The activation form
(`resources/views/vendor/installer/magicai_c4st_Act.blade.php`) hardcodes
`domain = url('/')` = `APP_URL` = `https://app.podlink.ai`.

So **`podlink.ai` was never an activated hostname.** It had been coasting on a
stale cache entry that expired. Nothing was wiped.

**The Envato Extended License is valid and irrelevant.** Certificate confirmed:
Extended, LiquidThemes, item 45408109, licensee "minting house", purchased
2025-07-28. Envato licenses *usage*; Liquid Portal activates *hostnames*. Two
different systems.

**Two things I asserted and later disproved** — flagging so they don't propagate:
- `/license` is NOT a re-activation page. It's the vendor installer route and it
  bounces to a sign-in screen. The real page is `/dashboard/admin/license`.
- `MAGICAI_PURCHASE_CODE` is set in Railway but **is never read by the
  application**. It is a dead variable. The live source of truth is
  `settings_two.liquid_license_domain_key` in the database.

**Resolution:** once DNS moves `podlink.ai` to Vercel and it is detached from the
Railway service, MagicAI never sees that hostname again. `app.podlink.ai` stays
licensed and untouched. No licence purchase needed.

---

## 5. ⚠️ Conflicts with canonical docs — READ THIS

`GOAL_STATE.md` and `FUNNEL-ARCHITECTURE2.md` were found **loose in
`~/Downloads`**, not in the repo and not in the Claude project. Two agent
workstreams this session built confidently against stale strategy as a result.

### 5.1 Pricing tiers are INVERTED (shipped)

| Price | `GOAL_STATE.md` (canonical) | What shipped in `web/src/content/pricing.ts` |
|---|---|---|
| ~$19/mo | **Pro** — Episode Content Kit | **Creator** |
| ~$39–49/mo | **Creator** — AI Clip Studio | **Pro** |

Exactly swapped. Tier *meanings* are also missing: Pro should be the content kit
(AI Writer Templates, newsletter, transcripts); Creator should be the buy-once
AI Clip Studio unlock (Viral Clips, AI Captions, AI Video Editor, AI Dubbing).
Studio is post-launch.

The pricing agent worked from a `PRICING.md` derived from the codebase; it never
saw `GOAL_STATE.md`. **Mitigating factor: `/pricing` already ships noindex.**

### 5.2 Brand system conflicts (3 open questions)

`GOAL_STATE.md` sets pass/fail brand criteria. What was built deviates on three
points:

| Rule in GOAL_STATE | What was built | Note |
|---|---|---|
| Background `#0f0f12` near-black canvas, text `#f0ede6` off-white | Light-first site with dark bands | Is the dark canvas a rule for the marketing site, or only the app UI? |
| Wordmark **colour-split**: "Pod" off-white + "Link" `#FF8C00`, all-white under ~14px | Monochrome `fill-current` wordmark | **The spec has a trap:** "Pod" in `#f0ede6` on a white header is 1.17:1 — the exact invisible-logo bug fixed this session. Colour-split assumes a dark ground. Either the header goes dark or the wordmark stays mono. |
| Mono-colour: orange + dark/light ONLY, no secondary colour | Status colours (success/danger/warning/info) in tokens | Used for comparison-table states. Permitted or not? |

**Contrast finding that must survive any brand decision:** `#FF8C00` on white is
**2.33:1** — fails WCAG AA for text *and* fails the 3:1 non-text/UI threshold.
Therefore orange is fill-only; buttons are ink-on-orange (8.20:1); orange text on
light uses orange-700 `#B85600` (4.81:1); focus rings use orange-600 `#DB6E00`.
This is measured, not preference.

### 5.3 Commerce plan: the July handoff is superseded

`FUNNEL-ARCHITECTURE.md` (2026-08-05) supersedes
`podlink-commerce-supplemental-handoff.zip` (2026-07-26) on domain architecture:

- Storefront and funnels live on **`shop.podlink.ai`**, a separate surface — **not**
  `podlink.ai/shop`, `/shop/[collection]`, `/products/[handle]` as the July docs say.
- Shopify checkout's primary domain set to `shop.podlink.ai` so no
  `*.myshopify.com` is ever visible.
- Also settled there: headless post-purchase one-click OTOs **do** work (they
  extend Shopify Checkout); in-checkout offers are Plus-only, so the order bump
  moves onto our own cart page.

The July handoff also assumes "Podlink frontend — hosted on Railway." That is now
wrong, and the change **helps**: headless Shopify Storefront API on Next.js/Vercel
is the canonical stack for this, versus GraphQL-from-Blade with no asset build.
Shopify env vars now belong in Vercel, not Railway.

### 5.4 Missing documents

`GOAL_STATE.md` references companions that **could not be found anywhere on disk**:

- `PODLINK-PROJECT-CONTEXT.md` — stated to define WHAT and WHY
- `SHOP-CONTEXT.md`
- `SHOP-MILESTONE-SPLICE.md`
- `RESTART-KICKOFF-PROMPT.md`

### 5.5 Root cause and the fix

Canonical strategy lives in a Downloads folder. Until it is in the repo and/or the
Claude project knowledge base, every session re-derives strategy from the codebase
and drifts. **This is the highest-leverage fix on the list.**

Caveat: `GOAL_STATE.md` contains live purchase codes (MagicAI and Biolink). Decide
whether those belong in a git repo before committing it.

---

## 6. Now stale / superseded

- **`magicai/routes/custom_routes_web.php`, `magicai/resources/views/default/marketing/**`,
  `magicai/config/marketing.php`, `podlink-marketing.css`** — the Blade marketing
  system from commit `4c2288e25`. Superseded by the Next site. Each is a file a
  MagicAI script upgrade could conflict with, and a second place someone might
  edit marketing copy. Remove once podlink.ai is live.
  **KEEP** `podlink-tokens.css` and the `layout/app.blade.php` + panel head
  changes — those style the product UI, which is still MagicAI.
- **`app.podlink.ai` is now a duplicate marketing site.** Verified: `app.podlink.ai/`
  returns 200 and renders the full MagicAI landing page; `app.podlink.ai/features`
  returns 200. Once podlink.ai is live that is two public marketing sites with
  near-identical copy. **Decide before DNS cutover, not after.**
- **The July commerce handoff** — see §5.3.

---

## 7. Blocked on the founder

1. **Grant Vercel access to the GitHub repo.** Vercel returns `repo_not_found` for
   `Joelle-Ayala/podlink-workspace`. Fix at github.com/settings/installations →
   Vercel → Repository access → add `podlink-workspace`. Then the project is
   created with `rootDirectory=web` and deployed. **Nothing ships until this.**
2. **DNS cutover after the deploy verifies.** Add `podlink.ai` to Vercel, update
   DNS, then **remove `podlink.ai` from the Railway `podlink-workspace` service** —
   that is what permanently ends the licence check on that hostname. Keep
   `app.podlink.ai` on Railway.
3. **Shopify store is a bare trial.** "My Store" at `w11bww-b3.myshopify.com`,
   trial plan, default name, no catalog. Cannot sell until upgraded.

---

## 8. Known code-level constraints (found by audit, not assumed)

These bound what pricing can promise:

- `podcast_shows` has `unique(user_id)` — **shows are hardcoded to 1 per user** and
  cannot be gated.
- **No episode is ever persisted** — OP3 is read live into a view, so
  "episodes/month" cannot be metered without new code.
- Plan rows must be created in the **MagicAI admin, not by hand in Stripe** —
  saving a plan calls `StripeService::saveProduct()`. Manual Stripe work desyncs
  checkout.
- `reset_credits_on_renewal` defaults to **false**. Set it per plan or quotas never
  reset.
- `BIOLINK_CREATOR_PLAN_ID` / `BIOLINK_PRO_PLAN_ID` exist as Railway vars but are
  **unreferenced in either codebase**.
- `magicai/app/Extensions` is a **Railway volume**, empty in git — code there is
  invisible to a repo checkout, and MagicAI extensions install only via the admin
  marketplace UI, never from the CLI.

---

## 9. New work created by the architecture change

- **Cross-domain attribution.** Signup is now `podlink.ai → app.podlink.ai`, and
  commerce will add `podlink.ai → shop.podlink.ai → Shopify checkout`. Campaign
  params die at each boundary without forwarding. All CTAs route through
  `appUrl()` in `src/lib/site.ts`, so forwarding is one file. Useful: both hosts
  share the registrable domain `podlink.ai`, so a `.podlink.ai` cookie spans them —
  **not** true of `podlink.fm`.
- **Pricing has two sources of truth** — hand-authored TS in
  `web/src/content/pricing.ts` vs plan rows in MagicAI + Stripe. Nothing keeps them
  in sync. Either treat the content file as spec and sync at release, or expose a
  public JSON endpoint the Next build fetches with ISR.
- **Product screenshots are now the single biggest credibility gap.** None exist.
  `ScreenshotFrame` renders an on-brand placeholder; drop images in `web/public/`
  and pass `src` + `alt` — no other change needed.

---

## 10. Unverified content claims needing a product owner

The content agent flagged 9 assumptions it could not verify. The ones that would
be visible errors:

- clips work for **audio-only** shows (copy says clips are cut "with the words on
  screen"; if the clipper requires video, the `clips-and-social` FAQ is wrong)
- transcripts are **editable** and copyable out
- **multiple templates per show** (interview vs solo)
- newsletter generates **plural** subject-line options
- pre-prefix episodes aren't measured; host stats won't match OP3 exactly

---

## 11. Operational notes for future sessions

- **There is uncommitted, unrelated work in the repo tree** — a Podlink **MCP
  server** (`magicai/app/Mcp/`, `routes/mcp.php`, `config/mcp.php`, plus edits to
  `RouteServiceProvider` and `VerifyCsrfToken`). It was deliberately left alone
  and committed around. **Never `git add -A` in this repo.**
- No `gh` CLI on the founder's machine. Git push works via stored credentials.
- Railway watch patterns are now load-bearing: `magicai/**` and `biolink/**`. If
  removed, every `web/` push rebuilds the product services.
- Post-deploy check for the redirect, because this class of bug fails silently:
  `curl -sI https://podlink.fm/ | head -1` → expect 302.
