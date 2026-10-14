import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getLocaleForMarket, getStrings } from '@nootropic/data';
import type { SearchItem, UIStrings } from '@nootropic/data';

// Owner decision 2026-10-13: Japanese copy on the JP host is paused until a
// Japanese pharmaceutical-advertising lawyer has answered the 12 questions in
// the JP compliance guide (section 7.2). The JP chrome is English, the /ja/
// section is gone (301s in apps/jp/public/_redirects), and only the protective
// notices stay Japanese, marked lang="ja". These guards fail when any of that
// drifts back. The built-output twin is scripts/check-built-jp-language.mjs.

const REPO = join(__dirname, '..', '..', '..');
const JP = join(REPO, 'apps', 'jp');
const JA = /[぀-ヿ㐀-䶿一-鿿]/;

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const JP_SOURCES = sourceFiles(join(JP, 'src'));

describe('(a) the JP host selects the en bundle', () => {
  test('the scan is non-empty: every JP source file was read', () => {
    expect(JP_SOURCES.length).toBeGreaterThan(30);
    expect(JP_SOURCES.map((f) => relative(REPO, f))).toEqual(
      expect.arrayContaining(['apps/jp/src/lib/search.ts', 'apps/jp/src/app/not-found.tsx', 'apps/jp/src/app/layout.tsx']),
    );
  });

  test('no JP source selects ja: no getStrings(\'ja\'), no ja search context, no lang="ja" wrapper', () => {
    const offenders = JP_SOURCES.flatMap((f) => {
      const src = readFileSync(f, 'utf8');
      return [
        /getStrings\(\s*['"]ja['"]\s*\)/.test(src) ? `${relative(REPO, f)}: getStrings('ja')` : null,
        /buildRegionSearchContext\([^)]*['"]ja['"]/.test(src) ? `${relative(REPO, f)}: ja search context` : null,
        /\blang=["']ja["']/.test(src) ? `${relative(REPO, f)}: lang="ja"` : null,
      ].filter((x): x is string => x !== null);
    });
    expect(offenders).toEqual([]);
  });

  test('search.ts builds the en context and the root layout declares <html lang="en">', () => {
    expect(readFileSync(join(JP, 'src/lib/search.ts'), 'utf8')).toMatch(/buildRegionSearchContext\(allProductsJP,\s*'en',\s*'jp'\)/);
    expect(readFileSync(join(JP, 'src/app/layout.tsx'), 'utf8')).toMatch(/<html lang="en"/);
  });

  test('the JP uiStrings are the en chrome, with yen prices', async () => {
    // The path is built at runtime so tsc -p packages/ui keeps app files out of its program.
    const { uiStrings, searchItems } = (await import(/* @vite-ignore */ join(JP, 'src/lib/search.ts'))) as {
      uiStrings: UIStrings;
      searchItems: SearchItem[];
    };
    const en = getStrings('en');
    expect(uiStrings.nav).toEqual(en.nav);
    expect(uiStrings.footer).toEqual(en.footer);
    expect(uiStrings.listicle).toEqual(en.listicle);
    expect(uiStrings.productDetail.dateLocale).toBe('en-US');
    expect(uiStrings.priceLocale).toBe('ja-JP');
    const pages = searchItems.filter((i) => i.type === 'page');
    expect(pages.length).toBeGreaterThan(0);
    for (const p of pages) expect(p.title, p.href).not.toMatch(JA);
  });

  test('getLocaleForMarket("jp") is en (the "In Japan" block and review chrome)', () => {
    expect(getLocaleForMarket('jp')).toBe('en');
  });

  test('the 404 renders in English with the en consent labels', async () => {
    const src = readFileSync(join(JP, 'src/app/not-found.tsx'), 'utf8');
    expect(src).not.toMatch(JA);
    const mod = (await import(/* @vite-ignore */ join(JP, 'src/app/not-found.tsx'))) as { default: () => ReactElement };
    const html = renderToStaticMarkup(mod.default());
    const en = getStrings('en');
    for (const s of ['Page not found', 'Back to the homepage', en.cookie.settings, en.footer.about.privacy, en.footer.about.cookies]) {
      expect(html).toContain(s.replace(/'/g, '&#x27;'));
    }
    expect(html).not.toMatch(JA);
  });
});

describe('(b) no route under apps/jp/src/app/ja/', () => {
  test('the directory is gone', () => {
    expect(existsSync(join(JP, 'src', 'app', 'ja'))).toBe(false);
  });

  test('no JP page.tsx sits under a ja segment (non-empty scan)', () => {
    const pages = JP_SOURCES.filter((f) => f.endsWith('page.tsx')).map((f) => relative(join(JP, 'src', 'app'), f));
    expect(pages.length).toBeGreaterThan(20);
    expect(pages.filter((p) => p.split('/').includes('ja'))).toEqual([]);
  });

  test('the JP sitemap lists no /ja/ URL', async () => {
    const mod = (await import(/* @vite-ignore */ join(JP, 'src/app/sitemap.ts'))) as { default: () => Array<{ url: string }> };
    const urls = mod.default().map((e) => e.url);
    expect(urls.length).toBeGreaterThan(50);
    expect(urls.filter((u) => /\/ja(\/|$)/.test(new URL(u).pathname))).toEqual([]);
  });

  test('no JP or shared UI source links to /ja', () => {
    const files = [...JP_SOURCES, ...sourceFiles(join(REPO, 'packages', 'ui', 'src'))];
    const links = files.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/href=\{?["'`](\/ja(?:[/"'`?#]))/g)].map((m) => `${relative(REPO, f)}: ${m[1]}`),
    );
    expect(files.length).toBeGreaterThan(100);
    expect(links).toEqual([]);
  });
});

describe('(c) apps/jp/public/_redirects 301s every /ja URL to its English page', () => {
  const rules = readFileSync(join(JP, 'public', '_redirects'), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [source, destination, status] = l.split(/\s+/);
      return { source, destination, status };
    });

  /** Cloudflare Pages semantics: the first rule whose source matches wins; a trailing * is a splat. */
  function firstMatch(path: string) {
    return rules.find((r) => (r.source.endsWith('*') ? path.startsWith(r.source.slice(0, -1)) : r.source === path));
  }

  test.each([
    ['/ja', '/'],
    ['/ja/', '/'],
    ['/ja/best-nootropics', '/best-nootropics/'],
    ['/ja/best-nootropics/', '/best-nootropics/'],
    ['/ja/hikaku', '/nootropic-comparison/'],
    ['/ja/hikaku/', '/nootropic-comparison/'],
    ['/ja/yakkan-shoumei', '/'],
    ['/ja/yakkan-shoumei/', '/'],
    ['/ja/anything/else/', '/'],
  ])('%s → %s (301)', (path, destination) => {
    expect(firstMatch(path)).toEqual({ source: expect.stringMatching(/^\/ja/), destination, status: '301' });
  });

  test('the /ja rules shadow no other rule: every other rule still wins for its own source', () => {
    const others = rules.filter((r) => !r.source.startsWith('/ja') && r.source !== '/*');
    expect(others.length).toBeGreaterThan(0);
    for (const r of others) {
      const probe = r.source.endsWith('*') ? `${r.source.slice(0, -1)}x/` : r.source;
      expect(firstMatch(probe), r.source).toBe(r);
    }
  });

  test('the catch-all /* fallback stays last', () => {
    expect(rules.at(-1)).toEqual({ source: '/*', destination: '/404.html', status: '404' });
  });
});
