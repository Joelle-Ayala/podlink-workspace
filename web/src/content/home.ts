/**
 * Homepage content.
 *
 * Shapes used only by the homepage live here rather than in types.ts — types.ts
 * is the shared contract for features and pricing, and a hero interface has no
 * business in it.
 *
 * No testimonials, no customer counts, no invented metrics. The stock ones came
 * out on purpose. Proof on this page is product fact: the analytics come from
 * OP3, which we do not run.
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
  eyebrow: "Grow your show. Not your workload.",
  headline: "Record the episode. Podlink does the other four hours",
  sub: "Show notes, clips, social posts, a newsletter and download numbers you can defend — generated from the episode you just published, on the podcast host you already use.",
  primaryCta: { label: "Start free", href: appUrl("/register") },
  secondaryCta: { label: "See what it does", href: "/features" },
  note: "Connect your RSS feed in under a minute. No host migration, no card required.",
};

export const HOW_IT_WORKS: HowItWorks = {
  eyebrow: "How it works",
  heading: "Three steps, and one of them is publishing an episode anyway",
  intro:
    "Podlink is not another podcast host, and switching hosts is not a growth strategy. It sits alongside the one you have and takes on the work that happens after the audio is done.",
  steps: [
    {
      number: "01",
      heading: "Connect your RSS feed",
      body: "Paste the feed URL you already publish to and your whole back catalogue imports — artwork, episodes, descriptions, all of it. Works with Buzzsprout, Transistor, Libsyn, Captivate, Acast and anything else that produces a standard feed. Add the OP3 prefix once while you are there and your downloads start being measured.",
    },
    {
      number: "02",
      heading: "Drop in your episodes",
      body: "Publish the way you always do. Each episode lands in a workspace of its own, transcribed on arrival, with the show notes, titles, description, clips, social posts and newsletter drafted from what was actually said — in your format, because you set it once.",
    },
    {
      number: "03",
      heading: "Publish and watch what lands",
      body: "Review, adjust, copy it where it goes. Then see the downloads come in per episode, by app and by country, and find out which topics and titles carried — so the next episode is a decision rather than a guess.",
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
    a: "Yes. The episode workspace is the shared surface — audio, transcript, notes, clips and social copy in one place — so handing an episode over is a link rather than a folder of files and a Slack thread.",
  },
  {
    q: "What does it cost?",
    a: "Free to start, with analytics, transcripts and your podlink.fm page included for as long as you want them. Creator is $19 a month and Pro is $49, both with two months free if you pay annually.",
  },
];

export const CTA_BAND: CtaBand = {
  heading: "Your next episode could publish itself",
  body: "Connect your feed, publish as normal, and find the show notes, clips, newsletter and social copy already waiting for you.",
  primaryCta: { label: "Start free", href: appUrl("/register") },
  secondaryCta: { label: "See pricing", href: "/pricing" },
  note: "Keep your podcast host. No card required. Cancel any time.",
};
