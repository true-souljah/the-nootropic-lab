import { test, expect } from '@playwright/test';

// Smoke test for the highest-risk migrated surface: JP /ingredients/[slug]/.
// This route was migrated from a 388-line LegacyShell inline page to the
// shared IngredientDetail template in PR #21, and PR #18 + #26 wired up the
// Japanese translations for breadcrumb + section headings. If anything in
// that chain regresses, this test catches it before deploy.
//
// Uses `l-theanine` because it's present in the shared ingredients catalog
// for every region (no LATAM-only or US-only edge case).

const INGREDIENT_SLUG = 'l-theanine';

test.describe('JP /ingredients/[slug] (post-migration smoke)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    expect(response?.status()).toBe(200);
  });

  test('renders new chrome (FPHeader role=banner + FPFooter role=contentinfo)', async ({ page }) => {
    await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();
  });

  test('breadcrumb renders Japanese strings (uiStrings.breadcrumb)', async ({ page }) => {
    await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    // PR #18 added breadcrumb translations; PR #21 migrated the route to
    // IngredientDetail which consumes them. PR-Q10 (#74) also localized the
    // landmark aria-label itself — the Japanese name is "パンくずリスト".
    // If either regressed, the breadcrumb would render in English.
    const breadcrumb = page.locator('nav[aria-label="パンくずリスト"]');
    await expect(breadcrumb.getByText('ホーム')).toBeVisible();
    await expect(breadcrumb.getByText('成分')).toBeVisible();
  });

  test('section headings render Japanese (uiStrings.ingredientDetail.sections)', async ({ page }) => {
    await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    // PR #26 added these translations; the template consumes them via
    // uiStrings.ingredientDetail.sections.
    await expect(page.getByRole('heading', { name: '作用機序', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: '臨床エビデンスの概要', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: '摂取方法', level: 2 })).toBeVisible();
  });

  test('skip link is the first interactive element (a11y PR #27)', async ({ page }) => {
    await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    // PR #27 added a skip link to IngredientDetail. Tab once from page load,
    // the focused element should be the skip link.
    const skipLink = page.locator('a.ds-skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('hreflang link tags emit all 8 region alternates', async ({ page }) => {
    const response = await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    const html = (await response?.text()) ?? '';

    // PR #14 wired buildAlternates → languages map. All 8 regions should
    // be present plus x-default. A regression in the seo.ts helper would
    // drop one or more of these.
    expect(html).toContain('hrefLang="en-US"');
    expect(html).toContain('hrefLang="en-GB"');
    expect(html).toContain('hrefLang="en-CA"');
    expect(html).toContain('hrefLang="en-AU"');
    expect(html).toContain('hrefLang="ja-JP"');
    expect(html).toContain('hrefLang="es-419"');
    expect(html).toContain('hrefLang="en-AE"');
    expect(html).toContain('hrefLang="en-SG"');
    expect(html).toContain('hrefLang="x-default"');
  });

  test('og:image meta tag points at the JP region OG image', async ({ page }) => {
    const response = await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    const html = (await response?.text()) ?? '';
    // PR #19 added per-region opengraph-image.tsx; PR #19's helper update
    // wires the URL into buildOpenGraph for pages that use it.
    expect(html).toMatch(/<meta property="og:image" content="https:\/\/jp\.thenootropiclab\.com\/opengraph-image/);
  });

  test('canonical URL matches the JP region domain', async ({ page }) => {
    const response = await page.goto(`/ingredients/${INGREDIENT_SLUG}/`);
    const html = (await response?.text()) ?? '';
    expect(html).toContain(`<link rel="canonical" href="https://jp.thenootropiclab.com/ingredients/${INGREDIENT_SLUG}/"/>`);
  });
});
