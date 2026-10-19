import { test, expect, type Page } from '@playwright/test';

// Design decision 16 (2026-10-19): product review pages left the AppShell
// sidebar layout for the shared editorial chrome (PublicShell: skip link →
// FPHeader → main → FPFooter), as listicles, guides and ingredient pages
// have. Phones get a menu button on FPHeader (MobileMenu): a native modal
// <dialog> with the header's links and the footer's best-by-goal and
// by-region columns. review-shared-shell.test.tsx checks the static markup;
// this spec checks layout and the menu's keyboard and focus behaviour.

const REVIEW = '/mind-lab-pro-review/';

test.beforeEach(async ({ context }) => {
  // Consent already chosen, so the Klaro banner is not in the way.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

/** True when keyboard focus is inside the open menu dialog. */
function focusInMenu(page: Page): Promise<boolean> {
  return page.evaluate(() => !!document.activeElement?.closest('dialog#fp-mobile-menu[open]'));
}

test.describe('desktop 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('banner header and contentinfo footer, no sidebar rail, content held to 1200px', async ({ page }) => {
    const res = await page.goto(REVIEW);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.locator('[class*="240px"]')).toHaveCount(0);
    // Desktop header as before: the primary links show, the phone menu button does not.
    await expect(page.getByRole('navigation', { name: 'Primary', exact: true }).getByRole('link', { name: 'Ingredients' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open comparator →' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();

    const content = page.locator('#main-content > div:not([role="note"])');
    await expect(content).toHaveCount(1);
    const box = await content.boundingBox();
    expect(box, 'main content box').not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(1200);
    // The h1 is inside it.
    await expect(content.locator('h1')).toHaveText('Mind Lab Pro');
  });
});

test.describe('phone 390×844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('menu: modal dialog, focus on close, Tab stays inside, Escape closes and returns focus', async ({ page }) => {
    await page.goto(REVIEW);
    await page.waitForLoadState('networkidle');
    const button = page.getByRole('button', { name: 'Open menu' });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    const size = await button.boundingBox();
    expect(size!.width).toBeGreaterThanOrEqual(44);
    expect(size!.height).toBeGreaterThanOrEqual(44);

    await button.click();
    const dialog = page.getByRole('dialog', { name: 'Primary navigation' });
    await expect(dialog).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await expect(dialog.getByRole('navigation', { name: 'Primary' }).getByRole('link')).toHaveCount(5);
    await expect(dialog.getByRole('heading', { name: 'Best by goal' })).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'By region' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'For focus' })).toBeVisible();
    // The page behind does not scroll while the menu is open.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');

    // Tab past the last control and back past the first: focus never leaves the dialog.
    const controls = await dialog.locator('a[href], button').count();
    expect(controls).toBeGreaterThan(10);
    for (let i = 0; i < controls + 3; i++) {
      await page.keyboard.press('Tab');
      expect(await focusInMenu(page), `Tab ${i + 1} left the menu`).toBe(true);
    }
    for (let i = 0; i < controls + 3; i++) {
      await page.keyboard.press('Shift+Tab');
      expect(await focusInMenu(page), `Shift+Tab ${i + 1} left the menu`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
  });

  test('menu: the close button closes it; a link closes it and navigates', async ({ page }) => {
    await page.goto(REVIEW);
    await page.waitForLoadState('networkidle');
    const button = page.getByRole('button', { name: 'Open menu' });
    const dialog = page.getByRole('dialog', { name: 'Primary navigation' });

    await button.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close menu' }).click();
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: 'For focus' }).click();
    await expect(page).toHaveURL(/\/best-nootropics-for-focus\/$/);
    await expect(page.locator('dialog#fp-mobile-menu[open]')).toHaveCount(0);
  });
});

test.describe('320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test('no horizontal scroll; the menu button fits', async ({ page }) => {
    await page.goto(REVIEW);
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(320);
    const button = page.getByRole('button', { name: 'Open menu' });
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  });
});
