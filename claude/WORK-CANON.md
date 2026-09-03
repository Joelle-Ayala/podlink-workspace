# WORK CANON — the single to-do list (v1, 2026-08-25)
**This file supersedes scattered task lists.** JOELLE-TODO.md stays as the founder-facing
tap-by-tap subset; the frontend plan and handoff point here. Owners: **J** = Joelle-only ·
**C** = Claude-drivable now · **J→C** = her unlock, then Claude runs.
**M8 = Launch readiness** (claude/app-handoff-docs/13-launch-milestones…): billing test
flow · password-reset email · terms/privacy/contact exist · error logging · backups/rollback
· founder QA. Items marked **[M8]** block launch.

## A. Launch-blocking (sequence first)
| # | Item | Owner | Notes |
|---|---|---|---|
| A1 | Stripe activation + end-to-end signup→payment test [M8] | J→C | Admin ladder to Pro $29 first (J), then a real test purchase + refund; C can drive the test via lent session |
| A2 | Real legal pages before charging [M8] | J→C | /legal/* are noindex placeholders; C drafts from templates, J/counsel approves |
| A3 | Transactional email/SMTP (password reset works) [M8] | J→C | Pick provider (Postmark/SES), J creates account, C configures MagicAI mailer + tests |
| A4 | Admin account hygiene: admin email, 2FA, OpenAI key rotation [M8] | J | Credentials = hers by rule |
| A5 | Error logging + backups/rollback documented [M8] | C | Railway/Laravel config + runbook doc |
| A6 | Customize MagicAI SaaS features in admin (her item 1) | J→C | Feature visibility/gating per tier spec; C specs the exact toggle list, J clicks (or lends session) |
| A7 | Customize Biolink features in admin (her item 2) | J→C | Same pattern |
| A8 | Founder mobile/desktop QA pass [M8] | J | Last, after A1–A7 |

## B. Truth + analytics (the credibility spine)
| # | Item | Owner | Notes |
|---|---|---|---|
| B1 | Claims-truth verification in app (matrix v0 → final) | J→C | Lent desktop session; her item 3's client demo show on OP3 doubles as this |
| B2 | Megaphone side-by-side: 3 client accounts + OP3 prefix (her item 3) | J | JOELLE-TODO #4; feeds B1 + calibration |
| B3 | Engineering thread: episode persistence + transcript pipeline + unique(user_id) lift | C | Green-lit; spec ready; gates Studio/report/index-flip |
| B4 | Analytics level-up: ML2 YouTube + richer reports/APIs (her item 4 — appetite CONFIRMED) | C | = the differentiators section (percentile badge, insights v1, digest) + ML2; fold into B3 thread |
| B5 | Drip #1 click-verify → publish | J→C | 2 min; then changelog ships |
| B6 | Producer-universe count | J→C | Needs PI key (JOELLE-TODO #7) or dump route |

## C. Site + copy (in the committed order)
| # | Item | Owner | Notes |
|---|---|---|---|
| C1 | Services pages befores/afters → sign-off → ship | C→J→C | Next in audit order; voice guide binding |
| C2 | Feature pages template application (incl. deep RED fixes) | C→J→C | After services |
| C3 | Tranche-2 applications: case studies ×18, /contact, /pricing | C→J→C | Contact needs C4/C5 |
| C4 | Contact form backend + endpoints (her item 7) | J→C | Decide: form provider vs. Laravel endpoint; C builds once decided |
| C5 | Booking URL + response-time promise (her item 7) | J | Two one-liners |
| C6 | Branding voice interview → voice-guide TODOs closed (her item 5) | J→C | Question list: claude/branding-voice-interview.md — voice memo is fine |
| C7 | Product videos/images per template slots (her item 6) | J→C | Shot list: claude/asset-shot-list.md; capture via lent session possible |
| C8 | /pricing index flip | C | Checklist in pricing-page-template.md; gated on B1/B3 + v2 §7 decisions |

## D. Channels + infra
| # | Item | Owner | Notes |
|---|---|---|---|
| D1 | GSC verify + sitemap submit + Bing import | C | Desktop Chrome now restored — pending one go-ahead |
| D2 | www redirect (Cloudflare) | J or C | 3 min; C can attempt now that window is restored |
| D3 | Sending domains + warm-up (75-day clock) | J | JOELLE-TODO #8 — most time-critical J item |
| D4 | MCP branch review + deploy test → merge → directory listing prep | C | Ships WITH Pro; "first podcast MCP" claim gated on listing |
| D5 | Social accounts for footer + support inbox | J | Which platforms + one support address |
| D6 | v2 §7 decisions (Free caps / trial / Studio overage) | J | Three yes/nos |
| D7 | cPanel rotation · Spotify payout | J | Standing |
| D8 | app.podlink.ai cleanup middleware — verify deployed | C | RedirectLegacyMarketing committed by other thread; verify live |

**Sequence logic:** A-track runs parallel to B3/C1 and must complete before any paid
acquisition; D3 starts NOW (clock); C8 last. Nothing in C promises what B1 hasn't verified.

## Amendments 2026-08-25 (ML2/ML3 green light)
- B3/B4 UPDATE: ml2-lite shipped on main 08-23 (episodes table, EpisodeSyncService, YouTube OAuth+analytics, dashboard reads DB). Remaining engineering scope: transcript pipeline, Show Report, unique(user_id) lift, differentiators, then Twitch -> X per the ML3 verdict (claude/podlink-ml3-build-vs-buy.md; architecture reconciliation in feed-ingestion-show-report-spec.md).
- B5 CLOSED: drip #1 (Download Analytics) published 08-23 in changelog.ts by the ml2-lite thread.
- NEW D9 (J): TikTok + Meta app-review applications - start now, calendar-gated (JOELLE-TODO #12).
- NOTE: Joelle's podcast-analytics-API list (basis for a per-source verdict) is NOT in the project - awaiting re-paste; verdict framework ready in the ingestion spec when it lands.

## Amendments 2026-08-25 (later) - demographics + media kit directives
- HARD RULE: no import flows in the product, ever - OAuth-consented API data only (CSV/screenshot import ideas are dead).
- ML2 scope EXPANDED: YouTube demographics (age/gender/geo, watch time, traffic sources; channel+video, thresholds apply) = primary automated audience-demographics source. Verify API dimensions/quotas at build time.
- D9 amended: TikTok/Meta applications request insight scopes day one (JOELLE-TODO #12 amendment).
- NEW C9: Media Kit feature (sponsor-facing, OAuth-only sources) - spec at claude/media-kit-demographics-spec.md; sequences after ML2-expanded + Biolink stats, feeds the sponsorship line.
- NEW roadmap item: podcast rankings tracking (chart-position history - the dead Chartable feature); Spotify public charts + Apple category charts, terms verification gated; Later.
- Audio-listener demographics (survey tool): open non-blocker, deliberately not specced.

## EXECUTION ORDER LOCKED - founder decision 2026-08-25 (the now-plan)
1. Transcript pipeline - #1 engineering priority (gates Episode Report, insights v1, MCP v1.1, index flip).
2. ML2 YouTube demographics expansion (per media-kit-demographics-spec.md; verify API dimensions at build).
3. TikTok + Meta app-review submissions - Claude preps everything (scope names, application text, privacy-policy URL, demo plan) up to the fields needing her business identity, then hands off.
4. MCP branch review + deploy test (branch mcp-server), then v1.1 transcript tools.
5. Template applications + copy rewrites continue in the committed audit order (services -> features -> tranche 2).
VENDOR PURCHASES: ALL ON HOLD (podcast-data-vendors.md header) - approved-to-buy-later on her word; Pod Engine $75 first when released.

STATUS 2026-08-27 on item 4: branch was obsolete; MCP is live on MAIN, e2e-verified on prod (OAuth 2.1/DCR/PKCE + all 4 tools; annotations added in 75b1a80fe). See mcp-branch-review.md. Remaining for directory: setup-docs page + Joelle's Team org purchase + privacy policy URL.

## SEQUENCING NOTE 2026-09-02 - next NEW feature named (founder directive)
Contact-discovery P1 (contact-discovery-spec.md free layer: Podcast Index search by
niche + RSS/site-crawl contact cards - no vendor, no gate) is the NAMED NEXT NEW
FEATURE. Capacity check passed: transcript pipeline v1 SHIPPED and MCP submission
prep is code-complete (waiting only on Joelle's taps), so P1 slots WITHOUT delaying
either. ONLY GATE: her Podcast Index API key (JOELLE-TODO #7, bumped). Sequence once
key lands: P1 build -> Show Report page (now hero deliverable per gtm-plan amendment)
-> ML2 YouTube demographics -> TikTok/Meta prep. P1 is also the genuine-new-entry
drip slot flagged in the calendar, with founder-voice sample E as its announcement
spine (she is the proof: Dropbox first client, 106 deals, /work).

## HARD RULE - LAUNCH GATE (founder directive 2026-09-02)
NOTHING LAUNCHES WITHOUT JOELLE'S EXPLICIT FINAL GO after her verified-done
review. Specifically held behind the gate: directory submissions (Claude,
ChatGPT, AND the aggregator listings - they publish), launch posts (LinkedIn/
X, founder-voice or brand), and index flips that constitute launching
(/pricing, /features/mcp). Prep CONTINUES at full speed - drafts, checklists,
code, demo data - but the submit/post/flip actions wait. The review artifact
is claude/launch/README.md (the definitive launch checklist with statuses);
she verifies at a glance, then says GO. Ordinary drip entries for real
shipped features continue per the drip calendar's own checklist.

## Standing rule - frontend/backend lockstep (founder directive 2026-08-27)
The front end of the site progresses as the backend does, and vice versa. No frontend copy, page, or index flip may claim a capability the deployed backend cannot do (claims-truth rules apply), and no backend capability ships without its frontend surface scheduled in the same cycle. Every feature commit names its counterpart (or states why none is needed).
