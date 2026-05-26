import type { Metadata } from 'next';
import { DoseCalculator, buildAlternates} from '@nootropic/ui';
import { ingredients, productsUS } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://thenootropiclab.com';

export const metadata: Metadata = {
  title: 'Dose calculator — Nootropic Lab',
  description:
    'Build a custom nootropic stack and check each ingredient against the clinical-trial dose. Get a stack score and see the closest off-the-shelf product.',
  robots: { index: false },
  alternates: buildAlternates({ regionCode: 'us', path: '/dose-calculator/' }),
};

export default function DoseCalculatorPage() {
  return (
    <DoseCalculator
      ingredients={ingredients}
      products={productsUS}
      siteUrl={SITE_URL}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
