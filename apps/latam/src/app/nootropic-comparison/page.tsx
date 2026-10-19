import type { Metadata } from 'next';
import { Comparator, SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { localizedProductsLatam } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

const TITLE = 'Comparador de Nootrópicos: Filtra y Compara Lado a Lado (Latam)';
const DESCRIPTION = 'Filtra por objetivo, precio, calificación, cafeína y tienda en la UE. Ordena por puntuación, precio, valor o Trustpilot. Elige hasta 3 productos para compararlos lado a lado.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'latam', path: '/nootropic-comparison/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/nootropic-comparison/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function ComparisonToolPage() {
  // Spanish "best for" tags (products-latam-es.ts); the goal filter still matches the English tags.
  const productsLatam = localizedProductsLatam('es');
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Los Mejores Suplementos Nootrópicos ${CURRENT_YEAR}`,
    itemListElement: productsLatam.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/${p.slug}/`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={itemListSchema} />
      <Comparator
        products={productsLatam}
        siteUrl={SITE_URL}
        searchItems={searchItems}
        uiStrings={uiStrings}
      />
    </>
  );
}
