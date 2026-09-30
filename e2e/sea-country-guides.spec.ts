import { test, expect } from '@playwright/test';

// Smoke for the SEA standalone country guides /nootropics-in-thailand/ and
// /nootropics-in-the-philippines/ (built from the 2026-09-30 sourced fact
// sheets). Proves each page renders its H1 and Sources, carries no FAQPage
// JSON-LD, that every internal link on the page resolves, and that the guide
// link renders on its own /countries/<slug>/ page but not on other countries.

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

const guides = [
  {
    path: '/nootropics-in-thailand/',
    h1: 'Nootropics in Thailand',
    country: '/countries/thailand/',
    mustContain: '15 pieces',
  },
  {
    path: '/nootropics-in-the-philippines/',
    h1: 'Nootropics in the Philippines',
    country: '/countries/philippines/',
    mustContain: 'NO APPROVED THERAPEUTIC CLAIMS',
  },
];

for (const g of guides) {
  test.describe(`SEA ${g.path}`, () => {
    test('renders h1, key fact, sources and no FAQPage', async ({ page }) => {
      const response = await page.goto(g.path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(g.h1);
      await expect(page.locator('main')).toContainText(g.mustContain);
      await expect(page.locator('main details summary', { hasText: 'Sources' })).toBeVisible();
      expect(await page.locator('main details[open] ul li a[href^="https://"]').count()).toBeGreaterThanOrEqual(6);
      await expect(page.locator('script[type="application/ld+json"]', { hasText: 'FAQPage' })).toHaveCount(0);
    });

    test('internal links resolve', async ({ page, request }) => {
      await page.goto(g.path);
      const hrefs = await page
        .locator('main a[href^="/"]')
        .evaluateAll(els => Array.from(new Set(els.map(el => (el as HTMLAnchorElement).getAttribute('href') ?? ''))));
      expect(hrefs.length).toBeGreaterThan(5);
      for (const href of hrefs) {
        const res = await request.get(href);
        expect(res.status(), href).toBe(200);
      }
    });

    test('is linked from its country page and /best-nootropics/', async ({ page }) => {
      for (const path of [g.country, '/best-nootropics/']) {
        await page.goto(path);
        await expect(page.locator(`main a[href="${g.path}"]`).first()).toBeVisible();
      }
    });
  });
}

test('other country pages carry no guide link', async ({ page }) => {
  await page.goto('/countries/singapore/');
  for (const g of guides) {
    await expect(page.locator(`main a[href="${g.path}"]`)).toHaveCount(0);
  }
});
