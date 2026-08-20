# Podlink — The Outbound Operating System

**Date:** 2026-08-19
**Decision (Joelle, this session):** cold email is not a campaign to test and
abandon — it is a **core permanent capability** for Podlink. Every podcast
publishes a contact email in its feed. The list is free, renewable, and
enumerable. Build the machine, and get good at it.
**This doc supersedes the volume and channel recommendations in
`cold-email-offer-hormozi.md` §5–6 and `gtm-practitioner-research.md` §10.**
It keeps the offer design from the first and the benchmark discipline from the
second.

---

## 1. Where the pushback is right

### 1a. Zero list cost breaks the standard CAC model

Every cold-email economic analysis in the research assumes you're buying data —
Clay credits, Apollo seats, waterfall enrichment at roughly $0.10–1.00 per
verified contact. Coverage is the bottleneck and the bottleneck costs money.

**Podlink's contact acquisition cost is approximately zero.** `<itunes:owner>`
publishes it. Apple effectively requires it for feed verification. The site
crawl backstops it. And the *enrichment* — the part everyone else pays Clay for
— is also free, because the same feed that carries the email carries the
qualifying data.

So the cost side of the equation is infrastructure and labor only. That is a
structurally different business than the one Balfour and Janz were modeling.

### 1b. The engine and the product are the same build

This is the argument I should have led with and didn't.

`contact-discovery-spec.md` is a **Podlink feature**. Podcast Index ingestion,
RSS parsing, site crawl, contact extraction, scoring, sequencing, send. Building
that for your own outbound isn't dogfooding as a marketing anecdote — **it is
shared engineering.** Every hour spent making the outreach machine better is an
hour spent on the product, and vice versa.

That changes the ROI question entirely. The channel doesn't have to clear a CAC
bar on its own, because you'd be building most of it anyway.

### 1c. Renewable, not one-shot

New shows launch continuously. Existing shows change state — they go quiet, they
come back, they hit episode 100, they add a sponsor, they lose one, they start a
YouTube channel. **The list regenerates.** That's unlike a bought list, which
decays from the day you buy it.

**Verdict: build the machine. Treat it as permanent infrastructure.** The rest
of this document is about what changes now that it is.

---

## 2. What does not change — and the constraint that replaces cost

### Reply rates are indifferent to what the list cost you

A free list doesn't make anyone more likely to reply. 🟡 Belkins' 0.45%
(replies ÷ sends, 7.5M emails, 2025) still applies at volume; 3–5% still applies
to small hand-built sends. Free acquisition improves the denominator of your CAC
and does nothing to the numerator of your response rate.

### The new binding constraint: the universe is finite

Once sending is nearly free, the scarce resource stops being budget and becomes
**your credibility with a fixed, knowable population.** You cannot un-email a
show.

Rough shape (measure it, don't trust it):

| Population | Order of magnitude |
|---|---|
| Feeds in Podcast Index | ~4M |
| Published in the last 90 days | ~400–500K |
| English, 12+ months, ≥2 eps/month, business behind the mic | **~15–50K** |

**That last number is your actual addressable universe for the high-value
routes, and it is small enough to exhaust.** You get roughly two meaningful
touches per show across the life of the channel — one sequence now, one
re-approach in six-plus months when their state has changed.

Run the math on N = 30,000: ~60,000 lifetime touches × 0.45% ≈ **270 positive
replies, ever**, on the premium routes. Close 20% into a $950/mo retainer and
that's ~54 clients — a real business, and also a finite one.

**This is why "figure it out first" matters even when sends are free.** Not
because you can't afford to send. Because a bad message spends a non-renewable
asset and the cost never shows up on any invoice.

### The operating rule that follows

> **Earn the right to scale.** Batch 1 = 50 sends. Batch 2 = 200. Batch 3 =
> 1,000. Each batch only unlocks the next if positive-reply rate holds. Reserve
> 70% of any segment's universe until the message is proven on the other 30%.

---

## 3. Productization: the feed picks the offer

This is the core design, and it resolves the tension between "cold email
podcasters" and "cold email can't support $19."

**You are not emailing one audience with one offer.** You are emailing one list
whose members sort themselves into four routes — and the feed tells you which,
before you write a word.

The gap I missed earlier: **your services list and your SaaS list are the same
people.** P2 (the expert whose show feeds the business) buys editing at $950/mo,
growth from $750, clips at $125. Those buyers publish an RSS feed with their
email in it. The list isn't primarily a SaaS list that can't support outbound —
it's a **services list that happens to also contain SaaS prospects.**

### The four routes

| Route | Feed signals that select it | Offer | Annual value | Human touch? |
|---|---|---|---|---|
| **A — Services retainer** | Business URL selling something · ≥2 eps/mo · 12+ months · show notes <150 words · no clips on linked socials · **paid host** (Libsyn/Buzzsprout/Captivate/Transistor) · cadence gaps showing strain | "You record, we do everything else" — editing + clips + growth | **$9–11K** | Yes — full sequence, call |
| **B — Sponsorship rev-share** | No sponsor language in last 5 eps · consistent publishing · production investment (per-ep art, `podcast:transcript`, chapters) · **`podcast:funding` present** · niche audience | The lockout wedge: "you don't need 20,000 downloads." 20% rev-share, no setup fee | Variable + annuity | Yes — lowest-friction ask in the set |
| **C — The missing middle** | Route A signals but **free host** (Spotify for Podcasters/Anchor) · or <12 months · or no business URL yet | Done-with-you: Pro + human kit review + monthly episode report + sponsorship-readiness track | **~$2.4K** | Light — one call, then async |
| **D — Self-serve** | Free host + irregular cadence + no business URL + low episode count | Free Show Report → free account → Pro $19 | ~$228 | **Never.** Lifecycle email only |

**`podcast:funding` deserves special mention.** A show carrying a Patreon or
donate link has *tried to monetize and is holding a tin cup*. That is a person
who wants money from their show and hasn't gotten it — the single highest-intent
signal available in a podcast feed, and it is sitting in plain text.

### Why this resolves everything

- Outbound spend concentrates on A and B, where LTV supports it comfortably
- C gives the machine a place to send people who want help but can't pay $950
- D absorbs the volume at zero human cost — the report and the lifecycle
  sequence do the work
- **One machine, one list, one report generator.** The routing is a scoring
  function, not four separate operations

---

## 4. Pricing: the missing rung is the one outbound can pay for

Current ladder:

```
Free  →  $19 Pro  →  $39-49 Creator  →  [ NOTHING ]  →  $750-950/mo services
```

That gap is the problem. 🟡 Poyar's cohort data says **founder-led outbound
becomes viable at roughly $100/month price points** ("rabbits") — and you have
no product there. Everything outbound touches is either too cheap to justify the
send or too expensive for most of the list.

### The proposal: Podlink Studio, $199/mo (annual $1,990)

Positioned as **done-with-you**, not more software:

- Everything in Pro (kits, transcripts, brand voice, MCP)
- **A human reviews and finalizes every episode kit** — kills the "generic AI
  output" objection your research names as competitor churn driver #1
- Monthly episode report, delivered, not just available
- Bio link + per-episode pages built and maintained
- YouTube connected and merged into the report
- Sponsorship-readiness track: media kit built at month 3, handed to the
  sponsorship desk when thresholds are met
- Quarterly 30-minute strategy call

**Unit check:** $2,388/yr at ~60% margin = ~$1,430 gross profit. Cold email CAC
at $300–600 per close gives **2.4–4.8:1** — clears the bar. $19 never will.

### The other pricing moves

1. **Reverse trial on signup** — 14 days of full Pro, then drop to free
   analytics + bio link. Fixes the Robinson 0.2% problem: free users currently
   have no idea what Pro does. 🟡 Reverse trial benchmarks 4–6% good / 8–12%
   great, versus freemium's 3–5%.
2. **Credit card on Studio and above, never on Free.** 🟡 CC-gated conversion
   runs 25–35% good / 50–60% great vs. 4–6% ungated. Fyxer went 5% → 35% on this
   change alone.
3. **Work email required** at signup — 🟡 ~10x LTV difference, cheapest filter
   that exists.
4. **Leave $19 alone but stop calling it the business.** It's the self-serve
   floor and the switching-cost layer. Route D's destination. No human ever
   touches it.
5. **Annual at 10× monthly** stays as decided.

### The honest caveat

Adding Studio at $199 does not escape 🟡 Poyar's finding that launch price
appears to cap NRR permanently, or 🟡 ChartMogul's 23–45% GRR at sub-$50/mo.
It does put a rung on the ladder where outbound economics actually work, which
is the immediate problem. Watch Studio's retention specifically — if it holds
above 70% GRR, it's the real business and the $19 tier is marketing.

---

## 5. Email copy: the system, not the template

Three frameworks compose cleanly. Use all three on every send.

**Crawford — computed insight.** The first line must contain a fact about their
business that they don't have and can't easily get. Not "I loved your episode."
A number you calculated.
*The PVP test: swap a competitor's name into the sentence. If it still makes
sense, it's generic. Rewrite.*

**Braun — poke the bear.** Then name the consequence they haven't priced in, and
ask a genuinely neutral question they could honestly answer "no" to. The pattern
is *"How do you know [bad thing isn't happening] despite [their process]?"*

**Lavender — the constraints.** 🔴 First touch **25–50 words**. **3rd–5th grade
reading level** (67% more replies; ~70% of cold email is written at 10th grade
or above). Subject line **1–3 words** — the reason is mechanical, it leaves ~18
more words of preview text visible on mobile. First open is **8x more likely on
a phone**, scanned for **~11 seconds**. Follow-ups invert: 4+ sentences perform
better there.

### The template

```
Subject: [1-3 words, lowercase, specific]

[COMPUTED FACT — impossible to have written for anyone else]

[CONSEQUENCE they haven't priced in — loss framing, one sentence]

[NEUTRAL QUESTION they can answer "no" to]

[PERMISSION ASK — reply-based, no link, no calendar]
```

### Route A, worked

> **Subject:** your show notes
>
> 84 episodes, three a month since March 2024. Your show notes average 41 words.
>
> Nothing in your feed carries a tracked link — so there's no episode where you
> can say which post moved downloads.
>
> How do you know what's working?
>
> I built you a one-page report on this. Want it?

54 words. Passes PVP. Every number computed from public RSS.

### Route B, worked

> **Subject:** sponsors
>
> You've published 112 episodes and you're running a Patreon. No sponsor read in
> your last five.
>
> Most agencies won't talk to a show under 20,000 downloads an episode. That
> rule has nothing to do with whether your audience is worth paying for.
>
> Has anyone shown you what your show could actually charge?
>
> We sell sponsorships on rev-share — no fee, we only make money when you do.
> Want me to run your numbers?

Note this one runs longer because there's a claim to substantiate — and it has
the strongest CTA in the set, because the ask costs the prospect nothing.

### AI usage rule

🔴 Lavender's 100M-email data: **AI-assisted human-edited 5.1% · fully human
3.8% · fully AI-generated 2.4% · template 2.1%.** Fully-automated writing
underperforms plain human writing.

**So: generate the computed facts programmatically, assemble the skeleton
programmatically, and have a human touch the top 30% before send.** Routes A and
B always get human review. Routes C and D can run assembled-but-unreviewed,
because the computed fact carries them.

### Holland's rule, which is easy to violate

Signals **trigger** outreach. They do not get **named** in it. "I saw you visited
our pricing page" is the failure mode. Feed facts are fair game — they're
published. Behavioral signals from your own tool are not.

---

## 6. What to build once

Because this is permanent, build it as infrastructure, not as a campaign.

| Component | What it does | Also ships as product? |
|---|---|---|
| **Feed ingestion** | Podcast Index + RSS parse + site crawl → normalized show record | ✅ contact-discovery Phase 1 |
| **The scorer** | Applies §3 signal rules → assigns Route A/B/C/D + a fit score | ✅ future ICP feature |
| **Report generator** | Public tool at `/grader`; also renders the email's computed facts | ✅ the free tier's front door |
| **Sending stack** | 2–3 secondary domains, 2–3 inboxes each, permanent warm-up, SPF/DKIM/DMARC | ❌ yours only |
| **Reply loop** | Positive → route by segment. "Not now" → date-stamped re-approach queue | Partially |
| **The test log** | Every batch: segment, N, message version, positive-reply rate | ❌ but it's the compounding asset |

### Infrastructure notes that will bite you otherwise

- 🟢 **Never send from `podlink.ai`.** Secondary domains only. You cannot risk
  the domain the app authenticates from.
- 🟢 **Google Workspace trial trap:** a new Workspace domain is capped at **500
  external recipients/day** until it has cumulatively paid **$100**, and the
  raise can take **up to 75 days after that.** Buy the domains now, months
  before you need the volume.
- 🟢 The Google/Microsoft "5,000/day bulk sender" rules apply to **consumer**
  mailboxes only. Most podcaster emails are Gmail personal or a custom domain —
  so unlike most B2B senders, **a meaningful share of your sends genuinely are
  in scope.** Full compliance: SPF + DKIM + DMARC, one-click unsubscribe,
  spam rate under 0.10%.
- 🟢 Microsoft SMTP basic auth: default-off **end of December 2026**,
  admin-overridable. Not March 2026 — that's a vendor's manufactured urgency.
- ⚪ 15–30 sends per inbox per day. Warm-up 2–4 weeks, 4–6 for new domains,
  and it never fully stops.

### The test log is the actual asset

Sends are free. **Learning is not.** Every batch gets a row: segment, N, message
version, positive-reply rate, and one sentence on what the replies said. After
twenty batches you own something no competitor can buy — a measured map of what
makes a podcaster reply. That's the thing that compounds, and it's the reason
mastering this channel is a defensible investment rather than a recurring cost.

---

## 7. First moves

| # | Action | Why first |
|---|---|---|
| 1 | **Count the universe.** Query Podcast Index against the §3 Route A and B filters. Get real N per route. | Everything downstream depends on it. If Route A is 5,000 shows, this is a precision operation. If it's 80,000, it's a machine. Cheap to answer, decisive. |
| 2 | **Buy 2 sending domains, start warm-up.** | The 75-day Workspace clock starts now, not when you're ready |
| 3 | **Build ingestion → scorer → report generator** | One build, three uses: outbound engine, free tool, product feature |
| 4 | **Ship `/grader` publicly** | SEO + demo + lead magnet + email payload. Valuable even if outbound underperforms |
| 5 | **Spec Studio at $199** and put reverse trial + CC gate + work-email in the signup flow | The rung outbound can pay for, and the fix for the 0.2% free tier |
| 6 | **Batch 1: 50 sends, Route B, hand-reviewed** | Route B has the lowest-friction ask, so it reads the message fastest. Start where a "yes" costs the prospect nothing |
| 7 | **Read every reply. Rewrite. Batch 2 at 200.** | Earn the right to scale |

---

## 8. What I'd want reviewed in 60 days

- Positive-reply rate by route — if Route A clears 2% you have a business, if it
  sits at 0.4% the message is wrong, not the channel
- Studio's month-2 retention — the single number that tells you whether the
  middle rung is real
- What percentage of the universe each batch consumed, and how much is left
- Whether the report generator is pulling organic traffic yet — that's the
  compounding half, and it's slower to show up than the outbound half
