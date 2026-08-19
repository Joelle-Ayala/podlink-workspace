# Podlink services pages — drop-in bundle

Five services pages for the Next.js site at `podlink.ai`, built to the
conventions already in `web/`: typed content in `src/content/`, design system in
`src/components/`, server components, static rendering.

I couldn't reach `Joelle-Ayala/podlink-workspace` from this session (private repo,
no desktop bridge connected), so this ships as files to copy in rather than a
commit.

## Files

```
web/src/content/services.ts              all page copy, typed
web/src/content/proof.ts                 case studies, testimonials, clearance gating
web/src/components/services/index.tsx    the section components
web/src/app/services/page.tsx            /services index
web/src/app/services/[slug]/page.tsx     /services/[slug] ×5, statically generated
```

Copy the `web/` tree over your existing `web/`. Nothing is overwritten — every
path is new.

## Routes added

| Route | Notes |
|---|---|
| `/services` | index, 5 cards |
| `/services/podcast-editing` | |
| `/services/podcast-clips` | |
| `/services/podcast-advertising` | buy-side and sell-side in one page |
| `/services/get-booked-on-podcasts` | |
| `/services/podcast-growth` | |

Six new static pages, taking the site from 21 to 27.

## Three integration edits you have to make by hand

**1. Nav.** Add a Services link to `SiteHeader`. It should sit next to Features —
these are two different businesses on one site (SaaS product vs. done-for-you
services) and the nav is what tells a visitor which one they're in.

**2. Sitemap.** `web/src/app/sitemap.ts` currently derives entries from the feature
list. Add the service list the same way:

```ts
import { services } from "@/content/services";
import { visibleCaseStudies } from "@/content/proof";
// ...
...services.map((s) => ({
  url: `${siteUrl}/services/${s.slug}`,
  lastModified: new Date(),
})),
// Static pages added later (2026-08-19 update):
{ url: `${siteUrl}/contact`, lastModified: new Date() },
{ url: `${siteUrl}/about`, lastModified: new Date() },
{ url: `${siteUrl}/case-studies`, lastModified: new Date() },
// Cleared case studies only — the selector already applies the gate:
...visibleCaseStudies().map((c) => ({
  url: `${siteUrl}/case-studies/${c.slug}`,
  lastModified: new Date(),
})),
```

Do **not** add `/resources/podcast-guest-pitch-template` — it's noindex until
its download link is real.

**3. `siteUrl`.** Both page files import `{ siteUrl } from "@/lib/site"`. If that
module exports a differently-named constant, change the two imports.

## How proof is gated

`proof.ts` has a `SHOW_UNCLEARED_PROOF` switch, currently `false`. Every case
study, testimonial, show and brand carries a `clearance` field:

- `cleared` — written permission on file. Renders in production.
- `needs-permission` — real work, real numbers, no logo/name usage record found.
- `needs-verification` — the figure or the attribution couldn't be confirmed.

With the switch off, only `cleared` items render. Right now that's **Go With
Elmo Lovano** plus two testimonials — so the proof sections will look thin until
you clear more. As each client says yes, flip that entry to `"cleared"`.

Set the switch to `true` in a preview build to see the pages fully populated.

Two entries are marked `needs-verification` rather than `needs-permission`
because there's a factual question, not just a permission one: the CVS Health
"66% lower cost per candidate" figure appears on the 2022 advertising landing
page with no underlying campaign report, and the same applies to the Oracle
NetSuite 3× ROI number. Confirm those were our campaigns before either ships.

## Pricing

Answering the from-price question: every anchor is the **last real price actually
charged** for that work, not an invention.

| Service | From | Where it comes from |
|---|---|---|
| Editing | $275/episode | Dec 2022 self-serve monthly rate |
| Clips | $300/episode | Jun 2023 unbundled rate, 2 clips |
| Advertising | $1,850/month | Sep 2022 managed retainer, real client |
| Booking | $650 + $399/booking | Jan 2023 offer, real client |
| Growth | $500/campaign | Dec 2021 productized email campaign |

All of these are two to four years old. There's a `TODO(pricing)` block at the
top of `services.ts` — resolve it before `/services` gets indexed, the same way
`/pricing` is currently held back.

## Copy decisions worth knowing about

**No Minting House anywhere.** Per your call, the pages read as Podlink's own
work. The consequence: four of the six testimonials name the old company, so
they're gated as `needs-permission` — rewriting a client's words to name a
different company isn't something to do without asking them. The two that
already say "Podlink" render today.

**The reach multipliers are gone.** "20X", "39X" and "40X" appear across the old
decks with three different values, all derived from an addition model rather than
measurement, and there's no clip performance data anywhere to support any of
them. The clips and booking pages make the same argument using the real
mechanism — the top 1% of shows average ~4,000 downloads, so show size is the
wrong number to chase — which is more persuasive and defensible.

**The download percentile table is on the growth page.** 26+ / 72+ / 231+ / 539+ /
3,062+ downloads in seven days. It reframes the conversation from "my show is
small" to "you're already top 10%, here's how to compound it", which is exactly
how the Unemployable deck used it.

**Cross-linking is deliberate.** Booking → clips → growth is the upsell path the
practice actually ran, and every related-services block routes along it.

## Preview

`podlink-services-preview.html` is generated from the same content files by
`build-preview.ts`, so it can't drift from what ships. It shows **all** proof with
clearance badges, so you can review everything and decide what to chase.

Regenerate after editing copy:

```
npx tsx build-preview.ts
```

## Still open

1. **Turnaround / SLA language.** Nothing in five years of documents states a
   delivery window for editing or clips. Every competitor publishes one. The
   editing and clips pages need a real number before they're competitive.
2. **Clip performance data.** Clips are the entire thesis and there is not one
   view count on file. Instrument the current Jammcard work now — it's the
   missing proof for the most important page.
3. **Booking volume stats.** Total appearances booked and pitch-to-booking rate
   would strengthen that page considerably. Only "~3 weeks to first
   opportunities" exists today.
4. **A `/contact` route.** Every CTA points at `/contact`, which doesn't exist
   yet. Point it at a booking link or build the page.
5. **Case study pages.** The proof data is structured well enough to generate
   `/case-studies/[slug]` from the same file. Worth doing once clearances land.

---

## Update — second pass (2026-08-18, later)

A deeper Gmail and Slack sweep closed the biggest gap in the project and changed
four pages. Details in `claude/podlink-services-evidence-brief.md` §7–14.

**Clip performance data now exists.** It was in the Jammcard Slack workspace the
whole time. 1,000,000 likes on a single clip; 15M YouTube Shorts views in a month
against under 1M on the dedicated clips channel over the same window; 31M monthly
views across platforms; 43,900 YouTube subscribers in 90 days; 91,000+
full-episode streams per episode. Three Go With Elmo case studies now replace the
single thin one, two of them `cleared`.

**Hero stats changed on three pages.** Clips leads with the 1M-likes clip. Growth
leads with 31M monthly views. Advertising no longer leads with the unverified CVS
66% figure — it leads with 17 months of continuous campaign performance.

**Turnaround answers added, marked `TODO(sla)`.** Still no written policy anywhere
in five years of documents, but the shows we run operate on a real weekly cadence
— rough cut and transcript back the day before drop, launch clip out with the
episode, remaining clips over the following two weeks. The FAQ answers describe
that. **You have to decide whether to commit to it contractually before publish.**
Both are commented in `services.ts`.

**One copy claim was corrected for honesty.** The old 2022 line "our campaigns are
trackable, so you know exactly what you're getting in return" is true of the
historical buy-side work — vanity URLs, UTMs and promo codes are documented — but
sponsorship attribution is *not currently being tracked*. A prospect asked for
click-through and ROI data in June 2026 and the answer was "it's not something we
currently track." The advertising page now has an FAQ that says this plainly and
turns it into a differentiator, rather than claiming a capability that isn't
running. Instrumenting real attribution is the highest-value operational fix
available — sponsors are asking for it in writing.

**Two things to action outside the site:**

1. A cPanel credential was emailed in plaintext to a vendor in July 2025 and is
   still in the mailbox. Rotate it.
2. The Spotify Audience Network payout account was still not activated as of June
   2026, ten months after approval. Money may not be flowing.

**Still confirmed absent after both passes:** any trace of Grow Signal, in any
spelling, in Gmail, Slack, Drive, HubSpot or Canva. No second entity, no domain,
no filing, no logo, no conversation with anyone. The split exists only as an
intention.

---

## Update — dropdown navigation (2026-08-18, later still)

Two new files add the hub-plus-dropdown nav for both Services and Features.

```
web/src/content/nav.ts            nav structure — sections, children, descriptions
web/src/components/SiteHeader.tsx replacement header with dropdowns
```

**This replaces your existing `SiteHeader`.** If you'd rather keep yours, lift
only the `DesktopSection` component and the `primaryNav` import — that's the
whole dropdown mechanism, and it's self-contained.

### How the pattern works

Each dropdown parent is **both a link to its hub page and a menu trigger**. That
matters: `/services` and `/features` are real destinations with their own copy
and their own rankings, so the label has to stay clickable. The chevron is a
separate button next to it, so navigating and opening the menu never fight each
other — which is the usual failure mode when a nav label tries to do both jobs.

| Surface | Behaviour |
|---|---|
| Desktop hover | Opens on hover, with a 140ms close delay so a diagonal mouse path from label to menu doesn't drop it |
| Desktop click | Label navigates to the hub. Chevron toggles the menu. |
| Keyboard | Tab to the chevron, Enter or Space opens, Arrow Down opens and moves focus into the list, Escape closes and returns focus to the trigger, tabbing out closes |
| Mobile | Full drawer, everything expanded — no nested accordions. On a phone, hiding five items behind a second tap costs more than the scroll does. The hub link sits at the top of each section marked "Overview →". |

Dropdowns close on route change, on outside click, and on Escape. Body scroll
locks while the mobile drawer is open.

### Two-column menu with descriptions

The panels are two columns wide with a one-line description under each item,
rather than a bare list. That's not decoration — it's where the intent
separation from the sitemap plan gets enforced. Feature descriptions use **tool**
language ("Turn episodes into short-form video automatically"). Service
descriptions use **done-for-you** language ("We cut every episode into short-form
video"). Same subject, different buyer, and the menu is where a visitor decides
which side of the business they're on. Keep that discipline when editing
`nav.ts`.

### Order

Services sits before Features. It's the higher-intent, higher-value side and the
side carrying indexing priority per the IA plan. Flip the array in `nav.ts` if
you disagree.

### One thing to check on merge

`SiteHeader.tsx` imports `appUrl` from `@/lib/site` for the Sign in link, and
uses a plain text wordmark. If you already have an SVG logo component, swap it in
where the `<Link href="/">Podlink</Link>` sits — and keep it **monochrome on this
light header**. The colour-split treatment assumes a dark ground; "Pod" in
`#f0ede6` on white is 1.17:1, which is the invisible-logo bug from the earlier
session.

### Feature nav labels

`nav.ts` currently hardcodes the eight feature children, because I couldn't read
your `src/content/features.ts` from this session. The slugs are correct and
stable. There's a commented one-liner at the top of that array showing how to map
over your real features export instead, so there's a single source of truth —
worth doing on merge. The services children already derive from `services.ts`.

---

## Update — founder decisions applied (2026-08-18, final)

### 1. Case studies are cleared

`SHOW_UNCLEARED_PROOF` stays `false`, but everything now renders except two
entries. All case studies, testimonials, show names and brand names are
`cleared`.

**Two are still held, and it isn't a permission problem.** CVS Health (66% lower
cost per candidate) and Oracle NetSuite (3× ROI) appear in our own 2022
advertising landing page with **no underlying campaign report anywhere** — not in
Drive, not in HubSpot, not in email. Permission from CVS wouldn't fix that,
because the open question is whether those were our campaigns at all. They're
tagged `needs-verification` with the reasoning in a code comment. Confirm and
flip them, or drop them permanently.

Two consequences worth knowing:

- The advertising page lost both of its headline numbers, which is why it now
  leads with **17 months of continuous campaign performance** (Worthy) rather
  than the 66% figure.
- The four testimonials that originally named the old company are stored
  **de-named** — "They have delivered exemplary results since taking over our
  podcast…" — so they publish cleanly under the no-old-name decision without
  putting words in a client's mouth.

The My Divorce Solution case study still avoids the revenue figure. Two
conflicting numbers exist internally ($70K MRR in 90 days vs. 65% increase in
monthly revenue) and the page uses traffic, subscriber and conversion metrics
instead. Reconcile with Karen Chellew and you gain a strong headline number.

### 2. Advertising is now two pages

```
/services/podcast-advertising    brands buying ad space
/services/podcast-sponsorship    creators selling it
```

Seven service pages total, site goes to 28. There's a note at the top of
`services.ts` saying not to merge them back.

**What moved where.** The buy-side page keeps campaign strategy, host-read
creative, placement, testing and optimization, and gains a third pricing tier for
scaled spend ($4,500/mo over $50K media, $5,500 over $100K — both real historical
rates). The sell-side page is new and built from the current Go With Elmo
operation: the audience data pack, the rate card and media kit, the four-tier
package ladder, outbound prospecting, tracked links, programmatic fill via
Megaphone and the Spotify Audience Network, and renewal management.

**Proof was re-split too.** Fruits of Motherhood (the $18k-in-a-week brand
partnership) and Belfort (advertisers secured pre-launch) moved to sponsorship.
Worthy sits on **both** — we sold that inventory and we ran the brand's campaign,
so it's genuine proof either way. Go With Elmo's sponsorship results moved to the
new page.

**Each page ends by pointing at the other.** The buy-side FAQ closes with "I have
a podcast — can you sell ads on it instead?" and the sell-side page cross-links
back. Someone landing on the wrong one gets routed rather than bouncing.

**Two things I'd flag on the sponsorship page.** The product-placement FAQ pitches
year-long category-exclusive deals — that's the stated 2026 direction on the show,
not something with a closed deal behind it yet. And the "Can you prove a
sponsorship worked?" answer is deliberately candid about the industry's tracking
gap, because a prospect asked for exactly that data in June and the honest answer
was that it isn't tracked. It reads as a differentiator rather than a hole, but
it only stays true if attribution actually gets instrumented.

---

## Update — contact, case studies, about, lead magnet (2026-08-19)

Five new routes plus the case-study detail tier, all server components, all copy
in typed content files, all factual claims traced to the evidence brief.

### Files added

```
web/src/content/contact.ts                                   contact copy + booking/email constants
web/src/content/about.ts                                     about copy — only brief-defensible numbers
web/src/content/resources.ts                                 pitch-template lead magnet copy
web/src/app/contact/page.tsx                                 /contact — JSON-LD ContactPage
web/src/app/about/page.tsx                                   /about — JSON-LD AboutPage + Organization
web/src/app/case-studies/page.tsx                            /case-studies index, service-line badges
web/src/app/case-studies/[slug]/page.tsx                     detail pages — Article + BreadcrumbList
web/src/app/resources/podcast-guest-pitch-template/page.tsx  lead magnet — noindex for now
```

### Files changed

- **`proof.ts`** — `CaseStudy` gained `slug` (kebab of id) and optional `story`
  (challenge / approach / results). Stories are written for the 11 **cleared**
  entries only, from the evidence brief; the two `needs-verification` entries
  (cvs-health, oracle-netsuite) have slugs but no stories and are excluded from
  static generation. New selectors: `visibleCaseStudies()`, `getCaseStudy()`,
  plus `caseStudiesIndex` page copy.
- **`nav.ts`** — "Case Studies" added as a plain (non-dropdown) item after
  Features. About and Resources deliberately stay out of the top nav.
- **`build-preview.ts`** — four new preview tabs (case studies index, one sample
  detail, contact, about), linked from the notice bar and the Case Studies nav
  item.

### /contact

Every services CTA on the site already pointed at `/contact`; it now exists, so
the conversion path is unblocked. No form backend: primary CTA is the booking
link, secondary is plain email, plus a three-step "what happens next" drawn from
the real onboarding flow (package finalization → contract + deposit → kickoff).

**`TODO(contact)` in `web/src/content/contact.ts`:** the booking URL defaults to
`mailto:joelle@podlink.ai` (that mailbox is live) because no scheduling link was
found anywhere. Swap in the real Calendly/Cal.com URL — one constant.

### /case-studies and /case-studies/[slug]

Index lists cleared case studies with service-line badges;
`generateStaticParams` builds **cleared entries only** and `dynamicParams =
false` plus an in-page visibility guard keep the two unverified entries from
ever rendering. Detail pages: hero metric, challenge/approach/results story,
metrics grid, related-service links, closing CTA.

### /about

The practice story told as Podlink, using only the numbers the brief marks
defensible: work since January 2021 · 27 clients · longest relationship 5+
years and still active · 8 of 13 production clients bought twice or more. The
internal revenue figure is not used, and no team-size claim is made (unknown).
Includes the "what it's like to work with us" block from the brief.

### /resources/podcast-guest-pitch-template

Relaunch page for the real 2022 lead magnet (built in Canva, sent 4 times,
never promoted), using the verbatim 2022 copy. **noindex** until the download
is real.

**`TODO(resources)` in `web/src/content/resources.ts`:** no hosted download
exists — `pitchTemplateDownloadUrl` is `null` and the CTA falls back to a
mailto request. When the URL is real: set the constant, then flip the robots
noindex in the page file (a matching TODO comment sits on it).

### Routes

| Route | Count | Notes |
|---|---|---|
| `/contact` | 1 | |
| `/about` | 1 | |
| `/case-studies` | 1 | |
| `/case-studies/[slug]` | 11 | cleared entries only; 13 if the two unverified ones are ever confirmed |
| `/resources/podcast-guest-pitch-template` | 1 | noindex |

Fifteen new static pages, taking the site from 28 to **43**.

### Sitemap

The sitemap snippet in the first section above has been updated: add
`/contact`, `/about`, `/case-studies`, and the cleared `/case-studies/[slug]`
entries (via `visibleCaseStudies()`). The resources page stays out until its
noindex is lifted.

---

## Update — /work placements directory + HHE/URP split (2026-08-19)

- **Hell Has an Exit and United Recovery Project are now separate case studies**
  (they were separate engagements): HHE = growing the show (clips, video, guest
  booking, YouTube/Facebook ads); URP = podcast advertising as a treatment-lead
  channel (outcomes-only — its old figures belong to the discredited doc family).
  18 case studies total.
- **New: `/work`** — the verified placements directory. 21 placements, every one
  checked against a live public episode page (audit: placements-verified.md).
  YouTube/Spotify embeds inline (lazy-loaded), Apple/web as links, PodcastEpisode
  JSON-LD, indexed on purpose — it's the site's densest real-entity page and it
  answers the #1 recorded buyer objection ("which shows, specifically?").
  Files: `web/src/content/placements.ts`, `web/src/app/work/page.tsx`.
  Add `/work` to sitemap.ts alongside the others.
- **Three claims corrected during verification:** Koii's "All-In" placement does
  not exist (removed everywhere); DocSend's "8+ incl. Kleiner Perkins' Grit"
  reduced to the two publicly verified shows; HHE's Lamar Odom episode has no
  public trace (swapped for the verified Belfort Ep. 50). Three real Belfort
  episodes (Shetty, Impaulsive, Noah Kagan) were EXCLUDED from /work because
  they predate the engagement window — the exclusion rules are documented at the
  top of placements.ts.

---

## Update — /changelog + roadmap (2026-08-19)

New route `/changelog`: a shipped-only changelog plus a Now/Next/Later public
roadmap (no dates, by design — the rules are commented in
`web/src/content/changelog.ts`). Seeded with one real entry (the site
relaunch); every future entry comes from the private drip calendar at
`claude/feature-drip-calendar.md`, which holds eight ready-drafted
announcements for stock features that are already live, plus the tentpole
launch gates. Add `/changelog` to sitemap.ts. Consider a footer link once a
footer exists; it's deliberately not in the top nav.
