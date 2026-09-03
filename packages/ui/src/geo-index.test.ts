import { describe, test, expect } from 'vitest';
import { buildGeoIndexLinks } from './templates/GeoIndexPage';
import {
  jpPrefectures,
  auStates,
  caProvinces,
  euCountries,
  gccCountries,
  seaCountries,
  latamCountries,
} from '@nootropic/data';

// Data-shape contract for the geo hub pages added after the 2026-09 audit:
// every geo record must produce exactly one trailing-slash link under its
// region's base path. vitest is not DOM-configured here; rendered output is
// covered by e2e/{jp,au,ca,sea}-geo-index.spec.ts.

const DATASETS: [string, string, readonly { slug: string; name: string }[]][] = [
  ['jp', '/prefectures', jpPrefectures],
  ['au', '/states', auStates],
  ['ca', '/provinces', caProvinces],
  ['eu', '/countries', euCountries],
  ['gcc', '/countries', gccCountries],
  ['sea', '/countries', seaCountries],
  ['latam', '/countries', latamCountries],
];

describe('buildGeoIndexLinks', () => {
  test('one trailing-slash link per record, base path preserved', () => {
    for (const [region, base, items] of DATASETS) {
      const links = buildGeoIndexLinks(items, base);
      expect(links, `${region} count`).toHaveLength(items.length);
      expect(items.length, `${region} has data`).toBeGreaterThan(0);
      for (const l of links) {
        expect(l.href, `${region} ${l.href}`).toMatch(new RegExp(`^${base}/[a-z-]+/$`));
        expect(l.label, `${region} ${l.href} label`).toBeTruthy();
      }
    }
  });

  test('accepts a base path with or without a trailing slash', () => {
    expect(buildGeoIndexLinks([{ slug: 'tokyo', name: 'Tokyo' }], '/prefectures/')).toEqual([
      { href: '/prefectures/tokyo/', label: 'Tokyo' },
    ]);
    expect(buildGeoIndexLinks([{ slug: 'tokyo', name: 'Tokyo', note: '東京都' }], '/prefectures')).toEqual([
      { href: '/prefectures/tokyo/', label: 'Tokyo', note: '東京都' },
    ]);
  });

  test('slugs are unique within every dataset (no duplicate hub links)', () => {
    for (const [region, , items] of DATASETS) {
      const slugs = items.map((i) => i.slug);
      expect(new Set(slugs).size, `${region} unique slugs`).toBe(slugs.length);
    }
  });
});
