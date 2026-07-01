<?php

namespace App\Models\Podlink;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PodlinkShow extends Model
{
    protected $table = 'podlink_shows';

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'rss_feed_url',
        'op3_show_uuid',
        'op3_prefix_active',
        'biolink_handle',
    ];

    protected $casts = [
        'op3_prefix_active' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(PodlinkEpisode::class, 'show_id');
    }

    /**
     * Whether this show has OP3 download tracking active and verified.
     */
    public function hasOp3Active(): bool
    {
        return $this->op3_prefix_active === 'verified' && ! empty($this->op3_show_uuid);
    }

    /**
     * The OP3 prefix URL to prepend to audio URLs.
     */
    public static function op3PrefixUrl(): string
    {
        return 'https://op3.dev/e/';
    }

    /**
     * Given a raw audio URL, return the OP3-prefixed version.
     * Example: https://example.com/ep1.mp3 → https://op3.dev/e/example.com/ep1.mp3
     */
    public static function applyOp3Prefix(string $audioUrl): string
    {
        // Strip the scheme from the URL so OP3 can re-apply it
        $stripped = preg_replace('#^https?://#', '', $audioUrl);

        return self::op3PrefixUrl() . $stripped;
    }
}
