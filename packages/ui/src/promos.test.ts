import { describe, expect, it } from 'vitest';
import { normaliseHost, quotedTextIssue, validatePromoFile, type PromoRecord, type PromoProduct } from './promos';

const products: PromoProduct[] = [{ slug: 'examplelab', affiliateUrl: 'https://tracker.example/x', storePrice: { url: 'https://examplelab.example/p' } }];
const row = (patch: Partial<PromoRecord> = {}): PromoRecord => ({ id: 'examplelab-save', vendor_id: 'examplelab', vendor_domain: 'examplelab.example', kind: 'percent', headline: 'Save 10% on selected bottles', terms_quote: 'Free shipping, no minimum', code: 'SAVE10', starts: null, expires: '2099-12-31', geo: ['EU'], regulated: false, confirmed_on: '2026-11-01', ...patch });
const file = (patch: Record<string, unknown> = {}) => ({ schema_version: 1, promos: [row()], ...patch });
const valid = (doc: unknown, region = 'us', catalog = products) => validatePromoFile(doc, { region, products: catalog, today: '2026-01-01' });
const invalid = (doc: unknown) => expect(() => valid(doc)).toThrow(/^promos.json invalid:/);

describe('promo schema', () => {
  it('accepts empty and one-row files', () => { expect(valid({ schema_version: 1, promos: [] }).promos).toEqual([]); expect(valid(file()).promos).toEqual([row()]); });
  it('rejects unknown top and row fields', () => { invalid(file({ extra: true })); invalid({ schema_version: 1, promos: [{ ...row(), extra: true }] }); });
  it.each(['score', 'rank', 'weight', 'priority', 'sponsored', 'url', 'href', 'sources', 'state', 'route', 'log'])('rejects %s', (key) => invalid({ schema_version: 1, promos: [{ ...row(), [key]: true }] }));
  it.each(['id', 'vendor_id', 'vendor_domain', 'kind', 'headline', 'terms_quote', 'code', 'starts', 'expires', 'geo', 'regulated', 'confirmed_on'])('requires %s', (key) => { const value = { ...row() } as Record<string, unknown>; delete value[key]; invalid({ schema_version: 1, promos: [value] }); });
  it.each(['https://shop.example', 'www.shop', 'visit shop.example', '<b>x</b>', 'a > b', '&amp;', '&#38;', '[x](y)', '[x][y]', '[x]: y', '`x`', '**bold**', '_em_ text', '# heading', '- list', 'a\nb'])('rejects unsafe quoted text %s', (text) => expect(quotedTextIssue(text)).not.toBeNull());
  it.each(['Save 10% on orders over EUR 100 until 30 Nov', 'Free shipping, no minimum', 'e.g. selected bottles', '10.5% off'])('accepts plain text %s', (text) => expect(quotedTextIssue(text)).toBeNull());
  it('enforces text limits and boundaries', () => { invalid({ schema_version: 1, promos: [row({ headline: 'x'.repeat(121) })] }); invalid({ schema_version: 1, promos: [row({ terms_quote: 'x'.repeat(601) })] }); expect(valid({ schema_version: 1, promos: [row({ headline: 'x'.repeat(120), terms_quote: 'x'.repeat(600) })] }).promos).toHaveLength(1); });
  it.each(['SAVE10', 'a_b-c', null])('accepts code %s', (code) => expect(valid({ schema_version: 1, promos: [row({ code })] }).promos).toHaveLength(1));
  it.each(['.bad', 'a b', 'a/b', 'a.b', 'x'.repeat(41)])('rejects code %s', (code) => invalid({ schema_version: 1, promos: [row({ code })] }));
  it.each(['expires', 'starts', 'confirmed_on'])('rejects impossible %s date', (field) => invalid({ schema_version: 1, promos: [{ ...row(), [field]: '2026-02-30' }] }));
  it('checks dates', () => { invalid({ schema_version: 1, promos: [row({ expires: null as never })] }); invalid({ schema_version: 1, promos: [row({ starts: '2027-01-01', expires: '2026-01-01' })] }); expect(valid({ schema_version: 1, promos: [row({ starts: null })] }).promos).toHaveLength(1); });
  it('checks geo and kinds', () => { expect(valid({ schema_version: 1, promos: [row({ geo: ['EU', 'DE', 'WORLD'] })] }).promos).toHaveLength(1); for (const geo of [['de'], ['EUR'], ['EU', 'EU']]) invalid({ schema_version: 1, promos: [row({ geo })] }); expect(valid({ schema_version: 1, promos: [row({ geo: [] })] }).promos).toHaveLength(1); invalid({ schema_version: 1, promos: [row({ kind: 'bad' as never })] }); });
  it('uses store domains, subdomains and affiliate domains only without store price', () => { expect(valid(file()).promos).toHaveLength(1); expect(valid(file(), 'us', [{ slug: 'x', affiliateUrl: 'https://x.example', storePrice: { url: 'https://ca.examplelab.example/x' } }])).toHaveLength(1); invalid({ schema_version: 1, promos: [row({ vendor_domain: 'tracker.example' })] }); expect(valid(file(), 'us', [{ slug: 'x', affiliateUrl: 'https://examplelab.example/x' }]).promos).toHaveLength(1); });
  it('rejects unavailable, Amazon, and unnormalised domains', () => { for (const p of [{ ...products[0], discontinued: true }, { ...products[0], noPurchaseLink: {} }, { slug: 'a', affiliateUrl: 'https://amazon.com/x' }]) expect(() => valid(file(), 'us', [p])).toThrow(); invalid({ schema_version: 1, promos: [row({ vendor_domain: 'www.examplelab.example' })] }); invalid({ schema_version: 1, promos: [row({ vendor_domain: 'Examplelab.example' })] }); });
  it('checks uniqueness and expiry warnings', () => { invalid({ schema_version: 1, promos: [row(), row({ id: 'other', code: 'SAVE10' })] }); expect(valid({ schema_version: 1, promos: [row({ code: null }), row({ id: 'other', code: null })] }).promos).toHaveLength(2); expect(valid({ schema_version: 1, promos: [row({ expires: '2025-01-01' })] }).warnings).toHaveLength(1); });
  it.each(['jp', 'xx'])('rejects region %s', (region) => expect(() => valid({ schema_version: 1, promos: [] }, region)).toThrow());
  it.each(['us', 'eu', 'ca', 'au', 'latam', 'gcc', 'sea'])('accepts region %s', (region) => expect(valid({ schema_version: 1, promos: [] }, region).promos).toEqual([]));
  it('normalises hosts', () => { expect(normaliseHost('WWW.Example.COM.')).toBe('example.com'); expect(normaliseHost('not a host')).toBeNull(); expect(normaliseHost('localhost')).toBeNull(); });
});
