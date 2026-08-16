import { Hero, Prose, Section } from "@/components";
import { pageMetadata } from "@/lib/seo";

/**
 * PLACEHOLDER. Real Privacy copy has not been written yet.
 * Shipped noindex so an empty legal page can't be indexed or cited.
 * These are required before charging money — see the project plan.
 */
export const metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy for Podlink.",
  path: "/legal/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <>
      <Hero title="Privacy" tone="light" layout="center" />
      <Section tone="light" containerWidth="narrow">
        <Prose>
          <p>
            This page is a placeholder. Podlink&rsquo;s Privacy document
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
