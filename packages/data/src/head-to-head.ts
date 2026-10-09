// Two-product head-to-head pages (`apps/<region>/src/app/<a>-vs-<b>/`) and the
// product reviews they compare. Each review page links to the head-to-heads
// its product appears in, so a reader on a review finds the comparisons and
// the comparisons link back to the review (2026-10-09: the US Mind Lab Pro
// review drew 7 impressions for "mind lab pro" while /mind-lab-pro-vs-alpha-brain
// drew 52).
//
// Regions come from routes.ts (REGION_ONLY_ROUTES), so a page is linked only on
// a host that has it. head-to-head.test.ts checks that every two-product page
// in the apps is listed here and that every product slug exists in the regions
// where the page is served.
import type { RegionCode } from './regional';
import { routeAvailableIn } from './routes';

export interface HeadToHeadPage {
  path: string;
  label: string;
  /** Review slugs of the two products compared. */
  products: readonly [string, string];
}

export const HEAD_TO_HEAD_PAGES: readonly HeadToHeadPage[] = [
  { path: '/mind-lab-pro-vs-alpha-brain/', label: 'Mind Lab Pro vs Alpha Brain', products: ['mind-lab-pro-review', 'onnit-alpha-brain-review'] },
  { path: '/mind-lab-pro-vs-qualia-mind/', label: 'Mind Lab Pro vs Qualia Mind', products: ['mind-lab-pro-review', 'qualia-mind-review'] },
  { path: '/mind-lab-pro-vs-noocube/', label: 'Mind Lab Pro vs NooCube', products: ['mind-lab-pro-review', 'noocube-review'] },
  { path: '/mind-lab-pro-vs-thesis/', label: 'Mind Lab Pro vs Thesis', products: ['mind-lab-pro-review', 'thesis-nootropics-review'] },
  { path: '/alpha-brain-vs-qualia-mind/', label: 'Alpha Brain vs Qualia Mind', products: ['onnit-alpha-brain-review', 'qualia-mind-review'] },
  { path: '/aor-ortho-mind-vs-mind-lab-pro/', label: 'AOR Ortho•Mind vs Mind Lab Pro', products: ['aor-ortho-mind-review', 'mind-lab-pro-review'] },
  { path: '/blackmores-brain-active-vs-mind-lab-pro/', label: 'Blackmores Brain Active vs Mind Lab Pro', products: ['blackmores-brain-active-review', 'mind-lab-pro-review'] },
];

/** Head-to-head pages on `region`'s host that compare the product with `slug`. */
export function headToHeadFor(slug: string, region: RegionCode): { label: string; href: string }[] {
  return HEAD_TO_HEAD_PAGES.filter((p) => p.products.includes(slug) && routeAvailableIn(p.path, region)).map((p) => ({
    label: p.label,
    href: p.path,
  }));
}
