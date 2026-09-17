# Podlink Design Operating System

**Status:** visual/product design source of truth for `web/` and the progressive reskin of Podlink product surfaces.

**Read with:** `BRAND.md` + the product/claims source relevant to the feature being changed.

`BRAND.md` defines identity primitives, measured accessibility decisions, and historical implementation rationale. **This document defines how Podlink should feel, how design decisions are made now, and how agents turn product truth into coherent UI.** Where legacy implementation notes in `BRAND.md` conflict with the current Next.js marketing app, the current `web/` implementation wins unless an explicit migration plan says otherwise.

---

## 0. The design process

For meaningful UI work, follow this order:

**product truth → design context → references → design direction → implementation → visual QA → subtraction/refinement**

Do not begin by choosing components. Do not begin by searching for a template. Do not begin by adding animation.

Before implementation, answer:

1. What capability is actually shipped?
2. What must the visitor/user understand or do?
3. Which existing Podlink patterns already solve part of this?
4. What 3–5 references are useful, and **what specifically are we borrowing from each?**
5. Which page/surface grammar fits the job?
6. What is the single most important visual or action?

After implementation, perform visual QA and a mandatory subtraction pass.

---

## 1. What Podlink should feel like

### Design thesis

**Editorial creator studio + analytical clarity.**

Podlink combines the warmth and personality of creator media with the precision and trust of analytics software.

It should not feel like:

- a generic AI generator,
- an enterprise BI suite,
- a neon creator toy,
- a template marketplace,
- or three acquired products visibly stitched together.

The ideal feeling is **confident, useful, media-native, precise, and human**.

### The tension that makes the brand useful

Creator surfaces should feel rich with real media: artwork, episodes, people, transcripts, video and clips.

Intelligence surfaces should feel calm and exact: metrics, sources, comparisons, trends, reports and provenance.

**Real media supplies warmth. Analytics supplies precision. Orange connects the system.**

### The conceptual center: the Episode

Podlink should increasingly organize itself around an episode rather than vendor modules.

A user should think:

> Here is my episode. What happened? What can I create from it? Where did it travel? What should I do next?

Not:

> Here is the MagicAI tool. Here is the BioLink tool. Here is OP3.

The Episode is the bridge across Analytics, AI creation, distribution and presence.

---

## 2. The four product families

Podlink is one product with four related modes.

### Intelligence

Analytics, Show Report, True Audience, audience demographics, trends, sponsor-facing reporting.

**Visual signature:** precision, hierarchy, provenance, restrained density.

### Create

Transcripts, show notes, content kits, future clip workflows and AI-assisted creation.

**Visual signature:** episode media + editorial workspace + source-grounded output.

### Distribute

YouTube and future social publishing/analytics, derivative assets and channel performance.

**Visual signature:** assets moving outward from an episode; channels are destinations, not separate products.

### Presence

`podlink.fm`, creator/show profile, links, page activity and public-facing identity.

**Visual signature:** creator-first publication surface with restrained Podlink chrome.

All four must share typography, spacing, orange action language, source/status patterns, navigation behavior and the episode model.

---

## 3. Relationship to `BRAND.md`

### Keep from `BRAND.md`

The following are strong constraints and remain binding unless intentionally revised:

- orange/ink identity,
- measured contrast rules,
- semantic color roles,
- Poppins and loaded weight constraints,
- focus treatment,
- reduced-motion support,
- touch-target expectations,
- screenshot framing principles,
- typography measure,
- accessible primary-button contrast.

### What this document changes

`BRAND.md` historically prescribed a fairly fixed marketing rhythm. That solved inconsistency but can make every page converge on the same SaaS skeleton.

**This document replaces fixed page sequence with page grammars.**

Components remain reusable. Composition should vary according to the job.

---

## 4. Typography and information hierarchy

Typography should carry more hierarchy than boxes.

### Principles

- Use the existing Poppins family unless a future identity project deliberately changes it.
- Do not invent weights outside the loaded set.
- Keep headings concise enough to work as layout, not just copy.
- Cap paragraph measure. Long text stretched across a container is not premium.
- Large type earns space; do not surround every large statement with a card.
- Use eyebrow/badge treatment only when the label genuinely helps orientation.

### Hierarchy rule

Before adding a border, background or container, try to solve the hierarchy with:

1. size,
2. weight,
3. spacing,
4. alignment,
5. contrast,
6. then container styling.

---

## 5. Color roles

Use semantic tokens from the current frontend wherever possible. Do not reintroduce one-off hex values when a semantic role exists.

### Orange

Orange is an **action and signal color**, not a default decoration color.

Use it for:

- the primary action,
- selected/active states,
- meaningful chart emphasis,
- source/status highlights,
- a controlled visual focal point.

Do not use orange simply because an empty area needs interest.

### Ink

Ink provides seriousness, contrast and visual peaks. Use it deliberately rather than turning every other section dark.

### Surface variation

A change in background should communicate a change in mode or emphasis. Alternating backgrounds by section number is not a design strategy.

---

## 6. Spacing, radius, borders and depth

### Spacing

Podlink should feel composed, not packed and not artificially spacious.

- Marketing gets larger narrative spacing.
- Product UI is denser and more operational.
- Analytics uses proximity to show relationships.
- Mobile spacing is re-authored, not merely reduced.

### Radius

Use the existing radius family. Do not make every rectangle equally rounded.

A rounded container should mean the content behaves as an object, surface or interactive region.

### Borders

A border is not the default way to make information visible.

Prefer whitespace, alignment and background change first. Use borders for actual boundaries, comparison regions, inputs and interactive objects.

### Shadows

Shadows establish elevation, not decoration. Avoid stacking shadowed cards inside shadowed frames.

---

## 7. Page grammars

A page grammar is the structural logic of a page. Choose it before composing sections.

### A. Editorial Argument

**Use for:** homepage, positioning pages, category narratives.

Pattern:

claim → tension → evidence → product turn → proof → action

Good when the visitor must change how they think before they care about the feature.

### B. Product Reveal

**Use for:** Analytics, True Audience, Show Report, major feature launches.

Pattern:

outcome → real product visual → explanation → workflow → deeper product proof → action

The product itself is the main artwork.

### C. Working Surface

**Use for:** `/analyze`, calculators, free tools, interactive utilities.

Pattern:

minimal promise → useful input/action almost immediately → result → contextual expansion

Do not bury a working tool beneath a long marketing story.

### D. Proof Story

**Use for:** case studies, work, placements.

Pattern:

outcome → real media → context → process → evidence → related work/action

Use real client/show artifacts as the visual system.

### E. Conversion Utility

**Use for:** service pages, founders, PR partners, high-intent ICP pages.

Pattern:

problem → qualification → offer/process → proof → commercial detail → action

These pages can be more direct and information-dense than the homepage.

### F. Product Workspace

**Use for:** dashboard and application screens.

Pattern:

context → primary task/data → secondary task/data → contextual actions

Avoid marketing-style sectioning inside the app.

### Rule

Do not choose a grammar because another page used it. Choose it because it matches the visitor's job.

---

## 8. Marketing-site philosophy

The marketing site should demonstrate the product rather than describe a hypothetical product.

### Product truth first

Real shipped capability outranks conceptual roadmap breadth.

If the product cannot survive a screenshot, it is not ready to be a hero claim.

### Real media is the artwork

Prefer:

- real Podlink screens,
- real episodes,
- real artwork,
- real transcripts,
- real placement media,
- real reports,
- cleared proof.

Avoid fake dashboard numbers and decorative pseudo-UI.

### One visual peak

Important acquisition pages should have one engineered visual peak: the moment the user should remember.

Examples:

- homepage: unified episode intelligence / Show Report,
- True Audience: audio + video becoming one episode view,
- BioLink showcase: creator presence moving from fragmented links to a coherent public identity.

The rest of the page should create contrast around that peak rather than competing with it.

### Signature interaction

Major acquisition pages may have **one** purposeful signature interaction when it helps the story. It must be specific to the page and remain understandable with reduced motion.

Do not turn normal feature pages into immersive scroll experiences by default.

---

## 9. Application/dashboard philosophy

The dashboard is a working environment, not a landing page.

### Priorities

1. current state,
2. primary action,
3. important exceptions/setup requirements,
4. comparison/trend,
5. secondary detail.

### Prefer regions over card piles

Do not make every metric, state or action a separate rounded card.

Use cards when the data is an independent object or module. Use open layout regions when information belongs together.

### Progressive disclosure

Show what is needed for the current state. Setup steps should disappear as they are completed.

### Provenance

Where trust matters, show where the number came from:

- OP3,
- YouTube,
- Podlink page,
- future connected social source.

Source is a product feature, not legal fine print.

---

## 10. Analytics and chart philosophy

Charts answer questions. They do not decorate dashboards.

### Hierarchy

Do not give equal visual weight to every metric.

A useful analytics surface generally has:

- one primary question/metric,
- one comparison or trend,
- supporting breakdowns,
- source/context.

### Choose visualization by question

- change over time → line/area,
- distribution/share → bar or ranked list,
- conversion stages → funnel,
- movement/flow → flow/Sankey only when it genuinely clarifies,
- single value → number with context, not a chart.

### Comparison requires context

Whenever possible, numbers should answer “compared with what?”

Examples:

- previous episode,
- rolling show baseline,
- prior period,
- channel mix,
- historical range.

### Color

Use orange for the focal series/action, not every series. Supporting series should be neutral unless color has semantic meaning.

### Empty and immature data

Do not fake completeness. Small/new shows should get useful setup/context rather than invented benchmarks.

---

## 11. Episode and transcript experiences

Episode pages should become a central working object across Podlink.

A strong episode surface can progressively contain:

- episode identity/artwork,
- audio/download performance,
- YouTube/video relationship,
- transcript,
- derived assets/content,
- distribution state,
- report/share state.

Keep the episode recognizable as one object as features expand.

Transcript UI should feel editorial: readable measure, source/time anchors, useful selection/actions. Do not present a transcript as a giant generic text area.

---

## 12. AI interactions

AI is a capability, not the visual brand.

### Rules

- Do not use purple/blue AI gradients to announce intelligence.
- Ground generated content in the episode/transcript whenever possible.
- Make source context visible when it improves trust.
- Prefer useful actions (“Draft show notes”, “Find clips”, “Ask this episode”) over generic “AI” labels.
- Avoid anthropomorphic decoration unless it has a product function.

### Chat/assistant surfaces

Conversation UI should emphasize the user's question and grounded result, not a chatbot mascot.

---

## 13. BioLink / creator presence

The public creator/show page should feel authored by the creator, not generated by Podlink.

### Principles

- Creator/show identity first.
- Episode art and media provide personality.
- Podlink chrome remains restrained.
- The editor and public page should clearly belong to the same Podlink ecosystem as analytics.
- Avoid turning every link into a heavy card unless the content warrants it.

The Presence module is part of Podlink, not a visibly separate BioLink product.

---

## 14. Navigation

Navigation should make the product legible without exposing implementation history.

### Marketing nav

- Self-serve product action remains globally prominent.
- High-ticket booking/service actions stay contextual.
- Dropdowns should describe jobs/outcomes, not vendor modules.
- Active state must not rely on color alone.

### Product nav

As Podlink grows, organize around user jobs and objects rather than upstream MagicAI module names.

---

## 15. CTA hierarchy

There should be one obvious primary action in roughly two seconds.

### Rules

- One primary orange action per viewport/decision region.
- Secondary actions are visually subordinate.
- CTA labels should describe the next step (“Analyze your podcast”) rather than generic intent (“Get started”) when possible.
- Services pages may use human/contact CTAs; self-serve product pages should usually lead into the product.
- Do not repeat the exact same CTA block after every section.

---

## 16. Product screenshots and demos

The existing `ScreenshotFrame` treatment is the baseline frame, not permission to use fake UI.

### Real screenshot rules

- Use real product state and realistic data.
- Crop to the decision the visitor needs to understand.
- Keep UI readable at the rendered size.
- Use one consistent frame treatment.
- No perspective tilt, device mockup or baked shadow.
- Captions explain what matters, not “screenshot of dashboard.”
- Do not put screenshots on noisy gradients.

### Placeholder rule

Decorative skeleton placeholders are acceptable only during implementation. They are not launch-quality product marketing.

### Demos

Short purposeful screen recordings can be more effective than complex animation when the workflow is the proof.

---

## 17. Motion

Motion explains hierarchy, state or story.

### Good uses

- state transitions,
- expanding/collapsing detail,
- showing an episode flowing into connected channels,
- revealing a comparison,
- one signature acquisition-page interaction.

### Bad uses

- floating because the page feels static,
- endless parallax,
- animating every card,
- hover movement that harms scanning,
- scroll effects that obscure content.

Every meaningful motion must have a reduced-motion outcome that still preserves the hierarchy/story.

---

## 18. Mobile art direction

Mobile is a separate composition, not the desktop page at 40% width.

For meaningful marketing changes, explicitly decide:

- screenshot crop,
- content order,
- whether visual and copy swap order,
- CTA stacking,
- which decorative/motion layers disappear,
- chart simplification,
- touch interaction.

Do not preserve desktop density simply because the components technically wrap.

---

## 19. Accessibility

Accessibility is part of the visual system.

Required:

- measured color contrast,
- visible focus,
- semantic heading order,
- keyboard-usable navigation and controls,
- minimum practical touch targets,
- no state communicated by color alone,
- reduced-motion support,
- meaningful alt text for product/media imagery,
- labels/help/errors for inputs.

Do not trade these away for a reference-site effect.

---

## 20. Reference-driven design

For major pages/features, collect **3–5 references before design**.

Sources may include Refero, Landdding, Godly, Awwwards and strong creator/analytics SaaS products.

For each reference record:

- URL/product,
- the problem it solves,
- what Podlink is borrowing,
- what Podlink is explicitly not borrowing.

Useful borrowing categories:

- hierarchy,
- product presentation,
- information architecture,
- interaction,
- typography,
- section composition,
- analytics visualization,
- responsive behavior.

**Never write “inspired by X” without saying what that means.**

References are evidence, not templates.

---

## 21. Component reuse rules

Existing Podlink components are the foundation.

### Before creating a new component

1. Inspect existing `web/src/components`.
2. Ask whether composition/variant solves it.
3. If not, define the missing semantic responsibility.
4. Create the smallest reusable primitive that solves the real gap.

### Anti-drift rule

Do not maintain parallel versions of foundational primitives (Section, Button, eyebrow, color constants, spacing systems) for separate areas of the marketing site unless there is a documented reason.

The services component layer should progressively converge on the core component/tokens rather than becoming a second permanent design system.

---

## 22. Anti-patterns / refuse list

Podlink should not default to:

- purple/blue “AI” gradients,
- gradient text everywhere,
- meaningless glow effects,
- endless rounded cards,
- card-grid after card-grid,
- excessive pills/badges,
- borders around every grouping,
- fake dashboards,
- invented numbers,
- decorative AI sparkles,
- six interchangeable SaaS sections,
- generic “unlock the power of AI” copy,
- animation simply because animation exists,
- components copied wholesale from a library without adapting to Podlink.

A polished generic SaaS site is still generic.

---

## 23. Scroll-driven experiences

Scroll-driven/cinematic treatment is **opt-in**, primarily for acquisition surfaces.

Potential fits:

- homepage narrative,
- True Audience launch,
- major feature reveal,
- BioLink showcase.

Usually wrong for:

- analytics tables,
- settings,
- account screens,
- ordinary dashboard navigation,
- routine service pages.

Use the useful principles from ScrollCraft—page grammar, feeling curve, visual peak, signature move, mobile art direction, visual verification—without assuming its engine or generated-world workflow belongs in Podlink.

Third-party executable skills must pass the security rule in §27 before adoption.

---

## 24. Visual QA loop

“Build passes” is not design QA.

For meaningful design changes:

1. run the actual site,
2. use realistic product content/data,
3. capture desktop,
4. capture tablet/mobile,
5. inspect the full page/screen,
6. identify composition, hierarchy, overflow, rhythm and interaction problems,
7. iterate,
8. repeat until coherent.

Recommended baseline viewports:

- desktop: 1440px,
- tablet: ~834px,
- mobile: 390px,
- optionally narrow mobile: 360px for risky layouts.

Save review artifacts outside production assets unless intentionally curated.

Visual QA should include reduced-motion when motion changed.

---

## 25. Mandatory subtraction pass

Before finishing a page/screen, explicitly ask:

- Can a border disappear?
- Can a card disappear?
- Can two sections become one?
- Does this icon add information?
- Is this badge necessary?
- Can the copy be shorter?
- Is hierarchy coming from type/layout rather than boxes?
- Did we introduce a new pattern when an existing component would work?
- Is the most important action obvious in roughly two seconds?
- Are two adjacent sections using the same composition without a reason?
- Does motion explain something, or is it decoration?
- Does the page feel designed as one system rather than section-by-section?

Record what was removed or why nothing could be removed.

---

## 26. Good Podlink UI

Examples of behavior that fit the system:

- a real Show Report as the central homepage visual,
- a trend chart with OP3 visibly named as its source,
- episode artwork next to performance and transcript state,
- one orange primary action on a calm neutral/ink composition,
- a case study led by a playable/real media artifact,
- an analyzer page that lets the visitor analyze before reading a long pitch,
- mobile screenshots cropped for mobile rather than shrunk desktop screens,
- source-grounded AI actions named by outcome.

---

## 27. Bad Podlink UI

Examples that violate the system:

- three rows of identical rounded feature cards,
- fake analytics with invented growth percentages,
- a glowing purple AI orb behind the hero,
- every section switching surface color on a preset rhythm,
- six badges before the first product screenshot,
- services pages using a separate hardcoded palette/component system forever,
- “AI-powered” used as the main reason to care,
- a dashboard full of equal-weight stat cards with no analytical question,
- full-screen scroll theatrics inside settings or analytics tables.

---

## 28. Third-party libraries and skills

Default: **evaluate before adopting**.

Useful resources may include:

- Vercel Web Interface Guidelines,
- Vercel React best practices,
- Anthropic frontend-design,
- ScrollCraft,
- Motion Primitives,
- Tremor,
- shadcn,
- Coss,
- Refero.

None supersedes this document.

### Library test

Adopt only if it:

1. fills a real missing capability,
2. can be themed into Podlink without visible library fingerprints,
3. does not duplicate a good existing component,
4. has acceptable accessibility/performance behavior,
5. does not materially increase maintenance for a decorative effect.

### Skill security test

Before copying/executing a third-party agent skill:

- inspect instructions and scripts,
- inspect environment-variable access,
- inspect network/upload behavior,
- inspect shell/file-system permissions,
- use a security scanner such as NVIDIA SkillSpector where practical,
- copy only the subset we actually trust and need.

Do not give random repositories broad agent/tool permissions by default.

---

## 29. Shipping checklist

Before a major UI PR is ready:

### Truth
- [ ] Feature claims match deployed capability.
- [ ] No invented data/proof.
- [ ] Roadmap language is clearly future tense.

### System
- [ ] Read `BRAND.md` and this file.
- [ ] Reused core components/tokens where sensible.
- [ ] Any new pattern has a documented reason.

### References
- [ ] 3–5 references reviewed for major work.
- [ ] Borrow/not-borrow decisions recorded.

### Responsive/accessibility
- [ ] Desktop reviewed.
- [ ] Tablet/mobile reviewed.
- [ ] Keyboard/focus checked.
- [ ] Reduced motion checked when relevant.
- [ ] No color-only state.

### Refinement
- [ ] Subtraction pass completed.
- [ ] Real product/media used instead of fake UI where possible.
- [ ] Primary action is immediately legible.
- [ ] The whole page/screen feels like one composition.

---

## 30. Current priorities

Design work should currently prioritize:

1. design governance and visual QA tooling,
2. convergence of duplicate frontend primitives,
3. a real product screenshot/demo library,
4. homepage as an editorial/product argument rather than a SaaS component stack,
5. Analytics / Show Report / Episode coherence,
6. Presence/BioLink coherence,
7. highest-value feature pages,
8. pricing only after product/billing truth is final.

**Do not use design-system work as an excuse to delay shipping useful product. The system exists to make future execution faster and more coherent.**
