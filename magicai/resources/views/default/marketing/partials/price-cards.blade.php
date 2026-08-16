{{--
    Price card row with a monthly / annual toggle.

    NO JAVASCRIPT. The toggle is two radio inputs plus sibling selectors in
    podlink-marketing.css. That matters here for three reasons: the container
    ships no asset build, a price that only appears after a JS bundle boots is
    a price a crawler may never see, and radios give us correct keyboard and
    screen-reader behaviour for free (arrow keys move between them, the state
    is announced) where a div-with-click-handler would not.

    Both prices are always in the DOM; only their visibility changes.

    @include('marketing.partials.price-cards', [
        'tiers'    => [...],   // from MarketingController::tiers()
        'currency' => '$',
        'billing'  => ['legend' => …, 'monthly_label' => …, 'annual_label' => …, 'save_label' => …],
        'headingLevel' => 3,   // tier name heading level, default 3
    ])
--}}
@php
    $plBilling = $billing ?? [];
    $plCurrency = $currency ?? '$';
    $plTierTag = 'h' . max(2, min(6, (int) ($headingLevel ?? 3)));

    // Trailing ".00" on a whole-number price reads as clutter on a pricing
    // page; keep decimals only when a tier actually has them.
    $plMoney = static function (float $value) use ($plCurrency): string {
        return $plCurrency . rtrim(rtrim(number_format($value, 2, '.', ','), '0'), '.');
    };
@endphp

<div class="pl-billing">
    <fieldset class="pl-billing__fieldset">
        <legend class="pl-sr-only">{{ $plBilling['legend'] ?? 'Billing period' }}</legend>

        {{-- The radios must precede everything they style: the CSS reaches the
             switch and the card grid with the general sibling combinator. --}}
        <input
            class="pl-billing__input"
            id="pl-billing-monthly"
            type="radio"
            name="pl-billing"
            value="monthly"
            checked
        />
        <input
            class="pl-billing__input"
            id="pl-billing-annual"
            type="radio"
            name="pl-billing"
            value="annual"
        />

        <div class="pl-billing__switch">
            <label
                class="pl-billing__label"
                for="pl-billing-monthly"
            >{{ $plBilling['monthly_label'] ?? 'Monthly' }}</label>
            <label
                class="pl-billing__label"
                for="pl-billing-annual"
            >
                {{ $plBilling['annual_label'] ?? 'Annual' }}
                @if (!empty($plBilling['save_label']))
                    <span class="pl-billing__save">{{ $plBilling['save_label'] }}</span>
                @endif
            </label>
        </div>

        <div class="pl-grid pl-grid--3 pl-price-grid">
            @foreach ($tiers as $tier)
                <div @class([
                    'pl-card',
                    'pl-price',
                    'pl-price--featured' => !empty($tier['featured']),
                ])>
                    @if (!empty($tier['badge']))
                        <span class="pl-price__badge">{{ $tier['badge'] }}</span>
                    @endif

                    <{{ $plTierTag }} class="pl-price__name">{{ $tier['name'] }}</{{ $plTierTag }}>

                    @if (!empty($tier['tagline']))
                        <p class="pl-price__tagline">{{ $tier['tagline'] }}</p>
                    @endif

                    <p class="pl-price__amount pl-price__amount--monthly">
                        <span class="pl-price__figure">{{ $plMoney($tier['price_monthly']) }}</span>
                        <span class="pl-price__period">{{ $tier['price_monthly'] > 0 ? '/month' : 'forever' }}</span>
                    </p>
                    <p class="pl-price__amount pl-price__amount--annual">
                        <span class="pl-price__figure">{{ $plMoney($tier['price_annual']) }}</span>
                        <span class="pl-price__period">{{ $tier['price_annual'] > 0 ? '/year' : 'forever' }}</span>
                    </p>

                    <p class="pl-price__billed pl-price__billed--monthly">
                        {{ $tier['price_monthly'] > 0 ? 'Billed monthly' : 'No card required' }}
                    </p>
                    <p class="pl-price__billed pl-price__billed--annual">
                        {{ $tier['price_annual'] > 0 ? 'Billed once a year' : 'No card required' }}
                    </p>

                    <p class="pl-price__cta">
                        <a
                            @class([
                                'pl-btn',
                                'pl-btn--primary' => !empty($tier['featured']),
                                'pl-btn--outline' => empty($tier['featured']),
                                'pl-btn--block',
                            ])
                            href="{{ $tier['cta_url'] }}"
                        >
                            {{ $tier['cta_label'] ?? 'Get started' }}
                            <span class="pl-sr-only">on the {{ $tier['name'] }} plan</span>
                        </a>
                    </p>

                    @if (!empty($tier['note']))
                        <p class="pl-price__note">{{ $tier['note'] }}</p>
                    @endif

                    @if (!empty($tier['features']))
                        <ul class="pl-price__list">
                            @foreach ($tier['features'] as $plFeature)
                                <li>{!! $plFeature !!}</li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            @endforeach
        </div>
    </fieldset>
</div>
