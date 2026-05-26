import type { Metadata } from 'next';
import { IngredientLibrary, SchemaOrg, buildAlternates} from '@nootropic/ui';
import { ingredients } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Nootropic Ingredients Guide ${CURRENT_YEAR} — Clinical Doses & Evidence`,
  description:
    'Compare evidence-backed nootropic ingredients. Clinical doses, mechanisms, time to effect, and which products contain them.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/ingredients/' }),
};

export default function IngredientsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Nootropic Ingredients Comparison',
    numberOfItems: ingredients.length,
    itemListElement: ingredients.map((ing, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ing.name,
      url: `https://thenootropiclab.com/ingredients/${ing.slug}`,
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
          h1: `Nootropic Ingredients Guide ${CURRENT_YEAR}`,
          dek: `${ingredients.length} evidence-backed nootropic compounds. Clinical doses, mechanisms of action, and which top-rated stacks contain each ingredient — graded on RCT evidence.`,
        }}
      />
    </>
  );
}
