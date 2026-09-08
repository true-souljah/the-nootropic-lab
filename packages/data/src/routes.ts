// Route availability across the 8 region apps (GSC 404 cleanup, 2026-09).
//
// Shared chrome (footer, sidebar) and hreflang alternates must only point at
// pages that exist on the target region's host. Two sources of truth:
//
//   1. REGION_ONLY_ROUTES — static routes that exist in a subset of apps
//      (everything not listed here exists in all 8 apps).
//      `packages/ui/src/routes-inventory.test.ts` asserts this map against
//      the actual apps/<region>/src/app/**/page.tsx files.
//   2. regionsWithProduct(slug) — product review pages are data-driven
//      (`apps/<region>/src/app/[slug]/`), so a slug exists on a host only
//      when that region's product list contains it.
//
// `scripts/check-built-links.mjs` re-verifies both against the built
// `apps/*/out/` HTML after every build.
import type { RegionCode } from './regional';
import { productsUS } from './products-us';
import { productsEU } from './products-eu';
import { productsCA } from './products-ca';
import { productsAU } from './products-au';
import { productsJP } from './products-jp';
import { productsLatam } from './products-latam';
import { productsGCC } from './products-gcc';
import { productsSEA } from './products-sea';
import type { Product } from './products-us';

export const ALL_REGIONS: readonly RegionCode[] = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];

/** Static routes present only in the listed regions. Paths are slash-normalised (`/x`). */
export const REGION_ONLY_ROUTES: Readonly<Record<string, readonly RegionCode[]>> = {
  '/best-nootropics-for-adhd': ['us'],
  '/best-nootropics-for-energy': ['us'],
  '/best-nootropics-for-mood': ['us'],
  '/mind-lab-pro-vs-noocube': ['us'],
  '/mind-lab-pro-vs-alpha-brain': ['us'],
  '/mind-lab-pro-vs-qualia-mind': ['us'],
  '/mind-lab-pro-vs-thesis': ['us'],
  '/alpha-brain-vs-qualia-mind': ['us'],
  '/alpha-brain-vs-mind-lab-pro-vs-noocube': ['us'],
  '/shortlist': ['us'],
  '/dose-calculator': ['us'],
  '/braineffect-vs-mind-lab-pro': ['eu'],
  '/aor-ortho-mind-vs-mind-lab-pro': ['ca'],
  '/blackmores-brain-active-vs-mind-lab-pro': ['au'],
};

function normalisePath(path: string): string {
  const noHash = path.split('#')[0].split('?')[0];
  const trimmed = noHash.length > 1 ? noHash.replace(/\/+$/, '') : noHash;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** True when a static route (footer/sidebar/nav href) exists on the given region's host. */
export function routeAvailableIn(path: string, region: RegionCode): boolean {
  const only = REGION_ONLY_ROUTES[normalisePath(path)];
  return only === undefined || only.includes(region);
}

const PRODUCTS_BY_REGION: Readonly<Record<RegionCode, readonly Product[]>> = {
  us: productsUS,
  eu: productsEU,
  ca: productsCA,
  au: productsAU,
  jp: productsJP,
  latam: productsLatam,
  gcc: productsGCC,
  sea: productsSEA,
};

/** Regions whose product list carries `slug` — the only hosts where `/<slug>/` renders. */
export function regionsWithProduct(slug: string): RegionCode[] {
  return ALL_REGIONS.filter((region) => PRODUCTS_BY_REGION[region].some((p) => p.slug === slug));
}
