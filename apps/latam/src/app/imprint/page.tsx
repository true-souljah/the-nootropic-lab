import type { Metadata } from 'next';
import { ImprintPage, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Imprint / Aviso legal',
  description:
    'Imprint for the Latin American edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'latam', path: '/imprint/' }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/imprint/', title: 'Imprint / Aviso legal — The Nootropic Lab LATAM', description: 'Imprint for the Latin American edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
  twitter: buildTwitter({ title: 'Imprint / Aviso legal — The Nootropic Lab LATAM', description: 'Imprint for the Latin American edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Latin American edition (Spanish)"
      contactEmail={CONTACT_EMAIL}
      regionNote="Los suplementos alimenticios están regulados por agencias nacionales: ANVISA (Brasil) bajo RDC 243/2018, COFEPRIS (México), e INVIMA (Colombia). En Argentina, la Disposición 2105/2022 de la ANMAT prohíbe siete productos concretos de las marcas Newmind y PURENOOTROPICS (Noopept, F-Phenibut y Bacopa) — no recomendamos productos con Noopept ni F-Phenibut a lectores en Argentina. / Supplements are regulated by national agencies: ANVISA (Brazil), COFEPRIS (Mexico), INVIMA (Colombia). In Argentina, ANMAT Disposition 2105/2022 prohibits seven specific products of the Newmind and PURENOOTROPICS brands (Noopept, F-Phenibut and Bacopa) — we do not recommend products containing Noopept or F-Phenibut to Argentine readers."
    />
    </PublicShell>
  );
}
