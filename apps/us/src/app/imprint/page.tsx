import type { Metadata } from 'next';
import { ImprintPage, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab',
  description:
    'The Nootropic Lab is an independent editorial publication. Editorial standards, contact information, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'us', path: '/imprint/' }),
  openGraph: buildOpenGraph({ regionCode: 'us', path: '/imprint/', title: 'Imprint — The Nootropic Lab', description: 'The Nootropic Lab is an independent editorial publication. Editorial standards, contact information, and affiliate-disclosure policy.' }),
  twitter: buildTwitter({ title: 'Imprint — The Nootropic Lab', description: 'The Nootropic Lab is an independent editorial publication. Editorial standards, contact information, and affiliate-disclosure policy.' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="United States edition"
      contactEmail={CONTACT_EMAIL}
      regionNote="Reviews on this site are editorial content for educational purposes and do not constitute medical advice. Dietary supplement claims have not been evaluated by the U.S. Food and Drug Administration under the Dietary Supplement Health and Education Act of 1994 (DSHEA)."
    />
    </PublicShell>
  );
}
