<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ML2-lite / spec §0 "YouTube is the gap inside the gap".
 *
 * One connected YouTube channel per user. Tokens are written through
 * Laravel's `encrypted` cast (see App\Models\YoutubeConnection), so the
 * columns hold ciphertext — sized generously for that.
 *
 * Additive only.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('youtube_connections')) {
            return;
        }

        Schema::create('youtube_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('channel_id', 64)->nullable();
            $table->string('channel_title', 255)->nullable();
            $table->string('uploads_playlist_id', 64)->nullable();

            // Encrypted at the model layer (encrypted cast).
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();

            $table->timestamp('token_expires_at')->nullable();
            $table->timestamp('connected_at')->nullable();
            $table->timestamps();

            // One channel per user, mirroring podcast_shows' unique(user_id).
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('youtube_connections');
    }
};
