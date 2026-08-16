/**
 * Podlink component set.
 *
 * Everything here is a server component except `SiteHeader`, which needs
 * client state for the mobile disclosure. Colour comes only from the tokens in
 * globals.css — no component holds a hex value.
 */

export { Badge, type BadgeProps, type BadgeTone } from "./Badge";
export {
  BILLING_ANNUAL_ID,
  BILLING_MONTHLY_ID,
  BillingToggle,
  type BillingToggleProps,
} from "./BillingToggle";
export {
  Button,
  ButtonRow,
  type ButtonProps,
  type ButtonRowProps,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";
export {
  ComparisonTable,
  type ComparisonTableProps,
  type ComparisonTier,
} from "./ComparisonTable";
export {
  Container,
  type ContainerElement,
  type ContainerProps,
  type ContainerWidth,
} from "./Container";
export { CtaBand, type CtaBandLink, type CtaBandProps } from "./CtaBand";
export { Faq, type FaqProps } from "./Faq";
export { FeatureBlock, type FeatureBlockProps } from "./FeatureBlock";
export { FeatureCard, type FeatureCardProps } from "./FeatureCard";
export { Grid, type GridCols, type GridElement, type GridGap, type GridProps } from "./Grid";
export {
  Heading,
  type HeadingLevel,
  type HeadingProps,
  type SubHeadingLevel,
} from "./Heading";
export { Hero, type HeroCta, type HeroProps } from "./Hero";
export { Icon, IconChip, type IconChipProps, type IconProps } from "./Icon";
export { Logo, type LogoProps } from "./Logo";
export { PriceCard, type PriceCardProps } from "./PriceCard";
export { Prose, type ProseProps, type ProseSize } from "./Prose";
export {
  ScreenshotFrame,
  type ScreenshotFrameProps,
} from "./ScreenshotFrame";
export {
  Section,
  SectionHead,
  type SectionHeadProps,
  type SectionProps,
  type SectionSize,
  type SectionTone,
} from "./Section";
export { SiteFooter, type FooterLink, type SiteFooterProps } from "./SiteFooter";
export { SiteHeader, type SiteHeaderProps } from "./SiteHeader";
