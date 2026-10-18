import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// JP Pricing tab (site-owner decision 2026-10-07): every label comes from the
// page's uiStrings bundle, English since 2026-10-13 (Japanese copy on JP paused
// pending legal advice); the vendor's quotes keep their own language and are
// lang-marked when it differs from the page (FANCL's Japanese terms carry
// lang="ja"). A product with no verified terms shows a single English line
// instead. Unit guards: packages/ui/src/vendor-terms.test.ts.

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

test.describe('JP Pricing tab — localized labels around vendor quotes', () => {
  test('/fancl-brains-review/ renders English labels around FANCL’s own Japanese terms (lang="ja")', async ({ page }) => {
    const panel = await openPricing(page, '/fancl-brains-review/');
    await expect(panel.getByRole('heading', { name: 'What the vendor’s site says' })).toBeVisible();
    for (const label of ['Shipping', 'Cancelling a subscription', 'Money-back guarantee']) {
      await expect(panel.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
    // Since 2026-10-12 the price is the store price (attributed), not a one-time quote.
    await expect(panel.getByRole('heading', { name: 'One-time purchase price', exact: true })).toHaveCount(0);
    const storeSource = panel.locator('[data-store-price-source]');
    await expect(storeSource).toContainText('Per fancl.co.jp');
    await expect(storeSource).toContainText('checked Oct 9, 2026');
    const guarantee = panel.locator('[data-vendor-term="guarantee"]');
    await expect(guarantee.locator('blockquote')).toContainText('開封後でも返送料当社負担で返品を承ります');
    // The vendor's Japanese quote on an English page is marked as Japanese.
    await expect(guarantee.locator('blockquote')).toHaveAttribute('lang', 'ja');
    // Text content includes the link's screen-reader cue between the two parts.
    await expect(guarantee).toContainText('Per fancl.co.jp');
    await expect(guarantee).toContainText('checked Oct 7, 2026');
    await expect(guarantee.getByRole('link', { name: /^fancl\.co\.jp\s*\(opens in new tab\)$/ })).toHaveAttribute(
      'href',
      'https://www.fancl.co.jp/help/guide_1_4.html',
    );
  });

  test('/mind-lab-pro-review/ English vendor quotes on the English page carry no lang override', async ({ page }) => {
    const panel = await openPricing(page, '/mind-lab-pro-review/');
    const quotes = panel.locator('blockquote');
    await expect(quotes).toHaveCount(3);
    for (const quote of await quotes.all()) await expect(quote).not.toHaveAttribute('lang', /.+/);
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

  test('/suntory-dha-epa-sesamin-review/ (no verified terms) shows the English fallback line only', async ({ page }) => {
    const panel = await openPricing(page, '/suntory-dha-epa-sesamin-review/');
    await expect(panel).toContainText('We couldn’t verify this vendor’s terms. Check the vendor’s site for current terms.');
    await expect(panel.locator('blockquote')).toHaveCount(0);
  });
});

// Per serving / per day (2026-10-12) with English units (JP is English since
// 2026-10-13), in the store's own currency. Expected strings = the priceText
// table in packages/ui/src/store-price.test.ts (the yen sign may print as ￥ or ¥).
test.describe('JP Pricing tab — store price per serving / per day and its source', () => {
  test('/hunter-focus-review/ (no purchase link in Japan) names the store domain without a link', async ({ page }) => {
    const panel = await openPricing(page, '/hunter-focus-review/');
    await expect(panel.locator('[data-store-price-per-unit]')).toHaveText('≈ $3/serving · ≈ $3/day');
    const source = panel.locator('[data-store-price-source]');
    await expect(source).toHaveText('Per hunterevolve.com, checked Oct 9, 2026');
    await expect(source.locator('a')).toHaveCount(0);
    await expect(source.locator('time')).toHaveAttribute('datetime', '2026-10-09');
  });

  test('/suntory-dha-epa-sesamin-review/ shows per serving (a 240-capsule pack at 4 a serving) and per day', async ({ page }) => {
    const panel = await openPricing(page, '/suntory-dha-epa-sesamin-review/');
    await expect(panel.locator('[data-store-price-per-unit]')).toHaveText(/^≈ [￥¥]191\/serving · ≈ [￥¥]191\/day$/);
  });

  test('/fancl-brains-review/ shows per day from the 30-day pack and no per serving (the pack states no count)', async ({ page }) => {
    const panel = await openPricing(page, '/fancl-brains-review/');
    await expect(panel.locator('[data-store-price-per-unit]')).toHaveText(/^≈ [￥¥]183\/day$/);
  });
});
