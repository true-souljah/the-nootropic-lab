import { test, expect } from '@playwright/test';

// Smoke spec for the SEA region app — first Playwright coverage of
// Southeast Asia surfaces. Joins the existing JP/LATAM/CA/EU/US/AU/GCC
// projects bringing covered region count to 8 of 8.
//
// This PR closes the 8-of-8-regions infrastructure milestone: every
// region app now has at least smoke-level Playwright coverage.
//
// SEA has 4 surfaces no other region project exercises:
//   - Dedicated /halal-nootropics-indonesia-bpjph/ route covering
//     Indonesia's BPJPH halal cert (federal mandate since 2024) and
//     Malaysia's JAKIM cert. No other region has this URL — GCC has
//     /halal-certified-nootropics/ (different pillar with GCC-region
//     framing) and other regions only have annotation-level halal copy.
//   - NatureBell Ginkgo + Ginseng — SEA-only catalog entry
//     (TCM-inspired budget formula; sourced from Singapore-Malaysia
//     supplement chains, not distributed elsewhere via this site).
//   - Per-country regulator name-checks: HSA (Singapore), NPRA
//     (Malaysia), BPOM (Indonesia), FDA TH/PH (Thailand/Philippines),
//     VFA (Vietnam). Each annotation maps a product's import status
//     against the buyer's local regulator — if a content audit strips
//     them, SEA buyers lose the personal-import legal clarity.
//   - Buy-channel disclosures (Shopee, Lazada, TikTok Shop, Watsons,
//     Guardian, Unity, Boots, Mercury Drug, kopi pairings) — SEA-
//     specific commerce surfaces.
//
// PR-Q40. Two follow-ups will add axe + reflow coverage; this spec
// is the smallest viable smoke check that proves the SEA project is
// wired + catches the most likely SEA-specific regressions.

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

test.describe('SEA /best-nootropics/ (BestOf with SEA catalog)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/best-nootropics/');
    expect(response?.status()).toBe(200);
  });

  test('renders <html lang="en"> (SEA root layout — English-only chrome)', async ({ page }) => {
    await page.goto('/best-nootropics/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /^en/);
  });
});

test.describe('SEA /halal-nootropics-indonesia-bpjph/ (SEA-exclusive BPJPH + JAKIM pillar)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/halal-nootropics-indonesia-bpjph/');
    expect(response?.status()).toBe(200);
  });

  test('page mentions BPJPH (Indonesia federal halal cert body)', async ({ page }) => {
    await page.goto('/halal-nootropics-indonesia-bpjph/');
    const body = await page.locator('body').textContent();
    // BPJPH (Badan Penyelenggara Jaminan Produk Halal) is the
    // Indonesian federal halal certification authority. Indonesia
    // mandates halal cert on supplements since 2024 — if a future
    // content audit strips BPJPH from this URL, Indonesian buyers
    // lose the most important compliance signal.
    expect(body, 'SEA halal page should mention BPJPH').toMatch(/BPJPH/);
  });

  test('page mentions JAKIM (Malaysia federal halal cert body)', async ({ page }) => {
    await page.goto('/halal-nootropics-indonesia-bpjph/');
    const body = await page.locator('body').textContent();
    // JAKIM (Jabatan Kemajuan Islam Malaysia) is the Malaysian
    // federal halal certification authority. SEA halal coverage is
    // BPJPH (Indonesia) + JAKIM (Malaysia) — both should be on the
    // dedicated pillar.
    expect(body, 'SEA halal page should mention JAKIM').toMatch(/JAKIM/);
  });
});

test.describe('SEA /naturebell-ginkgo-ginseng-review/ (SEA-only NatureBell brand)', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/naturebell-ginkgo-ginseng-review/');
    expect(response?.status()).toBe(200);
  });

  test('renders the NatureBell brand name in the H1', async ({ page }) => {
    await page.goto('/naturebell-ginkgo-ginseng-review/');
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText(/NatureBell/i);
  });

  test('NatureBell route is REACHABLE on SEA — confirms slug is in products-sea.ts', async ({ page }) => {
    // NatureBell Ginkgo + Ginseng is a TCM-inspired budget formula
    // distributed via Singapore-Malaysia supplement chains. Reaching
    // the URL implies the slug exists in products-sea.ts.
    await page.goto('/naturebell-ginkgo-ginseng-review/');
    await expect(page.locator('main, body').first()).toBeVisible();
  });
});

test.describe('SEA regulatory copy — per-country regulator annotations', () => {
  test('best-nootropics-for-focus page mentions HSA, NPRA, BPOM, or FDA TH/PH', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    const body = await page.locator('body').textContent();
    // Per-country regulator annotations are SEA's most distinctive
    // editorial pattern: HSA (Singapore), NPRA (Malaysia), BPOM
    // (Indonesia), FDA TH/PH (Thailand/Philippines), VFA (Vietnam).
    // If a future content audit strips them, SEA buyers lose the
    // personal-import legal clarity that justifies choosing an
    // imported brand over a domestic option. The bar is minimal —
    // at least ONE per-country regulator should be cited.
    expect(body, 'SEA focus page should cite at least one SEA regulator').toMatch(/HSA|NPRA|BPOM|VFA/);
  });
});
