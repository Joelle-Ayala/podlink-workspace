import type { Metadata } from "next";
import { changelog, roadmap, type RoadmapItem } from "@/content/changelog";
import { ClosingCta, Eyebrow, Section } from "@/components/services";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog & Roadmap | Podlink",
  description:
    "What shipped, what's being built now, and what's next — Podlink's changelog and public roadmap.",
  alternates: { canonical: `${siteUrl}/changelog` },
  openGraph: {
    title: "Changelog & Roadmap | Podlink",
    description: "What shipped, what's in development, and what's next.",
    url: `${siteUrl}/changelog`,
  },
};

const ORANGE = "#FF8C00";
const ORANGE_700 = "#B85600";
const INK = "#0f0f12";

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function RoadmapColumn({
  label,
  sub,
  items,
  emphasized = false,
}: {
  label: string;
  sub: string;
  items: RoadmapItem[];
  emphasized?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border bg-white p-6"
      style={{
        borderColor: emphasized ? ORANGE : "#e4e4e7",
        borderWidth: emphasized ? 2 : 1,
      }}
    >
      <h3 className="text-lg font-bold">{label}</h3>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {sub}
      </p>
      <ul className="mt-5 space-y-5">
        {items.map((item) => (
          <li key={item.title}>
            <p className="font-semibold">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <>
      <Section dark className="!pb-14">
        <Eyebrow>Changelog &amp; roadmap</Eyebrow>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          What shipped. What&rsquo;s next.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-80">
          Everything on this page is either usable today or actively being
          built. We don&rsquo;t pre-announce, and we don&rsquo;t publish dates
          we might miss.
        </p>
      </Section>

      <Section>
        <Eyebrow>Roadmap</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Now, next, later.
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <RoadmapColumn
            label="Now"
            sub="In active development"
            items={roadmap.now}
            emphasized
          />
          <RoadmapColumn label="Next" sub="Queued" items={roadmap.next} />
          <RoadmapColumn label="Later" sub="Planned" items={roadmap.later} />
        </div>
      </Section>

      <Section className="bg-zinc-50">
        <Eyebrow>Changelog</Eyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
          Shipped.
        </h2>
        <ol className="mt-10 max-w-3xl space-y-8">
          {changelog.map((entry) => (
            <li
              key={`${entry.date}-${entry.title}`}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
                  style={
                    entry.tag === "New"
                      ? { backgroundColor: ORANGE, color: INK }
                      : { backgroundColor: "#f4f4f5", color: ORANGE_700 }
                  }
                >
                  {entry.tag}
                </span>
                <time
                  dateTime={entry.date}
                  className="text-sm font-semibold text-zinc-500"
                >
                  {formatDate(entry.date)}
                </time>
                {entry.tier !== "—" && (
                  <span className="text-xs font-semibold text-zinc-500">
                    {entry.tier}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-xl font-bold">{entry.title}</h3>
              <p className="mt-2 leading-relaxed text-zinc-700">{entry.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <ClosingCta
        headline="Want these the day they ship?"
        body="Start free — new features land in your dashboard and in the newsletter as they go live."
        cta="Start free"
      />
    </>
  );
}
