{{--
    /features — the marketing features index.
    Served by App\Http\Controllers\Marketing\MarketingController::features()
    via routes/custom_routes_web.php.

    Feature copy lives in config/marketing.php so the per-feature detail pages
    can reuse it verbatim; page-specific copy (hero, FAQ, CTA) lives here.
--}}
@extends('marketing.layout')

@section('marketing')

    @include('marketing.partials.hero', [
        'eyebrow' => 'Everything Podlink does',
        'title' => 'Record the episode.<br>Podlink does the other four hours.',
        'lead' =>
            'Show notes, clips, a newsletter, social posts and honest download numbers — generated from the episode you just published, on the podcast host you already use.',
        'primaryCta' => $primaryCta,
        'secondaryCta' => $secondaryCta,
        'note' => 'Connect your RSS feed in under a minute. No host migration.',
    ])

    {{-- ---------------------------------------------------------------- --}}
    {{-- Proof strip                                                      --}}
    {{-- ---------------------------------------------------------------- --}}
    <section class="site-section pl-section pl-section--tight pl-section--alt">
        <div class="pl-wrap">
            @include('marketing.partials.stat-strip', [
                'items' => [
                    [
                        'value' => 'Your host',
                        'label' => 'Stay on Buzzsprout, Transistor, Libsyn, Captivate — anywhere with an RSS feed',
                    ],
                    ['value' => 'OP3', 'label' => 'Open, independently operated download measurement you can hand to a sponsor'],
                    ['value' => 'One upload', 'label' => 'Notes, clips, newsletter and social copy from a single episode'],
                    ['value' => 'podlink.fm', 'label' => 'A branded link-in-bio page for your show, included'],
                ],
            ])
        </div>
    </section>

    {{-- ---------------------------------------------------------------- --}}
    {{-- The loop                                                         --}}
    {{-- ---------------------------------------------------------------- --}}
    <section class="site-section pl-section">
        <div class="pl-wrap">
            <div class="pl-section-head pl-section-head--center">
                <p class="pl-eyebrow">How it fits together</p>
                <h2 class="pl-h2">Four jobs, one workflow</h2>
                <p class="pl-lead pl-muted pl-mb-0">
                    Podlink is not a pile of AI tools. It is the loop every growing show runs — publish, understand,
                    create, grow — with the tedious 80% taken off your plate.
                </p>
            </div>

            {{-- headingLevel 3: this grid sits directly under the <h2> above,
                 so h4 card titles would skip a level (axe `heading-order`). --}}
            @include('marketing.partials.three-up', [
                'columns' => 4,
                'headingLevel' => 3,
                'items' => [
                    [
                        'icon' => 'rss',
                        'title' => 'Publish &amp; Distribute',
                        'body' => 'Connect the feed you already have and get a workspace for every episode.',
                        'url' => '#publish',
                        'linkLabel' => 'Jump to section',
                    ],
                    [
                        'icon' => 'chart',
                        'title' => 'Understand',
                        'body' => 'Real download analytics and a transcript of every episode you have published.',
                        'url' => '#understand',
                        'linkLabel' => 'Jump to section',
                    ],
                    [
                        'icon' => 'sparkles',
                        'title' => 'Create',
                        'body' => 'Show notes, titles, descriptions, guest intros and sponsor reads in your voice.',
                        'url' => '#create',
                        'linkLabel' => 'Jump to section',
                    ],
                    [
                        'icon' => 'share',
                        'title' => 'Grow',
                        'body' => 'Clips, social posts, a newsletter and a podlink.fm page that ties it together.',
                        'url' => '#grow',
                        'linkLabel' => 'Jump to section',
                    ],
                ],
            ])
        </div>
    </section>

    {{-- ---------------------------------------------------------------- --}}
    {{-- Feature groups                                                   --}}
    {{-- ---------------------------------------------------------------- --}}
    @foreach ($groups as $groupKey => $group)
        <section
            @class([
                'site-section',
                'pl-section',
                'pl-section--alt' => $loop->index % 2 === 0,
            ])
            id="{{ $group['anchor'] ?? $groupKey }}"
        >
            <div class="pl-wrap">
                <div class="pl-group">
                    <div class="pl-group__head">
                        <h2 class="pl-h3">{{ $group['title'] }}</h2>
                        @if (!empty($group['intro']))
                            <p class="pl-group__intro pl-muted">{{ $group['intro'] }}</p>
                        @endif
                    </div>

                    @if (!empty($group['spotlight']))
                        @include('marketing.partials.feature-block', $group['spotlight'])
                    @endif

                    <div class="pl-group__grid">
                        {{-- Outline: <h2> group title -> <h3> spotlight -> <h4> cards.
                             If a group ever ships without a spotlight there is no
                             h3, so the cards step up to h3 rather than skipping. --}}
                        @include('marketing.partials.three-up', [
                            'columns' => count($group['features']) === 2 ? 2 : 3,
                            'headingLevel' => !empty($group['spotlight']) ? 4 : 3,
                            'items' => $group['features'],
                        ])
                    </div>
                </div>
            </div>
        </section>
    @endforeach

    {{-- ---------------------------------------------------------------- --}}
    {{-- FAQ                                                              --}}
    {{-- ---------------------------------------------------------------- --}}
    <section
        class="site-section pl-section pl-section--alt"
        id="features-faq"
    >
        <div class="pl-wrap">
            <div class="pl-section-head pl-section-head--center">
                <p class="pl-eyebrow">Before you ask</p>
                <h2 class="pl-h2">The questions podcasters actually send us</h2>
            </div>

            @include('marketing.partials.faq', [
                'open' => 0,
                'items' => [
                    [
                        'q' => 'Do I have to move my podcast off my current host?',
                        'a' =>
                            '<p>No — and we would talk you out of it. Podlink reads your public RSS feed and works alongside Buzzsprout, Transistor, Libsyn, Captivate, Acast and anything else that publishes a standard feed. You keep your host, your feed URL and your subscribers.</p>',
                    ],
                    [
                        'q' => 'Where do the download numbers come from?',
                        'a' =>
                            '<p>From <strong>OP3</strong>, an open, independently operated podcast analytics prefix. You add the prefix once in your host; OP3 measures the downloads and Podlink reads them back. It is not our own counter, which is exactly the point — a sponsor can verify the source.</p><p>If you would rather not add a prefix, everything else in Podlink still works. You just will not see download charts.</p>',
                    ],
                    [
                        'q' => 'Is the AI going to make things up about my episode?',
                        'a' =>
                            '<p>Show notes, summaries, takeaways and timestamps are generated from the transcript of your episode, so they are grounded in what was actually said. You still get a review step before anything is published — Podlink drafts, you approve.</p>',
                    ],
                    [
                        'q' => 'Will everything sound like a chatbot wrote it?',
                        'a' =>
                            '<p>Only if you skip the setup. Templates and brand voice let you fix your structure, your section headings and your tone once, and every episode after that comes out in that shape. Most hosts spend their first session on this and then stop editing output almost entirely.</p>',
                    ],
                    [
                        'q' => 'What languages does Podlink support?',
                        'a' =>
                            '<p>Transcription and output generation both work across the major podcasting languages, and you can produce a second-language version of an episode’s notes, description and social copy in one pass — useful if your show is English but half your audience is not.</p>',
                    ],
                    [
                        'q' => 'What is podlink.fm?',
                        'a' =>
                            '<p>It is the link-in-bio page that ships with Podlink: every place your show is available to listen, your latest episodes, and whatever else you are pointing people at. Use the free <code>podlink.fm/yourshow</code> handle or point your own domain at it.</p>',
                    ],
                    [
                        'q' => 'Can my producer or editor work in this with me?',
                        'a' =>
                            '<p>Yes. The episode workspace is the shared surface — audio, transcript, notes, clips and social copy in one place — so handing an episode over is a link, not a folder of files and a Slack thread.</p>',
                    ],
                ],
            ])
        </div>
    </section>

    {{-- ---------------------------------------------------------------- --}}
    {{-- Closing CTA                                                      --}}
    {{-- ---------------------------------------------------------------- --}}
    @include('marketing.partials.cta', [
        'title' => 'Your next episode could publish itself.',
        'lead' =>
            'Connect your feed, publish as normal, and find the show notes, clips, newsletter and social copy already waiting for you.',
        'primaryCta' => $primaryCta,
        'secondaryCta' => $secondaryCta,
        'note' => 'Keep your podcast host. Cancel any time.',
    ])

@endsection
