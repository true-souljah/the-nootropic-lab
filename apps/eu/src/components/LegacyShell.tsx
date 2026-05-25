import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@nootropic/ui';
import {
  productsEU,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

const searchItems = buildSearchIndex(productsEU, ingredients, guides);
const strings = getStrings('en');

export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader market="eu" searchItems={searchItems} strings={strings} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}
