// Rewrites the stored `score` of every product record in
// packages/data/src/products-*.json to weightedScore(scoreBreakdown)
// (packages/data/src/product-rules.ts): the PILLAR_WEIGHTS-weighted mean of
// the pillars, rounded to one decimal — the value `npm run validate-data`
// (scoreProblem) requires. Run with `npm run recompute-scores`.
//
// Only the score value text changes: each file is edited in place, line by
// line, so indentation, key order, number spellings elsewhere and the
// presence or absence of a trailing newline are preserved byte for byte.
// Deterministic and idempotent — a second run rewrites nothing. Fails closed
// (exit 1, nothing written) when a file's layout is not the one this script
// understands, instead of guessing.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { weightedScore } from '../packages/data/src/product-rules';
import type { Product } from '../packages/data/src/index';

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const DATA_DIR = resolve(__dirname, '../packages/data/src');

// A record-level score line: `<indent>"score": <number>,`
const SCORE_LINE = /^(?<indent>[ \t]*)"score": (?<value>-?\d+(?:\.\d+)?)(?<comma>,?)$/;

type ScoreRecord = Pick<Product, 'slug' | 'score' | 'scoreBreakdown'>;

function fail(message: string): never {
  console.error(`FAIL recompute-scores: ${message}`);
  process.exit(1);
}

function computed(file: string, record: ScoreRecord): number {
  const next = weightedScore(record.scoreBreakdown);
  if (!Number.isFinite(next)) fail(`${file}: ${record.slug} has no scored pillar (weightedScore = ${next})`);
  return next;
}

// Plan every file before writing any, so a layout failure leaves the data untouched.
const writes: Array<{ file: string; text: string }> = [];
let totalRecords = 0;
let totalChanged = 0;
for (const region of REGIONS) {
  const file = resolve(DATA_DIR, `products-${region}.json`);
  const text = readFileSync(file, 'utf8');
  const records = JSON.parse(text) as ScoreRecord[];
  if (!Array.isArray(records) || records.length === 0) fail(`${file}: not a non-empty JSON array`);

  // The first indented line of a top-level array of objects is a record's
  // opening brace; its indent is the file's indent unit, record keys sit at two.
  const indentUnit = /^\[\r?\n([ \t]+)\{/.exec(text)?.[1];
  if (!indentUnit) fail(`${file}: expected a top-level JSON array of objects`);
  const recordIndent = indentUnit.repeat(2);
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(eol);
  const scoreLineIndexes = lines.flatMap((line, i) => (SCORE_LINE.exec(line)?.groups?.indent === recordIndent ? [i] : []));
  if (scoreLineIndexes.length !== records.length) {
    fail(`${file}: found ${scoreLineIndexes.length} record-level "score" lines for ${records.length} records`);
  }

  let changed = 0;
  records.forEach((record, i) => {
    const lineIndex = scoreLineIndexes[i];
    const groups = SCORE_LINE.exec(lines[lineIndex])!.groups!;
    // The i-th score line must belong to the i-th record (guards against a
    // nested "score" key at record indent shifting the pairing).
    if (Number(groups.value) !== record.score) {
      fail(`${file}: line ${lineIndex + 1} holds ${groups.value} but record ${i} (${record.slug}) has score ${JSON.stringify(record.score)}`);
    }
    const next = computed(file, record);
    if (record.score === next) return; // numerically equal: keep the original spelling
    lines[lineIndex] = `${groups.indent}"score": ${JSON.stringify(next)}${groups.comma}`;
    console.log(`${region}/${record.slug}: ${record.score} -> ${next}`);
    changed++;
  });

  if (changed > 0) {
    const out = lines.join(eol);
    // Self-check: the rewritten file parses, keeps every other value, and
    // every record now holds its computed score.
    const reparsed = JSON.parse(out) as ScoreRecord[];
    reparsed.forEach((record, i) => {
      if (record.score !== computed(file, record)) fail(`${file}: record ${i} (${record.slug}) still drifts after rewrite`);
      if (JSON.stringify({ ...record, score: 0 }) !== JSON.stringify({ ...records[i], score: 0 })) {
        fail(`${file}: record ${i} (${record.slug}) changed outside "score"`);
      }
    });
    writes.push({ file, text: out });
  }
  console.log(`ok ${region}: ${records.length} records, ${changed} score(s) rewritten`);
  totalRecords += records.length;
  totalChanged += changed;
}

for (const { file, text } of writes) writeFileSync(file, text);
console.log(`\n${totalChanged} of ${totalRecords} scores rewritten.`);
