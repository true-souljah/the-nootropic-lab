import { describe, test, expect } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  HEAD_TO_HEAD_PAGES, headToHeadFor, routeAvailableIn, ALL_REGIONS,
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product, RegionalRegionCode as RegionCode } from '@nootropic/data';

// Review pages link to the head-to-heads their product appears in
// (packages/data/src/head-to-head.ts). This keeps the registry complete and
// every link pointing at a page and products that exist on that host.
const REPO = join(__dirname, '..', '..', '..');
const CATALOGUES: Record<RegionCode, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

// Two-product head-to-head page directories: exactly one "-vs-".
const pageDirs = ALL_REGIONS.flatMap((region) => {
  const dir = join(REPO, 'apps', region, 'src', 'app');
  return readdirSync(dir)
    .filter((name) => name.split('-vs-').length === 2 && existsSync(join(dir, name, 'page.tsx')))
    .map((name) => ({ region, path: `/${name}/` }));
});

describe('head-to-head registry', () => {
  test('finds the head-to-head pages in the apps', () => {
    expect(pageDirs.length).toBeGreaterThanOrEqual(5);
  });

  test('every two-product head-to-head page is in HEAD_TO_HEAD_PAGES', () => {
    const listed = new Set(HEAD_TO_HEAD_PAGES.map((p) => p.path));
    expect(pageDirs.filter((p) => !listed.has(p.path)).map((p) => `${p.region}${p.path}`)).toEqual([]);
  });

  test('every listed page exists in exactly the regions routes.ts serves it in', () => {
    const problems: string[] = [];
    for (const page of HEAD_TO_HEAD_PAGES) {
      for (const region of ALL_REGIONS) {
        const built = pageDirs.some((d) => d.region === region && d.path === page.path);
        const served = routeAvailableIn(page.path, region);
        if (built !== served) problems.push(`${region}${page.path}: page=${built} routes.ts=${served}`);
      }
    }
    expect(problems).toEqual([]);
  });

  test('both products of every page exist in each region serving it', () => {
    const problems: string[] = [];
    for (const page of HEAD_TO_HEAD_PAGES) {
      for (const region of ALL_REGIONS.filter((r) => routeAvailableIn(page.path, r))) {
        for (const slug of page.products) {
          if (!CATALOGUES[region].some((p) => p.slug === slug)) problems.push(`${region}${page.path}: ${slug} missing`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test('headToHeadFor returns only pages on that host', () => {
    expect(headToHeadFor('mind-lab-pro-review', 'us').map((l) => l.href)).toEqual([
      '/mind-lab-pro-vs-alpha-brain/', '/mind-lab-pro-vs-qualia-mind/', '/mind-lab-pro-vs-noocube/', '/mind-lab-pro-vs-thesis/',
    ]);
    expect(headToHeadFor('mind-lab-pro-review', 'ca').map((l) => l.href)).toEqual(['/aor-ortho-mind-vs-mind-lab-pro/']);
    expect(headToHeadFor('mind-lab-pro-review', 'jp')).toEqual([]);
    expect(headToHeadFor('no-such-review', 'us')).toEqual([]);
  });
});
