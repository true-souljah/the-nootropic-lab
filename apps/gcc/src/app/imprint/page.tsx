import type { Metadata } from 'next';
import { ImprintPage } from '@nootropic/ui';

const SITE_URL = 'https://gcc.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

export const metadata: Metadata = {
  title: 'Imprint — The Nootropic Lab GCC',
  description:
    'Imprint for the GCC edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: { canonical: `${SITE_URL}/imprint/` },
};

export default function Page() {
  return (
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="GCC edition (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman)"
      contactEmail={CONTACT_EMAIL}
      regionNote="Dietary supplements sold in Saudi Arabia are regulated by the Saudi Food and Drug Authority (SFDA); in the UAE by the Ministry of Health and Prevention (MOHAP). Halal-certifying authorities accepted in the GCC include JAKIM Malaysia, MUI Indonesia, Halal Council of Britain, and SFDA-recognized bodies. We surface Halal certification per product where verifiable and never fabricate certifications."
    />
  );
}
