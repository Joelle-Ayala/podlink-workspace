/**
 * Internal helpers shared by the Podlink component set.
 *
 * Nothing here is exported from the barrel — these are implementation details
 * of src/components, not part of the public component API.
 */

/** Join class names, dropping falsy entries. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Radii. BRAND.md §3 resolves the whole system to a handful of values and no
 * more: buttons are pills, cards 20px, media frames 20px in the shot spec,
 * CTA bands 32px, inputs/icon chips 12px. Tailwind's default scale has no
 * 20px or 32px step, so those two are written as arbitrary values here and
 * referenced from one place so they cannot drift.
 */
export const RADIUS_CARD = "rounded-[20px]";
export const RADIUS_BAND = "rounded-[32px]";
export const RADIUS_CHIP = "rounded-xl"; /* 12px */

/**
 * The marker class for a near-black band.
 *
 * globals.css sets `h1..h6 { color: var(--color-text-primary) }` in the base
 * layer with an element selector, so an inherited colour from an ancestor
 * utility never reaches a heading — on an ink band the headings would render
 * ink-on-ink. The `[&_hN]:` rules below re-assert white with enough
 * specificity to win.
 *
 * `on-ink` itself is not a Tailwind utility. It is a plain hook other
 * components match with the `[.on-ink_&]:` variant so cards, badges, inputs
 * and screenshot frames invert automatically inside an ink band — the same
 * behaviour BRAND.md describes for `.pl-section--ink`, without needing React
 * context (which server components cannot read).
 */
export const INK_BAND = cn(
  "on-ink",
  "text-text-on-ink/72",
  "[&_h1]:text-text-on-ink [&_h2]:text-text-on-ink [&_h3]:text-text-on-ink",
  "[&_h4]:text-text-on-ink [&_h5]:text-text-on-ink [&_h6]:text-text-on-ink",
  "[&_strong]:text-text-on-ink",
);

/**
 * Expands a control's hit area to 44px tall without changing its layout box.
 * Used by the `sm` button size, which BRAND.md draws at 36px.
 */
export const TOUCH_TARGET_44 =
  "relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']";
