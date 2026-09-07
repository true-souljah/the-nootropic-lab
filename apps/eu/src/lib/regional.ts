// Regional overlay props for this app (2026-09 audit). Guide and ingredient
// pages spread `regionalProps(products)` into the shared RegionalAvailability
// block so this host carries facts only this region has.
import type { Product } from '@nootropic/data';
import { REGION_PROFILES, getRegionalHealthDisclaimer, buildRegionalBuying, hasRegionalBuyingContent, euCountries } from '@nootropic/data';
import { buildGeoIndexLinks } from '@nootropic/ui';

export const REGION = REGION_PROFILES.eu;

export function regionalProps(products: Product[]) {
  return {
    region: REGION,
    products,
    geoLinks: buildGeoIndexLinks(euCountries, '/countries').slice(0, 6),
    regulatoryNote: getRegionalHealthDisclaimer('eu'),
  };
}

/** "Buying in <region>" block props for a product review page; undefined when the record has nothing regional to show. */
export function regionalProductProps(product: Product) {
  const data = buildRegionalBuying(product, 'eu');
  if (!hasRegionalBuyingContent(data)) return undefined;
  return { data, geoLinks: regionalProps([]).geoLinks };
}
