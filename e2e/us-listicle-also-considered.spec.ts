import { test, expect } from '@playwright/test';

// Listicles rank only picks scoring >= LISTICLE_MIN_SCORE (7.5; site-owner
// decision 2026-10-08). A pick below the bar stays on the page in an unranked
// "Also considered" section with its score and a review link — never a buy
// link. /best-nootropics-for-focus/ has one such pick: Alpha Brain (6.6).
// Unit side: packages/ui/src/listicle-ranking.test.ts.

const ROUTE = '/best-nootropics-for-focus/';
const BELOW_BAR_REVIEW = '/onnit-alpha-brain-review';

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

test.describe(`US ${ROUTE} — "Also considered" below the 7.5 bar`, () => {
  test('the section lists Alpha Brain with its score and a review link, and nothing in it is rel="sponsored"', async ({ page }) => {
    // Status first: an error page would trivially satisfy the absence check.
    const res = await page.goto(ROUTE);
    expect(res?.status()).toBe(200);

    const section = page.locator('section#also-considered');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Also considered');
    await expect(section.getByRole('heading', { level: 3, name: 'Alpha Brain' })).toBeVisible();
    await expect(section).toContainText('Scores 6.6/10');
    await expect(section.locator(`a[href^="${BELOW_BAR_REVIEW}"]`)).toHaveCount(1);
    await expect(section.locator('[rel*="sponsored"]')).toHaveCount(0);

    // The ranked picks above keep their affiliate CTAs.
    await expect(page.locator('main a[rel*="sponsored"]').first()).toBeVisible();
  });

  test('Alpha Brain is not ranked: no pick card, and not in the ItemList JSON-LD', async ({ page }) => {
    const res = await page.goto(ROUTE);
    expect(res?.status()).toBe(200);
    await expect(page.locator('#pick-onnit-alpha-brain-review')).toHaveCount(0);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const itemList = blocks.map((b) => JSON.parse(b)).find((j) => j['@type'] === 'ItemList');
    expect(itemList, 'ItemList JSON-LD').toBeDefined();
    const names = itemList.itemListElement.map((e: { name: string }) => e.name);
    expect(names).not.toContain('Alpha Brain');
    expect(itemList.numberOfItems).toBe(names.length);
    expect(itemList.itemListElement.map((e: { position: number }) => e.position)).toEqual(names.map((_: string, i: number) => i + 1));
  });
});
