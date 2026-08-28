/**
 * Contact page content.
 *
 * There is no form backend. The page is a router: primary CTA books a call,
 * secondary CTA is plain email. Every services CTA on the site points at
 * /contact, so this page's only job is to not lose the click.
 */

// TODO(contact): booking URL — Joelle wants the HubSpot meetings link as
// primary ("I'd not just do email for now"). Checked 2026-08-27: her HubSpot
// (portal 20159837) has NO active scheduling page — all standard
// meetings.hubspot.com slugs 404, and no link exists anywhere in the CRM we
// can read. Activation is a few clicks on her side (JOELLE-TODO #15); when
// the link exists, replace this constant — nothing else needs to change.
export const bookingUrl = "mailto:joelle@podlink.ai";

/** Live since 2024-08-20. */
export const contactEmail = "joelle@podlink.ai";

/** Support inbox — approved 2026-08-27. Mailbox = Google Workspace alias (J). */
export const supportEmail = "support@podlink.ai";

export const contact = {
  eyebrow: "Contact",
  headline: "Tell us where your show actually is.",
  body: "A 20-minute call. We'll tell you what we'd do, what it costs, and whether it's the right first move — and if it isn't, we'll say so. No deck, no discovery-call theater.",
  /** Response-time promise — approved by Joelle 2026-08-27. */
  replyPromise: "We reply within 2 business days.",
  primaryCta: "Book a call",
  secondaryCta: "Email joelle@podlink.ai",
  /** Drawn from the real onboarding flow: package finalization → contract + deposit → kickoff. */
  onCall: {
    eyebrow: "What happens next",
    headline: "Three steps between this page and kickoff.",
    steps: [
      {
        title: "We finalize the package",
        body: "On the call we scope the combination of services that fits your show — and put a real number on it.",
      },
      {
        title: "Contract and deposit",
        body: "You get the agreement to sign electronically, and the engagement is reserved with a deposit.",
      },
      {
        title: "Kickoff call",
        body: "We finalize strategy together, set up the shared workspace, and the work starts.",
      },
    ],
  },
  metaTitle: "Contact — Book a Call | Podlink",
  metaDescription:
    "Book a 20-minute call about podcast production, clips, sponsorship, guest booking or growth. We'll tell you what we'd do and what it costs.",
};
