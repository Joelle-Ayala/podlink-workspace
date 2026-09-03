<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Concerns\ResolvesMcpUser;
use App\Models\EpisodeTranscript;
use App\Models\PodcastShow;

/**
 * MCP tool: search_transcripts (v1.1, scoping amendment 2026-08-25)
 *
 * Full-text search across the authenticated user's OWN episode transcripts.
 * Input is a query string only — the show is resolved from the token
 * (MCP-SERVER-SCOPING.md §2: no identity parameters, ever), and the search
 * runs against the FULLTEXT index on episode_transcripts.body.
 *
 * GATE TIER (growth-research criterion 1): transcript READS are free — the
 * metered step was creating the transcript. Exports/write stay paid-gated.
 */
class SearchTranscriptsTool
{
    use ResolvesMcpUser;

    private const DEFAULT_LIMIT = 5;

    private const MAX_LIMIT = 20;

    private const QUERY_MAX_CHARS = 200;

    private const SNIPPET_CONTEXT = 240;

    /**
     * @param  string  $query  What to search for across your episode transcripts.
     * @param  int  $limit  Max matching episodes to return (1-20).
     * @return array<string, mixed>
     */
    public function __invoke(string $query, int $limit = self::DEFAULT_LIMIT): array
    {
        $user = $this->mcpUser();

        $limit = max(1, min(self::MAX_LIMIT, $limit));
        $query = trim(mb_substr($query, 0, self::QUERY_MAX_CHARS));

        if ($query === '') {
            return ['status' => 'error', 'message' => 'The search query is empty.'];
        }

        // TENANCY: user id comes from the authenticated request, never a param.
        $show = PodcastShow::query()->where('user_id', $user->id)->first();

        if ($show === null) {
            return [
                'connected' => false,
                'status' => 'no_show_connected',
                'message' => 'No podcast is connected to this Podlink account yet. Connect an RSS feed in the Podlink dashboard first.',
                'setup_url' => route('dashboard.user.analytics.index'),
            ];
        }

        $base = EpisodeTranscript::query()
            ->where('status', EpisodeTranscript::STATUS_COMPLETED)
            ->whereHas('episode', fn ($q) => $q->where('podcast_show_id', $show->id))
            ->with('episode');

        if ((clone $base)->count() === 0) {
            return [
                'connected' => true,
                'status' => 'no_transcripts',
                'message' => 'No episodes are transcribed yet. Press Transcribe on an episode in the Podlink dashboard — each transcript is created once and stays searchable.',
                'setup_url' => route('dashboard.user.analytics.index'),
            ];
        }

        $matches = (clone $base)
            ->whereFullText('body', $query)
            ->limit($limit)
            ->get();

        // FULLTEXT natural-language mode misses very short or stop-worded
        // queries — fall back to a plain substring scan before saying "none".
        if ($matches->isEmpty()) {
            $matches = (clone $base)
                ->where('body', 'like', '%' . addcslashes($query, '%_\\') . '%')
                ->limit($limit)
                ->get();
        }

        return [
            'connected' => true,
            'status' => 'ok',
            'query' => $query,
            'count' => $matches->count(),
            'results' => $matches->map(function (EpisodeTranscript $transcript) use ($query): array {
                $episode = $transcript->episode;

                return [
                    'episode_ref' => (string) $episode?->id,
                    'episode_title' => $this->safeText($episode?->title),
                    'pub_date' => $episode?->pub_date?->toDateString(),
                    // Transcript text is spoken third-party content — same
                    // R5 sanitation as feed metadata, larger budget.
                    'snippet' => $this->safeText($this->snippet((string) $transcript->body, $query), 600),
                ];
            })->values()->all(),
            'hint' => $matches->isEmpty()
                ? 'No transcribed episode contains that phrase. Only transcribed episodes are searchable.'
                : 'Use get_transcript with an episode_ref to read the full transcript.',
        ];
    }

    /** A window of text around the first occurrence of the query (or the opening lines). */
    private function snippet(string $body, string $query): string
    {
        $pos = mb_stripos($body, $query);

        if ($pos === false) {
            // Natural-language match without a literal hit — first word wins.
            $firstWord = preg_split('/\s+/u', $query, 2)[0] ?? '';
            $pos = $firstWord !== '' ? (mb_stripos($body, $firstWord) ?: 0) : 0;
            $pos = $pos === false ? 0 : $pos;
        }

        $start = max(0, $pos - self::SNIPPET_CONTEXT);
        $window = mb_substr($body, $start, self::SNIPPET_CONTEXT * 2 + mb_strlen($query));

        return ($start > 0 ? '…' : '') . trim($window) . '…';
    }
}
