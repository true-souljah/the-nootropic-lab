import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { allProductsSEA, seoOverrideProblems, SEO_TITLE_MAX } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Review-page seoTitle/seoDescription overrides (2026-10-08). The rules live in
// packages/data/src/seo-overrides.ts and run in validate-data; this file pins
// them and checks that every region carrying an override has a [slug] route
// that reads it (an unread override is a silent no-op).
const REPO = join(__dirname, '..', '..', '..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;

const brainmax = allProductsSEA.find((p) => p.slug === 'eu-yan-sang-brainmax-review') as Product;
const blackmores = allProductsSEA.find((p) => p.slug === 'blackmores-brain-active-review') as Product;
const bare = (p: Product): Product => ({ ...p, seoTitle: undefined, seoDescription: undefined });

describe('seoOverrideProblems', () => {
  it('passes a record without overrides', () => {
    expect(seoOverrideProblems(bare(brainmax))).toEqual([]);
  });

  it('flags a title over the documented length', () => {
    const problems = seoOverrideProblems({ ...bare(brainmax), seoTitle: 'x'.repeat(SEO_TITLE_MAX + 1) });
    expect(problems).toEqual([`eu-yan-sang-brainmax-review: seoTitle is ${SEO_TITLE_MAX + 1} chars (max ${SEO_TITLE_MAX})`]);
  });

  it('flags an empty override', () => {
    expect(seoOverrideProblems({ ...bare(brainmax), seoDescription: ' ' })).toEqual([
      'eu-yan-sang-brainmax-review: seoDescription is empty',
    ]);
  });

  it('requires "discontinued" on a discontinued record (the stale "pharmacy pick" override)', () => {
    const problems = seoOverrideProblems({
      ...bare(blackmores),
      seoTitle: 'Blackmores Brain Active Review: Trusted SEA Pharmacy Pick',
    });
    expect(problems).toEqual(['blackmores-brain-active-review: seoTitle must say "discontinued" (record is discontinued)']);
  });

  it('flags a number that appears nowhere else in the record (stale price)', () => {
    const problems = seoOverrideProblems({ ...bare(brainmax), seoDescription: 'BrainMAX+ costs S$59.90 for 30 sachets.' });
    expect(problems).toEqual(['eu-yan-sang-brainmax-review: seoDescription quotes "59.90", which appears nowhere else in the record']);
  });

  it('compares whole numbers, not substrings of longer ones', () => {
    // The record states "S$69.90" and "600mg"; "9.90" and "60" are different numbers.
    const problems = seoOverrideProblems({ ...bare(brainmax), seoDescription: 'Now S$9.90 with 60mg Cera-Q.' });
    expect(problems).toEqual([
      'eu-yan-sang-brainmax-review: seoDescription quotes "9.90", which appears nowhere else in the record',
      'eu-yan-sang-brainmax-review: seoDescription quotes "60", which appears nowhere else in the record',
    ]);
  });

  it('accepts numbers that the record states elsewhere', () => {
    expect(seoOverrideProblems({ ...bare(brainmax), seoDescription: 'BrainMAX+ costs S$69.90 for 30 sachets of 600mg Cera-Q.' })).toEqual([]);
  });
});

describe('seo overrides in the catalogue', () => {
  const withOverride = REGIONS.map((region) => {
    const products = JSON.parse(readFileSync(join(REPO, 'packages', 'data', 'src', `products-${region}.json`), 'utf8')) as Product[];
    return { region, products, count: products.filter((p) => p.seoTitle !== undefined || p.seoDescription !== undefined).length };
  });

  it('scans all 8 region catalogues and finds the current overrides', () => {
    expect(withOverride.every(({ products }) => products.length > 0)).toBe(true);
    expect(withOverride.reduce((sum, { count }) => sum + count, 0)).toBeGreaterThanOrEqual(3);
  });

  it('every override passes seoOverrideProblems', () => {
    const problems = withOverride.flatMap(({ region, products }) =>
      products.flatMap((p) => seoOverrideProblems(p).map((m) => `${region}/${m}`)),
    );
    expect(problems).toEqual([]);
  });

  it('every region with an override has a [slug] route that reads both fields', () => {
    const unread = withOverride
      .filter(({ count }) => count > 0)
      .filter(({ region }) => {
        const route = readFileSync(join(REPO, 'apps', region, 'src', 'app', '[slug]', 'page.tsx'), 'utf8');
        return !route.includes('product.seoTitle') || !route.includes('product.seoDescription');
      })
      .map(({ region }) => region);
    expect(unread).toEqual([]);
  });
});
