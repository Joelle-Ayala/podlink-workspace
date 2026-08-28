# /pricing Page Template (v1 — 2026-08-20)
**Status:** stack approved for drafting. Highest-intent page; this template defines the
PRE-INDEX-FLIP rigor bar. ⚠️ CANON CORRECTION: the directive said "Creator placeholder" —
that is the superseded 08-17 ladder. Canon is Pricing v2 (ADOPTED 2026-08-20):
**Free / Pro $29 / Studio $99**, clips as a future $20 add-on. There is no Creator tier.
Flagged to Joelle; if she intended something else, this doc revises.

## Stack (current page already implements most of this via content/pricing.ts)
1. **Plan cards** — Free / Pro $29 / Studio $99 (Studio = "Talk to us", no checkout until
   `unique(user_id)` lifts). Annual per v2 asymmetry: Pro 8× ($232), Studio 10× ($990).
2. **Annual toggle** — only if the billing actually supports both intervals per plan in the
   MagicAI admin (it should — verify at admin-fix time). Never show a toggle that doesn't
   match what checkout charges.
3. **Feature-inclusion comparison** — ONLY SHIPPED capabilities listed un-marked. This is
   the claims-truth-audit tie-in: every row cross-checks the matrix
   (claude/feature-claims-truth-audit.md); unshipped rows either carry TODO markers (blocks
   index flip) or leave the table.
4. **Services cross-band** — "Want it done for you?" → /services. The dual-funnel answer on
   this page; mirrors the DIY cross-links in the services template §10.
5. **Objection FAQ** — billing objections, FAQPage schema, in-DOM when collapsed.
6. **Final CTA** — Start free (volume path; nav-flip rationale applies here too).

## Copy decision surfaced for Joelle (audit before/after)
The old "$19 replaces three subscriptions" consolidation framing died with the price change.
Current live copy says "$29 replaces ~$48 of stack (Podpage $19 + repurposer $29) plus what
nobody sells." Confirm or refine this framing in the audit pass — it's the page's central
argument and v2 §6 prescribes the stack-replacement lead.

## Index-flip checklist (ALL required before removing noindex)
- [ ] Zero `TODO(pricing)` markers of either type in content/pricing.ts
- [ ] Claims matrix: every table row SHIPPED or removed
- [x] Free-tier caps decided (v2 §7.1: ~10 bio links, no episode report, unlimited history) · reverse-trial decided (§7.2: 14-day full Pro → Free) · Studio overage (§7.3: $2/ep past 40, hard-capped) — ALL DECIDED 2026-08-27
- [ ] MagicAI admin ladder matches the page exactly (Joelle's admin fix)
- [ ] Re-add /pricing to sitemap.ts (uncomment note is in that file)

## Visual spec
Inherit v1.1 globals. Cards over tables on mobile; comparison table horizontally scrollable
with sticky first column; Studio card visually distinct (talk-to-us, not a buy button).
