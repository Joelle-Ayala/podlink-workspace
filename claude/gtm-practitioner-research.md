# Podlink — What the Operators Would Actually Say

**Date:** 2026-08-19
**Question:** Setting Hormozi aside — what would the people actually shipping
cold-email-plus-free-tier-plus-upsell for SaaS advise?
**Method:** three parallel research passes across ~200 sources: deliverability
and infrastructure state-of-play; PLG and free-to-paid benchmark data; named
practitioner frameworks in signal-based outbound.
**Evidence tags used throughout:** 🟢 primary/provider · 🟡 credible third party ·
🔴 vendor-published (self-interested) · ⚪ practitioner opinion, no data

---

## 0. The headline

Two completely independent frameworks — Hormozi's offer economics and the
PLG/GTM operator consensus — arrive at the same verdict by different routes:
**do not run mass cold email into a $19/mo free tier.**

That convergence is worth taking seriously. But the operators disagree with
Hormozi about what to do *instead*, and they raise one structural problem he
would never have flagged: **the price point itself may be the strategic error,
independent of the channel.**

They also hand you something better than either plan — a documented model,
run by someone whose business is almost structurally identical to Podlink's,
including the exact failure mode your current free tier is walking into.

---

## 1. First, a correction to my own math

In the Hormozi doc I modeled **1.5% positive replies** per 1,000 sends. The best
current data says that's optimistic by roughly 3–5x at any real volume.

🟡 **Belkins, 2026 study** — 7.5M cold emails sent across 2025, 34,393 replies,
using replies ÷ *total sends* (they explicitly switched to this "stricter and,
frankly, more honest denominator"):

- **Average total reply rate: 0.45%**
- Feb 2025 peak **0.54%** → Dec 2025 trough **0.35%** — a **~35% decline inside
  twelve months**
- Founders/owners reply best (**0.57%**), companies with 0–10 employees best of
  all (**0.72%**)

🔴 Instantly's 2026 report says 3.43%, but that's a *campaign-level average*,
which over-weights small hand-built sends. Both are honest; the denominators
differ. **The practical rule: small hand-researched lists get 3–5%, industrial
volume gets 0.4–0.5%.** 🔴 Hunter's 11M-email dataset shows the same shape —
campaigns ≤50 recipients reply at **5.8%**, campaigns of 1,000+ at **2.1%**.

**What this does to the Hormozi plan:** at 0.45%, 1,000 sends produces roughly
2 positive replies, 1 held meeting, ~0.2 closes — about **$1,600 per 1,000
sends** on the $7,200 offer, not the ~$7,900 I modeled. Still clears cost, but
it means the services play only works as a **low-volume, heavily-personalized
motion**. The "4,000 sends a month" line in that doc is wrong. Scratch it.

Two more things worth knowing before you spend a dollar on infrastructure:

- 🟢 **The Google/Microsoft "5,000/day bulk sender" rules apply to *consumer*
  mailboxes only** (gmail.com, outlook.com). B2B sends to Workspace and M365
  business tenants aren't governed by them. This is misreported nearly
  everywhere. Authenticate anyway — business filters use the same signals — but
  it isn't the constraint people think.
- 🟢 **Google Workspace trial-tier trap:** a new Workspace domain is capped at
  **500 external recipients/day** until it has cumulatively paid **$100**, and
  the increase can take **up to 75 days after** that. Spinning up fresh domains
  does *not* give you fresh capacity.

---

## 2. The one company that already ran your exact plan

**Adam Robinson — RB2B.** Free tool, generous free tier, upsell, outbound. This
is the closest available analogue to what you proposed, and it is documented
in detail.

### What he did

1. **Audience before product.** ~12 months posting on LinkedIn to ~92,000
   followers, *then* launched. ~3,000 waitlist signups and 300 discovery calls
   before day one. **RB2B hit $1M ARR in 16 weeks** — versus 27 weeks for his
   previous company and 17 *months* for the one before that.
2. **Free tier as the wedge** — 200 identified contacts/month, no credit card,
   delivered into Slack. *"Up to 200 leads is free and that's 85% of the people
   who sign up for it."*
3. **Then the failure.** The original free tier was an *unlimited* Slack feed
   against a flat $495/mo paid tier. Result: **0.2% free-to-paid at 45 days —
   13 paying customers out of 3,000 signups.** The free product was too
   complete. There was no reason to upgrade.
4. **The fix:** throttle the volume, introduce tiers, move integrations and ICP
   filters behind the paywall. **Free-to-paid went from 0.2% to ~9%.**
5. **Sales-assisted onboarding on a free product** — 81% script-install rate,
   driven by humans helping *free* users get set up. Free ≠ zero-touch.

### Why this matters more than anything else in this document

**Podlink's free tier as specified is the 0.2% version.**

Free = OP3 analytics + link-in-bio page. For the S1 persona — the 28-download
solo host who by your own research spends **$1–25/month on all tools combined**
— that is a *complete job*. Nothing runs out. Nothing creates a trigger. And the
upgrade isn't "more of what you have," it's a **different job** (content
generation) that the free user has never experienced and cannot imagine.

Elena Verna names this exact failure: *"I'm betting if you survey your free
users, the majority of them will have no idea what your paid features are or
what value they would provide."*

**One thing your spec got right, and it's not a small thing:** the free tier is
analytics and a bio link — both near-zero marginal cost — while Whisper and
generation sit behind the paywall. That deliberately dodges the AI-freemium
trap that's killing other products right now. 🟡 As Vikas Kansal (Google AI
Subscriptions) puts it: *"In traditional SaaS, serving an extra free user costs
essentially zero. In AI, every time a free user hits 'Enter,' your GPUs fire,
and your cash burns."* You're on the right side of that. Keep it that way.

### And the part that undercuts the cold email plan

Robinson says loudly that **"cold email is dead"** — while RB2B sends **300K+
emails/month** and attributes **42% of revenue** to them. The contradiction is
the lesson: what he means is that **cold-*list* outbound is dead**. His emails
go to people **RB2B already identified visiting his website**. That's
signal-triggered outbound wearing an outbound costume.

**The free tool isn't the lead magnet in his model. It's the signal generator
that makes the outbound work.** That's a materially stronger design than "free
report → email list," and it's directly portable to you.

---

## 3. The structural problem nobody else will tell you: $19 is the trap

This is the finding I'd most want you to sit with, and it has nothing to do with
cold email.

### Startups become what they hunt

🟡 Kyle Poyar's cohort analysis of NRR by the price point a company *launched* at:

| Starting price | NRR at $10K MRR | NRR years later |
|---|---|---|
| **$10/mo** | 40.4% | **56.2%** |
| **$100/mo** | 68.1% | **76.7%** |
| **$1,000/mo** | 87.4% | **87.4%** |

His conclusion: *"These early patterns don't fade with scale."* The price point
you launch at appears to **structurally cap the retention you can ever
achieve** — still visible three-plus years later.

### The retention data at your price band

🟡 **ChartMogul's SaaS Retention Report** (~3,500 companies, derived from actual
billing data — the strongest methodology in the whole research set):

| Price band (AI-native products) | GRR | NRR |
|---|---|---|
| >$250/month | 70% | 85% |
| $50–249/month | 45% | 61% |
| **<$50/month** | **23%** | **32%** |

Their own caveat: higher-ARR buckets have small samples, so treat as
directional. But 23% gross revenue retention at your band means **median
customer lifetime measured in months, not years.**

### The arithmetic at $19/mo

$19/mo = **$228 ARR**, ~$190 gross profit at 85% margin — less once Whisper runs.

- 🟡 Benchmarkit's median new-customer CAC ratio is **$2.00 of S&M per $1 of new
  ARR** → allowable CAC ~$456 → **24-month payback**
- Brian Balfour's fundability bar is **payback under 12 months**
- At 23–45% GRR, **the average customer doesn't survive the payback period**
- Sustainable fully-loaded CAC at this price: roughly **$60–150**

🟡 Christoph Janz's framing is blunter: outbound requires roughly $1,000/yr ARPA
minimum. At $228/yr you're between his "mice" and "rabbits." 🟡 Poyar's cohort
data says automated outbound only becomes affordable at **~$1,000/month**
price points — roughly 50x yours.

**None of this says kill the $19 tier.** It says: stop treating it as the
business. It's a lead-generation and switching-cost layer for the services
company. That's a legitimate and coherent role — it's just a different one than
"our SaaS revenue line."

---

## 4. The free-to-paid numbers you should actually plan against

🟡 **Poyar / ChartMogul / ProductLed, January 2026, n=200 B2B products**,
measured as free signups → paying within 6 months:

| Model | "Good" | "Great" |
|---|---|---|
| Freemium | **3–5%** | 8–12% |
| Ungated freemium (use before signup) | 7–9% | 8–12% |
| Free trial, no credit card | 4–6% | 10–15% |
| **Free trial, credit card required** | **25–35%** | **50–60%** |
| Reverse trial | 4–6% | 8–12% |

**25% of freemium products convert below 2.5%. Freemium rarely exceeds 15%,
ever.**

The full-funnel view is more useful than the rates. Per **1,000 visitors**:

| Model | Signups | Paying customers |
|---|---|---|
| Freemium | 90 | 5.0 |
| Ungated freemium | 70 | **5.6** |
| Free trial (no CC) | 45 | 3.6 |
| **Free trial (CC required)** | 35 | **10.5** |

**A credit-card gate produces ~2x the customers from 1/3 the signups.** Two
named cases: Fyxer went **5% → 35%** on adding one; Predis tripled MRR YoY.

⚠️ **Important denominator warning.** Published freemium numbers range 2.6%–9%
for the same underlying reality, depending on whether you divide by raw signups
or activated signups. Poyar warns the 8% median is misleading because the
distribution is bimodal — *"very few products actually convert at the median
rate."* Pick your denominator before you pick your benchmark.

**Realistic planning assumption for Podlink at $19:** **1.5–3% on raw signups,
3–5% on activated ones.** Anything above 8% requires proof.

### The single cheapest filter available

🟡 Growth Unhinged 2026: **work-email signups have ~10x the LTV of personal-email
signups.** If you build one qualification rule, build that one.

---

## 5. What the consensus says about cold email → free tier, specifically

I asked for advocates. **There are none.** No named expert recommends mass cold
email into a freemium signup, and no benchmark dataset measures it. The absence
is the finding.

### The theory against

🟡 **Brian Balfour's Channel Model Fit:** channels are determined by ARPU.
Virality and paid work at low ARPU; outbound works at enterprise ARPU. Freemium
and outbound sit at **opposite ends of the same spectrum**. He names the middle
the "ARPU–CAC Danger Zone."

### The data against

🟡 Poyar 2026 on what actually drives free-to-paid: **organic sources (search,
referral, social, LLM traffic) convert highest. Paid marketing converts lowest.**
Webflow's ChatGPT-referred traffic converts at **24% — 6x their Google traffic.**
Cold outbound is lower-intent than paid, which is already the floor.

*(In fairness: First Page Sage found essentially no channel difference in
freemium conversion — 2.6% organic vs 2.8% paid. Two credible sources disagree.
Poyar's dataset is larger and more recent. Genuinely unresolved.)*

### The chained math

1,000 cold emails → ~4–41 replies → maybe 3–5 free signups → at 3–5% freemium
conversion → **0.1–0.25 paying customers.** Roughly **4,000–10,000 cold emails
per paying customer** at $228 ARR. That is not a business.

### The documented cost of cold traffic in a free tier

🟡 **Bobby Pinero (CEO, Equals)** is the best-documented reversal available.
They removed friction — self-serve signup, free plan, lower prices — and got
**4x the companies using the product daily**, immediately. Then growth stalled:
*"For every new company we'd bring in, someone else would drop off."* **ARR
declined during the freemium period.** They reverted to a 14-day trial with a
mandatory credit card and forced setup during onboarding. ARR recovered, and
*"the number of deeply engaged users went up."*

> *"The goal of onboarding is for people to get their first moments of value…
> And removing friction is actually detached from this goal."*

Low-intent signups don't just fail to convert. They **corrupt your conversion
denominator and your product signal** — you can no longer tell what's working.

### What everyone means when they say outbound works with a free tier

They mean **outbound to your own free users, triggered by behavior.** 🟡 Poyar's
2023 dataset (n=1,000+) puts freemium + sales-assist at **5–7% good / 10–15%
great** versus self-serve-only freemium at 3–5% / 6–8% — roughly **2x**.

⚠️ Poyar supplies his own caveat, and it's a good one: *"If you only work the
PQLs you only work the lower-hanging fruit that may be able to convert on its
own."* The widely-cited "PQLs convert 3x better" stat is substantially selection
bias. **Nobody publishes an incremental-lift-over-control number.**

---

## 6. Where cold email genuinely does work, per the people who use it

Every advocate describes the same narrow thing:

- 🟡 **Jason Lemkin:** cold email works only with "(x) solves a real problem 10x
  better… (y) the right decision makers… (z) the perfect and succinct pitch."
  His prescription is **ABM to 10–50 hand-researched prospects.** And honestly:
  *"It should once in a while, at least get you a call. Not every time. Not even
  very often."*
- 🟡 **Poyar's cohort data:** companies at ~$100/month price points grow via
  **founder-led *warm* outbound**, founder brand-building, Product Hunt. Not
  automated sequences.
- 🟡 **David Hsu (CEO, Retool):** *"the best signal of this being real is to do
  cold outbound sales. It's just much purer — pure outbound with your pitch and
  the value prop, with no other incentives attached."* Cold email as a **PMF
  validation instrument**, explicitly not a funnel.
- 🟡 **PostHog's public handbook:** warm outbound to existing users and engaged
  non-payers is the main motion; **cold outbound is reserved for top-10 target
  accounts only.**

**Translation for you: send 50 hand-written emails, not 4,000. The output you're
buying is the message, not the pipeline.**

---

## 7. The frameworks worth actually stealing

### Jordan Crawford (Blueprint GTM) — "the list is the message"

His claim: segmentation *is* the value proposition. If the cohort is defined
precisely enough by a shared pain, the copy writes itself — and copy
optimization is low-leverage next to list construction.

His replacement for personalization is **computed insight** — a fact the
prospect doesn't have and can't easily get. His clearest example: target
companies whose Segment startup credits are expiring, compute their traffic, and
write *"In 4 months, you'll face an unexpected ~$62,000 bill."*

His structure is hypothesis-confirmation, not pitch:
> *"I think that you have X, Y or Z problems because of A, B, C and D. Did I get
> it right?"*
> **"You are optimizing for a reply, not a sale."**

His **PVP test** (Permissionless Value Props) is the fastest quality check
you'll find: swap a competitor's name into your value prop. If the sentence
still makes sense, it's generic — rewrite it.

**Why this matters for you: RSS gives you computed insight at scale, which
almost nobody in any market has.** *"You've published 84 episodes. Your show
notes average 41 words. Nothing you publish carries a tracked link. That means
there is no episode in three years where you can say what promotion moved
downloads."* That is a Crawford email, and you can generate it from public data.

### Josh Braun — poke the bear

The governing question: **"What do you know that your prospect might not know
that can hurt them?"** Then convert it into a genuinely neutral question — one
they could honestly answer "no" to.

His pattern is literally *"How do you know [bad thing isn't happening] despite
[their current process]?"* Real examples from his own material: *"How do you
know if your Stripe account is losing revenue without you knowing it?"* · *"How
do you know violations aren't occurring between pulls?"*

**Yours writes itself:** *"How do you know which of your posts actually moved
downloads?"* That's your entire product thesis as a Braun question, and the
honest answer is "I don't."

⚠️ His "35% response rate" headline has no stated methodology. Take the
framework, discount the number.

### Lavender — the copy data

🔴 Vendor data, but the best-instrumented available (their coach sits in ~50k
inboxes; the benchmark report is n=231,818):

| Approach | Reply rate |
|---|---|
| **AI-assisted, human-edited** | **5.1%** |
| Fully human-written | 3.8% |
| Fully AI-generated | 2.4% |
| Template, no AI | 2.1% |

**Fully-automated AI writing underperforms plain human writing.** The winning
model is AI-generates-skeleton, human-adds-specificity.

Their copy correlates: **25–50 words** for a first touch · **3rd–5th grade
reading level gets 67% more replies** (~70% of cold emails are written at 10th
grade or above) · **1–3 word subject lines** (mechanical reason: leaves ~18 more
words of preview text on mobile) · first open is **8x more likely on a phone**,
scanned for **~11 seconds**. Follow-ups invert the rule — 🔴 Gong data says
follow-ups of **4+ sentences generate 15x more meetings**.

⚠️ Hunter.io publicly disputes Lavender's absolute reply rates as including
downstream thread replies. **Take the directional findings; discount the levels.**

### Clay — signal timing

`urgency = signal strength (1–5) × ICP fit (1–5) × recency`

Two rules matter more than the formula: **map the play before enabling the
signal** (most teams turn on signals and have nothing to say), and **a single
signal is noise — stack 2+ inside a two-week window.**

⚠️ **Becc Holland's counter-rule, which you must pair with this:** intent
signals — page visits, downloads, opens — should **trigger** outreach but never
be **named** as the premise. Naming them is creepy. This is how "I saw you were
on our pricing page" emails happen.

### Chris Walker — the case against, and a gift

His critique: MQLs are *"the most destructive metric in B2B marketing"*; the SDR
model *"assumes that hiring junior employees to interrupt executives all day is
a scalable path to growth."*

His actual evidence is a **hybrid attribution study** — 12 months, 620 declared
conversions, **$21.5M closed-won ARR**, showing a **~90% measurement gap**
between software attribution and self-reported attribution.

**And here is the gift: in that study, podcasts were credited with 53% of
revenue ($11.4M) by self-reported attribution — and 0% by software attribution.**

That is your S4 pitch — *"prove the podcast is working"* — validated by an
outside party with real numbers, and it's a primary source you can cite. It
belongs in your sales material immediately.

His cheapest transferable tactic: a **required free-text "How did you hear about
us?" field**, treated as the primary source of truth. Build it into signup now.

⚠️ Where he's weak: the attribution study measures *misattribution*, not
*outbound inefficiency*. He blurs those. The critique of outbound itself is
qualitative and asserted.

---

## 8. The free tool as a compounding asset — the piece both of us underrated

I pitched the Show Report as a cold email attachment. The evidence says that's
the *smallest* version of it.

### HubSpot Website Grader — the canonical case

- Launched **2007**. **4M+ websites graded** by 2011.
- **~40,000 organic backlinks earned.** Still ranks #1 for "website grader."
- Email required to unlock the full report → *"every grade was a pre-qualified
  lead: someone actively trying to improve their site."*
- **The durable value wasn't the leads.** People shared their scores and linked
  to it as a *utility*, not as marketing — which lifted domain authority for
  HubSpot's **entire content estate**. A permanent tailwind that outlasts any
  individual lead.

### Ahrefs — and the AI-resistance argument

Their free-tools subfolder went from zero to **~1M US organic visits/month**.
Their strategic case for 2026 is the important part:

> **"Tools are unusually resilient to AI."**

AI Overviews summarize informational content away. A functional
calculator/grader/checker **forces the user onto the page**. In a world where
your blog posts get eaten by AI summaries, a tool is one of the few assets that
still requires a visit.

Their selection method, which you can run in an afternoon: search
`[thing] calculator` / `[thing] checker` / `[thing] grader` patterns, filter
KD ≤ 30, and SERP-validate that page one is thin tool pages rather than
long-form articles.

**For you: "podcast analytics," "podcast download checker," "podcast sponsorship
rate calculator," "is my podcast sponsorable," "podcast SEO checker."** A public
Show Report at `podlink.ai/grader` is simultaneously the SEO asset, the lead
magnet, the product demo, and the cold email payload. **It has value even if
cold email fails entirely** — which is exactly what makes it the right first
build.

---

## 9. The uncomfortable pattern

The three most successful companies in this research all grew the same way, and
it isn't outbound:

- **Clay** went **$1M → $100M ARR in ~2 years** on community, education (Clay
  University), user-generated content, in-person hackathons and exec LinkedIn —
  *"No massive ad spend. No aggressive cold outbound."* **The company that sells
  the outbound machine did not grow with outbound.**
- **Adam Robinson** built a 92,000-person audience *first*, then launched, and
  hit $1M ARR in 16 weeks.
- **Chris Walker** built Refine Labs on demand creation and can show a 90%
  attribution gap proving where it came from.

You already have this asset half-built: a personal brand strategy, five content
pillars, joelleayala.com, and a genuinely unusual biographical narrative. Under
every framework in this research, at your price point, **that is the
highest-leverage unbuilt thing you own** — and it's been sitting behind the
website merge.

The honest read: cold email is the fastest thing to test and the least likely to
compound. Content and the free tool are slower and compound permanently.

---

## 10. What I'd actually do

Ranked by evidence strength, not by speed.

| # | Move | Why | Evidence |
|---|---|---|---|
| 1 | **Build the Show Report as a public, indexable tool** at `/grader`, not just an email attachment | SEO asset + lead magnet + demo + cold email payload in one. Valuable even if outbound fails | 🟡 Strong — HubSpot, Ahrefs |
| 2 | **Fix the free tier before driving any traffic to it** — reverse trial (14 days full Pro → drops to free analytics + bio link) | Your current design is Robinson's 0.2% version exactly. Reverse trial solves Verna's awareness gap: they've *felt* the kit | 🟡 Strong — RB2B 0.2%→9%, Verna |
| 3 | **Require work email; add "How did you hear about us?" free text** | 10x LTV difference; the cheapest filter and the cheapest attribution that exists | 🟡 Strong — Poyar, Walker |
| 4 | **Cold email at 50 hand-written, not 4,000** — Crawford's computed insight, Braun's poke-the-bear question, Lavender's constraints (<50 words, 5th-grade, 1–3 word subject) | ≤50 recipients reply at 5.8% vs 2.1% at 1,000+. You're buying the message, not the pipeline | 🟡 Medium-strong |
| 5 | **Build signal-triggered outbound to free-tool users** — new episode published, show went quiet 30 days, hit episode 100, cadence changed, sponsor appeared or vanished | This is the motion that actually works. Stack 2+ signals in a 2-week window; trigger on the signal, don't name it | 🟡 Medium — RB2B, Clay, Poyar's 2x |
| 6 | **Decide what the $19 tier is *for*** — SaaS revenue line, or lead-gen and switching-cost layer for services | Launch price appears to permanently cap NRR; <$50/mo band runs 23–45% GRR | 🟡 Medium — Poyar, ChartMogul |
| 7 | **Resume the content/personal-brand build** | The only channel every successful company in this research actually used at your price point | ⚪ Pattern, not benchmark |
| 8 | **Keep cold email pointed at services** ($6,350–13,350), never at $19 | The one place high ACV supports outbound CAC — and your HubSpot book already proves services close | 🟡 Strong — Balfour, Janz, Poyar |

### Where this contradicts the Hormozi doc

- **Volume:** that doc said ~4,000 sends/month. Wrong. 50–200 hand-built.
- **Reply rate:** 1.5% positive was optimistic by 3–5x at volume.
- **The lead magnet:** it framed the Show Report as an email attachment. It
  should be a public tool first, an attachment second.
- **The free tier:** Hormozi's framework has nothing to say about free-tier
  design. The operators say your current design is the documented failure mode,
  and that's the most actionable finding in this entire document.

### Where they agree, which is the strongest signal in the research

**Don't sell $19/mo to strangers over cold email.** Hormozi gets there through
LTGP:CAC. Balfour gets there through channel-model fit. Janz gets there through
ARPA thresholds. Poyar gets there through cohort retention data. ChartMogul gets
there through billing data.

Five independent routes. Same destination.

---

## 11. Caveats I'd want you to hold onto

- **Every cold email number in this document is either a vendor's interest or an
  operator's intuition.** Nobody has published a controlled test on per-inbox
  volume, tracking pixels, or spintax. If you need certainty on those, the test
  has to be yours.
- **"PQLs convert 3x better" is largely selection bias** and no source publishes
  incremental lift over a control.
- **The <$50/mo retention figures are AI-native subsample, ~200 companies**, with
  ChartMogul's own "directional rather than statistically bulletproof" caveat.
  Also note their AI-native GRR *improved* over 2025 (27% Jan → 40% Sept),
  consistent with early cohorts being trial-tourists washing through.
- **"Freemium needs ~100k qualified visitors/year"** is a derivation from
  published funnel data, not a published threshold. I could not trace that claim
  to a primary quantified source from either Verna or Poyar.
- **Three things circulating widely right now that are simply wrong**, in case you
  read them elsewhere: anyone quoting cold email *open rates* as a live metric
  (Apple MPP killed it in 2021); anyone citing "March 2026" for the Microsoft
  SMTP basic-auth deadline (it's end of 2026, admin-overridable); anyone claiming
  legacy Postmaster Tools was retired in October 2025 (Google postponed it).

---

## Sources

**Benchmarks & PLG**
[The 2026 free-to-paid conversion report — Growth Unhinged/ChartMogul](https://www.growthunhinged.com/p/free-to-paid-conversion-report) ·
[The SaaS Conversion Report — ChartMogul](https://chartmogul.com/reports/saas-conversion-report/) ·
[What is a good free-to-paid conversion — Lenny's Newsletter (Poyar/Pendo, n=1,000+)](https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion) ·
[The SaaS Retention Report: The AI churn wave — ChartMogul](https://chartmogul.com/reports/saas-retention-the-ai-churn-wave/) ·
[Startups become what they hunt — Growth Unhinged](https://www.growthunhinged.com/p/startups-become-what-they-hunt) ·
[Product-Led Growth Benchmarks — ProductLed](https://productled.com/blog/product-led-growth-benchmarks) ·
[2025 SaaS Performance Metrics — Benchmarkit](https://www.benchmarkit.ai/2025benchmarks) ·
[SaaS Free Trial Conversion Rate Benchmarks — First Page Sage](https://firstpagesage.com/seo-blog/saas-free-trial-conversion-rate-benchmarks/)

**Strategy & channel fit**
[Channel Model Fit for User Acquisition — Brian Balfour](https://brianbalfour.com/essays/channel-model-fit-for-user-acquisition) ·
[Five ways to build a $100 million business — Christoph Janz](https://medium.com/point-nine-news/five-ways-to-build-a-100-million-business-82ac6ea8ffd9) ·
[Lessons from going freemium — Bobby Pinero (Equals), Lenny's Newsletter](https://www.lennysnewsletter.com/p/lessons-from-going-freemium-a-decision) ·
[Dear SaaStr: Cold Emails Are Not Working for My B2B SaaS Startup — Jason Lemkin](https://www.saastr.com/cold-emails-are-not-working-for-my-b2b-saas-startup-what-am-i-doing-wrong/) ·
[Trial or Freemium? Reverse Trial — Elena Verna, Amplitude](https://amplitude.com/blog/reverse-trial) ·
[Why SaaS freemium playbooks don't work in AI — Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-saas-freemium-playbooks-dont) ·
[Start with Premium Before Freemium — Ash Maurya](https://ashmaurya.com/blog/start-with-premium-before-freemium) ·
[Outbound sales handbook — PostHog](https://posthog.com/handbook/growth/sales/outbound-sales) ·
[Cold outbound is under-appreciated — Pascal Unger (quoting David Hsu, Retool)](https://pascalsnotes.substack.com/p/cold-outbound-is-under-appreciated)

**Practitioners**
[3 Startups to $1M ARR — Adam Robinson (SaaS Club)](https://saasclub.io/podcast/retention-adam-robinson-411/) ·
[RB2B has a 9% Free-to-Paid Conversion Rate?!?](https://newsletter.rb2b.com/p/rb2b-9-freetopaid-conversion-rate-11-conversion-rate-cold-email-system) ·
[The cold email system behind 42% of our revenue — RB2B](https://newsletter.rb2b.com/p/the-cold-email-system-behind-42-of-our-revenue) ·
[GTM 133: Build your AI Outbound Machine — Jordan Crawford](https://gtmnow.com/gtm-133-build-your-ai-outbound-machine-with-chatgpt-jordan-crawford/) ·
[Why You Can't Personalize Any More — Jordan Crawford](https://martechpod.com/episode/b2b-outbound-is-jacked-jordan-crawford-blueprint/why-you-cant-personalize-any-more-jordan-crawford-blueprint/) ·
[Ditch the Pitch. Poke the Bear — Josh Braun](https://joshbraun.com/ditch-the-pitch-poke-the-bear/) ·
[The Cold Email Benchmark Report — Lavender](https://lavender.ai/blog/the-cold-email-benchmark-report) ·
[Data says: The Shorter, the Better — Lavender](https://lavender.ai/blog/best-length-cold-email) ·
[What's the Best Word Count for Cold Emails — Hunter.io (critique of Lavender)](https://hunter.io/blog/cold-email-word-count/) ·
[2025 Cold Email Guide — Copy.ai (Kyle Coleman)](https://www.copy.ai/blog/cold-email-best-practices-guide-2024-edition) ·
[Personalization At Scale — Becc Holland, Chorus.ai](https://cdn2.hubspot.net/hubfs/5192515/Customer%20Summit%20Decks/Personalization%20At%20Scale%20-%20Becc%20Holland,%20Chorus.pdf) ·
[Refine Labs Hybrid Attribution Framework — Chris Walker](https://www.refinelabs.com/article/hybrid-attribution-framework) ·
[Behind the Scenes of Clay's Marketing and Growth](https://www.clay.com/blog/behind-the-scenes-of-clays-marketing-and-growth) ·
[How to Identify and Act on Buying Signals — Clay](https://www.clay.com/guides/how-to-identify-buying-signals)

**Free tools**
[The Free Tools SEO Strategy — Ahrefs](https://ahrefs.com/blog/the-free-tools-seo-strategy/) ·
[HubSpot Website Grader teardown — B2B Growth Hacking](https://b2bgrowthhacking.com/teardowns/hubspot-website-grader) ·
[HubSpot's $271 Million Inbound Lead Generation Machine — BDOW!](https://bdow.com/stories/hubspot-marketing/)

**Deliverability**
[Google — Email sender guidelines](https://support.google.com/a/answer/81126) ·
[Google Workspace — Gmail sending limits](https://knowledge.workspace.google.com/admin/gmail/gmail-sending-limits-in-google-workspace) ·
[Microsoft — Outlook's New Requirements for High-Volume Senders](https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%e2%80%99s-new-requirements-for-high%e2%80%90volume-senders/4399730) ·
[Yahoo Sender Hub — Best Practices](https://senders.yahooinc.com/best-practices/) ·
[B2B Cold Email Response Rates 2026 Study (7.5M emails) — Belkins](https://belkins.io/blog/cold-email-response-rates) ·
[Cold Email Benchmark Report 2026 — Instantly](https://instantly.ai/cold-email-benchmark-report-2026) ·
[The State of Cold Email 2025 (11M emails) — Hunter.io](https://hunter.io/the-state-of-cold-email-2025) ·
[Gmail Bulk Sender Guidelines: The 2026 Rules They Actually Enforce — GMass](https://www.gmass.co/blog/gmail-bulk-sender-guidelines/)
