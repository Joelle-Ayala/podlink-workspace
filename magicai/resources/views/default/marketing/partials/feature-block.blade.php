{{--
    Feature detail block — text on one side, visual on the other, alternating.

    @include('marketing.partials.feature-block', [
        'eyebrow'  => 'Understand',                       // optional
        'title'    => 'Download analytics you can trust',
        'body'     => '<p class="pl-text">…</p>',         // raw HTML, optional
        'bullets'  => ['…', '…'],                         // optional
        'cta'      => ['label' => 'Start free', 'url' => '/register'], // optional
        'reverse'  => true,                               // media on the left
        'image'    => '/themes/default/assets/…png',      // optional real screenshot
        'imageAlt' => 'Podlink analytics dashboard',
        'mock'     => 'bars',                             // 'bars' | 'lines' | 'none'
        'mockLabel'=> 'Downloads · last 30 days',
    ])

    When 'image' is present it wins; otherwise a branded placeholder panel is
    rendered so the page never looks unfinished before screenshots exist.
--}}
@php
    $plReverse = !empty($reverse);
    $plMock = $mock ?? 'lines';
@endphp
<div @class(['pl-feature', 'pl-feature--reverse' => $plReverse])>
    <div class="pl-feature__body">
        @if (!empty($eyebrow))
            <p class="pl-eyebrow">{{ $eyebrow }}</p>
        @endif

        <h3 class="pl-h2">{!! $title !!}</h3>

        @if (!empty($body))
            {!! $body !!}
        @endif

        @if (!empty($bullets))
            <ul class="pl-feature__list">
                @foreach ($bullets as $bullet)
                    <li>{!! $bullet !!}</li>
                @endforeach
            </ul>
        @endif

        @if (!empty($cta))
            <p class="pl-feature__cta">
                <a
                    class="pl-btn pl-btn--outline"
                    href="{{ $cta['url'] }}"
                >{{ $cta['label'] }}</a>
            </p>
        @endif
    </div>

    <div class="pl-feature__media">
        @if (!empty($image))
            <img
                src="{{ $image }}"
                alt="{{ $imageAlt ?? '' }}"
                loading="lazy"
                decoding="async"
            />
        @elseif ($plMock === 'bars')
            <div class="pl-mock">
                <div class="pl-mock__bar"><span></span><span></span><span></span></div>
                @if (!empty($mockLabel))
                    <p class="pl-mock__label">{{ $mockLabel }}</p>
                @endif
                <div class="pl-mock__bars">
                    @foreach ([38, 52, 45, 63, 58, 74, 66, 88, 71, 95] as $plHeight)
                        <i style="height: {{ $plHeight }}%"></i>
                    @endforeach
                </div>
            </div>
        @elseif ($plMock !== 'none')
            <div class="pl-mock">
                <div class="pl-mock__bar"><span></span><span></span><span></span></div>
                @if (!empty($mockLabel))
                    <p class="pl-mock__label">{{ $mockLabel }}</p>
                @endif
                <div class="pl-mock__line pl-mock__line--accent pl-mock__line--w60"></div>
                <div class="pl-mock__line"></div>
                <div class="pl-mock__line pl-mock__line--w80"></div>
                <div class="pl-mock__line pl-mock__line--w45"></div>
                <div class="pl-mock__line"></div>
                <div class="pl-mock__line pl-mock__line--w60"></div>
            </div>
        @endif
    </div>
</div>
