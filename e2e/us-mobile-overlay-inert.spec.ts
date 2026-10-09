import { test, expect, type Page } from '@playwright/test';

// While a mobile overlay is open (the AppShell menu drawer, the comparator
// filter sheet), the page behind it must be `inert`, so keyboard and screen
// reader users cannot move into content they cannot see. React 19 treats
// `inert` as a boolean and renders nothing for an empty string, so the
// earlier `inert: ''` never reached the DOM; nothing tested it.

test.use({ viewport: { width: 390, height: 844 } });

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

/** True when `selector`'s element can take focus (an inert element cannot). */
async function canFocus(page: Page, selector: string): Promise<boolean> {
  return page.locator(selector).first().evaluate((el) => {
    (el as HTMLElement).focus();
    return document.activeElement === el;
  });
}

test('menu drawer: the page behind it is inert while open, interactive after close', async ({ page }) => {
  const res = await page.goto('/best-nootropics/');
  expect(res?.status()).toBe(200);
  const behind = '#main-content a[href]';
  await expect(page.locator(behind).first()).toBeAttached();
  expect(await canFocus(page, behind), 'page link focusable before opening').toBe(true);

  await page.getByRole('button', { name: 'Open menu' }).click();
  const drawer = page.locator('#appshell-mobile-drawer');
  await expect(drawer).toBeVisible();
  await expect(page.locator('[inert] #main-content')).toHaveCount(1);
  expect(await canFocus(page, behind), 'page link focusable while the drawer is open').toBe(false);

  await drawer.locator('button[aria-label="Close menu"]').last().click();
  await expect(drawer).toHaveCount(0);
  await expect(page.locator('[inert]')).toHaveCount(0);
  expect(await canFocus(page, behind), 'page link focusable after closing').toBe(true);
});

test('comparator filter sheet: the page behind it is inert while open, interactive after close', async ({ page }) => {
  const res = await page.goto('/nootropic-comparison/');
  expect(res?.status()).toBe(200);
  // A product row link inside the comparator grid (the disclosure above it stays outside the inert wrapper).
  const behind = '#main-content a[href="/mind-lab-pro-review/"]';
  await expect(page.locator(behind).first()).toBeAttached();
  expect(await canFocus(page, behind), 'row link focusable before opening').toBe(true);

  await page.locator('button[aria-controls="comparator-mobile-filters"]').click();
  const sheet = page.getByRole('dialog', { name: 'Filter products' });
  await expect(sheet).toBeVisible();
  await expect(page.locator('[inert] a[href="/mind-lab-pro-review/"]').first()).toBeAttached();
  expect(await canFocus(page, behind), 'row link focusable while the sheet is open').toBe(false);

  // The sheet's own X button (the first "Close filters" is the full-screen backdrop, covered by the sheet).
  await sheet.locator('button[aria-label="Close filters"]').last().click();
  await expect(sheet).toHaveCount(0);
  await expect(page.locator('[inert]')).toHaveCount(0);
  expect(await canFocus(page, behind), 'row link focusable after closing').toBe(true);
});
