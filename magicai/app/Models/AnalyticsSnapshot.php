<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Daily analytics snapshot (sprint D). Append-only history written by
 * podlink:snapshot-analytics; `metrics` is a small source-shaped JSON blob
 * (op3/show: downloads; youtube/episode: views). No updated_at — a day's
 * row may be refreshed same-day but is otherwise immutable.
 */
class AnalyticsSnapshot extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'podcast_show_id',
        'captured_on',
        'source',
        'scope',
        'episode_id',
        'metrics',
    ];

    protected $casts = [
        'captured_on' => 'date',
        'metrics'     => 'array',
    ];

    public function show(): BelongsTo
    {
        return $this->belongsTo(PodcastShow::class, 'podcast_show_id');
    }

    public function episode(): BelongsTo
    {
        return $this->belongsTo(Episode::class);
    }
}
