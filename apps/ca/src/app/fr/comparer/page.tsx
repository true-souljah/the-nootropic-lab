import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsCA } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Outil de comparaison de nootropiques — Canada',
  description:
    'Comparez côte à côte toutes les grandes marques de nootropiques disponibles au Canada. Filtrez par score, prix, teneur en caféine, garantie de remboursement et cote Trustpilot.',
  alternates: {
    languages: {
      'en-CA': '/nootropic-comparison',
      'fr-CA': '/fr/comparer',
    },
  },
};

export default function FrComparerPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Les meilleurs suppléments nootropiques au Canada 2026',
    itemListElement: productsCA.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://ca.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <div lang="fr-CA">
      <SchemaOrg schema={itemListSchema} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Outil de comparaison de nootropiques — Canada
        </h1>
        <p className="text-gray-600 mb-6">
          Comparez toutes les grandes marques disponibles au Canada côte à côte. Triez par score,
          prix ou garantie de remboursement. Filtrez les produits sans caféine.
        </p>
        <AffiliateDisclosure />
        <div className="mt-8">
          <ComparisonTable products={productsCA} market="us" />
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <a href="/nootropic-comparison" className="text-green-700 underline">
            🇨🇦 Version anglaise : Nootropic Comparison Tool
          </a>
        </div>
      </div>
    </div>
  );
}
