# Feed Ingestion + Show Report — Engineering Spec (v0.1)
**Created:** 2026-08-19 evening · **Status:** SPEC — ready for build; no founder gate
**Why now:** the pricing spec calls episode persistence + transcript pipeline the #1 engineering
task; today nothing is persisted (OP3 is read live into a view), so per-episode metering,
transcripts, and the MCP `list_episodes` tool all lack a foundation.

## Known constraints (from code audit, 08-16 handoff §8)
- `podcast_shows` has `unique(user_id)` — 1 show per user, hard.
- No `episodes` table exists. OP3 responses are not stored (1h cache in `Op3Service` only).
- Plan rows must be created in MagicAI admin (Stripe sync via `StripeService::saveProduct()`).

## Build (inside the MagicAI Laravel app — same reasoning as the MCP scoping doc: reuse services)
1. **`episodes` table:** id, show_id FK, guid (unique per show), title, description, pubdate,
   audio_url, duration, transcript_id NULL, first_seen_at, last_seen_at.
2. **Ingestion worker:** scheduled job (15 min) → fetch stored RSS (feed-inspection code from M5
   exists) → upsert episodes by guid. Deletions never propagate (episodes are history).
3. **Transcript pipeline:** queue job per new episode → download audio → STT (existing MagicAI
   speech-to-text path; meter credits identically to the dashboard) → store transcript row +
   full-text index. Backfill = user-triggered per episode (credit-gated), never automatic (cost).
4. **Show Report page (public, shareable):** `app.podlink.ai/report/{show-hash}` (or podlink.fm
   embed later): show title, OP3 weekly downloads (live read as today), episode list from the new
   table, top apps, "measured by OP3" attribution. This is the sponsor-facing artifact — the
   "numbers you can defend" promise made on the marketing site, made linkable.
5. **MCP alignment:** `list_episodes` fallback flips from live-RSS-parse to the episodes table;
   `generate_content` gets `episode_ref` resolution for free. See PODLINK-MCP-SCOPING.md v1.

## Order + estimates (single dev-agent thread)
Table + worker (1 session) → transcripts behind credits (1–2 sessions) → Show Report page
(1 session, needs a brand pass). No dependency on the pricing decision — metering knobs read
plan config, whatever the prices end up being.

## Rev-2 alignment (added 2026-08-20)
- **Instrument the parser fully on the FIRST crawl** (handoff rev 2 standing rule): capture
  sponsor language, funding tag, transcript tag, tracking prefixes, notes length, producer
  credits, category. Missing fields = a full re-crawl later. Add these columns to `episodes`/
  `podcast_shows` up front.
- **Show Report is a live page, never an attachment** (standing rule). GTM docs put it at
  `podlink.ai/report/{show}`; this spec drafted `app.podlink.ai/report/{hash}` — resolve to
  the GTM location (podlink.ai) since it's a marketing surface; the app only generates it.
- **`unique(user_id)` lift is in scope here** (rev 2 §5 calls it the most expensive single
  line of schema in the company): it gates Studio, the directory claim path, and the
  multi-show grader. Sequence it with the episodes table migration.

## Analytics differentiators (added 2026-08-20, founder-approved "lets do it")
**A. Percentile badge (v1 = sprint-sized, build with the episodes table):**
User's weekly downloads (already live via Op3Service) looked up against a benchmark
distribution → "top X% of OP3-measured shows." GATE: re-verify the 26/72/231/539/3,062
weekly table against its primary source (OP3 published stats) before user-facing use; cite
+ date it. Universe caveat ("among OP3-measured shows") is mandatory copy, not optional.
Surfaces: dashboard, Show Report, /grader later.
**B. Content-performance insights:**
v1 (no transcript cost): LLM pass over RSS metadata (titles, descriptions, durations) ×
per-episode OP3 downloads → observations ("interview episodes outperform", "question titles
beat statements"). Constraints baked in: OP3 measures only post-prefix-install episodes;
small-n shows get "what we noticed" framing, NEVER causal claims (evidence rules).
v2: transcript-grounded topic analysis as transcript coverage builds (credit-gated backfill).
**C. Weekly digest:** plain-language summary generated from A+B data through the existing
credit-metered generation path; scheduled job. Ships after A and B exist.
**Validation data:** Joelle is adding the OP3 prefix to three client shows she manages in
Megaphone (Moms Moving On, Go With Elmo, My Divorce Solution) — real side-by-side vs
Megaphone's IAB-certified numbers. EXPECTATION: counts will not match exactly (methodology,
filtering, and OP3 only counts from install date). Log deltas as calibration data — the gap
itself is publishable research material if sourced carefully. NOTE: one show per account
until unique(user_id) lifts → three separate accounts/emails.

## ML2/ML3 verdict adopted (2026-08-25 — full report: claude/podlink-ml3-build-vs-buy.md)
**Reality check first:** the `ml2-lite` commits (08-23, main) already shipped episodes table
+ Episode/PodcastShow models + EpisodeSyncService + YouTube OAuth/analytics services +
youtube_connections table + the analytics page reading from the DB. Episode persistence v1
EXISTS; this spec's remaining scope = transcript pipeline, Show Report page, unique(user_id)
lift, and the differentiators (percentile badge, insights, digest).
**ML3 architecture (adopted):**
- Auth layer OWNED, via Laravel Socialite. Target shape: one `social_accounts` table
  (encrypted tokens) + normalized `video_stats` — platforms swappable DIY↔vendor.
  RECONCILIATION: `youtube_connections` (ml2-lite) stays as-is for v1; generalize to
  `social_accounts` when the SECOND platform lands, not before (no churn on a working v1).
- OP3 untouched; social data meets downloads only on the episode dashboard.
- Build order: YouTube (ML2, incl. Shorts, free) → Twitch (free Helix, no app review,
  VOD views) → X DIY (pay-per-use since Feb 2026, ~$45/mo at 100 creators).
- TikTok Display API + Meta/Instagram app-review applications: START EARLY (cost =
  calendar time). Anything needing business identity/verification → JOELLE (flagged in
  JOELLE-TODO).
- Ayrshare Business ($599/mo, per-creator-profile) = fallback ONLY if TikTok/Meta stall;
  if ever used, sits behind a paid tier.
- Kick deferred (no per-VOD analytics yet — recheck ~Feb 2027). Skip Phyllo/Metricool/
  Data365.
**Claims-matrix effect:** rows 3/4 (episode persistence/workspace) move NOT SHIPPED →
PARTIAL in code (metadata sync exists; automatic transcription still absent — row 3's
copy constraint stands until the transcript pipeline ships).

## Open questions for Joelle (non-blocking to start)
- Is the Show Report public-by-default or opt-in per show? (Recommend opt-in, default off.)
- Transcript STT provider ceiling per episode (cost control) — recommend cap at 90 min audio.

## 8-lever absorption (2026-08-25, gtm-plan 4c)
- Pipeline scoring adds four signal triggers: YouTube-upload/RSS cross-match (dual-publisher flag - also the ML2 beta waitlist source), OP3 threshold crossings, sponsor mentions, competitor-complaint signals.
- Show Report + every generated artifact: public share link + "Powered by podlink.ai" one-click-signup badge + anonymized cohort benchmark line ("top X% for YouTube conversion among shows your size") - the switching-cost layer.
- Activation instrumentation: week-1 activation event chain (feed connected -> YouTube connected -> first report viewed) tracked from day one; gates outbound automation per gtm-plan 4c.

## AMENDMENT 2026-09-02 - Show Report ELEVATED to hero deliverable
Per gtm-plan positioning amendment (validated founder pain, founder-story-raw.md 1b):
the Show Report is no longer one artifact among several - it IS the hero use case
("the report is the product"). Build priority within this spec rises accordingly:
Show Report page next after contact-discovery P1 slots (WORK-CANON sequencing note),
composing OP3 downloads + YouTube views (both live) with graceful absent-channel
states; social/website columns join as ML3/GA4-read land. Media-kit spec rides the
same surface. Percentile badge ships on it (gate: verify the benchmark table first).
