/**
 * Proof: case studies, testimonials, and logos.
 *
 * Client permission was granted across the board on 2026-08-18, so everything
 * here is `cleared` EXCEPT two entries held back on a factual question rather
 * than a permission one — see `needs-verification` below. Those stay hidden
 * while SHOW_UNCLEARED_PROOF is false.
 *
 * Source of truth for the underlying evidence:
 *   claude/podlink-services-evidence-brief.md
 */

/** Master switch. Set to true only in a preview build. */
export const SHOW_UNCLEARED_PROOF = false;

export type Clearance =
  /** Cleared to publish. */
  | "cleared"
  /** Reserved. Kept in the union so a future entry can be staged. */
  | "needs-permission"
  /**
   * The number itself is unconfirmed — it appears in our own 2022 marketing
   * with no underlying campaign report behind it. Permission does not fix this;
   * only confirming the campaign was ours does.
   */
  | "needs-verification";

export type ServiceSlug =
  | "podcast-editing"
  | "podcast-clips"
  | "podcast-advertising"
  | "podcast-sponsorship"
  | "get-booked-on-podcasts"
  | "podcast-growth";

export interface CaseStudy {
  id: string;
  /** URL slug for /case-studies/[slug]. Kebab-case of id. */
  slug: string;
  /** Client or show name as it should appear. */
  client: string;
  /** Show name, when different from the client. */
  show?: string;
  industry: string;
  services: ServiceSlug[];
  /** The single number that leads. Keep it short — it renders large. */
  headline: string;
  /** One sentence on what was actually done. */
  what: string;
  /** Supporting metrics. 2–4 reads best. */
  metrics: { value: string; label: string }[];
  /**
   * The long-form narrative for /case-studies/[slug]. Written only for
   * `cleared` entries, and only from facts in the evidence brief.
   */
  story?: { challenge: string; approach: string; results: string };
  /**
   * Pull quote for /case-studies/[slug] — the id of a testimonials[] entry
   * from THIS client only. Set only where the match is exact; the page omits
   * the section otherwise. Lookup stays clearance-gated via
   * getTestimonialById().
   */
  testimonialId?: string;
  clearance: Clearance;
  /** Internal only. Never rendered. */
  note?: string;
}

/**
 * CVS Health: restored 2026-08-19 at founder direction as an OUTCOMES-ONLY
 * case study — the engagement was real (signed 2021-07-29, $10,500 closed won,
 * campaign ran on Spotify + AudioGo/Pandora/iHeartRadio via CVS's employer
 * branding team). NEVER add to it: the 66% cost-per-candidate figure (it was
 * Straight Line Hiring's claim, copy-pasted), any applications/hires claim
 * (client's own record: clicks but 0 tracked applications), "exceeded demand
 * goals", the veterans vertical, or free training certificates. Evidence chain:
 * claude/podlink-services-evidence-brief.md Part 3.
 *
 * Oracle NetSuite stays OUT permanently — no client relationship ever existed.
 */
export const caseStudies: CaseStudy[] = [
  {
    id: "opolis",
    slug: "opolis",
    client: "Opolis",
    show: "Unemployable",
    industry: "Fintech / future of work",
    services: ["get-booked-on-podcasts", "podcast-clips", "podcast-growth"],
    headline: "32% membership growth",
    what:
      "Booked the co-founder on ICP-matched shows, cut every appearance into social clips, and repurposed transcripts into blog content and paid social.",
    metrics: [
      { value: "325%", label: "audience engagement, season two" },
      { value: "100%", label: "increase in podcast page traffic" },
      { value: "68%", label: "more qualified leads" },
      { value: "$70", label: "reduction in cost per lead" },
    ],
    story: {
      challenge:
        "Opolis had a genuinely differentiated story — employment infrastructure for the future of work — and a podcast, Unemployable, whose downloads sat in the 99–250 per episode range. That's actually the top 10% of all podcasts, but it wasn't translating into the thing the business needed: qualified members. The show and the founder's expertise were an underused growth asset.",
      approach:
        "We treated the founder as the channel, not just the show. We researched and booked ICP-matched podcasts across the future-of-work space, cut every appearance into social clips built to travel, and repurposed episode transcripts into blog content and paid social — so each interview kept working long after it aired.",
      results:
        "Membership grew 32% on the back of the interview campaign. Season two audience engagement rose 325%, podcast page traffic doubled, qualified leads rose 68%, and cost per lead dropped by $70.",
    },
    testimonialId: "lapidus",
    clearance: "cleared",
  },
  {
    id: "my-divorce-solution",
    slug: "my-divorce-solution",
    client: "My Divorce Solution",
    industry: "Financial services",
    services: ["podcast-editing", "podcast-clips", "podcast-growth"],
    headline: "$70K in new MRR within 90 days",
    what:
      "Took over full production and turned the show into the category's authority asset — editing, show notes, episode art, clips and repurposing that added $70K in monthly recurring revenue within 90 days.",
    metrics: [
      { value: "$70K", label: "monthly recurring revenue added in 90 days" },
      { value: "150%", label: "increase in website traffic" },
      { value: "70%", label: "growth in podcast subscribers" },
      { value: "5 yrs", label: "and still a client" },
    ],
    story: {
      challenge:
        "My Divorce Solution helps people through the financial side of divorce — a category where trust is everything and where the founders' expertise was the product. They needed the podcast to establish category authority, and they needed the relentless weekly work of production off their plate so it would actually keep shipping.",
      approach:
        "We took over the show end to end: editing, mixing, keyword-optimized show notes, episode art, publishing and clips, plus repurposing episodes into content for the site. The show hit its 50-episode milestone within months of us taking over, and production has run continuously ever since — 68 and counting.",
      results:
        "Website traffic rose 150%, podcast subscribers grew 70%, and site conversion improved 50% as the show became the category's authority asset. The relationship is now more than five years old and still active — the longest-running engagement on our books.",
    },
    /* chellew-2, not chellew — chellew still needs Karen's sign-off on the
       Podlink attribution (see its note). */
    testimonialId: "chellew-2",
    clearance: "cleared",
    note:
      "The $70K/90-day figure was confirmed accurate by Joelle 2026-08-19. The alternate '65% monthly revenue increase' line from the 2022 site copy stays retired.",
  },
  {
    id: "docsend",
    slug: "docsend",
    client: "DocSend (Dropbox)",
    industry: "SaaS",
    services: ["get-booked-on-podcasts"],
    headline: "134% lift in sign-ups",
    what:
      "Researched the shows their buyers actually listen to, built tailored talking points, and booked the CEO across the VC and startup circuit.",
    metrics: [
      { value: "134%", label: "increase in Fundraising Playbook sign-ups" },
      { value: "Named", label: "placements incl. Success Story and The Full Ratchet" },
      { value: "SEO", label: "high-authority backlinks earned" },
    ],
    story: {
      challenge:
        "DocSend wanted more founders in its Fundraising Playbook funnel, and its CEO had exactly the expertise those founders were looking for. The question was distribution: how do you put that expertise in front of people actively raising, rather than a general business audience?",
      approach:
        "We researched the shows DocSend's buyers actually listen to — the VC and startup circuit, not the biggest shows by download count — built tailored talking points for each appearance, and ran outreach, booking and scheduling for the CEO.",
      results:
        "Sign-ups for the Fundraising Playbook rose 134%, with verified placements including Success Story and The Full Ratchet, and high-authority backlinks that kept paying off in search long after the episodes aired.",
    },
    clearance: "cleared",
  },
  {
    id: "hell-has-an-exit",
    slug: "hell-has-an-exit",
    client: "Hell Has an Exit",
    industry: "Health & recovery media",
    services: ["podcast-growth", "podcast-clips", "get-booked-on-podcasts", "podcast-advertising"],
    headline: "74% download growth in 4 months",
    what:
      "Full growth engagement for the show itself — video episodes, clips, high-profile guest booking, and paid promotion on YouTube and Facebook to put the best moments in front of new listeners.",
    metrics: [
      { value: "74%", label: "more downloads in four months" },
      { value: "4,000", label: "listeners grown to" },
      { value: "250%", label: "increase in reviews, at a 4.9★ rating" },
      { value: "Odom", label: "Lamar Odom and Jordan Belfort booked onto the show — both episodes still live" },
    ],
    story: {
      challenge:
        "A recovery-focused show with powerful stories and a small audience — the classic case of content stronger than its distribution.",
      approach:
        "We turned episodes into video, cut the strongest moments into clips, booked guests big enough to bring their own audiences — Lamar Odom (Ep. 45) and Jordan Belfort (Ep. 50), both still live on YouTube — and ran paid promotion on YouTube and Facebook behind the clips.",
      results:
        "Downloads grew 74% in four months, the audience reached 4,000 listeners, and reviews grew 250% at a 4.9-star rating — growth from distribution, not from changing the show.",
    },
    clearance: "cleared",
  },
  {
    id: "united-recovery-project",
    slug: "united-recovery-project",
    client: "United Recovery Project",
    industry: "Healthcare / addiction treatment",
    services: ["podcast-advertising"],
    headline: "Podcast ads as a treatment-lead channel",
    what:
      "A separate engagement from the show: paid audio advertising on top streaming platforms, built to reach a new audience and generate admissions leads for the treatment center.",
    metrics: [
      { value: "Audio-first", label: "campaign on top streaming platforms" },
      { value: "New ICP", label: "audience reached beyond existing channels" },
      { value: "Leads", label: "measured against the center's intake, not impressions" },
    ],
    story: {
      challenge:
        "Addiction-treatment marketing is restricted, expensive and saturated on search and social — the usual lead channels were crowded and costly.",
      approach:
        "Audio advertising placed where the audience actually was, with creative built for the sensitivity of the category and the campaign judged on intake conversations, not reach.",
      results:
        "Podcast advertising became a working lead channel for the center alongside its existing acquisition — the engagement that later informed how we pitch audio as a performance channel, not a branding line.",
    },
    clearance: "cleared",
    note:
      "Outcomes-only: the specific figures from the 2021 case-studies doc (50% downloads, 2× close rate, ⅓ cost) belong to the discredited CVS-era doc family — do not restore without a primary source.",
  },
  {
    id: "fruits-of-motherhood",
    slug: "fruits-of-motherhood",
    client: "Fruits of Motherhood",
    industry: "Parenting / creator",
    services: ["podcast-growth", "podcast-clips", "podcast-sponsorship"],
    headline: "14× audience growth in 3 months",
    what:
      "Created, branded and launched the show, then grew it with clips and full videocasts and monetized it with aligned brand partners.",
    metrics: [
      { value: "14×", label: "audience growth in three months" },
      { value: "$10k+", label: "monthly advertising revenue" },
      { value: "$18k", label: "in partner sales in a single week" },
      { value: "Book", label: "deal secured off the back of the show" },
    ],
    story: {
      challenge:
        "Fruits of Motherhood started from zero — no show, no audience, no sponsors. The host had the voice and the community instinct; everything else had to be built, and built fast enough to prove the show could be a business rather than a hobby.",
      approach:
        "We created, branded and launched the show, then grew it with the full system: short-form clips, full videocasts, and paid distribution. Once the audience was real, we monetized it with value-aligned brand partners whose customers were already listening.",
      results:
        "The audience grew 14× in three months. Advertising revenue passed $10k a month, one partner promotion drove $18k in sales in a single week, and the show's momentum secured the host a book deal.",
    },
    clearance: "cleared",
  },
  {
    id: "worthy",
    slug: "worthy",
    client: "Worthy",
    show: "Moms Moving On",
    industry: "Consumer marketplace",
    services: ["podcast-advertising", "podcast-sponsorship"],
    headline: "17 months of consistent performance",
    what:
      "Sourced the partnership, wrote the host-read scripts, and ran the campaign across audio, Instagram and Facebook with tracked vanity URLs.",
    metrics: [
      { value: "17 mo", label: "of continuous campaign performance" },
      { value: "15%", label: "growth in show listenership year over year" },
      { value: "2×", label: "growth in the host's Instagram following" },
    ],
    story: {
      challenge:
        "Worthy, the online jewelry marketplace, wanted to reach women navigating divorce — exactly the audience of Moms Moving On. Podcast sponsorships in that position usually run a few episodes and quietly end, because neither side can see what's working.",
      approach:
        "We sourced the partnership, wrote host-read scripts in the host's own voice, and ran the campaign across audio, Instagram and Facebook — with tracked vanity URLs on every placement so Worthy could see what the spend produced.",
      results:
        "The campaign ran for 17 consecutive months — a renewal record that only happens when a sponsor can see their return. Over the same period the show's listenership grew 15% year over year and the host's Instagram following doubled, making the inventory more valuable as the campaign ran.",
    },
    clearance: "cleared",
    note:
      "Founder-approved 2026-08-19. Relationship concluded in 2024 — keep the 17-month campaign in past tense and never imply it is ongoing.",
  },
  {
    id: "cvs-health",
    slug: "cvs-health",
    client: "CVS Health Careers",
    industry: "Healthcare / talent acquisition",
    services: ["podcast-advertising"],
    headline: "A Fortune-5 employer brand, on audio",
    what:
      "Recruitment advertising for CVS Health Careers — audio placements across Spotify, Pandora and iHeartRadio, built to put the employer brand in front of candidates in key hiring markets.",
    metrics: [
      { value: "Fortune 5", label: "employer trusted us with its candidate brand" },
      { value: "3", label: "audio platforms: Spotify, Pandora, iHeartRadio" },
      { value: "Geo-focused", label: "awareness aimed at strategic hiring locations" },
    ],
    story: {
      challenge:
        "CVS Health needed candidate awareness in specific hiring markets, and the usual recruitment channels — job boards, paid search — were saturated with every other employer chasing the same applicants.",
      approach:
        "Working with CVS's employer branding team, we took the recruitment message to audio: campaign strategy, ad creative and placements across Spotify and the AudioGo network (Pandora, iHeartRadio), geo-focused on the locations where hiring demand was highest.",
      results:
        "The campaign put CVS's employer brand in front of hundreds of thousands of listeners in its target markets and drove measurable click-through to its careers pages — an early, instructive test of audio as a candidate-awareness channel for one of the country's largest employers.",
    },
    clearance: "cleared",
    note:
      "Outcomes-only by founder direction (2026-08-19). See the banned-claims list in the file header before editing this entry.",
  },
  {
    id: "belfort",
    slug: "belfort",
    client: "Jordan Belfort",
    show: "Sales School & The Wolf's Den",
    industry: "Business / media",
    services: ["podcast-editing", "podcast-sponsorship", "podcast-growth"],
    headline: "A million-dollar podcast in year one",
    what:
      "Built a five-day-a-week short-form show from new and archived material, and secured advertisers before launch.",
    metrics: [
      { value: "2 days", label: "to New & Noteworthy after launch" },
      { value: "Pre-launch", label: "advertisers secured" },
      { value: "Year 1", label: "to seven figures" },
    ],
    story: {
      challenge:
        "Jordan Belfort's team wanted a podcast that made money — not a vanity project. That meant a format that could sustain a heavy publishing schedule, and advertisers on board before the first episode aired rather than someday after.",
      approach:
        "We built Sales School as a five-day-a-week short-form show, produced from a mix of new recordings and archived material so the cadence was sustainable, and secured advertisers before launch so the show was revenue-positive from day one.",
      results:
        "The show hit Apple's New & Noteworthy within two days of launch, carried its pre-launch advertisers into the schedule, and became a million-dollar podcast in its first year.",
    },
    testimonialId: "walsh",
    clearance: "cleared",
  },
  {
    id: "koii",
    slug: "koii",
    client: "Koii Network",
    industry: "Web3",
    services: ["get-booked-on-podcasts", "podcast-clips"],
    headline: "6 named placements",
    what:
      "Positioned the co-founder around two expertise areas, built the pitch one-pager, and booked the crypto and Web3 circuit.",
    metrics: [
      { value: "6", label: "verified episodes incl. Edge of NFT (twice) and Crypto 101" },
      { value: "22,000", label: "promoted reach per episode with clips" },
    ],
    story: {
      challenge:
        "Koii Network was building in web3, a category crowded with founders all pitching the same shows. The co-founder needed to stand for something specific enough that hosts would say yes — and appearances needed to reach beyond each show's own audience.",
      approach:
        "We positioned the co-founder around two defined expertise areas, built the personalized pitch one-pager used to sell him in, and ran targeted outreach across the crypto and web3 circuit. Every booked appearance came back as social clips with promotion behind them.",
      results:
        "Six verified episodes across the crypto circuit — Edge of NFT twice, Crypto 101, New to Crypto, CryptoNews and Outlier Ventures' Metaverse Podcast. With clips and promotion, each episode reached a promoted audience of 22,000 beyond the show's own listeners.",
    },
    clearance: "cleared",
  },
  {
    id: "recon-food",
    slug: "recon-food",
    client: "Recon Food",
    show: "Spencer & Sophia Rascoff",
    industry: "Consumer tech",
    services: ["get-booked-on-podcasts", "podcast-clips"],
    headline: "Five placements for a father-daughter founding team",
    what:
      "Booked Zillow co-founder Spencer Rascoff and his teenage co-founder Sophia across the startup and creator circuit — a story-first campaign that earned a second contract.",
    metrics: [
      { value: "5", label: "completed placements incl. Success Story and Dear FoundHer" },
      { value: "2", label: "founders positioned, together and separately" },
      { value: "Renewed", label: "into a second booking contract" },
    ],
    story: {
      challenge:
        "A new social app with a famous co-founder needed the story told past the obvious tech press — and Sophia, the teenage co-founder, was the differentiated voice nobody was hearing.",
      approach:
        "We positioned the pair as a story, not a pitch: the Zillow founder building with his daughter. Targeted shows across startup, founder and Gen-Z audiences, with separate angles for Spencer solo, Sophia solo, and the two together.",
      results:
        "Five completed interviews, including Success Story, Dear FoundHer, #GenZ and a cross-booking with Impact with John Shegerian — and the engagement renewed into a second contract to keep booking.",
    },
    clearance: "cleared",
  },
  {
    id: "t3-live",
    slug: "t3-live",
    client: "T3 Live",
    show: "Madam Trader",
    industry: "Trading education",
    services: ["get-booked-on-podcasts", "podcast-clips"],
    headline: "Two brands, one booking engine, two years",
    what:
      "Guest placements and clips for T3 Live's traders, then a second engagement building visibility for Ashley Kyle Miller's Madam Trader podcast — bookings, clips and growth in one motion.",
    metrics: [
      { value: "5+", label: "shows booked across both engagements" },
      { value: "7+", label: "episodes clipped, two clips each, both aspect ratios" },
      { value: "2 yrs", label: "relationship across two signed engagements" },
    ],
    story: {
      challenge:
        "A trading-education firm with real experts and a new female-hosted trading podcast — in a category where credibility is everything and attention is bought expensively.",
      approach:
        "Phase one put T3's traders on trading and finance shows with clips from every appearance. Phase two flipped the motion for Madam Trader: booking Ashley as a guest on women-in-business and finance shows while clipping her own episodes for social.",
      results:
        "Placements including Seeking Alpha, Trading Justice, Wings of Inspired Business and Unemployable, with a per-episode clip pipeline the client's team could share directly. The client's own words after one placement: their trader called it the best show he'd done.",
    },
    clearance: "cleared",
    note: "Do not add booking-volume claims — pace vs. contract was contested in early 2022. Stick to named placements.",
  },
  {
    id: "mudrex",
    slug: "mudrex",
    client: "Mudrex",
    industry: "Crypto / fintech",
    services: ["get-booked-on-podcasts", "podcast-clips"],
    headline: "A crypto CEO, placed where investors listen",
    what:
      "Thought-leadership placements for CEO Edul Patel — podcast interviews plus a written-contributor seat, each appearance cut into branded clips.",
    metrics: [
      { value: "3", label: "placements: Success Story, Token Metrics, Seeking Alpha" },
      { value: "CEO", label: "positioned across investor and crypto audiences" },
      { value: "Multi-format", label: "clip frames built in three aspect ratios" },
    ],
    story: {
      challenge:
        "A crypto investing platform needed its CEO visible to retail investors during a crowded, noisy market cycle — with credibility, not hype.",
      approach:
        "Positioning and pitch materials for Edul Patel, targeted outreach to investing and crypto shows, and a clip pipeline so every appearance became social assets in three formats.",
      results:
        "Interviews on Success Story and Token Metrics with delivered clip sets, plus a Seeking Alpha contributor placement — podcast, video and written authority from one campaign.",
    },
    clearance: "cleared",
  },
  {
    id: "shiftpixy",
    slug: "shiftpixy",
    client: "ShiftPixy",
    industry: "Gig economy / HR tech (NASDAQ: PIXY)",
    services: ["get-booked-on-podcasts", "podcast-clips"],
    headline: "A public-company CEO on the founder circuit",
    what:
      "Guest placements for CEO Scott Absher with custom ticker-branded clip frames — public-company credibility, startup-show reach.",
    metrics: [
      { value: "NASDAQ", label: "listed client — investor-grade compliance bar" },
      { value: "2", label: "interviews published incl. Minimally Viable" },
      { value: "Custom", label: "PIXY-branded clip frames, client-approved" },
    ],
    story: {
      challenge:
        "A NASDAQ-listed gig-economy company whose CEO had a genuine story about the future of work — and a communications bar set by being a public company.",
      approach:
        "Placements chosen for substance over volume, custom clip frames carrying the ticker, and client review built into every deliverable.",
      results:
        "Published interviews including Minimally Viable and Off The Record, with the Minimally Viable clip strong enough that we used it as the example in our own pitches afterward.",
    },
    clearance: "cleared",
  },
  {
    id: "qualsights",
    slug: "qualsights",
    client: "QualSights",
    industry: "Consumer insights SaaS",
    services: ["get-booked-on-podcasts", "podcast-clips"],
    headline: "Two executives, two audiences, one pipeline",
    what:
      "Booked the CEO and the insights lead on different circuits — founder shows for one, CPG and commerce shows for the other — with media training and clips for both.",
    metrics: [
      { value: "2", label: "executives booked: CEO and insights lead" },
      { value: "2", label: "named placements: Success Story, Commerce Code" },
      { value: "Full", label: "media training incl. mock interviews and SEO keyword work" },
    ],
    story: {
      challenge:
        "An insights platform selling to two different buyers — founders and CPG insights teams — needed both stories told, by different voices, to different audiences.",
      approach:
        "Separate positioning and pitch one-pagers per executive, mock-interview media training, SEO keyword research to sharpen talking points, and a per-appearance clip pipeline.",
      results:
        "CEO Nihal Advani on Success Story and Jared Carr on Commerce Code, each with produced clips — the two-executive model that later became our multi-exec package.",
    },
    clearance: "cleared",
  },
  {
    id: "ritual-harvesting-happiness",
    slug: "ritual-harvesting-happiness",
    client: "Ritual",
    show: "Harvesting Happiness",
    industry: "Consumer wellness",
    services: ["podcast-sponsorship"],
    headline: "A national brand, placed on a show we represent",
    what:
      "Sold Harvesting Happiness inventory to Ritual through its media agency — premium host-read spots in a flight alongside some of the biggest shows in podcasting.",
    metrics: [
      { value: "$4,200", label: "gross per host-read spot placed" },
      { value: "Ad Results", label: "closed through the brand's own media agency" },
      { value: "Major flight", label: "placed alongside This Past Weekend with Theo Von" },
    ],
    story: {
      challenge:
        "Independent shows rarely get bought by national consumer brands — agency buyers default to the top 100 and the networks that rep them.",
      approach:
        "As Harvesting Happiness's network rep, we took the show's audience case to Ritual's media agency and handled onboarding, trafficking and billing to agency standards.",
      results:
        "Host-read Ritual spots ran on Harvesting Happiness at $4,200 gross per spot, in the same campaign flight as This Past Weekend with Theo Von — an independent show sold at national-brand rates.",
    },
    clearance: "cleared",
  },
  {
    id: "moms-moving-on",
    slug: "moms-moving-on",
    client: "Moms Moving On",
    show: "Michelle Dempsey-Multack",
    industry: "Lifestyle / self-improvement",
    services: ["podcast-editing", "podcast-clips", "podcast-sponsorship"],
    headline: "Four renewals, and a 17-month sponsorship sold",
    what:
      "Production, clips and monetization for a divorce-and-coparenting show — a multi-year relationship that ended with us selling and running its longest brand partnership.",
    metrics: [
      { value: "4", label: "contract renewals across the relationship" },
      { value: "17 mo", label: "continuous sponsorship sold, managed and renewed" },
      { value: "2×", label: "host's Instagram growth during the campaign" },
      { value: "15%", label: "listenership growth year over year" },
    ],
    story: {
      challenge:
        "A growing self-improvement show with a strong host brand needed the whole back half handled — production, clips, social — and then a real answer to the monetization question.",
      approach:
        "Ongoing production and clip work through four renewals, then the sell-side motion: audience case, rate card, and outreach that landed Worthy as a sponsor — host-read midrolls plus Instagram and Facebook ad units.",
      results:
        "The Worthy partnership ran seventeen consecutive months across renewals, while the show's listenership grew 15% year over year and Michelle's Instagram doubled — growth and revenue from the same audience work.",
    },
    clearance: "cleared",
  },
  {
    id: "go-with-elmo",
    slug: "go-with-elmo",
    client: "Go With Elmo Lovano",
    industry: "Music & entertainment",
    services: ["podcast-growth", "podcast-sponsorship"],
    headline: "31M views in a single month",
    what:
      "Growth and monetization for a video-first show — paid acquisition on YouTube, Meta and Spotify, the newsletter, episode-page SEO, and the sponsor pipeline from prospecting through reporting.",
    metrics: [
      { value: "31M", label: "monthly views across the show's platforms" },
      { value: "43,900", label: "YouTube subscribers added in 90 days" },
      { value: "$0.009", label: "per view on capped paid launches" },
      { value: "$20K", label: "single four-episode sponsorship package closed" },
    ],
    story: {
      challenge:
        "A weekly, hours-long interview show with world-class guests and a strong in-house production team — but no paid growth engine, no search presence for its back catalog, and sponsorship inventory going unsold.",
      approach:
        "We run the growth and revenue side of the operation: a capped paid launch on every episode (about $200 across YouTube, Meta and Spotify, reaching roughly $0.009 per view, cut the moment organic recommendations take over), a per-episode newsletter, 100+ episode pages rewritten for search and AI answers, and the sponsorship machine — prospect lanes, outreach, audience data packs, and the reporting sponsors renew on.",
      results:
        "The show crossed 31 million monthly views across platforms with 43,900 YouTube subscribers added in 90 days, and the sponsorship side closed packages from $2,500 to $8,000 per episode — including a $20,000 four-episode deal, a $5,000-a-month product partnership, and a launch sponsor who renewed for five more episodes.",
    },
    /* Producer quote, not a guest quote — the 2026-08-19 founder decision
       bans GUEST quotes for this show; Meadows is the show's producer. */
    testimonialId: "meadows",
    clearance: "cleared",
    note:
      "ATTRIBUTION: clips and episode editing are produced in-house by the show's editor — NOT Podlink's work. Never claim the clip stats or edit craft as ours. FOUNDER DECISION 2026-08-19: never name the show's sponsors in our marketing, and no guest quotes (the Hit-Boy quote was removed) — dollar figures without names only.",
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  services: ServiceSlug[];
  clearance: Clearance;
  note?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "meadows",
    quote:
      "Podlink helped us triple our audio streams in less than 90 days. It's been a game-changer for our growth strategy.",
    name: "Christian Paul Meadows",
    title: "Producer",
    company: "Go With Elmo Podcast",
    services: ["podcast-growth"],
    clearance: "cleared",
  },
  {
    id: "lapidus",
    quote: "Podlink has become an integral part of our brand's podcast strategy.",
    name: "Joshua Lapidus",
    title: "Host",
    company: "Unemployable Podcast",
    services: ["podcast-editing", "get-booked-on-podcasts", "podcast-growth"],
    clearance: "cleared",
  },
  {
    id: "chellew",
    quote:
      "They have delivered exemplary results since taking over our podcast. They're a key reason we have become the top online authority in the financial divorce industry.",
    name: "Karen Chellew",
    title: "Founder",
    company: "My Divorce Solution",
    services: ["podcast-editing", "podcast-growth"],
    clearance: "cleared",
    note:
      "Original quote names the prior company. Needs Karen's sign-off on the Podlink attribution before it ships.",
  },
  {
    id: "chellew-2",
    quote:
      "An incredible podcast agency that has done wonders for our business. They provided strategic guidance, creative content, and innovative ideas to help us increase our online sales.",
    name: "Karen Chellew",
    title: "Co-Founder",
    company: "My Divorce Solution",
    services: ["podcast-growth"],
    clearance: "cleared",
  },
  {
    id: "walsh",
    quote:
      "They made sure of our success by helping us reach the New & Noteworthy section of iTunes within two days of launch.",
    name: "Liam Walsh",
    title: "Head of Production",
    company: "Jordan Belfort",
    services: ["podcast-editing", "podcast-growth"],
    clearance: "cleared",
  },
  {
    id: "tim-h",
    quote:
      "The smartest, most creative podcast people in the business. They have been a pleasure to work with, and I would recommend them without reservation.",
    name: "Tim H.",
    title: "Product Manager",
    company: "",
    services: ["podcast-editing", "podcast-clips"],
    clearance: "cleared",
  },
];

/** Shows produced, grown, or monetized. Used for the logo/name wall. */
export const showsWorkedWith: { name: string; clearance: Clearance }[] = [
  { name: "Go With Elmo Lovano", clearance: "cleared" },
  { name: "Unemployable", clearance: "cleared" },
  { name: "Moms Moving On", clearance: "cleared" },
  { name: "Hell Has an Exit", clearance: "cleared" },
  { name: "Fruits of Motherhood", clearance: "cleared" },
  { name: "Madam Trader", clearance: "cleared" },
  { name: "Harvesting Happiness", clearance: "cleared" },
  { name: "Why We Tri", clearance: "cleared" },
  { name: "Sales School", clearance: "cleared" },
  { name: "The Wolf's Den", clearance: "cleared" },
  { name: "Mimosa's with Moms", clearance: "cleared" },
  { name: "YogaBiz Academy", clearance: "cleared" },
  { name: "Star Spangled Gamblers", clearance: "cleared" },
  { name: "Death, Sex & Money", clearance: "needs-verification" },
  { name: "RadioLab", clearance: "needs-verification" },
  { name: "Never Alone with Deepak Chopra", clearance: "needs-verification" },
];

/** Brands whose podcast campaigns we've bought or sold. */
export const brandsWorkedWith: { name: string; clearance: Clearance }[] = [
  { name: "Oracle NetSuite", clearance: "needs-verification" },
  { name: "CVS Health", clearance: "needs-verification" },
  { name: "Dropbox", clearance: "cleared" },
  { name: "Worthy", clearance: "cleared" },
  { name: "Athletic Greens", clearance: "cleared" },
  { name: "Headspace", clearance: "cleared" },
  { name: "Manscaped", clearance: "cleared" },
  { name: "Indochino", clearance: "cleared" },
  { name: "Equilibria", clearance: "cleared" },
];

// ---------------------------------------------------------------------------
// Selectors — components should use these, never the raw arrays.
// ---------------------------------------------------------------------------

const isVisible = (c: Clearance) => SHOW_UNCLEARED_PROOF || c === "cleared";

export function caseStudiesFor(slug: ServiceSlug): CaseStudy[] {
  return caseStudies.filter(
    (c) => c.services.includes(slug) && isVisible(c.clearance),
  );
}

export function testimonialFor(slug: ServiceSlug): Testimonial | undefined {
  return testimonials.find(
    (t) => t.services.includes(slug) && isVisible(t.clearance),
  );
}

/** All case studies cleared to render, in file order. */
export function visibleCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => isVisible(c.clearance));
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/**
 * Pull-quote lookup for /case-studies/[slug] — resolves a CaseStudy's
 * `testimonialId`, clearance-gated like every other selector.
 */
export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((t) => t.id === id && isVisible(t.clearance));
}

export function visibleShows(): string[] {
  return showsWorkedWith.filter((s) => isVisible(s.clearance)).map((s) => s.name);
}

export function visibleBrands(): string[] {
  return brandsWorkedWith.filter((b) => isVisible(b.clearance)).map((b) => b.name);
}

// ---------------------------------------------------------------------------
// /case-studies index page copy.
// ---------------------------------------------------------------------------

export const caseStudiesIndex = {
  eyebrow: "Case studies",
  headline: "Real shows. Real numbers.",
  subhead:
    "Every result on this page comes from a client engagement we actually ran — produced, grown, booked or monetized since 2021. No composites, no industry averages dressed up as our work.",
  closing: {
    headline: "Your show could be the next one here.",
    body: "A 20-minute call. We'll tell you what we'd do, what it costs, and whether it's the right first move for where your show actually is.",
    cta: "Book a call",
  },
  metaTitle: "Podcast Case Studies — Production, Growth & Monetization | Podlink",
  metaDescription:
    "Case studies from five years of podcast work: production, clips, sponsorship, guest booking and growth — with the numbers behind each engagement.",
};
