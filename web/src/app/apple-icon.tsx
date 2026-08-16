import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon, 180×180 PNG.
 *
 * Geometry is `public/brand/podlink-appicon.svg` scaled from its 512 grid.
 * Full-bleed orange with no transparent edge: iOS composites a touch icon
 * onto a white sheet and squares off the corners itself, so a transparent
 * background produces a white tile with a floating pill.
 *
 * All artwork stays inside the central 80% safe zone, so the same geometry
 * survives Android's maskable circle crop without clipping a bar.
 *
 * Ink bars on the orange field are 8.20:1. Do NOT invert this to cream bars —
 * cream on #FF8C00 is 1.99:1 and the waveform disappears (BRAND.md §4).
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const INK = "#0f0f12";
const ORANGE = "#FF8C00";

/** 512-grid source values from podlink-appicon.svg, scaled to 180. */
const SCALE = 180 / 512;
const BAR_WIDTH = Math.round(34 * SCALE); // 12
const BAR_GAP = Math.round((58 - 34) * SCALE); // 8 — pitch 58 minus bar width
const BAR_HEIGHTS = [56, 120, 192, 120, 56].map((h) => Math.round(h * SCALE));

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ORANGE,
        }}
      >
        {BAR_HEIGHTS.map((height, index) => (
          <div
            key={`${height}-${index}`}
            style={{
              width: BAR_WIDTH,
              height,
              borderRadius: BAR_WIDTH / 2,
              backgroundColor: INK,
              // Explicit margin rather than `gap` — see the note in icon.tsx.
              marginRight: index === BAR_HEIGHTS.length - 1 ? 0 : BAR_GAP,
            }}
          />
        ))}
      </div>
    ),
    size,
  );
}
