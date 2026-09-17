/**
 * /founders — ICP landing page for founders and executives (launch sprint F,
 * external-context §22).
 *
 * The page's job: walk the guesting arc — target the shows whose audiences
 * match your ICP → get booked → show up prepared → clips travel → checkable
 * reporting — using ONLY cleared proof: proof.ts selectors, placements.ts
 * computed counts, and copy that traces to services.ts.
 *
 * Reporting claims are deliberately narrower than the product's OP3 story:
 * guest appearances air on OTHER people's shows, which we do not measure. So
 * reporting on a guesting engagement is placement links (public episodes
 * anyone can check), clips delivered and content produced — never listener
 * numbers for someone else's show.
 */

import {
  ClosingCta,
  CtaButton,
  Eyebrow,
  FaqList,
  PlacementsStrip,
  ProcessSteps,
  ProofSection,
  Section,
} from "@/components/services";
import { bookingUrl } from "@/content/contact";
import { caseStudiesFor, testimonialFor } from "@/content/proof";
import { getService, type Service } from "@/content/services";
import {
  placements,
  placementClientCount,
  placementShowCount,
} from "@/content/placements";
import { breadcrumbLd, faqLd, jsonLd, pageMetadata } from "@/lib/seo";

/* All figures and answers on this page come from the get-booked service
   entry, so a copy change there propagates here. */
const bookingOrUndef = getService("get-booked-on-podcasts");
if (!bookingOrUndef) {
  throw new Error("/founders: get-booked-on-podcasts service content missing");
}
const booking: Service = bookingOrUndef;

/* FAQs reused verbatim from the service page (matched on the question). */
const FAQ_PICKS = [
  "How much does podcast guest booking cost?",
  "How long until I'm booked on something?",
  "Can you guarantee a podcast a month?",
  "Do I get to approve the shows?",
  "What does this do beyond reach?",
];
const faqs = booking.faqs.filter((f) => FAQ_PICKS.includes(f.q));

/* Founder-relevant cleared case studies, via the clearance-gated selector. */
const CASE_PICKS = ["docsend", "opolis", "qualsights", "mudrex"];

export const metadata = pageMetadata({
  title: "Podcast Guesting for Founders & Executives",
  description:
    "Get in front of the audiences that matter to your business: ICP-matched show targeting, booking, media training, clips from every appearance, and reporting you can check against the live episodes.",
  path: "/founders",
});

const STEPS = [
  {
    title: "Target",
    body: "We define the two or three things you should be the go-to voice on, backed by keyword research, then research value-aligned shows whose audiences match your buyers — not a spray list.",
  },
  {
    title: "Book",
    body: "A dedicated booking agent runs targeted outreach, follow-up, scheduling and confirmation. You approve every show before we book it, and first opportunities typically surface in about three weeks.",
  },
  {
    title: "Appear",
    body: "Media training on your story, your talking points and your signature call to action, plus a prep brief for every booked appearance — so you show up ready to say something worth clipping.",
  },
  {
    title: "Amplify",
    body: "Every appearance comes back as two professionally edited social clips with copy and hashtags, built to reach the audience the show alone never had.",
  },
  {
    title: "Check the receipts",
    body: "You get a link to every live episode — public and checkable, the same standard as our work page — along with the clips delivered and the content produced from each appearance.",
  },
];

export default function FoundersPage() {
  const cases = caseStudiesFor("get-booked-on-podcasts").filter((c) =>
    CASE_PICKS.includes(c.id),
  );
  const testimonial = testimonialFor("get-booked-on-podcasts");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbLd([
              { name: "Home", url: "/" },
              { name: "For founders", url: "/founders" },
            ]),
            faqLd(faqs),
          ),
        }}
      />

      {/* Hero — dark, mirrors the /work and services hero pattern. */}
      <Section dark className="!pb-14">
        <Eyebrow>For founders &amp; executives</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Get in front of the audiences that matter to your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          Your buyers already listen to podcasts about their problems. We find
          those shows, book you on them, prepare you, and cut every appearance
          into clips that travel — then hand you links you can check.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CtaButton href={bookingUrl}>Book a call</CtaButton>
          <CtaButton href="/services/get-booked-on-podcasts" variant="secondary">
            See the booking service
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

      {/* The arc: targeting → booking → appearance → clips → reporting. */}
      <ProcessSteps steps={STEPS} variant="timeline" />

      {/* Why guesting — rationale only, no stats. The asset list traces to
          the service FAQ "What does this do beyond reach?". */}
      <Section className="bg-zinc-50">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="text-3xl font-bold tracking-tight lg:col-span-5 lg:text-4xl">
            What an appearance actually buys you
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-zinc-700 lg:col-span-7">
            <p>
              An hour in front of an audience that already cares about your
              category, with the host&rsquo;s implicit endorsement — a room you
              didn&rsquo;t have to build yourself. The myth is that only
              top-tier shows matter; in practice, what determines reach is what
              happens to the interview after it airs. That&rsquo;s why every
              appearance we book comes back as clips built to travel.
            </p>
            <p>
              Beyond the airtime, appearances leave assets behind:
              high-authority backlinks to your site, searchable third-party
              proof of your expertise, and social content you didn&rsquo;t have
              to originate. For guests who show up prepared, it&rsquo;s a
              genuine lead channel — lead generation and content marketing in
              one motion.
            </p>
            <p>
              One thing we won&rsquo;t claim: listener numbers for someone
              else&rsquo;s show. Guest appearances air on shows we don&rsquo;t
              measure, so what we report on a guesting engagement is the
              checkable kind — links to every live episode, the clips
              delivered, and the content produced from each appearance.
            </p>
          </div>
        </div>
      </Section>

      {/* Proof — clearance-gated case studies + testimonial. */}
      <ProofSection caseStudies={cases} testimonial={testimonial} />

      <FaqList faqs={faqs} />

      <ClosingCta
        headline="Ready to get in front of the right audiences?"
        body="A 20-minute call. We'll tell you which kinds of shows fit your ICP, what it costs, and whether guesting is the right first move for your business — and if it isn't, we'll say so."
        reassurance={booking.reassurance}
      />
    </>
  );
}
