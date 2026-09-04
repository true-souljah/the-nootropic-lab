import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IngredientDetail, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { ingredients, productsLatam, regionalIngredientNote, regionalTitleQualifier } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';
import { regionalProps } from '@/lib/regional';

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
  const localCount = productsLatam.filter((p) => ing.productsContaining.includes(p.slug)).length;
  const q = regionalTitleQualifier('latam', localCount, regionalIngredientNote('latam', ingredient));
  return {
    title: `${ing.name}${q} — Guía Notrópica Latam, Dosificación, Efectos y Preguntas Frecuentes`,
    description: `${ing.name}${q}: mecanismo de acción, dosis clínica (${ing.clinicalDose}), matriz de efectos en humanos, cómo tomarlo, guía de combinación y preguntas frecuentes — productos disponibles en Latam incluidos.`,
    alternates: buildAlternates({ regionCode: 'latam', path: `/ingredients/${ingredient}/` }),
    openGraph: buildOpenGraph({ regionCode: 'latam', path: `/ingredients/${ingredient}/`, title: `${ing.name}${q} — Guía Notrópica Latam, Dosificación, Efectos y Preguntas Frecuentes`, description: `${ing.name}${q}: mecanismo de acción, dosis clínica (${ing.clinicalDose}), matriz de efectos en humanos, cómo tomarlo, guía de combinación y preguntas frecuentes — productos disponibles en Latam incluidos.` }),
    twitter: buildTwitter({ title: `${ing.name}${q} — Guía Notrópica Latam, Dosificación, Efectos y Preguntas Frecuentes`, description: `${ing.name}${q}: mecanismo de acción, dosis clínica (${ing.clinicalDose}), matriz de efectos en humanos, cómo tomarlo, guía de combinación y preguntas frecuentes — productos disponibles en Latam incluidos.` }),
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

  const containingProducts = productsLatam.filter((p) =>
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
      regional={{ ...regionalProps(containingProducts), note: regionalIngredientNote('latam', ing.slug) }}
    />
  );
}
