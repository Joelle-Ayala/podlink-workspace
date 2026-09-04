import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow, Section } from "@/components/services";

/**
 * Show Report v1 — the hero deliverable ("the report is the product",
 * gtm-plan 09-02 amendment). A LIVE, shareable page — never a PDF.
 *
 * Data comes from the app's public endpoint; the URL only works while the
 * show's owner keeps sharing enabled. noindex: these are private-by-URL
 * artifacts for sponsors/clients, not SEO surfaces.
 *
 * Cross-channel columns light up as they exist: OP3 downloads + YouTube
 * views are live today; the layout leaves room for social/website columns
 * (ML3 / GA4-read) without a redesign.
 */

export const metadata: Metadata = {
  title: "Show Report | Podlink",
  robots: { index: false, follow: false },
};

export const revalidate = 900; // 15 min — "live page" freshness without hammering.

interface ReportEpisode {
  title: string | null;
  pub_date: string | null;
  youtube_views: number | null;
  transcribed: boolean;
}

interface Report {
  show_title: string | null;
  measured_by: string;
  op3_active: boolean;
  downloads: unknown;
  top_apps: unknown;
  youtube_connected: boolean;
  episodes: ReportEpisode[];
  generated_at: string;
  shared_since: string | null;
}

async function fetchReport(hash: string): Promise<Report | null> {
  if (!/^[A-Za-z0-9]{16,64}$/.test(hash)) return null;

  try {
    const res = await fetch(
      `https://app.podlink.ai/api/public/report/${hash}`,
      { next: { revalidate: 900 } },
    );

    if (!res.ok) return null;

    return (await res.json()) as Report;
  } catch {
    return null;
  }
}

/** OP3 shapes are passed through loosely — render only what parses. */
function asNumberEntries(value: unknown): [string, number][] {
  if (value === null || typeof value !== "object") return [];

  return Object.entries(value as Record<string, unknown>)
    .filter((e): e is [string, number] => typeof e[1] === "number")
    .slice(0, 8);
}

export default async function ShowReportPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const report = await fetchReport(hash);
  if (!report) notFound();

  const downloads = asNumberEntries(report.downloads);

  /* top_apps is a list of {app, downloads, share} rows (Op3Service contract). */
  const topApps = Array.isArray(report.top_apps)
    ? (report.top_apps as { app?: unknown; downloads?: unknown; share?: unknown }[])
        .filter(
          (row): row is { app: string; downloads: number; share: number } =>
            typeof row.app === "string" && typeof row.downloads === "number",
        )
        .slice(0, 8)
    : [];

  return (
    <>
      <Section dark className="!pb-12">
        <Eyebrow>Show Report</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
          {report.show_title ?? "Podcast report"}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed opacity-80">
          {report.measured_by}
        </p>
        <p className="mt-3 text-sm opacity-60">
          Live report — numbers refresh automatically.
          {report.shared_since ? ` Shared since ${report.shared_since}.` : ""}
        </p>
      </Section>

      {report.op3_active && downloads.length > 0 ? (
        <Section>
          <Eyebrow>Downloads</Eyebrow>
          <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {downloads.map(([label, value]) => (
              <div key={label}>
                <dd className="text-3xl font-bold tabular-nums">
                  {value.toLocaleString()}
                </dd>
                <dt className="mt-1 text-sm text-zinc-600">{label.replace(/_/g, " ")}</dt>
              </div>
            ))}
          </dl>
        </Section>
      ) : (
        <Section>
          <p className="max-w-2xl text-zinc-700">
            Download measurement is being set up for this show — the OP3
            prefix reports from the day it&rsquo;s added, so numbers appear
            here as new episodes are downloaded through it.
          </p>
        </Section>
      )}

      {topApps.length > 0 && (
        <Section className="bg-zinc-50">
          <Eyebrow>Where the audience listens</Eyebrow>
          <p className="mt-3 text-sm text-zinc-600">
            Downloads by listening app, last three calendar months.
          </p>
          <ul className="mt-6 grid max-w-2xl gap-3">
            {topApps.map((row) => (
              <li key={row.app} className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-2">
                <span className="font-medium">{row.app}</span>
                <span className="tabular-nums text-zinc-700">
                  {row.downloads.toLocaleString()}
                  {typeof row.share === "number"
                    ? ` · ${row.share.toFixed(1)}%`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {report.episodes.length > 0 && (
        <Section>
          <Eyebrow>Recent episodes</Eyebrow>
          <ul className="mt-8 max-w-3xl">
            {report.episodes.map((episode, i) => (
              <li
                key={`${episode.title}-${i}`}
                className="flex items-center justify-between gap-4 border-b border-zinc-200 py-3"
              >
                <span className="min-w-0 truncate font-medium">
                  {episode.title ?? "Untitled episode"}
                </span>
                <span className="flex shrink-0 items-center gap-4 text-sm text-zinc-600">
                  {episode.youtube_views !== null && (
                    <span className="tabular-nums">
                      {episode.youtube_views.toLocaleString()} YouTube views
                    </span>
                  )}
                  <span>{episode.pub_date ?? ""}</span>
                </span>
              </li>
            ))}
          </ul>
          {report.youtube_connected && (
            <p className="mt-4 text-sm text-zinc-600">
              YouTube views shown where episodes are paired to videos on the
              show&rsquo;s connected channel.
            </p>
          )}
        </Section>
      )}

      <Section dark className="!py-10">
        <p className="text-sm opacity-80">
          Measured by{" "}
          <a href="https://op3.dev" className="underline underline-offset-4">
            OP3
          </a>
          , the open podcast prefix — checkable by anyone. Report generated by{" "}
          <a href="https://podlink.ai" className="font-semibold underline underline-offset-4">
            Podlink
          </a>
          {" "}— get one for your show, free.
        </p>
      </Section>
    </>
  );
}
