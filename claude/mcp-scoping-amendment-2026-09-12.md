# PODLINK-MCP-SCOPING amendment 2026-09-12 (sibling doc — main file locked by editor)

Governs until merged into PODLINK-MCP-SCOPING.md. Same pattern as the
contact-discovery amendment doc.

## v1.2-lite SHIPPED: gate-tier declarations (acceptance criterion 1)

Two tools added in commit 04bee89ef, registered in routes/mcp.php with ToolAnnotations
(readOnlyHint, openWorldHint:false), no input params, ResolvesMcpUser tenancy:

- **get_page_stats** — GATE TIER: FREE (analytics read). Biolink read bridge consumer
  (BiolinkStatsRepository only; drift guard applies). Returns unavailable / no_page
  (with setup_url) / ok {pageviews_30d, unique_visitors_30d, page_url, top_links}.
  Read path (1) of Amendment 2026-08-27b is now LIVE as an MCP tool. Write path (2)
  status unchanged: v1.2+ at earliest, explicit scopes, still NOT built.
- **get_recent_performance** — GATE TIER: FREE (analytics read; the criterion-4
  first-call-wow tool). Last-5-episode summary + honestly computed observations
  (YouTube-view outliers ≥2×/≤0.4× median only when ≥3 view rows; ≥14-day cadence
  gap; transcript coverage; capped at 5; notes[] names absent sources instead of
  guessing). No new data surface — composes existing reads.

Tool count: 8 (all read-only, all free-tier per FREE-READ RULE). Directory listing
metadata (listings-and-rehearsal.md §1) should say 8 tools at submission.
Authed tools/list verification of the two new tools is PENDING a fresh OAuth token
(token file wiped by temp cleanup); verified instead via deploy boot + 401-on-/mcp.
