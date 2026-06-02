// Klaro locale helpers — pure functions, no React, no DOM imports, safe
// to unit-test in any environment. Used by CookieBanner.tsx at mount to
// pick the right `klaroConfig.lang` so the consent banner renders in
// the locale of the actual page (not the static `<html lang>` of the
// root layout). Closes the WCAG 3.1.2 leak flagged by the PR-Q11 a11y
// review for multi-locale apps (CA /fr/*, EU /de/+/fr/+/pt/, US /es/).

import type { KlaroConfig } from './klaro-config';

/**
 * Pick a Klaro translation key from a raw BCP-47-style lang string.
 * Klaro looks up `klaroConfig.translations[klaroConfig.lang]` directly,
 * so the picked value must match a top-level key in the translations
 * object. Regional variants Klaro doesn't carry fall back to their
 * base language.
 *
 * - `fr-CA` stays as-is — we ship an OQLF-correct bundle.
 * - `fr-FR` / `fr-BE` / etc. → `fr` (metropolitan French bundle).
 * - `pt-BR` / `pt-PT` → `pt`.
 * - `es-419` / `es-MX` / `es-ES` → `es`.
 * - `ja-JP` / `ja-Hira` → `ja`.
 * - `de-AT` / `de-CH` → `de`.
 * - Unknown / empty / `en-*` → `en` (Klaro's safe default).
 */
export function pickKlaroLang(raw: string | null | undefined): string {
  if (!raw) return 'en';
  if (raw === 'fr-CA') return 'fr-CA';
  const base = raw.split('-')[0]?.toLowerCase();
  switch (base) {
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'es':
      return 'es';
    case 'pt':
      return 'pt';
    case 'ja':
      return 'ja';
    case 'en':
    default:
      return 'en';
  }
}

/**
 * Minimal subset of the DOM the locale detector needs. Accepting this
 * shape (instead of touching `document` directly) keeps the function
 * testable in a `node` environment — no jsdom dependency needed. The
 * production caller passes `document` from the browser at mount time.
 */
export interface LangDetectionDOM {
  documentElement: { lang?: string };
  querySelector: (selector: string) => { getAttribute: (name: string) => string | null } | null;
}

/**
 * Detect the active page locale from the supplied DOM. Strategy:
 *
 *   1. If there's a non-`<html>` element with a `lang` attribute, use
 *      that. Nested-locale paths (CA `/fr/*`, EU `/de/*`, etc.) wrap
 *      their content in `<div lang="X">` via a nested Next.js layout;
 *      that's a stronger signal than the static `<html lang>` set by
 *      the root layout.
 *   2. Otherwise fall back to `documentElement.lang`.
 *   3. Otherwise `'en'`.
 *
 * Returns the raw BCP-47 string from the DOM — callers should pipe
 * through `pickKlaroLang()` to map it onto a Klaro translation key.
 */
export function detectActiveLang(dom: LangDetectionDOM): string {
  // querySelector returns the FIRST matching element in document order.
  // Nested layouts render BEFORE CookieBanner in body order, so the
  // first `[lang]:not(html)` is the page-content wrapper if one exists.
  const inner = dom.querySelector('[lang]:not(html)');
  const innerLang = inner?.getAttribute('lang');
  if (innerLang) return innerLang;
  return dom.documentElement.lang || 'en';
}

/**
 * Mutates `klaroConfig.lang` to match the active page locale before
 * Klaro's setup() reads it. Safe to call inside a `useEffect` — only
 * touches the in-memory config object, never the live Klaro instance.
 *
 * Exported as a one-liner so callers don't have to wire the two helpers
 * by hand and so the side-effect is named ("set the lang before setup").
 */
export function applyActiveLangToKlaroConfig(
  klaroConfig: KlaroConfig,
  dom: LangDetectionDOM = typeof document !== 'undefined'
    ? (document as unknown as LangDetectionDOM)
    : { documentElement: {}, querySelector: () => null },
): void {
  const detected = detectActiveLang(dom);
  // Klaro's `lang` field is not in our local KlaroConfig interface
  // because we never set it at module scope before PR-Q13. Cast at the
  // assignment boundary rather than widening the type globally.
  (klaroConfig as KlaroConfig & { lang?: string }).lang = pickKlaroLang(detected);
}
