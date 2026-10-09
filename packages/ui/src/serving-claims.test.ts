import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';

// Serving-size claim guard (2026-10-09).
//
// Copy on four pages (US beginner-stack guide, CA AOR-vs-Mind-Lab-Pro, EU
// BRAINEFFECT-vs-Mind-Lab-Pro, AU best-for-aging FAQ) said a multi-ingredient
// formula delivered its ingredients "in one capsule". Every product it described
// takes 2+ capsules per serving according to its own record
// (`capsulesPerServing`). Say "in one formula" or "per serving" instead.
//
// Rule: a source file that names a product whose records ALL have
// capsulesPerServing > 1 must not contain a "in one capsule" phrasing.
// Products recorded as 1 capsule in any region are left out (the phrase can
// be true for them), so the check never fires on a correct statement about a
// single-capsule product unless the same file also names a multi-capsule one.
//
// Fail-closed: the product list and the scanned file list must be non-empty.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const DATA = resolve(REPO_ROOT, 'packages/data/src');
const ONE_CAPSULE = /\bin (?:just |a single |one )capsule\b|\ball[- ]in[- ]one capsule\b/i;

type Rec = { name: string; capsulesPerServing?: number | null };
const counts = new Map<string, { multi: number; single: number }>();
const productFiles = readdirSync(DATA).filter((f) => /^products-[a-z]+\.json$/.test(f));
for (const f of productFiles) {
  const raw = JSON.parse(readFileSync(join(DATA, f), 'utf8')) as Rec[] | { products: Rec[] };
  const recs = Array.isArray(raw) ? raw : raw.products;
  for (const r of recs) {
    if (typeof r.capsulesPerServing !== 'number') continue;
    const c = counts.get(r.name) ?? { multi: 0, single: 0 };
    if (r.capsulesPerServing > 1) c.multi += 1;
    else c.single += 1;
    counts.set(r.name, c);
  }
}
const multiCapsuleNames = [...counts].filter(([, c]) => c.multi > 0 && c.single === 0).map(([n]) => n);

const SOURCE_EXT = /\.(ts|tsx|json)$/;
const SKIP_DIRS = new Set(['node_modules', '.next', 'out']);
function walk(dir: string, acc: string[]): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (SOURCE_EXT.test(entry.name)) acc.push(p);
  }
  return acc;
}
const appsDir = resolve(REPO_ROOT, 'apps');
const roots = [
  ...readdirSync(appsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(resolve(appsDir, e.name, 'src')))
    .map((e) => resolve(appsDir, e.name, 'src')),
  DATA,
];
const files = roots.flatMap((r) => walk(r, []));

describe('serving-size claims', () => {
  test('inputs are non-empty (fail closed)', () => {
    expect(productFiles.length).toBe(8);
    expect(multiCapsuleNames).toContain('Mind Lab Pro');
    expect(files.length).toBeGreaterThan(300);
  });

  test('no "in one capsule" claim in a file that names a multi-capsule product', () => {
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      const named = multiCapsuleNames.filter((n) => text.includes(n));
      if (!named.length) continue;
      text.split('\n').forEach((line, i) => {
        if (ONE_CAPSULE.test(line)) hits.push(`${relative(REPO_ROOT, file)}:${i + 1} (file names ${named.join(', ')})`);
      });
    }
    expect(hits, `"in one capsule" next to multi-capsule products — use "in one formula":\n${hits.join('\n')}`).toEqual([]);
  });
});
