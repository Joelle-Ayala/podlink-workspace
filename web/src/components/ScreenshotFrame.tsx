import Image from "next/image";
import { RADIUS_CARD, cn } from "./utils";

interface ScreenshotFrameBase {
  caption?: string;
  /** The macOS-ish dot bar. Decorative, `aria-hidden`. */
  chrome?: boolean;
  /**
   * Runs the frame past the column edge on ≥1024px — "there is more app than
   * fits". Desktop only, once per page at most (BRAND.md §4).
   */
  bleed?: boolean;
  /** Intrinsic pixels, so layout space is reserved before the image loads. */
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

type WithImage = ScreenshotFrameBase & {
  /** Path under /public. */
  src: string;
  /** Describe what the screen *shows*, not that it is a screenshot. */
  alt: string;
};

type WithoutImage = ScreenshotFrameBase & {
  src?: undefined;
  alt?: never;
};

export type ScreenshotFrameProps = WithImage | WithoutImage;

/**
 * The single treatment for every product visual (BRAND.md §4).
 *
 * A screenshot is always in this frame, never a bare `<img>`: 20px radius, a
 * hairline border, a tinted shadow, no tilt, no device mockup, nothing baked
 * into the export. Exports are 1440 logical @2x with no browser chrome — the
 * frame supplies the corners, border and shadow.
 *
 * There are no real product screenshots yet, so with no `src` this renders an
 * on-brand placeholder in exactly the same frame. Swapping in a real image
 * later changes nothing around it. The placeholder is entirely decorative and
 * is hidden from assistive tech.
 *
 * `alt` is required by the type whenever `src` is given.
 */
export function ScreenshotFrame(props: ScreenshotFrameProps) {
  const {
    caption,
    chrome = true,
    bleed = false,
    width = 1440,
    height = 900,
    sizes = "(min-width: 1024px) 640px, 100vw",
    priority = false,
    className,
  } = props;

  return (
    <figure className={cn("m-0", bleed && "lg:-me-24", className)}>
      <div
        className={cn(
          RADIUS_CARD,
          "overflow-hidden border border-border bg-surface shadow-2xl shadow-ink-900/15",
          "[.on-ink_&]:border-ink-0/12 [.on-ink_&]:bg-surface-ink [.on-ink_&]:shadow-ink-900/60",
        )}
      >
        {chrome ? (
          <div
            aria-hidden="true"
            className={cn(
              "flex items-center gap-1.5 border-b border-border bg-surface-alt px-4 py-3",
              "[.on-ink_&]:border-ink-0/10 [.on-ink_&]:bg-ink-0/5",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong [.on-ink_&]:bg-ink-0/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong [.on-ink_&]:bg-ink-0/20" />
          </div>
        ) : null}

        {props.src ? (
          <Image
            src={props.src}
            alt={props.alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            className="block h-auto w-full"
          />
        ) : (
          <Placeholder />
        )}
      </div>

      {caption ? (
        <figcaption className="mt-3 text-sm text-text-muted [.on-ink_&]:text-text-on-ink/62">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Stand-in for the product shot: a skeleton workspace with a small orange bar
 * chart. Purely decorative — it says "a screen goes here" and nothing else, so
 * it carries no alt text and is hidden from the accessibility tree.
 */
function Placeholder() {
  const bars = [38, 62, 46, 78, 55, 90, 68];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "aspect-[16/10] w-full bg-surface-alt p-5 sm:p-7",
        "[.on-ink_&]:bg-ink-0/4",
      )}
    >
      <div className="flex h-full flex-col gap-5 sm:flex-row">
        <div className="hidden w-32 shrink-0 flex-col gap-2.5 sm:flex">
          <span className="h-2.5 w-20 rounded-full bg-accent/40" />
          <span className="h-2 w-24 rounded-full bg-border-strong [.on-ink_&]:bg-ink-0/15" />
          <span className="h-2 w-16 rounded-full bg-border-strong [.on-ink_&]:bg-ink-0/15" />
          <span className="h-2 w-20 rounded-full bg-border-strong [.on-ink_&]:bg-ink-0/15" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="h-3 w-2/5 rounded-full bg-border-strong [.on-ink_&]:bg-ink-0/25" />
            <span className="h-2 w-4/5 rounded-full bg-border [.on-ink_&]:bg-ink-0/12" />
            <span className="h-2 w-3/5 rounded-full bg-border [.on-ink_&]:bg-ink-0/12" />
          </div>

          <div
            className={cn(
              "flex flex-1 items-end gap-2 rounded-xl border border-border bg-surface p-3",
              "[.on-ink_&]:border-ink-0/10 [.on-ink_&]:bg-ink-0/5",
            )}
          >
            {bars.map((height, index) => (
              <span
                key={index}
                style={{ height: `${height}%` }}
                className="w-full flex-1 rounded-sm bg-accent/70"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
