// Rewrites the stored `score` of every product record in
// packages/data/src/products-*.json to computeScore(scoreBreakdown)
// (packages/data/src/scoring.ts). Run with `npm run recompute-scores`.
//
// Only the score value text changes: the file is edited in place, line by
// line, so indentation, key order, number spellings elsewhere (e.g.
// `"trustpilotScore": 4.0`) and the presence/absence of a trailing newline are
// preserved byte for byte. Deterministic and idempotent — a second run
// rewrites nothing. Fails closed (exit 1) when a file's layout is not the one
// this script understands, instead of guessing.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { computeScore } from '../packages/data/src/scoring';
import type { Pillar } from '../packages/data/src/scoring';

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const DATA_DIR = resolve(__dirname, '../packages/data/src');

// A record-level score line: `<indent>"score": <number|null>,`
const SCORE_LINE = /^(?<indent>[ \t]*)"score": (?<value>-?\d+(?:\.\d+)?|null)(?<comma>,?)$/;

function fail(message: string): never {
  console.error(`FAIL recompute-scores: ${message}`);
  process.exit(1);
}

function detectIndent(text: string): string {
  // The first indented line of a top-level array of objects is the record's
  // opening brace; its indent is the file's indent unit.
  const match = /^\[\r?\n([ \t]+)\{/.exec(text);
  if (!match) fail('expected a top-level JSON array of objects');
  return match[1];
}

let totalRecords = 0;
let totalChanged = 0;
for (const region of REGIONS) {
  const file = resolve(DATA_DIR, `products-${region}.json`);
  const text = readFileSync(file, 'utf8');
  const records = JSON.parse(text) as Array<{ slug?: string; score?: unknown; scoreBreakdown?: Partial<Record<Pillar, number | null>> }>;
  if (!Array.isArray(records)) fail(`${file}: not a JSON array`);

  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(eol);
  const recordIndent = detectIndent(text).repeat(2);
  const scoreLineIndexes: number[] = [];
  lines.forEach((line, i) => {
    const m = SCORE_LINE.exec(line);
    if (m?.groups && m.groups.indent === recordIndent) scoreLineIndexes.push(i);
  });
  if (scoreLineIndexes.length !== records.length) {
    fail(`${file}: found ${scoreLineIndexes.length} record-level "score" lines for ${records.length} records`);
  }

  let changed = 0;
  records.forEach((record, i) => {
    const lineIndex = scoreLineIndexes[i];
    const groups = SCORE_LINE.exec(lines[lineIndex])!.groups!;
    const oldValue = groups.value === 'null' ? null : Number(groups.value);
    // The i-th score line must belong to the i-th record (guards against a
    // nested "score" key at record indent shifting the pairing).
    if (oldValue !== (record.score ?? null)) {
      fail(`${file}: line ${lineIndex + 1} holds ${groups.value} but record ${i} (${record.slug}) has score ${JSON.stringify(record.score)}`);
    }
    const next = computeScore(record.scoreBreakdown);
    if (oldValue === next) return; // numerically equal: keep the original spelling
    lines[lineIndex] = `${groups.indent}"score": ${JSON.stringify(next)}${groups.comma}`;
    console.log(`${region}/${record.slug}: ${JSON.stringify(oldValue)} -> ${JSON.stringify(next)}`);
    changed++;
  });

  if (changed > 0) {
    const out = lines.join(eol);
    // Self-check: the rewritten file parses and every record now holds its computed score.
    const reparsed = JSON.parse(out) as typeof records;
    reparsed.forEach((record, i) => {
      if (record.score !== computeScore(record.scoreBreakdown)) fail(`${file}: record ${i} still drifts after rewrite`);
    });
    writeFileSync(file, out);
  }
  console.log(`ok ${region}: ${records.length} records, ${changed} score(s) rewritten`);
  totalRecords += records.length;
  totalChanged += changed;
}
if (totalRecords === 0) fail('no records found');
console.log(`\n${totalChanged} of ${totalRecords} scores rewritten.`);
