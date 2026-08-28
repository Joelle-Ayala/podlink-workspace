# SEO/AEO Plan + GSC Scoreboard (founder-directed, 2026-08-27)
**Sources:** Joelle's GSC 7-day export analysis (relayed 08-27) + keyword-strategy
directive (same day). No invented volume numbers — GSC impressions are the only
demand data in this doc. This is the existing build plan with a scoreboard, not
new scope.

## 1. GSC baseline (7 days ending ~08-26 — seed-stage, direction over magnitude)
- 154 impressions, 1 click; impressions climbing daily since indexing began
  (1→15→32→48→58 Aug 22–26). Momentum is real.
- Branded: "podlink" 71 impressions at position 6.04; homepage at 8.34 — NOT #1
  for its own brand name.
- Non-branded target queries appearing exactly as intent-mapped, but deep:
  podcast analytics dashboard #57 · ai show notes #83 · ai podcast clip
  generator #92 · podcast clipping agency #96 · newsletter podcast #61.
- Mobile position 5.24 vs desktop 37.87. app.podlink.ai/login ranking at 3.8.
- "what does it cost?" got an impression at POSITION 1 while /pricing is
  noindex — identify the matching page in next week's pull (page-level GSC
  view); confirms pricing intent is finding us before the flip. Flip is
  sequenced: 3/5 checklist conditions now cleared (pricing-page-template.md).

## 2. Brand SERP fix (priority 1)
- **pod.link collision (assess realistically):** Linkfire's pod.link is an
  established podcast link service. A meaningful share of the 71 "podlink"
  impressions are probably ITS brand queries; position ~6 against an
  entrenched same-name incumbent in the same vertical is the hard problem, not
  a technical bug. Expectation-set accordingly; the fix is entity
  consolidation + time + branded volume, not a quick win.
- Organization + WebSite JSON-LD: ALREADY SHIPPED on the homepage (lib/seo.ts
  organizationLd/webSiteLd, emitted in page.tsx). No SearchAction claimed (no
  site search — correct). Remaining: keep og/site naming consistent
  ("Podlink" everywhere, one casing) and strengthen internal linking so
  Google consolidates the entity (see §3 anchors).

## 3. Keyword clusters (priority order) — tracked separately in the weekly pull
**Cluster A — MCP (TOP priority; land-grab, zero competition, AEO=SEO):**
"podcast MCP" · "podcast MCP server" · "connect podcast to Claude" · "connect
podcast to ChatGPT" · "Claude podcast analytics" · "podcast analytics
connector" · "MCP for podcasters" · "talk to your podcast". These get asked
INSIDE assistants — AEO surfaces (llms.txt, step-by-step docs) matter as much
as rankings. Assets: /claude landing page (research pattern) · /features/mcp
index flip the moment the server ships to users · llms.txt (SHIPPED 08-27) ·
setup-docs page written to rank (step-by-step = snippet gold) · "best MCP
servers" roundups + awesome-MCP list submissions (free, submission-based) ·
launch numbers post. CLAIMS: future-tense/directory-scoped per voice-guide
until listings are live — but setup/docs CONTENT publishes at deploy time
regardless of directory review.
**Cluster B — podcast-AI volume layer (rides the template rebuilds):**
ai show notes generator · ai podcast clip generator · podcast analytics
dashboard · podcast newsletter generator · ai transcription for podcasts, etc.
Mechanism: template rebuilds with question-phrased H2s + FAQ schema. RULE:
each feature page's FAQ must include the exact query phrasings GSC shows
impressions for (start with §1's five).
**Cluster C — services/done-for-you (per the tool-vs-services §4 split):**
podcast editing service · podcast booking agency · podcast clipping agency
(already impressing at #96) · podcast sponsorship sales. Rides the services
template application (task #18), entity density on /work + case studies.

## 4. Capitalization sequence (no new scope)
Already-committed motion, now keyword-sequenced: services template application
(6 pages) → features template application (8 pages, question H2s + FAQ schema
+ Cluster B phrasings) → case-study/work entity density → homepage internal
links to feature pages with keyword-intent anchors (Cluster B anchor text).
MCP cluster assets ride the submission-prep work (setup docs, /claude page).

## 5. Weekly GSC pull (ops cadence — the scoreboard)
Weekly, from the verified Search Console property (podlink.ai + podlink.fm):
queries + pages + positions, broken out by cluster A/B/C + branded. Track:
(a) impressions-by-page against what shipped that week — the measurable form
of the frontend-tracks-backend standing rule; (b) the five §1 deep queries'
positions as template rebuilds land; (c) branded position vs pod.link;
(d) the "what does it cost" page match until /pricing flips. Log one-line
deltas in SESSION_LOG; escalate only on regressions.
