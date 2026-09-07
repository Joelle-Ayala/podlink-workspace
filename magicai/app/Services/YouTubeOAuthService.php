<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\YoutubeConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

/**
 * Google OAuth2 (authorization-code) for the YouTube Data API.
 *
 * laravel/socialite ^5.6 is already a first-party dependency of this app
 * (it powers social login), so its Google provider is reused rather than
 * hand-rolling an OAuth client. Crucially the provider is built from an
 * explicit config array — NOT config('services.google') — so Podlink's
 * YouTube client is completely independent of the social-login client:
 * different credentials, different scopes, different redirect URI, and
 * changing one can never break the other.
 *
 * Env gate: with YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET unset the whole
 * feature reports itself unconfigured and the UI shows a "setup in progress"
 * card instead of a connect button that would 500 on click.
 */
class YouTubeOAuthService
{
    /** Read-only access to the signed-in user's channel and videos. */
    public const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

    /**
     * ML2 expanded scope (media-kit-demographics-spec.md §1): the YouTube
     * Analytics API scope that unlocks viewerPercentage by ageGroup/gender
     * and geography. Verified against the v2 docs at build time (dimensions
     * ageGroup/gender + metric viewerPercentage; endpoint
     * youtubeanalytics.googleapis.com/v2/reports, ids=channel==MINE).
     * Connections created BEFORE this scope was added can read videos but
     * 403 on demographics — the UI offers a reconnect, which re-consents
     * with both scopes.
     */
    public const ANALYTICS_SCOPE = 'https://www.googleapis.com/auth/yt-analytics.readonly';

    public function isConfigured(): bool
    {
        return filled(config('services.youtube.client_id'))
            && filled(config('services.youtube.client_secret'));
    }

    /**
     * The exact redirect URI that must be registered in the Google Cloud
     * OAuth client. Derived from the route so the two can never drift.
     */
    public function redirectUri(): string
    {
        return (string) config('services.youtube.redirect')
            ?: route('dashboard.user.analytics.youtube.callback');
    }

    /**
     * Send the user to Google's consent screen.
     *
     * access_type=offline + prompt=consent is what makes Google return a
     * refresh token; without both, a returning user gets an access token
     * that dies in an hour and no way to renew it.
     */
    public function redirect(): RedirectResponse
    {
        return $this->provider()
            ->scopes([self::SCOPE, self::ANALYTICS_SCOPE])
            ->with(['access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect();
    }

    /**
     * Exchange the authorization code for tokens and persist the connection.
     * Returns null (and logs) on any failure — the caller shows a flash error.
     */
    public function handleCallback(User $user): ?YoutubeConnection
    {
        try {
            $socialUser = $this->provider()->user();
        } catch (\Throwable $e) {
            Log::warning('YouTube OAuth callback failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);

            return null;
        }

        $accessToken = $socialUser->token ?? null;

        if (blank($accessToken)) {
            Log::warning('YouTube OAuth callback returned no access token', ['user_id' => $user->id]);

            return null;
        }

        $existing = YoutubeConnection::query()->where('user_id', $user->id)->first();

        // Google only re-issues a refresh token when it feels like it; keep
        // the one we already hold if this exchange did not include a new one.
        $refreshToken = filled($socialUser->refreshToken ?? null)
            ? $socialUser->refreshToken
            : ($existing?->refresh_token);

        $expiresIn = (int) ($socialUser->expiresIn ?? 3600);

        $connection = YoutubeConnection::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'access_token'     => $accessToken,
                'refresh_token'    => $refreshToken,
                'token_expires_at' => now()->addSeconds($expiresIn > 0 ? $expiresIn : 3600),
                'connected_at'     => now(),
            ],
        );

        return $connection;
    }

    /**
     * Exchange a refresh token for a fresh access token.
     *
     * @return array{access_token: string, expires_in: int}|null
     */
    public function refresh(string $refreshToken): ?array
    {
        try {
            $token = $this->provider()->refreshToken($refreshToken);
        } catch (\Throwable $e) {
            Log::warning('YouTube token refresh failed', ['message' => $e->getMessage()]);

            return null;
        }

        if (blank($token->token ?? null)) {
            return null;
        }

        return [
            'access_token' => (string) $token->token,
            'expires_in'   => (int) ($token->expiresIn ?? 3600),
        ];
    }

    private function provider(): GoogleProvider
    {
        /** @var GoogleProvider $provider */
        $provider = Socialite::buildProvider(GoogleProvider::class, [
            'client_id'     => config('services.youtube.client_id'),
            'client_secret' => config('services.youtube.client_secret'),
            'redirect'      => $this->redirectUri(),
        ]);

        return $provider;
    }
}
