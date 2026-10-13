import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Pricing tab = the vendor's own terms only (site-owner decision 2026-10-07).
// The tab used to promise "Lowest available price", "Cancel anytime", "Free
// shipping", "In-account, no email" and a "Brand-direct guarantee" for every
// product, plus a one-time price invented as monthly × 1.15. It now quotes
// Product.vendorTerms verbatim, each attributed "Per <domain>, checked <date>"
// with a link to the vendor page. Unit guards: packages/ui/src/vendor-terms.test.ts.
// Since 2026-10-12 the one-time price quote is not shown: the price is the
// store price (the linked store's own), attributed the same way
// (packages/ui/src/pricing-tab-store-price.test.ts).

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

async function openPricing(page: import('@playwright/test').Page, path: string) {
  await page.goto(path);
  await page.getByRole('tab', { name: 'Pricing' }).click();
  const panel = page.locator('#product-panel-pricing');
  await expect(panel).toBeVisible();
  return panel;
}

test.describe('US Pricing tab — vendor-stated terms', () => {
  test('/mind-lab-pro-review/ quotes the vendor verbatim with a dated, linked source', async ({ page }) => {
    const panel = await openPricing(page, '/mind-lab-pro-review/');
    await expect(panel.getByRole('heading', { name: 'What the vendor’s site says' })).toBeVisible();
    await expect(panel.locator('[data-vendor-term]')).toHaveCount(3);
    await expect(panel.locator('[data-vendor-term="oneTimePrice"]')).toHaveCount(0);
    const storeSource = panel.locator('[data-store-price-source]');
    await expect(storeSource).toContainText('Per mindlabpro.com (opens in new tab), checked Oct 9, 2026');
    await expect(storeSource.getByRole('link', { name: 'mindlabpro.com (opens in new tab)' })).toHaveAttribute(
      'href',
      'https://www.mindlabpro.com/products/mind-lab-pro',
    );

    const shipping = panel.locator('[data-vendor-term="shipping"]');
    await expect(shipping.getByRole('heading', { name: 'Shipping' })).toBeVisible();
    await expect(shipping.locator('blockquote')).toHaveText(
      'Standard Shipping: 4 - 8 business days ($9.95 | FREE on orders over $100 and all subscriptions)',
    );
    // English quote on an English page: no lang override.
    await expect(shipping.locator('blockquote')).not.toHaveAttribute('lang', /.+/);
    // Text content carries the link's screen-reader cue: "Per <domain> (opens in new tab), checked <date>".
    await expect(shipping).toContainText('Per mindlabpro.com (opens in new tab), checked Oct 7, 2026');

    const source = shipping.getByRole('link', { name: 'mindlabpro.com (opens in new tab)' });
    await expect(source).toHaveAttribute('href', 'https://www.mindlabpro.com/pages/shipping-returns');
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toHaveAttribute('rel', 'nofollow noopener');

    await expect(panel.locator('[data-vendor-term="guarantee"]').getByRole('heading')).toHaveText('Money-back guarantee');
  });

  test('/mind-lab-pro-review/ no longer carries the fixed promises', async ({ page }) => {
    const panel = await openPricing(page, '/mind-lab-pro-review/');
    for (const removed of ['Lowest available price', 'In-account, no email', 'Brand-direct guarantee', 'Best price', 'Buy single bottle']) {
      await expect(panel).not.toContainText(removed);
    }
  });

  test('/mind-lab-pro-review/ open Pricing panel has no serious or critical axe violations (WCAG 2.1 AA)', async ({ page }) => {
    await openPricing(page, '/mind-lab-pro-review/');
    const results = await new AxeBuilder({ page })
      .include('#product-panel-pricing')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blockers = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(blockers.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });

  test('/hunter-focus-review/ labels an unopened-only policy "Returns" and shows no cancellation term', async ({ page }) => {
    const panel = await openPricing(page, '/hunter-focus-review/');
    await expect(panel.locator('[data-vendor-term="guarantee"]').getByRole('heading')).toHaveText('Returns');
    await expect(panel.locator('[data-vendor-term="guarantee"] blockquote')).toContainText('unused, unopened, still sealed');
    await expect(panel.locator('[data-vendor-term="cancellation"]')).toHaveCount(0);
  });
});

// Per serving / per day (2026-10-12): derived from the vendor's own pack,
// supply and directions wording only; per day needs a stated supply length or
// a plain daily dose. Expected strings = the priceText table in
// packages/ui/src/store-price.test.ts (exact baseline of every record).
test.describe('US Pricing tab — store price per serving / per day and its source', () => {
  test('/hunter-focus-review/ shows both figures (per day from "take 6 a day") and the dated, linked store page', async ({ page }) => {
    const panel = await openPricing(page, '/hunter-focus-review/');
    await expect(panel.locator('[data-store-price-per-unit]')).toHaveText('≈ $3/serving · ≈ $3/day');
    const source = panel.locator('[data-store-price-source]');
    await expect(source).toHaveText('Per hunterevolve.com (opens in new tab), checked Oct 9, 2026');
    const link = source.getByRole('link', { name: 'hunterevolve.com (opens in new tab)' });
    await expect(link).toHaveAttribute('href', 'https://www.hunterevolve.com/en-us/hunter-focus');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'nofollow noopener');
    await expect(source.locator('time')).toHaveAttribute('datetime', '2026-10-09');
  });

  for (const [path, perUnit] of [
    ['/brainmd-brain-memory-power-boost-review/', '≈ $2.17/serving · ≈ $2.17/day'], // "Take 4 capsules daily", 1 Unit × 30 servings
    ['/noocube-review/', '≈ $2.17/serving · ≈ $2.17/day'], // per day from "1-MONTH SUPPLY"
    ['/mind-lab-pro-review/', '≈ $2.30/serving'], // "Take 2 to 4 capsules": a range, no per day
  ] as const) {
    test(`${path} per-unit line reads "${perUnit}"`, async ({ page }) => {
      const panel = await openPricing(page, path);
      await expect(panel.locator('[data-store-price-per-unit]')).toHaveText(perUnit);
    });
  }

  test('/pre-lab-pro-review/ (taken before exercise) shows per serving only, and no per-month figure', async ({ page }) => {
    const panel = await openPricing(page, '/pre-lab-pro-review/');
    await expect(panel.locator('[data-store-price-per-unit]')).toHaveText('≈ $2.95/serving');
    await expect(panel.locator('[data-store-price-pack]')).toHaveText('Servings per container: 20');
  });
});
