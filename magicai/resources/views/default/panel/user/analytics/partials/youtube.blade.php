{{--
    YouTube analytics (ML2-lite).

    Three states, in order of readiness:
      1. Unconfigured — no OAuth credentials in the environment. Shows a
         tasteful "setup in progress" card, never a button that would error.
      2. Not connected — Connect YouTube button + one line of why.
      3. Connected — channel name, disconnect, per-video views newest-first.
--}}

@php
    $youtubeVideoCount = is_countable($youtubeVideos) ? count($youtubeVideos) : 0;
    $youtubeTotalViews = collect($youtubeVideos)->sum(fn ($video) => (int) ($video['views'] ?? 0));
@endphp

@if (!$youtubeConfigured)
    {{-- State 1: env gate --}}
    <x-card class:body="flex items-start gap-4 p-5">
        <div class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
            <x-tabler-brand-youtube class="size-5 text-primary" />
        </div>
        <div class="min-w-0 grow">
            <div class="flex flex-wrap items-center gap-2">
                <h3 class="m-0 text-sm font-semibold text-heading-foreground">
                    {{ __('YouTube analytics — setup in progress') }}
                </h3>
                <span class="shrink-0 rounded-full bg-foreground/5 px-2.5 py-1 text-3xs font-medium text-foreground/60">
                    {{ __('Coming soon') }}
                </span>
            </div>
            <p class="m-0 mt-1 text-2xs text-foreground/60">
                {{ __('Downloads only tell half the story. Soon you\'ll connect your YouTube channel here and see per-episode video views next to your download numbers — the full picture of an episode, in one place.') }}
            </p>
        </div>
    </x-card>
@elseif ($youtubeConnection === null)
    {{-- State 2: configured, not connected --}}
    <x-card class:body="flex flex-wrap items-center gap-4 p-5">
        <div class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
            <x-tabler-brand-youtube class="size-5 text-primary" />
        </div>
        <div class="min-w-0 grow">
            <h3 class="m-0 text-sm font-semibold text-heading-foreground">
                {{ __('Add your YouTube views') }}
            </h3>
            <p class="m-0 text-2xs text-foreground/60">
                {{ __('Connect your channel to see video views for each episode alongside your downloads. Read-only — we never post anything.') }}
            </p>
        </div>
        <x-button
            tag="a"
            href="{{ route('dashboard.user.analytics.youtube.connect') }}"
            class="shrink-0"
        >
            <x-tabler-brand-youtube class="size-4" />
            {{ __('Connect YouTube') }}
        </x-button>
    </x-card>
@else
    {{-- State 3: connected --}}
    <x-card class:body="p-5">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex min-w-0 items-center gap-3">
                <div class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                    <x-tabler-brand-youtube class="size-5 text-primary" />
                </div>
                <div class="min-w-0">
                    <p class="m-0 truncate text-2xs font-semibold text-heading-foreground">
                        {{ $youtubeConnection->channel_title ?? __('Your YouTube channel') }}
                    </p>
                    <p class="m-0 text-3xs text-foreground/60">
                        {{ __(':count videos', ['count' => number_format($youtubeVideoCount)]) }}
                        @if ($youtubeTotalViews > 0)
                            · {{ __(':views total views', ['views' => number_format($youtubeTotalViews)]) }}
                        @endif
                    </p>
                </div>
            </div>

            <form
                action="{{ route('dashboard.user.analytics.youtube.disconnect') }}"
                method="POST"
                class="shrink-0"
            >
                @csrf
                <x-button variant="outline" size="sm" type="submit">
                    {{ __('Disconnect') }}
                </x-button>
            </form>
        </div>

        @if ($youtubeVideoCount > 0)
            <div class="mt-4 overflow-x-auto">
                <table class="w-full border-collapse text-start">
                    <thead>
                        <tr class="border-b">
                            <th class="py-2 text-start text-3xs font-medium uppercase tracking-wide text-foreground/50">
                                {{ __('Video') }}
                            </th>
                            <th class="py-2 text-start text-3xs font-medium uppercase tracking-wide text-foreground/50">
                                {{ __('Published') }}
                            </th>
                            <th class="py-2 text-end text-3xs font-medium uppercase tracking-wide text-foreground/50">
                                {{ __('Views') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($youtubeVideos as $video)
                            <tr class="border-b last:border-b-0">
                                <td class="max-w-xs truncate py-2.5 pe-4 text-2xs font-medium text-heading-foreground">
                                    {{ $video['title'] ?? __('Untitled video') }}
                                </td>
                                <td class="whitespace-nowrap py-2.5 pe-4 text-3xs text-foreground/50">
                                    {{ $formatDate($video['published_at'] ?? null) ?? '—' }}
                                </td>
                                <td class="whitespace-nowrap py-2.5 text-end text-2xs text-heading-foreground">
                                    {{ $video['views'] !== null ? number_format($video['views']) : '—' }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <p class="m-0 mt-4 text-2xs text-foreground/60">
                {{ __('No videos found on this channel yet. New uploads appear here within about an hour.') }}
            </p>
        @endif
    </x-card>

    {{-- ML2 expanded: channel audience demographics (age/gender/geo, 90d). --}}
    @php $demo = $youtubeDemographics ?? null; @endphp
    @if (is_array($demo))
        <x-card class:body="p-5">
            <h3 class="m-0 text-sm font-semibold text-heading-foreground">
                {{ __('YouTube audience demographics') }}
            </h3>
            @if (($demo['status'] ?? null) === 'needs_reconnect')
                <p class="m-0 mt-1 text-2xs text-foreground/60">
                    {{ __('Your YouTube connection predates audience insights. Reconnect once to grant the read-only analytics permission — nothing else changes.') }}
                </p>
                <a href="{{ route('dashboard.user.analytics.youtube.connect') }}"
                    class="mt-3 inline-flex items-center rounded-full border border-primary px-4 py-2 text-2xs font-medium text-primary">
                    {{ __('Reconnect to enable demographics') }}
                </a>
            @elseif (($demo['status'] ?? null) === 'ok')
                <p class="m-0 mt-1 text-3xs text-foreground/50">
                    {{ __('Share of watch audience, last :days days — from your channel\'s own YouTube Analytics, read-only.', ['days' => $demo['window_days'] ?? 90]) }}
                </p>
                <div class="mt-4 grid gap-6 sm:grid-cols-2">
                    <div>
                        <p class="m-0 text-3xs font-semibold uppercase tracking-wide text-foreground/40">{{ __('By age') }}</p>
                        <ul class="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                            @foreach (($demo['by_age'] ?? []) as $age => $percent)
                                <li class="flex items-center gap-2 text-2xs">
                                    <span class="w-14 shrink-0 text-foreground/70">{{ $age }}</span>
                                    <span class="h-2 rounded-full bg-primary/70" style="width: {{ min(100, max(2, $percent)) }}%"></span>
                                    <span class="shrink-0 tabular-nums text-foreground/60">{{ $percent }}%</span>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <div>
                        <p class="m-0 text-3xs font-semibold uppercase tracking-wide text-foreground/40">{{ __('By gender') }}</p>
                        <ul class="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
                            @foreach (($demo['by_gender'] ?? []) as $gender => $percent)
                                <li class="flex items-center justify-between gap-2 text-2xs">
                                    <span class="text-foreground/70">{{ ucfirst(str_replace('_', ' ', $gender)) }}</span>
                                    <span class="tabular-nums text-foreground/60">{{ $percent }}%</span>
                                </li>
                            @endforeach
                        </ul>
                        @if (filled($demo['top_countries'] ?? []))
                            <p class="m-0 mt-4 text-3xs font-semibold uppercase tracking-wide text-foreground/40">{{ __('Top countries (views)') }}</p>
                            <ul class="m-0 mt-2 flex list-none flex-col gap-1 p-0">
                                @foreach (array_slice($demo['top_countries'], 0, 5) as $row)
                                    <li class="flex items-center justify-between gap-2 text-2xs">
                                        <span class="text-foreground/70">{{ $row['country'] }}</span>
                                        <span class="tabular-nums text-foreground/60">{{ number_format($row['views']) }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </div>
                </div>
            @else
                <p class="m-0 mt-1 text-2xs text-foreground/60">
                    {{ __('No demographics available yet — YouTube reports audience data once a channel has enough recent watch activity. It appears here automatically when it does.') }}
                </p>
            @endif
        </x-card>
    @endif
@endif
