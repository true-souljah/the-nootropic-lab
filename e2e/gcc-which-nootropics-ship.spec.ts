import { test, expect } from '@playwright/test';

// Smoke for the GCC /which-nootropics-ship-to-the-gcc/ page (brand-by-brand
// GCC shipping, sourced to each brand's own pages on 2026-09-29). Proves the
// page renders, carries the verdict box and the brand table with outbound
// source links, has no FAQPage JSON-LD, and is linked from /countries/, a
// country page and the halal guide.

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

test.describe('GCC /which-nootropics-ship-to-the-gcc/', () => {
  test('renders h1, verdict box, brand table and sources', async ({ page }) => {
    const response = await page.goto('/which-nootropics-ship-to-the-gcc/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Which nootropic brands ship to the GCC');

    const verdict = page.getByTestId('verdict-box');
    await expect(verdict).toBeVisible();
    await expect(verdict).toContainText('Mind Lab Pro');

    // One row per brand, each linking its review page.
    await expect(page.locator('main table tbody tr')).toHaveCount(7);
    await expect(page.locator('main a[href="/mind-lab-pro-review/"]').first()).toBeVisible();
    await expect(page.locator('main a[href="https://www.qualialife.com/faqs/do-we-ship-internationally"]').first()).toBeVisible();

    await expect(page.getByRole('note', { name: 'Affiliate disclosure' })).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]', { hasText: 'FAQPage' })).toHaveCount(0);
  });

  test('is linked from /countries/, a country page and the halal guide', async ({ page }) => {
    for (const path of ['/countries/', '/countries/uae/', '/halal-certified-nootropics/']) {
      await page.goto(path);
      await expect(page.locator('main a[href="/which-nootropics-ship-to-the-gcc/"]').first()).toBeVisible();
    }
  });
});
