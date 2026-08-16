{{--
    Podlink marketing page layout.
    ---------------------------------------------------------------------------
    Extends the stock site layout so the DB-driven header, footer, fonts, GDPR
    banner, chatbot widget and the prebuilt landing-page CSS bundle all come
    along unchanged. Everything inside <main class="pl-page"> is a clean slate
    styled exclusively by public/themes/default/assets/css/frontend/podlink-marketing.css
    (hand-written CSS — the Railway container runs no asset build, so new
    Tailwind utilities would not exist at runtime).

    USAGE
        @extends('marketing.layout')
        @section('marketing')
            @include('marketing.partials.hero', [...])
            ...
        @endsection

    Optional variables (normally supplied by MarketingController):
        $metaTitle       string  <title> override
        $metaDescription string  meta description override
        $canonical       string  canonical URL (defaults to current URL)
        $ogImage         string  absolute image URL for social cards
--}}
@extends('layout.app')

{{-- NOTE: these @push blocks must stay at the TOP LEVEL of this file. A @push
     nested inside @section('content') executes after <head> is already
     rendered and would silently do nothing. --}}
@push('css')
    <link
        rel="stylesheet"
        href="{{ custom_theme_url('assets/css/frontend/podlink-marketing.css') }}?v={{ config('marketing.asset_version', '1') }}"
    />
@endpush

@push('head')
    {{-- Per-page robots directive. Used by /pricing while its tier content is
         still placeholder (config marketing.pricing.draft) so invented prices
         cannot be indexed. `follow` is kept so the outbound links still count.
         The stock layout emits its own global robots meta when the
         `google_robots` setting is on; both being present is harmless. --}}
    @if (!empty($metaRobots))
        <meta
            name="robots"
            content="{{ $metaRobots }}"
        />
    @endif
    <link
        rel="canonical"
        href="{{ $canonical ?? url()->current() }}"
    />
    <meta
        property="og:type"
        content="website"
    />
    <meta
        property="og:site_name"
        content="{{ $setting->site_name }}"
    />
    <meta
        property="og:title"
        content="{{ $metaTitle ?? getMetaTitle($setting, $settings_two) }}"
    />
    <meta
        property="og:description"
        content="{{ $metaDescription ?? getMetaDesc($setting, $settings_two) }}"
    />
    <meta
        property="og:url"
        content="{{ $canonical ?? url()->current() }}"
    />
    @if (!empty($ogImage))
        <meta
            property="og:image"
            content="{{ $ogImage }}"
        />
    @endif
    <meta
        name="twitter:card"
        content="summary_large_image"
    />
@endpush

@section('content')
    <main class="pl-page">
        @yield('marketing')
    </main>
@endsection
