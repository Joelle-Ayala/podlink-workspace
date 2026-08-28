# MCP Review — SUPERSEDED by mainline verification (2026-08-27)

**Final status: the MCP server is LIVE on main and verified end-to-end on prod.**
This doc originally reviewed branch `mcp-server` (2026-08-26). That branch was an
obsolete parallel snapshot: main already carried the MCP lineage
(c8fc9d198 → a37238220, vendored `php-mcp/laravel` ^4.0 **with composer.lock** in
774a745a7). The branch's remote was deleted; the local copy is deleted too. The
"composer.lock deploy blocker" below was **wrong for main** — kept only as review
history.

## E2E verification on prod (app.podlink.ai, 2026-08-27) — ALL PASS
- Discovery: RFC 9728 protected-resource + RFC 8414 AS metadata correct; 401
  WWW-Authenticate challenge carries `resource_metadata`.
- DCR: registered clients (ids 2, 3 — test clients, revocable from the dashboard).
- Full OAuth 2.1: PKCE S256 authorize → branded consent → code → token exchange
  (30-day access token + refresh). `api` guard confirmed Passport-backed
  (PASSPORT_* keys live on Railway) — note 2 below is resolved.
- MCP initialize: server "Podlink" v1.0.0, Streamable HTTP session established.
- tools/list: all 4 v1 tools present. Annotations gap found → fixed on main in
  75b1a80fe (ToolAnnotations: title + readOnlyHint true + openWorldHint false).
- tools/call: all 4 tools return 200 with honest structured output (connected
  state, graceful `no_op3_data`, `handle_not_stored`) against real data.

## What's right (review findings, still accurate)
- Tenancy double-asserted: bearer gate middleware + `ResolvesMcpUser` trait; NO
  tool accepts any identity parameter; routes/mcp.php declares that as a reviewer
  rule with the complete tool surface in one file (attribute discovery off).
  Exactly scoping R1.
- OAuth spec-compliant (RFC 9728 / 8414 / DCR / PKCE / 401 challenge); config
  kill-switches (MCP_OAUTH_ENABLED, MCP_DCR_ENABLED) present.
- Prompt-injection mitigation (scoping R5): `safeText()` strips/caps third-party
  RSS/OP3 strings before they enter model context.
- v1 tool surface matches PODLINK-MCP-SCOPING.md exactly; v1.1/v1.2 fenced out.

## Historical: original branch-review flags (2026-08-26)
- ~~🔴 composer.lock not committed → Railway install fails~~ **WRONG for main**:
  main vendored the package + lock in 774a745a7 and is deployed.
- ~~Guard assumption: verify `api` guard is Passport-backed~~ **Verified live.**
- Package substitution note (community `php-mcp/laravel` + custom OAuth, not
  official `laravel/mcp`): stands as documentation; the custom path passed the
  full DCR → authorize → token → tool-call test with a real client.
- Post-merge alignment: ListEpisodes' RSS fallback can flip to the ml2-lite
  episodes table (on main) — still OPEN, do alongside transcript-pipeline work.

## Remaining before directory submission
1. Annotations deploy verify (75b1a80fe on Railway) — in progress.
2. Setup-docs page for connecting Claude (relates to /features/mcp, noindex
   until listing live).
3. **Joelle**: Claude Team org purchase + privacy policy URL.
4. "first podcast MCP" claim stays embargoed until the listing is live (canon).
