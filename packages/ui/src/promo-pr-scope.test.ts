import { describe, expect, it } from 'vitest';
import { checkPromoPr, isPromoPr } from './promo-pr-scope';

const path = 'packages/data/promos/us.json';
const products = { us: [{ slug: 'examplelab', affiliateUrl: 'https://tracker.example/x', storePrice: { url: 'https://examplelab.example/p' } }] };
const row = (patch: Record<string, unknown> = {}) => ({ id: 'examplelab-save', vendor_id: 'examplelab', vendor_domain: 'examplelab.example', kind: 'percent', headline: 'Save 10% today', terms_quote: 'Free shipping, no minimum', code: 'SAVE10', starts: null, expires: '2099-12-31', geo: ['US'], regulated: false, confirmed_on: '2026-11-01', ...patch });
const doc = (rows = [row()]) => ({ schema_version: 1, promos: rows });
const check = (patch: Partial<Parameters<typeof checkPromoPr>[0]> = {}) => checkPromoPr({ headRef: 'promo-review/x', title: 'x', changedPaths: [path], base: {}, head: { [path]: doc() }, productsByRegion: products, ...patch });

describe('promo PR scope', () => {
  it('lets non-promo changes through', () => expect(check({ headRef: 'feature/x', changedPaths: ['package.json'] }).promo).toBe(false));
  it.each(['promo-auto/2026-11-20-1', 'promo-review/x'])('recognises branch %s', (headRef) => expect(isPromoPr({ headRef, title: 'x' })).toBe(true));
  it.each(['Promo: x', 'promo: x'])('recognises title %s', (title) => expect(isPromoPr({ headRef: 'feature/x', title })).toBe(true));
  it.each(['promo/x', 'promotion-auto/x'])('does not recognise %s', (headRef) => expect(isPromoPr({ headRef, title: 'x' })).toBe(false));
  it('allows one valid promo file', () => expect(check().ok).toBe(true));
  it.each(['package.json', 'packages/data/src/content-dates.json', 'packages/data/promos/jp.json'])('rejects forbidden path %s', (bad) => expect(check({ changedPaths: [path, bad] }).ok).toBe(false));
  // A promo PR may never touch the checker that judges it (the workflow also runs the base copy).
  it.each(['scripts/check-promo-pr.ts', 'packages/ui/src/promo-pr-scope.ts', 'packages/ui/src/promos.ts', '.github/workflows/promo-pr-check.yml'])('rejects a promo-auto PR touching only checker file %s', (bad) => {
    const result = check({ headRef: 'promo-auto/x', changedPaths: [bad], head: {} });
    expect(result.ok).toBe(false);
    expect(result.violations).toEqual([`disallowed path: ${bad}`]);
  });
  it('rejects an empty promo PR', () => expect(check({ changedPaths: [] }).ok).toBe(false));
  it('reports invalid head data', () => expect(check({ head: { [path]: { schema_version: 1, promos: [{ ...row(), expires: 'bad' }] } } }).violations.join('\n')).toMatch(/promos.json invalid/));
  it('allows auto percent non-regulated additions', () => expect(check({ headRef: 'promo-auto/x' }).ok).toBe(true));
  it.each([row({ kind: 'free-item' }), row({ regulated: true })])('rejects ineligible automatic addition', (bad) => expect(check({ headRef: 'promo-auto/x', head: { [path]: doc([bad]) } }).ok).toBe(false));
  it('rejects changed auto rows but allows removals', () => { expect(check({ headRef: 'promo-auto/x', base: { [path]: doc() }, head: { [path]: doc([row({ kind: 'other' })]) } }).ok).toBe(false); expect(check({ headRef: 'promo-auto/x', base: { [path]: doc() }, head: { [path]: doc([]) } }).ok).toBe(true); });
  it('allows regulated and other rows for review', () => expect(check({ head: { [path]: doc([row({ kind: 'other', regulated: true })]) } }).ok).toBe(true));
  it('title marker enforces paths but not auto eligibility', () => expect(check({ headRef: 'feature/x', title: 'promo: x', head: { [path]: doc([row({ kind: 'other', regulated: true })]) } }).ok).toBe(true));
  it('rejects deleted head files', () => expect(check({ head: {} }).ok).toBe(false));
});
