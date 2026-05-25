import Link from 'next/link';
import { BrandMark } from '../primitives/BrandMark';

export interface FPFooterLink {
  label: string;
  href: string;
}

export interface FPFooterColumn {
  heading: string;
  links: FPFooterLink[];
}

export interface FPFooterProps {
  /** Column groups. Default = the Phase-2 English set (Best by goal, Head-to-head, By region, About). */
  columns?: FPFooterColumn[];
  /** Brand line shown in the left tagline column. */
  tagline?: string;
  brandLabel?: string;
  copyright?: string;
  lastAudit?: string;
}

const DEFAULT_COLUMNS: FPFooterColumn[] = [
  {
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
    heading: 'Head-to-head',
    links: [
      { label: 'Mind Lab Pro vs NooCube', href: '/mind-lab-pro-vs-noocube' },
      { label: 'Alpha Brain vs Qualia Mind', href: '/alpha-brain-vs-qualia-mind' },
      { label: 'Thesis vs Mind Lab Pro', href: '/mind-lab-pro-vs-thesis' },
      { label: 'All comparisons →', href: '/nootropic-comparison' },
    ],
  },
  {
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

const CURRENT_YEAR = new Date().getFullYear();

/**
 * FPFooter — dark slate footer used across all public surfaces. WCAG:
 * sidebar-text colors (ds-side-ink, ds-side-muted) verified at AA
 * against the ds-side background. The nav is labeled so screen-reader
 * users can skip the cluster.
 */
export function FPFooter({
  columns = DEFAULT_COLUMNS,
  tagline = "We audit every nootropic against its clinical-trial doses. Affiliate commissions are disclosed inline and don't move scores.",
  brandLabel = 'Nootropic Lab',
  copyright = `© ${CURRENT_YEAR} Nootropic Lab · Information is not medical advice. Consult a clinician before starting any supplement.`,
  lastAudit = 'Last full re-audit: 28 Apr 2026 · Methodology v3.2',
}: FPFooterProps) {
  return (
    <footer
      role="contentinfo"
      className="bg-ds-side text-ds-side-ink px-6 pt-12 pb-7 mt-15"
      style={{ marginTop: 60 }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: '1.2fr repeat(4, 1fr)' }}
        >
          <div>
            <div className="flex items-center gap-[10px] mb-[14px]">
              <BrandMark size={24} color="#5fcf86" />
              <div className="font-bold text-[15px]">{brandLabel}</div>
            </div>
            <p className="text-ds-side-muted text-[12.5px] leading-[1.65] m-0 max-w-[280px]">
              {tagline}
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-[11px] tracking-[0.14em] uppercase text-ds-side-muted font-semibold mb-[10px] m-0">
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
          <span>{copyright}</span>
          <span>{lastAudit}</span>
        </div>
      </div>
    </footer>
  );
}

export default FPFooter;
