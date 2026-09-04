<?php

declare(strict_types=1);

namespace App\Services\Discovery;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Contact-discovery P1: the contact card, from FREE sources only —
 * the show's own RSS feed (<itunes:owner>, managingEditor, webMaster) and
 * a bounded crawl of its public site (homepage + /contact + /about:
 * mailto links, visible emails, booking-page hints).
 *
 * This layer works WITHOUT the Podcast Index key — paste any feed URL and
 * get a card. No vendors, no LinkedIn, no scraping beyond the show's own
 * published pages (spec gate 2 honored). P2's Snov waterfall adds
 * verification later; nothing here claims verified.
 */
class ContactCardService
{
    private const CACHE_MINUTES = 360;

    /** Pages worth checking on the show's site, in order. */
    private const SITE_PATHS = ['', '/contact', '/about'];

    private const MAX_EMAILS = 5;

    /**
     * @return array{
     *   feed_url: string,
     *   show_title: ?string,
     *   owner_name: ?string,
     *   emails: list<array{email: string, source: string}>,
     *   site_url: ?string,
     *   booking_links: list<string>,
     *   note: string
     * }|null null = feed unreachable/unparseable
     */
    public function card(string $feedUrl): ?array
    {
        $feedUrl = trim($feedUrl);

        if (! str_starts_with($feedUrl, 'http') || mb_strlen($feedUrl) > 2048) {
            return null;
        }

        return Cache::remember(
            'contact-card:' . sha1($feedUrl),
            now()->addMinutes(self::CACHE_MINUTES),
            fn (): ?array => $this->build($feedUrl),
        );
    }

    /** @return array<string, mixed>|null */
    private function build(string $feedUrl): ?array
    {
        $xml = $this->fetch($feedUrl, 2 * 1024 * 1024);

        if ($xml === null) {
            return null;
        }

        $feed = $this->parseXml($xml);

        if ($feed === null || ! isset($feed->channel)) {
            return null;
        }

        $channel = $feed->channel;
        $itunes = $channel->children('http://www.itunes.com/dtds/podcast-1.0.dtd');

        $emails = [];
        $ownerName = null;

        if (isset($itunes->owner)) {
            $ownerEmail = trim((string) ($itunes->owner->children('http://www.itunes.com/dtds/podcast-1.0.dtd')->email ?? ''));
            $ownerName = $this->clean((string) ($itunes->owner->children('http://www.itunes.com/dtds/podcast-1.0.dtd')->name ?? ''));

            if ($this->isEmail($ownerEmail)) {
                $emails[$ownerEmail] = 'rss_owner';
            }
        }

        foreach (['managingEditor', 'webMaster'] as $field) {
            $raw = trim((string) ($channel->{$field} ?? ''));
            // These fields are legally "email (Name)" — take the first token.
            $candidate = trim(explode(' ', $raw)[0] ?? '');

            if ($this->isEmail($candidate)) {
                $emails[$candidate] ??= 'rss_' . strtolower($field);
            }
        }

        $siteUrl = trim((string) ($channel->link ?? ''));
        $siteUrl = str_starts_with($siteUrl, 'http') ? $siteUrl : null;

        $bookingLinks = [];

        if ($siteUrl !== null) {
            [$siteEmails, $bookingLinks] = $this->crawlSite($siteUrl);

            foreach ($siteEmails as $email) {
                if (count($emails) >= self::MAX_EMAILS) {
                    break;
                }

                $emails[$email] ??= 'site';
            }
        }

        return [
            'feed_url'      => $feedUrl,
            'show_title'    => $this->clean((string) ($channel->title ?? '')),
            'owner_name'    => $ownerName,
            'emails'        => collect($emails)
                ->map(fn (string $source, string $email): array => ['email' => $email, 'source' => $source])
                ->values()
                ->all(),
            'site_url'      => $siteUrl,
            'booking_links' => array_slice(array_values(array_unique($bookingLinks)), 0, 3),
            'note'          => 'Sourced from the show\'s own public feed and website. Not verified — verification is the paid enrichment tier.',
        ];
    }

    /**
     * Bounded public-site crawl: up to 3 well-known pages, 500KB each.
     *
     * @return array{0: list<string>, 1: list<string>} [emails, bookingLinks]
     */
    private function crawlSite(string $siteUrl): array
    {
        $base = rtrim($siteUrl, '/');
        $emails = [];
        $booking = [];

        foreach (self::SITE_PATHS as $path) {
            $html = $this->fetch($base . $path, 512 * 1024);

            if ($html === null) {
                continue;
            }

            // mailto: links + visible addresses.
            if (preg_match_all('/(?:mailto:)?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i', $html, $m)) {
                foreach ($m[1] as $email) {
                    $email = strtolower($email);

                    // Drop asset false-positives (name@2x.png etc.).
                    if ($this->isEmail($email) && ! preg_match('/\.(png|jpe?g|gif|webp|svg|css|js)$/i', $email)) {
                        $emails[] = $email;
                    }
                }
            }

            // Booking-page hints: hrefs whose URL or text says book/guest.
            if (preg_match_all('/href=["\']([^"\']+)["\']/i', $html, $links)) {
                foreach ($links[1] as $href) {
                    if (preg_match('/(book|booking|guest|calendly|cal\.com|savvycal)/i', $href)
                        && str_starts_with($href, 'http')) {
                        $booking[] = mb_substr($href, 0, 500);
                    }
                }
            }
        }

        return [array_values(array_unique($emails)), $booking];
    }

    private function fetch(string $url, int $maxBytes): ?string
    {
        try {
            $response = Http::timeout(12)
                ->withHeaders(['User-Agent' => 'Podlink/1.0 (+https://podlink.ai)'])
                ->get($url);

            if (! $response->successful()) {
                return null;
            }

            $body = $response->body();

            return strlen($body) > $maxBytes ? substr($body, 0, $maxBytes) : $body;
        } catch (\Throwable $e) {
            Log::debug('Contact-card fetch failed', ['url' => $url, 'message' => $e->getMessage()]);

            return null;
        }
    }

    private function parseXml(string $xml): ?\SimpleXMLElement
    {
        $previous = libxml_use_internal_errors(true);

        try {
            $feed = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA | LIBXML_NOBLANKS);

            return $feed === false ? null : $feed;
        } catch (\Throwable) {
            return null;
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }
    }

    private function isEmail(string $value): bool
    {
        return $value !== '' && filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function clean(string $value, int $limit = 200): ?string
    {
        $clean = trim(preg_replace('/\s+/u', ' ', strip_tags($value)) ?? '');

        return $clean === '' ? null : mb_substr($clean, 0, $limit);
    }
}
