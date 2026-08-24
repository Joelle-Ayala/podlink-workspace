<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Episode;
use App\Models\PodcastShow;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Parses a connected show's RSS feed and upserts one `episodes` row per
 * <item>, keyed on (podcast_show_id, guid).
 *
 * Spec §3 — the single engineering prerequisite for everything downstream:
 * transcripts, content kits, per-episode metering, the episode report and
 * the YouTube video pairing all need a persisted episode row to hang off.
 *
 * v1 deliberately has no queue dependency: the sync runs inline, throttled
 * to once an hour per show via podcast_shows.episodes_last_synced_at, and
 * every failure degrades to "leave what's in the DB alone".
 */
class EpisodeSyncService
{
    /** Minimum gap between two automatic syncs of the same show. */
    public const SYNC_INTERVAL_MINUTES = 60;

    /** Hard cap on items parsed from a single feed (long back catalogs). */
    private const MAX_ITEMS = 500;

    /** Descriptions are stored for context, not for display in full. */
    private const DESCRIPTION_LIMIT = 5000;

    public function __construct(private readonly Op3Service $op3) {}

    /**
     * Sync only if the show has never synced or its last sync is stale.
     * Safe to call on every analytics page load.
     *
     * @return int number of episodes created or updated (0 when skipped)
     */
    public function syncIfStale(PodcastShow $show): int
    {
        $last = $show->episodes_last_synced_at;

        if ($last !== null && $last->diffInMinutes(now()) < self::SYNC_INTERVAL_MINUTES) {
            return 0;
        }

        return $this->sync($show);
    }

    /**
     * Parse the feed and upsert its items. Never throws — a broken or
     * unreachable feed simply leaves the existing rows untouched.
     *
     * @return int number of episodes created or updated
     */
    public function sync(PodcastShow $show): int
    {
        if (blank($show->rss_feed_url)) {
            return 0;
        }

        $body = $this->op3->fetchFeedBody($show->rss_feed_url);

        if ($body === null) {
            return 0;
        }

        $items = $this->parseItems($body);

        if ($items === []) {
            // Still mark the attempt so a permanently odd feed does not get
            // re-fetched on every single page view.
            $show->forceFill(['episodes_last_synced_at' => now()])->save();

            return 0;
        }

        $synced = 0;

        foreach ($items as $item) {
            try {
                Episode::query()->updateOrCreate(
                    [
                        'podcast_show_id' => $show->id,
                        'guid'            => $item['guid'],
                    ],
                    [
                        'title'            => $item['title'],
                        'description'      => $item['description'],
                        'pub_date'         => $item['pub_date'],
                        'audio_url'        => $item['audio_url'],
                        'duration_seconds' => $item['duration_seconds'],
                    ],
                );

                $synced++;
            } catch (\Throwable $e) {
                Log::warning('Episode upsert failed', [
                    'show_id' => $show->id,
                    'guid'    => $item['guid'],
                    'message' => $e->getMessage(),
                ]);
            }
        }

        $show->forceFill(['episodes_last_synced_at' => now()])->save();

        Log::info('Episode sync complete', [
            'show_id' => $show->id,
            'items'   => count($items),
            'synced'  => $synced,
        ]);

        return $synced;
    }

    /**
     * Recent episodes for a show, newest first, straight from the DB.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Episode>
     */
    public function recent(PodcastShow $show, int $limit = 10)
    {
        return $show->episodes()
            ->orderByDesc('pub_date')
            ->orderByDesc('id')
            ->limit(max(1, $limit))
            ->get();
    }

    /**
     * @return list<array{guid: string, title: ?string, description: ?string, pub_date: ?string, audio_url: ?string, duration_seconds: ?int}>
     */
    private function parseItems(string $xml): array
    {
        $previous = libxml_use_internal_errors(true);

        try {
            $feed = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA | LIBXML_NOENT | LIBXML_NOBLANKS);
        } catch (\Throwable $e) {
            $feed = false;
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }

        if ($feed === false || ! isset($feed->channel->item)) {
            return [];
        }

        $items = [];
        $seen = [];

        foreach ($feed->channel->item as $item) {
            if (count($items) >= self::MAX_ITEMS) {
                break;
            }

            $parsed = $this->parseItem($item);

            if ($parsed === null || isset($seen[$parsed['guid']])) {
                continue;
            }

            $seen[$parsed['guid']] = true;
            $items[] = $parsed;
        }

        return $items;
    }

    /**
     * @return array{guid: string, title: ?string, description: ?string, pub_date: ?string, audio_url: ?string, duration_seconds: ?int}|null
     */
    private function parseItem(\SimpleXMLElement $item): ?array
    {
        $itunes = $item->children('http://www.itunes.com/dtds/podcast-1.0.dtd');

        $title = $this->text($item->title);
        $audioUrl = null;

        if (isset($item->enclosure)) {
            $attributes = $item->enclosure->attributes();
            $audioUrl = isset($attributes['url']) ? trim((string) $attributes['url']) : null;
        }

        $guid = $this->text($item->guid);
        // Feeds without a <guid> are rare but legal — fall back to the
        // enclosure URL, then the link, then a hash of title+date.
        $guid ??= $audioUrl;
        $guid ??= $this->text($item->link);
        $guid ??= ($title !== null ? sha1($title . '|' . (string) ($item->pubDate ?? ''))
                                   : null);

        if ($guid === null || $guid === '') {
            return null;
        }

        // The unique index is 191 chars wide; longer GUIDs are stored as a
        // stable digest instead of being silently truncated into collisions.
        if (mb_strlen($guid) > 191) {
            $guid = sha1($guid);
        }

        $description = $this->text($item->description);

        if ($description === null && isset($itunes->summary)) {
            $description = $this->text($itunes->summary);
        }

        if ($description !== null) {
            $description = trim(html_entity_decode(strip_tags($description), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $description = mb_substr($description, 0, self::DESCRIPTION_LIMIT);
        }

        return [
            'guid'             => $guid,
            'title'            => $title !== null ? mb_substr($title, 0, 512) : null,
            'description'      => $description !== '' ? $description : null,
            'pub_date'         => $this->parseDate($this->text($item->pubDate)),
            'audio_url'        => $audioUrl !== null ? mb_substr($audioUrl, 0, 2048) : null,
            'duration_seconds' => $this->parseDuration($this->text($itunes->duration ?? null)),
        ];
    }

    private function text(mixed $node): ?string
    {
        if ($node === null) {
            return null;
        }

        $value = trim((string) $node);

        return $value !== '' ? $value : null;
    }

    private function parseDate(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        try {
            return Carbon::parse($value)->toDateTimeString();
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * <itunes:duration> is either raw seconds or HH:MM:SS / MM:SS.
     */
    private function parseDuration(?string $value): ?int
    {
        if ($value === null) {
            return null;
        }

        if (ctype_digit($value)) {
            $seconds = (int) $value;

            return $seconds > 0 ? $seconds : null;
        }

        $parts = array_reverse(explode(':', $value));
        $seconds = 0;
        $multiplier = 1;

        foreach ($parts as $part) {
            $part = trim($part);

            if (! is_numeric($part)) {
                return null;
            }

            $seconds += (int) $part * $multiplier;
            $multiplier *= 60;
        }

        return $seconds > 0 ? $seconds : null;
    }
}
