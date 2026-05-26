import type { Metadata } from 'next';
import { ImprintPage, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab',
  description:
    'The Nootropic Lab is an independent editorial publication. Editorial standards, contact information, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'us', path: '/imprint/' }),
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
