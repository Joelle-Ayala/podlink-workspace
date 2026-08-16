import type { FaqItem } from "@/content/types";
import { Icon } from "./Icon";
import { Heading, type SubHeadingLevel } from "./Heading";
import { RADIUS_CARD, cn } from "./utils";

export interface FaqProps {
  items: FaqItem[];
  /** Heading level for each question. Set it to match the page's outline. */
  headingLevel?: SubHeadingLevel;
  /**
   * Set a name to make the group exclusive (opening one closes the rest) via
   * the native `name` attribute on `<details>`. Must be unique on the page.
   * Left unset, every item opens independently — the safer default.
   */
  name?: string;
  className?: string;
}

/**
 * Native `<details>/<summary>` accordion — no JavaScript, so it works before
 * hydration, with JS disabled, and inside a crawler that never runs scripts.
 * The answers are in the DOM whether or not an item is open.
 *
 * The chevron is decorative and rotates on `[open]`.
 *
 * Focus: each item clips its own corners with `overflow-hidden`, which would
 * cut off the global 3px-offset focus ring on `<summary>`. The offset is
 * pulled inside the box here so the ring stays fully visible.
 */
export function Faq({ items, headingLevel = 3, name, className }: FaqProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <details
          key={item.q}
          name={name}
          className={cn(
            RADIUS_CARD,
            "group overflow-hidden border border-border bg-surface",
            "[.on-ink_&]:border-ink-0/12 [.on-ink_&]:bg-ink-0/5",
          )}
        >
          <summary
            className={cn(
              "flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4",
              "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-focus",
              "hover:bg-surface-alt [.on-ink_&]:hover:bg-ink-0/5",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <Heading level={headingLevel} className="text-[15px] leading-[1.4] font-semibold text-text-primary [.on-ink_&]:text-text-on-ink">
              {item.q}
            </Heading>
            <Icon
              name="arrow"
              size={18}
              className="shrink-0 rotate-90 text-text-muted transition-transform duration-200 ease-out-brand group-open:-rotate-90 [.on-ink_&]:text-text-on-ink/72"
            />
          </summary>
          <div className="px-5 pb-5 text-[15px] leading-[1.7] text-text-body [.on-ink_&]:text-text-on-ink/72">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
