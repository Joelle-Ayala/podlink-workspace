/**
 * Resources — lead magnets.
 *
 * One resource so far: the Podcast Guest Pitch Template. It's real — built in
 * Canva in 2022 as a blank version of the pitch one-pager we use to sell
 * clients in — but it was sent four times and never actually promoted. This
 * page is the relaunch.
 *
 * The headline/body copy is the verbatim 2022 lead-magnet copy.
 */

// TODO(resources): wire download URL. The template exists in Canva but no
// hosted, downloadable version exists yet. Until this is a real URL, the page
// renders a mailto request fallback — and the page stays noindex (see the
// robots TODO in the page file).
export const pitchTemplateDownloadUrl: string | null = null;

/** Where the mailto fallback lands. */
export const resourceRequestEmail = "joelle@podlink.ai";

export const pitchTemplate = {
  eyebrow: "Free resource",
  name: "Podcast Guest Pitch Template",
  headline: "Get interviewed on top industry podcasts.",
  body: "The same template we use to get our clients booked — yours to use forever.",
  /** What the one-pager contains, from the real client version. */
  whatsInside: {
    headline: "What's in the template",
    items: [
      "Your name, title and a two-to-three line expertise tagline",
      "Two expertise areas, each with the talking points that sell the interview",
      "A recent-media-appearances section that builds as you book",
      "The connect call to action that tells hosts exactly how to say yes",
    ],
  },
  download: {
    headline: "Get the template",
    body: "Email us and we'll send it over — no drip sequence, just the template.",
    cta: "Request the template",
    emailSubject: "Podcast Guest Pitch Template",
  },
  crossLink: {
    eyebrow: "Done-for-you",
    headline: "Or skip the pitching entirely.",
    body: "This template is how we book our clients. If you'd rather have a dedicated booking agent run the strategy, outreach and scheduling — and get social clips from every appearance — that's a service.",
    cta: "Getting booked on podcasts",
    href: "/services/get-booked-on-podcasts",
  },
  metaTitle: "Podcast Guest Pitch Template — Free Download | Podlink",
  metaDescription:
    "The pitch template we use to get clients booked on top industry podcasts. Free, and yours to use forever.",
};
