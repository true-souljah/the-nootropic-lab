import { describe, test, expect } from 'vitest';
import { parseClinicalDose, statusFor, defaultDoseFor } from './doseRange';

describe('parseClinicalDose', () => {
  test('returns null for empty / non-numeric strings', () => {
    expect(parseClinicalDose('')).toBeNull();
    expect(parseClinicalDose('see label')).toBeNull();
  });

  test('parses single value with ±20% spread', () => {
    const result = parseClinicalDose('250mg');
    expect(result).toEqual({ min: 200, max: 300, unit: 'mg' });
  });

  test('parses range with hyphen', () => {
    expect(parseClinicalDose('250-500mg')).toEqual({ min: 250, max: 500, unit: 'mg' });
  });

  test('parses range with en-dash (–)', () => {
    expect(parseClinicalDose('250–500mg')).toEqual({ min: 250, max: 500, unit: 'mg' });
  });

  test('parses range with em-dash (—)', () => {
    expect(parseClinicalDose('250—500mg')).toEqual({ min: 250, max: 500, unit: 'mg' });
  });

  test('strips parenthetical annotation but preserves the dose', () => {
    expect(parseClinicalDose('300mg (45% bacosides)')).toEqual({ min: 240, max: 360, unit: 'mg' });
  });

  test('range with annotation: numbers before the parens win', () => {
    expect(parseClinicalDose('50–600mg (3% rosavins)')).toEqual({ min: 50, max: 600, unit: 'mg' });
  });

  test('grams are scaled to mg via the unit normalization', () => {
    expect(parseClinicalDose('1g')).toEqual({ min: 800, max: 1200, unit: 'mg' });
    // 1g = 1000mg, ±20% = 800-1200
  });

  test('mcg unit is preserved', () => {
    expect(parseClinicalDose('400mcg')).toEqual({ min: 320, max: 480, unit: 'mcg' });
  });

  test('µg unit is normalized to mcg', () => {
    expect(parseClinicalDose('400µg')).toEqual({ min: 320, max: 480, unit: 'mcg' });
  });

  test('IU unit is preserved (uppercase)', () => {
    expect(parseClinicalDose('5000 IU')).toEqual({ min: 4000, max: 6000, unit: 'IU' });
  });

  test('/day suffix is stripped (we only need the dose, not the cadence)', () => {
    expect(parseClinicalDose('250–500mg/day')).toEqual({ min: 250, max: 500, unit: 'mg' });
  });

  test('single value of 5 produces min ≥ 0 (no negative min)', () => {
    const result = parseClinicalDose('5mg');
    expect(result?.min).toBeGreaterThanOrEqual(0);
  });

  test('decimal value preserved through scaling', () => {
    expect(parseClinicalDose('0.5g')).toEqual({ min: 400, max: 600, unit: 'mg' });
    // 0.5g = 500mg, ±20% = 400-600
  });

  test('reversed second value < first (mis-formatted) falls back to single-value spread', () => {
    // "200-100mg" → second isn't greater, so treats as single value of first
    const result = parseClinicalDose('200-100mg');
    expect(result).toEqual({ min: 160, max: 240, unit: 'mg' });
  });
});

describe('statusFor', () => {
  const range = { min: 200, max: 400, unit: 'mg' };

  test('dose below min → under', () => {
    expect(statusFor(150, range)).toBe('under');
  });

  test('dose above max → over', () => {
    expect(statusFor(500, range)).toBe('over');
  });

  test('dose at lower boundary → in-range', () => {
    expect(statusFor(200, range)).toBe('in-range');
  });

  test('dose at upper boundary → in-range', () => {
    expect(statusFor(400, range)).toBe('in-range');
  });

  test('dose inside range → in-range', () => {
    expect(statusFor(300, range)).toBe('in-range');
  });
});

describe('defaultDoseFor', () => {
  test('returns the lower bound (conservative starting dose)', () => {
    expect(defaultDoseFor({ min: 200, max: 400, unit: 'mg' })).toBe(200);
  });
});
