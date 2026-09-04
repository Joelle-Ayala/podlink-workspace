<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Discovery\ContactCardService;
use App\Services\Discovery\PodcastIndexClient;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Contact-discovery P1 — "Find Shows" (contact-discovery-spec.md §7.1).
 * The FREE layer: no vendors, no credits, no gates beyond the Podcast
 * Index key for search. Two capabilities:
 *   1. Search shows by niche (Podcast Index — inert until the key lands;
 *      the UI says so honestly instead of hiding the feature).
 *   2. Contact card from any pasted feed URL (RSS owner + bounded crawl of
 *      the show's own public site) — works TODAY, keyless.
 * P2 (Snov verification, credit-metered) bolts onto the card's enrich slot.
 */
class DiscoveryController extends Controller
{
    public function index(
        Request $request,
        PodcastIndexClient $index,
        ContactCardService $cards,
    ): View {
        $query = trim((string) $request->query('q', ''));
        $feedUrl = trim((string) $request->query('feed', ''));

        $results = null;
        $searchAttempted = false;

        if ($query !== '' && $index->isConfigured()) {
            $results = $index->searchShows($query);
            $searchAttempted = true;
        }

        $card = null;
        $cardAttempted = false;

        if ($feedUrl !== '' && str_starts_with($feedUrl, 'http')) {
            $card = $cards->card($feedUrl);
            $cardAttempted = true;
        }

        return view('panel.user.discovery.index', [
            'searchConfigured' => $index->isConfigured(),
            'query'            => $query,
            'results'          => $results,
            'searchAttempted'  => $searchAttempted,
            'feedUrl'          => $feedUrl,
            'card'             => $card,
            'cardAttempted'    => $cardAttempted,
        ]);
    }
}
