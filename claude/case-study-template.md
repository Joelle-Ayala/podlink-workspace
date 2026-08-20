# Case-Study Page Template (v1 — 2026-08-20)
**Status:** stack approved for drafting. **Applies to:** all 18 live case studies (17
clearance-visible). The proof engine — same lens as feature/services templates.

## Stack
1. **Outcome headline** — THE verified number in the headline (e.g. "$70K in new MRR within
   90 days"). Number source = proof.ts headline, which is evidence-brief-gated already.
2. **Client/show context strip** — show/brand name, industry, service lines used (badges).
3. **Challenge** — what wasn't working, persona language, 2–3 sentences.
4. **What Podlink did** — ATTRIBUTION-HONEST per standing rules. Elmo: paid growth,
   newsletter, SEO/AEO, sponsor ops — never the in-house editor's clips, never the 1M-like
   clip. Every case: only the services actually delivered (proof.ts `services` array).
5. **Results** — numbers displayed HUGE (visual = the number, per services template). ONLY
   figures from proof.ts metrics / the evidence brief. Excluded figures stay excluded (CVS
   66%-family, MDS 50%-conversion — retired per inline notes).
6. **Pull quote** — from testimonials[] if one is cleared for this client; omit otherwise.
7. **Service-line badge → /services/{slug}** — the reverse link of the services template §5.
8. **Related case studies** — 2–3, same service line, clearance-gated.
9. **CTA** — book a call (/contact). Case-study readers are high-ticket intent; this surface
   keeps Book a call primary (consistent with the nav-flip rationale).

## Visual spec
Inherit v1.1 globals. Number-first design: results section = big-number cards, no imagery
required; context strip low-height; pull quote as a single card (services-template §7 style).

## Application rule
Apply across all 18; **flag any study that cannot fill the template honestly** (no verified
number for the headline, no attributable "what we did") → it drops to a placement listing on
/work instead of a case study. Candidates to watch: outcomes-only CVS (headline must stay
outcomes-only), anything currently `needs-verification`.
