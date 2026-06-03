import { test, expect } from '@playwright/test';

// WCAG 4.1.3 Status Messages on the AU Playwright project. Companion
// to us-status-messages (Q28), jp-status-messages (Q31), eu-status-
// messages (Q35).
//
// AU and US both render English chrome, but the SearchModal indexes
// the per-region product catalog: US uses `searchItems` from
// `apps/us/src/lib/search.ts` (products-us.ts, ~24 entries with
// TruBrain + BrainMD); AU uses `apps/au/src/lib/search.ts`
// (products-au.ts, with Blackmores + Nature's Own, no TruBrain /
// BrainMD).
//
// Why this matters for WCAG 4.1.3:
//   The aria-live announcement reports the FILTERED count from the
//   region's catalog. A query that returns N results on US returns
//   a DIFFERENT N on AU. If the live-region message-generation logic
//   ever forks per-region (e.g. someone localizes the strings for
//   en-AU vs en-US), this spec catches it. Current state: same EN
//   `uiStrings.search.liveRegion` shared across both — so AU should
//   announce "1 result" / "{n} results" / "No results for {query}"
//   identical to US, but with COUNTS reflecting the AU catalog.
//
// The Blackmores assertion is the AU-specific anchor: typing
// "blackmores" matches at least 1 result on AU (Blackmores Brain
// Active Review is in products-au.ts) and 0 results on US (no
// Blackmores in products-us.ts). Searching for it on AU should
// produce a positive count.
//
// PR-Q45 — closes the status-messages gap on AU. After this PR:
// status-messages covered on JP/LATAM/CA/EU/US/AU; GCC and SEA
// remain status-messages-uncovered.

const LIVE_REGION =
  '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]';

test.beforeEach(async ({ context }) => {
  // Skip Klaro consent banner so it doesn't steal focus from
  // the search modal on first page load.
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

test.describe('AU — WCAG 4.1.3 Status Messages on CommandPalette ⌘K (per AU product catalog)', () => {
  test('live region exists in the modal dialog (persistent, attached on open)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    await expect(region).toHaveCount(1);
    await expect(region).toHaveText('');
  });

  test('typing "blackmores" matches at least 1 result on AU (AU-only catalog anchor)', async ({ page }) => {
    await openPalette(page);
    const region = page.locator(LIVE_REGION);
    // "blackmores" is the AU-specific catalog probe. The product is
    // in products-au.ts (Blackmores ANZ-only); a search for it must
    // produce a positive count on AU. On US/JP/EU/LATAM/CA/GCC/SEA,
    // this same query would return "No results for blackmores" — the
    // AU-only inclusion is the regression guard.
    await page.keyboard.type('blackmores');
    await expect(region).toHaveText(/^\d+ results?$/);
    // Negative: should never become the no-results string on AU.
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
