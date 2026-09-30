import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

// Shipping-claim guard (2026-09-29): a Shopify store's meta.json `ships_to_countries`
// field is NOT a brand's shipping list. #272 used it to assert that mindlabpro.com
// "lists only the US" while the brand's own FAQ names dozens of territories
// (incl. Saudi Arabia, the UAE, Singapore). Shipping claims must cite the brand's
// shipping page / FAQ, never the meta.json market list alone.

const REPO = join(__dirname, '..', '..', '..');
const DATA_SRC = join(REPO, 'packages', 'data', 'src');

const BANNED: RegExp[] = [/lists only the US/i, /US-only storefront/i, /ships_to_countries/i];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

describe('shipping claims — no meta.json-derived shipping wording', () => {
  const productFiles = readdirSync(DATA_SRC)
    .filter((f) => /^products-.*\.json$/.test(f))
    .map((f) => join(DATA_SRC, f));
  const appFiles = readdirSync(join(REPO, 'apps'))
    .filter((app) => existsSync(join(REPO, 'apps', app, 'src')))
    .flatMap((app) => walk(join(REPO, 'apps', app, 'src')));

  it('scans a non-empty source set (guards against a silently empty glob)', () => {
    expect(productFiles.length).toBeGreaterThanOrEqual(8);
    expect(appFiles.length).toBeGreaterThan(100);
  });

  it('no products-*.json or app source contains banned shipping wording', () => {
    const offenders: string[] = [];
    for (const f of [...productFiles, ...appFiles]) {
      const text = readFileSync(f, 'utf8');
      for (const re of BANNED) {
        if (re.test(text)) offenders.push(`${relative(REPO, f)}: ${re.source}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
