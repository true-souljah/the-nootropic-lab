// Factory used by each region app's `src/lib/search.ts` to build the
// SearchModal index + UIStrings in one call. Previously each app
// duplicated the same 5-line buildSearchIndex + getStrings boilerplate.

import { ingredients } from './ingredients';
import { guidesForRegion } from './guide-regions';
import { buildSearchIndex } from './search';
import type { SearchItem } from './search';
import { getStrings } from './i18n';
import type { Locale, UIStrings } from './i18n';
import type { Product } from './products-us';
import { REGION_PROFILES, type RegionCode } from './regional';

export interface RegionSearchContext {
  searchItems: SearchItem[];
  uiStrings: UIStrings;
}

export function buildRegionSearchContext(products: Product[], locale: Locale, region: RegionCode): RegionSearchContext {
  const strings = getStrings(locale);
  // English pages write prices the region's way (en-CA, en-AU, en-SG…); other
  // languages use their own locale (de-DE, fr-CA, ja-JP, es-419).
  const uiStrings: UIStrings = {
    ...strings,
    priceLocale: locale === 'en' ? REGION_PROFILES[region].priceLocale : strings.productDetail.dateLocale,
  };
  return {
    // Pass strings through so the 3 hardcoded "page" items in the search
    // index (Best Nootropics / Compare All / Methodology) render in the
    // current locale. WCAG 3.1.2 — these strings are visible in the ⌘K
    // SearchModal. Closed in PR-Q10.
    // Only the guides this host serves (guidesForRegion) — a guide limited to
    // other hosts would otherwise put a dead /guides/<slug>/ link in the index.
    searchItems: buildSearchIndex(products, ingredients, guidesForRegion(region), uiStrings),
    uiStrings,
  };
}
