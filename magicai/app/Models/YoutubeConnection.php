<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A user's connected YouTube channel (OAuth, youtube.readonly).
 *
 * Access/refresh tokens are stored through Laravel's `encrypted` cast so
 * they are never at rest in plaintext. Reading them requires APP_KEY.
 */
class YoutubeConnection extends Model
{
    protected $table = 'youtube_connections';

    protected $fillable = [
        'user_id',
        'channel_id',
        'channel_title',
        'uploads_playlist_id',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'connected_at',
    ];

    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    protected $casts = [
        'access_token'     => 'encrypted',
        'refresh_token'    => 'encrypted',
        'token_expires_at' => 'datetime',
        'connected_at'     => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Treat a token expiring within the next minute as already expired so a
     * refresh happens before, not during, an API call.
     */
    public function tokenIsExpired(): bool
    {
        if ($this->token_expires_at === null) {
            return true;
        }

        return $this->token_expires_at->subMinute()->isPast();
    }
}
