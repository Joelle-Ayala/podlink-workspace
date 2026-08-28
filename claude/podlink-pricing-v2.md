# Podlink — Pricing v2

**Date:** 2026-08-19
**Purpose:** rebuild the price ladder so it clears the outbound CAC math *and*
sits defensibly against verified competitor pricing.
**Status:** closes open item #8 in `pricing-and-personalization-spec.md`
("competitor verification — needed before /pricing goes live"). All prices below
were loaded from vendor pricing pages on 2026-08-19; secondary sources are
flagged.
**Supersedes** the tier table in that spec §1, and revises the $149 producer
price I proposed in `saas-outbound-profitability.md` §4.

---

## 1. Three findings that force revisions

### 1a. Content generation is a commodity at $19–29. You were pricing at parity.

| Tool | Entry | Agency/top published |
|---|---|---|
| Podsqueeze | $8.99 | **Agency Lite $89** |
| Swell AI | $29 (free tier exists) | **Agency $49** |
| Castmagic | ~$29 | Team $139 · Business $699 |
| Deciphr | $29 | Elite $199 |
| Riverside | $29 | Business custom |
| Descript | $24/seat | $65/seat |
| **Capsho** | **dead — sunset its podcast product entirely** | — |

$19 for a content kit is a me-too price for a me-too feature, and your own spec
says *"Podlink does not win as a me-too content tool."* The price was arguing
against the positioning.

### 1b. Nobody sells measurement. That's where the pricing power is.

Verified across both sweeps: **not one content tool bundles analytics, a link
page, or attribution.** Castmagic's site mentions none of the three. The closest
anyone comes is Podsqueeze's SEO episode pages and Riverside's webinar lead
capture.

Meanwhile Chartable died **December 12, 2024** and the replacement market
fragmented. Podglomerate's assessment: **no single 1:1 replacement**; creators
assemble a stack. And the critical seam is still open — **link tools measure
clicks, prefix tools measure downloads, and nobody rejoined them.** Pod.link
does landing pages with no download tracking at all.

**Analytics is priced in a completely different bracket:** Rephonic $99 / $149 /
$299. Podchaser Pro is quote-only, estimated ~$2.5–3K/yr. Listen Notes API
$200/mo.

### 1c. Do not price by number of shows. It's a trap with a name on it.

- **Castos** — unlimited podcasts on *every* plan, priced by **seats** ($19 /
  $49 / $99), and their agency page markets it explicitly: **"No per-show fees."**
- **Transistor and Captivate** — unlimited shows on every tier, priced on
  downloads. Both use it as their headline differentiator.
- **Podsqueeze Agency Lite ($89)** and **Swell Agency ($49)** — no show limit;
  the tier buys **minutes and clips**.

Every podcast-specific agency tier in the market sells **capacity, not client
slots.** If you charge per show you'll be compared to $0 at three well-liked
hosts, and you'll lose that comparison every time.

**This corrects the "$149 for up to 10 shows" I proposed.** Wrong number, wrong
axis.

---

## 2. The pricing insight: choose your comparison set

This is the whole decision, and everything below follows from it.

| If Podlink is filed as… | The price ceiling is | Verdict |
|---|---|---|
| "An AI podcast content tool" | **$29–49** | Capped, commoditized, and you're the ninth entrant |
| **"The measurement layer for podcasts"** | **$99–299** (Rephonic's bracket) | No direct comp exists |
| "A repurposer + link page + analytics, unified" | **Replaces $50–75/mo of stack** | Verifiable, defensible, and the S1 consolidation story your research already prescribed |

The verified stack math backs the third frame precisely:

| Podcaster profile | Monthly stack |
|---|---|
| Typical indie | **$50–75** (hosting $19–25 + Podpage $19 + a clip tool $15–29) |
| Semi-pro | **$110–130** |
| Network/agency | **$250–400**, plus $99–299 more if Rephonic is in the mix |

**Price against the stack, not against Castmagic.** Every number in that table
is citable from a vendor pricing page — which also satisfies your no-claim-
without-a-source rule.

---

## 3. The proposed ladder

| Tier | Monthly | Annual | What it is | Job |
|---|---|---|---|---|
| **Free** | $0 | — | OP3 analytics + YouTube views + bio link + subscribe deep-links | Acquisition. Near-zero COGS. The loop's endpoints, pre-wired |
| **Pro** | **$29** | **$232** (8×, 33% off) | Content kit, transcripts, brand voice, MCP, **tracked links, per-episode pages, episode report** | The core paid product. One show |
| **Studio** | **$99** | **$990** (10×, 17% off) | Everything in Pro, **40 episodes/month across unlimited shows**, client workspaces, branded client reports, **unlimited free client viewer seats** | Producers, editors, VAs, small agencies |
| **Clips** | **+$20** | +$200 | Add-on to any paid tier | Not a tier — see §4d |

### Rationale, number by number

**Free stays generous, and that's a strategy not a concession.** Analytics can't
be metered without new code (episodes aren't persisted), OP3 is free, and the
bio link is cheap to serve. Every free user's public link page is distribution.
Crucially, **you'd be the only product giving away podcast + YouTube analytics
in one view** — Rephonic charges $99 for less.

**Pro at $29, not $19.** Four reasons:

1. **It buys 2.5x more outbound headroom.** At $19/10× annual: $150 gross
   profit, LTV ~$231, CAC ceiling **$77**. At $29/8× annual: $192 gross profit,
   LTV ~$295, CAC ceiling **$98**. Config A stops being fragile.
2. **It's not a price increase against the market** — it's Castmagic's entry,
   Swell Studio, Riverside Pro. $29 is the category's established number.
3. **It's a real discount against the stack:** Podpage $19 + a repurposer $29 =
   $48 of tools replaced, plus attribution nobody sells at any price.
4. 🟡 Poyar's cohort data: launch price appears to cap achievable NRR
   permanently. $19 and $29 are close enough that the market won't blink, and
   far enough apart to matter over years.

**The loop moves into Pro and becomes the reason to pay.** Tracked links,
per-episode pages, and the episode report are what nobody else sells. If content
generation is the commodity, the loop has to be inside the paid tier from day
one — not a later add-on. It's the answer to "why not Castmagic at the same
price."

**Studio at $99.** Lands exactly on Castos Pro ($99), just above Podsqueeze
Agency Lite ($89) — numbers the market has already accepted. It's 3.4× solo,
inside the observed 3–5× solo→agency cluster. And the economics are not close:

| | Studio |
|---|---|
| Annual collected | $990 |
| COGS (~40 eps/mo transcription + generation) | ~$350 |
| Gross profit | **$640** |
| Expected GRR (business tool) | ~72% |
| LTV | **~$2,285** |
| **CAC ceiling at 3:1** | **~$762** |

A $762 ceiling absorbs manual personalization, a demo call, and onboarding help
with room to spare. This is the tier cold email was built for.

---

## 4. Four structural decisions

### 4a. Meter Studio on **episodes**, not shows

**Unlimited shows. 40 episodes/month.** Overage sold in blocks.

Why episodes is the right axis, and it's rare that all four align:

- **It's your actual COGS.** Whisper and generation are per episode. Your bill
  and their bill move together.
- **It's their actual work.** A producer's revenue tracks episodes delivered.
- **It sidesteps the Castos trap.** You match "no per-show fees" while still
  capturing volume.
- **It doesn't punish client churn.** Small agencies lose ~32% of clients
  annually. **Per-client pricing converts every one of those losses into an
  automatic downgrade** — you'd build contraction straight into the model and
  hand them a monthly reason to read the invoice.

40 episodes ≈ 10 weekly shows or 20 biweekly — the middle of the 2–10 show
roster this segment actually runs.

### 4b. Client viewer seats are free and uncapped

Unanimous across every vendor examined. AgencyAnalytics: "unlimited staff *and*
client users." DashThis and Whatagraph: unlimited users on every plan. Castos:
clients get free view-only access.

The logic is sound — charging for client viewers monetizes the seats most likely
to generate confused support tickets, while taxing the exact deliverable your
customer is selling.

### 4c. Deeper annual discount on Pro than on Studio

**Pro at 8× (33% off). Studio at 10× (17% off).**

Deliberate asymmetry. Category annual discounts run **30–40%** for content tools.
More importantly, **annual prepay is the entire mechanism that makes Config A
work** — at 23–45% GRR below $50/mo, the median customer doesn't survive a
monthly-billing payback period. Moving annual take-up from ~40% to ~70% is worth
far more than the extra $58/customer that 10× would collect.

Studio doesn't need the same push. It retains, so monthly billing isn't fatal
there, and 10× preserves margin where margin is real.

### 4d. Clips becomes a $20 add-on, not a $39–49 tier

The current spec prices Creator at $39–49. Verified market:

| Tool | Price |
|---|---|
| OpusClip Pro | $29 monthly, **$14.50 annual** (2 seats) |
| Klap Basic / Pro | $14 / $39 |
| Vizard Creator | ~$14.50/user ⚠️ *(prices JS-rendered; secondary source)* |

**You'd be 1.5–3× the market on the one feature where your own spec admits you
have no edge** ("never 'we clip your video' head-to-head with editors").

As a $20 add-on it's incremental revenue on an existing account, it never gets
comparison-shopped against OpusClip on its own, and it doesn't fragment the
ladder. Ship it when it's ready; don't build a tier around it.

---

## 5. What this does to the outbound math

| | Old ($19 / $149) | **New ($29 / $99)** |
|---|---|---|
| Pro annual collected | $190 | **$232** |
| Pro CAC ceiling | $77 | **$98** (+27%) |
| Sends per Pro customer to break even at 3:1 | ~3,850 | **~4,900** |
| Studio CAC ceiling | ~$1,327 | **~$762** |
| Studio price vs. market | Above every published comp | **At Castos Pro, above Podsqueeze Agency** |

Studio's ceiling drops and that's fine — $762 was never the binding constraint,
and $99 is a number you can put on a public pricing page without a conversation.
**Pro's ceiling rising 27% is the change that matters**, because Pro is the tier
that has to survive fully-automated cold email.

Re-run these in the break-even model (`podlink-saas-cac-model.html`) with price
29 / COGS 40 / GRR 35, and 99 / COGS 350 / GRR 72.

---

## 6. Positioning the pricing page

Lead with the stack replacement, in their numbers:

> **Free** — See your whole audience. Downloads and YouTube in one view. The
> only place you can.
>
> **Pro $29** — Replaces your link page ($19), your repurposer ($29), and adds
> the one thing nobody sells: which post actually moved downloads.
>
> **Studio $99** — Every client's show, every client's report, one bill.
> Unlimited shows. No per-show fees.

Three notes on that copy. "No per-show fees" is deliberately Castos's own line —
you meet the objection before it's raised. The Free tier claim is verifiable and
unique. And the Pro line does the S1 consolidation job your personas doc asked
for, with citable numbers behind every figure.

---

## 7. Open items before `/pricing` ships
**DECISIONS 1–3 CLOSED by Joelle 2026-08-27 (all YES to the recommendations):**
1. **Free limits — DECIDED:** unlimited analytics history, bio link capped at
   ~10 links, NO episode report on Free (reverse trial's job). The 27
   TODO(pricing) markers resolve against these values.
2. **Reverse trial — DECIDED:** 14 days full Pro on signup, then drop to Free.
3. **Studio overage — DECIDED:** $2/episode past 40, HARD-CAPPED (no surprise
   bills). Cap amount to state on the page when implemented.
Items 4–6 below remain open (4 = Joelle's admin fix, 5 = unique(user_id)
schema, 6 = Podsqueeze re-verify).
4. **Fix the inverted tiers in the MagicAI admin first.** Creator $19 / Pro $49
   is still live and publicly indexable. Plan rows drive Stripe — admin only,
   never Stripe directly. And set `reset_credits_on_renewal` per plan.
5. **`unique(user_id)` still blocks Studio entirely.** No schema change, no
   Studio tier, no Config C.
6. **Re-verify Podsqueeze's $8.99 Starter** from a different IP — it's anomalous
   against their own $49 Pro and may be a promo or geo variant.

---

## 8. What I'd watch

- **Studio's month-2 retention.** If it holds above 70% GRR it's the real
  business and Pro is marketing. That single number reorganizes the company.
- **Annual take-up on Pro.** If the 33% discount doesn't push it past ~60%,
  Config A's cash payback assumption breaks and the automated cold email play
  goes underwater quietly.
- **Whether anyone rejoins clicks and downloads before you do.** That seam is
  the entire pricing-power argument, and it's been open since December 2024.

---

**Sources — vendor pricing pages loaded 2026-08-19:**
[Castmagic](https://www.castmagic.io/pricing) ·
[Podsqueeze](https://podsqueeze.com/pricing/) ·
[Capsho](https://www.capsho.com/pricing) ·
[Swell AI](https://www.swellai.com/) ·
[Descript](https://www.descript.com/pricing) ·
[Riverside](https://riverside.com/pricing) ·
[Deciphr](https://www.deciphr.ai/solutions/agencies) ·
[Castos](https://castos.com/pricing/) ·
[Transistor](https://transistor.fm/pricing/) ·
[Captivate](https://www.captivate.fm/pricing) ·
[Buzzsprout](https://www.buzzsprout.com/pricing) ·
[Podbean](https://www.podbean.com/podcast-hosting-pricing) ·
[RSS.com](https://rss.com/pricing/) ·
[Podpage](https://www.podpage.com/pricing/) ·
[Rephonic](https://rephonic.com/pricing) ·
[Listen Notes API](https://www.listennotes.com/api/pricing/) ·
[OP3](https://op3.dev/) ·
[OpusClip](https://www.opus.pro/pricing) ·
[Klap](https://klap.app/pricing) ·
[AgencyAnalytics](https://agencyanalytics.com/pricing) ·
[DashThis](https://dashthis.com/pricing/)

**Other:**
[Simplecast — Chartable shutdown](https://help.simplecast.com/hc/en-us/articles/23468148573469-Chartable-Shutdown-What-You-Need-to-Do) ·
[Podglomerate — Chartable alternatives 2026](https://podglomerate.com/chartable-alternatives-2026/) ·
[Growth Unhinged — 2026 State of B2B Monetization](https://www.growthunhinged.com/p/the-state-of-b2b-monetization-in-2026) ·
[Focus Digital — agency churn 2026](https://focus-digital.co/average-marketing-agency-churn/)
