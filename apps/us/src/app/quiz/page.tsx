import type { Metadata } from 'next';
import { QuizFlow, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Build my stack — 2-minute nootropic quiz',
  description:
    'Five quick questions about your goals, caffeine tolerance, budget, and money-back preference. We match you against our full audited catalog and surface the best fit.',
  robots: { index: false },
  alternates: buildAlternates({ regionCode: 'us', path: '/quiz/' }),
  openGraph: buildOpenGraph({ regionCode: 'us', path: '/quiz/', title: 'Build my stack — 2-minute nootropic quiz', description: 'Five quick questions about your goals, caffeine tolerance, budget, and money-back preference. We match you against our full audited catalog and surface the best fit.' }),
  twitter: buildTwitter({ title: 'Build my stack — 2-minute nootropic quiz', description: 'Five quick questions about your goals, caffeine tolerance, budget, and money-back preference. We match you against our full audited catalog and surface the best fit.' }),
};

export default function QuizPage() {
  return <QuizFlow products={productsUS} resultsHref="/quiz/results" skipHref="/best-nootropics" />;
}
