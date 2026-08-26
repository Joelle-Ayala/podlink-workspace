# PodLink MCP Server — Scoping Doc
**Date:** 2026-08-15 · **Status:** SCOPING ONLY — nothing built
**Goal:** PodLink users connect Claude (or any MCP client) to their PodLink account: "how did my show do this week?" pulls their OP3 downloads; "draft show notes for episode 12" runs the MagicAI content tools.
**Grounded in:** PODLINK-FEATURE-MAP.md, GOAL_STATE.md, API_CONTRACT.md, SESSION_LOG.md (through Session 11, 2026-08-15), CURRENT-STATE.md, plus web research on the MCP ecosystem as of Aug 2026 (sources at bottom).

---

## 0. TL;DR recommendation

Build the MCP server **inside the MagicAI Laravel app** using the **official first-party `laravel/mcp` package** (Streamable HTTP transport, OAuth 2.1 via `Mcp::oauthRoutes()` + Passport, Dynamic Client Registration — exactly what claude.ai custom connectors need). This skips building a parallel public REST API and a separate TypeScript service: MCP tools call the same internal services (`Op3Service`, feed inspection, template generation) the dashboard already uses, with the authenticated user's own scope.

v1 = **read-only analytics tools** (OP3 downloads, top apps, episodes, page URL). v1.1 = Biolink click stats. v1.2 = content generation with credit metering. Ship post-M8 alongside ML2 — zero impact on the M8 critical path.

---

## 1. Tool list v1

All tools operate on **the authenticated user's own data only** — the user id comes from the OAuth token, never from a tool parameter.

### v1 — read-only analytics (thin wrappers, code mostly exists)

**`get_show_overview`** — THIN WRAPPER over `Op3Service` + `PodcastShow`
- In: *(none — user-scoped)*
- Out: `{ show_title, rss_feed_url, op3_prefix_active (derived live from feed inspection), podlink_page_url, stats: { monthly_downloads, weekly_downloads[4], weekly_avg, weeks_measured } }`
- Source: `queries/show-download-counts` (verified 2026-08-08 vs live swagger). If no show connected → structured "not connected" response with the dashboard onboarding URL (never fake numbers — mirrors the M5 graceful state).

**`get_top_apps`** — THIN WRAPPER over `Op3Service::topAppsForShow()`
- In: *(none)*
- Out: `[{ app, downloads, share_pct }]` — absolute counts over last 3 calendar months (post-`efe2fb3d` fix: `appDownloads`, not `appShares`).

**`list_episodes`** — THIN WRAPPER
- In: `{ limit?: int = 20 }`
- Out: `[{ id, title, pubdate }]` newest-first via OP3 `GET /shows/{feedUrlBase64}?episodes=include` (verified endpoint form — feed URL as urlsafe base64 in the *path*). Fallback for prefix-less shows: parse the stored RSS directly (feed-inspection code exists from M5).

**`get_podlink_page`** — THIN WRAPPER / NEW-SMALL
- In: *(none)*
- Out: `{ url: "podlink.fm/{handle}", exists: bool }` — the user's public page. Handle lookup via the existing SSO user-mapping (email → Biolink user). Small new code.

### v1.1 — Biolink click stats (NEW WORK)

**`get_page_stats`**
- In: `{ period?: "7d" | "30d" | "90d" = "30d" }`
- Out: `{ pageviews, unique_visitors?, clicks_by_block: [{ block_type, title, clicks }], top_countries?, top_referrers? }`
- Why new: the documented Biolink **Admin API covers users/plans/payments/SSO — not per-link statistics**. Options, in preference order: (a) audit whether Biolink v68 has a user-level stats API (users have an `api_key` field — scope unverified); (b) read-only second DB connection from Laravel to the `biolink` MySQL database (both DBs already live on the same Railway MySQL — pragmatic, but couples us to Altum's schema across Biolink updates); (c) small custom endpoint added to Biolink (Altum PHP — least preferred, forks vendor code). **Open question O1.**

### v1.2 — content generation (MEDIUM — new service extraction + credit metering)

**`generate_content`**
- In: `{ template: "show_notes" | "episode_titles" | "episode_description" | "social_post_pack" | "newsletter" | "episode_summary" | ..., inputs: { transcript?|topic?|episode_ref?... per template } }`
- Out: `{ content, credits_used, credits_remaining }`
- The 12 ICP templates are live (Session 7 §5) as MagicAI custom templates, but generation is coupled to the web controller (`POST /openai/generate`, session + CSRF). Needs a **service-layer extraction** so MCP and web share one generation path, with the existing credit accounting applied identically. Do NOT bypass credits.

**`list_templates`** — THIN WRAPPER: names/slugs/required inputs of the "Podcast" category templates, so clients can discover what `generate_content` accepts.

### Explicitly NOT in v1
- Any write to the Biolink page (block editing via MCP) — later, real product surface, needs careful authz.
- YouTube analytics (ML2 must exist first — then it's one more thin wrapper).
- Image/audio/video generation — heavy credit burn, add after metering is proven.
- Admin/agency tools.

---

## 2. Prerequisite API layer

### What exists today (audit)
| Surface | State |
|---|---|
| MagicAI public REST API | **None usable.** "API for users" (`/dashboard/user/apikeys`) exists in the vendor package but was hidden in the M1 hide-list and its scope (which endpoints those keys unlock) is unaudited. Analytics live in `AnalyticsController` + `Op3Service` behind the session-auth dashboard — server-rendered, no JSON endpoints (the old JSON widget endpoints were deliberately dropped in the 2026-07-09 reconcile). |
| Biolink Admin API | Users/plans/payments/SSO only; bearer = the **regenerated** admin key. It's an *admin* key — must never be reachable from MCP tool code paths that take user input. No stats endpoints documented. |
| OP3 | Clean external API, bearer token, endpoints live-verified 2026-08-08, 1h cache in `Op3Service`. |

### What must be built — the minimal surface
Key architectural point: **with `laravel/mcp` living inside the MagicAI app, no new public REST API is required for v1.** MCP tools are classes that call `Op3Service` etc. directly under the authenticated user. The "API layer" work shrinks to:

1. **Service extraction** where logic is controller-bound: a `PodcastAnalyticsService` façade over what `AnalyticsController` composes today (small), and a `ContentGenerationService` extracted from the `openai/generate` path (the real work, v1.2).
2. **`BiolinkStatsService`** (v1.1) — whichever of options (a)/(b)/(c) above wins O1.
3. *(Optional, later)* If a public REST API is ever wanted for non-MCP integrations, expose these same services via `routes/api.php` + Sanctum tokens. Don't build it speculatively.

### Auth model
- **Primary: OAuth 2.1 authorization-code + PKCE with Dynamic Client Registration**, provided by `Mcp::oauthRoutes()` + Laravel Passport. This is what claude.ai custom connectors expect: user pastes `https://app.podlink.ai/mcp`, Claude discovers the endpoints via the well-known documents, self-registers (DCR, public client, no secret), user logs in with their normal PodLink credentials + consent screen, Claude holds a user-scoped bearer token. The current MCP spec (2026-07-28) formalizes exactly this shape: MCP server = OAuth resource server, tokens validated per user.
- **Secondary (defer):** per-user static API keys for header-capable clients. Only add if users ask; OAuth covers Claude, Cowork, Desktop, and mobile.
- **Tenancy rule (non-negotiable):** every tool resolves data through `$request->user()`. No tool accepts a user id, email, handle, or show uuid as input. The Biolink admin key and OP3 token stay server-side config, never surfaced.

---

## 3. Architecture

### Recommendation: Laravel-native (`laravel/mcp` in the MagicAI app)

**Ecosystem check (researched, not assumed):**
- MCP spec current version **2026-07-28** — stateless core, Streamable HTTP (now with `Mcp-Method` routing header), hardened OAuth (resource-server-only model, CIMD direction). Remote HTTP servers are the mainstream pattern; SDKs negotiate protocol versions.
- **`laravel/mcp` is official, first-party, and mature**: Streamable HTTP for `web` servers, `routes/ai.php` registration, middleware, built-in OAuth 2.1 (Passport) + Sanctum support, `Mcp::oauthRoutes()` for the discovery/DCR documents, MCP Inspector tooling. Supports Laravel 10 / PHP 8.2+ — matches MagicAI v10.81 (Laravel ^10, PHP ^8.2).
- **Claude side:** custom connectors via remote MCP are available on **Pro, Max, Team, Enterprise** plans, across claude.ai, Desktop, Cowork, **and mobile** (add on claude.ai, then usable on iOS/Android). Free Claude users cannot add custom connectors — see R6.

**Why in-app beats a separate TypeScript service:**
| | Laravel-native (recommended) | Separate TS service on Railway |
|---|---|---|
| Auth | Reuses PodLink accounts, Passport, consent — one system | Must proxy auth to MagicAI or run its own IdP |
| Data access | Direct: `Op3Service`, `PodcastShow`, templates, credits | Requires building + securing the very public REST API we're trying to avoid |
| Ops | Zero new services (Railway custom-domain limit already hit!) | New service, new deploys, new env vars |
| Cost of change | New composer dep in a vendor codebase (see R4) | Isolated, but ~2x total work |

The TS SDK path is the fallback if `laravel/mcp` proves incompatible with MagicAI's quirks in a spike (see Phase A gate).

### End-to-end flow
```
User (Claude app, any device)
  → adds connector: https://app.podlink.ai/mcp        (claude.ai, once)
  → Claude fetches /.well-known/* discovery docs       (Mcp::oauthRoutes)
  → DCR self-registration → user logs in at app.podlink.ai → consent
  → Claude ⇄ POST /mcp (Streamable HTTP, Bearer token, user-scoped)
       MCP tools → Op3Service ──→ op3.dev/api/1        (server OP3 token, 1h cache)
                 → BiolinkStatsService ─→ biolink MySQL (read-only conn)  [v1.1]
                 → ContentGenerationService → credits + AI models         [v1.2]
```

### Hosting & deployment notes
- No new Railway service. New routes on the existing `podlink-workspace` deployment. Composer additions (`laravel/mcp`, `laravel/passport`) committed to the repo per the zero-build philosophy.
- **Respect the standing hard rule: never `config:cache` this app** (igaster theme engine). Verify `laravel/mcp` needs nothing cached.
- Passport keys → Railway env vars (not filesystem — ephemeral FS lesson already learned). Remember the Railway gotcha: env var edits require a **code deploy**, not a redeploy.
- Domains: OAuth callbacks and discovery need stable HTTPS at `app.podlink.ai` → **DNS cutover (M0 remainder) is a hard prerequisite.**

---

## 4. Effort estimate & roadmap slot

Estimates assume the current CoS/agent working model (agent sessions + founder for credentials/decisions).

| Phase | Scope | Est. | Gate |
|---|---|---|---|
| **P0 — prereqs** | DNS cutover done (already on M0 punch list); Passport installed; spike: `laravel/mcp` + Passport boots inside MagicAI without config-cache/theme conflicts, Inspector handshake passes | 1 session | Spike fails → fall back to TS SDK service (re-scope, ~2x) |
| **P1 — v1 read-only** | Server scaffold in `routes/ai.php`, OAuth wiring + consent, 4 analytics tools, live test as a claude.ai custom connector on desktop + mobile | 1–2 sessions | "How did my show do this week?" answered in Claude from a real account |
| **P2 — v1.1 Biolink stats** | Resolve O1, `BiolinkStatsService`, `get_page_stats` | 1 session | Click stats match the Biolink dashboard |
| **P3 — v1.2 generation** | `ContentGenerationService` extraction, credit metering, `generate_content` + `list_templates` | 1–2 sessions | Show notes generated via Claude debit credits identically to the dashboard |
| **P4 — polish/launch** | Rate limiting, audit logging, "Connect Claude" help page + dashboard card, marketing mention | 1 session | Docs + announcement ready |

**Total: roughly 5–7 agent sessions** spread across phases, plus founder time only for Passport/domain approvals.

**Roadmap slot:** post-launch track, **after M8, sequenced with ML2** (it's the same "surface analytics elsewhere" muscle; when ML2 lands, YouTube stats become one more MCP tool for free). Suggest registering it as **ML2.5 — "PodLink MCP connector"** in GOAL_STATE to avoid doc drift. It must not delay M8, and it doesn't: nothing in P0–P4 touches Stripe/M4, the core loop, or the marketing site. P0's only overlap with the critical path is the DNS cutover — which M8 needs anyway. Marketing upside: "Ask Claude about your show" is a differentiator no Linktree-class competitor has, and it composes with the M5 Chartable-gap story.

---

## 5. Risks & open questions

**R1 — Multi-tenant leakage (highest severity).** The dashboard's implicit session scoping must be re-proven under token auth. Mitigation: hard rule (no identity params on tools), code review of every tool for `user_id` scoping, and a two-account cross-read test in P1 acceptance.

**R2 — MagicAI credit burn / abuse via MCP.** An agent loop can fire `generate_content` far faster than a human. Mitigation: same credit checks as web (fail closed), per-user rate limits on the `/mcp` route (Laravel middleware), return `credits_remaining` on every generation so the model self-limits, and keep generation out of v1 until metering is proven. Decide: is MCP access itself tier-gated (e.g., analytics free / generation Pro+)? — matches the existing tier philosophy.

**R3 — OP3 rate limits & availability.** Free community service, no SLA. The 1h cache + graceful-null handling in `Op3Service` already covers this; MCP inherits it. Never let a tool hammer OP3 in a loop — cache at the service, not the tool.

**R4 — Vendor-codebase friction.** Adding composer packages to MagicAI risks conflicts with vendor auto-updates, and `laravel/mcp` has had claude.ai OAuth rough edges (e.g., GitHub issue #210). Mitigation: pin package versions, P0 spike gates the whole approach, MCP code isolated in `app/Mcp/` + `routes/ai.php` so vendor updates don't collide, test with MCP Inspector + a real claude.ai connector before calling any phase done.

**R5 — Prompt injection via podcast data.** Episode titles/descriptions come from third-party RSS and flow into the model's context via tool results. Read-only v1 limits blast radius; still sanitize/truncate feed-derived strings and never let tool output steer privileged actions (there are none in v1 — keep it that way as tools grow).

**R6 — Claude plan gating.** Custom connectors require Claude **Pro or higher**; PodLink free-tier users on free Claude can't use it. Position as a power feature; docs must say this plainly. (Other MCP clients — Cursor, ChatGPT connectors, etc. — have their own policies; OAuth+Streamable HTTP is the interoperable choice.)

**R7 — Spec churn.** 2026-07-28 spec just landed (stateless core, new headers). Mitigation: stay on the official SDK/package and update quarterly; version negotiation handles older clients.

**Open questions**
- **O1:** Biolink click-stats access path — user-level API vs read-only DB connection vs custom endpoint (see §1 v1.1). Needs a 1-hour audit of Biolink v68 source.
- **O2:** Tier gating for MCP (free-with-account vs Pro+ perk vs analytics-free/generation-paid). Founder pricing decision — same bucket as the standing pricing item.
- **O3:** Does MagicAI's hidden "API for users" key system conflict or overlap with Passport? Audit during P0 (likely ignore it).
- **O4:** Expose credit balance as its own tool (`get_credits`)? Cheap, probably yes — users will ask Claude "how many credits do I have left?"
- **O5:** MCP server name/branding in the consent screen — "PodLink" (vendor-string sweep applies to this new surface too).

---

## Sources (MCP ecosystem research, Aug 2026)
- MCP 2026-07-28 spec release: https://blog.modelcontextprotocol.io/posts/2026-07-28/ (and RC notes; stateless core, Streamable HTTP `Mcp-Method` header, OAuth hardening)
- MCP authorization overview: https://www.descope.com/blog/post/mcp-auth-spec · https://mcp.directory/blog/oauth-21-for-remote-mcp-servers-streamable-http-explained-2026
- Official Laravel MCP: https://laravel.com/ai/mcp · https://laravel.com/docs/12.x/mcp (Streamable HTTP, OAuth 2.1/Sanctum, middleware) · auth best practices: https://laravel.com/blog/laravel-mcp-server-auth-security-best-practices
- Laravel MCP + Passport DCR flow (`Mcp::oauthRoutes()`): https://dev.to/nasrulhazim/one-step-install-and-one-flag-oauth-for-a-laravel-mcp-server-49op · known claude.ai OAuth issue: https://github.com/laravel/mcp/issues/210
- Claude custom connectors (plans, mobile support): https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp · https://support.anthropic.com/en/articles/11503834-building-custom-connectors-via-remote-mcp-servers
- OP3 API: https://op3.dev/api/docs (endpoint shapes live-verified 2026-08-08 per API_CONTRACT.md)

---

## Amendment 2026-08-25 - v1.1 TRANSCRIPT TOOLS (founder-approved, formal scope)
Joelle approved the "talk to your podcast" framing. Two tools move from someday to v1.1:

**search_transcripts** - In: { query, limit? } - full-text/semantic search across the authenticated user's OWN episode transcripts; Out: matching passages with episode ref + timestamp. **get_transcript** - In: { episode_ref } - one episode's transcript (speaker labels + timestamps where available).

GATE: the transcript pipeline from the current engineering thread (episodes table shipped in ml2-lite; transcription pending - see feed-ingestion-show-report-spec.md). Sequence: pipeline lands -> MCP branch review + deploy test (still pending, branch mcp-server) -> v1.1 transcript tools -> only then the connector-directory listing and the index flip on /features/mcp.

**Key architecture note:** the content-ideation use case ("suggest clips/topics from my best-performing episodes") requires NO agent build on our side. The user's Claude IS the agent; our MCP only serves context - analytics (v1 tools), transcripts (v1.1), brand voice/templates (v1.2 generate_content + list_templates). Composability is the product: analytics tool says WHICH episodes performed, transcript tool says WHAT was in them, the user's agent does the reasoning. Do not build reasoning endpoints.

Marketing discipline unchanged: /features/mcp stays noindex + future-tense until the server actually ships to users; "first podcast MCP" claimable only after the directory listing is live.
