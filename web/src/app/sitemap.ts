import type { MetadataRoute } from "next";
import { FEATURES } from "@/content/features";
import { services } from "@/content/services";
import { visibleCaseStudies } from "@/content/proof";
import { absoluteUrl } from "@/lib/seo";

/**
 * XML sitemap for podlink.ai.
 *
 * Feature URLs are derived from `FEATURES` rather than listed by hand, so a
 * new entry in `src/content/features.ts` shows up here the moment it ships.
 * The slugs in that file are the URLs — see the warning at the top of it.
 *
 * `lastModified` is the build time. That is honest for a static marketing
 * site: every page is regenerated on deploy, and there is no per-page
 * timestamp to be more precise with. Faking older dates to look "stable" or
 * newer ones to look "fresh" both just teach Google to ignore the field.
 *
 * WHAT IS DELIBERATELY NOT HERE
 *
 * `/pricing` — omitted, confirmed 2026-08-19. The tier ladder now follows the
 *   2026-08-17 canon (Free / Pro $19 / Creator $39–49), but
 *   `src/content/pricing.ts` still carries two blocking marker types:
 *   `TODO(pricing): unverified limit` (splits nobody has decided) and
 *   `TODO(pricing): unshipped` (capabilities in the plan but not built). So
 *   the page ships `noindex`. Submitting a noindex URL in a sitemap is a
 *   self-inflicted "Submitted URL marked noindex" error in Search Console,
 *   and worse, wrong prices are the one kind of marketing error that follows
 *   you: they get cached in the SERP and people arrive expecting them.
 *   TO RE-ADD: clear both marker types in `src/content/pricing.ts` (the canon
 *   is the spec, NOT the stale PRICING.md), drop the `noIndex` flag from the
 *   page's `pageMetadata()` call, then uncomment the entry below.
 *
 * `/legal/*` — INCLUDED, at the floor priority. The alternative was to leave
 *   them out as boilerplate, but they are canonical, indexable, first-party
 *   pages, and leaving them out of the sitemap does not stop them being
 *   indexed — it only removes our say in which URL Google picks when the
 *   same terms text is reachable from the app domain too. Listing them
 *   asserts podlink.ai as the canonical home for that text, which is the
 *   whole reason the two deployments were decoupled. Priority 0.1 and
 *   `yearly` keeps them from competing with product pages for crawl budget.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/features"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // { url: absoluteUrl("/pricing"), ... } — see note above.
    // MCP setup docs: indexable and live (server deployed + e2e-verified
    // 2026-08-27; documents the working custom-connector path). The MARKETING
    // page /features/mcp stays out until its index-flip checklist clears.
    {
      url: absoluteUrl("/features/mcp/setup"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // /claude — the Cluster A landing page (live capability, no directory
    // claims until listing day).
    {
      url: absoluteUrl("/claude"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // /analyze — the pre-signup podcast analyzer (sprint E free tool; a
    // genuine PLG surface, so it earns tool-page priority).
    {
      url: absoluteUrl("/analyze"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // One entry per feature. These are the deepest genuinely useful pages on
  // the site and the ones with a real shot at long-tail search, so they sit
  // just under the hub rather than being treated as leaf filler.
  const featureRoutes: MetadataRoute.Sitemap = FEATURES.map((feature) => ({
    url: absoluteUrl(`/features/${feature.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const legalRoutes: MetadataRoute.Sitemap = ["/legal/terms", "/legal/privacy"].map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.1,
    }),
  );

  // Services business (merged from the 2026-08-19 bundle). Deliberately NOT
  // here: /resources/podcast-guest-pitch-template (noindex until its download
  // link is real) and /features/mcp (noindex until the MCP server ships).
  const serviceRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/services"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // /founders — ICP launch-gate page (external-context §22).
    {
      url: absoluteUrl("/founders"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // /partners/pr-agencies — ICP launch-gate page (external-context §22).
    {
      url: absoluteUrl("/partners/pr-agencies"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/work"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/case-studies"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Cleared case studies only — the selector already applies the gate.
    ...visibleCaseStudies().map((c) => ({
      url: absoluteUrl(`/case-studies/${c.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: absoluteUrl("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/changelog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  return [...staticRoutes, ...featureRoutes, ...serviceRoutes, ...legalRoutes];
}
