import type { ReactNode } from "react";
import type { FeatureSection } from "@/content/types";
import { Icon } from "./Icon";
import { ScreenshotFrame } from "./ScreenshotFrame";
import { Heading, type SubHeadingLevel } from "./Heading";
import { cn } from "./utils";

export interface FeatureBlockProps {
  section: FeatureSection;
  /** Flip the columns. Alternate it down a page of blocks. */
  reverse?: boolean;
  headingLevel?: SubHeadingLevel;
  /**
   * Replaces the default visual. When omitted the block renders a
   * `<ScreenshotFrame>` — a real image if `section.image` is set, the on-brand
   * placeholder if not.
   */
  visual?: ReactNode;
  /** Extra content under the bullets, usually a CTA. */
  footer?: ReactNode;
  className?: string;
}

/**
 * The alternating text-and-visual deep-dive block from BRAND.md §4.
 * Two columns with a 4rem gap on ≥1024px, one column below that; on one
 * column the text always comes first regardless of `reverse`, because a
 * screenshot ahead of its own explanation reads as decoration.
 */
export function FeatureBlock({
  section,
  reverse = false,
  headingLevel = 3,
  visual,
  footer,
  className,
}: FeatureBlockProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        className,
      )}
    >
      <div className={cn("min-w-0", reverse && "lg:order-2")}>
        <Heading level={headingLevel} className="text-[clamp(1.35rem,2.1vw,1.75rem)] leading-[1.2] font-bold tracking-[-0.03em]">
          {section.heading}
        </Heading>
        <p className="mt-4 max-w-[34rem] text-base leading-[1.7]">{section.body}</p>

        {section.bullets?.length ? (
          <ul className="mt-6 flex list-none flex-col gap-3 p-0">
            {section.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    "bg-accent/12 text-accent-text",
                    "[.on-ink_&]:bg-accent/18 [.on-ink_&]:text-orange-300",
                  )}
                >
                  <Icon name="check" size={14} strokeWidth={2} />
                </span>
                <span className="text-[15px] leading-[1.6]">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {footer ? <div className="mt-8">{footer}</div> : null}
      </div>

      <div className={cn("min-w-0", reverse && "lg:order-1")}>
        {visual ??
          (section.image ? (
            <ScreenshotFrame
              src={section.image}
              alt={section.imageAlt ?? section.heading}
            />
          ) : (
            <ScreenshotFrame />
          ))}
      </div>
    </div>
  );
}
