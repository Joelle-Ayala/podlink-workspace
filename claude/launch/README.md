# PODLINK LAUNCH — the one folder (2026-09-02)
**HARD RULE (WORK-CANON, narrowed per Joelle same day): the gate covers
EXTERNAL COMMS ONLY.** Held for her explicit GO: directory submissions
(Claude + ChatGPT + aggregators — they publish a public listing), launch
posts (LinkedIn/X), PR/outreach, and anything framed as a launch
announcement. NOT gated: code deploys, site updates, feature ships, and
index flips — /pricing flips when its own 5 conditions clear (B5 admin
ladder is the outstanding one), /features/mcp on its own 4-condition list.
Ordinary drip changelog entries continue as before.

This folder REFERENCES the canonical docs rather than duplicating them
(founder instruction: no drift). Every launch-marketing doc lives at exactly
one path, indexed below.

---

## A. THE LAUNCH CHECKLIST (verify-at-a-glance)

### ✅ DONE — code + content, verified live
| # | Item | Proof |
|---|---|---|
| 1 | MCP server live on app.podlink.ai, OAuth 2.1/DCR/PKCE e2e-verified with a real client | mcp-branch-review.md verification record |
| 2 | All 6 tools live (4 analytics + transcript search/read), tool annotations (title+readOnlyHint) | live tools/list, 09-02 |
| 3 | Rate limits: 60/min + 2,000/day per user + DCR per-IP; verified counting | X-RateLimit headers live |
| 4 | Transcript pipeline v1 (one-click, credit-metered, 90-min cap) | migration confirmed on prod, 09-01 |
| 5 | Setup-docs page /features/mcp/setup (HowTo+FAQ schema, 4 prompts) — indexable, sitemapped | live |
| 6 | llms.txt · privacy policy v1 DRAFTED and live at /legal/privacy | live (needs her green light, B1) |
| 7 | Site launch-ready: services template + hybrid pricing + feature template on all 14 pages; claims-truth fixes (transcripts/clips honest) | live, cache-bust verified |
| 8 | support@podlink.ai wired into privacy/setup/contact copy | live (mailbox = B3) |
| 9 | Listing copy drafts (name/slug/tagline/description, both variants) | mcp-directory-launch-plan.md §4 |
| 10 | Launch posts drafted in her voice (reports-chore #1, booking spine, clips origin, booking thesis, X one-liner) | founder-voice-guide.md §3 samples A–E |
| 11 | Keyword clusters + GSC scoreboard + weekly manual pull cadence | seo-gsc-plan.md |
| 12 | Growth-research patterns absorbed as acceptance criteria (free-read rule, submit-early logic, rejection pre-empts) | mcp-growth-research-podlink.md + launch-plan amendment |
| 13 | Drip #1 (Download Analytics) published | changelog live, 08-25 |

### 🔧 STAGED — was in-flight, now DONE (2026-09-10 full-stage pass)
| Item | State |
|---|---|
| Show Report (HERO) | ✅ LIVE — opt-in share, 4 cross-channel columns (OP3/YouTube views/demographics/Podlink page) |
| Contact-discovery P1 | ✅ LIVE — keyless contact cards work; search lights on her key |
| Episode detail page + transcripts + MCP v1.1 | ✅ LIVE |
| /claude landing page | ✅ LIVE, indexable, zero directory claims until listing day |
| Aggregator + directory listing pack | ✅ `listings-and-rehearsal.md` — one paste-ready metadata pack + per-directory field inventory (dress rehearsal walked to the portals' edges) |
| LinkedIn one-pager (Gott gate A) | ✅ `linkedin-one-pager.md` — positioning + the 10 objection answers (her reply crib sheet) |
| Launch video script + shot list | ✅ `launch-video-script.md` — recording is hers, after her two data clicks |
| GO-day runbook | ✅ `go-day-runbook.md` — submission day + listing-live day + numbers post, fully ordered |
| Rate limits under burst | ✅ verified counting per-IP unauth (60/min headers) + per-user/daily authed |
| Full site sweep | ✅ 26/26 surfaces HTTP 200 (2026-09-10) |
Still genuinely open on my side: TikTok/Meta submissions ride HER identity fields (prep doc done); ChatGPT-directory terms page (needed before THAT submission, not Claude's); brand-concept decision pending her pick (site swap is cheap when she chooses).

### 👤 HERS — the verified-done review list (the GO conditions)
| # | Item | Time | Why it gates |
|---|---|---|---|
| B1 | Privacy policy green light — read podlink.ai/legal/privacy, approve or edit | 5 min | submission field; rejection cause if missing |
| B2 | Claude Team org purchase (minimum seats) | 10 min | the submission portal requires it |
| B3 | support@podlink.ai alias in Google Workspace | 1 min | on the privacy page + submission form; currently bounces |
| B4 | Demo OP3 data — prefixes on the 3 Megaphone client shows | 15 min | reviewer test account must never see empty results |
| B5 | Admin pricing ladder (Pro $29/$232, Studio; reset_credits_on_renewal) | 10 min | pricing claims + /pricing index flip condition |
| B6 | Podcast Index API key | 3 min | unlocks the next NEW feature (not submission-gating) |
| B7 | HubSpot meetings page + send the link | 3 min | /contact calendar-primary (wanted, not gating) |
| B8 | **FINAL GO** — review this checklist, reply "GO" (or itemize what's not done) | — | the gate itself |
Also standing (GTM, not launch-gating): sending domains (75-day clock, #8) ·
cPanel rotation · Spotify payout · TikTok/Meta identity fields.

**When B1–B4 + B8 are done → directory submission same day. Launch posts
fire on the listing-live day per the launch plan cascade — behind B8.
The /pricing flip is NOT behind B8: it proceeds on its own 5-condition
checklist (pricing-page-template.md) the moment B5's admin ladder lands and
the remaining TODO(pricing)/claims/sitemap checks clear.**

---

## B. WHERE EVERYTHING LIVES (canonical paths — edit there, never fork)
| Material | Canonical doc |
|---|---|
| Directory launch runbook (Claude + multi-platform §6 + Gott LinkedIn system §7 + listing copy §4 + asset list + growth-research amendment + D-1) | `claude/mcp-directory-launch-plan.md` |
| Feature release sequencing (drip calendar; STATUS AMENDMENT 09-02 = current: drip #1 out, transcripts/MCP v1.1 queued, contact-discovery P1 next new entry, Show Report hero tentpole) | `claude/feature-drip-calendar.md` |
| Growth-research patterns (aggregators, rejection causes, first-call wow, free-read rule) | `claude/mcp-growth-research-podlink.md` |
| Founder voice + THE LAUNCH POST DRAFTS (samples A–E; D = launch post #1) | `claude/founder-voice-guide.md` |
| Brand voice + divergence rules | `claude/voice-guide.md` (§7–8) |
| Positioning spine (report = hero, talk-to-podcast second act, "oh bonus" tools, two-door reconciliation, founder-truth features) | `claude/gtm-plan.md` (09-02 amendment) + `claude/cross-channel-report-validation.md` |
| Keyword clusters A/B/C + GSC scoreboard cadence | `claude/seo-gsc-plan.md` |
| Founder story (raw + evidence gates + Q1 resolved) | `claude/founder-story-raw.md` |
| /about founder-section draft (HELD for sign-off) | `claude/about-page-draft.md` |
| Booking feature line P1→P4 (send-layer verdict) | `claude/contact-discovery-spec.md` + `claude/contact-discovery-p3-amendment.md` |
| MCP scoping + acceptance criteria | `claude/PODLINK-MCP-SCOPING.md` |
| Master to-do + hard rules (incl. THIS launch gate) | `claude/WORK-CANON.md` · her taps: `claude/JOELLE-TODO.md` |
