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

/**
 * Presses Tab `presses` times and returns the first focused element that
 * matches `forbidden` (or sits inside it), as a short description; null if
 * keyboard focus never reached it.
 */
async function tabReaches(page: Page, forbidden: string, presses: number): Promise<string | null> {
  for (let i = 0; i < presses; i++) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate((sel) => {
      const el = document.activeElement;
      return el && el.closest(sel) ? `${el.tagName.toLowerCase()} ${el.getAttribute('href') ?? el.textContent?.trim().slice(0, 40)}` : null;
    }, forbidden);
    if (hit) return hit;
  }
  return null;
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
  expect(await page.evaluate(() => !!document.activeElement?.closest('#appshell-mobile-drawer')), 'focus moves into the drawer').toBe(true);
  await expect(page.locator('[inert] #main-content')).toHaveCount(1);
  expect(await canFocus(page, behind), 'page link focusable while the drawer is open').toBe(false);
  // Opening moves focus into the drawer; Tab then never reaches the page behind it.
  await drawer.locator('button[aria-label="Close menu"]').last().focus();
  expect(await tabReaches(page, '#main-content', 40), 'Tab reached the page behind the drawer').toBeNull();

  await drawer.locator('button[aria-label="Close menu"]').last().click();
  await expect(drawer).toHaveCount(0);
  await expect(page.locator('[inert] #main-content')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' }), 'focus returns to the menu button').toBeFocused();
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
  expect(await page.evaluate(() => !!document.activeElement?.closest('#comparator-mobile-filters')), 'focus moves into the sheet').toBe(true);
  // Product rows exist only in the grid behind the sheet: Tab must never reach one.
  expect(await tabReaches(page, '#main-content a[href$="-review/"]', 60), 'Tab reached a product row behind the sheet').toBeNull();

  // The sheet's own X button (the first "Close filters" is the full-screen backdrop, covered by the sheet).
  await sheet.locator('button[aria-label="Close filters"]').last().click();
  await expect(sheet).toHaveCount(0);
  await expect(page.locator('[inert] a[href="/mind-lab-pro-review/"]')).toHaveCount(0);
  await expect(page.locator('button[aria-controls="comparator-mobile-filters"]'), 'focus returns to the Filters button').toBeFocused();
  expect(await canFocus(page, behind), 'row link focusable after closing').toBe(true);
});

// A tablet rotated to landscape crosses the 1024px breakpoint with the overlay
// open: the overlay is `lg:hidden`, so the page must not stay inert behind it.
test('menu drawer: widening to desktop while open leaves no inert page', async ({ page }) => {
  await page.goto('/best-nootropics/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('[inert] #main-content')).toHaveCount(1);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('[inert] #main-content')).toHaveCount(0);
  expect(await canFocus(page, '#main-content a[href]')).toBe(true);
});

test('comparator filter sheet: widening to desktop while open leaves no inert page', async ({ page }) => {
  await page.goto('/nootropic-comparison/');
  await page.locator('button[aria-controls="comparator-mobile-filters"]').click();
  await expect(page.locator('[inert] a[href="/mind-lab-pro-review/"]').first()).toBeAttached();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('[inert] a[href="/mind-lab-pro-review/"]')).toHaveCount(0);
  expect(await canFocus(page, '#main-content a[href="/mind-lab-pro-review/"]')).toBe(true);
});
