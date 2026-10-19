import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail, SchemaOrg, buildAlternates} from '@nootropic/ui';
import { allProductsLatam, localizeProductLatam, localizedProductsLatam, regionsWithProduct, headToHeadFor, buildProductSchema, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';
import { regionalProductProps } from '@/lib/regional';

const CURRENT_YEAR = new Date().getFullYear();

export const dynamicParams = false;

export function generateStaticParams() {
  // Every record, discontinued included: its review page stays published.
  return allProductsLatam.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = allProductsLatam.find((p) => p.slug === slug);
  if (!product) return {};
  const title = `Reseña de ${product.name} ${CURRENT_YEAR}: puntuación independiente y auditoría de ingredientes`;
  const description = `Reseña independiente de ${product.name}. Puntuación: ${product.score}/10. Auditoría de dosis clínicas, pros y contras, y divulgación completa de afiliados.`;
  return {
    title,
    description,
    alternates: buildAlternates({ regionCode: 'latam', path: `/${slug}/`, availableInRegions: regionsWithProduct(slug) }),
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ProductReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = allProductsLatam.find((p) => p.slug === slug);
  if (!record) notFound();
  // Spanish prose from products-latam-es.ts; data keys stay English-sourced.
  const product = localizeProductLatam(record, 'es');

  const alternatives = localizedProductsLatam('es')
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const productSchema = buildProductSchema(product, SITE_URL);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Los Mejores Nootrópicos', item: `${SITE_URL}/best-nootropics/` },
      { '@type': 'ListItem', position: 3, name: `Reseña de ${product.name}` },
    ],
  };

  return (
    <>
      <SchemaOrg schema={productSchema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <ProductDetail
        product={product}
        alternatives={alternatives}
        headToHead={headToHeadFor(product.slug, 'latam')}
        siteUrl={SITE_URL}
        searchItems={searchItems}
        uiStrings={uiStrings}
        healthDisclaimer={getRegionalHealthDisclaimer('latam')}
        regional={regionalProductProps(product)}
      />
    </>
  );
}
