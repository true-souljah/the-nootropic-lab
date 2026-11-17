import type { Metadata } from 'next';
import { DealsPage, buildAlternates, buildOpenGraph, buildTwitter } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import promosDoc from '../../../../../packages/data/promos/us.json';
export const metadata: Metadata = { title: { absolute: uiStrings.deals.metaTitle }, description: uiStrings.deals.metaDescription, alternates: buildAlternates({ regionCode: 'us', path: '/deals/' }), openGraph: buildOpenGraph({ regionCode: 'us', path: '/deals/', title: uiStrings.deals.metaTitle, description: uiStrings.deals.metaDescription }), twitter: buildTwitter({ title: uiStrings.deals.metaTitle, description: uiStrings.deals.metaDescription }) };
export default function Page() { return <DealsPage regionCode="us" products={productsUS} promosDoc={promosDoc} strings={uiStrings} searchItems={searchItems} healthDisclaimer={getRegionalHealthDisclaimer('us')} dateLocale={uiStrings.productDetail.dateLocale} />; }
