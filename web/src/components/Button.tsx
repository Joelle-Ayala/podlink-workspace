import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { TOUCH_TARGET_44, cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Force the near-black-background treatment.
   *
   * Usually you do not need this: any button inside a `<Section tone="ink">`,
   * `<CtaBand>`, `<Hero>` or `<SiteFooter>` picks up the ink treatment
   * automatically through the `on-ink` hook those bands set. Pass `onInk`
   * only for a dark surface this component set does not own.
   */
  onInk?: boolean;
  /** Full-width. */
  block?: boolean;
  className?: string;
}

type AnchorProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type NativeButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

const BASE = cn(
  "inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold",
  "whitespace-nowrap select-none",
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-brand",
  "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
  "disabled:pointer-events-none disabled:translate-y-0 disabled:bg-surface-sunken disabled:text-text-muted disabled:shadow-none",
  "aria-disabled:pointer-events-none aria-disabled:translate-y-0 aria-disabled:bg-surface-sunken aria-disabled:text-text-muted aria-disabled:shadow-none",
);

/**
 * BRAND.md §1: #FF8C00 on white is 2.33:1. Orange is a fill, never a label
 * colour on light, and a white label on orange is banned. So:
 *   primary   = ink on orange, 8.20:1, hover brightens to orange-400 (9.74:1)
 *   secondary = ink fill / white on light; inverts to white fill / ink on ink
 *   ghost     = transparent, inherits the band's own text colour
 * The orange shadow is the one coloured shadow in the system and is reserved
 * for the primary button.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-accent text-text-on-accent shadow-md shadow-orange-500/25",
    "hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/35",
  ),
  secondary: cn(
    "bg-ink-900 text-text-on-ink hover:bg-ink-700",
    "[.on-ink_&]:bg-ink-0 [.on-ink_&]:text-ink-900 [.on-ink_&]:hover:bg-ink-100",
  ),
  ghost: cn(
    "border-2 border-transparent bg-transparent text-text-primary hover:bg-surface-sunken",
    "[.on-ink_&]:border-ink-0/25 [.on-ink_&]:text-text-on-ink",
    "[.on-ink_&]:hover:border-ink-0/40 [.on-ink_&]:hover:bg-ink-0/12",
  ),
};

const VARIANTS_ON_INK: Record<ButtonVariant, string> = {
  primary: "",
  secondary: "bg-ink-0 text-ink-900 hover:bg-ink-100",
  ghost: "border-ink-0/25 text-text-on-ink hover:border-ink-0/40 hover:bg-ink-0/12",
};

/**
 * BRAND.md draws `sm` at 36px. The site-wide rule is a 44px minimum touch
 * target, so `sm` keeps its 36px box and gains a transparent 44px hit area.
 */
const SIZES: Record<ButtonSize, string> = {
  sm: cn("h-9 px-4 text-sm", TOUCH_TARGET_44),
  md: "min-h-11 px-6 py-2.5 text-[15px]",
  lg: "min-h-13 px-8 py-3 text-base",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    onInk = false,
    block = false,
    className,
    ...rest
  } = props;

  const classes = cn(
    BASE,
    VARIANTS[variant],
    onInk && VARIANTS_ON_INK[variant],
    SIZES[size],
    block && "w-full",
    className,
  );

  if (typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as Omit<AnchorProps, keyof ButtonBaseProps>;
    // Internal routes get client-side navigation; cross-domain links into
    // app.podlink.ai are ordinary anchors.
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } =
    rest as Omit<NativeButtonProps, keyof ButtonBaseProps>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export interface ButtonRowProps {
  children: ReactNode;
  align?: "start" | "center";
  className?: string;
}

/** Wraps a pair of CTAs so they stack cleanly at 360px. */
export function ButtonRow({ children, align = "start", className }: ButtonRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
        align === "center" && "sm:justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
