import type { Metadata } from "next";
import Link from "next/link";
import { services, servicesIndex } from "@/content/services";
import { caseStudies, SHOW_UNCLEARED_PROOF } from "@/content/proof";
import {
  ClosingCta,
  Eyebrow,
  CtaButton,
  Section,
} from "@/components/services";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Podcast Services — Editing, Clips, Advertising, Booking & Growth | Podlink",
  description:
    "Five podcast services that work on their own and compound together: editing and production, short-form clips, podcast advertising, guest booking, and audience growth.",
  alternates: { canonical: `${siteUrl}/services` },
  openGraph: {
    title: "Podcast Services | Podlink",
    description:
      "Editing, clips, advertising, guest booking and growth — for creators, funded startups and national brands.",
    url: `${siteUrl}/services`,
  },
};

const visibleCaseStudyCount = SHOW_UNCLEARED_PROOF
  ? caseStudies.length
  : caseStudies.filter((c) => c.clearance === "cleared").length;

export default function ServicesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Podlink podcast services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.tagline,
      url: `${siteUrl}/services/${s.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark>
        <Eyebrow>{servicesIndex.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {servicesIndex.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {servicesIndex.subhead}
        </p>
        <div className="mt-10">
          <CtaButton href="/contact">Book a call</CtaButton>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-200 p-8 transition-colors hover:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: "#DB6E00" }}
            >
              <h2 className="text-2xl font-bold tracking-tight">
                {service.name}
              </h2>
              <p className="mt-3 flex-1 text-lg leading-relaxed text-zinc-700">
                {service.tagline}
              </p>
              <div className="mt-6 flex items-baseline gap-3">
                <span
                  className="text-3xl font-bold tabular-nums"
                  style={{ color: "#B85600" }}
                >
                  {service.heroProof.value}
                </span>
                <span className="text-sm text-zinc-600">
                  {service.heroProof.label}
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold text-zinc-900">
                {service.pricing.fromLabel}{" "}
                <span
                  className="ml-1 inline-block"
                  style={{ color: "#B85600" }}
                  aria-hidden
                >
                  &rarr;
                </span>
              </p>
            </Link>
          ))}
        </div>

        {visibleCaseStudyCount === 0 && (
          <p className="mt-10 text-sm text-zinc-500">
            {/* Dev-only reminder. Remove once proof clearance is done. */}
          </p>
        )}
      </Section>

      <ClosingCta
        headline={servicesIndex.closing.headline}
        body={servicesIndex.closing.body}
        cta={servicesIndex.closing.cta}
      />
    </>
  );
}
