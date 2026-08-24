<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Throttle marker for EpisodeSyncService: the analytics page only re-parses
 * the RSS feed when the last sync is older than the sync interval.
 *
 * Additive, nullable — existing rows keep working and sync on first view.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('podcast_shows') || Schema::hasColumn('podcast_shows', 'episodes_last_synced_at')) {
            return;
        }

        Schema::table('podcast_shows', function (Blueprint $table) {
            $table->timestamp('episodes_last_synced_at')->nullable()->after('op3_show_uuid');
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('podcast_shows') && Schema::hasColumn('podcast_shows', 'episodes_last_synced_at')) {
            Schema::table('podcast_shows', function (Blueprint $table) {
                $table->dropColumn('episodes_last_synced_at');
            });
        }
    }
};
