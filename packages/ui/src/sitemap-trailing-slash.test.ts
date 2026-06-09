import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// Regression guard for the sitemap trailing-slash convention.
//
// All 8 region apps use `trailingSlash: true` in next.config.ts,
// which makes the canonical URL form include a trailing slash.
// If a sitemap.ts entry lacks the trailing slash, Googlebot
// crawls the no-slash URL, gets a 301 redirect to the canonical
// trailing-slash form, and reports it in GSC as "Page with
// redirect" — diluting crawl budget and producing noisy
// warnings on hundreds of URLs.
//
// This test inspects each region's sitemap.ts source and fails
// if any template-literal URL form lacks a trailing slash before
// the closing backtick.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];

describe('sitemap.ts trailing-slash convention (GSC "Page with redirect" guard)', () => {
  for (const region of REGIONS) {
    const sitemapPath = resolve(REPO_ROOT, `apps/${region}/src/app/sitemap.ts`);
    if (!existsSync(sitemapPath)) continue;
    const source = readFileSync(sitemapPath, 'utf8');

    test(`${region}: every \`\${BASE}/...\` URL template ends with /`, () => {
      // Match any template literal like `${BASE}/something` where the
      // character before the closing backtick is NOT a `/`.
      const offenders: string[] = [];
      const pattern = /`\$\{BASE\}([^`]*)`/g;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        const path = match[1];
        if (path !== '' && !path.endsWith('/')) {
          offenders.push(`\`\${BASE}${path}\``);
        }
      }
      expect(
        offenders,
        `sitemap.ts in ${region} has ${offenders.length} URL templates without ` +
          `trailing slash — each causes a 301 redirect when crawled, surfacing as ` +
          `"Page with redirect" in GSC:\n${offenders.slice(0, 10).join('\n')}`,
      ).toHaveLength(0);
    });

    test(`${region}: bare \`url: BASE\` form uses \`\${BASE}/\` template`, () => {
      // The root homepage entry should be `url: \`${BASE}/\`` not `url: BASE`
      // — the latter renders as the no-slash form which also 301s.
      const hasBareForm = /url:\s*BASE\s*,/.test(source);
      expect(
        hasBareForm,
        `sitemap.ts in ${region} uses \`url: BASE,\` for the homepage entry — this ` +
          `renders without trailing slash and causes a 301 redirect. Use \`url: ` +
          `\`\${BASE}/\`\` instead.`,
      ).toBe(false);
    });
  }
});
