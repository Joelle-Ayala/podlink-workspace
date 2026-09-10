<?php

declare(strict_types=1);

namespace App\Services\Biolink;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

/**
 * The Biolink READ bridge (scoping amendment 08-27b, option (a): shared-DB
 * read with a drift guard). This class is the ONLY code allowed to touch
 * the 'biolink' connection, and it issues SELECTs exclusively.
 *
 * PINNED SCHEMA (verified against the vendored 66biolinks source,
 * app/controllers/LinksStatistics.php + app/models/User.php, 2026-09-10):
 *   users        — user_id (PK), email
 *   links        — link_id (PK), user_id, type, url, clicks
 *   track_links  — id, user_id, is_unique, datetime  (one row per pageview)
 *
 * DRIFT GUARD: availability = env set + every pinned table/column present
 * (checked once per 6h). Any drift or connection failure degrades to
 * status 'unavailable' — never an exception into a request path.
 *
 * TENANT MAPPING (R1 discipline across the second database): the ONLY
 * lookup key is the authenticated MagicAI user's email — the same key the
 * SSO endpoint uses to bind the two apps' identities (PodlinkController).
 * No id from the outside ever enters a query here.
 */
class BiolinkStatsRepository
{
    private const STATS_CACHE_MINUTES = 30;

    private const SCHEMA_CACHE_HOURS = 6;

    public function configured(): bool
    {
        return filled(config('database.connections.biolink.host'))
            && filled(config('database.connections.biolink.database'));
    }

    /** Drift guard: pinned tables/columns exist on the live connection. */
    public function available(): bool
    {
        if (! $this->configured()) {
            return false;
        }

        return (bool) Cache::remember('biolink-bridge:schema-ok', now()->addHours(self::SCHEMA_CACHE_HOURS), function (): bool {
            try {
                $schema = Schema::connection('biolink');

                $ok = $schema->hasTable('users')
                    && $schema->hasColumns('users', ['user_id', 'email'])
                    && $schema->hasTable('links')
                    && $schema->hasColumns('links', ['link_id', 'user_id', 'type', 'url', 'clicks'])
                    && $schema->hasTable('track_links')
                    && $schema->hasColumns('track_links', ['user_id', 'is_unique', 'datetime']);

                if (! $ok) {
                    Log::warning('Biolink bridge: schema drift detected — pinned tables/columns missing. Update BiolinkStatsRepository against the new 66biolinks schema.');
                }

                return $ok;
            } catch (\Throwable $e) {
                Log::warning('Biolink bridge: connection failed', ['message' => $e->getMessage()]);

                return false;
            }
        });
    }

    /**
     * Page stats for the Podlink page owned by this email (the SSO tenant
     * key). Trailing 30 days for views; lifetime clicks per link.
     *
     * @return array{
     *   status: 'ok'|'no_page'|'unavailable',
     *   pageviews_30d?: int,
     *   visitors_30d?: int,
     *   page_url?: ?string,
     *   top_links?: list<array{url: string, clicks: int}>
     * }
     */
    public function statsForEmail(string $email): array
    {
        if (! $this->available()) {
            return ['status' => 'unavailable'];
        }

        $email = mb_strtolower(trim($email));

        if ($email === '') {
            return ['status' => 'no_page'];
        }

        $result = Cache::remember(
            'biolink-bridge:stats:' . sha1($email),
            now()->addMinutes(self::STATS_CACHE_MINUTES),
            fn (): array => $this->query($email),
        );

        return is_array($result) ? $result : ['status' => 'unavailable'];
    }

    /** @return array<string, mixed> */
    private function query(string $email): array
    {
        try {
            $db = DB::connection('biolink');

            $user = $db->table('users')->where('email', $email)->select(['user_id'])->first();

            if ($user === null) {
                return ['status' => 'no_page'];
            }

            $userId = (int) $user->user_id;

            $views = $db->table('track_links')
                ->where('user_id', $userId)
                ->where('datetime', '>=', now()->subDays(30)->toDateTimeString())
                ->selectRaw('COUNT(*) as pageviews, COALESCE(SUM(is_unique), 0) as visitors')
                ->first();

            // The biolink PAGE row itself carries the public URL; child links
            // carry the outbound clicks.
            $page = $db->table('links')
                ->where('user_id', $userId)
                ->where('type', 'biolink')
                ->orderByDesc('clicks')
                ->select(['url', 'clicks'])
                ->first();

            $topLinks = $db->table('links')
                ->where('user_id', $userId)
                ->where('type', '!=', 'biolink')
                ->orderByDesc('clicks')
                ->limit(5)
                ->select(['url', 'clicks'])
                ->get()
                ->map(fn ($row): array => [
                    'url'    => mb_substr((string) $row->url, 0, 500),
                    'clicks' => (int) $row->clicks,
                ])
                ->all();

            return [
                'status'        => 'ok',
                'pageviews_30d' => (int) ($views->pageviews ?? 0),
                'visitors_30d'  => (int) ($views->visitors ?? 0),
                'page_url'      => $page !== null ? mb_substr((string) $page->url, 0, 500) : null,
                'top_links'     => $topLinks,
            ];
        } catch (\Throwable $e) {
            Log::warning('Biolink bridge query failed', ['message' => $e->getMessage()]);

            return ['status' => 'unavailable'];
        }
    }
}
