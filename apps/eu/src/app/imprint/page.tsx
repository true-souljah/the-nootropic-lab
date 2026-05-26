import type { Metadata } from 'next';
import { ImprintPage, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://eu.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Impressum — The Nootropic Lab',
  description:
    'Impressum / Imprint for the EU edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/imprint/' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="European Union edition"
      contactEmail={CONTACT_EMAIL}
      regionNote="Health claims about cognitive supplements published in the EU are governed by Regulation (EC) No 1924/2006. Editorial copy on this site describes ingredient mechanisms studied in clinical trials and does not assert label-grade health claims. Only EFSA-approved health claims may appear on product labelling."
    />
    </PublicShell>
  );
}
