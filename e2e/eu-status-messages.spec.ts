import { test, expect } from '@playwright/test';

// WCAG 4.1.3 Status Messages on EU nested-locale landings. Brings EU
// to parity with LATAM (Q30 #94), CA (Q30), JP (Q31 #95), and US
// (Q28 #92).
//
// Why 3 locale-specific cases here instead of one: EU is the only
// covered region with 3 nested locales (de, fr, pt). Each renders
// CommandPalette with a different `uiStrings` bundle:
//
//   /de/ → search-de.ts → de.search.liveRegion.*
//   /fr/ → search-fr.ts → fr.search.liveRegion.*
//   /pt/ → search-pt.ts → pt.search.liveRegion.*
//
// All 3 plumbing chains were shipped in PR-Q29 (#93) and unit-tested
// by i18n.test.ts; this spec is the e2e browser confirmation that
// each chain delivers the right phrasing at the DOM level.
//
// PR-Q35 #99.

const LIVE_REGION = '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]';

test.beforeEach(async ({ context }) => {
  // Skip Klaro consent banner so it doesn't steal focus from the
  // search modal on first page load.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('EU /de/ CommandPalette aria-live announcements in German', () => {
  test('typing a non-matching query announces "Keine Ergebnisse für X"', async ({ page }) => {
    await page.goto('/de/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(LIVE_REGION);
    await expect(region).toHaveCount(1);
    await page.keyboard.type('xyzqq');
    // German phrasing from de.search.liveRegion.noResults.
    await expect(region).toHaveText('Keine Ergebnisse für xyzqq');
    // Negative: never the English string.
    await expect(region).not.toHaveText(/No results for/);
  });

  test('typing a matching query announces "{n} Ergebnis(se)" (German plural)', async ({ page }) => {
    await page.goto('/de/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(LIVE_REGION);
    await page.keyboard.type('mind');
    // Match singular "Ergebnis" (count = 1) OR plural "Ergebnisse" (count > 1).
    await expect(region).toHaveText(/^\d+ Ergebniss?e?$/);
    await expect(region).not.toHaveText(/results?$/);
  });
});

test.describe('EU /fr/ CommandPalette aria-live announcements in metropolitan French', () => {
  test('typing a non-matching query announces "Aucun résultat pour X"', async ({ page }) => {
    await page.goto('/fr/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(LIVE_REGION);
    await expect(region).toHaveCount(1);
    await page.keyboard.type('xyzqq');
    await expect(region).toHaveText('Aucun résultat pour xyzqq');
    await expect(region).not.toHaveText(/No results for/);
  });

  test('typing a matching query announces "{n} résultat(s)"', async ({ page }) => {
    await page.goto('/fr/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(LIVE_REGION);
    await page.keyboard.type('mind');
    await expect(region).toHaveText(/^\d+ résultats?$/);
    await expect(region).not.toHaveText(/results?$/);
  });
});

test.describe('EU /pt/ CommandPalette aria-live announcements in Portuguese', () => {
  test('typing a non-matching query announces "Nenhum resultado para X"', async ({ page }) => {
    await page.goto('/pt/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(LIVE_REGION);
    await expect(region).toHaveCount(1);
    await page.keyboard.type('xyzqq');
    await expect(region).toHaveText('Nenhum resultado para xyzqq');
    await expect(region).not.toHaveText(/No results for/);
  });

  test('typing a matching query announces "{n} resultado(s)"', async ({ page }) => {
    await page.goto('/pt/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const region = page.locator(LIVE_REGION);
    await page.keyboard.type('mind');
    await expect(region).toHaveText(/^\d+ resultados?$/);
    await expect(region).not.toHaveText(/results?$/);
  });
});
