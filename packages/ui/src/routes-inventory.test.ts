import { describe, test, expect } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { ALL_REGIONS, REGION_ONLY_ROUTES, routeAvailableIn, regionsWithProduct, getStrings, productsUS } from '@nootropic/data';
import { columnsFromStrings, filterColumnsForRegion } from './public-chrome/FPFooter';

// REGION_ONLY_ROUTES is the runtime source of truth the footer filters on.
// This test pins it to the filesystem: every listed route must exist as
// apps/<region>/src/app/<route>/page.tsx exactly in the listed regions, and
// every static route that exists in a strict subset of apps must be listed.
// A new region-specific page without a map entry fails here, not in GSC.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');

function staticRoutes(region: string): Set<string> {
  const appRoot = resolve(REPO_ROOT, `apps/${region}/src/app`);
  const out = new Set<string>();
  const walk = (dir: string, rel: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('[')) continue; // dynamic segments are data-driven
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p, `${rel}/${entry.name}`);
      else if (entry.name === 'page.tsx') out.add(rel === '' ? '/' : rel);
    }
  };
  walk(appRoot, '');
  return out;
}

describe('REGION_ONLY_ROUTES matches apps/*/src/app on disk', () => {
  const inventory = new Map(ALL_REGIONS.map((r) => [r, staticRoutes(r)] as const));

  test('inventory is non-empty for every region (sanity)', () => {
    for (const [region, routes] of inventory) expect(routes.size, region).toBeGreaterThan(15);
  });

  for (const [route, regions] of Object.entries(REGION_ONLY_ROUTES)) {
    test(`${route} exists exactly in [${regions.join(', ')}]`, () => {
      for (const region of ALL_REGIONS) {
        expect(inventory.get(region)!.has(route), `${region} ${route}`).toBe(regions.includes(region));
      }
    });
  }

  test('every shared-chrome footer href that is not in all 8 apps is listed in REGION_ONLY_ROUTES', () => {
    const hrefs = new Set(
      columnsFromStrings(getStrings('en'))
        .flatMap((c) => c.links.map((l) => l.href.split('#')[0]))
        .filter((h) => h.startsWith('/')),
    );
    const partial = [...hrefs].filter((route) => !ALL_REGIONS.every((r) => inventory.get(r)!.has(route)));
    const unlisted = partial.filter((route) => !(route in REGION_ONLY_ROUTES));
    expect(unlisted, 'add these to REGION_ONLY_ROUTES in packages/data/src/routes.ts').toEqual([]);
  });
});

describe('routeAvailableIn / regionsWithProduct', () => {
  test('shared routes are available everywhere; US-only routes only in us', () => {
    for (const r of ALL_REGIONS) {
      expect(routeAvailableIn('/methodology', r)).toBe(true);
      expect(routeAvailableIn('/methodology#disclosures', r)).toBe(true);
      expect(routeAvailableIn('/best-nootropics-for-adhd/', r)).toBe(r === 'us');
    }
  });

  test('a US-only product resolves to [us]; a shared product to several regions', () => {
    // trubrain-review is carried by products-us.json only (the GSC report showed
    // au/trubrain-review 404ing because the US page advertised an en-AU alternate).
    expect(productsUS.some((p) => p.slug === 'trubrain-review')).toBe(true);
    expect(regionsWithProduct('trubrain-review')).toEqual(['us']);
    expect(regionsWithProduct('mind-lab-pro-review').length).toBeGreaterThan(1);
    expect(regionsWithProduct('does-not-exist-review')).toEqual([]);
  });
});

describe('footer columns per region only link pages that exist on that host', () => {
  const inventory = new Map(ALL_REGIONS.map((r) => [r, staticRoutes(r)] as const));
  for (const region of ALL_REGIONS) {
    test(`${region}: every internal footer href has a page.tsx`, () => {
      const cols = filterColumnsForRegion(columnsFromStrings(getStrings('en')), region);
      const internal = cols.flatMap((c) => c.links.map((l) => l.href)).filter((h) => h.startsWith('/'));
      expect(internal.length).toBeGreaterThan(8);
      for (const href of internal) {
        expect(inventory.get(region)!.has(href.split('#')[0]), `${region} footer → ${href}`).toBe(true);
      }
    });
  }

  test('us keeps the full column set; au gets its regional head-to-head before "All comparisons"', () => {
    const us = filterColumnsForRegion(columnsFromStrings(getStrings('en')), 'us');
    expect(us.flatMap((c) => c.links.map((l) => l.href))).toContain('/best-nootropics-for-adhd');
    const au = filterColumnsForRegion(columnsFromStrings(getStrings('en')), 'au');
    const h2h = au.find((c) => c.id === 'footer-col-head-to-head')!.links.map((l) => l.href);
    expect(h2h).toEqual(['/blackmores-brain-active-vs-mind-lab-pro', '/nootropic-comparison']);
    const ids = au.map((c) => c.id);
    expect(ids).toEqual(us.map((c) => c.id));
  });
});
