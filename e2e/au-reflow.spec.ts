import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on AU routes at 320px viewport. Companion to
// e2e/us-reflow.spec.ts (PR-Q24 → Q26), e2e/jp-reflow.spec.ts (PR-Q31),
// e2e/latam-reflow.spec.ts (PR-Q32), e2e/ca-reflow.spec.ts (PR-Q33),
// e2e/eu-reflow.spec.ts (PR-Q34).
//
// AU has en-only chrome (no nested locales), so route diversity comes
// from template-shape and AU-specific content:
//
//   /                               — AU root home (baseline chrome)
//   /best-nootropics/               — BestOf with AU catalog + AUST L
//                                     badges (TGA-listed products
//                                     render an extra compliance row
//                                     no other region's catalog uses)
//   /blackmores-brain-active-review/ — ProductDetail for the
//                                      AU-exclusive Blackmores brand
//                                      (TGA "imported as food
//                                      supplement" copy in cons +
//                                      summary; the brand name itself
//                                      — "Blackmores Brain Active" —
//                                      is wider than typical brands
//                                      like "TruBrain" and forces the
//                                      H1 wrap differently)
//
// PR-Q38. Brings AU coverage to: smoke (Q36) + axe (Q37) + reflow.

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
  { path: '/', label: 'Home (en-AU baseline)' },
  { path: '/best-nootropics/', label: 'BestOf (AU catalog + AUST L badges)' },
  { path: '/blackmores-brain-active-review/', label: 'ProductDetail (AU-exclusive brand)' },
];

test.use({ viewport: VIEWPORT });

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('AU — WCAG 1.4.10 Reflow at 320px viewport (BestOf + AU-exclusive ProductDetail)', () => {
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
