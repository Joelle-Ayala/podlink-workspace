import type { PricingTier } from "@/content/types";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Heading, type SubHeadingLevel } from "./Heading";
import { RADIUS_CARD, cn } from "./utils";

export interface PriceCardProps {
  tier: PricingTier;
  headingLevel?: SubHeadingLevel;
  /**
   * Currency prefix. Content stores plain numbers so the same tier can be
   * rendered in another currency later without editing copy.
   */
  currency?: string;
  className?: string;
}

/** Convention from types.ts: annual is 10× monthly unless stated. */
function annualPrice(tier: PricingTier): number {
  return tier.priceAnnual ?? tier.priceMonthly * 10;
}

function format(currency: string, amount: number): string {
  return `${currency}${amount % 1 === 0 ? amount : amount.toFixed(2)}`;
}

/**
 * A pricing tier.
 *
 * Both the monthly and the annual price are always in the DOM; `<BillingToggle>`
 * decides which one is shown, in CSS. Nothing here waits for JavaScript, so a
 * crawler that never boots scripts still sees both numbers, and switching the
 * period cannot produce a flash of the wrong price.
 */
export function PriceCard({
  tier,
  headingLevel = 3,
  currency = "$",
  className,
}: PriceCardProps) {
  const isFree = tier.priceMonthly === 0 && annualPrice(tier) === 0;

  return (
    <article
      className={cn(
        RADIUS_CARD,
        "flex h-full flex-col border bg-surface p-8",
        tier.highlighted
          ? "border-accent shadow-xl shadow-ink-900/10"
          : "border-border",
        "[.on-ink_&]:bg-ink-0/5",
        tier.highlighted ? "" : "[.on-ink_&]:border-ink-0/12",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Heading level={headingLevel} className="text-[17px] font-semibold tracking-[-0.01em] text-text-primary [.on-ink_&]:text-text-on-ink">
          {tier.name}
        </Heading>
        {tier.badge ? <Badge tone="accent">{tier.badge}</Badge> : null}
      </div>

      <p className="mt-3 text-[15px] leading-[1.6] text-text-body [.on-ink_&]:text-text-on-ink/72">
        {tier.blurb}
      </p>

      <div className="mt-6">
        {isFree ? (
          <p className="text-[2.25rem] leading-none font-bold tracking-[-0.03em] text-text-primary [.on-ink_&]:text-text-on-ink">
            Free
          </p>
        ) : (
          <>
            {/* Monthly — visible unless the annual radio is checked. */}
            <div className="group-has-[#billing-annual:checked]:hidden">
              <p className="flex items-baseline gap-1.5">
                <span className="text-[2.25rem] leading-none font-bold tracking-[-0.03em] text-text-primary [.on-ink_&]:text-text-on-ink">
                  {format(currency, tier.priceMonthly)}
                </span>
                <span className="text-sm text-text-muted [.on-ink_&]:text-text-on-ink/72">
                  per month
                </span>
              </p>
              <p className="mt-1.5 text-[13px] text-text-muted [.on-ink_&]:text-text-on-ink/72">
                Billed monthly
              </p>
            </div>

            {/* Annual — in the DOM always, revealed by the toggle. */}
            <div className="hidden group-has-[#billing-annual:checked]:block">
              <p className="flex items-baseline gap-1.5">
                <span className="text-[2.25rem] leading-none font-bold tracking-[-0.03em] text-text-primary [.on-ink_&]:text-text-on-ink">
                  {format(currency, annualPrice(tier))}
                </span>
                <span className="text-sm text-text-muted [.on-ink_&]:text-text-on-ink/72">
                  per year
                </span>
              </p>
              <p className="mt-1.5 text-[13px] text-text-muted [.on-ink_&]:text-text-on-ink/72">
                {format(currency, Math.round((annualPrice(tier) / 12) * 100) / 100)} per
                month, billed annually
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <Button
          href={tier.cta.href}
          variant={tier.highlighted ? "primary" : "secondary"}
          block
        >
          {tier.cta.label}
        </Button>
      </div>

      <ul className="mt-8 flex list-none flex-col gap-3 p-0">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                "bg-accent/12 text-accent-text",
                "[.on-ink_&]:bg-accent/18 [.on-ink_&]:text-orange-300",
              )}
            >
              <Icon name="check" size={13} strokeWidth={2.2} />
            </span>
            <span className="text-[15px] leading-[1.6] text-text-body [.on-ink_&]:text-text-on-ink/72">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
