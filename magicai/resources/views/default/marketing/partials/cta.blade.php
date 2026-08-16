{{--
    Closing CTA band.

    @include('marketing.partials.cta', [
        'title'        => 'Ship a better show this week.',
        'lead'         => '…',
        'primaryCta'   => ['label' => 'Start free', 'url' => route('register')],
        'secondaryCta' => ['label' => 'See pricing', 'url' => '/pricing'],
        'note'         => 'No credit card required.',
    ])
--}}
<section class="site-section pl-section pl-section--tight">
    <div class="pl-wrap">
        <div class="pl-cta">
            <div class="pl-cta__inner">
                @if (!empty($eyebrow))
                    <p class="pl-eyebrow">{{ $eyebrow }}</p>
                @endif

                <h2 class="pl-h2">{!! $title !!}</h2>

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
                    <p class="pl-cta__note">{{ $note }}</p>
                @endif
            </div>
        </div>
    </div>
</section>
