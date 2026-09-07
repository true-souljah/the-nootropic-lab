// Regional overlay props for this app (2026-09 audit). Guide and ingredient
// pages spread `regionalProps(products)` into the shared RegionalAvailability
// block so this host carries facts only this region has.
import type { Product } from '@nootropic/data';
import { REGION_PROFILES, getRegionalHealthDisclaimer } from '@nootropic/data';
import { buildGeoIndexLinks } from '@nootropic/ui';

export const REGION = REGION_PROFILES.us;

export function regionalProps(products: Product[]) {
  return {
    region: REGION,
    products,
    geoLinks: [],
    regulatoryNote: getRegionalHealthDisclaimer('us'),
  };
}
