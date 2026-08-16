import { ImageResponse } from "next/og";

/**
 * Browser tab icon, 32×32 PNG.
 *
 * Geometry is the 3-bar reduction from `public/brand/podlink-favicon.svg`.
 * BRAND.md is specific about why it is three bars and not the seven of the
 * full mark: five or more turn to mush at 16px.
 *
 * The orange pill supplies its own background, so the ink bars sit at 8.20:1
 * whether the browser chrome behind it is light or dark. That is the whole
 * point of the mark's construction — there is no light/dark variant to get
 * wrong.
 *
 * Drawn with divs rather than the SVG file because a metadata route has no
 * origin to fetch `/brand/...` from at build time. Values are literal hex
 * because satori never sees `globals.css`; they mirror the `@theme` ramp.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const INK = "#0f0f12";
const ORANGE = "#FF8C00";

/** Bar heights on the 32px grid, matching podlink-favicon.svg. */
const BAR_HEIGHTS = [8, 12, 8] as const;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 30,
            height: 18,
            borderRadius: 9,
            backgroundColor: ORANGE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {BAR_HEIGHTS.map((height, index) => (
            <div
              key={height + index}
              style={{
                width: 4,
                height,
                borderRadius: 2,
                backgroundColor: INK,
                // No `gap`: satori's flex implementation does not support it
                // in every version, and a silently ignored gap here collapses
                // the three bars into one blob.
                marginRight: index === BAR_HEIGHTS.length - 1 ? 0 : 2,
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
