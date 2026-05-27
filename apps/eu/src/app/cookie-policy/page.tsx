import type { Metadata } from 'next';
import { PolicyPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

const TITLE = 'Cookie Policy';
const DESCRIPTION = 'Cookie policy for The Nootropic Lab. What cookies we use and how to control them.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'eu', path: '/cookie-policy/' }),
  openGraph: buildOpenGraph({ regionCode: 'eu', path: '/cookie-policy/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function CookiePolicyPage() {
  return <PolicyPage type="cookie" searchItems={searchItems} uiStrings={uiStrings} />;
}
