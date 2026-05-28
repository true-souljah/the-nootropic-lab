import { productsCA, buildRegionSearchContext } from '@nootropic/data';

// Quebec French (fr-CA) SearchModal index + UIStrings. Used by /fr/* pages
// so nav, footer, table headers, breadcrumbs, and consent UI render in
// Canadian French instead of falling back to the English bundle. Closes
// the CA Wave-1 audit's Quebec Bill 96 / WCAG 3.1.2 chrome leak.
export const { searchItems, uiStrings } = buildRegionSearchContext(productsCA, 'fr-CA');
