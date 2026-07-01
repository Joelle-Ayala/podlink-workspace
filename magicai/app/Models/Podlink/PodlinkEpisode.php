<?php

namespace App\Models\Podlink;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class PodlinkEpisode extends Model
{
    protected $table = 'podlink_episodes';

    protected $fillable = [
        'user_id',
        'show_id',
        'title',
        'tracking_code',
        'canonical_url',
        'audio_url',
        'op3_audio_url',
        'youtube_video_id',
        'description',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'date',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $episode) {
            if (empty($episode->tracking_code)) {
                $episode->tracking_code = self::generateTrackingCode();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function show(): BelongsTo
    {
        return $this->belongsTo(PodlinkShow::class, 'show_id');
    }

    public function assets(): HasMany
    {
        return $this->hasMany(PodlinkEpisodeAsset::class, 'episode_id');
    }

    public function trackingCode(): HasMany
    {
        return $this->hasMany(PodlinkTrackingCode::class, 'episode_id');
    }

    /**
     * Generate a unique short tracking code (e.g. "aB3xYz12").
     * Used in captions, hashtags, and tracking links.
     */
    public static function generateTrackingCode(): string
    {
        do {
            $code = Str::random(8);
        } while (static::where('tracking_code', $code)->exists());

        return $code;
    }

    /**
     * The canonical short URL for this episode.
     * Format: https://podlink.ai/e/{tracking_code}
     */
    public function getCanonicalUrlAttribute($value): string
    {
        if (! empty($value)) {
            return $value;
        }

        return 'https://podlink.ai/e/' . $this->tracking_code;
    }
}
