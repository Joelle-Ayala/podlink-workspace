<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ML2-lite / spec §3: persist episodes.
 *
 * One row per RSS <item> per connected show. This is the row that later
 * carries transcripts, the episode report, per-episode metering and the
 * YouTube video pairing (youtube_video_id, populated by the naive matcher
 * in YouTubeAnalyticsService).
 *
 * Additive only — nothing existing is touched.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('episodes')) {
            return;
        }

        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('podcast_show_id')->constrained()->cascadeOnDelete();

            // Feed <guid>. Kept at 191 so the composite unique index fits
            // comfortably inside InnoDB's key limit under utf8mb4; longer
            // GUIDs are stored as their sha1 by EpisodeSyncService.
            $table->string('guid', 191);

            $table->string('title', 512)->nullable();
            $table->text('description')->nullable();
            $table->timestamp('pub_date')->nullable();
            $table->string('audio_url', 2048)->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();

            // Filled by the YouTube pairing pass once a channel is connected.
            $table->string('youtube_video_id', 32)->nullable();

            $table->timestamps();

            $table->unique(['podcast_show_id', 'guid'], 'episodes_show_guid_unique');
            $table->index(['podcast_show_id', 'pub_date'], 'episodes_show_pubdate_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('episodes');
    }
};
