/**
 * Per-page metadata + JSON-LD builders.
 *
 * Division of labour with `src/app/layout.tsx`:
 *   - the root layout owns `metadataBase`, the title template, the default
 *     OG/Twitter block and the site-wide `robots` directive;
 *   - this module owns everything that varies per route.
 *
 * So `pageMetadata()` deliberately returns a *partial* picture: it never
 * re-declares `metadataBase`, `siteName` or `type`, because Next merges the
 * page object over the layout object field by field and re-stating them is
 * how the two drift apart.
 *
 * The JSON-LD builders return plain objects. Rendering is the page layer's
 * job — see the note at the bottom of this file for the snippet.
 */

import type { Metadata } from "next";
import { SITE, appUrl } from "@/lib/site";

/* -------------------------------------------------------------------------
   URLs
   ---------------------------------------------------------------------- */

/**
 * Absolute URL for a site-relative path.
 *
 * Canonicals must be absolute — a relative `alternates.canonical` resolves
 * against `metadataBase` and works, but JSON-LD `@id`/`url` values are not
 * run through `metadataBase`, so we need one helper both can share or the
 * two representations of "this page" end up disagreeing.
 *
 * Trailing slashes are stripped, including the root's. That is not a taste
 * call: it is what Next itself emits. `alternates.canonical: "/"` in the
 * root layout resolves against `metadataBase` to the bare
 * `https://podlink.ai` (verified in the build output), so the sitemap has to
 * say the same thing. A sitemap `<loc>` that disagrees with the page's own
 * canonical by one character is how you earn a "duplicate, Google chose a
 * different canonical" report.
 */
export function absoluteUrl(path = "/"): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${withLeadingSlash.replace(/\/+$/, "")}`;
}

/**
 * The default social card. `src/app/opengraph-image.tsx` is a root-level
 * metadata file, so Next already attaches it to every route that does not
 * supply its own — this constant exists for the JSON-LD builders, which do
 * not participate in that inheritance.
 */
export const DEFAULT_OG_IMAGE = `${SITE.url}/opengraph-image`;

/** Stable JSON-LD node ids, so nodes on the same page can reference each other. */
const ID = {
  organization: `${SITE.url}/#organization`,
  publisher: `${SITE.url}/#publisher`,
  website: `${SITE.url}/#website`,
  software: `${SITE.url}/#software`,
} as const;

/* -------------------------------------------------------------------------
   Page metadata
   ---------------------------------------------------------------------- */

export interface PageMetadataInput {
  /**
   * Page title *without* the brand suffix — the root layout's
   * `title.template` ("%s · Podlink") appends it.
   */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/features/transcripts". */
  path: string;
  /**
   * Route-specific social image. Omit to inherit the site default from
   * `src/app/opengraph-image.tsx`.
   */
  image?: string;
  /**
   * Keep the page out of the index while still letting crawlers fetch and
   * follow it. Used by /pricing until the tier numbers are verified.
   */
  noIndex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      // `type`, `siteName` and the image default all come from the layout.
      // Only `url` is per-page, and it has to match the canonical exactly.
      //
      // `title` is passed unbranded on purpose. Next runs `openGraph.title`
      // and `twitter.title` through the *parent's* `title.template` (see
      // `resolveOpenGraph`/`resolveTwitter` in next/dist/lib/metadata), so
      // "Transcripts" here comes out of the build as
      // "Transcripts · Podlink" in the meta tag. Pre-branding it here would
      // produce "Transcripts · Podlink · Podlink".
      title,
      description,
      url: canonical,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex
      ? {
          // `follow` stays on: a noindex page should still pass crawlers
          // through to the pages it links to. `googleBot` is spelled out
          // because `max-image-preview` etc. are Google-only directives.
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }
      : {}),
  };
}

/* -------------------------------------------------------------------------
   JSON-LD
   ---------------------------------------------------------------------- */

/** JSON-LD is JSON, so a value is one of these. Used instead of `any`. */
export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export interface JsonLdNode {
  readonly "@context": "https://schema.org";
  readonly "@type": string;
  readonly [key: string]: JsonLdValue | undefined;
}

/** A reference to another node on the same page, by `@id`. */
interface NodeRef {
  readonly "@id": string;
}

const SCHEMA = "https://schema.org" as const;

export interface OrganizationLd extends JsonLdNode {
  readonly "@type": "Organization";
}

/**
 * Podlink the organisation, with Minting House as the publishing parent.
 *
 * `brand` is nested rather than emitted as a separate top-level node: the
 * brand and the org share a name and a logo here, and two sibling nodes
 * claiming the same name is exactly the ambiguity `@id` exists to avoid.
 */
export function organizationLd(): OrganizationLd {
  return {
    "@context": SCHEMA,
    "@type": "Organization",
    "@id": ID.organization,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/brand/podlink-mark.svg`,
      caption: `${SITE.name} logo`,
    },
    image: DEFAULT_OG_IMAGE,
    brand: {
      "@type": "Brand",
      name: SITE.name,
      slogan: SITE.tagline,
      logo: `${SITE.url}/brand/podlink-mark.svg`,
    },
    parentOrganization: {
      "@type": "Organization",
      "@id": ID.publisher,
      name: SITE.author,
    },
    // The product app and the listener-facing bio host are separate
    // properties of the same organisation, not third-party profiles — but
    // `sameAs` is the only vocabulary schema.org gives us for "also us".
    sameAs: [SITE.app, SITE.bio],
  };
}

export interface WebSiteLd extends JsonLdNode {
  readonly "@type": "WebSite";
}

/**
 * The marketing site itself.
 *
 * No `potentialAction`/SearchAction: podlink.ai has no site search, and
 * claiming one that 404s is a sitelinks-searchbox penalty waiting to happen.
 */
export function webSiteLd(): WebSiteLd {
  return {
    "@context": SCHEMA,
    "@type": "WebSite",
    "@id": ID.website,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": ID.organization } satisfies NodeRef,
  };
}

export interface SoftwareApplicationLd extends JsonLdNode {
  readonly "@type": "SoftwareApplication";
}

/**
 * The product.
 *
 * `offers` carries the free tier ONLY. Every paid tier limit in
 * `src/content/pricing.ts` is still an unverified placeholder, and a wrong
 * `price` in structured data is worse than a missing one: Google will
 * surface it in the SERP and it becomes a pricing claim we have to honour.
 * Add the paid Offers here in the same commit that verifies them.
 */
export function softwareApplicationLd(): SoftwareApplicationLd {
  return {
    "@context": SCHEMA,
    "@type": "SoftwareApplication",
    "@id": ID.software,
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Podcast analytics and content automation",
    operatingSystem: "Web browser",
    description: SITE.description,
    image: DEFAULT_OG_IMAGE,
    offers: {
      "@type": "Offer",
      name: "Free",
      description: "Free tier — no card required.",
      price: "0",
      priceCurrency: "USD",
      availability: `${SCHEMA}/InStock`,
      url: appUrl("/register"),
    },
    publisher: { "@id": ID.organization } satisfies NodeRef,
  };
}

export interface FaqLdItem {
  q: string;
  a: string;
}

export interface FaqPageLd extends JsonLdNode {
  readonly "@type": "FAQPage";
}

/**
 * FAQPage.
 *
 * Only emit this on pages where the questions and answers are genuinely
 * visible to a user — Google treats hidden FAQ markup as spam, and since
 * 2023 only shows FAQ rich results for authoritative health/government
 * sites anyway. It stays worth emitting for entity understanding.
 */
export function faqLd(items: readonly FaqLdItem[]): FaqPageLd {
  return {
    "@context": SCHEMA,
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export interface BreadcrumbLdItem {
  name: string;
  /** Site-relative path or absolute URL — both are normalised to absolute. */
  url: string;
}

export interface BreadcrumbListLd extends JsonLdNode {
  readonly "@type": "BreadcrumbList";
}

/**
 * BreadcrumbList. Pass the full trail including the current page, e.g.
 *   breadcrumbLd([
 *     { name: "Home", url: "/" },
 *     { name: "Features", url: "/features" },
 *     { name: "Transcripts", url: "/features/transcripts" },
 *   ])
 */
export function breadcrumbLd(trail: readonly BreadcrumbLdItem[]): BreadcrumbListLd {
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    itemListElement: trail.map(({ name, url }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: url.startsWith("http") ? url : absoluteUrl(url),
    })),
  };
}

/* -------------------------------------------------------------------------
   Rendering helper
   ---------------------------------------------------------------------- */

/**
 * Serialise one or more JSON-LD nodes for a `<script type="application/ld+json">`.
 *
 * The `<` escape matters: JSON-LD sits inside a raw-text `<script>` element,
 * so an unescaped `</script>` anywhere in the content (a feature summary, an
 * FAQ answer) would terminate the tag early. React does not escape inside
 * `dangerouslySetInnerHTML`, so we do.
 *
 * Usage in a page:
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: jsonLd(organizationLd(), webSiteLd()) }}
 *   />
 */
export function jsonLd(...nodes: readonly JsonLdNode[]): string {
  const payload = nodes.length === 1 ? nodes[0] : nodes;
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}
