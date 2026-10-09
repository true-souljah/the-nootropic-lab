import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { guidesForRegion } from '@nootropic/data';

// Regression guard for `_redirects` files (Cloudflare Pages format).
//
// Each region's `apps/{region}/public/_redirects` is a list of
// rules: `<source>  <destination>  <status>`. Source patterns can
// use a trailing `*` splat. Destinations can be relative paths
// (same-region) or absolute URLs (cross-region).
//
// What this test catches:
//   1. Same-region destination paths that don't resolve to an
//      actual page.tsx — i.e. a redirect chain that lands on a
//      404. GSC eventually reports these as "soft 404" or
//      "redirect chain".
//   2. Syntax-level issues (3+ whitespace-separated tokens
//      per non-comment line).
//
// Cross-domain destinations (https://...) are not verified
// against page.tsx — they live on a different deploy target.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
type Region = (typeof REGIONS)[number];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && entry.name === 'page.tsx') out.push(p);
  }
  return out;
}

function buildRouteInventory(region: Region): Set<string> {
  const appRoot = resolve(REPO_ROOT, `apps/${region}/src/app`);
  if (!existsSync(appRoot)) return new Set();
  const routes = new Set<string>();
  for (const path of walk(appRoot)) {
    const rel = path.replace(`${appRoot}/`, '').replace('/page.tsx', '');
    routes.add(rel === 'page.tsx' ? '/' : `/${rel}/`);
  }
  return routes;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pathExists(path: string, inventory: Set<string>, region: Region): boolean {
  if (inventory.has(path)) return true;
  // Guide pages are generated from data: the slug must be a guide this host serves,
  // not just any string the dynamic [guide] route could match.
  const guide = /^\/guides\/([a-z0-9-]+)\/?$/.exec(path);
  if (guide && inventory.has('/guides/[guide]/')) return guidesForRegion(region).some((g) => g.slug === guide[1]);
  // Dynamic [param] route matching. (Until 2026-10 this character class read
  // `[^\\]]+`, which never matched a segment, so every dynamic destination failed.)
  for (const route of inventory) {
    const pattern = `^${escapeRegex(route).replace(/\\\[[^\]]+\\\]/g, '[^/]+').replace(/\/$/, '/?')}$`;
    if (new RegExp(pattern).test(path.replace(/\/$/, '') + '/')) return true;
  }
  return false;
}

interface Rule {
  source: string;
  destination: string;
  status: string;
  lineNum: number;
}

function parseRedirects(content: string): Rule[] {
  const rules: Rule[] = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 3) continue;
    rules.push({ source: parts[0], destination: parts[1], status: parts[2], lineNum: i + 1 });
  }
  return rules;
}

describe('_redirects validity (Cloudflare Pages format + destination liveness)', () => {
  for (const region of REGIONS) {
    const redirectsPath = resolve(REPO_ROOT, `apps/${region}/public/_redirects`);
    if (!existsSync(redirectsPath)) {
      test.skip(`${region}: _redirects file present`, () => {});
      continue;
    }
    const content = readFileSync(redirectsPath, 'utf8');
    const rules = parseRedirects(content);
    const inventory = buildRouteInventory(region);

    test(`${region}: every parsed rule has source, destination, and 3-digit status`, () => {
      const malformed = rules.filter((r) => !/^\d{3}$/.test(r.status));
      expect(
        malformed,
        `${region} _redirects has ${malformed.length} malformed rules (status must be 3 digits):\n` +
          malformed.map((r) => `  L${r.lineNum}: ${r.source} ${r.destination} ${r.status}`).join('\n'),
      ).toEqual([]);
    });

    test(`${region}: no rule follows the catch-all /* fallback (it would never match)`, () => {
      // Cloudflare Pages applies the first matching rule, so anything listed
      // after `/* ... 404` is dead: a removed page's 301 placed there would 404.
      const fallback = rules.findIndex((r) => r.source === '/*');
      const unreachable = fallback === -1 ? [] : rules.slice(fallback + 1);
      expect(
        unreachable.map((r) => `L${r.lineNum}: ${r.source} ${r.destination} ${r.status}`),
        `${region} _redirects has rules after the catch-all fallback`,
      ).toEqual([]);
    });

    for (const rule of rules) {
      // Skip cross-domain (https://...) destinations and the catch-all 404 fallback
      if (rule.destination.startsWith('http')) continue;
      if (rule.destination === '/404.html') continue;

      test(`${region}: rule L${rule.lineNum} "${rule.source} → ${rule.destination}" destination resolves to a real page.tsx`, () => {
        expect(
          pathExists(rule.destination, inventory, region),
          `${region} _redirects line ${rule.lineNum} sends "${rule.source}" to "${rule.destination}" ` +
            `but no page.tsx exists at that path. This creates a redirect→404 chain. ` +
            `Fix: either create the destination page or redirect to an existing path.`,
        ).toBe(true);
      });
    }
  }
});
