<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\Op3Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Pre-signup podcast analyzer (sprint E) — the "taste before the form" step.
 *
 * Public, unauthenticated, READ-ONLY: given an RSS feed URL it returns the
 * show's identity (title/artwork), the latest episodes, and whether the feed
 * already carries the OP3 prefix / resolves on OP3. It never modifies feeds
 * and never stores anything — podlink.ai/analyze renders the result and
 * points at registration.
 *
 * Abuse posture: throttled per IP at the route (15/min), full result cached
 * 1h per URL, host guard refuses private/loopback targets, and all output
 * strings are length-capped. Fetching itself reuses Op3Service (same UA,
 * timeout and logging as every other feed read).
 */
class PublicFeedInspectController extends Controller
{
    private const CACHE_TTL = 3600;

    public function __construct(private readonly Op3Service $op3) {}

    public function show(Request $request): JsonResponse
    {
        $data = $request->validate([
            'url' => 'required|url|starts_with:http|max:2048',
        ]);

        $url = (string) $data['url'];

        if (! $this->hostLooksPublic($url)) {
            return response()->json(['status' => 'invalid'], 422);
        }

        $payload = Cache::remember('feed-inspect:public:' . md5($url), self::CACHE_TTL, function () use ($url): array {
            return $this->inspect($url);
        });

        return response()->json($payload);
    }

    /** @return array<string, mixed> */
    private function inspect(string $url): array
    {
        $body = $this->op3->fetchFeedBody($url);

        if ($body === null) {
            return ['status' => 'unreachable'];
        }

        $feedInfo = $this->op3->inspectFeed($url) ?? [];

        $parsed = $this->parse($body);

        if (($parsed['title'] ?? null) === null && $parsed['latest'] === []) {
            return ['status' => 'not_a_feed'];
        }

        $resolved = null;

        if (filled($feedInfo['podcast_guid'] ?? null)) {
            $resolved = $this->op3->showByFeedOrGuid((string) $feedInfo['podcast_guid']);
        }

        $resolved ??= $this->op3->showByFeedUrl($url);

        return [
            'status'         => 'ok',
            'title'          => $parsed['title'] ?? ($feedInfo['title'] ?? null),
            'artwork'        => $parsed['artwork'],
            'episodes_count' => $parsed['episodes_count'],
            'latest'         => $parsed['latest'],
            'op3'            => [
                'prefix_detected' => (bool) ($feedInfo['prefix_detected'] ?? false),
                'resolved'        => filled($resolved['show_uuid'] ?? null),
            ],
        ];
    }

    /** @return array{title: ?string, artwork: ?string, episodes_count: int, latest: list<array{title: string, pub_date: ?string}>} */
    private function parse(string $body): array
    {
        $empty = ['title' => null, 'artwork' => null, 'episodes_count' => 0, 'latest' => []];

        $previous = libxml_use_internal_errors(true);

        try {
            $xml = simplexml_load_string($body, \SimpleXMLElement::class, LIBXML_NONET | LIBXML_NOCDATA);
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }

        if ($xml === false || ! isset($xml->channel)) {
            return $empty;
        }

        $channel = $xml->channel;
        $itunes = $channel->children('http://www.itunes.com/dtds/podcast-1.0.dtd');

        $artwork = null;

        if (isset($itunes->image)) {
            $artwork = (string) ($itunes->image->attributes()['href'] ?? '');
        }

        if (blank($artwork) && isset($channel->image->url)) {
            $artwork = (string) $channel->image->url;
        }

        $artwork = filled($artwork) && str_starts_with($artwork, 'http') ? mb_substr($artwork, 0, 2048) : null;

        $latest = [];
        $count = 0;

        foreach ($channel->item as $item) {
            $count++;

            if (count($latest) < 5) {
                $title = trim((string) $item->title);

                if ($title !== '') {
                    $pubDate = trim((string) $item->pubDate);

                    $latest[] = [
                        'title'    => mb_substr($title, 0, 300),
                        'pub_date' => $pubDate !== '' ? rescue(fn () => \Illuminate\Support\Carbon::parse($pubDate)->toDateString(), null, false) : null,
                    ];
                }
            }

            if ($count >= 1000) {
                break;
            }
        }

        $title = trim((string) $channel->title);

        return [
            'title'          => $title !== '' ? mb_substr($title, 0, 300) : null,
            'artwork'        => $artwork,
            'episodes_count' => $count,
            'latest'         => $latest,
        ];
    }

    /**
     * Best-effort SSRF guard for a public URL-fetching endpoint: refuse
     * loopback/private/reserved hosts. (DNS re-resolution races are out of
     * scope — the fetch itself only ever GETs and returns parsed metadata.)
     */
    private function hostLooksPublic(string $url): bool
    {
        $host = parse_url($url, PHP_URL_HOST);

        if (blank($host)) {
            return false;
        }

        $host = strtolower((string) $host);

        if (in_array($host, ['localhost', 'localhost.localdomain', '0.0.0.0'], true) || str_ends_with($host, '.local') || str_ends_with($host, '.internal')) {
            return false;
        }

        $ip = filter_var($host, FILTER_VALIDATE_IP) ? $host : gethostbyname($host);

        if ($ip !== $host || filter_var($host, FILTER_VALIDATE_IP)) {
            if (filter_var($ip, FILTER_VALIDATE_IP) && ! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return false;
            }
        }

        return true;
    }
}
