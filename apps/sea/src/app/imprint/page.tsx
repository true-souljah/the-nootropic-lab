import type { Metadata } from 'next';
import { ImprintPage, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Imprint',
  description:
    'Imprint for the Southeast Asia edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/imprint/' }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/imprint/', title: 'Imprint — The Nootropic Lab SEA', description: 'Imprint for the Southeast Asia edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
  twitter: buildTwitter({ title: 'Imprint — The Nootropic Lab SEA', description: 'Imprint for the Southeast Asia edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Southeast Asia edition (SG, MY, ID, PH, TH, VN)"
      contactEmail={CONTACT_EMAIL}
      regionNote="Health supplements in Singapore are regulated by the Health Sciences Authority (HSA); in Malaysia by NPRA; in Indonesia by BPOM; in the Philippines by FDA Philippines; in Thailand by FDA Thailand. Halal certification (BPJPH) is required by law for supplements marketed to Indonesian consumers from 18 October 2026; in Malaysia, products described as halal must be certified (JAKIM). We surface certification status per product where verifiable."
    />
    </PublicShell>
  );
}
