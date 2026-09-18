/**
 * Homepage content.
 *
 * Shapes used only by the homepage live here rather than in types.ts — types.ts
 * is the shared contract for features and pricing, and a hero interface has no
 * business in it.
 *
 * No invented proof or customer counts. Product claims here must match what is
 * actually shipped; service proof is rendered separately from cleared sources.
 */

import { appUrl } from "@/lib/site";
import type { FaqItem } from "./types";

export interface CtaLink {
  label: string;
  href: string;
}

export interface Hero {
  eyebrow?: string;
  /** Sentence case, no trailing period. */
  headline: string;
  sub: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  /** Small reassurance line under the buttons. */
  note?: string;
}

export interface Step {
  /** "01", "02", "03" — rendered as the step marker. */
  number: string;
  heading: string;
  body: string;
}

export interface HowItWorks {
  eyebrow?: string;
  heading: string;
  intro?: string;
  steps: Step[];
}

export interface CtaBand {
  heading: string;
  body: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  note?: string;
}

export const HERO: Hero = {
  eyebrow: "Independent podcast analytics + AI",
  headline: "Know what's growing your podcast. Then do more of it",
  sub: "Connect your show to see independently measured downloads, YouTube performance, a live Show Report you can share, and transcripts you can query from Claude or ChatGPT.",
  primaryCta: { label: "Analyze your podcast free", href: "/analyze" },
  secondaryCta: { label: "See the Show Report", href: "#show-report" },
  note: "Keep your podcast host. No card required. OP3 measures downloads independently.",
};

export const HOW_IT_WORKS: HowItWorks = {
  eyebrow: "How it works",
  heading: "Connect the show once. See what's working more clearly",
  intro:
    "Podlink sits alongside the podcast host you already use. It connects the show, the audience data and the episode archive so you spend less time stitching together dashboards and more time deciding what to do next.",
  steps: [
    {
      number: "01",
      heading: "Connect your podcast",
      body: "Start with your RSS feed. Podlink recognizes the show and episode archive, checks your OP3 setup, and keeps your existing host and feed exactly where they are.",
    },
    {
      number: "02",
      heading: "Bring the audience together",
      body: "Add independent download measurement through OP3, connect YouTube when you publish video, and transcribe the episodes you want searchable. The goal is one episode view instead of six disconnected tabs.",
    },
    {
      number: "03",
      heading: "Share it — or just ask",
      body: "Turn on a live Show Report for a team, client or sponsor. Or connect Podlink to Claude or ChatGPT and ask questions about your episodes, transcripts and recent performance from the tools you already use.",
    },
  ],
};

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Do I have to move my podcast off my current host?",
    a: "No — and we would talk you out of it. Podlink reads your public RSS feed and works alongside Buzzsprout, Transistor, Libsyn, Captivate, Acast and anything else publishing a standard feed. You keep your host, your feed URL and your subscribers.",
  },
  {
    q: "Where do the download numbers come from?",
    a: "From OP3, an open, independently operated podcast analytics prefix. You add the prefix once in your host, OP3 measures the downloads, and Podlink reads them back. It is not our own counter — which means the numbers aren't ours to spin, and a sponsor can check the source themselves.",
  },
  {
    q: "Is the AI going to make things up about my episode?",
    a: "Show notes, summaries, takeaways and timestamps are generated from the transcript of your episode, so they are grounded in what was said. Nothing publishes on its own: Podlink drafts, you approve.",
  },
  {
    q: "Will everything sound like a chatbot wrote it?",
    a: "Only if you skip the setup. Templates and brand voice let you fix your structure, your section headings and your tone once, and every episode after that arrives in that shape. It's the ten minutes that decides whether you edit the output or just read it.",
  },
  {
    q: "What is podlink.fm?",
    a: "The link-in-bio page that comes with Podlink, at podlink.fm/yourshow: every place your show is available to listen, your latest episodes pulled from your feed, and whatever else you are pointing people at this week.",
  },
  {
    q: "Can my producer or editor work in this with me?",
    a: "Podlink is built for one login per show today. Producer seats and client workspaces are on the roadmap — that's the Studio tier, made for the people who run several shows for other people.",
  },
  {
    q: "I already pay for a link-in-bio tool and an AI writer. Why switch?",
    a: "That's the point — Pro replaces both, typically about $48 a month between them, and adds the one thing neither sells: download numbers a sponsor can verify against the source.",
  },
  {
    q: "What does it cost?",
    a: "Free to start, with your download analytics and your podlink.fm page included for as long as you want them. Pro is $29 a month — about what a link page and a repurposer cost together, except those don't come with numbers you can defend. Four months free if you pay annually.",
  },
];

/** The two-door band: software for self-serve users, services for buyers who
 * want Podlink to operate the workflow for them. */
export interface Door {
  heading: string;
  body: string;
  cta: CtaLink;
}

export const TWO_DOORS: Door[] = [
  {
    heading: "Measure and understand your show",
    body: "Start with free independent analytics, then connect your video, transcripts and AI assistant as the show grows.",
    cta: { label: "Analyze your podcast", href: "/analyze" },
  },
  {
    heading: "Or put a podcast team behind it",
    body: "Production, clips, founder guesting, sponsorship and growth — built from the same workflows that became Podlink.",
    cta: { label: "Explore services", href: "/services" },
  },
];

/**
 * Show Report + assistant band. Both capabilities are shipped; claims here
 * deliberately stay inside the live read-only analytics/transcript surface.
 */
export const REPORT_BAND = {
  eyebrow: "The shareable layer",
  headline: "A podcast report people can actually open",
  body: "Turn on your Show Report and send one live link instead of rebuilding a spreadsheet every time someone asks how the show is doing. It can bring together OP3-measured downloads, YouTube performance and audience data where available, and your Podlink page activity. Then connect Claude or ChatGPT and ask questions against your own analytics and transcripts.",
  bullets: [
    "A live link instead of a stale PDF or recurring reporting spreadsheet",
    "OP3 download numbers from an open, independent source",
    "Claude or ChatGPT access to your podcast analytics and transcript archive",
  ],
  primaryCta: { label: "Analyze your podcast", href: "/analyze" },
  secondaryCta: { label: "Connect Claude", href: "/claude" },
};

export const CTA_BAND: CtaBand = {
  heading: "Start with the podcast you already have",
  body: "Analyze the show, connect the data you want, and turn on the report when you're ready to share it. No host migration and no rebuild required.",
  primaryCta: { label: "Analyze your podcast free", href: "/analyze" },
  secondaryCta: { label: "Explore services", href: "/services" },
  note: "Keep your podcast host. No card required.",
};
