import { describe, test, expect } from 'vitest';
import {
  REGION_PROFILES,
  licenceStatus,
  localPrice,
  regionalTitleQualifier,
  validateRegionalNotes,
  productsUS,
  productsEU,
  productsCA,
  productsAU,
  productsJP,
  productsLatam,
  productsGCC,
  productsSEA,
} from '@nootropic/data';
import type { RegionalRegionCode } from '@nootropic/data';

// Contract for the regional overlay (2026-09 audit). Every region must be
// able to derive a non-empty block from its own product data, and nothing
// may be invented: a licence label only appears when the record carries it.

const CATALOGS: [RegionalRegionCode, typeof productsUS][] = [
  ['us', productsUS], ['eu', productsEU], ['ca', productsCA], ['au', productsAU],
  ['jp', productsJP], ['latam', productsLatam], ['gcc', productsGCC], ['sea', productsSEA],
];

describe('REGION_PROFILES', () => {
  test('every region has a complete profile and label set', () => {
    for (const [code] of CATALOGS) {
      const p = REGION_PROFILES[code];
      expect(p.code).toBe(code);
      expect(p.name).toBeTruthy();
      expect(p.geoHub.path).toMatch(/^\/[a-z-]+\/$/);
      for (const [k, v] of Object.entries(p.labels)) expect(v, `${code} label ${k}`).toBeTruthy();
      expect(p.labels.heading).toContain('{name}');
    }
  });
});

describe('localPrice', () => {
  test("uses the region's own price field and never a foreign one", () => {
    for (const [code, products] of CATALOGS) {
      const priced = products.map((p) => localPrice(p, code)).filter(Boolean);
      expect(priced.length, `${code} has local prices`).toBeGreaterThan(0);
      for (const lp of priced) expect(lp!.currency).toBe(REGION_PROFILES[code].currency);
    }
  });
  test('returns null when the field is missing', () => {
    const p = { ...productsUS[0], priceMonthlyCAD: undefined };
    expect(localPrice(p, 'ca')).toBeNull();
  });
});

describe('licenceStatus', () => {
  test('CA maps npnStatus; AU maps austl; JP maps ffcStatus', () => {
    const base = productsUS[0];
    expect(licenceStatus({ ...base, npnStatus: { status: 'licensed', npn: '80012345' } }, 'ca')).toEqual({ label: 'NPN 80012345', tone: 'good' });
    expect(licenceStatus({ ...base, npnStatus: { status: 'pip' } }, 'ca')).toEqual({ label: 'Personal import (PIP)', tone: 'neutral' });
    expect(licenceStatus({ ...base, npnStatus: undefined }, 'ca')).toBeNull();
    expect(licenceStatus({ ...base, austl: '123456' }, 'au')?.label).toBe('AUST L 123456');
    expect(licenceStatus({ ...base, austl: undefined }, 'au')?.tone).toBe('neutral');
    expect(licenceStatus({ ...base, ffcStatus: { notified: false } }, 'jp')?.label).toBe('Imported (not FFC-notified)');
  });
  test('regions without a licence concept return null rather than a made-up label', () => {
    expect(licenceStatus(productsUS[0], 'us')).toBeNull();
    expect(licenceStatus(productsGCC[0], 'gcc')).toBeNull();
    expect(licenceStatus(productsLatam[0], 'latam')).toBeNull();
  });
});

describe('regionalTitleQualifier', () => {
  test('only qualifies pages with regional substance', () => {
    expect(regionalTitleQualifier('ca', 0)).toBe('');
    expect(regionalTitleQualifier('ca', 2)).toBe(' in Canada');
    expect(regionalTitleQualifier('eu', 0, { summary: 'x', sources: [{ label: 'a', url: 'https://a' }] })).toBe(' in the EU');
  });
});

describe('validateRegionalNotes', () => {
  test('the shipped notes are valid', () => {
    expect(validateRegionalNotes()).toEqual([]);
  });
  test('rejects notes without sources', () => {
    const bad = { ...Object.fromEntries(CATALOGS.map(([c]) => [c, { guides: {}, ingredients: {} }])) } as Parameters<typeof validateRegionalNotes>[0];
    bad!.ca = { guides: { 'what-are-nootropics': { summary: 'x', sources: [] } }, ingredients: {} };
    expect(validateRegionalNotes(bad)).toEqual(['ca/guides/what-are-nootropics: no sources']);
  });
});
