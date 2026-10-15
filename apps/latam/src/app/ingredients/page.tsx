import type { Metadata } from 'next';
import { IngredientLibrary, SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter, tpl } from '@nootropic/ui';
import { localizedIngredients } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const CURRENT_YEAR = new Date().getFullYear();
const ingredients = localizedIngredients('es');
const TITLE = `Guía de ingredientes nootrópicos ${CURRENT_YEAR} — Dosis clínicas y evidencia`;
const DESCRIPTION =
  'Compara ingredientes nootrópicos respaldados por evidencia: dosis clínicas, mecanismos, tiempo hasta el efecto y qué productos los contienen.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'latam', path: '/ingredients/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/ingredients/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function IngredientsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Comparación de ingredientes nootrópicos',
    numberOfItems: ingredients.length,
    itemListElement: ingredients.map((ing, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ing.name,
      url: `https://latam.thenootropiclab.com/ingredients/${ing.slug}/`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <IngredientLibrary
        ingredients={ingredients}
        searchItems={searchItems}
        uiStrings={uiStrings}
        hero={{
          h1: tpl(uiStrings.ingredientLibrary.guideHeading, { year: CURRENT_YEAR }),
          dek: `${ingredients.length} compuestos nootrópicos respaldados por evidencia. Dosis clínicas, mecanismos de acción y qué stacks mejor puntuados contienen cada ingrediente, calificados según la evidencia de ECA.`,
        }}
      />
    </>
  );
}
