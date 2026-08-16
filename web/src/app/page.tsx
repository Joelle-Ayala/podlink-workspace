import {
  CtaBand,
  Faq,
  FeatureCard,
  Grid,
  Hero,
  Heading,
  Prose,
  ScreenshotFrame,
  Section,
  SectionHead,
} from "@/components";
import { FEATURE_GROUPS, FEATURES, getFeaturesByGroup } from "@/content/features";
import { CTA_BAND, HERO, HOME_FAQ, HOW_IT_WORKS } from "@/content/home";
import {
  faqLd,
  jsonLd,
  organizationLd,
  pageMetadata,
  softwareApplicationLd,
  webSiteLd,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Grow your show. Not your workload.",
  description:
    "Show notes, clips, social posts, a newsletter and download numbers you can defend — generated from the episode you just published, on the podcast host you already use.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* FAQ structured data is safe here because the questions are actually
          rendered on the page below — hidden FAQ markup is a spam signal. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            organizationLd(),
            webSiteLd(),
            softwareApplicationLd(),
            faqLd(HOME_FAQ),
          ),
        }}
      />

      <Hero
        eyebrow={HERO.eyebrow}
        title={HERO.headline}
        sub={HERO.sub}
        primary={HERO.primaryCta}
        secondary={HERO.secondaryCta}
        note={HERO.note}
        layout="split"
        visual={<ScreenshotFrame caption="The episode workspace" priority />}
      />

      {/* Groups are framing, not a grid — `publish` deliberately has no
          features under it, so we render each group's copy and only draw a
          card grid where features actually exist. */}
      <Section tone="light" id="what-it-does">
        <SectionHead
          eyebrow="What it does"
          title="One episode in, a week of material out"
          intro="Podlink takes on the work that happens after the audio is done — measuring it, transcribing it, writing it up and cutting it into everything you need to promote it."
        />
        <div className="mt-16 space-y-20">
          {FEATURE_GROUPS.map((group) => {
            const features = getFeaturesByGroup(group.id);
            return (
              <div key={group.id}>
                <div className="max-w-2xl">
                  <Heading level={3} className="text-2xl sm:text-3xl">
                    {group.title}
                  </Heading>
                  <Prose className="mt-3">
                    <p>{group.intro}</p>
                  </Prose>
                </div>
                {features.length > 0 && (
                  <Grid cols={3} className="mt-8">
                    {features.map((feature) => (
                      <FeatureCard
                        key={feature.slug}
                        feature={feature}
                        headingLevel={4}
                        href={`/features/${feature.slug}`}
                      />
                    ))}
                  </Grid>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="alt" id="how-it-works">
        <SectionHead
          eyebrow={HOW_IT_WORKS.eyebrow}
          title={HOW_IT_WORKS.heading}
          intro={HOW_IT_WORKS.intro}
        />
        <Grid cols={3} className="mt-14">
          {HOW_IT_WORKS.steps.map((step) => (
            <div key={step.number}>
              <div
                className="text-5xl font-bold text-accent-text/25 tabular-nums"
                aria-hidden="true"
              >
                {step.number}
              </div>
              <Heading level={3} className="mt-3 text-xl">
                {step.heading}
              </Heading>
              <Prose className="mt-3">
                <p>{step.body}</p>
              </Prose>
            </div>
          ))}
        </Grid>
      </Section>

      <Section tone="light" id="faq" containerWidth="narrow">
        <SectionHead title="Questions people ask before signing up" />
        <div className="mt-10">
          <Faq items={HOME_FAQ} headingLevel={3} name="home-faq" />
        </div>
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
