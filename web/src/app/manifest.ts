import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Web app manifest (Brief 1, P-03 — the last missing piece of the favicon
 * set; BRAND.md §5). Icons reference the outlined brand SVGs shipped in
 * `public/brand/` — SVG manifest icons are supported by every Chromium
 * browser, and `sizes: "any"` lets the platform rasterise at whatever size
 * it needs. `podlink-appicon.svg` keeps all artwork inside the 80% maskable
 * safe zone, so the same file serves `maskable` without clipping a bar.
 *
 * Colors mirror the brand ramp: ink surface, orange accent (fill-only rule).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "browser",
    background_color: "#0f0f12",
    theme_color: "#FF8C00",
    icons: [
      {
        src: "/brand/podlink-favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/brand/podlink-appicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
