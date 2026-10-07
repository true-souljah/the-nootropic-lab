import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail, SchemaOrg, buildAlternates} from '@nootropic/ui';
import { allProductsLatam, productsLatam, rankByScore, regionsWithProduct, buildProductSchema, getRegionalHealthDisclaimer } from '@nootropic/data';
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
  const title = `${product.name} Review ${CURRENT_YEAR} — Independent Score & Ingredient Audit`;
  // An unscored record (score null, incomplete pillars) states no score.
  const scoreClause = product.score === null ? '' : ` Score: ${product.score}/10.`;
  const description = `Independent review of ${product.name}.${scoreClause} Clinical dosing audit, pros and cons, and full affiliate disclosure.`;
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
  const product = allProductsLatam.find((p) => p.slug === slug);
  if (!product) notFound();

  const alternatives = rankByScore(productsLatam.filter((p) => p.slug !== product.slug)).slice(0, 3);

  // null for an unscored product: no Product JSON-LD without a rating.
  const productSchema = buildProductSchema(product, SITE_URL);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: `${SITE_URL}/best-nootropics/` },
      { '@type': 'ListItem', position: 3, name: `${product.name} Review` },
    ],
  };

  return (
    <>
      {productSchema && <SchemaOrg schema={productSchema} />}
      <SchemaOrg schema={breadcrumbSchema} />
      <ProductDetail
        product={product}
        alternatives={alternatives}
        siteUrl={SITE_URL}
        searchItems={searchItems}
        uiStrings={uiStrings}
        healthDisclaimer={getRegionalHealthDisclaimer('latam')}
        regional={regionalProductProps(product)}
      />
    </>
  );
}
