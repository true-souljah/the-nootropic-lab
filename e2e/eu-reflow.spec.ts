import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on EU nested-locale landing pages. Completes the
// cross-region reflow set started by PR-Q24 (US) and continued by
// Q31 (JP), Q32 (LATAM), and Q33 (CA). EU is the only covered region
// with multiple nested-locale routes (de, fr, pt — added by PR-Q15
// #79, then cherry-picked into Q17 since PR-Q15 didn't merge).
//
// Per-locale reflow notes:
//
//   - de (German): compound nouns are often very long unbroken
//     strings (e.g. "Nahrungsergänzungsmittel" — 24 chars,
//     "Vergleichswerkzeug" — 18 chars). PR-Q26 Chip primitive uses
//     `break-words` which only breaks at word boundaries — German
//     compounds are single "words" with no break opportunities.
//     If a long compound appears as inline text inside a fixed-
//     width container, reflow fails.
//   - fr (metropolitan): typography is similar to LATAM Spanish
//     (~20-30% longer than EN). The same PR-Q25 grid fixes apply.
//   - pt (Portuguese): similar to ES.
//
// All 3 landings render the same hand-authored template structure
// (PR-Q15 pattern: hero + 3 feature cards + 3 quick-link cards +
// language-switcher nav). The 3 tests verify each rendering chain
// holds at 320px with its own typography.
//
// PR-Q34 #98.

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
  { path: '/de/', label: 'EU German landing (de, compound nouns)' },
  { path: '/fr/', label: 'EU metropolitan French landing (fr)' },
  { path: '/pt/', label: 'EU Portuguese landing (pt)' },
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

test.describe('EU — WCAG 1.4.10 Reflow at 320px viewport (3 nested-locale landings)', () => {
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
