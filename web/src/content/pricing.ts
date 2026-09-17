/**
 * Pricing content for /pricing.
 *
 * *** CANON: `claude/podlink-pricing-v2.md` — ADOPTED by Joelle 2026-08-20
 * (mobile chief-of-staff thread). Supersedes the 08-17 ladder in
 * `pricing-and-personalization-spec.md` §1, which itself superseded the
 * 08-08 ladder. DO NOT re-flip this file to either older ladder. ***
 *
 * The ladder is Free / **Pro $29** / **Studio $99**, with clips as a future
 * **$20 add-on** (v2 §4d) — there is no Creator tier any more.
 *
 * What each tier means (v2 §3):
 *   * Free   — download analytics + the podlink.fm page (+ YouTube views when
 *              ML2 ships). Free by strategy and by code: episodes are never
 *              persisted and OP3 is read live, so analytics cannot be metered.
 *              Acquisition; every free page is distribution.
 *   * Pro    — $29. The Episode Content Kit PLUS the attribution loop
 *              (tracked links, per-episode pages, episode report) — the loop
 *              is the answer to "why not Castmagic at the same price". Priced
 *              against the $48+ stack it replaces (Podpage $19 + repurposer
 *              $29), not against other content tools.
 *   * Studio — $99. Producers/editors/small agencies: unlimited shows metered
 *              on ~40 episodes/month, client workspaces, branded reports,
 *              free client viewer seats. NOT SELF-SERVE YET: `podcast_shows`
 *              has `unique(user_id)`, so multi-show accounts do not exist in
 *              the product. Until that schema work lands (see
 *              claude/feed-ingestion-show-report-spec.md), Studio's CTA is
 *              "talk to us", never a checkout.
 *
 * Annual is deliberately asymmetric (v2 §4c): Pro annual = 8× monthly ($232,
 * "4 months free" / 33% off) because annual prepay is what makes the outbound
 * CAC math work at this price point; Studio annual = 10× ($990, "2 months
 * free") because Studio retains and margin matters there. Do not "fix" the
 * asymmetry to match — it is the decision.
 *
 * HONESTY RULES (unchanged, and load-bearing)
 *   * Download analytics and the podlink.fm page are never the paywall.
 *   * Nothing here asserts a quantity the product can enforce. There is still
 *     deliberately **no "episodes per month" line in the comparison table**:
 *     episodes are not persisted, so metering is impossible today. Studio's
 *     40-episode meter appears ONLY inside the Studio card, marked unshipped.
 *   * "1 connected show" on Free/Pro is a real, verified limit
 *     (`unique(user_id)`), the only hard number stated without a marker.
 *
 * TWO GREPPABLE MARKERS, BOTH BLOCKING GO-LIVE
 *   `TODO(pricing): unverified limit` — the split or number is undecided
 *                                       (v2 §7.1 still open: Free caps).
 *   `TODO(pricing): unshipped`        — real in the plan, not built. Must be
 *                                       removed or delivered before this page
 *                                       is shown to buyers.
 *
 * /pricing stays `noindex` and out of the sitemap until both marker types are
 * gone AND v2 §7's open items close (Free limits, reverse-trial mechanics,
 * Studio overage). Founder direction 2026-08-19: keep it hidden.
 */

import { appUrl } from "@/lib/site";
import type { ComparisonSection, FaqItem, PricingTier } from "./types";

export const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    blurb:
      "See your show clearly, without paying to. Connect the feed you already publish and get honest download numbers and a link page people can actually use.",
    badge: null,
    features: [
      "Download analytics from OP3, on every episode — no cap, ever",
      "Which apps and countries your listeners are in, and the trend across the show",
      "Your page at podlink.fm/yourshow, updating itself from your feed", // TODO(pricing): unverified limit — v2 §7.1 suggests ~10 links on Free; not decided
      "Per-episode YouTube views once you connect your channel — coming soon", // TODO(pricing): unshipped — ships alongside ML2; free placement per v2 §3 ("the only product with both in one view" — claim gated on shipping)
      "One connected show, the same as every plan",
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 29,
    priceAnnual: 232,
    priceNote: "Annual is 8× monthly — 4 months free.",
    blurb:
      "Replaces your link page and your repurposer, and adds the one thing nobody sells: which post actually moved downloads. The two to four hours after you hit publish, gone.",
    badge: "Core plan",
    features: [
      "Everything in Free",
      "Every new episode transcribed automatically, on arrival",
      "The Episode Content Kit: show notes, titles, description, newsletter and social posts, all written from the transcript",
      "Brand voice filled in from your own feed, so the first draft already sounds like your show",
      "Tracked links and a page per episode, so a share has somewhere to land", // TODO(pricing): unshipped — the loop, v2 §3 puts it in Pro from day one
      "Episode reports: downloads and page clicks on one page, plus YouTube views — coming soon", // TODO(pricing): unshipped — Episode Report v1
      "The same content tools inside Claude, over MCP", // TODO(pricing): unshipped — MCP Phase 1
      "Bring an edited transcript from your editing tool and get the kit before you publish", // TODO(pricing): unshipped — import_transcript
      "The template library and multilingual output", // TODO(pricing): unverified limit — ride-along parity features, tier placement never decided
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: true,
  },
  {
    id: "studio",
    name: "Studio",
    priceMonthly: 99,
    priceAnnual: 990,
    priceNote:
      "Not self-serve yet — multi-show accounts are being built. Talk to us and we'll set you up as they land.",
    blurb:
      "For producers, editors and small agencies running a roster: every client's show, every client's report, one bill. No per-show fees.",
    badge: "For producers & teams",
    features: [
      "Everything in Pro",
      "Unlimited shows — metered on episodes, about 40 a month across your roster", // TODO(pricing): unshipped — blocked by unique(user_id) AND by episode persistence; overage price open (v2 §7.3)
      "A workspace per client, so handoff is a link", // TODO(pricing): unshipped
      "Branded client reports you can send as your own", // TODO(pricing): unshipped
      "Client viewer seats: free and uncapped, always", // TODO(pricing): unshipped — free-viewer policy decided (v2 §4b), product not built
    ],
    cta: { label: "Talk to us", href: "/contact" },
    highlighted: false,
  },
];

/*
 * Column order below must match TIERS: free → pro → studio.
 *
 * Deliberately NOT in this table:
 *   * "Episodes of AI output a month" — nothing exists to count episodes with
 *     (honesty rules above). Studio's meter lives in its card, marked.
 *   * "Podlink badge" rows — no decision on what a $29 Pro removes.
 *   * A Clip Studio section — clips are a future $20 add-on (v2 §4d), not a
 *     tier. They get a FAQ, not a column.
 */
export const COMPARISON: ComparisonSection[] = [
  {
    heading: "Your show",
    rows: [
      {
        label: "Connected shows",
        // free/pro "1" is verified (unique(user_id)). Studio "roster" is the plan, not the product.
        values: { free: "1", pro: "1", studio: "Your roster" }, // TODO(pricing): unshipped — multi-show accounts blocked by unique(user_id)
      },
      {
        label: "Works off the RSS feed you already publish",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "Back catalogue imported on connect",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "Client viewer seats, free",
        values: { free: false, pro: false, studio: "Unlimited" }, // TODO(pricing): unshipped — no seat model exists yet
      },
    ],
  },
  {
    heading: "Measure",
    rows: [
      {
        label: "OP3 download analytics",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "App and country breakdown",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "Episode-over-episode comparison",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "YouTube views per episode",
        values: { free: "Soon", pro: "Soon", studio: "Soon" }, // TODO(pricing): unshipped — ML2
      },
      {
        label: "Tracked links and per-episode pages",
        values: { free: false, pro: true, studio: true }, // TODO(pricing): unshipped — the loop
      },
      {
        label: "Episode report — downloads, clicks and YouTube views together",
        values: { free: false, pro: "Soon", studio: "Soon" }, // TODO(pricing): unshipped — Episode Report v1; "Soon" covers the whole bundled report, not just the YouTube-views component
      },
      {
        label: "Branded reports for clients",
        values: { free: false, pro: false, studio: true }, // TODO(pricing): unshipped
      },
    ],
  },
  {
    heading: "Your podlink.fm page",
    rows: [
      {
        label: "Your page at podlink.fm/yourshow",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "Every listening app behind one link",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "Your own links — newsletter, sponsor, merch",
        values: { free: true, pro: true, studio: true }, // TODO(pricing): unverified limit — whether Free caps the number of links is undecided (v2 §7.1 suggests ~10)
      },
      {
        label: "Latest episodes pulled from your feed",
        values: { free: true, pro: true, studio: true },
      },
    ],
  },
  {
    heading: "The Episode Content Kit",
    rows: [
      {
        label: "Episode transcripts",
        values: { free: false, pro: true, studio: true },
      },
      {
        label: "Show notes, titles and descriptions",
        values: { free: false, pro: true, studio: true },
      },
      {
        label: "Episode newsletter drafts",
        values: { free: false, pro: true, studio: true },
      },
      {
        label: "Social posts, written per platform",
        values: { free: false, pro: true, studio: true },
      },
      {
        label: "Brand voice, filled in from your feed",
        values: { free: false, pro: true, studio: true },
      },
      {
        label: "Content tools in Claude, over MCP",
        values: { free: false, pro: true, studio: true }, // TODO(pricing): unshipped — MCP Phase 1
      },
      {
        label: "Import a transcript from your editing tool",
        values: { free: false, pro: true, studio: true }, // TODO(pricing): unshipped — import_transcript
      },
      {
        label: "Template library and multilingual output",
        values: { free: false, pro: true, studio: true }, // TODO(pricing): unverified limit — ride-along parity, placement never decided
      },
    ],
  },
  {
    heading: "Support",
    rows: [
      {
        label: "Help centre",
        values: { free: true, pro: true, studio: true },
      },
      {
        label: "Email support",
        values: { free: false, pro: true, studio: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Priority processing and onboarding help",
        values: { free: false, pro: false, studio: true }, // TODO(pricing): unverified limit
      },
    ],
  },
];

export const PRICING_FAQ: FaqItem[] = [
  {
    q: "Why is analytics free and the writing paid?",
    a: "Because that is where the costs actually are. Your download numbers come from OP3, which is open, independently run and free — reading it back to you costs us almost nothing, and charging for it would be strange. Transcribing an hour of audio and generating a week of content from it costs real money every single episode. So the line falls where the meter is.",
  },
  {
    q: "What does $29 actually replace?",
    a: "A link page (Podpage runs $19 a month) and a repurposing tool (most run $29) — call it $48 of subscriptions — plus the thing none of them sell at any price: seeing which post actually moved downloads. Pro is a consolidation, not another tool stacked on the pile.",
  },
  {
    q: "How does annual billing work?",
    a: "Pro annual is $232 — eight months' price for twelve, so four months free. Studio annual is $990 — ten months' price for twelve. Switch between monthly and annual whenever you like.",
  },
  {
    q: "Do I need to change podcast hosts to use Podlink?",
    a: "No. Podlink is not a host and will never ask you to become one of ours. Every plan works off the RSS feed you already publish, wherever you publish it.",
  },
  {
    q: "Is the free plan a trial?",
    a: "It's a plan. Your download analytics and your podlink.fm page stay free for as long as you want them, with no card and no clock. Pro is what you add when the writing after each episode is the part eating your evening.",
  },
  {
    q: "What about clips?",
    a: "Clips are coming as a $20 add-on to any paid plan, not a tier of their own — cut from the episode with captions burned in, and picked with your own analytics in the loop. Not on sale yet; we'll say so in the changelog the day they are.",
  },
  {
    q: "What happens to my work if I downgrade?",
    a: "It stays yours. Podlink does not delete or lock output you have already generated, and you can copy or export it at any time on any plan. Your analytics and your podlink.fm page are on the free plan too, so they carry on regardless.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Upgrade, downgrade or cancel from your dashboard whenever you like. Downgrades take effect at the end of the period you have already paid for, so you never lose time you bought.",
  },
  {
    q: "I run several shows — a roster, or clients. What then?",
    a: "That's Studio: unlimited shows, metered on episodes rather than per-show fees, with free viewer seats for your clients. Multi-show accounts are still being built, so Studio isn't self-serve yet — get in touch and we'll onboard you as it lands.",
  },
];
