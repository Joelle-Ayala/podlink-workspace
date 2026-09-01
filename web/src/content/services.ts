/**
 * Services content — the six podcast service lines.
 *
 * Podcast advertising is deliberately two pages: `podcast-advertising` sells to
 * brands buying ad space, `podcast-sponsorship` sells to creators selling it.
 * Opposite buyers, opposite search intent, opposite money. Do not merge them.
 *
 * All copy lives here as typed data so editing copy never touches a component,
 * matching the convention already used by src/content/features.ts.
 *
 * Scope language, process steps and price anchors are drawn from real
 * proposals, SOWs and delivered engagements. See
 * claude/podlink-services-evidence-brief.md for the source of every figure.
 *
 * PRICING RESOLVED 2026-08-19: Joelle adopted the 2026 recommendations from
 * claude/pricing-sla-decision-sheet.md (editing bundle to $950/mo; clips to
 * ~$125/clip; booking $750 + $449; ads $2,500/mo or 15% of spend, $7.5K min
 * spend; sponsorship 20% rev-share, no setup fee; growth from $750). SLA
 * commitments (3 business days) adopted same date. One deliberate deviation:
 * NO hard download minimum on sponsorship — the "you don't need 20K downloads"
 * positioning is the differentiator and overrides the market-norm minimum.
 */

import type { ServiceSlug } from "./proof";

export interface ProcessStep {
  title: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface PriceTier {
  name: string;
  price: string;
  unit?: string;
  includes: string[];
  /** Renders with emphasis. One per service, at most. */
  featured?: boolean;
}

export interface Service {
  slug: ServiceSlug;
  /** Nav and card label. */
  name: string;
  /** One line, used on the index card and in metadata. */
  tagline: string;
  /** Hero headline. Outcome-led, not feature-led. */
  headline: string;
  /** Hero subhead, 1–2 sentences. */
  subhead: string;
  /** The single stat that sits under the hero. */
  heroProof: { value: string; label: string };
  /** The problem this service solves, stated before the offer. */
  problem: { title: string; body: string };
  /** What's included. These are deliverables, not benefits. */
  includes: string[];
  /** How it works. 3–5 steps. */
  process: ProcessStep[];
  /** Pricing. First tier's price becomes the "from" anchor. */
  pricing: {
    fromLabel: string;
    tiers: PriceTier[];
    /** Shown under the table in small type. */
    footnote?: string;
  };
  faqs: Faq[];
  /** Services to cross-link at the bottom. Order matters. */
  relatedSlugs: ServiceSlug[];
  /** Optional one-liner under the hero subhead (e.g. pay-per-booking). */
  heroNote?: string;
  /**
   * Optional named-placements strip above the FAQ. Names must come from
   * claude/placements-verified.md ONLY (clearance-gated).
   */
  placements?: {
    intro: string;
    names: string[];
    workLink: { label: string; href: string };
  };
  /** Optional DIY cross-link, one line above the footer. */
  diyLink?: { prompt: string; label: string; href: string };
  /** §6 fit qualifier — honest two-column lead qualification. */
  fit?: { forYou: string[]; notForYou: string[] };
  /**
   * §8 why-Podlink — the hybrid differentiator. Present-tense claims ONLY
   * for what exists; loop/report language stays future-tense.
   */
  whyPodlink?: { headline: string; body: string };
  /** §11 reassurance line under the final CTA — only claims true per docs. */
  reassurance?: string;
  /** SEO. */
  metaTitle: string;
  metaDescription: string;
}

export const services: Service[] = [
  // -------------------------------------------------------------------------
  {
    slug: "podcast-editing",
    name: "Podcast Editing",
    tagline: "Production that turns episodes into a business asset.",
    headline: "Hand us the raw file. Get back a show that earns its slot.",
    subhead:
      "Full-service audio and video production — edited, mixed, written up, published and measured. You record. We do everything after that.",
    heroProof: { value: "68+", label: "episodes produced for a single client" },
    problem: {
      title: "Most podcasts die in post-production",
      body: "Not because the conversation was bad — because the work after the conversation is relentless. Editing, mixing, show notes, art, uploads, distribution, analytics: every week, forever. Shows stop when that workload stops being worth it. We take the whole back half so the only thing on your calendar is the recording.",
    },
    includes: [
      "Audio editing, dialogue clean-up and audio engineering",
      "Noise reduction, music placement, mixing and mastering",
      "Intro, outro and ad insertion with correct ID3 tags",
      "Multi-camera video episode editing with cinematic b-roll",
      "Keyword-optimized show notes, written for search",
      "Episode art and YouTube thumbnails",
      "Publishing to every major platform on your content calendar",
      "Hosting, plus access to our in-network advertisers when you're ready to monetize",
    ],
    process: [
      {
        title: "Drop the file",
        body: "Upload your recording — Riverside, Zoom, Descript, a raw file, whatever you use — and give us the essentials for the episode.",
      },
      {
        title: "We produce",
        body: "Audio and video are edited, mixed and colour-matched. Show notes are written against your keywords. Art is built from your templates.",
      },
      {
        title: "You review",
        body: "One consolidated review across audio, video and clips. Feedback in one place, one revision included in every tier.",
      },
      {
        title: "We publish and measure",
        body: "Episode goes live across platforms with art, notes and links. Downloads and performance land in your monthly report.",
      },
    ],
    pricing: {
      fromLabel: "From $275 per episode",
      tiers: [
        {
          name: "Per episode",
          price: "$275",
          unit: "per episode, monthly",
          includes: [
            "Up to 60 minutes",
            "Audio editing, noise reduction, mixing",
            "Music, intro, outro, ads, ID3 tags",
            "One revision",
          ],
        },
        {
          name: "Produced show",
          price: "$950",
          unit: "per month, 4 episodes",
          featured: true,
          includes: [
            "Everything in Per episode, ×4",
            "Keyword-optimized show notes",
            "Transcripts",
            "Publishing and hosting",
            "Monthly analytics report",
          ],
        },
        {
          name: "Launch a new show",
          price: "$1,800",
          unit: "one-time, then from $2,200/mo",
          includes: [
            "Concept, positioning and format",
            "Logo, episode art and video assets",
            "Trailer production",
            "Ongoing production from launch",
          ],
        },
      ],
      footnote:
        "Add-ons: show notes $65 · episode art $250 · social graphics $675 · video clips from $250. Custom length, revision count and cadence priced on scope.",
    },
    faqs: [
      {
        q: "How much does podcast editing cost?",
        a: "Podcast editing costs from $275 per episode for full audio production — editing, mixing, show notes and publishing. Video episodes are priced separately, and add-ons like episode art and social graphics are itemized on this page. Episode length, revision count and cadence move the number; we put a precise figure on it in one call.",
      },
      {
        q: "What's included in audio episode editing?",
        a: "Dialogue editing and clean-up, noise reduction, levelling and mixing, music placement, intro and outro, ad insertion, correct ID3 tagging, and one round of revisions. Up to 60 minutes per episode as standard.",
      },
      {
        q: "What's included in video episode editing?",
        a: "Multi-camera cutting, colour and audio sync, cinematic b-roll, closed captions, episode description and publishing. Video episodes are priced separately from audio because they're a different production.",
      },
      {
        q: "Can I change how many episodes I publish each month?",
        a: "Yes. Cadence is set month to month, and per-episode pricing means moving from two to four episodes costs exactly what the extra episodes cost.",
      },
      {
        q: "Do you write the show notes?",
        a: "Yes, and we write them against the keywords your audience actually searches — show notes are a search asset, not a formality.",
      },
      {
        q: "Can you help with topics and guests?",
        a: "Yes. Topic strategy is part of our growth work and guest booking is a service in its own right. Most produced shows use at least one of the two.",
      },
      {
        // SLA adopted 2026-08-19 (decision sheet): 3 business days standard.
        q: "How fast is turnaround?",
        a: "Three business days from receiving the file to the edited episode, and we hold that on weekly shows — the shows we run publish on a fixed day every week, which only works if post-production is predictable. Rush turnaround is available.",
      },
      {
        q: "Who owns the files?",
        a: "You do. Masters, project files and assets are yours, and they live in a shared drive you keep access to.",
      },
    ],
    relatedSlugs: ["podcast-clips", "podcast-growth", "podcast-sponsorship"],
    fit: {
      forYou: [
        "You publish (or want to publish) on a fixed day every week, and post-production is the bottleneck",
        "You have recorded episodes sitting unpublished right now",
        "You want one team on audio, video, notes and publishing — not four vendors",
      ],
      notForYou: [
        "You want a one-off edit of a single episode — we're built for a publishing cadence",
        "You want to learn to edit yourself — the DIY tools below are the better buy",
        "You need same-day turnaround as the norm — our standard is three business days, held reliably",
      ],
    },
    whyPodlink: {
      headline: "The editors run on the same platform we sell",
      body: "Show notes and titles are drafted with the same AI tools in your Podlink dashboard, and every episode we publish is measured with OP3 — independent download numbers you can check yourself, not a vendor's report card about its own work.",
    },
    reassurance:
      "You own everything — masters, project files and assets live in a shared drive you keep access to.",
    diyLink: {
      prompt: "Rather do it yourself?",
      label: "AI show notes and episode templates",
      href: "/features/show-notes",
    },
    metaTitle: "Podcast Editing & Production | Podlink",
    metaDescription:
      "Full-service podcast editing, mixing, show notes, video and publishing. You record — we handle everything after. From $275 per episode.",
  },

  // -------------------------------------------------------------------------
  {
    slug: "podcast-clips",
    name: "Podcast Clips",
    tagline: "Short-form video that brings your show to where the audience is.",
    headline: "Your podcast lives in an app nobody opens to browse.",
    subhead:
      "We cut every episode into short-form video built for the feed — branded, captioned, in portrait and landscape, with the copy written to post.",
    heroProof: { value: "700+", label: "clips delivered across 20+ shows since 2021" },
    problem: {
      title: "Bridging the gap between podcast and audience",
      body: "Podcasts exist in the podcast player. People only go to the player for podcasts they already know. There's no discovery there and no virality. Your audience is on social media — so that's where the podcast has to go. Clips meet people where they already are, in the format they already want, and drive them back to the full episode.",
    },
    includes: [
      "2 professionally edited highlight clips per episode",
      "Cut to the strongest, most shareable moment — not the first 60 seconds",
      "Portrait for Instagram, TikTok and Shorts; landscape for YouTube and LinkedIn",
      "Custom branded frame, opening hook and closing call to action",
      "Cinematic b-roll and motion graphics",
      "Burned-in captions, transcribed and checked",
      "Written social copy and hashtags for every clip",
      "Optional scheduling and posting across three platforms",
    ],
    process: [
      {
        title: "We watch the whole episode",
        body: "Clip selection is the job. A human finds the moment that will actually travel — the argument, the number, the story — not an algorithm grabbing a timestamp.",
      },
      {
        title: "Cut and build",
        body: "Each moment is edited into a self-contained piece with a hook, your branded frame, b-roll, captions and a closing card that points back to the show.",
      },
      {
        title: "Sized for every feed",
        body: "Portrait and landscape versions of each clip, so one episode becomes four ready-to-post assets.",
      },
      {
        title: "Copy and post",
        body: "Social copy and hashtags written per clip. We can hand them over, or schedule and post them for you.",
      },
    ],
    pricing: {
      fromLabel: "From $250 per episode",
      tiers: [
        {
          name: "Clips add-on",
          price: "$250",
          unit: "per episode, 2 clips",
          includes: [
            "2 clips, portrait and landscape",
            "Branded frame and captions",
            "Social copy and hashtags",
          ],
        },
        {
          name: "Monthly clips",
          price: "$995",
          unit: "per month, 8–10 clips",
          featured: true,
          includes: [
            "4 episodes, 2 clips each",
            "Up to 20 assets across both aspect ratios",
            "Cinematic b-roll and motion graphics",
            "Scheduling across three platforms",
          ],
        },
        {
          name: "Premiere clips",
          price: "$850",
          unit: "per episode, 2 clips",
          includes: [
            "Everything in Clips add-on",
            "Extended b-roll and custom animation",
            "Bespoke calls to action per clip",
          ],
        },
      ],
      footnote:
        "Clip templates are built once against your brand and reused, so cost per clip drops as volume goes up. Two-episode and eight-clip minimums apply to monthly plans.",
    },
    faqs: [
      {
        q: "How much do podcast clips cost?",
        a: "Podcast clips cost from $250 per episode for two branded, captioned clips in portrait and landscape, with the social copy written to post. Templates are built once against your brand and reused, so the cost per clip drops as volume goes up. Monthly plans carry two-episode and eight-clip minimums.",
      },
      {
        q: "Do clips work if my show is audio-only?",
        a: "They work best with video, because the moment you're clipping is a person saying something. For audio-only shows we build motion-graphic treatments with captions and b-roll — effective, but if you're serious about clips, start recording video.",
      },
      {
        q: "Who picks the moments?",
        a: "A person on our team who has watched the episode. Clip selection is the single highest-leverage decision in the whole process and we don't outsource it or automate it.",
      },
      {
        q: "How many clips should I get per episode?",
        a: "Two is the standard and the right starting point — enough to test what lands without diluting the feed. Shows with an active social presence often move to four.",
      },
      {
        q: "Do you post them for me?",
        a: "If you want. We deliver the assets plus written copy and hashtags either way; scheduling and posting across three platforms is included in monthly plans.",
      },
      {
        // SLA adopted 2026-08-19: launch clip with the episode; batch within 3 business days.
        q: "When do the clips land?",
        a: "The launch clip ships with the episode — it goes out the day the episode drops, because the first 48 hours is when a new episode has the most pull. The remaining clips are released across the following two weeks so the episode keeps resurfacing instead of peaking once.",
      },
      {
        q: "What do I need to send you?",
        a: "The episode recording and your brand assets once. After that the templates exist and each episode is just the file.",
      },
    ],
    relatedSlugs: ["podcast-editing", "podcast-growth", "get-booked-on-podcasts"],
    fit: {
      forYou: [
        "You publish consistently but have no real short-form presence",
        "You know clips matter and can't sustain the per-episode cadence yourself",
        "You want branded, captioned clips sized for every feed — with the copy written to post",
      ],
      notForYou: [
        "You're expecting a viral clip on a schedule — nobody honest sells that",
        "You'd rather batch-cut clips yourself — the AI clip tools below are the better buy",
        "Your show publishes rarely — clips compound with cadence, and there's nothing to compound",
      ],
    },
    whyPodlink: {
      headline: "Cut by the team that also runs growth",
      body: "Your templates and brand kit are set up once and reused every episode, and the people cutting your clips are the same team running growth campaigns for shows — so clip choices come from what travels, not what's easy to cut.",
    },
    reassurance:
      "The launch clip ships the day the episode drops — the cadence is the deliverable.",
    diyLink: {
      prompt: "Rather do it yourself?",
      label: "The AI clip tools",
      href: "/features/clips-and-social",
    },
    metaTitle: "Podcast Clips & Short-Form Video | Podlink",
    metaDescription:
      "Two branded, captioned short-form clips per episode in portrait and landscape, with social copy written to post. From $250 per episode.",
  },

  // -------------------------------------------------------------------------
  {
    slug: "podcast-advertising",
    name: "Podcast Advertising",
    tagline: "For brands: buy podcast ads you can actually attribute.",
    headline: "Podcast ads work. Most of them just aren't tracked.",
    subhead:
      "Managed campaigns for brands — strategy, host-read creative, placement and optimization, with attribution built before a dollar goes out.",
    heroProof: {
      value: "17 months",
      label: "of continuous performance on a single campaign",
    },
    problem: {
      title: "The highest-intent channel with the worst reporting",
      body: "A host-read ad is an endorsement from someone the listener already trusts, delivered with none of the friction of a display unit. That's why it converts. The reason brands under-invest isn't performance — it's that most buys come back with an impression count and a shrug. We run campaigns you can attribute: tracked URLs, codes, UTMs, and a monthly report that ties spend to results.",
    },
    includes: [
      "Campaign strategy, audience matching and show selection",
      "Ad copy written for the host's voice, not read off a brief",
      "Creative assets and ad production",
      "Audience testing before scaling into direct placement",
      "Placement across audio and video: Spotify, Apple, iHeart, Pandora, YouTube, Meta, TikTok, LinkedIn",
      "Budget and talent management",
      "Tracked vanity URLs, promo codes and UTMs on every placement",
      "Dedicated account manager and monthly strategy and reporting sessions",
    ],
    process: [
      {
        title: "Strategy and setup",
        body: "Competitor ad analysis, audience keyword research, and a shortlist of shows whose listeners match your buyer. Campaign and tracking built before a dollar goes out.",
      },
      {
        title: "Test",
        body: "Three to five ad variations per audience go into rotation. We find the creative and the shows that work before committing budget.",
      },
      {
        title: "Direct placement",
        body: "Scale into the winners with direct host-read placements, negotiated rates and locked mid-roll positions.",
      },
      {
        title: "Optimize",
        body: "Monthly optimization against tracked conversions — not impressions. Underperforming shows are cut, winners get more weight.",
      },
    ],
    pricing: {
      fromLabel: "From $2,500 per month",
      tiers: [
        {
          name: "Managed campaigns",
          price: "$2,500",
          unit: "per month or 15% of spend (whichever is greater) + ad budget",
          featured: true,
          includes: [
            "Strategy, setup and tracking",
            "Ad copy, creative and production",
            "Placement and optimization",
            "Monthly reporting",
          ],
        },
        {
          name: "Strategy and launch",
          price: "$2,250",
          unit: "one-time",
          includes: [
            "Competitor and audience research",
            "Podcast market analysis",
            "Campaign strategy and platform setup",
            "Rolls into the monthly retainer",
          ],
        },
        {
          name: "Scaled spend",
          price: "$4,500",
          unit: "per month over $50K media spend",
          includes: [
            "Everything in Managed campaigns",
            "$5,500/month over $100K monthly spend",
            "Multi-audience campaigns run in parallel",
            "12–20 ad variations in rotation",
          ],
        },
      ],
      footnote:
        "Retainer scales with spend. Ad budget, voice talent and celebrity reads are billed separately. Six-month terms are standard. Selling ads on your own show is a different service — see Podcast Sponsorship.",
    },
    faqs: [
      {
        q: "How much does podcast advertising cost?",
        a: "Managed podcast advertising starts at $2,500 per month for campaign management, plus your ad budget. The retainer scales with spend; voice talent and celebrity reads are billed separately, and six-month terms are standard — host-read advertising compounds over quarters, not weeks.",
      },
      {
        q: "How is a podcast ad tracked?",
        a: "Vanity URLs with UTM parameters, unique promo codes, and post-purchase survey questions where the client can run one. Every placement gets its own identifier so you can see which show produced the conversion.",
      },
      {
        q: "What does a placement actually include?",
        a: "A 30–60 second host-read mid-roll baked into the feed, a link in the show notes, and — this is the part most networks don't do — a video ad tagged onto the social clips from that episode. One buy, three surfaces.",
      },
      {
        q: "How much budget do I need to start?",
        a: "Our minimum is $7,500 a month in media. Below that there isn't enough signal to optimize against — and we'd rather tell you that now than learn it with your budget.",
      },
      {
        q: "Can you show me what past sponsors got on a given show?",
        a: "Only if that show was running tracked placements, and most aren't — the standard in podcast sponsorship is still an impression count and a handshake. We instrument attribution before we place, on every show we buy on. If a show can't support tracking, we'll tell you that before you spend.",
      },
      {
        q: "How long before a campaign performs?",
        a: "Expect a testing phase in month one to two and direct placement scaling from month three. Host-read podcast advertising compounds; the campaigns that work best run for quarters, not weeks.",
      },
      {
        q: "I have a podcast — can you sell ads on it instead?",
        a: "That's the other side of this business and it has its own page. See Podcast Sponsorship: we build the rate card from your real audience data, run the outbound, and take a share of what we bring in.",
      },
    ],
    relatedSlugs: ["podcast-sponsorship", "podcast-growth", "podcast-clips"],
    fit: {
      forYou: [
        "You have a proven offer and a landing page ready for high-intent traffic",
        "You can commit a real test budget across at least eight weeks — testing is the strategy, not a delay",
        "You want spend tied to tracked conversions, not an impression count and a shrug",
      ],
      notForYou: [
        "You need positive ROAS in week one — host-read trust compounds, it doesn't spike",
        "You want one spot on one famous show — that's a brand splash, not a campaign",
        "You can't tolerate cutting underperformers — optimization means some shows get dropped",
      ],
    },
    whyPodlink: {
      headline: "We sit on both sides of this market",
      body: "We sell sponsorships for shows and buy placements for brands. That means we negotiate from real rate knowledge, read audience data the way sellers present it, and know which numbers survive checking — because on the other side of the table, we're the ones being checked.",
    },
    reassurance:
      "Tracked URLs, codes and UTMs on every placement — the monthly report shows what we see.",
    metaTitle: "Podcast Advertising Agency — Managed Ad Campaigns | Podlink",
    metaDescription:
      "Managed podcast ad campaigns for brands, with tracked attribution on every placement. Host-read audio plus social video. From $2,500 per month.",
  },

  // -------------------------------------------------------------------------
  {
    slug: "podcast-sponsorship",
    name: "Podcast Sponsorship",
    tagline: "For creators: sell your ad space for what it's actually worth.",
    headline: "Your show is worth more than its download number.",
    subhead:
      "We build the rate card off your real audience, take it to market, and close sponsors who renew — instead of selling one 30-second read at whatever the buyer offers.",
    heroProof: {
      value: "$20,000",
      label: "single four-episode sponsorship package closed",
    },
    problem: {
      title: "Shows undersell themselves because they lead with the wrong number",
      body: "Downloads are the number every host quotes and the number every buyer discounts. Meanwhile the audience has moved: on a show we run, audio downloads are down roughly 40% from their 2024 peak while video views on the same episodes crossed 30 million in a month. Sponsors aren't buying an RSS ping — they're buying attention, and attention is now spread across the feed, YouTube, and short-form. Price the whole audience and the number changes completely.",
    },
    includes: [
      "A real audience data pack: demographics, geography, platform split, completion rates",
      "Rate card and media kit built from that data, not from a template",
      "A package ladder — integration, integration plus social, product placement, full partnership",
      "Outbound prospecting into value-aligned brands, plus inbound handling",
      "Negotiation, terms and contracting",
      "Host-read scripts written in your voice, and ad production",
      "Social video ad units cut from the episode — the part most networks don't sell",
      "Tracked links and promo codes so sponsors can see their return",
      "Programmatic fill through Megaphone and the Spotify Audience Network as a revenue floor",
      "Renewal management — the whole point is the second contract, not the first",
    ],
    process: [
      {
        title: "Audit the audience",
        body: "We pull real numbers across every platform your show reaches — not just the host's dashboard. Most shows discover their sellable audience is several times the download figure they've been quoting.",
      },
      {
        title: "Build the rate card",
        body: "Packages priced off that data, laid out as a ladder so a brand can start small and scale. Plus the media kit that makes the case.",
      },
      {
        title: "Take it to market",
        body: "Targeted outbound into brands whose customers are already your listeners, and proper handling of the inbound that a growing show starts to attract.",
      },
      {
        title: "Produce and place",
        body: "Scripts in your voice, ad production, placement in the feed, and the social video units that extend the buy beyond the episode.",
      },
      {
        title: "Prove it and renew",
        body: "Tracked links and codes from day one, reporting the sponsor can act on, and a renewal conversation that starts from evidence. A sponsor who can see their return is a sponsor who re-signs.",
      },
    ],
    pricing: {
      fromLabel: "From 20% of what we sell — you pay nothing up front",
      tiers: [
        {
          name: "Managed ad sales",
          price: "20%",
          unit: "of sponsorship revenue sourced — no setup fee",
          featured: true,
          includes: [
            "We source and close the brands",
            "Episodic, monthly, season and presenting packages",
            "Scripts, ad production and placement",
            "We're paid when you are",
          ],
        },
        {
          name: "Rate card & media kit",
          price: "$2,500",
          unit: "one-time",
          includes: [
            "Full cross-platform audience data pack",
            "Positioning and package ladder design",
            "Rate card and media kit",
            "Yours to sell with, whoever sells it",
          ],
        },
        {
          name: "Full monetization",
          price: "$950",
          unit: "per month + revenue share",
          includes: [
            "Everything in Managed ad sales",
            "Programmatic fill via Megaphone and Spotify Audience Network",
            "Sponsor reporting and renewal management",
            "Ongoing inventory and pricing strategy",
          ],
        },
      ],
      footnote:
        "Rate card work credits against the first months of managed sales. Sponsorship rates on shows we currently represent run $3,000–$8,000 per episode with a four-episode minimum, and 20% off an eight-week commitment.",
    },
    faqs: [
      {
        q: "How much does podcast sponsorship representation cost?",
        a: "20% of the sponsorship revenue we bring in — you pay nothing up front. Rate card work credits against the first months of managed sales. For scale: shows we represent sell packages from $3,000 to $8,000 per episode, with a four-episode minimum.",
      },
      {
        q: "How many downloads do I need before I can sell ads?",
        a: "Most podcast ad agencies won't work with you until you're doing 10–20,000 downloads an episode. The median show does about 28. We exist for everyone the industry locks out — you don't need 20,000 downloads to be sponsorable; you need the right audience, proven. A show doing a few thousand downloads with an engaged, specific audience and real short-form reach is more sellable than a bigger, vaguer one. What matters is whether we can describe your listener precisely enough that a brand recognizes their customer.",
      },
      {
        q: "What's my show actually worth?",
        a: "It depends on the audience, not the format. The shows we represent sell packages from $3,000 to $8,000 per episode, with a four-episode minimum — but that pricing comes out of the audit, not off a shelf. The audit is the first thing we do.",
      },
      {
        q: "What does a sponsorship package include?",
        a: "The ladder starts at a host-read pre-roll plus a show-notes link. It goes up through a mid-roll and weekly social story with a tracked code, then on-set product placement and a short-form clip, and at the top a full partnership with a collab post, newsletter feature, landing page and sales attribution. Brands buy up the ladder once the first tier works.",
      },
      {
        q: "We've never had a sponsor. Is that a problem?",
        a: "No — it's the normal starting point, and it's why the data pack comes first. What we won't do is dress up a view count as performance data you don't have. We say what's measured, we instrument what isn't, and the first campaign becomes the proof for the next one.",
      },
      {
        q: "Can you prove a sponsorship worked?",
        a: "With tracked links and unique codes from day one, yes. The honest caveat: most of the podcast industry still doesn't do this, and a show arriving with no tracking history has no back-catalogue of results to show. Instrumenting it is the first thing we set up, because renewals are where the money is and renewals need evidence.",
      },
      {
        q: "Who owns the sponsor relationship?",
        a: "You do. We source, negotiate and manage, but the brands are your partners and the contracts are yours. That matters when a sponsor wants to expand into something we don't run.",
      },
      {
        q: "What about product placement?",
        a: "It's the most under-sold inventory in podcasting and, on video-first shows, the most valuable — a logo on the wall behind you is in every shot of every episode, forever. We sell these as year-long, category-exclusive deals rather than per-episode reads.",
      },
    ],
    relatedSlugs: ["podcast-growth", "podcast-clips", "podcast-advertising"],
    fit: {
      forYou: [
        "Your audience is engaged and specific — even if your download number is modest",
        "You publish consistently and can keep publishing through a sponsorship term",
        "You want sponsors who renew, which means sharing real audience data and proving return",
      ],
      notForYou: [
        "You want to sell one 30-second read at whatever the buyer offers — you don't need an agency for that",
        "You're not willing to share audience data — the data pack is what makes the rate card credible",
        "Your show is on pause — sponsors buy a running show, not a back catalog",
      ],
    },
    whyPodlink: {
      headline: "The rate card stands on checkable numbers",
      body: "Download data in your data pack comes from OP3 — an open, independent measurement standard a sponsor can verify themselves. A rate card a buyer can check is a rate card a buyer can approve, and it's why the renewal conversation starts from proof instead of promises.",
    },
    reassurance:
      "Renewal management is in every engagement — the whole point is the second contract.",
    metaTitle: "Podcast Sponsorship Sales — Monetize Your Show | Podlink",
    metaDescription:
      "We build your rate card from real audience data, sell your podcast sponsorship, and manage renewals. 20% of revenue sourced, nothing up front.",
  },

  // -------------------------------------------------------------------------
  {
    slug: "get-booked-on-podcasts",
    name: "Getting Booked on Podcasts",
    tagline: "Guest appearances that reach far past the show's own audience.",
    headline: "Other agencies book you a podcast. That's where we start.",
    subhead:
      "Strategy, media training, booking and — the part that changes the maths — social clips from every appearance, so the interview reaches the audience the show alone never had.",
    heroProof: { value: "134%", label: "lift in sign-ups from a booking campaign" },
    heroNote:
      "Pay-per-booking pricing — $750 to start, then $449 only when a show you approved says yes.",
    placements: {
      intro: "Recent placements",
      names: ["Crypto 101", "Edge of NFT", "New to Crypto", "Outlier Ventures"],
      workLink: { label: "21 verified episodes", href: "/work" },
    },
    problem: {
      title: "The podcast isn't the most important part of the appearance",
      body: "Here's the myth: you need top-tier shows, because top-tier shows have millions of listeners. Here's the reality: the top 1% of podcasts average about 4,000 downloads an episode. Chasing show size is chasing the wrong number. What actually determines reach is what happens to the interview after it airs — which is why every appearance we book comes with clips built to travel on social.",
    },
    includes: [
      "Podcast appearance strategy: outcomes, positioning and target audience",
      "SEO keyword research to define what you should be known for",
      "Media training: your story, your talking points, your signature call to action",
      "A personalized pitch one-pager used to sell you in",
      "Research on value-aligned shows — not a spray list",
      "Outreach, follow-up, scheduling, booking and confirmation",
      "A prep brief for every booked appearance",
      "2 professionally edited social clips per appearance, with copy and hashtags",
    ],
    process: [
      {
        title: "Position",
        body: "We define the two or three things you should be the go-to voice on, backed by keyword research, and build the pitch one-pager around them.",
      },
      {
        title: "Prepare",
        body: "Media training on your story, talking points and the call to action that sends listeners somewhere useful.",
      },
      {
        title: "Pitch and book",
        body: "A dedicated booking agent runs targeted outreach and follow-up, then handles scheduling and confirmation. First opportunities typically surface in about three weeks.",
      },
      {
        title: "Amplify",
        body: "Every appearance comes back as two social clips with written copy — so the episode keeps working after the release week.",
      },
    ],
    pricing: {
      fromLabel: "From $750 to start",
      tiers: [
        {
          name: "Pay per booking",
          price: "$750",
          unit: "to start, then $449 per booked appearance",
          includes: [
            "Strategy and pitch one-pager",
            "Outreach, booking and confirmation",
            "You approve every show before we book it",
            "You pay for results, not activity",
          ],
        },
        {
          name: "Appearance + clips",
          price: "$1,497",
          unit: "per appearance, billed monthly",
          featured: true,
          includes: [
            "Everything in Pay per booking",
            "Media training and prep briefs",
            "2 social clips per appearance",
            "Social copy and hashtags",
          ],
        },
        {
          name: "Thought leadership program",
          price: "$3,200",
          unit: "per month, six-month program",
          includes: [
            "2–4 booking opportunities per month",
            "Dedicated booking agent",
            "Clips on every appearance",
            "Paid social promotion of clips",
            "Multi-executive coverage available",
          ],
        },
      ],
      footnote:
        "Add-ons: additional executive $850 · paid social promotion of clips $400 per booking · blog post from the episode $600 · newsletter feature $550. Agency and white-label rates available at a 20-booking commitment.",
    },
    faqs: [
      {
        q: "How much does podcast guest booking cost?",
        a: "Podcast guest booking costs $750 to start — strategy, positioning, media training and the pitch materials — then $449 per booking, charged only when a show you approved says yes. Add-ons like paid social promotion of your clips are itemized on this page.",
      },
      {
        q: "How long until I'm booked on something?",
        a: "Roughly three weeks from kickoff to the first opportunities landing, based on how our campaigns have actually run. Booking rates then depend on your category and how distinctive your angle is.",
      },
      {
        q: "Can you guarantee a podcast a month?",
        a: "We don't guarantee volume, and be careful with anyone who does — it usually means low-quality placements chosen to hit a count. What we do offer is pay-per-booking pricing, so you only pay when a show you approved says yes.",
      },
      {
        q: "Do I get to approve the shows?",
        a: "Always. Nothing is booked without your sign-off, on every pricing model.",
      },
      {
        q: "Why do the clips matter so much?",
        a: "Because a mid-size show's own audience is usually a few thousand people. The clips are what put the interview in front of your network, the host's network, and a paid audience on top. The appearance is the raw material; the clips are the distribution.",
      },
      {
        q: "What does this do beyond reach?",
        a: "High-authority backlinks to your site, searchable third-party proof of your expertise, social content you didn't have to originate, and — for the people who show up prepared — a genuine lead channel. It's lead generation and content marketing in one motion.",
      },
      {
        q: "Do podcasts charge to have guests on?",
        a: "Reputable ones don't. Some pay-to-play networks do, and we don't book them — an appearance you bought reads as an appearance you bought.",
      },
    ],
    relatedSlugs: ["podcast-clips", "podcast-growth", "podcast-advertising"],
    fit: {
      forYou: [
        "You're a founder or expert with a clear offer and a point of view worth interviewing",
        "You'll put in the prep — media training and a sharp one-pager are part of the process",
        "You care what happens after the interview airs — clips and amplification are why the maths works",
      ],
      notForYou: [
        "You want the longest possible list of bookings regardless of fit — we don't run a spray list",
        "You only want top-1% shows — the reality is reach comes from what travels after, not show size",
        "You can't commit to actually showing up consistently — bookings without appearances burn hosts",
      ],
    },
    whyPodlink: {
      headline: "The appearance is the start, not the deliverable",
      body: "Every appearance we book comes with social clips built to travel — cut by the same team that sells clips as a service. The show's own audience is the floor; the clips are how an interview reaches the audience the show alone never had.",
    },
    reassurance:
      "Pay-per-booking available: $449 only when a show you approved says yes.",
    metaTitle: "Get Booked on Podcasts — Guest Booking & Digital PR | Podlink",
    metaDescription:
      "Podcast guest booking with strategy, media training, vetted placements and social clips from every appearance. From $750 to start plus $449 per booking.",
  },

  // -------------------------------------------------------------------------
  {
    slug: "podcast-growth",
    name: "Podcast Growth",
    tagline: "Turn a show that exists into a show that compounds.",
    headline: "Growth is a system, not a posting schedule.",
    subhead:
      "Positioning, data-driven topic strategy, search and AI optimization, and paid distribution behind your best moments — measured against downloads, leads and revenue.",
    heroProof: { value: "31M", label: "views in a month for one show we run" },
    problem: {
      title: "Good shows plateau for boring reasons",
      body: "Discovery inside podcast apps barely exists. Search barely indexes audio. So a show that's genuinely good stalls at whatever audience its host's network can supply — and the host concludes the show isn't working. It is working. It just has no distribution. Growth means building the distribution the podcast ecosystem doesn't give you.",
    },
    includes: [
      "Market positioning and target audience profile",
      "Data-driven topic strategy: brand keywords, top searched questions, trending content and competitor analysis",
      "Episode topic and interview question recommendations",
      "Podcast SEO and AEO — episode pages written to be found in search and cited in AI answers",
      "Paid social distribution: custom audience creation and 6 ads per episode across 3 platforms",
      "Email growth campaigns to your show's ideal audience",
      "Content repurposing: one recording atomized into blogs, clips, social and newsletter",
      "Monthly KPI reporting across downloads, reach, traffic, leads and cost per result",
    ],
    process: [
      {
        title: "Benchmark",
        body: "We establish where your show actually sits. Podcasts with 231+ downloads in the first seven days are already in the top 10% — most hosts have no idea whether they're there.",
      },
      {
        title: "Position and plan",
        body: "Audience profile, positioning, and a topic strategy built from what your buyers actually search — not from what you feel like talking about.",
      },
      {
        title: "Make it findable",
        body: "Episode pages, titles and descriptions optimized for search and for AI answer engines, so back-catalogue episodes keep earning.",
      },
      {
        title: "Distribute",
        body: "Clips go behind paid social against a custom audience. Email sequences drive your ideal listener to the show. One recording becomes ten pieces of content.",
      },
      {
        title: "Report and compound",
        body: "Monthly reporting on downloads, reach, traffic, leads, SQLs and cost per result — so growth spend is judged like every other channel.",
      },
    ],
    pricing: {
      fromLabel: "From $750 per campaign",
      tiers: [
        {
          name: "Growth campaign",
          price: "$750",
          unit: "per campaign",
          includes: [
            "Email campaign to 1,000 targeted contacts",
            "5-email sequence, 5,000 touchpoints",
            "Or paid social campaign + ad spend",
          ],
        },
        {
          name: "Paid distribution",
          price: "$1,500",
          unit: "per month + ad spend",
          featured: true,
          includes: [
            "Custom target audience creation",
            "6 paid ads per episode across 3 platforms",
            "Clips promoted to a new audience",
            "Monthly optimization",
          ],
        },
        {
          name: "Full growth engagement",
          price: "$6,750",
          unit: "per month + one-time setup",
          includes: [
            "Positioning and audience profile",
            "Data-driven topic and keyword strategy",
            "SEO and AEO across the catalogue",
            "Video podcast + content repurposing",
            "Paid distribution and monthly KPI reporting",
          ],
        },
      ],
      footnote:
        "Full engagements carry a one-time strategy and setup fee and typically run six months, which is the shortest window where compounding is visible.",
    },
    faqs: [
      {
        q: "How much does podcast growth marketing cost?",
        a: "Podcast growth campaigns start at $750. Full engagements carry a one-time strategy and setup fee and typically run six months — the shortest window where compounding is visible — with monthly KPI reporting included in the scope.",
      },
      {
        q: "How do I know if my show is actually underperforming?",
        a: "By percentile, not vanity numbers. In the first seven days: 26+ downloads is the top 50%, 72+ is the top 25%, 231+ is the top 10%, 539+ is the top 5%, and 3,062+ is the top 1%. Most hosts are doing better than they think and distributing worse than they think.",
      },
      {
        q: "How long does growth take?",
        a: "Paid distribution moves numbers inside a month. Positioning, topic strategy and search compound over quarters. We scope six months because that's the shortest honest window.",
      },
      {
        q: "What's AEO and why does it matter for a podcast?",
        a: "Answer engine optimization — writing episode pages so AI assistants surface and cite them. A growing share of the people looking for what your show covers now ask a model instead of a search box. Podcast back-catalogues are almost entirely invisible to those systems, which makes it cheap ground to take.",
      },
      {
        q: "Do I need to be on video?",
        a: "It's the single highest-leverage change most shows can make, and we've watched the split happen inside our own numbers. On a show we run, audio downloads are down roughly 40% from their 2024 peak while video views on the same episodes crossed 30 million in a month. The audience didn't leave — it moved. Judging a show by downloads alone now measures the shrinking half.",
      },
      {
        q: "What do you report on?",
        a: "Downloads, YouTube views, website visits, reach by platform, marketing contacts, leads, SQLs, customers, and cost per each. Growth work should be judged the way you judge every other channel.",
      },
    ],
    relatedSlugs: ["podcast-clips", "podcast-sponsorship", "get-booked-on-podcasts"],
    fit: {
      forYou: [
        "Your show is good and plateaued — the boring reasons are fixable and we look for them first",
        "You're ready to treat the show like a channel: benchmarks, monthly KPIs, decisions from data",
        "You're on video, or willing to be — it's the single highest-leverage change most shows can make",
      ],
      notForYou: [
        "You want growth without changing anything about the show — positioning is usually part of the fix",
        "You judge only by downloads — the audience has split across feeds, YouTube and short-form, and we report it all",
        "You publish irregularly — distribution can't compound on an unpredictable cadence",
      ],
    },
    whyPodlink: {
      headline: "Growth judged like a channel, on measured data",
      body: "The reporting runs on the platform's own measurement: OP3 downloads that anyone can check, YouTube views on the same episodes, plus visits, leads and cost per each. When we say something worked, you can see it in numbers you don't have to take from us.",
    },
    reassurance:
      "Monthly KPI reporting is in the scope — judged the way you judge every other channel.",
    diyLink: {
      prompt: "Rather do it yourself?",
      label: "The download analytics",
      href: "/features/download-analytics",
    },
    metaTitle: "Podcast Growth — Audience, SEO & Paid Distribution | Podlink",
    metaDescription:
      "Podcast growth built as a system: positioning, topic strategy, SEO and AEO, paid distribution and monthly KPI reporting. From $750 per campaign.",
  },
];

// ---------------------------------------------------------------------------

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Index page copy. */
export const servicesIndex = {
  eyebrow: "Services",
  headline: "Everything a podcast needs, past the recording.",
  subhead:
    "We've produced, grown, monetized and booked podcasts since 2021 — for solo creators, funded startups and national brands. Six services that work on their own and compound together.",
  closing: {
    headline: "Most shows need two of these, not one.",
    body: "Booking feeds clips. Clips feed growth. Growth makes advertising worth selling. We scope the combination that fits where your show actually is.",
    cta: "Book a call",
  },
};
