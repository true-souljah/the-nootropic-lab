import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';

// Unsupported trust-claim guard (2026-10-07).
//
// The site owner confirmed that no product has been tested hands-on, that
// the site publishes under "The Nootropic Lab editorial team" (Organization
// authorship, no named people, no named author bylines), and that no
// editor credentials can be evidenced. The site DOES compare each
// product's ingredient doses with clinical-trial doses; that may be
// described, but never as "testing" the products.
//
// This test scans every .ts/.tsx/.json source file under apps/*/src,
// packages/ui/src and packages/data/src and fails if any banned phrase
// reappears in any locale. Matching is case-insensitive. This file is
// excluded from the scan because it has to spell the phrases out.
//
// Fail-closed: an empty or truncated file list (broken path, renamed
// directory) must fail, not pass silently — see the scanned-files asserts.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const SELF = resolve(dirname(new URL(import.meta.url).pathname), 'trust-claims.test.ts');

const BANNED_PHRASES = [
  // Hands-on testing (no evidence exists for any product)
  'handsOnTested',
  'hands-on tested',
  'hands-on testing',
  'Testé en main',
  'Testé en pratique',
  'Probado en persona',
  'Testado pessoalmente',
  'Praxistest',
  '実機テスト',
  // "Tested" claims in titles, hero lines and links
  'Expert-Tested',
  'Getestet',
  'We test every',
  'ingredient dose tested against',
  'unserem Test des',
  // Named-author / anonymity claims (Organization authorship only)
  'No anonymous',
  'named author byline',
  'Meet the editor',
  'Conoce al editor',
  'auteurs anonymes',
  'autores anónimos',
  'firmas anónimas',
  'firma de un autor con nombre',
  // Editor credentials that cannot be evidenced
  'backgrounds in pharmacology',
  // Invented operator entity: the site is not run by a company (LATAM about/contact said
  // "operado por <strong></strong>, una sociedad alemana de responsabilidad limitada")
  'sociedad alemana',
  'responsabilidad limitada',
  'operado por <strong></strong>',
  'operado por .',
  'Kulik Media',
  'FintechPays',
  // Blanket shipping/regulatory guarantees with no evidence behind them (owner
  // decision 2026-10-08). Per-product statements backed by vendor terms stay.
  'shipping verified',
  'shipping confirmed',
  'Shipping confirmed to',
  'All products listed',
  'Livraison au Canada vérifiée',
  'livraison au Canada confirmée',
  'Tous les produits listés',
  'sont expédiés directement au Canada',
  'Envío a Latam verificado',
  'Todos los productos se envían',
  'Verificamos el estado regulatorio',
];

const SOURCE_EXT = /\.(ts|tsx|json)$/;
const SKIP_DIRS = new Set(['node_modules', '.next', 'out']);
const MIN_FILES_PER_ROOT = 20;
const MIN_FILES_TOTAL = 350;

function walk(dir: string, acc: string[]): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (SOURCE_EXT.test(entry.name) && p !== SELF) acc.push(p);
  }
  return acc;
}

const appsDir = resolve(REPO_ROOT, 'apps');
const scanRoots = [
  ...readdirSync(appsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(resolve(appsDir, e.name, 'src')))
    .map((e) => resolve(appsDir, e.name, 'src')),
  resolve(REPO_ROOT, 'packages/ui/src'),
  resolve(REPO_ROOT, 'packages/data/src'),
];
const filesByRoot = new Map(scanRoots.map((root) => [root, walk(root, [])]));
const allFiles = [...filesByRoot.values()].flat();

describe('unsupported trust claims — scan coverage (fail closed)', () => {
  test('all 8 region apps plus packages/ui and packages/data are scanned', () => {
    const rel = scanRoots.map((r) => relative(REPO_ROOT, r)).sort();
    expect(rel).toEqual(
      [
        'apps/au/src',
        'apps/ca/src',
        'apps/eu/src',
        'apps/gcc/src',
        'apps/jp/src',
        'apps/latam/src',
        'apps/sea/src',
        'apps/us/src',
        'packages/data/src',
        'packages/ui/src',
      ].sort(),
    );
  });

  test.each(scanRoots.map((r) => [relative(REPO_ROOT, r), r]))(
    '%s contributes a non-trivial number of source files',
    (_label, root) => {
      expect((filesByRoot.get(root) ?? []).length).toBeGreaterThanOrEqual(MIN_FILES_PER_ROOT);
    },
  );

  test(`scanned file list is non-empty and above ${MIN_FILES_TOTAL}`, () => {
    expect(allFiles.length).toBeGreaterThanOrEqual(MIN_FILES_TOTAL);
    expect(allFiles).not.toContain(SELF);
  });
});

describe('unsupported trust claims — banned phrases', () => {
  const sources = allFiles.map((file) => ({
    file: relative(REPO_ROOT, file),
    lines: readFileSync(file, 'utf8').toLowerCase().split('\n'),
  }));

  test.each(BANNED_PHRASES)('no source file contains "%s"', (phrase) => {
    const needle = phrase.toLowerCase();
    const hits: string[] = [];
    for (const { file, lines } of sources) {
      lines.forEach((line, i) => {
        if (line.includes(needle)) hits.push(`${file}:${i + 1}`);
      });
    }
    expect(hits, `banned trust claim "${phrase}" found at:\n${hits.join('\n')}`).toEqual([]);
  });
});
