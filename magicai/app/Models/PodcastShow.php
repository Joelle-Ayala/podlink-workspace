<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PodcastShow extends Model
{
    protected $fillable = [
        'user_id',
        'rss_feed_url',
        'op3_show_uuid',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
