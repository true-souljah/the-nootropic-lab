import { describe, test, expect } from 'vitest';
import { buildProductSchema } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Tests for buildProductSchema (packages/data/src/product-schema.ts).
// The helper is consumed by 8 region [slug]/page.tsx files; regressions
// here would propagate across the whole portfolio. Audit OPT-2 (2026-07-07)
// dropped the third-party Trustpilot aggregateRating; these tests now lock
// in that it is NEVER emitted while the first-party Review always ships.
//
// Cross-package test placement: this file lives in packages/ui because
// that's where the vitest runner is already wired. packages/data
// doesn't have its own test config yet; if/when one is added, this
// file should migrate to packages/data/src/product-schema.test.ts.

const SITE_URL = 'https://example.com';

const baseProduct: Product = {
  id: 'test-product',
  name: 'Test Product',
  brand: 'Test Brand',
  slug: 'test-product-review',
  bestFor: ['Focus'],
  score: 8.5,
  scoreBreakdown: { ingredients: 8, dosing: 9, transparency: 8, value: 8, trust: 9 },
  pricingModel: 'one-time',
  moneyBackDays: 30,
  caffeineFree: true,
  euStorefront: false,
  euCompliance: 'verify',
  trustpilotScore: null,
  trustpilotCount: null,
  affiliateUrl: 'https://example.com/buy',
  affiliateNetwork: 'Test',
  commissionRate: '10%',
  cookieDays: 30,
  heroIngredients: ['Test Ingredient'],
  ingredientDosages: [],
  servingsPerContainer: 30,
  capsulesPerServing: 1,
  summary: 'A test product.',
  whatItIs: 'Test description.',
  howItWorks: 'Test mechanism.',
  whatToExpect: 'Test expectations.',
  pros: ['Test pro'],
  cons: ['Test con'],
  editorChoice: false,
  market: 'us',
};

describe('buildProductSchema — always-on Review block', () => {
  test('emits @context schema.org and @type Product', () => {
    const s = buildProductSchema(baseProduct, SITE_URL);
    expect(s['@context']).toBe('https://schema.org');
    expect(s['@type']).toBe('Product');
  });

  test('uses product name as schema name', () => {
    const s = buildProductSchema(baseProduct, SITE_URL);
    expect(s.name).toBe('Test Product');
  });

  test('emits Brand block with product brand', () => {
    const s = buildProductSchema(baseProduct, SITE_URL);
    expect(s.brand).toEqual({ '@type': 'Brand', name: 'Test Brand' });
  });

  test('emits Review with editorial score on /10 scale', () => {
    const s = buildProductSchema(baseProduct, SITE_URL) as Record<string, unknown>;
    const review = s.review as Record<string, unknown>;
    expect(review['@type']).toBe('Review');
    const rating = review.reviewRating as Record<string, unknown>;
    expect(rating['@type']).toBe('Rating');
    expect(rating.ratingValue).toBe('8.5');
    expect(rating.bestRating).toBe('10');
    expect(review.reviewBody).toBe('A test product.');
  });

  test('emits Organization publisher with passed-in siteUrl', () => {
    const s = buildProductSchema(baseProduct, SITE_URL) as Record<string, unknown>;
    const review = s.review as Record<string, unknown>;
    const publisher = review.publisher as Record<string, unknown>;
    expect(publisher['@type']).toBe('Organization');
    expect(publisher.url).toBe(SITE_URL);
  });
});

describe('buildProductSchema — no third-party aggregateRating (OPT-2)', () => {
  // Google May-2024 review-snippet policy: a self-hosted AggregateRating
  // reflecting a third-party aggregator (Trustpilot) with no on-page
  // reviews is a manual-action risk on YMYL supplement pages. We never
  // emit it — only the first-party editorial Review ships. These cases
  // include the ones the OLD conservative gate would have emitted.
  const trustpilotCases: Array<[string, number | null, number | null]> = [
    ['null Trustpilot data', null, null],
    ['score set, count null', 4.5, null],
    ['low count', 4.5, 99],
    ['high count + high score (old gate would have emitted)', 4.5, 3200],
    ['exact old boundary (100 / 3.5)', 3.5, 100],
    ['low score', 1.9, 850],
  ];

  test.each(trustpilotCases)('never emits aggregateRating: %s', (_label, score, count) => {
    const p = { ...baseProduct, trustpilotScore: score, trustpilotCount: count };
    const s = buildProductSchema(p, SITE_URL);
    expect(s.aggregateRating).toBeUndefined();
  });

  test('always emits the first-party editorial Review regardless of Trustpilot data', () => {
    const p = { ...baseProduct, trustpilotScore: 4.5, trustpilotCount: 3200 };
    const s = buildProductSchema(p, SITE_URL) as Record<string, unknown>;
    expect(s.aggregateRating).toBeUndefined();
    const review = s.review as Record<string, unknown>;
    const rating = review.reviewRating as Record<string, unknown>;
    expect(rating.ratingValue).toBe('8.5'); // editorial score, not Trustpilot's 4.5
    expect(rating.bestRating).toBe('10');
  });
});
