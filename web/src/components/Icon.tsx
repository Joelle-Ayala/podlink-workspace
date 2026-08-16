import type { ReactNode } from "react";
import type { IconName } from "@/content/types";
import { cn } from "./utils";

export interface IconProps {
  /** Any member of the `IconName` union in src/content/types.ts. */
  name: IconName;
  /** Rendered pixel size. Defaults to 22px, the BRAND.md card-icon size. */
  size?: number;
  /** BRAND.md §8: outline icons at 1.6. */
  strokeWidth?: number;
  className?: string;
}

/**
 * Outline icon set, one 24×24 grid, stroke-only so every glyph takes its
 * colour from `currentColor`.
 *
 * Every name in the `IconName` union has an entry here. Unknown names — which
 * can only reach this component through untyped content — fall back to
 * `fallback` rather than rendering nothing or throwing.
 */
const ICONS: Record<IconName | "fallback", ReactNode> = {
  chart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-8" />
      <path d="M12 20V5" />
      <path d="M17 20v-5" />
    </>
  ),
  notes: (
    <>
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </>
  ),
  transcript: (
    <>
      <path d="M18 4a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </>
  ),
  clip: (
    <>
      <rect x="3" y="6" width="12" height="12" rx="3" />
      <path d="M15 10.5 19.4 8a1 1 0 0 1 1.6.9v6.2a1 1 0 0 1-1.6.9L15 13.5Z" />
    </>
  ),
  social: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.9 7.6-3.8" />
      <path d="m8.2 13.1 7.6 3.8" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 8 7.1 4.7a1.6 1.6 0 0 0 1.8 0L20 8" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="m11 6.8.9-.9a4.4 4.4 0 0 1 6.2 6.2l-.9.9" />
      <path d="m13 17.2-.9.9a4.4 4.4 0 0 1-6.2-6.2l.9-.9" />
    </>
  ),
  template: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M4 9.5h16" />
      <path d="M10 9.5V20" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9.5h16.8" />
      <path d="M3.6 14.5h16.8" />
      <path d="M12 3a15.5 15.5 0 0 0 0 18a15.5 15.5 0 0 0 0-18Z" />
    </>
  ),
  rss: (
    <>
      <circle cx="6" cy="18" r="1.6" />
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 5a15 15 0 0 1 15 15" />
    </>
  ),
  sparkle: (
    <>
      <path d="m11 3.5 1.7 4.4 4.4 1.7-4.4 1.7L11 15.7 9.3 11.3 4.9 9.6l4.4-1.7Z" />
      <path d="m17.5 14.5.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l2.8 1.8" />
    </>
  ),
  check: <path d="m5 12.5 4.6 4.5L19 7.5" />,
  arrow: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  fallback: <circle cx="12" cy="12" r="8" />,
};

/**
 * Decorative by design: every icon is `aria-hidden`, so it never has to be
 * described and never lands in the tab order. If a glyph is the only thing
 * conveying meaning, pair it with sr-only text at the call site.
 */
export function Icon({ name, size = 22, strokeWidth = 1.6, className }: IconProps) {
  const glyph = ICONS[name] ?? ICONS.fallback;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      {glyph}
    </svg>
  );
}

export interface IconChipProps {
  name: IconName;
  className?: string;
}

/**
 * The 44px tinted chip from BRAND.md §4. Icon sits at orange-700 on a 12%
 * orange tint — 4.26:1 — never brand orange, which would be 2.87:1.
 */
export function IconChip({ name, className }: IconChipProps) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
        "bg-accent/12 text-accent-text",
        "[.on-ink_&]:bg-accent/18 [.on-ink_&]:text-orange-300",
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}
