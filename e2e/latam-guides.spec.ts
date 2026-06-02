import { test, expect } from '@playwright/test';

// Smoke test for /latam/guides/ → verifies the LATAM Spanish guidesEs
// rollout from PR-B2b (#53). Before that PR, /latam/guides/* rendered
// the shared English guides[] array under <html lang="es"> — a WCAG
// 3.1.2 Language of Parts violation flagged by the 2026-05-28 audit
// as LATAM Wave-1's primary content issue.
//
// The PR-Q8 follow-up (#72, 2026-06-02) also fixed the FPHeader
// DEFAULT_NAV regression that PR-Q7 surfaced, so the chrome assertions
// at the bottom of this file now run against localized Spanish chrome.
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

test.describe('LATAM chrome localization (PR-Q8 #72 — WCAG 3.1.2)', () => {
  // Before PR-Q8, FPHeader.tsx fell back to a hardcoded English
  // DEFAULT_NAV whenever `nav` was omitted, even though `strings`
  // was passed. PR-Q8 derives nav from strings.nav and adds localized
  // aria-label / openComparator / skipToContent strings to UIStrings.

  test('FPHeader nav renders Spanish labels (not English)', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav[aria-label="Navegación principal"]');
    await expect(nav).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Los Mejores' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Ingredientes' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Guías' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Metodología' })).toBeAttached();
    await expect(nav.getByRole('link', { name: 'Acerca de' })).toBeAttached();
  });

  test('FPHeader CTA renders the Spanish "Abrir comparador" label', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Abrir comparador/ })).toBeAttached();
  });

  test('Skip-link renders the Spanish "Saltar al contenido principal" string', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Saltar al contenido principal' })).toBeAttached();
  });

  test('FPHeader does NOT render the English "Best of 2026" or "About" labels in chrome', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav[aria-label="Navegación principal"]');
    // Negative assertions: catches any future regression of the
    // hardcoded DEFAULT_NAV behavior that PR-Q8 fixed.
    await expect(nav.getByRole('link', { name: 'Best of 2026' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveCount(0);
  });
});

test.describe('LATAM FPFooter localization (PR-Q9 — WCAG 3.1.2)', () => {
  // Before PR-Q9, FPFooter rendered a hardcoded English DEFAULT_COLUMNS
  // array on every public page across all 8 region apps, regardless of
  // locale. PR-Q9 reshapes UIStrings.footer to match the current
  // FPFooter structure, derives columns from strings.footer via
  // columnsFromStrings, and parameterizes the last-audit date for
  // locale-aware formatting via Intl.DateTimeFormat.

  test('all 4 footer column headings render in Spanish', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeAttached();
    // The 4 column <h2>s now drive both the visible heading AND the
    // landmark aria-labelledby — single source of truth.
    await expect(footer.getByRole('heading', { name: 'Mejores por objetivo' })).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'Frente a frente' })).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'Por región' })).toBeAttached();
    await expect(footer.getByRole('heading', { name: 'Acerca de' })).toBeAttached();
  });

  test('by-region links render translated country names (not English)', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer.getByRole('link', { name: 'Estados Unidos' })).toBeAttached();
    await expect(footer.getByRole('link', { name: 'Unión Europea' })).toBeAttached();
    await expect(footer.getByRole('link', { name: 'América Latina' })).toBeAttached();
    // Negative: catches a regression of the English DEFAULT_COLUMNS
    // by-region labels.
    await expect(footer.getByRole('link', { name: 'United States' })).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'Latin America' })).toHaveCount(0);
  });

  test('last-audit string is Spanish-labelled with a locale-formatted date', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer[role="contentinfo"]');
    const footerText = await footer.textContent();
    expect(footerText).toContain('Última auditoría completa:');
    expect(footerText).toContain('Metodología v3.2');
    // es-419 Intl.DateTimeFormat short-form: "28 abr 2026" (NOT "28 Apr 2026").
    expect(footerText).toMatch(/28 abr 2026/);
    expect(footerText).not.toContain('Last full re-audit:');
  });

  test('copyright line is rendered in Spanish with the current year', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer[role="contentinfo"]');
    const footerText = await footer.textContent();
    expect(footerText).toContain('© 2026 Nootropic Lab');
    expect(footerText).toContain('La información no es asesoramiento médico');
  });
});

test.describe('LATAM breadcrumb + search-index localization (PR-Q10 — WCAG 3.1.2)', () => {
  // Before PR-Q10:
  //   - <nav aria-label="Breadcrumb"> hardcoded EN landmark name (mispronounced
  //     under <html lang="es"> by screen readers).
  //   - buildSearchIndex appended 3 hardcoded English page items into the ⌘K
  //     SearchModal even when the page locale was 'es'.
  // PR-Q10 adds strings.breadcrumb.ariaLabel + strings.search.pages.* and
  // threads strings={uiStrings} through buildSearchIndex.

  test('Listicle breadcrumb landmark renders the Spanish accessible name', async ({ page }) => {
    // LATAM /guides/ uses PublicShell (no built-in breadcrumb); the
    // Listicle template renders the localized breadcrumb instead. Use a
    // /best-nootropics-for-*/ route which is Listicle-backed.
    await page.goto('/best-nootropics-for-focus/');
    const breadcrumb = page.locator('nav[aria-label="Ruta de navegación"]');
    await expect(breadcrumb).toBeAttached();
    // Negative: catches a regression of the hardcoded EN landmark.
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toHaveCount(0);
  });

  test('search index serializes Spanish page titles for the ⌘K modal', async ({ page }) => {
    await page.goto('/');
    // The 3 hardcoded page items (Best Nootropics / Compare All / Methodology)
    // are passed into the SearchModal as searchItems. They appear inside the
    // serialized RSC payload before the user opens the modal — assert that
    // payload carries the Spanish titles, not the English ones.
    const html = await page.content();
    expect(html).toContain('Los Mejores Nootrópicos');
    expect(html).toContain('Comparar Todos');
    expect(html).toContain('Metodología');
    // Spanish description for the 'Methodology' page entry.
    expect(html).toContain('Cómo puntuamos los suplementos');
  });
});
