import { describe, test, expect, vi, afterEach } from 'vitest';
import { join } from 'node:path';
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getStrings, productsCA, productsEU, productsUS, type Locale, type Product } from '@nootropic/data';
import ComparisonTable from './ComparisonTable';

// 2026-10-19, shared-template semantics leftovers (2): the comparison table on
// the EU /de/ /fr/ /pt/ and CA /fr/ pages printed its scores with a decimal
// point ("7.5/10", Trustpilot "4.2/5") beside prices with a decimal comma
// ("64,95 €"). The score buttons (text and accessible name) and the Trustpilot
// cells now write numbers as the page locale does; en, es (es-419: "64.99")
// and ja keep the point, so their output is unchanged.

/** The decimal sign each locale's pages write (prices included). */
const DECIMAL: Record<Locale, '.' | ','> = { en: '.', es: '.', ja: '.', de: ',', fr: ',', pt: ',', 'fr-CA': ',' };
/** The table as each locale renders it: the market and products its pages pass (ja: no host renders it; covered anyway). */
const CASES: Array<[Locale, 'us' | 'eu' | 'ca', Product[]]> = [
  ['en', 'us', productsUS],
  ['en', 'eu', productsEU],
  ['en', 'ca', productsCA],
  ['es', 'us', productsUS],
  ['de', 'eu', productsEU],
  ['fr', 'eu', productsEU],
  ['pt', 'eu', productsEU],
  ['fr-CA', 'ca', productsCA],
  ['ja', 'us', productsUS],
];

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/** A score as the locale writes it: the record's digits with the locale's decimal sign. */
const written = (n: number, locale: Locale) => String(n).replace('.', DECIMAL[locale]);
const sorted = (xs: string[]) => [...xs].sort();

function table(locale: Locale, market: 'us' | 'eu' | 'ca', products: Product[]): string {
  return text(renderToStaticMarkup(createElement(ComparisonTable, { products, market, strings: getStrings(locale) })));
}

/** [accessible name, visible text] of each score button (desktop rows and mobile cards). */
const scoreButtons = (html: string) =>
  [...html.matchAll(/<button class="[^"]*\bcursor-help\b[^"]*" aria-label="([^"]*)"[^>]*>([^<]*)<\/button>/g)].map((m) => [m[1], m[2]]);
/** Every "x/5" Trustpilot rating the table shows (desktop cell and mobile card). */
const ratings = (html: string) => [...html.matchAll(/>([0-9][0-9.,]*\/5)</g)].map((m) => m[1]);

describe('comparison table numbers in the page locale (score, its name, Trustpilot)', () => {
  test('the cases are non-vacuous: decimal scores and ratings exist in every market', () => {
    for (const [, , products] of CASES) {
      expect(products.some((p) => !Number.isInteger(p.score))).toBe(true);
      expect(products.some((p) => p.trustpilotScore !== null && !Number.isInteger(p.trustpilotScore))).toBe(true);
    }
  });

  test.each(CASES)('%s (%s): every score and rating uses the locale decimal sign', (locale, market, products) => {
    const html = table(locale, market, products);
    const buttons = scoreButtons(html);
    expect(buttons.length, 'one per product in the rows and one in the mobile cards').toBe(products.length * 2);
    expect(sorted(buttons.map(([, shown]) => shown))).toEqual(sorted(products.flatMap((p) => Array(2).fill(`${written(p.score, locale)}/10`))));
    for (const [name, shown] of buttons) expect(name, `${locale}: name "${name}" carries "${shown}"`).toContain(shown);

    const rated = products.filter((p) => p.trustpilotScore !== null && p.trustpilotScore > 0);
    expect(rated.length).toBeGreaterThan(0);
    expect(sorted(ratings(html))).toEqual(sorted(rated.flatMap((p) => Array(2).fill(`${written(p.trustpilotScore!, locale)}/5`))));

    const other = DECIMAL[locale] === ',' ? '.' : ',';
    expect(html, `${locale}: a score or rating with "${other}"`).not.toMatch(new RegExp(`\\d\\${other}\\d+/(10|5)\\b`));
  });

  test.each(['en', 'es', 'ja'] as const)('%s output is the record value as before ("7.5/10", "4.2/5")', (locale) => {
    const html = table(locale, 'us', productsUS);
    expect(sorted(scoreButtons(html).map(([, shown]) => shown))).toEqual(sorted(productsUS.flatMap((p) => Array(2).fill(`${p.score}/10`))));
  });
});

// ── The real localized pages ─────────────────────────────────────────────────

afterEach(() => {
  vi.unstubAllEnvs();
});

type PageModule = { default: (props: object) => unknown };
const APPS = join(__dirname, '..', '..', '..', 'apps');

async function renderPage(region: string, route: string): Promise<string> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  return text(renderToStaticMarkup((await mod.default({})) as ReactElement));
}

const PAGES: Array<[string, string, Locale]> = [
  ['eu', 'de/beste-nootropika', 'de'],
  ['eu', 'fr/meilleurs-nootropiques', 'fr'],
  ['eu', 'pt/melhores-nootropicos', 'pt'],
  ['ca', 'fr/comparer', 'fr-CA'],
  ['ca', 'fr/meilleurs-nootropiques', 'fr-CA'],
  ['us', 'es/comparar', 'es'],
  ['us', 'es/mejores-nootropicos', 'es'],
];

describe('the localized comparison-table pages write scores as their prices', () => {
  test.each(PAGES)('%s /%s/ (%s)', async (region, route, locale) => {
    const html = await renderPage(region, route);
    const shown = scoreButtons(html).map(([, s]) => s);
    expect(shown.length, 'score buttons rendered').toBeGreaterThan(0);
    const other = DECIMAL[locale] === ',' ? '.' : ',';
    expect(shown.some((s) => s.includes(DECIMAL[locale])), `a decimal score written with "${DECIMAL[locale]}"`).toBe(true);
    expect(html, `a score or rating with "${other}"`).not.toMatch(new RegExp(`\\d\\${other}\\d+/(10|5)\\b`));
  });
});
