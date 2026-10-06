import { test, expect } from '@playwright/test';

// Consent withdraw control (live hub consent audit 2026-10-05, C6/C8).
//
// After a choice, Klaro 0.7 re-opened only its settings modal (toggles +
// "Save"; Accept all / Decline all are gated on !manager.confirmed), so
// withdrawing took more clicks than consenting and the portfolio checker
// found no consent UI. The "Cookie settings" control must re-open the
// first-layer banner with the same one-click Accept all / Decline all pair.
// The US homepage (AppShell, no FPFooter) also had no link to the cookie or
// privacy policy (C8).
//
// Runtime counterpart of the static assertions in
// packages/ui/src/consent-basic-mode.test.ts. Trackers are aborted so no hit
// leaves the test.

test.beforeEach(async ({ context }) => {
  await context.route(/googletagmanager\.com|google-analytics\.com|impactcdn\.com|impact\.com/, (r) => r.abort());
});

for (const choice of ['Decline all', 'Accept all'] as const) {
  test(`after "${choice}", Cookie settings re-opens one-click Accept all / Decline all`, async ({ page }) => {
    await page.goto('/');
    const notice = page.locator('#klaro .cookie-notice');
    await expect(notice.getByRole('button', { name: choice })).toBeVisible({ timeout: 10_000 });
    await notice.getByRole('button', { name: choice }).click();
    await page.reload();

    const settings = page.locator('[data-cookie-settings]').first();
    await settings.scrollIntoViewIfNeeded();
    await settings.click();

    await expect(page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Accept all' })).toBeVisible();
    await expect(page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Decline all' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.getElementById('klaro')?.contains(document.activeElement) ?? false)).toBe(true);

    // Withdraw / change in one click, stored in the same 365-day cookie.
    await page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Decline all' }).click();
    await expect(page.locator('#klaro .cookie-notice:not(.cookie-notice-hidden)')).toHaveCount(0);
    const klaro = (await page.context().cookies()).find((c) => c.name === 'klaro');
    expect(klaro && decodeURIComponent(klaro.value)).toContain('"google-analytics":false');
  });
}

test('the homepage links the cookie and privacy policies', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/cookie-policy/"]').first()).toBeAttached();
  await expect(page.locator('a[href="/privacy-policy/"]').first()).toBeAttached();
});
