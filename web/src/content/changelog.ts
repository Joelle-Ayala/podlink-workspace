/**
 * Changelog + public roadmap.
 *
 * RULES (from the release-marketing decision, 2026-08-19):
 *  - Changelog entries are added ONLY when a user can actually use the thing
 *    today. No pre-announcements, no backdating.
 *  - The roadmap is Now / Next / Later — NO public dates, ever. Dates live in
 *    the private drip calendar (claude/feature-drip-calendar.md), not here.
 *  - One entry per announcement, paced by the drip calendar (~every 2 weeks).
 */

export interface ChangelogEntry {
  /** ISO date the announcement ships (= the day it's added here). */
  date: string;
  title: string;
  tag: "New" | "Improved" | "Announcement";
  /** Which plan gets it. */
  tier: "Free" | "Pro" | "All plans" | "—";
  body: string;
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-08-16",
    title: "The new podlink.ai",
    tag: "Announcement",
    tier: "—",
    body: "A rebuilt marketing site — faster, clearer, and finally separate from the app. podlink.fm now points home, and every feature has its own page.",
  },
  // Next entries come from the drip calendar as each one is verified live.
];

/* -------------------------------------------------------------------------- */

export interface RoadmapItem {
  title: string;
  body: string;
}

/** No dates. Now = in active development. Next = queued. Later = planned. */
export const roadmap: {
  now: RoadmapItem[];
  next: RoadmapItem[];
  later: RoadmapItem[];
} = {
  now: [
    {
      title: "Automatic episode transcripts",
      body: "Your feed is watched; new episodes are transcribed without you uploading anything — the foundation everything below builds on.",
    },
    {
      title: "Episode Content Kit",
      body: "Show notes, newsletter and social posts generated from the actual transcript, in your show's voice — 'your episode dropped, here's your kit.'",
    },
    {
      title: "YouTube channel connect",
      body: "Per-episode YouTube views next to your downloads — the first view of the audience RSS analytics can't see.",
    },
  ],
  next: [
    {
      title: "Episode Reports",
      body: "One report per episode: downloads, link clicks, YouTube views and the content that drove them — see which post actually worked.",
    },
    {
      title: "Tracked links in every kit",
      body: "Every generated post carries its own short link, so clicks trace back to the content that earned them.",
    },
    {
      title: "Per-episode pages on your bio link",
      body: "Each episode gets its own landing page with subscribe buttons — where your tracked links land.",
    },
    {
      title: "Podlink MCP — your show in Claude",
      body: "Connect your AI assistant to your show: episodes, transcripts, analytics and generation, wherever you already work.",
    },
    {
      title: "Subscribe deep-links",
      body: "One tap from your page to follow in Apple or Spotify — the step most link pages lose listeners on.",
    },
  ],
  later: [
    {
      title: "Clip Studio",
      body: "Clips, captions and editing — with clip-moment selection informed by what your analytics say resonates.",
    },
    {
      title: "Booking & sponsor outreach",
      body: "The system behind our booking service, productized — find shows and the people who run them, verified contact paths, and the sequences and copy that get replies.",
    },
    {
      title: "Full YouTube depth",
      body: "Watch time, Shorts breakdown, and automatic episode-to-video matching inside your reports.",
    },
  ],
};
