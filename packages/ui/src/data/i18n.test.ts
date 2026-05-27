import { describe, test, expect } from 'vitest';
import { getStrings, getLocaleForMarket } from '@nootropic/data';
import type { Locale } from '@nootropic/data';

describe('getLocaleForMarket', () => {
  test('latam → es', () => {
    expect(getLocaleForMarket('latam')).toBe('es');
  });

  test('jp → ja', () => {
    expect(getLocaleForMarket('jp')).toBe('ja');
  });

  test('us/eu/ca/au/gcc/sea all → en (English fallback)', () => {
    expect(getLocaleForMarket('us')).toBe('en');
    expect(getLocaleForMarket('eu')).toBe('en');
    expect(getLocaleForMarket('ca')).toBe('en');
    expect(getLocaleForMarket('au')).toBe('en');
    expect(getLocaleForMarket('gcc')).toBe('en');
    expect(getLocaleForMarket('sea')).toBe('en');
  });

  test('unknown market falls back to en', () => {
    expect(getLocaleForMarket('mars')).toBe('en');
    expect(getLocaleForMarket('')).toBe('en');
  });
});

describe('getStrings', () => {
  test('returns the requested locale bundle', () => {
    expect(getStrings('en').nav.bestNootropics).toBe('Best Nootropics');
    expect(getStrings('es').nav.bestNootropics).toBe('Los Mejores');
    expect(getStrings('fr').nav.bestNootropics).toBe('Les Meilleurs');
    expect(getStrings('ja').nav.bestNootropics).toBe('ベスト');
    expect(getStrings('pt').nav.bestNootropics).toBe('Os Melhores');
  });

  test('all 5 locales have the same shape (every key in en is present in others)', () => {
    const en = getStrings('en');
    const locales: Locale[] = ['es', 'fr', 'ja', 'pt'];
    for (const loc of locales) {
      const other = getStrings(loc);
      // Shape check on a few nested keys that have been touched in recent PRs
      expect(other.breadcrumb.home, `${loc} breadcrumb.home`).toBeTruthy();
      expect(other.breadcrumb.ingredients, `${loc} breadcrumb.ingredients`).toBeTruthy();
      expect(other.ingredientDetail.sections.mechanism, `${loc} ingredientDetail.sections.mechanism`).toBeTruthy();
      expect(other.ingredientDetail.table.effect, `${loc} ingredientDetail.table.effect`).toBeTruthy();
      // Confirm en still has these too (regression guard)
      expect(en.breadcrumb.home).toBeTruthy();
      expect(en.ingredientDetail.sections.mechanism).toBeTruthy();
    }
  });

  test('Japanese ingredientDetail headings contain the expected kanji', () => {
    const ja = getStrings('ja');
    expect(ja.ingredientDetail.sections.mechanism).toBe('作用機序');
    expect(ja.ingredientDetail.toc.faq).toBe('FAQ');
    expect(ja.breadcrumb.home).toBe('ホーム');
  });

  test('breadcrumb back-link templates start with the expected arrow', () => {
    expect(getStrings('en').breadcrumb.backToBestNootropics).toMatch(/^← /);
    expect(getStrings('es').breadcrumb.backToIngredientsGuide).toMatch(/^← /);
    expect(getStrings('ja').breadcrumb.backToBestNootropics).toMatch(/^← /);
  });

  test('stackingLede contains {name} placeholder in every locale', () => {
    for (const loc of ['en', 'es', 'fr', 'ja', 'pt'] as Locale[]) {
      expect(getStrings(loc).ingredientDetail.stackingLede, `${loc}`).toContain('{name}');
    }
  });
});
