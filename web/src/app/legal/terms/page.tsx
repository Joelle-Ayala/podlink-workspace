import { Hero, Prose, Section } from "@/components";
import { pageMetadata } from "@/lib/seo";

/**
 * PLACEHOLDER. Real Terms copy has not been written yet.
 * Shipped noindex so an empty legal page can't be indexed or cited.
 * These are required before charging money — see the project plan.
 */
export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms for Podlink.",
  path: "/legal/terms",
  noIndex: true,
});

export default function TermsPage() {
  return (
    <>
      <Hero title="Terms" tone="light" layout="center" />
      <Section tone="light" containerWidth="narrow">
        <Prose>
          <p>
            This page is a placeholder. Podlink&rsquo;s Terms document
            has not been published yet.
          </p>
          <p>
            If you need it before it&rsquo;s live, contact{" "}
            <a href="mailto:hello@podlink.ai">hello@podlink.ai</a>.
          </p>
        </Prose>
      </Section>
    </>
  );
}
