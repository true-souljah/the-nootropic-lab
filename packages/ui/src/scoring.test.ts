import { describe, it, expect } from 'vitest';
import { PILLARS, PILLAR_WEIGHTS, computeScore, hasScore, pillarWeightPercent } from '@nootropic/data';
import type { ScoreBreakdown } from '@nootropic/data';

// Composite score (packages/data/src/scoring.ts, 2026-10-07): the stored
// `score` is computeScore(scoreBreakdown) with the published PILLAR_WEIGHTS.
// `npm run validate-data` enforces stored === computed on every record; these
// tests pin the formula and its rounding.

const breakdown = (ingredients: number | null, dosing: number | null, transparency: number | null, value: number | null, trust: number | null): ScoreBreakdown => ({
  ingredients,
  dosing,
  transparency,
  value,
  trust,
});

describe('PILLAR_WEIGHTS', () => {
  it('covers exactly the five pillars and sums to 1', () => {
    expect(Object.keys(PILLAR_WEIGHTS).sort()).toEqual([...PILLARS].sort());
    const sum = PILLARS.reduce((acc, p) => acc + PILLAR_WEIGHTS[p], 0);
    expect(sum).toBeCloseTo(1, 12);
    expect(PILLARS.reduce((acc, p) => acc + pillarWeightPercent(p), 0)).toBe(100);
  });

  it('publishes the owner-approved weights (2026-10-07)', () => {
    expect(PILLARS.map((p) => pillarWeightPercent(p))).toEqual([25, 30, 20, 15, 10]);
  });
});

describe('computeScore', () => {
  it('weights the pillars and rounds to one decimal', () => {
    expect(computeScore(breakdown(10, 10, 10, 10, 10))).toBe(10);
    expect(computeScore(breakdown(0, 0, 0, 0, 0))).toBe(0);
    // 8·0.25 + 8·0.3 + 8·0.2 + 6·0.15 + 5·0.1 = 7.4
    expect(computeScore(breakdown(8, 8, 8, 6, 5))).toBe(7.4);
    // 7·0.25 + 6·0.3 + 6·0.2 + 7·0.15 + 8·0.1 = 6.6
    expect(computeScore(breakdown(7, 6, 6, 7, 8))).toBe(6.6);
  });

  it('rounds exact .x5 sums half-up despite binary float noise', () => {
    // 9.35 exactly -> 9.4
    expect(computeScore(breakdown(9, 10, 10, 8, 9))).toBe(9.4);
    // 9.05 exactly -> 9.1
    expect(computeScore(breakdown(9, 10, 10, 8, 6))).toBe(9.1);
    // Float sum is 5.449999999999999 (exact 5.45): Math.round((x + Number.EPSILON) * 10) / 10
    // returns 5.4 here, so this case pins the noise-stripping rounding.
    expect(computeScore(breakdown(5, 5, 6, 6, 6))).toBe(5.5);
  });

  it('matches exact integer arithmetic for every integer breakdown 0-10', () => {
    const pct = PILLARS.map((p) => pillarWeightPercent(p));
    let checked = 0;
    for (let a = 0; a <= 10; a++)
      for (let b = 0; b <= 10; b++)
        for (let c = 0; c <= 10; c++)
          for (let d = 0; d <= 10; d++)
            for (let e = 0; e <= 10; e++) {
              const hundredths = a * pct[0] + b * pct[1] + c * pct[2] + d * pct[3] + e * pct[4];
              const exact = Math.floor((hundredths + 5) / 10) / 10;
              expect(computeScore(breakdown(a, b, c, d, e))).toBe(exact);
              checked++;
            }
    expect(checked).toBe(11 ** 5);
  });

  it('returns null when any pillar is missing or not a finite number', () => {
    expect(computeScore(breakdown(6, null, 4, null, 4))).toBeNull();
    expect(computeScore(breakdown(8, 8, 8, 8, null))).toBeNull();
    expect(computeScore({ ingredients: 8, dosing: 8, transparency: 8, value: 8 })).toBeNull();
    expect(computeScore(breakdown(8, Number.NaN, 8, 8, 8))).toBeNull();
    expect(computeScore(breakdown(8, Number.POSITIVE_INFINITY, 8, 8, 8))).toBeNull();
    expect(computeScore(undefined)).toBeNull();
    expect(computeScore(null)).toBeNull();
  });
});

describe('hasScore', () => {
  it('accepts a scored record and rejects an unscored one', () => {
    expect(hasScore({ score: 7.4, scoreBreakdown: breakdown(8, 8, 8, 6, 5) })).toBe(true);
    expect(hasScore({ score: null, scoreBreakdown: breakdown(6, null, 4, null, 4) })).toBe(false);
  });
});
