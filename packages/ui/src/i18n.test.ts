import { describe, test, expect } from 'vitest';
import { getStrings, getLocaleForMarket } from '@nootropic/data';
import type { Locale, UIStrings } from '@nootropic/data';

// Tests for the i18n helpers in packages/data/src/i18n.ts. The audit
// remediation series extended the Locale union 6 → 7 values and added
// the productDetail UIStrings sub-tree (31 keys × 6 locales = 217 leaf
// strings). This file locks those contracts in.
//
// Cross-package test placement: see product-schema.test.ts for the
// rationale.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

describe('getStrings', () => {
  test('returns a complete UIStrings object for every declared Locale', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      // Spot-check a few top-level keys to confirm we got a real bundle
      // and not, say, a partial fallback.
      expect(s.nav, `${locale} nav`).toBeDefined();
      expect(s.footer, `${locale} footer`).toBeDefined();
      expect(s.productDetail, `${locale} productDetail`).toBeDefined();
      expect(s.ingredientDetail, `${locale} ingredientDetail`).toBeDefined();
    }
  });

  test('every locale has the productDetail.chips regulatory keys (PR-D1)', () => {
    // PR-D1 added 5 new chip keys to productDetail.chips. PR-D3 added 2
    // more keys at productDetail.healthDisclaimerHeading and chipGroupLabel.
    // If any locale is missing one, the regulatory chip rendering will
    // fall back to undefined → bare text on screen.
    for (const locale of ALL_LOCALES) {
      const chips = getStrings(locale).productDetail.chips;
      expect(chips.npnLicensed, `${locale} chips.npnLicensed`).toBeTruthy();
      expect(chips.personalImport, `${locale} chips.personalImport`).toBeTruthy();
      expect(chips.ffcNotified, `${locale} chips.ffcNotified`).toBeTruthy();
      expect(chips.austListed, `${locale} chips.austListed`).toBeTruthy();
      expect(chips.halalCertified, `${locale} chips.halalCertified`).toBeTruthy();
    }
  });

  test('every locale has the PR-D3 a11y i18n keys', () => {
    for (const locale of ALL_LOCALES) {
      const pd = getStrings(locale).productDetail;
      expect(pd.healthDisclaimerHeading, `${locale} healthDisclaimerHeading`).toBeTruthy();
      expect(pd.chipGroupLabel, `${locale} chipGroupLabel`).toBeTruthy();
    }
  });

  test('every locale carries a BCP-47 dateLocale code', () => {
    const expected: Record<Locale, string> = {
      en: 'en-US',
      es: 'es-419',
      fr: 'fr-FR',
      ja: 'ja-JP',
      pt: 'pt-PT',
      de: 'de-DE',
      'fr-CA': 'fr-CA',
    };
    for (const locale of ALL_LOCALES) {
      expect(getStrings(locale).productDetail.dateLocale).toBe(expected[locale]);
    }
  });

  test('en strings are English (smoke test against locale drift)', () => {
    const en = getStrings('en');
    expect(en.nav.bestNootropics).toBe('Best Nootropics');
    expect(en.productDetail.chips.editorPick).toBe('Editor\'s pick');
  });

  test('ja strings use Japanese chrome (smoke test for PR-C3 locale fix)', () => {
    const ja = getStrings('ja');
    expect(ja.nav.search).toBe('検索');
    expect(ja.productDetail.chips.ffcNotified).toBe('機能性表示食品');
  });

  test('fr-CA strings use Quebec French (smoke test for PR-C2b OQLF conventions)', () => {
    const frCa = getStrings('fr-CA');
    // OQLF: "témoin" not "cookie", "RGPD" not "GDPR", "Santé Canada" not "Health Canada"
    // PR-Q9 reshape: footer.cookiePolicy was removed (dead) and the user-
    // visible OQLF cookies term moved to footer.about.cookies.
    expect(frCa.footer.about.cookies).toBe('Témoins');
    expect(frCa.cookie.gdprNote).toContain('RGPD');
    expect(frCa.productDetail.chips.npnLicensed).toContain('Santé Canada');
  });

  test('falls back to en for an unknown locale (defensive default)', () => {
    // TypeScript won't accept an off-union value, but getStrings's `|| en`
    // fallback exists for runtime safety (e.g., parsed query param).
    const unknown = getStrings('xx' as unknown as Locale);
    expect(unknown.nav.bestNootropics).toBe(getStrings('en').nav.bestNootropics);
  });
});

describe('getLocaleForMarket', () => {
  test('latam → es (Spanish for LATAM Spanish-speaking countries)', () => {
    expect(getLocaleForMarket('latam')).toBe('es');
  });

  test('jp → ja (Japanese)', () => {
    expect(getLocaleForMarket('jp')).toBe('ja');
  });

  test('us / eu / ca / au / gcc / sea → en (English default)', () => {
    for (const market of ['us', 'eu', 'ca', 'au', 'gcc', 'sea']) {
      expect(getLocaleForMarket(market), `market=${market}`).toBe('en');
    }
  });

  test('unknown market → en (default branch)', () => {
    expect(getLocaleForMarket('mars')).toBe('en');
    expect(getLocaleForMarket('')).toBe('en');
  });

  test('returned locale resolves to a valid UIStrings bundle', () => {
    // Integration check: every locale that getLocaleForMarket can return
    // must be resolvable by getStrings to a complete bundle.
    const markets = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
    for (const m of markets) {
      const locale = getLocaleForMarket(m);
      const strings: UIStrings = getStrings(locale);
      expect(strings.nav, `market=${m} locale=${locale}`).toBeDefined();
    }
  });
});

describe('search.liveRegion (PR-Q29 #93)', () => {
  test('every locale has the 3 liveRegion keys for the CommandPalette aria-live announcements', () => {
    for (const locale of ALL_LOCALES) {
      const lr = getStrings(locale).search.liveRegion;
      expect(lr.oneResult, `${locale} oneResult`).toBeTruthy();
      expect(lr.manyResults, `${locale} manyResults`).toBeTruthy();
      expect(lr.noResults, `${locale} noResults`).toBeTruthy();
    }
  });

  test('manyResults carries the {n} placeholder; noResults carries the {query} placeholder', () => {
    // The CommandPalette body does .replace('{n}', count) and
    // .replace('{query}', echo). If a future translation drops the
    // placeholder, the displayed message will silently lose the
    // dynamic substitution.
    for (const locale of ALL_LOCALES) {
      const lr = getStrings(locale).search.liveRegion;
      expect(lr.manyResults, `${locale} manyResults placeholder`).toContain('{n}');
      expect(lr.noResults, `${locale} noResults placeholder`).toContain('{query}');
    }
  });

  test('oneResult does NOT carry a placeholder (English plural rule)', () => {
    // oneResult is the singular form, used when count === 1. It should
    // be a literal phrase, not a template — otherwise the displayed
    // string would show e.g. "{n} result" with the literal "{n}".
    for (const locale of ALL_LOCALES) {
      const oneResult = getStrings(locale).search.liveRegion.oneResult;
      expect(oneResult, `${locale} oneResult should not contain {n}`).not.toContain('{n}');
      expect(oneResult, `${locale} oneResult should not contain {query}`).not.toContain('{query}');
    }
  });
});
