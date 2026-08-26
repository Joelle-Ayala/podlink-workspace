# Podlink — Contact Discovery for Booking & Sponsor Outreach (spec)

**Date:** 2026-08-19 · **Status:** specced, gated (§6)
**What it is:** the data layer inside the Booking / Sponsor Outreach system —
find the shows, the people who run them (host, producer, booker), and a
verified contact path, then feed the AI CRM's sequences. Metered in credits on
MagicAI's existing credit system.

---

## 1. Why this wins (and why it isn't just "a Snov wrapper")

Generic enrichment finds people at companies. Podcast outreach starts one step
earlier — with the SHOW — and podcasting hands us three contact sources that
generic tools ignore:

1. **The RSS feed itself.** `<itunes:owner><itunes:email>` ships a contact
   email inside most feeds. Free, self-published by the show, and exactly the
   inbox that reads pitches.
2. **Podcast Index** — a free, open directory API: search shows by category,
   keyword, language, activity; returns the feed URL and site link. This is
   show discovery at zero marginal cost.
3. **The show's website** — contact page, booking form, team names, socials.

Paid enrichment (Snov/Clay) is the LAST step, not the product: it fills the
gaps (producer/booker identity, LinkedIn profile, verified deliverable email)
after the free layers have done the podcast-specific work. That layering is
the margin AND the moat — and it's the same method the services team used
manually for years ("look at related shows on Apple → Snov for the emails"),
now productized.

## 2. The enrichment waterfall (cost-ordered; charge only on success)

| Step | Source | Yields | Marginal cost |
|---|---|---|---|
| 0 | Podcast Index search | show, feed URL, site, category, episode cadence | ~$0 |
| 1 | RSS parse | owner email, host name, site link | ~$0 |
| 2 | Site crawl | contact page, booking form URL, mailtos, team names, socials | ~$0 |
| 3 | Snov.io API | domain search → person emails, verification, LinkedIn URLs | ~$0.03–0.10 / verified email |
| 4 | Clay (optional deep tier) | role-filtered people search, work history, profile keywords | $$ — highest quality, highest cost |

Stop at the first step that satisfies the request. A large share of shows
resolve at steps 0–2 — pure margin.

## 3. Metering & pricing (rides the existing MagicAI credit system)

MagicAI already has a credit pool, plan-linked allowances, and
`StripeService`-managed top-ups — no new billing infrastructure.

| Action | Credits (draft) | Rationale |
|---|---|---|
| Show search (Podcast Index) | 0 | Acquisition surface — let them see inventory |
| Show contact card (RSS + site crawl) | 1 | Near-zero COGS, feels magical |
| Verified person email (waterfall → Snov) | 5 | COGS ≤ $0.10; healthy margin at any sane credit price |
| Full profile (person + role + LinkedIn + verified email) | 10 | The premium unit |
| Charged ONLY on success | — | Industry standard; failed lookups free |

Packaging: not in Free. Bundled allowance inside the Booking/Sponsor Outreach
add-on tier, with credit packs for volume. Same pool, same meter, same Stripe
plumbing as generation credits ("one meter, two doors" — consistent with the
MCP entitlement principle).

## 4. Product surface

- **Find shows:** search by niche/keyword ("women in finance", "B2B SaaS") →
  list with cadence, category, links. (Later: rank by the download-percentile
  benchmark — our data story.)
- **Reveal contacts:** per show, the contact card — owner email, booking page,
  and "people" (host/producer/booker) with enrich buttons.
- **Push to sequence:** one click into the AI CRM's Gmail/Outlook sequences,
  with the proven pitch templates pre-loaded (booking playbook or sponsor
  playbook — same engine, two template packs).
- **Dogfood clause:** the services team delivers the booking service ON this
  system. Every engagement improves the show database; delivery cost drops;
  the "which shows, specifically?" answer compounds into a proprietary asset.

## 5. Provider strategy

- **Snov.io first.** Cheap credits, simple API (domain search, email finder,
  verifier), and the team has years of hands-on history with it. Fits the
  per-credit COGS model cleanly.
- **Clay as the optional deep tier later.** Much richer person data, much more
  expensive; suits an "advanced enrichment" upsell, not the base waterfall.
- ⚠️ **The Clay workspace currently connected to Claude is Reparel's**
  (employer) — it must never back a Podlink product. Podlink needs its own
  provider accounts, on API terms.

## 6. Gates (nothing builds until cleared)

1. **Provider resale terms.** Reselling enrichment output inside a SaaS
   requires API/reseller terms that permit it — verify Snov's (and later
   Clay's) terms explicitly. This is a legal gate, not a checkbox.
2. **LinkedIn data only via providers.** We never scrape LinkedIn ourselves —
   provider data carries the compliance burden; direct scraping is ToS
   violation and lawsuit bait.
3. **Outreach compliance:** CAN-SPAM/GDPR posture (B2B legitimate-interest
   framing, global suppression list, per-tenant opt-out handling) designed
   before the send button exists.
4. **Google/Microsoft OAuth verification** for Gmail/Outlook send scopes
   (already flagged on the outreach system — shared gate).
5. **Podcast Index attribution** per their API terms (free, but has terms).
6. **Separate Podlink Snov account** with API access, budgeted.

## 7. Build phases

1. **P1 — free-layer discovery (no vendor, no gate):** Podcast Index search +
   RSS owner-email + site crawl → show contact cards. Differentiating on day
   one, zero COGS, and immediately useful to the services team.
2. **P2 — Snov waterfall + credit metering** (gates 1, 6).
3. **P3 — sequences integration** with the outreach system (gates 3, 4) —
   this is where it becomes the Podcast Booking System.
4. **P4 — Clay deep tier + sponsor-side playbook** (sponsor prospecting lanes,
   the Elmo-style data packs).

## 8. Fit with standing strategy

- Positioning: promotion & audience layer — booking outreach IS promotion.
- Pricing spec rule: real build hours, so it must earn its slot — it does, as
  the productization of the highest-demand service line (106 booking deals of
  proven demand) and a credit-revenue engine on existing billing rails.
- Roadmap placement: inside "Booking & sponsor outreach" (Later) — P1 could
  ship earlier as a standalone "find shows" feature if a drip slot needs a
  genuine NEW entry.
- The honesty rule applies to the data: show contact cards display WHERE each
  contact came from (feed / site / verified) — provenance as a feature.

## Addendum 2026-08-25 - vendor verdicts affecting the waterfall (see media-kit-demographics-spec.md 3b)
- Rephonic ($299/mo): podcast-specific contact DB with community-verified votes - candidate ALTERNATIVE or supplement to the Snov step for show contacts; resale terms verification required (same legal gate as Snov, section 6.1).
- Podchaser Starter/Pro: credits/guest graph is unique booking-research data but ToS FORBIDS resale/redistribution below Enterprise - services-team tool only; never behind product endpoints without Enterprise terms.
- Particle (~$0.01/req): sponsorship intel (which brands buy which shows) = the P4 sponsor-lane data source candidate; ToS verification pending. Its MCP server can be added to the services team's Claude TODAY for manual-era research.
