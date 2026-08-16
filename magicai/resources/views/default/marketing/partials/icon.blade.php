{{--
    Inline SVG icon map for the marketing pages.

    WHY NOT <x-tabler-*>: those come from a vendor icon package and an unknown
    name throws at render time. This map is closed — an unknown $name renders
    the neutral fallback and the page still ships.

    Usage: @include('marketing.partials.icon', ['name' => 'sparkles'])
--}}
@php
    $plIconName = $name ?? 'dot';
    $plIcons = [
        'rss' => '<path d="M5 19a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M4 4a16 16 0 0 1 16 16"/><path d="M4 11a9 9 0 0 1 9 9"/>',
        'upload' => '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 9l5 -5l5 5"/><path d="M12 4l0 12"/>',
        'chart' => '<path d="M3 3v18h18"/><path d="M9 17V9"/><path d="M13 17V5"/><path d="M17 17v-6"/>',
        'transcript' => '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 9h1"/><path d="M9 13h6"/><path d="M9 17h6"/>',
        'sparkles' => '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9 -5.6L4.5 10.5l5.6 -1.9z"/><path d="M18 16.5l.7 2l2 .7l-2 .7l-.7 2l-.7 -2l-2 -.7l2 -.7z"/>',
        'headline' => '<path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h7"/>',
        'mic' => '<path d="M9 2m0 3a3 3 0 0 1 3 -3a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3a3 3 0 0 1 -3 -3z"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M8 21l8 0"/><path d="M12 17l0 4"/>',
        'megaphone' => '<path d="M3 8a3 3 0 0 1 3 -3h2l4.5 -3v16l-4.5 -3h-2a3 3 0 0 1 -3 -3z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
        'template' => '<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M4 14m0 2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2z"/><path d="M16 14l4 0"/><path d="M16 18l4 0"/>',
        'globe' => '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/>',
        'scissors' => '<path d="M6 4a2 2 0 1 0 0 4a2 2 0 0 0 0 -4"/><path d="M6 16a2 2 0 1 0 0 4a2 2 0 0 0 0 -4"/><path d="M8.6 8.6l10.4 10.4"/><path d="M8.6 15.4l10.4 -10.4"/>',
        'mail' => '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/><path d="M3 7l9 6l9 -6"/>',
        'link' => '<path d="M9 15l6 -6"/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/>',
        'share' => '<path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/>',
        'clock' => '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/>',
        'shield' => '<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"/>',
        'dot' => '<path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>',
    ];
@endphp
<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
>{!! $plIcons[$plIconName] ?? $plIcons['dot'] !!}</svg>
