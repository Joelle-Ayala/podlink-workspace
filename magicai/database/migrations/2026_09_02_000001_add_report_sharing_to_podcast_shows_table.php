<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Show Report v1 (feed-ingestion-show-report-spec.md §4 + 09-02 hero
 * amendment): opt-in public share link per show.
 *
 * report_share_hash — unguessable public locator (NOT an identity param:
 * it resolves one show the owner chose to publish). NULL until the owner
 * enables sharing. report_enabled_at doubles as the on/off switch and the
 * "shared since" timestamp (NULL = off — spec open-question resolved as
 * recommended: opt-in, default OFF).
 *
 * Additive only.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('podcast_shows', 'report_share_hash')) {
            return;
        }

        Schema::table('podcast_shows', function (Blueprint $table) {
            $table->string('report_share_hash', 64)->nullable()->unique();
            $table->timestamp('report_enabled_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('podcast_shows', function (Blueprint $table) {
            $table->dropColumn(['report_share_hash', 'report_enabled_at']);
        });
    }
};
