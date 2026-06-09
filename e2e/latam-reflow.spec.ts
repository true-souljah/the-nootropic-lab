import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on LATAM routes. Companion to e2e/us-reflow.spec.ts
// (PR-Q24 → Q26 closed it on US) and e2e/jp-reflow.spec.ts (PR-Q31).
//
// Why a LATAM-specific reflow probe: Spanish text typically runs
// 20-30% longer than English at the same character count. A few real
// examples from the shipped strings.search.* + strings.nav.* sub-trees:
//
//   EN "Skip to main content" (21 chars)
//      vs ES "Saltar al contenido principal" (29 chars, +38%)
//   EN "About" (5 chars) vs ES "Acerca de" (9 chars, +80%)
//   EN "Open comparator →" (17 chars)
//      vs ES "Abrir comparador →" (18 chars, +6%)
//   EN "Primary" landmark vs ES "Navegación principal" (+186%)
//
// The PR-Q25 (#89) responsive grid fixes were tuned against English
// content. Spanish chrome at 320px viewport is the strongest re-test
// of those fixes — if a localized label is unexpectedly wide and
// doesn't shrink/wrap, the page-level scrollWidth grows past 320 and
// this spec catches it.
//
// PR-Q32 #96.

const VIEWPORT = { width: 320, height: 800 };
const SLOP_PX = 1;

interface Offender {
  tag: string;
  cls: string;
  text: string;
  w: number;
  right: number;
}

const ROUTES = [
  { path: '/', label: 'Discover (home, Spanish FPHeader nav)' },
  { path: '/best-nootropics-for-focus/', label: 'Listicle (Spanish breadcrumb + chrome)' },
  { path: '/guides/', label: 'Guides (Spanish guides body PR-B2b)' },
];

test.use({ viewport: VIEWPORT });

test.beforeEach(async ({ context }) => {
  // Skip Klaro consent banner so it doesn't push fixed-position chrome
  // wider than viewport.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('LATAM — WCAG 1.4.10 Reflow at 320px viewport (Spanish chrome)', () => {
  for (const route of ROUTES) {
    test(`${route.label} (${route.path}) reflows without horizontal overflow`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const { scrollWidth, viewportWidth, offenders } = await page.evaluate(() => {
        const offs: Offender[] = [];
        const vw = window.innerWidth;
        for (const el of document.querySelectorAll<HTMLElement>('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 4) {
            offs.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className.toString().slice(0, 80),
              text: (el.textContent ?? '').trim().slice(0, 40),
              w: Math.round(r.width),
              right: Math.round(r.right),
            });
            if (offs.length >= 5) break;
          }
        }
        return {
          scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          viewportWidth: vw,
          offenders: offs,
        };
      });

      expect(
        scrollWidth,
        `Reflow failure: scrollWidth=${scrollWidth} > viewportWidth=${viewportWidth} + ${SLOP_PX}px slop. ` +
          `Offenders: ${JSON.stringify(offenders, null, 2)}`,
      ).toBeLessThanOrEqual(viewportWidth + SLOP_PX);
    });
  }
});
