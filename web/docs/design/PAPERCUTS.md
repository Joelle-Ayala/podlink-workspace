# Papercuts & Design Debt Register

Single intake. Score = user impact (1-3) + conversion impact (1-3) + frequency (1-3) −
effort (1-3). High scores graduate into implementation briefs. Sourced from the 09-18
builder QA pass, BRAND.md §6 audit, claims-truth audit, and the 09-20 design-org audit.

| # | Item | Where | Impact | Conv | Freq | Effort | Score | Status |
|---|---|---|---|---|---|---|---|---|
| P-01 | Hero ships skeleton placeholder, not a real screenshot | / (hero) | 3 | 3 | 3 | 2 | 7 | Blocked on B4 demo data → brief 2 |
| P-02 | "AI podcast clip generator" card present-tense for unshipped capability | / promotion band + feature page | 3 | 2 | 3 | 1 | 7 | Brief 1 (with queued feature-page fixes) |
| P-03 | No default OG image; favicon set incomplete (BRAND.md §5) | all shared links | 2 | 3 | 3 | 2 | 6 | Brief 1 + auto-OG spike (brief 2) |
| P-04 | Footer wordmark "PodLink" vs header "Podlink" | SiteFooter | 2 | 1 | 3 | 1 | 5 | Brief 1 |
| P-05 | SITE.description / footer tagline still AI-show-notes-first | lib/site.ts | 2 | 2 | 3 | 1 | 6 | Brief 1 (copy via voice-guide) |
| P-06 | App dashboard = stock MagicAI chrome (post-signup cliff) | app.podlink.ai | 3 | 3 | 3 | 3 | 6 | NEXT → app shell tokens phase 1 |
| P-07 | services/index.tsx parallel component system (26KB) | components/services | 2 | 1 | 2 | 3 | 2 | NEXT → convergence brief |
| P-08 | Purple remnants in magicai marketing blades (BRAND.md §6 list) | magicai blades | 1 | 1 | 1 | 2 | 1 | LATER; most traffic now on web/ |
| P-09 | podlink.fm visually unreconciled (Presence) | biolink | 2 | 1 | 2 | 3 | 2 | LATER |
| P-10 | Ink-band mobile type ramp could tighten | / ink bands @≤390px | 1 | 1 | 2 | 1 | 3 | With next screenshot review |
| P-11 | Footer link groups 3-wide wrap on mobile — verify | SiteFooter @375 | 1 | 1 | 2 | 1 | 3 | Verify in next QA pass |
| P-12 | /analyze: feeds without itunes:image render plain (no artwork state) | /analyze | 1 | 1 | 1 | 1 | 2 | Backlog |
| P-13 | Sticky-header logo SVG illegible variant + font-dependent wordmark | magicai assets (BRAND.md §5 defects) | 2 | 1 | 2 | 1 | 4 | Brief 1 asset check (outlined SVGs exist in brand/) |
