import type { Metadata } from 'next';
import { DoseCalculator, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { ingredients, productsUS } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Dose calculator — Nootropic Lab',
  description:
    'Build a custom nootropic stack and check each ingredient against the clinical-trial dose. Get a stack score and see the closest off-the-shelf product.',
  robots: { index: false },
  alternates: buildAlternates({ regionCode: 'us', path: '/dose-calculator/' }),
  openGraph: buildOpenGraph({ regionCode: 'us', path: '/dose-calculator/', title: 'Dose calculator — Nootropic Lab', description: 'Build a custom nootropic stack and check each ingredient against the clinical-trial dose. Get a stack score and see the closest off-the-shelf product.' }),
  twitter: buildTwitter({ title: 'Dose calculator — Nootropic Lab', description: 'Build a custom nootropic stack and check each ingredient against the clinical-trial dose. Get a stack score and see the closest off-the-shelf product.' }),
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
