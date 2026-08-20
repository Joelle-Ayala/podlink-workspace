# Podlink — GTM Map by Persona & Tier

**Date:** 2026-08-19
**What this is:** one block per buyer. Each block: the approach, the channels
in priority order, why, and the data behind it. Built under Joelle's five
ground rules, stated once here so the blocks stay clean:

1. **Cold email must work, at least at first** — every block has a cold-email
   lane; automation level scales with price.
2. **Content must build authority AND convert** — every content item below is
   tied to a buyer and a next step, not "brand awareness."
3. **Ads wait for traction and revenue** — the ads funnel (plaque/flag) is
   phase 3, funded by margin, not hope.
4. **Fundraising optics matter** — the feature drip (8 announcements, one per
   ~2 weeks, already drafted) makes the company look like it ships
   relentlessly; every block notes what it contributes to the metrics story.
5. **PR is hunted deliberately** — angles listed per block, calendar in §8.

---

## 0. First, the Show Report question — you caught a real flaw

You're right: the Show Report *is* the product, and emailing it as a PDF would
be strange — plus attachments hurt deliverability anyway.

The fix makes it stronger: **the report is never a file. It's a live page that
already exists before we ever email them.** The pipeline pre-generates
`podlink.ai/report/{show}` from public data for every show we're about to
contact. The email is one line:

> *"We ran {Show Name} through Podlink — your report's already live:
> [link]. No signup to view it."*

So the email doesn't describe the product or attach a sample of it — **it
hands over a running instance of it with their name on it.** That's the RB2B
"we already did the work" mechanic. And the conversion is built into the page
itself, because public data can only show half the picture:

- Public half (no login): downloads trend, publishing consistency,
  show-notes audit, sponsorability vs. the 20K-download gate, YouTube presence.
- The locked half (one click to claim): connect YouTube for the merged view,
  tracked links, the episode kit, week-over-week reports.

The page's CTA is "claim your report" — which *is* the free-account signup.
Product = lead magnet = landing page = email payload, one artifact, zero
contradiction. The logged-in product is the same report, alive and growing.

---

## 1. Phase gates (when each channel turns on)

| Phase | Trigger | Channels live |
|---|---|---|
| **Now** | Repo merge + pricing fix | Cold email (services + Studio lanes), drip announcements, Joelle's LinkedIn, /grader + first Index study build |
| **Traction** | Grader live, first paying cohorts | Automated Pro cold email at scale, AEO/citations compounding, connector directory (ships with Pro), PR pushes |
| **Revenue** | Positive unit economics measured | Paid ads via plaque/flag funnels (product margin subsidizes CAC), retargeting, paid amplification of Index studies |

---

## 2. FREE tier — the 28-download solo host (persona S1)

**Approach:** never spend money or human time acquiring them; let tools, data,
and merch bring them in. They are distribution (their public link page), data
(their connected feed), and merch buyers — not subscription revenue.

| Channel | Why | Data |
|---|---|---|
| 1. `/grader` + benchmark pages (SEO) | 72% of podcasters name growth as problem #1; a free grade is irresistible to them | Tools resist AI Overviews (Ahrefs: free-tools pages ~1M visits/mo); HubSpot's grader: 4M grades, 40K backlinks |
| 2. Automated cold email (report-link lane) | They're most of the list; the automated lane costs ~$0.02/send | Median show = 28 downloads/ep; this persona spends $1–25/mo on ALL tools — so no human touch, ever |
| 3. Merch funnels (phase 3) | The plaque/flag buyer IS this persona — identity purchases at $49–129 they'll pay for when they won't pay $29/mo | Music-plaque category: 26K+ Etsy reviews; thank-you page feeds the claimed page + trial |
| Content that converts them | "The 4 hours after every episode" content; the podfade study; benchmark tables ("is 100 downloads good?") | Their verbatim pain: "creators spend more time on show notes than creating" |
| Fundraising optics | The growth number: free accounts + claimed pages = "users" on the deck | Freemium needs volume; this is where volume lives |
| PR angle | The Podfade Curve study ("half of all podcasts stop by episode N") — consumer-press friendly | Nobody has published it |

## 3. PRO $29 — the expert whose show feeds their business (persona S2)

**Approach:** fully automated acquisition end to end. The report page sells,
the reverse trial converts, lifecycle email closes. A human in this funnel
breaks the math — $29 affords a CAC of ~$98 and one demo call costs more.

| Channel | Why | Data |
|---|---|---|
| 1. Automated cold email → live report link → claim → 14-day full-Pro trial | The only cold-email shape that's profitable at this price | LTV ~$295 at $232/yr annual; needs ~1 paid per ~4,900 sends — plausible at 1% reply × 4% close |
| 2. AEO + connector directory | This persona uses ChatGPT/Claude daily (business/marketing/coaching categories); assistants are becoming their search | LLM-referred traffic converts at 24% — 6x Google (Webflow via Poyar 2026); Claude directory: 1,625 connectors, 0 podcast tools |
| 3. Content: "in your voice" proof | Their documented churn trigger on competitor tools is generic output | Competitor review verbatim: "can become generic…"; message = "quotes what you actually said" |
| Cold email angle (AI-category shows get a variant) | "Your show can talk to Claude now" for business/AI/tech categories; report link for everyone else | Category is readable in the feed — free segmentation |
| Drip tie-in | Announcements 3–8 (Brand Voice, templates, transcripts, multilingual, art, chat) are ALL Pro features — the drip is effectively a 12-week Pro nurture sequence | Already drafted in the calendar |
| Fundraising optics | MRR + the annual-prepay cash number; annual take-up ≥60% is the health metric | CC-gated/annual motions convert 25–35% vs 3–5% freemium (ChartMogul 2026) |
| PR angle | "First podcast MCP" launch — this persona's press (business/creator-economy media) | Verified empty category |

## 4. STUDIO $99 — producers, editors, VAs (persona S3, promoted)

**Approach:** the one SaaS tier that affords human selling. Hand-finished
cold email, a real demo, onboarding help. The directory makes the outreach
warm before it starts.

| Channel | Why | Data |
|---|---|---|
| 1. Hand-finished cold email | $99 → LTV ~$2,285 → CAC ceiling ~$762: room for 90 min of human time per close | 3–5x solo→agency price cluster verified across 8 vendors; Castos Pro $99 anchors the number |
| 2. Producer Directory ("claim your listing") | We can *see* producers in the data — same owner-email across 3+ feeds. A claimable public profile turns cold outreach into "your listing is live" | G2/Clutch/Podchaser all bootstrapped on claim-your-listing; nobody has mapped podcast producers |
| 3. Content: the producer pillar | "What to send a client every month," "what producers charge in 2026" (survey = more original data) | Their pain is renewal-proof: agencies lose ~32% of clients/yr (Focus Digital 2026) — our report is their retention tool |
| Cold email angle | Multi-show computed insight: "You're credited on seven feeds; 31 episodes last month; none carry tracked links — that's the renewal conversation" | Passes the can't-be-written-for-anyone-else test; requires the multi-show grader |
| Drip tie-in | Studio launch is a tentpole (interrupts the drip); directory launch is another announcement slot | — |
| Fundraising optics | NRR story: each producer brings 2–10 shows; expansion revenue without new logos | $100/mo-band cohorts retain ~77% NRR vs ~56% at $10 (Poyar) — Studio is what makes the retention slide credible |
| PR angle | The Producer Graph study ("who actually makes podcasts — mapped for the first time") — trade press (Podnews) | Original data, no source exists |
| **Blocker** | `unique(user_id)` — one schema line | Gates the tier, the directory claim-to-account path, and the multi-show demo |

## 5. S4 — the company-show marketer ("prove it to my boss")

**Approach:** content-and-nurture only until Episode Report v1 ships; then
outbound activates. Emailing them now would sell unshipped software, which the
evidence rules forbid.

| Channel | Why | Data |
|---|---|---|
| 1. Prove-it content, now | Builds the audience the outbound will land on later | Walker attribution study: podcasts = 53% of revenue by self-report, 0% by software — the single best stat in their language, citable today |
| 2. Cold email, at Report v1 | Their buying trigger literally is the report | 76% of B2B shows exist for thought leadership; no tool closes content→clicks→downloads today |
| Drip tie-in | Episode Reports v1 tentpole = their launch moment | — |
| Fundraising optics | This is the wedge slide: "the attribution loop no competitor owns" | Verified: zero content tools bundle analytics/attribution (Aug 2026 sweep) |
| PR angle | The Attribution Gap study (% of shows with any tracking) — B2B marketing press | Never published by anyone |

## 6. SERVICES $750–6,750 — founders & experts (personas P1/P2)

**Approach:** unchanged from the Hormozi playbook — high-touch cold email,
referrals, and the case-study library. Highest value per reply on the list;
gets the most human effort per send.

| Channel | Why | Data |
|---|---|---|
| 1. Hand-written cold email (50–200/batch) | ≤50-recipient campaigns reply at 5.8% vs 2.1% at 1,000+ (Hunter, 11M emails); value per close is $6–13K | 77 of 297 historical deals closed — from referral/inbound; cold supplements, list quality decides |
| 2. Referrals — systematized | The actual historical winner; ask at month-3 peak-result moment | Your own HubSpot data |
| 3. Case studies + services pages (SEO) | "Which shows, specifically?" and "show me case studies" were the verbatim objections of real lost deals | 18 case studies + 21 verified placements already built |
| Cold email angle | Feed-computed: thin notes + no clips + business URL = P2 editing pitch; exec-visibility categories = P1 booking pitch | Same pipeline, services lane |
| Fundraising optics | Services revenue = the "default alive" slide — profitable operations funding the product | The $70K-MRR-in-90-days flagship (confirmed) headlines it |
| PR angle | Flagship case-study narrative (the growth-system story, 31M views) | Already approved |

## 7. SPONSORSHIP (persona P3) + the lockout wedge

**Approach:** rev-share outbound to shows the ad industry ignores; the
Monetization Line study is both the content and the cold email's citation.

| Channel | Why | Data |
|---|---|---|
| 1. Cold email to funding-tag shows | `podcast:funding` = actively asking listeners for money = highest intent signal in any feed | Free to detect; nobody else segments on it |
| 2. The Monetization Line study | "You don't need 20,000 downloads" becomes a cited number instead of a slogan | Agencies' 10–20K gate vs. median show at ~28 downloads |
| Cold email angle | Anti-guarantee: "20% rev-share, no fee — if we sell nothing, we make nothing" — answers the #2 real objection verbatim | "Is there an option to pay based on results?" — actual lost-deal quote |
| PR angle | The lockout story is media-friendly: "the podcast ad industry ignores 95% of podcasts" | The study makes it reportable |

## 8. The PR calendar (hunted, not hoped for)

| Moment | Story | Outlet type |
|---|---|---|
| Pro launch | **"The first podcast MCP"** — verified against a 1,625-connector directory with zero podcast entries; Descript-composability demo video | HN, AI-tools press, Podnews |
| Index study #1 | The Monetization Line — "X thousand shows ask for donations; Y% have a sponsor" | Podcast trade + marketing press |
| Index study #2 | The Podfade Curve — consumer-friendly, broadly quotable | General tech/culture press |
| Directory launch | "Podcast production, mapped" | Podnews, producer communities |
| Chartable anniversary (Dec) | "One year since podcast attribution died — what replaced it" (answer: fragments, and us) | Marketing/adtech press |
| Merch phase | The verified milestone plaque — "a play button for podcasts, backed by real data" | Creator-economy press |

**Rule carried from the evidence brief:** every PR claim must be screenshot-
survivable, and "first podcast MCP" is claimable only after the listing is
live.

## 9. The fundraising-optics layer (why the drip matters strategically)

The drip calendar (8 ready announcements, ~2-week cadence, tentpoles
interrupting) does three jobs at once:

1. **Momentum signal** — 16+ weeks of visible shipping on the changelog and
   LinkedIn. Investors diligence the changelog; a dated, steady one reads as
   execution.
2. **Content cadence for free** — every announcement is a newsletter + social
   post already drafted; Joelle's LinkedIn never faces a blank page (drip +
   Index data = two evergreen sources).
3. **Narrative sequencing** — the drip tells the story in the right order for
   a deck: free analytics (acquisition) → voice/kit (product) → Studio
   (expansion) → MCP (category creation) → Reports (moat). By the time
   you pitch, the deck's arc is literally your changelog.

The metrics story by slide: users (Free + claimed pages) → MRR + annual cash
(Pro) → NRR (Studio) → profitable services revenue (default-alive) → the
attribution wedge (S4, no competitor owns it) → proprietary data (the Index +
the producer graph, assets nobody can buy).

---

*Detail behind any number: `pricing-v2-competitive.md` (prices),
`saas-outbound-profitability.md` (unit math), `gtm-practitioner-research.md`
(benchmarks), `content-strategy-signal-angle.md` (studies),
`mcp-gtm-strategy.md` (connector channel), `feature-drip-calendar.md` (the
drip), `buyer-personas-messaging.md` (personas).*
