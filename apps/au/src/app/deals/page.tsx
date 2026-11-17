import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { productsAU, getRegionalHealthDisclaimer, REGION_ONLY_ROUTES } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/au.json';

const TITLE = uiStrings.deals.metaTitle;
const DESCRIPTION = uiStrings.deals.metaDescription;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'au', path: '/deals/', availableInRegions: REGION_ONLY_ROUTES['/deals'] }),
  openGraph: buildOpenGraph({ regionCode: 'au', path: '/deals/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function DealsAUPage() {
  return (
    <DealsPage
      regionCode="au"
      products={productsAU}
      promosDoc={promosDoc}
      strings={uiStrings}
      searchItems={searchItems}
      healthDisclaimer={getRegionalHealthDisclaimer('au')}
      dateLocale={uiStrings.productDetail.dateLocale}
    />
  );
}
