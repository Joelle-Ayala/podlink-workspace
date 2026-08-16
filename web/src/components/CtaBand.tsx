import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { Button, ButtonRow } from "./Button";
import { Container } from "./Container";
import { CTA } from "@/lib/site";
import { Heading } from "./Heading";
import { INK_BAND, RADIUS_BAND, cn } from "./utils";

export interface CtaBandLink {
  label: string;
  href: string;
}

export interface CtaBandProps {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  /** Defaults to the site-wide "Start free". */
  primary?: CtaBandLink;
  secondary?: CtaBandLink;
  note?: ReactNode;
  /** 2 unless the page's outline needs otherwise. */
  level?: 2 | 3;
  id?: string;
  className?: string;
}

/**
 * The closing ask. An ink card with an orange glow, set on a light band so it
 * reads as a distinct object rather than a second dark section — BRAND.md §4
 * warns against putting an ink band directly against the footer, which is
 * itself ink.
 */
export function CtaBand({
  eyebrow,
  title,
  body,
  primary = { label: CTA.primary.label, href: CTA.primary.href },
  secondary,
  note,
  level = 2,
  id,
  className,
}: CtaBandProps) {
  return (
    <section id={id} className={cn("bg-surface py-12 sm:py-16 lg:py-24", className)}>
      <Container>
        <div
          className={cn(
            RADIUS_BAND,
            INK_BAND,
            "relative isolate overflow-hidden bg-surface-ink px-6 py-14 text-center sm:px-12 sm:py-20",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[36rem] max-w-[130%] -translate-x-1/2 rounded-full bg-accent opacity-25 blur-[110px]"
          />

          {eyebrow ? (
            <div className="mb-5">
              <Badge>{eyebrow}</Badge>
            </div>
          ) : null}

          <Heading
            level={level}
            className="mx-auto max-w-[38rem] text-[clamp(1.9rem,3.4vw,2.85rem)] leading-[1.15] font-bold tracking-[-0.03em]"
          >
            {title}
          </Heading>

          {body ? (
            <p className="mx-auto mt-4 max-w-[34rem] text-lg leading-[1.6]">{body}</p>
          ) : null}

          <ButtonRow align="center" className="mt-8">
            <Button href={primary.href} variant="primary" size="lg">
              {primary.label}
            </Button>
            {secondary ? (
              <Button href={secondary.href} variant="ghost" size="lg">
                {secondary.label}
              </Button>
            ) : null}
          </ButtonRow>

          {note ? (
            <p className="mt-5 text-sm text-text-on-ink/62">{note}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
