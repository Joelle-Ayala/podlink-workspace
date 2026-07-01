<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Podlink analytics data foundation.
 *
 * Creates the core tables for associating episodes, clips, posts,
 * and platform metrics. Analytics data (OP3 downloads, YouTube views,
 * Biolink clicks) is stored as snapshots and attached to episodes.
 *
 * Schema follows the roadmap in /docs/07-analytics-roadmap.md.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ---------------------
        // Shows
        // ---------------------
        Schema::create('podlink_shows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('slug')->unique();             // used in tracking URLs
            $table->text('description')->nullable();
            $table->string('rss_feed_url')->nullable();   // their podcast RSS feed
            $table->string('op3_show_uuid')->nullable();  // assigned by OP3 after prefix is active
            $table->string('op3_prefix_active')->default('no'); // 'no' | 'yes' | 'verified'
            $table->string('biolink_handle')->nullable(); // podlink.fm/{handle}

            $table->timestamps();
            $table->index('user_id');
        });

        // ---------------------
        // Episodes
        // ---------------------
        Schema::create('podlink_episodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('show_id')->nullable()
                  ->references('id')->on('podlink_shows')->nullOnDelete();

            $table->string('title');
            $table->string('tracking_code', 12)->unique(); // e.g. "ep_aB3xYz12" — in captions/hashtags
            $table->string('canonical_url')->nullable();   // podlink.ai/ep/{tracking_code}
            $table->string('audio_url')->nullable();       // original audio (before OP3 prefix)
            $table->string('op3_audio_url')->nullable();   // audio URL with op3.dev/e/ prefix
            $table->string('youtube_video_id')->nullable();
            $table->text('description')->nullable();
            $table->date('published_at')->nullable();

            $table->timestamps();
            $table->index(['user_id', 'show_id']);
            $table->index('tracking_code');
        });

        // ---------------------
        // Episode Assets (clips, posts, show notes, etc.)
        // ---------------------
        Schema::create('podlink_episode_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('episode_id')
                  ->references('id')->on('podlink_episodes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('type');       // 'clip' | 'caption' | 'show_notes' | 'newsletter' | 'youtube_desc'
            $table->string('platform')->nullable(); // 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | null
            $table->string('platform_post_id')->nullable(); // stored when published via MagicAI
            $table->longText('content')->nullable();
            $table->string('media_url')->nullable();   // R2/storage URL for video clips
            $table->string('status')->default('draft'); // 'draft' | 'published' | 'scheduled'
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->index(['episode_id', 'type']);
            $table->index('platform_post_id');
        });

        // ---------------------
        // Tracking Codes (short-link / attribution layer)
        // ---------------------
        Schema::create('podlink_tracking_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('episode_id')
                  ->references('id')->on('podlink_episodes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('code', 12)->unique();    // same as episode tracking_code, indexed for fast lookup
            $table->string('destination_url');       // where the short link redirects
            $table->string('purpose')->default('episode'); // 'episode' | 'sponsor' | 'cta'
            $table->unsignedBigInteger('click_count')->default(0);

            $table->timestamps();
            $table->index('code');
        });

        // ---------------------
        // Platform Connections (OAuth — YouTube, etc.)
        // ---------------------
        Schema::create('podlink_platform_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('platform'); // 'youtube' | 'spotify' | 'apple' | 'tiktok'
            $table->string('platform_account_id')->nullable();
            $table->string('platform_account_name')->nullable();
            $table->text('access_token')->nullable();   // encrypted
            $table->text('refresh_token')->nullable();  // encrypted
            $table->timestamp('token_expires_at')->nullable();
            $table->json('metadata')->nullable();       // channel_id, channel_name, etc.
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->unique(['user_id', 'platform']);
        });

        // ---------------------
        // Metric Snapshots (time-series download/view counts)
        // ---------------------
        Schema::create('podlink_metric_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('episode_id')->nullable()
                  ->references('id')->on('podlink_episodes')->nullOnDelete();
            $table->foreignId('show_id')->nullable()
                  ->references('id')->on('podlink_shows')->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('source');    // 'op3' | 'youtube' | 'biolink' | 'tiktok'
            $table->string('metric');    // 'downloads' | 'views' | 'clicks' | 'impressions'
            $table->unsignedBigInteger('value')->default(0);
            $table->date('snapshot_date');
            $table->json('breakdown')->nullable(); // by app, country, etc. from OP3

            $table->timestamps();
            $table->index(['episode_id', 'source', 'snapshot_date']);
            $table->index(['show_id', 'source', 'snapshot_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('podlink_metric_snapshots');
        Schema::dropIfExists('podlink_platform_connections');
        Schema::dropIfExists('podlink_tracking_codes');
        Schema::dropIfExists('podlink_episode_assets');
        Schema::dropIfExists('podlink_episodes');
        Schema::dropIfExists('podlink_shows');
    }
};
