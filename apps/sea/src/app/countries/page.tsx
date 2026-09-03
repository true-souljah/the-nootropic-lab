import type { Metadata } from 'next';
import { GeoIndexPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { seaCountries } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();
const TITLE = `Best Nootropics by Country ${CURRENT_YEAR}`;
const DESCRIPTION = 'Country-by-country buyer\'s guides for Southeast Asia: HSA, NPRA, Thai FDA, FDA Philippines, BPOM and VFA import notes, shipping times, and the top-rated stacks in each market.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'sea', path: '/countries/', availableInRegions: ['sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/countries/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

// Hub for the /countries/ geo guides. Until 2026-09 these pages were listed only
// in sitemap.ts and had no inbound link on any host, so Google left the
// newer ones undiscovered for months.
export default function GeoHubPage() {
  return (
    <GeoIndexPage
      title={TITLE}
      intro="Each guide covers that country's supplement regulator and personal-import rules, typical delivery times, and the top-rated stacks shipping there."
      basePath="/countries"
      items={seaCountries}
      siteUrl={SITE_URL}
      hubLabel="Best Nootropics SEA"
      homeLabel="Home"
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
