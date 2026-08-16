{{--
    Card contents shared by the linked and unlinked variants of three-up.

    $headingLevel (int, 2-6, default 4) sets the card title's heading TAG only.
    The visual size is owned by .pl-card__title, so changing the level never
    changes how the card looks — which is the entire point: the level has to
    follow the document outline of whatever section the grid sits in, or axe
    flags `heading-order`.

        section h2 -> grid needs headingLevel 3
        section h2 > spotlight h3 -> grid needs headingLevel 4 (the default)

    The value is clamped, so a bad caller can never emit <h0> or <h9>.
--}}
@php
    $plHeadingTag = 'h' . max(2, min(6, (int) ($headingLevel ?? 4)));
@endphp
@if (!empty($item['icon']))
    <span class="pl-card__icon">
        @include('marketing.partials.icon', ['name' => $item['icon']])
    </span>
@endif

<{{ $plHeadingTag }} class="pl-card__title">{!! $item['title'] !!}</{{ $plHeadingTag }}>

@if (!empty($item['body']))
    <p class="pl-card__body">{!! $item['body'] !!}</p>
@endif

@if (!empty($item['url']) && !empty($item['linkLabel']))
    <span class="pl-card__foot">
        <span class="pl-link">
            {{ $item['linkLabel'] }}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 47 62"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M27.95 0L0 38.213H18.633V61.141L46.583 22.928H27.95V0Z" />
            </svg>
        </span>
    </span>
@endif
