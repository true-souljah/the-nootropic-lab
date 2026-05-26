import type { Metadata } from 'next';
import { Comparator, SchemaOrg, buildAlternates} from '@nootropic/ui';
import { productsCA } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://ca.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'Nootropic Comparator — Filter and Compare Side-by-Side (CA)',
  description: 'Filter by goal, price, grade, caffeine, EU compliance, and hands-on testing. Sort by score, price, value, or Trustpilot. Pick up to 3 products to compare side-by-side.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/nootropic-comparison/' }),
};

export default function ComparisonToolPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Nootropic Supplements ${CURRENT_YEAR}`,
    itemListElement: productsCA.map((p, i) => ({
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
        products={productsCA}
        siteUrl={SITE_URL}
        searchItems={searchItems}
        uiStrings={uiStrings}
      />
    </>
  );
}
