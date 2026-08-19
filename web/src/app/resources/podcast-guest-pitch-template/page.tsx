import type { Metadata } from "next";
import Link from "next/link";
import {
  pitchTemplate,
  pitchTemplateDownloadUrl,
  resourceRequestEmail,
} from "@/content/resources";
import { CtaButton, Eyebrow, Section } from "@/components/services";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: pitchTemplate.metaTitle,
  description: pitchTemplate.metaDescription,
  alternates: {
    canonical: `${siteUrl}/resources/podcast-guest-pitch-template`,
  },
  // TODO(resources): noindex until the download link is real. The CTA is
  // currently a mailto fallback — indexing a lead-magnet page that can't
  // deliver the lead magnet burns the click and the crawl. Flip this to
  // index: true when pitchTemplateDownloadUrl is a real URL.
  robots: { index: false, follow: true },
  openGraph: {
    title: pitchTemplate.metaTitle,
    description: pitchTemplate.metaDescription,
    url: `${siteUrl}/resources/podcast-guest-pitch-template`,
  },
};

export default function PitchTemplatePage() {
  // Mailto request fallback until the hosted download exists.
  const downloadHref =
    pitchTemplateDownloadUrl ??
    `mailto:${resourceRequestEmail}?subject=${encodeURIComponent(
      pitchTemplate.download.emailSubject,
    )}`;

  return (
    <>
      <Section dark>
        <Eyebrow>{pitchTemplate.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {pitchTemplate.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {pitchTemplate.name} — {pitchTemplate.body}
        </p>
        <div className="mt-10">
          <CtaButton href={downloadHref}>
            {pitchTemplate.download.cta}
          </CtaButton>
        </div>
      </Section>

      <Section>
        <Eyebrow>Inside</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          {pitchTemplate.whatsInside.headline}
        </h2>
        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {pitchTemplate.whatsInside.items.map((item) => (
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
        <p className="mt-10 text-lg leading-relaxed text-zinc-700">
          {pitchTemplate.download.body}
        </p>
      </Section>

      <Section dark>
        <Eyebrow>{pitchTemplate.crossLink.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          {pitchTemplate.crossLink.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed opacity-80">
          {pitchTemplate.crossLink.body}
        </p>
        <p className="mt-8">
          <Link
            href={pitchTemplate.crossLink.href}
            className="text-lg font-semibold underline underline-offset-4"
            style={{ color: "#FF8C00" }}
          >
            {pitchTemplate.crossLink.cta} &rarr;
          </Link>
        </p>
      </Section>
    </>
  );
}
