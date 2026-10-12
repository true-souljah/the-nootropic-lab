import { allProductsUS, buildRegionSearchContext } from '@nootropic/data';

// Spanish-locale SearchModal index + UIStrings. Used by /es/* pages so the
// disclosure strip and notice, nav, footer and search render in Spanish
// instead of falling back to the English bundle.
export const { searchItems, uiStrings } = buildRegionSearchContext(allProductsUS, 'es', 'us');
