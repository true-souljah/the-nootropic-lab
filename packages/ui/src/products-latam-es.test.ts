import { afterEach, describe, test, expect, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsLatam,
  productsLatam,
  dosingTally,
  getStrings,
  latamCountries,
  latamProductTranslationsEs,
  latamProductSourceFields,
  latamTranslationFields,
  latamTranslationShapeProblems,
  localizeProductLatam,
  localizedAllProductsLatam,
  localizedProductsLatam,
  TRANSLATED_LATAM_PRODUCT_FIELDS,
  type EditorialStandardsBody,
  type Locale,
  type Product,
  type TranslatedLatamProductField,
} from '@nootropic/data';

// LATAM Spanish product records (2026-10-19, backlog content:jp-latam-bodies-phase2).
// products-latam-es.ts translates the prose of every products-latam.json
// record; these guards keep the translation complete, faithful on numbers,
// Spanish, and in step with the English it was translated from, prove the data
// pipelines still read the English records, and check that the LATAM review,
// best-of, country, comparison and methodology pages render the Spanish.

const REPO = join(new URL('.', import.meta.url).pathname, '..', '..', '..');
const APPS = join(REPO, 'apps');
const DATA = join(REPO, 'packages', 'data', 'src');

const bySlug = new Map(latamProductTranslationsEs.map((t) => [t.slug, t]));
const pairs = allProductsLatam.map((en) => ({ en, es: bySlug.get(en.slug) }));

type Kind = 'prose' | 'name' | 'dose';

/** Every translated string of a record with a stable path (same paths for the English record and its translation). */
function proseFields(f: Record<TranslatedLatamProductField, unknown>): Array<[path: string, text: string, kind: Kind]> {
  const out: Array<[string, string, Kind]> = [];
  for (const field of TRANSLATED_LATAM_PRODUCT_FIELDS) {
    const v = f[field];
    if (v === null || v === undefined) continue;
    if (field === 'ingredientDosages') {
      (v as Array<[string, string]>).forEach(([name, dose], i) => {
        out.push([`ingredientDosages[${i}].name`, name, 'name']);
        out.push([`ingredientDosages[${i}].doseInProduct`, dose, 'dose']);
      });
    } else if (Array.isArray(v)) {
      const kind: Kind = field === 'bestFor' || field === 'heroIngredients' ? 'name' : 'prose';
      v.forEach((s, i) => out.push([`${field}[${i}]`, String(s), kind]));
    } else {
      out.push([field, String(v), 'prose']);
    }
  }
  return out;
}

/**
 * Names the Spanish keeps exactly as in English. The rule (products-latam-es.ts
 * header): an ingredient with a LATAM ingredient page is written as
 * ingredients-es.ts writes it (Bacopa Monnieri, Rhodiola Rosea, Ginkgo Biloba,
 * Ashwagandha, Acetyl-L-Carnitine, Oat Straw Extract and Dynamine stay
 * English there); brand, blend, formula and extract names and Latin binomials
 * stay; "Neurohackers" is the same word in Spanish. Any other name field must
 * differ from the English.
 */
const NAMES_KEPT_IN_ENGLISH = new Set([
  // heroIngredients
  'Bacopa Monnieri',
  'Rhodiola Rosea',
  'Rhodiola',
  'Ginkgo',
  'Ashwagandha',
  'Acetyl-L-Carnitine',
  'Dynamine',
  'Lutemax 2020',
  'Panax Ginseng',
  'VitaCholine',
  'Resveratrol',
  'Nutricog',
  // bestFor
  'Neurohackers',
  // ingredientDosages names
  'Acetyl-L-Carnitine HCl',
  'Bacopa Monnieri (Focus Blend)',
  'Oat Straw Extract (Flow Blend)',
  'Panax Ginseng (Clarity)',
  'Dynamine (methylliberine) (Motivation)',
  'Ashwagandha (Withania somnifera) (Stress Reset)',
  'Zembrin (Sceletium tortuosum) (Stress Reset)',
  'Bacopa Monnieri (Neuroprotection)',
  'Ginkgo Biloba (Neuroprotection)',
]);

/** A label amount with no words ("500mg", "2.5mcg", "333mcg DFE"): the same in both languages. */
const isAmountOnly = (s: string) =>
  s.split(/[\s()]+/).filter(Boolean).every((tok) => /^[\d.,:+/–-]*(mcg|mg|µg|g|DFE)?$/.test(tok));

/**
 * Canonical numbers of a text, sorted (the ingredients-es.test.ts rule). A
 * separator followed by groups of exactly three digits after a non-zero
 * integer part is a thousands separator; any other single separator is the
 * decimal mark. The same rule runs on both languages, so either convention
 * passes and a dropped or changed number fails.
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
const SPANISH = /[áéíóúñü¿¡]|\b(el|la|los|las|lo|de|del|que|para|por|con|sin|un|una|unos|unas|es|son|en|y|o|al|se|su|sus|no|ni|pero|como|entre|tras|sobre|muy|cuando|este|esta|estos|estas|días|semanas|meses|dosis)\b/i;
// English function words that never belong in Spanish prose (quoted names, URLs and the site's name excepted).
const ENGLISH = /\b(the|and|with|which|that|this|these|of|for|from|after|before|only|than|not)\b/i;
const unquoted = (s: string) =>
  s.replace(/"[^"]*"/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/The Nootropic Lab/g, ' ');

const sha12 = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 12);

describe('products-latam-es: coverage', () => {
  test('inputs are non-empty (fail closed)', () => {
    expect(allProductsLatam.length).toBeGreaterThanOrEqual(6);
    expect(latamProductTranslationsEs.length).toBeGreaterThanOrEqual(1);
  });

  test('every products-latam.json record has exactly one Spanish entry, and every entry an English record', () => {
    const missing = allProductsLatam.filter((p) => !bySlug.has(p.slug)).map((p) => p.slug);
    const extra = latamProductTranslationsEs.filter((t) => !allProductsLatam.some((p) => p.slug === t.slug)).map((t) => t.slug);
    const slugs = latamProductTranslationsEs.map((t) => t.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect({ missing, extra, dupes }).toEqual({ missing: [], extra: [], dupes: [] });
  });

  test.each(pairs.map((p) => [p.en.slug, p]))('%s: lists and optional fields match the English and no field is empty', (_slug, { en, es }) => {
    expect(es, `${en.slug}: no Spanish entry in products-latam-es.ts`).toBeDefined();
    const problems = latamTranslationShapeProblems(en, es!);
    for (const [path, text] of proseFields(latamTranslationFields(es!))) if (!text.trim()) problems.push(`${path}: empty`);
    expect(problems).toEqual([]);
  });
});

describe('products-latam-es: faithful numbers', () => {
  test.each(pairs.map((p) => [p.en.slug, p]))('%s: each field has the same numbers as the English', (_slug, { en, es }) => {
    expect(es).toBeDefined();
    const esFields = new Map(proseFields(latamTranslationFields(es!)).map(([path, text]) => [path, text]));
    const problems: string[] = [];
    for (const [path, enText] of proseFields(latamProductSourceFields(en))) {
      const esText = esFields.get(path);
      if (esText === undefined) continue; // coverage reports it
      const a = numbers(enText);
      const b = numbers(esText);
      if (a.join(' ') !== b.join(' ')) problems.push(`${path}: English [${a.join(' ')}] vs Spanish [${b.join(' ')}]`);
    }
    expect(problems).toEqual([]);
  });
});

describe('products-latam-es: Spanish, not English', () => {
  test.each(pairs.map((p) => [p.en.slug, p]))('%s: every field is translated', (_slug, { en, es }) => {
    expect(es).toBeDefined();
    const enFields = new Map(proseFields(latamProductSourceFields(en)).map(([path, text]) => [path, text]));
    const problems: string[] = [];
    for (const [path, text, kind] of proseFields(latamTranslationFields(es!))) {
      const enText = enFields.get(path);
      if (text === enText) {
        if (kind === 'name' && NAMES_KEPT_IN_ENGLISH.has(text)) continue;
        if (kind === 'dose' && isAmountOnly(text)) continue;
        problems.push(`${path}: identical to the English ("${text.slice(0, 60)}")${kind === 'name' ? ' and not on the kept-name list' : ''}`);
        continue;
      }
      // Marker words do not fit short labels ("Sin cafeína", "Taurina"); those
      // still must differ from the English and carry no English function word.
      if (kind === 'prose' && text.trim().split(/\s+/).length >= 4 && !SPANISH.test(text)) problems.push(`${path}: no Spanish marker`);
      const english = ENGLISH.exec(unquoted(text));
      if (english) problems.push(`${path}: English word "${english[0]}"`);
    }
    expect(problems).toEqual([]);
  });

  test('the kept-name list only holds names some record actually keeps', () => {
    const kept = new Set(
      pairs.flatMap(({ en, es }) =>
        proseFields(latamTranslationFields(es!))
          .filter(([path, text, kind]) => kind === 'name' && text === new Map(proseFields(latamProductSourceFields(en)).map(([p, t]) => [p, t])).get(path))
          .map(([, text]) => text),
      ),
    );
    expect([...NAMES_KEPT_IN_ENGLISH].filter((n) => !kept.has(n))).toEqual([]);
  });
});

describe('products-latam-es: staleness', () => {
  test.each(pairs.map((p) => [p.en.slug, p]))('%s: translated from the current English', (_slug, { en, es }) => {
    expect(es).toBeDefined();
    const src = latamProductSourceFields(en);
    const stale = TRANSLATED_LATAM_PRODUCT_FIELDS.filter((f) => es!.sourceHashes[f] !== sha12(src[f])).map(
      (f) =>
        `${en.slug}: ${f} changed in packages/data/src/products-latam.json since it was translated — re-translate ${f} of "${en.slug}" in packages/data/src/products-latam-es.ts from the current English record, then set sourceHashes.${f} to '${sha12(src[f])}'`,
    );
    expect(stale).toEqual([]);
  });
});

// ── The data pipelines keep reading the English records ──────────────────────

describe('English records stay the pipelines’ input', () => {
  test('allProductsLatam is products-latam.json as committed, with no display text', () => {
    const json = JSON.parse(readFileSync(join(DATA, 'products-latam.json'), 'utf8')) as Product[];
    expect(json.length).toBeGreaterThanOrEqual(6);
    expect(allProductsLatam).toEqual(json);
    expect(allProductsLatam.filter((p) => 'display' in p).map((p) => p.slug)).toEqual([]);
  });

  test('no products-*.json record carries `display` (it is set only by a translation overlay)', () => {
    const files = readdirSync(DATA).filter((f) => /^products-[a-z]+\.json$/.test(f));
    expect(files.length).toBe(8);
    const offenders = files.flatMap((f) =>
      (JSON.parse(readFileSync(join(DATA, f), 'utf8')) as Array<Record<string, unknown>>)
        .filter((p) => 'display' in p)
        .map((p) => `${f}: ${String(p.slug)}`),
    );
    expect(offenders).toEqual([]);
  });
});

describe('localizeProductLatam / localizedAllProductsLatam / localizedProductsLatam', () => {
  test('Spanish prose and display text; English-sourced data and keys; English order', () => {
    const loc = localizedAllProductsLatam('es');
    expect(loc.map((p) => p.slug)).toEqual(allProductsLatam.map((p) => p.slug));
    const strip = ({ summary: _a, whatItIs: _b, howItWorks: _c, whatToExpect: _d, pros: _e, cons: _f, notes: _g, importPathway: _h, regulatoryNote: _i, unscoredReason: _j, display: _k, discontinued, ...rest }: Product) => ({
      ...rest,
      discontinued: discontinued && { ...discontinued, note: undefined },
    });
    for (const [i, l] of loc.entries()) {
      const en = allProductsLatam[i];
      const t = bySlug.get(en.slug)!;
      expect(strip(l)).toEqual(strip(en));
      // The comparator's goal filter, dosing anchors, verdicts, tallies and the
      // hero-dose lookup read these: they stay English.
      expect(l.bestFor).toEqual(en.bestFor);
      expect(l.heroIngredients).toEqual(en.heroIngredients);
      expect(l.ingredientDosages).toEqual(en.ingredientDosages);
      expect(dosingTally(l)).toEqual(dosingTally(en));
      expect(l.display).toEqual({ bestFor: t.bestFor, heroIngredients: t.heroIngredients, ingredientDosages: t.ingredientDosages });
      expect({ summary: l.summary, whatItIs: l.whatItIs, howItWorks: l.howItWorks, whatToExpect: l.whatToExpect, pros: l.pros, cons: l.cons, notes: l.notes, importPathway: l.importPathway, regulatoryNote: l.regulatoryNote, unscoredReason: l.unscoredReason, discontinuedNote: l.discontinued?.note }).toEqual({
        summary: t.summary, whatItIs: t.whatItIs, howItWorks: t.howItWorks, whatToExpect: t.whatToExpect, pros: t.pros, cons: t.cons, notes: t.notes, importPathway: t.importPathway, regulatoryNote: t.regulatoryNote, unscoredReason: t.unscoredReason, discontinuedNote: t.discontinuedNote,
      });
    }
  });

  test('the recommendable list is productsLatam in Spanish (discontinued excluded, same order)', () => {
    expect(localizedProductsLatam('es').map((p) => p.slug)).toEqual(productsLatam.map((p) => p.slug));
  });

  test('a record without a translation fails closed', () => {
    expect(() => localizeProductLatam({ ...allProductsLatam[0], slug: 'no-translation-yet' }, 'es')).toThrow(/no es translation/);
  });

  test('a record whose English changed shape fails closed and says what to re-translate', () => {
    const en = allProductsLatam[0];
    expect(() => localizeProductLatam({ ...en, pros: [...en.pros, 'A new English pro'] }, 'es')).toThrow(
      new RegExp(`"${en.slug}".*no longer lines up.*pros: ${en.pros.length} translated vs ${en.pros.length + 1} English`),
    );
    expect(() => localizeProductLatam({ ...en, regulatoryNote: 'A new English note' }, 'es')).toThrow(/regulatoryNote: absent translated vs present English/);
    expect(() => localizeProductLatam({ ...en, ingredientDosages: en.ingredientDosages.slice(1) }, 'es')).toThrow(/ingredientDosages/);
  });
});

describe('LATAM country notes are Spanish', () => {
  test('every shippingNote', () => {
    expect(latamCountries.length).toBe(6);
    for (const c of latamCountries) {
      expect(SPANISH.test(c.shippingNote), `${c.code}: no Spanish marker`).toBe(true);
      expect(ENGLISH.exec(c.shippingNote)?.[0], `${c.code}: English word`).toBeUndefined();
    }
  });
});

// ── Methodology policy text (editorialStandards.body) ───────────────────────

function bodyLeaves(b: EditorialStandardsBody): Array<[string, string]> {
  return Object.entries(b).flatMap(([k, v]): Array<[string, string]> =>
    Array.isArray(v) ? v.map((s, i): [string, string] => [`${k}[${i}]`, s]) : [[k, v as string]],
  );
}

describe('editorial-standards policy text', () => {
  const en = getStrings('en').editorialStandards.body!;
  const es = getStrings('es').editorialStandards.body!;

  test('en and es carry it, with the same entries and placeholders', () => {
    expect(en).toBeDefined();
    expect(es).toBeDefined();
    const enLeaves = bodyLeaves(en);
    const esLeaves = new Map(bodyLeaves(es));
    expect(enLeaves.length).toBeGreaterThanOrEqual(20);
    expect([...esLeaves.keys()]).toEqual(enLeaves.map(([k]) => k));
    for (const [k, v] of enLeaves) {
      const tokens = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(' ');
      expect(tokens(esLeaves.get(k)!), k).toBe(tokens(v));
      expect(numbers(esLeaves.get(k)!).join(' '), `${k} numbers`).toBe(numbers(v).join(' '));
    }
  });

  test('es is Spanish: every entry differs from en, has a Spanish marker, and no English function word', () => {
    const enLeaves = new Map(bodyLeaves(en));
    const problems: string[] = [];
    for (const [k, v] of bodyLeaves(es)) {
      if (v === enLeaves.get(k)) problems.push(`${k}: identical to en`);
      if (v.split(/\s+/).length >= 4 && !SPANISH.test(v)) problems.push(`${k}: no Spanish marker`);
      const english = ENGLISH.exec(unquoted(v));
      if (english) problems.push(`${k}: English word "${english[0]}"`);
    }
    expect(problems).toEqual([]);
  });

  test('every app that renders the section uses a locale with its own policy text', () => {
    const apps = readdirSync(APPS).filter((a) => existsSync(join(APPS, a, 'src', 'app', 'methodology', 'page.tsx')));
    const rendering = apps.filter((a) => readFileSync(join(APPS, a, 'src', 'app', 'methodology', 'page.tsx'), 'utf8').includes('<EditorialStandardsSection'));
    expect(rendering.length).toBe(8);
    for (const app of rendering) {
      const search = readFileSync(join(APPS, app, 'src', 'lib', 'search.ts'), 'utf8');
      const locale = /buildRegionSearchContext\([^,]+,\s*'([\w-]+)'/.exec(search)?.[1] as Locale | undefined;
      expect(locale, `${app}: locale not found in src/lib/search.ts`).toBeDefined();
      expect(getStrings(locale!).editorialStandards.body, `${app} (${locale}) shows the section without its own policy text`).toBeDefined();
    }
  });
});

// ── Render: the real LATAM pages ─────────────────────────────────────────────

afterEach(() => {
  vi.unstubAllEnvs();
});

type PageModule = {
  default: (props: object) => unknown;
  metadata?: { title?: unknown; description?: unknown };
  generateMetadata?: (props: object) => Promise<{ title?: unknown; description?: unknown }>;
};

async function loadPage(region: string, route: string): Promise<PageModule> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
}
const decode = (html: string) =>
  html.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
async function render(region: string, route: string, props: object = {}): Promise<{ html: string; mod: PageModule }> {
  const mod = await loadPage(region, route);
  return { mod, html: decode(renderToStaticMarkup((await mod.default(props)) as ReactElement)) };
}

const translated = (en: Product) => localizeProductLatam(en, 'es');
const notesOf = (p: Product) => (p.notes === undefined ? [] : Array.isArray(p.notes) ? p.notes : [p.notes]);

describe('LATAM pages render the Spanish product records', () => {
  test.each(allProductsLatam.map((p) => [p.slug, p]))('review page /%s/: every tab, the "Buying in" block, metadata and JSON-LD', async (slug, en) => {
    const es = translated(en);
    const props = { params: Promise.resolve({ slug }) };
    const { html, mod } = await render('latam', '[slug]', props);
    const shown = [
      es.summary, es.whatItIs, es.howItWorks, es.whatToExpect,
      ...es.pros.slice(0, 3), ...es.cons.slice(0, 3),
      ...es.display!.heroIngredients.slice(0, 6),
      ...es.display!.ingredientDosages.flatMap((d) => [d.name, d.doseInProduct]),
      ...notesOf(es),
      ...(es.importPathway ? [es.importPathway] : []),
    ];
    expect(shown.filter((s) => !html.includes(s))).toEqual([]);
    // The vendor's own quotes stay verbatim (lang="en" blockquotes) and can
    // repeat a pro's words ("60-day money-back"); the check skips them.
    const ours = html.replace(/<blockquote\b[\s\S]*?<\/blockquote>/g, ' ');
    expect(html.match(/<blockquote\b/g)?.length ?? 0).toBeGreaterThanOrEqual(1);
    const english = [
      en.summary, en.whatItIs, en.howItWorks, en.whatToExpect,
      ...en.pros.slice(0, 3), ...en.cons.slice(0, 3),
      ...notesOf(en),
      ...(en.importPathway ? [en.importPathway] : []),
      ...en.ingredientDosages
        .map((d, i) => [d.name, es.display!.ingredientDosages[i].name])
        .filter(([e, s]) => e !== s && e.length >= 12)
        .map(([e]) => e),
    ];
    expect(english.filter((s) => ours.includes(s))).toEqual([]);
    const meta = await mod.generateMetadata!(props);
    expect(String(meta.title)).toBe(`Reseña de ${en.name} ${new Date().getFullYear()}: puntuación independiente y auditoría de ingredientes`);
    expect(String(meta.description)).toMatch(/^Reseña independiente de /);
    expect(html).toContain(`"reviewBody":${JSON.stringify(es.summary)}`);
  });

  test('a review page shows the Spanish dose for a hero ingredient (the lookup runs on the English names)', async () => {
    const en = allProductsLatam.find((p) => p.slug === 'thesis-nootropics-review')!;
    const { html } = await render('latam', '[slug]', { params: Promise.resolve({ slug: en.slug }) });
    expect(html).toMatch(/>Melena de León<\/span><span[^>]*>500mg por cápsula o por porción \(no se indica\)</);
  });

  test('/best-nootropics/: every card summary and tag in Spanish, no English summary', async () => {
    const { html } = await render('latam', 'best-nootropics');
    const loc = localizedProductsLatam('es');
    expect(loc.length).toBeGreaterThanOrEqual(5);
    for (const [i, p] of loc.entries()) {
      expect(html).toContain(p.summary);
      for (const tag of p.display!.bestFor.slice(0, 3)) expect(html).toContain(`>${tag}<`);
      expect(html).not.toContain(productsLatam[i].summary);
    }
  });

  test.each(latamCountries.map((c) => [c.slug]))('/countries/%s/: Spanish shipping note and pick summaries', async (country) => {
    const { html } = await render('latam', 'countries/[country]', { params: Promise.resolve({ country }) });
    const c = latamCountries.find((x) => x.slug === country)!;
    expect(html).toContain(c.shippingNote);
    expect(html).not.toContain('International supplement parcels');
    const top = localizedProductsLatam('es').sort((a, b) => b.score - a.score).slice(0, 3);
    for (const p of top) {
      expect(html).toContain(p.summary);
      expect(html).not.toContain(productsLatam.find((x) => x.slug === p.slug)!.summary);
    }
  });

  test('/nootropic-comparison/: Spanish tags in every row, Spanish metadata', async () => {
    const { html, mod } = await render('latam', 'nootropic-comparison');
    for (const p of localizedProductsLatam('es')) {
      expect(html).toContain(p.display!.bestFor.join(' · '));
      expect(html).not.toContain(p.bestFor.join(' · '));
    }
    expect(String(mod.metadata?.title)).toMatch(/^Comparador de Nootrópicos/);
    expect(String(mod.metadata?.description)).not.toMatch(ENGLISH);
  });

  test('/methodology/: the editorial-standards policy text in Spanish', async () => {
    const { html } = await render('latam', 'methodology');
    const es = getStrings('es').editorialStandards.body!;
    const en = getStrings('en').editorialStandards.body!;
    for (const s of [es.intro, es.reviewProtocol, ...es.conflictItems, es.conflictOutro, es.sourceCitation, es.correctionIntro, es.correctionItems[1], es.teamIdentity, es.regionalFraming, es.contactLead]) {
      expect(html).toContain(s);
    }
    expect(html).toContain('Las relaciones de afiliación <strong>no</strong> influyen en:');
    expect(html).toContain('El campo <code class="text-xs bg-gray-100 px-1 rounded">dateModified</code> del esquema Article');
    expect(html).toMatch(/consulta nuestro <a [^>]*href="\/imprint\/?"[^>]*>Aviso legal<\/a>\./);
    for (const s of [en.intro, en.reviewProtocol, en.conflictOutro, en.teamIdentity]) expect(html).not.toContain(s);
  });

  test('/methodology/ on an English host keeps the English policy text', async () => {
    const { html } = await render('us', 'methodology');
    const en = getStrings('en').editorialStandards.body!;
    for (const s of [en.intro, en.reviewProtocol, ...en.conflictItems, en.conflictOutro, en.sourceCitation, en.teamIdentity, en.regionalFraming, en.contactLead]) {
      expect(html).toContain(s);
    }
    expect(html).toContain('Affiliate relationships <strong>do not</strong> influence:');
    expect(html).toContain("The page's <code");
    expect(html).toMatch(/see our <a [^>]*href="\/imprint\/?"[^>]*>imprint<\/a>\./);
  });

  test('the LATAM search index lists the Spanish product summaries', async () => {
    vi.stubEnv('NEXT_PUBLIC_REGION', 'latam');
    const { searchItems } = (await import(/* @vite-ignore */ join(APPS, 'latam', 'src', 'lib', 'search.ts'))) as {
      searchItems: Array<{ type: string; href: string; description?: string }>;
    };
    const products = searchItems.filter((s) => s.type === 'product');
    expect(products.length).toBe(allProductsLatam.length);
    for (const item of products) {
      const en = allProductsLatam.find((p) => item.href === `/${p.slug}/`)!;
      expect(item.description).toBe(translated(en).summary.slice(0, 100));
    }
  });
});
