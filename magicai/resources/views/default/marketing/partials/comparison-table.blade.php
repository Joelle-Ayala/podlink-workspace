{{--
    Plan feature comparison table.

    RESPONSIVE STRATEGY — horizontal scroll with a sticky first column, NOT a
    display:block "stacked card" transform. Restyling <table> children to
    block wipes out the implicit table semantics in several screen readers, and
    a comparison table is exactly the content where row/column association
    carries the meaning. Instead the table stays a table at every width and
    the viewport scrolls over it:

      * the scroll container is role="region" + tabindex="0" + aria-label, so
        keyboard-only users can actually reach and scroll it (WCAG 2.1
        technique for overflowing content);
      * the feature-name column is position: sticky, so the row label never
        scrolls out of sight and the values stay identifiable;
      * a visible hint sits ABOVE the container (not inside it — inside, it
        would scroll away exactly when it is needed) and is shown only at the
        widths where the table actually overflows.

    No JavaScript.

    @include('marketing.partials.comparison-table', [
        'comparison' => [...],   // config('marketing.pricing.comparison')
        'tiers'      => [...],   // same order as every `values` array
        'currency'   => '$',
    ])
--}}
@php
    $plSections = $comparison['sections'] ?? [];
    $plCaption = $comparison['caption'] ?? 'Plan feature comparison.';
    $plFeatureHead = $comparison['feature_head'] ?? 'Feature';
    $plCurrency = $currency ?? '$';
    // +1 for the feature-name column.
    $plColSpan = count($tiers) + 1;
@endphp

@if (!empty($plSections))
    @if (!empty($comparison['scroll_hint']))
        <p class="pl-table-hint">
            <span aria-hidden="true">&harr;</span>
            {{ $comparison['scroll_hint'] }}
        </p>
    @endif

    <div
        class="pl-table-scroll"
        role="region"
        aria-label="{{ $plCaption }}"
        tabindex="0"
    >
        <table class="pl-table">
            {{-- Kept off-screen rather than shown: a visible <caption> lives
                 inside the table and would scroll sideways with it. Sighted
                 users get the section heading above; AT users get this. --}}
            <caption class="pl-sr-only">{{ $plCaption }}</caption>

            <thead>
                <tr>
                    <th
                        class="pl-table__corner"
                        scope="col"
                    >{{ $plFeatureHead }}</th>
                    @foreach ($tiers as $tier)
                        <th
                            @class(['pl-table__tier', 'pl-table__tier--featured' => !empty($tier['featured'])])
                            scope="col"
                        >
                            <span class="pl-table__tier-name">{{ $tier['name'] }}</span>
                            <span class="pl-table__tier-price">
                                {{ $tier['price_monthly'] > 0 ? $plCurrency . rtrim(rtrim(number_format($tier['price_monthly'], 2, '.', ','), '0'), '.') . '/mo' : 'Free' }}
                            </span>
                        </th>
                    @endforeach
                </tr>
            </thead>

            @foreach ($plSections as $plSection)
                <tbody class="pl-table__group">
                    <tr class="pl-table__section">
                        {{-- scope="rowgroup": this header labels every
                             remaining row in its <tbody>, which is exactly
                             what rowgroup means. --}}
                        <th
                            scope="rowgroup"
                            colspan="{{ $plColSpan }}"
                        >{{ $plSection['title'] }}</th>
                    </tr>

                    @foreach ($plSection['rows'] ?? [] as $plRow)
                        <tr>
                            <th
                                class="pl-table__rowhead"
                                scope="row"
                            >{{ $plRow['label'] }}</th>

                            @foreach ($tiers as $plIndex => $tier)
                                @php
                                    $plValue = $plRow['values'][$plIndex] ?? false;
                                @endphp
                                <td @class([
                                    'pl-table__cell',
                                    'pl-table__cell--featured' => !empty($tier['featured']),
                                ])>
                                    @if ($plValue === true)
                                        <svg
                                            class="pl-table__yes"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="3"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            aria-hidden="true"
                                            focusable="false"
                                        >
                                            <path d="M5 12l5 5L20 7" />
                                        </svg>
                                        <span class="pl-sr-only">Included</span>
                                    @elseif ($plValue === false)
                                        <span
                                            class="pl-table__no"
                                            aria-hidden="true"
                                        ></span>
                                        <span class="pl-sr-only">Not included</span>
                                    @else
                                        {{ $plValue }}
                                    @endif
                                </td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            @endforeach
        </table>
    </div>
@endif
