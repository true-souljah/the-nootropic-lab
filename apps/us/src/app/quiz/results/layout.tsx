// The page itself is a client component (uses useSearchParams to decode the
// quiz answers from the URL), so metadata has to live on a parallel layout.

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { buildAlternates } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'Your nootropic stack — Quiz results',
  description:
    'Personalized nootropic recommendation based on your goals, caffeine sensitivity, budget, and money-back-guarantee preference. Top match plus two runner-ups, with confidence score.',
  robots: { index: false, follow: true },
  alternates: buildAlternates({ regionCode: 'us', path: '/quiz/results/', availableInRegions: ['us'] }),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function QuizResultsLayout({ children }: { children: ReactNode }) {
  return children;
}
