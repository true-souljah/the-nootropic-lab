/**
 * Quiz scoring formula. Per Phase 5 sign-off, all multipliers are
 * v1 production defaults. Pure functions — no React dependency.
 *
 *   score = baseScore × goalsFit × caffeineFit × budgetFit × mbgFit
 *
 * baseScore is the product's editorial score (0..10).
 * Each *Fit() returns a multiplier in [0.3, 1.2].
 */

import type { Product } from '@nootropic/data';

export type QuizGoal = 'Focus' | 'Memory' | 'Energy' | 'Mood' | 'Sleep recovery' | 'Aging support';
export type CaffeineSensitivity = 'Very sensitive' | 'Moderate' | 'Not sensitive';
export type MBGImportance = 'Very important' | 'Somewhat important' | 'Not important' | "I don't know yet";

export interface QuizAnswers {
  /** 1–2 goals selected from Step 1. */
  goals: QuizGoal[];
  caffeine: CaffeineSensitivity;
  /** USD/month from Step 3 slider. */
  budget: number;
  mbg: MBGImportance;
}

export function goalsFit(productBestFor: string[], userGoals: QuizGoal[]): number {
  if (userGoals.length === 0) return 1.0;
  const overlap = userGoals.filter((g) => productBestFor.includes(g)).length;
  if (userGoals.length === 2) {
    if (overlap === 2) return 1.2;
    if (overlap === 1) return 0.85;
    return 0.4;
  }
  // single goal
  return overlap === 1 ? 1.2 : 0.4;
}

export function caffeineFit(productCaffeineFree: boolean, sensitivity: CaffeineSensitivity): number {
  if (sensitivity === 'Very sensitive') return productCaffeineFree ? 1.2 : 0.3;
  if (sensitivity === 'Moderate') return productCaffeineFree ? 1.0 : 0.9;
  return productCaffeineFree ? 1.0 : 1.1;
}

export function budgetFit(priceMonthlyUSD: number | undefined, budget: number): number {
  if (typeof priceMonthlyUSD !== 'number') return 1.0;
  if (priceMonthlyUSD <= budget * 0.8) return 1.1;
  if (priceMonthlyUSD <= budget) return 1.0;
  if (priceMonthlyUSD <= budget * 1.2) return 0.7;
  return 0.3;
}

export function mbgFit(productMBGdays: number, importance: MBGImportance): number {
  if (importance === 'Very important') {
    if (productMBGdays >= 60) return 1.2;
    if (productMBGdays >= 30) return 0.9;
    return 0.4;
  }
  if (importance === 'Somewhat important') {
    if (productMBGdays >= 60) return 1.05;
    if (productMBGdays >= 30) return 1.0;
    return 0.8;
  }
  if (importance === 'Not important') return 1.0;
  // I don't know yet
  if (productMBGdays >= 60) return 1.05;
  if (productMBGdays >= 30) return 1.0;
  return 0.95;
}

export interface QuizMatch {
  product: Product;
  score: number;
  rank: number;
}

export interface QuizResult {
  top: QuizMatch;
  runnerUps: QuizMatch[];
  /** Display confidence as an integer percent in [60, 99]. */
  confidence: number;
}

/**
 * Score a list of products against the user's quiz answers and return
 * top + 2 runner-ups + confidence. Confidence = topScore / (topScore +
 * runnersUp.sum), clamped to [60, 99]. When the top score is at least
 * 1.5× the next runner-up, confidence is clamped to ≥ 80% (clear winner).
 */
export function scoreQuiz(products: Product[], answers: QuizAnswers): QuizResult | null {
  if (products.length === 0) return null;

  const scored = products
    .map((p) => ({
      product: p,
      score:
        p.score *
        goalsFit(p.bestFor, answers.goals) *
        caffeineFit(p.caffeineFree, answers.caffeine) *
        budgetFit(p.priceMonthlyUSD, answers.budget) *
        mbgFit(p.moneyBackDays, answers.mbg),
    }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  const runners = scored.slice(1, 3);
  if (!top) return null;

  const runnersSum = runners.reduce((s, r) => s + r.score, 0);
  let confidenceRaw = top.score / (top.score + runnersSum || top.score);
  if (runners[0] && top.score >= runners[0].score * 1.5) {
    confidenceRaw = Math.max(confidenceRaw, 0.8);
  }
  const confidence = Math.max(60, Math.min(99, Math.round(confidenceRaw * 100)));

  return {
    top: { ...top, rank: 1 },
    runnerUps: runners.map((r, i) => ({ ...r, rank: i + 2 })),
    confidence,
  };
}
