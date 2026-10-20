import Link from 'next/link';
import CommandPalette from '../templates/CommandPalette';
import { BrandMark } from '../primitives/BrandMark';
import { MobileMenu } from './MobileMenu';
import { regionFooterColumns, resolveBuildRegion } from './FPFooter';
import type { SearchItem } from '../SearchModal';
import { getStrings, type UIStrings } from '@nootropic/data';

export interface FPNavLink {
  label: string;
  href: string;
}

export interface FPHeaderProps {
  /** Nav links rendered between the brand and the search trigger. Defaults to English Phase-2 set. */
  nav?: FPNavLink[];
  /** Search index — when provided, the search button opens an in-place modal. */
  searchItems?: SearchItem[];
  /** Locale strings (for the modal). */
  strings?: UIStrings;
  brandLabel?: string;
}

const DEFAULT_NAV: FPNavLink[] = [
  { label: 'Best Nootropics', href: '/best-nootropics/' },
  { label: 'Ingredients', href: '/ingredients/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'Methodology', href: '/methodology/' },
  { label: 'About', href: '/about/' },
];

/**
 * Map a UIStrings bundle into the 5-item nav rendered by FPHeader.
 * Exported so callers (and tests) can verify the mapping in isolation.
 *
 * Before the 2026-06-02 fix, FPHeader fell back to a hardcoded English
 * DEFAULT_NAV whenever `nav` was omitted, even if `strings` was passed.
 * Every non-English page (LATAM /, CA /fr/, the then-Japanese JP pages, etc.) rendered
 * English chrome — a WCAG 3.1.2 Language of Parts violation.
 */
export function navFromStrings(strings: UIStrings): FPNavLink[] {
  return [
    { label: strings.nav.bestNootropics, href: '/best-nootropics/' },
    { label: strings.nav.ingredients, href: '/ingredients/' },
    { label: strings.nav.guides, href: '/guides/' },
    { label: strings.nav.methodology, href: '/methodology/' },
    { label: strings.nav.about, href: '/about/' },
  ];
}

/** Footer columns the phone menu repeats below the primary links. */
const MENU_SECTION_IDS = ['footer-col-best-by-goal', 'footer-col-by-region'];

/**
 * FPHeader — sticky white header for public/SEO surfaces. Brand mark
 * (green flask), 5 nav links, the edition label (this host's region name, as
 * the footer's By-region column words it) and the ⌘K search trigger. Search
 * opens a modal when `searchItems` is provided. Below `lg:` the links move
 * into MobileMenu (the same 5 links, then the footer's best-by-goal and
 * by-region columns for this host); the edition label shows from `md:`.
 * There is no comparator button (design decisions 15–16): the footer links
 * the comparator on every host.
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
  brandLabel = 'Nootropic Lab',
}: FPHeaderProps) {
  const resolvedNav = nav ?? (strings ? navFromStrings(strings) : DEFAULT_NAV);
  const resolvedNavLandmark = strings?.nav.primaryLandmark ?? 'Primary';
  // This host's region in the page's own language; fails closed on an unset
  // NEXT_PUBLIC_REGION, as the footer does.
  const editionLabel = (strings ?? getStrings('en')).footer.byRegion[resolveBuildRegion()];
  const hasSearch = searchItems !== undefined && searchItems.length > 0;
  // Plain data for the client menu, resolved here on the server; the region
  // filter fails closed on an unset NEXT_PUBLIC_REGION, as FPFooter does.
  const menuSections = regionFooterColumns(strings).filter((col) => MENU_SECTION_IDS.includes(col.id));
  const menuLabels = {
    openMenu: strings?.nav.openMenu ?? 'Open menu',
    closeMenu: strings?.nav.closeMenu ?? 'Close menu',
    drawerLabel: strings?.nav.drawerLabel ?? 'Primary navigation',
    primaryLandmark: resolvedNavLandmark,
  };

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

        {/*
          PR-Q25 (#89) — wrap the 5 primary-nav links in a hidden-until-wide
          container so the chrome reflows at 320px viewport (closes the
          WCAG 1.4.10 violation surfaced by PR-Q24 e2e/us-reflow.spec.ts).
          The links show from `lg:` (1024px), not `md:`: the canvas header
          (brand, 5 links, edition label, search) needs 843–952px across
          the locales and 768 leaves 720 (operator decision, 2026-10-20).
          Below `lg:` the header shows the brand link, the edition label
          from `md:`, CommandPalette (icon-only below `md:`) and the
          MobileMenu button, whose dialog lists the same 5 links. The nav is
          also reachable via search (CommandPalette indexes all 5 nav
          targets via the search-pages additions from PR-Q10) AND via
          FPFooter columns on every public page (WCAG 2.4.5 Multiple Ways).
          The outer `<nav>` keeps its `aria-label` stable across breakpoints
          (the landmark name describes purpose, not contents — per WAI-ARIA
          1.2 landmark naming guidance).
        */}
        <div className="flex items-center gap-3">
          <nav aria-label={resolvedNavLandmark} className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center gap-6">
              {resolvedNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13.5px] text-ds-ink-soft font-medium hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Separates the links from the label and search, so it shows only with the links. */}
            {hasSearch && <span className="hidden lg:inline-block w-px h-[18px] bg-ds-border" aria-hidden="true" />}

            {/* Edition label: plain text, not a control (canvas: hidden on phones). */}
            <span className="hidden md:inline-flex items-center whitespace-nowrap text-[13px] text-ds-muted px-[10px] py-[6px] border border-ds-border rounded-full">
              {editionLabel}
            </span>

            {hasSearch && <CommandPalette items={searchItems} strings={strings} />}
          </nav>

          {/* lg:hidden button; its dialog sits outside the header's <nav> landmark. */}
          <MobileMenu brandLabel={brandLabel} labels={menuLabels} nav={resolvedNav} sections={menuSections} />
        </div>
      </div>

    </header>
  );
}

export default FPHeader;
