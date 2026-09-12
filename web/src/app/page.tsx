import {
  Badge,
  Button,
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
import Link from "next/link";
import { FEATURE_GROUPS, FEATURES, getFeaturesByGroup } from "@/content/features";
import { CTA_BAND, HERO, HOME_FAQ, HOW_IT_WORKS, REPORT_BAND, TWO_DOORS } from "@/content/home";
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
    "Show notes, social posts, a newsletter and download numbers a sponsor can check — written from what you actually said, on the podcast host you already use.",
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

      {/* The two-door band — personas doc §4.1. Two businesses, one center of
          gravity: the software funnel and the done-for-you funnel get a door
          each, above the fold, instead of the services business being
          invisible on the front page. */}
      <Section tone="alt" id="two-doors">
        <Grid cols={2}>
          {TWO_DOORS.map((door) => (
            <div
              key={door.heading}
              className="rounded-2xl border border-zinc-200 bg-white p-8"
            >
              <Heading level={2} className="text-2xl">
                {door.heading}
              </Heading>
              <Prose className="mt-3">
                <p>{door.body}</p>
              </Prose>
              <Link
                href={door.cta.href}
                className="mt-5 inline-block text-sm font-bold text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {door.cta.label} &rarr;
              </Link>
            </div>
          ))}
        </Grid>
      </Section>

      {/* Show Report band — the shipped hero, per lockstep. Claims here match
          what's live: OP3-measured downloads, YouTube views + demographics,
          link-page clicks, Claude connector over analytics + transcripts. */}
      <Section tone="ink" id="show-report">
        <div className="mx-auto max-w-3xl">
          <Badge>{REPORT_BAND.eyebrow}</Badge>
          <Heading level={2} className="mt-4 text-3xl sm:text-4xl">
            {REPORT_BAND.headline}
          </Heading>
          <Prose className="mt-4">
            <p>{REPORT_BAND.body}</p>
          </Prose>
          <ul className="mt-6 space-y-3">
            {REPORT_BAND.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span aria-hidden="true" className="text-accent-text">
                  &#10003;
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={REPORT_BAND.primaryCta.href} onInk>
              {REPORT_BAND.primaryCta.label}
            </Button>
            <Button href={REPORT_BAND.secondaryCta.href} variant="secondary" onInk>
              {REPORT_BAND.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Section>

      {/* Groups are framing, not a grid — `publish` deliberately has no
          features under it, so we render each group's copy and only draw a
          card grid where features actually exist. */}
      <Section tone="light" id="what-it-does">
        <SectionHead
          eyebrow="What it does"
          title="One episode in, a week of material out"
          intro="Podcasters spend more time on descriptions, show notes and posts than on the episode itself. That's the part Podlink takes — measuring it, writing it up and giving it somewhere to land."
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
