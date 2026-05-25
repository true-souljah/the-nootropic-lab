import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@nootropic/ui';
import {
  productsUS,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

const searchItems = buildSearchIndex(productsUS, ingredients, guides);
const strings = getStrings('en');

/**
 * LegacyShell — wraps an un-migrated page with the existing green-flask
 * SiteHeader + SiteFooter. Once a page is migrated to a new template
 * (Listicle, HeadToHead, etc.), it stops using this shell and renders
 * its own chrome (FPHeader + FPFooter).
 *
 * The CookieBanner is intentionally NOT in this shell — it lives in
 * the root layout so it persists across both legacy and migrated pages.
 */
export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader market="us" searchItems={searchItems} strings={strings} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}
