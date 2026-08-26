# Feature Page Template (v1.1 — Joelle's 10-section stack + visual spec, 2026-08-20)
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

## Visual spec per section (Joelle, 2026-08-20 — codified verbatim)
1. **Hero** — headline ≤~10 words. ONE high-contrast CTA + reassurance microcopy ("free, no
   card required"). Asset: screenshot in a browser frame with soft shadow, OR a muted ≤30s
   autoplay loop with poster (VideoObject only when the video is real). Mobile: visual BELOW
   text. The hero image is the LCP — priority-load it (`priority` on next/image, no lazy).
2. **Trust strip** — single low-height row; grayscale logos or one one-line quote + avatar.
   Keep it short enough that the next section peeks above the fold.
3. **Problem framing** — typography-only moment: larger type, generous whitespace, optional
   dark contrast band (ink). NO imagery.
4. **How it works** — 3 numbered steps; columns on desktop, stacked on mobile; one small
   visual each; parallel phrasing across steps; numbered badges or a connector line.
5. **Deep-dives** — alternating zig-zag text/image. Screenshots cropped to the relevant UI
   with annotation callouts. Consistent aspect ratios across all blocks. Each block: one
   benefit H2 + 2–3 sentences (+ optional 3 bullets).
6. **Compatibility** — logo chips with names, wrapping row, single caption line.
7. **Testimonial** — ONE pull-quote card only: the number displayed large, the quote, avatar
   + show name. (Evidence-gated as specified above.)
8. **Pricing context** — a single inline card/banner: plan, price, inclusions, CTA. Never a
   full comparison table on a feature page.
9. **FAQ** — accordions with large tap targets and chevrons; answers REMAIN IN THE DOM when
   collapsed so FAQPage schema and crawlers see them regardless of state.
10. **Related features** — 3-card grid: icon + title + one-liner.
11. **Final CTA** — full-width brand-orange band, outcome-phrased headline, one button,
    reassurance line. (Note: orange band = ink text/button per the contrast findings —
    #FF8C00 fails AA for text on white; buttons are ink-on-orange, 8.20:1.)

**Globals:** 8pt spacing rhythm · ~65ch max text width · lazy-load all below-fold media ·
zero CLS from late media (explicit width/height everywhere) · orange reserved for CTAs only ·
motion only where it demonstrates the product, and respect `prefers-reduced-motion` · brand
palette/typography per the existing site (Poppins; orange on ink; tokens in globals.css).

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

## Component sourcing - the lego workflow (adopted NARROWLY, 2026-08-25)
Verdict on the viral component-library workflow: our situation inverts the thread's premise - podlink.ai already HAS its curated lego set (the brand-locked ~20-component system + services section library; Tailwind v4, zero runtime deps beyond React/Next). The genuine gap is ~6 structural sections (zig-zag deep-dive, timeline, trust strip, fit-qualifier, upgraded FAQ accordion, step visuals).
RULES: patterns in, dependencies out.
- COPY structure + accessibility patterns from MIT sources, re-implement in our tokens: ui.shadcn.com (a11y/ARIA reference), transitions.dev FREE tier (CSS-only micro-transitions - its grid-rows accordion is the FAQ pattern; respects reduced-motion), magicui.design (static marketing blocks only).
- ZERO new runtime deps (Motion/Radix/etc.) without founder sign-off - most libraries in the thread are Motion-dependent, and the visual spec allows motion only where it demonstrates product.
- Restyle 100 percent to tokens (Poppins, orange-CTA-only, ink-on-orange contrast law, 8pt, CLS-safe explicit dims). A component that fights the globals gets rebuilt, not patched.
- LICENSE CHECK per source before any code lands (all adopted sources above are MIT/free-tier). PAID sources (shadcnblocks, transitions.dev Pro, Mobbin, aceternity Pro) fall under the standing purchase hold.
- SKIPPED with reasons: aceternity (Motion-heavy neon aesthetic fights the brand) - rareui (novelty decoration) - beautifului.dev + elements.ai-sdk.dev (AI-chat primitives: irrelevant to marketing, NOTED for future app/MCP-side UI) - Mobbin (inspiration subscription, no code, hold).
