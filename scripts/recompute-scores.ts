// Writes the dosing formula (operator decision b → b1, 2026-10-09) into every
// product record in packages/data/src/products-*.json, in this order:
//   1. each ingredientDosages row's `clinicalDose` + `adequatelyDosed`
//      (dosing-anchors.ts expectedDosingRows: the anchor's string and
//      rowVerdict, or NO_REFERENCE_DOSE and null);
//   2. `scoreBreakdown.dosing` (product-rules.ts dosingScore: 10 × adequate ÷
//      anchored units, one decimal);
//   3. `score` (weightedScore: the PILLAR_WEIGHTS-weighted mean of the scored
//      pillars, one decimal).
// These are exactly the values `npm run validate-data` requires. Run with
// `npm run recompute-scores`; it prints every rewritten row and a per-record
// before → after table of dosing and score.
//
// Every products-*.json is JSON.stringify(data, null, 2) plus the file's own
// trailing-newline convention (us/eu/ca/au/sea end with "\n", jp/latam/gcc do
// not). The script asserts that round-trip before touching a file and writes
// the same serialisation back, so key order and every other value are
// preserved byte for byte, and it checks that nothing outside the three
// fields above changed. Deterministic and idempotent — a second run rewrites
// nothing. Fails closed (exit 1, nothing written) on a file that does not
// round-trip, a row matching two anchors, a null pillar without
// `unscoredReason` (that sentence is written by hand), or a result that the
// validate-data rules would reject.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dosingAnchorProblems, expectedDosingRows, matchingAnchors } from '../packages/data/src/dosing-anchors';
import { dosingScore, scoreProblem, weightedScore } from '../packages/data/src/product-rules';
import type { Product } from '../packages/data/src/index';

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const DATA_DIR = resolve(__dirname, '../packages/data/src');

function fail(message: string): never {
  console.error(`FAIL recompute-scores: ${message}`);
  process.exit(1);
}

const show = (value: unknown): string => (value === null ? 'null' : String(value));

/** A record with the three written fields blanked, to prove nothing else changed. */
function withoutFormulaFields(record: Product): string {
  return JSON.stringify({
    ...record,
    score: 0,
    scoreBreakdown: { ...record.scoreBreakdown, dosing: 0 },
    ingredientDosages: record.ingredientDosages.map((row) => ({ ...row, clinicalDose: '', adequatelyDosed: null })),
  });
}

// Plan every file before writing any, so a failure leaves the data untouched.
const writes: Array<{ file: string; text: string }> = [];
const rowChanges: string[] = [];
const table: string[][] = [];
const missingReasons: string[] = [];
const reasonsToReview: string[] = [];
let totalRecords = 0;
let changedRecords = 0;

for (const region of REGIONS) {
  const file = resolve(DATA_DIR, `products-${region}.json`);
  const text = readFileSync(file, 'utf8');
  const newline = text.endsWith('\n') ? '\n' : '';
  const records = JSON.parse(text) as Product[];
  if (!Array.isArray(records) || records.length === 0) fail(`${file}: not a non-empty JSON array`);
  if (JSON.stringify(records, null, 2) + newline !== text) {
    fail(`${file}: does not round-trip through JSON.stringify(data, null, 2) with its trailing newline; refusing to rewrite it`);
  }
  const original = JSON.parse(text) as Product[];

  for (const record of records) {
    const key = `${region}/${record.slug}`;
    const rows = Array.isArray(record.ingredientDosages) ? record.ingredientDosages : fail(`${key}: ingredientDosages is not an array`);
    for (const row of rows) {
      const anchors = matchingAnchors(row);
      if (anchors.length > 1) fail(`${key}: "${row.name}" matches more than one dosing anchor (${anchors.map((a) => a.ingredientSlug).join(', ')})`);
    }
    const before = { dosing: record.scoreBreakdown.dosing, score: record.score };

    // 1. Rows: the anchor's clinicalDose and verdict, or the no-reference pair.
    const expected = expectedDosingRows(record);
    rows.forEach((row, i) => {
      const next = expected[i];
      if (row.clinicalDose === next.clinicalDose && row.adequatelyDosed === next.adequatelyDosed) return;
      rowChanges.push(
        `${key} | ${row.name} | ${row.doseInProduct} | ${row.clinicalDose} -> ${next.clinicalDose} | ${show(row.adequatelyDosed)} -> ${show(next.adequatelyDosed)}`,
      );
      row.clinicalDose = next.clinicalDose;
      row.adequatelyDosed = next.adequatelyDosed;
    });

    // 2. The dosing pillar, then 3. the overall score.
    record.scoreBreakdown.dosing = dosingScore(record);
    const nullPillars = Object.entries(record.scoreBreakdown).filter(([, v]) => v === null).map(([k]) => k);
    if (nullPillars.length > 0 && !record.unscoredReason?.trim()) missingReasons.push(`${key} (${nullPillars.join(', ')} null)`);
    if (before.dosing === null && record.scoreBreakdown.dosing !== null && record.unscoredReason) {
      reasonsToReview.push(`${key}: dosing is scored now (${record.scoreBreakdown.dosing}) — check that unscoredReason explains only the pillars still null (${nullPillars.join(', ') || 'none'})`);
    }
    const score = weightedScore(record.scoreBreakdown);
    if (!Number.isFinite(score)) fail(`${key}: no scored pillar (weightedScore = ${score})`);
    record.score = score;

    const changed = before.dosing !== record.scoreBreakdown.dosing || before.score !== record.score;
    if (changed) changedRecords++;
    table.push([key, `${show(before.dosing)} -> ${show(record.scoreBreakdown.dosing)}`, `${show(before.score)} -> ${show(record.score)}`, changed ? '*' : '']);
  }

  // Self-check against the validate-data rules, and that only the formula fields moved.
  records.forEach((record, i) => {
    const key = `${region}/${record.slug}`;
    const problems = dosingAnchorProblems(record);
    if (problems.length > 0) fail(`${key}: still breaks the dosing rules after rewrite: ${problems.join(' | ')}`);
    const score = scoreProblem(record);
    // A missing unscoredReason is collected above and fails after the tables print.
    if (score && !missingReasons.some((entry) => entry.startsWith(`${key} `))) fail(`${key}: ${score}`);
    if (withoutFormulaFields(record) !== withoutFormulaFields(original[i])) fail(`${key}: changed outside the formula fields`);
  });

  const out = JSON.stringify(records, null, 2) + newline;
  if (out !== text) writes.push({ file, text: out });
  totalRecords += records.length;
}

console.log('Rows rewritten (record | row | dose | clinicalDose | adequatelyDosed):');
for (const line of rowChanges) console.log(`  ${line}`);
if (rowChanges.length === 0) console.log('  (none)');

const widths = [0, 1, 2].map((c) => Math.max(...[['record', 'dosing', 'score'][c], ...table.map((r) => r[c])].map((s) => s.length)));
const pad = (cells: string[]) => cells.map((cell, c) => (c < 3 ? cell.padEnd(widths[c]) : cell)).join('  ').trimEnd();
console.log(`\n${pad(['record', 'dosing', 'score', ''])}`);
for (const row of table) console.log(pad(row));

for (const line of reasonsToReview) console.log(`\nreview ${line}`);
if (missingReasons.length > 0) {
  fail(`a null pillar needs an unscoredReason, written by hand before re-running (nothing written): ${missingReasons.join('; ')}`);
}

for (const { file, text } of writes) writeFileSync(file, text);
console.log(
  `\n${changedRecords} of ${totalRecords} records changed dosing or score; ${rowChanges.length} rows rewritten; ${writes.length} file(s) written.`,
);
