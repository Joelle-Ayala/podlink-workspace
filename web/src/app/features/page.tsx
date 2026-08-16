import {
  CtaBand,
  FeatureCard,
  Grid,
  Heading,
  Hero,
  Prose,
  Section,
  SectionHead,
} from "@/components";
import { FEATURE_GROUPS, getFeaturesByGroup } from "@/content/features";
import { CTA_BAND } from "@/content/home";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "Download analytics, transcripts, AI show notes, clips, social posts, a newsletter and your own podlink.fm page — everything Podlink does, grouped by the job it does for you.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { name: "Home", url: absoluteUrl("/") },
              { name: "Features", url: absoluteUrl("/features") },
            ]),
          ),
        }}
      />

      <Hero
        eyebrow="Features"
        title="Everything that happens after you stop recording"
        sub="Podlink is not a podcast host and does not want to be one. It sits alongside the host you already use and takes on the measuring, the writing and the cutting up."
        primary={{ label: "Start free", href: CTA_BAND.primaryCta.href }}
        secondary={{ label: "See pricing", href: "/pricing" }}
        layout="center"
      />

      {FEATURE_GROUPS.map((group, i) => {
        const features = getFeaturesByGroup(group.id);
        const headingId = `group-${group.id}`;
        return (
          <Section
            key={group.id}
            id={group.id}
            tone={i % 2 === 0 ? "light" : "alt"}
            labelledBy={headingId}
          >
            <div className="max-w-2xl">
              <Heading level={2} id={headingId} className="text-3xl sm:text-4xl">
                {group.title}
              </Heading>
              <Prose size="lg" className="mt-4">
                <p>{group.intro}</p>
              </Prose>
            </div>
            {features.length > 0 && (
              <Grid cols={3} className="mt-10">
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.slug}
                    feature={feature}
                    headingLevel={3}
                    href={`/features/${feature.slug}`}
                  />
                ))}
              </Grid>
            )}
          </Section>
        );
      })}

      <CtaBand
        title={CTA_BAND.heading}
        body={CTA_BAND.body}
        primary={CTA_BAND.primaryCta}
        secondary={CTA_BAND.secondaryCta}
        note={CTA_BAND.note}
      />
    </>
  );
}
