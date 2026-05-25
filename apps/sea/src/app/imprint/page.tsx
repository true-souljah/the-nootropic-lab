import type { Metadata } from 'next';
import { ImprintPage } from '@nootropic/ui';

const SITE_URL = 'https://sea.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab SEA',
  description:
    'Imprint for the Southeast Asia edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: { canonical: `${SITE_URL}/imprint/` },
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Southeast Asia edition (SG, MY, ID, PH, TH, VN)"
      contactEmail={CONTACT_EMAIL}
      regionNote="Health supplements in Singapore are regulated by the Health Sciences Authority (HSA); in Malaysia by NPRA; in Indonesia by BPOM; in the Philippines by FDA Philippines; in Thailand by FDA Thailand. Halal certification is mandatory for supplements marketed to Indonesian (BPJPH) and Malaysian (JAKIM) consumers under federal law. We surface certification status per product where verifiable."
    />
    </PublicShell>
  );
}
