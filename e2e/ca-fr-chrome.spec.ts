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

test.describe('CA /fr/* search-index localization (PR-Q10 — WCAG 3.1.2)', () => {
  // CA /fr/* routes use PublicShell (no built-in breadcrumb), so the
  // breadcrumb half of PR-Q10 has no surface here. The search-index
  // half does: every CA /fr/* page passes searchItems built from the
  // fr-CA UIStrings bundle into the SearchModal.

  test('search index serializes Quebec French page titles for the ⌘K modal', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const html = await page.content();
    expect(html).toContain('Meilleurs Nootropiques');
    expect(html).toContain('Comparer Tout');
    expect(html).toContain('Méthodologie');
    // Quebec French description for the 'Methodology' page entry.
    expect(html).toContain('Comment nous évaluons les suppléments');
  });

  // SKIPPED until a separate follow-up fixes a pre-existing infra issue:
  // CookieBanner.tsx does `await import('klaro/dist/klaro-no-translations',
  // { webpackIgnore: true })`. In a Next.js static export that path is not
  // a resolvable HTTP route, so Klaro never actually mounts in production
  // — `<div id="klaro">` stays empty on every page across every region.
  //
  // PR-Q13's actual fix (synchronous DOM lang detection + klaroConfig.lang
  // assignment before Klaro.setup) is covered by the unit tests in
  // packages/ui/src/klaro-lang.test.ts. Once the Klaro mount is restored
  // by a dedicated infra PR, un-skip this assertion to validate the full
  // chain (DOM lang → klaroConfig.lang → rendered fr-CA "témoins" banner).
  test.skip('Klaro consent banner renders OQLF Quebec French "témoins" (PR-Q13 #77)', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    const banner = page.locator('#klaro').getByText(/témoins/);
    await expect(banner).toBeVisible({ timeout: 5000 });
  });

  test('RSC hydration payload does NOT carry an EN UIStrings bundle (PR-Q11 #75)', async ({ page }) => {
    // Before PR-Q11, the CA root layout did:
    //   const strings = getStrings('en');
    //   <CookieBanner strings={strings} />
    // CookieBanner is a 'use client' component, so Next.js serialized
    // the full English UIStrings bundle into the RSC hydration payload
    // of every page — including CA /fr/*, which violates WCAG 3.1.2
    // Language of Parts inside the hydration script.
    //
    // The PR-Q11 fix removes the dead `strings` prop entirely. After
    // the fix, none of the EN-only UIStrings.search.descriptions
    // values should appear anywhere in the page HTML.
    await page.goto('/fr/meilleurs-nootropiques/');
    const html = await page.content();
    expect(html).not.toContain('How we score supplements');
    expect(html).not.toContain('Full comparison of top brands');
    expect(html).not.toContain('Interactive comparison tool');
  });
});
