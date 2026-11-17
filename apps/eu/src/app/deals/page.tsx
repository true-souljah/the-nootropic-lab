import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { productsEU, getRegionalHealthDisclaimer, REGION_ONLY_ROUTES } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/eu.json';

const TITLE = uiStrings.deals.metaTitle;
const DESCRIPTION = uiStrings.deals.metaDescription;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'eu', path: '/deals/', availableInRegions: REGION_ONLY_ROUTES['/deals'] }),
  openGraph: buildOpenGraph({ regionCode: 'eu', path: '/deals/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function DealsEUPage() {
  return (
    <DealsPage
      regionCode="eu"
      products={productsEU}
      promosDoc={promosDoc}
      strings={uiStrings}
      searchItems={searchItems}
      healthDisclaimer={getRegionalHealthDisclaimer('eu')}
      dateLocale={uiStrings.productDetail.dateLocale}
    />
  );
}
