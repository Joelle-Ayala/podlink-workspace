# Podlink Brand System

**podlink.ai** — AI show notes, clips, newsletters, OP3 download analytics, and podlink.fm link-in-bio pages.
Built by **Minting House**. Tagline: *Grow your show. Not your workload.*

---

## 0. The constraint that shapes everything

**There is no asset build step on deploy.** No node, no npm, no Vite build on Railway. `public/build/` ships committed as-is. A Tailwind utility class that is not already in the committed bundle **does not exist at runtime** — it renders nothing, silently.

So: **every style in this system is hand-written CSS served straight out of `public/`.** Do not add Tailwind classes to marketing pages. Do not add a class and assume it works because it works in the Tailwind docs.

Two files carry the whole system:

| File | Scope | What it is |
|---|---|---|
| `magicai/public/themes/default/assets/css/frontend/podlink-tokens.css` | `:root`, global | The token layer. Colour ramps, type scale, spacing, radii, shadows, motion. Loaded on **every** page (marketing + dashboard). |
| `magicai/public/themes/default/assets/css/frontend/podlink-marketing.css` | `.pl-page` only | The component layer for marketing pages. Consumes the tokens; owns no brand values. |

Plus brand artwork in `magicai/public/themes/default/assets/img/brand/`.

### Loading

`resources/views/default/layout/app.blade.php` (landing + marketing), immediately after `@vite($link)` and before `@stack('css')`:

```blade
<link rel="stylesheet" href="{{ custom_theme_url('assets/css/frontend/podlink-tokens.css') }}?v={{ config('marketing.asset_version', '1') }}" />
```

Same one-liner in `resources/views/default/panel/layout/partials/head.blade.php` after `@vite(...dashboardScssPath())`.

**Position matters.** After `@vite` so it wins equal-specificity `:root` ties against the compiled template CSS; before `@stack('css')` so per-page sheets can override tokens.

Bump `config/marketing.php` → `asset_version` whenever either CSS file changes. The files are served with no content hash.

---

## 1. Colour

### Format: bare HSL triplets

Every colour token is a **triplet, not a colour**. This matches the convention already used throughout `resources/views/default/scss/base/_vars.scss`.

```css
color: hsl(var(--pl-text-primary));
background: hsl(var(--pl-accent) / 12%);   /* free alpha, no extra token */
```

```css
color: var(--pl-accent);   /* ✗ renders nothing */
```

### The orange problem, with numbers

`#FF8C00` is a beautiful brand colour and a terrible text colour. Measured WCAG 2.1 relative-luminance ratios:

| Pair | Ratio | Normal text (4.5) | Large text (3.0) | UI/graphics (3.0) |
|---|---|---|---|---|
| `#FF8C00` on `#FFFFFF` | **2.33:1** | ✗ FAIL | ✗ FAIL | ✗ FAIL |
| `#FFFFFF` on `#FF8C00` | **2.33:1** | ✗ FAIL | ✗ FAIL | ✗ FAIL |
| `#FF8C00` on `#0f0f12` | **8.20:1** | ✓ AAA | ✓ AAA | ✓ PASS |
| `#0f0f12` on `#FF8C00` | **8.20:1** | ✓ AAA | ✓ AAA | ✓ PASS |
| `#FFFFFF` on `#0f0f12` | 19.14:1 | ✓ AAA | ✓ AAA | ✓ PASS |

**Consequences, stated as rules:**

1. **White text on brand orange is banned.** 2.33:1. The primary button uses **ink `#0f0f12` on orange** — 8.20:1, and it looks better anyway.
2. **Brand orange is never text on a light background.** For orange text on white use `--pl-accent-text-safe` = `--pl-orange-700` = **`#B85600`, 4.81:1** ✓.
3. **Brand orange is never a focus ring on white either** (2.33 < 3.0). Focus uses `--pl-orange-600` = **`#DB6E00`**: 3.36:1 on white ✓ and 5.69:1 on ink ✓, so one ring works on both.
4. **In dark mode the text-safe orange flips lighter, not darker.** `--pl-orange-700` is only 3.68:1 on ink. `--pl-accent-text-safe` becomes `--pl-orange-400` = **`#FFA538`, 9.74:1** ✓.

### Brand orange ramp

| Token | HSL | Hex | on `#fff` | on `#0f0f12` | Use |
|---|---|---|---|---|---|
| `--pl-orange-50` | `36 100% 96%` | `#FFF7EB` | 1.06 | 18.00 | warm tinted section band |
| `--pl-orange-100` | `35 100% 91%` | `#FFECD1` | 1.16 | 16.56 | badge / icon-chip background |
| `--pl-orange-200` | `34 100% 82%` | `#FFD7A3` | 1.35 | 14.13 | chart fill, disabled accent |
| `--pl-orange-300` | `34 100% 71%` | `#FFBF6B` | 1.63 | 11.77 | orange text on ink bands |
| `--pl-orange-400` | `33 100% 61%` | `#FFA538` | 1.96 | **9.74** | **dark-mode accent text**; primary-button hover |
| `--pl-orange-500` | `33 100% 50%` | **`#FF8C00`** | 2.33 | 8.20 | **BRAND.** Fills, borders, glows. |
| `--pl-orange-600` | `30 100% 43%` | `#DB6E00` | **3.36** | 5.69 | focus ring, non-text UI on light |
| `--pl-orange-700` | `28 100% 36%` | `#B85600` | **4.81** | 3.68 | **light-mode accent text** |
| `--pl-orange-800` | `24 92% 28%` | `#893A06` | 7.86 | 2.43 | link hover, text on tinted bands |
| `--pl-orange-900` | `20 85% 20%` | `#5E2508` | 12.04 | 1.59 | deep accent, rare |

`--pl-orange-500` is the shipped `--primary: 33 100% 50%` from `_vars.scss:88`, **unchanged**. Everything else is derived from it. Hue drifts warm-to-red as lightness drops so the dark steps read as burnt orange rather than mud.

### Neutral ramp

Four steps are the *existing* theme tokens re-homed onto a ramp, not replaced:

| Token | HSL | Hex | on `#fff` | Was |
|---|---|---|---|---|
| `--pl-neutral-0` | `0 0% 100%` | `#FFFFFF` | 1.00 | |
| `--pl-neutral-50` | `210 20% 98%` | `#F9FAFB` | 1.05 | |
| `--pl-neutral-100` | `210 16% 96%` | `#F3F5F6` | 1.09 | |
| `--pl-neutral-200` | `210 13% 92%` | `#E8EBEE` | 1.21 | ← border (bumped, see note) |
| `--pl-neutral-300` | `212 13% 86%` | `#D5DAE0` | 1.44 | |
| `--pl-neutral-400` | `214 12% 64%` | `#98A1AD` | 2.57 | |
| `--pl-neutral-500` | `217 12% 43%` | `#606B7B` | **5.40** | muted text |
| `--pl-neutral-600` | `222 14% 29%` | `#404654` | 9.45 | `--foreground` (`_vars.scss:98`) |
| `--pl-neutral-700` | `216 13% 21%` | `#2F343D` | 12.50 | `--lqd-gray #2e333b` (`_vars.scss:45`) |
| `--pl-neutral-800` | `213 13% 14%` | `#1F242A` | 15.60 | `--heading-foreground` (`_vars.scss:100`) |
| `--pl-neutral-900` | `240 9% 6%` | `#0F0F12` | 19.14 | `--tblr-body-bg` (`_vars.scss:66`) |

**One justified change:** the shipped `--border: 200 12% 95%` is 1.11:1 against white and effectively invisible — it's why the current landing page has cards that don't read as cards. Bumped to `210 13% 92%` (1.21:1). Still a hairline, now actually visible.

### Semantic tokens — use these, not the ramps

```
--pl-surface          --pl-text-primary       --pl-accent
--pl-surface-alt      --pl-text-body          --pl-accent-hover
--pl-surface-raised   --pl-text-muted         --pl-accent-active
--pl-surface-sunken   --pl-text-faint         --pl-accent-subtle
--pl-surface-ink      --pl-text-on-accent     --pl-accent-text-safe
--pl-surface-accent   --pl-text-on-ink        --pl-accent-ui-safe
                      --pl-text-inverted
--pl-border           --pl-focus-ring
--pl-border-strong    --pl-focus-ring-width
--pl-border-accent    --pl-focus-ring-offset
--pl-divider
```

Plus status: `--pl-success` / `-text` / `-bg`, and the same for `danger`, `warning`, `info`. The `-text` variants are the AA-on-background ones; the base is a fill.

### The brand gradient

Shipped stops kept **unchanged** (`_vars.scss:94-96`) as `--pl-gradient-from` / `-via` / `-to`, exposed as `--pl-gradient-brand` and `--pl-gradient-glow`.

**Decorative only.** `#FBD051` is 1.47:1 on white, `#FF981A` is 2.15:1, `#F46A25` is 3.03:1. Never put text in the gradient on a light background. On ink, all three clear 6:1.

### Dark mode

**The app uses `.theme-dark` on `<body>`** — `tailwind.config.js:13` declares `darkMode: ['class', '.theme-dark']`, and `_vars.scss` already contains a `:root:has(body.theme-dark)` rule. It does **not** use `.dark` or `[data-theme="dark"]`.

The token file scopes dark values to:

```css
.theme-dark, .dark, [data-theme='dark'], :root:has(body.theme-dark) { … }
```

`.dark` and `[data-theme='dark']` are forward-compatible aliases only — nothing sets them today. `:root:has(body.theme-dark)` is included because `:root` is an *ancestor* of `body`, so inheritance alone wouldn't flip tokens read outside `<body>`.

Dark values worth knowing: surface `#0F0F12`, surface-raised `#1A1A20`, text-primary white (19.14:1), text-body `#C9CFD8` (12.06:1), text-muted `#A7B1BE` (8.82:1), border `rgb(255 255 255 / ~18%)`. The shadow scale is deliberately flattened and given a top hairline highlight — drop shadows do not read on near-black.

---

## 2. Type

**Poppins is already loaded** by the theme (`resources/views/default/theme.json` → `landingPage.googleFonts.Poppins`) and injected by `layout/app.blade.php`. **Do not add a webfont request.**

**Weights actually loaded: `400, 500, 600, 700`. Nothing else exists.** Referencing 300 or 800 gets a synthesised faux weight that looks wrong and prints wrong. Tokens: `--pl-weight-regular|medium|semibold|bold`.

| Token | Size | Use |
|---|---|---|
| `--pl-text-2xs` | 11px | legal, tiny meta |
| `--pl-text-xs` | 12px | eyebrow |
| `--pl-text-sm` | 13px | badge, caption |
| `--pl-text-base` | 15px | UI default, card body |
| `--pl-text-md` | 16px | long-form body |
| `--pl-text-lg` | 18px | lead paragraph |
| `--pl-text-xl` | 21px | large lead |
| `--pl-text-2xl` | `clamp(1.35rem, 2.1vw, 1.75rem)` | h3 |
| `--pl-text-3xl` | `clamp(1.75rem, 2.8vw, 2.25rem)` | small h2 |
| `--pl-text-4xl` | `clamp(1.9rem, 3.4vw, 2.85rem)` | h2 |
| `--pl-text-5xl` | `clamp(2.4rem, 5.2vw, 4rem)` | h1 / hero |
| `--pl-text-6xl` | `clamp(3rem, 7vw, 5rem)` | display |

Ratio 1.200 (minor third) through the text steps; the three display steps go fluid so a 4rem hero headline doesn't overflow a 360px phone.

Line heights: `--pl-leading-display 1.08`, `-heading 1.2`, `-snug 1.35`, `-normal 1.5`, `-body 1.6`, `-relaxed 1.7`.

Tracking: Poppins is wide — big type needs negative tracking or it looks loose. `--pl-tracking-display -0.04em`, `-heading -0.03em`, `-tight -0.01em`, `-caps 0.08em` (pair with `text-transform: uppercase`).

Measure: `--pl-measure 46rem`, `--pl-measure-narrow 34rem`, `--pl-measure-wide 60rem`. Cap paragraph width. Always.

**Practical weight assignment:**

| Element | Weight | Size | Tracking |
|---|---|---|---|
| h1 / hero | 700 | `--pl-text-5xl` | `-0.04em` |
| h2 | 700 | `--pl-text-4xl` | `-0.03em` |
| h3 | 700 | `--pl-text-2xl` | `-0.03em` |
| Card title / h4 | 600 | 17px | `-0.01em` |
| Body / lead | 400 | 15–18px | 0 |
| Button, badge, eyebrow, label, link | 600 | 13–15px | 0 to `0.01em` |
| Nav link | 500 | 12–14px | 0 |

**Only four weights. If a design calls for a fifth, it's wrong.**

---

## 3. Space, radius, elevation, motion

**Spacing** — 4px base: `--pl-space-1` (4px) … `--pl-space-32` (128px). Section rhythm: `--pl-section-py` = 112px desktop → 64px ≤991px → 48px ≤575px.

**Radius** — the template ships three competing radii (`--tblr-border-radius: 13px`, `--card-rounded: xl` = 12px, `--button-rounded: full`). Podlink resolves this to three sizes and no more:

| Token | Value | Use |
|---|---|---|
| `--pl-radius-xs` | 6px | swatch, tiny chip |
| `--pl-radius-sm` | 8px | tag |
| `--pl-radius-md` | 12px | **input**, icon chip |
| `--pl-radius-lg` | 20px | **card**, panel |
| `--pl-radius-xl` | 32px | **media frame**, CTA band |
| `--pl-radius-2xl` | 40px | hero art frame |
| `--pl-radius-pill` | 999px | **button**, badge, avatar |

Aliases: `--pl-radius-card`, `--pl-radius-button`, `--pl-radius-input`, `--pl-radius-media`.

**The rule: buttons are pills. Cards are 20px. Media frames are 32px. Inputs are 12px.** Nothing else.

**Elevation** — one light source, top-down. Shadows are tinted with the ink hue (`--pl-shadow-color: 220 20% 8%`), never pure black, so they read as depth rather than dirt.

`--pl-shadow-xs|sm|md|lg|xl|2xl`, plus `--pl-shadow-inset`, `--pl-shadow-media`, and exactly one coloured shadow: `--pl-shadow-brand` / `--pl-shadow-brand-hover`, **reserved for the primary button**. If an orange glow appears anywhere else, delete it.

**Motion** — nothing longer than 560ms, nothing that moves further than 8px on hover.

`--pl-duration-instant 80ms` / `-fast 120ms` / `-base 200ms` / `-slow 320ms` / `-slower 560ms` / `-ambient 700ms`.
`--pl-ease-standard cubic-bezier(.2,0,0,1)` is the default. Also `-out`, `-in`, `-emphasis`.
Composites: `--pl-transition-colors`, `--pl-transition-transform`, `--pl-transition-all`.
Hover displacement: `--pl-lift-sm -2px` (buttons), `--pl-lift-md -4px` (cards).

**Reduced motion** collapses the duration tokens to `0.01ms` and the lift tokens to `0px`, so anything built on tokens becomes instant automatically. It uses `0.01ms` and **not** `0` on purpose — a zero-length transition never fires `transitionend`, which breaks JS that waits on it (`frontend-animations.js`, Alpine `x-transition`).

**Layout** — `--pl-container 1170px` (matches the `xl` screen in `tailwind.landing-page.config.js`), `--pl-container-narrow 960px`, `--pl-container-prose 46rem`, `--pl-gutter 20px`.

Breakpoints are **reference tokens only** — custom properties are not valid inside `@media`, so you must hardcode the px. They exist so everyone hardcodes the *same* px: `sm 576 / md 768 / lg 992 / xl 1170`. Marketing CSS uses max-width queries at `575 / 767 / 991`.

---

## 4. Components

All component classes live under `.pl-page` in `podlink-marketing.css`. Marketing pages get `.pl-page` from `resources/views/default/marketing/layout.blade.php`.

### Layout primitives

| Class | What it does |
|---|---|
| `.pl-page` | Page root. Declares the local alias tokens. |
| `.pl-wrap` | Centred container, max `--pl-maxw` (1170px), 20px gutter. |
| `.pl-section` | Full-width band, `padding-block: var(--pl-section-py)`. |
| `.pl-section--tight` | 60% of the section padding. |
| `.pl-section--alt` | Light grey band (`--pl-surface-alt`). |
| `.pl-section--ink` | Near-black band. Flips headings to white, body to 72% white, and inverts cards, strips, badges, inputs and shot frames automatically. |
| `.pl-section-head` / `--center` | Heading block, capped at 46rem. |
| `.pl-grid` / `--2` / `--4` | 3-, 2- or 4-column grid, 24px gap. Collapses to 2 at ≤991px, 1 at ≤575px. |

### Section band alternation

The page rhythm is deliberate and should not be improvised:

```
hero (ink)  →  white  →  alt (grey)  →  white  →  ink  →  white  →  CTA (ink card)  →  footer
```

**Rules:** never two `--alt` bands in a row; never an `--ink` band directly against the ink hero or the footer (you lose the edge); at most two ink bands per page, or the orange stops being a highlight.

### Buttons

```html
<a class="pl-btn pl-btn--primary" href="…">Start free</a>
<a class="pl-btn pl-btn--secondary pl-btn--lg" href="…">Book a demo</a>
<a class="pl-btn pl-btn--outline pl-btn--sm" href="…">See pricing</a>
<a class="pl-btn pl-btn--ghost" href="…">Learn more</a>   <!-- ink bands only -->
<div class="pl-btn-row pl-btn-row--center"> … </div>
```

| Variant | Fill | Text | Contrast | Hover |
|---|---|---|---|---|
| `--primary` | `#FF8C00` | ink `#0f0f12` | **8.20:1** ✓ | brightens to `#FFA538` (9.74:1 ✓) + lift −2px |
| `--secondary` | ink `#0f0f12` | white | 19.1:1 ✓ | lightens to `#2e333b` |
| `--outline` | transparent, 2px border | heading colour | 15.6:1 ✓ | inverts to ink fill / white text |
| `--ghost` | transparent, 2px white/25% border | white | ink bands only | inverts to white fill / ink text |

Sizes: `--sm` (36px tall, 14px), default (44px, 15px), `--lg` (52px, 16px). Plus `--block` for full width.

States:
- **Hover** — `translateY(-2px)`, colour swap, deeper shadow. Collapses under `prefers-reduced-motion`.
- **Focus** — `outline: 2px solid hsl(var(--pl-focus))` (`#DB6E00`), offset 3px. Works on both light and ink.
- **Disabled** — `[disabled]`, `[aria-disabled="true"]` or `.pl-btn--disabled`. Drops to a **neutral** fill, not a faded orange: orange at reduced opacity lands around 1.6:1.

**Never more than one `--primary` in a viewport.** Two orange buttons is two primary actions, which is no primary action.

### Links

`.pl-link` — `#B85600`, 4.81:1 ✓, weight 600, optional chevron `<svg>` that nudges 3px on hover. Hover darkens to `#893A06` **and underlines** (colour-only hover states fail 1.4.1 Use of Color).

### Card

```html
<article class="pl-card">
  <span class="pl-card__icon"><svg …></svg></span>
  <h3 class="pl-card__title">AI show notes</h3>
  <p class="pl-card__body">…</p>
  <p class="pl-card__foot"><a class="pl-link" href="…">Read more</a></p>
</article>
```

20px radius, 32px padding, 1px `--pl-border`, no resting shadow. `.pl-card__foot` is pushed to the bottom with `margin-top: auto`, so cards in a row have aligned footers regardless of body length.

`a.pl-card` or `.pl-card--interactive` adds hover: lift −4px, border → `--pl-brand / 45%`, `--pl-shadow` appears. **A card only lifts if the whole card is a link.** A card with a link inside it must not lift.

Inside `.pl-section--ink`: border `white/12%`, background `white/4%`, title white.

`.pl-card__icon` — 44px chip, 12px radius, `--pl-brand / 12%` background, `#B85600` icon (4.26:1 on the tinted chip ✓). 22px stroke icons at `stroke-width: 1.6`.

### Badge / pill

- `.pl-eyebrow` — the section label above a heading. Pill, 13px/600, orange-tinted background, `#B85600` text (**4.33:1** on the tint ✓). On ink: `brand/18%` background, `#FFBF6B` text.
- `.pl-badge` — inline data pill (plan name, "New", a count). Same geometry, 12px. Variants `--neutral` (grey) and `--solid` (orange fill, ink text, 8.20:1).

### Form input

```html
<div class="pl-field">
  <label class="pl-label" for="rss">Your RSS feed</label>
  <input class="pl-input" id="rss" type="url" placeholder="https://feeds.example.com/show.xml">
  <p class="pl-help">Works with Buzzsprout, Transistor, Libsyn, Captivate and anything with a standard feed.</p>
</div>
```

`.pl-field` `.pl-label` `.pl-input` `.pl-textarea` `.pl-select` `.pl-help` `.pl-error` `.pl-form-inline`.

12px radius (**not** a pill — a pill input reads as a search box), 44px tall, 1px border. Focus: border → `#DB6E00` plus a 3px `--pl-brand / 22%` ring. Error: `[aria-invalid="true"]` turns the border red and `.pl-error` carries the message — **never colour alone**.

Placeholder uses `--pl-muted-fg` (5.40:1), not `--pl-text-faint`.

On ink bands the input inverts automatically: `white/6%` fill, `white/20%` border, white text, 62%-white placeholder (7.68:1 ✓). A white input on an ink band burns a hole in the band.

### Hero, strip, feature, FAQ, CTA

| Class | Notes |
|---|---|
| `.pl-hero` | Ink band, centred, radial orange glow top, 1px orange gradient hairline at the bottom edge. `.pl-hero__inner` caps at 48rem, `.pl-hero__note` is the "no card required" line (45% white = 4.53:1 ✓). |
| `.pl-strip` / `__item` / `__value` / `__label` / `__logo` | Stat or logo row. Hairline grid via a 1px gap over a border-coloured background. |
| `.pl-feature` / `--reverse` / `__body` / `__list` / `__media` / `__cta` | Alternating text-and-visual block. 2 columns, 4rem gap, single column ≤991px. `__list` items get an orange check chip. |
| `.pl-group` / `__head` / `__intro` / `__grid` | Feature category grouping on `/features`. |
| `.pl-faq` / `__item` / `__q` / `__a` | Native `<details>` accordion, **no JS**. The chevron rotates on `[open]`. |
| `.pl-cta` | Ink card with an orange radial glow, 32px radius, centred. The page's closing ask. |
| `.pl-mock*` | Placeholder "product" graphic — window bar, skeleton lines, bar chart. **Temporary.** Replace with `.pl-shot` when real screenshots exist. |

### Product visual / screenshot treatment

There are no product screenshots yet. When they arrive they will arrive at five aspect ratios from three people. `.pl-shot` forces every one into the same frame so the page survives it.

```html
<figure class="pl-shot">
  <div class="pl-shot__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
  <img src="…" alt="Podlink episode workspace showing transcript, show notes and clips" width="1440" height="900">
</figure>
<p class="pl-shot-caption">The episode workspace.</p>
```

**Spec — this is the part that matters, because consistency is the whole point:**

| Property | Value |
|---|---|
| Frame radius | `--pl-radius-lg` (20px) |
| Frame border | 1px `--pl-border`; on ink bands `.pl-shot--ink` → 1px `white/12%` |
| Frame background | `--pl-surface`; on ink `--pl-ink` |
| Shadow | `--pl-shadow-lg` (`0 15px 33px`); on ink `0 24px 60px rgb(0 0 0 / 45%)` |
| Window bar | `.pl-shot__chrome`, 3 dots, first one orange. Optional, `aria-hidden`. |
| Export width | **1440px logical, exported @2x = 2880px** |
| Export background | The app's own background. **No** browser chrome, **no** macOS window shadow, **no** desktop wallpaper, **no** device mockup. |
| Baked-in styling | **None.** No rounded corners, no drop shadow, no border in the image. The frame supplies all three. |
| Format | PNG for UI. WebP acceptable. Always set `width`/`height` to reserve layout space. |
| Alt text | Describe what the screen *shows*, not that it is a screenshot. |
| Caption | `.pl-shot-caption` **outside** the frame. Never overlay text on a screenshot. |
| Bleed | `.pl-shot--bleed` runs the frame 6rem past the column edge on ≥992px — "there is more app than fits". Desktop only. Use once per page at most. |

**Rules:** a screenshot is always in a `.pl-shot`, never a bare `<img>`. Never tilt or 3-D perspective a screenshot. Never put a screenshot on the brand gradient.

### Nav (site header)

The header is the **stock template's** `resources/views/default/layout/header.blade.php` and is **not** yet on the Podlink system. It is transparent white-on-hero, then goes fixed with a white background and black text (`.lqd-is-sticky`).

Target spec when it is reworked:

| Property | Value |
|---|---|
| Height | `--pl-header-height` 77px desktop / 65px mobile |
| Transparent state | White logo (`podlink-wordmark-inverse.svg`), white links, `white/10%` bottom hairline |
| Sticky state | `--pl-surface` background, `--pl-shadow-xs`, ink logo (`podlink-wordmark.svg`), `--pl-text-body` links |
| Link | 14px / weight 500; hover → `--pl-text-primary` |
| Active link | `--pl-accent-text-safe` + a 2px `--pl-accent` underline (colour alone is not enough) |
| Header CTA | `.pl-btn .pl-btn--primary .pl-btn--sm` |
| Mobile drawer | `--pl-surface-ink` background, white links. Currently `#343C57` — a stock-template slate that is not a Podlink colour. |
| Focus | Visible ring on every link, including inside the drawer |

### Footer

Also still stock. It currently paints a **magenta/indigo radial gradient** (`#a12a91` → `rgba(33,13,123,.83)`) on a pure `#000` background — leftover MagicAI purple, one of the most visible off-brand elements on the site.

Target spec:

| Property | Value |
|---|---|
| Background | `--pl-surface-ink` `#0f0f12` (not `#000`) |
| Ambient | `--pl-gradient-glow`, orange, top-left, low opacity — or nothing at all |
| Wave divider | Keep the existing SVG; it fills `--pl-surface` so it reads as the page bleeding into the footer |
| Big headline | `--pl-text-6xl`, weight 700, white → transparent gradient fill |
| Body text | `white/62%` (7.68:1) — **not** the current `opacity-50` |
| Column headings | 13px / 600 / white |
| Links | `white/62%`, hover white + underline |
| Divider | `white/10%` |
| Legal row | 12px, `white/62%` |
| CTA | `.pl-btn--ghost` |

---

## 5. Logo & favicon

### What exists (audited)

In `public/upload/images/` (settings-driven, referenced by `$setting->logo_path` / `logo_sticky_path` / `favicon_path`):

| File | What it is |
|---|---|
| `logo/V5pL--podlink-logo.svg` | Wordmark: orange pill + 7-bar waveform + "PodLink" — "Pod" in cream `#f0ede6`, "Link" in `#FF8C00`. Uses `<text>` with an **embedded base64-subsetted Poppins woff2**. |
| `logo/ITEp-dashboard-dark-podlink-logo.svg` | **Byte-identical** to the above. |
| `logo/eJ4s-sticky-podlink-logo.svg` | **Byte-identical** to `mieA-dashboard-podlink-logo.svg`, and same artwork as above. |
| `logo/mieA-dashboard-podlink-logo.svg` | ↑ |
| `logo/G1BK-collapsed-podlink-logo.svg` | Square mark, orange pill, **cream `#f0ede6`** bars |
| `logo/LZqS-collapsed-dark-podlink-logo.svg` | Square mark, orange pill, **ink `#0f0f12`** bars |
| `favicon/xeLz-podlink-favicon.svg` | 32×32, orange pill, 3 ink bars — correct |

### Three real defects

1. **The sticky-header wordmark is illegible.** `eJ4s-sticky-podlink-logo.svg` is byte-identical to the dark-background wordmark. Its "Pod" is cream `#f0ede6`, which on the **white** sticky nav is **1.17:1** — invisible. "Link" at `#FF8C00` on white is 2.33:1. Logotypes are exempt from WCAG contrast requirements, but 1.17:1 is not a design decision, it's a missing file.
2. **The light and dark collapsed marks are backwards.** The "light" variant (`G1BK`) uses cream bars on the orange pill: **1.99:1** — the waveform disappears. The "dark" variant (`LZqS`) uses ink bars: 8.20:1 — correct. Since the orange pill is *its own background*, only the ink version is ever correct. **There should be one mark, not two.**
3. **The wordmark depends on a font.** It draws "PodLink" with `<text font-family="PoppinsSB, Poppins, sans-serif">` plus an embedded woff2. If the `@font-face` fails — email clients, some SVG rasterisers, Figma import, PDF export, any consumer that strips `<style>` — the logo silently reflows in Arial. A logo must be outlines.

### What's missing entirely

- `favicon.ico` (32+16 multi-res) — `layout/app.blade.php` falls back to `assets/favicon.ico`, which is the **stock MagicAI** icon
- `apple-touch-icon.png` 180×180 (iOS has no SVG favicon support and will render a screenshot instead)
- `favicon-32.png` / `favicon-16.png` fallbacks
- Android `icon-192.png` / `icon-512.png` + a maskable 512 variant
- `site.webmanifest`
- **Open Graph image, 1200×630.** `marketing/layout.blade.php` already emits `<meta property="og:image">` and `twitter:card=summary_large_image` — but only `@if (!empty($ogImage))`, and nothing supplies a default. Every Podlink link shared today previews with no image.
- A monochrome one-colour lockup (for print, sponsor decks, partner pages)
- Written clear-space and minimum-size rules → now specified below

### What I produced

New, in `magicai/public/themes/default/assets/img/brand/` — all hand-authored SVG, all **outlined paths, zero font dependency**, generated from Poppins Bold (700 — a weight the theme actually loads):

| File | viewBox | Purpose |
|---|---|---|
| `podlink-wordmark.svg` | `0 0 412 120` | Primary lockup, **light** backgrounds. Mark + "PodLink" in ink `#0F0F12` (15.6:1). |
| `podlink-wordmark-inverse.svg` | `0 0 412 120` | Primary lockup, **dark** backgrounds. Same mark + white text (19.1:1). |
| `podlink-mark.svg` | `0 0 120 120` | Standalone mark. **One universal version.** |
| `podlink-favicon.svg` | `0 0 32 32` | 3-bar reduction — five bars turn to mush at 16px. |
| `podlink-appicon.svg` | `0 0 512 512` | Full-bleed orange app-icon source, artwork inside the 80% maskable safe zone. |

**Design decision — the mark carries the orange, the wordmark is monochrome.** The mark's orange pill is its own background, so ink bars sit at 8.20:1 no matter what is behind the lockup, and the wordmark text is a single ink-or-white value that can never fail. This removes both the sticky-header bug and the light/dark-mark confusion by construction.

This is a **change from the deployed two-tone "Pod|Link"**. If the team prefers two-tone (it does help the name parse), the minimum fix is: light-background variant must use **ink** for "Pod", never cream. That's a designer call, not a code call.

**Usage rules**

- **Clear space:** the height of the pill (84 units at the native viewBox ≈ 0.7× lockup height) on all four sides. Nothing enters it.
- **Minimum size:** lockup 132px wide / 38px tall. Below that, use the mark alone. Mark: 24px. Favicon: use the 3-bar `podlink-favicon.svg`.
- **Do not:** recolour the pill; put the mark on an orange background; add a shadow, outline or gradient to the logo; stretch it; rotate it; set the wordmark in any weight but Poppins Bold; re-typeset "PodLink" in live text.
- **On photography:** use `podlink-wordmark-inverse.svg` over a dark scrim, never the light version.

### Still needs a human / raster export

Everything below needs a rasteriser (there is none in this environment) and, for the OG image, a designer:

| Asset | Size | Source |
|---|---|---|
| `favicon.ico` | 32 + 16 multi-res | `podlink-favicon.svg` |
| `apple-touch-icon.png` | 180×180 | `podlink-appicon.svg` |
| `icon-192.png`, `icon-512.png` | 192, 512 | `podlink-appicon.svg` |
| `icon-maskable-512.png` | 512 | `podlink-appicon.svg` (safe zone is already correct) |
| `site.webmanifest` | — | `theme_color #FF8C00`, `background_color #0f0f12` |
| **`og-default.png`** | **1200×630** | **Designer.** Ink `#0f0f12` field, orange glow top-right, inverse lockup, the tagline at `--pl-text-4xl`/700 white. |

Then point `$setting->favicon_path` at the new `.ico` and set a default `$ogImage` in `MarketingController`.

---

## 6. What's inconsistent today (audit)

### Leftover template purple — the biggest problem

The site is a lightly-reskinned MagicAI template. The orange was appended over the top; the purple was never removed. Still live:

| Where | Value |
|---|---|
| `layout/footer.blade.php:4` | `radial-gradient(circle at 0% -20%, #a12a91, rgba(33,13,123,.83), …)` — magenta → indigo |
| `landing-page/blog/section.blade.php:12` | `bg-[#60027C]` + `text-[#60027C]` — purple eyebrow |
| `landing-page/faq/section.blade.php:14` | `bg-[#60027C]` + `text-[#60027C]` |
| `landing-page/testimonials/section.blade.php:21` | `bg-[#28027C]` + `text-[#28027C]` |
| `landing-page/testimonials/section.blade.php:8` | `linear-gradient(to bottom, transparent, #F0EFFA, transparent)` — lavender wash |
| `landing-page/custom-templates/section.blade.php:15,51,52,63` | `bg-[#083D91]`, `text-[#5A4791]`, `bg-[#885EFE]` |
| `landing-page/generators/item-content.blade.php:7` | `bg-[#F3E5F5]` — lilac |
| `landing-page/header/floating-button.blade.php:11` | `from-[#3655df] via-[#A068FA] to-[#327BD1]` — blue/violet gradient |
| `landing-page/banner/section.blade.php:13` | `from-violet-600 to-red-500` + `animate-hue-rotate` |
| `scss/components/_custom.scss:12` | `linear-gradient(to right, #8d65e9, #5391e4, #6bcd94)` |
| `scss/components/_custom.scss:2` | `linear-gradient(to bottom right, #82e2f4, #8a8aed)` |
| `layout/header.blade.php:41`, `landing-page/header/preheader.blade.php:2` | `bg-[#343C57]` — stock slate-navy |

**Nine different accent colours on one landing page.** The eyebrow pill above "Blog", "FAQ", "Testimonials" and "Templates" is a different colour in each section, and none of them is orange.

### Ad-hoc colours with no token behind them

`#002A40`, `#A2B2C9`, `#6C727B`, `#262626`, `#010101`, `#E5E6E6`, `#f0f0f2`, `#d7d7d9`, `#7c7c7e`, `#343C57`. All hardcoded `bg-[#…]` / `text-[#…]` arbitrary values. None derived from anything.

### Mismatched radii

Seven different radius values across the landing-page blades: `rounded-md` (6px, ×8), `rounded-lg` (8px, ×5), `rounded-xl` (12px, ×6), `rounded-2xl` (×2), `rounded-3xl` (×1), `rounded-full` (×6), and a raw `rounded-[50px]` on the how-it-works panel. Meanwhile `_vars.scss` declares three more competing defaults (`--tblr-border-radius: 13px`, `--card-rounded: xl`, `--button-rounded: full`). **Nothing in the codebase agrees on what a corner looks like.**

### Competing shadows

Blades use Tailwind's stock `shadow-md` / `shadow-lg` / `shadow-xl`, but `tailwind.landing-page.config.js` **redefines** `xs/sm/lg/xl` with different values, and `_vars.scss` adds `--lqd-shadow-xs`, `--shadow: 0 4px 7px black/4%`, and `--card-shadow: none`. Header sticky uses yet another one-off: `shadow-[0_4px_20px_rgba(0,0,0,0.03)]`. Four independent shadow systems.

### Type

Not chaotic, but not a scale either. Weights are actually fine (`font-medium` ×14, `font-semibold` ×11, `font-bold` ×3, `font-normal` ×1 — all within the four loaded weights). Sizes are the problem: arbitrary values everywhere — `text-[64px]`, `text-[100px]`, `text-[45px]`, `text-[18vw]`, `text-[26px]`, `text-[13px]`, `text-[12px]`, `text-[20px]`, `text-[14px]`. No ratio, no named steps. `_vars.scss` separately defines an `--h1…--h6` scale that the landing page ignores entirely.

### Contrast failures found and fixed in `podlink-marketing.css`

The sibling agent's stylesheet was structurally good but had five colour bugs, all now fixed:

| What | Was | Now |
|---|---|---|
| Primary button label | white on `#FF8C00` — **2.33:1** | ink on `#FF8C00` — **8.20:1** |
| Primary button hover | `#F46A25` (darkened) | `#FFA538` (brightened), ink text **9.74:1** |
| Eyebrow / badge text | `#F46A25` on the tint — **2.73:1** | `#B85600` — **4.33:1** |
| Card icon + feature checkmark | `#e0700a` on the chip — **2.87:1** | `#B85600` — **4.26:1** |
| Link hover | went *up* to `#FF8C00` — **2.33:1** | goes down to `#893A06` + underline |
| Focus ring | `#FF8C00` — **2.33:1** on white | `#DB6E00` — 3.36:1 on white, 5.69:1 on ink |
| `.pl-muted`, `.pl-strip__label` | `opacity: .72` → **4.31:1** | `--pl-muted-fg` `#606B7B` — **5.40:1** |
| `--pl-surface-alt` | `240 25% 98%` (violet tint) | `210 20% 98%` (true cool neutral) |

---

## 7. How to add a new page and stay on brand

1. **Create the view under `resources/views/default/marketing/`** and extend the marketing layout. You get `.pl-page`, the header, the footer, canonical + OG tags, and both stylesheets.

   ```blade
   @extends('marketing.layout')

   @section('marketing')
     @include('marketing.partials.hero', [...])
     …
   @endsection
   ```

   `$metaTitle`, `$metaDescription`, `$canonical`, `$ogImage` are optional and normally supplied by `MarketingController`.

2. **Do not write Tailwind classes.** They will not render. If you need something new, add hand-written CSS to `podlink-marketing.css`, scoped under `.pl-page`, and bump `config/marketing.php` → `asset_version`.

3. **Compose from existing classes first.** `.pl-section` → `.pl-wrap` → `.pl-section-head` → `.pl-grid` → `.pl-card`. Roughly 90% of a marketing page is these five plus `.pl-btn`. Check the class tables in §4 before inventing anything.

4. **Never hardcode a colour, radius, shadow, or duration.** Reference a token. If the value you want isn't in the token file, that's the conversation — not a one-off hex.

5. **Follow the band rhythm** from §4: ink hero → white → alt → white → ink → white → ink CTA → footer. Never two `--alt` in a row. Never more than two ink bands.

6. **One primary button per viewport.** Everything else is `--secondary`, `--outline` or `.pl-link`.

7. **Every screenshot goes in a `.pl-shot`.** Export at 1440 logical @2x, no chrome, no baked shadow. See the spec table in §4.

8. **Before you ship, check four things:**
   - Any orange text on a light background? It must be `--pl-accent-text-safe`, never `--pl-accent`.
   - Any white text on orange? Fix it.
   - Does every interactive element have a visible focus ring?
   - Is any state communicated by colour alone? Add an icon, an underline, or text.

9. **Adding a token?** Put it in `podlink-tokens.css` on `:root`, add the dark-mode value under the `.theme-dark` block, and add a row to the tables in this file. A token that isn't documented gets duplicated by the next person.

---

## 8. Open questions — need a human

| # | Decision | Why it needs a person |
|---|---|---|
| 1 | **Ink-on-orange primary button.** The old white-on-orange was 2.33:1 and had to change. Ink is the only compliant option that keeps an orange fill. The alternative is an ink-filled primary with orange reserved for accents — a different brand feel. | Visual identity call. One token flips it: `--pl-brand-foreground`. |
| 2 | **Monochrome wordmark vs two-tone "Pod\|Link".** I produced monochrome because it can never fail contrast. Two-tone helps the name parse and is what's deployed. | Brand call. Either way, the sticky-header file **must** be fixed — 1.17:1 is a bug, not a style. |
| 3 | **Is the pill + waveform mark the mark?** It's competent and already deployed, but it reads as a generic audio player. Nothing in it says *link*, which is half the name and the whole podlink.fm product. | Real identity work. Worth a designer if there's budget. |
| 4 | **De-purpling the stock landing page.** §6 lists ~13 files. Mechanical but it touches every section of the live homepage. Needs a decision on whether to reskin the stock page or replace it with a `.pl-page` marketing page. | Scope + risk call. My recommendation: **replace**, don't reskin. The stock page fights the system at every turn. |
| 5 | **Default OG image.** Every shared Podlink link currently previews with no image. Spec is in §5; the meta tag is already wired. | Needs a designer + a rasteriser. Highest-leverage single missing asset. |
| 6 | **Header + footer reskin.** Both are still stock and both are settings-driven from the DB, so some of it is admin config rather than code. | Needs someone with admin access to confirm which fields drive what. |
| 7 | **Dashboard adoption.** The token file now loads in the panel but nothing consumes it — the dashboard is still Tabler + the stock theme. Migrating it is a separate, larger project. | Product priority call. |
| 8 | **Illustration / iconography style.** Icons are currently Tabler outline at `stroke-width: 1.6`. That's a fine default but it was never chosen. There is no illustration style at all. | Needs a designer before any marketing page needs art. |

---

*Generated for Podlink (Minting House). Token file: `magicai/public/themes/default/assets/css/frontend/podlink-tokens.css`. Component file: `magicai/public/themes/default/assets/css/frontend/podlink-marketing.css`.*
