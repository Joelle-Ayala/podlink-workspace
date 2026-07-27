<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('podcast_shows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('rss_feed_url', 2048);
            $table->string('op3_show_uuid', 64)->nullable();
            $table->timestamps();

            // One connected show per user (M5 scope).
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('podcast_shows');
    }
};
