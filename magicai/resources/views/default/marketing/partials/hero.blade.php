{{--
    Page hero — dark band sized so the overlaying (absolutely positioned,
    white-text) site header stays legible.

    @include('marketing.partials.hero', [
        'eyebrow'      => 'Everything Podlink does',      // optional
        'title'        => 'One workflow …',
        'lead'         => 'Sub-headline.',                // optional
        'primaryCta'   => ['label' => 'Start free', 'url' => route('register')],   // optional
        'secondaryCta' => ['label' => 'See pricing', 'url' => '/pricing'],          // optional
        'note'         => 'No credit card required.',     // optional
    ])
--}}
<section class="site-section pl-hero">
    <div class="pl-wrap">
        <div class="pl-hero__inner">
            @if (!empty($eyebrow))
                <p class="pl-eyebrow">{{ $eyebrow }}</p>
            @endif

            <h1 class="pl-h1">{!! $title !!}</h1>

            @if (!empty($lead))
                <p class="pl-lead">{!! $lead !!}</p>
            @endif

            @if (!empty($primaryCta) || !empty($secondaryCta))
                <div class="pl-btn-row pl-btn-row--center">
                    @if (!empty($primaryCta))
                        <a
                            class="pl-btn pl-btn--primary"
                            href="{{ $primaryCta['url'] }}"
                        >{{ $primaryCta['label'] }}</a>
                    @endif
                    @if (!empty($secondaryCta))
                        <a
                            class="pl-btn pl-btn--ghost"
                            href="{{ $secondaryCta['url'] }}"
                        >{{ $secondaryCta['label'] }}</a>
                    @endif
                </div>
            @endif

            @if (!empty($note))
                <p class="pl-hero__note">{{ $note }}</p>
            @endif
        </div>
    </div>
</section>
