# Podlink Design Organization + Frontend Audit (§47)

**Date:** 2026-09-20 · **Author:** Head of Design session (Claude, design org charter §47)
**Status:** AUDIT — not a redesign. No product code touched. One working-tree change
(web/src/app/pricing/page.tsx, $19→$29 metadata) was found uncommitted and left untouched —
it awaits Joelle's pricing confirmation per SESSION_LOG 09-18.
**Inputs:** BRAND.md, web/DESIGN.md v1, web/src (full), claude/ canon (voice-guide,
copy-audit-brief, feature-claims-truth-audit, SESSION_LOG, launch docs), PR #2 branch
(full diff), live podlink.ai (desktop + 375px), builder 09-18 QA pass for /pricing + /analyze.

---

## A. Current design state

**Architecture — three frontends, three maturity levels:**
1. `web/` (podlink.ai) — Next.js 16 / React 19 / Tailwind 4. Modern, healthy. Tokens ported
   faithfully from BRAND.md into `@theme` (globals.css) with the contrast math preserved in
   comments. Content-as-data (`content/*.ts`) with clearance-gated proof (`proof.ts`,
   `placements.ts`) — claims are structurally gated, not just policed. Zero UI dependencies
   beyond React/Tailwind/fonts. This leanness is an asset.
2. `magicai/` (app.podlink.ai) — Laravel/Blade. `podlink-tokens.css` loads but the dashboard
   is still stock Tabler/MagicAI chrome; marketing blades retain the purple remnants BRAND.md
   §6 catalogs (largely superseded by web/ for acquisition traffic, but the logged-in product
   does not yet look like the brand the marketing site promises).
3. `biolink/` (podlink.fm) — PHP, own theme system. Visually unreconciled with Podlink;
   the future "Presence" family. Not deeply audited this pass.

**Visual language:** orange/ink with *measured* accessibility decisions (ink-on-orange primary
8.20:1; orange-700 text on light 4.81:1; orange-600 focus). BRAND.md is unusually rigorous
for a company at this stage — the math is a durable competitive discipline, keep it law.

**Component maturity (web/):** small coherent core — Section/SectionHead, Hero, Button,
Badge, Heading, Prose, Grid, Container, FeatureCard/FeatureBlock, ScreenshotFrame, CtaBand,
Faq, PriceCard, ComparisonTable, SiteHeader/Footer, Logo, Icon. A11y is designed-in
(aria-labelledby wiring, one focus policy, reduced-motion, no color-only states).
`components/services/index.tsx` (26KB) is a second, parallel visual system — known,
documented in DESIGN.md v1 §3, and the main internal drift source.

**Strongest patterns:** token discipline + contrast math; Section band grammar encoded in the
component; clearance-gated proof/claims; typography-first bands (house style); honest empty
states in app analytics (waiting-for-prefix, ok/reconnect/no_data); self-appearing sparkline
at ≥7 snapshots; the shipping QA rule "a Vercel deployment must exist for the pushed sha."

**Weakest areas:** the post-signup cliff (app looks stock-MagicAI); no real product
screenshots anywhere (homepage hero ships a stylized skeleton that brushes against our own
no-fake-dashboards law); front-door "AI podcast clip generator" card vs claims matrix row 8
(NOT SHIPPED); footer identity nits (PodLink/Podlink casing, stale AI-first tagline);
no default OG image or favicon set (BRAND.md §5 — every shared link previews imageless,
which is lethal for a product whose flagship artifact is a *shareable* report);
services parallel system; biolink unreconciled.

## B. What should stay

- The token system and every measured contrast rule. Non-negotiable.
- The core `web/src/components` set — reuse → improve → extend, never replace.
- Content-as-data + clearance gates (proof.ts / placements.ts). This is the design-side
  enforcement of the claims-truth law and it works.
- The band-rhythm default and Section component; typography-first bands as house style.
- claude/voice-guide.md as copy law (integrate, never fork).
- The analytics honesty patterns in the app (empty/reconnect states, self-appearing charts).
- The QA verification rules from DESIGN.md v1 §8, including the Vercel-sha rule.
- No SaaS starter, no template import, no wholesale library adoption. Current web/ has zero
  extra UI deps; keep that bar high.

## C. Top design problems (ranked: user impact × conversion × coherence × severity)

1. **Marketing/product appearance gap.** podlink.ai promises a premium analytics product;
   app.podlink.ai renders stock MagicAI chrome. Every trial signup crosses this cliff.
   Largest coherence + trust problem in the system.
2. **No real product screenshots.** The product is invisible on its own site; the hero
   placeholder is fake-UI-adjacent. Blocked on B4 demo data — highest-leverage unblock.
3. **Homepage clips card** ("AI podcast clip generator … a week of things to post") is
   present-tense for a NOT-SHIPPED capability (claims matrix row 8). Front-door truth risk;
   feature-page body fixes were queued but the homepage card itself needs the same pass.
4. **Missing OG/social image + favicon set.** Spec already written (BRAND.md §5). The Show
   Report loop depends on links that unfurl well.
5. **Footer identity nits:** "PodLink" casing vs header "Podlink"; SITE.description still
   AI-show-notes-first vs the locked analytics-first positioning.
6. **Services/case-study parallel component layer** — second design system by inertia.
7. **biolink/podlink.fm** visually a different company (Presence family unreconciled).
8. **magicai marketing blades** still purple where they surface (and product emails likely
   stock — unaudited; flag for later).
9. **/pricing visual pass** pending B5 flip; pricing truth ($19 vs $29) unresolved — with an
   uncommitted working-tree edit sitting on main. Needs Joelle's word, then one clean pass.
10. Minor (09-18 QA): ink-band mobile type ramp could tighten; footer link-group wrap.

## D. Design-system drift risks

- **Four product families, three codebases:** analytics (OP3-derived), creation (MagicAI
  Blade UI), presence (BioLink themes), video analytics (app pages). Without one constitution
  + one owner, each ships its own patterns. This role + one DESIGN.md is the mitigation.
- **Two DESIGN.mds:** main's v1 and PR #2's — competing sources of truth is an explicit §46
  violation. Resolved by the adjudication below; must not persist past this week.
- **Services layer** hardening into a permanent second system (rule: converge, PR #2 §21).
- **Future social/distribution surfaces** arriving as bolt-ons — feature intake questions
  (charter §32) must run before any new surface gets pixels.
- **Two AI builders** (Claude builder + ChatGPT/Codex) both emitting design guidance.
  Direction now flows through Head of Design; builders implement from briefs.

## E. Proposed DESIGN.md (adjudication of PR #2 included)

**Verdict on PR #2 `design/podlink-operating-system`: ADOPT WITH AMENDMENTS, via a
reconciliation commit — do not merge the branch as-is.**

Why: the PR's 847-line DESIGN.md is genuinely good — the design-process order, "editorial
creator studio + analytical clarity" thesis, the Episode as conceptual center, four product
families, page grammars, analytics/AI/presence philosophy, and the anti-pattern list are
exactly the constitution layer the charter asks for. But (a) it and main's v1 both create
`web/DESIGN.md`, so the branch merge-conflicts with what shipped 09-18; (b) v1 carries
operational law the PR lacks (sources-of-truth pointers, claims phrasing, current funnel CTA
truth, the shipped QA checklist incl. the Vercel-sha rule, known-gaps register); (c) one
real philosophical conflict needs a ruling; (d) its precedence line ("web/ implementation
wins over BRAND.md") is too broad.

**Rulings:**
1. *Band rhythm vs page grammars:* both. The v1 tone-sequence rule stays as the **default
   grammar** (it's encoded in Section.tsx and prevents drift); PR #2's six page grammars
   govern **deliberate deviation** — a page may leave the default only by naming its grammar
   in the PR, which makes it an L3 surface review. "Alternating bands by section number is
   not a design strategy" is accepted as critique of *mindless* alternation, not license to
   improvise every page.
2. *Precedence (replaces the PR's line):* product truth / claims matrix → BRAND.md **values**
   (color math, ramps, type constraints, logo) → DESIGN.md (usage, process, grammars) →
   skill references → external guidance. BRAND.md remains authoritative for magicai-side
   implementation; where BRAND.md's *web-specific* implementation notes are stale, DESIGN.md
   supersedes explicitly, case by case.
3. *Tokens/components win* (v1 §1–3) is retained verbatim.
4. The PR's §30 priorities merge with the NOW/NEXT/LATER list in §K below.

**Mechanics:** produce DESIGN.md v2 = PR #2 spine + v1 operational layer folded in as binding
appendix; cherry-pick `.agents/skills/podlink-design/` from the branch with the amendments in
§F; close PR #2 as "adopted via reconciliation commit <sha>," crediting the Codex side.
Because this establishes the design constitution, it is **L4 — awaiting Joelle's explicit
approval before the reconciliation commit lands.**

**DESIGN.md v2 structure:** thesis & feel → precedence/sources of truth → four families +
the Episode → layout grammar (default sequence + six grammars) → type/color/space usage
(values live in BRAND.md) → components & reuse/anti-drift → imagery & screenshot law →
CTA hierarchy → motion → analytics language → AI interaction → presence → mobile art
direction → accessibility → visual QA + shipping checklist → anti-patterns → operational
appendix (funnel truth, SEO invariants, known gaps) → priorities.

## F. Podlink design skill

Adopt PR #2's `.agents/skills/podlink-design/` (SKILL.md + references/: marketing,
product-ui, analytics, biolink, conversion, motion, qa, reference-research, anti-patterns)
— the structure matches charter §10. Amendments before adoption:
- precedence clause per §E ruling 2;
- add mandatory pointers: `claude/feature-claims-truth-audit.md` (feature tense law),
  `claude/voice-guide.md` (copy law), "no Minting House in user-facing copy";
- add the review-level ladder (L1–L4) with explicit L4 = Joelle;
- add "tokens/components win" and the Vercel-sha verification rule to the QA step;
- add the standing security rule: skills that execute code are software; inspect before use.
Engineering agents consume it via the mandatory-reading list in SKILL.md; briefs reference
the relevant references/ file instead of restating guidance.

## G. Documentation structure (minimum useful, no bureaucracy)

`web/docs/design/` (this commit seeds it):
- `AUDIT-2026-09-design-org.md` — this file.
- `DECISIONS.md` — dated log: decision, context, alternatives, rationale, reversibility.
- `PAPERCUTS.md` — single intake + scored register (impact × frequency × effort). One file,
  not two; a papercut that scores big graduates into a brief, not a second backlog.
- `REFERENCES.md` — created when the first real reference study happens (rule: source, URL,
  date, what's excellent, what we refuse to copy, transferable principle). Not seeded empty.
- `DESIGN-REVIEWS/` — dated screenshot sets for surface reviews (before/proposed/final).
- `COMPONENT-INVENTORY.md` — deferred until the services-convergence brief, where it earns
  its keep; DESIGN.md §3 serves as the inventory today.
MOTION.md / ANALYTICS.md stay as DESIGN.md sections until their content outgrows them.

## H. Specialist organization

Confirm the six functions as **review lenses I apply or invoke, not standing sub-teams**:
F1 Product/Design-systems — every L2 component change. F2 Brand/Web art direction — L3
acquisition surfaces. F3 Analytics/DataViz — any chart, report, or metric surface. F4
Motion/Creative tech — launch surfaces only. F5 UX QA/A11y/Regression — every ship (the
checklist is the invocation). F6 Reference research — major surfaces, 2–5 references,
principles not collages. No function produces artifacts for its own sake.

## I. Skill/tool evaluation (vendor purchase HOLD respected throughout)

| Tool | Verdict | Why |
|---|---|---|
| Anthropic frontend-design | Reference only | Taste layer; Podlink skill + BRAND/DESIGN outrank (charter §20). |
| Vercel web-design-guidelines | Adopt as QA reference | Free, license-clean checklist; feeds F5. |
| react-best-practices / next-dev-loop | Reference, builder's domain | Engineering quality; route via builder briefs, not design. |
| no-ai-slop | Reference only | voice-guide.md already is our copy law; borrow tests, don't fork law. |
| ScrollCraft | Defer | Evaluate only when a flagship launch page is scheduled; never dashboards (standing rule). Security-inspect first. |
| Refero / Landdding / Godly / 21st.dev | Reference sources | F6 inputs; no installs, no purchases; free tiers only under HOLD. |
| SkillSpector | Test at first need | Run against any third-party executable skill before adoption; nothing to install today. |

## J. UI/resource evaluation

| Resource | Verdict | Why |
|---|---|---|
| shadcn / Coss | Skip for web/ now | Marketing site needs no primitive it doesn't have; revisit only if the app grows React surfaces needing a11y-heavy primitives (charter §15). |
| Tremor / Mono Charts / OpenPanel / Dub | Study as analytics-language references | App is Blade today; these inform our analytics direction (§N), not our dependency tree. Tremor (MIT) is the candidate if React analytics islands ever exist. |
| Motion Primitives / beUI / Magic UI / Kinetics | Reference only | Current motion = tokened CSS micro-motion; no animation library without a missing-capability case. |
| 21st.dev / VibeUI etc. | Catalogs | Selection order stands: existing → improve → extend → adapt approved primitive → create. |

Principle: `web/` ships zero third-party UI packages today. Every adoption must name the
missing capability, pass license/a11y/perf checks, and be themable without library
fingerprints.

## K. Top 10 frontend improvements

**NOW** (small, high trust/conversion ROI):
1. Real screenshot pipeline: unblock B4 demo data → replace hero skeleton with a real Show
   Report/episode workspace shot in ScreenshotFrame. (Top single lever on the site.)
2. Homepage clips-card truth fix — reword to shipped truth (paste-an-episode framing) in the
   same pass as the queued feature-page bodies.
3. Footer casing "Podlink" + SITE.description rewritten analytics-first.
4. Default OG image + favicon/app-icon set per BRAND.md §5 spec (wire $ogImage default).
5. Design canon merge: DESIGN.md v2 + skill adoption (pending L4 approval, §E).
**NEXT:**
6. App shell reskin phase 1 — apply podlink tokens to dashboard chrome (nav, sidebar,
   buttons, cards) to soften the post-signup cliff. Scoped brief; not a full redesign.
7. Services layer convergence onto core components (kill the parallel system gradually).
8. /pricing visual + copy pass when B5 pricing is confirmed by Joelle.
9. Analytics language v1 in-app: provenance labels ("Measured by OP3"), comparison context,
   episode-page hierarchy pass.
**LATER:**
10. Presence reconciliation (podlink.fm public pages + editor) and, once real screenshots
    and the creation leg exist, the homepage signature peak (§L/M).

## L. Signature concept: **the Show Report is the brand**

One recurring visual object across the whole loop: the live Show Report rendered in a
distinctive report-card language — ink field, orange focal data, provenance line, share
affordance. It appears as: the homepage hero (real data), auto-generated per-report OG
images (1200×630 straight from report data — which also solves §C-4 for the surfaces that
matter most), share cards, and the in-app report surface. Honest (only real numbers),
differentiated (nobody in podcasting has a beautiful shareable analytics artifact), and it
makes the product loop visible: understand → create → distribute (share the report / the
podlink.fm page) → measure. Reuses the existing /report/[hash] surface; no new product scope.

## M. Homepage storytelling concept — evaluation

The loop story (show → unified analytics → insight → AI creation → distribution → feedback)
is the right **product** story and the wrong **homepage** story *today*: the creation and
distribution legs are PARTIAL/NOT SHIPPED per the claims matrix. Verdict: keep the
analytics-first homepage (PR #1 direction is correct). Adopt the loop narrative in stages as
legs ship — analytics + report peak now; creation leg when episode persistence/auto
transcription is real; the full cinematic loop is a LATER launch-page candidate (ScrollCraft
evaluation point). We do not build the story on unshipped legs.

## N. Analytics direction principles

Provenance-first: the source (OP3, YouTube, Podlink page) is named at the point of the
number — trust is the product. One question per surface; one focal metric, one comparison,
supporting breakdowns. Comparison context by default (previous episode / rolling baseline /
prior period). Orange marks the focal series only; supporting series neutral. Honest states
are first-class (keep the app's existing patterns). Tabular figures for numbers; magnitude
formatting. Charts self-appear when data earns them (≥7-point sparkline rule is the
precedent). No chart walls, no default-library aesthetics, no 3D, nothing unlabeled.
The Show Report is the flagship artifact every analytics decision serves.

## O. Visual QA process

Per shipped surface: DESIGN.md checklist + breakpoints 1440 / 834 / 390 (+360 for risky
layouts) with real content; focus, contrast, reduced-motion, no color-only state; tap
targets ≥44px; subtraction pass recorded. Artifacts: dated screenshot sets in
`web/docs/design/DESIGN-REVIEWS/` (before/proposed/final for L3+). Regression set (manual
until tooling earns itself): /, /pricing, /analyze, /report/[hash]; add dashboard, episode
page, biolink editor/public when reskinned. Approval ladder: L1 ship / L2 design-system
review / L3 Head of Design / L4 Joelle. Keep the Vercel-sha deployment check.

## P. Maintenance process

PAPERCUTS.md is the single intake; scored impact × frequency × effort; high scores become
briefs. Monthly product-wide drift review (coherence, mobile, stale screenshots, terminology,
marketing/product mismatch). DESIGN.md amended in the same PR as the reality it describes
(v1 law, retained). Feature intake questions (charter §32) run before any new surface is
designed. Competitive scan quarterly (Riverside, Descript, Spotify for Creators, Transistor,
Linktree/Beacons, modern analytics SaaS) — output is transferable lessons in REFERENCES.md,
never mimicry. No redesigns to generate activity.

## Q. Implementation sequence for engineering

1. **Truth + identity batch** (one brief): clips-card and feature-page tense fixes; footer
   casing + tagline; default OG image + favicon set (BRAND.md §5 spec, assets to be supplied);
   — small diffs, immediate trust/conversion payoff.
2. **Screenshot pipeline**: B4 demo data, capture per ScreenshotFrame spec (1440 @2x, no
   chrome), replace hero placeholder; spike per-report auto-OG (§L).
3. **Convergence phase**: services layer onto core components; /pricing pass at B5;
   app shell tokens phase 1 (§K-6). Each gets its own implementation brief with acceptance
   criteria; engineering raises constraints per charter §31.

---

## Needs Joelle (L4 / decisions)

1. **PR #2 verdict — approve to execute:** adopt-with-amendments via reconciliation commit
   (DESIGN.md v2 + amended skill), then close PR #2 crediting the Codex side. (§E/§F.)
2. **Signature direction:** Show Report as the recurring brand artifact incl. auto-OG (§L).
3. **Homepage:** confirm staying analytics-first; loop story staged as legs ship (§M).
4. Standing items she already owns, reiterated: repo still PUBLIC (builder red flag);
   pricing $19→$29 confirmation (uncommitted edit on main awaits her word).
