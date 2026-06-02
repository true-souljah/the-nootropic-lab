import { test, expect } from '@playwright/test';

// Smoke test for CA /fr/* Quebec French routes → verifies the PR-C2b
// (#54) fr-CA locale rollout from the data-layer side. Before that PR,
// CA /fr/* pages rendered with the EN UIStrings bundle (search.ts
// hardcoded 'en'); PR-C2b added a fr-CA bundle + per-locale search-
// fr-ca.ts module + swapped the 3 page imports.
//
// The PR-Q8 follow-up (#72, 2026-06-02) also fixed the FPHeader
// DEFAULT_NAV regression that PR-Q7 surfaced, so the chrome assertions
// at the bottom of this file now run against localized Quebec French
// chrome.
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

test.describe('CA /fr/* chrome localization (PR-Q8 #72 — WCAG 3.1.2)', () => {
  // Before PR-Q8, CA /fr/meilleurs-nootropiques/ rendered an English
  // FPHeader nav even though the page wrapped its content in
  // <div lang="fr-CA"> and the fr-CA UIStrings bundle was wired.
  // PR-Q8 derives FPHeader nav from strings.nav and adds localized
  // aria-label / openComparator / skipToContent strings to UIStrings.

  test('FPHeader nav renders Quebec French labels (not English)', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const nav = page.locator('nav[aria-label="Navigation principale"]');
    await expect(nav).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Meilleurs Nootropiques' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Ingrédients' })).toBeAttached();
    // 'Guides' in French is a real word coincidentally identical to
    // English — we accept that and just assert the link exists.
    await expect(nav.getByRole('link', { name: 'Guides' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Méthodologie' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'À propos' })).toBeAttached();
  });

  test('FPHeader CTA renders the French "Ouvrir le comparateur" label', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    await expect(page.getByRole('link', { name: /Ouvrir le comparateur/ })).toBeAttached();
  });

  test('Skip-link renders the French "Aller au contenu principal" string', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    await expect(page.getByRole('link', { name: 'Aller au contenu principal' })).toBeAttached();
  });

  test('FPHeader does NOT render the English "Best of 2026" or "About" labels in chrome', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const nav = page.locator('nav[aria-label="Navigation principale"]');
    await expect(nav.getByRole('link', { name: 'Best of 2026' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveCount(0);
  });
});

test.describe('CA /fr/* FPFooter localization (PR-Q9 — WCAG 3.1.2)', () => {
  // Before PR-Q9, the CA /fr/* pages rendered FPFooter with hardcoded
  // English DEFAULT_COLUMNS even though the page-level UIStrings was
  // fr-CA. PR-Q9 reshapes UIStrings.footer + threads strings={uiStrings}
  // through to FPFooter so the rendered DOM matches the fr-CA bundle.

  test('all 4 footer column headings render in Quebec French', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'Meilleurs par objectif' })).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'Face-à-face' })).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'Par région' })).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'À propos' })).toBeAttached();
  });

  test('by-region links render translated country names', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer.getByRole('link', { name: 'États-Unis' })).toBeAttached();
    await expect(footer.getByRole('link', { name: 'Union européenne' })).toBeAttached();
    await expect(footer.getByRole('link', { name: 'Amérique latine' })).toBeAttached();
    await expect(footer.getByRole('link', { name: 'United States' })).toHaveCount(0);
  });

  test('about-column uses OQLF "Témoins" not "Cookies" (Quebec French convention)', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const footer = page.locator('footer[role="contentinfo"]');
    // Same convention as PR-C2b: Quebec French uses "témoins" for cookies.
    // The /cookie-policy link in the About column should read "Témoins".
    await expect(footer.getByRole('link', { name: 'Témoins' })).toBeAttached();
  });

  test('last-audit string is French-labelled with fr-CA locale date format', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const footer = page.locator('footer[role="contentinfo"]');
    const footerText = await footer.textContent();
    expect(footerText).toContain('Dernière vérification complète :');
    expect(footerText).toContain('Méthodologie v3.2');
    // fr-CA Intl.DateTimeFormat short-form: "28 avr. 2026" (with period in "avr.")
    expect(footerText).toMatch(/28 avr\. 2026/);
    expect(footerText).not.toContain('Last full re-audit:');
  });
});
