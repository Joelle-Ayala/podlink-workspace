<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Launch sprint 1, Sprint B: retain Whisper verbose_json segment timing for
 * NEW transcriptions. Minimal by design — episode/transcript relationship,
 * ordered segments, start/end times, text. Nothing else.
 *
 * Historical transcripts are NOT backfilled automatically (re-transcribing
 * would double Whisper spend); see claude/transcript-backfill-plan.md.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transcript_segments', static function (Blueprint $table): void {
            $table->id();
            $table->foreignId('episode_transcript_id')
                ->constrained('episode_transcripts')
                ->cascadeOnDelete();
            $table->unsignedInteger('seq');
            $table->unsignedInteger('start_ms');
            $table->unsignedInteger('end_ms');
            $table->text('text');

            $table->unique(['episode_transcript_id', 'seq'], 'transcript_segments_transcript_seq_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transcript_segments');
    }
};
