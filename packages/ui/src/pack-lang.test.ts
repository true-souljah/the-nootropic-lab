import { describe, test, expect, vi, afterEach } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// 2026-10-19, shared-template semantics leftovers (3): the store's pack words
// (storePrice.pack — "1 x Qualia Mind 2.0 - 120 count Boxed", "Servings per
// container: 20"), kept verbatim in the store's language, sat unmarked in
// Spanish, French, German and Portuguese pages (WCAG 3.1.2): PricingTab and
// Comparator marked only non-English packs, and the short price line
// ("US$159 · <pack>") was a plain string in ComparisonTable, BestOf, Listicle,
// ProductDetail, RegionalAvailability, RegionalBuying and the LATAM / CA fr
// app pages. Every non-English page is rendered here; every pack text on it
// must be the whole content of an element whose `lang` is the text's own.

const APPS = join(__dirname, '..', '..', '..', 'apps');
const DATA = join(__dirname, '..', '..', 'data', 'src');

interface StorePriceRecord { pack: string; lang?: string }
/** Every storePrice in a region's products JSON (the records the pages render). */
function storePrices(region: string): StorePriceRecord[] {
  const raw = JSON.parse(readFileSync(join(DATA, `products-${region}.json`), 'utf8'));
  const list: Array<{ storePrice?: StorePriceRecord }> = Array.isArray(raw) ? raw : (raw.products ?? Object.values(raw));
  return list.flatMap((p) => (p.storePrice ? [p.storePrice] : []));
}
/** The record's language: `lang`, else English (StorePrice.lang is stated only when the words are not English). */
const langOf = (sp: StorePriceRecord) => sp.lang ?? 'en';

function* pageFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pageFiles(path);
    else if (entry.name === 'page.tsx') yield path;
  }
}
function routes(region: string, under = ''): string[] {
  const app = join(APPS, region, 'src', 'app');
  return [...pageFiles(join(app, under))].map((f) => relative(app, f).split(sep).slice(0, -1).join('/'));
}

/** [region, route, page language]: every page whose language is not English. */
const NON_EN: Array<[string, string, string]> = [
  ...routes('latam').map((r): [string, string, string] => ['latam', r, 'es']),
  ...routes('us', 'es').map((r): [string, string, string] => ['us', r, 'es']),
  ...routes('ca', 'fr').map((r): [string, string, string] => ['ca', r, 'fr']),
  ...(['de', 'fr', 'pt'] as const).flatMap((l) => routes('eu', l).map((r): [string, string, string] => ['eu', r, l])),
];

type PageModule = {
  default: (props: object) => unknown;
  generateStaticParams?: () => Promise<Array<Record<string, string>>> | Array<Record<string, string>>;
};

afterEach(() => {
  vi.unstubAllEnvs();
});

/** Renders a region app page: a dynamic route once per static param. */
async function renderAll(region: string, route: string): Promise<Array<[string, string]>> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  const params = route.includes('[') ? await mod.generateStaticParams!() : [null];
  const out: Array<[string, string]> = [];
  for (const p of params) {
    const element = await mod.default(p ? { params: Promise.resolve(p) } : {});
    out.push([p ? `${route} ${JSON.stringify(p)}` : route, renderToStaticMarkup(element as ReactElement)]);
  }
  return out;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

interface Occurrence { pack: string; lang: string; wrapperLang: string | null; whole: boolean; context: string }
/**
 * Every visible occurrence of a store pack text (scripts dropped; a shorter
 * pack inside a longer one counts once): the `lang` of the element it sits in
 * and whether it is that element's whole content.
 */
function packOccurrences(html: string, records: StorePriceRecord[]): Occurrence[] {
  const body = html.replace(/<script\b[\s\S]*?<\/script>/g, (m) => ' '.repeat(m.length));
  const packs = [...new Map(records.map((sp) => [sp.pack, langOf(sp)])).entries()].sort((a, b) => b[0].length - a[0].length);
  const taken: Array<[number, number]> = [];
  const found: Occurrence[] = [];
  for (const [pack, lang] of packs) {
    const needle = escapeHtml(pack);
    for (let i = body.indexOf(needle); i >= 0; i = body.indexOf(needle, i + 1)) {
      const end = i + needle.length;
      if (taken.some(([a, b]) => i >= a && end <= b)) continue;
      taken.push([i, end]);
      const open = /<(\w+)\b([^>]*)>$/.exec(body.slice(Math.max(0, i - 300), i));
      const wrapperLang = open ? (/\blang="([^"]+)"/.exec(open[2])?.[1] ?? null) : null;
      const whole = Boolean(open) && body.startsWith(`</${open![1]}>`, end);
      found.push({ pack, lang, wrapperLang, whole, context: body.slice(Math.max(0, i - 90), end + 10) });
    }
  }
  return found;
}

describe('store pack text carries its language on every non-English page (WCAG 3.1.2)', () => {
  test('the scan is non-empty: LATAM, US /es/, CA /fr/, EU /de/ /fr/ /pt/', () => {
    expect(NON_EN.length).toBeGreaterThanOrEqual(30);
    expect(new Set(NON_EN.map(([r, , l]) => `${r}:${l}`))).toEqual(new Set(['latam:es', 'us:es', 'ca:fr', 'eu:de', 'eu:fr', 'eu:pt']));
  });

  let total = 0;
  test.each(NON_EN)('%s /%s (%s)', async (region, route, pageLang) => {
    const records = storePrices(region);
    for (const [name, html] of await renderAll(region, route)) {
      for (const o of packOccurrences(html, records)) {
        total += 1;
        // Words in the page's own language need no mark; any other language, an element of their own with it.
        const want = o.lang === pageLang ? null : o.lang;
        const ok = want === null ? o.wrapperLang === null : o.whole && o.wrapperLang === want;
        expect(ok, `${name}: "${o.pack}" should ${want ? `sit alone in an element with lang="${want}"` : 'carry no lang'}: …${o.context}`).toBe(true);
      }
    }
  });

  test('pack texts were found on those pages (the check above ran on real occurrences)', () => {
    // ComparisonTable on the 7 localized table pages, PricingTab, Comparator, BestOf, Listicle and more on LATAM.
    expect(total).toBeGreaterThanOrEqual(50);
  });
});

describe('pages in the pack text language mark nothing; other-language packs stay marked', () => {
  test('US /nootropic-comparison/ and a review (en): English packs carry no lang', async () => {
    const records = storePrices('us');
    const pages = [...(await renderAll('us', 'nootropic-comparison')), ...(await renderAll('us', '[slug]')).filter(([n]) => n.includes('qualia-mind-review'))];
    const occ = pages.flatMap(([, html]) => packOccurrences(html, records));
    expect(occ.length).toBeGreaterThan(0);
    for (const o of occ) expect(o.wrapperLang, `${o.pack}: …${o.context}`).toBeNull();
  });

  test('JP (English host): the Japanese store words carry lang="ja"', async () => {
    const records = storePrices('jp');
    const [[, html]] = (await renderAll('jp', '[slug]')).filter(([n]) => n.includes('"fancl-brains-review"'));
    const ja = packOccurrences(html, records).filter((o) => o.lang === 'ja');
    expect(ja.length).toBeGreaterThan(0);
    for (const o of ja) expect(o.wrapperLang, `…${o.context}`).toBe('ja');
  });
});
