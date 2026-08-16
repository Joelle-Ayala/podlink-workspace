import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { Button, ButtonRow } from "./Button";
import { Container } from "./Container";
import { Heading, type HeadingLevel } from "./Heading";
import { INK_BAND, cn } from "./utils";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroProps {
  /** Small pill above the headline. */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** The lead paragraph under the headline. */
  sub?: ReactNode;
  primary?: HeroCta;
  secondary?: HeroCta;
  /** The "no card required" line under the buttons. */
  note?: ReactNode;
  /** Product visual — usually a `<ScreenshotFrame>`. */
  visual?: ReactNode;
  tone?: "ink" | "light";
  /**
   * Centred with the visual below, or split with the visual beside the copy.
   * `split` falls back to stacked below 1024px.
   */
  layout?: "center" | "split";
  /** h1 on a page hero; drop to h2 only on a page that already has an h1. */
  level?: HeadingLevel;
  id?: string;
  className?: string;
}

/**
 * Page hero.
 *
 * Ink by default: BRAND.md's page rhythm opens on a near-black band, which is
 * also the one place brand orange can be used at full strength without a
 * contrast problem — 8.20:1 on ink against 2.33:1 on white.
 *
 * The glow is a blurred orange disc rather than a gradient with a baked-in
 * alpha, so it stays on the token and cannot drift off-brand.
 */
export function Hero({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  note,
  visual,
  tone = "ink",
  layout = "center",
  level = 1,
  id,
  className,
}: HeroProps) {
  const isInk = tone === "ink";
  const isSplit = layout === "split";

  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden",
        isInk ? cn("bg-surface-ink", INK_BAND) : "bg-surface text-text-body",
        "py-16 sm:py-20 lg:py-28",
        className,
      )}
    >
      {isInk ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[42rem] max-w-[120%] -translate-x-1/2 rounded-full bg-accent opacity-20 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-60"
          />
        </>
      ) : null}

      <Container>
        <div
          className={cn(
            isSplit
              ? "grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
              : "flex flex-col items-center text-center",
          )}
        >
          <div className={cn("min-w-0", !isSplit && "max-w-[48rem]")}>
            {eyebrow ? (
              <div className="mb-5">
                {typeof eyebrow === "string" ? <Badge>{eyebrow}</Badge> : eyebrow}
              </div>
            ) : null}

            <Heading
              level={level}
              className="text-[clamp(2.4rem,5.2vw,4rem)] leading-[1.08] font-bold tracking-[-0.04em]"
            >
              {title}
            </Heading>

            {sub ? (
              <p
                className={cn(
                  "mt-5 text-lg leading-[1.6] sm:text-xl",
                  !isSplit && "mx-auto max-w-[38rem]",
                )}
              >
                {sub}
              </p>
            ) : null}

            {primary || secondary ? (
              <ButtonRow align={isSplit ? "start" : "center"} className="mt-8">
                {primary ? (
                  <Button href={primary.href} variant="primary" size="lg">
                    {primary.label}
                  </Button>
                ) : null}
                {secondary ? (
                  <Button href={secondary.href} variant="ghost" size="lg">
                    {secondary.label}
                  </Button>
                ) : null}
              </ButtonRow>
            ) : null}

            {note ? (
              <p
                className={cn(
                  "mt-5 text-sm",
                  isInk ? "text-text-on-ink/62" : "text-text-muted",
                )}
              >
                {note}
              </p>
            ) : null}
          </div>

          {visual ? (
            <div className={cn("min-w-0", !isSplit && "mt-14 w-full")}>{visual}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
