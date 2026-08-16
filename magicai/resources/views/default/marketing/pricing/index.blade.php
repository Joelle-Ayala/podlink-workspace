{{--
    /pricing — plans, comparison table, FAQ, CTA.
    Served by App\Http\Controllers\Marketing\MarketingController::pricing()
    via routes/custom_routes_web.php.

    ALL tier copy comes from config('marketing.pricing'). Nothing here is wired
    to Stripe or to a `plans` row; the CTAs go to registration like every other
    marketing CTA. While config('marketing.pricing.draft') is true the layout
    emits <meta name="robots" content="noindex, follow">.

    Deliberately NOT reusing resources/views/default/landing-page/pricing/* —
    that stock section leads with "Access 47 Features", hardcodes grid-cols-3
    and is bound to the MagicAI plan models.

    Heading outline: h1 hero -> h2 per section -> h3 tier names.
--}}
@extends('marketing.layout')

@section('marketing')

    {{-- primaryCta/secondaryCta are passed explicitly as null. @include merges
         the PARENT view's scope, and this view has both variables set for the
         closing CTA band — without these two lines the hero would silently
         sprout buttons that duplicate the ones in the price cards below. --}}
    @include('marketing.partials.hero', [
        'eyebrow' => 'Pricing',
        'title' => 'Start free.<br>Pay when the show starts paying you back.',
        'lead' =>
            'Every plan keeps you on your existing podcast host and includes open OP3 download analytics. Choose annual and two of the twelve months are on us.',
        'note' => 'No card required to start. Cancel any time.',
        'primaryCta' => null,
        'secondaryCta' => null,
    ])

    {{-- ---------------------------------------------------------------- --}}
    {{-- Plans                                                            --}}
    {{-- ---------------------------------------------------------------- --}}
    <section
        class="site-section pl-section"
        id="plans"
    >
        <div class="pl-wrap">
            <h2 class="pl-sr-only">Plans</h2>

            @include('marketing.partials.price-cards', [
                'tiers' => $tiers,
                'currency' => $currency,
                'billing' => $billing,
                'headingLevel' => 3,
            ])
        </div>
    </section>

    {{-- ---------------------------------------------------------------- --}}
    {{-- Comparison                                                       --}}
    {{-- ---------------------------------------------------------------- --}}
    <section
        class="site-section pl-section pl-section--alt"
        id="compare"
    >
        <div class="pl-wrap">
            <div class="pl-section-head pl-section-head--center">
                <p class="pl-eyebrow">Side by side</p>
                <h2 class="pl-h2">What you get on each plan</h2>
                <p class="pl-lead pl-muted pl-mb-0">
                    Everything in the table works off the RSS feed you already publish. Nothing here asks you to move
                    hosts.
                </p>
            </div>

            @include('marketing.partials.comparison-table', [
                'comparison' => $comparison,
                'tiers' => $tiers,
                'currency' => $currency,
            ])
        </div>
    </section>

    {{-- ---------------------------------------------------------------- --}}
    {{-- FAQ                                                              --}}
    {{-- ---------------------------------------------------------------- --}}
    @if (!empty($faq))
        <section
            class="site-section pl-section"
            id="pricing-faq"
        >
            <div class="pl-wrap">
                <div class="pl-section-head pl-section-head--center">
                    <p class="pl-eyebrow">Billing questions</p>
                    <h2 class="pl-h2">The bits people always check first</h2>
                </div>

                @include('marketing.partials.faq', [
                    'open' => 0,
                    'items' => $faq,
                ])
            </div>
        </section>
    @endif

    {{-- ---------------------------------------------------------------- --}}
    {{-- Closing CTA                                                      --}}
    {{-- ---------------------------------------------------------------- --}}
    @include('marketing.partials.cta', [
        'title' => $cta['title'] ?? 'Start on Free. Move up when the show does.',
        'lead' => $cta['lead'] ?? null,
        'primaryCta' => $primaryCta,
        'secondaryCta' => $secondaryCta,
        'note' => $cta['note'] ?? null,
    ])

@endsection
