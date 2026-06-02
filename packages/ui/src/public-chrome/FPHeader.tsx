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
  { label: 'Best Nootropics', href: '/best-nootropics' },
  { label: 'Ingredients', href: '/ingredients' },
  { label: 'Guides', href: '/guides' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'About', href: '/about' },
];

/**
 * Map a UIStrings bundle into the 5-item nav rendered by FPHeader.
 * Exported so callers (and tests) can verify the mapping in isolation.
 *
 * Before the 2026-06-02 fix, FPHeader fell back to a hardcoded English
 * DEFAULT_NAV whenever `nav` was omitted, even if `strings` was passed.
 * Every non-English page (LATAM /, CA /fr/, JP /ja/, etc.) rendered
 * English chrome — a WCAG 3.1.2 Language of Parts violation.
 */
export function navFromStrings(strings: UIStrings): FPNavLink[] {
  return [
    { label: strings.nav.bestNootropics, href: '/best-nootropics' },
    { label: strings.nav.ingredients, href: '/ingredients' },
    { label: strings.nav.guides, href: '/guides' },
    { label: strings.nav.methodology, href: '/methodology' },
    { label: strings.nav.about, href: '/about' },
  ];
}

/**
 * FPHeader — sticky white header for public/SEO surfaces. Brand mark
 * (green flask), 5 nav links, ⌘K search trigger, and the "Open comparator"
 * indigo CTA. Search opens a modal when `searchItems` is provided.
 *
 * Resolution precedence for every localized surface:
 *   1. explicit override prop (caller knows best)
 *   2. derive from `strings.nav.*` (localized chrome)
 *   3. hardcoded English fallback (only when strings is also absent)
 *
 * `brandLabel` is intentionally not derived from strings — "Nootropic Lab"
 * is a proper noun and stays untranslated by design (per § Translation
 * Completeness Rule's non-translatable allowlist).
 */
export function FPHeader({
  nav,
  searchItems,
  strings,
  ctaHref = '/nootropic-comparison',
  ctaLabel,
  brandLabel = 'Nootropic Lab',
  hideCta = false,
}: FPHeaderProps) {
  const resolvedNav = nav ?? (strings ? navFromStrings(strings) : DEFAULT_NAV);
  const resolvedNavLandmark = strings?.nav.primaryLandmark ?? 'Primary';
  const resolvedCtaLabel = ctaLabel ?? strings?.nav.openComparator ?? 'Open comparator →';

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

        <nav aria-label={resolvedNavLandmark} className="flex items-center gap-6">
          {resolvedNav.map((item) => (
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
              {resolvedCtaLabel}
            </Link>
          )}
        </nav>
      </div>

    </header>
  );
}

export default FPHeader;
