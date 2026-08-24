<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PodcastShow extends Model
{
    protected $fillable = [
        'user_id',
        'rss_feed_url',
        'op3_show_uuid',
        'episodes_last_synced_at',
    ];

    protected $casts = [
        'episodes_last_synced_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function episodes(): HasMany
    {
        return $this->hasMany(Episode::class);
    }
}
