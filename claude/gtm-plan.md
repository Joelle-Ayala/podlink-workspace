# Podlink GTM — The Plan (read this one)

**Date:** 2026-08-19
**What this is:** the single document for how Podlink gets customers. It
replaces the eight strategy docs written across Aug 18–19 as the thing you
read; those become reference material for detail (index at the bottom). No
jargon from the working sessions survives here — if a term isn't defined on
this page, it isn't part of the plan.

---

## The strategy in one paragraph

Podlink sells to podcasters in two ways — software and services — and reaches
them through one machine. That machine reads every public podcast feed in
existence. Reading feeds gives us four things at once: **who to email** (every
feed publishes a contact address), **what to say** (the feed reveals each
show's gaps — thin show notes, no sponsor, no tracking), **a free tool** (a
personalized "Show Report" that grades any podcast), and **original industry
data** (nobody has ever published what percentage of podcasts have sponsors,
transcripts, or tracking — we can). Cheap channels carry the cheap products;
expensive human effort is spent only where the price justifies it.

---

## 1. What we sell and what it costs

| Offer | Price | Who it's for |
|---|---|---|
| **Free** | $0 | Any podcaster. Downloads + YouTube views in one dashboard, plus a link-in-bio page. Nobody else gives this away — it's how people enter |
| **Pro** | **$29/mo** ⚠️ *needs your sign-off — canonical decided price is $19* | The expert whose show feeds their business. Every episode becomes show notes, newsletter, and social posts in their own voice, with tracked links proving what worked |
| **Studio** | **$99/mo** | Producers, editors, and VAs who run 2–10 client shows. Unlimited shows, 40 episodes/month, client-ready reports. *(Blocked by one line of code — the database allows one show per account)* |
| **Clips** | +$20/mo add-on | Anyone on a paid tier. An add-on, not a tier, because clip tools sell for $15–29 elsewhere |
| **Services** | $750–$6,750/mo | People who want it done for them: editing, growth, booking, sponsorship. This is where the revenue history actually is |
| **Merch** | $49–129 | Identity products (milestone plaque, mic flag). Buys ads with product margin; the thank-you page feeds the software |

New user experience: sign up → **14 days of full Pro free** → drop to Free if
they don't convert. (Buying merch earns 30 days instead. That's the rule: 14
free, 30 with purchase.)

## 2. How customers arrive — five channels, each with one job

| Channel | Its one job | Why it fits |
|---|---|---|
| **Cold email** | Everything — it's the permanent engine, since every podcast's email is free in its feed. But *how* we send varies by price: **fully automated** sequences sell Pro (no human can touch a $29 sale and stay profitable), **hand-finished** emails sell Studio and services (the price affords the effort) | List costs $0 and refreshes itself; the same feed that gives the address gives the personalization |
| **The free Show Report** (`/grader`) | Turn strangers into signups. Enter any show name → instant report card: downloads trend, what their post-publish workflow is missing, how sponsorable they are | It's the demo, the lead magnet, the cold-email payload, and a Google-ranking tool in one build |
| **Published data** ("the Podcast Operations Index") | Make Podlink the cited source. One study per quarter from the feed data — e.g. "X thousand shows ask listeners for money; only Y% have a sponsor" | Turns cold emails from claims into checkable facts, earns links, and is what AI assistants quote |
| **The Claude/AI connector** | Be the podcast tool AI assistants recommend. Claude's directory has ~1,625 integrations and **zero** podcast tools; Claude auto-suggests connectors mid-conversation | First-mover in an empty category; AI-referred visitors convert ~6x better than Google traffic |
| **Merch funnels + Joelle's content** | Volume and brand. Plaque/flag ads acquire hobbyists at a profit; LinkedIn posts from the Index data build the audience everything else lands on | The $29 tier needs traffic volume cold email can't supply; these carry it |

Who gets which email: **producers** get the multi-show pitch ("one report
across all seven of your shows"). **Business/AI/marketing-category hosts** get
the connector pitch ("your show can talk to Claude now"). **Everyone else**
gets the Show Report offer. **Services prospects** (founder-led companies,
experts drowning in post-production) get the done-for-you offers from the
services playbook. One list, sorted automatically by what's in their feed.

## 3. The one build that powers all of it

Everything above runs on a single pipeline, most of which is also product:

```
Read every feed (Podcast Index + RSS + site crawl)
   → store the signals (email, cadence, notes length, sponsor?, funding tag?,
     transcript?, tracking?, producer credits, category)
   → score & sort each show into its email lane
   → generate its Show Report
   → send / publish / rank
```

Build it once, instrumented fully from day one — **any signal not captured on
the first crawl costs a full re-crawl later.**

## 4. Order of operations

1. **Merge the website bundle + fix the app pricing page** (human, ~1 hour —
   the live pricing is inverted and publicly indexable; nothing should drive
   traffic anywhere until this is fixed). **Decide the Pro price first** so
   the admin is set once, not twice.
2. **Buy 2 sending domains, start warming inboxes** (human, 30 min — new
   domains are rate-limited for up to ~75 days; the clock should already be
   running).
3. **Build the feed pipeline + Show Report** (the §3 build).
4. **Ship `/grader` publicly + publish the first Index study.**
5. **First cold email batches — 50 hand-written, then scale only if replies
   hold.** Services and Studio lanes first (highest value per reply), the
   automated Pro lane once the funnel exists end to end.
6. **Lift the one-show-per-account database limit → launch Studio → producer
   directory** ("claim your listing").
7. **Commit the MCP server, submit to Claude's connector directory the day
   Pro ships.**

## 4b. Amendments (Joelle, 2026-08-19 — decided)

- **The Podlink podcast: yes, as proof of concept.** Short (15–20 min),
  data-driven, biweekly on the drip cadence, built from the Index data and our
  own numbers. The dogfood rule that makes it proof: **every episode's own
  Podlink report is public** — tracked links, download curve, YouTube merge,
  visible to anyone. Doubles as build-in-public fundraising optics, LinkedIn
  clip source, and a services showcase (our team produces it). Guardrail: it
  pauses before it ever competes with client delivery capacity.
- **The free tier's pitch is the activation ladder, not "free analytics":**
  claim your report → add the OP3 prefix (free) → connect YouTube (free) →
  your first *real* episode report arrives with your next episode. Each step
  is one action, each unlocks visibly more, and the finished ladder wires both
  ends of the attribution loop before a dollar is paid. Unique in the market
  (nobody offers merged podcast+YouTube reporting free), plus the Claude
  connector for the AI-native crowd.
- **Email operating model: agents draft, Joelle edits.** The pipeline computes
  insights and drafts all lanes; Studio and services drafts queue for Joelle's
  batch review (~20 drafts, ~15 min — approve / tweak / kill); the Pro lane
  sends unreviewed by design. Matches the measured winner: AI-drafted +
  human-edited replies at 5.1% vs 3.8% fully-human and 2.4% fully-automated
  (Lavender, 100M emails).

## 5. Decisions only Joelle can make

1. **Pro at $19 (what you decided Aug 17) or $29 (what the competitive
   research supports)?** Must be decided *before* the MagicAI admin fix.
2. **Clips: keep "Creator" as a $39–49 tier, or demote to a $20 add-on?**
   (Same decision moment as #1.)
3. **Producer directory: build on `podlink.fm/directory` (already indexed) or
   fresh on podlink.ai?** (Recommendation: podlink.ai.)
4. Confirm the trial rule: 14 days free / 30 with purchase.

## 6. How we'll know it's working (and when to stop)

- **Cold email:** positive replies ≥2% on hand-written batches means scale;
  under 0.5% after three rewrites means the message is wrong, not the channel.
  The automated Pro lane dies if it ever needs a human, or if fewer than 1 in
  5,000 sends becomes a paying customer.
- **Studio:** month-2 retention above ~70% means it's the real business.
  Fewer than ~2,000 producers found in the data means it's a niche, not a
  channel — worth serving, not worth betting on.
- **Pro:** annual-plan take-up needs to pass ~60%, or the economics of selling
  it cold break quietly.
- **The grader/Index:** organic signups per month, trending up. Slow to start
  is expected; flat after six months means the SEO thesis failed.

---

## Reference index (read only when you need the detail)

| For… | Read |
|---|---|
| Why these prices; every competitor's verified pricing | `pricing-v2-competitive.md` |
| The services cold-email offer (Hormozi structure, sequence copy) | `cold-email-offer-hormozi.md` |
| Why $29 can't afford a human; the Studio math; kill criteria | `saas-outbound-profitability.md` |
| Email copy system + sending infrastructure | `outbound-operating-system.md` |
| The Index studies, grader, producer directory in depth | `content-strategy-signal-angle.md` |
| The AI-connector channel in depth | `mcp-gtm-strategy.md` |
| Benchmark research behind all of it | `gtm-practitioner-research.md` |
| Contradiction log from the consistency check | `gtm-coherence-audit.md` |

**Terms translation** (for anyone reading the older docs): "Config A" = the
automated Pro motion · "Config C" = the Studio motion · "Routes A–E" = the
five email lanes in §2 · "S1–S5 / P1–P4" = the personas in
`buyer-personas-messaging.md`.
