import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Operator decision 2026-10-08: Eu Yan Sang BrainMAX+ stays reviewed but is not a
// best-of pick. Its key ingredient, Cera-Q, has one citable 3-week trial by
// maker-affiliated authors, and Korea's MFDS revoked its functional-ingredient
// recognition in 2017 after its supporting study was retracted (see #309).

const REPO = join(__dirname, '..', '..', '..');
const listiclePages = readdirSync(join(REPO, 'apps'))
  .flatMap((app) => {
    const dir = join(REPO, 'apps', app, 'src', 'app');
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((name) => name.startsWith('best-nootropics'))
      .map((name) => join(dir, name, 'page.tsx'))
      .filter((p) => existsSync(p));
  });

describe('BrainMAX+ is not a best-of pick', () => {
  it('scans a non-empty set of best-of pages', () => {
    expect(listiclePages.length).toBeGreaterThan(20);
  });

  it('no best-of page ranks eu-yan-sang-brainmax-review', () => {
    const offenders = listiclePages.filter((p) =>
      /slug === 'eu-yan-sang-brainmax-review'/.test(readFileSync(p, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });
});
