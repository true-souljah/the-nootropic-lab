import { execFileSync } from 'node:child_process';
import { allProductsUS, allProductsEU, allProductsCA, allProductsAU, allProductsLatam, allProductsGCC, allProductsSEA } from '../packages/data/src/index';
import { checkPromoPr } from '../packages/ui/src/promo-pr-scope';

const required = ['HEAD_REF', 'PR_TITLE', 'BASE_SHA', 'HEAD_SHA'] as const;
function git(args: string[]): string { return execFileSync('git', args, { encoding: 'utf8' }).trim(); }
function show(revision: string, path: string): unknown | undefined {
  try { return JSON.parse(git(['show', `${revision}:${path}`])); } catch { return undefined; }
}
function main(): void {
  for (const key of required) if (!process.env[key]) { console.error(`Missing required environment variable: ${key}`); process.exit(1); }
  const headRef = process.env.HEAD_REF!; const title = process.env.PR_TITLE!; const baseSha = process.env.BASE_SHA!; const headSha = process.env.HEAD_SHA!;
  const mergeBase = git(['merge-base', baseSha, headSha]);
  const changedPaths = git(['diff', '--name-only', '--no-renames', `${mergeBase}...${headSha}`]).split('\n').filter(Boolean);
  const base: Record<string, unknown> = {}; const head: Record<string, unknown> = {};
  for (const path of changedPaths.filter((path) => path.startsWith('packages/data/promos/'))) {
    const before = show(mergeBase, path); const after = show(headSha, path);
    if (before !== undefined) base[path] = before;
    if (after !== undefined) head[path] = after;
  }
  const result = checkPromoPr({ headRef, title, changedPaths, base, head, productsByRegion: { us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA } });
  if (!result.ok) { for (const violation of result.violations) console.error(`✗ ${violation}`); process.exit(1); }
  console.log(result.promo ? `Promo PR scope: ok (${changedPaths.length} files)` : 'Promo PR scope: not a promo PR');
}
main();
