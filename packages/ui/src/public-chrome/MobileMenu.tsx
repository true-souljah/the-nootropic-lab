'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { BrandMark } from '../primitives/BrandMark';
import type { FPNavLink } from './FPHeader';
import type { FPFooterColumn } from './FPFooter';

/** Accessible names from the page's locale bundle (`UIStrings.nav`). */
export interface MobileMenuLabels {
  openMenu: string;
  closeMenu: string;
  drawerLabel: string;
  primaryLandmark: string;
}

export interface MobileMenuProps {
  /** Brand name in the menu's top row (proper noun, not translated). */
  brandLabel: string;
  labels: MobileMenuLabels;
  /** The header's primary links (the desktop nav). */
  nav: FPNavLink[];
  /** Link groups below the primary links (best-by-goal, by-region), already filtered for this host. */
  sections: FPFooterColumn[];
}

const DIALOG_ID = 'fp-mobile-menu';

/**
 * MobileMenu — the phone menu of FPHeader (below `md:`, where the header's
 * primary links are hidden). The button opens a native modal `<dialog>`
 * (showModal: the page behind is inert, Escape closes it) with the brand, a
 * close button, the primary links and the link groups FPHeader passes.
 *
 * The dialog's contents render only while it is open: its section headings
 * would otherwise come before the page's h1 in the document outline.
 * Opening focuses the close button and stops the page from scrolling;
 * closing (button, Escape or a link) returns focus to the menu button.
 */
export function MobileMenu({ brandLabel, labels, nav, sections }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    // The menu button is md:hidden; a viewport that grows past it closes the menu.
    const wide = window.matchMedia('(min-width: 768px)');
    const onWide = (e: MediaQueryListEvent) => {
      if (e.matches) dialog.close();
    };
    wide.addEventListener('change', onWide);
    return () => {
      root.style.overflow = overflow;
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  const close = () => dialogRef.current?.close();

  // The dialog's close event: after close() (the close button, a link) or Escape (its cancel).
  const onClose = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Keep Tab inside the dialog: wrap from the last control to the first and back.
  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const controls = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.openMenu}
        aria-expanded={open}
        aria-controls={DIALOG_ID}
        className="md:hidden inline-flex items-center justify-center w-11 h-11 text-ds-ink-soft hover:text-ds-ink hover:bg-ds-bg rounded-md focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
      >
        <Menu size={20} strokeWidth={2} aria-hidden={true} />
      </button>
      {/* No display class on the dialog itself: the UA's dialog:not([open]) { display: none } keeps it hidden while closed. */}
      <dialog
        ref={dialogRef}
        id={DIALOG_ID}
        aria-label={labels.drawerLabel}
        onClose={onClose}
        onKeyDown={onKeyDown}
        className="m-0 p-0 w-full max-w-none h-full max-h-none bg-ds-card text-ds-ink overscroll-contain backdrop:bg-ds-scrim"
      >
        {open && (
          <div className="pb-8">
            <div className="sticky top-0 z-10 bg-ds-card border-b border-ds-border px-6 py-[6px] flex items-center justify-between">
              <Link
                href="/"
                onClick={close}
                className="flex items-center gap-[10px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
              >
                <BrandMark size={28} />
                <span className="font-bold text-[16px] tracking-tight text-ds-ink">{brandLabel}</span>
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={labels.closeMenu}
                className="inline-flex items-center justify-center w-11 h-11 text-ds-ink-soft hover:text-ds-ink hover:bg-ds-bg rounded-md focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <X size={20} strokeWidth={2} aria-hidden={true} />
              </button>
            </div>

            <nav aria-label={labels.primaryLandmark} className="px-6 pt-2">
              <ul className="list-none m-0 p-0">
                {nav.map((item) => (
                  <li key={item.href} className="border-b border-ds-border">
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-center min-h-[48px] text-[16px] font-semibold text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {sections.map((section) => (
              <nav key={section.id} aria-labelledby={`${DIALOG_ID}-${section.id}`} className="px-6 pt-6">
                <h2
                  id={`${DIALOG_ID}-${section.id}`}
                  className="text-[11px] tracking-[0.14em] uppercase text-ds-muted font-semibold m-0 mb-[10px]"
                >
                  {section.heading}
                </h2>
                <ul className="grid grid-cols-2 gap-2 list-none m-0 p-0">
                  {section.links.map((link) => (
                    <li key={link.href} className="flex">
                      <Link
                        href={link.href}
                        onClick={close}
                        className="flex flex-1 items-center min-h-[44px] px-3 py-2 rounded-[8px] border border-ds-border bg-ds-card-sub text-[14px] font-medium leading-snug text-ds-ink hover:border-ds-accent-border hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        )}
      </dialog>
    </>
  );
}

export default MobileMenu;
