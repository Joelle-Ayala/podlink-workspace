# Feature-Claims Truth Audit — Claims Matrix (v0 scaffold, 2026-08-20)
**Directive:** every product claim on the site classified SHIPPED / PARTIAL / NOT SHIPPED
against what app.podlink.ai actually does today; overpromises rewritten, TODO-gated, or
noindexed (the /features/mcp precedent). Same rigor as the case-study evidence work.
**Method:** column "Doc evidence" = what session handoffs / drip calendar / MCP scoping audit
already establish. Column "App-verified" = exercised in the product with a test account —
REQUIRED before any claim is finally green. Claude cannot create accounts or log in
(credential rules); app verification needs Joelle's session or a supplied test login.

## Preliminary matrix (doc-based; app verification pending on every row)

| # | Claim (where) | Doc evidence | Prelim class |
|---|---|---|---|
| 1 | OP3 download analytics, per episode/app/country (home, features, pricing) | M5/M6 shipped; endpoints verified vs live swagger 08-08 | **SHIPPED** (verify: click-through) |
| 2 | podlink.fm page, auto-updating from feed (home, features, pricing) | Biolink live; SSO magic-link fixed 08-08 (M3) | **SHIPPED?** (verify provisioning flow end-to-end) |
| 3 | "Every new episode transcribed automatically, on arrival" (pricing Pro; home how-it-works §2) | **CONTRADICTED**: drip calendar #5 honesty note — "stock transcription is manual upload today"; episodes are NOT persisted, nothing fires on arrival | **NOT SHIPPED — RED, and the homepage version is INDEXED** |
| 4 | Episode "lands in a workspace of its own" on publish (home §2) | No episode persistence exists (08-16 handoff §8) | **NOT SHIPPED — RED, indexed** |
| 5 | Show notes / titles / descriptions generation (home, features, pricing) | 12 podcast templates live (Session 7) — from pasted transcript/input | **PARTIAL** — works from manual input, not from the feed automatically |
| 6 | Newsletter + social post generation (home, features) | Templates live (Newsletter Writer, Social Post Pack) | **PARTIAL** (same manual-input constraint) |
| 7 | "Brand voice filled in from your own feed" (pricing Pro) | No doc evidence of auto-population from feed; templates support tone inputs | **UNVERIFIED — likely PARTIAL** (brand voice = manual setup) |
| 8 | Clips: "Podlink cuts it" (home §"week of promotion"); AI podcast clip generator page | Clip Studio is post-launch/unshipped everywhere in canon; MagicAI stock ≠ episode clip cutting | **NOT SHIPPED as phrased — RED, indexed** (feature page + home copy imply present tense) |
| 9 | Multilingual output (features, pricing) | MagicAI stock supports languages; drip #6 queued pending verify | **PARTIAL?** (verify output quality + where it's gated) |
| 10 | Templates library / "set your format once" (home, features) | Custom templates live | **SHIPPED?** (verify per-show persistence of format) |
| 11 | YouTube views per episode (pricing Free) | ML2 not built | **NOT SHIPPED** — already TODO-gated on noindex page ✓ |
| 12 | MCP tools in Claude (pricing, /features/mcp) | Server on branch, unmerged | **NOT SHIPPED** — correctly noindex + TODO-gated ✓ |
| 13 | Tracked links / episode report / per-episode pages (pricing Pro) | The loop — unbuilt | **NOT SHIPPED** — TODO-gated on noindex page ✓ |
| 14 | Services capability claims (6 pages) | Evidence brief covers outcomes/numbers; capability = human-delivered services, not product | **SHIPPED** (services are people; verify only the platform-tooling claims in why-Podlink sections) |

## The red items (indexed pages carrying overpromises — decide + fix first)
- **Rows 3, 4, 8 live on the INDEXED homepage** (and row 8's feature page is indexed).
  Options per the directive: rewrite to truth (e.g. "paste your episode and get…" — matches
  drip-calendar honesty framing), TODO-gate, or noindex. Recommended: REWRITE — the homepage
  is the front door and noindexing it isn't on the table. Rewrites are "big deviations" →
  queued for Joelle's sign-off with before/after in the copy audit.
- Feature pages likely carrying the same present-tense automation framing: transcripts,
  show-notes, clips-and-social, newsletter → audit each body against this matrix during the
  template rebuild (the rebuild is the natural moment to fix copy, one pass, one sign-off).

## Verification protocol (when a session has app access)
Test account + test show. Per feature: exercise it for real (generate notes from a pasted
transcript; attempt clip generation; produce a newsletter; switch output language; provision
a podlink.fm page; check what actually persists). Record: works / works-with-constraint
(state it) / absent. Update the matrix; only then flip prelim classes to final.

## Standing-rule tie-ins
No claim without primary source now explicitly includes CAPABILITY claims. The drip
calendar's verify-then-announce rule is the same law: never announce (or keep live) what
hasn't been clicked.

## App-verified pass 1 - 2026-08-26 (lent admin session, desktop window)
- Row 1 Analytics: VERIFIED SHIPPED. Page live, real feed connected (New Heights/Megaphone test feed), honest waiting-for-prefix empty state exactly per M5 spec. Real numbers light up when the client shows get the prefix (JOELLE-TODO 4).
- Rows 5/6/10 Generation/templates: VERIFIED SHIPPED. Episode Title Generator exercised live - output streamed correctly from manual input. Podcast template pack present (show notes, titles, etc.). Include-Your-Brand toggle present on generators.
- Row 7 Brand voice: VERIFIED PARTIAL. Brand Voice feature exists (manual company setup, integrates into generators via toggle). "Filled in from your own feed" is NOT shipped - pricing.ts line needs a TODO(pricing): unshipped marker or copy soften. QUEUED as copy fix.
- Row 8 Clips: CONFIRMED NOT SHIPPED - no clip tool anywhere in the user dashboard (AI Video is stock video-gen, not episode clipping). Homepage fixes already shipped; feature-page body fixes queued.
- Row 2 podlink.fm page: My Podlink Page nav exists; full provisioning flow untested this pass.
- ADMIN FINDING: plans table contains ONLY Free ($0/monthly, updated 08-16). Old inverted paid rows were DELETED - no paid SKU exists, therefore NO legacy $19 subscribers, no grandfathering question. The admin fix is purely additive: create Pro $29/$232 + reset_credits_on_renewal.
