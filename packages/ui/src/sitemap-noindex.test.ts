import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

// Regression guard for GSC "Submitted URL marked 'noindex'".
//
// A URL listed in sitemap.xml is a signal to Googlebot saying
// "please index this page". A page with `robots: { index: false }`
// in its metadata is the opposite signal: "please don't index".
// Listing the same URL in BOTH places is a self-contradiction
// that GSC reports as "Submitted URL marked 'noindex'" — wastes
// crawl budget and produces noisy warnings.
//
// This test scans every region's sitemap.ts source for static
// URL templates and verifies that none point to a route whose
// page.tsx or layout.tsx has `robots: { index: false }`.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
type Region = (typeof REGIONS)[number];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && (entry.name === 'page.tsx' || entry.name === 'layout.tsx')) out.push(p);
  }
  return out;
}

function buildNoindexRoutes(region: Region): Set<string> {
  const appRoot = resolve(REPO_ROOT, `apps/${region}/src/app`);
  if (!existsSync(appRoot)) return new Set();
  const routes = new Set<string>();
  for (const path of walk(appRoot)) {
    const content = readFileSync(path, 'utf8');
    // Match `robots: { index: false ... }`.
    if (/robots:\s*\{\s*index:\s*false/.test(content)) {
      const rel = path.replace(`${appRoot}/`, '').replace(/\/(page|layout)\.tsx$/, '');
      const route = rel === '' ? '/' : `/${rel}/`;
      routes.add(route);
    }
  }
  return routes;
}

function extractSitemapPaths(region: Region): Set<string> {
  const sitemapPath = resolve(REPO_ROOT, `apps/${region}/src/app/sitemap.ts`);
  if (!existsSync(sitemapPath)) return new Set();
  const source = readFileSync(sitemapPath, 'utf8');
  const paths = new Set<string>();
  // Match `${BASE}/path/`.
  const re = /`\$\{BASE\}([/][^`]*)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    let path = m[1];
    if (!path.endsWith('/')) path += '/';
    paths.add(path);
  }
  return paths;
}

describe('sitemap × noindex contradiction guard (GSC "Submitted URL marked noindex")', () => {
  for (const region of REGIONS) {
    const noindexRoutes = buildNoindexRoutes(region);
    const sitemapPaths = extractSitemapPaths(region);

    test(`${region}: no sitemap URL points to a noindex page`, () => {
      const offenders = [...sitemapPaths].filter((p) => noindexRoutes.has(p));
      expect(
        offenders,
        `${region} sitemap.ts lists ${offenders.length} URL(s) that are also marked noindex ` +
          `via \`robots: { index: false }\`. This is a self-contradiction surfacing as "Submitted ` +
          `URL marked 'noindex'" in GSC. Remove from sitemap or drop the noindex:\n` +
          offenders.map((p) => `  - ${p}`).join('\n'),
      ).toEqual([]);
    });
  }
});
