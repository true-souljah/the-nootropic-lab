import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { contentFileDate, routeDates } from '@nootropic/data';

// <lastmod> regression guard (2026-09 GSC work). Before this, every sitemap
// entry carried `new Date()` at build time, so each deploy claimed all URLs
// had changed and Google stopped trusting the signal. Every entry must now
// resolve from committed content history: a real past date, never the run
// time, and not one uniform value across the whole sitemap.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const TEST_START = Date.now();

describe('sitemap lastmod comes from content history, not the build clock', () => {
  for (const region of REGIONS) {
    test(`${region}: every entry has a committed date, none is the build time, dates vary`, async () => {
      const mod = await import(`../../../apps/${region}/src/app/sitemap.ts`);
      const entries: Array<{ url: string; lastModified?: Date | string }> = mod.default();
      expect(entries.length).toBeGreaterThan(20);
      const stamps = new Set<number>();
      for (const e of entries) {
        expect(e.lastModified, `${e.url} has lastModified`).toBeInstanceOf(Date);
        const t = (e.lastModified as Date).getTime();
        expect(Number.isNaN(t), `${e.url} valid date`).toBe(false);
        expect(t, `${e.url} not in the future`).toBeLessThan(TEST_START);
        expect(t, `${e.url} not older than the repo`).toBeGreaterThan(Date.UTC(2025, 0, 1));
        stamps.add(t);
      }
      expect(stamps.size, `${region}: distinct lastmod values`).toBeGreaterThanOrEqual(4);
    });
  }

  test('a page without a content-dates entry fails closed', () => {
    expect(() => contentFileDate('apps/us/src/app/does-not-exist/page.tsx')).toThrow(/npm run content-dates/);
  });

  test('regional guide pages inherit the regional-notes date (SEA notes landed 2026-09-07)', () => {
    const sea = routeDates('sea').guide();
    const notes = contentFileDate('packages/data/src/regional-notes/sea.ts');
    expect(sea.getTime()).toBeGreaterThanOrEqual(notes.getTime());
    expect(notes.toISOString().slice(0, 10)).toBe('2026-09-07');
  });

  test('sitemap generators no longer reference the build clock', () => {
    for (const region of REGIONS) {
      const src = readFileSync(resolve(REPO_ROOT, `apps/${region}/src/app/sitemap.ts`), 'utf8');
      expect(src, `${region} sitemap.ts`).not.toMatch(/new Date\(\)/);
      expect(src, `${region} sitemap.ts`).not.toMatch(/lastModified:\s*now/);
    }
  });
});
