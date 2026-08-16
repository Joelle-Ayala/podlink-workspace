import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * The default Open Graph / Twitter card for podlink.ai, 1200×630.
 *
 * This is the asset the old site never had: `marketing/layout.blade.php`
 * emitted `og:image` and `twitter:card=summary_large_image`, but nothing ever
 * supplied a URL, so every shared Podlink link previewed blank. Because this
 * file sits at the root of `app/`, Next attaches it to every route that does
 * not export its own — one file, whole site covered.
 *
 * BRAND RULES ENCODED HERE (see BRAND.md §4–5)
 *
 * - Orange is a FILL, never a text colour. It appears as the logo pill, the
 *   corner glow and the bottom rule. `#FF8C00` on white is 2.33:1 and fails
 *   AA outright; even here, where orange text on ink would technically pass
 *   at 8.20:1, keeping it fill-only means the card can never be recoloured
 *   into a failure by someone reusing these values on a light background.
 * - All type is white (19.1:1 on ink) or ink-400 grey (~7:1). No orange text,
 *   no white-on-orange.
 * - The wordmark is the outlined SVG, not live text. BRAND.md is explicit:
 *   "re-typeset 'PodLink' in live text" is on the do-not list, and outlines
 *   are why the lockup survives rasterisers that drop @font-face.
 *
 * These hex values are literals rather than tokens on purpose: `next/og`
 * rasterises through satori, which never sees `globals.css` and cannot
 * resolve a CSS custom property. They are copied from BRAND.md / the
 * `@theme` block, not invented — keep them in sync by hand if the ramp moves.
 */

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Brand values, mirrored from globals.css `@theme`. */
const INK = "#0f0f12"; // ink-900 field
const ORANGE = "#FF8C00"; // orange-500 — fill only
const WHITE = "#FFFFFF";
const MUTED = "#9AA3AE"; // ~ink-400, 7.4:1 on ink

/**
 * Fonts are read at module scope so the file I/O happens once per build
 * rather than once per render.
 *
 * WOFF, not WOFF2. satori's font parser handles ttf/otf/woff only — hand it
 * the `.woff2` files `layout.tsx` uses and it throws "Unsupported OpenType
 * signature wOF2". The `.woff` twins come from the same @fontsource/poppins
 * package (already a dependency) and are byte-for-byte the same outlines.
 */
const fontDir = join(process.cwd(), "src", "fonts");
const poppinsRegular = readFileSync(join(fontDir, "poppins-latin-400-normal.woff"));
const poppinsBold = readFileSync(join(fontDir, "poppins-latin-700-normal.woff"));

/**
 * The primary lockup for dark backgrounds, inlined from
 * `public/brand/podlink-wordmark-inverse.svg`.
 *
 * Inlined rather than `<img src="/brand/...">` because at build time there is
 * no server to fetch `/brand/...` from — a metadata route that reaches for
 * its own origin deadlocks or 404s depending on the host.
 */
const WORDMARK_PATH =
  "M189.0 69.4H182.4V85.0H171.8V41.5H189.0Q194.2 41.5 197.8 43.3Q201.4 45.1 203.2 48.2Q205.0 51.4 205.0 55.5Q205.0 59.3 203.3 62.4Q201.5 65.5 197.9 67.5Q194.3 69.4 189.0 69.4ZM194.2 55.5Q194.2 52.9 192.7 51.5Q191.2 50.0 188.2 50.0H182.4V60.9H188.2Q191.2 60.9 192.7 59.5Q194.2 58.1 194.2 55.5Z M206.7 67.7Q206.7 62.4 209.0 58.3Q211.4 54.2 215.5 52.1Q219.6 49.9 224.7 49.9Q229.8 49.9 233.8 52.1Q237.9 54.2 240.3 58.3Q242.6 62.4 242.6 67.7Q242.6 73.0 240.3 77.1Q237.9 81.2 233.8 83.3Q229.6 85.5 224.5 85.5Q219.5 85.5 215.4 83.3Q211.3 81.2 209.0 77.1Q206.7 73.1 206.7 67.7ZM231.9 67.7Q231.9 63.5 229.8 61.3Q227.7 59.1 224.7 59.1Q221.6 59.1 219.5 61.3Q217.5 63.5 217.5 67.7Q217.5 71.9 219.5 74.1Q221.5 76.3 224.5 76.3Q227.6 76.3 229.7 74.1Q231.9 71.9 231.9 67.7Z M259.7 49.9Q263.1 49.9 265.9 51.3Q268.8 52.8 270.4 55.2V39.1H281.0V85.0H270.4V80.0Q268.9 82.5 266.1 84.0Q263.4 85.5 259.7 85.5Q255.4 85.5 251.9 83.3Q248.5 81.1 246.5 77.0Q244.4 73.0 244.4 67.6Q244.4 62.3 246.5 58.3Q248.5 54.2 251.9 52.1Q255.4 49.9 259.7 49.9ZM262.8 59.1Q259.6 59.1 257.4 61.4Q255.2 63.7 255.2 67.6Q255.2 71.6 257.4 73.9Q259.6 76.3 262.8 76.3Q266.0 76.3 268.2 74.0Q270.4 71.7 270.4 67.7Q270.4 63.7 268.2 61.4Q266.0 59.1 262.8 59.1Z M297.5 76.8H311.4V85.0H286.9V41.5H297.5Z M313.8 41.1Q313.8 38.6 315.5 37.0Q317.3 35.3 320.1 35.3Q322.8 35.3 324.6 37.0Q326.3 38.6 326.3 41.1Q326.3 43.5 324.6 45.2Q322.8 46.8 320.1 46.8Q317.3 46.8 315.5 45.2Q313.8 43.5 313.8 41.1ZM325.4 50.4V85.0H314.8V50.4Z M365.7 64.8V85.0H355.2V66.2Q355.2 62.7 353.4 60.8Q351.6 58.9 348.5 58.9Q345.5 58.9 343.7 60.8Q341.9 62.7 341.9 66.2V85.0H331.3V50.4H341.9V55.0Q343.5 52.7 346.2 51.4Q349.0 50.0 352.4 50.0Q358.5 50.0 362.1 54.0Q365.7 57.9 365.7 64.8Z M392.5 85.0 382.0 70.5V85.0H371.4V39.1H382.0V64.5L392.4 50.4H405.5L391.1 67.8L405.6 85.0Z";

/** The 7-bar waveform inside the pill: [x, y, height]. */
const WAVEFORM_BARS: readonly [number, number, number][] = [
  [26, 51, 18],
  [41, 45, 30],
  [56, 37, 46],
  [71, 31, 58],
  [86, 37, 46],
  [101, 45, 30],
  [116, 51, 18],
];

function Wordmark({ width }: { width: number }) {
  const height = Math.round((width / 412) * 120);
  return (
    <svg width={width} height={height} viewBox="0 0 412 120" fill="none">
      <rect x="6" y="18" width="132" height="84" rx="42" fill={ORANGE} />
      {WAVEFORM_BARS.map(([x, y, h]) => (
        <rect key={x} x={x} y={y} width="9" height={h} rx="4.5" fill={INK} />
      ))}
      <path d={WORDMARK_PATH} fill={WHITE} />
    </svg>
  );
}

/**
 * "Grow your show. Not your workload." set on two lines.
 *
 * Split off `SITE.tagline` rather than retyped, so the card cannot drift from
 * the tagline the rest of the site renders. The lookbehind splits after the
 * sentence-ending period; if the tagline ever becomes a single sentence the
 * fallback puts all of it on line one.
 */
function taglineLines(): string[] {
  const parts = SITE.tagline.split(/(?<=\.)\s+/).filter(Boolean);
  return parts.length > 0 ? parts : [SITE.tagline];
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: INK,
          // Orange glow, top-right. Pure fill — no text ever sits on it.
          //
          // Painted as the root's own background rather than an absolutely
          // positioned circle: satori does not clip a background-image to
          // `border-radius`, so a rounded overlay div renders its gradient as
          // a rectangle and leaves a visible hard edge where the box ends.
          // Putting the gradient on the full-bleed root means the only edges
          // it can have are the canvas edges.
          backgroundImage:
            "radial-gradient(circle at 88% 6%, rgba(255,140,0,0.34) 0%, rgba(255,140,0,0.10) 18%, rgba(255,140,0,0) 34%)",
          padding: "76px 80px 90px 80px",
          fontFamily: "Poppins",
        }}
      >
        <div style={{ display: "flex" }}>
          <Wordmark width={340} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {taglineLines().map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                color: WHITE,
                fontSize: 84,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -2.5,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: MUTED,
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: 860,
            }}
          >
            {SITE.description}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: WHITE,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {SITE.domain}
          </div>
        </div>

        {/* Full-bleed orange rule. The second fill accent, and the thing that
            makes the card read as Podlink at thumbnail size in a timeline. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 14,
            display: "flex",
            backgroundColor: ORANGE,
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: poppinsRegular, weight: 400, style: "normal" },
        { name: "Poppins", data: poppinsBold, weight: 700, style: "normal" },
      ],
    },
  );
}
