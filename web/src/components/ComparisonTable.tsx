import type { ComparisonSection, PricingTier } from "@/content/types";
import { Icon } from "./Icon";
import { RADIUS_CARD, cn } from "./utils";

export type ComparisonTier = Pick<PricingTier, "id" | "name">;

export interface ComparisonTableProps {
  sections: ComparisonSection[];
  /** Column order. Ids must match the keys in each row's `values`. */
  tiers: readonly ComparisonTier[];
  /** Required: a `<caption>` is what names the table for a screen reader. */
  caption: string;
  /** Visually hide the caption but keep it in the accessibility tree. */
  hideCaption?: boolean;
  /** Label for the horizontal scroll region. */
  scrollLabel?: string;
  className?: string;
}

const CELL = "px-4 py-3 text-sm";
/** The sticky first column needs its own opaque background or rows scroll under it. */
const ROW_HEADER = cn(
  CELL,
  "sticky left-0 z-10 bg-surface text-left font-medium text-text-primary",
  "after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-border after:content-['']",
  "[.on-ink_&]:bg-surface-ink [.on-ink_&]:text-text-on-ink [.on-ink_&]:after:bg-ink-0/12",
);

/**
 * Feature-by-tier comparison.
 *
 * It stays a real `<table>` at every width. The mobile pattern is a horizontal
 * scroller with a sticky feature column — deliberately *not* the common
 * `display: block` restyle, which detaches cells from their row and column
 * headers and leaves several screen readers announcing a flat list of values
 * with nothing to attach them to.
 *
 * The scroller is a labelled `role="region"` with `tabindex="0"` so it can be
 * reached and panned from the keyboard.
 *
 * Boolean cells pair an `aria-hidden` glyph with sr-only text, so "included"
 * is never carried by a shape or a colour alone.
 */
export function ComparisonTable({
  sections,
  tiers,
  caption,
  hideCaption = false,
  scrollLabel = "Plan comparison, scrollable",
  className,
}: ComparisonTableProps) {
  return (
    <div
      role="region"
      aria-label={scrollLabel}
      tabIndex={0}
      className={cn(
        RADIUS_CARD,
        "overflow-x-auto border border-border bg-surface",
        "[.on-ink_&]:border-ink-0/12 [.on-ink_&]:bg-surface-ink",
        className,
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption
          className={cn(
            hideCaption
              ? "sr-only"
              : cn(
                  "px-4 py-4 text-left text-sm text-text-muted",
                  "[.on-ink_&]:text-text-on-ink/72",
                ),
          )}
        >
          {caption}
        </caption>

        <thead>
          <tr className="border-b border-border [.on-ink_&]:border-ink-0/12">
            <th scope="col" className={cn(ROW_HEADER, "font-semibold")}>
              Feature
            </th>
            {tiers.map((tier) => (
              <th
                key={tier.id}
                scope="col"
                className={cn(
                  CELL,
                  "text-left font-semibold whitespace-nowrap text-text-primary",
                  "[.on-ink_&]:text-text-on-ink",
                )}
              >
                {tier.name}
              </th>
            ))}
          </tr>
        </thead>

        {sections.map((section) => (
          <tbody key={section.heading}>
            <tr className="border-b border-border [.on-ink_&]:border-ink-0/12">
              <th
                scope="rowgroup"
                colSpan={tiers.length + 1}
                className={cn(
                  "sticky left-0 bg-surface-alt px-4 py-2.5 text-left",
                  "text-xs font-semibold tracking-[0.08em] text-text-body uppercase",
                  "[.on-ink_&]:bg-ink-0/8 [.on-ink_&]:text-text-on-ink/72",
                )}
              >
                {section.heading}
              </th>
            </tr>

            {section.rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-border last:border-0 [.on-ink_&]:border-ink-0/12"
              >
                <th scope="row" className={ROW_HEADER}>
                  {row.label}
                </th>
                {tiers.map((tier) => (
                  <td
                    key={tier.id}
                    className={cn(
                      CELL,
                      "text-text-body",
                      "[.on-ink_&]:text-text-on-ink/72",
                    )}
                  >
                    <Cell value={row.values[tier.id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

function Cell({ value }: { value: boolean | string | undefined }) {
  if (typeof value === "string") {
    return <span>{value}</span>;
  }

  if (value === true) {
    return (
      <>
        <Icon
          name="check"
          size={18}
          strokeWidth={2.2}
          className="text-accent-text [.on-ink_&]:text-orange-300"
        />
        <span className="sr-only">Included</span>
      </>
    );
  }

  return (
    <>
      <span aria-hidden="true" className="text-text-muted [.on-ink_&]:text-text-on-ink/62">
        —
      </span>
      <span className="sr-only">Not included</span>
    </>
  );
}
