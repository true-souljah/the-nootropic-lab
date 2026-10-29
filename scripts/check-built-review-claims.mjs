#!/usr/bin/env node
// Post-build review-claims gate (operator decision 2026-10-29, review-team-claims = A).
//
// Pages carried a "✓ Fact-checked" badge on every byline in 7 languages and an
// Article/Review JSON-LD `reviewedBy` naming the editorial team, although no one
// fact-checks or reviews pages separately from writing them. Both were removed
// (FPByline, packages/data i18n `byline.factChecked`, the templates and the
// regulatory pages). For every built page under apps/<region>/out/ this gate
// fails when:
//   - a badge or reviewer phrase from PHRASES appears (case-insensitive, with
//     HTML entities decoded and no-break spaces, dashes, soft hyphens and
//     zero-width spaces normalised, in
//     the raw HTML and with tags replaced by a space or removed, so markup cannot
//     split it, even inside a word);
//   - a JSON-LD `reviewedBy` or `medicalReviewer` (at any depth) is not a Person
//     whose name is in BACKED_REVIEWERS (empty), or a JSON-LD block does not parse;
//   - no built page was found (it refuses to pass when it scanned nothing).
// A real fact-checker or medical reviewer may come back only in the PR that
// publishes that person's name and credentials, adding them to BACKED_REVIEWERS.
//
//   node scripts/check-built-review-claims.mjs            # every region with an out/
//   node scripts/check-built-review-claims.mjs us jp      # only these regions
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const BACKED_REVIEWERS = [];

/** The removed badge in its 7 languages (with the ✓ that only the badge had) and the reviewer bylines. */
const PHRASES = [
  'fact-checked',
  '✓ datos verificados',
  '✓ vérifié',
  '✓ faits vérifiés',
  '✓ ファクトチェック済み',
  '✓ factos verificados',
  '✓ faktengeprüft',
  'medically reviewed by',
  'revisado médicamente por',
];

/** Named entities a renderer could use for the badge or the 7 languages' letters. */
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '\u00ad', check: '✓', checkmark: '✓',
  aacute: 'á', agrave: 'à', acirc: 'â', atilde: 'ã', auml: 'ä', ccedil: 'ç', eacute: 'é', egrave: 'è',
  ecirc: 'ê', iacute: 'í', ntilde: 'ñ', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö', uacute: 'ú',
  uuml: 'ü', szlig: 'ß',
};
const codePoint = (m, n) => (n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m);
const decodeEntities = (s) =>
  s
    .replace(/&#x([0-9a-f]+);?/gi, (m, h) => codePoint(m, parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (m, d) => codePoint(m, Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
/** Decode entities; drop soft hyphens and zero-width spaces; dashes and no-break spaces become
 *  spaces; whitespace runs collapse; lower-case. Applied to the page and to PHRASES alike. */
const normalise = (s) =>
  decodeEntities(s)
    .replace(/[\u00ad\u200b]/g, '')
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/[-\u2010-\u2013\u2212]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
const NEEDLES = PHRASES.map((p) => [p, normalise(p)]);

const JSONLD_RE =
  /<script\b[^>]*\btype\s*=\s*(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json(?=[\s>]))[^>]*>([\s\S]*?)<\/script\s*>/gi;

function reviewerProblems(node, path, out) {
  if (Array.isArray(node)) return node.forEach((n, i) => reviewerProblems(n, `${path}[${i}]`, out));
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if (k === 'reviewedBy' || k === 'medicalReviewer') {
      for (const r of [].concat(v)) {
        const backed = r && typeof r === 'object' && r['@type'] === 'Person' && BACKED_REVIEWERS.includes(r.name);
        if (!backed) out.push(`JSON-LD ${path}.${k}: ${JSON.stringify(r)} is not a backed Person`);
      }
    } else reviewerProblems(v, `${path}.${k}`, out);
  }
}

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlFiles(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const asked = process.argv.slice(2);
const regions = asked.length ? asked : REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out')));
const problems = [];
let pages = 0;
for (const region of regions) {
  const outDir = join(ROOT, 'apps', region, 'out');
  if (!existsSync(outDir)) {
    problems.push(`${region}: apps/${region}/out does not exist — build it first`);
    continue;
  }
  for (const f of htmlFiles(outDir)) {
    pages++;
    const html = readFileSync(f, 'utf8');
    const rel = relative(ROOT, f);
    const variants = [html, html.replace(/<[^>]*>/g, ' '), html.replace(/<[^>]*>/g, '')].map(normalise);
    for (const [phrase, needle] of NEEDLES) {
      const v = variants.find((x) => x.includes(needle));
      if (!v) continue;
      const i = v.indexOf(needle);
      problems.push(`${rel}: "${phrase}" — …${v.slice(Math.max(0, i - 60), i + needle.length + 60).trim()}…`);
    }
    for (const [, body] of html.matchAll(JSONLD_RE)) {
      let data;
      try {
        data = JSON.parse(body);
      } catch (err) {
        problems.push(`${rel}: JSON-LD block does not parse (fail closed): ${err.message}`);
        continue;
      }
      const out = [];
      reviewerProblems(data, '$', out);
      for (const o of out) problems.push(`${rel}: ${o}`);
    }
  }
}

if (pages === 0) problems.push('no built page found under apps/<region>/out — nothing was checked');
if (problems.length) {
  console.error(`✗ check-built-review-claims: ${problems.length} problem(s) across ${pages} pages (${regions.join(', ')})`);
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
  if (problems.length > 40) console.error(`  … +${problems.length - 40} more`);
  console.error('  No one fact-checks or reviews pages separately: credit "The Nootropic Lab editorial team" and drop the badge/reviewer.');
  process.exit(1);
}
console.log(`✓ check-built-review-claims: ${pages} pages in ${regions.length} region(s) (${regions.join(', ')}) — no fact-check badge, no reviewer byline, no unbacked reviewedBy/medicalReviewer`);
