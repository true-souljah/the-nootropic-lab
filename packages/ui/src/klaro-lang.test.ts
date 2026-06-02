import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  pickKlaroLang,
  detectActiveLang,
  applyActiveLangToKlaroConfig,
} from './klaro-lang';
import { klaroConfig } from './klaro-config';

// Tests for the Klaro locale helpers added in PR-Q13 (#77). Before this
// PR, Klaro's consent banner used `<html lang>` to pick a translation
// bundle. Every region's root layout sets a single hardcoded `<html
// lang>` (CA = en, LATAM = es, JP = ja, etc.) so nested-locale paths
// like CA `/fr/*`, EU `/de/*`, US `/es/*` saw English Klaro UI on top
// of the localized page content — a WCAG 3.1.2 violation on the first
// interactive element a user encounters.

describe('pickKlaroLang — Klaro bundle key selection', () => {
  test('null / undefined / empty fall back to en (Klaro safe default)', () => {
    expect(pickKlaroLang(null)).toBe('en');
    expect(pickKlaroLang(undefined)).toBe('en');
    expect(pickKlaroLang('')).toBe('en');
  });

  test('fr-CA is preserved exactly (Klaro bundle ships its own OQLF entry)', () => {
    expect(pickKlaroLang('fr-CA')).toBe('fr-CA');
  });

  test('other regional French variants collapse to fr (metropolitan bundle)', () => {
    expect(pickKlaroLang('fr-FR')).toBe('fr');
    expect(pickKlaroLang('fr-BE')).toBe('fr');
    expect(pickKlaroLang('fr-CH')).toBe('fr');
    expect(pickKlaroLang('fr')).toBe('fr');
  });

  test.each([
    ['es-419', 'es'],
    ['es-MX', 'es'],
    ['es-ES', 'es'],
    ['es', 'es'],
    ['pt-BR', 'pt'],
    ['pt-PT', 'pt'],
    ['pt', 'pt'],
    ['ja-JP', 'ja'],
    ['ja-Hira', 'ja'],
    ['ja', 'ja'],
    ['de-AT', 'de'],
    ['de-CH', 'de'],
    ['de', 'de'],
  ])('regional %s normalizes to base %s', (input, expected) => {
    expect(pickKlaroLang(input)).toBe(expected);
  });

  test.each([
    ['en', 'en'],
    ['en-US', 'en'],
    ['en-GB', 'en'],
    ['en-CA', 'en'],
  ])('all English variants %s map to en', (input, expected) => {
    expect(pickKlaroLang(input)).toBe(expected);
  });

  test('unknown locale falls back to en (Klaro safe default)', () => {
    expect(pickKlaroLang('ar')).toBe('en');
    expect(pickKlaroLang('zh-CN')).toBe('en');
    expect(pickKlaroLang('xx')).toBe('en');
  });

  test('every returned value matches a real key in klaroConfig.translations', () => {
    const keys = new Set(Object.keys(klaroConfig.translations));
    // Every value pickKlaroLang can emit must exist as a translations key
    // — otherwise Klaro would fall through to its global default and we'd
    // silently regress to English without the test catching it.
    for (const expected of ['en', 'es', 'fr', 'fr-CA', 'pt', 'de', 'ja']) {
      expect(keys.has(expected), `translations is missing "${expected}"`).toBe(true);
    }
  });
});

// Minimal DOM stub. Lets us run these tests in vitest's default `node`
// environment without pulling in jsdom (~15 MB devDep). The production
// path uses the real `document`; see CookieBanner.tsx.
function makeDom(htmlLang: string | undefined, innerLang: string | null) {
  return {
    documentElement: { lang: htmlLang },
    querySelector: (selector: string) =>
      selector === '[lang]:not(html)' && innerLang !== null
        ? { getAttribute: (name: string) => (name === 'lang' ? innerLang : null) }
        : null,
  };
}

describe('detectActiveLang — DOM-based locale detection', () => {
  test('returns "en" when nothing is set on the DOM', () => {
    expect(detectActiveLang(makeDom(undefined, null))).toBe('en');
  });

  test('falls back to `<html lang>` when no inner lang carrier exists', () => {
    expect(detectActiveLang(makeDom('es', null))).toBe('es');
  });

  test('prefers the inner `<div lang>` over `<html lang>` (nested-locale path)', () => {
    expect(detectActiveLang(makeDom('en', 'fr-CA'))).toBe('fr-CA');
  });

  test('inner detector returns the FIRST matching element in document order', () => {
    // makeDom returns the inner stub for any query — production behavior
    // (querySelector returns first match) is implicit. This documents
    // the contract.
    expect(detectActiveLang(makeDom('en', 'de'))).toBe('de');
  });
});

describe('applyActiveLangToKlaroConfig — integration', () => {
  let original: unknown;
  beforeEach(() => {
    original = (klaroConfig as { lang?: string }).lang;
  });
  afterEach(() => {
    (klaroConfig as { lang?: string }).lang = original as string | undefined;
  });

  test('sets klaroConfig.lang to a key Klaro can resolve (e.g. CA /fr/* → fr-CA)', () => {
    applyActiveLangToKlaroConfig(klaroConfig, makeDom('en', 'fr-CA'));
    expect((klaroConfig as { lang?: string }).lang).toBe('fr-CA');
  });

  test('LATAM home: `<html lang="es">` → klaroConfig.lang === "es"', () => {
    applyActiveLangToKlaroConfig(klaroConfig, makeDom('es', null));
    expect((klaroConfig as { lang?: string }).lang).toBe('es');
  });

  test('JP /ja/*: `<html lang="ja">` → klaroConfig.lang === "ja"', () => {
    applyActiveLangToKlaroConfig(klaroConfig, makeDom('ja', null));
    expect((klaroConfig as { lang?: string }).lang).toBe('ja');
  });

  test('EU /de/* nested-locale path → klaroConfig.lang === "de"', () => {
    applyActiveLangToKlaroConfig(klaroConfig, makeDom('en', 'de'));
    expect((klaroConfig as { lang?: string }).lang).toBe('de');
  });

  test('US /es/* nested-locale path → klaroConfig.lang === "es"', () => {
    applyActiveLangToKlaroConfig(klaroConfig, makeDom('en', 'es'));
    expect((klaroConfig as { lang?: string }).lang).toBe('es');
  });
});
