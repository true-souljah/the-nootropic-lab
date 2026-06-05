'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, type SidebarGroup } from '../primitives/Sidebar';
import CommandPalette from './CommandPalette';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

export type AppShellMode = 'persistent' | 'collapsed';

export interface AppShellProps {
  children: ReactNode;
  /**
   * `persistent` — sidebar visible by default on desktop (≥1024px) and
   * collapses to a ☰ trigger below that. Default for app tool surfaces.
   * `collapsed` — sidebar hidden everywhere by default; ☰ trigger opens
   * an inline drawer on desktop and an overlay drawer on mobile. Used
   * for the hybrid SEO homepage.
   */
  mode?: AppShellMode;
  /** Breadcrumb trail rendered in the top bar. */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** Search index for the ⌘K modal. */
  searchItems?: SearchItem[];
  /** Locale strings (for the SearchModal). */
  uiStrings?: UIStrings;
  /** Hide the "+ Build my stack" CTA in the top bar (used on the comparator itself). */
  hideStackCta?: boolean;
  /** Override "+ Build my stack" CTA href. */
  stackCtaHref?: string;
  /** Override default sidebar groups (uses Sidebar's default when omitted). */
  sidebarGroups?: SidebarGroup[];
  /** Sub-line under the sidebar wordmark (e.g. "v2026.04 · 47 products"). */
  sidebarMeta?: string;
}

/**
 * AppShell — two-column app chrome on desktop, collapses to a single
 * column with a ☰ overlay drawer on mobile. Client component because
 * the sidebar toggle needs interactive state. Sidebar uses the
 * Sidebar primitive (lucide icons, green flask brand, aria-current
 * on active items).
 *
 * Responsive behavior:
 *   ≥1024px (lg) — `mode="persistent"` shows sidebar inline; `mode="collapsed"`
 *                  hides it until the ☰ trigger toggles. Both render as a
 *                  240px column when open.
 *   <1024px      — both modes render the sidebar as a fixed overlay drawer
 *                  with scrim. The ☰ trigger is always available in the top
 *                  bar.
 */
export default function AppShell({
  children,
  mode = 'persistent',
  breadcrumbs = [],
  searchItems,
  uiStrings,
  hideStackCta = false,
  stackCtaHref = '/nootropic-comparison',
  sidebarGroups,
  sidebarMeta,
}: AppShellProps) {
  // Open initial state must be FALSE on mobile and `mode === 'persistent'`
  // on desktop (lg+). The pre-Q69 implementation initialized via
  // `useState(mode === 'persistent')` for both, which opened the
  // mobile overlay drawer on first load — covering the entire
  // viewport behind a [role=dialog][aria-modal=true] with
  // pointer-events:auto. This blocked all touch interactions on
  // the underlying content. PR-Q69 fix: initialize FALSE, then
  // promote to TRUE in useEffect IF viewport is lg+. SSR-safe
  // because server can't know viewport — first paint is closed
  // everywhere, then desktop re-opens after hydration.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mode === 'persistent' && window.matchMedia('(min-width: 1024px)').matches) {
      setSidebarOpen(true);
    }
  }, [mode]);

  const showInline = sidebarOpen;
  const isOverlay = sidebarOpen;

  // Track viewport to know whether the mobile drawer is actually visible.
  // The overlay div has `lg:hidden`, so on desktop the drawer is rendered
  // but display:none — we must NOT trap focus or set inert in that case.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 1023.98px)');
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const drawerVisible = isOverlay && isMobile;

  // Focus management on drawer open/close. Restore focus to the trigger
  // only after the drawer was open at some point — guard against firing
  // on initial mount where drawerVisible starts false.
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasDrawerVisibleRef = useRef(false);
  useEffect(() => {
    if (drawerVisible) {
      wasDrawerVisibleRef.current = true;
      const closeBtn = drawerRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close menu"]');
      closeBtn?.focus();
    } else if (wasDrawerVisibleRef.current) {
      wasDrawerVisibleRef.current = false;
      triggerRef.current?.focus();
    }
  }, [drawerVisible]);

  return (
    <div className="bg-ds-bg text-ds-ink min-h-screen ds-font-features" style={{ fontFamily: 'var(--font-ds-sans)' }}>
      {/* Skip link sits outside the inert wrapper so keyboard users can
          still escape to main content even when the mobile drawer is open
          (otherwise `inert` would propagate to the link and disable it). */}
      <a href="#main-content" tabIndex={0} className="ds-skip-link">
        {uiStrings?.nav.skipToContent ?? 'Skip to main content'}
      </a>

      {/* When the mobile drawer is visible, `inert` keeps the keyboard +
          AT focus inside the drawer — prevents Tab from escaping into the
          obscured page. Only applied at the mobile breakpoint; desktop
          ignores it. */}
      <div {...(drawerVisible ? { inert: '' as unknown as undefined } : {})}>
        <div
          className={`grid items-start ${
            showInline ? 'lg:grid-cols-[240px_1fr]' : 'lg:grid-cols-[1fr]'
          } grid-cols-[1fr]`}
        >
        {/* Inline sidebar — only mounted at lg+ AND when toggled open */}
        {showInline && (
          <div className="hidden lg:block">
            <Sidebar groups={sidebarGroups} meta={sidebarMeta} />
          </div>
        )}

        <div className="min-w-0">
          {/* Top bar */}
          <div className="bg-ds-card border-b border-ds-border px-4 sm:px-7 py-[14px] flex items-center justify-between sticky top-0 z-[5] gap-3">
            <div className="flex items-center gap-[14px] min-w-0">
              {/* ☰ trigger:
                  - On desktop (lg+): only shown for mode="collapsed"
                  - On mobile (<lg): always shown */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
                aria-controls="appshell-mobile-drawer"
                className={`w-9 h-9 grid place-items-center text-ds-ink-soft hover:bg-ds-bg rounded-md focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${
                  mode === 'persistent' ? 'lg:hidden' : ''
                }`}
              >
                {sidebarOpen ? <X size={18} strokeWidth={2} aria-hidden={true} /> : <Menu size={18} strokeWidth={2} aria-hidden={true} />}
              </button>
              {breadcrumbs.length > 0 && (
                <nav aria-label={uiStrings?.breadcrumb.ariaLabel ?? 'Breadcrumb'} className="min-w-0 overflow-hidden">
                  <ol className="flex items-center gap-2 text-[13px] text-ds-muted m-0 p-0 list-none whitespace-nowrap overflow-x-auto">
                    {breadcrumbs.map((item, i) => {
                      const isLast = i === breadcrumbs.length - 1;
                      return (
                        <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                          {i > 0 && <span aria-hidden="true" className="text-ds-faint">/</span>}
                          {isLast || !item.href ? (
                            <span aria-current={isLast ? 'page' : undefined} className="text-ds-ink font-semibold">
                              {item.label}
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              className="text-ds-muted font-medium hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]"
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              )}
            </div>
            <div className="flex items-center gap-[10px]">
              {searchItems && searchItems.length > 0 && (
                <CommandPalette items={searchItems} />
              )}
              {!hideStackCta && (
                <Link
                  href={stackCtaHref}
                  className="hidden sm:inline-flex items-center gap-2 bg-ds-accent text-white px-[14px] py-[8px] rounded-[8px] text-[13px] font-semibold no-underline hover:bg-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  <Search size={14} strokeWidth={2.4} aria-hidden={true} />
                  Build my stack
                </Link>
              )}
            </div>
          </div>

          <main id="main-content">{children}</main>
        </div>
      </div>
      </div>

      {/* Mobile overlay drawer (<lg). Renders alongside the inline lg sidebar so opening on mobile
          doesn't unmount the desktop instance. Sits outside the `inert` wrapper above so it stays
          interactive while the rest of the page is inert. */}
      {isOverlay && (
        <div ref={drawerRef} id="appshell-mobile-drawer" className="lg:hidden fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-label="Primary navigation">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-[rgba(11,18,32,0.55)] cursor-default"
          />
          <div className="relative w-[82%] max-w-[320px] bg-ds-side">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 right-3 z-10 w-9 h-9 grid place-items-center text-ds-side-ink hover:bg-white/10 rounded-md focus-visible:outline-2 focus-visible:outline-ds-focus-ring-on-dark focus-visible:outline-offset-2"
            >
              <X size={18} strokeWidth={2} aria-hidden={true} />
            </button>
            <Sidebar groups={sidebarGroups} meta={sidebarMeta} />
          </div>
        </div>
      )}
    </div>
  );
}
