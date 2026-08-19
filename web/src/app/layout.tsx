import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { SiteFooter, SiteHeader } from "@/components";
import { FEATURES } from "@/content/features";
import { SITE } from "@/lib/site";
import "./globals.css";

/* The footer's Features column is derived from content so a new feature shows
   up in the footer the moment it exists, without a second place to update. */
const FEATURE_LINKS = FEATURES.map((f) => ({
  label: f.name,
  href: `/features/${f.slug}`,
}));

/* Poppins is the brand face (carried over from the MagicAI theme). Only the
   four weights actually used are loaded — see BRAND.md.
   Self-hosted rather than pulled from Google Fonts: one less third-party
   request, no external dependency at build time, and better privacy. */
const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-surface text-text-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-text-on-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter featureLinks={FEATURE_LINKS} />
        {/* GA4 — property "Podlink", stream podlink.ai (set up 2026-08-19).
            gtag.js loads afterInteractive so it never blocks first paint. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6BJQCTFXZZ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6BJQCTFXZZ');`}
        </Script>
      </body>
    </html>
  );
}
