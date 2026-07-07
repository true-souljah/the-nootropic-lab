import { test, expect } from '@playwright/test';

// Smoke test for the regulatory chip rendering on FANCL BRAINs review.
// This page is the highest-value chip-coverage test for JP because it's
// the only JP product currently marked `ffcStatus: { notified: true }`,
// so it's the only page that emits the "機能性表示食品" chip from PR-D1.
//
// What this test verifies (chain of audit fixes):
// - PR-C3 (#46) set apps/jp/src/app/layout.tsx → getStrings('ja')
// - PR-B3 (#43) extracted ProductDetail chrome to UIStrings with
//   productDetail.chips.ffcNotified key
// - PR-C3 (#46) added FANCL BRAINs ffcStatus: { notified: true } in
//   products-jp.ts
// - PR-D1 (#49) wired ProductDetail to render the chip conditionally
//   on ffcStatus.notified === true with pd.chips.ffcNotified text
// - PR-D3 (#51) added Japanese productDetail.chips.ffcNotified =
//   '機能性表示食品'
//
// If any link in this chain breaks (locale fallback, missing chip
// wiring, ffcStatus typo, etc.), this test catches it.

test.describe('JP /fancl-brains-review/ regulatory chips (PR-D1 + PR-C3)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/fancl-brains-review/');
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="ja">', async ({ page }) => {
    await page.goto('/fancl-brains-review/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ja');
  });

  test('shows the 機能性表示食品 (FFC notified) chip in the header card', async ({ page }) => {
    await page.goto('/fancl-brains-review/');
    // The chip is rendered as text content inside a <Chip tone="good">
    // primitive. The role="group" landmark from PR-D1 wraps the chip
    // cluster.
    const chipGroup = page.locator('div[role="group"]').first();
    await expect(chipGroup).toBeVisible();
    await expect(chipGroup.getByText('機能性表示食品')).toBeVisible();
  });

  test('chip group aria-label is in Japanese (PR-D3 localization)', async ({ page }) => {
    await page.goto('/fancl-brains-review/');
    // PR-D3 localized the chip group aria-label via uiStrings.productDetail.chipGroupLabel.
    const chipGroup = page.locator('div[role="group"][aria-label="製品の属性"]');
    await expect(chipGroup).toBeVisible();
  });

  test('Product schema JSON-LD emits with Review block (always-on)', async ({ page }) => {
    const response = await page.goto('/fancl-brains-review/');
    const html = (await response?.text()) ?? '';
    expect(html).toContain('"@type":"Product"');
    expect(html).toContain('"@type":"Review"');
  });

  test('AggregateRating is OMITTED (no third-party aggregateRating, audit OPT-2)', async ({ page }) => {
    const response = await page.goto('/fancl-brains-review/');
    const html = (await response?.text()) ?? '';
    // Audit OPT-2 (2026-07-07) dropped the third-party Trustpilot
    // aggregateRating entirely (Google May-2024 review-snippet policy);
    // buildProductSchema now emits the first-party editorial Review only.
    // No product page should contain AggregateRating.
    expect(html).not.toContain('"@type":"AggregateRating"');
  });
});
