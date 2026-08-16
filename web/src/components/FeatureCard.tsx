import Link from "next/link";
import type { Feature } from "@/content/types";
import { Icon, IconChip } from "./Icon";
import { Heading, type SubHeadingLevel } from "./Heading";
import { RADIUS_CARD, cn } from "./utils";

export interface FeatureCardProps {
  feature: Feature;
  /**
   * The heading element to render, so a page can keep its heading order
   * correct. The *size* is fixed at 17px/600 regardless — the level is a
   * document-structure decision, not a visual one.
   */
  headingLevel?: SubHeadingLevel;
  /**
   * Makes the whole card a link. BRAND.md §4: a card only lifts if the entire
   * card is the link; a card with a link inside it must not lift.
   */
  href?: string;
  /** Label for the affordance at the bottom of a linked card. */
  linkLabel?: string;
  className?: string;
}

export function FeatureCard({
  feature,
  headingLevel = 3,
  href,
  linkLabel = "Read more",
  className,
}: FeatureCardProps) {
  const shell = cn(
    RADIUS_CARD,
    "flex h-full flex-col items-start gap-4 border border-border bg-surface p-8",
    "[.on-ink_&]:border-ink-0/12 [.on-ink_&]:bg-ink-0/5",
    href &&
      cn(
        "no-underline transition-[transform,border-color,box-shadow] duration-200 ease-out-brand",
        "hover:-translate-y-1 hover:border-accent/45 hover:shadow-xl hover:shadow-ink-900/10",
        "motion-reduce:hover:translate-y-0",
      ),
    className,
  );

  const body = (
    <>
      <IconChip name={feature.icon} />
      <Heading level={headingLevel} className="text-[17px] leading-[1.35] font-semibold tracking-[-0.01em] text-text-primary [.on-ink_&]:text-text-on-ink">
        {feature.name}
      </Heading>
      <p className="text-[15px] leading-[1.6] text-text-body [.on-ink_&]:text-text-on-ink/72">
        {feature.tagline}
      </p>
      {href ? (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[15px] font-semibold text-accent-text [.on-ink_&]:text-orange-300">
          {linkLabel}
          <Icon name="arrow" size={16} className="transition-transform duration-200 ease-out-brand group-hover/card:translate-x-0.5" />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("group/card", shell)}>
        {body}
      </Link>
    );
  }

  return <article className={shell}>{body}</article>;
}
