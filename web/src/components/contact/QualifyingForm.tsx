"use client";

/**
 * /contact qualifying form (contact-page-template §2).
 *
 * There is deliberately NO backend behind this form — "never a dead form."
 * Submitting composes a structured mailto: to the real inbox with the three
 * answers prefilled and opens the visitor's mail client; the button label
 * says exactly that. No analytics, no fake submission states — the only
 * thing that happens is the thing the button describes.
 *
 * Mobile-first per the template's visual spec: single column, labels above
 * inputs, large tap targets.
 */

import { useState, type FormEvent } from "react";

const ORANGE = "#FF8C00";
const ORANGE_600 = "#DB6E00";
const INK = "#0f0f12";

export interface ServiceOption {
  slug: string;
  name: string;
}

const NOT_SURE_SERVICE = "Not sure yet";

/* Ranges bracket the published service pricing (services.ts: per-episode
   from $250–275, campaigns from $750, retainers from $2,500/mo) — they
   qualify the conversation without claiming any number of their own. */
const NOT_SURE_BUDGET = "Not sure yet — that's what the call is for";
const BUDGET_OPTIONS = [
  "Under $500/month",
  "$500–$2,500/month",
  "$2,500+/month",
  NOT_SURE_BUDGET,
];

const FIELD_CLASSES =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3.5 text-base text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2";

export function QualifyingForm({
  services,
  email,
}: {
  /** The six service lines, passed from the server page (services.ts). */
  services: ServiceOption[];
  /** Destination inbox (contact.ts contactEmail). */
  email: string;
}) {
  const [show, setShow] = useState("");
  const [service, setService] = useState(NOT_SURE_SERVICE);
  const [budget, setBudget] = useState(NOT_SURE_BUDGET);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Podcast inquiry — ${show.trim() || "my show"}`;
    const body = [
      "Hi Podlink team,",
      "",
      `Show name / URL: ${show.trim()}`,
      `Service interest: ${service}`,
      `Budget / stage: ${budget}`,
      "",
      "A bit more about the show:",
      "",
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="qualifying-show"
          className="block text-sm font-semibold text-zinc-800"
        >
          Show name or URL
        </label>
        <input
          id="qualifying-show"
          type="text"
          required
          value={show}
          onChange={(e) => setShow(e.target.value)}
          placeholder="e.g. The Example Show, or its feed / YouTube link"
          className={FIELD_CLASSES}
          style={{ outlineColor: ORANGE_600 }}
        />
        <p className="mt-2 text-sm text-zinc-600">
          No show yet? Put &ldquo;launching&rdquo; and tell us in the email.
        </p>
      </div>

      <div>
        <label
          htmlFor="qualifying-service"
          className="block text-sm font-semibold text-zinc-800"
        >
          What are you looking at?
        </label>
        <select
          id="qualifying-service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={FIELD_CLASSES}
          style={{ outlineColor: ORANGE_600 }}
        >
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value={NOT_SURE_SERVICE}>{NOT_SURE_SERVICE}</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="qualifying-budget"
          className="block text-sm font-semibold text-zinc-800"
        >
          Rough budget or stage
        </label>
        <select
          id="qualifying-budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={FIELD_CLASSES}
          style={{ outlineColor: ORANGE_600 }}
        >
          {BUDGET_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
          style={{
            backgroundColor: ORANGE,
            color: INK,
            outlineColor: ORANGE_600,
          }}
        >
          Compose email &mdash; we reply within 2 business days
        </button>
        <p className="mt-3 text-sm text-zinc-600">
          Opens in your mail app, addressed to {email} with your answers
          prefilled &mdash; edit anything before you hit send.
        </p>
      </div>
    </form>
  );
}
