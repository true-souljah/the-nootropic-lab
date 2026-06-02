import { describe, test, expect } from 'vitest';
import { getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';
import { navFromStrings } from './public-chrome/FPHeader';

// Tests for navFromStrings + the FPHeader nav resolution contract added in
// PR-Q8 (2026-06-02). Before this fix, FPHeader fell back to a hardcoded
// English DEFAULT_NAV whenever `nav` was omitted, even if `strings` was
// passed — every non-English page (LATAM /, CA /fr/, JP /ja/, etc.)
// rendered English chrome. This locks the WCAG 3.1.2 fix in place so a
// future refactor doesn't silently regress it.
//
// We do NOT render <FPHeader/> here (vitest is not configured for JSX/DOM
// in this monorepo); the contract under test is the data-shape mapping.
// The actual rendered output is covered by the Playwright multi-region
// chrome assertions in e2e/{latam,ca}-*.spec.ts.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

describe('navFromStrings — output shape', () => {
  test('returns 5 nav links in the canonical order', () => {
    const nav = navFromStrings(getStrings('en'));
    expect(nav).toHaveLength(5);
    expect(nav.map((n) => n.href)).toEqual([
      '/best-nootropics',
      '/ingredients',
      '/guides',
      '/methodology',
      '/about',
    ]);
  });

  test('every entry has a non-empty label and a valid href', () => {
    for (const locale of ALL_LOCALES) {
      const nav = navFromStrings(getStrings(locale));
      for (const item of nav) {
        expect(item.label, `${locale} ${item.href} label`).toBeTruthy();
        expect(item.href, `${locale} label`).toMatch(/^\/[a-z-]+$/);
      }
    }
  });

  test('hrefs are identical across locales (only labels translate)', () => {
    const enHrefs = navFromStrings(getStrings('en')).map((n) => n.href);
    for (const locale of ALL_LOCALES) {
      const hrefs = navFromStrings(getStrings(locale)).map((n) => n.href);
      expect(hrefs, `${locale} hrefs`).toEqual(enHrefs);
    }
  });
});

describe('navFromStrings — localization correctness', () => {
  test('en bundle yields English labels', () => {
    const nav = navFromStrings(getStrings('en'));
    expect(nav.map((n) => n.label)).toEqual([
      'Best Nootropics',
      'Ingredients',
      'Guides',
      'Methodology',
      'About',
    ]);
  });

  test('es bundle yields Spanish labels (LATAM)', () => {
    const nav = navFromStrings(getStrings('es'));
    expect(nav.map((n) => n.label)).toEqual([
      'Los Mejores',
      'Ingredientes',
      'Guías',
      'Metodología',
      'Acerca de',
    ]);
  });

  test('fr-CA bundle yields Quebec French labels (Canada /fr/*)', () => {
    const nav = navFromStrings(getStrings('fr-CA'));
    expect(nav.map((n) => n.label)).toEqual([
      'Meilleurs Nootropiques',
      'Ingrédients',
      'Guides',
      'Méthodologie',
      'À propos',
    ]);
  });

  test('ja bundle yields Japanese labels', () => {
    const nav = navFromStrings(getStrings('ja'));
    expect(nav.map((n) => n.label)).toEqual([
      'ベスト',
      '成分',
      'ガイド',
      '評価方法',
      '運営者情報',
    ]);
  });

  test('non-English locales never leak an English label (WCAG 3.1.2 regression guard)', () => {
    const englishLabels = new Set(['Best Nootropics', 'Ingredients', 'Guides', 'Methodology', 'About']);
    for (const locale of ALL_LOCALES) {
      if (locale === 'en') continue;
      const nav = navFromStrings(getStrings(locale));
      for (const item of nav) {
        // Edge case: fr.ingredients happens to be 'Guides' — that's a
        // localized French word that collides with English by coincidence.
        // The collision is allowed for href === '/guides' only (where the
        // EN and FR forms genuinely match).
        if (item.label === 'Guides' && item.href === '/guides' && (locale === 'fr' || locale === 'fr-CA')) {
          continue;
        }
        expect(englishLabels.has(item.label), `${locale} ${item.href} should not equal English`).toBe(false);
      }
    }
  });
});

describe('navFromStrings — adjacent WCAG 3.1.2 surfaces (primaryLandmark / openComparator / skipToContent)', () => {
  test('every bundle has a localized aria-label for the primary nav landmark', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      expect(s.nav.primaryLandmark, `${locale} primaryLandmark`).toBeTruthy();
    }
  });

  test('every bundle has a localized openComparator CTA label', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      expect(s.nav.openComparator, `${locale} openComparator`).toBeTruthy();
    }
  });

  test('every bundle has a localized skipToContent label', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      expect(s.nav.skipToContent, `${locale} skipToContent`).toBeTruthy();
    }
  });

  test('non-English skip links never literally equal "Skip to main content"', () => {
    for (const locale of ALL_LOCALES) {
      if (locale === 'en') continue;
      const s = getStrings(locale);
      expect(s.nav.skipToContent, `${locale} skipToContent should be translated`).not.toBe(
        'Skip to main content',
      );
    }
  });
});
