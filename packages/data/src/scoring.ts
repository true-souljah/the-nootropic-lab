// Composite review score — single source of truth (site owner decision 2026-10-07).
//
// A product's `score` is the weighted sum of its five pillar scores
// (`scoreBreakdown`, each 0-10) using PILLAR_WEIGHTS, rounded to one decimal.
// The product-review page and the methodology pages render these weights, the
// recompute script (scripts/recompute-scores.ts) writes the stored `score`
// from computeScore(), and `npm run validate-data` fails when a stored score
// differs from computeScore(scoreBreakdown) — so text, data and computation
// share one constant.

export const PILLARS = ['ingredients', 'dosing', 'transparency', 'value', 'trust'] as const;
export type Pillar = (typeof PILLARS)[number];

/** Pillar scores (0-10). `null` = the pillar could not be scored from the available data. */
export type ScoreBreakdown = Record<Pillar, number | null>;

export const PILLAR_WEIGHTS: Readonly<Record<Pillar, number>> = {
  ingredients: 0.25,
  dosing: 0.3,
  transparency: 0.2,
  value: 0.15,
  trust: 0.1,
};

/** A pillar's weight as a whole-number percentage (0.25 -> 25), for copy such as "Ingredient quality (25%)". */
export function pillarWeightPercent(pillar: Pillar): number {
  return Math.round(PILLAR_WEIGHTS[pillar] * 100);
}

/**
 * Weighted composite of the five pillars, rounded half-up to one decimal.
 * Returns `null` when any pillar is missing or not a finite number — an
 * incomplete breakdown has no composite score.
 */
export function computeScore(breakdown: Partial<Record<Pillar, number | null>> | null | undefined): number | null {
  if (!breakdown) return null;
  let sum = 0;
  for (const pillar of PILLARS) {
    const value = breakdown[pillar];
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    sum += value * PILLAR_WEIGHTS[pillar];
  }
  // Binary floats put many exact .x5 sums just below the boundary
  // (5·0.25 + 5·0.3 + 6·0.2 + 6·0.15 + 6·0.1 = 5.449999999999999, exact 5.45).
  // Adding Number.EPSILON does not help above 1 (it is below the spacing of
  // doubles there), so strip the noise by rounding the scaled sum to 12
  // significant digits before the half-up rounding.
  return Math.round(Number((sum * 10).toPrecision(12))) / 10;
}

/** A record whose composite score and every pillar are numbers. */
export type Scored = { score: number; scoreBreakdown: Record<Pillar, number> };
type Scorable = { score: number | null; scoreBreakdown: ScoreBreakdown };

/** Narrows a product to one whose composite score and every pillar are numbers. */
export function hasScore<T extends Scorable>(product: T): product is T & Scored {
  return typeof product.score === 'number' && PILLARS.every((pillar) => typeof product.scoreBreakdown[pillar] === 'number');
}

/**
 * Scored records only, highest score first (stable: ties keep input order).
 * Unscored records (score `null`) never enter a ranking, sort or comparison.
 */
export function rankByScore<T extends Scorable>(products: readonly T[]): Array<T & Scored> {
  return products.filter((p): p is T & Scored => hasScore(p)).sort((a, b) => b.score - a.score);
}
