import { test, expect } from '@playwright/test';

// Geo hub smoke for the CA app — added after the 2026-09 audit found the
// /provinces/ guides reachable only from sitemap.ts (Google: "URL is unknown").
// Proves the hub renders, links every geo page with a trailing slash, and
// is itself linked from the home page.

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

test.describe('CA /provinces/ geo hub', () => {
  test('hub returns 200 and lists every geo guide with a trailing-slash href', async ({ page }) => {
    const response = await page.goto('/provinces/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Best Nootropics by Province');
    const hrefs = await page.locator('main a[href^="/provinces/"]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('href') ?? ''),
    );
    expect(hrefs).toHaveLength(10);
    for (const href of hrefs) expect(href).toMatch(/^\/provinces\/[a-z-]+\/$/);
  });

  test('home page links to the hub and to individual geo guides', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a[href="/provinces/"]')).toHaveCount(1);
    const guides = await page.locator('main a[href^="/provinces/"]').count();
    expect(guides).toBeGreaterThan(1);
  });

  test('first geo guide still resolves', async ({ page }) => {
    await page.goto('/provinces/');
    const first = await page.locator('main a[href^="/provinces/"]').first().getAttribute('href');
    const response = await page.goto(first!);
    expect(response?.status()).toBe(200);
  });
});
