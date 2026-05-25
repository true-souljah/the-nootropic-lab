import type { Metadata } from 'next';
import { Shortlist } from '@nootropic/ui';
import { productsUS } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://thenootropiclab.com';

export const metadata: Metadata = {
  title: 'My shortlist — Nootropic Lab',
  description:
    'The nootropics you are considering. Stored on this device — share a copy-link to import the same picks on another device or browser. No account required.',
  robots: { index: false },
};

export default function ShortlistPage() {
  return (
    <Shortlist
      products={productsUS}
      siteUrl={SITE_URL}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
