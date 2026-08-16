"use client";

/**
 * Client component — and the only one in this set.
 *
 * Three things need the client here and cannot be done in CSS:
 *   1. the mobile disclosure's `aria-expanded` / `hidden` state,
 *   2. closing the panel on Escape and returning focus to its trigger,
 *   3. `usePathname()` for `aria-current` on the active nav link.
 *
 * Everything else on the site is a server component.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { CTA, NAV, SITE } from "@/lib/site";
import { INK_BAND, cn } from "./utils";

const PANEL_ID = "site-nav-mobile";

export interface SiteHeaderProps {
  className?: string;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The panel stores *which route* it was opened on rather than a boolean.
  // The header never unmounts across navigations, so a plain boolean would
  // leave the menu hanging open over the page the user just navigated to;
  // deriving `open` from the current pathname closes it with no effect and no
  // extra render.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Escape" || openedOn === null) return;
      setOpenedOn(null);
      toggleRef.current?.focus();
    },
    [openedOn],
  );

  return (
    <header
      onKeyDown={handleKeyDown}
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md",
        className,
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[77px]">
        {/*
          The logo takes its colour from this link. On the white sticky header
          that is ink at 15.6:1 — the deployed site shipped a cream wordmark
          here at 1.17:1, which is the bug this avoids.
        */}
        <Link
          href="/"
          className="inline-flex shrink-0 items-center rounded-md text-text-primary"
        >
          <Logo className="h-9 w-auto sm:h-10" />
          <span className="sr-only">{SITE.name} — home</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex list-none items-center gap-1 p-0">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-11 items-center px-3 text-sm font-medium",
                      active
                        ? cn(
                            "font-semibold text-accent-text",
                            "after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:rounded-full after:bg-accent after:content-['']",
                          )
                        : "text-text-body hover:text-text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={CTA.secondary.href} variant="ghost" size="sm">
            {CTA.secondary.label}
          </Button>
          <Button href={CTA.primary.href} variant="primary" size="sm">
            {CTA.primary.label}
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={PANEL_ID}
          onClick={() => setOpenedOn(open ? null : pathname)}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xl",
            "text-text-primary hover:bg-surface-sunken lg:hidden",
          )}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            viewBox="0 0 24 24"
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            {open ? (
              <>
                <path d="m6 6 12 12" />
                <path d="M18 6 6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {/*
        A plain disclosure, not a modal: focus is never trapped, the page
        behind stays reachable, and nothing is inert. Hidden with the `hidden`
        attribute so its links leave the tab order when closed.
      */}
      <div
        id={PANEL_ID}
        hidden={!open}
        className={cn("border-t border-border bg-surface-ink lg:hidden", INK_BAND)}
      >
        <Container className="py-4">
          <nav aria-label="Main, mobile">
            <ul className="flex list-none flex-col p-0">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center rounded-xl px-3 text-base font-medium",
                        active
                          ? "font-semibold text-orange-300 underline underline-offset-4"
                          : "text-text-on-ink hover:bg-ink-0/10",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 flex flex-col gap-3">
            <Button href={CTA.secondary.href} variant="ghost" block>
              {CTA.secondary.label}
            </Button>
            <Button href={CTA.primary.href} variant="primary" block>
              {CTA.primary.label}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
