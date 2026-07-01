<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PodlinkController extends Controller
{
    /**
     * SSO redirect — log the authenticated MagicAI user into their Biolink dashboard.
     *
     * Uses Biolink's built-in AdminApiSSO endpoint (POST /admin-api/sso/login).
     * Creates the Biolink account on first visit, returns a one-time magic login URL.
     * The one-time token is consumed on first use (single-use, expires immediately).
     */
    public function redirect(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $biolinkBaseUrl = config('services.biolink.base_url');
        $biolinkApiKey  = config('services.biolink.admin_api_key');

        if (empty($biolinkBaseUrl) || empty($biolinkApiKey)) {
            Log::error('Podlink SSO: missing BIOLINK_BASE_URL or BIOLINK_ADMIN_API_KEY env vars');

            return redirect()
                ->route('dashboard.index')
                ->with('error', __('Your Podlink page is not configured yet. Please contact support.'));
        }

        try {
            $response = Http::withToken($biolinkApiKey)
                ->timeout(10)
                ->post("{$biolinkBaseUrl}/admin-api/sso/login", [
                    'email'    => $user->email,
                    'name'     => $user->name ?? $user->email,
                    'redirect' => 'dashboard',
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (! empty($data['url'])) {
                    return redirect()->away($data['url']);
                }
            }

            Log::error('Podlink SSO: Biolink returned unexpected response', [
                'status'  => $response->status(),
                'body'    => $response->body(),
                'user_id' => $user->id,
            ]);

        } catch (\Exception $e) {
            Log::error('Podlink SSO: exception calling Biolink', [
                'message' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
        }

        return redirect()
            ->route('dashboard.index')
            ->with('error', __('Could not connect to your Podlink page. Please try again.'));
    }

    /**
     * Sync a user's MagicAI subscription tier to their Biolink plan.
     * Called from subscription webhook or plan-change handler.
     *
     * @param  string  $userEmail
     * @param  string  $magicaiPlanName  'free' | 'pro' | 'creator'
     */
    public function syncPlan(string $userEmail, string $magicaiPlanName): bool
    {
        $planMap = [
            'free'    => 0,
            'pro'     => (int) env('BIOLINK_PRO_PLAN_ID', 1),
            'creator' => (int) env('BIOLINK_CREATOR_PLAN_ID', 2),
        ];

        $biolinkPlanId  = $planMap[$magicaiPlanName] ?? 0;
        $biolinkBaseUrl = config('services.biolink.base_url');
        $biolinkApiKey  = config('services.biolink.admin_api_key');

        // Find the user in Biolink by email
        $usersResponse = Http::withToken($biolinkApiKey)
            ->get("{$biolinkBaseUrl}/admin-api/users", ['email' => $userEmail]);

        if (! $usersResponse->successful()) {
            return false;
        }

        $users = $usersResponse->json('data', []);

        if (empty($users)) {
            return false; // User doesn't exist yet — will be created on first SSO
        }

        $biolinkUserId = $users[0]['id'];

        $updateResponse = Http::withToken($biolinkApiKey)
            ->post("{$biolinkBaseUrl}/admin-api/users/{$biolinkUserId}", [
                'plan_id'              => $biolinkPlanId,
                'plan_expiration_date' => now()->addYear()->format('Y-m-d H:i:s'),
            ]);

        return $updateResponse->successful();
    }

    /**
     * Delete a user from Biolink when they delete their MagicAI account.
     */
    public function deleteUser(string $userEmail): bool
    {
        $biolinkBaseUrl = config('services.biolink.base_url');
        $biolinkApiKey  = config('services.biolink.admin_api_key');

        $response = Http::withToken($biolinkApiKey)
            ->post("{$biolinkBaseUrl}/admin-api/sso/delete", [
                'email' => $userEmail,
            ]);

        return $response->successful();
    }
}
