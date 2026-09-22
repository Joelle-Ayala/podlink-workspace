# Podlink Design Operating System (v2 — 2026-09-21)

**Status:** visual/product design source of truth for `web/` (podlink.ai) and the
progressive reskin of Podlink product surfaces.
**Lineage:** reconciliation of DESIGN.md v1 (main, 09-18, Claude builder session) and
PR #2 `design/podlink-operating-system` (ChatGPT/Codex side) — the constitution spine of
this document is the Codex draft, adopted with amendments. Adjudication + rulings:
`web/docs/design/AUDIT-2026-09-design-org.md` §E. Approved by Joelle (L4) 09-21.
**Working document:** it never blocks shipping; when reality and this doc disagree, ship,
then amend the doc in the same PR.

Positioning it serves (locked 09-18): analytics-first, premium creator SaaS. The site sells
*independently measured numbers + the shareable Show Report + ask-your-podcast* — not
"AI podcast tools."

---

## 0. Precedence and sources of truth

When guidance conflicts, this is the order:

1. **Product truth / claims law** — `claude/feature-claims-truth-audit.md` (feature tense),
   only shipped-true statements; assistant claims say "Claude or any MCP-capable assistant"
   (ChatGPT by name only after user-verified); no "Minting House" in user-facing copy.
2. **BRAND.md values** — color ramps + measured contrast math, type constraints (Poppins,
   four loaded weights), logo art, magicai-side implementation. Never re-derive by eye.
3. **This document** — usage, process, grammars, philosophy.
4. **The design skill** (`.agents/skills/podlink-design/`) and its references.
5. External guidance (Anthropic frontend-design, Vercel guidelines, references) — useful,
   always outranked.

Operational sources:
- Tokens/colors/type: Tailwind `@theme` in `globals.css` + `src/components/*` — the
  components encode the accessible pairings (e.g. eyebrow orange-700 on 12% tint, 4.33:1).
  Reuse the component; never re-derive.
- Copy voice: `claude/voice-guide.md` (+ founder divergence rules §7–8).
- Proof: `content/proof.ts` + `placements.ts` selectors ONLY (clearance-gated, computed
  counts). Never hand-typed numbers or logos.
- Where a legacy *web-specific* implementation note in BRAND.md is stale, this file
  supersedes it explicitly, case by case — never silently.

**Tokens/components win.** Where any prose in this file conflicts with the measured token
system or the shipped component contracts, the tokens/components are right.

---

## 1. The design process

For meaningful UI work, follow this order:

**product truth → design context → references → design direction → implementation →
visual QA → subtraction/refinement**

Do not begin by choosing components. Do not begin by searching for a template. Do not begin
by adding animation.

Before implementation, answer: What capability is actually shipped? What must the
visitor/user understand or do? Which existing Podlink patterns already solve part of this?
What 3–5 references are useful, and what specifically are we borrowing from each? Which page
grammar fits the job? What is the single most important visual or action?

After implementation: visual QA (§24) and the mandatory subtraction pass (§25).

---

## 2. What Podlink should feel like

### Design thesis

**Editorial creator studio + analytical clarity.**

Podlink combines the warmth and personality of creator media with the precision and trust of
analytics software.

It should not feel like: a generic AI generator, an enterprise BI suite, a neon creator toy,
a template marketplace, or three acquired products visibly stitched together.

The ideal feeling is **confident, useful, media-native, precise, and human**.

### The tension that makes the brand useful

Creator surfaces should feel rich with real media: artwork, episodes, people, transcripts,
video and clips. Intelligence surfaces should feel calm and exact: metrics, sources,
comparisons, trends, reports and provenance.

**Real media supplies warmth. Analytics supplies precision. Orange connects the system.**

### The conceptual center: the Episode

Podlink should increasingly organize itself around an episode rather than vendor modules.
A user should think: *Here is my episode. What happened? What can I create from it? Where
did it travel? What should I do next?* — never *Here is the MagicAI tool. Here is the
BioLink tool. Here is OP3.*

The Episode is the bridge across Analytics, AI creation, distribution and presence.

---

## 3. The four product families

One product with four related modes. All four share typography, spacing, orange action
language, source/status patterns, navigation behavior and the episode model.

- **Intelligence** — analytics, Show Report, audience, trends, sponsor-facing reporting.
  Visual signature: precision, hierarchy, provenance, restrained density.
- **Create** — transcripts, show notes, content kits, future clip workflows.
  Visual signature: episode media + editorial workspace + source-grounded output.
- **Distribute** — YouTube and future social publishing/analytics, derivative assets.
  Visual signature: assets moving outward from an episode; channels are destinations, not
  separate products.
- **Presence** — podlink.fm, creator/show profile, links, public identity.
  Visual signature: creator-first publication surface with restrained Podlink chrome.

---

## 4. Typography and hierarchy

Typography should carry more hierarchy than boxes.

- Poppins only; only the loaded weights (400/500/600/700 — BRAND.md law).
- Component defaults only (Heading levels, Prose). No ad-hoc font sizes outside the
  existing text-* steps already in use.
- Cap paragraph measure; body prose ≤ ~65ch. Long text stretched across a container is not
  premium.
- Large type earns space; do not surround every large statement with a card.
- Eyebrow/badge only when the label genuinely helps orientation.

**Hierarchy rule:** before adding a border, background or container, try size → weight →
spacing → alignment → contrast → *then* container styling.

---

## 5. Color roles

Use semantic tokens. Never reintroduce one-off hex values when a semantic role exists.

- **Orange is an action and signal color**, not default decoration: the primary action,
  selected/active states, meaningful chart emphasis, source/status highlights, one
  controlled focal point. Never because an empty area needs interest. The contrast math is
  BRAND.md law: fill-only on light; ink-on-orange buttons; orange-700 text on light;
  orange-600 focus.
- **Ink** provides seriousness and visual peaks — deliberately, not every other section.
- **Surface variation communicates a change in mode or emphasis.** The default band
  sequence (§7) is the starting rhythm; alternating backgrounds with no reason is not a
  design strategy.

---

## 6. Space, radius, borders, depth

- Marketing gets larger narrative spacing; product UI is denser and operational; analytics
  uses proximity to show relationships; mobile spacing is re-authored, not merely reduced.
- Radius family per BRAND.md (buttons pill, cards 20px, media 32px, inputs 12px). A rounded
  container should mean the content behaves as an object, surface or interactive region.
- A border is not the default way to make information visible: whitespace, alignment and
  background change first. Borders mark actual boundaries, comparisons, inputs,
  interactive objects.
- Shadows establish elevation, not decoration. No stacking shadowed cards inside shadowed
  frames. One coloured shadow exists (primary button) — nothing else glows.

---

## 7. Layout grammar

### The default band sequence (the standing rule)

A page is a stack of `<Section>` bands. Default tone sequence (encoded in Section.tsx):
**ink hero → light → alt → light → ink → light → CTA**; never two `alt` in a row; at most
two `ink` bands per page; `accent` is the sparing highlight (≤1 per page). One idea per
band; a band earns its place by advancing the argument (pain → proof → how → objection →
ask); if two bands say the same thing, delete one.

### Page grammars (the deliberate-deviation layer)

A page grammar is the structural logic of a page — choose it before composing sections.
**Ruling (09-20):** the band sequence above is the default grammar. A page may leave it only
by naming its grammar in the PR, which makes the change an L3 surface review. Do not choose
a grammar because another page used it; choose it because it matches the visitor's job.

- **A. Editorial Argument** — homepage, positioning, category narratives.
  claim → tension → evidence → product turn → proof → action.
- **B. Product Reveal** — Analytics, Show Report, major feature launches.
  outcome → real product visual → explanation → workflow → deeper proof → action.
  The product itself is the main artwork.
- **C. Working Surface** — /analyze, calculators, free tools.
  minimal promise → useful action almost immediately → result → contextual expansion.
  Never bury a working tool beneath a long marketing story.
- **D. Proof Story** — case studies, work, placements.
  outcome → real media → context → process → evidence → related action.
- **E. Conversion Utility** — services, founders, PR partners, high-intent ICP pages.
  problem → qualification → offer/process → proof → commercial detail → action.
  May be more direct and information-dense than the homepage.
- **F. Product Workspace** — dashboard and application screens.
  context → primary task/data → secondary → contextual actions. No marketing-style
  sectioning inside the app.

---

## 8. Marketing-site philosophy

Demonstrate the product rather than describe a hypothetical one.

- **Product truth first.** If the product cannot survive a screenshot, it is not ready to
  be a hero claim.
- **Real media is the artwork:** real Podlink screens, episodes, artwork, transcripts,
  placement media, reports, cleared proof. NO fake dashboards, invented charts, or stock
  "AI" imagery — a screenshot is a real screenshot (ScreenshotFrame) of the shipped
  product, or nothing; typography-first bands are the house style and are fine.
- **No gradient washes as decoration**; color arrives via tokens/accent only.
- **Numbers rendered HUGE are always real** (proof.ts metrics / computed counts).
- Show artwork/embeds only where cleared (proof clearance gates).
- **One visual peak** per important acquisition page — the moment the user should remember.
  The rest of the page creates contrast around it rather than competing.
- **One signature interaction** at most, page-specific, understandable with reduced motion.

---

## 9. Application/dashboard philosophy

The dashboard is a working environment, not a landing page.

Priorities: current state → primary action → important exceptions/setup → comparison/trend
→ secondary detail. Prefer open layout regions over card piles; cards only when the data is
an independent object or module. Progressive disclosure: setup steps disappear as completed.
**Provenance:** where trust matters, show where the number came from (OP3, YouTube, Podlink
page, connected source). Source is a product feature, not fine print.

---

## 10. Analytics and charts

Charts answer questions. They do not decorate dashboards.

- A useful surface has one primary question/metric, one comparison or trend, supporting
  breakdowns, source/context. Never equal visual weight for every metric.
- Choose by question: change over time → line/area; distribution/share → bar or ranked
  list; stages → funnel; single value → number with context, not a chart; flow diagrams
  only when they genuinely clarify.
- Numbers should answer "compared with what?" (previous episode, rolling show baseline,
  prior period, channel mix, historical range).
- Orange = the focal series only; supporting series neutral unless color has semantic
  meaning.
- Empty/immature data: useful setup/context, never invented benchmarks. Charts self-appear
  when data earns them (the ≥7-point sparkline rule is the precedent).

---

## 11. Episode and transcript experiences

Episode pages become the central working object: identity/artwork, audio/download
performance, video relationship, transcript, derived assets, distribution state,
report/share state — recognizable as one object as features expand. Transcript UI is
editorial: readable measure, source/time anchors, useful selection/actions. Never a giant
generic text area.

---

## 12. AI interactions

AI is a capability, not the visual brand. No purple/blue AI gradients. Ground generated
content in the episode/transcript; make source context visible when it improves trust.
Prefer outcome-named actions ("Draft show notes", "Find clips", "Ask this episode") over
generic "AI" labels. Conversation UI emphasizes the user's question and grounded result,
not a chatbot mascot. Preserve agency: progress, editable output, regeneration, clear
accept/reject points.

---

## 13. Presence (podlink.fm)

The public creator/show page feels authored by the creator, not generated by Podlink.
Creator identity first; episode art and media provide personality; Podlink chrome
restrained; editor and public page visibly belong to the same ecosystem as analytics. Not
every link is a heavy card. Presence is part of Podlink, not a visibly separate BioLink
product.

---

## 14. Navigation

Make the product legible without exposing implementation history. Marketing nav: self-serve
product action globally prominent; high-ticket booking stays contextual; dropdowns describe
jobs/outcomes, not vendor modules; active state never color-alone. Product nav: organize
around user jobs and objects, not upstream MagicAI module names. Primary nav/IA changes are
L4.

---

## 15. CTA hierarchy and funnel truth

One obvious primary action in roughly two seconds. One primary orange action per
viewport/decision region; secondary actions visually subordinate; labels describe the next
step ("Analyze your podcast") over generic intent; don't repeat the same CTA block after
every section. Button component only — variants encode the contrast math (incl. onInk).

**Current funnel truth (09-18):** primary = "Analyze your podcast" (/analyze) on awareness
surfaces; register stays primary on /pricing and feature-detail bottoms; book-a-call is
primary on services/case-study/ICP surfaces. Amend here when the funnel changes.

---

## 16. Product screenshots and demos

ScreenshotFrame is the baseline treatment (spec in BRAND.md: 1440 logical @2x, no chrome,
no baked shadow, caption outside, alt text describes what the screen shows). Real product
state, realistic data; crop to the decision the visitor needs; readable at rendered size;
no tilt/device mockups; never on noisy gradients. Decorative skeleton placeholders are
acceptable only during implementation — not launch-quality marketing. Short purposeful
screen recordings beat complex animation when the workflow is the proof.

---

## 17. Motion

Motion explains hierarchy, state or story: state transitions, expand/collapse, an episode
flowing into channels, revealing a comparison, one signature acquisition-page interaction.
Not: floating because the page feels static, endless parallax, animating every card, hover
movement that harms scanning, scroll effects that obscure content. Every meaningful motion
has a reduced-motion outcome preserving the hierarchy/story. Today's baseline: existing
tokened micro-motion only (Button hover translate, motion-reduce honored). Scroll/story
experiments: marketing pages only, behind a deliberate PR — never the dashboard.

---

## 18. Mobile art direction

Mobile is a separate composition, not the desktop page at 40% width. For meaningful
marketing changes, explicitly decide: screenshot crop, content order, whether visual and
copy swap order, CTA stacking, which decorative/motion layers disappear, chart
simplification, touch interaction. Never preserve desktop density just because components
technically wrap.

---

## 19. Accessibility

Part of the visual system, never traded for a reference-site effect: measured contrast,
visible focus, semantic heading order, keyboard-usable controls, tap targets ≥44px, no
color-only state, reduced-motion support, meaningful alt text, labels/help/errors for
inputs.

---

## 20. Reference-driven design

For major pages/features: 3–5 references before design (Refero, Landdding, Godly, Awwwards,
strong creator/analytics SaaS). For each record: URL/product, the problem it solves, what
Podlink borrows, what Podlink explicitly does not borrow. Never "inspired by X" without
saying what that means. References are evidence, not templates → log durable lessons in
`web/docs/design/REFERENCES.md`.

---

## 21. Component inventory and reuse

`@/components`: Badge, BillingToggle, Button (primary/secondary/ghost, onInk),
ComparisonTable, Container, CtaBand, Faq, FeatureBlock, FeatureCard, Grid, Heading, Hero,
Icon, Logo, PriceCard, Prose, ScreenshotFrame, Section/SectionHead, SiteFooter, SiteHeader.
`@/components/services`: the services/case-study/ICP visual system (Section(dark)/Eyebrow/
CtaButton/TrustStrip/ProcessSteps/FromPriceCard/PricingTable/ProofSection/PlacementsStrip/
FaqList/ClosingCta).

Before creating a component: inspect existing → composition/variant → define the missing
semantic responsibility → smallest reusable primitive. New need → extend a component with a
prop, not one-off div soup.

**Anti-drift rule:** no parallel versions of foundational primitives (Section, Button,
eyebrow, color constants, spacing) without a documented reason. The services layer
progressively converges on the core components rather than becoming a second permanent
design system.

---

## 22. Anti-patterns (refuse list)

Podlink does not default to: purple/blue "AI" gradients; gradient text everywhere;
meaningless glow; endless rounded cards; card-grid after card-grid; excessive pills/badges;
borders around every grouping; fake dashboards; invented numbers; decorative AI sparkles;
six interchangeable SaaS sections; "unlock the power of AI" copy; animation because
animation exists; components copied wholesale without adapting; three rows of identical
feature cards; every section switching surface color with no reason; six badges before the
first product screenshot; "AI-powered" as the main reason to care; equal-weight stat-card
dashboards with no analytical question; scroll theatrics inside settings or tables.
A polished generic SaaS site is still generic. These require a real reason, not a ban —
the reason goes in the PR.

---

## 23. Scroll-driven experiences

Opt-in, acquisition surfaces only (homepage narrative, major launch, BioLink showcase).
Wrong for analytics tables, settings, account screens, dashboards, routine service pages.
Borrow the useful principles (page grammar, feeling curve, visual peak, signature move,
mobile art direction) without assuming any engine belongs in Podlink. Third-party
executable skills pass §27 security review first.

---

## 24. Visual QA + shipping checklist

"Build passes" is not design QA. For meaningful changes: run the actual site with realistic
content; capture desktop 1440, tablet ~834, mobile 390 (+360 for risky layouts); inspect the
whole page, not the edited component; iterate; include reduced-motion when motion changed.
Review artifacts → `web/docs/design/DESIGN-REVIEWS/` (dated; before/proposed/final for L3+).

Per shipped page:
1. Desktop + 375px screenshot pass (no overflow, tap targets ≥44px).
2. Band sequence/grammar holds; ≤1 accent band; ≤2 ink bands (or named grammar in PR).
3. Subtraction pass run (§25).
4. Claims: every number traces to proof.ts/placements.ts; feature tense per claims matrix;
   assistant phrasing per §0; no "Minting House" user-facing.
5. Links resolve (anchors included); primary CTA correct per §15.
6. Keyboard/focus checked; no color-only state; reduced-motion when relevant.
7. Build green on Vercel AND **a deployment exists for the pushed sha**.

Review levels: L1 local (ship) / L2 component (design-system review) / L3 surface (Head of
Design) / L4 system — nav, IA, brand language, global type, major identity/workflow
(explicit Joelle approval, never silent).

---

## 25. Mandatory subtraction pass

Before declaring done: Can a border disappear? A card? Can two sections merge? Does the icon
add information? Is the badge necessary? Can the copy be shorter? Is hierarchy coming from
type/layout before boxes? Did we invent a new pattern when a component exists? Is the primary
action obvious in ~2 seconds? Are adjacent compositions needlessly repetitive? Does motion
explain something? Does the page feel designed as one system? Record what was removed, or
why nothing could be.

---

## 26. SEO/meta invariants

Every page: pageMetadata() with canonical path; JSON-LD via existing seo.ts helpers only.
Sitemap discipline: noindex pages stay out (pricing until the flip). FAQ markup only where
FAQs render visibly.

---

## 27. Third-party libraries and skills

Default: evaluate before adopting; none supersedes this document. Library test: fills a real
missing capability; themable without library fingerprints; doesn't duplicate a good
component; acceptable a11y/perf; maintenance justified. Skill security test: inspect
instructions, scripts, env access, network behavior, shell/filesystem scope; scanner
(SkillSpector or equivalent) when practical; adopt only the trusted subset. Skills that
execute code are software, not prompts. Vendor purchases: HOLD stands — nothing bought
without Joelle's word. Current verdicts: audit §I/§J.

---

## 28. Known gaps (rolling)

- No real product screenshots (blocked on B4 demo data); hero ScreenshotFrame placeholder
  must be replaced with a real shot or dropped (§8 law) — see PAPERCUTS P-01.
- /pricing visual+copy pass pending the B5 flip and pricing confirmation.
- Footer casing + SITE.description tagline; OG/favicon set — in Brief 1.
- Ink-band mobile type ramp; footer wrap check — with next screenshot review.
- App dashboard reskin (tokens phase 1) and services-layer convergence — NEXT queue.

---

## 29. Current priorities

1. Truth + identity batch (Brief 1: clips-card tense, footer casing/tagline, OG/favicon).
2. Real screenshot/demo library (post-B4) + per-report auto-OG spike; homepage peak.
3. Services-layer convergence; /pricing at B5; app shell tokens phase 1.
4. Analytics/Show Report/Episode coherence; Presence coherence after.

**Do not use design-system work as an excuse to delay shipping useful product. The system
exists to make future execution faster and more coherent.**
