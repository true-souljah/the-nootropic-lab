import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter, PublicShell} from '@nootropic/ui';
import { productsUS } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: 'Comparativa de Nootrópicos: Tabla Completa de Marcas en EE. UU.',
  description:
    'Compara todas las principales marcas de nootrópicos una al lado de la otra. Filtra por precio, puntuación, garantía de devolución y contenido de cafeína.',
  alternates: buildAlternates({ regionCode: 'us', path: '/es/comparar/', availableInRegions: ['us'] }),
  openGraph: buildOpenGraph({ regionCode: 'us', path: '/es/comparar/', title: 'Comparativa de Nootrópicos: Tabla Completa de Marcas en EE. UU.', description: 'Compara todas las principales marcas de nootrópicos una al lado de la otra. Filtra por precio, puntuación, garantía de devolución y contenido de cafeína.' }),
  twitter: buildTwitter({ title: 'Comparativa de Nootrópicos: Tabla Completa de Marcas en EE. UU.', description: 'Compara todas las principales marcas de nootrópicos una al lado de la otra. Filtra por precio, puntuación, garantía de devolución y contenido de cafeína.' }),
};

export default function EsCompararPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Comparativa de Nootrópicos ${CURRENT_YEAR}`,
    itemListElement: productsUS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
    
      <SchemaOrg schema={itemListSchema} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Herramienta de Comparación de Nootrópicos
        </h1>
        <p className="text-gray-600 mb-6">
          Compara todas las principales marcas estadounidenses una al lado de otra. Ordena los
          resultados por puntuación, precio o garantía de devolución del dinero. Filtra por
          productos sin cafeína.
        </p>
        <AffiliateDisclosure />
        <div className="mt-8">
          <ComparisonTable products={productsUS} market="us" />
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <a href="/nootropic-comparison" className="text-green-700 underline">
            🇺🇸 Versión en inglés: Nootropic Comparison Tool
          </a>
        </div>
      </div>
    </PublicShell>
  );
}
