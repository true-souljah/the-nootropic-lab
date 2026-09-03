import type { Metadata } from 'next';
import { GeoIndexPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { caProvinces } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();
const TITLE = `Best Nootropics by Province ${CURRENT_YEAR}`;
const DESCRIPTION = 'Province-by-province buyer\'s guides for Canada: NPN licensing notes, shipping times to each province, and the top-rated stacks available to Canadian residents.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'ca', path: '/provinces/', availableInRegions: ['ca'] }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: '/provinces/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

// Hub for the /provinces/ geo guides. Until 2026-09 these pages were listed only
// in sitemap.ts and had no inbound link on any host, so Google left the
// newer ones undiscovered for months.
export default function GeoHubPage() {
  return (
    <GeoIndexPage
      title={TITLE}
      intro="Each guide covers Health Canada NPN licensing as it applies to that province, typical delivery times, and the top-rated stacks shipping there."
      basePath="/provinces"
      items={caProvinces}
      siteUrl={SITE_URL}
      hubLabel="Best Nootropics Canada"
      homeLabel="Home"
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
