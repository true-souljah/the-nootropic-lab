import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/gcc.json';

const TITLE = uiStrings.deals.metaTitle;
const DESCRIPTION = uiStrings.deals.metaDescription;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'gcc', path: '/deals/', availableInRegions: ['us', 'eu', 'ca', 'au', 'latam', 'gcc', 'sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/deals/', title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

export default function DealsGCCPage() {
  return (
    <DealsPage
      regionCode="gcc"
      products={productsGCC}
      promosDoc={promosDoc}
      strings={uiStrings}
      searchItems={searchItems}
      healthDisclaimer={getRegionalHealthDisclaimer('gcc')}
      dateLocale={uiStrings.productDetail.dateLocale}
    />
  );
}
