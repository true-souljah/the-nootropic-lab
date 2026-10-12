import { test, expect } from '@playwright/test';

// Listicles rank only picks scoring >= LISTICLE_MIN_SCORE (7.0 since the
// site-owner decision of 2026-10-09; 7.5 before) that pass rule (b). A pick
// that fails either stays on the page in an unranked "Also considered" section
// with its score, the reason and a review link — never a buy link.
// /best-nootropics-for-focus/ has two: Alpha Brain (5.2, below the bar) and,
// since combination cards need every ingredient (2026-10-09), NooCube (7.0:
// L-theanine at our reference dose but no caffeine for the "L-Theanine +
// Caffeine" card, and no other focus ingredient at our reference dose).
// Unit side: packages/ui/src/listicle-ranking.test.ts.

const ROUTE = '/best-nootropics-for-focus/';
const BELOW_BAR_REVIEW = '/onnit-alpha-brain-review';
const DOSE_RULE_REVIEW = '/noocube-review';

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

test.describe(`US ${ROUTE} — "Also considered": below the 7.0 bar or failing rule (b)`, () => {
  test('the section lists Alpha Brain and NooCube with their reasons and review links, and nothing in it is rel="sponsored"', async ({ page }) => {
    // Status first: an error page would trivially satisfy the absence check.
    const res = await page.goto(ROUTE);
    expect(res?.status()).toBe(200);

    const section = page.locator('section#also-considered');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Also considered');
    await expect(section.getByRole('heading', { level: 3, name: 'Alpha Brain' })).toBeVisible();
    await expect(section).toContainText('Scores 5.2/10');
    await expect(section.locator(`a[href^="${BELOW_BAR_REVIEW}"]`)).toHaveCount(1);
    await expect(section.locator('#also-considered-noocube-review')).toBeVisible();
    await expect(section).toContainText('Scores 7.0/10, but its label does not reach our reference dose');
    await expect(section.locator(`a[href^="${DOSE_RULE_REVIEW}"]`)).toHaveCount(1);
    await expect(section.locator('[rel*="sponsored"]')).toHaveCount(0);

    // The ranked picks above keep their affiliate CTAs.
    await expect(page.locator('main a[rel*="sponsored"]').first()).toBeVisible();
  });

  test('Alpha Brain and NooCube are not ranked: no pick card, and not in the ItemList JSON-LD', async ({ page }) => {
    const res = await page.goto(ROUTE);
    expect(res?.status()).toBe(200);
    await expect(page.locator('#pick-onnit-alpha-brain-review')).toHaveCount(0);
    await expect(page.locator('#pick-noocube-review')).toHaveCount(0);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const itemList = blocks.map((b) => JSON.parse(b)).find((j) => j['@type'] === 'ItemList');
    expect(itemList, 'ItemList JSON-LD').toBeDefined();
    const names = itemList.itemListElement.map((e: { name: string }) => e.name);
    expect(names).not.toContain('Alpha Brain');
    expect(names).not.toContain('NooCube');
    expect(itemList.numberOfItems).toBe(names.length);
    expect(itemList.itemListElement.map((e: { position: number }) => e.position)).toEqual(names.map((_: string, i: number) => i + 1));
  });
});
