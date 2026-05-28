import { productsEU, buildRegionSearchContext } from '@nootropic/data';

// German-locale SearchModal index + UIStrings. Used by /de/* pages so
// nav, footer, table headers, and consent UI render in German instead
// of falling back to the English bundle.
export const { searchItems, uiStrings } = buildRegionSearchContext(productsEU, 'de');
