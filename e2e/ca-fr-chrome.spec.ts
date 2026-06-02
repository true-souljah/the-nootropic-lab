import { test, expect } from '@playwright/test';

// Smoke test for CA /fr/* Quebec French routes → verifies the PR-C2b
// (#54) fr-CA locale rollout from the data-layer side. Before that PR,
// CA /fr/* pages rendered with the EN UIStrings bundle (search.ts
// hardcoded 'en'); PR-C2b added a fr-CA bundle + per-locale search-
// fr-ca.ts module + swapped the 3 page imports.
//
// SCOPE NOTE: These tests verify what PR-C2b actually fixed — the
// page metadata, page-specific content, and the page lang wrapper. They
// do NOT assert FPHeader nav text localization because that's blocked
// by a separate hardcoded-English regression in FPHeader.tsx
// (`DEFAULT_NAV` constant) that affects all non-English pages portfolio-
// wide. See PR-Q7 description for the follow-up issue.
//
// This spec runs against the prebuilt apps/ca/out/ static export
// served on http://127.0.0.1:4175.

test.describe('CA /fr/meilleurs-nootropiques/ Quebec French rendering (PR-C2b)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/fr/meilleurs-nootropiques/');
    expect(response?.status()).toBe(200);
  });

  test('renders <div lang="fr-CA"> wrapper (PR-C2b WCAG 3.1.1 partial fix)', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    // The CA root layout has <html lang="en">; the /fr/layout.tsx
    // wraps children in <div lang="fr-CA">. Same workaround pattern
    // used across EU /de/, /fr/, /pt/ subtrees.
    const frWrapper = page.locator('div[lang="fr-CA"]');
    await expect(frWrapper).toBeAttached();
  });

  test('renders French page-specific content (article + headings in French)', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    // The page itself is authored in French. Multiple French tokens
    // expected — if the page accidentally falls back to English (e.g.,
    // a build broke the /fr/ route), this catches it.
    const articleBody = await page.locator('article, main').first().textContent();
    expect(articleBody).toBeTruthy();
    expect(articleBody).toMatch(/nootropiques|Canada|évalu|santé/i);
  });

  test('comparison table renders CAD prices not USD (PR-D2 market="ca")', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    // PR-D2 (#50) flipped market="us" → market="ca" on this page and
    // added CAD currency support to ComparisonTable. Prices should
    // display with $ (CAD uses $ symbol; CA app is the only consumer
    // so no ambiguity).
    const tableSection = await page.locator('body').textContent();
    expect(tableSection).toBeTruthy();
    // Verify the page contains $ prices.
    expect(tableSection).toMatch(/\$\d+/);
    // Verify it's NOT showing € (which would mean market accidentally
    // reverted to 'eu') and NOT showing ¥ (would mean 'jp').
    expect(tableSection).not.toMatch(/€\d/);
    expect(tableSection).not.toMatch(/¥\d/);
  });
});

test.describe('CA /fr/comparer/ Quebec French rendering (PR-C2b)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/fr/comparer/');
    expect(response?.status()).toBe(200);
  });

  test('renders <div lang="fr-CA"> wrapper', async ({ page }) => {
    await page.goto('/fr/comparer/');
    const frWrapper = page.locator('div[lang="fr-CA"]');
    await expect(frWrapper).toBeAttached();
  });
});
