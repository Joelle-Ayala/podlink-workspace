@extends('panel.layout.app', ['disable_tblr' => true])
@section('title', __('Podcast Analytics'))
@section('titlebar_pretitle', '')
@section('titlebar_subtitle', __('Download stats for your show, measured by the open OP3 prefix.'))

@section('content')
    @php
        $hasShow = $show !== null;
        $hasOp3Show = $hasShow && filled($show->op3_show_uuid);
        $hasAnyData = filled($downloads) || filled($topApps);

        $formatDate = static function ($value) {
            try {
                return $value ? \Carbon\Carbon::parse($value)->format('M j, Y') : null;
            } catch (\Exception $e) {
                return null;
            }
        };

        // Episodes come from the DB now (App\Models\Episode), with a graceful
        // fallback to OP3-reported arrays — data_get() reads both shapes.
        $hasEpisodes = filled($episodes) && count($episodes) > 0;
        $youtubeConnected = $youtubeConfigured && $youtubeConnection !== null;
    @endphp

    <div class="flex flex-col gap-6 py-10">

        @if (!$op3Configured && Auth::user()->isAdmin())
            {{-- Admin-only: token missing, nothing will load. Users never see vendor plumbing. --}}
            <x-card class:body="flex items-center gap-3 p-4">
                <x-tabler-alert-triangle class="size-5 shrink-0 text-primary" />
                <p class="m-0 text-2xs">
                    {{ __('Analytics is not fully configured: the OP3 API token is missing. Set OP3_API_TOKEN in the environment to enable download stats.') }}
                </p>
            </x-card>
        @endif

        @if (!$hasShow)
            {{-- State 1: nothing connected yet --}}
            <x-card class:body="p-8">
                <div class="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
                    <div class="grid size-16 place-items-center rounded-full bg-primary/10">
                        <x-tabler-chart-bar class="size-8 text-primary" />
                    </div>
                    <h2 class="m-0 text-lg font-semibold text-heading-foreground">
                        {{ __('Connect your podcast') }}
                    </h2>
                    <p class="m-0 text-2xs text-foreground/70">
                        {{ __('Paste your RSS feed URL and we\'ll find your show. Download stats come from OP3 — a free, open prefix you add once in your podcast host. No migration, no new host, your feed stays exactly where it is.') }}
                    </p>

                    <form
                        class="flex w-full flex-col gap-3 sm:flex-row sm:items-end"
                        action="{{ route('dashboard.user.analytics.connect') }}"
                        method="POST"
                    >
                        @csrf
                        <div class="grow text-start">
                            <x-forms.input
                                type="url"
                                label="{{ __('RSS Feed URL') }}"
                                name="rss_feed_url"
                                placeholder="https://feeds.example.com/your-show"
                                value="{{ old('rss_feed_url') }}"
                                required
                            />
                        </div>
                        <x-button type="submit">
                            {{ __('Connect') }}
                        </x-button>
                    </form>

                    @error('rss_feed_url')
                        <p class="m-0 text-2xs text-red-500">{{ $message }}</p>
                    @enderror
                </div>
            </x-card>
        @else
            {{-- Connected show bar + change-feed form --}}
            <x-card
                class:body="flex flex-wrap items-center justify-between gap-4 p-4"
                x-data="{ editing: false }"
            >
                <div class="flex min-w-0 items-center gap-3">
                    <div class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                        <x-tabler-rss class="size-5 text-primary" />
                    </div>
                    <div class="min-w-0">
                        <p class="m-0 truncate text-2xs font-semibold text-heading-foreground">
                            {{ $showTitle ?? __('Your podcast') }}
                        </p>
                        <p class="m-0 truncate text-3xs text-foreground/60">
                            {{ $show->rss_feed_url }}
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    @if ($hasOp3Show)
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-3xs font-medium text-primary">
                            <span class="inline-flex size-1.5 rounded-full bg-primary"></span>
                            {{ __('Measuring downloads') }}
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-3xs font-medium text-foreground/70">
                            <span class="inline-flex size-1.5 rounded-full bg-foreground/40"></span>
                            {{ __('Waiting for data') }}
                        </span>
                    @endif
                    <x-button
                        variant="outline"
                        size="sm"
                        type="button"
                        @click.prevent="editing = !editing"
                    >
                        {{ __('Change feed') }}
                    </x-button>
                </div>

                <form
                    class="flex w-full flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end"
                    action="{{ route('dashboard.user.analytics.connect') }}"
                    method="POST"
                    x-show="editing"
                    x-collapse
                    x-cloak
                >
                    @csrf
                    <div class="grow">
                        <x-forms.input
                            type="url"
                            label="{{ __('RSS Feed URL') }}"
                            name="rss_feed_url"
                            value="{{ old('rss_feed_url', $show->rss_feed_url) }}"
                            required
                        />
                    </div>
                    <x-button type="submit">
                        {{ __('Save & re-check') }}
                    </x-button>
                </form>

                @error('rss_feed_url')
                    <p class="m-0 w-full text-2xs text-red-500">{{ $message }}</p>
                @enderror
            </x-card>

            @if (!$prefixDetected)
                {{-- Onboarding callout: prefix not on the feed's enclosure URLs yet --}}
                <x-card
                    class="border-primary/20"
                    class:body="p-6"
                    x-data="{
                        copied: false,
                        selectedHost: '',
                        copyPrefix() {
                            navigator.clipboard?.writeText('{{ $op3Prefix }}').then(() => {
                                this.copied = true;
                                setTimeout(() => this.copied = false, 2000);
                            });
                        }
                    }"
                >
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <div class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10">
                                <x-tabler-plug class="size-5 text-primary" />
                            </div>
                            <div>
                                <h3 class="m-0 text-sm font-semibold text-heading-foreground">
                                    {{ __('One step left: add the analytics prefix') }}
                                </h3>
                                <p class="m-0 text-2xs text-foreground/60">
                                    {{ __('We haven\'t spotted the prefix on your episodes yet. It\'s a one-time, copy-paste setting in your podcast host.') }}
                                </p>
                            </div>
                        </div>

                        <ol class="m-0 flex list-none flex-col gap-3 p-0">
                            <li class="flex items-start gap-3">
                                <span class="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-3xs font-semibold text-primary">1</span>
                                <div class="grow">
                                    <p class="m-0 text-2xs font-medium text-heading-foreground">{{ __('Copy this prefix') }}</p>
                                    <div class="mt-1.5 flex items-center gap-2">
                                        <code class="grow overflow-x-auto whitespace-nowrap rounded-lg border bg-foreground/5 px-3 py-2 text-2xs">{{ $op3Prefix }}</code>
                                        <x-button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            @click.prevent="copyPrefix()"
                                        >
                                            <span x-show="!copied">{{ __('Copy') }}</span>
                                            <span x-show="copied" x-cloak>{{ __('Copied!') }}</span>
                                        </x-button>
                                    </div>
                                </div>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-3xs font-semibold text-primary">2</span>
                                <div class="grow">
                                    <p class="m-0 text-2xs text-foreground/80">
                                        {{ __('Paste it into your podcast host\'s "analytics prefix" (sometimes "tracking prefix") setting. Pick your host for exact steps:') }}
                                    </p>

                                    <div class="mt-2 max-w-xs">
                                        <x-form.select
                                            x-model="selectedHost"
                                            size="sm"
                                        >
                                            <option value="">{{ __('— Select your host —') }}</option>
                                            @foreach ($hosts as $key => $host)
                                                <option value="{{ $key }}">{{ $host['name'] }}</option>
                                            @endforeach
                                        </x-form.select>
                                    </div>

                                    @foreach ($hosts as $key => $host)
                                        <div
                                            class="mt-3 rounded-lg border bg-foreground/[3%] p-3"
                                            x-show="selectedHost === '{{ $key }}'"
                                            x-cloak
                                        >
                                            <ol class="m-0 flex list-none flex-col gap-1.5 p-0">
                                                @foreach ($host['steps'] as $i => $step)
                                                    <li class="flex gap-2 text-2xs text-foreground/80">
                                                        <span class="shrink-0 font-medium text-primary">{{ $i + 1 }}.</span>
                                                        <span>{{ $step }}</span>
                                                    </li>
                                                @endforeach
                                            </ol>
                                            @isset($host['note'])
                                                <p class="m-0 mt-2 text-3xs text-foreground/60">
                                                    {{ $host['note'] }}
                                                </p>
                                            @endisset
                                        </div>
                                    @endforeach
                                </div>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-3xs font-semibold text-primary">3</span>
                                <p class="m-0 text-2xs text-foreground/80">
                                    {{ __('That\'s it. Come back here after your next episode goes out — stats appear as new downloads happen.') }}
                                </p>
                            </li>
                        </ol>

                        <div class="rounded-lg border bg-foreground/[3%] p-3">
                            <p class="m-0 text-3xs text-foreground/60">
                                {{ __('Two things to know: stats start from the moment you add the prefix (no history before that), and you may see a brief one-time spike right after — apps re-downloading episodes because the URL changed. Both are normal.') }}
                            </p>
                        </div>
                    </div>
                </x-card>
            @endif

            @if (!$hasOp3Show)
                {{-- Connected, but OP3 doesn't know the show yet --}}
                <x-card class:body="p-8">
                    <x-empty-state
                        icon="tabler-hourglass"
                        title="{{ __('No download data yet') }}"
                        description="{{ $prefixDetected
                            ? __('Your prefix is in place — nice. OP3 picks up your show after the first prefixed downloads come in. Check back within a day or two.')
                            : __('Once the prefix is added and your listeners start downloading, your stats will show up here automatically.') }}"
                    />
                </x-card>
            @else
                {{-- Downloads summary --}}
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <x-card class:body="p-5">
                        <p class="m-0 text-3xs font-medium uppercase tracking-wide text-foreground/50">
                            {{ __('Downloads — last 30 days') }}
                        </p>
                        <p class="m-0 mt-1 text-2xl font-semibold text-heading-foreground">
                            {{ $downloads && $downloads['monthly_downloads'] !== null ? number_format($downloads['monthly_downloads']) : '—' }}
                        </p>
                    </x-card>
                    <x-card class:body="p-5">
                        <p class="m-0 text-3xs font-medium uppercase tracking-wide text-foreground/50">
                            {{ __('Weekly average') }}
                        </p>
                        <p class="m-0 mt-1 text-2xl font-semibold text-heading-foreground">
                            {{ $downloads && $downloads['weekly_avg_downloads'] !== null ? number_format($downloads['weekly_avg_downloads']) : '—' }}
                        </p>
                    </x-card>
                    <x-card class:body="p-5">
                        <p class="m-0 text-3xs font-medium uppercase tracking-wide text-foreground/50">
                            {{ __('Weeks measured') }}
                        </p>
                        <p class="m-0 mt-1 text-2xl font-semibold text-heading-foreground">
                            {{ $downloads && $downloads['num_weeks'] !== null ? number_format($downloads['num_weeks']) : '—' }}
                        </p>
                    </x-card>
                </div>

                @if (!$hasAnyData)
                    <x-card class:body="p-8">
                        <x-empty-state
                            icon="tabler-chart-bar"
                            title="{{ __('Stats are warming up') }}"
                            description="{{ __('OP3 knows your show but hasn\'t reported numbers yet. New downloads appear here within about an hour.') }}"
                        />
                    </x-card>
                @endif
            @endif

            @php
                // Two columns only when the top-apps card is actually there,
                // otherwise the episodes list is stranded in half the width.
                $showTopApps = $hasOp3Show && $hasAnyData;
            @endphp
            <div @class(['grid grid-cols-1 gap-5', 'lg:grid-cols-2' => $showTopApps])>
                {{-- Top apps --}}
                @if ($showTopApps)
                    <x-card class:body="p-5">
                        <h3 class="m-0 mb-4 text-sm font-semibold text-heading-foreground">
                            {{ __('Top listening apps') }}
                        </h3>
                        @if (filled($topApps))
                            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                                @foreach ($topApps as $app)
                                    <li>
                                        <div class="mb-1 flex items-center justify-between text-2xs">
                                            <span class="font-medium text-heading-foreground">{{ $app['app'] }}</span>
                                            <span class="text-foreground/60">{{ $app['share'] }}%</span>
                                        </div>
                                        <div class="h-1.5 overflow-hidden rounded-full bg-foreground/5">
                                            <div
                                                class="h-full rounded-full bg-primary"
                                                style="width: {{ min(100, max(0, $app['share'])) }}%"
                                            ></div>
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                        @else
                            <p class="m-0 text-2xs text-foreground/60">
                                {{ __('No app data yet — this fills in as downloads come through the prefix.') }}
                            </p>
                        @endif
                    </x-card>
                @endif

                {{-- Recent episodes — read from the episodes table, kept in
                     sync from the RSS feed (hourly, on page load). --}}
                <x-card class:body="p-5">
                    <div class="mb-4 flex items-center justify-between gap-3">
                        <h3 class="m-0 text-sm font-semibold text-heading-foreground">
                            {{ __('Recent episodes') }}
                        </h3>
                        @if ($hasEpisodes && $youtubeConnected)
                            <span class="shrink-0 text-3xs uppercase tracking-wide text-foreground/40">
                                {{ __('YouTube views') }}
                            </span>
                        @endif
                    </div>

                    @if ($hasEpisodes)
                        <ul class="m-0 flex list-none flex-col p-0">
                            @foreach ($episodes as $episode)
                                @php
                                    $episodeVideoId = data_get($episode, 'youtube_video_id');
                                    $episodeViews = $episodeVideoId ? ($youtubeViews[$episodeVideoId] ?? null) : null;
                                @endphp
                                <li class="flex items-center justify-between gap-4 border-b py-2.5 last:border-b-0">
                                    <span class="min-w-0 truncate text-2xs font-medium text-heading-foreground">
                                        {{ data_get($episode, 'title') ?? __('Untitled episode') }}
                                    </span>
                                    <span class="flex shrink-0 items-center gap-3">
                                        @if ($episodeViews !== null)
                                            <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-3xs font-medium text-primary">
                                                <x-tabler-brand-youtube class="size-3" />
                                                {{ number_format($episodeViews) }}
                                            </span>
                                        @endif
                                        <span class="text-3xs text-foreground/50">
                                            {{ $formatDate(data_get($episode, 'pub_date')) ?? '—' }}
                                        </span>
                                    </span>
                                </li>
                            @endforeach
                        </ul>
                    @else
                        <p class="m-0 text-2xs text-foreground/60">
                            {{ __('No episodes yet. We read your episode list straight from your RSS feed — it appears here within an hour of a new episode going out.') }}
                        </p>
                    @endif
                </x-card>
            </div>

            {{-- ── YouTube (ML2-lite) ───────────────────────────────────── --}}
            @include('panel.user.analytics.partials.youtube')
        @endif
    </div>
@endsection
