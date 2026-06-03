import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on SEA routes at 320px viewport. Companion to
// us-reflow (Q24-Q26), jp-reflow (Q31), latam-reflow (Q32),
// ca-reflow (Q33), eu-reflow (Q34), au-reflow (Q38), gcc-reflow (Q43).
//
// PR-Q44 — closes the reflow axis on all 8 regions.
//
// SEA has en-only chrome (no nested locales). Route diversity comes
// from template-shape + SEA-unique content surfaces:
//
//   /                                  — SEA root home (baseline)
//   /best-nootropics/                  — BestOf with SEA catalog
//                                        (NatureBell + EYS BrainMAX
//                                        + per-country regulator
//                                        chips: HSA / NPRA / BPOM /
//                                        VFA — a wider chip set
//                                        than GCC's 2 — 4-5 chips
//                                        per row at narrowest)
//   /halal-nootropics-indonesia-bpjph/ — SEA-exclusive pillar; ships
//                                        the same <Sources> +
//                                        FAQ accordion + per-country
//                                        regulatory deep-dive copy
//                                        that GCC's halal pillar
//                                        does, but with different
//                                        body content
//
// Why these 3:
//   * Home is the baseline.
//   * BestOf with SEA catalog has the widest regulator-chip strip
//     in the portfolio (HSA + NPRA + BPOM + FDA TH/PH + VFA = up
//     to 5 chips per row). If chip-wrap behavior regresses, this
//     is the surface most likely to surface it at 320px.
//   * The SEA halal pillar uses <Sources> (Q41 contrast-fixed) +
//     the BPJPH/JAKIM regulatory tables. GCC reflow probed the
//     equivalent surface in Q43; SEA's twin verifies the fix held
//     across both halal pillars.
//
// PR-Q44.

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
  { path: '/', label: 'Home (SEA baseline)' },
  { path: '/best-nootropics/', label: 'BestOf (SEA catalog + 4-5-chip HSA/NPRA/BPOM/VFA strip)' },
  { path: '/halal-nootropics-indonesia-bpjph/', label: 'BPJPH pillar (Sources + FAQ + regulator tables)' },
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

test.describe('SEA — WCAG 1.4.10 Reflow at 320px viewport (closes the reflow axis on all 8 regions)', () => {
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
