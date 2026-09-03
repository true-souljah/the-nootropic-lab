import type { Metadata } from 'next';
import { GeoIndexPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { jpPrefectures } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();
const TITLE = `Best Nootropics by Prefecture ${CURRENT_YEAR}`;
const DESCRIPTION = 'Prefecture-by-prefecture buyer\'s guides for Japan: MHLW personal-import notes, delivery times to each prefecture, and the top-rated stacks available in Japan.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'jp', path: '/prefectures/', availableInRegions: ['jp'] }),
  openGraph: buildOpenGraph({ regionCode: 'jp', path: '/prefectures/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

// Hub for the /prefectures/ geo guides. Until 2026-09 these pages were listed only
// in sitemap.ts and had no inbound link on any host, so Google left the
// newer ones undiscovered for months.
export default function GeoHubPage() {
  return (
    <GeoIndexPage
      title={TITLE}
      intro="Every guide below covers the same MHLW personal-import rules and the ¥16,000 duty-free threshold, then adds delivery times and the top-rated stacks shipping to that prefecture."
      basePath="/prefectures"
      items={jpPrefectures.map(p => ({ slug: p.slug, name: p.name, note: p.nameJa }))}
      siteUrl={SITE_URL}
      hubLabel="Best Nootropics Japan"
      homeLabel="Home"
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
