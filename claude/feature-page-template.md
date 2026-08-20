# Feature Page Template (v1 — Joelle's 10-section stack, 2026-08-20)
**Status:** DRAFT stack approved for drafting; Joelle may still tweak section order/content.
**Applies to:** all 8 /features/* pages. Deliverable = one template, applied per page, with
placeholder assets where none exist. Big copy deviations from current pages go through the
copy-vs-canon audit sign-off process — do not silently ship rewrites of live meaning.

## Canon this template answers to
- `claude/buyer-personas-messaging.md` §0/§3 — persona language for problem framing (§2)
- `claude/podlink-sitemap-ia-plan.md` §4 — tool-intent TITLES ARE SETTLED; the collision-rule
  titles shipped in commit 310d0e85c are preserved verbatim. This template changes page BODY
  structure, never the title/H1 keyword strategy.
- `claude/gtm-plan.md` + evidence rules — §6 testimonial/number MUST be sourced
  (podlink-services-evidence-brief.md); nothing unverified, no CVS/Oracle figures, no Elmo
  clip claims, no "first podcast MCP" until listed.

## The section stack (in order)
1. **Hero** — H1 (tool-intent title, unchanged), strong subheadline, feature-specific sign-up
   CTA (`appUrl('/register')` with feature context), product screenshot or feature video.
   Missing asset → `ScreenshotFrame` placeholder (exists in the design system) + `TODO(asset)`.
2. **Trust strip** — logos/shows from `proof.ts` `visibleShows()`/`visibleBrands()` ONLY
   (clearance-gated). No new names.
3. **Problem framing** — persona language, S2 (Pro's buyer) by default; quote the pain in
   voice-of-customer terms from the personas doc.
4. **How it works, 3 steps** — numbered, snippet/AEO-friendly (each step: verb-first name +
   1–2 plain sentences), visual per step (placeholder allowed).
5. **Benefit deep-dives** — 2–4 blocks; H2s phrased near real queries per the keyword mapping
   in the sitemap plan §4 (question-phrased where natural).
6. **Host compatibility strip** — "works with the host you have": Buzzsprout, Transistor,
   Libsyn, Captivate, Acast + generic RSS. Never name a host we haven't verified feed-parses.
7. **Sourced proof** — exactly one testimonial or number, with its source verifiable via the
   evidence brief; if the feature has none, OMIT the section (empty > invented).
8. **FAQ** — 4–6 natural-phrasing questions, `FAQPage` JSON-LD (the site's `lib/seo.ts`
   already emits FAQPage — reuse, don't duplicate).
9. **Related features** — 2–3 internal links from the feature graph (footer already derives
   from FEATURES; on-page block should too — no hardcoded slugs, see nav.ts TODO).
10. **Final CTA banner** — outcome-focused, reuse `CTA_BAND` pattern.

## Under the hood
- Schema: FAQPage per page; `VideoObject` ONLY when a real video asset exists (schema for a
  placeholder is a lie Google punishes).
- Titles/meta: unchanged from the §4 collision rewrites. Body H2s may be question-phrased.
- Honesty markers: any section describing unshipped capability (MCP, episode report, YouTube
  views, import_transcript) carries the same `TODO(pricing): unshipped` comment discipline as
  pricing.ts, or is framed future-tense with the roadmap link.
- Implementation: extend `src/content/features.ts` types with the new sections; pages stay
  derived from content (copy edits never touch components). One commit per template change,
  then one commit applying content across the 8 pages.

## Application order (drip-aligned)
download-analytics → link-in-bio → show-notes → templates → transcripts → multilingual →
clips-and-social → newsletter. (Matches drip calendar order so each announcement lands on an
upgraded page.)

## Asset placeholder inventory (fill as created)
| Feature | Hero asset | Step visuals | Video |
|---|---|---|---|
| all 8 | TODO(asset) ScreenshotFrame | TODO(asset) | none yet — no VideoObject |
