// Re-exports the region's siteUrl from the canonical REGIONS registry in
// @nootropic/ui. Pages import `SITE_URL` from here instead of declaring
// `const SITE_URL = 'https://...'` inline — the URL lives in exactly one
// place across the codebase.

import { REGIONS } from '@nootropic/ui';

export const SITE_URL = REGIONS.au.siteUrl;
