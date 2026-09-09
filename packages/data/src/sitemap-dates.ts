// <lastmod> resolution for the per-region sitemap generators (2026-09 GSC work).
//
// Every entry used to carry `new Date()` at build time, so each deploy told
// Google that all ~550 URLs had changed. Google honours lastmod only when it
// is "consistently and verifiably accurate" and otherwise ignores it — which
// left pages that genuinely changed (regional overlay, Sep 2026) uncrawled
// since June. A page's lastmod is now the latest commit date among the files
// that produce it: its own page.tsx plus the data files it renders (see
// scripts/content-dates.mjs for how content-dates.json is produced).
//
// Fail-closed: a page with no entry in the map throws at build time with the
// command to run, rather than silently falling back to the build timestamp.
import contentDates from './content-dates.json';
import type { RegionCode } from './regional';

const DATES: Record<string, string> = contentDates;

export function contentFileDate(path: string): Date {
  const iso = DATES[path];
  if (!iso) {
    throw new Error(
      `sitemap-dates: no commit date for "${path}" in packages/data/src/content-dates.json — ` +
        `run \`npm run content-dates\` (needs full git history) and commit the result.`,
    );
  }
  return new Date(iso);
}

/** Latest of the given dates; strings are ISO dates (e.g. Product.updatedAt; empty strings are skipped). */
export function latestDate(...inputs: Array<Date | string | undefined>): Date {
  let best: Date | undefined;
  for (const input of inputs) {
    if (input === undefined || input === '') continue;
    const d = typeof input === 'string' ? new Date(input) : input;
    if (Number.isNaN(d.getTime())) throw new Error(`sitemap-dates: invalid date "${String(input)}"`);
    if (!best || d > best) best = d;
  }
  if (!best) throw new Error('sitemap-dates: latestDate() called with no dates');
  return best;
}

const GEO_DATA: Partial<Record<RegionCode, string>> = {
  au: 'packages/data/src/au-states.ts',
  ca: 'packages/data/src/ca-provinces.ts',
  eu: 'packages/data/src/eu-countries.ts',
  gcc: 'packages/data/src/gcc-countries.ts',
  jp: 'packages/data/src/jp-prefectures.ts',
  latam: 'packages/data/src/latam-countries.ts',
  sea: 'packages/data/src/sea-countries.ts',
};

/** Regions whose guide/ingredient/product pages render a regional-notes overlay. */
const REGIONAL_NOTES: Partial<Record<RegionCode, string>> = {
  au: 'packages/data/src/regional-notes/au.ts',
  ca: 'packages/data/src/regional-notes/ca.ts',
  eu: 'packages/data/src/regional-notes/eu.ts',
  gcc: 'packages/data/src/regional-notes/gcc.ts',
  jp: 'packages/data/src/regional-notes/jp.ts',
  sea: 'packages/data/src/regional-notes/sea.ts',
};

const OVERLAY = 'packages/data/src/regional.ts';
const INGREDIENTS = 'packages/data/src/ingredients.ts';
/** LATAM renders the Spanish guide set; every other region the English one. */
const guidesFile = (region: RegionCode) =>
  region === 'latam' ? 'packages/data/src/guides-es.ts' : 'packages/data/src/guides.ts';

/**
 * Per-region resolver. `route` is the app-relative directory of the page
 * (`''` for the home page, `'best-nootropics'`, `'fr/comparer'`, …).
 */
export function routeDates(region: RegionCode) {
  const app = `apps/${region}/src/app`;
  const products = `packages/data/src/products-${region}.json`;
  const GUIDES = guidesFile(region);
  const overlayInputs = [OVERLAY, REGIONAL_NOTES[region]].filter((p): p is string => Boolean(p)).map(contentFileDate);
  const pageFile = (route: string) => contentFileDate(route ? `${app}/${route}/page.tsx` : `${app}/page.tsx`);
  return {
    /** Static page whose copy lives in its page.tsx (methodology, imprint, …). */
    page: (route: string) => pageFile(route),
    /** Static page that lists or compares products (home, hubs, best-of, comparisons, locale landings). */
    productListing: (route: string) => latestDate(pageFile(route), contentFileDate(products)),
    /** Product review page: shared template + region catalogue + the record's own updatedAt + overlay. */
    product: (p: { updatedAt?: string }) =>
      latestDate(pageFile('[slug]'), contentFileDate(products), p.updatedAt, ...overlayInputs),
    ingredientsHub: () => latestDate(pageFile('ingredients'), contentFileDate(INGREDIENTS)),
    /** Ingredient page: shared data + overlay block listing the region's products. */
    ingredient: () =>
      latestDate(pageFile('ingredients/[ingredient]'), contentFileDate(INGREDIENTS), contentFileDate(products), ...overlayInputs),
    guidesHub: () => latestDate(pageFile('guides'), contentFileDate(GUIDES)),
    /** Guide page: guide set + overlay block listing the region's products. */
    guide: () => latestDate(pageFile('guides/[guide]'), contentFileDate(GUIDES), contentFileDate(products), ...overlayInputs),
    /** Geo hub (`states`, `provinces`, `countries`, `prefectures`). */
    geoHub: (dir: string) => latestDate(pageFile(dir), contentFileDate(geoData(region))),
    /** Geo leaf page under `dir/[param]`; lists the region's products. */
    geo: (dir: string, param: string) =>
      latestDate(pageFile(`${dir}/[${param}]`), contentFileDate(geoData(region)), contentFileDate(products)),
    /** US `/<state>/best-nootropics/` pages: state list is inline in the page. */
    usState: () => latestDate(pageFile('[slug]/best-nootropics'), contentFileDate(products)),
  };
}

function geoData(region: RegionCode): string {
  const file = GEO_DATA[region];
  if (!file) throw new Error(`sitemap-dates: region "${region}" has no geo data file`);
  return file;
}
