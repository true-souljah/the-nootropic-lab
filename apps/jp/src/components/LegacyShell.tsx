import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@nootropic/ui';
import {
  productsJP,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

const searchItems = buildSearchIndex(productsJP, ingredients, guides);
const strings = getStrings('ja');

export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader market="jp" searchItems={searchItems} strings={strings} />
      <div role="note" className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
        <strong>Japan Import Note:</strong> Personal import limit is ¥16,000 duty-free.
        Orders above ¥16,000 may attract customs duties. Keep orders under 2 months supply.
      </div>
      <main className="min-h-screen">{children}</main>
      <SiteFooter strings={strings} />
    </>
  );
}
