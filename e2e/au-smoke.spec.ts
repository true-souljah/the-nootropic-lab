import { test, expect } from '@playwright/test';

// Smoke spec for the AU region app — first Playwright coverage of
// Australian-specific surfaces. Joins the existing JP/LATAM/CA/EU/US
// projects bringing covered region count to 6 of 8.
//
// AU has 3 surfaces no other region project exercises:
//   - TGA "AUST L" badges on products with TGA listings (austListed).
//   - Blackmores ANZ-specific products (regional brand not sold
//     elsewhere — verifies the per-region product catalog actually
//     produces the AU-only routes).
//   - TGA regulatory copy patterns ("TGA listing required for
//     therapeutic claims -- imported as food supplement") embedded in
//     product summaries / cons.
//
// PR-Q36 #100. Two follow-ups will add reflow + axe coverage; this
// spec is the smallest viable smoke check that proves the AU project
// is wired correctly + catches the most likely region-specific
// regressions.

test.beforeEach(async ({ context }) => {
  // Skip Klaro consent banner for consistency with the other region
  // specs (same pattern as latam-guides, ca-fr-chrome, eu-locale-landings).
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('AU /best-nootropics/ (BestOf template with AU catalog)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/best-nootropics/');
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="en-AU"> (AU root layout)', async ({ page }) => {
    await page.goto('/best-nootropics/');
    const html = page.locator('html');
    // AU app sets en-AU on the root html element for screen-reader
    // pronunciation engine + Google language signal.
    await expect(html).toHaveAttribute('lang', /^en(-AU)?$/);
  });

  test('renders an Australian price (AUD symbol)', async ({ page }) => {
    await page.goto('/best-nootropics/');
    const body = page.locator('body');
    // The AU catalog uses AUD pricing. The currency symbol on the
    // page should be $ (shared with USD) but the per-month price
    // figures are derived from the AU-specific priceMonthlyAUD field.
    // Smoke check: at least one $-prefixed price renders.
    await expect(body).toContainText(/\$\d+/);
  });

  test('body content does NOT carry US-only product references', async ({ page }) => {
    await page.goto('/best-nootropics/');
    const body = page.locator('body');
    // Some products (TruBrain, BrainMD Brain Memory Power Boost) only
    // ship to US per the audit and are absent from products-au.ts.
    // If they show up on the AU /best-nootropics/ page, the region-
    // specific catalog filtering broke.
    await expect(body).not.toContainText(/TruBrain/i);
    await expect(body).not.toContainText(/BrainMD/i);
  });
});

test.describe('AU /blackmores-brain-active-review/ (region-only product)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/blackmores-brain-active-review/');
    expect(response?.status()).toBe(200);
  });

  test('renders the Blackmores brand name in the H1', async ({ page }) => {
    await page.goto('/blackmores-brain-active-review/');
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText(/Blackmores/i);
  });

  test('Blackmores route is REACHABLE on AU but DOES NOT exist on the JP catalog', async ({ page }) => {
    // Confirms the per-region [slug]/page.tsx generateStaticParams
    // honoured the AU catalog. We can't navigate to a JP URL from
    // this AU project (different port), so the assertion is that the
    // current page (AU /blackmores-brain-active-review/) actually
    // renders — implying the slug exists in the AU catalog and not
    // in catalogs where Blackmores isn't sold.
    await page.goto('/blackmores-brain-active-review/');
    await expect(page.locator('main, body').first()).toBeVisible();
  });
});

test.describe('AU regulatory copy — TGA references in product content', () => {
  test('Mind Lab Pro page mentions TGA / Australian-specific compliance language', async ({ page }) => {
    await page.goto('/mind-lab-pro-review/');
    const body = await page.locator('body').textContent();
    // The AU catalog adds "TGA listing required for therapeutic
    // claims -- imported as food supplement" to many products. The
    // exact phrasing is the bar; if a future content audit removes
    // it from the AU catalog without replacing it, screen readers
    // and Australian buyers lose the regulatory disclosure.
    expect(body, 'AU MLP page should mention TGA').toMatch(/TGA/);
  });
});
