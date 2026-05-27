import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IngredientDetail, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { ingredients, productsEU } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

export const dynamicParams = false;

export function generateStaticParams() {
  return ingredients.map(ing => ({ ingredient: ing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ingredient: string }>;
}): Promise<Metadata> {
  const { ingredient } = await params;
  const ing = ingredients.find(i => i.slug === ingredient);
  if (!ing) return {};
  return {
    title: `${ing.name} — EU Nootropic Guide, Dosing, Effects & FAQs`,
    description: `${ing.name}: mechanism of action, clinical dose (${ing.clinicalDose}), human effect matrix, how to take, stacking guide, and consumer FAQs — EU-available products included.`,
    alternates: buildAlternates({ regionCode: 'eu', path: `/ingredients/${ingredient}/` }),
    openGraph: buildOpenGraph({ regionCode: 'eu', path: `/ingredients/${ingredient}/`, title: `${ing.name} — EU Nootropic Guide, Dosing, Effects & FAQs`, description: `${ing.name}: mechanism of action, clinical dose (${ing.clinicalDose}), human effect matrix, how to take, stacking guide, and consumer FAQs — EU-available products included.` }),
    twitter: buildTwitter({ title: `${ing.name} — EU Nootropic Guide, Dosing, Effects & FAQs`, description: `${ing.name}: mechanism of action, clinical dose (${ing.clinicalDose}), human effect matrix, how to take, stacking guide, and consumer FAQs — EU-available products included.` }),
  };
}

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ ingredient: string }>;
}) {
  const { ingredient } = await params;
  const ing = ingredients.find((i) => i.slug === ingredient);
  if (!ing) notFound();

  const containingProducts = productsEU.filter((p) =>
    ing.productsContaining.includes(p.slug)
  );
  const relatedIngredients = ingredients.filter((o) => o.slug !== ing.slug);

  return (
    <IngredientDetail
      ingredient={ing}
      containingProducts={containingProducts}
      relatedIngredients={relatedIngredients}
      siteUrl={SITE_URL}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
