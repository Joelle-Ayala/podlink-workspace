import { notFound } from "next/navigation";
import {
  CtaBand,
  Faq,
  FeatureBlock,
  FeatureCard,
  Grid,
  Hero,
  Icon,
  ScreenshotFrame,
  Section,
  SectionHead,
} from "@/components";
import { FEATURES, getFeature } from "@/content/features";
import { CTA_BAND } from "@/content/home";
import {
  absoluteUrl,
  breadcrumbLd,
  faqLd,
  jsonLd,
  pageMetadata,
} from "@/lib/seo";

/** Fully static — one page per feature, known at build time. */
export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

export const dynamicParams = false;

type FeatureParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: FeatureParams) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};

  return pageMetadata({
    title: feature.name,
    description: feature.summary,
    path: `/features/${feature.slug}`,
  });
}

export default async function FeaturePage({ params }: FeatureParams) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const related = FEATURES.filter((f) => f.slug !== feature.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { name: "Home", url: absoluteUrl("/") },
              { name: "Features", url: absoluteUrl("/features") },
              {
                name: feature.name,
                url: absoluteUrl(`/features/${feature.slug}`),
              },
            ]),
            ...(feature.faq?.length ? [faqLd(feature.faq)] : []),
          ),
        }}
      />

      <Hero
        eyebrow={feature.tagline}
        title={feature.name}
        sub={feature.summary}
        primary={{ label: "Start free", href: CTA_BAND.primaryCta.href }}
        secondary={{ label: "All features", href: "/features" }}
        layout="split"
        visual={
          feature.image ? (
            <ScreenshotFrame
              src={feature.image}
              alt={feature.imageAlt ?? feature.name}
              priority
            />
          ) : (
            <ScreenshotFrame priority />
          )
        }
      />

      <Section tone="light" containerWidth="narrow">
        <ul className="grid gap-4 sm:grid-cols-2">
          {feature.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-accent-text">
                <Icon name="check" size={20} />
              </span>
              <span className="text-text-body">{bullet}</span>
            </li>
          ))}
        </ul>
      </Section>

      {feature.sections?.length ? (
        <Section tone="alt">
          <div className="space-y-20">
            {feature.sections.map((section, i) => (
              <FeatureBlock
                key={section.heading}
                section={section}
                reverse={i % 2 === 1}
                headingLevel={2}
                visual={
                  section.image ? (
                    <ScreenshotFrame
                      src={section.image}
                      alt={section.imageAlt ?? section.heading}
                    />
                  ) : (
                    <ScreenshotFrame />
                  )
                }
              />
            ))}
          </div>
        </Section>
      ) : null}

      {feature.faq?.length ? (
        <Section tone="light" containerWidth="narrow">
          <SectionHead title={`${feature.name} questions`} />
          <div className="mt-10">
            <Faq items={feature.faq} headingLevel={3} name={`faq-${feature.slug}`} />
          </div>
        </Section>
      ) : null}

      <Section tone="alt">
        <SectionHead title="The rest of it" level={2} />
        <Grid cols={3} className="mt-10">
          {related.map((f) => (
            <FeatureCard
              key={f.slug}
              feature={f}
              headingLevel={3}
              href={`/features/${f.slug}`}
            />
          ))}
        </Grid>
      </Section>

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
