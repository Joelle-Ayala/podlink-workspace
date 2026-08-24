<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PodcastShow;
use App\Models\YoutubeConnection;
use App\Services\YouTubeAnalyticsService;
use App\Services\YouTubeOAuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Connect / disconnect the user's YouTube channel (ML2-lite).
 *
 * Every action is gated on YouTubeOAuthService::isConfigured() so that with
 * no OAuth credentials in the environment these routes are inert redirects
 * rather than 500s — the analytics page hides the buttons in that state too.
 */
class YouTubeConnectController extends Controller
{
    public function connect(Request $request, YouTubeOAuthService $oauth): RedirectResponse
    {
        if (! $oauth->isConfigured()) {
            return $this->back(__('YouTube analytics is not available yet. We are finishing setup.'), 'info');
        }

        return $oauth->redirect();
    }

    public function callback(
        Request $request,
        YouTubeOAuthService $oauth,
        YouTubeAnalyticsService $analytics,
    ): RedirectResponse {
        if (! $oauth->isConfigured()) {
            return $this->back(__('YouTube analytics is not available yet. We are finishing setup.'), 'info');
        }

        // User pressed "Cancel" on Google's consent screen.
        if (filled($request->query('error'))) {
            return $this->back(__('YouTube connection cancelled.'), 'info');
        }

        $connection = $oauth->handleCallback($request->user());

        if ($connection === null) {
            return $this->back(__('We could not connect your YouTube channel. Please try again.'), 'error');
        }

        if (! $analytics->syncChannel($connection)) {
            return $this->back(
                __('Connected, but we could not read your channel details. Make sure the Google account you chose owns the channel.'),
                'info',
            );
        }

        return $this->back(
            __('YouTube connected: :channel', ['channel' => $connection->channel_title ?? __('your channel')]),
            'success',
        );
    }

    public function disconnect(Request $request): RedirectResponse
    {
        $user = $request->user();

        YoutubeConnection::query()->where('user_id', $user->id)->delete();

        // Drop the pairings too — they were derived from that channel.
        $show = PodcastShow::query()->where('user_id', $user->id)->first();

        if ($show !== null) {
            $show->episodes()->whereNotNull('youtube_video_id')->update(['youtube_video_id' => null]);
        }

        return $this->back(__('YouTube disconnected.'), 'success');
    }

    private function back(string $message, string $type): RedirectResponse
    {
        return redirect()
            ->route('dashboard.user.analytics.index')
            ->with(['message' => $message, 'type' => $type]);
    }
}
