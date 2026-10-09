import { test, expect } from '@playwright/test';

// Discontinued products keep their review page, but the page must show the
// discontinued notice, render no affiliate link and no price stat, and the
// product must not be a best-of pick. Performance Lab Mind was discontinued on
// 2026-09-28 (Opti-Nutra merged it into Mind Lab Pro).
// Twin specs: au-discontinued-products.spec.ts, us-discontinued-products.spec.ts.

const REVIEW = '/performance-lab-mind-review/';

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

test.describe('EU discontinued product: /performance-lab-mind-review/', () => {
  test('review page shows the discontinued notice', async ({ page }) => {
    const res = await page.goto(REVIEW);
    expect(res?.status()).toBe(200);
    const notice = page.locator('aside[role="note"][aria-labelledby="product-discontinued-heading"]');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('Discontinued');
    await expect(notice).toContainText('merged Performance Lab Mind into Mind Lab Pro');
    await expect(notice.getByRole('link', { name: /successor/i })).toHaveAttribute('href', /\/mind-lab-pro-review\/?$/);
  });

  test('review page renders no affiliate link and no price stat', async ({ page }) => {
    // Status first: an error page would trivially satisfy the absence checks.
    const res = await page.goto(REVIEW);
    expect(res?.status()).toBe(200);
    await expect(page.locator('a[rel~="sponsored"]')).toHaveCount(0);
    await expect(page.locator('a[rel="nofollow sponsored noopener noreferrer"]')).toHaveCount(0);
    await expect(page.locator('main').getByText('Price', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('tab', { name: /pricing/i })).toHaveCount(0);
  });

  for (const listicle of ['/best-nootropics-for-focus/', '/best-nootropics-for-studying/']) {
    test(`product is not a pick on ${listicle}`, async ({ page }) => {
      const res = await page.goto(listicle);
      expect(res?.status()).toBe(200);
      await expect(page.locator(`a[href^="${REVIEW.replace(/\/$/, '')}"]`)).toHaveCount(0);
    });
  }
});
