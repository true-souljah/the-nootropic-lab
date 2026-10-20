import { describe, test, expect, vi, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getStrings } from '@nootropic/data';
import type { Locale, RegionalRegionCode, SearchItem, UIStrings } from '@nootropic/data';
import { FPHeader, navFromStrings } from './public-chrome/FPHeader';

// Tests for navFromStrings + the FPHeader nav resolution contract added in
// PR-Q8 (2026-06-02). Before this fix, FPHeader fell back to a hardcoded
// English DEFAULT_NAV whenever `nav` was omitted, even if `strings` was
// passed — every non-English page (LATAM /, CA /fr/, the then-Japanese JP pages, etc.)
// rendered English chrome. This locks the WCAG 3.1.2 fix in place so a
// future refactor doesn't silently regress it.
//
// The nav tests check the data-shape mapping; the rendered nav is covered by
// the Playwright multi-region chrome assertions in e2e/{latam,ca}-*.spec.ts.
// The edition-label block at the end renders <FPHeader/> to static markup.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

describe('navFromStrings — output shape', () => {
  test('returns 5 nav links in the canonical order', () => {
    const nav = navFromStrings(getStrings('en'));
    expect(nav).toHaveLength(5);
    expect(nav.map((n) => n.href)).toEqual([
      '/best-nootropics/',
      '/ingredients/',
      '/guides/',
      '/methodology/',
      '/about/',
    ]);
  });

  test('every entry has a non-empty label and a valid href', () => {
    for (const locale of ALL_LOCALES) {
      const nav = navFromStrings(getStrings(locale));
      for (const item of nav) {
        expect(item.label, `${locale} ${item.href} label`).toBeTruthy();
        // Trailing slash: the slash-less form is a 308 that GSC reports as "Page with redirect".
        expect(item.href, `${locale} label`).toMatch(/^\/[a-z-]+\/$/);
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
        // The collision is allowed for href === '/guides/' only (where the
        // EN and FR forms genuinely match).
        if (item.label === 'Guides' && item.href === '/guides/' && (locale === 'fr' || locale === 'fr-CA')) {
          continue;
        }
        expect(englishLabels.has(item.label), `${locale} ${item.href} should not equal English`).toBe(false);
      }
    }
  });
});

describe('navFromStrings — adjacent WCAG 3.1.2 surfaces (primaryLandmark / skipToContent)', () => {
  test('every bundle has a localized aria-label for the primary nav landmark', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale);
      expect(s.nav.primaryLandmark, `${locale} primaryLandmark`).toBeTruthy();
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

// Design decisions 15–16 (2026-10-19): the header as drawn on the Option B
// canvas names this host's edition in a plain pill right before the search
// trigger, worded as the footer's By-region column words it in the page's own
// bundle, and has no comparator button (the footer links the comparator).
// Bundles per host as in apps/<region>/src/lib/search.ts: es on LATAM, en on
// every other host (JP chrome is English since 2026-10-13).

const SEARCH_ITEMS: SearchItem[] = [{ title: 'Mind Lab Pro', href: '/mind-lab-pro-review/', type: 'product' }];

const EDITIONS: [RegionalRegionCode, Locale, string][] = [
  ['us', 'en', 'United States'],
  ['eu', 'en', 'European Union'],
  ['ca', 'en', 'Canada'],
  ['au', 'en', 'Australia'],
  ['jp', 'en', 'Japan'],
  ['latam', 'es', 'América Latina'],
  ['gcc', 'en', 'Gulf (GCC)'],
  ['sea', 'en', 'Southeast Asia'],
];

/** The labels of the header's former "Open comparator →" button, one per bundle. */
const FORMER_COMPARATOR_LABELS = ['Open comparator', 'Abrir comparador', 'Ouvrir le comparateur', '比較ツールを開く', 'Vergleichstool öffnen'];

const PILL = /<span class="([^"]*\brounded-full\b[^"]*)">([^<]*)<\/span>/g;

function renderHeader(region: RegionalRegionCode, strings?: UIStrings): string {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return renderToStaticMarkup(createElement(FPHeader, { strings, searchItems: SEARCH_ITEMS }));
}

/** The one edition pill: its offset, classes, text and the markup right after it. */
function pillOf(html: string): { at: number; classes: string[]; text: string; after: string } {
  const found = [...html.matchAll(PILL)];
  expect(found, 'exactly one edition label').toHaveLength(1);
  const [whole, cls, text] = found[0];
  const at = found[0].index!;
  return { at, classes: cls.split(' '), text, after: html.slice(at + whole.length) };
}

describe('FPHeader edition label: this host, worded by the page bundle; no comparator button', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test.each(EDITIONS)('%s host (%s bundle): the label reads "%s"', (region, locale, label) => {
    const html = renderHeader(region, getStrings(locale));
    const pill = pillOf(html);
    expect(pill.text).toBe(label);
    // Plain text styled as the canvas pill, hidden below md: (no role, tabindex or link).
    expect(pill.classes[0]).toBe('hidden');
    expect(pill.classes).toEqual(
      expect.arrayContaining(['md:inline-flex', 'text-[13px]', 'text-ds-muted', 'px-[10px]', 'py-[6px]', 'border', 'border-ds-border', 'rounded-full']),
    );
    // In the header's right-hand group after the 5 links, immediately before the search trigger.
    const lastLink = html.indexOf(`>${navFromStrings(getStrings(locale))[4].label}</a>`);
    expect(lastLink).toBeGreaterThan(-1);
    expect(pill.at).toBeGreaterThan(lastLink);
    expect(pill.after).toMatch(/^<button type="button" class="hidden md:inline-flex [^"]*">[\s\S]*?\(Command\+K\)[\s\S]*?<\/button>/);
  });

  test.each(EDITIONS)('%s host (%s bundle): no comparator link or button in the header', (region, locale) => {
    const html = renderHeader(region, getStrings(locale));
    // next/link drops the trailing slash outside a trailingSlash app build.
    expect(html).not.toMatch(/href="\/nootropic-comparison\/?"/);
    for (const former of FORMER_COMPARATOR_LABELS) expect(html).not.toContain(former);
  });

  test('nested-locale pages word it in their own language (CA /fr/, EU /de/ /fr/ /pt/)', () => {
    expect(pillOf(renderHeader('ca', getStrings('fr-CA'))).text).toBe('Canada');
    expect(pillOf(renderHeader('eu', getStrings('de'))).text).toBe('Europäische Union');
    expect(pillOf(renderHeader('eu', getStrings('fr'))).text).toBe('Union européenne');
    expect(pillOf(renderHeader('eu', getStrings('pt'))).text).toBe('União Europeia');
  });

  test('English without a bundle; the region is still required (fails closed)', () => {
    expect(pillOf(renderHeader('latam')).text).toBe('Latin America');
    vi.stubEnv('NEXT_PUBLIC_REGION', 'mars');
    expect(() => renderToStaticMarkup(createElement(FPHeader, {}))).toThrow(/NEXT_PUBLIC_REGION/);
  });

  test('no bundle keeps the removed comparator-button string', () => {
    for (const locale of ALL_LOCALES) {
      expect(Object.keys(getStrings(locale).nav), `${locale} nav keys`).not.toContain('openComparator');
    }
  });
});

// Operator decision 2026-10-20: the full header row (brand, 5 links, edition
// label, search) needs 843–952px across the locales and 768 leaves 720, so
// the links and the menu button switch at lg: (1024px); the edition label
// still shows from md: (768px).
describe('FPHeader breakpoints: the 5 links from lg:, the edition label from md:', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test.each(EDITIONS)('%s host (%s bundle): link row and separator from lg:, menu button below lg:, label from md:', (region, locale) => {
    const strings = getStrings(locale);
    const html = renderHeader(region, strings);
    const row = /<div class="([^"]*)">((?:<a [^>]*>[^<]*<\/a>){5})<\/div>/.exec(html);
    expect(row, 'the 5-link row').not.toBeNull();
    expect(row![1].split(' ').slice(0, 2)).toEqual(['hidden', 'lg:flex']);
    for (const link of navFromStrings(strings)) expect(row![2]).toContain(`>${link.label}</a>`);
    const separator = /<span class="([^"]*\bw-px\b[^"]*)" aria-hidden="true"><\/span>/.exec(html);
    expect(separator, 'the separator').not.toBeNull();
    expect(separator![1].split(' ').slice(0, 2)).toEqual(['hidden', 'lg:inline-block']);
    const button = /<button[^>]*aria-controls="fp-mobile-menu"[^>]*>/.exec(html)?.[0];
    expect(button, 'the menu button').toBeDefined();
    expect(button).toMatch(/class="lg:hidden /);
    expect(pillOf(html).classes.slice(0, 2)).toEqual(['hidden', 'md:inline-flex']);
    // Nothing else in the row switches at md: but the label (and the search trigger's own pair).
    for (const cls of [row![1], separator![1], button!]) expect(cls).not.toMatch(/\bmd:(flex|hidden|inline-block)\b/);
  });
});
