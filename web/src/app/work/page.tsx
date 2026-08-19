import type { Metadata } from "next";
import Link from "next/link";
import {
  placements,
  placementClientCount,
  placementShowCount,
  type Placement,
} from "@/content/placements";
import { ClosingCta, Eyebrow, Section } from "@/components/services";
import { siteUrl } from "@/lib/site";

/**
 * /work — the verified placements directory.
 *
 * Every entry links to (and where possible embeds) the actual public episode.
 * This page is deliberately INDEXED: it's the site's densest page of real
 * entities (shows, guests, episode titles), which is exactly what search and
 * AI answer engines reward — and it answers the single most common buyer
 * objection on record, verbatim: "which shows, specifically?"
 *
 * Embeds are lazy (iframe loading="lazy") so 20+ players don't wreck load.
 */
export const metadata: Metadata = {
  title: "Our Work — Verified Podcast Placements | Podlink",
  description:
    "Real guest placements we booked, with links to the actual episodes — Success Story, Edge of NFT, The Full Ratchet, The Rubin Report and more.",
  alternates: { canonical: `${siteUrl}/work` },
  openGraph: {
    title: "Our Work — Verified Podcast Placements | Podlink",
    description:
      "Every placement on this page links to the real, public episode.",
    url: `${siteUrl}/work`,
  },
};

function youtubeId(url: string): string | null {
  const m = url.match(/[?&]v=([\w-]{6,})/);
  return m ? m[1] : null;
}

function spotifyEpisodeId(url: string): string | null {
  const m = url.match(/episode\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

function EpisodeEmbed({ p }: { p: Placement }) {
  if (p.embed === "youtube" && p.links.youtube) {
    const id = youtubeId(p.links.youtube);
    if (!id) return null;
    return (
      <div className="mt-4 aspect-video overflow-hidden rounded-xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={p.episodeTitle}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }
  if (p.embed === "spotify" && p.links.spotify) {
    const id = spotifyEpisodeId(p.links.spotify);
    if (!id) return null;
    return (
      <iframe
        src={`https://open.spotify.com/embed/episode/${id}`}
        title={p.episodeTitle}
        loading="lazy"
        allow="encrypted-media"
        className="mt-4 h-[152px] w-full rounded-xl border-0"
      />
    );
  }
  return null;
}

const LINK_LABELS: [keyof Placement["links"], string][] = [
  ["youtube", "YouTube"],
  ["spotify", "Spotify"],
  ["apple", "Apple Podcasts"],
  ["web", "Episode page"],
];

export default function WorkPage() {
  // Group by client, preserving file order.
  const byClient = new Map<string, Placement[]>();
  for (const p of placements) {
    const list = byClient.get(p.client) ?? [];
    list.push(p);
    byClient.set(p.client, list);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Podcast guest placements booked by Podlink",
    itemListElement: placements.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "PodcastEpisode",
        name: p.episodeTitle,
        partOfSeries: { "@type": "PodcastSeries", name: p.show },
        url: p.links.web ?? p.links.youtube ?? p.links.spotify ?? p.links.apple,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section dark className="!pb-14">
        <Eyebrow>Our work</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          The receipts. Every episode is real — go listen.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          {placements.length} verified placements across {placementShowCount}{" "}
          shows for {placementClientCount} clients. Every entry on this page
          links to the actual public episode — because &ldquo;which shows,
          specifically?&rdquo; deserves a real answer.
        </p>
      </Section>

      {[...byClient.entries()].map(([client, items], idx) => (
        <Section key={client} className={idx % 2 === 1 ? "bg-zinc-50" : ""}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{client}</h2>
            {items[0].caseStudySlug && (
              <Link
                href={`/case-studies/${items[0].caseStudySlug}`}
                className="text-sm font-semibold"
                style={{ color: "#B85600" }}
              >
                Read the case study &rarr;
              </Link>
            )}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {items.map((p) => (
              <article
                key={`${p.show}-${p.episodeTitle}`}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#B85600" }}
                >
                  {p.show} · {p.year}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">
                  {p.episodeTitle}
                </h3>
                <p className="mt-1 text-sm text-zinc-600">{p.guest}</p>
                <EpisodeEmbed p={p} />
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                  {LINK_LABELS.filter(([k]) => p.links[k]).map(([k, label]) => (
                    <a
                      key={k}
                      href={p.links[k]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                      style={{ color: "#B85600" }}
                    >
                      {label}
                    </a>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </Section>
      ))}

      <ClosingCta
        headline="Want your name on this page?"
        body="This is what the booking service produces: real episodes on real shows, clipped and promoted so they reach past the show's own audience."
      />
    </>
  );
}
