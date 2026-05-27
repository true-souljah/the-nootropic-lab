import { describe, test, expect } from 'vitest';
import {
  goalsFit,
  caffeineFit,
  budgetFit,
  mbgFit,
  scoreQuiz,
} from './quizScoring';
import type { Product } from '@nootropic/data';

// Minimal Product factory — the scoring functions only read specific fields.
function p(overrides: Partial<Product> = {}): Product {
  return {
    slug: 'test',
    name: 'Test',
    brand: 'Test',
    score: 8.0,
    summary: '',
    bestFor: [],
    caffeineFree: true,
    priceMonthlyUSD: 60,
    moneyBackDays: 30,
    affiliateNetwork: '',
    affiliateUrl: '',
    ingredientDosages: [],
    market: 'us',
    ...overrides,
  } as Product;
}

describe('goalsFit', () => {
  test('returns 1.0 neutral multiplier for empty user goals', () => {
    expect(goalsFit(['Focus'], [])).toBe(1.0);
  });

  test('2 user goals, both match → 1.2 boost', () => {
    expect(goalsFit(['Focus', 'Memory', 'Mood'], ['Focus', 'Memory'])).toBe(1.2);
  });

  test('2 user goals, 1 match → 0.85', () => {
    expect(goalsFit(['Focus', 'Mood'], ['Focus', 'Memory'])).toBe(0.85);
  });

  test('2 user goals, 0 match → 0.4 (heavy penalty)', () => {
    expect(goalsFit(['Energy'], ['Focus', 'Memory'])).toBe(0.4);
  });

  test('1 user goal that matches → 1.2', () => {
    expect(goalsFit(['Focus', 'Memory'], ['Focus'])).toBe(1.2);
  });

  test('1 user goal that does not match → 0.4', () => {
    expect(goalsFit(['Memory'], ['Focus'])).toBe(0.4);
  });
});

describe('caffeineFit', () => {
  test('very sensitive + caffeine-free → 1.2', () => {
    expect(caffeineFit(true, 'Very sensitive')).toBe(1.2);
  });

  test('very sensitive + caffeinated → 0.3 (heavy penalty)', () => {
    expect(caffeineFit(false, 'Very sensitive')).toBe(0.3);
  });

  test('moderate sensitivity + caffeine-free → 1.0', () => {
    expect(caffeineFit(true, 'Moderate')).toBe(1.0);
  });

  test('moderate sensitivity + caffeinated → 0.9 (small penalty)', () => {
    expect(caffeineFit(false, 'Moderate')).toBe(0.9);
  });

  test('not sensitive + caffeinated → 1.1 (prefers caffeine)', () => {
    expect(caffeineFit(false, 'Not sensitive')).toBe(1.1);
  });

  test('not sensitive + caffeine-free → 1.0 (neutral)', () => {
    expect(caffeineFit(true, 'Not sensitive')).toBe(1.0);
  });
});

describe('budgetFit', () => {
  test('priceMonthlyUSD undefined → 1.0 neutral', () => {
    expect(budgetFit(undefined, 60)).toBe(1.0);
  });

  test('price ≤ 80% of budget → 1.1 (value boost)', () => {
    expect(budgetFit(40, 60)).toBe(1.1);
    expect(budgetFit(48, 60)).toBe(1.1); // 48/60 = 0.8 exactly
  });

  test('price in budget (80% < x ≤ 100%) → 1.0', () => {
    expect(budgetFit(55, 60)).toBe(1.0);
    expect(budgetFit(60, 60)).toBe(1.0);
  });

  test('price 100-120% of budget → 0.7 (mild over)', () => {
    expect(budgetFit(70, 60)).toBe(0.7);
    expect(budgetFit(72, 60)).toBe(0.7); // exactly 1.2x
  });

  test('price > 120% of budget → 0.3 (out of reach)', () => {
    expect(budgetFit(100, 60)).toBe(0.3);
  });
});

describe('mbgFit', () => {
  test('very important + ≥60 day MBG → 1.2', () => {
    expect(mbgFit(60, 'Very important')).toBe(1.2);
    expect(mbgFit(90, 'Very important')).toBe(1.2);
  });

  test('very important + 30-59 day MBG → 0.9 (small penalty)', () => {
    expect(mbgFit(30, 'Very important')).toBe(0.9);
  });

  test('very important + <30 day MBG → 0.4 (heavy)', () => {
    expect(mbgFit(14, 'Very important')).toBe(0.4);
    expect(mbgFit(0, 'Very important')).toBe(0.4);
  });

  test('not important → flat 1.0 regardless of MBG length', () => {
    expect(mbgFit(0, 'Not important')).toBe(1.0);
    expect(mbgFit(100, 'Not important')).toBe(1.0);
  });

  test("I don't know yet → mild slope, 1.05/1.0/0.95", () => {
    expect(mbgFit(60, "I don't know yet")).toBe(1.05);
    expect(mbgFit(30, "I don't know yet")).toBe(1.0);
    expect(mbgFit(0, "I don't know yet")).toBe(0.95);
  });
});

describe('scoreQuiz', () => {
  test('returns null for empty product list', () => {
    expect(
      scoreQuiz([], {
        goals: ['Focus'],
        caffeine: 'Not sensitive',
        budget: 100,
        mbg: 'Not important',
      })
    ).toBeNull();
  });

  test('ranks higher-multiplier product first', () => {
    const focus = p({ slug: 'focus-product', score: 8.0, bestFor: ['Focus'] });
    const memory = p({ slug: 'memory-product', score: 8.0, bestFor: ['Memory'] });
    const result = scoreQuiz([focus, memory], {
      goals: ['Focus'],
      caffeine: 'Not sensitive',
      budget: 100,
      mbg: 'Not important',
    });
    expect(result?.top.product.slug).toBe('focus-product');
  });

  test('top + 2 runner-ups + ranks assigned', () => {
    const products = [
      p({ slug: 'a', score: 9 }),
      p({ slug: 'b', score: 8 }),
      p({ slug: 'c', score: 7 }),
      p({ slug: 'd', score: 6 }),
    ];
    const result = scoreQuiz(products, {
      goals: [],
      caffeine: 'Not sensitive',
      budget: 100,
      mbg: 'Not important',
    });
    expect(result?.top.rank).toBe(1);
    expect(result?.runnerUps).toHaveLength(2);
    expect(result?.runnerUps[0].rank).toBe(2);
    expect(result?.runnerUps[1].rank).toBe(3);
  });

  test('confidence is clamped to [60, 99]', () => {
    // Three near-identical scores → low confidence, clamped to 60
    const products = [p({ slug: 'a', score: 5 }), p({ slug: 'b', score: 5 }), p({ slug: 'c', score: 5 })];
    const result = scoreQuiz(products, {
      goals: [],
      caffeine: 'Not sensitive',
      budget: 100,
      mbg: 'Not important',
    });
    expect(result?.confidence).toBeGreaterThanOrEqual(60);
    expect(result?.confidence).toBeLessThanOrEqual(99);
  });

  test('clear-winner boost: when top ≥ 1.5× next runner-up, confidence ≥ 80', () => {
    // Use goals to make one product crush the others
    const winner = p({ slug: 'win', score: 9, bestFor: ['Focus', 'Memory'] });
    const loser1 = p({ slug: 'lose1', score: 5, bestFor: [] });
    const loser2 = p({ slug: 'lose2', score: 4, bestFor: [] });
    const result = scoreQuiz([winner, loser1, loser2], {
      goals: ['Focus', 'Memory'],
      caffeine: 'Not sensitive',
      budget: 100,
      mbg: 'Not important',
    });
    expect(result?.top.product.slug).toBe('win');
    expect(result?.confidence).toBeGreaterThanOrEqual(80);
  });

  test('confidence is an integer percent in [60, 99]', () => {
    const products = [p({ slug: 'a', score: 9 }), p({ slug: 'b', score: 8 })];
    const result = scoreQuiz(products, {
      goals: [],
      caffeine: 'Not sensitive',
      budget: 100,
      mbg: 'Not important',
    });
    expect(Number.isInteger(result?.confidence)).toBe(true);
  });
});
