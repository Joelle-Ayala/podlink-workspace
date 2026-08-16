import type { ReactNode } from "react";
import { cn } from "./utils";

export type ProseSize = "base" | "lg";

export interface ProseProps {
  children: ReactNode;
  size?: ProseSize;
  /** Remove the 46rem measure cap when the parent already constrains width. */
  unconstrained?: boolean;
  className?: string;
}

/**
 * Typographic wrapper for longform blocks — legal pages, feature write-ups,
 * anything authored as a run of elements rather than composed from cards.
 *
 * The project has no typography plugin, so the element styles are declared
 * here. Everything is token-backed: links use orange-700 (4.81:1) and never
 * brand orange, and hover adds an underline as well as darkening, because a
 * colour-only state change fails SC 1.4.1.
 */
const SIZES: Record<ProseSize, string> = {
  base: "text-base leading-[1.7]",
  lg: "text-lg leading-[1.7]",
};

const ELEMENTS = cn(
  "[&>*+*]:mt-5",
  "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[clamp(1.75rem,2.8vw,2.25rem)] [&_h2]:leading-[1.2] [&_h2]:font-bold [&_h2]:tracking-[-0.03em]",
  "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[clamp(1.35rem,2.1vw,1.75rem)] [&_h3]:leading-[1.2] [&_h3]:font-bold [&_h3]:tracking-[-0.03em]",
  "[&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-[17px] [&_h4]:font-semibold [&_h4]:tracking-[-0.01em]",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mt-2 [&_li]:pl-1",
  "[&_ul]:marker:text-accent [&_ol]:marker:text-text-muted",
  "[&_a]:font-semibold [&_a]:text-accent-text [&_a]:underline [&_a]:underline-offset-2",
  "[&_a]:hover:text-orange-800",
  "[.on-ink_&_a]:text-orange-300 [.on-ink_&_a]:hover:text-orange-200",
  "[&_strong]:font-semibold [&_strong]:text-text-primary",
  "[.on-ink_&_strong]:text-text-on-ink",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-text-primary",
  "[.on-ink_&_blockquote]:text-text-on-ink",
  "[&_code]:rounded-md [&_code]:bg-surface-sunken [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]",
  "[.on-ink_&_code]:bg-ink-0/10",
  "[&_hr]:border-border [&_hr]:my-10",
  "[.on-ink_&_hr]:border-ink-0/12",
);

export function Prose({ children, size = "base", unconstrained, className }: ProseProps) {
  return (
    <div
      className={cn(
        !unconstrained && "max-w-[46rem]",
        SIZES[size],
        ELEMENTS,
        className,
      )}
    >
      {children}
    </div>
  );
}
