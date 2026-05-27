// Factory used by each region app's `src/lib/search.ts` to build the
// SearchModal index + UIStrings in one call. Previously each app
// duplicated the same 5-line buildSearchIndex + getStrings boilerplate.

import { ingredients } from './ingredients';
import { guides } from './guides';
import { buildSearchIndex } from './search';
import type { SearchItem } from './search';
import { getStrings } from './i18n';
import type { Locale, UIStrings } from './i18n';
import type { Product } from './products-us';

export interface RegionSearchContext {
  searchItems: SearchItem[];
  uiStrings: UIStrings;
}

export function buildRegionSearchContext(products: Product[], locale: Locale): RegionSearchContext {
  return {
    searchItems: buildSearchIndex(products, ingredients, guides),
    uiStrings: getStrings(locale),
  };
}
