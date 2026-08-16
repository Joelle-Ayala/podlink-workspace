import type { ReactNode } from "react";
import { cn } from "./utils";

export type GridCols = 2 | 3 | 4;
export type GridGap = "sm" | "md" | "lg";
export type GridElement = "div" | "ul" | "ol";

export interface GridProps {
  children: ReactNode;
  /** Widest column count. Always collapses to 1 at 360px. */
  cols?: GridCols;
  gap?: GridGap;
  /** Use `ul` when the children are a list of things — cards usually are. */
  as?: GridElement;
  className?: string;
}

const COLS: Record<GridCols, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const GAPS: Record<GridGap, string> = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
};

export function Grid({
  children,
  cols = 3,
  gap = "md",
  as: Tag = "div",
  className,
}: GridProps) {
  return (
    <Tag
      className={cn(
        "grid",
        COLS[cols],
        GAPS[gap],
        Tag !== "div" && "list-none p-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
