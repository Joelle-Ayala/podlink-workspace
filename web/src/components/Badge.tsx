import type { ReactNode } from "react";
import { cn } from "./utils";

export type BadgeTone = "accent" | "neutral" | "solid";

export interface BadgeProps {
  children: ReactNode;
  /**
   * `accent` — the eyebrow pill above a heading (orange tint, orange-700 text).
   * `neutral` — quiet grey pill.
   * `solid` — orange fill with ink text, 8.20:1. Use sparingly.
   */
  tone?: BadgeTone;
  className?: string;
}

/**
 * BRAND.md §4: the eyebrow text is orange-700 on a 12% orange tint (4.33:1).
 * Brand orange on that tint is 2.73:1 and is the bug this replaces.
 */
const TONES: Record<BadgeTone, string> = {
  accent: cn(
    "bg-accent/12 text-accent-text",
    "[.on-ink_&]:bg-accent/18 [.on-ink_&]:text-orange-300",
  ),
  neutral: cn(
    "bg-surface-sunken text-text-body",
    "[.on-ink_&]:bg-ink-0/10 [.on-ink_&]:text-text-on-ink",
  ),
  solid: "bg-accent text-text-on-accent",
};

export function Badge({ children, tone = "accent", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "text-[13px] leading-5 font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
