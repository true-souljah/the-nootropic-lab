#!/usr/bin/env node
/**
 * Mobile horizontal-overflow guard: no built page may scroll sideways on a phone.
 *
 * Serves dist/ locally, loads EVERY built page in headless Chrome at 375px and
 * 320px wide, and fails when document.documentElement.scrollWidth exceeds the
 * viewport — the bug class found live on 2026-10-06 (.sr-only spans escaping a
 * table's scroll wrapper, tables without one, nowrap labels, unbreakable URLs).
 * For each failing page it prints the elements that stick out past the
 * viewport, so the cause is readable from the CI log.
 *
 * Run after the build (CI does):  check:overflow
 * Browser: the system Google Chrome (preinstalled on GitHub's ubuntu runners);
 * set CHROME_PATH to use another Chromium binary. No browser → exit 1 (fail
 * closed: a check that never ran must not read as a pass).
 * Pages are checked by CONCURRENCY parallel tabs (env OVERFLOW_CONCURRENCY,
 * default 4) so sites with thousands of pages stay within the PR-gate budget.
 *
 * Nootropic Lab port of the shared portfolio checker (md5 fb24082a). Adapted only
 * where this repo differs:
 *   - Monorepo of Next.js static exports: each region app is its own site, built
 *     to apps/<region>/out/ (trailingSlash: true, so pages are <path>/index.html).
 *     One region per run: `npm run check:overflow -- <region>`; the region must be
 *     an apps/ directory, and a missing out/ fails closed. CI runs it in each
 *     `build <region>` matrix job of build.yml, right after that region's build.
 *   - Imports chromium from @playwright/test (a direct devDependency; it also stays
 *     in the `npm ci --omit=dev` tree the build job installs, as next's optional
 *     peer) instead of playwright-core (only a transitive dependency here). If the
 *     import is missing, node exits 1 before any page is "checked".
 *   - Hydration: the Astro-island loop is kept verbatim (a no-op here: no
 *     astro-island elements). The Next.js equivalent is added after it: a Suspense
 *     boundary that bailed out to client rendering (useSearchParams in a static
 *     export, e.g. /quiz/results/) ships its fallback behind a `<!--$!-->` comment
 *     that React removes once it has rendered the real content, so the check waits
 *     for every such marker to disappear (10s, then the page fails closed like an
 *     island that never hydrated).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const APPS = fileURLToPath(new URL('../apps/', import.meta.url));
const REGIONS = readdirSync(APPS, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const REGION = process.argv[2];
if (process.argv.length !== 3 || !REGIONS.includes(REGION)) {
  console.error(`✗ check-mobile-overflow: name exactly one region app (${REGIONS.join(', ')}), e.g. \`npm run check:overflow -- us\``);
  process.exit(1);
}
const DIST = join(APPS, REGION, 'out') + sep;
const WIDTHS = [375, 320];
const CONCURRENCY = Math.max(1, Number(process.env.OVERFLOW_CONCURRENCY) || 4);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml',
};

function htmlPages(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlPages(p));
    else if (e.name.endsWith('.html')) {
      const rel = relative(DIST, p).split(sep).join('/');
      out.push('/' + (e.name === 'index.html' ? rel.slice(0, -'index.html'.length) : rel));
    }
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error(`✗ check-mobile-overflow: ${DIST} does not exist — run the build first`);
  process.exit(1);
}
const pages = htmlPages(DIST).sort();
if (pages.length === 0) {
  console.error(`✗ check-mobile-overflow: no HTML files under ${DIST} — nothing was checked`);
  process.exit(1);
}

// Error responses carry a body: Chrome turns an EMPTY 4xx into net::ERR_HTTP_RESPONSE_CODE_FAILURE,
// which makes page.goto throw and abort the whole run instead of recording "HTTP 404" for that page.
const server = createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'content-type': 'text/plain' });
    res.end('400 bad request');
    return;
  }
  let file = join(DIST, pathname);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404 not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const origin = `http://127.0.0.1:${server.address().port}`;

let browser;
try {
  browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
  );
} catch (err) {
  server.close();
  console.error(`✗ check-mobile-overflow: could not launch Chrome (${err.message.split('\n')[0]}) — install Google Chrome or set CHROME_PATH`);
  process.exit(1);
}

// The next Astro island a visitor would get hydrated, or null: client:load / idle
// always; client:visible once scrolled into view (an island with no child element
// can never intersect, so it is skipped); client:media when its query matches.
const nextIsland = (page) =>
  page.evaluateHandle(
    () =>
      [...document.querySelectorAll('astro-island[ssr]')].find((el) => {
        const how = el.getAttribute('client');
        if (how === 'load' || how === 'idle') return true;
        if (how === 'visible') return el.firstElementChild !== null;
        if (how === 'media') {
          try {
            return matchMedia(JSON.parse(el.getAttribute('opts') || '{}').value).matches;
          } catch {
            return false;
          }
        }
        return false;
      }) ?? null,
  );

// Load one page and return a failure record, or null when it fits the viewport.
async function checkPage(page, path, width) {
  const res = await page.goto(origin + path, { waitUntil: 'load' });
  if (!res || !res.ok()) return { path, width, msg: `HTTP ${res ? res.status() : 'no response'}` };
  await page.evaluate(() => document.fonts.ready);
  // Measure the hydrated page: bring each island into view (client:visible hydrates
  // on intersection), then wait for Astro to drop its `ssr` attribute.
  for (let island; (island = (await nextIsland(page)).asElement()); ) {
    await island.evaluate((el) => (el.firstElementChild ?? el).scrollIntoView());
    try {
      await page.waitForFunction((el) => !el.hasAttribute('ssr'), island, { timeout: 10_000 });
    } catch {
      return { path, width, msg: 'an Astro island did not hydrate within 10s' };
    }
  }
  // Next.js: wait until React has replaced every client-rendered Suspense fallback.
  try {
    await page.waitForFunction(
      () => {
        const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
        for (let c = walker.nextNode(); c; c = walker.nextNode()) if (c.data === '$!') return false;
        return true;
      },
      undefined,
      { timeout: 10_000 },
    );
  } catch {
    return { path, width, msg: 'a client-rendered Suspense boundary did not hydrate within 10s' };
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      if (sw <= vw) return { vw, sw, culprits: [] };
      // RTL pages overflow to the LEFT, so a box can stick out on either side.
      // (-1.5px, not -0.5px: an .sr-only box sits at left:-1px via its margin:-1px.)
      const outside = (q) => q.right > vw + 0.5 || q.left < -1.5;
      const edge = (q) => (q.left < -1.5 ? `left ${Math.round(q.left)}px` : `right ${Math.round(q.right)}px`);
      const describe = (el) => {
        const parts = [];
        for (let e = el; e && e !== document.body && parts.length < 4; e = e.parentElement) {
          let s = e.tagName.toLowerCase();
          if (e.id) s += `#${e.id}`;
          const cls = [...e.classList].slice(0, 3).join('.');
          if (cls) s += `.${cls}`;
          parts.unshift(s);
        }
        return parts.join(' > ');
      };
      // Is el clipped by a scroll/clip container? An absolutely positioned element is
      // only clipped when its containing block (a positioned ancestor) sits inside or
      // on that container — otherwise it escapes the clip (the .sr-only-in-a-scroller bug).
      const clipped = (el, pos) => {
        let positioned = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (s.position !== 'static') positioned = true;
          if (s.overflowX !== 'visible' && (pos !== 'absolute' || positioned)) return true;
        }
        return false;
      };
      // Elements that stick out while their parent does not (where the overflow starts),
      // plus absolutely positioned boxes that escaped their scroller.
      const culprits = new Set();
      for (const el of document.body.querySelectorAll('*')) {
        const q = el.getBoundingClientRect();
        if (!outside(q)) continue;
        const pos = getComputedStyle(el).position;
        if (pos === 'fixed' || clipped(el, pos)) continue;
        if (!outside(el.parentElement.getBoundingClientRect()) || pos === 'absolute') culprits.add(`${describe(el)} (${edge(q)}${pos === 'absolute' ? ', position:absolute' : ''})`);
        if (culprits.size >= 5) break;
      }
      // Unbreakable text (long URLs, nowrap labels) spilling out of a box that fits.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n && culprits.size < 8; n = walker.nextNode()) {
        if (!n.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        const q = range.getBoundingClientRect();
        const parent = n.parentElement;
        const box = parent.getBoundingClientRect();
        const pos = getComputedStyle(parent).position;
        // box.width > 1 skips .sr-only text (1px clipped box; its range rect is not painted).
        if (outside(q) && !outside(box) && box.width > 1 && !clipped(parent, pos)) {
          culprits.add(`text "${n.textContent.trim().slice(0, 40)}" in ${describe(parent)} (${edge(q)})`);
        }
      }
      return { vw, sw, culprits: [...culprits] };
  });
  return r.sw > r.vw ? { path, width, msg: `scrollWidth ${r.sw}px > viewport ${r.vw}px`, culprits: r.culprits } : null;
}

const failures = [];
let checked = 0;
for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 800 } });
  const queue = [...pages];
  const worker = async () => {
    const page = await context.newPage();
    for (let path; (path = queue.shift()) !== undefined; ) {
      const failure = await checkPage(page, path, width);
      if (failure) failures.push(failure);
      // Counts MEASURED views only. An HTTP error or hydration timeout is not measured, but it
      // is in `failures`, so the run still exits 1.
      if (!failure || failure.culprits) checked++;
    }
  };
  // Each worker opens a tab: never more workers than pages (also bounds OVERFLOW_CONCURRENCY=Infinity).
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pages.length) }, worker));
  await context.close();
}
failures.sort((a, b) => a.width - b.width || a.path.localeCompare(b.path));
await browser.close();
server.close();

if (checked === 0) {
  console.error('✗ check-mobile-overflow: no page was measured — nothing was checked');
  process.exit(1);
}
if (failures.length) {
  console.error(`✗ check-mobile-overflow: ${failures.length} page view(s) failed (horizontal scroll on phones unless noted):`);
  for (const f of failures) {
    console.error(`  ${f.path} @${f.width}px: ${f.msg}`);
    for (const c of f.culprits ?? []) console.error(`      ${c}`);
  }
  process.exit(1);
}
console.log(`✓ check-mobile-overflow: ${pages.length} pages × ${WIDTHS.join('/')}px (${checked} page views) — no horizontal overflow`);
