import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on CA routes. Companion to e2e/us-reflow.spec.ts
// (PR-Q24 → Q26), e2e/jp-reflow.spec.ts (PR-Q31), and
// e2e/latam-reflow.spec.ts (PR-Q32).
//
// CA-specific reflow notes:
//
//   - Quebec French (fr-CA) chrome uses OQLF substitutions that
//     change string lengths from EN AND from metropolitan French:
//     "témoins" (Quebec) vs "cookies" (EN/fr-FR), "courriel" (Quebec)
//     vs "e-mail" (EN/fr-FR). The breadcrumb / footer / cookie-policy
//     surfaces all carry these. If a localized label is unexpectedly
//     long, it can re-trigger the overflow PR-Q25/Q26 fixed for EN.
//   - /fr/comparer/ renders the ComparisonTable (Comparator template)
//     which has historically been the WIDEST template in the
//     codebase. PR-Q25 didn't directly touch Comparator; this is the
//     first time it's reflow-probed at 320px. If a fixed-width
//     column survives, this test catches it.
//
// PR-Q33 #97.

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
  { path: '/', label: 'Discover (en-CA home, baseline)' },
  { path: '/fr/meilleurs-nootropiques/', label: 'Listicle (fr-CA chrome, OQLF strings)' },
  { path: '/fr/comparer/', label: 'Comparator (fr-CA ComparisonTable — first reflow probe)' },
];

test.use({ viewport: VIEWPORT });

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('CA — WCAG 1.4.10 Reflow at 320px viewport (Quebec French + Comparator)', () => {
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
