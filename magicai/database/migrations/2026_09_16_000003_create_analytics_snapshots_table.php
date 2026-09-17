<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Launch sprint 1, Sprint D: minimum viable historical snapshots.
 *
 * OP3 and YouTube numbers are read cache-through today, so PodLink has no
 * history of its own — trend charts, comparisons and (later) Growth Agent
 * recommendations need a daily record. One row per show/day/source (+ one
 * per paired episode/day for YouTube views), metrics as a small JSON blob
 * so new metrics never need a migration.
 *
 * Cost math (documented in LAUNCH-SPRINT-1-REPORT.md): a show with 100
 * paired episodes ≈ 102 rows/day ≈ ~37k rows/show/year at a few hundred
 * bytes each — single-digit MB per show per year. Cadence: daily.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_snapshots', static function (Blueprint $table): void {
            $table->id();
            $table->foreignId('podcast_show_id')->constrained('podcast_shows')->cascadeOnDelete();
            $table->date('captured_on');
            $table->string('source', 16);          // 'op3' | 'youtube'
            $table->string('scope', 16);           // 'show' | 'episode'
            $table->foreignId('episode_id')->nullable()->constrained('episodes')->cascadeOnDelete();
            $table->json('metrics');
            $table->timestamp('created_at')->useCurrent();

            // updateOrCreate key; NULL episode_id rows are deduped in code.
            $table->index(['podcast_show_id', 'captured_on', 'source', 'scope'], 'analytics_snapshots_lookup');
            $table->index(['episode_id', 'captured_on'], 'analytics_snapshots_episode');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_snapshots');
    }
};
