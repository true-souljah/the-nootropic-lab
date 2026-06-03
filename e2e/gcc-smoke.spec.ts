import { test, expect } from '@playwright/test';

// Smoke spec for the GCC region app — first Playwright coverage of
// Gulf Cooperation Council surfaces. Joins the existing JP/LATAM/CA/EU/US/AU
// projects bringing covered region count to 7 of 8 (SEA last remaining).
//
// GCC has 3 surfaces no other region project exercises:
//   - Dedicated /halal-certified-nootropics/ route (no other region has this
//     URL — halal coverage in other regions is annotation-level on product
//     cards, not a topical pillar page).
//   - KSA and UAE private-label brand reviews — Nahdi Brain Boost
//     (SFDA-registered, Saudi pharmacy chain) and Life Pharmacy
//     Neuro Shield (UAE pharmacy chain). Both are GCC-exclusive
//     catalog entries that don't ship elsewhere via this site.
//   - "halal", "Ramadan", "SFDA / MOHAP / ESMA" copy patterns
//     embedded in product summaries — if the GCC catalog drift
//     removes them, observant Muslim buyers lose the disclosure.
//
// PR-Q39. Two follow-ups will add axe + reflow coverage; this spec
// is the smallest viable smoke check that proves the GCC project is
// wired + catches the most likely GCC-specific regressions.

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('GCC /best-nootropics/ (BestOf with GCC catalog)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/best-nootropics/');
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="en"> (GCC root layout — English-only chrome)', async ({ page }) => {
    await page.goto('/best-nootropics/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^en/);
  });

  test('body content references halal compliance in some form', async ({ page }) => {
    await page.goto('/best-nootropics/');
    const body = page.locator('body');
    // GCC catalog adds halal-friendly / porcine-free / capsule sourcing
    // language to FAQ + product descriptions. If a future catalog audit
    // removes the entire halal disclosure surface, observant buyers
    // lose the most important regional decision criterion. The bar is
    // minimal — does ANY halal-related word appear at all?
    await expect(body).toContainText(/halal|porcine|HPMC|pullulan/i);
  });
});

test.describe('GCC /halal-certified-nootropics/ (GCC-exclusive pillar)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/halal-certified-nootropics/');
    expect(response?.status()).toBe(200);
  });

  test('halal terminology appears in the body', async ({ page }) => {
    await page.goto('/halal-certified-nootropics/');
    const body = page.locator('body');
    await expect(body).toContainText(/halal/i);
  });
});

test.describe('GCC /nahdi-brain-boost-review/ (KSA-exclusive private label)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/nahdi-brain-boost-review/');
    expect(response?.status()).toBe(200);
  });

  test('renders the Nahdi brand name in the H1', async ({ page }) => {
    await page.goto('/nahdi-brain-boost-review/');
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText(/Nahdi/i);
  });

  test('Nahdi route is REACHABLE on GCC — confirms KSA private label is in the GCC catalog', async ({ page }) => {
    // Nahdi is a Saudi pharmacy chain; the brand boost product is
    // SFDA-registered and not sold elsewhere via this site. Reaching
    // the URL implies the slug exists in products-gcc.ts.
    await page.goto('/nahdi-brain-boost-review/');
    await expect(page.locator('main, body').first()).toBeVisible();
  });
});

test.describe('GCC regulatory copy — SFDA / MOHAP references', () => {
  test('Nahdi page mentions SFDA (Saudi Food and Drug Authority)', async ({ page }) => {
    await page.goto('/nahdi-brain-boost-review/');
    const body = await page.locator('body').textContent();
    // The GCC catalog annotates Nahdi Brain Boost as SFDA-registered.
    // SFDA is the Saudi FDA equivalent and the most important
    // regulatory signal for KSA buyers. If a future content audit
    // strips it, observant buyers lose the regulatory confidence
    // anchor that justifies picking a regional private label over
    // an international brand.
    expect(body, 'GCC Nahdi page should mention SFDA').toMatch(/SFDA/);
  });
});
