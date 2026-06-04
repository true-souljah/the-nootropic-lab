import { test, expect } from '@playwright/test';

// WCAG 4.1.3 Status Messages on the SEA Playwright project.
// Companion to us-status-messages (Q28), jp-status-messages (Q31),
// eu-status-messages (Q35), au-status-messages (Q45),
// gcc-status-messages (Q46).
//
// PR-Q47 — closes the status-messages axis on all 8 regions.
//
// SEA has en-only chrome and shares the EN uiStrings.search.liveRegion
// bundle with US, AU, and GCC. What differs is the SearchModal
// product index:
//
//   SEA → searchItems from apps/sea/src/lib/search.ts
//          (products-sea.ts: Blackmores + Nature's Own + EYS BrainMAX
//          + NatureBell Ginkgo + Ginseng as the SEA region brands;
//          Mind Lab Pro / NooCube / Qualia Mind / Onnit / Thesis as
//          the international section)
//
// The NatureBell test is the SEA-specific anchor: typing "naturebell"
// matches ≥1 result on SEA (TCM-inspired, Singapore-Malaysia
// distribution, SEA-exclusive in this catalog). On every other
// region, "naturebell" announces "No results for naturebell". That
// asymmetry is the regression guard against accidental cross-region
// search-index wiring.
//
// After this PR, status-messages is covered on JP/LATAM/CA/EU/US/AU/
// GCC/SEA — 4 axes universally covered: smoke (7/8 by design),
// axe (8/8), reflow (8/8), status-messages (8/8).

const LIVE_REGION =
  '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]';

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

async function openPalette(page: import('@playwright/test').Page) {
  await page.goto('/best-nootropics-for-focus/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+K');
  await expect(
    page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
  ).toBeAttached();
}

test.describe('SEA — WCAG 4.1.3 Status Messages on CommandPalette ⌘K (per SEA product catalog)', () => {
  test('live region exists in the modal dialog (persistent, attached on open)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    await expect(region).toHaveCount(1);
    await expect(region).toHaveText('');
  });

  test('typing "naturebell" matches at least 1 result on SEA (SEA-only catalog anchor)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    // "naturebell" is the SEA-specific catalog probe. NatureBell
    // Ginkgo + Ginseng is TCM-inspired, distributed via
    // Singapore-Malaysia supplement chains, and SEA-exclusive in
    // this catalog. On US/JP/EU/LATAM/CA/AU/GCC, typing
    // "naturebell" would announce "No results for naturebell".
    await page.keyboard.type('naturebell');
    await expect(region).toHaveText(/^\d+ results?$/);
    await expect(region).not.toHaveText(/^No results for/);
  });

  test('typing a query with NO matches announces the "No results" string', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    await page.keyboard.type('xyzqq');
    await expect(region).toHaveText('No results for xyzqq');
  });

  test('a long pasted query is capped at 40 chars + … in the announcement', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    const longQuery = 'x'.repeat(60);
    await page.keyboard.type(longQuery);
    const expected = `No results for ${'x'.repeat(40)}…`;
    await expect(region).toHaveText(expected);
  });

  test('clearing the input silences the live region (no spurious "0 results" announcement)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    await page.keyboard.type('mind');
    await expect(region).not.toHaveText('');
    await page
      .locator('[role="dialog"]:not(#klaro-cookie-notice) input[type="text"]')
      .fill('');
    await expect(region).toHaveText('');
  });
});
