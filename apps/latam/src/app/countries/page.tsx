import type { Metadata } from 'next';
import { GeoIndexPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { latamCountries } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();
const TITLE = `Mejores nootrópicos por país ${CURRENT_YEAR}`;
const DESCRIPTION = 'Guías de compra país por país para América Latina: normativa de importación personal, tiempos de envío y los stacks mejor calificados disponibles en cada mercado.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'latam', path: '/countries/', availableInRegions: ['latam'] }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/countries/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

// Hub for the /countries/ geo guides. Until 2026-09 these pages were listed only
// in sitemap.ts and had no inbound link on any host, so Google left the
// newer ones undiscovered for months.
export default function GeoHubPage() {
  return (
    <GeoIndexPage
      title={TITLE}
      intro="Cada guía cubre el regulador de suplementos del país, las reglas de importación personal, los tiempos de envío habituales y los stacks mejor calificados que envían allí."
      basePath="/countries"
      items={latamCountries}
      siteUrl={SITE_URL}
      hubLabel="Mejores nootrópicos Latam"
      homeLabel="Inicio"
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
