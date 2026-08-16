import {
  BillingToggle,
  ComparisonTable,
  CtaBand,
  Faq,
  Grid,
  Hero,
  PriceCard,
  Section,
  SectionHead,
} from "@/components";
import { COMPARISON, PRICING_FAQ, TIERS } from "@/content/pricing";
import { CTA_BAND } from "@/content/home";
import { pageMetadata } from "@/lib/seo";

/**
 * NOINDEX, deliberately.
 *
 * Every tier limit in src/content/pricing.ts still carries a
 * `TODO(pricing): unverified limit` marker. A public, indexed pricing page
 * carrying numbers we haven't confirmed is worse than no pricing page —
 * it's a promise the product may not keep, and it's what Google caches.
 *
 * The prices themselves ($0 / $19 / $49) are decided; the *limits* are not.
 * Go-live is: verify the limits, strip the TODO markers, flip noIndex to
 * false here, and re-add "/pricing" to src/app/sitemap.ts (there's a comment
 * there with the steps).
 */
export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Free to start. Creator $19 a month, Pro $49, both with two months free when billed annually.",
  path: "/pricing",
  noIndex: true,
});

const TIER_COLUMNS = TIERS.map((t) => ({ id: t.id, name: t.name }));

export default function PricingPage() {
  return (
    <>
      <Hero
        eyebrow="Pricing"
        title="Start free. Pay when it's saving you evenings"
        sub="Download analytics, transcripts and your podlink.fm page are included on every plan, free one included — they're the part you should never have to pay to see."
        layout="center"
      />

      <Section tone="light" id="plans">
        {/* BillingToggle must wrap the cards — the CSS-only toggle uses :has()
            from a shared root, and both prices stay in the DOM so a crawler
            (and a JS-less visitor) sees them both. One per page. */}
        <BillingToggle savingsLabel="2 months free">
          <Grid cols={3} gap="md">
            {TIERS.map((tier) => (
              <PriceCard key={tier.id} tier={tier} headingLevel={2} />
            ))}
          </Grid>
        </BillingToggle>
      </Section>

      <Section tone="alt" id="compare">
        <SectionHead
          title="What's in each plan"
          intro="Everything below is per connected show. Limits shown are for a single podcast."
        />
        <div className="mt-10">
          <ComparisonTable
            sections={COMPARISON}
            tiers={TIER_COLUMNS}
            caption="Podlink plan comparison: Free, Creator and Pro"
          />
        </div>
      </Section>

      <Section tone="light" containerWidth="narrow" id="pricing-faq">
        <SectionHead title="Billing questions" />
        <div className="mt-10">
          <Faq items={PRICING_FAQ} headingLevel={3} name="pricing-faq" />
        </div>
      </Section>

      <CtaBand
        title={CTA_BAND.heading}
        body={CTA_BAND.body}
        primary={CTA_BAND.primaryCta}
        note={CTA_BAND.note}
      />
    </>
  );
}
