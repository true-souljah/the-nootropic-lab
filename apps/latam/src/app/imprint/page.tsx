import type { Metadata } from 'next';
import { ImprintPage } from '@nootropic/ui';

const SITE_URL = 'https://latam.thenootropiclab.com';
const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

export const metadata: Metadata = {
  title: 'Imprint / Aviso legal — The Nootropic Lab LATAM',
  description:
    'Imprint for the Latin American edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: { canonical: `${SITE_URL}/imprint/` },
};

export default function Page() {
  return (
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Latin American edition (Spanish)"
      contactEmail={CONTACT_EMAIL}
      regionNote="Los suplementos alimenticios están regulados por agencias nacionales: ANVISA (Brasil) bajo RDC 243/2018, COFEPRIS (México), e INVIMA (Colombia). En Argentina, ANMAT Disposición 2105/2022 prohíbe ciertos compuestos nootrópicos (incluyendo Noopept) — no recomendamos productos con esos ingredientes a lectores en Argentina. / Supplements are regulated by national agencies: ANVISA (Brazil), COFEPRIS (Mexico), INVIMA (Colombia). In Argentina, ANMAT Disposition 2105/2022 prohibits certain nootropic compounds (including Noopept) — we do not recommend products containing those ingredients to Argentine readers."
    />
  );
}
