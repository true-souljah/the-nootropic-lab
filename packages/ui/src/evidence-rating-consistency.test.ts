import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname, relative } from 'node:path';
import { ingredients } from '@nootropic/data';

// Cross-page evidence ratings (2026-10-19, round twenty; idea from retro-panel
// finding B2-047). Pages quote our ingredient pages' grades in prose: "Our
// citicoline page rates its attention evidence as mixed", "Nuestra página
// sobre la citicolina califica como mixta su evidencia sobre la atención".
// Nothing tied those words to the humanEffects rows in ingredients.ts, so a
// re-grade or a renamed row (B2-030 renamed citicoline's 'Working Memory' row
// to 'Verbal Memory') could leave the prose stale. Every such sentence in
// apps/*/src and packages/data/src must now parse, map to one ingredient and
// one humanEffects row, and quote that row's evidenceStrength. A sentence in a
// new shape, or naming an ingredient or effect missing from the maps below,
// fails with its file:line until the map is extended.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const APPS_DIR = resolve(REPO_ROOT, 'apps');
const DATA_DIR = resolve(REPO_ROOT, 'packages/data/src');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.ts', '.tsx', '.json', '.md', '.mdx'].includes(extname(p))) out.push(p);
  }
  return out;
}

const SOURCES = [
  ...walk(DATA_DIR),
  ...readdirSync(APPS_DIR)
    .map(n => resolve(APPS_DIR, n, 'src'))
    .filter(p => existsSync(p))
    .flatMap(p => walk(p)),
];

// The name a sentence uses for the ingredient (lower-cased) -> slug.
const INGREDIENT_SLUGS: Record<string, string> = {
  citicoline: 'citicoline',
  citicolina: 'citicoline',
  rhodiola: 'rhodiola-rosea',
  dha: 'dha-omega-3',
  'l-theanine': 'l-theanine',
  'l-teanina': 'l-theanine',
};

// Per slug: the effect phrase a sentence uses (lower-cased, exact) -> the
// humanEffects row in ingredients.ts it quotes.
const EFFECT_ROWS: Record<string, Record<string, string>> = {
  citicoline: {
    attention: 'Attention & Focus',
    'la atención': 'Attention & Focus',
    'verbal-memory': 'Verbal Memory',
    'la memoria verbal': 'Verbal Memory',
  },
  'rhodiola-rosea': {
    'mental-fatigue': 'Mental Fatigue Reduction',
    'la fatiga mental': 'Mental Fatigue Reduction',
  },
  'dha-omega-3': {
    'age-related memory decline': 'Memory (Age-Related Decline)',
  },
  'l-theanine': {
    'calm-focus': 'Calm Focus (Alpha Waves)',
    'this alpha increase brings calm focus': 'Calm Focus (Alpha Waves)',
    'este aumento de las ondas alfa produzca un enfoque tranquilo': 'Calm Focus (Alpha Waves)',
  },
};

// Grade words as the sentences write them -> evidenceStrength.
const GRADES: Record<string, string> = {
  strong: 'strong',
  moderate: 'moderate',
  mixed: 'mixed',
  preliminary: 'preliminary',
  sólida: 'strong',
  moderada: 'moderate',
  mixta: 'mixed',
  preliminar: 'preliminary',
};

type Rating = { at: number; ingredient: string; effect: string; grade: string };

// Every whitespace run collapses to one space and string escapes (\' \")
// are undone, so a sentence wrapped across JSX lines or escaped inside a TS
// or JSON string reads as it renders. lineAt maps a flat index to its line.
function flatten(text: string): { flat: string; lineAt: (i: number) => number } {
  const out: string[] = [];
  const lines: number[] = [];
  let line = 1;
  let inSpace = false;
  for (let i = 0; i < text.length; i++) {
    let ch = text[i];
    if (ch === '\\' && (text[i + 1] === "'" || text[i + 1] === '"')) {
      ch = text[++i];
    }
    if (/\s/.test(ch)) {
      if (!inSpace) {
        out.push(' ');
        lines.push(line);
        inSpace = true;
      }
      if (ch === '\n') line++;
      continue;
    }
    inSpace = false;
    out.push(ch);
    lines.push(line);
  }
  return { flat: out.join(''), lineAt: i => lines[Math.min(i, lines.length - 1)] ?? 1 };
}

const EN_ANCHOR = /\b[Oo]ur ([A-Za-z][\w-]*) page (?:rates|grades) /g;
const EN_ANY = /\bpage (?:rates|grades)\b/gi;
const EN_FIRST = /^(?:its ([\w -]+?) evidence|the evidence (?:for|that) ([^.;:()]+?)) as (\w+)/;
const EN_NEXT = /^ and (?:its ([\w -]+?) evidence|the evidence (?:for|that) ([^.;:()]+?)) as (\w+)/;

const ES_ANCHOR = /\b[Nn]uestra página (?:sobre (?:la |el )?|de (?:la |el )?)([\wÁÉÍÓÚáéíóúñ-]+) califica /g;
const ES_ANY = /\bpágina\b[^.:;()]{0,40}?\bcalifica\b/gi;
const ES_FIRST = /^como (\p{L}+) (?:su evidencia sobre|la evidencia de que) ([^.:;,()]+?)(?= y como |[.:;,()]|$)/u;
const ES_NEXT = /^ y como (\p{L}+) (?:su evidencia sobre|la evidencia de que) ([^.:;,()]+?)(?= y como |[.:;,()]|$)/u;

// Returns the parsed ratings and the flat offsets of rating sentences that
// did not parse (an "Our X page rates ..." or "página ... califica" we cannot
// read is a failure, not a skip).
function extractRatings(flat: string): { ratings: Rating[]; unparsed: number[] } {
  const ratings: Rating[] = [];
  const parsedAt = new Set<number>();
  const unparsed: number[] = [];

  for (const m of flat.matchAll(EN_ANCHOR)) {
    const start = m.index!;
    let rest = flat.slice(start + m[0].length);
    let c = EN_FIRST.exec(rest);
    if (!c) continue;
    parsedAt.add(start + m[0].indexOf('page'));
    while (c) {
      ratings.push({ at: start, ingredient: m[1], effect: (c[1] ?? c[2]).trim(), grade: c[3] });
      rest = rest.slice(c[0].length);
      c = EN_NEXT.exec(rest);
    }
  }
  for (const m of flat.matchAll(EN_ANY)) if (!parsedAt.has(m.index!)) unparsed.push(m.index!);

  const esParsedAt = new Set<number>();
  for (const m of flat.matchAll(ES_ANCHOR)) {
    const start = m.index!;
    let rest = flat.slice(start + m[0].length);
    let c = ES_FIRST.exec(rest);
    if (!c) continue;
    esParsedAt.add(start + m[0].indexOf('página'));
    while (c) {
      ratings.push({ at: start, ingredient: m[1], effect: c[2].trim(), grade: c[1] });
      rest = rest.slice(c[0].length);
      c = ES_NEXT.exec(rest);
    }
  }
  for (const m of flat.matchAll(ES_ANY)) if (!esParsedAt.has(m.index!)) unparsed.push(m.index!);

  return { ratings, unparsed };
}

// Checks one rating against ingredients.ts; returns a problem or null.
function checkRating(r: Rating): string | null {
  const slug = INGREDIENT_SLUGS[r.ingredient.toLowerCase()];
  if (!slug) return `unmapped ingredient "${r.ingredient}"`;
  const rowName = EFFECT_ROWS[slug]?.[r.effect.toLowerCase()];
  if (!rowName) return `unmapped effect "${r.effect}" for ${slug}`;
  const ing = ingredients.find(i => i.slug === slug);
  if (!ing) return `no ingredient ${slug} in ingredients.ts`;
  const row = ing.humanEffects.find(e => e.effect === rowName);
  if (!row) return `no humanEffects row '${rowName}' on ${slug}`;
  const grade = GRADES[r.grade.toLowerCase()];
  if (!grade) return `unknown grade word "${r.grade}"`;
  if (grade !== row.evidenceStrength) {
    return `"${r.effect}" quoted as ${r.grade} (${grade}) but ${slug} '${rowName}' is ${row.evidenceStrength}`;
  }
  return null;
}

function problemsIn(text: string): string[] {
  const { flat } = flatten(text);
  const { ratings, unparsed } = extractRatings(flat);
  return [
    ...ratings.map(checkRating).filter((p): p is string => p !== null),
    ...unparsed.map(() => 'unparsed rating sentence'),
  ];
}

describe('cross-page evidence ratings quote the humanEffects rows in ingredients.ts', () => {
  test('the checker passes correct sentences and fails wrong grades, rows and shapes', () => {
    for (const ok of [
      'Our citicoline page rates its attention evidence as mixed: the Cochrane review found no attention benefit.',
      'Our citicoline page rates its attention evidence as mixed and its verbal-memory evidence as moderate (delayed recall improved, Spiers 1996).',
      'Open formula with 250mg Cognizin citicoline (our citicoline page rates its attention evidence as mixed).',
      'Our Rhodiola page rates its mental-fatigue evidence as mixed.',
      'our DHA page rates the evidence for age-related memory decline as moderate (Yurko-Mauro 2010).',
      'Our L-Theanine page rates the evidence that this alpha increase brings calm focus as preliminary (one small study).',
      'our L-Theanine page rates its calm-focus evidence as preliminary.',
      'Nuestra página sobre la citicolina califica como mixta su evidencia sobre la atención y como moderada su evidencia sobre la memoria verbal (Spiers 1996).',
      'Nuestra página de Rhodiola califica como mixta su evidencia sobre la fatiga mental.',
      'Nuestra página de L-Theanine califica como preliminar la evidencia de que este aumento de las ondas alfa produzca un enfoque tranquilo (un solo estudio).',
      "Our citicoline page rates its attention evidence as mixed: the trial we cite gave it with caffeine. Lion\\'s Mane is separate.",
    ]) expect(problemsIn(ok), ok).toEqual([]);
    for (const bad of [
      'Our citicoline page rates its attention evidence as moderate.',
      'Our citicoline page rates its attention evidence as mixed and its working-memory evidence as moderate.',
      'Our Rhodiola page rates its mental-fatigue evidence as strong.',
      'Our ginseng page rates its memory evidence as moderate.',
      'Our citicoline page rates attention as mixed.',
      'Nuestra página sobre la citicolina califica como moderada su evidencia sobre la atención.',
      'Nuestra página sobre la citicolina califica como mixta su evidencia sobre la atención y como moderada su evidencia sobre la memoria de trabajo.',
      'Nuestra página de Rhodiola califica la evidencia como mixta.',
    ]) expect(problemsIn(bad).length, bad).toBeGreaterThan(0);
  });

  test('every rating sentence in apps/*/src and packages/data/src matches its row', () => {
    const rel = SOURCES.map(f => relative(REPO_ROOT, f));
    for (const f of [
      'packages/data/src/guides.ts',
      'packages/data/src/guides-es.ts',
      'packages/data/src/products-us.json',
      'apps/us/src/app/best-nootropics-for-focus/page.tsx',
      'apps/latam/src/app/best-nootropics-for-studying/page.tsx',
      'apps/jp/src/app/best-nootropics-for-memory/page.tsx',
    ]) expect(rel, f).toContain(f);

    const problems: string[] = [];
    const found: string[] = [];
    for (const file of SOURCES) {
      const text = readFileSync(file, 'utf8');
      if (!/page (?:rates|grades)|califica/i.test(text)) continue;
      const { flat, lineAt } = flatten(text);
      const { ratings, unparsed } = extractRatings(flat);
      const where = (i: number) => `${relative(REPO_ROOT, file)}:${lineAt(i)}`;
      for (const r of ratings) {
        found.push(where(r.at));
        const p = checkRating(r);
        if (p) problems.push(`${where(r.at)}: ${p}`);
      }
      for (const i of unparsed) problems.push(`${where(i)}: unparsed rating sentence "${flat.slice(Math.max(0, i - 40), i + 80)}"`);
    }
    // Non-empty proof: the scan reached the sentences we know exist (each
    // region's focus and studying pages, the guides, the product records).
    expect(SOURCES.length).toBeGreaterThan(200);
    expect(found.length).toBeGreaterThanOrEqual(40);
    expect(new Set(found.map(w => w.split(':')[0])).size).toBeGreaterThanOrEqual(20);
    expect(problems).toEqual([]);
  });
});
