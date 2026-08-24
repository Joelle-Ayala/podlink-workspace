<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin client for the OP3 (op3.dev) podcast prefix analytics API.
 *
 * OP3 measures downloads for episodes whose enclosure URLs carry the
 * https://op3.dev/e/ prefix. All read endpoints live under
 * https://op3.dev/api/1 and require a bearer token (services.op3.api_token).
 *
 * NOTE (M5): the OP3 API doc shapes could not be re-verified from this
 * sandbox, so every response is normalized defensively — unknown shapes
 * degrade to nulls, never exceptions. Verify against https://op3.dev/api/docs
 * on deploy day.
 */
class Op3Service
{
    /** Public OP3 enclosure prefix users add in their podcast host. */
    public const PREFIX = 'https://op3.dev/e/';

    private const CACHE_TTL = 3600; // 1 hour

    private const TIMEOUT = 10; // seconds

    private string $baseUrl;

    private ?string $apiToken;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.op3.base_url', 'https://op3.dev/api/1'), '/');
        $this->apiToken = config('services.op3.api_token');
    }

    public function isConfigured(): bool
    {
        return filled($this->apiToken);
    }

    /**
     * Resolve an OP3 show from a podcast GUID or an RSS feed URL.
     *
     * When given a feed URL, the feed itself is fetched and its
     * <podcast:guid> tag is used for the OP3 lookup (OP3 keys shows by
     * podcast GUID / its own show UUID).
     *
     * @return array{show_uuid: ?string, title: ?string, podcast_guid: ?string}|null
     */
    public function showByFeedOrGuid(string $feedUrlOrGuid): ?array
    {
        $guid = $feedUrlOrGuid;
        $feedUrl = null;

        if (str_starts_with(strtolower($feedUrlOrGuid), 'http')) {
            $feedUrl = $feedUrlOrGuid;
            $feedInfo = $this->inspectFeed($feedUrlOrGuid);
            $guid = $feedInfo['podcast_guid'] ?? null;
        }

        if (filled($guid)) {
            // ASSUMPTION: GET /shows/{showUuidOrPodcastGuid} returns showUuid,
            // title and podcastGuid for a known show.
            $json = $this->get('/shows/' . rawurlencode(trim((string) $guid)));

            if (is_array($json)) {
                $showUuid = $json['showUuid'] ?? $json['uuid'] ?? null;

                if (filled($showUuid)) {
                    return [
                        'show_uuid'    => (string) $showUuid,
                        'title'        => isset($json['title']) ? (string) $json['title'] : null,
                        'podcast_guid' => isset($json['podcastGuid']) ? (string) $json['podcastGuid'] : (string) $guid,
                    ];
                }
            }
        }

        // Fallback (ported from the 2026-06-30 build's verify flow): OP3 can
        // also match a show on its feed URL — covers feeds that carry no
        // <podcast:guid> tag at all.
        if (filled($feedUrl)) {
            return $this->showByFeedUrl($feedUrl);
        }

        return null;
    }

    /**
     * Resolve an OP3 show by its RSS feed URL.
     *
     * Ported from the earlier (2026-06-30) M5 build, normalized defensively
     * to this build's conventions.
     *
     * @return array{show_uuid: ?string, title: ?string, podcast_guid: ?string}|null
     */
    public function showByFeedUrl(string $feedUrl): ?array
    {
        // ASSUMPTION (carried from the earlier build): GET /shows?feedUrl=…
        // returns { "shows": [{ showUuid, title, podcastGuid }, …] }.
        // VERIFIED 2026-08-08 vs op3 swagger: the show endpoint accepts a
        // urlsafe-base64 feed URL directly in the PATH and returns a single
        // ViewShowResponse { showUuid, title, podcastGuid, ... }. The old
        // /shows?feedUrl= query form does not exist and 404s.
        $feedUrlBase64 = rtrim(strtr(base64_encode($feedUrl), '+/', '-_'), '=');

        $json = $this->get('/shows/' . $feedUrlBase64);

        if (! is_array($json)) {
            return null;
        }

        $showUuid = $json['showUuid'] ?? $json['uuid'] ?? null;

        if (blank($showUuid)) {
            return null;
        }

        return [
            'show_uuid'    => (string) $showUuid,
            'title'        => isset($json['title']) ? (string) $json['title'] : null,
            'podcast_guid' => isset($json['podcastGuid']) ? (string) $json['podcastGuid'] : null,
        ];
    }

    /**
     * Monthly / weekly download counts for a show.
     *
     * @return array{monthly_downloads: ?int, weekly_avg_downloads: ?int, num_weeks: ?int}|null
     */
    public function downloadsForShow(string $showUuid): ?array
    {
        // ASSUMPTION: GET /queries/show-download-counts?showUuid=… returns
        // { "showDownloadCounts": { "<uuid>": { monthlyDownloads, weeklyAvgDownloads, numWeeks } } }
        $json = $this->get('/queries/show-download-counts', ['showUuid' => $showUuid]);

        if (! is_array($json)) {
            return null;
        }

        $counts = $json['showDownloadCounts'] ?? null;
        $row = null;

        if (is_array($counts)) {
            $row = $counts[$showUuid] ?? (array_values($counts)[0] ?? null);
        }

        if (! is_array($row)) {
            // Fallback: some shapes may return the row at the top level.
            $row = $json;
        }

        $monthly = $row['monthlyDownloads'] ?? $row['monthly'] ?? null;
        $weeklyAvg = $row['weeklyAvgDownloads'] ?? $row['weeklyDownloads'] ?? null;
        $numWeeks = $row['numWeeks'] ?? null;

        if (! is_numeric($monthly) && ! is_numeric($weeklyAvg)) {
            return null;
        }

        return [
            'monthly_downloads'    => is_numeric($monthly) ? (int) $monthly : null,
            'weekly_avg_downloads' => is_numeric($weeklyAvg) ? (int) $weeklyAvg : null,
            'num_weeks'            => is_numeric($numWeeks) ? (int) $numWeeks : null,
        ];
    }

    /**
     * Downloads per listening app for a show (last 3 months), with each
     * app's percentage share of the total computed for the UI bars.
     *
     * @return list<array{app: string, downloads: int, share: float}>|null
     */
    public function topAppsForShow(string $showUuid): ?array
    {
        // ASSUMPTION: GET /queries/top-apps-for-show?showUuid=… returns
        // { "appShares": { "Apple Podcasts": 43.1, … } } (percentages).
        // VERIFIED 2026-08-08 vs op3 swagger: response is
        // { showUuid, appDownloads: { "App Name": number }, queryTime } where
        // appDownloads are ABSOLUTE download counts over the last 3 calendar
        // months, sorted most-to-fewest (NOT percentages). Convert to % share
        // here so the existing 'share' contract holds, and also expose the raw
        // download count.
        $json = $this->get('/queries/top-apps-for-show', ['showUuid' => $showUuid]);

        if (! is_array($json)) {
            return null;
        }

        $appDownloads = $json['appDownloads'] ?? $json['appShares'] ?? $json['topApps'] ?? null;

        if (! is_array($appDownloads) || $appDownloads === []) {
            return null;
        }

        $total = 0.0;
        foreach ($appDownloads as $value) {
            if (is_numeric($value)) {
                $total += (float) $value;
            }
        }

        $apps = [];

        foreach ($appDownloads as $key => $value) {
            if (is_array($value)) {
                // Defensive: list-of-objects shape [{ app|name, downloads|count|value }, …]
                $name = $value['app'] ?? $value['name'] ?? null;
                $count = $value['downloads'] ?? $value['count'] ?? $value['value'] ?? null;
            } else {
                // Documented shape: { "App Name": downloadCount }
                $name = $key;
                $count = $value;
            }

            if (blank($name) || ! is_numeric($count)) {
                continue;
            }

            $apps[] = [
                'app'       => (string) $name,
                'downloads' => (int) $count,
                'share'     => $total > 0 ? round(((float) $count / $total) * 100, 1) : 0.0,
            ];
        }

        if ($apps === []) {
            return null;
        }

        usort($apps, static fn (array $a, array $b): int => $b['share'] <=> $a['share']);

        return array_slice($apps, 0, 10);
    }

    /**
     * Most recent episodes OP3 knows for a show.
     *
     * @return list<array{id: ?string, title: ?string, pub_date: ?string}>|null
     */
    public function recentEpisodes(string $showUuid, int $limit = 10): ?array
    {
        // ASSUMPTION: GET /shows/{uuid}?episodes=include returns
        // { …, "episodes": [{ id, title, pubdate }, …] } newest-first.
        $json = $this->get('/shows/' . rawurlencode($showUuid), ['episodes' => 'include']);

        if (! is_array($json) || ! is_array($json['episodes'] ?? null)) {
            return null;
        }

        $episodes = [];

        foreach ($json['episodes'] as $episode) {
            if (! is_array($episode)) {
                continue;
            }

            $episodes[] = [
                'id'       => isset($episode['id']) ? (string) $episode['id'] : null,
                'title'    => isset($episode['title']) ? (string) $episode['title'] : null,
                'pub_date' => $episode['pubdate'] ?? $episode['pubDate'] ?? $episode['published'] ?? null,
            ];
        }

        if ($episodes === []) {
            return null;
        }

        return array_slice($episodes, 0, max(1, $limit));
    }

    /**
     * Fetch the user's RSS feed and report what we can see in it:
     * the <podcast:guid> (needed to find the show on OP3) and whether
     * the OP3 prefix is already on the enclosure URLs.
     *
     * @return array{podcast_guid: ?string, prefix_detected: bool, title: ?string}|null
     */
    public function inspectFeed(string $rssFeedUrl, bool $fresh = false): ?array
    {
        $cacheKey = 'op3:feed:' . md5($rssFeedUrl);

        if ($fresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($rssFeedUrl) {
            $body = $this->fetchFeedBody($rssFeedUrl);

            if ($body === null) {
                return null;
            }

            return [
                'podcast_guid'    => $this->extractPodcastGuid($body),
                'prefix_detected' => $this->detectOp3Prefix($body),
                'title'           => $this->extractFeedTitle($body),
            ];
        });
    }

    /**
     * Fetch the raw RSS body for a feed URL.
     *
     * Shared by inspectFeed() and EpisodeSyncService so there is exactly one
     * place that knows how Podlink talks HTTP to a podcast feed (user agent,
     * timeout, failure logging). Deliberately NOT cached: the only two
     * callers already throttle themselves (inspectFeed caches its parsed
     * result for an hour; the episode sync runs at most hourly), and RSS
     * bodies are large enough that caching them would be wasteful.
     */
    public function fetchFeedBody(string $rssFeedUrl): ?string
    {
        try {
            $response = Http::withHeaders(['User-Agent' => 'Podlink/1.0 (+https://podlink.ai)'])
                ->timeout(self::TIMEOUT)
                ->get($rssFeedUrl);

            if (! $response->successful()) {
                Log::warning('Podcast feed fetch failed', [
                    'url'    => $rssFeedUrl,
                    'status' => $response->status(),
                ]);

                return null;
            }

            return $response->body();
        } catch (\Exception $e) {
            Log::warning('Podcast feed fetch exception', [
                'url'     => $rssFeedUrl,
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    private function extractPodcastGuid(string $xml): ?string
    {
        if (preg_match('/<podcast:guid[^>]*>\s*([^<\s]+)\s*<\/podcast:guid>/i', $xml, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    private function detectOp3Prefix(string $xml): bool
    {
        if (! preg_match_all('/<enclosure\b[^>]*\burl\s*=\s*["\']([^"\']+)["\']/i', $xml, $matches)) {
            return false;
        }

        foreach ($matches[1] as $url) {
            if (str_contains($url, 'op3.dev/e')) {
                return true;
            }
        }

        return false;
    }

    private function extractFeedTitle(string $xml): ?string
    {
        // First <title> inside <channel> — good enough for a display label.
        if (preg_match('/<channel\b[^>]*>.*?<title[^>]*>\s*(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?\s*<\/title>/is', $xml, $matches)) {
            $title = trim(strip_tags($matches[1]));

            return $title !== '' ? $title : null;
        }

        return null;
    }

    /**
     * Authenticated GET against the OP3 API, cached for 1 hour.
     * Failures log a warning and return null (and are not cached, since
     * Laravel treats a stored null as a cache miss).
     */
    private function get(string $path, array $query = []): mixed
    {
        if (! $this->isConfigured()) {
            Log::warning('OP3 API is not configured (missing OP3_API_TOKEN)');

            return null;
        }

        $cacheKey = 'op3:api:' . md5($path . '?' . http_build_query($query));

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($path, $query) {
            try {
                $response = Http::withToken($this->apiToken)
                    ->acceptJson()
                    ->timeout(self::TIMEOUT)
                    ->get($this->baseUrl . $path, $query);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::warning('OP3 API request failed', [
                    'path'   => $path,
                    'status' => $response->status(),
                    'body'   => mb_substr($response->body(), 0, 500),
                ]);
            } catch (\Exception $e) {
                Log::warning('OP3 API request exception', [
                    'path'    => $path,
                    'message' => $e->getMessage(),
                ]);
            }

            return null;
        });
    }
}
