import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * robots.txt for podlink.ai.
 *
 * Everything on this domain is public marketing content, so the rule is
 * "allow, and point at the sitemap". Two things are worth stating outright,
 * because both are common and both are wrong:
 *
 * 1. `/pricing` is NOT disallowed. It ships `noindex` while its numbers are
 *    unverified, and a `Disallow` would defeat that: a blocked URL is never
 *    fetched, so the `noindex` is never read, and Google will happily index
 *    the URL anyway from inbound links — with no description, and no way for
 *    us to remove it. Blocking and de-indexing are opposite instructions.
 *
 * 2. Next's generated assets (`/_next/*`) stay crawlable. Blocking them is
 *    cargo-culted from the old "save crawl budget" advice and now breaks
 *    rendering: Googlebot fetches the CSS and JS to render the page, and a
 *    blocked stylesheet turns a mobile-friendly page into an unstyled one.
 *
 * The product app at app.podlink.ai is a separate deployment on a separate
 * host and serves its own robots.txt — nothing here reaches it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
