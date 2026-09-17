<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One timed segment of an episode transcript (Whisper verbose_json).
 * Immutable rows written in bulk by TranscribeEpisodeJob; no timestamps
 * on purpose. Times are milliseconds from episode start.
 */
class TranscriptSegment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'episode_transcript_id',
        'seq',
        'start_ms',
        'end_ms',
        'text',
    ];

    protected $casts = [
        'seq'      => 'integer',
        'start_ms' => 'integer',
        'end_ms'   => 'integer',
    ];

    public function transcript(): BelongsTo
    {
        return $this->belongsTo(EpisodeTranscript::class, 'episode_transcript_id');
    }
}
