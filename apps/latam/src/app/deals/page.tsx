import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { localizedProductsLatam, latamCountries, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/latam.json';

const TITLE = uiStrings.deals.metaTitle;
const DESCRIPTION = uiStrings.deals.metaDescription;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'latam', path: '/deals/', availableInRegions: ['us', 'eu', 'ca', 'au', 'latam', 'gcc', 'sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'latam', path: '/deals/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function DealsLatamPage() {
  // The Spanish record prose, as on /best-nootropics/.
  const products = localizedProductsLatam('es');
  return (
    <DealsPage
      regionCode="latam"
      products={products}
      promosDoc={promosDoc}
      strings={uiStrings}
      searchItems={searchItems}
      healthDisclaimer={getRegionalHealthDisclaimer('latam')}
      dateLocale={uiStrings.productDetail.dateLocale}
      markets={latamCountries.map((c) => ({ name: c.name, href: `/countries/${c.slug}/`, note: c.shippingNote }))}
    />
  );
}
