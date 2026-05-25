import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@nootropic/ui';
import {
  productsCA,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

const searchItems = buildSearchIndex(productsCA, ingredients, guides);
const strings = getStrings('en');

export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader market="ca" searchItems={searchItems} strings={strings} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}
