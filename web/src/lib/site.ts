/**
 * Single source of truth for site-wide constants.
 *
 * Why APP_URL matters here: podlink.ai (this site) and app.podlink.ai (the
 * MagicAI product) are now genuinely separate deployments. Every signup /
 * sign-in CTA is a cross-domain link into the app, so it goes through
 * `appUrl()` rather than being hardcoded in a component.
 */

export const SITE = {
  name: "Podlink",
  domain: "podlink.ai",
  url: "https://podlink.ai",
  tagline: "Grow your show. Not your workload.",
  description:
    "AI show notes, clips and newsletters. Real download analytics. Your own podlink.fm page.",
  app: "https://app.podlink.ai",
  bio: "https://podlink.fm",
  author: "Podlink",
} as const;

/**
 * Canonical origin for absolute URLs. The services/case-studies bundle pages
 * (2026-08-19) import { siteUrl }; it is an alias of SITE.url.
 */
export const siteUrl = SITE.url;

/** Build a URL into the product app. */
export function appUrl(path = "/"): string {
  return `${SITE.app}${path.startsWith("/") ? path : `/${path}`}`;
}

export const CTA = {
  primary: { label: "Start free", href: appUrl("/register") },
  secondary: { label: "Sign in", href: appUrl("/login") },
} as const;

export const NAV = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
] as const;
