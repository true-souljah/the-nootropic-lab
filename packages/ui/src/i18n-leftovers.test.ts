import { describe, test, expect, vi, afterEach } from 'vitest';
import { join } from 'node:path';
import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsLatam,
  buildRegionSearchContext,
  buildSearchIndex,
  getStrings,
  ingredients,
  latamCountries,
  localizedIngredients,
  type Locale,
} from '@nootropic/data';
import { tpl } from './templateStrings';

// 2026-10-15, the localized-chrome leftovers (BACKLOG
// i18n:comparison-table-localized-strings and PR #395's LATAM leftovers):
// (1) the CA /fr/ and EU /de/ /fr/ /pt/ pages render ComparisonTable with their
// locale bundle (headers, sort controls, units, buttons, mobile labels, the EU
// storefront badge and its tooltip); (2) on LATAM, the search index's category
// word, the country names and the ingredient pages' JSON-LD are Spanish. The
// built-output gate for (1) is scripts/check-built-table-locale.ts.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const TRANSLATED: Locale[] = ['es', 'fr', 'pt', 'de', 'fr-CA'];

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/** Visible text and accessible names: tags stripped, scripts and styles dropped. */
function visible(html: string): string {
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/g, ' ');
  const attrs = [...body.matchAll(/\b(?:aria-label|alt|title|placeholder)="([^"]*)"/g)].map((m) => m[1]);
  return `${body.replace(/<[^>]+>/g, ' ')} ${attrs.join(' ')}`.replace(/\s+/g, ' ');
}

/** Visible text nodes and accessible-name values, one per element, whitespace-collapsed. */
function segments(html: string): string[] {
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ');
  const attrs = [...body.matchAll(/\b(?:aria-label|alt|title|placeholder)="([^"]*)"/g)].map((m) => m[1]);
  return [...body.split(/<[^>]+>/), ...attrs].map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

/** Every leaf string under `value`, keyed by its dotted path. */
function leaves(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
}

afterEach(() => {
  vi.unstubAllEnvs();
});

type PageModule = { default: (props: object) => unknown };
const APPS = join(__dirname, '..', '..', '..', 'apps');

/**
 * Renders a region app page (apps/<region>/src/app/<route>/page.tsx). The path
 * is built at runtime so `tsc -p packages/ui` does not pull app files into its
 * program; vitest.config.ts resolves each app's `@/…` imports.
 */
async function renderPage(region: 'ca' | 'eu' | 'latam' | 'us', route: string, props: object = {}): Promise<string> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  const element = await mod.default(props);
  return text(renderToStaticMarkup(element as ReactElement));
}

// ── The strings this change added ─────────────────────────────────────────────

function newLeaves(locale: Locale): Map<string, string> {
  const s = getStrings(locale);
  return new Map([
    ['table.euStorefrontNote', s.table.euStorefrontNote],
    ...leaves(s.ingredientDetail.schema, 'ingredientDetail.schema'),
  ]);
}
const PLACEHOLDERS: Record<string, string[]> = {
  'ingredientDetail.schema.headline': ['{name}'],
  'ingredientDetail.schema.datasetName': ['{name}'],
  'ingredientDetail.schema.datasetDescription': ['{name}', '{date}'],
  'ingredientDetail.schema.effect': ['{effect}', '{strength}', '{studies}', '{magnitude}', '{notes}'],
  'ingredientDetail.schema.effectNoStudies': ['{effect}', '{strength}', '{magnitude}', '{notes}'],
  'ingredientDetail.schema.studiesMany': ['{n}'],
};
const enLeaves = newLeaves('en');

describe('new strings (2026-10-15): every locale, every key', () => {
  test('the scan is non-empty: 15 new strings in en', () => {
    // euStorefrontNote + headline, datasetName, datasetDescription, 3 keywords, effect, effectNoStudies, studiesOne, studiesMany, 4 magnitudes
    expect(enLeaves.size).toBe(15);
  });

  test.each(ALL_LOCALES)('%s has every key, non-empty', (locale) => {
    const own = newLeaves(locale);
    expect([...own.keys()].sort()).toEqual([...enLeaves.keys()].sort());
    for (const [path, value] of own) expect(value.trim(), `${locale} ${path} is empty`).not.toBe('');
  });

  test.each(ALL_LOCALES)('%s keeps the placeholders and adds none', (locale) => {
    for (const [path, value] of newLeaves(locale)) {
      const allowed = PLACEHOLDERS[path] ?? [];
      for (const token of allowed) expect(value, `${locale} ${path} keeps ${token}`).toContain(token);
      for (const token of value.match(/\{\w+\}/g) ?? []) expect(allowed, `${locale} ${path}: unknown placeholder ${token}`).toContain(token);
    }
  });

  test.each(TRANSLATED)('%s strings differ from en', (locale) => {
    for (const [path, value] of newLeaves(locale)) expect(value, `${locale} ${path} is the English copy`).not.toBe(enLeaves.get(path));
  });

  test('ja carries the English text: Japanese copy is paused (owner decision 2026-10-13) and no host renders ja', () => {
    for (const [path, value] of newLeaves('ja')) expect(value, `ja ${path}`).toBe(enLeaves.get(path));
  });

  test('en keeps the text the template wrote before (English JSON-LD and badge unchanged)', () => {
    const s = getStrings('en');
    const k = s.ingredientDetail.schema;
    expect(s.table.euStorefrontNote).toBe('Sold through a dedicated EU storefront priced in EUR. We do not verify regulatory compliance per product.');
    expect(s.productDetail.regionalBuying.licence.euStorefront).toBe('EU storefront');
    expect(tpl(k.headline, { name: 'Ashwagandha' })).toBe('Ashwagandha — Nootropic Ingredient Guide');
    expect(tpl(k.datasetName, { name: 'Ashwagandha' })).toBe('Ashwagandha — Human Clinical Effect Matrix');
    expect(tpl(k.effect, { effect: 'Memory', strength: 'moderate', studies: tpl(k.studiesMany, { n: 4 }), magnitude: 'small', notes: 'N.' })).toBe(
      'Memory: moderate evidence (4 cited studies), small effect size. N.',
    );
    expect(tpl(k.effect, { effect: 'Mood', strength: 'preliminary', studies: k.studiesOne, magnitude: 'negligible', notes: 'N.' })).toBe(
      'Mood: preliminary evidence (1 cited study), negligible effect size. N.',
    );
    for (const [key, value] of Object.entries(k.magnitude)) expect(value).toBe(key);
    for (const [key, value] of Object.entries(s.ingredientDetail.evidenceStrength)) expect(value).toBe(key);
    for (const [key, value] of Object.entries(s.ingredientDetail.relatedCategory)) expect(value).toBe(key);
  });
});

// ── (1) ComparisonTable on the CA /fr/ and EU /de/ /fr/ /pt/ pages ────────────

const TABLE_PAGES: Array<[region: 'ca' | 'eu', route: string, locale: Locale]> = [
  ['ca', 'fr/comparer', 'fr-CA'],
  ['ca', 'fr/meilleurs-nootropiques', 'fr-CA'],
  ['eu', 'de/beste-nootropika', 'de'],
  ['eu', 'fr/meilleurs-nootropiques', 'fr'],
  ['eu', 'pt/melhores-nootropicos', 'pt'],
];

/** English the table printed on those pages before 2026-10-15 (labels, units, fallbacks). */
const ENGLISH_TABLE = [
  'Best For',
  'Caffeine-Free',
  'Caffeine-free',
  'Money-Back',
  'Money-back',
  'Check Price →',
  'Check Current Price →',
  "Editor's Choice",
  'EU Storefront',
  'EU storefront',
  'EU Status',
  'Sort by',
  'tap or hover for breakdown',
  'Sold through a dedicated EU storefront',
  'No purchase link',
  'English version:',
];

describe('ComparisonTable renders in the page language on the CA and EU locale pages', () => {
  test.each(TABLE_PAGES)('%s /%s/ (%s)', async (region, route, locale) => {
    const html = await renderPage(region, route);
    // The table rendered: its active sort control (the scan is non-empty).
    expect(html).toMatch(/<button[^>]*>▼<\/button>/);
    const s = getStrings(locale);
    const t = s.table;
    const pd = s.productDetail;
    const segs = segments(html);
    for (const label of [
      t.product,
      t.bestFor,
      t.score,
      t.price,
      t.caffeineFree,
      t.moneyBack,
      t.actions,
      t.checkPrice,
      t.editorChoice,
      t.euStorefront,
      tpl(t.sortAriaActive, { column: t.sortColumns.score, direction: t.descending }),
      tpl(t.sortAria, { column: t.sortColumns.moneyBack }),
      tpl(t.sortAria, { column: t.sortColumns.trustpilot }),
      ...(region === 'eu' ? [t.euStatus, pd.regionalBuying.licence.euStorefront, t.euStorefrontNote] : []),
    ]) {
      expect(segs, `${region}/${route}: "${label}"`).toContain(label);
    }
    expect(segs.some((x) => x.includes(`/${pd.stats.monthUnit}`)), `${route}: /${pd.stats.monthUnit}`).toBe(true);
    const shown = visible(html);
    for (const phrase of ENGLISH_TABLE) expect(shown, `${region}/${route} shows "${phrase}"`).not.toContain(phrase);
    expect(shown).not.toMatch(/\/mo\b/);
    expect(shown).not.toMatch(/\b\d+ days\b/);
  });
});

// ── (2a) Search index: the ingredient category word ───────────────────────────

describe('search index: ingredient results name their category in the page language', () => {
  const RAW_CATEGORY = /^(adaptogen|cholinergic|mushroom|amino|herb|vitamin) — /;

  test('LATAM (es): every ingredient result starts with the Spanish category word', () => {
    const { searchItems } = buildRegionSearchContext(allProductsLatam, 'es', 'latam');
    const results = searchItems.filter((i) => i.type === 'ingredient');
    expect(results).toHaveLength(ingredients.length);
    const words = getStrings('es').ingredientDetail.relatedCategory;
    for (const item of results) {
      const ing = ingredients.find((i) => `/ingredients/${i.slug}/` === item.href)!;
      expect(item.description, item.href).toMatch(new RegExp(`^${words[ing.category]} — `));
      expect(item.description, item.href).not.toMatch(RAW_CATEGORY);
    }
    expect(results.find((i) => i.href === '/ingredients/lions-mane/')!.description).toMatch(/^hongo — /);
  });

  test.each(TRANSLATED)('%s bundle: the category word comes from the bundle', (locale) => {
    const words = getStrings(locale).ingredientDetail.relatedCategory;
    const results = buildSearchIndex([], ingredients, [], getStrings(locale)).filter((i) => i.type === 'ingredient');
    expect(results).toHaveLength(ingredients.length);
    for (const [i, item] of results.entries()) expect(item.description).toBe(`${words[ingredients[i].category]} — ${ingredients[i].clinicalDose}`);
  });

  test('en (with and without the bundle) keeps the record value', () => {
    for (const strings of [getStrings('en'), undefined]) {
      const results = buildSearchIndex([], ingredients, [], strings).filter((i) => i.type === 'ingredient');
      expect(results).toHaveLength(ingredients.length);
      for (const [i, item] of results.entries()) expect(item.description).toBe(`${ingredients[i].category} — ${ingredients[i].clinicalDose}`);
    }
  });
});

// ── (2b) LATAM country names ──────────────────────────────────────────────────

describe('LATAM country names are Spanish', () => {
  const SPANISH = { MX: 'México', BR: 'Brasil', AR: 'Argentina', CO: 'Colombia', CL: 'Chile', PE: 'Perú' };
  /** A text node or accessible name that is only an English country or language name. */
  const ENGLISH_NAME = /^(Mexico|Brazil|Peru|Spanish|Portuguese)$/;

  test('the records: names and languages', () => {
    expect(Object.fromEntries(latamCountries.map((c) => [c.code, c.name]))).toEqual(SPANISH);
    expect(Object.fromEntries(latamCountries.map((c) => [c.code, c.language]))).toEqual({
      MX: 'español',
      BR: 'portugués',
      AR: 'español',
      CO: 'español',
      CL: 'español',
      PE: 'español',
    });
  });

  test('home and /countries/ link every country by its Spanish name', async () => {
    for (const route of ['', 'countries']) {
      const html = await renderPage('latam', route);
      const segs = segments(html);
      for (const name of Object.values(SPANISH)) expect(segs, `/${route}: ${name}`).toContain(name);
      expect(segs.filter((x) => ENGLISH_NAME.test(x)), `/${route}`).toEqual([]);
    }
  });

  test('a country page (/countries/brazil/): breadcrumb, headings and language in Spanish', async () => {
    const html = await renderPage('latam', 'countries/[country]', { params: Promise.resolve({ country: 'brazil' }) });
    const shown = visible(html);
    for (const s of ['Los Mejores Nootrópicos en Brasil', 'Envío a Brasil', 'Mejores Opciones para Compradores en Brasil', 'Idioma: portugués']) {
      expect(shown).toContain(s);
    }
    expect(segments(html).filter((x) => ENGLISH_NAME.test(x))).toEqual([]);
    expect(shown).not.toMatch(/en Brazil|a Brazil|Idioma: Portuguese/);
  });

  test('an ingredient page\'s "Guías por país" links use the Spanish names', async () => {
    const html = await renderPage('latam', 'ingredients/[ingredient]', { params: Promise.resolve({ ingredient: 'ashwagandha' }) });
    const segs = segments(html);
    for (const name of ['México', 'Brasil', 'Perú']) expect(segs).toContain(name);
    expect(segs.filter((x) => ENGLISH_NAME.test(x))).toEqual([]);
  });
});

// ── (2c) LATAM ingredient pages: JSON-LD ──────────────────────────────────────

type Json = Record<string, unknown>;
function jsonLd(html: string): Json[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]) as Json);
}
const byType = (blocks: Json[], type: string) => blocks.find((b) => b['@type'] === type) as Json & Record<string, any>;

/** Every string value in the blocks, keyed by its path. */
function jsonStrings(value: unknown, path = ''): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => jsonStrings(v, path ? `${path}.${k}` : k));
  return [];
}
/** Values that are not words for readers: URLs, dates, schema types, the evidence enum, organization names. */
const NOT_PROSE = /(^|\.)(@context|@type|url|item|contentUrl|license|encodingFormat|additionalType|datePublished|dateModified)$/;
const ORGANIZATIONS = new Set(['The Nootropic Lab', 'The Nootropic Lab Editorial Team']);
/** The English words the template wrote into the JSON-LD before 2026-10-15. */
const ENGLISH_SCHEMA = /Nootropic Ingredient Guide|Human Clinical Effect Matrix|Structured human-clinical-trial|evidence|effect size|cited stud|^Home$|^Ingredients$|^nootropic$|cognitive supplement|clinical trial|^(adaptogen|cholinergic|mushroom|amino|herb|vitamin)$/;

describe('LATAM ingredient pages write their JSON-LD in Spanish', () => {
  const es = getStrings('es');
  const k = es.ingredientDetail.schema;

  test.each(['ashwagandha', 'lions-mane', 'bacopa-monnieri'])('/ingredients/%s/', async (slug) => {
    const ing = localizedIngredients('es').find((i) => i.slug === slug)!;
    const html = await renderPage('latam', 'ingredients/[ingredient]', { params: Promise.resolve({ ingredient: slug }) });
    const blocks = jsonLd(html);
    const article = byType(blocks, 'Article');
    const dataset = byType(blocks, 'Dataset');
    const crumbs = byType(blocks, 'BreadcrumbList');
    expect(article.headline).toBe(tpl(k.headline, { name: ing.name }));
    expect(article.description).toBe(ing.studySummary);
    expect(dataset.name).toBe(tpl(k.datasetName, { name: ing.name }));
    expect(dataset.description).toBe(tpl(k.datasetDescription, { name: ing.name, date: ing.evidenceReviewedAt }));
    expect(dataset.keywords).toEqual([
      ing.name,
      es.ingredientDetail.relatedCategory[ing.category],
      k.keywords.nootropic,
      k.keywords.cognitiveSupplement,
      k.keywords.clinicalTrial,
    ]);
    expect(dataset.variableMeasured.length).toBeGreaterThan(0);
    expect(dataset.variableMeasured).toHaveLength(ing.humanEffects.length);
    for (const [i, e] of ing.humanEffects.entries()) {
      const v = dataset.variableMeasured[i];
      expect(v.name).toBe(e.effect);
      expect(v.description).toBe(
        tpl(e.studies !== undefined ? k.effect : k.effectNoStudies, {
          effect: e.effect,
          strength: es.ingredientDetail.evidenceStrength[e.evidenceStrength],
          studies: e.studies === 1 ? k.studiesOne : tpl(k.studiesMany, { n: e.studies ?? 0 }),
          magnitude: k.magnitude[e.magnitude],
          notes: e.notes,
        }),
      );
      expect(v.description).toContain('evidencia');
    }
    expect(crumbs.itemListElement.map((c: Json) => c.name)).toEqual([es.breadcrumb.home, es.breadcrumb.ingredients, ing.name]);
    const prose = jsonStrings(blocks).filter(([path, value]) => !NOT_PROSE.test(path) && !ORGANIZATIONS.has(value));
    expect(prose.length).toBeGreaterThan(10);
    for (const [path, value] of prose) expect(value, `${slug} ${path}`).not.toMatch(ENGLISH_SCHEMA);
  });

  test('US ingredient page: the English JSON-LD is unchanged', async () => {
    const ing = ingredients.find((i) => i.slug === 'bacopa-monnieri')!;
    const html = await renderPage('us', 'ingredients/[ingredient]', { params: Promise.resolve({ ingredient: ing.slug }) });
    const blocks = jsonLd(html);
    const article = byType(blocks, 'Article');
    const dataset = byType(blocks, 'Dataset');
    const crumbs = byType(blocks, 'BreadcrumbList');
    expect(article.headline).toBe(`${ing.name} — Nootropic Ingredient Guide`);
    expect(article.reviewedBy.name).toBe('The Nootropic Lab Editorial Team');
    expect(dataset.name).toBe(`${ing.name} — Human Clinical Effect Matrix`);
    expect(dataset.description).toBe(
      `Structured human-clinical-trial evidence summary for ${ing.name}: per-effect evidence strength, magnitude, and study count. Sourced from the PubMed-indexed studies listed in the page's Sources section (evidence reviewed ${ing.evidenceReviewedAt}).`,
    );
    expect(dataset.keywords).toEqual([ing.name, ing.category, 'nootropic', 'cognitive supplement', 'clinical trial']);
    expect(dataset.variableMeasured.map((v: Json) => v.description)).toEqual(
      ing.humanEffects.map(
        (e) =>
          `${e.effect}: ${e.evidenceStrength} evidence${e.studies !== undefined ? ` (${e.studies} cited ${e.studies === 1 ? 'study' : 'studies'})` : ''}, ${e.magnitude} effect size. ${e.notes}`,
      ),
    );
    expect(crumbs.itemListElement.map((c: Json) => c.name)).toEqual(['Home', 'Ingredients', ing.name]);
  });
});
