<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Transcript pipeline (feed-ingestion-show-report-spec.md §3).
 *
 * One row per episode, created when transcription is REQUESTED (status
 * tracks the job through pending → processing → completed|failed). The
 * body carries a FULLTEXT index — the search surface for MCP v1.1's
 * search_transcripts and the content-insights work.
 *
 * Additive only — nothing existing is touched.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('episode_transcripts')) {
            return;
        }

        Schema::create('episode_transcripts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('episode_id')->constrained()->cascadeOnDelete();

            // pending | processing | completed | failed
            $table->string('status', 20)->default('pending');

            /** @var \Illuminate\Database\Schema\ColumnDefinition */
            $table->longText('body')->nullable();

            $table->string('language', 16)->nullable();
            $table->string('provider', 32)->default('whisper-1');
            $table->unsignedInteger('audio_seconds')->nullable();
            $table->unsignedInteger('word_count')->nullable();
            $table->decimal('credits_charged', 12, 4)->nullable();
            $table->text('error')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            // One transcript per episode; re-runs update the same row.
            $table->unique('episode_id', 'episode_transcripts_episode_unique');
            $table->index('status', 'episode_transcripts_status_index');
        });

        // FULLTEXT for transcript search (MySQL/InnoDB). Guarded so a
        // non-MySQL local driver doesn't explode.
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE episode_transcripts ADD FULLTEXT episode_transcripts_body_fulltext (body)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('episode_transcripts');
    }
};
