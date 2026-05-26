import type { ReactNode } from 'react';
import type { UIStrings } from '@nootropic/data';
import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';
import type { SearchItem } from '../SearchModal';

export type LegacyShellMarket =
  | 'us'
  | 'eu'
  | 'ca'
  | 'au'
  | 'jp'
  | 'latam'
  | 'gcc'
  | 'sea';

export interface LegacyShellProps {
  market: LegacyShellMarket;
  searchItems: SearchItem[];
  strings: UIStrings;
  children: ReactNode;
}

/**
 * Wraps un-migrated pages with the legacy green-flask SiteHeader +
 * SiteFooter. Once a page is migrated to a new template (Listicle,
 * HeadToHead, etc.), it stops using this shell and renders its own
 * chrome (FPHeader + FPFooter). The CookieBanner is intentionally NOT
 * here — it lives in the root layout so it persists across both legacy
 * and migrated pages.
 *
 * Each region app re-exports this via a thin local wrapper that supplies
 * the market + region-specific search index + strings, so importing
 * pages can keep writing `import LegacyShell from '@/components/LegacyShell'`.
 */
export function LegacyShell({ market, searchItems, strings, children }: LegacyShellProps) {
  return (
    <>
      <SiteHeader market={market} searchItems={searchItems} strings={strings} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}

export default LegacyShell;
