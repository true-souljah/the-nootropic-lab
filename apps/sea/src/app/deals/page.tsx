import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { productsSEA, seaCountries, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/sea.json';

const TITLE = uiStrings.deals.metaTitle;
const DESCRIPTION = uiStrings.deals.metaDescription;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'sea', path: '/deals/', availableInRegions: ['us', 'eu', 'ca', 'au', 'latam', 'gcc', 'sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/deals/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function DealsSEAPage() {
  return (
    <DealsPage
      regionCode="sea"
      products={productsSEA}
      promosDoc={promosDoc}
      strings={uiStrings}
      searchItems={searchItems}
      healthDisclaimer={getRegionalHealthDisclaimer('sea')}
      dateLocale={uiStrings.productDetail.dateLocale}
      markets={seaCountries.map((c) => ({ name: c.name, href: `/countries/${c.slug}/`, note: c.shippingNote }))}
    />
  );
}
