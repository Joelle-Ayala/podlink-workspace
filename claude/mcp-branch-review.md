# MCP Branch Review (branch `mcp-server`, 2026-08-26)
**Verdict: high-quality, spec-faithful, NOT yet deployable — one blocker, two notes.**

## What's right (reviewed: middleware, routes, resolver trait, discovery controller, config)
- Tenancy is double-asserted: bearer gate middleware + in-tool `ResolvesMcpUser` trait; NO
  tool accepts any identity parameter, and routes/mcp.php declares that as a reviewer rule
  with the complete tool surface in one file (attribute discovery off). Exactly scoping R1.
- OAuth discovery is spec-compliant: RFC 9728 protected-resource metadata, RFC 8414 AS
  metadata, DCR endpoint, PKCE public client, and the 401 WWW-Authenticate challenge with
  `resource_metadata` that claude.ai connectors need to bootstrap. Config kill-switches
  (MCP_OAUTH_ENABLED, MCP_DCR_ENABLED) present.
- Prompt-injection mitigation (scoping R5): `safeText()` strips/caps all third-party RSS/
  OP3 strings before they enter model context. Nice touch rarely seen.
- v1 tool surface matches PODLINK-MCP-SCOPING.md exactly; v1.1/v1.2 explicitly fenced out.

## 🔴 Deploy blocker
- **composer.lock was not committed.** composer.json adds the MCP package but the lock
  file isn't in the branch's 17 files — Railway's `composer install` will fail (package
  missing from lock). Fix: run `composer update php-mcp/laravel` (or the exact package)
  locally/in a sandbox, commit the lock delta to the branch. NOTE: no PHP/composer on this
  Windows host — needs the deploy-test session or a dev container.

## Notes for the deploy test
1. **Package substitution vs scoping doc:** implementation uses `php-mcp/laravel`
  (community) + custom discovery controllers, NOT the official `laravel/mcp` +
  `Mcp::oauthRoutes()` the scoping doc assumed. The custom OAuth layer looks complete —
  but the deploy test must exercise the full DCR → authorize → token → tool-call path
  against a real claude.ai custom connector before merge.
2. **Guard assumption:** config comments say the `api` guard is Passport-backed in this
  app — verify in config/auth.php at deploy time (MagicAI variants ship sanctum/jwt).
  If Passport isn't installed/migrated, the token path 401s everywhere.
3. **Post-merge alignment:** ListEpisodes' RSS fallback can flip to the ml2-lite episodes
  table (now on main) — do it in the merge commit, not on the branch.

## Sequence (unchanged from canon)
Blocker fix → deploy test off-prod → merge → directory submission prep (ships WITH Pro)
→ v1.1 transcript tools once the pipeline lands.
