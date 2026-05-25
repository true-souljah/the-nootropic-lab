import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@nootropic/ui';
import {
  productsGCC,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

const searchItems = buildSearchIndex(productsGCC, ingredients, guides);
const strings = getStrings('en');

export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader market="gcc" searchItems={searchItems} strings={strings} />
      <div role="note" className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
        <strong>GCC Import Note:</strong> Verify supplement import status with your local customs
        authority before ordering. All products listed are caffeine-free unless otherwise noted.
      </div>
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}
