import type { Metadata } from 'next';
import { ImprintPage, LanguageRuns, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { jpImprintNoteParts, sitemapDate } from '@nootropic/data';

const CONTACT_EMAIL = 'editorial@thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';
import sitemap from '@/app/sitemap';

export const metadata: Metadata = {
  title: 'Imprint / 運営者情報',
  description:
    'Imprint for the Japanese edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/imprint/' }),
  openGraph: buildOpenGraph({ regionCode: 'jp', path: '/imprint/', title: 'Imprint / 運営者情報 — The Nootropic Lab Japan', description: 'Imprint for the Japanese edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
  twitter: buildTwitter({ title: 'Imprint / 運営者情報 — The Nootropic Lab Japan', description: 'Imprint for the Japanese edition of The Nootropic Lab. Publisher information, contact details, editorial standards, and affiliate-disclosure policy.' }),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
    <ImprintPage
      siteUrl={SITE_URL}
      updated={sitemapDate(sitemap(), '/imprint/')}
      marketLabel="Japanese edition"
      contactEmail={CONTACT_EMAIL}
      regionNote={<LanguageRuns parts={jpImprintNoteParts} />}
    />
    </PublicShell>
  );
}
