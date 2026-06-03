import { test, expect } from '@playwright/test';

// WCAG 4.1.3 Status Messages on JP. Companion to e2e/us-status-messages
// (PR-Q28 #92) and e2e/latam-guides.spec.ts + e2e/ca-fr-chrome.spec.ts
// live-region blocks (PR-Q30 #94).
//
// Verifies that PR-Q29's localized strings.search.liveRegion bundle
// actually renders in the browser on JP routes. Japanese is the most
// distinct of the 7 locales (different script, no spaces between
// words, full-width characters); if the i18n plumbing has a script-
// specific bug, JP is the most likely to surface it.
//
// PR-Q31 #95.

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

test.describe('JP CommandPalette aria-live announcements in Japanese (PR-Q29 #93 + PR-Q31 #95)', () => {
  test('typing a non-matching query announces "{query}に一致する結果はありません"', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(
      '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]',
    );
    await expect(region).toHaveCount(1);
    await page.keyboard.type('xyzqq');
    // Japanese phrasing from packages/data/src/i18n.ts ja.search.liveRegion.noResults.
    await expect(region).toHaveText('xyzqqに一致する結果はありません');
    // Negative: never the English fallback.
    await expect(region).not.toHaveText(/No results for/);
  });

  test('typing a matching query announces "{n}件の結果" (Japanese count suffix)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(
      '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]',
    );
    await page.keyboard.type('mind');
    // ja matches "N件の結果" for both singular and plural (Japanese has
    // no grammatical plural; oneResult AND manyResults both use this
    // pattern with the count substituted in).
    await expect(region).toHaveText(/^\d+件の結果$/);
    await expect(region).not.toHaveText(/results?$/);
  });
});
