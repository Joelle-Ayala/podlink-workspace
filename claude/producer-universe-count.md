# Producer Universe Count — Methodology + Runnable Script
**Created:** 2026-08-19 (evening session) · **Status:** READY TO RUN — blocked only on a Podcast Index API key (human, ~3 min)
**Question:** How many addressable podcast producers exist? (GTM sizing input.)

## Operational definition
A "producer" = one distinct feed **owner email** (RSS `itunes:owner`) across feeds that pass the
seriousness gate: **≥3 episodes** published. Cuts reported separately:
- Alive: newest episode within 90 days (the sellable universe)
- Active weekly: newest within 14 days
- By host (Buzzsprout/Transistor/Libsyn/etc. from feed URL patterns) — matters because Podlink
  rides alongside the host

One email owning many feeds counts once (it's one buyer). Missing/junk emails are counted and
reported as a coverage caveat, not guessed.

## Source
Podcast Index (podcastindex.org) — the open index, ~4.2M feeds.
Two paths:
1. **API** (preferred for freshness): needs a free key from api.podcastindex.org — **HUMAN: sign up,
   drop key in `PI_API_KEY`/`PI_API_SECRET` env or claude/.pi-key (gitignored)**. API alone cannot
   enumerate all feeds; use it to validate samples and pull `recentFeeds` deltas.
2. **Full DB dump** (preferred for the count): `https://public.podcastindex.org/podcastindex_feeds.db.tgz`
   (SQLite, ~2–5 GB). No key needed. The count is one SQL pass:

```sql
-- distinct owners over serious feeds
SELECT COUNT(DISTINCT LOWER(TRIM(itunesOwnerEmail)))
FROM podcasts
WHERE episodeCount >= 3
  AND itunesOwnerEmail LIKE '%@%';

-- alive in last 90 days
SELECT COUNT(DISTINCT LOWER(TRIM(itunesOwnerEmail)))
FROM podcasts
WHERE episodeCount >= 3
  AND itunesOwnerEmail LIKE '%@%'
  AND newestItemPubdate >= STRFTIME('%s','now','-90 days');

-- coverage caveat: serious feeds with no usable email
SELECT COUNT(*) FROM podcasts
WHERE episodeCount >= 3
  AND (itunesOwnerEmail IS NULL OR itunesOwnerEmail NOT LIKE '%@%');

-- host segmentation (extend patterns as needed)
SELECT CASE
    WHEN url LIKE '%buzzsprout%' THEN 'Buzzsprout'
    WHEN url LIKE '%transistor%' THEN 'Transistor'
    WHEN url LIKE '%libsyn%' THEN 'Libsyn'
    WHEN url LIKE '%captivate%' THEN 'Captivate'
    WHEN url LIKE '%acast%' THEN 'Acast'
    WHEN url LIKE '%anchor%' OR url LIKE '%spotify%' THEN 'Spotify/Anchor'
    WHEN url LIKE '%podbean%' THEN 'Podbean'
    ELSE 'Other' END AS host,
  COUNT(DISTINCT LOWER(TRIM(itunesOwnerEmail))) AS producers
FROM podcasts
WHERE episodeCount >= 3 AND itunesOwnerEmail LIKE '%@%'
GROUP BY host ORDER BY producers DESC;
```

## Run plan
1. Download dump (bandwidth-heavy; run on the desktop, not mobile tethering).
2. Run the four queries; paste results into a Results section here with the dump date.
3. Validate 50 random rows against live RSS (the contact-discovery Phase 1 crawler shares this code).
4. Publish NOTHING from this externally until validated — standing rule: no claim without source.
   Internal GTM sizing use is fine immediately.

## Ties to
`claude/contact-discovery-spec.md` Phase 1 (Podcast Index + RSS + site crawl, no vendor, no legal
gate) — this count is Phase 1's first deliverable and the outreach system's denominator.
