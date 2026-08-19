/**
 * Site navigation structure.
 *
 * Two dropdown sections — Services and Features. Each parent is BOTH a real
 * link to its hub page and the trigger for a dropdown of its children.
 *
 * The descriptions here do double duty: they're useful in the menu, and they
 * enforce the intent separation that keeps /features and /services from
 * competing for the same keywords. Features use TOOL language ("generate",
 * "automatic", "in the dashboard"). Services use DONE-FOR-YOU language ("we
 * cut", "we book", "our team"). Keep that discipline when editing.
 *
 * See claude/podlink-sitemap-ia-plan.md §4.
 */

import { services } from "./services";

export interface NavChild {
  href: string;
  label: string;
  /** One short line, shown in the dropdown. */
  description: string;
}

export interface NavSection {
  /** The hub page. The nav label links here. */
  href: string;
  label: string;
  children: NavChild[];
}

export type NavItem = NavSection | { href: string; label: string };

export const isSection = (item: NavItem): item is NavSection =>
  "children" in item;

/* -------------------------------------------------------------------------- */
/* Features                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * TODO(nav): these 8 slugs are stable and match /features/[slug]. If
 * src/content/features.ts already exports a list with `slug` and a short label,
 * replace this array with a map over it so there's one source of truth:
 *
 *   import { features } from "./features";
 *   const featureChildren = features.map((f) => ({
 *     href: `/features/${f.slug}`,
 *     label: f.navLabel ?? f.name,
 *     description: f.navDescription ?? f.tagline,
 *   }));
 */
const featureChildren: NavChild[] = [
  {
    href: "/features/download-analytics",
    label: "Download Analytics",
    description: "See where every download comes from, in one dashboard.",
  },
  {
    href: "/features/transcripts",
    label: "Transcripts",
    description: "Automatic, searchable transcripts for every episode.",
  },
  {
    href: "/features/show-notes",
    label: "Show Notes",
    description: "Generate episode notes from the transcript.",
  },
  {
    href: "/features/templates",
    label: "Templates",
    description: "Reusable formats so every episode ships the same way.",
  },
  {
    href: "/features/multilingual",
    label: "Multilingual",
    description: "Reach listeners in more than one language.",
  },
  {
    href: "/features/clips-and-social",
    label: "Clips & Social",
    description: "Turn episodes into short-form video automatically.",
  },
  {
    href: "/features/newsletter",
    label: "Newsletter",
    description: "Draft the episode email without starting from blank.",
  },
  {
    href: "/features/link-in-bio",
    label: "Link in Bio",
    description: "One page that sends listeners to every platform.",
  },
  {
    href: "/features/mcp",
    label: "Claude & AI Assistants",
    description: "Connect your assistant — it knows your show.",
  },
];

/* -------------------------------------------------------------------------- */
/* Services — derived from the services content, single source of truth        */
/* -------------------------------------------------------------------------- */

/** Shorter than the page taglines — menus need scanning, not selling. */
const serviceNavDescriptions: Record<string, string> = {
  "podcast-editing": "We produce the episode. You just record.",
  "podcast-clips": "We cut every episode into short-form video.",
  "podcast-advertising": "We buy podcast ads — for brands, with real attribution.",
  "podcast-sponsorship": "We sell the ad space on your show, and manage renewals.",
  "get-booked-on-podcasts": "We book you as a guest, and clip every appearance.",
  "podcast-growth": "We build the distribution podcast apps don't give you.",
};

const serviceChildren: NavChild[] = services.map((s) => ({
  href: `/services/${s.slug}`,
  label: s.name,
  description: serviceNavDescriptions[s.slug] ?? s.tagline,
}));

/* -------------------------------------------------------------------------- */

/**
 * Order is deliberate. Services sits first: it's the higher-intent, higher-value
 * side of the business and the side carrying indexing priority.
 */
export const primaryNav: NavItem[] = [
  { href: "/services", label: "Services", children: serviceChildren },
  { href: "/features", label: "Features", children: featureChildren },
  // Plain link, no dropdown — the index page does the routing. About and
  // Resources deliberately stay out of the top nav.
  { href: "/case-studies", label: "Case Studies" },
  { href: "/pricing", label: "Pricing" },
];
