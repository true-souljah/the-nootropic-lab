import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@nootropic/ui';
import {
  productsLatam,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

const searchItems = buildSearchIndex(productsLatam, ingredients, guides);
const strings = getStrings('es');

export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader market="latam" searchItems={searchItems} strings={strings} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}
