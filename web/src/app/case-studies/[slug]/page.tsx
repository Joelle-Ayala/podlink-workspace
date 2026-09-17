import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCaseStudy,
  getTestimonialById,
  visibleCaseStudies,
} from "@/content/proof";
import { getService } from "@/content/services";
import { CtaButton, Eyebrow, Section } from "@/components/services";
import { bookingUrl } from "@/content/contact";
import { siteUrl } from "@/lib/site";

/**
 * /case-studies/[slug] — the case-study template v1 stack
 * (claude/case-study-template.md): outcome headline → context strip with
 * service-line badges → challenge → what Podlink did (attribution-honest:
 * ONLY the entry's `services` array) → results as huge numbers → pull quote
 * (same-client, cleared, via testimonialId) → related same-service case
 * studies → book-a-call CTA.
 *
 * One data-driven page: every section renders from the proof.ts entry, and
 * any section the entry has no honest content for is omitted, never padded.
 * Excluded figures (CVS 66%-family, MDS 50%-conversion, Elmo clip stats)
 * live only in proof.ts notes and never reach this file.
 */

const ORANGE = "#FF8C00";
const ORANGE_700 = "#B85600";
const ORANGE_600 = "#DB6E00";

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

  /* §2 + §7 — service-line badges. Attribution-honest by construction: this
     is the entry's `services` array resolved to names, nothing else. */
  const serviceLines = cs.services
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  /* §9 secondary CTA target — the engagement's lead service line. */
  const primarySlug = cs.services[0];
  const primaryService = primarySlug ? getService(primarySlug) : undefined;

  /* §6 — pull quote, only where proof.ts pins an exact same-client match,
     and only if that testimonial is itself cleared. */
  const pullQuote = cs.testimonialId
    ? getTestimonialById(cs.testimonialId)
    : undefined;

  /* §8 — 2–3 related studies sharing a service line, via the clearance-gated
     selector, in file order. */
  const relatedCases = visibleCaseStudies()
    .filter(
      (c) =>
        c.slug !== cs.slug && c.services.some((s) => cs.services.includes(s)),
    )
    .slice(0, 3);

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

      {/* §1 Outcome headline — the verified number leads. */}
      <Section dark className="!pb-14">
        <Eyebrow>Case study</Eyebrow>
        <h1
          className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          style={{ color: ORANGE }}
        >
          {cs.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {cs.what}
        </p>
      </Section>

      {/* §2 Context strip — client, show, industry, service-line badges. */}
      <Section className="!py-8 border-b border-zinc-200">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-sm font-semibold text-zinc-800">
            {cs.client}
            {cs.show ? ` · ${cs.show}` : ""}
          </p>
          <p className="text-sm text-zinc-600">{cs.industry}</p>
          <ul className="flex flex-wrap gap-2">
            {serviceLines.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: ORANGE_600 }}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* §3 + §4 Challenge and what Podlink did — omitted when the entry has
          no narrative rather than padded with anything invented. */}
      {cs.story && (
        <Section>
          <div className="max-w-3xl space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                The challenge
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-700">
                {cs.story.challenge}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                What Podlink did
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-700">
                {cs.story.approach}
              </p>
              {/* Attribution-honest: only the service lines actually
                  delivered on this engagement. */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {serviceLines.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="inline-block rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-semibold transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: ORANGE_700, outlineColor: ORANGE_600 }}
                    >
                      {s.name} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* §5 Results — the number IS the visual. Only proof.ts metrics. */}
      <Section dark>
        <Eyebrow>The results</Eyebrow>
        {cs.story && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed opacity-80">
            {cs.story.results}
          </p>
        )}
        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {cs.metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd
                className="break-words text-5xl font-bold leading-none tabular-nums lg:text-6xl"
                style={{ color: ORANGE }}
              >
                {m.value}
              </dd>
              <dd className="mt-3 text-sm leading-snug opacity-70">
                {m.label}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* §6 Pull quote — same-client testimonial, cleared; omitted otherwise. */}
      {pullQuote && (
        <Section>
          <figure className="max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 lg:p-10">
            <blockquote className="text-2xl font-medium leading-relaxed text-zinc-900">
              &ldquo;{pullQuote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-zinc-600">
              {pullQuote.name}
              {pullQuote.title ? `, ${pullQuote.title}` : ""}
              {pullQuote.company ? ` · ${pullQuote.company}` : ""}
            </figcaption>
          </figure>
        </Section>
      )}

      {/* §8 Related case studies — same service line, clearance-gated. */}
      {relatedCases.length > 0 && (
        <Section className="bg-zinc-50">
          <Eyebrow>More like this</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
            Same services, other shows.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {relatedCases.map((c) => (
              <Link
                key={c.id}
                href={`/case-studies/${c.slug}`}
                className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: ORANGE_600 }}
              >
                <p className="text-sm font-semibold text-zinc-500">
                  {c.client}
                  {c.show ? ` · ${c.show}` : ""}
                </p>
                <p
                  className="mt-2 flex-1 text-xl font-bold leading-tight tracking-tight"
                  style={{ color: ORANGE_700 }}
                >
                  {c.headline}
                </p>
                <span
                  className="mt-4 inline-block text-sm font-semibold"
                  style={{ color: ORANGE_700 }}
                >
                  Read the case study &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* §9 CTA — book a call primary, the lead service line secondary. */}
      <Section dark>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Want results like these?
          </h2>
          <p className="mt-4 text-lg leading-relaxed opacity-80">
            A 20-minute call. We&rsquo;ll tell you what we&rsquo;d do with
            your show, what it costs, and whether it&rsquo;s the right first
            move for where your show actually is.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton href={bookingUrl}>Book a call</CtaButton>
            {primaryService && (
              <CtaButton
                href={`/services/${primaryService.slug}`}
                variant="secondary"
              >
                Explore {primaryService.name.toLowerCase()}
              </CtaButton>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
