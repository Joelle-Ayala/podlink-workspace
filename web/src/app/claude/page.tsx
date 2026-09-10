import type { Metadata } from "next";
import {
  Eyebrow,
  FaqList,
  ProcessSteps,
  Section,
} from "@/components/services";
import { siteUrl } from "@/lib/site";

/**
 * /claude — the Cluster A landing page (seo-gsc-plan.md; research pattern:
 * castmagic.io/claude, mcp.transistor.fm). Everything here is present-tense
 * TRUE: the server is live and connectable as a custom connector today.
 * NO directory claims (voice-guide: directory-scoped claims unlock only
 * when the listing is live — the page gains a "find us in the directory"
 * line on that day, one edit).
 *
 * Indexable: targets "connect podcast to Claude" / "Claude podcast
 * analytics" / "podcast MCP" — the land-grab cluster.
 */
export const metadata: Metadata = {
  title: "Podlink for Claude — The Podcast Analytics Connector",
  description:
    "Connect your podcast to Claude and ask about your own downloads, listening apps, episodes and transcripts. Read-only, OAuth, independently checkable numbers from OP3. Five-minute setup.",
  alternates: { canonical: `${siteUrl}/claude` },
  openGraph: {
    title: "Podlink for Claude — The Podcast Analytics Connector",
    description:
      "Ask Claude about your own podcast's numbers. Read-only, OAuth, checkable via OP3.",
    url: `${siteUrl}/claude`,
  },
};

const steps = [
  {
    title: "Connect your feed to Podlink",
    body: "Free account, paste your RSS URL. Nothing migrates — Podlink reads the feed you already publish.",
  },
  {
    title: "Add the connector in Claude",
    body: "Settings → Connectors → Add custom connector → https://app.podlink.ai/mcp — then approve the read-only grant. Requires Claude Pro or higher.",
  },
  {
    title: "Ask about your show",
    body: "“How did my show do this week?” “Which apps do my listeners use?” “What did I say in episode 12?” Claude answers from your real numbers and your own transcripts.",
  },
];

const faqs = [
  {
    q: "What can Claude do once my podcast is connected?",
    a: "Six read-only things: your show overview with download stats, downloads by listening app, your episode list, your podlink.fm page, full-text search across your own episode transcripts, and reading any transcript. It composes them on its own — ask a bigger question and it uses several tools.",
  },
  {
    q: "Why are the numbers trustworthy?",
    a: "Downloads are measured by OP3, the open, independently operated podcast prefix — a source you (or a sponsor) can check without trusting us. We read what OP3 recorded; we can't flatter your show.",
  },
  {
    q: "Is this safe to connect?",
    a: "The connection is OAuth 2.1 with PKCE, every tool is declared read-only to Claude, tokens are scoped to your account only, and no tool accepts anyone's identity as input — there is no way to ask for another account's data. Rate limits and a daily cap protect against runaway agent loops. Revoke anytime from your Podlink dashboard.",
  },
  {
    q: "Does it work with assistants other than Claude?",
    a: "Yes — the server speaks standard MCP over Streamable HTTP with OAuth, so any MCP client that supports remote servers can connect with the same URL. Claude is what we test against first.",
  },
  {
    q: "What does it cost?",
    a: "The connector and the analytics reads are free on every Podlink plan. Transcribing an episode uses plan credits (you choose which episodes, never automatic); reading a transcript you've created is free.",
  },
];

export default function ClaudePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Connect your podcast to Claude",
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark className="!pb-14">
        <Eyebrow>Podlink × Claude</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Talk to your podcast.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          Connect Podlink to Claude and your assistant can answer questions
          about your own show — downloads, listening apps, episodes, and
          what you actually said — from numbers measured by OP3, the open
          standard anyone can check.
        </p>
        <div
          className="mt-8 max-w-xl rounded-2xl p-5 font-mono text-sm leading-relaxed"
          style={{ backgroundColor: "rgba(255,140,0,0.12)" }}
        >
          <p className="opacity-70">
            <span className="font-bold" style={{ color: "#FF8C00" }}>
              You:{" "}
            </span>
            how did my show do this week?
          </p>
          <p className="mt-2">
            <span className="font-bold" style={{ color: "#FF8C00" }}>
              Claude:{" "}
            </span>
            Your show had its downloads measured by OP3 — here&rsquo;s the
            week, by episode and app, and what changed…
          </p>
        </div>
      </Section>

      <ProcessSteps steps={steps} />

      <Section className="bg-zinc-50">
        <Eyebrow>Why this exists</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight lg:text-4xl">
          Podcast tools grade their own homework. This one doesn&rsquo;t.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-700">
          Your host counts your downloads, then reports your downloads.
          Podlink reads from OP3 — open, independent, checkable by the
          sponsor you&rsquo;re pitching — and now your assistant can read the
          same numbers. Transcripts make it more than a dashboard: ask what
          you said, quote yourself accurately, and draft from the source.
        </p>
      </Section>

      <FaqList faqs={faqs} />

      <Section dark>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Five minutes to your first answer.
          </h2>
          <p className="mt-4 text-lg leading-relaxed opacity-80">
            Free Podlink account, one prefix, one connector. The{" "}
            <a
              href="/features/mcp/setup"
              className="underline underline-offset-4"
            >
              setup guide
            </a>{" "}
            walks every step — or email{" "}
            <a
              href="mailto:support@podlink.ai"
              className="underline underline-offset-4"
            >
              support@podlink.ai
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
