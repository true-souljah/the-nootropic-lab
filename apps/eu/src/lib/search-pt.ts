import { productsEU, buildRegionSearchContext } from '@nootropic/data';

// Portuguese-locale SearchModal index + UIStrings. Used by /pt/* pages
// so nav, footer, table headers, and consent UI render in Portuguese
// instead of falling back to the English bundle.
export const { searchItems, uiStrings } = buildRegionSearchContext(productsEU, 'pt');
