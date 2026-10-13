import { describe, test, expect } from 'vitest';
import { getStrings, getLocaleForMarket, DOSING_ANCHORS, NO_REFERENCE_DOSE, PILLAR_WEIGHTS, REGION_PROFILES } from '@nootropic/data';
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

  test('every locale has the guide page keys (Sources heading, expand hint, evidence-review label)', () => {
    for (const locale of ALL_LOCALES) {
      const guide = getStrings(locale).guide;
      expect(guide.sources, `${locale} guide.sources`).toBeTruthy();
      expect(guide.expand, `${locale} guide.expand`).toBeTruthy();
      expect(guide.evidenceReviewed, `${locale} guide.evidenceReviewed`).toBeTruthy();
    }
    // Non-English bundles must not silently ship the English strings.
    for (const locale of ['es', 'ja', 'pt', 'de'] as Locale[]) {
      const guide = getStrings(locale).guide;
      expect(guide.evidenceReviewed, `${locale} evidenceReviewed is translated`).not.toBe(getStrings('en').guide.evidenceReviewed);
      expect(guide.expand, `${locale} expand is translated`).not.toBe('expand');
    }
  });

  test('every locale translates the Pricing-tab labels and keeps their placeholders (2026-10-07)', () => {
    // PricingTab.tsx renders only these strings around the vendor's own quotes;
    // an English copy left in a locale block would ship English on ja/es pages.
    const en = getStrings('en').productDetail.pricing;
    const keys = Object.keys(en) as Array<keyof typeof en>;
    expect(keys.length).toBeGreaterThanOrEqual(13);
    const placeholders: Partial<Record<keyof typeof en, string[]>> = {
      attribution: ['{domain}', '{date}'],
      visitVendor: ['{brand}'],
      cookieTerms: ['{days}', '{rate}'],
    };
    for (const locale of ALL_LOCALES) {
      const pricing = getStrings(locale).productDetail.pricing;
      expect(Object.keys(pricing).sort(), `${locale} pricing keys`).toEqual([...keys].sort());
      for (const key of keys) {
        expect(pricing[key].trim(), `${locale} pricing.${key} is empty`).not.toBe('');
        if (locale !== 'en') expect(pricing[key], `${locale} pricing.${key} is the English copy`).not.toBe(en[key]);
        for (const token of placeholders[key] ?? []) {
          expect(pricing[key], `${locale} pricing.${key} keeps ${token}`).toContain(token);
        }
        for (const token of pricing[key].match(/\{\w+\}/g) ?? []) {
          expect(placeholders[key] ?? [], `${locale} pricing.${key}: unknown placeholder ${token}`).toContain(token);
        }
      }
    }
  });

  describe('Pillars- and Dosing-tab strings (2026-10-12)', () => {
    // PillarsTab.tsx and DosingTab.tsx render only these strings around the
    // record's own data; an English copy in a locale block ships English on
    // the ja (JP) and es (LATAM) review pages.
    const en = getStrings('en').productDetail;
    const PILLARS = Object.keys(PILLAR_WEIGHTS).sort();
    const ANCHOR_SLUGS = DOSING_ANCHORS.map((a) => a.ingredientSlug).sort();
    const PLACEHOLDERS: Record<string, string[]> = {
      'dosing.adequateCount': ['{adequate}', '{total}'],
      'pillars.pillarScoreAria': ['{product}', '{pillar}'],
      // Compact pillar bars (listicle, best-of, comparator), added 2026-10-12.
      'pillars.shortScoreAria': ['{name}', '{pillar}'],
    };

    /** Every leaf string under `value`, keyed by its dotted path. */
    function leaves(value: unknown, path: string): Array<[string, string]> {
      if (typeof value === 'string') return [[path, value]];
      return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
    }
    function tabLeaves(locale: Locale): Map<string, string> {
      const pd = getStrings(locale).productDetail;
      return new Map([...leaves(pd.pillars, 'pillars'), ...leaves(pd.dosing, 'dosing')]);
    }
    const enLeaves = tabLeaves('en');

    /** A dose that is only amounts and units ("100-200mg", caffeine): nothing to translate. */
    const wordless = (text: string) => !/\p{L}/u.test(text.replace(/\d+(?:[.,]\d+)?\s*(?:mcg|mg|g)\b/g, ''));
    /** The amounts in a dose string ("900mg", "1.2g", "50%", "24"), decimal comma read as a point, sorted. */
    const amounts = (text: string) =>
      [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(mcg|mg|g|%)?/g)].map((m) => `${m[1].replace(',', '.')}${m[2] ?? ''}`).sort();

    test('the scan is non-empty: 5 pillars, 20 dosing anchors, every tab key in en', () => {
      expect(PILLARS).toHaveLength(5);
      expect(ANCHOR_SLUGS).toHaveLength(20);
      expect(enLeaves.size).toBeGreaterThanOrEqual(5 + 5 + 5 + 4 + 4 + 4 + 1 + 20);
    });

    test.each(ALL_LOCALES)('%s has every key, non-empty, with exactly the five pillars and the 20 anchor slugs', (locale) => {
      const pd = getStrings(locale).productDetail;
      const own = tabLeaves(locale);
      expect([...own.keys()].sort()).toEqual([...enLeaves.keys()].sort());
      for (const [path, text] of own) expect(text.trim(), `${locale} ${path} is empty`).not.toBe('');
      expect(Object.keys(pd.pillars.labels).sort()).toEqual(PILLARS);
      expect(Object.keys(pd.pillars.rationale).sort()).toEqual(PILLARS);
      expect(Object.keys(pd.dosing.anchorDose).sort()).toEqual(ANCHOR_SLUGS);
    });

    test.each(ALL_LOCALES)('%s keeps the placeholders and adds none', (locale) => {
      for (const [path, text] of tabLeaves(locale)) {
        const allowed = PLACEHOLDERS[path] ?? [];
        for (const token of allowed) expect(text, `${locale} ${path} keeps ${token}`).toContain(token);
        for (const token of text.match(/\{\w+\}/g) ?? []) {
          expect(allowed, `${locale} ${path}: unknown placeholder ${token}`).toContain(token);
        }
      }
    });

    test('en is the source: each anchor dose is the anchor string, and noReferenceDose is NO_REFERENCE_DOSE', () => {
      for (const anchor of DOSING_ANCHORS) {
        expect(en.dosing.anchorDose[anchor.ingredientSlug], anchor.ingredientSlug).toBe(anchor.clinicalDose);
      }
      expect(en.dosing.noReferenceDose).toBe(NO_REFERENCE_DOSE);
    });

    test.each(ALL_LOCALES)('%s anchor doses state the same amounts and units as the anchor, in the locale', (locale) => {
      const anchorDose = getStrings(locale).productDetail.dosing.anchorDose;
      for (const anchor of DOSING_ANCHORS) {
        const dose = anchorDose[anchor.ingredientSlug];
        expect(amounts(dose), `${locale} ${anchor.ingredientSlug}: "${dose}"`).toEqual(amounts(anchor.clinicalDose));
        if (locale !== 'en') {
          expect(dose, `${locale} ${anchor.ingredientSlug} keeps English words`).not.toMatch(/\b(day|extract|lowest|positive|trial)\b/);
        }
      }
    });

    test('ja strings are in Japanese script (doses without words excepted)', () => {
      for (const [path, text] of tabLeaves('ja')) {
        if (path.startsWith('dosing.anchorDose.') && wordless(enLeaves.get(path)!)) continue;
        expect(text, `ja ${path}`).toMatch(/[぀-ヿ一-鿿]/);
      }
    });

    test.each(['es', 'fr', 'pt', 'de', 'fr-CA'] as Locale[])('%s strings differ from en (doses without words excepted)', (locale) => {
      for (const [path, text] of tabLeaves(locale)) {
        if (path.startsWith('dosing.anchorDose.') && wordless(enLeaves.get(path)!)) continue;
        expect(text, `${locale} ${path} is the English copy`).not.toBe(enLeaves.get(path));
      }
    });
  });

  describe('Rest of the review-page chrome (2026-10-12): Overview, Reviews, "Buying in", app shell', () => {
    // OverviewTab, ReviewsTab, RegionalBuying, the review breadcrumb and the
    // AppShell chrome (top bar, sidebar rail, search palette) render only
    // these strings around the record's own data; an English copy in a
    // locale block ships English on the ja (JP) and es (LATAM) review pages.
    const PLACEHOLDERS: Record<string, string[]> = {
      'search.palette.noResults': ['{query}'],
      'search.palette.indexed': ['{n}'],
      'search.palette.scoreAria': ['{score}'],
      'search.palette.gradeAria': ['{grade}'],
      'productDetail.overview.verdict.good': ['{product}'],
      'productDetail.overview.verdict.warn': ['{product}'],
      'productDetail.overview.verdict.bad': ['{product}'],
      'productDetail.reviews.noProfileBody': ['{brand}'],
      'productDetail.reviews.starsAria': ['{score}'],
      'productDetail.reviews.countOnTrustpilot': ['{count}'],
      'productDetail.reviews.verifiedCount': ['{count}'],
      'productDetail.reviews.readAll': ['{count}'],
      'productDetail.regionalBuying.licence.npnNumber': ['{npn}'],
      'productDetail.regionalBuying.licence.noNpnChecked': ['{date}'],
      'productDetail.regionalBuying.licence.austl': ['{austl}'],
      'productDetail.regionalBuying.licence.ffcNumber': ['{number}'],
      'productDetail.regionalBuying.licence.noFfcChecked': ['{date}'],
      'productDetail.regionalBuying.licence.noHalalChecked': ['{date}'],
    };
    /**
     * Do-not-translate: identical in a locale because they are regulator
     * acronyms, licence numbers or brand names (TGA, AUST L, NPN, ANVISA /
     * COFEPRIS / INVIMA, Health Canada) or the same word in that language
     * (fr "Guides", fr "Verdict", de "Status"). Every other string must differ
     * from en, and every ja string must contain Japanese script.
     */
    const DO_NOT_TRANSLATE: Record<string, Locale[]> = {
      'productDetail.regionalBuying.regulator.au': ['es', 'fr', 'ja', 'pt', 'de', 'fr-CA'],
      'productDetail.regionalBuying.regulator.latam': ['es', 'fr', 'ja', 'pt', 'de', 'fr-CA'],
      'productDetail.regionalBuying.regulator.ca': ['es', 'pt', 'de'],
      'productDetail.regionalBuying.licence.npnNumber': ['es', 'fr', 'ja', 'pt', 'de', 'fr-CA'],
      'productDetail.regionalBuying.licence.austl': ['es', 'fr', 'ja', 'pt', 'de', 'fr-CA'],
      'search.palette.categories.guides': ['fr', 'fr-CA'],
      'productDetail.overview.verdictEyebrow': ['fr', 'fr-CA'],
      'productDetail.regionalBuying.status': ['de'],
    };
    const REGIONS = Object.keys(REGION_PROFILES).sort();

    function leaves(value: unknown, path: string): Array<[string, string]> {
      if (typeof value === 'string') return [[path, value]];
      return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
    }
    function restLeaves(locale: Locale): Map<string, string> {
      const s = getStrings(locale);
      return new Map([
        ['nav.buildMyStack', s.nav.buildMyStack],
        ['nav.drawerLabel', s.nav.drawerLabel],
        ...leaves(s.nav.sidebar, 'nav.sidebar'),
        ...leaves(s.search.palette, 'search.palette'),
        ['productDetail.breadcrumbBestOf', s.productDetail.breadcrumbBestOf],
        ...leaves(s.productDetail.overview, 'productDetail.overview'),
        ...leaves(s.productDetail.reviews, 'productDetail.reviews'),
        ...leaves(s.productDetail.regionalBuying, 'productDetail.regionalBuying'),
      ]);
    }
    const enLeaves = restLeaves('en');
    const exempt = (path: string, locale: Locale) => DO_NOT_TRANSLATE[path]?.includes(locale) ?? false;

    test('the scan is non-empty: 8 regions, every new key in en', () => {
      expect(REGIONS).toHaveLength(8);
      // 2 nav + 13 sidebar + 18 palette + 1 breadcrumb + 10 overview + 8 reviews + 3×8 regional maps + 5 labels + 14 licence lines
      expect(enLeaves.size).toBe(2 + 13 + 18 + 1 + 10 + 8 + 24 + 5 + 14);
    });

    test.each(ALL_LOCALES)('%s has every key, non-empty, and one heading/regulator/geo-hub string per region', (locale) => {
      const own = restLeaves(locale);
      expect([...own.keys()].sort()).toEqual([...enLeaves.keys()].sort());
      for (const [path, text] of own) expect(text.trim(), `${locale} ${path} is empty`).not.toBe('');
      const rb = getStrings(locale).productDetail.regionalBuying;
      for (const map of [rb.heading, rb.regulator, rb.geoHub]) expect(Object.keys(map).sort()).toEqual(REGIONS);
    });

    test.each(ALL_LOCALES)('%s keeps the placeholders and adds none', (locale) => {
      for (const [path, text] of restLeaves(locale)) {
        const allowed = PLACEHOLDERS[path] ?? [];
        for (const token of allowed) expect(text, `${locale} ${path} keeps ${token}`).toContain(token);
        for (const token of text.match(/\{\w+\}/g) ?? []) {
          expect(allowed, `${locale} ${path}: unknown placeholder ${token}`).toContain(token);
        }
      }
    });

    test('ja strings are in Japanese script (do-not-translate acronyms excepted)', () => {
      for (const [path, text] of restLeaves('ja')) {
        if (exempt(path, 'ja')) continue;
        expect(text, `ja ${path}`).toMatch(/[぀-ヿ一-鿿]/);
      }
    });

    test.each(['es', 'fr', 'pt', 'de', 'fr-CA'] as Locale[])('%s strings differ from en (do-not-translate list excepted)', (locale) => {
      for (const [path, text] of restLeaves(locale)) {
        if (exempt(path, locale)) continue;
        expect(text, `${locale} ${path} is the English copy`).not.toBe(enLeaves.get(path));
      }
    });

    test('every do-not-translate entry is really identical to en (the list stays honest)', () => {
      for (const [path, locales] of Object.entries(DO_NOT_TRANSLATE)) {
        for (const locale of locales) expect(restLeaves(locale).get(path), `${locale} ${path}`).toBe(enLeaves.get(path));
      }
    });

    test('en is the text the pages showed before: REGION_PROFILES heading, regulator, geo-hub label and block labels', () => {
      const rb = getStrings('en').productDetail.regionalBuying;
      const es = getStrings('es').productDetail.regionalBuying;
      const ja = getStrings('ja').productDetail.regionalBuying;
      for (const code of REGIONS as Array<keyof typeof REGION_PROFILES>) {
        const profile = REGION_PROFILES[code];
        expect(rb.regulator[code], code).toBe(profile.regulator);
        // LATAM's profile labels are Spanish: its block rendered "Comprar" and the
        // Spanish hub label, which the es bundle now carries. JP's block labels
        // are Japanese since 2026-10-12 (the JP host's chrome is ja); its
        // "Buying in Japan" heading and hub label are the ja bundle's own, checked
        // against Japanese script in the chrome test below.
        const own = code === 'latam' ? es : code === 'jp' ? ja : rb;
        if (code !== 'jp') {
          expect(own.heading[code], code).toBe(profile.labels.heading.replace('{name}', code === 'latam' ? 'Comprar' : 'Buying'));
          expect(own.geoHub[code], code).toBe(profile.geoHub.label);
        }
        expect(own.price, code).toBe(profile.labels.price);
        expect(own.status, code).toBe(profile.labels.licence);
        expect(own.monthUnit, code).toBe(profile.labels.monthUnit);
      }
      expect(rb.whereToBuy).toBe('Where to buy');
      expect(rb.importPathway).toBe('Import pathway');
      expect(es.whereToBuy).toBe('Dónde comprar');
      expect(es.importPathway).toBe('Vía de importación');
    });
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
