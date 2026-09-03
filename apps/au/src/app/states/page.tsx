import type { Metadata } from 'next';
import { GeoIndexPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { auStates } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();
const TITLE = `Best Nootropics by State & Territory ${CURRENT_YEAR}`;
const DESCRIPTION = 'State-by-state buyer\'s guides for Australia: TGA Personal Importation Scheme notes, shipping times to each state, and the top-rated stacks available to Australian residents.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'au', path: '/states/', availableInRegions: ['au'] }),
  openGraph: buildOpenGraph({ regionCode: 'au', path: '/states/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

// Hub for the /states/ geo guides. Until 2026-09 these pages were listed only
// in sitemap.ts and had no inbound link on any host, so Google left the
// newer ones undiscovered for months.
export default function GeoHubPage() {
  return (
    <GeoIndexPage
      title={TITLE}
      intro="Each guide covers the TGA Personal Importation Scheme as it applies to that state or territory, typical delivery times, and the top-rated stacks shipping there."
      basePath="/states"
      items={auStates}
      siteUrl={SITE_URL}
      hubLabel="Best Nootropics Australia"
      homeLabel="Home"
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
