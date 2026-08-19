import type { Metadata } from "next";
import Link from "next/link";
import { caseStudiesIndex, visibleCaseStudies } from "@/content/proof";
import { getService } from "@/content/services";
import { ClosingCta, Eyebrow, Section } from "@/components/services";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: caseStudiesIndex.metaTitle,
  description: caseStudiesIndex.metaDescription,
  alternates: { canonical: `${siteUrl}/case-studies` },
  openGraph: {
    title: caseStudiesIndex.metaTitle,
    description: caseStudiesIndex.metaDescription,
    url: `${siteUrl}/case-studies`,
  },
};

export default function CaseStudiesIndexPage() {
  const cases = visibleCaseStudies();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Podlink case studies",
    itemListElement: cases.map((cs, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${cs.client}: ${cs.headline}`,
      url: `${siteUrl}/case-studies/${cs.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark>
        <Eyebrow>{caseStudiesIndex.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {caseStudiesIndex.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {caseStudiesIndex.subhead}
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {cases.map((cs) => (
            <Link
              key={cs.id}
              href={`/case-studies/${cs.slug}`}
              className="group flex flex-col rounded-2xl border border-zinc-200 p-8 transition-colors hover:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: "#DB6E00" }}
            >
              <p className="text-sm font-semibold text-zinc-500">
                {cs.client}
                {cs.show ? ` · ${cs.show}` : ""} · {cs.industry}
              </p>
              <h2
                className="mt-3 text-2xl font-bold leading-tight tracking-tight"
                style={{ color: "#B85600" }}
              >
                {cs.headline}
              </h2>
              <p className="mt-3 flex-1 leading-relaxed text-zinc-700">
                {cs.what}
              </p>
              {/* Service-line badges. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {cs.services.map((slug) => {
                  const service = getService(slug);
                  if (!service) return null;
                  return (
                    <li
                      key={slug}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
                    >
                      {service.name}
                    </li>
                  );
                })}
              </ul>
              <span
                className="mt-5 inline-block text-sm font-semibold"
                style={{ color: "#B85600" }}
              >
                Read the case study &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <ClosingCta
        headline={caseStudiesIndex.closing.headline}
        body={caseStudiesIndex.closing.body}
        cta={caseStudiesIndex.closing.cta}
      />
    </>
  );
}
