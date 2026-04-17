import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsLatam } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Herramienta de Comparación de Nootrópicos — América Latina',
  description:
    'Ordena y filtra todas las marcas principales de nootrópicos disponibles en América Latina lado a lado. Compara puntuación, precio, contenido de cafeína, garantía de devolución y calificación en Trustpilot.',
};

export default function ComparisonToolPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Los Mejores Suplementos Nootrópicos en América Latina 2026',
    itemListElement: productsLatam.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://latam.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={itemListSchema} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Herramienta de Comparación de Nootrópicos — América Latina
        </h1>
        <p className="text-gray-600 mb-6">
          Compara todas las marcas principales disponibles en América Latina lado a lado. Ordena por puntuación, precio o
          garantía de devolución. Filtra por libre de cafeína.
        </p>
        <AffiliateDisclosure />
        <div className="mt-8">
          <ComparisonTable products={productsLatam} market="us" />
        </div>
      </div>
    </>
  );
}
