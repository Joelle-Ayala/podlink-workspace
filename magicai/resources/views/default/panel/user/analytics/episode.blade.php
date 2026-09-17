@extends('panel.layout.app', ['disable_tblr' => true])
@section('title', $episode->title ?? __('Episode'))
@section('titlebar_pretitle', '')
@section('titlebar_subtitle', __('Everything Podlink knows about this episode, in one place.'))

@section('content')
    @php
        $status = $transcript?->status;
        $isCompleted = $status === \App\Models\EpisodeTranscript::STATUS_COMPLETED;
        $inFlight = in_array($status, [\App\Models\EpisodeTranscript::STATUS_PENDING, \App\Models\EpisodeTranscript::STATUS_PROCESSING], true);
    @endphp

    <div class="flex flex-col gap-6 py-10">
        <div>
            <a href="{{ route('dashboard.user.analytics.index') }}" class="text-2xs text-primary">&larr; {{ __('Back to analytics') }}</a>
        </div>

        {{-- Episode header + the numbers row --}}
        <x-card class:body="p-5">
            <h2 class="m-0 text-base font-semibold text-heading-foreground">{{ $episode->title ?? __('Untitled episode') }}</h2>
            <div class="mt-3 flex flex-wrap gap-8">
                <div>
                    <p class="m-0 text-2xs font-semibold text-heading-foreground">{{ $episode->pub_date?->format('M j, Y') ?? '—' }}</p>
                    <p class="m-0 text-3xs text-foreground/50">{{ __('published') }}</p>
                </div>
                @if ($episode->duration_seconds)
                    <div>
                        <p class="m-0 text-2xs font-semibold text-heading-foreground">{{ gmdate($episode->duration_seconds >= 3600 ? 'G:i:s' : 'i:s', $episode->duration_seconds) }}</p>
                        <p class="m-0 text-3xs text-foreground/50">{{ __('duration') }}</p>
                    </div>
                @endif
                @if ($youtubeViews !== null)
                    <div>
                        <p class="m-0 text-2xs font-semibold text-heading-foreground">{{ number_format($youtubeViews) }}</p>
                        <p class="m-0 text-3xs text-foreground/50">{{ __('YouTube views') }}</p>
                    </div>
                @endif
                @if (($youtubeWatch ?? null) !== null)
                    <div>
                        <p class="m-0 text-2xs font-semibold text-heading-foreground">{{ number_format(intdiv($youtubeWatch['watch_minutes'], 60)) }}h {{ $youtubeWatch['watch_minutes'] % 60 }}m</p>
                        <p class="m-0 text-3xs text-foreground/50">{{ __('watch time, 90 days') }}</p>
                    </div>
                    <div>
                        <p class="m-0 text-2xs font-semibold text-heading-foreground">{{ gmdate($youtubeWatch['avg_view_duration_seconds'] >= 3600 ? 'G:i:s' : 'i:s', $youtubeWatch['avg_view_duration_seconds']) }}</p>
                        <p class="m-0 text-3xs text-foreground/50">{{ __('avg view duration') }}</p>
                    </div>
                @endif
            </div>
            @if (filled($episode->description))
                <p class="m-0 mt-4 text-2xs leading-relaxed text-foreground/60">{{ \Illuminate\Support\Str::limit($episode->description, 500) }}</p>
            @endif
        </x-card>

        {{-- YouTube pairing (sprint C): show, set, correct or remove the
             episode↔video link. Manual decisions stick; auto never overrides. --}}
        @if ($youtubeConnected)
            <x-card class:body="p-5">
                <h3 class="m-0 text-sm font-semibold text-heading-foreground">{{ __('YouTube video pairing') }}</h3>

                @if (filled($episode->youtube_video_id))
                    <p class="m-0 mt-2 text-2xs text-foreground/70">
                        {{ __('Paired to') }}
                        <a href="https://www.youtube.com/watch?v={{ $episode->youtube_video_id }}" target="_blank" rel="noopener" class="text-primary">
                            {{ collect($youtubeVideos)->firstWhere('video_id', $episode->youtube_video_id)['title'] ?? $episode->youtube_video_id }}
                        </a>
                        @if ($episode->youtube_paired_manually)
                            · <span class="text-foreground/50">{{ __('set by you') }}</span>
                        @elseif ($episode->youtube_match_confidence !== null)
                            · <span class="text-foreground/50">{{ __('matched automatically') }} ({{ $episode->youtube_match_confidence }}%)</span>
                        @else
                            · <span class="text-foreground/50">{{ __('matched automatically') }}</span>
                        @endif
                    </p>
                @else
                    <p class="m-0 mt-2 text-2xs text-foreground/60">
                        @if ($episode->youtube_paired_manually)
                            {{ __('Marked as audio-only — automatic matching leaves this episode alone.') }}
                        @else
                            {{ __('No video paired yet. Pick the matching upload below, or mark the episode audio-only.') }}
                        @endif
                    </p>
                @endif

                <div class="mt-4 flex flex-wrap items-end gap-3">
                    <form method="POST" action="{{ route('dashboard.user.analytics.youtube-pair', $episode->id) }}" class="m-0 flex flex-wrap items-end gap-2">
                        @csrf
                        <input type="hidden" name="mode" value="manual">
                        <label class="block">
                            <span class="mb-1 block text-3xs text-foreground/50">{{ __('Pair with') }}</span>
                            <select name="video_id" class="rounded-lg border border-foreground/20 bg-background px-3 py-1.5 text-2xs" required>
                                <option value="" disabled selected>{{ __('Choose a video…') }}</option>
                                @foreach (array_slice($youtubeVideos, 0, 50) as $video)
                                    <option value="{{ $video['video_id'] }}" @selected($video['video_id'] === $episode->youtube_video_id)>
                                        {{ \Illuminate\Support\Str::limit($video['title'] ?? $video['video_id'], 70) }}
                                        @if (filled($video['published_at'])) ({{ \Illuminate\Support\Carbon::parse($video['published_at'])->format('M j, Y') }}) @endif
                                    </option>
                                @endforeach
                            </select>
                        </label>
                        <button type="submit" class="inline-flex items-center rounded-full border border-primary px-4 py-1.5 text-2xs font-medium text-primary">
                            {{ filled($episode->youtube_video_id) ? __('Change pairing') : __('Pair') }}
                        </button>
                    </form>

                    @if (filled($episode->youtube_video_id) || ! $episode->youtube_paired_manually)
                        <form method="POST" action="{{ route('dashboard.user.analytics.youtube-pair', $episode->id) }}" class="m-0">
                            @csrf
                            <input type="hidden" name="mode" value="clear">
                            <button type="submit" class="inline-flex items-center rounded-full border border-foreground/20 px-4 py-1.5 text-2xs font-medium text-foreground/60">
                                {{ filled($episode->youtube_video_id) ? __('Remove pairing') : __('Mark audio-only') }}
                            </button>
                        </form>
                    @endif

                    @if ($episode->youtube_paired_manually)
                        <form method="POST" action="{{ route('dashboard.user.analytics.youtube-pair', $episode->id) }}" class="m-0">
                            @csrf
                            <input type="hidden" name="mode" value="auto">
                            <button type="submit" class="inline-flex items-center rounded-full border border-foreground/20 px-4 py-1.5 text-2xs font-medium text-foreground/60">
                                {{ __('Use automatic matching') }}
                            </button>
                        </form>
                    @endif
                </div>
            </x-card>
        @endif

        {{-- Transcript --}}
        <x-card class:body="p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <h3 class="m-0 text-sm font-semibold text-heading-foreground">{{ __('Transcript') }}</h3>
                @if (!$isCompleted && !$inFlight && filled($episode->audio_url))
                    <form method="POST" action="{{ route('dashboard.user.analytics.transcribe', $episode->id) }}" class="m-0">
                        @csrf
                        <button type="submit" class="inline-flex items-center rounded-full border border-primary px-4 py-1.5 text-2xs font-medium text-primary">
                            {{ $status === \App\Models\EpisodeTranscript::STATUS_FAILED ? __('Retry transcription') : __('Transcribe this episode') }}
                        </button>
                    </form>
                @endif
            </div>

            @if ($isCompleted)
                <p class="m-0 mt-1 text-3xs text-foreground/50">
                    {{ number_format($transcript->word_count ?? 0) }} {{ __('words') }}
                    @if ($transcript->language) · {{ strtoupper($transcript->language) }} @endif
                    · {{ __('select the text to copy it anywhere — your host, your site, your show notes') }}
                </p>
                @if (($segments ?? collect())->isNotEmpty())
                    {{-- Sprint 2: timestamped view (segments exist for transcripts
                         created after 2026-09-16; older ones fall back to plain text). --}}
                    <div class="mt-4 max-h-[32rem] overflow-y-auto rounded-lg border border-foreground/10 p-4 text-2xs leading-relaxed text-foreground/80">
                        @foreach ($segments as $segment)
                            <p class="m-0 mb-1.5">
                                <span class="mr-2 font-mono text-3xs tabular-nums text-foreground/40">{{ gmdate($segment->start_ms >= 3600000 ? 'G:i:s' : 'i:s', intdiv($segment->start_ms, 1000)) }}</span>{{ $segment->text }}
                            </p>
                        @endforeach
                    </div>
                @else
                    <div class="mt-4 max-h-[32rem] overflow-y-auto whitespace-pre-wrap rounded-lg border border-foreground/10 p-4 text-2xs leading-relaxed text-foreground/80">{{ $transcript->body }}</div>
                @endif
            @elseif ($inFlight)
                <p class="m-0 mt-2 text-2xs text-foreground/60">{{ __('Transcription is running — usually a few minutes. Refresh this page to check.') }}</p>
            @elseif ($status === \App\Models\EpisodeTranscript::STATUS_FAILED)
                <p class="m-0 mt-2 text-2xs text-foreground/60">
                    {{ __('The last attempt failed:') }} {{ $transcript->error ?? __('unknown error') }}
                </p>
            @else
                <p class="m-0 mt-2 text-2xs text-foreground/60">
                    {{ __('Not transcribed yet. One click gets you editable text in minutes — metered like Speech to Text, and the transcript is what show notes, clips and social copy are written from.') }}
                </p>
            @endif
        </x-card>
    </div>
@endsection
