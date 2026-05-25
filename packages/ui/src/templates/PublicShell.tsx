import type { ReactNode } from 'react';
import { FPDisclosure } from '../public-chrome/FPDisclosure';
import { FPHeader } from '../public-chrome/FPHeader';
import { FPFooter } from '../public-chrome/FPFooter';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

export interface PublicShellProps {
  children: ReactNode;
  /** Search index for the ⌘K modal in FPHeader. */
  searchItems?: SearchItem[];
  /** Locale strings for the embedded SearchModal. */
  uiStrings?: UIStrings;
  /** Override the methodology link target on the affiliate disclosure. */
  methodologyHref?: string;
  /**
   * When true, suppress the affiliate disclosure banner. Use for pages
   * that contain no affiliate links (privacy policy, imprint, contact).
   */
  hideDisclosure?: boolean;
  /**
   * Background applied to <main>. Defaults to `bg-ds-card` so legacy
   * content reads against white. Set to `bg-ds-bg` for content that
   * uses the new page-background pattern.
   */
  mainBackground?: 'card' | 'bg';
}

/**
 * PublicShell — the bare public/SEO chrome (FPDisclosure + FPHeader +
 * main slot + FPFooter). Use as a drop-in replacement for LegacyShell
 * on pages that should adopt the new chrome but keep their existing
 * inline content unchanged.
 */
export default function PublicShell({
  children,
  searchItems,
  uiStrings,
  methodologyHref = '/methodology',
  hideDisclosure = false,
  mainBackground = 'card',
}: PublicShellProps) {
  const bg = mainBackground === 'bg' ? 'bg-ds-bg' : 'bg-ds-card';
  return (
    <div
      className={`${bg} text-ds-ink ds-font-features`}
      style={{ fontFamily: 'var(--font-ds-sans)' }}
    >
      {!hideDisclosure && <FPDisclosure methodologyHref={methodologyHref} />}
      <FPHeader searchItems={searchItems} strings={uiStrings} />
      <main className="min-h-[60vh]">{children}</main>
      <FPFooter />
    </div>
  );
}
