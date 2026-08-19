/**
 * Pricing content for /pricing.
 *
 * *** CANON: `claude/pricing-and-personalization-spec.md`, founder decision of
 * 2026-08-17. DO NOT RE-FLIP THIS FILE TO THE OLDER LADDER. ***
 *
 * The ladder here is Free / **Pro $19** / **Creator $39–49**. An earlier
 * version of this file (commit "web: sync pricing tiers to locked 2026-08-08
 * ladder", synced 2026-08-16) had Creator at $19 and Pro at $49 with the tier
 * meanings inverted. That ladder is dead. The 08-17 decision is explicit that
 * it supersedes it, and PRICING.md / M4-STRIPE-HANDOFF.md still describe the
 * old one — if you are reconciling this file against either of those, this
 * file is right and they are stale.
 *
 * What each tier means now (spec §1):
 *   * Free    — download analytics + the podlink.fm link-in-bio page. Free by
 *               strategy, and also by code: episodes are never persisted and
 *               OP3 is read live, so analytics *cannot* be metered without new
 *               code. Free turns that limitation into the acquisition hook.
 *   * Pro $19 — the **Episode Content Kit**: automatic transcripts plus
 *               transcript-grounded generation (show notes, newsletter, social),
 *               brand voice auto-populated from the feed, the same tools over
 *               MCP, and the episode report when it lands. Generation burns AI
 *               credits and transcription has a real per-episode Whisper cost,
 *               which is why this is the line where money starts.
 *   * Creator — **AI Clip Studio** (clips, captions, AI video editor, dubbing).
 *               Post-launch per GOAL_STATE; price is a decided *range*, not a
 *               decided number.
 *
 * Annual = 10× monthly, marketed as "2 months free" — the literal arithmetic of
 * a 10x multiplier, not a rounded percentage that dies at the next price change.
 *
 * HONESTY RULES (unchanged, and load-bearing)
 *   * Download analytics and the podlink.fm page are never the paywall. OP3
 *     measures the downloads, not us, and charging for a free open source is
 *     not a business model.
 *   * Nothing here asserts a quantity the product can enforce. In particular
 *     there is deliberately **no "episodes per month" line anywhere on this
 *     page**: episodes are not persisted (spec §3), so per-episode metering is
 *     impossible today. Do not add one back before that ships.
 *   * "1 connected show" is a real, verified limit — `podcast_shows` has
 *     `unique(user_id)`. It is the only hard number on this page stated without
 *     a marker.
 *
 * TWO GREPPABLE MARKERS, BOTH BLOCKING GO-LIVE
 *   `TODO(pricing): unverified limit`   — the split or number is undecided.
 *   `TODO(pricing): unshipped`          — the capability is real in the plan
 *                                         but not built yet (spec §6 build
 *                                         order). Must be removed or delivered
 *                                         before this page is shown to buyers.
 *
 * /pricing stays `noindex` and stays out of the sitemap until both markers are
 * gone. (Spec §11 asks for the noindex to come off — that is the *last* step of
 * the pricing work, not this one. Founder direction 2026-08-19: keep it hidden.)
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
      "Your page at podlink.fm/yourshow, updating itself from your feed", // TODO(pricing): unverified limit — which bio-link features, if any, are held back on Free
      "Per-episode YouTube views once you connect your channel", // TODO(pricing): unshipped — ships alongside the Pro build; TODO(pricing): unverified limit — free vs Pro placement still open (spec §8.9)
      "One connected show, the same as every plan",
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 19,
    priceAnnual: 190,
    blurb:
      "The two to four hours after you hit publish, gone. One subscription instead of a link page, a repurposer and a headline tool — and the drafts quote what you actually said.",
    badge: "Core plan",
    features: [
      "Everything in Free",
      "Every new episode transcribed automatically, on arrival",
      "The Episode Content Kit: show notes, titles, description, newsletter and social posts, all written from the transcript",
      "Brand voice filled in from your own feed, so the first draft already sounds like your show",
      "The same content tools inside Claude, over MCP", // TODO(pricing): unshipped — MCP Phase 1 (spec §4)
      "Bring an edited transcript from your editing tool and get the kit before you publish", // TODO(pricing): unshipped — import_transcript (spec §4)
      "Episode reports: downloads, page clicks and YouTube views on one page", // TODO(pricing): unshipped — Episode Report v1 (spec §6 step 3)
      "The template library and multilingual output", // TODO(pricing): unverified limit — ride-along parity features, tier placement never decided (spec §5)
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: true,
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: 39,
    priceAnnual: 390,
    priceNote:
      "Placeholder. The decided figure is a range — $39 to $49 — and Clip Studio is not on sale yet.",
    blurb:
      "AI Clip Studio, for shows with no editing workflow to clip in. Arriving after launch; the plan is here so you can see where Podlink is going, not so you can buy it today.",
    badge: "Post-launch",
    features: [
      "Everything in Pro",
      "Clips cut from the episode, with captions burned in", // TODO(pricing): unshipped — Clip Studio is post-launch (spec §6 step 5)
      "AI video editor and AI dubbing", // TODO(pricing): unshipped
      "Clip moments chosen with your own analytics in the loop", // TODO(pricing): unshipped — the Podlink-only edge (spec §0), needs the report first
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: false,
  },
];

/*
 * Column order below must match TIERS, because /pricing derives the table
 * columns from it: free → pro → creator.
 *
 * Two rows that used to live here are deliberately gone:
 *   * "Episodes of AI output a month" — see the honesty rules at the top of
 *     this file. There is nothing to count episodes with.
 *   * "Podlink badge on your page / on clips" — the badge split came from the
 *     2026-08-08 ladder, where it was a Creator→Pro line at $49. Under the
 *     08-17 canon nobody has decided whether a $19 Pro removes it. Rather than
 *     move an invented split onto a new tier, it is off the page until it is
 *     decided.
 */
export const COMPARISON: ComparisonSection[] = [
  {
    heading: "Your show",
    rows: [
      {
        label: "Connected shows",
        // Verified, not a placeholder: podcast_shows has unique(user_id).
        values: { free: "1", pro: "1", creator: "1" },
      },
      {
        label: "Works off the RSS feed you already publish",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "Back catalogue imported on connect",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "Seats",
        values: { free: "1", pro: "1", creator: "1" }, // TODO(pricing): unverified limit — no seat model exists; a second seat was a $49-tier line on the dead ladder
      },
    ],
  },
  {
    heading: "Measure",
    rows: [
      {
        label: "OP3 download analytics",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "App and country breakdown",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "Episode-over-episode comparison",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "YouTube views per episode",
        values: { free: true, pro: true, creator: true }, // TODO(pricing): unshipped; TODO(pricing): unverified limit — free vs Pro placement open (spec §8.9)
      },
      {
        label: "Episode report — downloads, clicks and views together",
        values: { free: false, pro: true, creator: true }, // TODO(pricing): unshipped — Episode Report v1
      },
    ],
  },
  {
    heading: "Your podlink.fm page",
    rows: [
      {
        label: "Your page at podlink.fm/yourshow",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "Every listening app behind one link",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "Your own links — newsletter, sponsor, merch",
        values: { free: true, pro: true, creator: true }, // TODO(pricing): unverified limit — whether Free caps the number of links is undecided
      },
      {
        label: "Latest episodes pulled from your feed",
        values: { free: true, pro: true, creator: true },
      },
    ],
  },
  {
    heading: "The Episode Content Kit",
    rows: [
      {
        label: "Automatic transcripts",
        values: { free: false, pro: true, creator: true },
      },
      {
        label: "Show notes, titles and descriptions",
        values: { free: false, pro: true, creator: true },
      },
      {
        label: "Episode newsletter drafts",
        values: { free: false, pro: true, creator: true },
      },
      {
        label: "Social posts, written per platform",
        values: { free: false, pro: true, creator: true },
      },
      {
        label: "Brand voice, filled in from your feed",
        values: { free: false, pro: true, creator: true },
      },
      {
        label: "Content tools in Claude, over MCP",
        values: { free: false, pro: true, creator: true }, // TODO(pricing): unshipped — MCP Phase 1
      },
      {
        label: "Import a transcript from your editing tool",
        values: { free: false, pro: true, creator: true }, // TODO(pricing): unshipped — import_transcript
      },
      {
        label: "Template library and multilingual output",
        values: { free: false, pro: true, creator: true }, // TODO(pricing): unverified limit — ride-along parity, placement never decided
      },
    ],
  },
  {
    heading: "Clip Studio",
    rows: [
      {
        label: "Clips with captions burned in",
        values: { free: false, pro: false, creator: true }, // TODO(pricing): unshipped — post-launch
      },
      {
        label: "AI video editor",
        values: { free: false, pro: false, creator: true }, // TODO(pricing): unshipped
      },
      {
        label: "AI dubbing",
        values: { free: false, pro: false, creator: true }, // TODO(pricing): unshipped
      },
    ],
  },
  {
    heading: "Support",
    rows: [
      {
        label: "Help centre",
        values: { free: true, pro: true, creator: true },
      },
      {
        label: "Email support",
        values: { free: false, pro: true, creator: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Priority processing",
        values: { free: false, pro: false, creator: true }, // TODO(pricing): unverified limit
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
    q: "What does $19 actually replace?",
    a: "A link-in-bio page, a repurposing tool and whatever you use to write titles and show notes — usually three subscriptions between $9 and $30 each. Pro is meant to be a consolidation, not another tool stacked on the pile.",
  },
  {
    q: "How does annual billing work?",
    a: "You pay for ten months and get twelve. That is where \"2 months free\" comes from — it is the arithmetic, not a rounded-up percentage. Switch between monthly and annual whenever you like.",
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
    q: "When does Clip Studio arrive?",
    a: "After launch. The Creator tier is on this page so the direction is visible, not so you can buy it yet — and the price is a range we haven't landed on rather than a number we're quietly hoping you don't check.",
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
    q: "I run more than one show. What then?",
    a: "Podlink connects one show per account today — that is a real limit in the product, not a packaging decision. If you run several, get in touch and we will sort it out properly rather than selling you the same plan three times.",
  },
];
