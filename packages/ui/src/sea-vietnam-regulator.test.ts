import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { seaCountries } from '@nootropic/data';

// Vietnam's health-protection foods (thực phẩm bảo vệ sức khỏe) fall under
// the Vietnam Food Administration (Cục An toàn thực phẩm, VFA) of the Ministry
// of Health, under Decree 15/2018/NĐ-CP (chinhphu.vn, checked 2026-10-05). The
// Drug Administration of Vietnam (DAV) covers drugs and cosmetics, and the old
// VND 1,000,000 courier exemption (Decision 78/2010/QĐ-TTg) was repealed from
// 2025-02-18 by Decision 01/2025/QĐ-TTg, so neither may reappear in SEA copy.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.ts', '.tsx', '.json', '.md', '.mdx'].includes(extname(p))) out.push(p);
  }
  return out;
}

const SEA_SOURCES = [
  ...walk(resolve(REPO_ROOT, 'apps/sea/src')),
  resolve(REPO_ROOT, 'packages/data/src/products-sea.json'),
  resolve(REPO_ROOT, 'packages/data/src/regional-notes/sea.ts'),
];

const BANNED: RegExp[] = [/\bDAV\b/, /Drug Administration of Vietnam/i, /1[,.]000[,.]000/];

describe('SEA copy names the Vietnam Food Administration, not DAV', () => {
  test('scanned a non-empty file set', () => {
    expect(SEA_SOURCES.length).toBeGreaterThan(20);
  });

  test('no SEA source names DAV or the repealed courier threshold', () => {
    const hits = SEA_SOURCES.flatMap(file => {
      const text = readFileSync(file, 'utf8');
      return BANNED.flatMap(re => {
        const m = text.match(re);
        return m ? [`${file.slice(REPO_ROOT.length + 1)}: "${m[0]}"`] : [];
      });
    });
    expect(hits).toEqual([]);
  });

  test('no SEA source asserts a product is not registered with a regulator', () => {
    // No national register was ever checked for these products, so copy may
    // only say we have not verified a local registration.
    const UNSOURCED_NEGATIVE: RegExp[] = [/not (currently )?registered with/i, /not registered with any/i];
    const hits = SEA_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        UNSOURCED_NEGATIVE.some(re => re.test(line)) ? [`${file.slice(REPO_ROOT.length + 1)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });

  test('the Vietnam country note names the VFA and cites Decree 15/2018', () => {
    const vn = seaCountries.find(c => c.code === 'VN')!.regulatoryNote;
    expect(vn).toContain('Vietnam Food Administration (Cục An toàn thực phẩm, VFA)');
    expect(vn).toContain('Decree 15/2018/NĐ-CP');
    for (const re of BANNED) expect(vn).not.toMatch(re);
  });
});
