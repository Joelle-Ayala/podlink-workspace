# LAUNCH SPRINT 1 — REPORT

Date: 2026-09-16/17 · Commits: `344dbe974` (app) + `d15f37efb` (site) on main.
Scope source: founder directive "PodLink Launch Sprint 1" + PODLINK_ECOSYSTEM_AUDIT_CONTEXT_V3.md + claude/ canon.

---

## 0. ⚠ URGENT FINDING (discovered during deploy verification, unrelated to sprint changes)

**The GitHub repo `Joelle-Ayala/podlink-workspace` is now PUBLIC.** Vercel deploy
metadata showed visibility flip from "private" (through Sept 12) to "public"
(Sept 17), and an unauthenticated fetch of the repo URL returns 200. Nobody on
this side changed it — if it was flipped deliberately (e.g. to share the audit
file with ChatGPT), be aware the repo contains the FULL vendored MagicAI and
66biolinks source (CodeCanyon licenses do not permit public redistribution —
license-revocation risk), `magicai.sql`, and the entire strategy canon
(pricing strategy, founder story raw, GTM plans, JOELLE-TODO).
**Recommended: flip it back to private now** (GitHub → repo Settings → General
→ Danger Zone → Change visibility) and share single files another way.
No literal secrets are committed (creds are Railway reference vars), so no
key rotation is forced — but treat the canon as having been readable while public.

---

## 1. Work completed

**Sprint A — Safety / launch blockers**
- Upstream `/test`, `/test/stream/{model}`, `/test/chatbot` and `/debug/{token?}`
  routes are now registered ONLY outside production (wrapped, not deleted, for
  vendor-upgrade tolerance; repo-grepped: nothing references those route names).
  `/debug` was particularly nasty — it rewrites `.env`/APP_DEBUG at runtime.
- Stale `routes/mcp.php` header corrected: now states the real surface (8
  read-only tools, all FREE tier) and the write-tools guardrails.
- The 2026-09-12 MCP scoping sibling amendment was merged into
  `PODLINK-MCP-SCOPING.md` (file no longer editor-locked) and the sibling doc
  retired.
- Founder-only checklist consolidated in §6 below.

**Sprint B — Transcript timestamp foundation**
- New `transcript_segments` table (episode_transcript_id FK cascade, seq,
  start_ms, end_ms, text; unique (transcript, seq)) + `TranscriptSegment`
  model + `EpisodeTranscript::segments()` relation.
- `TranscribeEpisodeJob` now persists Whisper verbose_json segments for NEW
  transcriptions — best-effort (a segment-write failure can never fail an
  already-metered completed transcript), idempotent (clears + rewrites on
  retry), chunked inserts, ms integers, per-segment text cap.
- FULLTEXT `body` search and both MCP transcript tools untouched — verified by
  code path (body storage unchanged).
- Historical backfill deliberately NOT automatic; approach documented in
  `claude/transcript-backfill-plan.md` (feed `<podcast:transcript>` parsing as
  the zero-cost default when that ingestion lands; re-transcription only as an
  explicit, cost-labeled owner action).

**Sprint C — YouTube pairing reliability**
- `episodes` gained `youtube_paired_manually` (a human decision — including
  "no video" — is final for the auto-matcher) and `youtube_match_confidence`
  (0–100, auto matches only).
- `pairEpisodes()` rewritten: score = title (exact 70 / long-prefix 55 /
  similar_text-based up to 50) + publish-date proximity (≤2d:20, ≤7d:10) +
  duration proximity (≤120s:10, ≤300s:5; videos.list now requests
  contentDetails). Writes only at ≥70 with a ≥10-point ambiguity margin over
  the runner-up; never pairs one video to two episodes; never touches manual
  decisions; records confidence.
- Minimal authenticated pairing UI on the episode detail page: shows current
  pairing (with "set by you" / "matched automatically (N%)"), select-a-video
  pair/change, "Remove pairing / Mark audio-only" (sticky), and "Use automatic
  matching" to hand back. New tenancy-checked route
  `POST analytics/episodes/{episode}/youtube-pair` validates the chosen video
  against the user's own channel and blocks duplicate pairings with an honest
  error.

**Sprint D — Analytics snapshots (implemented — judged launch-safe: additive
table + one scheduled command reusing existing cached reads)**
- `analytics_snapshots` (show FK, captured_on, source op3|youtube, scope
  show|episode, episode_id nullable FK, metrics JSON, lookup indexes).
- `podlink:snapshot-analytics` command: per show/day — op3/show downloads
  blob; youtube/episode views per paired episode; youtube/show total. Per-show
  failure isolation; uses the SAME 1h-cached service reads the dashboard uses.
- Scheduled daily 04:10 UTC via the upstream Kernel's `CustomScheduler`
  extension point (no vendor Kernel edit) — runs on the existing
  podlink-worker scheduler loop.
- **Storage/cadence/cost:** daily cadence; ~2 rows/day/show + 1 per paired
  episode; a 100-episode fully-paired show ≈ 37k rows/year at a few hundred
  bytes → single-digit MB/show/year. API cost ≈ one uncached OP3 + YouTube
  read per show per day. Nothing user-facing consumes it yet — it exists so
  trends/comparisons/Growth-Agent have history from TODAY forward.

**Sprint E — Activation**
- **Pre-signup analyzer shipped end-to-end**: public
  `GET /api/public/feed-inspect` (15/min/IP throttle on top of the api group,
  1h cache per URL, SSRF host guard, libxml-hardened parse, output caps,
  read-only — never modifies feeds) + **podlink.ai/analyze** ("Analyze your
  podcast"): identify show (artwork/title/episode count), latest 5 episodes,
  OP3 prefix/resolution status, then the exact CTA split the sprint asked for
  (measured → "your numbers in about a minute"; not measured → "one-time
  copy-paste setting, steps on your first screen"). Server-rendered, no
  client JS. Sitemapped at 0.8.
- **First-session flow**: "Next steps" ladder card on the analytics page —
  Connect YouTube → Turn on your Show Report → Transcribe an episode →
  Connect Claude — each step disappears when done, whole card disappears when
  the ladder is climbed; anchors added to the report + episodes cards; one
  cheap EXISTS query feeds it.
- Nav check: Podlink Page (order 3) and Podcast Analytics (order 4) already
  sit directly under Dashboard in MenuService — no change needed (menu rows
  are DB-seeded; reordering live menus is an admin action, noted for B-list).
- Not done (see §9): forcing analytics as the post-signup landing route.

**Sprint F — Proof / ICP pages (agent-built, reviewed; cleared data only)**
- **/founders** — "Get in front of the audiences that matter to your
  business": targeting → booking → appearance → clips/content → reporting
  arc; reuses the get-booked service's real steps/FAQs/pricing facts;
  placements strip + counts (computed from placements.ts); cleared case
  studies (DocSend, Opolis, Qualsights, Mudrex) + cleared testimonial.
  Explicitly does NOT claim listener numbers for guest appearances.
- **/partners/pr-agencies** — "Add podcast guesting to your client offering
  without building the team": white-label/wholesale model stated plainly
  (agency owns the client; PodLink fulfills), deliverables from real service
  scopes, the real "agency and white-label rates at a 20-booking commitment"
  footnote, honest "no cleared wholesale client names yet" stance,
  unestablished specifics phrased "scoped per engagement".
- **Homepage proof band** (between how-it-works and FAQ, tone=accent):
  computed placement counts + clearance-gated show/brand names + one gated
  testimonial + link to /work.
- Footer "Company" column now links both ICP pages. Both sitemapped at 0.8.
- Official media embeds: NOT added this sprint — placements data carries
  links, not embed-cleared media entries; deferred (§9) rather than embedding
  uncleared third-party media.

**Sprint G — Source-of-truth reconciliation (launch-critical only)**
- Pricing: app-host /pricing + /features were already 301'd to podlink.ai by
  `RedirectLegacyMarketing` (verified in Kernel) — the stale
  `config/marketing.php` tier ladder ($19/$49, annual 10×) is now hard-marked
  SUPERSEDED in-file, pointing at `podlink-pricing-v2.md` §7 +
  `web/src/content/pricing.ts` as the only truth.
- Automatic-transcription claim: feature renamed **"Automatic transcripts" →
  "Episode transcripts"** (features.ts title/H1/SEO title + pricing.ts
  comparison row + the collision-map comment). Body copy was already honest.
- MCP tool count: corrected to 8 with the full tool list in /claude FAQ,
  /features/mcp/setup FAQ (+ example prompts now exercise transcript search
  and recent-performance), setup-page header comment, and llms.txt.
- Visibility/indexability: re-checked — sitemap vs noindex remains consistent
  (pricing + /features/mcp still deliberately out; no change needed).

## 2. Files changed

App (`344dbe974`): routes/web.php, routes/mcp.php, routes/api.php,
routes/panel.php · app/Jobs/TranscribeEpisodeJob.php ·
app/Models/{EpisodeTranscript,TranscriptSegment*,AnalyticsSnapshot*}.php ·
app/Services/YouTubeAnalyticsService.php ·
app/Http/Controllers/Dashboard/AnalyticsController.php ·
app/Http/Controllers/PublicFeedInspectController.php* ·
app/Console/Commands/SnapshotAnalyticsCommand.php* ·
app/Console/CustomScheduler.php* · config/marketing.php ·
views …/analytics/{index,episode}.blade.php · claude/PODLINK-MCP-SCOPING.md
(+ sibling amendment deleted) · claude/transcript-backfill-plan.md*.
Site (`d15f37efb`): app/analyze/page.tsx* · app/founders/page.tsx* ·
app/partners/pr-agencies/page.tsx* · app/page.tsx · app/layout.tsx ·
app/sitemap.ts · app/claude/page.tsx · app/features/mcp/setup/page.tsx ·
content/features.ts · content/pricing.ts · public/llms.txt.
(* = new file.)

## 3. Migrations added (all three ran DONE in the production predeploy)

1. `2026_09_16_000001_create_transcript_segments_table` (152ms)
2. `2026_09_16_000002_add_youtube_pairing_meta_to_episodes_table` (15ms)
3. `2026_09_16_000003_create_analytics_snapshots_table` (245ms)

All additive; no destructive change; down() provided on each.

## 4. Tests run / results

- **No PHP/Node toolchain exists on the ops machine** (verified: no php, no
  composer, no npm), so PHPUnit/vitest could not run locally — stated
  honestly, not skipped silently.
- Verification performed instead: Vercel production build compiled all new
  TSX (build READY = type-check + lint pass for the site); Railway build +
  boot SUCCESS on both app and worker (route/config load = the Laravel
  smoke-equivalent); live checks below; repo-wide greps for route-name
  references before gating; component-prop signatures read before every
  usage.
- Live checks (production, post-deploy): /analyze /founders
  /partners/pr-agencies all 200 · homepage proof band rendering · "Episode
  transcripts" live, old title gone · /mcp still 401 unauth · app /login
  serving · feed-inspect endpoint returns a correct real-feed payload (The
  Daily: status ok, title, artwork, episode count, OP3 flags) · /debug no
  longer reaches its controller (302 away) · /test now behaves identically to
  a nonexistent route.

## 5. Deployment status

- Railway `podlink-workspace` (app): deploy 64a126c3 **SUCCESS**
  2026-09-17T03:33Z (commit d15f37efb, includes 344dbe974); migrations DONE.
- Railway `podlink-worker`: deploy a6f4f219 **SUCCESS** — the 04:10 UTC
  snapshot schedule is armed (first run = next 04:10 UTC; verify a row lands
  in `analytics_snapshots`, see §7).
- Vercel `podlink`: deployment **READY** for sha d15f37efb (deployment
  existence confirmed per the Sept-12 lesson).
- biolink-public, MySQL, Redis: untouched.

## 6. Founder actions still required (unchanged B-list + sprint additions)

**NEW / urgent:** ① Flip the GitHub repo back to **private** (see §0).
Then the standing taps: ② B1 legal green light — read /legal/privacy +
/legal/terms once (+ give the governing-law state) · ③ B3 confirm
support@podlink.ai inbox receives/replies · ④ B4 real OP3 demo data + test
credentials for the reviewer/demo account · ⑤ YouTube demographics — one
scoped reconnect on the connected channel, then eyeball the Audience card ·
⑥ B5 admin plan ladder (create Free/Pro/Studio rows per pricing-v2; last
gate before the /pricing index flip) · ⑦ B6 Podcast Index API key+secret
(unlocks Find-Shows search) · ⑧ B7 HubSpot booking link URL (contact.ts
still carries the mailto fallback) · ⑨ B2 Team org housekeeping · ⑩ B8
final GO for external comms (submissions/posts/PR — all staged, none sent).
Also from this sprint: ⑪ skim /founders and /partners/pr-agencies once —
they're built from cleared proof but they're new ICP-facing pages and worth
a founder read; ⑫ if any placement has embed-cleared media (YouTube/Spotify
episode URLs you own or have permission to feature), say which — embeds are
prepared-for but not placed.

## 7. Known risks

- Repo visibility (§0) — the only red-level item.
- First scheduled snapshot run is unobserved until the next 04:10 UTC —
  check `analytics_snapshots` has rows after; per-show failures log as
  warnings ('Analytics snapshot failed for show').
- Segment persistence is verified by code-path, not by a live transcription
  (no test credits burned without approval): the next real transcription
  should be spot-checked for `transcript_segments` rows (this doubles as the
  founder's transcript click-verify tap).
- similar_text-based fuzzy scoring is O(n·m) per pair — fine at ≤200 videos ×
  recent episodes; revisit before Studio-scale catalogs.
- /analyze fetches arbitrary public URLs by design; throttle+cache+host-guard
  are in place, but watch its access pattern the first weeks (it shares the
  api-group counters).
- The gated /debug route means the emergency APP_DEBUG toggle no longer works
  in production — deliberate; use Railway env + redeploy instead.
- Biolink `track_links` 90-day retention still bounds page-stat history
  (audit risk, untouched this sprint — snapshot mechanism now exists as the
  future countermeasure if pointed at the bridge).

## 8. Recommended next sprint

"Trust the numbers" sprint: (1) point one snapshot consumer at the data — a
tiny sparkline on the analytics page once ~14 days accrue; (2) watch-time /
AVD / traffic-source metrics (same YouTube Analytics client, new params —
cheapest True-Audience upgrade); (3) transcript-segment surfacing (timestamps
in the episode-page transcript view + MCP get_transcript part metadata);
(4) B5+Stripe wiring so the pricing flip can happen; (5) post-signup landing
route → Podcast Analytics (the one activation item deferred). Plus whatever
B-taps have cleared.

## 9. Deliberately deferred

Historical transcript backfill (documented, never automatic) · official
media embeds on case studies (no embed-cleared media list yet) · post-signup
redirect to analytics (auth-flow touch — wanted a quieter window than a
launch sprint) · menu reordering in the live DB (admin action) ·
`prefixMatch()` helper left in place though the new scorer supersedes it
(harmless; removing vendor-adjacent code mid-sprint wasn't worth the diff) ·
everything on the do-NOT-build list (marketplace, commerce, social scheduler,
Twitch, v11 migration, CRM, Growth Agent, Studio multi-show).

## 10. Launch-readiness verdict

**Ship-side: READY.** Product, site, MCP, legal drafts, comms package,
runbook — all live or staged; this sprint closed the known safety holes
(/test, /debug), the claims gaps (transcripts name, tool counts, pricing
ghost), and laid the three foundations (segments, pairing metadata,
snapshots) the next releases need. **The launch is gated exclusively on
founder taps** (§6): legal read, demo data, plan ladder, HubSpot link,
Podcast Index key, demographics reconnect, and the GO. One new red flag —
the repo going public — should be resolved before anything else, but it is a
five-click fix. Nothing discovered this sprint moves the GO-day runbook.
