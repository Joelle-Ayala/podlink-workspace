/**
 * /partners/pr-agencies — ICP landing page for PR, executive-comms and
 * personal-brand agencies (launch sprint F, external-context §22).
 *
 * The page's job: explain the wholesale model plainly — the agency owns the
 * client relationship and the retainer; Podlink does the podcast work behind
 * it (targeting, pitching, booking, prep, clips, reporting), under the
 * agency's brand or as a named partner, their choice.
 *
 * Claims discipline: deliverables come verbatim from the get-booked service
 * scope in services.ts; the only wholesale-specific pricing fact is the
 * services.ts footnote ("Agency and white-label rates available at a
 * 20-booking commitment"). No wholesale client is named — none are cleared —
 * and where specifics are not established the copy says "scoped per
 * engagement" rather than inventing them. Reporting on guesting engagements
 * is placement links, clips delivered and content produced — never listener
 * numbers for shows we don't measure.
 */

import {
  ClosingCta,
  CtaButton,
  Eyebrow,
  FaqList,
  IncludesList,
  PlacementsStrip,
  ProcessSteps,
  ProofSection,
  Section,
} from "@/components/services";
import { bookingUrl } from "@/content/contact";
import { caseStudiesFor } from "@/content/proof";
import { getService, type Faq, type Service } from "@/content/services";
import {
  placements,
  placementClientCount,
  placementShowCount,
} from "@/content/placements";
import { breadcrumbLd, faqLd, jsonLd, pageMetadata } from "@/lib/seo";

const bookingOrUndef = getService("get-booked-on-podcasts");
if (!bookingOrUndef) {
  throw new Error(
    "/partners/pr-agencies: get-booked-on-podcasts service content missing",
  );
}
const booking: Service = bookingOrUndef;

/* Agency-relevant cleared case studies, via the clearance-gated selector:
   multi-engagement and multi-executive work. */
const CASE_PICKS = ["koii", "recon-food", "t3-live", "qualsights"];

export const metadata = pageMetadata({
  title: "White-Label Podcast Guesting for PR Agencies",
  description:
    "Add podcast guesting to your client offering without building the team. You own the client and the retainer; Podlink does targeting, pitching, booking, prep, clips and reporting — under your brand or as a named partner.",
  path: "/partners/pr-agencies",
});

const STEPS = [
  {
    title: "Scope the offering",
    body: "A call to define what you want to sell: which clients, how many bookings, and whether we work under your brand or as a named partner. Agency and white-label rates are available at a 20-booking commitment; the rest is scoped per engagement.",
  },
  {
    title: "Position the client",
    body: "Appearance strategy, SEO keyword research and the personalized pitch one-pager for each executive — the same materials we build on direct engagements.",
  },
  {
    title: "We pitch, book and prep",
    body: "Targeted outreach to value-aligned shows, follow-up, scheduling and confirmation, with a prep brief before every appearance. Your client approves every show before anything is booked.",
  },
  {
    title: "You present the results",
    body: "Links to every live public episode, plus two edited social clips per appearance with copy and hashtags — delivered to you, to put in front of your client under your own brand if that's the model you chose.",
  },
];

/* White-label FAQ. Answers stick to what services.ts and site copy support;
   anything not established is stated as scoped per engagement. */
const PARTNER_FAQS: Faq[] = [
  {
    q: "Who talks to the client?",
    a: "You do. The agency owns the relationship and the retainer; we do the podcast work behind it. Whether we join client calls — and under whose banner — is your choice, scoped per engagement.",
  },
  {
    q: "Is this white-label or co-branded?",
    a: "Either. We can work invisibly under your brand or be introduced as your podcast booking partner. You pick the model per client.",
  },
  {
    q: "How is reporting delivered?",
    a: "Every placement is a live, public episode, so the core of the report is checkable by anyone: links to each episode, the clips delivered, and the content produced from every appearance. The format it arrives in is scoped per engagement.",
  },
  {
    q: "What does it cost?",
    a: "Our published direct pricing is the reference point: $750 to start, then $449 per booked appearance, with clip and program tiers listed on the service page. Agency and white-label rates are available at a 20-booking commitment.",
  },
  {
    q: "How long until a client's first booking?",
    a: "First opportunities typically surface about three weeks after kickoff, based on how our campaigns have actually run. Booking rates after that depend on the client's category and how distinctive their angle is.",
  },
  {
    q: "Do you guarantee a number of bookings per month?",
    a: "No — and be careful with anyone who does; it usually means low-quality placements chosen to hit a count. Your client approves every show, and on pay-per-booking pricing you only pay when an approved show says yes.",
  },
];

export default function PrAgenciesPage() {
  const cases = caseStudiesFor("get-booked-on-podcasts").filter((c) =>
    CASE_PICKS.includes(c.id),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { name: "Home", url: "/" },
              { name: "For PR agencies", url: "/partners/pr-agencies" },
            ]),
            faqLd(PARTNER_FAQS),
          ),
        }}
      />

      {/* Hero — dark, mirrors the /work and services hero pattern. */}
      <Section dark className="!pb-14">
        <Eyebrow>For PR &amp; communications agencies</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Add podcast guesting to your client offering without building the
          team.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          You own the client relationship and the retainer. We do the podcast
          work behind it — targeting, pitching, booking, prep, clips and
          reporting — under your brand or as a named partner. Your choice.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CtaButton href={bookingUrl}>Book a call</CtaButton>
          <CtaButton href="/work" variant="secondary">
            See the work
          </CtaButton>
        </div>
        <div
          className="mt-14 inline-flex flex-col rounded-2xl px-6 py-5"
          style={{ backgroundColor: "rgba(255,140,0,0.12)" }}
        >
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color: "#FF8C00" }}
          >
            {placements.length}
          </span>
          <span className="mt-1 text-sm opacity-70">
            verified guest placements across {placementShowCount} shows for{" "}
            {placementClientCount} clients — every one links to the live episode
          </span>
        </div>
      </Section>

      {/* The model, stated plainly. */}
      <Section>
        <Eyebrow>The model</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          You own the client. We do the podcast work.
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-7">
            <h3 className="text-lg font-semibold">
              The relationship stays yours
            </h3>
            <p className="mt-3 leading-relaxed text-zinc-700">
              Your client, your retainer, your account lead. Whether we appear
              at all — invisible behind your brand, or introduced as your
              booking partner — is your call, scoped per engagement.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-7">
            <h3 className="text-lg font-semibold">The fulfillment is ours</h3>
            <p className="mt-3 leading-relaxed text-zinc-700">
              Positioning, keyword research, pitch materials, outreach,
              booking, scheduling, prep briefs and two edited clips per
              appearance — the same scope we sell on direct engagements.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-7">
            <h3 className="text-lg font-semibold">
              Reporting your client can check
            </h3>
            <p className="mt-3 leading-relaxed text-zinc-700">
              Every placement is a public episode. You get the links, the
              clips delivered and the content produced, in a form you can put
              in front of your client. Delivery format is scoped per
              engagement.
            </p>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-zinc-600">
          The proof further down this page is from our direct engagements — the
          same team, process and deliverables an agency partnership buys. We
          don&rsquo;t publish wholesale client names: work delivered under an
          agency&rsquo;s brand stays under the agency&rsquo;s brand.
        </p>
      </Section>

      {/* What the agency gets — the real service scope, verbatim. */}
      <IncludesList items={booking.includes} />

      {/* How an engagement runs. */}
      <ProcessSteps steps={STEPS} />

      {/* Named placements — all names verified in placements.ts. */}
      <PlacementsStrip
        placements={{
          intro: "Client placements include",
          names: [
            "Success Story",
            "The Full Ratchet",
            "Edge of NFT",
            "The Rubin Report",
            "Crypto 101",
          ],
          workLink: {
            label: `${placements.length} verified episodes`,
            href: "/work",
          },
        }}
      />

      {/* Proof — clearance-gated case studies; no testimonial here. */}
      <ProofSection caseStudies={cases} />

      <FaqList faqs={PARTNER_FAQS} />

      <ClosingCta
        headline="Ready to add guesting to your client offering?"
        body="A 20-minute call. Bring the client you have in mind — we'll tell you what we'd pitch, how the hand-off works, and what it costs at agency rates."
        reassurance="Agency and white-label rates available at a 20-booking commitment."
      />
    </>
  );
}
