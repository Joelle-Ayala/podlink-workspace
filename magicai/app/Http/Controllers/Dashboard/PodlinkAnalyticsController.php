<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Podlink\PodlinkShow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Handles OP3 analytics integration for Podlink.
 *
 * OP3 (op3.dev) is the podcast download analytics prefix service.
 * Creators add `https://op3.dev/e/` before their episode audio URLs
 * in their RSS feed. OP3 logs every download and exposes data via API.
 *
 * Flow:
 * 1. Creator sees onboarding prompt to add the OP3 prefix to their RSS feed
 * 2. They select their podcast host (Spotify, Buzzsprout, Megaphone, etc.)
 * 3. We show them host-specific instructions
 * 4. They mark it as done; we verify by polling the OP3 API for their show
 * 5. Once verified, we pull download data and surface it in their dashboard
 */
class PodlinkAnalyticsController extends Controller
{
    /**
     * OP3 onboarding page — host-specific instructions for adding the prefix.
     */
    public function op3Onboarding(Request $request)
    {
        $user = Auth::user();
        $show = PodlinkShow::where('user_id', $user->id)->first();

        $hosts = $this->podcastHosts();

        return view('dashboard.podlink.op3-onboarding', compact('show', 'hosts'));
    }

    /**
     * Save the user's RSS feed URL and selected host, begin OP3 verification.
     */
    public function op3Setup(Request $request)
    {
        $request->validate([
            'rss_feed_url' => 'required|url',
            'host'         => 'required|string',
            'show_title'   => 'required|string|max:255',
        ]);

        $user = Auth::user();

        $show = PodlinkShow::updateOrCreate(
            ['user_id' => $user->id],
            [
                'title'               => $request->show_title,
                'rss_feed_url'        => $request->rss_feed_url,
                'op3_prefix_active'   => 'no',
                'slug'                => \Illuminate\Support\Str::slug($request->show_title) . '-' . $user->id,
            ]
        );

        return redirect()
            ->route('dashboard.podlink.op3.onboarding')
            ->with('success', __('RSS feed saved. Follow the instructions below to add the OP3 prefix, then click Verify.'));
    }

    /**
     * Attempt to verify that the user's RSS feed has the OP3 prefix active.
     * Polls the OP3 API to find the show and confirm downloads are being measured.
     */
    public function op3Verify(Request $request)
    {
        $user = Auth::user();
        $show = PodlinkShow::where('user_id', $user->id)->firstOrFail();

        $token   = config('services.op3.api_token');
        $baseUrl = config('services.op3.base_url');

        if (empty($token)) {
            return back()->with('error', __('OP3 API token not configured. Please contact support.'));
        }

        try {
            // Search OP3 for the show by feed URL
            $response = Http::withToken($token)
                ->timeout(15)
                ->get("{$baseUrl}/shows", [
                    'feedUrl' => $show->rss_feed_url,
                ]);

            if ($response->successful()) {
                $data  = $response->json();
                $shows = data_get($data, 'shows', []);

                if (! empty($shows)) {
                    $op3Show = $shows[0];
                    $show->update([
                        'op3_show_uuid'     => $op3Show['showUuid'] ?? null,
                        'op3_prefix_active' => 'verified',
                    ]);

                    return back()->with('success', __('OP3 prefix verified! Download tracking is now active.'));
                }
            }

            // Not found yet — may not have had a download since the prefix was added
            return back()->with('warning', __(
                'OP3 could not find your show yet. Make sure you\'ve saved your RSS feed with the op3.dev/e/ prefix, then play an episode from a podcast app to trigger the first download. Try verifying again in a few minutes.'
            ));

        } catch (\Exception $e) {
            Log::error('OP3 verification failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);

            return back()->with('error', __('Verification failed. Please try again.'));
        }
    }

    /**
     * Fetch fresh download data from OP3 and return as JSON (for dashboard widget).
     */
    public function op3Downloads(Request $request)
    {
        $user = Auth::user();
        $show = PodlinkShow::where('user_id', $user->id)->where('op3_prefix_active', 'verified')->first();

        if (! $show || ! $show->op3_show_uuid) {
            return response()->json(['status' => 'not_configured']);
        }

        $token   = config('services.op3.api_token');
        $baseUrl = config('services.op3.base_url');

        try {
            // Last 30 days of downloads
            $response = Http::withToken($token)
                ->timeout(15)
                ->get("{$baseUrl}/shows/{$show->op3_show_uuid}/downloads", [
                    'start' => now()->subDays(30)->toIso8601String(),
                    'end'   => now()->toIso8601String(),
                ]);

            if ($response->successful()) {
                return response()->json([
                    'status' => 'ok',
                    'data'   => $response->json(),
                ]);
            }

        } catch (\Exception $e) {
            Log::error('OP3 downloads fetch failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);
        }

        return response()->json(['status' => 'error'], 500);
    }

    /**
     * Host-specific instructions for adding the OP3 prefix to the RSS feed.
     * Each host has a different UI path for editing the media prefix/prefix URL.
     */
    private function podcastHosts(): array
    {
        return [
            'spotify_for_podcasters' => [
                'name'  => 'Spotify for Podcasters (Anchor)',
                'steps' => [
                    'Go to podcasters.spotify.com and log in.',
                    'Click Settings → Distribution → RSS Feed.',
                    'In the "Media file prefix" field, paste: https://op3.dev/e/',
                    'Click Save. The prefix is applied automatically to all episodes.',
                ],
                'note'  => 'Changes apply immediately. No episodes need to be re-uploaded.',
            ],
            'buzzsprout' => [
                'name'  => 'Buzzsprout',
                'steps' => [
                    'Go to your Buzzsprout dashboard and click Podcast Settings.',
                    'Scroll to "Podcast Statistics" → "Third-party tracking".',
                    'Enter https://op3.dev/e/ in the prefix field.',
                    'Click Save Settings.',
                ],
                'note'  => 'Buzzsprout applies the prefix to all future and existing episode URLs.',
            ],
            'megaphone' => [
                'name'  => 'Megaphone',
                'steps' => [
                    'Log in to Megaphone and open your podcast.',
                    'Go to Settings → Distribution.',
                    'Find "Measurement" and add https://op3.dev/e/ as a prefix.',
                    'Save changes.',
                ],
                'note'  => 'Contact Megaphone support if you do not see the prefix field.',
            ],
            'transistor' => [
                'name'  => 'Transistor.fm',
                'steps' => [
                    'Go to your Transistor dashboard → Podcast Settings → Tracking.',
                    'Add https://op3.dev/e/ as a download tracking prefix.',
                    'Save. Transistor applies it to all episode audio URLs in your RSS feed.',
                ],
                'note'  => 'Transistor already uses OP3 internally — adding the prefix yourself gives you access to the raw API data in your Podlink dashboard.',
            ],
            'acast' => [
                'name'  => 'Acast',
                'steps' => [
                    'Log in to Acast → Show Settings → Distribution.',
                    'Find "Prefix URL" or "Download analytics" settings.',
                    'Add https://op3.dev/e/ as a prefix.',
                    'Save and publish.',
                ],
                'note'  => 'Contact Acast support if you cannot find the prefix setting.',
            ],
            'captivate' => [
                'name'  => 'Captivate.fm',
                'steps' => [
                    'In Captivate, go to your podcast → Settings → Analytics.',
                    'Find the "Third-Party Prefix" field.',
                    'Paste https://op3.dev/e/ and save.',
                ],
                'note'  => 'All episodes including back catalog will be tracked going forward.',
            ],
            'rss_com' => [
                'name'  => 'RSS.com',
                'steps' => [
                    'Log in to RSS.com → Podcast Settings → Advanced.',
                    'Look for "Media file prefix" or "Download tracking".',
                    'Add https://op3.dev/e/ and save.',
                ],
            ],
            'other' => [
                'name'  => 'Other / Self-hosted',
                'steps' => [
                    'Find the setting in your podcast host for "media prefix", "download prefix", or "tracking prefix".',
                    'Add https://op3.dev/e/ before all episode audio URLs.',
                    'If your host does not support a global prefix, you can manually prepend the URL to each episode\'s audio file URL.',
                    'Example: change https://example.com/ep1.mp3 to https://op3.dev/e/example.com/ep1.mp3',
                ],
                'note'  => 'The slash after /e/ is important — do not omit it.',
            ],
        ];
    }
}
