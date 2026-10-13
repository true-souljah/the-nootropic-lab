// Re-exports the region's siteUrl from the canonical REGIONS registry in
// @nootropic/ui. Pages import `SITE_URL` from here instead of declaring
// `const SITE_URL = 'https://...'` inline — the URL lives in exactly one
// place across the codebase.

import { REGIONS } from '@nootropic/ui';

export const SITE_URL = REGIONS.jp.siteUrl;

/** Breadcrumb / back-link label of /best-nootropics/ on this host's page shells (the JP chrome is Japanese). */
export const HUB_LABEL = '日本のおすすめノートロピクス';

/** "Related guides" link label of the regulatory pillar /ffc-notified-cognitive-supplements/. */
export const FFC_PILLAR_LABEL = '日本で機能性表示食品として届出された認知機能サプリメント';
