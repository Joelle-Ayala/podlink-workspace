/**
 * Services design system.
 *
 * Server components throughout — nothing here needs client JS.
 *
 * BRAND CONTRAST RULES (these are measured, not preference):
 *   #FF8C00 on white is 2.33:1 — fails AA for text AND the 3:1 non-text threshold.
 *   So: orange is FILL ONLY.
 *     - Buttons are ink-on-orange (8.20:1)
 *     - Orange text on light uses orange-700 #B85600 (4.81:1)
 *     - Focus rings use orange-600 #DB6E00
 *
 * Colours are written as arbitrary hex values so this compiles against any
 * Tailwind config. If web/src/app/globals.css already defines @theme tokens for
 * these, swap the arbitrary values for the token classes — the values match.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudy, Testimonial } from "@/content/proof";
import type { Faq, PriceTier, ProcessStep, Service } from "@/content/services";

const ORANGE = "#FF8C00";
const ORANGE_700 = "#B85600";
const ORANGE_600 = "#DB6E00";
const INK = "#0f0f12";
const OFF_WHITE = "#f0ede6";

/* -------------------------------------------------------------------------- */
/* Primitives                                                                  */
/* -------------------------------------------------------------------------- */

export function Section({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={`px-6 py-16 sm:py-24 ${className}`}
      style={dark ? { backgroundColor: INK, color: OFF_WHITE } : undefined}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-sm font-semibold uppercase tracking-widest"
      style={{ color: ORANGE_700 }}
    >
      {children}
    </p>
  );
}

export function CtaButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2";

  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={base}
        style={{
          backgroundColor: ORANGE,
          color: INK,
          outlineColor: ORANGE_600,
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} border-2 border-current`}
      style={{ color: ORANGE_700, outlineColor: ORANGE_600 }}
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export function ServiceHero({ service }: { service: Service }) {
  return (
    <Section dark className="!pb-14">
      <Eyebrow>{service.name}</Eyebrow>
      <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
        {service.headline}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
        {service.subhead}
      </p>
      {service.heroNote && (
        <p
          className="mt-4 max-w-2xl text-base font-semibold leading-relaxed"
          style={{ color: ORANGE }}
        >
          {service.heroNote}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <CtaButton href="/contact">Book a call</CtaButton>
        <CtaButton href="/work" variant="secondary">
          See the work
        </CtaButton>
        <Link
          href="#pricing"
          className="text-base font-semibold underline underline-offset-4 opacity-80 hover:opacity-100"
        >
          {service.pricing.fromLabel}
        </Link>
      </div>

      <div
        className="mt-14 inline-flex flex-col rounded-2xl px-6 py-5"
        style={{ backgroundColor: "rgba(255,140,0,0.12)" }}
      >
        <span
          className="text-4xl font-bold tabular-nums"
          style={{ color: ORANGE }}
        >
          {service.heroProof.value}
        </span>
        <span className="mt-1 text-sm opacity-70">{service.heroProof.label}</span>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Trust strip (§1) — clearance-gated names only (proof.ts selectors)          */
/* -------------------------------------------------------------------------- */

export function TrustStrip({
  intro,
  names,
}: {
  intro: string;
  names: string[];
}) {
  if (names.length === 0) return null;

  return (
    <Section className="!py-8 border-b border-zinc-200">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm text-zinc-600">
        <span
          className="font-semibold uppercase tracking-widest"
          style={{ color: ORANGE_700 }}
        >
          {intro}
        </span>
        {names.map((name) => (
          <span key={name} className="font-medium text-zinc-800">
            {name}
          </span>
        ))}
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Problem                                                                     */
/* -------------------------------------------------------------------------- */

export function ProblemBlock({
  problem,
}: {
  problem: { title: string; body: string };
}) {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12">
        <h2 className="text-3xl font-bold tracking-tight lg:col-span-5 lg:text-4xl">
          {problem.title}
        </h2>
        <p className="text-lg leading-relaxed text-zinc-700 lg:col-span-7">
          {problem.body}
        </p>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* What's included                                                             */
/* -------------------------------------------------------------------------- */

export function IncludesList({ items }: { items: string[] }) {
  return (
    <Section className="bg-zinc-50">
      <Eyebrow>What&rsquo;s included</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
        Every engagement ships with this.
      </h2>
      <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-zinc-800">
            <span
              aria-hidden
              className="mt-2 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: ORANGE }}
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Process                                                                     */
/* -------------------------------------------------------------------------- */

export function ProcessSteps({
  steps,
  variant = "columns",
}: {
  steps: ProcessStep[];
  /** "timeline" = services-template §4 vertical timeline styling. */
  variant?: "columns" | "timeline";
}) {
  if (variant === "timeline") {
    return (
      <Section>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          The actual process, not a diagram.
        </h2>
        <ol className="mt-12 max-w-3xl">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-8 bottom-0 w-px bg-zinc-200"
                />
              )}
              <span
                className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums"
                style={{ backgroundColor: ORANGE, color: INK }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold leading-8">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-zinc-700">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    );
  }

  return (
    <Section>
      <Eyebrow>How it works</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
        The actual process, not a diagram.
      </h2>
      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title}>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: ORANGE_700 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-zinc-700">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Fit qualifier (§6) — honest two-column lead qualification                   */
/* -------------------------------------------------------------------------- */

export function FitQualifier({ fit }: { fit?: Service["fit"] }) {
  if (!fit) return null;

  return (
    <Section>
      <Eyebrow>Is this for you?</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
        We&rsquo;d rather tell you now.
      </h2>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7">
          <h3 className="text-lg font-semibold" style={{ color: ORANGE_700 }}>
            This is for you if
          </h3>
          <ul className="mt-5 space-y-4">
            {fit.forYou.map((item) => (
              <li key={item} className="flex gap-3 text-zinc-800">
                <span
                  aria-hidden
                  className="mt-2 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ORANGE }}
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-7">
          <h3 className="text-lg font-semibold text-zinc-600">
            It isn&rsquo;t if
          </h3>
          <ul className="mt-5 space-y-4">
            {fit.notForYou.map((item) => (
              <li key={item} className="flex gap-3 text-zinc-700">
                <span
                  aria-hidden
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-zinc-400"
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Why Podlink (§8) — the hybrid differentiator                                */
/* -------------------------------------------------------------------------- */

export function WhyPodlink({
  whyPodlink,
}: {
  whyPodlink?: Service["whyPodlink"];
}) {
  if (!whyPodlink) return null;

  return (
    <Section className="bg-zinc-50">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>Why Podlink</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
            {whyPodlink.headline}
          </h2>
        </div>
        <p className="text-lg leading-relaxed text-zinc-700 lg:col-span-7 lg:self-end">
          {whyPodlink.body}
        </p>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Pricing                                                                     */
/* -------------------------------------------------------------------------- */

export function PricingTable({
  tiers,
  footnote,
}: {
  tiers: PriceTier[];
  footnote?: string;
}) {
  return (
    <Section className="bg-zinc-50">
      <div id="pricing" className="scroll-mt-24">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Real numbers, not &ldquo;contact us&rdquo;.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-zinc-700">
          Starting points based on what this work actually costs to do well.
          Scope moves the number; we&rsquo;ll tell you which way on the call.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-2xl border bg-white p-7"
              style={{
                borderColor: tier.featured ? ORANGE : "#e4e4e7",
                borderWidth: tier.featured ? 2 : 1,
              }}
            >
              {tier.featured && (
                <span
                  className="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{ backgroundColor: ORANGE, color: INK }}
                >
                  Most common
                </span>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums">
                  {tier.price}
                </span>
              </p>
              {tier.unit && (
                <p className="mt-1 text-sm text-zinc-600">{tier.unit}</p>
              )}
              <ul className="mt-6 flex-1 space-y-3">
                {tier.includes.map((inc) => (
                  <li key={inc} className="flex gap-2.5 text-sm text-zinc-800">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: ORANGE }}
                    />
                    <span className="leading-relaxed">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {footnote && (
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-zinc-600">
            {footnote}
          </p>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Proof                                                                       */
/* -------------------------------------------------------------------------- */

export function ProofSection({
  caseStudies,
  testimonial,
  hugeNumbers = false,
}: {
  caseStudies: CaseStudy[];
  testimonial?: Testimonial;
  /**
   * Services-template §5: "the number is the visual". Opt-in per page —
   * the growth page keeps it OFF until the 31M evidence recheck (S4 hold,
   * services-copy-audit.md).
   */
  hugeNumbers?: boolean;
}) {
  if (caseStudies.length === 0 && !testimonial) return null;

  return (
    <Section dark>
      <Eyebrow>Proof</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
        What this has produced.
      </h2>

      {caseStudies.length > 0 && (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {caseStudies.slice(0, 4).map((cs) => (
            <article
              key={cs.id}
              className="rounded-2xl p-7"
              style={{ backgroundColor: "rgba(240,237,230,0.06)" }}
            >
              <p className="text-sm font-semibold opacity-60">
                {cs.client}
                {cs.show ? ` · ${cs.show}` : ""} · {cs.industry}
              </p>
              <p
                className="mt-3 text-2xl font-bold leading-tight"
                style={{ color: ORANGE }}
              >
                {cs.headline}
              </p>
              <p className="mt-3 leading-relaxed opacity-80">{cs.what}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4">
                {cs.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="sr-only">{m.label}</dt>
                    <dd
                      className={`font-bold tabular-nums ${
                        hugeNumbers ? "text-4xl lg:text-5xl" : "text-xl"
                      }`}
                    >
                      {m.value}
                    </dd>
                    <dd className="text-xs leading-snug opacity-60">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}

      {testimonial && (
        <figure className="mt-12 max-w-3xl">
          <blockquote className="text-2xl font-medium leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm opacity-70">
            {testimonial.name}
            {testimonial.title ? `, ${testimonial.title}` : ""}
            {testimonial.company ? ` · ${testimonial.company}` : ""}
          </figcaption>
        </figure>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Named placements strip (names clearance-gated via placements-verified.md)   */
/* -------------------------------------------------------------------------- */

export function PlacementsStrip({
  placements,
}: {
  placements?: Service["placements"];
}) {
  if (!placements) return null;

  return (
    <Section className="!py-10 bg-zinc-50">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-base text-zinc-800">
        <span
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: ORANGE_700 }}
        >
          {placements.intro}:
        </span>
        {placements.names.map((name, i) => (
          <span key={name} className="font-semibold">
            {name}
            {i < placements.names.length - 1 && (
              <span aria-hidden className="ml-3 text-zinc-400">
                &middot;
              </span>
            )}
          </span>
        ))}
        <Link
          href={placements.workLink.href}
          className="font-semibold underline underline-offset-4"
          style={{ color: ORANGE_700 }}
        >
          {placements.workLink.label} &rarr;
        </Link>
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* DIY cross-link (one line above the footer)                                  */
/* -------------------------------------------------------------------------- */

export function DiyCrossLink({ diyLink }: { diyLink?: Service["diyLink"] }) {
  if (!diyLink) return null;

  return (
    <Section className="!py-8">
      <p className="text-base text-zinc-700">
        {diyLink.prompt}{" "}
        <Link
          href={diyLink.href}
          className="font-semibold underline underline-offset-4"
          style={{ color: ORANGE_700 }}
        >
          {diyLink.label} &rarr;
        </Link>
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <Section>
      <Eyebrow>Questions</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
        The things people ask before signing.
      </h2>
      <dl className="mt-10 max-w-3xl divide-y divide-zinc-200 border-t border-zinc-200">
        {faqs.map((faq) => (
          <div key={faq.q} className="py-6">
            <dt className="text-lg font-semibold">{faq.q}</dt>
            <dd className="mt-2 leading-relaxed text-zinc-700">{faq.a}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Related + closing CTA                                                       */
/* -------------------------------------------------------------------------- */

export function RelatedServices({
  related,
}: {
  related: { slug: string; name: string; tagline: string }[];
}) {
  if (related.length === 0) return null;

  return (
    <Section className="bg-zinc-50">
      <Eyebrow>Works well with</Eyebrow>
      <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
        Most shows need two of these, not one.
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {related.map((r) => (
          <Link
            key={r.slug}
            href={`/services/${r.slug}`}
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: ORANGE_600 }}
          >
            <h3 className="text-lg font-semibold">{r.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {r.tagline}
            </p>
            <span
              className="mt-4 inline-block text-sm font-semibold"
              style={{ color: ORANGE_700 }}
            >
              Read more &rarr;
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function ClosingCta({
  headline,
  body,
  cta = "Book a call",
  reassurance,
}: {
  headline: string;
  body: string;
  cta?: string;
  /** §11: one line of reassurance, only claims true per docs. */
  reassurance?: string;
}) {
  return (
    <Section dark>
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {headline}
        </h2>
        <p className="mt-4 text-lg leading-relaxed opacity-80">{body}</p>
        <div className="mt-8">
          <CtaButton href="/contact">{cta}</CtaButton>
        </div>
        {reassurance && (
          <p className="mt-6 text-sm opacity-70">{reassurance}</p>
        )}
      </div>
    </Section>
  );
}
