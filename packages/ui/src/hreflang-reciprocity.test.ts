import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

// Hreflang reciprocity regression guard.
//
// Every `buildAlternates({ regionCode, path, availableInRegions })`
// call emits `<link rel="alternate" hreflang>` entries pointing
// at the same path on each declared region's domain. If the path
// doesn't actually exist on a declared region (no matching
// page.tsx), Googlebot crawls it, hits a 404, and reports
// "Alternate page with no return tag" in GSC.
//
// This test scans every buildAlternates call across the project
// and verifies the path resolves to an actual page.tsx in each
// declared region. If `availableInRegions` is omitted, the
// helper defaults to all 8 regions — same check applies.
//
// Catches re-introduction of the bug at ~50ms in vitest, before
// playwright e2e even starts.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
type Region = (typeof REGIONS)[number];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) out.push(p);
  }
  return out;
}

function buildRouteInventory(region: Region): Set<string> {
  const appRoot = resolve(REPO_ROOT, `apps/${region}/src/app`);
  if (!existsSync(appRoot)) return new Set();
  const routes = new Set<string>();
  for (const path of walk(appRoot)) {
    if (!path.endsWith('/page.tsx')) continue;
    const rel = path.replace(`${appRoot}/`, '').replace('/page.tsx', '');
    routes.add(rel === 'page.tsx' ? '/' : `/${rel}/`);
  }
  return routes;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasRoute(region: Region, path: string, inventory: Map<Region, Set<string>>): boolean {
  const routes = inventory.get(region)!;
  if (routes.has(path)) return true;
  // Allow dynamic [param] route matching.
  for (const route of routes) {
    const pattern = `^${escapeRegex(route).replace(/\\\[[^\\]]+\\\]/g, '[^/]+').replace(/\/$/, '/?')}$`;
    if (new RegExp(pattern).test(path.replace(/\/$/, '') + '/')) return true;
  }
  return false;
}

// Find every buildAlternates call across apps.
interface AlternatesCall {
  source: string;
  origin: Region;
  path: string;
  declared: Region[];
}

function collectCalls(): AlternatesCall[] {
  const callRe =
    /buildAlternates\(\s*\{\s*regionCode:\s*['"](\w+)['"]\s*,\s*path:\s*['"]([^'"]+)['"](?:\s*,\s*availableInRegions:\s*\[([^\]]+)\])?[^}]*\}\s*\)/g;
  const calls: AlternatesCall[] = [];
  for (const region of REGIONS) {
    const appRoot = resolve(REPO_ROOT, `apps/${region}/src/app`);
    if (!existsSync(appRoot)) continue;
    for (const tsx of walk(appRoot)) {
      const content = readFileSync(tsx, 'utf8');
      let match: RegExpExecArray | null;
      while ((match = callRe.exec(content)) !== null) {
        const origin = match[1] as Region;
        const path = match[2];
        const availRaw = match[3];
        const declared = availRaw
          ? (availRaw.match(/['"](\w+)['"]/g) ?? []).map((s) => s.replace(/['"]/g, '') as Region)
          : ([...REGIONS] as Region[]);
        calls.push({ source: tsx.replace(`${REPO_ROOT}/`, ''), origin, path, declared });
      }
    }
  }
  return calls;
}

describe('hreflang reciprocity — every declared alternate region must have the page (GSC "Alternate page with no return tag" guard)', () => {
  const inventory = new Map<Region, Set<string>>();
  for (const region of REGIONS) inventory.set(region, buildRouteInventory(region));

  const calls = collectCalls();
  test(`at least one buildAlternates() call found in the project (sanity)`, () => {
    expect(calls.length).toBeGreaterThan(50);
  });

  for (const call of calls) {
    for (const declared of call.declared) {
      if (declared === call.origin) continue;
      test(`${call.source}: alternate "${declared}" has page.tsx at ${call.path}`, () => {
        expect(
          hasRoute(declared, call.path, inventory),
          `${call.source} declares an alternate for region "${declared}" at "${call.path}" via ` +
            `buildAlternates(), but apps/${declared}/src/app${call.path} has no page.tsx. Googlebot ` +
            `will follow the hreflang link, hit a 404, and report "Alternate page with no return tag" ` +
            `in GSC. Fix: pass \`availableInRegions: ['<only-the-regions-that-have-the-page>']\` to ` +
            `the buildAlternates call.`,
        ).toBe(true);
      });
    }
  }
});
