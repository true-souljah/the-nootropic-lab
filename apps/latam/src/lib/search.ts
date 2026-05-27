import { productsLatam, buildRegionSearchContext } from '@nootropic/data';

// Region-specific SearchModal index + UIStrings, built once at module load.
// Both exports are consumed by FPHeader / PublicShell / templates.
export const { searchItems, uiStrings } = buildRegionSearchContext(productsLatam, 'es');
