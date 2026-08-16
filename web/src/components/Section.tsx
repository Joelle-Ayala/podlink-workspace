import type { ReactNode } from "react";
import { Container, type ContainerWidth } from "./Container";
import { Heading } from "./Heading";
import { INK_BAND, cn } from "./utils";

export type SectionTone = "light" | "alt" | "ink" | "accent";
export type SectionSize = "default" | "tight" | "flush";

export interface SectionProps {
  children: ReactNode;
  /**
   * The band colour. Page rhythm per BRAND.md §4:
   * ink hero → light → alt → light → ink → light → CTA → footer.
   * Never two `alt` bands in a row; at most two `ink` bands per page.
   */
  tone?: SectionTone;
  size?: SectionSize;
  /** Set false to lay out the children yourself (e.g. a full-bleed visual). */
  container?: boolean;
  containerWidth?: ContainerWidth;
  id?: string;
  /** id of the heading that names this section, for `aria-labelledby`. */
  labelledBy?: string;
  className?: string;
  /** Classes for the inner container, not the band. */
  innerClassName?: string;
}

const TONES: Record<SectionTone, string> = {
  light: "bg-surface text-text-body",
  alt: "bg-surface-alt text-text-body",
  accent: "bg-surface-accent text-text-body",
  ink: cn("bg-surface-ink", INK_BAND),
};

/**
 * Vertical rhythm band. BRAND.md §3: 112px desktop → 64px → 48px on phones.
 */
const SIZES: Record<SectionSize, string> = {
  default: "py-12 sm:py-16 lg:py-28",
  tight: "py-8 sm:py-10 lg:py-16",
  flush: "py-0",
};

export function Section({
  children,
  tone = "light",
  size = "default",
  container = true,
  containerWidth = "default",
  id,
  labelledBy,
  className,
  innerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate", TONES[tone], SIZES[size], className)}
    >
      {container ? (
        <Container width={containerWidth} className={innerClassName}>
          {children}
        </Container>
      ) : (
        children
      )}
    </section>
  );
}

export interface SectionHeadProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Heading id, so the owning `<Section>` can point `aria-labelledby` at it. */
  titleId?: string;
  align?: "start" | "center";
  /** 2 by default. Lower it only if the page's heading order needs it. */
  level?: 2 | 3;
  className?: string;
}

/**
 * The heading block that opens a section: optional eyebrow, heading, intro.
 * Capped at the 46rem measure so a long intro never runs the full 1170px.
 */
export function SectionHead({
  eyebrow,
  title,
  intro,
  titleId,
  align = "start",
  level = 2,
  className,
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        "max-w-[46rem]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
      <Heading
        level={level}
        id={titleId}
        className="text-[clamp(1.9rem,3.4vw,2.85rem)] leading-[1.2] font-bold tracking-[-0.03em]"
      >
        {title}
      </Heading>
      {intro ? (
        <p className="mt-4 text-lg leading-[1.6]">{intro}</p>
      ) : null}
    </div>
  );
}
