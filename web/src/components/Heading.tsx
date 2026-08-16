import type { ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Levels a component nested inside a page section may use. */
export type SubHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  /**
   * Document level only. Every component that accepts a level keeps its own
   * fixed size — the level moves the outline, never the type scale.
   */
  level: HeadingLevel;
  children: ReactNode;
  id?: string;
  className?: string;
}

/**
 * Renders `h1`–`h6` from a numeric level.
 *
 * Written as an explicit switch rather than `const Tag = \`h${level}\`` so the
 * element type is statically known: a capitalised local built during render
 * looks like a freshly-created component to React's lint rules and to the
 * compiler, even when it is only an intrinsic tag name.
 */
export function Heading({ level, children, id, className }: HeadingProps) {
  switch (level) {
    case 1:
      return (
        <h1 id={id} className={className}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 id={id} className={className}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 id={id} className={className}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 id={id} className={className}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 id={id} className={className}>
          {children}
        </h5>
      );
    default:
      return (
        <h6 id={id} className={className}>
          {children}
        </h6>
      );
  }
}
