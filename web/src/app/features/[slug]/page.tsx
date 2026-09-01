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
import { visibleShows } from "@/content/proof";
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

  // Same-group features first (template §9), padded from the rest.
  const related = [
    ...FEATURES.filter(
      (f) => f.slug !== feature.slug && f.group === feature.group,
    ),
    ...FEATURES.filter(
      (f) => f.slug !== feature.slug && f.group !== feature.group,
    ),
  ].slice(0, 3);

  /* Template §6 — only hosts the feed parser is verified against (the list
     in features.ts download-analytics copy; never name an unverified host). */
  const hosts = [
    "Buzzsprout",
    "Transistor",
    "Libsyn",
    "Captivate",
    "Acast",
    "Any standard RSS feed",
  ];

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

      {/* §2 Trust strip — clearance-gated names only (proof.ts selector). */}
      <Section tone="light" className="!py-6 border-b border-black/5">
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-text-muted">
          <span className="font-semibold uppercase tracking-widest text-accent-text">
            Shows we&rsquo;ve produced, grown, or monetized
          </span>
          {visibleShows()
            .slice(0, 7)
            .map((name) => (
              <span key={name} className="font-medium text-text-body">
                {name}
              </span>
            ))}
        </p>
      </Section>

      {/* §3 Problem framing — typography-only contrast moment. */}
      {feature.problem ? (
        <Section tone="ink">
          <p className="mx-auto max-w-3xl text-2xl font-medium leading-relaxed sm:text-3xl">
            {feature.problem}
          </p>
        </Section>
      ) : null}

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

      {/* §4 How it works — 3 verb-first steps, snippet-friendly. */}
      {feature.steps?.length ? (
        <Section tone="light">
          <SectionHead title="How it works" level={2} />
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {feature.steps.map((step, i) => (
              <li key={step.title}>
                <span className="text-sm font-bold tabular-nums text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-text-body">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

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

      {/* §6 Host compatibility — verified hosts only, single caption. */}
      <Section tone="light" size="tight">
        <p className="text-center text-sm text-text-muted">
          Works with the host you have
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {hosts.map((host) => (
            <span
              key={host}
              className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-text-body"
            >
              {host}
            </span>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-text-muted">
          Nothing migrates — Podlink reads the RSS feed you already publish.
        </p>
      </Section>

      {/* §8 Pricing context — one inline card, no comparison table.
          LOCKSTEP RULE: only the Free plan exists in the app admin today,
          so only Free is claimed. Add Pro here when the admin ladder ships. */}
      <Section tone="alt" size="tight" containerWidth="narrow">
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
          <h2 className="text-2xl font-bold">Start free</h2>
          <p className="mx-auto mt-3 max-w-md text-text-body">
            {feature.name} is part of Podlink. Connect your RSS feed and
            start on the free plan — no card required.
          </p>
          <div className="mt-6">
            <a
              href={CTA_BAND.primaryCta.href}
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 font-semibold text-text-on-accent shadow-md shadow-orange-500/25 hover:bg-orange-400"
            >
              Start free
            </a>
          </div>
        </div>
      </Section>

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
