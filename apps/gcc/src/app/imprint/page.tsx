import type { Metadata } from 'next';
import { ImprintPage, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://gcc.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab GCC',
  description:
    'Imprint for the GCC edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/imprint/' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="GCC edition (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman)"
      contactEmail={CONTACT_EMAIL}
      regionNote="Dietary supplements sold in Saudi Arabia are regulated by the Saudi Food and Drug Authority (SFDA); in the UAE by the Ministry of Health and Prevention (MOHAP). Halal-certifying authorities accepted in the GCC include JAKIM Malaysia, MUI Indonesia, Halal Council of Britain, and SFDA-recognized bodies. We surface Halal certification per product where verifiable and never fabricate certifications."
    />
    </PublicShell>
  );
}
