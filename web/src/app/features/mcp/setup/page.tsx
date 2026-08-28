import type { Metadata } from "next";
import {
  Eyebrow,
  FaqList,
  ProcessSteps,
  Section,
} from "@/components/services";
import { siteUrl } from "@/lib/site";

/**
 * /features/mcp/setup — the setup-docs page (submission requirement:
 * "docs a reviewer can use in 10 minutes, 3+ example prompts").
 *
 * Everything on this page is present-tense TRUE as of 2026-08-27: the MCP
 * server is deployed on app.podlink.ai and was verified end-to-end (OAuth
 * 2.1 + PKCE + DCR, all four v1 tools) against a real client. No directory
 * claims here — this documents the custom-connector path, which works today.
 * Indexable: it describes a live capability (Cluster A, seo-gsc-plan.md).
 */
export const metadata: Metadata = {
  title: "Connect Your Podcast to Claude — Podlink MCP Setup",
  description:
    "Step-by-step: connect Podlink to Claude as a custom connector and ask about your own podcast's downloads, top apps, and episodes. Read-only, OAuth, ~5 minutes.",
  alternates: { canonical: `${siteUrl}/features/mcp/setup` },
  openGraph: {
    title: "Connect Your Podcast to Claude — Podlink MCP Setup",
    description:
      "Connect Podlink to Claude and ask about your own podcast's numbers. Read-only, OAuth, ~5 minutes.",
    url: `${siteUrl}/features/mcp/setup`,
  },
};

const steps = [
  {
    title: "Have the two accounts",
    body: "A free Podlink account with your RSS feed connected (no host migration — just the feed URL), and a Claude plan that supports custom connectors (Pro or higher).",
  },
  {
    title: "Add the connector",
    body: "In Claude, open Settings → Connectors → Add custom connector, and paste the server URL: https://app.podlink.ai/mcp",
  },
  {
    title: "Approve the connection",
    body: "Claude sends you to Podlink to sign in and approve access. The grant is read-only and scoped to your own account — you can revoke it from your Podlink dashboard at any time.",
  },
  {
    title: "Ask about your show",
    body: "That's it. Ask Claude about your downloads, your top listening apps, or your recent episodes — the numbers come live from your Podlink account.",
  },
];

const faqs = [
  {
    q: "What can Claude actually do once connected?",
    a: "Four things, all read-only: get an overview of your show (title, feed, download stats), break downloads down by listening app over the last three months, list your recent episodes, and fetch your public Podlink page URL. It cannot edit, post, or delete anything.",
  },
  {
    q: "What are some prompts to try first?",
    a: 'Try: "How did my podcast do this week?" — "Which apps do my listeners use, and what share is Apple Podcasts?" — "List my last 10 episodes with dates." — "What\'s my Podlink page URL?" Each maps to one tool; Claude combines them on its own for bigger questions.',
  },
  {
    q: "Is this safe?",
    a: "The connection is OAuth 2.1 with PKCE, tokens are scoped to your account only, every tool is declared read-only to Claude, and no tool accepts anyone's identity as input — the server resolves your data from your token, so there is no way to ask for another account's numbers. Rate limits and a daily cap protect your account from runaway agent loops.",
  },
  {
    q: "Why does Claude say it can't add the connector?",
    a: "Custom connectors require a paid Claude plan (Pro or higher). On the free Claude tier the option doesn't appear.",
  },
  {
    q: "The connection stopped working — what do I do?",
    a: "Remove the connector in Claude and add it again — the OAuth grant refreshes. If your show's numbers come back empty, check that your RSS feed is still connected in your Podlink dashboard and that your OP3 prefix is active.",
  },
  {
    q: "Does this work with assistants other than Claude?",
    a: "The server speaks standard MCP (Streamable HTTP + OAuth), so any MCP client that supports remote servers with OAuth can connect using the same URL. Claude is what we test against first.",
  },
];

export default function McpSetupPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Connect your podcast to Claude with Podlink",
      description:
        "Connect Podlink to Claude as a custom connector and ask about your own podcast analytics.",
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
        <Eyebrow>Podlink MCP — setup</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Connect your podcast to Claude.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          Five minutes, no code. Podlink runs an MCP server, so Claude can
          answer questions about your own show&rsquo;s downloads, listening
          apps, and episodes — read-only, over OAuth, from data you can
          independently check.
        </p>
        <p
          className="mt-6 max-w-2xl rounded-xl p-4 font-mono text-sm"
          style={{ backgroundColor: "rgba(255,140,0,0.12)" }}
        >
          Server URL:&nbsp;
          <span className="font-bold" style={{ color: "#FF8C00" }}>
            https://app.podlink.ai/mcp
          </span>
        </p>
      </Section>

      <ProcessSteps steps={steps} />
      <FaqList faqs={faqs} />

      <Section dark>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Stuck?
          </h2>
          <p className="mt-4 text-lg leading-relaxed opacity-80">
            Email{" "}
            <a
              className="font-semibold underline underline-offset-4"
              style={{ color: "#FF8C00" }}
              href="mailto:support@podlink.ai"
            >
              support@podlink.ai
            </a>{" "}
            — we reply within 2 business days.
          </p>
        </div>
      </Section>
    </>
  );
}
