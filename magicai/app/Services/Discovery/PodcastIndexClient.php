<?php

declare(strict_types=1);

namespace App\Services\Discovery;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Contact-discovery P1 (contact-discovery-spec.md §7.1): Podcast Index
 * search client. FREE tier, no vendor — but the API requires a key
 * (JOELLE-TODO #7). The whole feature is built and inert until
 * PODCASTINDEX_KEY/SECRET land in the environment; then search lights up
 * with zero further code.
 *
 * Auth per their docs: X-Auth-Key + X-Auth-Date + Authorization =
 * sha1(key + secret + unixtime). Attribution required by their terms —
 * the UI carries "Search powered by the Podcast Index".
 */
class PodcastIndexClient
{
    private const BASE = 'https://api.podcastindex.org/api/1.0';

    private const CACHE_MINUTES = 60;

    public function isConfigured(): bool
    {
        return filled(config('podlink.podcastindex.key'))
            && filled(config('podlink.podcastindex.secret'));
    }

    /**
     * Search shows by niche/keyword. Returns a normalized, sanitized list.
     *
     * @return list<array{title: ?string, author: ?string, feed_url: ?string, site_url: ?string, categories: list<string>, episode_count: ?int, last_publish: ?string}>|null
     */
    public function searchShows(string $term, int $limit = 20): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $term = trim(mb_substr($term, 0, 120));

        if ($term === '') {
            return [];
        }

        return Cache::remember(
            'pi-search:' . sha1($term . '|' . $limit),
            now()->addMinutes(self::CACHE_MINUTES),
            function () use ($term, $limit): ?array {
                try {
                    $time = time();
                    $key = (string) config('podlink.podcastindex.key');
                    $secret = (string) config('podlink.podcastindex.secret');

                    $response = Http::timeout(15)
                        ->withHeaders([
                            'X-Auth-Key'    => $key,
                            'X-Auth-Date'   => (string) $time,
                            'Authorization' => sha1($key . $secret . $time),
                            'User-Agent'    => 'Podlink/1.0 (+https://podlink.ai)',
                        ])
                        ->get(self::BASE . '/search/byterm', [
                            'q'   => $term,
                            'max' => max(1, min(40, $limit)),
                        ]);

                    if (! $response->successful()) {
                        return null;
                    }

                    $feeds = $response->json('feeds');

                    if (! is_array($feeds)) {
                        return [];
                    }

                    return collect($feeds)->map(function ($feed): array {
                        $categories = [];

                        if (is_array($feed['categories'] ?? null)) {
                            $categories = array_slice(array_map('strval', array_values($feed['categories'])), 0, 5);
                        }

                        return [
                            'title'         => $this->clean($feed['title'] ?? null),
                            'author'        => $this->clean($feed['author'] ?? null),
                            'feed_url'      => $this->url($feed['url'] ?? null),
                            'site_url'      => $this->url($feed['link'] ?? null),
                            'categories'    => $categories,
                            'episode_count' => is_numeric($feed['episodeCount'] ?? null) ? (int) $feed['episodeCount'] : null,
                            'last_publish'  => is_numeric($feed['newestItemPubdate'] ?? null)
                                ? date('Y-m-d', (int) $feed['newestItemPubdate'])
                                : null,
                        ];
                    })->values()->all();
                } catch (\Throwable $e) {
                    Log::warning('Podcast Index search failed', ['message' => $e->getMessage()]);

                    return null;
                }
            },
        );
    }

    private function clean(mixed $value, int $limit = 200): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $clean = trim(preg_replace('/\s+/u', ' ', strip_tags($value)) ?? '');

        return $clean === '' ? null : mb_substr($clean, 0, $limit);
    }

    private function url(mixed $value): ?string
    {
        if (! is_string($value) || ! str_starts_with($value, 'http')) {
            return null;
        }

        return mb_substr(trim($value), 0, 2048);
    }
}
