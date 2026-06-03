import Link from 'next/link';
import { BrandMark } from '../primitives/BrandMark';
import type { UIStrings } from '@nootropic/data';

export interface FPFooterLink {
  label: string;
  href: string;
}

export interface FPFooterColumn {
  /** Stable id used to wire `<h2 id={id}>` with `<nav aria-labelledby={id}>`. */
  id: string;
  heading: string;
  links: FPFooterLink[];
}

export interface FPFooterProps {
  /** Column groups. When omitted, derived from `strings.footer` if present, else English DEFAULT_COLUMNS. */
  columns?: FPFooterColumn[];
  /** Localized UI strings. When passed, replaces every English DEFAULT with its locale equivalent. */
  strings?: UIStrings;
  /** Date of the last full re-audit (ISO 8601 / RFC-3339). Rendered locale-aware via `strings.dateLocale`. */
  lastAuditDate?: string;
  /** Methodology version stamp (e.g. "v3.2"). Language-neutral by design. */
  methodologyVersion?: string;
  /** Override the left-column tagline paragraph. */
  tagline?: string;
  brandLabel?: string;
  /** Override the bottom-row copyright line. Supports the `{year}` placeholder. */
  copyrightLine?: string;
}

const DEFAULT_COLUMNS: FPFooterColumn[] = [
  {
    id: 'footer-col-best-by-goal',
    heading: 'Best by goal',
    links: [
      { label: 'For focus', href: '/best-nootropics-for-focus' },
      { label: 'For memory', href: '/best-nootropics-for-memory' },
      { label: 'For ADHD', href: '/best-nootropics-for-adhd' },
      { label: 'For aging', href: '/best-nootropics-for-aging' },
      { label: 'For energy', href: '/best-nootropics-for-energy' },
      { label: 'For mood', href: '/best-nootropics-for-mood' },
      { label: 'For studying', href: '/best-nootropics-for-studying' },
    ],
  },
  {
    id: 'footer-col-head-to-head',
    heading: 'Head-to-head',
    links: [
      { label: 'Mind Lab Pro vs NooCube', href: '/mind-lab-pro-vs-noocube' },
      { label: 'Alpha Brain vs Qualia Mind', href: '/alpha-brain-vs-qualia-mind' },
      { label: 'Thesis vs Mind Lab Pro', href: '/mind-lab-pro-vs-thesis' },
      { label: 'All comparisons →', href: '/nootropic-comparison' },
    ],
  },
  {
    id: 'footer-col-by-region',
    heading: 'By region',
    links: [
      { label: 'United States', href: 'https://thenootropiclab.com' },
      { label: 'European Union', href: 'https://eu.thenootropiclab.com' },
      { label: 'Canada', href: 'https://ca.thenootropiclab.com' },
      { label: 'Australia', href: 'https://au.thenootropiclab.com' },
      { label: 'Japan', href: 'https://jp.thenootropiclab.com' },
      { label: 'Latin America', href: 'https://latam.thenootropiclab.com' },
    ],
  },
  {
    id: 'footer-col-about',
    heading: 'About',
    links: [
      { label: 'Methodology', href: '/methodology' },
      { label: 'Disclosures', href: '/methodology#disclosures' },
      { label: 'Privacy', href: '/privacy-policy' },
      { label: 'Cookies', href: '/cookie-policy' },
      { label: 'Imprint', href: '/imprint' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

/**
 * Build the 4-column FPFooter structure from a UIStrings bundle. Brand-name
 * link labels in the Head-to-head column stay English (proper nouns); only
 * "All comparisons →" is translated. URLs are identical across locales
 * (canonical English slugs — non-EN locales use rel="alternate" not different
 * paths, so localizing the path here would create dead links).
 *
 * Exported so unit tests can verify the mapping in isolation.
 */
export function columnsFromStrings(strings: UIStrings): FPFooterColumn[] {
  const f = strings.footer;
  return [
    {
      id: 'footer-col-best-by-goal',
      heading: f.bestByGoal.heading,
      links: [
        { label: f.bestByGoal.focus, href: '/best-nootropics-for-focus' },
        { label: f.bestByGoal.memory, href: '/best-nootropics-for-memory' },
        { label: f.bestByGoal.adhd, href: '/best-nootropics-for-adhd' },
        { label: f.bestByGoal.aging, href: '/best-nootropics-for-aging' },
        { label: f.bestByGoal.energy, href: '/best-nootropics-for-energy' },
        { label: f.bestByGoal.mood, href: '/best-nootropics-for-mood' },
        { label: f.bestByGoal.studying, href: '/best-nootropics-for-studying' },
      ],
    },
    {
      id: 'footer-col-head-to-head',
      heading: f.headToHead.heading,
      links: [
        // Brand-vs-brand link labels stay English by design (allowlist).
        { label: 'Mind Lab Pro vs NooCube', href: '/mind-lab-pro-vs-noocube' },
        { label: 'Alpha Brain vs Qualia Mind', href: '/alpha-brain-vs-qualia-mind' },
        { label: 'Thesis vs Mind Lab Pro', href: '/mind-lab-pro-vs-thesis' },
        { label: f.headToHead.allComparisons, href: '/nootropic-comparison' },
      ],
    },
    {
      id: 'footer-col-by-region',
      heading: f.byRegion.heading,
      links: [
        { label: f.byRegion.us, href: 'https://thenootropiclab.com' },
        { label: f.byRegion.eu, href: 'https://eu.thenootropiclab.com' },
        { label: f.byRegion.ca, href: 'https://ca.thenootropiclab.com' },
        { label: f.byRegion.au, href: 'https://au.thenootropiclab.com' },
        { label: f.byRegion.jp, href: 'https://jp.thenootropiclab.com' },
        { label: f.byRegion.latam, href: 'https://latam.thenootropiclab.com' },
      ],
    },
    {
      id: 'footer-col-about',
      heading: f.about.heading,
      links: [
        { label: f.about.methodology, href: '/methodology' },
        { label: f.about.disclosures, href: '/methodology#disclosures' },
        { label: f.about.privacy, href: '/privacy-policy' },
        { label: f.about.cookies, href: '/cookie-policy' },
        { label: f.about.imprint, href: '/imprint' },
        { label: f.about.contact, href: '/contact' },
      ],
    },
  ];
}

const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_LAST_AUDIT_ISO = '2026-04-28';
const DEFAULT_METHODOLOGY_VERSION = 'v3.2';

function formatAuditDate(iso: string, dateLocale: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return iso;
  }
}

/**
 * FPFooter — dark slate footer used across all public surfaces. WCAG:
 * sidebar-text colors (ds-side-ink, ds-side-muted) verified at AA
 * against the ds-side background. Each `<nav>` column is labeled via
 * `aria-labelledby` pointing at its `<h2>` so screen readers announce
 * the column once (the PR-Q8 nav uses the same precedence pattern).
 *
 * Resolution precedence:
 *   columns / tagline / copyrightLine / lastAuditDate explicit prop
 *   → derived from strings.footer when strings is passed
 *   → hardcoded English fallback (only when strings is also absent)
 *
 * `brandLabel="Nootropic Lab"` is intentionally not derived from strings
 * — proper noun, listed in the non-translatable allowlist per Stage 9
 * § Translation Completeness Rule (same call as FPHeader.brandLabel).
 */
export function FPFooter({
  columns,
  strings,
  lastAuditDate = DEFAULT_LAST_AUDIT_ISO,
  methodologyVersion = DEFAULT_METHODOLOGY_VERSION,
  tagline,
  brandLabel = 'Nootropic Lab',
  copyrightLine,
}: FPFooterProps) {
  const resolvedColumns =
    columns ?? (strings ? columnsFromStrings(strings) : DEFAULT_COLUMNS);
  const resolvedTagline =
    tagline ??
    strings?.footer.tagline ??
    "We audit every nootropic against its clinical-trial doses. Affiliate commissions are disclosed inline and don't move scores.";
  const resolvedCopyrightTemplate =
    copyrightLine ??
    strings?.footer.copyrightLine ??
    '© {year} Nootropic Lab · Information is not medical advice. Consult a clinician before starting any supplement.';
  const resolvedCopyright = resolvedCopyrightTemplate.replace('{year}', String(CURRENT_YEAR));
  const lastAuditLabel = strings?.footer.lastAuditLabel ?? 'Last full re-audit:';
  const methodologyLabel = strings?.footer.methodologyLabel ?? 'Methodology';
  const dateLocale = strings?.productDetail?.dateLocale ?? 'en-US';
  const formattedDate = formatAuditDate(lastAuditDate, dateLocale);

  return (
    <footer
      role="contentinfo"
      className="bg-ds-side text-ds-side-ink px-6 pt-12 pb-7 mt-15"
      style={{ marginTop: 60 }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/*
          PR-Q25 (#89): single column below `sm:`, two columns below `md:`,
          full 5-column desktop layout from `md:` up. Tailwind v4 arbitrary-
          value grid columns mirror the previous inline `'1.2fr repeat(4, 1fr)'`
          at desktop width while collapsing for mobile reflow (WCAG 1.4.10).
        */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-[10px] mb-[14px]">
              <BrandMark size={24} color="#5fcf86" />
              <div className="font-bold text-[15px]">{brandLabel}</div>
            </div>
            <p className="text-ds-side-muted text-[12.5px] leading-[1.65] m-0 max-w-[280px]">
              {resolvedTagline}
            </p>
          </div>
          {resolvedColumns.map((col) => (
            <nav key={col.id} aria-labelledby={col.id}>
              <h2
                id={col.id}
                className="text-[11px] tracking-[0.14em] uppercase text-ds-side-muted font-semibold mb-[10px] m-0"
              >
                {col.heading}
              </h2>
              <ul className="list-none p-0 m-0">
                {col.links.map((link) => (
                  <li key={link.href + link.label} className="py-[5px]">
                    <Link
                      href={link.href}
                      className="text-[13px] text-ds-side-ink hover:text-white focus-visible:outline-2 focus-visible:outline-ds-focus-ring-on-dark focus-visible:outline-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-9 pt-5 border-t border-white/10 flex justify-between gap-4 flex-wrap text-[11.5px] text-ds-side-muted">
          <span>{resolvedCopyright}</span>
          <span>
            {lastAuditLabel} {formattedDate} · {methodologyLabel} {methodologyVersion}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default FPFooter;
