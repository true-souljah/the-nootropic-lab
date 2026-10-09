import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';

// Text-contrast class guard (2026-10-09).
//
// Tailwind's light grays fail WCAG 1.4.3 as text on the site's white and
// near-white surfaces: gray-400 (#99a1af) is 2.6:1 on white, gray-300
// (#d1d5dc) about 1.5:1. They were the "N min read" labels on every guides
// page, the rank numbers on every regional geo page, JP subtitles and the
// search dialog's hints (axe color-contrast, 6 nodes on US /guides/ alone).
// Muted text uses the `ds-muted` token instead (#666F7F, documented in
// styles/tokens.css). This scans every .tsx under apps/*/src and
// packages/ui/src and fails if a banned class reappears.
//
// Fail-closed: an empty or truncated file list must fail, not pass.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');

/**
 * Text and placeholder colours below 3:1 on white: too light even for large text.
 * (Text on the dark sidebar uses the ds-side-* tokens, not palette grays.)
 */
const BANNED_CLASS = /(?<![\w-])(?:placeholder:)?(?:text|placeholder)-(?:gray|slate|zinc|neutral|stone)-(?:300|400)(?![\w-])/g;

const SKIP_DIRS = new Set(['node_modules', '.next', 'out']);
const MIN_FILES_PER_ROOT = 10;
const MIN_FILES_TOTAL = 250;

function walk(dir: string, acc: string[]): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) acc.push(p);
  }
  return acc;
}

const appsDir = resolve(REPO_ROOT, 'apps');
const scanRoots = [
  ...readdirSync(appsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(resolve(appsDir, e.name, 'src')))
    .map((e) => resolve(appsDir, e.name, 'src')),
  resolve(REPO_ROOT, 'packages/ui/src'),
];
const filesByRoot = new Map(scanRoots.map((root) => [root, walk(root, [])]));
const allFiles = [...filesByRoot.values()].flat();

describe('text-contrast classes — scan coverage (fail closed)', () => {
  test('all 8 region apps plus packages/ui are scanned', () => {
    expect(scanRoots.map((r) => relative(REPO_ROOT, r)).sort()).toEqual(
      ['apps/au/src', 'apps/ca/src', 'apps/eu/src', 'apps/gcc/src', 'apps/jp/src', 'apps/latam/src', 'apps/sea/src', 'apps/us/src', 'packages/ui/src'].sort(),
    );
  });

  test.each(scanRoots.map((r) => [relative(REPO_ROOT, r), r]))('%s has at least the minimum .tsx files', (_label, root) => {
    expect((filesByRoot.get(root) ?? []).length).toBeGreaterThanOrEqual(MIN_FILES_PER_ROOT);
  });

  test(`scanned file list is above ${MIN_FILES_TOTAL}`, () => {
    expect(allFiles.length).toBeGreaterThanOrEqual(MIN_FILES_TOTAL);
  });
});

describe('text-contrast classes — no light-gray text', () => {
  test('the pattern catches the classes it bans (and leaves the token alone)', () => {
    const sample = 'text-gray-400 text-gray-300 placeholder-gray-400 placeholder:text-gray-400 text-slate-300 text-ds-muted text-gray-500 hover:text-gray-600 bg-gray-100';
    expect(sample.match(BANNED_CLASS)).toEqual(['text-gray-400', 'text-gray-300', 'placeholder-gray-400', 'placeholder:text-gray-400', 'text-slate-300']);
  });

  test('no .tsx source uses a text colour below 3:1 on white (use text-ds-muted)', () => {
    const hits: string[] = [];
    for (const file of allFiles) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const m of line.matchAll(BANNED_CLASS)) hits.push(`${relative(REPO_ROOT, file)}:${i + 1} ${m[0]}`);
        });
    }
    expect(hits, `light-gray text classes fail WCAG 1.4.3 on white — use text-ds-muted:\n${hits.join('\n')}`).toEqual([]);
  });
});
