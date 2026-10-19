import { afterEach, describe, test, expect, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsLatam,
  allProductsUS,
  buildRegionSearchContext,
  ingredients,
  ingredientsEs,
  ingredientSourceFields,
  localizeIngredient,
  localizedIngredients,
  TRANSLATED_INGREDIENT_FIELDS,
  type Ingredient,
  type IngredientTranslation,
} from '@nootropic/data';

// LATAM Spanish ingredient pages (2026-10-13, backlog content:jp-latam-bodies-phase2).
// ingredients-es.ts translates the prose of every ingredients.ts record; these
// guards keep that translation complete, faithful on numbers, Spanish, and in
// step with the English it was translated from, and check the LATAM pages
// render it.

const bySlug = new Map(ingredientsEs.map((t) => [t.slug, t]));
const pairs = ingredients.map((en) => ({ en, es: bySlug.get(en.slug) }));

type Prose = Pick<Ingredient | IngredientTranslation, (typeof TRANSLATED_INGREDIENT_FIELDS)[number]>;

/** Every translated string of a record with a stable path (same paths for English and Spanish). */
function proseFields(r: Prose): Array<[path: string, text: string]> {
  const h = r.howToTake;
  return [
    ['name', r.name],
    ['mechanism', r.mechanism],
    ['clinicalDose', r.clinicalDose],
    ['timeToEffect', r.timeToEffect],
    ['studySummary', r.studySummary],
    ...r.benefits.map((b, i): [string, string] => [`benefits[${i}]`, b]),
    ...r.sideEffects.map((s, i): [string, string] => [`sideEffects[${i}]`, s]),
    ...r.humanEffects.flatMap((e, i): Array<[string, string]> => [
      [`humanEffects[${i}].effect`, e.effect],
      [`humanEffects[${i}].notes`, e.notes],
    ]),
    ['howToTake.dosage', h.dosage],
    ['howToTake.timing', h.timing],
    ['howToTake.withFood', h.withFood],
    ...(h.cycling !== undefined ? [['howToTake.cycling', h.cycling] as [string, string]] : []),
    ['howToTake.forms', h.forms],
    ...r.stacksWith.flatMap((p, i): Array<[string, string]> => [
      [`stacksWith[${i}].ingredient`, p.ingredient],
      [`stacksWith[${i}].reason`, p.reason],
    ]),
    ...r.faqs.flatMap((f, i): Array<[string, string]> => [
      [`faqs[${i}].question`, f.question],
      [`faqs[${i}].answer`, f.answer],
    ]),
  ];
}

/** Name fields: not sentences, so exempt from the Spanish-marker check. */
const isNameField = (path: string) => path === 'name' || /^stacksWith\[\d+\]\.ingredient$/.test(path);

/**
 * Names the Spanish keeps exactly as in English. The rule (spec 2026-10-13): a
 * Spanish common name only where the LATAM pages already use one; these have
 * none there. Any other name field must differ from the English.
 */
const NAMES_KEPT_IN_ENGLISH = new Set([
  'Bacopa Monnieri',
  'Rhodiola Rosea',
  'Ashwagandha',
  'Ashwagandha (KSM-66)',
  'Ginkgo Biloba',
  'DHA (Omega-3)',
  'Omega-3 (DHA)',
  'Acetyl-L-Carnitine (ALCAR)',
  'Lutemax 2020',
  'Oat Straw Extract',
  'Zynamite',
  'Zynamite (Mangifera indica)',
  'Dynamine (Methylliberine)',
  'Curcumin (Longvida)',
  'Magnesium',
  'Tart Cherry (Montmorency)',
  'Tart Cherry',
  'L-Tryptophan',
  'Nicotinamide Riboside (NR)',
  'Lemon Balm (Melissa officinalis)',
]);

/**
 * Canonical numbers of a text, sorted. A separator followed by groups of exactly
 * three digits after a non-zero integer part is a thousands separator
 * ("1,168", "1.168"); any other single separator is the decimal mark ("1.8",
 * "1,8"). The same rule runs on both languages, so either convention passes
 * and a dropped or changed number fails.
 */
function numbers(text: string): string[] {
  return (text.match(/\d+(?:[.,]\d+)*/g) ?? [])
    .map((tok) => {
      const parts = tok.split(/[.,]/);
      if (parts.length === 1) return String(Number(tok));
      const grouped = parts[0] !== '0' && parts[0].length <= 3 && parts.slice(1).every((p) => p.length === 3);
      if (grouped) return String(Number(parts.join('')));
      if (parts.length === 2) return String(Number(`${parts[0]}.${parts[1]}`));
      return tok;
    })
    .sort();
}

// Spanish markers: accents/ñ/¿¡ or a common Spanish function word or unit.
const SPANISH = /[áéíóúñü¿¡]|\b(el|la|los|las|lo|de|del|que|para|por|con|sin|un|una|unos|unas|es|son|en|y|o|al|se|su|sus|no|ni|pero|como|entre|tras|sobre|poco|muy|cuando|este|esta|estos|estas|minutos|horas|semanas|meses|dosis)\b/i;
// English function words that never belong in Spanish prose (quoted label text excepted).
const ENGLISH = /\b(the|and|with|which|that|this|these|of|for|from|after|before|only|than|not)\b/i;
const unquoted = (s: string) => s.replace(/"[^"]*"/g, ' ');

const sha12 = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 12);

describe('ingredients-es: coverage', () => {
  test('inputs are non-empty (fail closed)', () => {
    expect(ingredients.length).toBeGreaterThanOrEqual(20);
    expect(ingredientsEs.length).toBeGreaterThanOrEqual(1);
  });

  test('every ingredients.ts slug has exactly one Spanish entry, and every entry an English record', () => {
    const missing = ingredients.filter((i) => !bySlug.has(i.slug)).map((i) => i.slug);
    const extra = ingredientsEs.filter((t) => !ingredients.some((i) => i.slug === t.slug)).map((t) => t.slug);
    const slugs = ingredientsEs.map((t) => t.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect({ missing, extra, dupes }).toEqual({ missing: [], extra: [], dupes: [] });
  });

  test.each(pairs.map((p) => [p.en.slug, p]))('%s: lists match the English and no field is empty', (_slug, { en, es }) => {
    expect(es, `${en.slug}: no Spanish entry`).toBeDefined();
    const problems: string[] = [];
    for (const k of ['benefits', 'sideEffects', 'humanEffects', 'stacksWith', 'faqs'] as const) {
      if (es![k].length !== en[k].length) problems.push(`${k}: ${es![k].length} Spanish vs ${en[k].length} English`);
    }
    if ((es!.howToTake.cycling === undefined) !== (en.howToTake.cycling === undefined)) problems.push('howToTake.cycling present in one language only');
    for (const [path, text] of proseFields(es!)) if (typeof text !== 'string' || !text.trim()) problems.push(`${path}: empty`);
    expect(problems).toEqual([]);
  });
});

describe('ingredients-es: faithful numbers', () => {
  test.each(pairs.map((p) => [p.en.slug, p]))('%s: each field has the same numbers as the English', (_slug, { en, es }) => {
    expect(es).toBeDefined();
    const esFields = new Map(proseFields(es!));
    const problems: string[] = [];
    for (const [path, enText] of proseFields(en)) {
      const esText = esFields.get(path);
      if (esText === undefined) continue; // coverage reports it
      const a = numbers(enText);
      const b = numbers(esText);
      if (a.join(' ') !== b.join(' ')) problems.push(`${path}: English [${a.join(' ')}] vs Spanish [${b.join(' ')}]`);
    }
    expect(problems).toEqual([]);
  });
});

describe('ingredients-es: Spanish, not English', () => {
  test.each(pairs.map((p) => [p.en.slug, p]))('%s: every field is translated', (_slug, { en, es }) => {
    expect(es).toBeDefined();
    const enFields = new Map(proseFields(en));
    const problems: string[] = [];
    for (const [path, text] of proseFields(es!)) {
      const enText = enFields.get(path);
      if (isNameField(path)) {
        if (text === enText && !NAMES_KEPT_IN_ENGLISH.has(text)) problems.push(`${path}: "${text}" is the English name and is not on the kept-name list`);
        continue;
      }
      if (text === enText) problems.push(`${path}: identical to the English`);
      // Marker words do not fit 2–3 word labels ("Bien tolerada"); those still
      // must differ from the English and carry no English function word.
      if (text.trim().split(/\s+/).length >= 4 && !SPANISH.test(text)) problems.push(`${path}: no Spanish marker`);
      const english = ENGLISH.exec(unquoted(text));
      if (english) problems.push(`${path}: English word "${english[0]}"`);
    }
    expect(problems).toEqual([]);
  });

  test('the kept-name list only holds names some record actually keeps', () => {
    const kept = new Set(ingredientsEs.flatMap((t) => [t.name, ...t.stacksWith.map((p) => p.ingredient)]));
    expect([...NAMES_KEPT_IN_ENGLISH].filter((n) => !kept.has(n))).toEqual([]);
  });
});

describe('ingredients-es: staleness', () => {
  test.each(pairs.map((p) => [p.en.slug, p]))('%s: translated from the current English', (_slug, { en, es }) => {
    expect(es).toBeDefined();
    const src = ingredientSourceFields(en);
    const stale = TRANSLATED_INGREDIENT_FIELDS.filter((f) => es!.sourceHashes[f] !== sha12(src[f])).map(
      (f) => `${en.slug}: ${f} changed in ingredients.ts since it was translated — re-translate ${f} in ingredients-es.ts, then set sourceHashes.${f} to '${sha12(src[f])}'`,
    );
    expect(stale).toEqual([]);
  });
});

describe('localizeIngredient / localizedIngredients', () => {
  test('Spanish prose, English-sourced structure, English order', () => {
    const es = localizedIngredients('es');
    expect(es.map((i) => i.slug)).toEqual(ingredients.map((i) => i.slug));
    for (const [i, loc] of es.entries()) {
      const en = ingredients[i];
      const t = bySlug.get(en.slug)!;
      expect(loc.category).toBe(en.category);
      expect(loc.productsContaining).toEqual(en.productsContaining);
      expect(loc.sources).toEqual(en.sources);
      expect(loc.evidenceReviewedAt).toBe(en.evidenceReviewedAt);
      expect(loc.humanEffects.map(({ evidenceStrength, magnitude, studies }) => ({ evidenceStrength, magnitude, studies }))).toEqual(
        en.humanEffects.map(({ evidenceStrength, magnitude, studies }) => ({ evidenceStrength, magnitude, studies })),
      );
      expect(loc.stacksWith.map((p) => p.slug)).toEqual(en.stacksWith.map((p) => p.slug));
      expect(ingredientSourceFields(loc)).toEqual(ingredientSourceFields(t));
    }
  });

  test('a record without a translation fails closed', () => {
    expect(() => localizeIngredient({ ...ingredients[0], slug: 'no-translation-yet' }, 'es')).toThrow(/no es translation/);
  });

  test('the LATAM search index lists Spanish ingredient names and doses; the US /es/ index is unchanged', () => {
    const latam = buildRegionSearchContext(allProductsLatam, 'es', 'latam').searchItems.filter((s) => s.type === 'ingredient');
    expect(latam.map((s) => s.title)).toEqual(localizedIngredients('es').map((i) => i.name));
    for (const [i, item] of latam.entries()) expect(item.description).toContain(localizedIngredients('es')[i].clinicalDose);
    const usEs = buildRegionSearchContext(allProductsUS, 'es', 'us').searchItems.filter((s) => s.type === 'ingredient');
    expect(usEs.map((s) => s.title)).toEqual(ingredients.map((i) => i.name));
  });
});

// ── Render: the real LATAM ingredient pages ───────────────────────────────────

afterEach(() => {
  vi.unstubAllEnvs();
});

type PageModule = {
  default: (props: object) => unknown;
  metadata?: { title?: unknown; description?: unknown };
  generateMetadata?: (props: object) => Promise<{ title?: unknown; description?: unknown }>;
};
const APPS = join(new URL('.', import.meta.url).pathname, '..', '..', '..', 'apps');

async function loadLatamPage(route: string): Promise<PageModule> {
  vi.stubEnv('NEXT_PUBLIC_REGION', 'latam');
  return (await import(/* @vite-ignore */ join(APPS, 'latam', 'src', 'app', route, 'page.tsx'))) as PageModule;
}
const decode = (html: string) =>
  html.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

describe('LATAM ingredient pages render the Spanish text', () => {
  test('/ingredients/zynamite/ (detail page and its metadata)', async () => {
    const mod = await loadLatamPage('ingredients/[ingredient]');
    const props = { params: Promise.resolve({ ingredient: 'zynamite' }) };
    const html = decode(renderToStaticMarkup((await mod.default(props)) as ReactElement));
    const en = ingredients.find((i) => i.slug === 'zynamite')!;
    const es = localizeIngredient(en, 'es');
    for (const s of [es.mechanism, es.studySummary, es.clinicalDose, es.howToTake.withFood, es.faqs[0].question, es.humanEffects[0].notes, es.sideEffects[0]]) {
      expect(html).toContain(s);
    }
    for (const s of [en.mechanism, en.studySummary, en.howToTake.withFood, en.faqs[0].question]) expect(html).not.toContain(s);
    const meta = await mod.generateMetadata!(props);
    expect(String(meta.description)).toContain(es.clinicalDose);
    expect(String(meta.description)).not.toContain(en.clinicalDose);
  });

  test('/ingredients/ (index): every row in Spanish, no English summary, Spanish metadata', async () => {
    const mod = await loadLatamPage('ingredients');
    const html = decode(renderToStaticMarkup((await mod.default({})) as ReactElement));
    const es = localizedIngredients('es');
    for (const [i, loc] of es.entries()) {
      expect(html).toContain(loc.studySummary);
      expect(html).toContain(loc.clinicalDose);
      expect(html).toContain(`${loc.mechanism.split('.')[0]}.`);
      expect(html).not.toContain(ingredients[i].studySummary);
    }
    expect(String(mod.metadata?.title)).toMatch(/ingredientes/i);
    expect(String(mod.metadata?.description)).not.toMatch(/\b(the|and|which)\b/i);
  });
});
