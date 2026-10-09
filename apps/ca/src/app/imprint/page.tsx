import type { Metadata } from 'next';
import { ImprintPage, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Imprint',
  description:
    'Imprint for the Canadian edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/imprint/' }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: '/imprint/', title: 'Imprint — The Nootropic Lab Canada', description: 'Imprint for the Canadian edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
  twitter: buildTwitter({ title: 'Imprint — The Nootropic Lab Canada', description: 'Imprint for the Canadian edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
};

// regionNote quotes Health Canada (checked 2026-10-08):
// "assures consumers ... reviewed and approved by Health Canada for safety and efficacy" —
//   https://www.canada.ca/en/health-canada/services/drugs-health-products/natural-non-prescription/applications-submissions/product-licensing.html
// "To be licensed in Canada, natural health products must be safe, effective, of high quality" —
//   https://www.canada.ca/en/health-canada/services/drugs-health-products/natural-non-prescription/regulation/about-products.html
export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      marketLabel="Canadian edition"
      contactEmail={CONTACT_EMAIL}
      regionNote="Natural health products available in Canada are regulated by Health Canada under the Natural Health Products Regulations. Where a product holds an NPN (Natural Product Number), Health Canada says that number “assures consumers that the product has been reviewed and approved by Health Canada for safety and efficacy”; it also states, “To be licensed in Canada, natural health products must be safe, effective, of high quality” (canada.ca, checked 2026-10-08). A cross-border import without an NPN has not been through that Health Canada assessment."
    />
    </PublicShell>
  );
}
