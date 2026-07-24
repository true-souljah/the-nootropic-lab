import type { Metadata } from 'next';
import { PolicyPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

const TITLE = 'Terms of Use';
const DESCRIPTION = 'Terms of use for The Nootropic Lab: editorial nature, affiliate links, accuracy, warranties, and governing law.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'gcc', path: '/terms-of-use/' }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/terms-of-use/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function TermsOfUsePage() {
  return <PolicyPage type="terms" searchItems={searchItems} uiStrings={uiStrings} />;
}
