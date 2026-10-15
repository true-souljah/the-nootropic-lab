import { allProductsJP, buildRegionSearchContext } from '@nootropic/data';

// Region-specific SearchModal index + UIStrings, built once at module load.
// Both exports are consumed by FPHeader / PublicShell / templates.
// English chrome: Japanese copy on the JP host is paused until a Japanese
// pharmaceutical-advertising lawyer has reviewed it (owner decision
// 2026-10-13). Prices keep yen formatting through
// REGION_PROFILES.jp.priceLocale ('ja-JP').
export const { searchItems, uiStrings } = buildRegionSearchContext(allProductsJP, 'en', 'jp');
