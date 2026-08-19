import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/content/about";
import { contactEmail } from "@/content/contact";
import { ClosingCta, Eyebrow, Section } from "@/components/services";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: about.metaTitle,
  description: about.metaDescription,
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: about.metaTitle,
    description: about.metaDescription,
    url: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: about.metaTitle,
      description: about.metaDescription,
      url: `${siteUrl}/about`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Podlink",
      url: siteUrl,
      email: contactEmail,
      description: about.metaDescription,
      foundingDate: "2021-01",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark>
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {about.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {about.subhead}
        </p>

        <dl className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.stats.map((stat) => (
            <div key={stat.label}>
              <dd
                className="text-4xl font-bold tabular-nums"
                style={{ color: "#FF8C00" }}
              >
                {stat.value}
              </dd>
              <dd className="mt-1 text-sm leading-snug opacity-70">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <div className="max-w-3xl space-y-6">
          {about.story.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-zinc-700">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="mt-8 text-lg">
          <Link
            href="/services"
            className="font-semibold underline underline-offset-4"
            style={{ color: "#B85600" }}
          >
            See the six services &rarr;
          </Link>
        </p>
      </Section>

      <Section className="bg-zinc-50">
        <Eyebrow>{about.workingWithUs.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          {about.workingWithUs.headline}
        </h2>
        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {about.workingWithUs.items.map((item) => (
            <li key={item} className="flex gap-3 text-zinc-800">
              <span
                aria-hidden
                className="mt-2 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: "#FF8C00" }}
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <ClosingCta
        headline={about.closing.headline}
        body={about.closing.body}
        cta={about.closing.cta}
      />
    </>
  );
}
