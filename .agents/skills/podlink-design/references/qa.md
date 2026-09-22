# Visual QA

A successful build is not visual acceptance.

## Required loop for meaningful UI changes

1. Run the actual site/surface.
2. Use realistic product content/data where possible.
3. Capture desktop.
4. Capture tablet/mobile.
5. Review the full page/screen.
6. Log visual problems.
7. Fix them.
8. Capture again.

Repeat until the composition is coherent.

## Baseline viewports

- Desktop: 1440px wide
- Tablet: ~834px wide
- Mobile: 390px wide
- Narrow mobile: 360px when the surface has risky layouts

For scroll-heavy pages, capture both full-page and key scroll states.

## What to inspect

### Whole-page composition

- Does the page have a clear beginning, peak and close?
- Do adjacent sections feel accidentally repetitive?
- Are there too many backgrounds, borders or containers?
- Is the primary action visually obvious?
- Does real product/media appear early enough?

### Typography

- Heading wraps are intentional.
- Paragraph measure is readable.
- No orphaned one-word headline lines when avoidable.
- Type hierarchy survives mobile.

### Product imagery

- UI remains legible.
- Crop proves the claim.
- Frame/caption treatment is consistent.
- No placeholder/fake data is presented as real.

### Responsive

- Product and copy order is intentional.
- Screenshots are cropped/re-authored rather than simply tiny.
- CTAs stack cleanly.
- No horizontal overflow.
- Navigation/drawer works with touch and keyboard.

### Interaction

- hover does not hide information,
- focus is visible,
- controls have sufficient touch area,
- sticky/pinned elements do not obscure content,
- reduced-motion behavior remains understandable.

### Analytics

- primary metric dominates supporting metrics appropriately,
- chart labels are readable,
- sources/context are visible,
- tables/lists adapt sensibly on mobile.

## Screenshot artifacts

When tooling exists, store review screenshots in a non-production artifact location such as:

`artifacts/visual/<route-or-feature>/`

Suggested names:

- `desktop-1440.png`
- `tablet-834.png`
- `mobile-390.png`
- `mobile-360.png`
- `reduced-motion.png` when relevant

Do not add review screenshots to the public site's asset bundle unless they are intentionally curated marketing assets.

## Completion note

A design PR should state:

- which viewports were reviewed,
- what issues were found and fixed,
- any known visual debt,
- whether reduced-motion was reviewed,
- whether the final surface still contains placeholder product imagery.
