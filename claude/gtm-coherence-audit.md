# Podlink — GTM Coherence Audit

**Date:** 2026-08-19
**Question:** do the cold email plan and the content strategy still make sense
once you hold them up against pricing v2, the buyer personas, the site/IA plan,
the funnel architecture, and the app as it actually exists?
**Method:** traced every persona end to end — first touch → landing surface →
product → price → expansion — across all seven documents, hunting for places
where one doc's assumption breaks another's.
**Verdict up front:** the core holds. The cold email and content strategies
reinforce each other and the pricing. But the trace surfaced **two genuine
contradictions, one sequencing catch that matters this week, four gaps, and
three decisions only Joelle can make** — including one where I changed a number
she had already decided, which needs her sign-off, not my assertion.

Docs audited: `buyer-personas-messaging.md` · `pricing-v2-competitive.md` ·
`saas-outbound-profitability.md` · `outbound-operating-system.md` ·
`content-strategy-signal-angle.md` · `podlink-sitemap-ia-plan.md` ·
`funnel-architecture.md` · `pricing-and-personalization-spec.md` ·
`handoff-2026-08-19.md`.

---

## 1. The system map — every persona, one row each

This is the whole GTM on one table. Each row must work end to end or the
persona is orphaned.

| Persona | First touch | Lands on | Gets | Pays | Expands to | Status |
|---|---|---|---|---|---|---|
| **S3 → Studio buyer** (producer/editor/VA/agency) | **Cold email** (Config C, human-touched) + Producer Directory | `/studio` landing *(does not exist — gap #1)* | Multi-show report demo | **Studio $99** | More episodes; refers hosts | ✅ Coherent once gaps close |
| **S2 expert-entrepreneur** | Content/SEO + `/grader` + automated cold email (Config A) | `/grader` → reverse trial | Show Report → 14 days full Pro | **Pro $29** | Studio if they hire help; services if they'd rather not DIY | ✅ Coherent — now Pro's core buyer |
| **S1 28-download solo host** | `/grader`, benchmark pages, **plaque/flag funnels** | `/grader`, `/tools` , `/shop` | Free tier + identity products | **$0 + merch AOV $49–89** | Pro *eventually*, plaque milestones repeatedly | ⚠️ Was Pro's framing target — no longer (finding #2) |
| **S4 company-show marketer** | Content only (prove-it pillar, Walker 53%/0% stat) | Blog/MCP page → free tier | Analytics + YouTube view | Free → Pro | **Outbound deferred until Report v1 ships** | ⚠️ Finding #4 |
| **S5 video clipper** | None yet | — | — | Clips +$20 add-on | — | ✅ Consistent with "post-launch" |
| **P1/P2/P3 services buyers** | Referral/inbound/warm — **not cold email, per the SaaS-first constraint** | `/services/*` (28-page build) | Retainers $750–950+ | Services | Sponsorship rev-share | ✅ Unchanged; routes stay in the scorer, sequences deferred |

The one-machine claim survives: ingestion → scorer → report generator feeds
every row. That's the load-bearing beam and nothing in the audit cracked it.

---

## 2. What locks together (confirmations worth naming)

1. **Three documents independently invented the same tool.** The content
   strategy's `/grader`, the funnel architecture's `/tools/podcast-benchmark`
   ("check your rank → mint the plaque"), and the cold email's Show Report
   payload are **the same build**. Even the sitemap's Phase 3 note — "the
   download-percentile benchmark table is a linkable asset on its own" —
   pre-figured it. Convergence from four directions is the strongest
   validation in this audit. **Build it once, as one thing:** percentile rank
   (feeds the plaque funnel) + operational audit (feeds the cold email) + free
   signup CTA (feeds the reverse trial). See gap #2 for the one requirement
   this adds.
2. **The plaque funnel and the pricing ladder shake hands.** The plaque is
   S1's identity purchase; its thank-you page claims the podlink.fm page + Pro
   trial; its repeat-purchase engine ("your analytics are how you earn the
   next one") is literally the free tier's retention loop. Merch monetizes the
   persona Pro can no longer afford to chase (finding #2) without corrupting
   SaaS conversion math.
3. **MCP stays off cold email and on the site — consistent everywhere.** The
   personas doc assigns the MCP page to S2/S4 inbound; the practitioner
   research said don't lead with it cold; pricing v2 keeps it inside Pro as
   substance. No doc contradicts another.
4. **The evidence rules survive every new artifact.** The Operations Index
   *strengthens* compliance — Podlink becomes the primary source instead of
   the company that can't cite one. No new doc reintroduces CVS/Oracle,
   sponsor names, or the 1M-like clip.
5. **The traffic math closes only as a system, and the system now exists on
   paper.** Freemium needs ~100K qualified visitors/yr; cold email will never
   supply that volume. In the assembled design it doesn't have to: content +
   `/grader` + funnels carry volume for Free/Pro, cold email carries Studio,
   merch margin subsidizes paid traffic. Each channel does the one job its
   economics support. That's the sentence the whole session adds up to.

---

## 3. Contradictions found

### Finding 1 — S3's status: the personas doc and the outbound plan directly disagree

`buyer-personas-messaging.md` §2: *"S3 — Not a launch persona — note for the
roadmap."* The profitability analysis and pricing v2 make S3 **the primary cold
email target and the Studio tier's buyer.**

Both can't be true. The resolution is that the constraint changed after the
personas doc was written: once Joelle set "cold email must support profitable
SaaS growth," S3 became the **only** SaaS persona whose LTV clears the
channel's CAC. The promotion is justified — but it must be *formalized*, not
left as a silent contradiction, because the personas doc is marked "source of
truth for website copy, ad messaging, and content."

**Action:** revise personas doc §2 — S3 from "not a launch persona" to "Studio
tier's buyer and primary outbound target; promoted 2026-08-19 under the
SaaS-outbound constraint." Add producer messaging (their verbatim pain is
renewal-proof, not growth). *Blocked detail unchanged:* `unique(user_id)`
still hardcodes 1 show per user — the same line blocks the tier, the segment,
and (see gap #3) the directory claim flow.

### Finding 2 — Pro at $29 silently changed buyers, and the pricing-page copy didn't notice

The personas doc prices S1's world precisely: the solo host spends **$1–25/mo
on ALL tools**. Pro at $19 sat inside that ceiling; **Pro at $29 sits above
S1's entire tool budget.** Pricing v2's own pricing-page copy ("replaces your
link page $19 + repurposer $29") still tells S1's consolidation story — to a
buyer who was never going to spend $29.

This isn't a reason to retreat to $19. It's a reason to say out loud what the
price change did: **Pro's buyer is S2** (the expert whose show feeds the
business — for whom $29 is as trivial as $19 was) **and S1's monetization is
the free tier + the plaque/flag funnels + eventual graduation.** The funnel
architecture already monetizes S1 at $49–89 AOV with margin — better economics
than a $29 subscription held by a 23–45% GRR persona anyway.

**Action:** pricing-page copy reframes from S1-consolidation to S2-value
("a week of marketing from every episode, in your voice — quoting what you
actually said"), with the stack-replacement math kept as *proof*, not as the
headline. S1 sees the Free tier and the shop.

### Finding 3 — pricing v2 supersedes a number Joelle already decided — sign-off required, and the sequencing bites this week

The canonical spec (decided with Joelle 2026-08-17) is **Pro $19 / Creator
$39–49**. The handoff's human task #2 instructs: *"Fix the inverted pricing
tiers in the MagicAI admin… canonical is Pro $19 / Creator $39–49."* Pricing
v2 proposes **Pro $29 / clips as a $20 add-on** — my recommendation from the
competitive research, **not a decision she has made.**

The catch is the order of operations: the admin fix is a this-week human task,
plan rows drive Stripe, and if she fixes the admin to $19 and then adopts $29,
the plans get rebuilt twice — with live subscribers on the wrong rows the
second time.

**Action — this is the audit's most time-sensitive output:** decide the price
**before** touching the MagicAI admin. One decision, three options: keep $19
(canonical stands, outbound Config A ceiling stays $77), adopt $29 (v2 as
written, ceiling $98), or split the difference with $19 launch/$29 later
(worst option — Poyar's data says the launch price is the one that sticks).
Same decision moment should settle clips-as-add-on vs. Creator tier. Then the
admin gets fixed **once**, to the decided ladder, and the handoff doc gets
updated to match.

### Finding 4 — cold-emailing S4 would sell a feature that doesn't exist

S4's entire buying reason is the attribution loop ("prove the podcast works")
— which is **build-order step 3**, not shipped. An outbound sequence to S4 now
would pitch unshipped software, which the standing evidence rules prohibit
("no public dates on the roadmap; changelog = usable today only").

**Action:** S4 is a **content-and-nurture audience until Episode Report v1
ships.** The Walker 53%-by-self-report / 0%-by-software stat is publishable
content ammunition today; the outbound sequence to S4 activates the week the
report is real. Write this into the outbound OS so a future session doesn't
"discover" S4 as an untapped route.

---

## 4. Gaps (nothing contradicts — something's missing)

1. **No producer-facing page exists anywhere in the sitemap.** All three
   phases of the IA plan — 21 → 28 → ~40 pages — contain nothing for the
   Studio buyer. Config C's sequence needs somewhere to send a reply.
   **Add `/studio` (or `/for-producers`) to Phase 2**, with the multi-show
   report as its demo and "no per-show fees" as its Castos-answering headline.
   Collision check against the existing matrix: none — producer intent
   overlaps no feature or service page.
2. **The grader must handle the multi-show case.** The Config C email promises
   "one report across all seven shows." If `/grader` only takes one RSS URL,
   the flagship Studio demo doesn't exist. Build requirement: accept multiple
   feeds (or detect shared ownership automatically from the owner-email) and
   render the roll-up. This single requirement is the difference between the
   grader serving one funnel and serving all three.
3. **"Claim your listing" collides with `unique(user_id)`.** The Producer
   Directory's claim mechanic implies an account holding 7+ shows — the exact
   thing the schema forbids. **Resolution: a claimed listing is a public
   profile, not an app account,** until the constraint is lifted. Claim →
   verified badge + editable profile; the Studio pitch follows as sequence
   step 2. Also: `podlink.fm/directory` already exists, already indexed,
   currently doing nothing — decide whether the Producer Directory extends
   that asset or lives fresh on podlink.ai (recommend podlink.ai for authority
   consolidation, same logic as the shop decision).
4. **Two trial lengths now exist for the same product.** Pricing v2's reverse
   trial: **14 days** full Pro on signup. The funnel thank-you pages: **30
   days** Pro with purchase. Defensible — buyers earned more — but only if
   it's a written rule rather than an accident: *"14 free / 30 with any
   purchase."* One sentence in the pricing spec prevents a future
   inconsistency ticket.

---

## 5. One sharpening on the cold email plan (constraint compliance)

The outbound OS was written before Joelle's SaaS-first constraint and its
worked examples still lead with services offers ($950 retainers, sponsorship
rev-share). Under the constraint, the **live sequences at launch are exactly
two**: Config C to producers (human-touched, $99 Studio) and Config A to solo
experts (fully automated, $29 Pro annual). Routes A/B (services, sponsorship)
**stay in the scorer** — tagging costs nothing and the data compounds — but no
sequence fires on them until the SaaS motion is measured. The copy system
(computed insight → poke-the-bear → Lavender constraints) transfers unchanged;
only the offers in the examples rotate.

The kill criteria from the profitability doc still stand and nothing in this
audit weakens them: Config A dies below 0.02% send-to-paid after 5,000 clean
sends or the moment it needs a human; Config C is a niche if the producer
universe counts under ~2,000.

---

## 6. Decisions for Joelle (in order)

| # | Decision | Why it can't wait / who's blocked |
|---|---|---|
| 1 | **Pro price: $19 (decided) vs $29 (recommended)** — and clips add-on vs Creator tier | Gates the MagicAI admin fix (human task #2, this week). Deciding after fixing = doing Stripe twice |
| 2 | **Promote S3 formally** — approve the personas-doc revision | Personas doc governs all copy; two docs currently disagree |
| 3 | **Producer Directory home:** extend `podlink.fm/directory` or new on `podlink.ai` | Gates the directory build and the Config C sequence |
| 4 | Trial rule: adopt "14 free / 30 with purchase" | One line; prevents drift |

## 7. What changes in the docs once she decides

- `buyer-personas-messaging.md` — S3 promotion + producer messaging (finding 1); Pro's buyer note (finding 2)
- `pricing-and-personalization-spec.md` §1 + `handoff-2026-08-19.md` task #2 — the decided ladder, whichever it is (finding 3)
- `podlink-sitemap-ia-plan.md` — add `/studio` to Phase 2; note grader/benchmark unification (gaps 1–2)
- `outbound-operating-system.md` — SaaS-first sequence scope + S4 deferral (§5, finding 4)

Nothing else moved. The pricing v2 ladder, the four-route scorer, the
Operations Index, the producer directory concept, and the funnel architecture
all survived contact with each other — the failures were at the seams, and
they're all patchable in a day once decision #1 lands.
