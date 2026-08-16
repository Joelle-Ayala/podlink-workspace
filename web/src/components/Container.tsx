import type { ReactNode } from "react";
import { cn } from "./utils";

export type ContainerWidth = "default" | "narrow" | "prose";
export type ContainerElement = "div" | "section" | "header" | "footer" | "nav";

export interface ContainerProps {
  children: ReactNode;
  /**
   * `default` 1170px (BRAND.md `--pl-container`), `narrow` 960px,
   * `prose` 46rem (the measure cap).
   */
  width?: ContainerWidth;
  as?: ContainerElement;
  id?: string;
  className?: string;
}

const WIDTHS: Record<ContainerWidth, string> = {
  default: "max-w-[1170px]",
  narrow: "max-w-[960px]",
  prose: "max-w-[46rem]",
};

/**
 * Centred content column with responsive gutters.
 *
 * The 20px base gutter is BRAND.md's `--pl-gutter` and is what keeps the page
 * readable at 360px; it opens up on wider viewports.
 */
export function Container({
  children,
  width = "default",
  as: Tag = "div",
  id,
  className,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", WIDTHS[width], className)}
    >
      {children}
    </Tag>
  );
}
