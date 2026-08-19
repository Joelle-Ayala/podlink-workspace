import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CTA, NAV, SITE } from "@/lib/site";
import { INK_BAND, cn } from "./utils";

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteFooterProps {
  /**
   * Fills the Features column. Pass the real feature list from content; with
   * nothing supplied the column falls back to a single "All features" link.
   */
  featureLinks?: readonly FooterLink[];
  /**
   * Fills the Company column. Defaults to the podlink.fm link only — there is
   * no about/contact/blog route yet.
   */
  companyLinks?: readonly FooterLink[];
  className?: string;
}

/**
 * Legal routes do not exist yet. These are placeholders and the pages need to
 * be created before launch — an anchor to a 404 is worse than no anchor.
 */
const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
];

const PRODUCT_LINKS: readonly FooterLink[] = [
  ...NAV.map((item) => ({ label: item.label, href: item.href })),
  { label: CTA.secondary.label, href: CTA.secondary.href },
  { label: CTA.primary.label, href: CTA.primary.href },
];

/**
 * Site footer.
 *
 * Ink `#0f0f12`, not `#000`, and no magenta/indigo radial — that gradient is
 * the leftover MagicAI purple BRAND.md §6 calls the most visible off-brand
 * element on the old site. Link text is 62% white (7.68:1), not the old
 * `opacity-50`, and hover adds an underline rather than only changing colour.
 */
export function SiteFooter({
  featureLinks,
  companyLinks,
  className,
}: SiteFooterProps) {
  const features: readonly FooterLink[] =
    featureLinks && featureLinks.length > 0
      ? featureLinks
      : [{ label: "All features", href: "/features" }];

  const company: readonly FooterLink[] =
    companyLinks && companyLinks.length > 0
      ? companyLinks
      : [{ label: "podlink.fm pages", href: SITE.bio }];

  const columns: ReadonlyArray<{ title: string; links: readonly FooterLink[] }> = [
    { title: "Product", links: PRODUCT_LINKS },
    { title: "Features", links: features },
    { title: "Company", links: company },
    { title: "Legal", links: LEGAL_LINKS },
  ];

  return (
    <footer
      className={cn(
        "relative isolate overflow-hidden bg-surface-ink",
        INK_BAND,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 -z-10 h-80 w-80 rounded-full bg-accent opacity-15 blur-[120px]"
      />

      <Container className="py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-[22rem]">
            <Link
              href="/"
              className="inline-flex items-center rounded-md text-text-on-ink"
            >
              <Logo className="h-10 w-auto" />
              <span className="sr-only">{SITE.name} — home</span>
            </Link>
            <p className="mt-4 text-sm leading-[1.6] text-text-on-ink/62">
              {SITE.description}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[13px] font-semibold text-text-on-ink">
                {column.title}
              </h2>
              <ul className="mt-3 flex list-none flex-col p-0">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <FooterAnchor {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-0/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-on-ink/62">
            © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
          </p>
        </div>
      </Container>
    </footer>
  );
}

/**
 * 44px tall so the links are a real touch target in a dense column, and
 * underlined on hover as well as brightened.
 */
function FooterAnchor({ label, href }: FooterLink) {
  const classes =
    "inline-flex min-h-11 items-center text-sm text-text-on-ink/62 transition-colors duration-200 ease-out-brand hover:text-text-on-ink hover:underline hover:underline-offset-4";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {label}
    </a>
  );
}
