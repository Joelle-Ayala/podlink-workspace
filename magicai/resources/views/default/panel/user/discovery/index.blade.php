@extends('panel.layout.app', ['disable_tblr' => true])
@section('title', __('Find Shows'))
@section('titlebar_pretitle', '')
@section('titlebar_subtitle', __('Search podcasts by niche and get contact cards — from the shows\' own public feeds and sites.'))

@section('content')
    <div class="flex flex-col gap-6 py-10">

        {{-- Search by niche (Podcast Index; inert-but-honest until the key lands) --}}
        <x-card class:body="p-5">
            <h3 class="m-0 text-sm font-semibold text-heading-foreground">{{ __('Search shows by niche') }}</h3>
            @if ($searchConfigured)
                <form method="GET" action="{{ route('dashboard.user.discovery.index') }}" class="mt-3 flex flex-wrap gap-2">
                    <input type="text" name="q" value="{{ $query }}" maxlength="120"
                        placeholder="{{ __('e.g. women in finance, B2B SaaS, true crime') }}"
                        class="w-full max-w-md rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-2xs" />
                    <button type="submit" class="inline-flex items-center rounded-full border border-primary px-4 py-2 text-2xs font-medium text-primary">
                        {{ __('Search') }}
                    </button>
                </form>
                <p class="m-0 mt-2 text-3xs text-foreground/50">{{ __('Search powered by the Podcast Index.') }}</p>
            @else
                <p class="m-0 mt-2 text-2xs text-foreground/60">
                    {{ __('Search is switching on shortly. Meanwhile, paste any show\'s RSS feed below to get its contact card right now.') }}
                </p>
            @endif

            @if ($searchAttempted)
                @if ($results === null)
                    <p class="m-0 mt-4 text-2xs text-foreground/60">{{ __('Search is temporarily unavailable — try again in a minute.') }}</p>
                @elseif (count($results) === 0)
                    <p class="m-0 mt-4 text-2xs text-foreground/60">{{ __('No shows found for that term. Try a broader niche.') }}</p>
                @else
                    <ul class="m-0 mt-4 flex list-none flex-col p-0">
                        @foreach ($results as $show)
                            <li class="flex flex-wrap items-center justify-between gap-3 border-b py-3 last:border-b-0">
                                <span class="min-w-0">
                                    <span class="block truncate text-2xs font-medium text-heading-foreground">{{ $show['title'] ?? __('Untitled show') }}</span>
                                    <span class="block text-3xs text-foreground/50">
                                        {{ $show['author'] ?? '' }}
                                        @if ($show['episode_count']) · {{ $show['episode_count'] }} {{ __('episodes') }} @endif
                                        @if ($show['last_publish']) · {{ __('last published') }} {{ $show['last_publish'] }} @endif
                                    </span>
                                </span>
                                @if ($show['feed_url'])
                                    <a href="{{ route('dashboard.user.discovery.index', ['feed' => $show['feed_url']]) }}"
                                        class="inline-flex shrink-0 items-center rounded-full border border-primary px-3 py-1 text-3xs font-medium text-primary">
                                        {{ __('Contact card') }}
                                    </a>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                @endif
            @endif
        </x-card>

        {{-- Contact card from a feed URL (works keyless, day one) --}}
        <x-card class:body="p-5">
            <h3 class="m-0 text-sm font-semibold text-heading-foreground">{{ __('Contact card from a feed') }}</h3>
            <p class="m-0 mt-1 text-3xs text-foreground/50">
                {{ __('Read from the show\'s own public RSS feed and website — owner email, visible contact emails, booking links.') }}
            </p>
            <form method="GET" action="{{ route('dashboard.user.discovery.index') }}" class="mt-3 flex flex-wrap gap-2">
                <input type="url" name="feed" value="{{ $feedUrl }}" maxlength="2048"
                    placeholder="https://feeds.example.com/theshow"
                    class="w-full max-w-md rounded-lg border border-foreground/20 bg-transparent px-3 py-2 text-2xs" />
                <button type="submit" class="inline-flex items-center rounded-full border border-primary px-4 py-2 text-2xs font-medium text-primary">
                    {{ __('Get card') }}
                </button>
            </form>

            @if ($cardAttempted)
                @if ($card === null)
                    <p class="m-0 mt-4 text-2xs text-foreground/60">{{ __('Couldn\'t read that feed. Check the URL — it should be the RSS feed itself.') }}</p>
                @else
                    <div class="mt-4 rounded-lg border border-foreground/10 p-4">
                        <p class="m-0 text-2xs font-semibold text-heading-foreground">{{ $card['show_title'] ?? __('Untitled show') }}</p>
                        @if ($card['owner_name'])
                            <p class="m-0 mt-1 text-3xs text-foreground/60">{{ __('Owner') }}: {{ $card['owner_name'] }}</p>
                        @endif
                        @if (count($card['emails']) > 0)
                            <ul class="m-0 mt-3 flex list-none flex-col gap-1 p-0">
                                @foreach ($card['emails'] as $email)
                                    <li class="flex items-center gap-2 text-2xs">
                                        <span class="select-all font-mono">{{ $email['email'] }}</span>
                                        <span class="rounded-full bg-foreground/10 px-2 py-0.5 text-3xs text-foreground/60">{{ str_replace('_', ' ', $email['source']) }}</span>
                                    </li>
                                @endforeach
                            </ul>
                        @else
                            <p class="m-0 mt-3 text-2xs text-foreground/60">{{ __('No public email found in the feed or on the site.') }}</p>
                        @endif
                        @if (count($card['booking_links']) > 0)
                            <p class="m-0 mt-3 text-3xs font-semibold uppercase tracking-wide text-foreground/40">{{ __('Booking links spotted') }}</p>
                            <ul class="m-0 mt-1 flex list-none flex-col gap-1 p-0">
                                @foreach ($card['booking_links'] as $link)
                                    <li class="truncate text-3xs"><a href="{{ $link }}" target="_blank" rel="noopener nofollow" class="text-primary">{{ $link }}</a></li>
                                @endforeach
                            </ul>
                        @endif
                        @if ($card['site_url'])
                            <p class="m-0 mt-3 text-3xs"><a href="{{ $card['site_url'] }}" target="_blank" rel="noopener nofollow" class="text-primary">{{ $card['site_url'] }}</a></p>
                        @endif
                        <p class="m-0 mt-3 text-3xs text-foreground/50">{{ $card['note'] }}</p>
                    </div>
                @endif
            @endif
        </x-card>
    </div>
@endsection
