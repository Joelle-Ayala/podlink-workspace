# Podlink — Pricing, Positioning & Personalization Spec

**Status:** Canonical spec as of 2026-08-17, decided with Joelle.
Supersedes the inverted tiers shipped in `web/src/content/pricing.ts` and
resolves the §5.1 conflict in the 2026-08-16 session handoff. Aligns with
`GOAL_STATE.md` tier meanings.

---

## 0. Positioning (decided 2026-08-17) — test every build decision against this

**Podlink is the promotion and audience layer of the podcast stack. It never
competes with the editing layer.**

- The stack's front half (record → edit → host) is mature and well-served. The
  gap is the **post-publish layer**: repurposing, promotion, link page, and
  analytics exist today as 4–5 disconnected tools with no shared context.
- The crowded piece of that gap is AI content generation (Castmagic,
  Podsqueeze, etc. — competitor verification still pending). Podlink does not
  win as a me-too content tool.
- **The differentiated piece is the loop:** content kit (promo out) → bio link
  (destination + click data) → OP3 (download data). Content → clicks →
  downloads is a closed attribution loop no single competitor owns — Castmagic
  has no destination or analytics; Descript has no audience layer.
- **Outcomes, honestly stated:** the outcome deliverable at launch is TIME
  (the 2–4 hr post-publish chore → minutes; this is what $19 buys). The
  outcome podcasters actually crave is GROWTH — deliverable only once the
  attribution loop closes. Sequence: sell time now, build toward "this post
  drove these clicks and this download bump" on a dashboard.
- **Clip Studio positioning:** never "we clip your video" head-to-head with
  editors (a Descript user clips better in Descript). For Descript users,
  Podlink's job is everything around the clip — captions/hooks in the show's
  voice, promo kit slot, bio-link destination, analytics loop. Clip Studio
  itself serves podcasters with no editing workflow (audio-only, publish
  straight from host/recorder) — plus a Podlink-only edge: clip-moment
  selection informed by what analytics say resonates.
- **The episode report is the loop's face:** one artifact per episode —
  downloads + bio-link clicks + YouTube + the kit + (later) clips. Retention
  engine (a reason to return every episode) and shareable (sponsors,
  co-hosts).
- **YouTube is the gap inside the gap (PRIORITIZED 2026-08-17):** OP3 sees
  only RSS downloads; a large share of podcast consumption is on YouTube,
  invisible to RSS analytics. A report merging both is the only full picture
  of an episode anywhere. Decision: **bare minimum ships alongside the Pro
  build** (channel connect + per-episode view counts), full depth (watch
  time, Shorts breakdown, correlation) lands with Episode Report v1.
  Analytics-IN only; publishing-OUT (clips to YouTube) rides Clip Studio's
  timeline. Bonus synergy: a connected channel's captions are a third
  transcript source at zero Whisper cost.
- **MCP-native is the forward wedge:** as podcasters work through AI
  assistants, whoever holds the show's context is the default door. Nobody in
  podcasting has claimed this. It differentiates, but time-back and the loop
  are what justify the subscription today.

---

## 1. Tier structure

| Tier | Price | What it is | Job in the funnel |
|---|---|---|---|
| **Free** | $0 | Download analytics (OP3, read live) + YouTube basic (channel connect, per-episode views — tier placement to confirm, see §8) + basic link-in-bio page | Get the podcaster to connect feed + channel — pre-wired into the attribution loop's endpoints |
| **Pro** | $19/mo | **Episode Content Kit** — automatic transcripts + transcript-grounded content generation (show notes, newsletter, social posts), brand voice auto-populated from the feed, content tools accessible via MCP, episode reports (v1+) | The core paid product; the transcript is what makes output *theirs* |
| **Creator** | $39–49/mo | **AI Clip Studio** — viral clips, AI captions, AI video editor, AI dubbing | Post-launch (per GOAL_STATE) |

Annual = 10× monthly (unchanged from prior decision).

### Why the line falls where it does

- **Analytics free:** episodes are never persisted (OP3 is read live into a view),
  so analytics *cannot* be metered without new code. Free-by-strategy converts a
  code limitation into an acquisition hook, and it costs ~nothing to serve.
- **Bio link free:** cheap to serve; every free podcaster's public link page is
  distribution for Podlink (Linktree model) — and the loop's click endpoint.
- **Content paid at $19:** generation burns AI credits — the natural thing to
  meter. Transcription has a real per-episode API cost (Whisper), which is both
  why it can't be free and why the tier feels obviously worth paying for.
- **Clips at $39–49:** highest compute cost, highest perceived value, post-launch.

---

## 2. Show-context personalization ("each user's instance knows their show")

No training / fine-tuning anywhere. This is context injection, in three layers
of increasing effort:

### Layer 1 — Brand Voice auto-population (cheap, near-term)
MagicAI's stock Brand Voice feature injects user-defined info into generations.
At onboarding, auto-populate it from the RSS feed: show title, description,
category, recent episode titles/summaries. Every existing template immediately
generates "in the show's voice" with no new AI infrastructure.

### Layer 2 — Episode transcript pipeline (the core build)
Stock MagicAI transcription is manual and a dead end: user uploads an audio
file → Whisper → transcript lands as a document that the writer templates never
see. Replace with:

```
RSS watch → new episode detected → fetch audio enclosure
→ transcribe (chunked; Whisper API has a file-size cap podcast episodes exceed)
→ persist episode + transcript
→ content kit generates WITH the full transcript as context
```

Key simplification: for promoting a single episode, **no RAG is needed**. An
hour-long episode ≈ 8–10k words — fits in a modern model's context window.
Pass the whole transcript with the prompt; output quotes what was actually
said instead of riffing on the title.

This makes the workflow podcaster-shaped: the unit of work is **the episode**,
not the tool. "Your episode dropped → here's your kit" instead of "here are 50
AI templates."

**Transcripts have three entry paths** (see §4 for the second):

1. **Automatic (RSS):** the pipeline above — fires after publish, Whisper cost
   borne by Podlink.
2. **Imported (MCP):** the podcaster's editing tool (e.g. Descript) supplies
   the transcript via `import_transcript` — an *edited, human-corrected*
   transcript, available **before the episode is published**, at zero
   transcription cost. Enables pre-release promo kits, which the RSS path
   structurally cannot do.
3. **YouTube captions (once a channel is connected):** pull captions for the
   matched video — zero Whisper cost. Quality below an edited transcript but
   above nothing; use as fallback when no import and Whisper hasn't run.

### Layer 3 — Back-catalog + MCP (later)
- Cross-catalog suggestions ("topics based on your whole feed") need
  embeddings/RAG — reuse MagicAI's existing chatbot-training infra (upload →
  embeddings → retrieval), which proves the plumbing exists in the codebase;
  it's just wired to chat today, not to content generation.
- The in-flight MCP server (uncommitted, `magicai/app/Mcp/`) exposes show
  context — show info, episode list, transcripts, analytics — plus content
  tools, keyed to the user's API key. A podcaster connecting Claude to their
  Podlink account gets a show-aware assistant *by construction*: per-user
  context with no per-user model.

---

## 3. Engineering prerequisite: persist episodes

The single first task of this whole direction. One piece of new code carries
five jobs:

1. Episode detection (triggers the content-kit workflow)
2. Transcript storage (the generation context — Whisper, imported, or captions)
3. Any future per-episode metering (currently impossible)
4. The row the episode report hangs off
5. The row a YouTube video maps to

---

## 4. MCP surface (proposed, 2026-08-17)

**Principle: MCP exposes nothing automatically.** Every feature reachable over
MCP is a tool explicitly written in the server. Full feature parity is a
non-goal — the app and the MCP are two doors into the same product. Coverage
follows the tier story, not the feature list.

**Composability principle (decided 2026-08-17):** Podlink's MCP is designed to
sit in a chain with the podcaster's other tools. MCP servers never talk to each
other — the user's Claude orchestrates: e.g. Descript MCP exports the edited
transcript → Claude passes it to Podlink's tools. This costs Podlink no
integration work, but it dictates two design rules:

1. **Every generate tool accepts transcript text as direct input**, not only a
   stored `episode_id`. Two modes: `episode_id` (Podlink's own pipeline) or
   raw `transcript` text (from anywhere).
2. **`import_transcript` stores an externally-supplied transcript** against an
   episode (or a pre-release draft episode). Wins: edited > auto-transcribed
   quality, pre-publish promo kits, and Podlink skips the Whisper cost.

Media composability (e.g. Descript video → Podlink clips) works by URL —
`start_clip_job` accepts a media URL, fetched server-side. Technically fine,
but see §0: for editor users this is not the pitch; Clip Studio targets
podcasters without an editing workflow.

Current coverage is **unknown** — the server in `magicai/app/Mcp/` is
uncommitted and unread. First step is to read it and diff against this list.

### Phase 1 — ships with Pro (text + data tools, cheap to expose)

| Tool | Tier gate |
|---|---|
| `get_show` (show info, brand voice) | Free |
| `get_analytics` (downloads, trends via OP3; + YouTube views once connected) | Free |
| `list_episodes` / `get_episode` | Free |
| `get_transcript` | Pro |
| `import_transcript` (from Descript/Riverside/etc via Claude; supports pre-release drafts) | Pro |
| `generate_show_notes` / `generate_newsletter` / `generate_social_posts` (transcript-grounded; accepts `episode_id` OR raw transcript; burns the same credits as in-app) | Pro |
| `update_brand_voice` | Pro |
| `update_bio_link` (add/edit links on the podlink.fm page) | Pro |
| `get_episode_report` (once §6 step 3 ships) | Pro |

### Phase 2 — Clip Studio tools (async job pattern, post-launch with Creator)

`start_clip_job` (accepts media URL) → `get_job_status` → result as download
URL. Same pattern for dubbing. Heavier engineering; follows Clip Studio's own
timeline.

### Never exposed (by design)

- Account/billing management (upgrade flows stay in the app)
- Interactive editors (transcript editor, video timeline) — MCP exposes
  operations, not interfaces

### Entitlements

The MCP API key inherits the user's plan. Un-entitled tool calls return a
clear upgrade-required error rather than being hidden — free users connecting
Claude see what Pro would unlock. Generation over MCP draws from the same
credit pool as in-app generation (one meter, two doors).

---

## 5. Feature roles & the four gaps (analysis 2026-08-17)

Investment rule: parity features ride along free; every *built* hour goes to
the loop.

| Role | Features | Build cost | Rule |
|---|---|---|---|
| Ride-along parity | MagicAI stock: templates, AI chat, multilingual, image gen | ~zero | Keep, never invest. Answers "why not just ChatGPT?" |
| Monetization engine | Transcript pipeline, content kit, brand voice auto-pop, MCP Phase 1 | Real | Build to "good" (Castmagic parity + show context), not best-in-class |
| Moat (the loop) | Bio link, OP3, YouTube-in, episode report, attribution | Real | Every marginal hour goes here |
| Forward wedge | MCP composability, import_transcript, Clip Studio (non-editor segment) | Phased | Ride their natural timelines |

**The four gaps** — required by the loop strategy, scoped nowhere until now:

1. **Tracked links in every generated post (the join key).** Each kit output
   auto-embeds a unique short link (`podlink.fm/{user}/e{n}?src=ig`). Without
   it the loop has endpoints but no join — reports show totals, never "this
   post drove these clicks." Highest-leverage unscoped feature; small build.
2. **Per-episode destination pages** on the bio link (today it's show-level
   only) — where tracked links land.
3. **Subscribe deep-links** (tap → Apple/Spotify → follow). The incumbent
   (Chartable SmartLinks) was shut down by Spotify — likely a dead-incumbent
   hole exactly where the bio link sits. Cheap; strengthens the FREE tier.
   Verify current market state.
4. **The correlation view** — click spike + download bump + YouTube views →
   "this post worked." A designed analytics feature, not a byproduct of
   having the data.

**Anti-gap (deliberate non-build): posting/scheduling.** Don't build a Buffer.
Tracked links keep any posting path measurable; MCP composability covers the
workflow.

Gaps 1, 2, 4 are not new roadmap items — they ARE the definition of Episode
Report v1 (§6 step 3). Gap 3 can ship earlier; it lives on the free bio link.

---

## 6. Build order (revised 2026-08-17 — YouTube prioritized)

1. **Episode persistence + transcript pipeline** — the shared prerequisite (§3)
2. **Content kit + MCP Phase 1 + YouTube LITE → Pro ships at $19.**
   YouTube lite = channel OAuth connect + per-episode view counts (manual
   episode↔video linking is acceptable in v1). Small scope rider on the Pro
   build; revenue still lands first.
3. **Episode Report v1 = the attribution build.** Tracked links (gap 1),
   per-episode pages (gap 2), correlation view (gap 4), + full YouTube depth
   (watch time, Shorts breakdown, auto-matching). The loop becomes visible
   here. (Absorbs the frontend plan's P2 "conversion plumbing.")
4. **Subscribe deep-links (gap 3)** — cheap, free-tier; can slot anywhere
   after step 1, opportunistically.
5. **Clip Studio + clips in the report + YouTube publishing-OUT** — post-launch
   Creator tier, per GOAL_STATE.

Rationale: a report with no persisted episodes has nothing to report on; a
report without attribution is an analytics page with a kit stapled on. Revenue
arrives at step 2 (with YouTube already visible); the moat arrives at step 3.

---

## 7. Constraints this must respect (from 2026-08-16 audit)

- `podcast_shows` has `unique(user_id)` — 1 show per user, hardcoded. (Actually
  convenient here: "instance = show" is clean.)
- Plan rows must be created in the **MagicAI admin**, never by hand in Stripe
  (`StripeService::saveProduct()` keeps them in sync).
- `reset_credits_on_renewal` defaults to false — set per plan or quotas never reset.
- `BIOLINK_CREATOR_PLAN_ID` / `BIOLINK_PRO_PLAN_ID` Railway vars are
  unreferenced dead vars.

---

## 8. Open items

**Verify against the codebase before treating §2/§4 as final:**
1. Does this MagicAI version chunk long audio for Whisper, or hard-fail over
   the size limit? (Determines whether chunking is build-new or config.)
2. What exactly is the chatbot-training embedding store (schema, per-user
   scoping) — reusable for Layer 3?
3. What tools/resources does the uncommitted MCP server already implement?
   Diff against §4 Phase 1.
4. `import_transcript` for unpublished episodes implies a "draft episode" row
   that later reconciles with the RSS item on publish — needs a matching
   strategy (GUID vs title/date).

**Product decisions still open:**
5. Concrete Free-tier limits (bio-link feature limits, analytics scope) — the
   27 `TODO(pricing)` markers in `pricing.ts` still need real values.
6. Trial: is there one?
7. The 9 unverified content claims from the marketing-site audit (esp. whether
   clips work for audio-only shows — affects Creator tier copy).
8. Competitor verification (Castmagic, Podsqueeze, etc.; and the smart-link /
   subscribe-link market post-Chartable). Needed before §0/§5 framing hardens
   and before `/pricing` goes live.
9. YouTube lite tier placement: free (acquisition, consistent with
   analytics-free) or Pro (sweetens the paid tier)? Currently drafted as Free.
10. YouTube auto-matching strategy for Report v1 (title/date heuristics vs
    manual-only), and which Analytics API metrics per episode.

**Follow-through once settled:**
11. Rewrite `web/src/content/pricing.ts` to this spec, remove `noindex` from
    `/pricing`, add it to the sitemap.
12. Create/fix plan rows in MagicAI admin to match.
