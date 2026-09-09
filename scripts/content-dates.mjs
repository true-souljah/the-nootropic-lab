#!/usr/bin/env node
// Writes packages/data/src/content-dates.json: the last commit date (ISO 8601)
// of every tracked content file under apps/*/src/app (page.tsx) and
// packages/data/src. The sitemap generators derive <lastmod> from this map
// (packages/data/src/sitemap-dates.ts) instead of stamping the build time on
// every URL — Google only honours lastmod when it is "consistently and
// verifiably accurate" (Search Central, sitemaps/build-sitemap).
//
// Needs full git history (`fetch-depth: 0` in CI). Run `npm run content-dates`
// after changing content; the `content-dates` CI job fails when the committed
// map is stale, and the build fails when a page has no entry.
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const OUT = resolve(ROOT, 'packages/data/src/content-dates.json');
const SCOPES = ['apps', 'packages/data/src'];
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });

const tracked = new Set(git('ls-files', '--', ...SCOPES).split('\n').filter(Boolean));
const wanted = [...tracked].filter(
  (f) => (f.startsWith('packages/data/src/') && /\.(ts|json)$/.test(f) && !f.endsWith('content-dates.json')) ||
    (/^apps\/[a-z]+\/src\/app\//.test(f) && f.endsWith('/page.tsx')),
);
const shallow = git('rev-parse', '--is-shallow-repository').trim() === 'true';
if (shallow) {
  console.error('content-dates: shallow clone — full history required (git fetch --unshallow / fetch-depth: 0).');
  process.exit(2);
}
// One pass: newest-first log with file names; first sighting of a path = its latest change.
const dates = {};
let current = null;
for (const line of git('log', '--format=%cI', '--name-only', '--', ...SCOPES).split('\n')) {
  if (!line) continue;
  if (/^\d{4}-\d{2}-\d{2}T/.test(line)) { current = line; continue; }
  if (!(line in dates)) dates[line] = current;
}
const map = {};
const missing = [];
for (const f of wanted.sort()) {
  if (dates[f]) map[f] = dates[f];
  else missing.push(f);
}
if (missing.length) {
  console.error(`content-dates: ${missing.length} tracked file(s) have no commit date (uncommitted?):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
const json = JSON.stringify(map, null, 1) + '\n';
const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
writeFileSync(OUT, json);
console.log(`content-dates: ${Object.keys(map).length} files → ${OUT.replace(ROOT + '/', '')}${before === json ? ' (unchanged)' : ' (updated)'}`);
