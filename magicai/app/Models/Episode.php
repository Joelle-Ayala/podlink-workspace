<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A single published episode of a connected show, parsed from its RSS feed.
 *
 * Spec §3: the row that episode reports, transcripts, per-episode metering
 * and the YouTube video pairing all hang off.
 */
class Episode extends Model
{
    protected $fillable = [
        'podcast_show_id',
        'guid',
        'title',
        'description',
        'pub_date',
        'audio_url',
        'duration_seconds',
        'youtube_video_id',
    ];

    protected $casts = [
        'pub_date'         => 'datetime',
        'duration_seconds' => 'integer',
    ];

    public function show(): BelongsTo
    {
        return $this->belongsTo(PodcastShow::class, 'podcast_show_id');
    }
}
