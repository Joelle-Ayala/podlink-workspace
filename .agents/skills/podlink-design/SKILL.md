---
name: podlink-design
description: Design and review Podlink marketing, product, analytics, creator-presence and conversion UI using the repository's product truth, BRAND.md, web/DESIGN.md, existing components, reference research, visual QA and mandatory subtraction.
---

# Podlink design skill

Use this skill for substantial UI/UX changes in Podlink.

## Mandatory reading

Before designing or materially changing UI:

1. Read `/BRAND.md`.
2. Read `/web/DESIGN.md`.
3. Read the relevant product truth/spec/canon for the feature.
4. Inspect the current implementation and reusable components.
5. Read the relevant reference file(s) in this skill.

Do not design from vendor feature lists. Do not claim roadmap functionality as shipped.

## Core sequence

Follow this order:

**product truth → design context → references → design direction → implementation → visual QA → subtraction/refinement**

Skipping directly to components is a failure of the process.

## Step 1 — State the job

Before code, write a short working brief:

- surface/page,
- audience/user,
- primary job,
- one belief or outcome the surface must establish,
- primary action,
- shipped product facts being represented,
- constraints/unknowns.

For an existing page, also state what should stay.

## Step 2 — Inspect, don't replace

Inspect:

- `web/src/components`,
- current route/page,
- current content source,
- relevant MagicAI/BioLink product UI if the marketing surface represents it.

Prefer adapting the current system to replacing it.

A new library or primitive requires a real missing capability.

## Step 3 — Reference research

For major marketing/features, collect 3–5 references.

For each, record:

- reference,
- what problem it solves,
- what Podlink borrows,
- what Podlink explicitly does not borrow.

Never copy a site's palette, entire layout or component language.

Read `references/reference-research.md`.

## Step 4 — Choose the grammar

Choose a grammar from `web/DESIGN.md`:

- Editorial Argument,
- Product Reveal,
- Working Surface,
- Proof Story,
- Conversion Utility,
- Product Workspace.

State why it fits. Do not default to alternating bands + card grids.

For a major acquisition page, name:

- the visual peak,
- whether there is a signature interaction,
- mobile composition differences.

## Step 5 — Implement within Podlink

Rules:

- existing semantic tokens first,
- existing core components first,
- real product/media first,
- one primary CTA per decision region,
- no invented metrics,
- no fake dashboards in launch-quality UI,
- no generic AI aesthetic,
- no duplicate foundational design system without explicit reason.

Read the relevant references:

- marketing: `references/marketing.md`
- product: `references/product-ui.md`
- analytics: `references/analytics.md`
- creator presence: `references/biolink.md`
- conversion/services: `references/conversion.md`
- motion: `references/motion.md`

## Step 6 — Visual QA

Compilation is not completion.

Run/review the actual surface with realistic content.

At minimum inspect:

- desktop ~1440px,
- tablet ~834px,
- mobile ~390px,
- 360px when layout risk is meaningful.

Review the entire page/screen, not only the edited component.

Check:

- hierarchy,
- rhythm,
- overflow,
- screenshot readability,
- CTA competition,
- nav/footer transitions,
- interaction,
- focus,
- reduced motion if relevant.

Read `references/qa.md`.

## Step 7 — Mandatory subtraction

Before declaring done, explicitly ask:

- Can a border disappear?
- Can a card disappear?
- Can two sections merge?
- Does this icon add information?
- Is the badge necessary?
- Can the copy be shorter?
- Is hierarchy coming from type/layout before boxes?
- Did we invent a new pattern unnecessarily?
- Is the primary action obvious in ~2 seconds?
- Are adjacent compositions needlessly repetitive?
- Does motion explain something?

Record what was removed or why no further subtraction was appropriate.

Read `references/anti-patterns.md`.

## Third-party skills/libraries

Never blindly install or execute third-party design skills.

Before adoption:

1. inspect instructions,
2. inspect scripts,
3. inspect environment access,
4. inspect network/upload behavior,
5. inspect shell/filesystem scope,
6. run SkillSpector or equivalent when practical,
7. adopt only the trusted subset needed.

ScrollCraft is **opt-in for premium acquisition surfaces**, not a dashboard default. Its principles may be used without its engine/scripts.

## Deliverable report

A substantial design PR/report should include:

- job and grammar,
- product truth used,
- references + borrow/not-borrow notes,
- files/components changed,
- new patterns introduced (if any) and why,
- desktop/mobile QA evidence,
- subtraction results,
- accessibility/performance notes,
- intentionally deferred items.

## Non-negotiable identity

Podlink should increasingly feel like **one operating system for understanding, growing, creating from and monetizing a podcast/creator brand**.

The user should not be able to tell which capability originated in MagicAI, BioLink or OP3 from the visual experience.
