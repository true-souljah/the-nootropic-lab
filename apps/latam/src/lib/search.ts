import { localizedAllProductsLatam, buildRegionSearchContext } from '@nootropic/data';

// Region-specific SearchModal index + UIStrings, built once at module load.
// Both exports are consumed by FPHeader / PublicShell / templates.
// The product rows carry the Spanish summaries (products-latam-es.ts).
export const { searchItems, uiStrings } = buildRegionSearchContext(localizedAllProductsLatam('es'), 'es', 'latam');
