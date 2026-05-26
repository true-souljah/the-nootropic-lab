import type { Metadata } from 'next';
import { ImprintPage, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://au.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab Australia',
  description:
    'Imprint for the Australian edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'au', path: '/imprint/' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Australian edition"
      contactEmail={CONTACT_EMAIL}
      regionNote="Therapeutic goods sold in Australia are regulated by the Therapeutic Goods Administration. AUST L–listed products carry pre-approved permitted indications; AUST R–registered products are higher-evidence. Editorial claim-language on this site adheres to the Therapeutic Goods Advertising Code."
    />
    </PublicShell>
  );
}
