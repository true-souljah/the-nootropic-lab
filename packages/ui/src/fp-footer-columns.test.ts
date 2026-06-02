import { describe, test, expect } from 'vitest';
import { getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';
import { columnsFromStrings } from './public-chrome/FPFooter';

// Tests for columnsFromStrings + the reshaped UIStrings.footer added in
// PR-Q9 (2026-06-02). Before this fix, FPFooter rendered a hardcoded
// English DEFAULT_COLUMNS array on every public page across 8 region
// apps — a WCAG 3.1.2 Language of Parts violation on LATAM / CA /fr/ /
// JP /ja/ / etc. PR-Q8 closed the FPHeader half of this same root
// cause; this PR closes the FPFooter half.
//
// We do NOT render <FPFooter/> here (vitest is not DOM-configured); the
// contract under test is the data-shape mapping. Actual rendered output
// is covered by the Playwright multi-region footer assertions in
// e2e/{latam,ca}-*.spec.ts.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

describe('columnsFromStrings — output shape', () => {
  test('returns 4 columns in the canonical order', () => {
    const cols = columnsFromStrings(getStrings('en'));
    expect(cols).toHaveLength(4);
    expect(cols.map((c) => c.id)).toEqual([
      'footer-col-best-by-goal',
      'footer-col-head-to-head',
      'footer-col-by-region',
      'footer-col-about',
    ]);
  });

  test('every column has a non-empty heading + stable id + ≥4 links', () => {
    for (const locale of ALL_LOCALES) {
      const cols = columnsFromStrings(getStrings(locale));
      for (const col of cols) {
        expect(col.heading, `${locale} ${col.id} heading`).toBeTruthy();
        expect(col.id, `${locale} id`).toMatch(/^footer-col-/);
        expect(col.links.length, `${locale} ${col.id} link count`).toBeGreaterThanOrEqual(4);
        for (const link of col.links) {
          expect(link.label, `${locale} ${col.id} link label`).toBeTruthy();
          expect(link.href, `${locale} ${col.id} link href`).toBeTruthy();
        }
      }
    }
  });

  test('column ids are identical across locales (only labels translate)', () => {
    const enIds = columnsFromStrings(getStrings('en')).map((c) => c.id);
    for (const locale of ALL_LOCALES) {
      const ids = columnsFromStrings(getStrings(locale)).map((c) => c.id);
      expect(ids, `${locale} column ids`).toEqual(enIds);
    }
  });

  test('hrefs are identical across locales (URLs do not translate)', () => {
    const enHrefs = columnsFromStrings(getStrings('en')).flatMap((c) =>
      c.links.map((l) => l.href),
    );
    for (const locale of ALL_LOCALES) {
      const hrefs = columnsFromStrings(getStrings(locale)).flatMap((c) =>
        c.links.map((l) => l.href),
      );
      expect(hrefs, `${locale} hrefs`).toEqual(enHrefs);
    }
  });

  test('brand-vs-brand link labels in head-to-head stay English (allowlist)', () => {
    for (const locale of ALL_LOCALES) {
      const h2h = columnsFromStrings(getStrings(locale)).find(
        (c) => c.id === 'footer-col-head-to-head',
      );
      expect(h2h, `${locale} head-to-head column`).toBeDefined();
      // The first 3 head-to-head links are brand-vs-brand pages with
      // product names that must not be translated (proper nouns).
      expect(h2h!.links[0].label).toContain('Mind Lab Pro');
      expect(h2h!.links[0].label).toContain('NooCube');
      expect(h2h!.links[1].label).toContain('Alpha Brain');
      expect(h2h!.links[1].label).toContain('Qualia Mind');
      expect(h2h!.links[2].label).toContain('Thesis');
      expect(h2h!.links[2].label).toContain('Mind Lab Pro');
    }
  });
});

describe('columnsFromStrings — localization correctness', () => {
  test('en bundle yields English column headings', () => {
    const headings = columnsFromStrings(getStrings('en')).map((c) => c.heading);
    expect(headings).toEqual(['Best by goal', 'Head-to-head', 'By region', 'About']);
  });

  test('es bundle yields Spanish column headings (LATAM)', () => {
    const headings = columnsFromStrings(getStrings('es')).map((c) => c.heading);
    expect(headings).toEqual([
      'Mejores por objetivo',
      'Frente a frente',
      'Por región',
      'Acerca de',
    ]);
  });

  test('fr-CA bundle yields Quebec French headings (Canada /fr/*)', () => {
    const headings = columnsFromStrings(getStrings('fr-CA')).map((c) => c.heading);
    expect(headings).toEqual([
      'Meilleurs par objectif',
      'Face-à-face',
      'Par région',
      'À propos',
    ]);
  });

  test('ja bundle yields Japanese column headings', () => {
    const headings = columnsFromStrings(getStrings('ja')).map((c) => c.heading);
    expect(headings).toEqual(['目的別ベスト', '直接比較', '地域別', '運営者情報']);
  });

  test('non-English bundles never leak an English column heading (WCAG 3.1.2 regression guard)', () => {
    const englishHeadings = new Set(['Best by goal', 'Head-to-head', 'By region', 'About']);
    for (const locale of ALL_LOCALES) {
      if (locale === 'en') continue;
      const headings = columnsFromStrings(getStrings(locale)).map((c) => c.heading);
      for (const heading of headings) {
        expect(englishHeadings.has(heading), `${locale} heading "${heading}"`).toBe(false);
      }
    }
  });

  test('region names are translated, not left as English proper nouns', () => {
    // WCAG 3.1.2 treats country/region names as natural language, not
    // proper nouns. They should translate to their locale equivalents.
    const es = columnsFromStrings(getStrings('es')).find((c) => c.id === 'footer-col-by-region')!;
    expect(es.links.map((l) => l.label)).toEqual([
      'Estados Unidos',
      'Unión Europea',
      'Canadá',
      'Australia',
      'Japón',
      'América Latina',
    ]);

    const de = columnsFromStrings(getStrings('de')).find((c) => c.id === 'footer-col-by-region')!;
    expect(de.links.map((l) => l.label)).toEqual([
      'Vereinigte Staaten',
      'Europäische Union',
      'Kanada',
      'Australien',
      'Japan',
      'Lateinamerika',
    ]);
  });
});

describe('UIStrings.footer — adjacent surfaces required for FPFooter', () => {
  test('every bundle has a tagline + copyrightLine + lastAuditLabel + methodologyLabel', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      expect(s.footer.tagline, `${locale} tagline`).toBeTruthy();
      expect(s.footer.copyrightLine, `${locale} copyrightLine`).toBeTruthy();
      expect(s.footer.lastAuditLabel, `${locale} lastAuditLabel`).toBeTruthy();
      expect(s.footer.methodologyLabel, `${locale} methodologyLabel`).toBeTruthy();
    }
  });

  test('every copyrightLine contains the {year} placeholder', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      expect(s.footer.copyrightLine, `${locale} copyrightLine`).toContain('{year}');
    }
  });

  test('non-English bundles never literally equal "Last full re-audit:" or "Methodology"', () => {
    for (const locale of ALL_LOCALES) {
      if (locale === 'en') continue;
      const s = getStrings(locale);
      expect(s.footer.lastAuditLabel, `${locale} lastAuditLabel`).not.toBe('Last full re-audit:');
      // 'fr' / 'fr-CA' use "Méthodologie", 'es' uses "Metodología", etc.
      // None should be the bare English word.
      expect(s.footer.methodologyLabel, `${locale} methodologyLabel`).not.toBe('Methodology');
    }
  });
});
