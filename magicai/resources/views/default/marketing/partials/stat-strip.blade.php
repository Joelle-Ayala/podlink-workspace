{{--
    Stat strip / logo strip.

    Stats:
    @include('marketing.partials.stat-strip', [
        'items' => [
            ['value' => 'IAB v2', 'label' => 'Certified download measurement via OP3'],
        ],
    ])

    Logos (text or image):
    @include('marketing.partials.stat-strip', [
        'variant' => 'logo',
        'items'   => [
            ['label' => 'Apple Podcasts'],
            ['image' => '/themes/default/assets/img/spotify.svg', 'label' => 'Spotify'],
        ],
    ])
--}}
@php
    $plVariant = $variant ?? 'stat';
@endphp
<div class="pl-strip">
    @foreach ($items as $item)
        <div class="pl-strip__item">
            @if ($plVariant === 'logo')
                <span class="pl-strip__logo">
                    @if (!empty($item['image']))
                        <img
                            src="{{ $item['image'] }}"
                            alt="{{ $item['label'] ?? '' }}"
                            loading="lazy"
                            decoding="async"
                        />
                    @else
                        {{ $item['label'] }}
                    @endif
                </span>
            @else
                <span class="pl-strip__value">{!! $item['value'] !!}</span>
                <span class="pl-strip__label">{!! $item['label'] !!}</span>
            @endif
        </div>
    @endforeach
</div>
