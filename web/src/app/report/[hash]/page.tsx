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

interface ReportDemographics {
  source: string;
  window_days: number;
  by_age: Record<string, number>;
  by_gender: Record<string, number>;
  top_countries: { country: string; views: number }[];
}

interface Report {
  show_title: string | null;
  measured_by: string;
  op3_active: boolean;
  downloads: unknown;
  top_apps: unknown;
  youtube_connected: boolean;
  demographics: ReportDemographics | null;
  podlink_page: {
    pageviews_30d: number;
    visitors_30d: number;
    page_url: string | null;
  } | null;
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

      {report.demographics && (
        <Section>
          <Eyebrow>Audience</Eyebrow>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            Share of watch audience over the last{" "}
            {report.demographics.window_days} days — from the show&rsquo;s own{" "}
            {report.demographics.source}.
          </p>
          <div className="mt-8 grid max-w-3xl gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                By age
              </h3>
              <ul className="mt-4 grid gap-2">
                {Object.entries(report.demographics.by_age).map(([age, pct]) => (
                  <li key={age} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-sm text-zinc-700">{age}</span>
                    <span
                      className="h-2.5 rounded-full bg-zinc-800"
                      style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                    />
                    <span className="shrink-0 text-sm tabular-nums text-zinc-600">
                      {pct}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                By gender
              </h3>
              <ul className="mt-4 grid gap-2">
                {Object.entries(report.demographics.by_gender).map(
                  ([gender, pct]) => (
                    <li key={gender} className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-1">
                      <span className="text-sm capitalize text-zinc-700">
                        {gender.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm tabular-nums text-zinc-600">
                        {pct}%
                      </span>
                    </li>
                  ),
                )}
              </ul>
              {report.demographics.top_countries.length > 0 && (
                <>
                  <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                    Top countries
                  </h3>
                  <ul className="mt-4 grid gap-2">
                    {report.demographics.top_countries.map((row) => (
                      <li key={row.country} className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-1">
                        <span className="text-sm text-zinc-700">{row.country}</span>
                        <span className="text-sm tabular-nums text-zinc-600">
                          {row.views.toLocaleString()} views
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </Section>
      )}

      {report.podlink_page && (
        <Section className="bg-zinc-50">
          <Eyebrow>Link page</Eyebrow>
          <p className="mt-3 text-sm text-zinc-600">
            The show&rsquo;s podlink.fm page, last 30 days.
          </p>
          <dl className="mt-6 flex flex-wrap gap-10">
            <div>
              <dd className="text-3xl font-bold tabular-nums">
                {report.podlink_page.pageviews_30d.toLocaleString()}
              </dd>
              <dt className="mt-1 text-sm text-zinc-600">page views</dt>
            </div>
            <div>
              <dd className="text-3xl font-bold tabular-nums">
                {report.podlink_page.visitors_30d.toLocaleString()}
              </dd>
              <dt className="mt-1 text-sm text-zinc-600">unique visitors</dt>
            </div>
          </dl>
          {report.podlink_page.page_url && (
            <p className="mt-4 text-sm">
              <a
                href={report.podlink_page.page_url}
                className="font-medium underline underline-offset-4"
                rel="noopener nofollow"
              >
                {report.podlink_page.page_url}
              </a>
            </p>
          )}
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
