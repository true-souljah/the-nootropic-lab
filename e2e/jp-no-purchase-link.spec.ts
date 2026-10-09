import { test, expect } from '@playwright/test';

// Site-owner decision 2026-10-08: the Japanese edition shows no purchase link
// for products whose formula contains an ingredient from a plant on Japan's
// MHLW list of ingredients used exclusively as medicines
// (https://www.mhlw.go.jp/content/001734637.pdf). Hunter Focus contains
// Ashwagandha (KSM-66, Withania somnifera — listed as ウィザニア・ソムニフェラ,
// 全草). The product keeps its review page and list positions; every buy CTA
// renders the notice instead (Product.noPurchaseLink, purchaseUrl()).
// Unit twin: packages/ui/src/purchase-link.test.ts.

const REVIEW = '/hunter-focus-review/';
const VENDOR_LINK = 'a[href^="https://www.hunterevolve.com"]';
const MHLW_PDF = 'https://www.mhlw.go.jp/content/001734637.pdf';
const JA_LINE = '日本では医薬品として扱われる原料を含む可能性があるため、本サイトでは購入リンクを掲載しません。';

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

test.describe('JP no purchase link: Hunter Focus', () => {
  test('review page shows the notice (English + Japanese line + MHLW source)', async ({ page }) => {
    const res = await page.goto(REVIEW);
    expect(res?.status()).toBe(200);
    const notice = page.locator('#no-purchase-link[role="note"]');
    await expect(notice).toBeVisible();
    await expect(notice).toContainText('No purchase link in Japan');
    await expect(notice).toContainText('Ashwagandha (Withania somnifera)');
    await expect(notice).toContainText('Ministry of Health, Labour and Welfare (MHLW)');
    await expect(notice.locator('[lang="ja"]')).toHaveText(JA_LINE);
    await expect(notice.locator(`a[href="${MHLW_PDF}"]`)).toBeVisible();
  });

  test('review page renders no buy link; the CTA slots carry the label', async ({ page }) => {
    // Status first: an error page would trivially satisfy the absence checks.
    const res = await page.goto(REVIEW);
    expect(res?.status()).toBe(200);
    await expect(page.locator(VENDOR_LINK)).toHaveCount(0);
    await expect(page.locator('a[rel~="sponsored"]')).toHaveCount(0);
    // Full notice + hero CTA slot + the Pricing tab's one-time card.
    await expect(page.locator('[data-no-purchase-link="jp-mhlw-medicine-only-ingredient"]')).toHaveCount(3);
    // Links-only decision: the review stays and the Trustpilot review link stays.
    await expect(page.getByRole('heading', { level: 1, name: 'Hunter Focus' })).toBeVisible();
  });

  test('/best-nootropics/ keeps the Hunter Focus row but shows the label instead of "Visit"', async ({ page }) => {
    const res = await page.goto('/best-nootropics/');
    expect(res?.status()).toBe(200);
    await expect(page.locator(`main a[href="${REVIEW}"]`).first()).toBeVisible();
    await expect(page.locator(VENDOR_LINK)).toHaveCount(0);
    await expect(page.locator('[data-no-purchase-link]')).toHaveCount(1);
    await expect(page.locator('[data-no-purchase-link]')).toHaveText('No purchase link in Japan');
    // The gate is per product: the other picks still link.
    expect(await page.locator('a[rel~="sponsored"]').count()).toBeGreaterThan(0);
  });

  test('/best-nootropics-for-focus/ pick #2 shows the full notice instead of its CTA', async ({ page }) => {
    const res = await page.goto('/best-nootropics-for-focus/');
    expect(res?.status()).toBe(200);
    await expect(page.locator('#pick-hunter-focus-review')).toBeVisible();
    await expect(page.locator(VENDOR_LINK)).toHaveCount(0);
    const notice = page.locator('[role="note"][data-no-purchase-link]');
    await expect(notice).toHaveCount(1);
    await expect(notice).toBeVisible();
    await expect(notice.locator('[lang="ja"]')).toHaveText(JA_LINE);
    expect(await page.locator('a[rel~="sponsored"]').count()).toBeGreaterThan(0);
  });

  for (const route of ['/ja/best-nootropics/', '/ja/hikaku/']) {
    test(`${route} comparison table shows the label instead of the Hunter Focus link`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator(VENDOR_LINK)).toHaveCount(0);
      // Desktop row + mobile card (one of the two is hidden by breakpoint).
      await expect(page.locator('[data-no-purchase-link]')).toHaveCount(2);
      expect(await page.locator('a[rel~="sponsored"]').count()).toBeGreaterThan(0);
    });
  }
});
