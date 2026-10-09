import { test, expect } from '@playwright/test';

// EU Pricing tab: in the eu/gcc/latam evidence file " | " joins separate page
// fragments (packages/data/evidence/vendor-terms-2026-10/manifest.json), so a
// quote renders one fragment per line inside one blockquote, with no literal
// " | ". A German vendor quote on this English page carries lang="de".
// Literal pipes from the vendor's own page stay (US spec, Mind Lab Pro shipping).

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

test('/brainzyme-focus-pro-review/ renders joined fragments as separate lines', async ({ page }) => {
  await page.goto('/brainzyme-focus-pro-review/');
  await page.getByRole('tab', { name: 'Pricing' }).click();
  const panel = page.locator('#product-panel-pricing');
  await expect(panel).toBeVisible();

  const shipping = panel.locator('[data-vendor-term="shipping"] blockquote p');
  await expect(shipping).toHaveText([
    'Germany: 2-3 working days',
    'Austria & Switzerland: 3-5 working days',
    'France: 2-3 working days',
    'Belgium & Switzerland: 3-5 working days',
  ]);

  const price = panel.locator('[data-vendor-term="oneTimePrice"] blockquote');
  await expect(price).toHaveAttribute('lang', 'de');
  await expect(price.locator('p')).toHaveText(['1 MONAT: 2 Packs, 60 Kapseln', '31,75 €']);
  const quotes = await panel.locator('blockquote').allTextContents();
  expect(quotes).toHaveLength(4);
  for (const quote of quotes) expect(quote).not.toContain(' | ');
});
