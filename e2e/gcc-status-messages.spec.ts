import { test, expect } from '@playwright/test';

// WCAG 4.1.3 Status Messages on the GCC Playwright project.
// Companion to us-status-messages (Q28), jp-status-messages (Q31),
// eu-status-messages (Q35), au-status-messages (Q45).
//
// PR-Q46.
//
// GCC has en-only chrome and shares the EN uiStrings.search.liveRegion
// bundle with US and AU. What differs is the SearchModal product
// index:
//
//   GCC → searchItems from apps/gcc/src/lib/search.ts
//          (products-gcc.json: EYS BrainMAX as the Asia-heritage
//          entry; Mind Lab Pro / NooCube / Qualia Mind / Onnit
//          Alpha Brain / Thesis / Nootropics Depot as the
//          international section)
//
// The BrainMAX test is the GCC-specific anchor: typing "brainmax"
// matches ≥1 result on GCC (Eu Yan Sang BrainMAX+ is in the GCC
// catalog) and 0 results on US/JP/EU/LATAM/CA/AU. If a future
// search-index audit accidentally cross-wires the GCC SearchModal
// to one of those regions' catalogs, this spec catches it via a
// positive-count announcement that would otherwise become
// "No results for brainmax".

const LIVE_REGION =
  '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]';

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

async function openPalette(page: import('@playwright/test').Page) {
  await page.goto('/best-nootropics-for-focus/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+K');
  await expect(
    page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
  ).toBeAttached();
}

test.describe('GCC — WCAG 4.1.3 Status Messages on CommandPalette ⌘K (per GCC product catalog)', () => {
  test('live region exists in the modal dialog (persistent, attached on open)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    await expect(region).toHaveCount(1);
    await expect(region).toHaveText('');
  });

  test('typing "brainmax" matches at least 1 result on GCC (GCC catalog anchor)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    // "brainmax" is the GCC-specific catalog probe. Eu Yan Sang
    // BrainMAX+ is in products-gcc.json but not in the US/JP/EU/
    // LATAM/CA/AU catalogs. On those regions, typing "brainmax"
    // would announce "No results for brainmax" — that asymmetry is
    // the regression guard.
    await page.keyboard.type('brainmax');
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
