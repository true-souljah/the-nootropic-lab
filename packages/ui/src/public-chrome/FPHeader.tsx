import Link from 'next/link';
import CommandPalette from '../templates/CommandPalette';
import { BrandMark } from '../primitives/BrandMark';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

export interface FPNavLink {
  label: string;
  href: string;
}

export interface FPHeaderProps {
  /** Nav links rendered between brand and CTA. Defaults to English Phase-2 set. */
  nav?: FPNavLink[];
  /** Search index — when provided, the search button opens an in-place modal. */
  searchItems?: SearchItem[];
  /** Locale strings (for the modal). */
  strings?: UIStrings;
  /** "Open comparator" CTA destination. */
  ctaHref?: string;
  ctaLabel?: string;
  brandLabel?: string;
  /** When true, omit the comparator CTA (e.g. on the comparator page itself). */
  hideCta?: boolean;
}

const DEFAULT_NAV: FPNavLink[] = [
  { label: 'Best of 2026', href: '/best-nootropics' },
  { label: 'Ingredients', href: '/ingredients' },
  { label: 'Guides', href: '/guides' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'About', href: '/about' },
];

/**
 * FPHeader — sticky white header for public/SEO surfaces. Brand mark
 * (green flask), 5 nav links, ⌘K search trigger, and the "Open comparator"
 * indigo CTA. Search opens a modal when `searchItems` is provided.
 */
export function FPHeader({
  nav = DEFAULT_NAV,
  searchItems,
  strings,
  ctaHref = '/nootropic-comparison',
  ctaLabel = 'Open comparator →',
  brandLabel = 'Nootropic Lab',
  hideCta = false,
}: FPHeaderProps) {
  return (
    <header
      role="banner"
      className="bg-ds-card border-b border-ds-border sticky top-0 z-10"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-[14px] flex items-center justify-between">
        <Link
          href="/"
          aria-label={brandLabel}
          className="flex items-center gap-[10px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
        >
          <BrandMark size={28} />
          <span className="font-bold text-[16px] tracking-tight text-ds-ink">{brandLabel}</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13.5px] text-ds-ink-soft font-medium hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]"
            >
              {item.label}
            </Link>
          ))}

          {searchItems && searchItems.length > 0 && (
            <>
              <span className="w-px h-[18px] bg-ds-border" aria-hidden="true" />
              <CommandPalette items={searchItems} />
            </>
          )}

          {!hideCta && (
            <Link
              href={ctaHref}
              className="bg-ds-accent text-white px-[14px] py-[8px] rounded-[8px] text-[13px] font-semibold no-underline hover:bg-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              {ctaLabel}
            </Link>
          )}
        </nav>
      </div>

    </header>
  );
}

export default FPHeader;
