import { test, expect } from '@playwright/test';

// Regression guard for the shortlist's saved rows on phones.
//
// Each saved product used a fixed five-column grid (32px 1fr 200px 1fr auto)
// at every width. With three products saved, a 390px phone got a 483px-wide
// page that scrolled sideways, 36px-wide note boxes, and Visit links past the
// right edge. us-reflow.spec.ts never caught it: a fresh browser has an empty
// shortlist, so no row renders. Here the share link (`?items=`) imports three
// products into the empty shortlist before measuring.

const SHARED = '/shortlist/?items=mind-lab-pro-review,noocube-review,naturebell-ginkgo-ginseng-review';
const SLOP_PX = 1;
const MIN_NOTE_PX = 200;

test.beforeEach(async ({ context }) => {
  // Pre-seed Klaro consent so the banner doesn't cover the rows (same pattern
  // as us-reflow.spec.ts).
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('US — shortlist rows fit a phone', () => {
  for (const width of [320, 390]) {
    test(`three saved products at ${width}px: no sideways scroll, usable notes, Visit links on screen`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(SHARED);
      // The rows render after hydration imports the shared items.
      await expect(page.locator('main textarea')).toHaveCount(3);

      const m = await page.evaluate(() => {
        const main = document.querySelector('main')!;
        return {
          viewportWidth: window.innerWidth,
          scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          noteWidths: [...main.querySelectorAll('textarea')].map((t) => Math.round(t.getBoundingClientRect().width)),
          visitRights: [...main.querySelectorAll('a')]
            .filter((a) => /^Visit/.test((a.textContent ?? '').trim()))
            .map((a) => Math.round(a.getBoundingClientRect().right)),
        };
      });

      expect(m.scrollWidth, `page is ${m.scrollWidth}px wide at a ${m.viewportWidth}px viewport`).toBeLessThanOrEqual(
        m.viewportWidth + SLOP_PX,
      );
      expect(m.visitRights, 'one Visit link per saved product').toHaveLength(3);
      for (const right of m.visitRights) expect(right, 'Visit link right edge').toBeLessThanOrEqual(m.viewportWidth);
      for (const w of m.noteWidths) expect(w, 'note box width').toBeGreaterThanOrEqual(MIN_NOTE_PX);
    });
  }
});
