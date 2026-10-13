import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  jpPrefectures, auStates, caProvinces, euCountries, gccCountries, seaCountries, latamCountries,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// A page-wide "all prices are in USD" must be true of the region's store
// prices (site-owner decision 2026-10-09: each price in its store's own
// currency, never converted). Every CA province page said "All prices are in
// USD — check current CAD/USD exchange rate" and the Quebec note said
// "Products ship in USD", while Mind Lab Pro (CA$89.00) and NooCube
// (CA$89.99) are priced in Canadian dollars (found 2026-10-13).
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REPO = join(__dirname, '..', '..', '..');
const REGIONS: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const GEO: Record<string, readonly object[]> = {
  jp: jpPrefectures, au: auStates, ca: caProvinces, eu: euCountries,
  gcc: gccCountries, sea: seaCountries, latam: latamCountries,
};

/** A claim that every price on the page or edition is in US dollars. */
const ALL_USD = /\ball prices (?:are|shown) in (?:USD|US dollars)\b|\bproducts (?:ship|are priced) in USD\b/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(path);
  }
  return out;
}

/** Currencies of the region's store prices. */
const currencies = (region: string): Set<string> =>
  new Set((REGIONS[region] ?? []).flatMap((p) => (p.storePrice ? [p.storePrice.currency] : [])));

describe('"all prices are in USD" claims match the region’s store prices', () => {
  const appFiles = Object.keys(REGIONS)
    .filter((region) => existsSync(join(REPO, 'apps', region, 'src')))
    .flatMap((region) => walk(join(REPO, 'apps', region, 'src')).map((file) => ({ region, file })));

  test('scans a non-empty source set and every region has priced products', () => {
    expect(appFiles.length).toBeGreaterThan(100);
    for (const region of Object.keys(REGIONS)) expect(currencies(region).size).toBeGreaterThan(0);
  });

  test('no app page says all prices are in USD in a region with non-USD store prices', () => {
    const wrong: string[] = [];
    for (const { region, file } of appFiles) {
      const other = [...currencies(region)].filter((c) => c !== 'USD');
      if (other.length === 0) continue;
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        const m = ALL_USD.exec(line);
        if (m) wrong.push(`${relative(REPO, file)}:${i + 1}: "${m[0]}" but ${region} store prices include ${other.join(', ')}`);
      });
    }
    expect(wrong).toEqual([]);
  });

  test('no geo note says all prices are in USD in a region with non-USD store prices', () => {
    const wrong: string[] = [];
    for (const [region, records] of Object.entries(GEO)) {
      const other = [...currencies(region)].filter((c) => c !== 'USD');
      if (other.length === 0) continue;
      for (const record of records) {
        for (const [key, value] of Object.entries(record)) {
          if (typeof value !== 'string') continue;
          const m = ALL_USD.exec(value);
          if (m) wrong.push(`${region}/${(record as { slug?: string }).slug}.${key}: "${m[0]}" but store prices include ${other.join(', ')}`);
        }
      }
    }
    expect(wrong).toEqual([]);
  });
});
