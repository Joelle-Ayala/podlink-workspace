# MCP Directory Launch Plan — the Rondot playbook, run properly
**Date:** 2026-08-25 · **Status:** PLAN ONLY — nothing deployed, nothing submitted
**Trigger:** Joelle's screenshots of @samuelrdt's X post (8/25/26, 19K views): MCP server + OAuth + Claude connector directory → breakreach.com went 2 → 109 → 61 daily uniques, 41 signups, 13 paid trials in a weekend, $0 spent, 0 launch posts.
**Grounded in:** PODLINK-MCP-SCOPING.md (incl. 08-25 amendment), WORK-CANON.md (D4 + locked execution order), mcp-gtm-strategy.md, feature-drip-calendar.md, voice-guide.md §2, web research 2026-08-25 (sources at bottom).
**Relationship to mcp-gtm-strategy.md:** that doc is the strategy (why the channel matters). This is the launch runbook (what happens, in what order, owned by whom). Where they overlap, this doc governs execution.

---

## 1. The playbook, deconstructed

Why it worked for breakreach — three mechanisms, all verifiable:

1. **Directory browse traffic is pre-qualified.** Everyone browsing the connector directory is a paying Claude user (custom connectors = Pro+) actively looking for tools to wire into their assistant. 109 visitors → 41 signups (38%) → 13 paid trials (32% of signups) is not normal top-of-funnel math; it's what high-intent looks like.
2. **Zero CAC, zero content.** The chart footer says it: "0 ads · 0 launch posts — just the directory listing." The listing IS the acquisition asset. The only costs are engineering (already ~spent for us) and review-queue patience.
3. **Novelty window.** Community connectors are new enough that a fresh listing gets browse attention ("New" badge) and — bigger — Claude's *Suggested Connectors* engine has few incumbents per category to outrank. Cold-start ranking reads listing metadata; ongoing ranking is usage-based. First movers compound (mcp-gtm §2).

**PodLink's version is structurally better than breakreach's.** Breakreach entered a crowded category (social scheduling). The podcast slot is **empty**: verified against the directory again today (2026-08-25) via the current community catalog mirror (~1,625 connectors) — the only adjacent entries are Descript (editing — the layer we deliberately don't compete with) and ElevenLabs (voice gen). No Buzzsprout, Transistor, Castmagic, Podsqueeze, Riverside. Matches the 08-19 live check in mcp-gtm-strategy.md. **Re-verify by browsing the live directory on submission day — it's one search, and the "first podcast MCP" claim depends on it.**

The intent match is also tighter: "help me promote this week's episode" maps exactly onto our tool surface. Breakreach wins the moment a user wants to schedule posts; we win the moment a podcaster mentions their show.

---

## 2. Requirements gap analysis — Claude connector directory

Submission process (researched 2026-08-25, official docs): portal at claude.ai → admin settings → directory → submissions. Portal is always open; status + reviewer feedback in a dashboard; escalation via mcp-review@anthropic.com. Servers enter as **Community connectors** after automated policy scan; Anthropic may later invite a higher-touch **verified** review.

| Requirement (per Anthropic docs) | PodLink state | Gap / action |
|---|---|---|
| Remote MCP server, `https://`, Streamable HTTP or SSE | `laravel/mcp`, Streamable HTTP, on `mcp-server` branch | Review + deploy test (D4), then production deploy. DNS cutover to app.podlink.ai is a hard prereq (scoping §3) |
| OAuth 2.0; DCR / CIMD / static client ID supported | OAuth 2.1 auth-code + PKCE + DCR via `Mcp::oauthRoutes()` + Passport | Exactly the breakreach listing's shape. Known claude.ai rough edge in `laravel/mcp` (issue #210) — the P0 spike + a real custom-connector end-to-end test IS the mitigation |
| **Tool annotations:** every tool needs `title` + `readOnlyHint`/`destructiveHint`; missing annotations are flagged in the portal | Not in the v1 tool specs | **ADD before submission.** All four v1 tools are read-only → `readOnlyHint: true` + human titles. Transcript tools same. `generate_content` (v1.2, later) is the first non-read-only surface |
| **Privacy policy URL** — missing/incomplete = immediate rejection | /legal/* are noindex placeholders (WORK-CANON A2) | **BLOCKING.** A2 was already M8-blocking; it now blocks the directory too. Real privacy policy, live URL, before submission |
| Documentation URL (setup + usage) | /features/mcp built but noindex; no setup doc | Write a "Connect Claude to PodLink" setup page (scoping P4 already planned this). Can live before the index flip — docs URL ≠ marketing page |
| Support contact | No support inbox yet (WORK-CANON D5) | **J:** pick the support address. One-liner, but it's a form field |
| Listing assets: name ≤100 chars, tagline ≤55, description ≤2,000, 1–5 categories, icon, permanent URL slug | Not drafted | §4 below. Slug is permanent — get it right (`podlink`) |
| Test account credentials, fully populated, reviewer can run every tool end-to-end | No demo account | Demo account on the B2 client demo show (OP3-connected, real data) — doubles with the claims-truth work |
| Confirm every tool run by us (Inspector or live connector) | Pending branch review | Part of D4 acceptance |
| Seven compliance acknowledgments (first-party API, prompt injection, etc.) | — | Read-through at submission; our first-party-API + read-only v1 shape passes cleanly |
| **Team or Enterprise org required to access the submission portal** | Joelle is on an individual plan (assumed) | **GAP nobody mentions in the viral post.** Submitting requires a Claude **Team** org (Owner role). Budget a minimum-seat Team workspace as a launch cost — J decision |

**Net:** the server itself is ~ready in architecture terms (transport + OAuth are exactly what's required — the hard part is done). The gaps are annotations (small code), privacy policy (A2, already owed), docs page, support address, demo account, and the Team-org-to-submit surprise.

---

## 3. Launch sequence, owners, and gates

Canon order (WORK-CANON, founder-locked 08-25) stands: transcript pipeline is engineering priority #1, and the scoping amendment sequences: pipeline → MCP branch review + deploy test → v1.1 transcript tools → **then** listing + index flip.

> **DECISION D-1 for Joelle (flagged, not made):** the review queue is an unknown clock (community reports: 2 weeks to months). Submitting the **v1 analytics-only** server as soon as it's deployed would start that clock in parallel with the transcript pipeline, at the cost of listing copy that can't yet say "transcripts." The canon-compliant alternative (submit after v1.1) risks the empty-category window. This plan is written for the canon order; if Joelle says "start the clock," steps 4–6 pull ahead of the transcript gate and the listing copy ships analytics-first (§4 has both variants).

| # | Step | Owner | Gate to pass |
|---|---|---|---|
| 0 | Transcript pipeline lands (canon #1) | C | Per feed-ingestion-show-report-spec |
| 1 | MCP branch review + deploy test (branch `mcp-server`) | C | P0 spike: boots in MagicAI without config-cache/theme conflict; Inspector handshake; two-account cross-read test (R1); annotations added |
| 2 | Prereq assets in parallel: privacy policy live (A2) · support address (D5) · setup-docs page · demo account on B2 show | C drafts, J approves/creates | Privacy policy is a real URL; reviewer can log into demo account |
| 3 | Production deploy to app.podlink.ai (DNS cutover done) | C, J for credentials | Real claude.ai custom-connector end-to-end: OAuth consent → "how did my show do this week?" answered. **READY TO EXECUTE ON JOELLE'S WORD — nothing deployed yet** |
| 4 | Claude Team org + Owner access | J | Portal reachable at admin-settings/directory/submissions |
| 5 | Directory submission (portal steps: connection → tools sync → listing → use cases → auth → data handling → test creds → compliance) | J clicks, C preps every field (§4) | Submitted; dashboard tracked weekly; escalate via mcp-review@ if silent |
| 6 | **Listing live** — the unlock event | — | Verified by browsing the directory |
| 7 | Same-day unlock cascade: (a) re-verify podcast category still empty → claim locks in; (b) /features/mcp noindex flip + sitemap (TODO(mcp) in page.tsx) + copy moves present-tense; (c) voice-guide onlyness rows flip "NOT YET → YES"; (d) changelog tentpole entry (drip calendar: tentpole interrupts the drip); (e) announcement copy (§4) | C, J approves copy | Every claim survivable by a screenshot (drip standing rule) |
| 8 | The recreation post: PodLink's own numbers chart, posted only when the numbers exist (realistically listing-day +2 to +7) | J posts, C builds chart from GA4 | Real numbers only (§4) |
| 9 | Activation push (mcp-gtm 3.4): "Connect Claude" onboarding step + dashboard card — ranking is usage-based; ten active early podcasters beat any copy | C | Connected-account count moving |

**Measurement — make the funnel chartable like the screenshot.** GA4 is live (property "Podlink," stream podlink.ai, `G-6BJQCTFXZZ`, in layout.tsx):
- The listing's docs link and description URL carry `?utm_source=claude_directory&utm_medium=connector` → directory-attributed sessions isolable in GA4.
- Funnel: directory-attributed sessions → signup events → paid trials (Stripe, post-A1). Same three numbers as Rondot's post.
- **Activation metric (ours, better):** count of Passport token grants = connected Claude accounts, server-side, no GA4 needed. This is the number that drives directory ranking; watch it weekly.
- Caveat: users who connect *inside* Claude without visiting the site never hit GA4 — server-side connect events are the ground truth; GA4 measures the marketing halo.

---

## 4. Launch-day asset list

**Listing copy (voice-guide binding — no "seamlessly," no "supercharge," no bare "powerful"):**
- **Name:** `PodLink` · **Slug:** `podlink` (permanent) · **Categories:** productivity / marketing / analytics (podcast category doesn't exist yet — pick 1–5 nearest; being the reason a "Podcasting" category gets created is the good outcome)
- **Tagline (≤55 chars):** `Your podcast's numbers, transcripts, and voice` (46)
- **Description (≤2,000 chars), analytics-first variant (D-1 accelerated):** built from mcp-gtm 3.1 — "PodLink connects your podcast to Claude. Ask for your downloads by episode, app, and country — pulled live from the open OP3 standard, numbers a sponsor can check. See your top apps, your episode list, and your public podlink.fm page. Requires a free PodLink account and a connected RSS feed — no host migration, ever." — every noun a task a podcaster might hand an assistant; that's what the suggestion engine reads.
- **Description, post-v1.1 variant:** adds "Search and read your own episode transcripts — ask what you actually said in episode 12, and draft show notes that quote it."
- **Tool list wording (portal syncs from server — these are the `title` annotations):** `Get show overview` · `Get top listening apps` · `List episodes` · `Get your PodLink page` (+ v1.1: `Search your transcripts` · `Get an episode transcript`). All `readOnlyHint: true`.
- Icon, docs URL, privacy URL, support contact, use-case answers ("reads data only"), data-handling answers (own API; OP3 is upstream infrastructure we already disclose).

**/features/mcp index flip conditions (all true, then remove noindex + add to sitemap):** listing live · claims-truth row verified · copy audit pass to present-tense · GA4 annotation added for launch date.

**Announcement skeleton (evidence-gated — ship with slots empty until real):**
- Changelog (tentpole): "Talk to your podcast. PodLink is in the Claude connector directory — connect your show and ask your assistant for your numbers[, or what you said in episode 12]. The first podcast tool in the directory." *(last sentence only if re-verified on the day)*
- X/social recreation post, the Rondot format: how-to framing ("How a podcast tool gets its first users in 2026"), 3 steps, then **our real numbers with dates** — `{N} visitors, {N} signups, {N} paid trials by {day}. $0 spent.` — plus the GA4 chart annotated "Listed in the Claude connector directory." NUMBERS RULE: no rounding up, source = GA4 export + Stripe, chart states its universe (voice-guide §4). If the numbers are small, the honesty register IS the post ("41 visitors and 9 signups — from a listing, not a launch").
- Podnews / HN / AI-tools pitch (mcp-gtm 3.6): the "first podcast MCP" story + the Descript composability demo ("Descript edits your episode, Claude passes the transcript, PodLink promotes it").
- Chart asset: GA4 daily uniques, annotation arrow, footer "0 ads · 0 launch posts — just the directory listing."

---

## 5. Risks

| Risk | Exposure | Mitigation |
|---|---|---|
| **Review timeline unknown** | Unpublished; community reports 2 wks–months. Launch date is not ours to pick | Submit early (D-1), track dashboard weekly, escalate politely via mcp-review@ after ~3 weeks of silence. No public dates anywhere (drip rule) |
| **Community-connector trust banner** | Listing shows "haven't been verified by Anthropic… only connect developers you trust" (visible in the breakreach screenshot) | It didn't stop breakreach's 38% conversion. Counter with a thorough docs page + privacy policy; aim for the verified-review invitation later. Never screenshot-crop the banner out of our own marketing (Elmo rule) |
| **Free-tier load / credit exposure** | An agent loop can hammer tools far faster than a human (scoping R2/R3) | v1 is read-only + OP3 1h cache — cheap. Per-user rate limit on `/mcp` BEFORE listing, not after. `generate_content` stays out until metering proven; O2 tier-gating decision before v1.2 |
| **Claude-paid-plans-only audience** | Custom connectors need Claude Pro+ (scoping R6); free-Claude podcasters can't connect | Say it plainly in docs ("requires Claude Pro or higher"). Position as power feature; the directory audience is by definition already paying |
| **Team-org submission cost** | Portal needs a Team/Enterprise org — a real new line item nobody's playbook mentions | J decision; minimum seats; also becomes the org home for future listings |
| **`laravel/mcp` claude.ai OAuth edge (issue #210)** | Could fail exactly at the reviewer's connect step | P0 spike + live custom-connector test before submission is the gate — do not submit on Inspector-only evidence |
| **Cross-platform claims drift** | Listings will go live at different times on different platforms (§6) | Claims stay platform-scoped and unlock per listing — see §6 claims discipline |

---

## 6. Multi-platform expansion — one server, many directories

**Standing principle (engineering-binding): ONE MCP server.** MCP is now the cross-platform standard — OpenAI adopted it (ChatGPT connectors and the Apps SDK are MCP-based), Copilot's federated connectors are MCP-based, Gemini surfaces speak it. The Laravel server on app.podlink.ai serves every platform. Per-platform work is *listing/review/auth-config only*. **Never fork the server per platform** — if a platform needs an auth variant (CIMD, static client), it's config on the same codebase.

Researched state per platform (2026-08-25):

**ChatGPT (OpenAI) — the big pond, real directory, heavier review.**
- Path: apps/connector submission portal (Apps SDK). Requirements: production `https://…/mcp`, icon (64×64, <5KB), name ≤30 chars, short+long descriptions, privacy policy + terms, screenshots, **verified website/domain**, reviewer credentials, **5 positive + 3 negative test cases**, country availability. Manual review; timeline unpublished.
- Auth: DCR supported (our Passport DCR should work as-is); OpenAI *recommends* CIMD — note as a later config addition, same server.
- Delta for us: no UI needed (skip the Apps-SDK component layer; a tools-only connector is valid), domain verification for podlink.ai, the test-case matrix, T&C page (A2 covers it).
- Why it matters: the audience is roughly an order of magnitude larger than Claude's. Same empty-category logic applies — check their directory for podcast tools before submitting and screenshot it.
**Gemini (Google) — no consumer directory today.**
- The consumer Gemini app has no third-party MCP submission path. Gemini CLI's extensions gallery is self-serve but unvetted and mid-migration (Antigravity). Gemini Enterprise supports custom MCP servers admin-side — a sales asset, not a channel.
- Action: none now. Publish "works with any MCP client" setup docs; a CLI-extension manifest is an hour of work if the Antigravity gallery stabilizes. Re-check quarterly.
**Microsoft Copilot — enterprise path via Partner Center.**
- Path: "Apps and Agents for M365 and Copilot" offer in Partner Center; MCP-based *federated connectors* are the new shape (first wave: Canva, HubSpot); MCP server certification is in preview via Copilot Studio. Requires a Microsoft partner account + validation.
- Fit: wrong ICP for solo podcasters; plausibly right for Studio/producer agencies later. Defer until Studio is purchasable.
**Perplexity — no submission path.**
- Custom connectors are paid-tier, macOS-only, user-configured; no directory to be listed in. Action: setup-docs section only.

**Recommended order, with reasoning:**
1. **Claude** — server shape already matches exactly, category empty, suggestion engine favors first movers, and the playbook is *proven here* (the screenshots are the evidence). Smaller pond, but we're the only podcast fish in it.
2. **ChatGPT** — biggest audience; start domain verification + T&C early because their checklist is longer. Submit after the Claude listing is live (one launch at a time; reuse the demo account + test cases).
3. **Copilot** — Partner Center, gated on Studio being real. 4. **Gemini/Perplexity** — docs-only "works with" coverage now; revisit quarterly.

**Claims discipline across platforms (voice-guide binding):** every first-claim is scoped to its directory and unlocks only when *that* listing is live. "The first podcast MCP **in the Claude connector directory**" ≠ "the first podcast tool **in the ChatGPT app directory**" ≠ the unscoped "the first podcast MCP server" (that one is about the server existing publicly — claimable once ANY listing is live, and only after re-verifying no podcast MCP shipped elsewhere first). The /features/mcp page and all announcement copy use the scoped forms. Two listings live = "the podcast tool your assistant already knows — whichever assistant."

---

## 7. LinkedIn distribution — the Gott comment-gate system, assessed

**Source:** Logan Gott's "How to run a viral launch on LinkedIn" system paper (@LoganTGott, 8/17/26 — Joelle's screenshots). Seven steps, two gates: offer → 1-page doc (positioning + 10 objections) → native video <2 min → post with a **comment gate** (no link in body; comment → DM → opt-in → call; every commenter is a named lead) → allies in four ordered groups (paid creators in ICP → team/investors → happy clients → commenters DM'd within 48h) → launch day as a timeline (early weekday post, reply to every comment, first 2 hours decide) → the week after pulled from the comments. Rules: launch monthly not annually; nothing goes live until the funnel behind the comment exists; the post dies in 48h — the list/funnel/cadence is the asset. Claimed results (his, not ours — never cite as ours): 1M views, 150+ calls, doubled client base in 30 days.

### Verdict per element

| Element | Verdict | PodLink version |
|---|---|---|
| Launch monthly, not annually | **ADOPT** | The drip calendar IS the monthly pipeline. Drip entries are the "launch" bucket of his audit (real features, honestly announced); tentpoles (MCP listing, Pro) get the full seven steps; ordinary drips get post-only treatment (his "park" tier). No new machinery needed — the calendar already exists |
| 1-page doc (positioning + 10 objections) | **ADOPT — mostly assembled, not written** | Positioning from /features/mcp content + mcp-gtm 3.1 metadata; the objections are already inventoried: voice-guide §5 objection→USP map + buyer-personas verbatims + copy-audit brief. C compiles to one page; the Gott test ("say why anyone should care in one sentence without platform/solution/seamless/leverage") is literally our banned-words list — the doc passes by construction or it doesn't ship |
| Native video <2 min | **ADOPT — must be created** | The one asset that doesn't exist. Tie into claude/asset-shot-list.md: screen capture of a real Claude session — "how did my show do this week?" → real numbers → "draft the newsletter" (post-v1.1). Show it working in 40 seconds (his bar). C scripts + shot list; J records. Native upload only, no YouTube link |
| Comment gate, no link in body | **ADAPT** | Mechanically adopt (comment "PODLINK" → DM with the setup link). Tone-adapt: the gate copy stays in the honesty register — "comment and I'll DM you the setup doc" said plainly, no fake scarcity (banned-patterns list). The gate's real value for us: every commenter is a named podcaster — that's Route E lead gen, not just reach |
| Funnel behind the comment (Gate B: DM → opt-in → email sequence → call) | **ADAPT — partially gated** | DM copy: C drafts, **J sends — DMs are hers, never automated** (same principle as the no-emails rule). Opt-in target = the setup-docs page (exists per §3 step 2). **Email-sequence leg is GATED:** transactional/marketing email needs A3 (SMTP) and the D3 sending-domain warm-up clock (75 days, already the most time-critical J item). Until A3/D3 clear, the funnel is comment → DM → setup page → connected account — which for the MCP launch is the whole conversion anyway. "Call booked" leg applies to the services/Studio audience, not Pro self-serve |
| Allies group A: paid creators in ICP | **SKIP for now** | It's a vendor purchase — ALL ON HOLD (canon standing rule, podcast-data-vendors header; approved-to-buy-later on her word). If unheld: podcast-industry creators, #paidpromotion disclosed, picked on comments-per-post + ICP overlap (his criteria are sound) |
| Allies group B: team & investors | **ADAPT** | Solo founder — the honest version is her professional circle + the podcast network. Quote-posts and early comments in hour one. Asked a week out, reminded the morning of (his mechanic, keep it) |
| Allies group C: happy clients | **ADOPT** | The real asset: years of services clients + the shows behind 21 verified placements + 106 booked deals. One line of real proof in the comments from a recognizable client beats anything we could write. J asks personally; C drafts the ask |
| Allies group D: commenters DM'd within 48h | **ADOPT** | J, from mobile — see constraints. C preps the DM text + a simple tracking sheet (commenter → DM'd → opted in) |
| Launch day as a timeline; first 2 hours decide | **ADOPT with reality check** | Post early weekday (never Sunday), then J replies to every comment for the first 2 hours **from her phone — mobile-only is fine, LinkedIn's app is where replies happen anyway**. C pre-drafts reply patterns for the top objections so mobile replying is paste-speed. Calendar-block the 2 hours; if the window can't be blocked, move the launch day rather than post into silence |
| The week after, pulled from comments | **ADOPT** | Comments = free objection research + next month's content. C harvests: objections typed in public feed the next drip post + the copy-audit objection inventory. Follow-up loop (no-opt-in day-3 nudge, ICP-match connection) — J sends, C lists |
| His claimed numbers as expectation | **SKIP** | 1M views is his outcome, not a benchmark. Our post-launch recap uses our GA4/Stripe numbers under voice-guide §4 rules — small real numbers said plainly beat borrowed big ones |

### How it composes with the directory launch
The MCP listing going live (§3 step 7) is **LinkedIn launch #1** — the offer that passes Gott's one-sentence test: "Connect Claude to your podcast and ask it how your show did this week." X gets the Rondot-format recreation post (§4); LinkedIn gets the full seven-step treatment with the comment gate. Same day, same assets, different mechanics per platform. After that: one launch per month from the drip calendar, ordinary drips as normal posts, next tentpole (Pro) gets the system again.

**Gate discipline (his two gates, our enforcement):** Gate A — doc, video, and post all say the same thing in one sentence without banned words; C checks against voice-guide before anything records. Gate B — nothing posts until the DM text, setup page, and tracking sheet exist ("a million views with no funnel is an expensive way to feel good for two days" — his line, our rule now).

**Who does what:** C preps — 1-page doc, post + gate copy, DM + reply drafts, video script + shot list, ally-ask drafts, tracking sheet, week-after harvest. J does — records video, lines up clients/network a week out, posts, replies (mobile, 2-hour block), sends every DM, approves all copy. Nothing in this section is automated on her behalf.

---

## Ready to execute on Joelle's word (nothing done yet)
1. **D-1:** submit v1 analytics-only now vs. wait for transcript tools (starts the unknown review clock earlier vs. richer listing).
2. MCP branch review + deploy test (canon D4 — C-drivable today).
3. A2 privacy policy draft (blocks directory AND M8 — double reason).
4. Claude Team org purchase decision (submission prerequisite).
5. Support address one-liner (D5).
6. LinkedIn launch-#1 asset prep (§7: 1-page doc, post + gate copy, DM drafts, video script) — C-drivable now; video recording and paid-creator unhold are hers.

## Sources (2026-08-25)
- Anthropic — Submitting to the Connectors Directory: https://claude.com/docs/connectors/building/submission (portal, Team-org requirement, annotations, privacy-policy rejection rule, listing field limits, review process)
- Community timeline reports + requirement summaries: https://sunpeak.ai/blogs/claude-connector-directory-submission/ · https://tallyfy.com/how-to-list-mcp-server-anthropic-claude-connectors/
- Directory catalog mirror (podcast-absence check): https://github.com/rdmgator12/awesome-claude-connectors (grep: only Descript + ElevenLabs adjacent)
- OpenAI — Apps SDK submission: https://developers.openai.com/apps-sdk/app-submission-guidelines · https://help.openai.com/en/articles/20001040-submitting-apps-to-the-chatgpt-app-directory · https://openai.com/index/developers-can-now-submit-apps-to-chatgpt/
- ChatGPT MCP auth (DCR/CIMD): https://developers.openai.com/api/docs/mcp · https://stytch.com/blog/guide-to-authentication-for-the-openai-apps-sdk/
- Microsoft — MCP certification (preview): https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-certification · federated connectors: https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/submit-federated-connector
- Gemini CLI extensions gallery: https://geminicli.com/extensions/ · Gemini Enterprise custom MCP: https://support.google.com/g/answer/17106276
- Perplexity custom connectors: https://www.perplexity.ai/help-center/en/articles/13915507-adding-custom-remote-connectors
- Logan Gott, "How to run a viral launch on LinkedIn" system paper (@LoganTGott, 8/17/26) — Joelle's screenshots, assessed in §7
