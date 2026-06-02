import { describe, test, expect } from 'vitest';
import { buildProductSchema } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Tests for the AggregateRating gating logic added in PR-A1b
// (packages/data/src/product-schema.ts). The helper is consumed by 8
// region [slug]/page.tsx files; regressions here would propagate
// across the whole portfolio.
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

describe('buildProductSchema — AggregateRating conservative gating', () => {
  test('omits aggregateRating when trustpilotScore is null', () => {
    const s = buildProductSchema(baseProduct, SITE_URL);
    expect(s.aggregateRating).toBeUndefined();
  });

  test('omits aggregateRating when trustpilotCount is null even if score is set', () => {
    const p = { ...baseProduct, trustpilotScore: 4.5, trustpilotCount: null };
    const s = buildProductSchema(p, SITE_URL);
    expect(s.aggregateRating).toBeUndefined();
  });

  test('omits aggregateRating when trustpilotCount < 100 (statistically meaningless aggregate)', () => {
    const p = { ...baseProduct, trustpilotScore: 4.5, trustpilotCount: 99 };
    const s = buildProductSchema(p, SITE_URL);
    expect(s.aggregateRating).toBeUndefined();
  });

  test('omits aggregateRating when trustpilotScore < 3.5 (avoid surfacing low ratings)', () => {
    const p = { ...baseProduct, trustpilotScore: 3.4, trustpilotCount: 5000 };
    const s = buildProductSchema(p, SITE_URL);
    expect(s.aggregateRating).toBeUndefined();
  });

  test('emits aggregateRating when both gates pass (count >= 100 AND score >= 3.5)', () => {
    const p = { ...baseProduct, trustpilotScore: 4.5, trustpilotCount: 3200 };
    const s = buildProductSchema(p, SITE_URL);
    expect(s.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '3200',
      bestRating: '5',
    });
  });

  test('emits aggregateRating at the exact lower boundary (count=100, score=3.5)', () => {
    const p = { ...baseProduct, trustpilotScore: 3.5, trustpilotCount: 100 };
    const s = buildProductSchema(p, SITE_URL);
    const rating = s.aggregateRating as Record<string, unknown>;
    expect(rating).toBeDefined();
    expect(rating.ratingValue).toBe('3.5');
    expect(rating.reviewCount).toBe('100');
  });

  test('Review block still emits even when AggregateRating is gated off', () => {
    // Confirms the editorial Review (score) ships regardless of Trustpilot
    // data presence — only the aggregate is conditional.
    const p = { ...baseProduct, trustpilotScore: 1.9, trustpilotCount: 850 };
    const s = buildProductSchema(p, SITE_URL) as Record<string, unknown>;
    expect(s.aggregateRating).toBeUndefined();
    expect(s.review).toBeDefined();
    const review = s.review as Record<string, unknown>;
    const rating = review.reviewRating as Record<string, unknown>;
    expect(rating.ratingValue).toBe('8.5'); // unchanged editorial score
  });
});
