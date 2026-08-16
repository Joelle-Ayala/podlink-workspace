{{--
    FAQ accordion.

    Built on native <details>/<summary> deliberately: it needs no JavaScript,
    which matters because the container ships no asset build and we do not want
    to depend on the landing page's Alpine/JS bundle for content that search
    engines should read.

    @include('marketing.partials.faq', [
        'items' => [
            ['q' => 'Do I have to move my podcast host?', 'a' => '<p>No…</p>'],
        ],
        'open' => 0,     // optional: index of the item expanded by default
    ])
--}}
@php
    $plOpenIndex = $open ?? null;
@endphp
<div class="pl-faq">
    @foreach ($items as $plIndex => $item)
        <details
            class="pl-faq__item"
            @if ($plOpenIndex !== null && $plIndex === $plOpenIndex) open @endif
        >
            <summary class="pl-faq__q">{!! $item['q'] !!}</summary>
            <div class="pl-faq__a">
                @if (str_contains($item['a'], '<'))
                    {!! $item['a'] !!}
                @else
                    <p>{{ $item['a'] }}</p>
                @endif
            </div>
        </details>
    @endforeach
</div>
