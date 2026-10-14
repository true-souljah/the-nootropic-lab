import { describe, test, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';
import AffiliateDisclosure from './AffiliateDisclosure';
import { FPDisclosure } from './public-chrome/FPDisclosure';
import { FPTrustNote } from './public-chrome/FPTrustNote';

// Every user-visible disclosure string is in the page's language (operator
// rule): a translated route — a subtree wrapped in <div lang="…"> (us /es/,
// eu /de/ /fr/ /pt/, ca /fr/) or an app whose root layout is not English
// (latam; jp is English since 2026-10-13) — never renders the English affiliate notice, strip, trust note
// or their labels. scripts/check-built-disclosure.ts checks the same on every
// built page; this test fails at the source.

const REPO = join(__dirname, '..', '..', '..');
const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const EN = getStrings('en').disclosure;
// English disclosure copy: the bundle's sentences and labels, and FPDisclosure's
// English fallback for callers without a bundle.
const EN_SENTENCES = [
  EN.text, EN.inline, EN.noCommission, EN.siteWide, EN.ranking,
  'We earn a commission when you buy through our links.',
  'Our scores are computed before commissions are checked.',
];
const EN_LABELS = [EN.badge, EN.neutralBadge, EN.methodology];

function localeOfLang(lang: string): Locale | null {
  if (lang === 'fr-CA') return 'fr-CA';
  const base = lang.split('-')[0];
  return (LOCALES as string[]).includes(base) ? (base as Locale) : null;
}

function files(dir: string, name: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files(full, name, out);
    else if (entry === name) out.push(full);
  }
  return out;
}

/** Rendered text: React escapes quotes and ampersands. */
const decoded = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

// ── Each app page and the language it renders in ─────────────────────────
// The root layout's <html lang>, unless a layout between it and the page
// wraps its subtree in <div lang="…">.
interface Page { app: string; file: string; src: string; lang: string; locale: Locale }
const PAGES: Page[] = readdirSync(join(REPO, 'apps')).flatMap((app) => {
  const appDir = join(REPO, 'apps', app, 'src', 'app');
  const rootLang = /<html\b[^>]*\blang="([^"]+)"/.exec(readFileSync(join(appDir, 'layout.tsx'), 'utf8'))?.[1];
  if (!rootLang) throw new Error(`${app}: root layout has no <html lang>`);
  const subtreeLang = new Map<string, string>();
  for (const layout of files(appDir, 'layout.tsx')) {
    const lang = /<div lang="([^"]+)">/.exec(readFileSync(layout, 'utf8'))?.[1];
    if (lang) subtreeLang.set(dirname(layout), lang);
  }
  return files(appDir, 'page.tsx').map((f) => {
    let lang = rootLang;
    for (let dir = dirname(f); dir.startsWith(appDir); dir = dirname(dir)) {
      const l = subtreeLang.get(dir);
      if (l) {
        lang = l;
        break;
      }
    }
    const locale = localeOfLang(lang);
    if (!locale) throw new Error(`${relative(REPO, f)}: language "${lang}" has no strings bundle`);
    return { app, file: relative(REPO, f), src: readFileSync(f, 'utf8'), lang, locale };
  });
});
const TRANSLATED = PAGES.filter((p) => p.locale !== 'en');

/** Locale of each `src/lib/<module>.ts` built with buildRegionSearchContext(…, '<locale>', …). */
function libLocale(app: string, mod: string): string | undefined {
  const file = join(REPO, 'apps', app, 'src', 'lib', `${mod}.ts`);
  if (!existsSync(file)) return undefined;
  return /buildRegionSearchContext\([^,]+,\s*'([\w-]+)'/.exec(readFileSync(file, 'utf8'))?.[1];
}

describe('translated routes', () => {
  test('are found: every non-English subtree and app (non-empty input)', () => {
    const byLang = (lang: string) => TRANSLATED.filter((p) => p.lang === lang).map((p) => p.file);
    expect(PAGES.length).toBeGreaterThan(200);
    expect(byLang('es')).toEqual(expect.arrayContaining([
      'apps/us/src/app/es/page.tsx',
      'apps/us/src/app/es/comparar/page.tsx',
      'apps/us/src/app/es/mejores-nootropicos/page.tsx',
      'apps/latam/src/app/best-nootropics/page.tsx',
    ]));
    expect(byLang('de')).toContain('apps/eu/src/app/de/beste-nootropika/page.tsx');
    expect(byLang('fr')).toContain('apps/eu/src/app/fr/meilleurs-nootropiques/page.tsx');
    expect(byLang('pt')).toContain('apps/eu/src/app/pt/melhores-nootropicos/page.tsx');
    expect(byLang('fr-CA')).toEqual(expect.arrayContaining([
      'apps/ca/src/app/fr/comparer/page.tsx',
      'apps/ca/src/app/fr/meilleurs-nootropiques/page.tsx',
    ]));
    // JP is English since 2026-10-13: Japanese copy is paused pending legal
    // advice and the /ja/ subtree is gone. No route on any host is Japanese.
    expect(byLang('ja')).toEqual([]);
    // English apps and the English root of a translated app stay English.
    expect(PAGES.find((p) => p.file === 'apps/us/src/app/best-nootropics/page.tsx')?.locale).toBe('en');
    expect(PAGES.find((p) => p.file === 'apps/eu/src/app/best-nootropics/page.tsx')?.locale).toBe('en');
    expect(PAGES.find((p) => p.file === 'apps/jp/src/app/best-nootropics/page.tsx')?.locale).toBe('en');
  });

  test("take uiStrings from a module built with the page's own locale", () => {
    const offenders: string[] = [];
    for (const p of TRANSLATED) {
      for (const m of p.src.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]@\/lib\/([\w-]+)['"]/g)) {
        if (!/\buiStrings\b/.test(m[1])) continue;
        const locale = libLocale(p.app, m[2]);
        if (locale !== p.locale) offenders.push(`${p.file}: uiStrings from @/lib/${m[2]} (${locale}) on a ${p.lang} page`);
      }
      for (const m of p.src.matchAll(/\bgetStrings\(\s*'([\w-]+)'\s*\)/g)) {
        if (m[1] !== p.locale) offenders.push(`${p.file}: getStrings('${m[1]}') on a ${p.lang} page`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('pass their locale bundle to every disclosure component', () => {
    const offenders: string[] = [];
    for (const p of TRANSLATED) {
      for (const m of p.src.matchAll(/<(AffiliateDisclosure|FPDisclosure|FPTrustNote|PublicShell)\b[^>]*>/g)) {
        const prop = m[1] === 'PublicShell' ? 'uiStrings' : 'strings';
        if (!new RegExp(`\\b${prop}=`).test(m[0])) offenders.push(`${p.file}: <${m[1]}> without ${prop}=`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('carry no English disclosure copy in their source', () => {
    // Not neutralBadge: "Disclosure" is part of identifiers (AffiliateDisclosure).
    const english = [...EN_SENTENCES, EN.badge, EN.methodology];
    const offenders = TRANSLATED.flatMap((p) => english.filter((s) => p.src.includes(s)).map((s) => `${p.file}: "${s}"`));
    expect(offenders).toEqual([]);
  });
});

describe('disclosure components render only the bundle they are given', () => {
  test.each(LOCALES.filter((l) => l !== 'en'))('%s: no English in AffiliateDisclosure, strip or trust note', (locale) => {
    const d = getStrings(locale).disclosure;
    const notice = decoded(renderToStaticMarkup(createElement(AffiliateDisclosure, { strings: d })));
    expect(notice).toContain(d.text);
    expect(notice).toContain(d.methodology);
    expect(notice).toContain(`aria-label="${d.badge}"`);
    for (const scope of ['page', 'product', 'site'] as const) {
      const html =
        notice +
        decoded(
          renderToStaticMarkup(
            createElement('div', null,
              createElement(FPDisclosure, { strings: d, scope }),
              createElement(FPTrustNote, { strings: d, scope }),
            ),
          ),
        );
      for (const s of [...EN_SENTENCES, ...EN_LABELS]) expect(html, `${locale} ${scope}: "${s}"`).not.toContain(s);
    }
  });

  test('en: AffiliateDisclosure keeps its English notice and accessible name', () => {
    const html = decoded(renderToStaticMarkup(createElement(AffiliateDisclosure, { strings: EN })));
    expect(html).toContain(EN.text);
    expect(html).toContain('aria-label="Affiliate disclosure"');
  });
});
