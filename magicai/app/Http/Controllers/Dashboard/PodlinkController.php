<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PodlinkController extends Controller
{
    /**
     * Redirect the authenticated user to their Podlink page editor (Biolink)
     * using Biolink's built-in SSO endpoint. Biolink creates the user on the
     * free plan if they don't exist yet, then returns a one-time magic
     * login URL that we redirect the browser to.
     */
    public function redirect()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $biolinkBaseUrl = rtrim(config('services.biolink.base_url'), '/');
        $biolinkApiKey = config('services.biolink.admin_api_key');

        if (empty($biolinkBaseUrl) || empty($biolinkApiKey)) {
            Log::error('Biolink SSO is not configured', ['user_id' => $user->id]);

            return redirect()
                ->route('dashboard.index')
                ->with(['message' => __('Your Podlink page is not available right now. Please try again later.'), 'type' => 'error']);
        }

        try {
            $response = Http::withToken($biolinkApiKey)
                ->timeout(10)
                ->post($biolinkBaseUrl . '/admin-api/sso/login', [
                    'email'    => $user->email,
                    'name'     => trim($user->fullName()),
                    'redirect' => 'dashboard',
                ]);

            if ($response->successful() && filled($response->json('url'))) {
                return redirect()->away($response->json('url'));
            }

            Log::error('Biolink SSO failed', [
                'status'  => $response->status(),
                'body'    => $response->body(),
                'user_id' => $user->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Biolink SSO exception', [
                'message' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
        }

        return redirect()
            ->route('dashboard.index')
            ->with(['message' => __('Could not connect to your Podlink page. Please try again.'), 'type' => 'error']);
    }
}
