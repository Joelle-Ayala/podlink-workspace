<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A single episode's transcript (spec §3). One row per episode; the status
 * column tracks the queue job. `body` is FULLTEXT-indexed for search.
 */
class EpisodeTranscript extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'episode_id',
        'status',
        'body',
        'language',
        'provider',
        'audio_seconds',
        'word_count',
        'credits_charged',
        'error',
        'completed_at',
    ];

    protected $casts = [
        'audio_seconds'   => 'integer',
        'word_count'      => 'integer',
        'credits_charged' => 'float',
        'completed_at'    => 'datetime',
    ];

    public function episode(): BelongsTo
    {
        return $this->belongsTo(Episode::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isInFlight(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_PROCESSING], true);
    }
}
