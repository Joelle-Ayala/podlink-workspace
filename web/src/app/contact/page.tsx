import type { Metadata } from "next";
import { bookingUrl, contact, contactEmail } from "@/content/contact";
import { services } from "@/content/services";
import { CtaButton, Eyebrow, Section } from "@/components/services";
import { QualifyingForm } from "@/components/contact/QualifyingForm";
import { siteUrl } from "@/lib/site";

/**
 * /contact — the services funnel's conversion surface
 * (claude/contact-page-template.md). Booking stays the primary CTA in the
 * hero; the qualifying form below it has no backend on purpose — it
 * composes a prefilled email to the real inbox ("never a dead form").
 */

export const metadata: Metadata = {
  title: contact.metaTitle,
  description: contact.metaDescription,
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: contact.metaTitle,
    description: contact.metaDescription,
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: contact.metaTitle,
    description: contact.metaDescription,
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Podlink",
      url: siteUrl,
      email: contactEmail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark>
        <Eyebrow>{contact.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {contact.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {contact.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CtaButton href={bookingUrl}>{contact.primaryCta}</CtaButton>
          <CtaButton href={`mailto:${contactEmail}`} variant="secondary">
            {contact.secondaryCta}
          </CtaButton>
        </div>
        <p className="mt-6 text-sm opacity-70">{contact.replyPromise}</p>
      </Section>

      {/* Qualifying form (template §2) — three answers, prefilled email.
          Single column and labels-above-inputs per the mobile-first spec. */}
      <Section className="border-b border-zinc-200 bg-zinc-50">
        <div className="max-w-xl">
          <Eyebrow>Prefer email?</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
            Three questions, then it&rsquo;s in your drafts.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-700">
            Answer these and we&rsquo;ll open a prefilled email to{" "}
            {contactEmail} in your mail app. No form robot on the other end
            &mdash; it lands in a real inbox.
          </p>
          <div className="mt-10">
            <QualifyingForm
              services={services.map((s) => ({ slug: s.slug, name: s.name }))}
              email={contactEmail}
            />
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow>{contact.onCall.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          {contact.onCall.headline}
        </h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {contact.onCall.steps.map((step, i) => (
            <li key={step.title}>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: "#B85600" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-zinc-700">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
