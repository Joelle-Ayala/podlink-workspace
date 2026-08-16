/**
 * Pricing content for /pricing.
 *
 * Fixed rules (from PRICING.md — do not drift):
 *   * three tiers: Free / Creator $19 / Pro $49,
 *   * annual = 10x monthly, marketed as "2 months free" — the literal arithmetic
 *     of a 10x multiplier, not a rounded percentage that dies at the next price
 *     change,
 *   * analytics, transcripts, the template library and the podlink.fm page are
 *     never the paywall. OP3 measures the downloads, not us, and charging for a
 *     free open source is not a business model.
 *
 * Per M4-STRIPE-HANDOFF.md (founder-locked 2026-08-08): basic OP3 download
 * analytics and the podlink.fm page itself stay free on every tier per the
 * rule above — what Pro actually adds is (a) the *combined* downloads+clicks
 * view and (b) removing the Podlink badge from the podlink.fm page. Branding
 * removal is a Creator→Pro line, not a Free→Creator one; do not mark it
 * "Removed" below Pro.
 *
 * *** EVERY LIMIT BELOW IS STILL UNDECIDED. ***
 * The page structure is final; the numbers are not. Every line that asserts a
 * quantity or a tier split carries `TODO(pricing): unverified limit`. Grep that
 * string before this page loses its noindex tag.
 */

import { appUrl } from "@/lib/site";
import type { ComparisonSection, FaqItem, PricingTier } from "./types";

export const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
    blurb: "For the show you are still figuring out. Connect your feed and watch what Podlink does to one episode.",
    badge: null,
    features: [
      "Full OP3 download analytics, with no episode cap",
      "Transcripts on every episode",
      "AI show notes, titles and descriptions for one episode a month", // TODO(pricing): unverified limit
      "One clip per episode, with a small Podlink badge", // TODO(pricing): unverified limit
      "Social posts for one platform", // TODO(pricing): unverified limit
      "Your page at podlink.fm/yourshow",
      "The full template library",
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: false,
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: 19,
    priceAnnual: 190,
    blurb: "For the show that publishes every week and wants the four hours after it back.",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "Show notes, titles and descriptions for around four episodes a month", // TODO(pricing): unverified limit
      "Clips and social posts for every platform, no badge", // TODO(pricing): unverified limit
      "Episode newsletter drafts", // TODO(pricing): unverified limit
      "Templates and brand voice", // TODO(pricing): unverified limit
      "Guest intros", // TODO(pricing): unverified limit
      "Email support",
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 49,
    priceAnnual: 490,
    blurb: "For the show that pays for itself — sponsors, a newsletter that matters, and someone helping you run it.",
    badge: null,
    features: [
      "Everything in Creator",
      "Downloads and podlink.fm page clicks in one combined analytics view",
      "Removes the Podlink badge from your podlink.fm page",
      "Around twelve episodes a month", // TODO(pricing): unverified limit
      "Sponsor read scripts in 15, 30 and 60-second cuts", // TODO(pricing): unverified limit
      "Multilingual output", // TODO(pricing): unverified limit
      "A second seat, so your producer can work in it too", // TODO(pricing): unverified limit
      "Priority processing and support", // TODO(pricing): unverified limit
    ],
    cta: { label: "Start free", href: appUrl("/register") },
    highlighted: false,
  },
];

export const COMPARISON: ComparisonSection[] = [
  {
    heading: "Publish and distribute",
    rows: [
      {
        label: "Connected shows",
        values: { free: "1", creator: "1", pro: "1" }, // TODO(pricing): unverified limit
      },
      {
        label: "Import an existing RSS feed",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Back catalogue imported on connect",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "One workspace per episode",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Seats",
        values: { free: "1", creator: "1", pro: "2" }, // TODO(pricing): unverified limit
      },
    ],
  },
  {
    heading: "Understand",
    rows: [
      {
        label: "OP3 download analytics",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "App and country breakdown",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Episode-over-episode comparison",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Transcripts",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Search across the transcript archive",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Downloads and page clicks combined in one view",
        values: { free: false, creator: false, pro: true },
      },
    ],
  },
  {
    heading: "Create",
    rows: [
      {
        label: "Episodes of AI output a month",
        values: { free: "About 1", creator: "About 4", pro: "About 12" }, // TODO(pricing): unverified limit
      },
      {
        label: "AI show notes",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Titles and descriptions",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Template library",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Templates and brand voice",
        values: { free: false, creator: true, pro: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Guest intros",
        values: { free: false, creator: true, pro: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Sponsor read scripts",
        values: { free: false, creator: false, pro: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Multilingual output",
        values: { free: false, creator: false, pro: true }, // TODO(pricing): unverified limit
      },
    ],
  },
  {
    heading: "Grow",
    rows: [
      {
        label: "Clips per episode",
        values: { free: "1", creator: "All suggested", pro: "All suggested" }, // TODO(pricing): unverified limit
      },
      {
        label: "Podlink badge on clips",
        values: { free: "Yes", creator: "Removed", pro: "Removed" }, // TODO(pricing): unverified limit
      },
      {
        label: "Social platforms",
        values: { free: "1", creator: "All", pro: "All" }, // TODO(pricing): unverified limit
      },
      {
        label: "Episode newsletter drafts",
        values: { free: false, creator: true, pro: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Your podlink.fm page",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Podlink badge on your page",
        values: { free: "Yes", creator: "Yes", pro: "Removed" },
      },
    ],
  },
  {
    heading: "Support",
    rows: [
      {
        label: "Help centre",
        values: { free: true, creator: true, pro: true },
      },
      {
        label: "Email support",
        values: { free: false, creator: true, pro: true }, // TODO(pricing): unverified limit
      },
      {
        label: "Priority processing",
        values: { free: false, creator: false, pro: true }, // TODO(pricing): unverified limit
      },
    ],
  },
];

export const PRICING_FAQ: FaqItem[] = [
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
    a: "It's a plan. Analytics, transcripts, your podlink.fm page and the template library stay free for as long as you want them, and you can see exactly what Podlink does to your own episode before you spend anything.",
  },
  {
    q: "What happens when I run out for the month?",
    a: "Nothing breaks and nothing is deleted. Your analytics, your published episodes and your podlink.fm page carry on. You wait for the next month or move up a plan to keep generating.",
  },
  {
    q: "What happens to my work if I downgrade?",
    a: "It stays yours. Podlink does not delete or lock output you have already generated, and you can copy or export it at any time on any plan.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Upgrade, downgrade or cancel from your dashboard whenever you like. Downgrades take effect at the end of the period you have already paid for, so you never lose time you bought.",
  },
  {
    q: "Do you charge for download analytics?",
    a: "No, on any plan. The measurement comes from OP3, which is open source, independently run and free — charging you for reading it would be a strange thing to do.",
  },
  {
    q: "I run more than one show. What then?",
    a: "Get in touch and we will size it properly rather than selling you the same plan three times.",
  },
];
