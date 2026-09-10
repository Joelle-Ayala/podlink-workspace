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
            </div>
            @if (filled($episode->description))
                <p class="m-0 mt-4 text-2xs leading-relaxed text-foreground/60">{{ \Illuminate\Support\Str::limit($episode->description, 500) }}</p>
            @endif
        </x-card>

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
                <div class="mt-4 max-h-[32rem] overflow-y-auto whitespace-pre-wrap rounded-lg border border-foreground/10 p-4 text-2xs leading-relaxed text-foreground/80">{{ $transcript->body }}</div>
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
