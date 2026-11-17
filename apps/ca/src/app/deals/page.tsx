import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { productsCA, getRegionalHealthDisclaimer, REGION_ONLY_ROUTES } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/ca.json';

const TITLE = uiStrings.deals.metaTitle;
const DESCRIPTION = uiStrings.deals.metaDescription;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'ca', path: '/deals/', availableInRegions: REGION_ONLY_ROUTES['/deals'] }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: '/deals/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function DealsCAPage() {
  return (
    <DealsPage
      regionCode="ca"
      products={productsCA}
      promosDoc={promosDoc}
      strings={uiStrings}
      searchItems={searchItems}
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      dateLocale={uiStrings.productDetail.dateLocale}
    />
  );
}
