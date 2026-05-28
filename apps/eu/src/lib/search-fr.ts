import { productsEU, buildRegionSearchContext } from '@nootropic/data';

// French-locale SearchModal index + UIStrings. Used by /fr/* pages so
// nav, footer, table headers, and consent UI render in French instead
// of falling back to the English bundle.
export const { searchItems, uiStrings } = buildRegionSearchContext(productsEU, 'fr');
