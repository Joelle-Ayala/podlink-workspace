# Podlink Voice Guide (v1 — 2026-08-20)
**Status:** BINDING on all audit rewrites and template applications (handoff reading order).
**Sourcing rule:** everything here is mined from project materials — live copy, the personas
doc's verbatims, the evidence brief, spec docs. No invented anecdotes: unsourced war
stories are marked `TODO(voice)` for Joelle's confirmation, not written.

---

## 1. Voice principles (each with a real before/after from this site)

### P1 — Positions, not descriptions
The brand's best copy takes a side. Catalog of earned opinions ALREADY LIVE — extend this
pattern, don't dilute it:
- "switching hosts is not a growth strategy" (homepage)
- "No — and we would talk you out of it." (homepage FAQ, on migrating hosts)
- "the numbers aren't ours to spin" (homepage FAQ)
- "charging you for reading it would be a strange thing to do" (pricing FAQ, on OP3)
- "It is the arithmetic, not a rounded-up percentage" (pricing FAQ, annual billing)
- "a range we haven't landed on rather than a number we're quietly hoping you don't check"
  (pricing FAQ, retired Creator tier — the pattern survives the tier)
- "We will never charge you for the person you're trying to impress" (/studio, client seats)
**Test:** could a competitor paste this sentence on their site without wincing? If yes,
it's a description. Rewrite until it's a position.
BEFORE (generic): "Powerful analytics to grow your show."
AFTER (position): "Your downloads come from OP3, not from us — which means a sponsor can
check the source, and the numbers aren't ours to spin."

### P2 — The honesty register IS the brand's most human trait
Plain statements of what's manual, missing, or not shipped. Already live and working:
- "stock transcription is manual upload today. Say so — the roadmap line turns the
  limitation into anticipation" (drip calendar #5, the governing example)
- "Not self-serve yet — multi-show accounts are being built." (/studio)
- "Straight answer on status:" (/studio) — the phrase itself is reusable.
- Provenance-as-a-feature: contact cards will display WHERE each contact came from
  (contact-discovery spec §8).
**Rule:** when capability copy must hedge, hedge in PLAIN darkness-free language ("today",
"being built", "after launch"), never in vaporware future-perfect ("coming soon to
revolutionize...").

### P3 — War-story specificity (sourced texture, not garnish)
Approved, citable stories — use them where a section needs weight:
- **The manual era behind contact discovery:** "the same method the services team used
  manually for years — look at related shows on Apple → Snov for the emails — now
  productized" (contact-discovery spec §1). Copy form: "We booked podcasts by hand for five
  years. The product is that method, productized."
- **The Chartable gap:** Chartable died December 12, 2024; the replacement market
  fragmented; "link tools measure clicks, prefix tools measure downloads, and nobody
  rejoined them" (pricing-v2 §1b, sourced). Copy form: the seam sentence, near-verbatim.
- **Delivery history:** "since 2021 — for solo creators, funded startups and national
  brands" (live services copy, evidence-gated); 700+ clips across 20+ shows; 68+ episodes
  for a single client; a 17-month continuous ad campaign; 21 verified placements on /work.
- **Demand proof:** 106 booking deals of proven demand (contact-discovery spec §8).
- **Origin story: DELIVERED 2026-09-02** (voice memo → claude/founder-story-raw.md;
  relayed arc filed, VERBATIM transcript still pending attachment). The two narrative
  spines now available: (a) the clips-as-ads flywheel from the Wolf's Den years — clips
  funded growth instead of costing money; PodLink is that playbook productized; (b) the
  Happy Returns booking discovery — bookings drove backlinks/SEO/referrals/demos.
  Texture lines: "I cut sports highlights for Fox before AI could" (paraphrase-grade,
  internships unverified) and "I turned down Andrew Tate" (her first person only, after
  verbatim confirmation). EVERY factual claim gates through founder-story-raw.md §2
  before public use — the Oracle-NetSuite-sponsor claim especially (do NOT conflate with
  the dead "Oracle 3x" case-study claim).
- `TODO(voice):` client emails / voice-of-customer threads — still open (her tap).

### P4 — Proprietary data as voice
Numbers ARE the register. The download-percentile benchmark (26/72/231/539/3,062 —
source verification pending, see ingestion spec gate), real placement counts, "which
shows, specifically" answered with actual show names. When a section can speak in a
number we own, it should. (This is also why case-study numbers display HUGE — template law.)

### P5 — Their words, not ours
Voice-of-customer verbatims are load-bearing (personas doc, real threads):
- "grow name recognition and establish thought leadership" (P1)
- "which shows, specifically, could you actually book us on?" (P1, lost deal)
- "share any trend data such as downloads per month... to justify the increase" (P3)
- "just trying to get everything on paper so I can start planning" (P2)
- "content creators spend more time writing descriptions, show notes, and social posts
  than actually creating content" (S1 market pain)
- "can become generic if you don't make templates that fit your branding" (S2 churn quote)
**Words to use** (personas §3): thought leadership · name recognition · worthwhile · prove
· in my voice · downloads per month · which shows specifically.

---

## 2. Onlyness list (claims true ONLY of Podlink — each evidence-gated)
| Claim | Gate/source | Usable now? |
|---|---|---|
| Free download analytics from an independent, checkable source (OP3) on every tier | competitor sweep in pricing-v2 (nobody bundles it) | YES |
| Analytics + link page + content kit in one subscription (the consolidation) | pricing-v2 §1b: "not one content tool bundles analytics, a link page, or attribution" | YES |
| "We'd talk you out of switching hosts" — an anti-migration vendor | live copy; structurally true (RSS-only) | YES |
| Clicks and downloads rejoined (the loop) | open seam since Chartable's death — but UNSHIPPED | FUTURE-TENSE ONLY |
| Clip selection informed by your own analytics | Podlink-only edge per spec — UNSHIPPED | FUTURE-TENSE ONLY |
| "You don't need 20,000 downloads to be sponsorable — you need the right audience, proven" | personas §2 monetization-lockout, sourced | YES (services side) |
| "The podcast analytics connector" (category-position claim) | mcp-growth-research-podlink.md §3: hosting/editing MCPs exist (Descript, Transistor, Riverside, Castmagic, Springcast) but nobody owns analytics; re-verify competitors on claim day | YES, scoped to analytics |
| ~~First podcast MCP~~ — RETIRED 2026-08-27 | falsified: Springcast claims "first podcast platform with MCP"; Transistor/Descript/Riverside/Castmagic shipped. Only the directory-scoped form ("first podcast [analytics] connector in the Claude directory") remains possible, verify on listing day | RETIRED (unscoped form) |
| "Talk to your podcast, not just your analytics" — your show's transcripts + analytics + voice, queryable from your own Claude | MCP v1.1 transcript tools (PODLINK-MCP-SCOPING.md amendment) — UNSHIPPED | FUTURE-TENSE ONLY |

## 3. Banned phrases & patterns
**Words:** seamlessly · streamline · unlock · supercharge · revolutionize · game-changing ·
empower · elevate · effortless(ly) · "powerful" as a bare adjective · "AI-powered" as a
selling point (S5's verbatim churn review: "The promise 'AI' in their name is only
propaganda") · synergy-anything · reach multipliers (CVS lesson, personas §3).
**Patterns:**
- Symmetrical listicle rhythm (three perfectly parallel benefit bullets that say nothing).
- Benefit adjectives without a mechanism ("better insights" — better HOW, from WHERE).
- Feature sentences with no persona in them (violates the audit's three-beat test).
- Claiming the user's results as ours (attribution honesty — Elmo rule).
- Fake urgency, fake scarcity, countdown anything.

## 4. Rules for numbers
1. Specific beats round: "$70K in new MRR within 90 days", "68+ episodes", "17 months" —
   never "tens of thousands" or "countless".
2. Every number carries a source that exists in the evidence brief or a spec doc. No
   source = no number (the CVS 66% lesson).
3. NO rounding up. "20+ shows" only if the count ≥ 20, not 18.
4. Percentiles/benchmarks state their universe ("among OP3-measured shows") — mandatory.
5. Prices are exact and match the canon ladder ($29, $232, $99, $990) — and the "2 months
   free"/"4 months free" phrasing is literal arithmetic, stated as such.

## 5. Objection → USP map (the bridges rewrites must walk)
| Persona objection (verbatim) | USP that answers it |
|---|---|
| "can become generic..." / "will this sound like me" (S2) | Templates + brand voice: "quotes what you actually said" |
| "another subscription" (S1, $1–25/mo ceiling) | Consolidation: replaces ~$48 of link page + repurposer |
| "do I have to move hosts" (S1/S2) | Keep-your-host, RSS-only — "we'd talk you out of it" |
| "share trend data... to justify the increase" (P3/S4) | OP3 independence — checkable source, not our counter |
| "which shows, specifically" (P1) | Named placements, /work directory, 17 case studies |
| "pay based on results?" (P1) | Pay-per-booking pricing, stated up front |
| "we'll hire in-house" (P2 deferral) | Nurture tone: "when you're ready" — never argue |
| Agency distrust / price (services) | Evidence-brief numbers + attribution honesty as trust |

## 6. Open TODOs
- `TODO(voice)`: 3–5 samples of Joelle's own client-facing writing (emails/proposals) to
  calibrate the founder register — she pastes, we extract patterns; nothing invented.
- `TODO(voice)`: percentile-table source verification (shared gate with ingestion spec).
- `TODO(voice)`: confirm the "five years" delivery span phrasing against the evidence
  brief's date range (Canva job numbers run Dec 2021–Sep 2023; "since 2021" is the safe form).

## 7. Founder texture in PRODUCT copy (added 2026-09-02, from the origin story)
Where the brand voice may borrow from the founder story — sparingly, as origin
notes rather than autobiography:
- **War stories as feature origin notes.** One line per surface, max: the clips
  feature can carry "the moment is found by judgment — our founder cut sports
  highlights by hand before AI could" ONCE the internship facts clear §-gates
  (founder-story-raw.md §2). Never more than one war story per page.
- **The flywheel as product thesis.** "Clips funded the show's growth instead of
  costing money — that loop is what this productizes" is now canon for
  why-Podlink surfaces (verified against the shows' public existence; revenue
  numbers stay OUT).
- **The by-hand register.** "Built from five years of doing this by hand" family
  of phrasings — already P3 canon ("booked podcasts by hand… productized"),
  now extended to clips and measurement.

## 8. DIVERGENCE RULES — founder voice vs brand voice (binding on future sessions)
Two registers, deliberately different. See claude/founder-voice-guide.md for hers.
| | Founder voice (her feed) | Brand voice (podlink.ai, product, docs) |
|---|---|---|
| Person | First person singular, "I/my" | "We/Podlink"; never fake-first-person for her |
| Opinions | Allowed — judgments, asides, "I turned down X" | Not allowed — evidence-gated claims only |
| Numbers | Plot points in stories; same verification gates | Proof displayed HUGE; sourced; universe stated |
| Casing/typos | Lowercase/casual OK on X | House style always |
| Belfort era | Her call per surface (founder-voice Q1) | Referenced obliquely if at all; never in headlines |
| CTAs | DM-register asks, comment gates | Start free / Book a call, orange-CTA law |
| Who writes | Drafts for HER edit; she sends everything | Ships through the audit/sign-off process |
NEVER blur them: no first-person-Joelle sentences in site copy; no
product-voice hedging flattening her feed. A post that quotes the site, or a
page that quotes her, does so with attribution, not by voice-mixing.

