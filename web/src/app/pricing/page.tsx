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
 * NOINDEX, deliberately. Confirmed by the founder 2026-08-19.
 *
 * The tiers here follow Pricing v2 — `claude/podlink-pricing-v2.md`, adopted
 * 2026-08-20: Free / Pro $29 / Studio $99, clips as a future $20 add-on.
 * The *ladder* is decided; the page still isn't ready to be indexed,
 * for two reasons that are both greppable in src/content/pricing.ts:
 *
 *   `TODO(pricing): unverified limit` — splits and numbers nobody has decided.
 *   `TODO(pricing): unshipped`        — capabilities that are real in the plan
 *                                       but not built yet (transcript pipeline,
 *                                       MCP, YouTube, episode report, clips).
 *
 * An indexed pricing page carrying either is worse than no pricing page: it is
 * a promise the product may not keep, and it is what Google caches and what
 * buyers arrive quoting.
 *
 * Go-live is: ship or strip everything marked `unshipped`, decide everything
 * marked `unverified limit`, flip noIndex to false here, then re-add
 * "/pricing" to src/app/sitemap.ts (there's a comment there with the steps).
 * Spec §11 asks for exactly that — it is the last step of the pricing work.
 */
export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Download analytics and your podlink.fm page are free. Pro is $19 a month for the episode content kit, with two months free when billed annually.",
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
        sub="Your download numbers and your podlink.fm page are free on every plan, including the free one — they're the part you should never have to pay to see. Pro is for the writing after you publish."
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
          intro="Everything below is for one connected show — which is all Podlink supports per account today."
        />
        <div className="mt-10">
          <ComparisonTable
            sections={COMPARISON}
            tiers={TIER_COLUMNS}
            caption="Podlink plan comparison: Free, Pro and Studio"
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
