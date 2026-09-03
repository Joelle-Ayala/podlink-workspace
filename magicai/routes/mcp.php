<?php

declare(strict_types=1);

use App\Mcp\Tools\GetPodlinkPageTool;
use App\Mcp\Tools\GetShowOverviewTool;
use App\Mcp\Tools\GetTopAppsTool;
use App\Mcp\Tools\GetTranscriptTool;
use App\Mcp\Tools\ListEpisodesTool;
use App\Mcp\Tools\SearchTranscriptsTool;
use PhpMcp\Laravel\Facades\Mcp;

/*
|--------------------------------------------------------------------------
| Podlink MCP elements (ML2.5 — v1, read-only analytics)
|--------------------------------------------------------------------------
|
| This file is loaded by php-mcp/laravel (config/mcp.php ->
| discovery.definitions_file). Attribute-based auto-discovery is switched OFF
| in config/mcp.php on purpose, so THIS FILE IS THE COMPLETE TOOL SURFACE of
| the Podlink MCP server. If a tool is not listed here, it does not exist.
|
| That is deliberate: MCP-SERVER-SCOPING.md R1 (multi-tenant leakage) is the
| highest-severity risk in this feature, and its mitigation is "code review of
| every tool for user scoping". A single, short, exhaustive list makes that
| review possible in one screen.
|
| NON-NEGOTIABLE RULE FOR ANYTHING ADDED BELOW:
|   No tool accepts a user id, email, handle, show uuid, or any other identity
|   parameter. Every tool resolves its subject from the authenticated request
|   via App\Mcp\Concerns\ResolvesMcpUser. Reviewers: if you see an identity
|   field in an inputSchema here, reject the change.
|
| v1.1 transcript tools (search_transcripts, get_transcript) are BUILT
| (2026-09-01, pipeline landed). Gate tier: transcript READS are free — the
| metered step was creating the transcript. `episode_ref` is a content
| locator resolved strictly inside the token's own show, not an identity
| parameter. v1.1 get_page_stats and v1.2 (generate_content, list_templates)
| remain NOT built — do not add them without their gating work.
|
*/

/** Empty input schema for the user-scoped, zero-argument tools. */
$noInput = [
    'type' => 'object',
    'properties' => new stdClass(),
    'additionalProperties' => false,
];

/**
 * Annotations (MCP ToolAnnotations, protocol 2025-03-26+): every v1 tool is
 * read-only by design (the file-header rule), so readOnlyHint is true across
 * the board and openWorldHint is false — tools only touch Podlink's own data
 * for the authenticated account. Declaring it lets clients (claude.ai shows
 * these) skip write-confirmation prompts and mark the connector as safe.
 */
$readOnly = static fn (string $title) => \PhpMcp\Schema\ToolAnnotations::make(
    title: $title,
    readOnlyHint: true,
    openWorldHint: false,
);

Mcp::tool(GetShowOverviewTool::class)
    ->name('get_show_overview')
    ->description(
        'Get an overview of the signed-in Podlink user\'s connected podcast: show title, RSS feed URL, '
        . 'whether the OP3 download-tracking prefix is live on the feed, their public Podlink page URL, '
        . 'and download stats (monthly downloads, weekly average, weeks measured). '
        . 'Returns a structured "not connected" state instead of numbers when no show is connected '
        . 'or OP3 has no data yet.'
    )
    ->annotations($readOnly('Show overview'))
    ->inputSchema($noInput);

Mcp::tool(GetTopAppsTool::class)
    ->name('get_top_apps')
    ->description(
        'Get the signed-in Podlink user\'s podcast downloads broken down by listening app '
        . '(Apple Podcasts, Spotify, Overcast, ...) over the last three calendar months: absolute '
        . 'download counts plus each app\'s percentage share, highest first.'
    )
    ->annotations($readOnly('Top listening apps'))
    ->inputSchema($noInput);

Mcp::tool(ListEpisodesTool::class)
    ->name('list_episodes')
    ->description(
        'List the signed-in Podlink user\'s most recent podcast episodes (newest first) with id, '
        . 'title and publication date.'
    )
    ->annotations($readOnly('Recent episodes'))
    ->inputSchema([
        'type' => 'object',
        'properties' => [
            'limit' => [
                'type' => 'integer',
                'description' => 'How many episodes to return, newest first.',
                'minimum' => 1,
                'maximum' => 50,
                'default' => 20,
            ],
        ],
        'required' => [],
        'additionalProperties' => false,
    ]);

Mcp::tool(GetPodlinkPageTool::class)
    ->name('get_podlink_page')
    ->description(
        'Get the public URL of the signed-in Podlink user\'s Podlink page, plus the dashboard URL '
        . 'for editing it.'
    )
    ->annotations($readOnly('Podlink page'))
    ->inputSchema($noInput);

Mcp::tool(SearchTranscriptsTool::class)
    ->name('search_transcripts')
    ->description(
        'Search the signed-in Podlink user\'s OWN episode transcripts for a word or phrase. '
        . 'Returns matching episodes with a text snippet around the match and an episode_ref '
        . 'usable with get_transcript. Only episodes the user has transcribed are searchable; '
        . 'a structured no_transcripts state explains how to transcribe when none exist.'
    )
    ->annotations($readOnly('Search your transcripts'))
    ->inputSchema([
        'type' => 'object',
        'properties' => [
            'query' => [
                'type' => 'string',
                'description' => 'The word or phrase to search for across episode transcripts.',
                'minLength' => 1,
                'maxLength' => 200,
            ],
            'limit' => [
                'type' => 'integer',
                'description' => 'Max matching episodes to return.',
                'minimum' => 1,
                'maximum' => 20,
                'default' => 5,
            ],
        ],
        'required' => ['query'],
        'additionalProperties' => false,
    ]);

Mcp::tool(GetTranscriptTool::class)
    ->name('get_transcript')
    ->description(
        'Get the full transcript of one of the signed-in Podlink user\'s OWN episodes, by the '
        . 'episode_ref returned from list_episodes or search_transcripts. Long transcripts are '
        . 'returned in parts; the response says how many parts exist. Episodes that are not '
        . 'transcribed yet return a structured state explaining how to transcribe them.'
    )
    ->annotations($readOnly('Get an episode transcript'))
    ->inputSchema([
        'type' => 'object',
        'properties' => [
            'episode_ref' => [
                'type' => 'string',
                'description' => 'The episode id from list_episodes or search_transcripts. Refers only to episodes on your own show.',
                'minLength' => 1,
                'maxLength' => 200,
            ],
            'part' => [
                'type' => 'integer',
                'description' => 'Which part of a long transcript to return, starting at 1.',
                'minimum' => 1,
                'default' => 1,
            ],
        ],
        'required' => ['episode_ref'],
        'additionalProperties' => false,
    ]);
