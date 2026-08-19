"use client";

/**
 * SiteHeader — the only client component on the marketing site.
 *
 * Nav pattern: each dropdown parent is BOTH a link to its hub page AND a menu
 * trigger. That's deliberate — /services and /features are real destinations,
 * not just menu labels, so the label must stay clickable. The chevron is a
 * separate button so the two actions never fight each other.
 *
 * Desktop  — hover opens (with a close delay so diagonal mouse paths don't
 *            drop the menu), click the label to navigate, click or Enter on the
 *            chevron to open, Arrow Down opens and moves into the list, Escape
 *            closes and returns focus, Tab out closes.
 * Mobile   — full drawer, everything expanded. No nested accordions: on a phone,
 *            hiding 5 items behind a second tap costs more than the scroll does.
 *
 * BRAND: #FF8C00 on white is 2.33:1 and fails AA for text and the 3:1 UI
 * threshold. Orange is fill-only. The CTA is ink-on-orange (8.20:1); orange
 * text on light uses orange-700 #B85600 (4.81:1); focus rings orange-600.
 * The wordmark stays monochrome on this light header — the colour-split
 * treatment assumes a dark ground and produced an invisible logo on white.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { isSection, primaryNav, type NavSection } from "@/content/nav";
import { appUrl } from "@/lib/site";

const ORANGE = "#FF8C00";
const ORANGE_700 = "#B85600";
const ORANGE_600 = "#DB6E00";
const INK = "#0f0f12";

/** Grace period so a diagonal path from label to menu doesn't close it. */
const CLOSE_DELAY_MS = 140;

export default function SiteHeader() {
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenKey(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  // Close everything on navigation.
  useEffect(() => {
    setOpenKey(null);
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes; click outside closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenKey(null);
        setDrawerOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => cancelClose, [cancelClose]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        {/* Wordmark — monochrome on light. See the brand note above. */}
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ color: INK, outlineColor: ORANGE_600 }}
        >
          Podlink
        </Link>

        {/* ---------------- Desktop nav ---------------- */}
        <nav
          ref={navRef}
          aria-label="Main"
          className="hidden flex-1 items-center gap-1 lg:flex"
        >
          {primaryNav.map((item) => {
            if (!isSection(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    color: isActive(item.href) ? ORANGE_700 : INK,
                    outlineColor: ORANGE_600,
                  }}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <DesktopSection
                key={item.href}
                section={item}
                open={openKey === item.href}
                active={isActive(item.href)}
                onOpen={() => {
                  cancelClose();
                  setOpenKey(item.href);
                }}
                onScheduleClose={scheduleClose}
                onClose={() => setOpenKey(null)}
                isActive={isActive}
              />
            );
          })}
        </nav>

        {/* ---------------- Right side ---------------- */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={appUrl("/login")}
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 sm:block"
            style={{ color: INK, outlineColor: ORANGE_600 }}
          >
            Sign in
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: ORANGE, color: INK, outlineColor: ORANGE_600 }}
          >
            Book a call
          </Link>

          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((v) => !v)}
            className="-mr-1 rounded-lg p-2 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
            style={{ color: INK, outlineColor: ORANGE_600 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {drawerOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ---------------- Mobile drawer ---------------- */}
      {drawerOpen && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-zinc-200 bg-white px-5 pb-8 pt-2 lg:hidden"
        >
          <nav aria-label="Main">
            {primaryNav.map((item) => {
              if (!isSection(item)) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block border-b border-zinc-100 py-3.5 text-base font-bold"
                    style={{ color: isActive(item.href) ? ORANGE_700 : INK }}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.href} className="border-b border-zinc-100 py-3">
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-2 text-base font-bold"
                    style={{ color: isActive(item.href) ? ORANGE_700 : INK }}
                  >
                    {item.label}
                    <span className="text-xs font-semibold" style={{ color: ORANGE_700 }}>
                      Overview &rarr;
                    </span>
                  </Link>
                  <ul className="mt-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-2.5 pl-3 text-[0.95rem]"
                          style={{
                            color: isActive(child.href) ? ORANGE_700 : "#3f3f46",
                            borderLeft: `2px solid ${
                              isActive(child.href) ? ORANGE : "#e4e4e7"
                            }`,
                          }}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <Link
              href={appUrl("/login")}
              className="block py-3.5 text-base font-bold"
              style={{ color: INK }}
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function DesktopSection({
  section,
  open,
  active,
  onOpen,
  onScheduleClose,
  onClose,
  isActive,
}: {
  section: NavSection;
  open: boolean;
  active: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = `nav-${section.href.replace(/\//g, "")}`;

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onOpen();
      // Focus the first item once the panel has rendered.
      requestAnimationFrame(() => {
        menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      });
    }
  };

  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Escape") return;
    onClose();
    triggerRef.current?.focus();
  };

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onScheduleClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <div className="flex items-center">
        <Link
          href={section.href}
          className="rounded-l-lg py-2 pl-3 pr-1 text-sm font-semibold transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: active ? ORANGE_700 : INK, outlineColor: ORANGE_600 }}
        >
          {section.label}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${section.label} menu`}
          onClick={() => (open ? onClose() : onOpen())}
          onKeyDown={onTriggerKeyDown}
          className="rounded-r-lg py-2 pl-0.5 pr-2.5 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: active ? ORANGE_700 : INK, outlineColor: ORANGE_600 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className="transition-transform duration-150"
            style={{ transform: open ? "rotate(180deg)" : undefined }}
          >
            <path
              d="M2.5 4.5L6 8l3.5-3.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div
          id={panelId}
          ref={menuRef}
          onKeyDown={onPanelKeyDown}
          className="absolute left-0 top-full z-50 w-[34rem] pt-2"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10">
            <ul className="grid grid-cols-2 gap-1 p-2">
              {section.children.map((child) => {
                const childActive = isActive(child.href);
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:-outline-offset-2"
                      style={{
                        outlineColor: ORANGE_600,
                        backgroundColor: childActive ? "#fafafa" : undefined,
                      }}
                    >
                      <span
                        className="block text-sm font-semibold"
                        style={{ color: childActive ? ORANGE_700 : INK }}
                      >
                        {child.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-zinc-600">
                        {child.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-2.5">
              <Link
                href={section.href}
                className="text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: ORANGE_700, outlineColor: ORANGE_600 }}
              >
                All {section.label.toLowerCase()} &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
