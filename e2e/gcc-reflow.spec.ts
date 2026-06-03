import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on GCC routes at 320px viewport. Companion to
// e2e/us-reflow.spec.ts (PR-Q24 → Q26), e2e/jp-reflow.spec.ts (Q31),
// e2e/latam-reflow.spec.ts (Q32), e2e/ca-reflow.spec.ts (Q33),
// e2e/eu-reflow.spec.ts (Q34), e2e/au-reflow.spec.ts (Q38).
//
// GCC has en-only chrome (no nested locales). Route diversity comes
// from template-shape + GCC-unique content surfaces:
//
//   /                              — GCC root home (baseline chrome)
//   /best-nootropics/              — BestOf with GCC catalog
//                                    (Nahdi / Life Pharmacy / EYS
//                                    private-label rows; halal-
//                                    friendly + SFDA / MOHAP chips)
//   /halal-certified-nootropics/   — GCC-exclusive pillar; ships the
//                                    shared Sources component +
//                                    FAQ accordion + per-country
//                                    regulatory deep-dive copy
//
// Why these 3:
//   * Home is the baseline.
//   * BestOf with GCC catalog has the same wide-template risk as
//     AU's (which Q38 reflow-probed). PR-Q38 surfaced the Tabs
//     primitive overflow on ProductDetail; this surface re-probes
//     the GCC-catalog-specific BestOf to verify the fix held +
//     catch any GCC chip-row drift.
//   * /halal-certified-nootropics/ uses <Sources> (Q41 fixed its
//     contrast bug). The collapse-widget interaction at 320px
//     hasn't been reflow-probed anywhere yet. If <details>/<summary>
//     has fixed-width content that overflows narrow viewports,
//     this surface catches it.
//
// PR-Q43.

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
  { path: '/', label: 'Home (GCC baseline)' },
  { path: '/best-nootropics/', label: 'BestOf (GCC catalog + SFDA/MOHAP chips)' },
  { path: '/halal-certified-nootropics/', label: 'Halal pillar (Sources + FAQ accordion)' },
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

test.describe('GCC — WCAG 1.4.10 Reflow at 320px viewport (BestOf + halal pillar with <Sources>)', () => {
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
