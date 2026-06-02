import { describe, test, expect } from 'vitest';
import { getRegionalHealthDisclaimer } from '@nootropic/data';
import type { DisclaimerMarket } from '@nootropic/data';

// Tests for getRegionalHealthDisclaimer (packages/data/src/regional-
// disclaimers.ts). PR-C2 (#45) wired this helper into ProductDetail on
// CA /[slug]/page.tsx; PR-C2c (#52) extended that pattern to BestOf on
// /best-nootropics/. The helper has 3 behaviours worth locking in:
//   1. Each market returns a distinct region-specific string with the
//      expected regulator references (FDA for us, Health Canada for ca,
//      EFSA for eu, TGA for au, MHLW/CAA for jp, ANVISA/COFEPRIS for
//      latam, SFDA for gcc, BPOM/JAKIM for sea)
//   2. An unknown market returns a generic disclaimer (not undefined)
//   3. Input normalization (case-insensitive lookup)
//
// Cross-package test placement: see product-schema.test.ts for the
// rationale.

const ALL_MARKETS: DisclaimerMarket[] = [
  'us',
  'eu',
  'ca',
  'au',
  'jp',
  'latam',
  'gcc',
  'sea',
];

describe('getRegionalHealthDisclaimer — coverage + content', () => {
  test('returns a non-empty string for every declared market', () => {
    for (const m of ALL_MARKETS) {
      const d = getRegionalHealthDisclaimer(m);
      expect(d, `market=${m}`).toBeTruthy();
      expect(d.length, `market=${m} length`).toBeGreaterThan(100);
    }
  });

  test('us disclaimer references FDA', () => {
    const d = getRegionalHealthDisclaimer('us');
    expect(d).toContain('Food and Drug Administration');
  });

  test('eu disclaimer references EFSA + EU Regulation 1924/2006', () => {
    const d = getRegionalHealthDisclaimer('eu');
    expect(d).toContain('EFSA');
    expect(d).toContain('1924/2006');
  });

  test('ca disclaimer references Health Canada + NPN', () => {
    const d = getRegionalHealthDisclaimer('ca');
    expect(d).toContain('Health Canada');
    expect(d).toContain('NPN');
    expect(d).toContain('Natural Health Products Regulations');
  });

  test('au disclaimer references TGA + AUST L', () => {
    const d = getRegionalHealthDisclaimer('au');
    expect(d).toContain('Therapeutic Goods Administration');
    expect(d).toContain('AUST L');
  });

  test('jp disclaimer references MHLW + FFC + FOSHU systems', () => {
    const d = getRegionalHealthDisclaimer('jp');
    expect(d).toContain('Consumer Affairs Agency');
    expect(d).toContain('FFC');
    expect(d).toContain('FOSHU');
    // The JP disclaimer is bilingual (Japanese + English) — verify both halves
    expect(d).toContain('機能性表示食品');
  });

  test('latam disclaimer references multiple regulators incl. ANVISA + COFEPRIS', () => {
    const d = getRegionalHealthDisclaimer('latam');
    expect(d).toContain('ANVISA');
    expect(d).toContain('COFEPRIS');
    expect(d).toContain('INVIMA');
    expect(d).toContain('ANMAT');
    // LATAM disclaimer is bilingual (Spanish + English)
    expect(d).toContain('consejo médico');
  });

  test('gcc disclaimer references SFDA + MOHAP', () => {
    const d = getRegionalHealthDisclaimer('gcc');
    expect(d).toContain('Saudi Food and Drug Authority');
    expect(d).toContain('MOHAP');
    // Halal is a meaningful GCC trust signal per audit
    expect(d).toContain('Halal');
  });

  test('sea disclaimer references regional regulators', () => {
    const d = getRegionalHealthDisclaimer('sea');
    expect(d).toContain('Health Sciences Authority');
    expect(d).toContain('NPRA');
    expect(d).toContain('BPOM');
    // Halal certification is mandatory in ID + MY
    expect(d).toContain('BPJPH');
    expect(d).toContain('JAKIM');
  });
});

describe('getRegionalHealthDisclaimer — fallback behaviour', () => {
  test('returns generic disclaimer when market is undefined', () => {
    const d = getRegionalHealthDisclaimer(undefined);
    expect(d).toBeTruthy();
    expect(d).toContain('educational purposes');
    expect(d).toContain('medical advice');
  });

  test('returns generic disclaimer for an unknown market string', () => {
    const d = getRegionalHealthDisclaimer('mars');
    expect(d).toBeTruthy();
    expect(d).toContain('educational purposes');
  });

  test('returns generic disclaimer for an empty string', () => {
    const d = getRegionalHealthDisclaimer('');
    expect(d).toBeTruthy();
    expect(d).toContain('educational purposes');
  });

  test('normalizes market string to lowercase before lookup', () => {
    // The helper does `market.toLowerCase()` internally; verify by
    // passing an uppercase market and expecting the US-specific disclaimer.
    const d = getRegionalHealthDisclaimer('US' as unknown as DisclaimerMarket);
    expect(d).toBe(getRegionalHealthDisclaimer('us'));
  });
});
