# Media Kit + Audience Demographics — Spec (v1, 2026-08-25, founder directives)
**Governing rule #1 — NO IMPORT FLOWS.** The CSV/screenshot Spotify-demographics import
idea is DEAD. OAuth-consented API data only, everywhere, forever. If a source can't be
OAuth'd or read from a public/verifiable endpoint, it's not in the product.

## 1. Demographics sources (OAuth-only)
| Source | What we pull | Level | Status |
|---|---|---|---|
| YouTube Analytics API | viewerPercentage by ageGroup/gender; geography; watch time; traffic sources | Channel AND video (video-level has data thresholds — small videos return nothing) | ML2 EXPANDED SCOPE — the PRIMARY automated audience-demographics source. ⚠️ VERIFY current API dimensions/metrics/quotas during build; do not trust this listing blind |
| TikTok Display API | follower demographics: age/gender/territory | Account | App review must request insight scopes DAY ONE (JOELLE-TODO #12) — never re-apply. ⚠️ Verify exact scope names for current API version |
| Meta/Instagram Graph | follower demographics: age/gender/territory (audience_* insights) | Account | Same day-one rule + scope-name verification |
| X, Twitch | views only | — | No meaningful demographics; stays views-only per ML3 verdict |
| OP3 | downloads (episode/app/country) | Show/episode | The sponsor-verifiable backbone — untouched |
| Biolink | page views + link clicks | Page | Via BiolinkStatsService (MCP scoping O1) |
| Charts | chart positions: Spotify public charts endpoints + Apple category charts | Show | ⚠️ Verify access/terms before build — public data but ToS matters |
| Audio-listener demographics | (survey tool) | — | OPEN NON-BLOCKER — later decision, deliberately NOT specced here |

## 2. The Media Kit (sponsor-facing — the flagship composition)
The productized version of what the services team hand-builds for sponsorship deals
(P3's "share trend data... to justify the increase," answered as a product).
**Composition (OAuth-only sources):** OP3 downloads with trend (sponsor can check the
source) · YouTube views + audience demographics · TikTok/IG follower demographics ·
Biolink clicks · chart positions. Live page, never a PDF (standing rule); same rendering
family as the Show Report — the media kit is the Show Report's sponsor-facing sibling
with demographics and rate-context added.
**Tier home:** Pro+ (it IS the "sponsor email writes itself" promise); deeper version =
Studio client deliverable (branded reports). Exact gating at pricing-refresh time.
**Sequencing:** after ML2-expanded demographics + Biolink stats exist; before/with the
sponsorship service's productization (it feeds the sponsorship line directly — the
"you don't need 20,000 downloads" wedge with proof attached).

## 3. Rankings tracking (the dead Chartable feature — roadmap item)
Chart-position HISTORY per show: daily snapshot of Spotify public charts + Apple category
charts (⚠️ access terms verification is the gate), stored per show/category/country →
sparklines on dashboard + media kit ("Top 50 in Business — 11 weeks running").
Chartable died 2024-12-12 leaving no 1:1 replacement (pricing-v2 §1b, sourced) — this is
a named-gap feature with its own demand. Roadmap: Later (after media kit v1); zero OAuth
needed (public endpoints), so it can also ship as a free drip/PR feature if terms allow.

## 3b. Third-party podcast-data APIs — verdicts (2026-08-25, sites+pricing fetched today)
Full reasoning relayed to Joelle; the line that governs all three: **product analytics =
consented own-show data; market intelligence about OTHER shows = services/research layer.**
None of these touches the OP3/OAuth backbone.
| Vendor | What it is | Cost | Verdict |
|---|---|---|---|
| **Particle (particle.pro)** | Podcast intelligence API: 100k+ shows fully transcribed/diarized/speaker-ID'd within minutes; entity+semantic search; SPONSORSHIP INTEL (every ad read, brand, placement, offer URL); Apple Top 200 rankings ×130+ verticals; alerts; MCP server | Usage-based ~$0.01/req; $10 free ≈ 1k req | **USE now** (services: sponsor prospecting + booking research — its MCP drops straight into the team's Claude). **INTEGRATE later, selectively:** sponsorship-intel in media kit ("brands buying shows like yours") + contact-discovery P4 sponsor lanes — ⚠️ verify API ToS resale terms first (they market productization; terms doc exists). Don't COPY — we transcribe only our users' shows |
| **Rephonic (rephonic.com/developers)** | 4M+ shows: MODELED listener estimates + demographics, contacts (community-verified votes), social reach, audience graph, charts API (Apple/Spotify/YouTube, 24h), trends, transcripts | $299/mo · 10k req | **USE for services** (it IS the booking/PR research tool the team hand-rolls). **JUDGMENT CALL FLAGGED TO JOELLE:** its demographics/listener numbers are modeled estimates, not consented — putting them in the user-facing media kit would dilute the "sponsor can check the source" positioning. Recommend: internal/services use only; media kit stays consented-only. Charts API = possible vendor for rankings tracking if DIY public-endpoint terms fail (⚠️ verify Rephonic resale terms) |
| **Podchaser (podchaser.com/api)** | 5.5M shows: the guest/credits graph (27M credits — unique), full contacts incl. agency/mgmt (Pro), modeled demographics, charts (historical = Enterprise; Podcharts is theirs), sponsors + est. ad spend, brand safety | Starter $30/mo (1k req) · Pro $300/mo (10k) · Enterprise custom | **USE for the booking service** (credits graph answers "which shows has this guest done" — P1 research gold; Starter is $30 to trial). **INTEGRATE = Enterprise-only and DEFERRED:** ToS states Starter/Pro data "cannot be resold, redistributed, or sub-licensed" — in-product display requires Enterprise terms. **COPY stands** for rankings tracking (our own-show chart history, §3 above). Pricing reconciliation: competitive research's "quote-only ~$2.5–3K/yr" is stale — self-serve tiers exist now; Pro $300/mo ≈ that estimate |

## 4. Build notes
- All social tokens per ML3 architecture (Socialite; youtube_connections → social_accounts
  at platform #2). Demographics tables normalized alongside video_stats.
- Every ⚠️ above is a BUILD-TIME verification step — record findings in this doc.
- Claims rule: no demographics claim on marketing surfaces until the pull works against a
  real connected account (Megaphone client shows + Joelle's channels are the test data).

**2026-08-25 later:** full 12-vendor list consolidated in claude/podcast-data-vendors.md (canonical) - includes Pod Engine ($75/mo, the value pick), Taddy/Listen Notes/host APIs skipped, Spotify no-API finding confirmed.
