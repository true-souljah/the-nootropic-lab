import { test, expect } from '@playwright/test';

// EU Pricing tab: in the eu/gcc/latam evidence file " | " joins separate page
// fragments (packages/data/evidence/vendor-terms-2026-10/manifest.json), so a
// quote renders one fragment per line inside one blockquote, with no literal
// " | ". German vendor text on this English page carries lang="de": since
// 2026-10-12 that is the store price's pack text (the one-time price quote is
// no longer shown; the store price carries the price).
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

  await expect(panel.locator('[data-vendor-term="oneTimePrice"]')).toHaveCount(0);
  const pack = panel.locator('[data-store-price-pack] span[lang="de"]');
  await expect(pack).toHaveText('1 MONAT: 2 Packs, 60 Kapseln');
  const quotes = await panel.locator('blockquote').allTextContents();
  expect(quotes).toHaveLength(3);
  for (const quote of quotes) expect(quote).not.toContain(' | ');
});

// Per serving / per day (2026-10-12), in the store's own currency. Expected
// strings = the priceText table in packages/ui/src/store-price.test.ts.
test('/brainzyme-focus-pro-review/ shows per serving and per day ("1 MONAT") with the dated store page', async ({ page }) => {
  await page.goto('/brainzyme-focus-pro-review/');
  await page.getByRole('tab', { name: 'Pricing' }).click();
  const panel = page.locator('#product-panel-pricing');
  await expect(panel.locator('[data-store-price-per-unit]')).toHaveText('≈ €1.06/serving · ≈ €1.06/day');
  const source = panel.locator('[data-store-price-source]');
  await expect(source).toHaveText('Per brainzyme.de (opens in new tab), checked Oct 9, 2026');
  await expect(source.getByRole('link')).toHaveAttribute('href', 'https://www.brainzyme.de/products/brainzyme-professional');
});

test('/pre-lab-pro-review/ shows per serving only (taken before exercise)', async ({ page }) => {
  await page.goto('/pre-lab-pro-review/');
  await page.getByRole('tab', { name: 'Pricing' }).click();
  await expect(page.locator('#product-panel-pricing [data-store-price-per-unit]')).toHaveText('≈ €2.25/serving');
});
