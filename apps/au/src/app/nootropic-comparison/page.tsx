import type { Metadata } from 'next';
import { Comparator, SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsAU } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://au.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'Nootropic Comparator — Filter and Compare Side-by-Side (AU)',
  description: 'Filter by goal, price, grade, caffeine, EU compliance, and hands-on testing. Sort by score, price, value, or Trustpilot. Pick up to 3 products to compare side-by-side.',
  alternates: buildAlternates({ regionCode: 'au', path: '/nootropic-comparison/' }),
  openGraph: buildOpenGraph({ regionCode: 'au', path: '/nootropic-comparison/', title: 'Nootropic Comparator — Filter and Compare Side-by-Side (AU)', description: 'Filter by goal, price, grade, caffeine, EU compliance, and hands-on testing. Sort by score, price, value, or Trustpilot. Pick up to 3 products to compare side-by-side.' }),
  twitter: buildTwitter({ title: 'Nootropic Comparator — Filter and Compare Side-by-Side (AU)', description: 'Filter by goal, price, grade, caffeine, EU compliance, and hands-on testing. Sort by score, price, value, or Trustpilot. Pick up to 3 products to compare side-by-side.' }),
};

export default function ComparisonToolPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Nootropic Supplements ${CURRENT_YEAR}`,
    itemListElement: productsAU.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/${p.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={itemListSchema} />
      <Comparator
        products={productsAU}
        siteUrl={SITE_URL}
        searchItems={searchItems}
        uiStrings={uiStrings}
      />
    </>
  );
}
