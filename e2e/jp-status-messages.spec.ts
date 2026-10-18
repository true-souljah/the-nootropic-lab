import { test, expect } from '@playwright/test';

// WCAG 4.1.3 Status Messages on JP. Companion to e2e/us-status-messages
// (PR-Q28 #92) and e2e/latam-guides.spec.ts + e2e/ca-fr-chrome.spec.ts
// live-region blocks (PR-Q30 #94).
//
// Verifies that PR-Q29's localized strings.search.liveRegion bundle
// actually renders in the browser on JP routes. Since 2026-10-13 the JP
// host renders the en bundle (Japanese copy paused pending legal advice),
// so the announcements are English and never the ja phrasing.
//
// PR-Q31 #95.

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

test.describe('JP CommandPalette aria-live announcements in English (PR-Q29 #93 + PR-Q31 #95)', () => {
  test('typing a non-matching query announces "No results for {query}"', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(
      '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]',
    );
    await expect(region).toHaveCount(1);
    await page.keyboard.type('xyzqq');
    // en phrasing from packages/data/src/i18n.ts en.search.liveRegion.noResults.
    await expect(region).toHaveText('No results for xyzqq');
  });

  test('typing a matching query announces "{n} results"', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(
      '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]',
    );
    await page.keyboard.type('mind');
    // en: "1 result" (oneResult) or "{n} results" (manyResults).
    await expect(region).toHaveText(/^\d+ results?$/);
  });
});
