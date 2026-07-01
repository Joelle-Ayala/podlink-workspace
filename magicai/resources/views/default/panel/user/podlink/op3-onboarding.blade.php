@extends('panel.layout.app')
@section('title', __('Set Up Download Analytics'))

@section('content')
<div class="py-10">
  <div class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">

    {{-- Header --}}
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-heading mb-2">
        {{ __('Set Up Download Analytics') }}
      </h1>
      <p class="text-sub-heading text-sm">
        {{ __('Add the OP3 prefix to your RSS feed so Podlink can track real episode downloads — free, privacy-preserving, and industry-trusted.') }}
      </p>
    </div>

    {{-- Status banner --}}
    @if($show && $show->op3_prefix_active === 'verified')
      <div class="rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-4 mb-6 flex items-center gap-3">
        <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <div>
          <p class="text-green-400 font-medium text-sm">{{ __('Download tracking is active') }}</p>
          <p class="text-sub-heading text-xs mt-0.5">{{ __('OP3 is measuring downloads for your show. Data appears in your analytics dashboard.') }}</p>
        </div>
      </div>
    @elseif($show && $show->op3_prefix_active === 'no')
      <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-4 mb-6 flex items-center gap-3">
        <svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z"/></svg>
        <p class="text-amber-400 text-sm">{{ __('Prefix not yet verified. Follow the steps below, then click Verify.') }}</p>
      </div>
    @endif

    {{-- Flash messages --}}
    @if(session('success'))
      <div class="rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-3 mb-6 text-green-400 text-sm">{{ session('success') }}</div>
    @endif
    @if(session('warning'))
      <div class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-3 mb-6 text-amber-400 text-sm">{{ session('warning') }}</div>
    @endif
    @if(session('error'))
      <div class="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 mb-6 text-red-400 text-sm">{{ session('error') }}</div>
    @endif

    {{-- Step 1: RSS feed + host --}}
    <div class="rounded-xl border border-stroke bg-foreground p-6 mb-6">
      <div class="flex items-center gap-3 mb-5">
        <span class="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
        <h2 class="font-semibold text-heading">{{ __('Enter your podcast RSS feed') }}</h2>
      </div>

      <form method="POST" action="{{ route('dashboard.podlink.analytics.op3.setup') }}">
        @csrf
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-heading mb-1.5">{{ __('Show title') }}</label>
            <input type="text" name="show_title" required
              value="{{ old('show_title', $show?->title) }}"
              placeholder="My Podcast Show"
              class="w-full rounded-lg border border-stroke bg-body px-4 py-2.5 text-sm text-heading placeholder-sub-heading focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-heading mb-1.5">{{ __('RSS feed URL') }}</label>
            <input type="url" name="rss_feed_url" required
              value="{{ old('rss_feed_url', $show?->rss_feed_url) }}"
              placeholder="https://feeds.example.com/mypodcast"
              class="w-full rounded-lg border border-stroke bg-body px-4 py-2.5 text-sm text-heading placeholder-sub-heading focus:outline-none focus:border-primary" />
            <p class="text-sub-heading text-xs mt-1.5">{{ __('Find this in your podcast host dashboard under RSS or Distribution settings.') }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-heading mb-1.5">{{ __('Podcast host') }}</label>
            <select name="host" id="host-select"
              class="w-full rounded-lg border border-stroke bg-body px-4 py-2.5 text-sm text-heading focus:outline-none focus:border-primary">
              <option value="">— Select your host —</option>
              @foreach($hosts as $key => $host)
                <option value="{{ $key }}" {{ old('host') === $key ? 'selected' : '' }}>{{ $host['name'] }}</option>
              @endforeach
            </select>
          </div>
        </div>
        <div class="mt-5">
          <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">
            {{ __('Save & continue') }}
          </button>
        </div>
      </form>
    </div>

    {{-- Step 2: Host-specific instructions --}}
    <div class="rounded-xl border border-stroke bg-foreground p-6 mb-6" id="host-instructions">
      <div class="flex items-center gap-3 mb-5">
        <span class="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
        <h2 class="font-semibold text-heading">{{ __('Add the OP3 prefix to your RSS feed') }}</h2>
      </div>

      {{-- OP3 prefix to copy --}}
      <div class="rounded-lg bg-body border border-stroke px-4 py-3 mb-5 flex items-center justify-between gap-4">
        <code class="text-primary text-sm font-mono select-all">https://op3.dev/e/</code>
        <button onclick="navigator.clipboard.writeText('https://op3.dev/e/').then(() => this.textContent = 'Copied!')"
          class="text-xs text-sub-heading hover:text-heading border border-stroke rounded px-3 py-1.5 shrink-0 transition">
          Copy
        </button>
      </div>

      {{-- Dynamic instructions per host --}}
      @foreach($hosts as $key => $host)
        <div class="host-steps hidden" data-host="{{ $key }}">
          <p class="text-sm font-medium text-heading mb-3">{{ __('Steps for :host', ['host' => $host['name']]) }}:</p>
          <ol class="space-y-2">
            @foreach($host['steps'] as $i => $step)
              <li class="flex gap-3 text-sm text-sub-heading">
                <span class="text-primary font-medium shrink-0">{{ $i + 1 }}.</span>
                <span>{{ $step }}</span>
              </li>
            @endforeach
          </ol>
          @isset($host['note'])
            <div class="mt-4 rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-primary text-xs">
              💡 {{ $host['note'] }}
            </div>
          @endisset
        </div>
      @endforeach

      <div class="host-steps-placeholder text-sub-heading text-sm" id="steps-placeholder">
        {{ __('Select your podcast host above to see exact instructions.') }}
      </div>

      <div class="mt-5 p-4 rounded-lg bg-body border border-stroke">
        <p class="text-sub-heading text-xs">
          <span class="text-heading font-medium">{{ __('Important:') }}</span>
          {{ __('The prefix goes BEFORE your audio URL — not after. Example: ') }}
          <code class="text-primary">https://op3.dev/e/example.com/ep1.mp3</code>
        </p>
      </div>
    </div>

    {{-- Step 3: Verify --}}
    <div class="rounded-xl border border-stroke bg-foreground p-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
        <h2 class="font-semibold text-heading">{{ __('Verify your prefix is active') }}</h2>
      </div>
      <p class="text-sub-heading text-sm mb-5">
        {{ __('After saving your RSS feed prefix, play an episode from a podcast app (Apple Podcasts, Spotify, Overcast, etc.) to trigger the first tracked download. Then click verify.') }}
      </p>

      @if($show)
        <form method="POST" action="{{ route('dashboard.podlink.analytics.op3.verify') }}">
          @csrf
          <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition">
            {{ __('Verify download tracking →') }}
          </button>
        </form>
      @else
        <p class="text-sub-heading text-sm italic">{{ __('Save your RSS feed first (step 1) to enable verification.') }}</p>
      @endif
    </div>

  </div>
</div>

<script>
  // Show host-specific instructions when host is selected
  const select = document.getElementById('host-select');
  const placeholder = document.getElementById('steps-placeholder');

  function showHostSteps(hostKey) {
    document.querySelectorAll('.host-steps').forEach(el => el.classList.add('hidden'));
    if (hostKey) {
      const target = document.querySelector('.host-steps[data-host="' + hostKey + '"]');
      if (target) {
        target.classList.remove('hidden');
        placeholder.classList.add('hidden');
      }
    } else {
      placeholder.classList.remove('hidden');
    }
  }

  select.addEventListener('change', () => showHostSteps(select.value));

  // If host was previously selected (old input), show on load
  if (select.value) showHostSteps(select.value);
</script>
@endsection
