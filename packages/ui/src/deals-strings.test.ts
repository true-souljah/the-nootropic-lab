// The Deals page strings (UIStrings.deals) in all seven bundles: same keys and placeholders, real
// translations outside en and ja, ja = en while Japanese copy is paused (owner decision 2026-10-13),
// the exact per-link commission sentence, and none of the wording the design rules out.
import { describe, expect, it } from 'vitest';
import { getStrings, type Locale } from '@nootropic/data';

const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const TRANSLATED: Locale[] = ['es', 'fr', 'pt', 'de', 'fr-CA'];

/** Every leaf of `deals` as [path, value]. */
function leaves(value: unknown, path = 'deals'): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
  return [];
}
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const deals = (l: Locale) => new Map(leaves(getStrings(l).deals));
const EN = deals('en');

describe('deals strings', () => {
  it('the scan is non-empty: en has every key of the strings table (48 values)', () => {
    expect(EN.size).toBe(48);
    expect([...EN.keys()]).toEqual(expect.arrayContaining(['deals.linkDisclosure', 'deals.kind.freeItem', 'deals.allEndedBody', 'deals.metaTitle']));
  });

  it.each(LOCALES)('%s has every deals key with the same placeholders as en', (locale) => {
    const bundle = deals(locale);
    expect([...bundle.keys()].sort()).toEqual([...EN.keys()].sort());
    for (const [path, value] of bundle) {
      expect(value.trim(), `${locale} ${path}`).not.toBe('');
      expect(placeholders(value), `${locale} ${path}`).toEqual(placeholders(EN.get(path)!));
    }
  });

  it('es, fr, pt, de and fr-CA translate every value (no English left)', () => {
    // No allowlist: de uses "Angebote" for the heading, not "Deals".
    for (const locale of TRANSLATED) for (const [path, value] of deals(locale)) expect(value, `${locale} ${path}`).not.toBe(EN.get(path));
  });

  it('fr-CA is its own Canadian French text, not a copy of fr', () => {
    const fr = deals('fr');
    const frCa = deals('fr-CA');
    const same = [...frCa].filter(([path, value]) => fr.get(path) === value).length;
    expect(same).toBeLessThan(frCa.size / 2);
    expect(frCa.get('deals.linkDisclosure')).toContain('par l’entremise de');
  });

  it('ja carries the English text and no Japanese script (Japanese copy paused, owner decision 2026-10-13)', () => {
    const JA = /[぀-ヿ㐀-䶿一-鿿]/;
    for (const [path, value] of deals('ja')) {
      expect(value, path).toBe(EN.get(path));
      expect(JA.test(value), path).toBe(false);
    }
  });

  it('the per-link sentence is exact in English and states the commission without a hedge', () => {
    expect(getStrings('en').deals.linkDisclosure).toBe('We earn a commission if you buy through this link.');
  });

  it('no bundle says "confirmed with the vendor"; the confirmation wording names the vendor page or an authenticated email', () => {
    for (const locale of LOCALES) for (const [path, value] of deals(locale)) expect(value.toLowerCase(), `${locale} ${path}`).not.toContain('confirmed with the vendor');
    for (const key of ['deals.lede', 'deals.metaDescription', 'deals.emptyBody']) {
      expect(EN.get(key)).toContain("on the vendor's own page or in an authenticated email from the vendor");
    }
  });

  it('the English deals values carry no hedge, urgency or superlative wording', () => {
    const banned = [/may earn/i, /may receive/i, /may pay/i, /best deal/i, /exclusive/i, /hurry/i, /limited time/i, /act now/i, /verified daily/i, /hand-tested/i];
    for (const [path, value] of EN) for (const re of banned) expect(re.test(value), `${path}: ${re}`).toBe(false);
  });

  it('the per-link sentence is not one of the page-level claims check-built-disclosure.ts looks for', () => {
    const claims = new Set<string>(['We earn a commission when you buy through our links.']);
    for (const locale of LOCALES) {
      claims.add(getStrings(locale).disclosure.inline);
      claims.add(getStrings(locale).disclosure.text);
    }
    for (const locale of LOCALES) {
      const sentence = getStrings(locale).deals.linkDisclosure;
      for (const claim of claims) {
        expect(sentence.includes(claim), `${locale}: contains "${claim}"`).toBe(false);
        expect(claim.includes(sentence), `${locale}: inside "${claim}"`).toBe(false);
      }
    }
  });
});
