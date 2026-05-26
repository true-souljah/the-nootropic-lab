import type { Metadata } from 'next';
import { ImprintPage, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://ca.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab Canada',
  description:
    'Imprint for the Canadian edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/imprint/' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Canadian edition"
      contactEmail={CONTACT_EMAIL}
      regionNote="Natural health products available in Canada are regulated by Health Canada under the Natural Health Products Regulations. Where a product holds an NPN (Natural Product Number), it has been assessed by Health Canada for safety, efficacy, and quality. Cross-border imports without an NPN are not Health Canada licensed."
    />
    </PublicShell>
  );
}
