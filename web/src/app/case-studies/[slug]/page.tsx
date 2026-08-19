import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCaseStudy,
  visibleCaseStudies,
} from "@/content/proof";
import { getService } from "@/content/services";
import {
  ClosingCta,
  Eyebrow,
  RelatedServices,
  Section,
} from "@/components/services";
import { siteUrl } from "@/lib/site";

/**
 * Statically generated from cleared entries only — non-cleared case studies
 * (needs-permission / needs-verification) never get a route in production.
 */
export function generateStaticParams() {
  return visibleCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};

  const title = `${cs.client}: ${cs.headline} | Podlink Case Study`;
  const url = `${siteUrl}/case-studies/${cs.slug}`;

  return {
    title,
    description: cs.what,
    alternates: { canonical: url },
    openGraph: { title, description: cs.what, url },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  // Belt and braces: even if a route is requested directly, non-visible
  // entries 404 rather than render.
  if (!cs || !visibleCaseStudies().some((v) => v.slug === cs.slug)) notFound();

  const related = cs.services
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ slug: s.slug, name: s.name, tagline: s.tagline }));

  const storySections = cs.story
    ? [
        { title: "The challenge", body: cs.story.challenge },
        { title: "What we did", body: cs.story.approach },
        { title: "The results", body: cs.story.results },
      ]
    : [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${cs.client}: ${cs.headline}`,
      description: cs.what,
      url: `${siteUrl}/case-studies/${cs.slug}`,
      mainEntityOfPage: `${siteUrl}/case-studies/${cs.slug}`,
      author: { "@type": "Organization", name: "Podlink", url: siteUrl },
      publisher: { "@type": "Organization", name: "Podlink", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Case Studies",
          item: `${siteUrl}/case-studies`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: cs.client,
          item: `${siteUrl}/case-studies/${cs.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — the metric leads. */}
      <Section dark className="!pb-14">
        <Eyebrow>
          {cs.client}
          {cs.show ? ` · ${cs.show}` : ""} · {cs.industry}
        </Eyebrow>
        <h1
          className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          style={{ color: "#FF8C00" }}
        >
          {cs.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {cs.what}
        </p>
      </Section>

      {/* Story. */}
      {storySections.length > 0 && (
        <Section>
          <div className="max-w-3xl space-y-12">
            {storySections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-zinc-700">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Metrics grid. */}
      <Section dark>
        <Eyebrow>By the numbers</Eyebrow>
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cs.metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd
                className="text-4xl font-bold tabular-nums"
                style={{ color: "#FF8C00" }}
              >
                {m.value}
              </dd>
              <dd className="mt-1 text-sm leading-snug opacity-70">
                {m.label}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <RelatedServices related={related} />

      <ClosingCta
        headline="Want results like these?"
        body="A 20-minute call. We'll tell you what we'd do with your show, what it costs, and whether it's the right first move for where your show actually is."
      />
    </>
  );
}
