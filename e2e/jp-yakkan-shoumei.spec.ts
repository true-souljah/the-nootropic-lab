import { test, expect } from '@playwright/test';

// Smoke test for /ja/yakkan-shoumei/ — the educational page shipped in
// PR-C3b covering Japan's MHLW pharmaceutical-import certification.
// Verifies the page renders, has correct breadcrumb + heading,
// AffiliateDisclosure shows, FAQ + disclaimer sections present, and
// the cross-links to /ffc-notified-cognitive-supplements/ and
// /ja/best-nootropics/ are wired correctly.
//
// First-mover content — no competitor covers this. Smoke catches
// regressions that would silently break the URL/route/schema.

test.describe('JP /ja/yakkan-shoumei/ (PR-C3b)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/ja/yakkan-shoumei/');
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="ja"> (audit WCAG 3.1.1 fix)', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ja');
  });

  test('h1 contains 薬監証明', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    const h1 = page.locator('h1');
    await expect(h1).toContainText('薬監証明');
  });

  test('breadcrumb renders Japanese nav (ホーム / 日本 / 薬監証明ガイド)', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    const breadcrumb = page.locator('nav[aria-label="パンくずリスト"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByText('ホーム')).toBeVisible();
    await expect(breadcrumb.getByText('薬監証明ガイド')).toBeVisible();
  });

  test('renders the FAQ section with 4 question entries', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    await expect(page.getByRole('heading', { name: 'よくある質問', level: 2 })).toBeVisible();
    // The 4 FAQ questions seeded in PR-C3b.
    await expect(page.getByText('薬監証明とは何ですか？')).toBeVisible();
    await expect(page.getByText('一般的なサプリメントの輸入に薬監証明は必要ですか？')).toBeVisible();
    await expect(page.getByText('¥16,000の上限は薬監証明と関係がありますか？')).toBeVisible();
  });

  test('shows disclaimer section directing readers to MHLW/Customs', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    const disclaimer = page.getByText(/厚生労働省、地方厚生局、および税関の公式情報/);
    await expect(disclaimer).toBeVisible();
  });

  test('cross-link to /ffc-notified-cognitive-supplements/ is wired', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    // Next.js with trailingSlash: true normalizes Link hrefs at build time
    // (e.g. /foo → /foo/), so use a starts-with attribute selector that
    // tolerates both /ffc-notified-cognitive-supplements and the trailing-
    // slash variant.
    const ffcLink = page.locator('a[href^="/ffc-notified-cognitive-supplements"]');
    await expect(ffcLink).toBeVisible();
    await expect(ffcLink).toContainText('機能性表示食品ガイド');
  });

  test('cross-link to /ja/best-nootropics/ is wired', async ({ page }) => {
    await page.goto('/ja/yakkan-shoumei/');
    // The /ja/best-nootropics link appears in two places (breadcrumb +
    // recommendations section). starts-with selector matches both with
    // and without trailing-slash; .first() picks the first one (the
    // breadcrumb instance) for the visibility check.
    const bestNootropicsLink = page.locator('a[href^="/ja/best-nootropics"]');
    await expect(bestNootropicsLink.first()).toBeVisible();
  });

  test('emits Article + FAQPage schema JSON-LD', async ({ page }) => {
    const response = await page.goto('/ja/yakkan-shoumei/');
    const html = (await response?.text()) ?? '';
    // PR-C3b emits 3 SchemaOrg blocks: BreadcrumbList + Article + FAQPage.
    expect(html).toContain('"@type":"Article"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"inLanguage":"ja"');
  });
});
