import { test, expect } from '@playwright/test';

// Smoke for the JP /japanese-brain-supplements/ English explainer (target
// queries: "japanese vitamins/supplements for the brain", "japanese
// nootropics"). Proves the page renders, carries the Sources block, emits no
// FAQPage JSON-LD (retired portfolio-wide), every internal link resolves on
// the JP host, and it is linked from the FFC explainer.

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

test.describe('JP /japanese-brain-supplements/', () => {
  test('renders h1, Sources block and no FAQPage JSON-LD', async ({ page }) => {
    const response = await page.goto('/japanese-brain-supplements/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Japanese vitamins for the brain');

    const sources = page.locator('main details').filter({ hasText: 'Sources' });
    await expect(sources).toBeVisible();
    await expect(sources.locator('a[href^="https://www.caa.go.jp/"]').first()).toBeVisible();
    await expect(sources.locator('a[href="https://www.fancl.co.jp/healthy/item/5248a/"]')).toHaveCount(1);

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length).toBeGreaterThan(0);
    for (const block of jsonLd) {
      expect(block).not.toContain('FAQPage');
      expect(block).not.toContain('HowTo');
      expect(block).not.toContain('SpeakableSpecification');
    }
  });

  test('every internal link in the article resolves', async ({ page, request }) => {
    await page.goto('/japanese-brain-supplements/');
    const hrefs = await page
      .locator('main article a[href^="/"]')
      .evaluateAll(els => [...new Set(els.map(el => (el as HTMLAnchorElement).getAttribute('href')!.split('#')[0]))]);
    expect(hrefs).toEqual(expect.arrayContaining(['/ffc-notified-cognitive-supplements/', '/ja/yakkan-shoumei/', '/best-nootropics/']));
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test('is linked from the FFC explainer', async ({ page }) => {
    await page.goto('/ffc-notified-cognitive-supplements/');
    await expect(page.locator('main a[href="/japanese-brain-supplements/"]')).toHaveCount(1);
  });
});
