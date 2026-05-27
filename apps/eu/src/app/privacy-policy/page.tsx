import type { Metadata } from 'next';
import { PolicyPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

const TITLE = 'Privacy Policy';
const DESCRIPTION = 'Privacy policy for The Nootropic Lab. How we collect, use, and protect your data.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'eu', path: '/privacy-policy/' }),
  openGraph: buildOpenGraph({ regionCode: 'eu', path: '/privacy-policy/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function PrivacyPolicyPage() {
  return <PolicyPage type="privacy" searchItems={searchItems} uiStrings={uiStrings} />;
}
