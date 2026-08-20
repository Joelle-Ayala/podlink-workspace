# Podlink Frontend Overhaul — Master List

_Living doc. Add items freely; Claude works top-down by priority._
_Last updated: 2026-08-18 (evening — live state re-verified)_

## Context: Podlink is the podcast half of a company split

Minting House is splitting into two companies: **Podlink** (everything podcast —
editing, clips, advertising, guest booking, growth, plus the podlink.ai SaaS) and
**Grow Signal** (general growth marketing). Podlink is not a new venture — it is a
rebrand of a podcast practice that has run since January 2021 with 27 paying
clients and ~$320K in won podcast-service revenue.

Founder decision (2026-08-18): the site presents this work as **Podlink's own,
with no reference to the Minting House name**.

⚠️ The split itself is documented nowhere — not in Drive, Gmail, HubSpot, Canva
or Slack. Zero hits on "Grow Signal" anywhere. Client allocation between the two
entities has never been written down. Also unresolved: **MINTING HOUSE INC. has a
Florida _Intent to Administratively Dissolve or Revoke_ notice effective
2026-07-08**, which should be settled before either new entity trades on that
track record.

Full evidence base: `claude/podlink-services-evidence-brief.md`.

## Decision: the marketing site is leaving MagicAI

`podlink.ai` and `app.podlink.ai` were two custom domains on **one** Railway
service — one container, one Laravel app. That coupling caused four problems:

1. **Licence checks on the marketing homepage.** MagicAI's `ExtensionRepository::check()`
   validates against `request()->getHost()`, while the activation form
   (`resources/views/vendor/installer/magicai_c4st_Act.blade.php`) hardcodes
   `domain = url('/')` = `APP_URL` = `https://app.podlink.ai`. So `podlink.ai`
   was **never an activated domain** and started 302ing to `/license`.
   Nothing was wiped, and the Envato **Extended License is valid and irrelevant** —
   Envato licences *usage*; Liquid Portal activates *hostnames*. Two systems.
2. **No asset build on deploy** (no node on the Railway image, `public/build/`
   committed) — every marketing style had to be hand-written CSS, no Tailwind.
3. **The nav lived in a database table** (`settings.menu_options`), not in code.
4. **A copy change required redeploying the product.**

**Resolution:** `podlink.ai` becomes a standalone Next.js site on Vercel.
`app.podlink.ai` stays the licensed MagicAI install, untouched. All four
problems go away, and the licence check never sees `podlink.ai` again.

---

## Current state

| Piece | What it is | Where |
|---|---|---|
| `podlink.ai` | **NEW** — standalone Next.js 16 marketing site | repo `web/`, deploying to Vercel |
| `app.podlink.ai` | **MagicAI** (Laravel SaaS script) — the product | Railway svc `podlink-workspace`, root `/magicai` |
| `podlink.fm` | **Biolink** — public link-in-bio pages | Railway svc `biolink-public`, root `/biolink` |

Railway watch patterns now set (`magicai/**`, `biolink/**`) so `web/` pushes
don't trigger pointless Railway rebuilds.

---

## ✅ Shipped

- **podlink.fm → podlink.ai redirect** (`6ad6df8a9`, `17c8554de`). Verified live:
  `/` and bare `/blog` 302; `/blog/feed` 200; `/directory` 200; unknown username
  404 (routing intact). Query string forwarded, Biolink's internal `altum` param
  stripped. Kill switches `HOMEPAGE_REDIRECT_DISABLED` / `BLOG_REDIRECT_DISABLED`.
  **Promote 302 → 301 in ~2 weeks.**
- **New marketing site** (`80f2c1ad3`) — Next.js 16 App Router, React 19,
  Tailwind v4, TypeScript strict. **21 static pages**, full production build green.
  - `/`, `/features`, `/features/[slug]` ×8, `/pricing`, `/legal/{terms,privacy}`
  - All copy is typed data in `src/content/` — editing copy never touches a component
  - Design system in `src/components/` — server components except `SiteHeader`
  - `src/lib/site.ts` is the single source of truth for cross-domain CTAs into the app
- **Brand system carried over** — tokens ported into Tailwind v4 `@theme`.
  The rule that shapes everything: **#FF8C00 on white is 2.33:1 and fails AA for
  text AND the 3:1 UI threshold.** Orange is fill-only; buttons are ink-on-orange
  (8.20:1); orange text on light uses orange-700 (4.81:1); focus rings orange-600.
  Poppins self-hosted, not fetched from Google.
- **SEO** — per-page metadata + canonicals, JSON-LD (Organization, WebSite,
  SoftwareApplication, FAQPage, BreadcrumbList), sitemap derived from the feature
  list, robots, favicon/icon/apple-icon, and **a real OG image**.
- **MagicAI-side work** (`4c2288e25`) — still live on `app.podlink.ai`.

## 🟡 Delivered, not yet merged — services pages + dropdown nav (2026-08-18)

Seven new static pages plus a replacement header, authored as a drop-in bundle
(`podlink-services-pages.zip`) because the repo wasn't reachable from that
session. **Not committed. Copy in and commit.**

```
web/src/content/services.ts              all page copy, typed
web/src/content/proof.ts                 case studies + testimonials + clearance gating
web/src/components/services/index.tsx    section components (server components)
web/src/app/services/page.tsx            /services index
web/src/app/services/[slug]/page.tsx     6 service pages, statically generated
```

Routes: `/services`, `/services/{podcast-editing, podcast-clips,
podcast-advertising, podcast-sponsorship, get-booked-on-podcasts,
podcast-growth}`. Takes the site from 21 to 28 static pages.

**Founder decisions, 2026-08-18:**
- **Client permission granted across the board.** All case studies and
  testimonials are now `cleared` and render in production. Two entries stay
  hidden — CVS Health (66% CPA) and Oracle NetSuite (3× ROI) — because the issue
  there is factual, not permission: both appear in our own 2022 marketing with no
  underlying campaign report. Confirm the campaigns were ours to release them.
- **Podcast advertising is split into two pages.** `/services/podcast-advertising`
  sells to brands buying ad space; `/services/podcast-sponsorship` sells to
  creators selling it. Opposite buyers, opposite search intent, opposite money.
  Do not merge them back.

**Three integration edits required by hand:** add Services to `SiteHeader` nav ·
extend `web/src/app/sitemap.ts` with the service list · confirm the `siteUrl`
export name in `@/lib/site`.

**Proof gating.** `proof.ts` still exposes `SHOW_UNCLEARED_PROOF` (`false`), but
after the permission decision it only holds back the two `needs-verification`
entries above. Everything else renders.

**Copy decisions made:** no Minting House name anywhere (the four
testimonials that named it are stored de-named and are now cleared); the "20X / 39X / 40X reach" multipliers
were **dropped** — three different values across the old decks, all derived from
an addition model, with zero clip performance data behind any of them; the
download-percentile table (26+ / 72+ / 231+ / 539+ / 3,062+ in 7 days) leads the
growth page instead.

## ✅ Vercel + DNS cutover — DONE (verified live 2026-08-18)

Both former blockers are resolved. Verified directly:

- **`podlink.ai` is live on Vercel**, serving the Next.js site ("Record the
  episode. Podlink does the other four hours").
- **`podlink.ai` is no longer a custom domain on the Railway service.**
  `podlink-workspace` now carries only `app.podlink.ai`. The MagicAI licence
  check can never see the marketing hostname again — §4 is permanently closed.

## 🟡 app.podlink.ai cleanup — bundle delivered, not applied

`app.podlink.ai` is still serving a full duplicate marketing site: `/` (MagicAI
stock landing), `/features` (**now identical copy to podlink.ai**), and
`/pricing`.

⚠️ **`app.podlink.ai/pricing` is publicly rendering the INVERTED tiers** —
Creator $19 / Pro $49 — while `podlink.ai/pricing` ships `noindex`. The noindex
protection on one host is being undone by the other, and the wrong prices are
indexable today.

Delivered as `app-podlink-cleanup.zip`:
- `magicai/app/Http/Middleware/RedirectLegacyMarketing.php` — `/` → login or
  dashboard, legacy marketing paths → 302 to podlink.ai, blanket
  `X-Robots-Tag: noindex, nofollow` on the host. Middleware rather than route
  edits so a MagicAI script upgrade can't reinstate the landing page.
  Kill switch `APP_MARKETING_REDIRECT_DISABLED=1`.
- `magicai/routes/custom_routes_web.php` — emptied (kept, since
  `RouteServiceProvider` requires it).
- Deletion list for `resources/views/default/marketing/**`,
  `config/marketing.php`, `podlink-marketing.css` — **keeping**
  `podlink-tokens.css` and the `layout/app.blade.php` product-UI changes.

**Stray Railway service domains — DONE (2026-08-18, via Railway agent).**
`podlink-workspace-production.up.railway.app` and
`biolink-public-production.up.railway.app` are removed and verified returning
403. Custom domains verified untouched: `app.podlink.ai` serves the app,
`podlink.fm` still 302s to podlink.ai. Note: the config commits queued
redeploys of both services from the current `main` (same code — watch patterns
should resolve them as SKIPPED); if a deployment sits QUEUED in the Railway
dashboard for hours, it's from this and safe to ignore or cancel.

## ✅ CVS / Oracle verification — RESOLVED 2026-08-19: do not publish

Investigated to ground. CVS's 66% is Straight Line Hiring's claim copy-pasted
onto a CVS slide dated before the CVS campaign launched; CVS's own record shows
1,520 clicks / 0 applications. Oracle: no client relationship ever existed.
Founder decision 2026-08-19: **CVS restored as an outcomes-only case study**
(real engagement, real scope — Fortune-5 employer, Spotify/Pandora/iHeart,
geo-focused candidate awareness; zero borrowed figures). A banned-claims list
is enforced in a `proof.ts` header comment. **Oracle stays out permanently.**
Pattern warning stands: later Drive docs carry escalating fabricated CVS
figures and a fabricated testimonial; never source from them.

## 🟡 New since 2026-08-19 (subagent work, in the bundle)

- **/contact, /about, /case-studies + 11 detail pages, /resources lead magnet**
  built and packaged. Site now 43 static pages. New TODOs: `TODO(contact)`
  booking URL, `TODO(resources)` download URL (page ships noindex until wired).
- **Pricing & SLA decision sheet** at `claude/pricing-sla-decision-sheet.md` —
  2026 market ranges + recommended from-prices and turnaround commitments per
  category. Headlines: sponsorship 15% rev-share is well under the 20–40%
  market; the clips per-clip anchor is the only one priced above market; almost
  no competitor publishes prices or SLAs, so publishing real ones is a
  differentiator.

## 🔴 Blocked on Joelle

1. **Verify CVS Health (66% CPA) and Oracle NetSuite (3× ROI).** Both appear on
   the 2022 advertising landing page with no underlying campaign report found.
   Confirm these were our campaigns before they ship.
4. **Reconcile the My Divorce Solution revenue figure.** Two conflicting internal
   numbers: "$70K MRR in 90 days" vs "65% increase in monthly revenue". Neither
   is used on the pages until this is settled with Karen Chellew.

## P0 — next
6. **2026 service pricing.** Every `fromPrice` on the services pages is the last
   real price charged, but that's 2022–2023 vintage. `services.ts` carries a
   `TODO(pricing)` block. Resolve before `/services` is indexed.
7. **Turnaround / SLA language for editing and clips.** Five years of documents
   contain no client-facing delivery window. Every competitor publishes one.
8. **A `/contact` route.** Every services CTA points at `/contact`, which doesn't
   exist. Point it at a booking link or build the page.
9. **Finish product pricing.** ⚠️ Tier structure DECIDED (2026-08-17) — see
   `claude/pricing-and-personalization-spec.md`. Free = analytics + bio link;
   Pro $19 = Episode Content Kit; Creator $39–49 = Clip Studio (post-launch).
   `/pricing` ships **noindex + excluded from sitemap** until
   `web/src/content/pricing.ts` is rewritten and the 27 `TODO(pricing)` markers
   are replaced. Code-level blockers:
   - `podcast_shows` has `unique(user_id)` — shows hardcoded to 1, can't be gated
   - No episode is ever persisted (OP3 read live) — episodes/month can't be metered.
     **Episode persistence is the first engineering task of the pricing direction.**
   - Plan rows must be created in the **MagicAI admin, not by hand in Stripe**
   - `reset_credits_on_renewal` defaults to **false**
   - `BIOLINK_CREATOR_PLAN_ID` / `BIOLINK_PRO_PLAN_ID` are unreferenced in both codebases
   - Competitor pricing still needs live verification
10. **Decide: creator custom domains.** A non-exclusive custom domain with no
   `custom_index_url` defaults to the podlink.fm root, chaining
   `theirdomain.com → podlink.fm → podlink.ai`. None attached today.

## P1
11. **Instrument clip performance.** Clips are the entire thesis of the services
    offer and there is not one view count on file across five years. Start
    measuring on the current Jammcard work — it's the missing proof for the most
    important page.
12. **Product screenshots.** None exist. `ScreenshotFrame` renders an on-brand
    placeholder — drop images in `web/public/` and pass `src` + `alt`.
13. **Legal pages.** `/legal/terms` and `/legal/privacy` are noindex placeholders.
    Required before charging.
14. **Case study pages.** `proof.ts` is structured well enough to generate
    `/case-studies/[slug]` from the same data. Now unblocked — permission is
    granted, so this is purely a build task.
15. **Verify the content agent's 9 unverified product assumptions** — incl.
    whether clips work for audio-only shows, whether transcripts are editable,
    and whether multiple templates per show are supported.

## P2
16. **Conversion plumbing** — analytics + events, cross-domain signup handoff.
17. **Finish the MagicAI-side brand cleanup** (app.podlink.ai only). See `BRAND.md`.

## P3
18. **QA pass** — a11y audit, Lighthouse/CWV, cross-browser.

---

## Open questions for Joelle
- **Podlink vs Grow Signal:** which clients and which service lines go where? This
  is undocumented anywhere and it determines what belongs on this site at all.
- **Entity:** resolve the Minting House Inc. dissolution notice before the new
  brands claim its track record.
- **Custom domains:** should a creator's branded domain root land on podlink.ai?
- **Repo split:** the marketing site lives in `web/` inside the same repo.
  Deployments are independent, but it could be split later.
- **Pricing:** concrete Free-tier limits, and is there a trial?

## Notes for future sessions
- There is unrelated in-flight work in the repo working tree — a Podlink **MCP server**
  (`magicai/app/Mcp/`, `routes/mcp.php`, `config/mcp.php`, edits to
  `RouteServiceProvider` and `VerifyCsrfToken`). Uncommitted, deliberately left
  alone. **Don't `git add -A`.** This MCP server is load-bearing in the pricing
  spec (Layer 3 personalization) — it should get its own commit soon.
- `magicai/app/Extensions` is a **Railway volume**, empty in git.
- Canva holds the real creative archive: 15 client brand kits, clip-frame
  templates, pitch one-pager templates, rate cards. Job numbers run 79066 → 98012
  (Dec 2021 → Sep 2023) and are the only reliable delivery-volume evidence —
  the Descript workspace is empty and Asana/Slack belong to other orgs.
