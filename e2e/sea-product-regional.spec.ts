import { test, expect } from '@playwright/test';

// "Buying in Southeast Asia" block on SEA product review pages (2026-09 audit
// follow-up): the Eu Yan Sang page must show its SEA distribution channels
// and its local buyer's guides, which no other host renders.

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

test.describe('SEA /eu-yan-sang-brainmax-review/ regional buying block', () => {
  test('renders the block with the SEA distribution channels and local guides', async ({ page }) => {
    const response = await page.goto('/eu-yan-sang-brainmax-review/');
    expect(response?.status()).toBe(200);
    const block = page.locator('#regional-buying');
    await expect(block).toBeVisible();
    await expect(block).toContainText('Where to buy');
    await expect(block).toContainText('euyansang.com.sg');
    await expect(block.locator('a[href="/countries/"]')).toHaveCount(1);
  });
});
