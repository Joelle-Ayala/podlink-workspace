/**
 * Verified guest placements — the /work directory.
 *
 * EVERY entry here was verified against a live public episode page on
 * 2026-08-19 (see the project doc placements-verified.md for the audit).
 * Rules for adding entries:
 *   1. The episode must be publicly findable (show site, Apple, Spotify, YouTube).
 *   2. The placement must fall inside our engagement window with that client —
 *      episodes that predate the engagement are excluded even when real
 *      (three Belfort episodes from 2019–20 are excluded on exactly this rule).
 *   3. Never add from old marketing decks without re-verifying. The decks
 *      contained placements that do not exist (All-In × Koii) and episodes
 *      that were never published (Unemployable × Madam Trader).
 */

export interface Placement {
  client: string;
  /** Case-study slug to link back to, when one exists. */
  caseStudySlug?: string;
  guest: string;
  show: string;
  episodeTitle: string;
  year: string;
  links: {
    web?: string;
    youtube?: string;
    spotify?: string;
    apple?: string;
  };
  /** Which player to embed inline. Omit = link card only. */
  embed?: "youtube" | "spotify";
}

export const placements: Placement[] = [
  // --- DocSend / Dropbox -----------------------------------------------------
  {
    client: "DocSend (Dropbox)",
    caseStudySlug: "docsend",
    guest: "Russ Heddleston, Co-Founder & CEO",
    show: "Success Story with Scott D. Clary",
    episodeTitle: "Best Fundraising Strategies For Growing Your Business",
    year: "2021",
    links: {
      youtube: "https://www.youtube.com/watch?v=HwEWy24UDWs",
      spotify: "https://open.spotify.com/episode/7MY2iI39B6OlywWV7b5CX3",
      web: "https://www.scottdclary.com/russ-heddleston/",
    },
    embed: "youtube",
  },
  {
    client: "DocSend (Dropbox)",
    caseStudySlug: "docsend",
    guest: "Russ Heddleston, Co-Founder & CEO",
    show: "The Full Ratchet",
    episodeTitle:
      "311. Founding DocSend, Creating a Winning PLG Motion, and Data From 1000's of Pitch Decks",
    year: "2021",
    links: {
      web: "https://fullratchet.net/311-founding-docsend-creating-a-winning-plg-motion-and-data-from-1000s-of-pitch-decks-russ-heddleston/",
    },
  },

  // --- Recon Food ------------------------------------------------------------
  {
    client: "Recon Food",
    caseStudySlug: "recon-food",
    guest: "Spencer & Sophia Rascoff, Co-Founders",
    show: "Success Story with Scott D. Clary",
    episodeTitle: "The Evolution of Social Media",
    year: "2022",
    links: {
      spotify: "https://open.spotify.com/episode/6BjNQjsPqIFbFpoeAo3Inh",
      web: "https://www.successstorypodcast.com/spencer-rascoff-sophia-rascoff-founders-of-recon-food-the-evolution-of-social-media/",
    },
    embed: "spotify",
  },
  {
    client: "Recon Food",
    caseStudySlug: "recon-food",
    guest: "Spencer & Sophia Rascoff, Co-Founders",
    show: "Dear FoundHer…",
    episodeTitle: "Founding a Vertical Social Media Solution",
    year: "2022",
    links: {
      apple: "https://podcasts.apple.com/us/podcast/dear-foundher/id1591976277",
      web: "https://podcastrepublic.net/podcast/1591976277",
    },
  },
  {
    client: "Recon Food",
    caseStudySlug: "recon-food",
    guest: "Spencer & Sophia Rascoff, Co-Founders",
    show: "Impact with John Shegerian",
    episodeTitle: "A Common Love of Food",
    year: "2022",
    links: {
      web: "https://impactpodcast.com/episode/2022/05/a-common-love-of-food-with-spencer-and-sophia-rascoff/",
    },
  },
  {
    client: "Recon Food",
    caseStudySlug: "recon-food",
    guest: "Sophia Rascoff, Co-Founder",
    show: "Startup Junkie",
    episodeTitle: "#319: Reconnecting Over Food & Social Media",
    year: "2022",
    links: {
      web: "https://startupjunkie.org/2022-10-31-319-reconnecting-over-food-amp-social-media-with-sofia-rascoff/",
    },
  },

  // --- Koii Network ----------------------------------------------------------
  {
    client: "Koii Network",
    caseStudySlug: "koii",
    guest: "Al Morris, Founder",
    show: "Crypto 101",
    episodeTitle:
      "Ep. 403 — Creating an Unbiased and Empowering Decentralized Platform",
    year: "2021",
    links: {
      apple:
        "https://podcasts.apple.com/lv/podcast/ep-403-creating-an-unbiased-and-empowering/id1262351840?i=1000544311946",
      web: "https://soundcloud.com/crypto101podcast/ep-403-creating-an-unbiased-and-empowering-decentralized-platform-with-al-morris-of-koii-network",
    },
  },
  {
    client: "Koii Network",
    caseStudySlug: "koii",
    guest: "Al Morris, Founder",
    show: "Edge of NFT",
    episodeTitle: "Building The Infrastructure Of The Attention Economy",
    year: "2021",
    links: {
      apple:
        "https://podcasts.apple.com/us/podcast/al-morris-of-koii-on-building-the/id1560977376?i=1000532400600",
    },
  },
  {
    client: "Koii Network",
    caseStudySlug: "koii",
    guest: "Al Morris, Founder",
    show: "Edge of NFT",
    episodeTitle: "A Scalable P2P Network Decentralizing The Web",
    year: "2022",
    links: {
      web: "https://podtail.com/podcast/edge-of-nft-podcast/al-morris-of-koii-a-scalable-p2p-network-decentral",
    },
  },
  {
    client: "Koii Network",
    caseStudySlug: "koii",
    guest: "Kayla Kroot, Co-Founder & Creative Director",
    show: "CryptoNews Podcast",
    episodeTitle: "#121: NFT Artists, the Attention Economy and Koii Network",
    year: "2022",
    links: {
      web: "https://www.buzzsprout.com/1735660/episodes/10380842-121-kayla-kroot-on-nft-artists-the-attention-economy-and-koii-network",
    },
  },
  {
    client: "Koii Network",
    caseStudySlug: "koii",
    guest: "Al Morris, Founder",
    show: "New to Crypto",
    episodeTitle: "What is Koii Network",
    year: "2022",
    links: {
      apple:
        "https://podcasts.apple.com/us/podcast/what-is-koii-network-with-founder-al-morris/id1575251621?i=1000555135295",
      web: "https://newtocrypto.io/podcast/al-morris-koii-network/",
    },
  },
  {
    client: "Koii Network",
    caseStudySlug: "koii",
    guest: "Al Morris, Founder",
    show: "The Metaverse Podcast (Outlier Ventures)",
    episodeTitle: "Replacing Web 2 Infrastructure",
    year: "2022",
    links: {
      web: "https://outlierventures.podbean.com/e/replacing-web-2-infrastructure-with-al-morris-of-koii-network/",
    },
  },

  // --- Mudrex ----------------------------------------------------------------
  {
    client: "Mudrex",
    caseStudySlug: "mudrex",
    guest: "Edul Patel, Co-Founder & CEO",
    show: "Success Story with Scott D. Clary",
    episodeTitle: "The Future of Crypto Investments",
    year: "2022",
    links: {
      spotify: "https://open.spotify.com/episode/6UxL2LBLqfWWUbGaqImQTr",
      web: "https://www.successstorypodcast.com/edul-patel-co-founder-ceo-of-mudrex-the-future-of-crypto-investments/",
    },
    embed: "spotify",
  },

  // --- QualSights ------------------------------------------------------------
  {
    client: "QualSights",
    caseStudySlug: "qualsights",
    guest: "Nihal Advani, Founder & CEO",
    show: "Success Story with Scott D. Clary",
    episodeTitle: "Consumer Insights and Market Research",
    year: "2022",
    links: {
      apple:
        "https://podcasts.apple.com/gb/podcast/nihal-advani-founder-ceo-of-qualsights-consumer/id1484783544?i=1000559407161",
      web: "https://www.scottdclary.com/nihal-advani/",
    },
  },

  // --- ShiftPixy -------------------------------------------------------------
  {
    client: "ShiftPixy (NASDAQ: PIXY)",
    caseStudySlug: "shiftpixy",
    guest: "Scott Absher, Founder & CEO",
    show: "Minimally Viable",
    episodeTitle:
      "E25 — The gig economy, going public via SPACs, and tech in Miami",
    year: "2021",
    links: {
      web: "https://minimallyviable.fm/episodes",
    },
  },

  // --- T3 Live / Madam Trader ------------------------------------------------
  {
    client: "T3 Live",
    caseStudySlug: "t3-live",
    guest: "Derrick Oldensmith",
    show: "Trading Justice",
    episodeTitle: "Episode 478: Interview with Derrick Oldensmith",
    year: "2022",
    links: {
      web: "https://tradingjustice.com/trading-justice-478-interview-with-derrick-oldensmith/",
    },
  },
  {
    client: "Madam Trader",
    caseStudySlug: "t3-live",
    guest: "Ashley Kyle Miller, Founder & Host",
    show: "Wings of Inspired Business",
    episodeTitle: "Episode 834: Ashley Kyle Miller — Madam Trader",
    year: "2023",
    links: {
      web: "https://melindawittstock.com/wingspodcast/ashley-kyle-miller/",
    },
  },
  {
    client: "Madam Trader",
    caseStudySlug: "t3-live",
    guest: "Ashley Kyle Miller, Founder & Host",
    show: "Moms Moving On (The Moving On Method)",
    episodeTitle:
      "Divorce and Money: Building Your Own Wealth After Divorce",
    year: "2023",
    links: {
      web: "https://momsmovingon.com/divorce-and-money-building-your-own-wealth-after-divorce-no-matter-where-youre-starting-from-with-guest-ashley-miller/",
    },
  },

  // --- Quantum Temple --------------------------------------------------------
  {
    client: "Quantum Temple",
    guest: "Linda Adami, Founder & CEO",
    show: "Edge of NFT",
    episodeTitle: "The Web3 ReFi Platform Preserving Cultural Heritage",
    year: "2023",
    links: {
      web: "https://www.edgeofnft.com/podcasts/linda-adami-of-quantum-temple-the-web3-platform-preserving-cultural-heritage",
    },
  },

  // --- Jordan Belfort --------------------------------------------------------
  {
    client: "Jordan Belfort",
    caseStudySlug: "belfort",
    guest: "Jordan Belfort",
    show: "The Rubin Report",
    episodeTitle:
      "Regret, Mass Brainwashing & the Only Investment You Need",
    year: "2022",
    links: {
      youtube: "https://www.youtube.com/watch?v=af4BH55CVio",
    },
    embed: "youtube",
  },

  // --- Hell Has an Exit (guests booked ONTO a client's show) ------------------
  {
    client: "Hell Has an Exit",
    caseStudySlug: "hell-has-an-exit",
    guest: "Lamar Odom (booked onto the client's show)",
    show: "Hell Has an Exit — Ep. 45",
    episodeTitle: "\"Me VS. Me.\" ft. Lamar Odom",
    year: "2021",
    links: {
      youtube: "https://www.youtube.com/watch?v=mnDwoVvn1uo",
      web: "https://hellhasanexitpod.com/episodes/",
    },
    embed: "youtube",
  },
  {
    client: "Hell Has an Exit",
    caseStudySlug: "hell-has-an-exit",
    guest: "Jordan Belfort (booked onto the client's show)",
    show: "Hell Has an Exit — Ep. 50",
    episodeTitle: "'The Wolf of Wall Street' ft. Jordan Belfort",
    year: "2021",
    links: {
      youtube: "https://www.youtube.com/watch?v=or5QAjU6Q80",
      web: "https://hellhasanexitpod.com/episodes/",
    },
    embed: "youtube",
  },
];

/** Distinct shows, for the header stat. */
export const placementShowCount = new Set(placements.map((p) => p.show)).size;
export const placementClientCount = new Set(placements.map((p) => p.client)).size;
