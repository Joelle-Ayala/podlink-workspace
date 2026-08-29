import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services, serviceSlugs } from "@/content/services";
import {
  caseStudiesFor,
  testimonialFor,
  visibleBrands,
  visibleShows,
} from "@/content/proof";
import {
  ClosingCta,
  DiyCrossLink,
  FaqList,
  FitQualifier,
  IncludesList,
  PlacementsStrip,
  PricingTable,
  ProblemBlock,
  ProcessSteps,
  ProofSection,
  RelatedServices,
  ServiceHero,
  TrustStrip,
  WhyPodlink,
} from "@/components/services";
import { siteUrl } from "@/lib/site";

/** Fully static — same as /features/[slug]. */
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const url = `${siteUrl}/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const cases = caseStudiesFor(service.slug);
  const testimonial = testimonialFor(service.slug);

  const related = service.relatedSlugs
    .map((s) => services.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ slug: s.slug, name: s.name, tagline: s.tagline }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.metaDescription,
      serviceType: service.name,
      url: `${siteUrl}/services/${service.slug}`,
      provider: { "@type": "Organization", name: "Podlink", url: siteUrl },
      areaServed: "Worldwide",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Services",
          item: `${siteUrl}/services`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: service.name,
          item: `${siteUrl}/services/${service.slug}`,
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

      {/* Services-template v1 section order (claude/services-page-template.md). */}
      <ServiceHero service={service} />
      <TrustStrip
        intro={
          service.slug === "podcast-advertising"
            ? "Campaigns bought and sold for"
            : "Shows we've produced, grown, or monetized"
        }
        names={(service.slug === "podcast-advertising"
          ? visibleBrands()
          : visibleShows()
        ).slice(0, 9)}
      />
      <ProblemBlock problem={service.problem} />
      <IncludesList items={service.includes} />
      <ProcessSteps steps={service.process} variant="timeline" />
      <ProofSection
        caseStudies={cases}
        testimonial={testimonial}
        /* Growth stays non-huge until the 31M evidence recheck (S4 hold). */
        hugeNumbers={service.slug !== "podcast-growth"}
      />
      <FitQualifier fit={service.fit} />
      <PricingTable
        tiers={service.pricing.tiers}
        footnote={service.pricing.footnote}
      />
      <WhyPodlink whyPodlink={service.whyPodlink} />
      <PlacementsStrip placements={service.placements} />
      <FaqList faqs={service.faqs} />
      <RelatedServices related={related} />
      <ClosingCta
        headline={`Ready to talk about ${service.name.toLowerCase()}?`}
        body="A 20-minute call. We'll tell you what we'd do, what it costs, and whether it's the right first move for where your show actually is."
        reassurance={service.reassurance}
      />
      <DiyCrossLink diyLink={service.diyLink} />
    </>
  );
}
