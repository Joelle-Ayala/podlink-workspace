# Services Page Template (v1 — Joelle's 11-section stack, 2026-08-20)
**Status:** DRAFT stack approved for drafting; Joelle may still tweak.
**Applies to:** all 6 /services/* pages (editing, clips, advertising, sponsorship, booking,
growth). Services are REVENUE-PRIMARY per the sitemap plan — this application sequences
AHEAD of the feature-page rebuild in the queued build/audit motion.
**Relationship to what exists:** the merged bundle's pages already implement part of this
(ServiceHero, IncludesList, ProcessSteps, PricingTable, ProofSection, FaqList,
RelatedServices, ClosingCta in `components/services/index.tsx`). Application = extend the
`Service` type + section library to close the gaps (trust strip, fit qualifier, why-Podlink,
DIY cross-link), not rebuild from scratch.

## Canon this template answers to
- `claude/pricing-sla-decision-sheet.md` — the RESOLVED 08-19 services prices ("from" values
  live in services.ts). `TODO(sla)` turnaround numbers remain TODO until Joelle signs off.
- `claude/podlink-services-evidence-brief.md` + `proof.ts` clearance gates — every number,
  logo, show name. §1 trust-strip figures ("27 clients", "since 2021") ship ONLY if the
  evidence brief backs them; otherwise use the defensible subset already in services.ts.
- `claude/podlink-sitemap-ia-plan.md` §4 — service-intent titles/H1s UNTOUCHED; the
  tool-vs-service split is preserved in BOTH directions (§10 cross-links).
- Standing rules: no unshipped-capability claims in §8; attribution honesty (Elmo); no
  Minting House.

## The section stack (in order)
0. **Hero** — outcome headline in done-for-you language; subhead names the persona + core
   deliverable; primary CTA "Book a call" (/contact), secondary "See the work" (/work or
   case-studies filtered to this service); results visual or work montage — `TODO(asset)`
   placeholder if none.
1. **Trust strip** — client shows/logos from `visibleShows()`/`visibleBrands()` + one
   track-record line. Defensible numbers only, evidence-gated.
2. **Problem framing** — the DIY pain, in persona language (S4/S5 services buyers per
   buyer-personas-messaging.md).
3. **What you get** — scope card: concrete deliverables per engagement. High-ticket buyers
   need scope before they book; be specific (counts, formats, cadence) where services.ts
   already states them.
4. **How the engagement works** — numbered TIMELINE: call → proposal → onboarding →
   delivery cadence. (ProcessSteps exists; restyle as timeline.)
5. **Case-study proof** — 1–2 cards, the verified number displayed HUGE, linked to the full
   case studies badged to this service line (`caseStudiesFor(slug)` — clearance-gated).
6. **Fit qualifier** — two-column "for you / not for you". Honest lead qualification; saying
   who we're wrong for is part of the trust argument.
7. **Pricing** — "from" price prominent + what moves it (per the resolved decision sheet).
   `TODO(sla)` stays TODO until sign-off. Never a full tier table.
8. **Why Podlink** — the hybrid differentiator: the services run on the platform's own
   data/tooling (OP3 analytics, transcripts, the workspace). Present-tense claims ONLY for
   what exists; the loop/report language stays future-tense with roadmap link.
9. **FAQ** — objection-focused (contracts, SLAs, asset ownership, cancellation), 4–6
   questions, FAQPage JSON-LD, answers in-DOM when collapsed.
10. **Related services + DIY cross-link** — RelatedServices (exists) PLUS one explicit
    cross-link to the matching /features page ("rather do it yourself? [feature]") — the §4
    intent separation, maintained in both directions.
11. **Final CTA band** — book-the-call, reassurance line made only of claims true per docs
    (e.g. "no retainer lock-in" ONLY if the decision sheet says so).

## Visual spec
Inherit ALL v1.1 feature-template globals (claude/feature-page-template.md): 8pt rhythm,
~65ch text width, orange for CTAs only, ink-on-orange contrast law, zero CLS (explicit
dimensions), lazy-load below-fold, prefers-reduced-motion, Poppins/tokens.
Service-page differences:
- Case-study number displayed HUGE on proof cards (the number is the visual).
- Process (§4) rendered as a timeline, not step columns.
- Pricing (§7) as a "from"-price card with inclusions list.
- Fit qualifier (§6) as a true two-column layout (stacked on mobile).

## Application order (revenue-primary sequencing)
sponsorship → advertising → editing → clips → booking → growth. (Sponsorship/advertising
carry the largest verified numbers and the decision-sheet's freshest pricing; growth last —
its 31M-views figure needs an evidence-brief recheck before it gets the HUGE treatment.)
Then the 8 feature pages per feature-page-template.md.

## Asset placeholder inventory (fill as created)
| Service | Hero asset | Proof-card imagery |
|---|---|---|
| all 6 | TODO(asset) montage/results visual | number-led, no image required |
