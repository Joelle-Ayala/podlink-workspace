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

## Open questions for Joelle (non-blocking to start)
- Is the Show Report public-by-default or opt-in per show? (Recommend opt-in, default off.)
- Transcript STT provider ceiling per episode (cost control) — recommend cap at 90 min audio.
