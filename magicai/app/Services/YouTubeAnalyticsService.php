<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Episode;
use App\Models\PodcastShow;
use App\Models\YoutubeConnection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Reads a connected channel's videos and view counts from the YouTube
 * Data API v3.
 *
 * Spec §0: "OP3 sees only RSS downloads; a large share of podcast
 * consumption is on YouTube, invisible to RSS analytics." This is the lite
 * half of that — channel connect + per-video view counts, cached an hour.
 *
 * v1 stores nothing per-video: the numbers are read live (behind the cache)
 * and rendered. The one thing that IS persisted is the naive episode↔video
 * pairing, written to episodes.youtube_video_id, because that is the join
 * the episode report will need.
 */
class YouTubeAnalyticsService
{
    private const API_BASE = 'https://www.googleapis.com/youtube/v3';

    private const CACHE_TTL = 3600; // 1 hour

    private const TIMEOUT = 15; // seconds

    /** playlistItems pages of 50 → 200 most recent uploads. */
    private const MAX_PAGES = 4;

    public function __construct(private readonly YouTubeOAuthService $oauth) {}

    /**
     * Fetch the connected channel's id/title/uploads playlist and persist
     * them on the connection. Called right after the OAuth callback.
     */
    public function syncChannel(YoutubeConnection $connection): bool
    {
        $json = $this->get($connection, '/channels', [
            'part' => 'snippet,contentDetails',
            'mine' => 'true',
        ]);

        $item = $json['items'][0] ?? null;

        if (! is_array($item)) {
            Log::warning('YouTube channels?mine=true returned no channel', [
                'connection_id' => $connection->id,
            ]);

            return false;
        }

        $connection->forceFill([
            'channel_id'          => isset($item['id']) ? (string) $item['id'] : null,
            'channel_title'       => $item['snippet']['title'] ?? null,
            'uploads_playlist_id' => $item['contentDetails']['relatedPlaylists']['uploads'] ?? null,
        ])->save();

        return filled($connection->channel_id);
    }

    /**
     * Videos on the connected channel, newest first, with view counts.
     *
     * @return list<array{video_id: string, title: ?string, published_at: ?string, views: ?int}>
     */
    public function videos(YoutubeConnection $connection): array
    {
        $playlistId = $connection->uploads_playlist_id;

        if (blank($playlistId)) {
            // Older connections (or a failed first sync) may not have it yet.
            if (! $this->syncChannel($connection)) {
                return [];
            }

            $playlistId = $connection->uploads_playlist_id;
        }

        if (blank($playlistId)) {
            return [];
        }

        $cacheKey = 'youtube:videos:' . $connection->id . ':' . md5((string) $playlistId);

        $videos = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($connection, $playlistId): array {
            $ids = $this->uploadIds($connection, (string) $playlistId);

            if ($ids === []) {
                return [];
            }

            return $this->videoStats($connection, $ids);
        });

        return is_array($videos) ? $videos : [];
    }

    /**
     * Naive episode↔video pairing (spec: "log matches, don't force").
     *
     * Exact normalized-title match first, then a prefix match in either
     * direction with a minimum length so short generic titles cannot pair
     * wrongly. Only writes to episodes that have no youtube_video_id yet.
     *
     * @param  list<array{video_id: string, title: ?string, published_at: ?string, views: ?int}>  $videos
     * @return int number of episodes newly paired
     */
    public function pairEpisodes(PodcastShow $show, array $videos): int
    {
        if ($videos === []) {
            return 0;
        }

        $episodes = $show->episodes()->whereNull('youtube_video_id')->get();

        if ($episodes->isEmpty()) {
            return 0;
        }

        $byTitle = [];

        foreach ($videos as $video) {
            $key = $this->normalizeTitle($video['title'] ?? null);

            if ($key !== null && ! isset($byTitle[$key])) {
                $byTitle[$key] = $video['video_id'];
            }
        }

        $paired = 0;

        foreach ($episodes as $episode) {
            $key = $this->normalizeTitle($episode->title);

            if ($key === null) {
                continue;
            }

            $videoId = $byTitle[$key] ?? $this->prefixMatch($key, $byTitle);

            if ($videoId === null) {
                continue;
            }

            $episode->forceFill(['youtube_video_id' => $videoId])->save();
            $paired++;

            Log::info('Episode paired to YouTube video', [
                'episode_id' => $episode->id,
                'video_id'   => $videoId,
                'title'      => $episode->title,
            ]);
        }

        return $paired;
    }

    /**
     * @param  list<array{video_id: string, title: ?string, published_at: ?string, views: ?int}>  $videos
     * @return array<string, int> video_id => views
     */
    public function viewsByVideoId(array $videos): array
    {
        $map = [];

        foreach ($videos as $video) {
            if (isset($video['video_id']) && $video['views'] !== null) {
                $map[$video['video_id']] = (int) $video['views'];
            }
        }

        return $map;
    }

    /**
     * ML2 expanded scope — audience demographics from the YouTube ANALYTICS
     * API v2 (channel-level; trailing 90 days). Verified at build time:
     * metrics=viewerPercentage, dimensions=ageGroup,gender (totals ≈100%
     * because we do NOT add subscribedStatus, which would double-count).
     *
     * Returns one of three honest shapes:
     *   ['status' => 'ok', 'age_gender' => [...], 'by_age' => [...], 'by_gender' => [...], 'top_countries' => [...]]
     *   ['status' => 'needs_reconnect']  — connection predates the analytics scope (403)
     *   ['status' => 'no_data']          — scope fine, channel too small/new for the report
     *
     * @return array<string, mixed>
     */
    public function demographics(YoutubeConnection $connection): array
    {
        $cacheKey = 'youtube:demographics:' . $connection->id;

        $result = Cache::remember($cacheKey, 6 * 3600, function () use ($connection): array {
            $window = [
                'startDate' => now()->subDays(90)->toDateString(),
                'endDate'   => now()->toDateString(),
            ];

            [$status, $json] = $this->getAnalytics($connection, [
                'ids'        => 'channel==MINE',
                'metrics'    => 'viewerPercentage',
                'dimensions' => 'ageGroup,gender',
                'sort'       => '-viewerPercentage',
            ] + $window);

            if ($status === 401 || $status === 403) {
                return ['status' => 'needs_reconnect'];
            }

            $rows = is_array($json['rows'] ?? null) ? $json['rows'] : [];

            $ageGender = [];
            $byAge = [];
            $byGender = [];

            foreach ($rows as $row) {
                if (! is_array($row) || count($row) < 3 || ! is_numeric($row[2])) {
                    continue;
                }

                $age = str_replace('age', '', (string) $row[0]);
                $gender = (string) $row[1];
                $percent = round((float) $row[2], 1);

                $ageGender[] = ['age_group' => $age, 'gender' => $gender, 'percent' => $percent];
                $byAge[$age] = round(($byAge[$age] ?? 0) + $percent, 1);
                $byGender[$gender] = round(($byGender[$gender] ?? 0) + $percent, 1);
            }

            // Geography: views by country, same window, top 10.
            [, $geoJson] = $this->getAnalytics($connection, [
                'ids'        => 'channel==MINE',
                'metrics'    => 'views',
                'dimensions' => 'country',
                'sort'       => '-views',
                'maxResults' => 10,
            ] + $window);

            $countries = [];

            foreach ((is_array($geoJson['rows'] ?? null) ? $geoJson['rows'] : []) as $row) {
                if (is_array($row) && count($row) >= 2 && is_numeric($row[1])) {
                    $countries[] = ['country' => (string) $row[0], 'views' => (int) $row[1]];
                }
            }

            if ($ageGender === [] && $countries === []) {
                return ['status' => 'no_data'];
            }

            arsort($byAge);
            arsort($byGender);

            return [
                'status'        => 'ok',
                'window_days'   => 90,
                'age_gender'    => $ageGender,
                'by_age'        => $byAge,
                'by_gender'     => $byGender,
                'top_countries' => $countries,
            ];
        });

        return is_array($result) ? $result : ['status' => 'no_data'];
    }

    /**
     * GET against the YouTube ANALYTICS API v2 (different host from the Data
     * API), returning [statusCode, json] so callers can tell a scope problem
     * (401/403 → reconnect) from an empty report.
     *
     * @return array{0: int, 1: array<string, mixed>}
     */
    private function getAnalytics(YoutubeConnection $connection, array $query): array
    {
        $token = $this->accessToken($connection);

        if ($token === null) {
            return [401, []];
        }

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->timeout(self::TIMEOUT)
                ->get('https://youtubeanalytics.googleapis.com/v2/reports', $query);

            $json = $response->json();

            if (! $response->successful()) {
                Log::warning('YouTube Analytics API request failed', [
                    'status' => $response->status(),
                    'body'   => mb_substr($response->body(), 0, 500),
                ]);
            }

            return [$response->status(), is_array($json) ? $json : []];
        } catch (\Throwable $e) {
            Log::warning('YouTube Analytics API exception', ['message' => $e->getMessage()]);

            return [0, []];
        }
    }

    /**
     * @return list<string>
     */
    private function uploadIds(YoutubeConnection $connection, string $playlistId): array
    {
        $ids = [];
        $pageToken = null;

        for ($page = 0; $page < self::MAX_PAGES; $page++) {
            $query = [
                'part'       => 'contentDetails',
                'playlistId' => $playlistId,
                'maxResults' => 50,
            ];

            if ($pageToken !== null) {
                $query['pageToken'] = $pageToken;
            }

            $json = $this->get($connection, '/playlistItems', $query);

            foreach (($json['items'] ?? []) as $item) {
                $videoId = $item['contentDetails']['videoId'] ?? null;

                if (filled($videoId)) {
                    $ids[] = (string) $videoId;
                }
            }

            $pageToken = $json['nextPageToken'] ?? null;

            if (blank($pageToken)) {
                break;
            }
        }

        return array_values(array_unique($ids));
    }

    /**
     * videos.list accepts at most 50 ids per call — batch accordingly.
     *
     * @param  list<string>  $ids
     * @return list<array{video_id: string, title: ?string, published_at: ?string, views: ?int}>
     */
    private function videoStats(YoutubeConnection $connection, array $ids): array
    {
        $videos = [];

        foreach (array_chunk($ids, 50) as $chunk) {
            $json = $this->get($connection, '/videos', [
                'part' => 'snippet,statistics',
                'id'   => implode(',', $chunk),
            ]);

            foreach (($json['items'] ?? []) as $item) {
                $videoId = $item['id'] ?? null;

                if (blank($videoId)) {
                    continue;
                }

                $views = $item['statistics']['viewCount'] ?? null;

                $videos[] = [
                    'video_id'     => (string) $videoId,
                    'title'        => $item['snippet']['title'] ?? null,
                    'published_at' => $item['snippet']['publishedAt'] ?? null,
                    'views'        => is_numeric($views) ? (int) $views : null,
                ];
            }
        }

        usort($videos, static function (array $a, array $b): int {
            return strcmp((string) ($b['published_at'] ?? ''), (string) ($a['published_at'] ?? ''));
        });

        return $videos;
    }

    /**
     * Authenticated GET against the YouTube Data API, refreshing the access
     * token first when it has expired. Failures log and return [].
     */
    private function get(YoutubeConnection $connection, string $path, array $query = []): array
    {
        $token = $this->accessToken($connection);

        if ($token === null) {
            return [];
        }

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->timeout(self::TIMEOUT)
                ->get(self::API_BASE . $path, $query);

            if ($response->successful()) {
                $json = $response->json();

                return is_array($json) ? $json : [];
            }

            Log::warning('YouTube API request failed', [
                'path'   => $path,
                'status' => $response->status(),
                'body'   => mb_substr($response->body(), 0, 500),
            ]);
        } catch (\Throwable $e) {
            Log::warning('YouTube API request exception', [
                'path'    => $path,
                'message' => $e->getMessage(),
            ]);
        }

        return [];
    }

    /**
     * A usable access token, refreshed in place when expired.
     */
    private function accessToken(YoutubeConnection $connection): ?string
    {
        if (! $connection->tokenIsExpired()) {
            return $connection->access_token;
        }

        if (blank($connection->refresh_token)) {
            Log::warning('YouTube access token expired and no refresh token is stored', [
                'connection_id' => $connection->id,
            ]);

            return null;
        }

        $refreshed = $this->oauth->refresh((string) $connection->refresh_token);

        if ($refreshed === null) {
            return null;
        }

        $connection->forceFill([
            'access_token'     => $refreshed['access_token'],
            'token_expires_at' => now()->addSeconds($refreshed['expires_in'] > 0 ? $refreshed['expires_in'] : 3600),
        ])->save();

        return $refreshed['access_token'];
    }

    /**
     * Lowercase, strip punctuation/episode-number prefixes and collapse
     * whitespace so "Ep. 42: The Thing" and "The Thing" can meet.
     */
    private function normalizeTitle(?string $title): ?string
    {
        if (blank($title)) {
            return null;
        }

        $value = mb_strtolower(trim($title));
        $value = preg_replace('/^(ep(isode)?\.?\s*#?\d+\s*[:\-–|]\s*)/u', '', $value) ?? $value;
        $value = preg_replace('/^(#\d+\s*[:\-–|]\s*)/u', '', $value) ?? $value;
        $value = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $value) ?? $value;
        $value = trim((string) preg_replace('/\s+/u', ' ', $value));

        return $value !== '' ? $value : null;
    }

    /**
     * Prefix match in either direction, with a floor on the shared prefix so
     * two unrelated short titles cannot pair.
     *
     * @param  array<string, string>  $byTitle
     */
    private function prefixMatch(string $key, array $byTitle): ?string
    {
        if (mb_strlen($key) < 15) {
            return null;
        }

        foreach ($byTitle as $videoTitle => $videoId) {
            if (mb_strlen($videoTitle) < 15) {
                continue;
            }

            if (str_starts_with($videoTitle, $key) || str_starts_with($key, $videoTitle)) {
                return $videoId;
            }
        }

        return null;
    }
}
