/* eslint-disable @next/next/no-img-element */
import { Badge, Button, Heading, Prose, Section, SectionHead } from "@/components";
import { pageMetadata } from "@/lib/seo";
import { appUrl } from "@/lib/site";

/**
 * Pre-signup podcast analyzer (launch sprint 1, sprint E).
 *
 * "Analyze your podcast": paste an RSS feed, see the show identified
 * (artwork/title/latest episodes) and whether its downloads are already
 * measurable via OP3 — BEFORE creating an account. The result screen's only
 * job is to make "Start free" the obvious next click.
 *
 * Server-rendered; the app's public feed-inspect endpoint does the fetch
 * (rate-limited + cached there). No client JS, no feed modification ever.
 */

export const metadata = pageMetadata({
  title: "Analyze your podcast — free RSS feed check",
  description:
    "Paste your RSS feed and see what Podlink finds: your show, your latest episodes, and whether your downloads are already measurable with OP3 — before you sign up.",
  path: "/analyze",
});

interface InspectResult {
  status: "ok" | "unreachable" | "not_a_feed" | "invalid";
  title?: string | null;
  artwork?: string | null;
  episodes_count?: number;
  latest?: { title: string; pub_date: string | null }[];
  op3?: { prefix_detected: boolean; resolved: boolean };
}

async function inspect(feed: string): Promise<InspectResult | null> {
  if (!/^https?:\/\//i.test(feed) || feed.length > 2048) {
    return { status: "invalid" };
  }

  try {
    const res = await fetch(
      appUrl(`/api/public/feed-inspect?url=${encodeURIComponent(feed)}`),
      { next: { revalidate: 300 } },
    );

    if (res.status === 422) return { status: "invalid" };
    if (!res.ok) return null;

    return (await res.json()) as InspectResult;
  } catch {
    return null;
  }
}

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: Promise<{ feed?: string }>;
}) {
  const { feed } = await searchParams;
  const trimmed = typeof feed === "string" ? feed.trim() : "";
  const result = trimmed !== "" ? await inspect(trimmed) : null;

  return (
    <>
      <Section tone="light">
        <SectionHead
          eyebrow="Free check"
          title="Analyze your podcast"
          intro="Paste your RSS feed URL. We'll identify your show, list your latest episodes, and tell you whether your downloads are already measurable — no account needed."
        />

        <form method="get" action="/analyze" className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="feed">
            RSS feed URL
          </label>
          <input
            id="feed"
            type="url"
            name="feed"
            required
            defaultValue={trimmed}
            placeholder="https://feeds.example.com/your-show"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          />
          <Button type="submit">Analyze</Button>
        </form>
        <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-zinc-500">
          Read-only: we fetch your public feed and never change anything about it.
        </p>
      </Section>

      {trimmed !== "" && (
        <Section tone="alt">
          <div className="mx-auto max-w-2xl">
            {result === null && (
              <Prose>
                <p>
                  That check didn&apos;t go through just now — give it another try in a
                  minute. If it keeps failing, the feed may be blocking automated
                  readers.
                </p>
              </Prose>
            )}

            {result?.status === "invalid" && (
              <Prose>
                <p>
                  That doesn&apos;t look like a feed URL we can check. Paste the full RSS
                  feed address, starting with <code>https://</code> — your podcast host
                  shows it in your show settings.
                </p>
              </Prose>
            )}

            {(result?.status === "unreachable" || result?.status === "not_a_feed") && (
              <Prose>
                <p>
                  We reached out but couldn&apos;t read a podcast feed at that address.
                  Double-check the URL against the RSS feed link in your podcast
                  host&apos;s settings.
                </p>
              </Prose>
            )}

            {result?.status === "ok" && (
              <div>
                <div className="flex items-start gap-5">
                  {result.artwork ? (
                    <img
                      src={result.artwork}
                      alt=""
                      width={96}
                      height={96}
                      className="size-24 shrink-0 rounded-2xl border border-zinc-200 object-cover"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <Heading level={2} className="text-2xl">
                      {result.title ?? "Your podcast"}
                    </Heading>
                    {typeof result.episodes_count === "number" && result.episodes_count > 0 && (
                      <p className="mt-1 text-sm text-zinc-600">
                        {result.episodes_count.toLocaleString()} episode
                        {result.episodes_count === 1 ? "" : "s"} in the feed
                      </p>
                    )}
                    <div className="mt-3">
                      {result.op3?.prefix_detected ? (
                        <Badge>Downloads are measurable — OP3 prefix detected</Badge>
                      ) : (
                        <Badge tone="neutral">Downloads not measured yet</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {Array.isArray(result.latest) && result.latest.length > 0 && (
                  <ul className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
                    {result.latest.map((episode) => (
                      <li key={`${episode.title}-${episode.pub_date ?? ""}`} className="flex items-baseline justify-between gap-4 px-5 py-3">
                        <span className="min-w-0 truncate text-sm font-medium">{episode.title}</span>
                        {episode.pub_date && (
                          <span className="shrink-0 text-xs text-zinc-500">{episode.pub_date}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
                  <Prose>
                    {result.op3?.prefix_detected ? (
                      <p>
                        <strong>Good news:</strong> your feed already carries the OP3
                        prefix, so your downloads are being measured by an open,
                        independent source. Create a free account, connect this feed,
                        and your numbers — downloads, listening apps, episodes — are on
                        your dashboard in about a minute.
                      </p>
                    ) : (
                      <p>
                        Your downloads aren&apos;t being measured by OP3 yet. It&apos;s a
                        one-time, copy-paste setting in your podcast host — no
                        migration, your feed stays where it is. Create a free account
                        and the setup steps for your host are on the first screen.
                      </p>
                    )}
                  </Prose>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <Button href={appUrl("/register")}>Start free</Button>
                    <Button href="/features/download-analytics" variant="secondary">
                      How the analytics work
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
