/**
 * Content contract for the Podlink marketing site.
 *
 * This file is the agreement between content (src/content/*) and components
 * (src/components/*). Content authors fill these shapes; components consume
 * them. Neither side should invent ad-hoc props.
 *
 * Ported from the MagicAI-era config/marketing.php, which held the same copy
 * as a PHP array.
 */

/** Named icon from the shared icon set (src/components/Icon.tsx). */
export type IconName =
  | "chart"
  | "notes"
  | "transcript"
  | "clip"
  | "social"
  | "mail"
  | "link"
  | "template"
  | "globe"
  | "rss"
  | "sparkle"
  | "clock"
  | "check"
  | "arrow";

export type GroupId = "publish" | "understand" | "create" | "grow";

export interface Feature {
  /** URL slug — stable, used at /features/[slug]. Do not rename casually. */
  slug: string;
  name: string;
  /** One line, sentence case, no trailing period. Used on cards. */
  tagline: string;
  group: GroupId;
  icon: IconName;
  /** 2–3 sentences for the feature detail hero. */
  summary: string;
  /** Short scannable outcomes. 3–5 items. */
  bullets: string[];
  /** Optional deep-dive blocks on the detail page. */
  sections?: FeatureSection[];
  faq?: FaqItem[];
  /** Path under /public once real product shots exist. */
  image?: string;
  imageAlt?: string;
}

export interface FeatureSection {
  heading: string;
  body: string;
  bullets?: string[];
  image?: string;
  imageAlt?: string;
}

export interface FeatureGroup {
  id: GroupId;
  /** Job-to-be-done framing, not a product-category name. */
  title: string;
  intro: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PricingTier {
  id: string;
  name: string;
  /** USD per month, billed monthly. 0 for free. */
  priceMonthly: number;
  /**
   * USD billed once annually. Convention is 10x monthly ("2 months free").
   * Leave undefined to derive it.
   */
  priceAnnual?: number;
  blurb: string;
  /** e.g. "Most popular". Null for none. */
  badge?: string | null;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}

export interface ComparisonRow {
  label: string;
  /** Keyed by PricingTier.id. true/false render as icons; strings render as-is. */
  values: Record<string, boolean | string>;
}

export interface ComparisonSection {
  heading: string;
  rows: ComparisonRow[];
}
