# PR #1 review — `gtm/frontend-conversion-sprint` (homepage analytics-first rewrite)

Found 2026-09-17 during deploy verification: a PR opened on GitHub from Joelle's
account (likely the ChatGPT/Codex side working from the V3 audit — it references
/analyze and #show-report, which shipped hours earlier). NOT merged, NOT touched:
homepage hero rewrite is a founder-sign-off item per canon, and a PR awaiting
review is exactly the right state. Production is unaffected.

## What it changes (2 files: home.ts + page.tsx metadata)
- Hero: "Record the episode…" → **"Know what's growing your podcast. Then do
  more of it"**; eyebrow "Independent podcast analytics + AI"; primary CTA
  **"Analyze your podcast free" → /analyze** (was Start free → register);
  secondary → #show-report anchor (exists — works).
- How-it-works: content-kit framing → analytics/report/assistant framing.
- Two doors: "Measure and understand your show" / "Or put a podcast team
  behind it" (CTA /analyze and /services).
- REPORT_BAND: "A podcast report people can actually open" (spreadsheet-pain
  angle — consistent with the validated reports-pain positioning).
- CTA band + homepage <title>/description: analytics-first.

## Review verdict (mechanical + claims)
✅ Merges clean onto main (verified via merge-tree; no conflicts with the
proof band / sprint changes). ✅ Anchors and routes referenced all exist.
✅ Tone/claims mostly disciplined ("where available", no invented numbers).
✅ Strategically consistent with the canon hero ("the report is the product").

⚠ TWO items for the founder's read:
1. **"Claude or ChatGPT"** appears at hero/metadata level (3 places). Canon
   claims rule: Claude is e2e-verified; ChatGPT connector is staged but NOT
   user-verified. Options: (a) soften to "Claude (and other MCP clients)" /
   "your AI assistant", or (b) run the ChatGPT test matrix first and keep it.
2. **Primary CTA flips register → /analyze** across hero, report band and CTA
   band. Defensible PLG move (taste-first), but it demotes direct signup
   everywhere on the homepage — worth a deliberate yes.

## Decision needed (one of)
- MERGE as-is (accepting #1 as a claim you're comfortable with),
- MERGE after the two-word softening of "or ChatGPT" (I can push that to the
  branch on your word), or
- CLOSE and keep the current hero.
No action = nothing changes; production keeps today's homepage.
