<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Launch sprint 1, Sprint C: pairing reliability metadata.
 *
 * - youtube_paired_manually: a human decided this pairing (including the
 *   decision "no video" — manual + NULL video id means auto-pairing must
 *   leave the episode alone). Automatic matching NEVER overwrites it.
 * - youtube_match_confidence: 0–100 score recorded by automatic matching
 *   only; NULL for manual pairings and legacy auto matches.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('episodes', static function (Blueprint $table): void {
            $table->boolean('youtube_paired_manually')->default(false)->after('youtube_video_id');
            $table->unsignedTinyInteger('youtube_match_confidence')->nullable()->after('youtube_paired_manually');
        });
    }

    public function down(): void
    {
        Schema::table('episodes', static function (Blueprint $table): void {
            $table->dropColumn(['youtube_paired_manually', 'youtube_match_confidence']);
        });
    }
};
