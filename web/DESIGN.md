# Podlink Web Design OS (v1 — 2026-09-18)

Scope: **web/** (podlink.ai, Next.js 16 + Tailwind 4). Complements the root
`BRAND.md` (which governs the magicai app side and owns the brand *values*:
color ramps, type ramp, logo art). This file governs how those values are
*used* on the marketing site so later UI work doesn't drift. It is a working
document — it never blocks shipping; when reality and this doc disagree, ship,
then amend the doc in the same PR.

Positioning it serves (locked 09-18): analytics-first, premium creator SaaS.
The site sells *independently measured numbers + the shareable Show Report +
ask-your-podcast* — not "AI podcast tools."

## 1. Sources of truth
- Tokens/colors/type: Tailwind theme + `src/components/*` (Badge/Button/
  Section encode the accessible pairings — e.g. eyebrow orange-700 on 12%
  tint, 4.33:1; never re-derive by eye; reuse the component).
- Copy voice: `claude/voice-guide.md` (+ founder divergence rules §7–8).
- Claims: only shipped-true statements; assistant claims say "Claude or any
  MCP-capable assistant" (ChatGPT by name only after user-verified).
- Proof: `content/proof.ts` + `placements.ts` selectors ONLY (clearance-gated,
  computed counts). Never hand-typed numbers or logos.

## 2. Layout grammar (the part that keeps pages coherent)
- A page is a stack of `<Section>` bands. Tone sequence rule (Section.tsx):
  ink hero → light → alt → light → ink → light → CTA; **never two `alt` in a
  row; at most two `ink` bands per page**; `accent` is the sparing highlight
  (one per page, e.g. homepage proof band).
- One idea per band. A band earns its place by advancing the argument
  (pain → proof → how → objection → ask); if two bands say the same thing,
  delete one — that's the standing **subtraction pass**.
- Type: component defaults only (Heading levels, Prose). No ad-hoc font sizes
  outside the existing text-* steps already in use.
- Width: SectionHead/narrow containers as components provide; body prose
  ≤ ~65ch.

## 3. Component inventory (use these; don't fork)
`@/components`: Badge, Button (primary/secondary/ghost, onInk), CtaBand, Faq,
FeatureCard, Grid, Hero, Heading, Prose, ScreenshotFrame, Section,
SectionHead. `@/components/services`: Section(dark)/Eyebrow/CtaButton/
TrustStrip/ProcessSteps/FromPriceCard/PricingTable/ProofSection(huge numbers)/
PlacementsStrip/FaqList/ClosingCta — the services/case-study/ICP visual
system. New need → extend a component with a prop, not a one-off div soup.

## 4. Imagery & anti-slop rules
- NO fake dashboards, invented charts, or stock "AI" imagery. A screenshot is
  a real screenshot (ScreenshotFrame) of the shipped product, or nothing —
  typography-first bands are the house style and are fine.
- NO gradient washes as decoration; color arrives via tokens/accent only.
- Numbers rendered HUGE are always real (proof.ts metrics / computed counts).
- Show artwork/embeds only where cleared (proof clearance gates).

## 5. Buttons & CTAs
- One primary CTA per band. Current funnel (09-18): primary = "Analyze your
  podcast" (/analyze) on awareness surfaces; register stays primary on
  /pricing and feature-detail bottoms. Book-a-call is primary on services/
  case-study/ICP surfaces.
- Button component only — variants encode contrast math (incl. onInk).

## 6. Motion
- Existing micro-motion only (Button hover translate, motion-reduce honored).
- Scroll/story experiments: MARKETING PAGES ONLY, behind a deliberate PR —
  the dashboard is never ScrollCraft (standing rule).

## 7. SEO/meta invariants
- Every page: pageMetadata() with canonical path; JSON-LD via existing seo.ts
  helpers only. Sitemap discipline: noindex pages stay out (pricing until
  flip). FAQ markup only where FAQs render visibly.

## 8. QA checklist (run per shipped page)
1. Desktop + 375px mobile screenshot pass (no overflow, tap targets ≥44px).
2. Tone-sequence rule holds; ≤1 accent band; ≤2 ink bands.
3. Subtraction: could any card/border/band be removed without losing the
   argument? Remove it.
4. Claims: every number traces to proof.ts/placements.ts; assistant phrasing
   per §1; no "Minting House" in user-facing copy.
5. Links resolve (anchors included); primary CTA correct per §5.
6. Build green on Vercel AND deployment exists for the pushed sha.

## 9. Known gaps (noted 09-18, not blocking)
- No real product screenshots on the site yet (blocked on demo data, tap B4);
  ScreenshotFrame placeholder caption still ships on the homepage hero.
- /pricing visual pass pending the B5 flip; /analyze has no artwork state for
  feeds without itunes:image (renders fine, just plain).
- Dark("ink")-band type ramp on mobile could tighten (audit when screenshots
  are reviewed); footer link groups now 3-wide on mobile — verify wrap.
