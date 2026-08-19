import type { Metadata } from "next";
import {
  ClosingCta,
  Eyebrow,
  FaqList,
  IncludesList,
  ProblemBlock,
  ProcessSteps,
  Section,
} from "@/components/services";
import { mcpFeature } from "@/content/mcp";
import { siteUrl } from "@/lib/site";

/**
 * /features/mcp — static route; takes precedence over /features/[slug].
 *
 * Marketing page for the Podlink MCP server. Content follows the canonical
 * spec in claude/pricing-and-personalization-spec.md §4 (tool surface, tier
 * gates, composability, entitlements).
 *
 * TODO(mcp): REMOVE the noindex below when the MCP server actually ships to
 * users. The server exists in the codebase (magicai/app/Mcp/) but is
 * uncommitted and unreleased — this page must not rank for a capability
 * users can't turn on yet. Same pattern as /pricing and the resources page.
 */
export const metadata: Metadata = {
  title: mcpFeature.metaTitle,
  description: mcpFeature.metaDescription,
  alternates: { canonical: `${siteUrl}/features/mcp` },
  robots: { index: false, follow: true }, // TODO(mcp): flip on launch
  openGraph: {
    title: mcpFeature.metaTitle,
    description: mcpFeature.metaDescription,
    url: `${siteUrl}/features/mcp`,
  },
};

export default function McpFeaturePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: mcpFeature.metaTitle,
    description: mcpFeature.metaDescription,
    url: `${siteUrl}/features/mcp`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark className="!pb-14">
        <Eyebrow>{mcpFeature.eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {mcpFeature.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {mcpFeature.subhead}
        </p>
        <div
          className="mt-10 max-w-xl rounded-2xl p-5 font-mono text-sm leading-relaxed"
          style={{ backgroundColor: "rgba(255,140,0,0.12)" }}
        >
          {mcpFeature.heroExchange.map((line) => (
            <p key={line.text} className={line.you ? "opacity-70" : "mt-2"}>
              <span className="font-bold" style={{ color: "#FF8C00" }}>
                {line.you ? "You: " : "Claude: "}
              </span>
              {line.text}
            </p>
          ))}
        </div>
      </Section>

      <ProblemBlock problem={mcpFeature.problem} />
      <IncludesList items={mcpFeature.includes} />
      <ProcessSteps steps={mcpFeature.steps} />

      <Section dark>
        <Eyebrow>Composability</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          {mcpFeature.composability.headline}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed opacity-80">
          {mcpFeature.composability.body}
        </p>
      </Section>

      <FaqList faqs={mcpFeature.faqs} />
      <ClosingCta
        headline={mcpFeature.closing.headline}
        body={mcpFeature.closing.body}
        cta="Start free"
      />
    </>
  );
}
