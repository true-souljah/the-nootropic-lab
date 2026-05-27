import type { Metadata } from 'next';
import { ImprintPage, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab GCC',
  description:
    'Imprint for the GCC edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/imprint/' }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/imprint/', title: 'Imprint — The Nootropic Lab GCC', description: 'Imprint for the GCC edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
  twitter: buildTwitter({ title: 'Imprint — The Nootropic Lab GCC', description: 'Imprint for the GCC edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
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
