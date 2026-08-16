import type { ReactNode } from "react";
import { cn } from "./utils";

/**
 * Fixed ids, because the `:checked` selectors that drive the whole mechanism
 * are written into class names and Tailwind can only see literal strings.
 * One BillingToggle per page.
 */
export const BILLING_MONTHLY_ID = "billing-monthly";
export const BILLING_ANNUAL_ID = "billing-annual";

export interface BillingToggleProps {
  /**
   * The price cards. They must be rendered inside this component: the toggle
   * works by `:has()` on a shared ancestor, so the cards have to live under
   * the same root as the radio inputs.
   */
  children: ReactNode;
  legend?: string;
  monthlyLabel?: string;
  annualLabel?: string;
  savingsLabel?: string;
  align?: "start" | "center";
  className?: string;
}

const LABEL_BASE = cn(
  "relative z-10 inline-flex min-h-11 cursor-pointer items-center rounded-full px-5",
  "text-sm font-semibold text-text-body transition-colors duration-200 ease-out-brand",
);

/**
 * Monthly / annual switch — CSS only, no JavaScript.
 *
 * Two `sr-only` radio inputs hold the state and `:has()` on this component's
 * root reveals the matching price inside every `<PriceCard>` below. That
 * matters for more than bundle size: both prices are in the markup on the
 * first byte, so a crawler that never boots JS still sees the annual price.
 *
 * The inputs are hidden with `sr-only` (clipped, still rendered) rather than
 * `display: none`, so they keep keyboard focus and arrow-key group behaviour.
 * Focus is mirrored onto the visible label, which is the thing a sighted
 * keyboard user is actually looking at.
 */
export function BillingToggle({
  children,
  legend = "Billing period",
  monthlyLabel = "Monthly",
  annualLabel = "Annual",
  savingsLabel = "2 months free",
  align = "center",
  className,
}: BillingToggleProps) {
  return (
    <div className={cn("group", className)}>
      <fieldset
        className={cn(
          "m-0 flex border-0 p-0",
          align === "center" ? "justify-center" : "justify-start",
        )}
      >
        <legend className="sr-only">{legend}</legend>

        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt p-1">
          <input
            id={BILLING_MONTHLY_ID}
            type="radio"
            name="billing"
            value="monthly"
            defaultChecked
            className="sr-only"
          />
          <input
            id={BILLING_ANNUAL_ID}
            type="radio"
            name="billing"
            value="annual"
            className="sr-only"
          />

          <label
            htmlFor={BILLING_MONTHLY_ID}
            className={cn(
              LABEL_BASE,
              "group-has-[#billing-monthly:checked]:bg-surface-ink group-has-[#billing-monthly:checked]:text-text-on-ink",
              "group-has-[#billing-monthly:focus-visible]:outline-2 group-has-[#billing-monthly:focus-visible]:outline-offset-2 group-has-[#billing-monthly:focus-visible]:outline-focus",
            )}
          >
            {monthlyLabel}
          </label>

          <label
            htmlFor={BILLING_ANNUAL_ID}
            className={cn(
              LABEL_BASE,
              "gap-2",
              "group-has-[#billing-annual:checked]:bg-surface-ink group-has-[#billing-annual:checked]:text-text-on-ink",
              "group-has-[#billing-annual:focus-visible]:outline-2 group-has-[#billing-annual:focus-visible]:outline-offset-2 group-has-[#billing-annual:focus-visible]:outline-focus",
            )}
          >
            {annualLabel}
            {savingsLabel ? (
              <span className="text-xs font-semibold text-accent-text group-has-[#billing-annual:checked]:text-orange-300">
                {savingsLabel}
              </span>
            ) : null}
          </label>
        </div>
      </fieldset>

      <div className="mt-10">{children}</div>
    </div>
  );
}
