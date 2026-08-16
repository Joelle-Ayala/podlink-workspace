{{--
    Three-up (or 2 / 3 / 4-up) card grid.

    @include('marketing.partials.three-up', [
        'columns'      => 3,        // 2 | 3 | 4, default 3
        'headingLevel' => 4,        // 2-6, default 4 — see below
        'items'        => [
            ['icon' => 'sparkles', 'title' => '…', 'body' => '…', 'url' => '/…', 'linkLabel' => 'Learn more'],
        ],
    ])

    'url' is optional — with it the whole card becomes a link.
    'icon' keys are the ones defined in marketing/partials/icon.blade.php.

    headingLevel is the card title's heading TAG, not its size (.pl-card__title
    owns the size). Set it to one level below the nearest preceding heading or
    axe flags `heading-order`:
        <h2> section heading, grid directly under it .......... headingLevel 3
        <h2> section > <h3> spotlight > grid ................... headingLevel 4
--}}
@php
    $plColumns = (int) ($columns ?? 3);
    $plHeadingLevel = (int) ($headingLevel ?? 4);
@endphp
<div @class([
    'pl-grid',
    'pl-grid--2' => $plColumns === 2,
    'pl-grid--3' => $plColumns === 3,
    'pl-grid--4' => $plColumns === 4,
])>
    @foreach ($items as $item)
        @if (!empty($item['url']))
            <a
                class="pl-card pl-card--interactive"
                href="{{ $item['url'] }}"
            >
                @include('marketing.partials.card-inner', [
                    'item' => $item,
                    'headingLevel' => $plHeadingLevel,
                ])
            </a>
        @else
            <div class="pl-card">
                @include('marketing.partials.card-inner', [
                    'item' => $item,
                    'headingLevel' => $plHeadingLevel,
                ])
            </div>
        @endif
    @endforeach
</div>
