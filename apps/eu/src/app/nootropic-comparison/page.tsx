import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Nootropic Comparison: Side-by-Side Table for Every Major EU Brand',
  description:
    'Sort and filter every major EU nootropic brand side-by-side. Compare score, price (EUR), caffeine content, money-back guarantee, EU compliance, and Trustpilot rating.',
};

export default function ComparisonToolEUPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Nootropic Supplements Europe 2026',
    itemListElement: productsEU.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://eu.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={itemListSchema} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Nootropic Comparison Tool — EU</h1>
        <p className="text-gray-600 mb-6">
          Compare every major EU-available brand side-by-side. Sort by score, price, or money-back
          guarantee. Filter by caffeine-free. All prices in EUR.
        </p>
        <AffiliateDisclosure />
        <div className="mt-8">
          <ComparisonTable products={productsEU} market="eu" />
        </div>
      </div>
    </>
  );
}
