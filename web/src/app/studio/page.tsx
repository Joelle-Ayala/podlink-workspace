import type { Metadata } from "next";
import { ClosingCta, CtaButton, Eyebrow, Section } from "@/components/services";
import { siteUrl } from "@/lib/site";

/**
 * /studio — producer/agency-facing page for the Studio tier ($99, Pricing v2,
 * adopted 2026-08-20). Fills the gap flagged in claude/podlink-sitemap-ia-plan
 * ("no producer-facing page in any phase; /studio needs adding to Phase 2")
 * and claude/gtm-coherence-audit.md finding 1 (S3 is Studio's buyer).
 *
 * TODO(studio): REMOVE the noindex and add this route to sitemap.ts when
 * Studio becomes purchasable — gated on the `unique(user_id)` schema lift +
 * episode metering (claude/feed-ingestion-show-report-spec.md). Until then
 * this page ranks for nothing and promises nothing buyable: the copy is
 * deliberately "talk to us", never a checkout. Same pattern as /features/mcp.
 *
 * HONESTY: multi-show, metering, client workspaces and branded reports are
 * framed as what Studio is FOR, with the "being built" status stated plainly.
 * No present-tense claims for unshipped capability.
 */
export const metadata: Metadata = {
  title: "Podlink Studio — Every Client's Show, One Bill",
  description:
    "For producers, editors and agencies running a roster: unlimited shows metered on episodes, free client viewer seats, branded reports. $99 a month. Being built now — talk to us to onboard early.",
  alternates: { canonical: `${siteUrl}/studio` },
  robots: { index: false, follow: true }, // TODO(studio): flip when Studio is purchasable
  openGraph: {
    title: "Podlink Studio — Every Client's Show, One Bill",
    description:
      "Unlimited shows, episode-based pricing, free client seats, branded reports. For the people who run podcasts for other people.",
    url: `${siteUrl}/studio`,
  },
};

const STUDIO_POINTS = [
  "Unlimited shows — pricing is metered on episodes (about 40 a month across your roster), because that's what tracks your work and our costs. No per-show fees.",
  "Everything in Pro for every show: transcripts on arrival, the Episode Content Kit, brand voice per show.",
  "A workspace per client, so handing an episode over is a link, not a folder and a Slack thread.",
  "Client viewer seats: free and uncapped, always. We will never charge you for the person you're trying to impress.",
  "Reports you can send as your own — client-facing, branded, live pages.",
];

export default function StudioPage() {
  return (
    <>
      <Section dark>
        <Eyebrow>Studio · $99/month · not self-serve yet</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight lg:text-5xl">
          You run podcasts for other people. Your tools still think you have
          one show.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          Studio is Podlink for producers, editors and small agencies: every
          client&apos;s show in one account, priced on the episodes you
          actually produce — never per show, never per client seat.
        </p>
        <div className="mt-8">
          <CtaButton href="/contact">Talk to us</CtaButton>
        </div>
      </Section>

      <Section>
        <Eyebrow>What Studio is</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Built around how a roster actually works.
        </h2>
        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {STUDIO_POINTS.map((item) => (
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
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Straight answer on status: multi-show accounts are being built —
          today Podlink connects one show per account. Studio onboards
          hand-by-hand as that lands. If you run a roster, talk to us now and
          you&apos;ll be first through the door, at the launch price.
        </p>
      </Section>

      <Section className="bg-zinc-50">
        <Eyebrow>Why episodes, not shows</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Per-client pricing punishes you for client churn.
        </h2>
        <p className="mt-6 max-w-2xl leading-relaxed text-zinc-800">
          Lose a client, and per-show pricing hands you a monthly reason to
          re-read the invoice. Episode metering moves with your actual
          workload: a smaller roster costs less without renegotiating
          anything, and a heavy month is just a heavy month.
        </p>
      </Section>

      <ClosingCta
        headline="Run a roster? Let's talk."
        body="Tell us how many shows and episodes a month you run, and we'll tell you exactly when Studio can take you and what early onboarding looks like."
        cta="Book a call"
      />
    </>
  );
}
