<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Models\User;

/**
 * Builds the public Podlink page URL for a user.
 *
 * HARD CONSTRAINT: this class must never call the Biolink Admin API.
 *
 * The Biolink admin key is an *instance-level* credential (it can create,
 * update and delete any account — see MCP-O1-BIOLINK-STATS-AUDIT.md §4.1).
 * PodlinkController uses it for the interactive SSO redirect, which is a
 * human-initiated, session-authenticated action. An MCP tool path is neither:
 * it is reachable by an autonomous agent loop holding a user-scoped token.
 * Admin-key calls therefore stay out of tool code entirely. This class only
 * ever does string construction against config('services.biolink.base_url').
 *
 * Consequence, stated plainly: MagicAI does not store the user's Biolink page
 * handle anywhere today (no column on `users`, no column on `podcast_shows`,
 * and `email` is the only SSO join key). So the handle is UNKNOWN unless and
 * until it is persisted on the MagicAI side. Rather than guess a slug or call
 * the admin API, the tool returns a truthful "handle not stored" state plus
 * the page base URL and the dashboard URL that opens the page editor.
 *
 * Forward compatibility: if a `podlink_handle` (or similar) column is ever
 * added to the users table, this resolver picks it up with no code change —
 * see handleFor().
 */
class PodlinkPageResolver
{
    /**
     * Attributes checked, in order, for a stored public page handle.
     * None of these exist today; listing them means the day one is added by a
     * migration, get_podlink_page starts returning a real URL immediately.
     *
     * @var list<string>
     */
    private const HANDLE_ATTRIBUTES = [
        'podlink_handle',
        'biolink_handle',
        'page_handle',
    ];

    public function baseUrl(): string
    {
        return rtrim((string) config('services.biolink.base_url', 'https://podlink.fm'), '/');
    }

    /**
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $handle = $this->handleFor($user);
        $base = $this->baseUrl();

        return [
            'page_base_url' => $base,
            'handle' => $handle,
            'url' => $handle !== null ? $base . '/' . $handle : null,
            // Tri-state on purpose: true/false would both be lies when the
            // handle is unknown, and a hallucinated "your page does not exist"
            // is worse than an honest null.
            'exists' => $handle !== null ? true : null,
            'status' => $handle !== null ? 'resolved' : 'handle_not_stored',
            'manage_url' => $this->manageUrl(),
            'message' => $handle !== null
                ? 'This is the public Podlink page for this account.'
                : 'Podlink does not store this account\'s public page handle yet, so the exact page URL '
                    . 'cannot be built here. Open the page editor from the dashboard to see or set it.',
        ];
    }

    /**
     * Public page URL only, or null when the handle is not stored.
     */
    public function urlFor(User $user): ?string
    {
        $handle = $this->handleFor($user);

        return $handle !== null ? $this->baseUrl() . '/' . $handle : null;
    }

    public function manageUrl(): string
    {
        return route('dashboard.user.podlink');
    }

    private function handleFor(User $user): ?string
    {
        foreach (self::HANDLE_ATTRIBUTES as $attribute) {
            $value = $user->getAttributes()[$attribute] ?? null;

            if (is_string($value) && trim($value) !== '') {
                return trim($value, " \t\n\r\0\x0B/");
            }
        }

        return null;
    }
}
