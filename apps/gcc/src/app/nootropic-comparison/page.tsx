import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsGCC } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Nootropic Comparison Tool — GCC',
  description:
    'Sort and filter every major nootropic brand available in GCC side-by-side. Compare score, price, caffeine content, money-back guarantee, and Trustpilot rating.',
};

export default function ComparisonToolPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Nootropic Supplements GCC 2026',
    itemListElement: productsGCC.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://gcc.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={itemListSchema} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Nootropic Comparison Tool — GCC
        </h1>
        <p className="text-gray-600 mb-6">
          Compare every major brand available in GCC side-by-side. Sort by score, price, or
          money-back guarantee. Filter by caffeine-free.
        </p>
        <AffiliateDisclosure />
        <div className="mt-8">
          <ComparisonTable products={productsGCC} market="us" />
        </div>
      </div>
    </>
  );
}
