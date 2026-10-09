import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// JP Pricing tab (site-owner decision 2026-10-07): every label comes from the
// ja uiStrings bundle; the vendor's quotes keep their own language and are
// lang-marked when it differs from the page (an English vendor quote on a
// Japanese page carries lang="en"). A product with no verified terms shows a
// single Japanese line instead. Unit guards: packages/ui/src/vendor-terms.test.ts.

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
  await page.getByRole('tab', { name: '価格' }).click();
  const panel = page.locator('#product-panel-pricing');
  await expect(panel).toBeVisible();
  return panel;
}

test.describe('JP Pricing tab — localized labels around vendor quotes', () => {
  test('/fancl-brains-review/ renders Japanese labels and FANCL’s own Japanese terms', async ({ page }) => {
    const panel = await openPricing(page, '/fancl-brains-review/');
    await expect(panel.getByRole('heading', { name: '販売元サイトの記載' })).toBeVisible();
    for (const label of ['配送', '定期購入の解約', '単品購入の価格', '返金保証']) {
      await expect(panel.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
    const guarantee = panel.locator('[data-vendor-term="guarantee"]');
    await expect(guarantee.locator('blockquote')).toContainText('開封後でも返送料当社負担で返品を承ります');
    // Japanese quote on a Japanese page: no lang override.
    await expect(guarantee.locator('blockquote')).not.toHaveAttribute('lang', /.+/);
    // Text content includes the link's screen-reader cue between the two parts.
    await expect(guarantee).toContainText('出典：fancl.co.jp');
    await expect(guarantee).toContainText('（2026年10月7日確認）');
    await expect(guarantee.getByRole('link', { name: /^fancl\.co\.jp\s*（新しいタブで開きます）$/ })).toHaveAttribute(
      'href',
      'https://www.fancl.co.jp/help/guide_1_4.html',
    );
  });

  test('/mind-lab-pro-review/ marks the English vendor quotes lang="en"', async ({ page }) => {
    const panel = await openPricing(page, '/mind-lab-pro-review/');
    const quotes = panel.locator('blockquote');
    await expect(quotes).toHaveCount(4);
    for (const quote of await quotes.all()) await expect(quote).toHaveAttribute('lang', 'en');
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

  test('/suntory-dha-epa-sesamin-review/ (no verified terms) shows the Japanese fallback line only', async ({ page }) => {
    const panel = await openPricing(page, '/suntory-dha-epa-sesamin-review/');
    await expect(panel).toContainText('この販売元の条件は確認できませんでした。最新の条件は販売元のサイトでご確認ください。');
    await expect(panel.locator('blockquote')).toHaveCount(0);
  });
});
