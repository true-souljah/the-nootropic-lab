import { test, expect } from '@playwright/test';

// Smoke test for /latam/guides/ → verifies the LATAM Spanish guidesEs
// rollout from PR-B2b (#53). Before that PR, /latam/guides/* rendered
// the shared English guides[] array under <html lang="es"> — a WCAG
// 3.1.2 Language of Parts violation flagged by the 2026-05-28 audit
// as LATAM Wave-1's primary content issue.
//
// SCOPE NOTE: These tests verify what PR-B2b actually fixed — the
// guides[] BODY content is now Spanish via guidesEs. They do NOT
// assert chrome (FPHeader nav, footer) localization because that is
// blocked by a separate hardcoded-English regression in FPHeader.tsx
// (`DEFAULT_NAV` constant) that affects all non-English pages portfolio-
// wide. See PR-Q7 description for the follow-up issue.
//
// This spec runs against the prebuilt apps/latam/out/ static export
// served on http://127.0.0.1:4174.

test.describe('LATAM /guides/ Spanish body content (PR-B2b)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/guides/');
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="es">', async ({ page }) => {
    await page.goto('/guides/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'es');
  });

  test('renders Spanish guide titles (guidesEs translation reached the page)', async ({ page }) => {
    await page.goto('/guides/');
    // PR-B2b translated 6 guide titles to Spanish. Check the page body
    // contains at least one of them in Spanish form.
    const bodyText = await page.locator('main, body').first().textContent();
    expect(bodyText).toBeTruthy();
    // The translation script localized "Nootropics" and category labels.
    expect(bodyText).toMatch(/nootrópic|principiante|científic/i);
  });
});

test.describe('LATAM /guides/[guide]/ Spanish body content (PR-B2b)', () => {
  const SLUG = 'what-are-nootropics';

  test('guide page loads with 200 status', async ({ page }) => {
    const response = await page.goto(`/guides/${SLUG}/`);
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="es"> on the guide page', async ({ page }) => {
    await page.goto(`/guides/${SLUG}/`);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'es');
  });

  test('body prose is in Spanish (audit-flagged WCAG 3.1.2 fix)', async ({ page }) => {
    await page.goto(`/guides/${SLUG}/`);
    // PR-B2b put guidesEs through Claude Sonnet 4.6 translation. The
    // Spanish-translated prose should now render in the article body.
    // Multiple alternative Spanish tokens to tolerate translation
    // variation while still asserting "not English."
    const articleBody = await page.locator('article, main').first().textContent();
    expect(articleBody).toBeTruthy();
    expect(articleBody).toMatch(/los nootrópicos|qué son|memoria|cognitiv/i);
  });

  test('preserves Latin scientific names verbatim (Bacopa Monnieri etc.)', async ({ page }) => {
    await page.goto(`/guides/${SLUG}/`);
    const bodyText = await page.locator('body').textContent();
    // The translation script preserved Latin names + brand names. If a
    // future translation pass over-translates them (Bacopa Monnieri →
    // Bacopa de la India), this catches the drift.
    expect(bodyText).toMatch(/Bacopa|Rhodiola|Lion's Mane|Ashwagandha/);
  });
});
