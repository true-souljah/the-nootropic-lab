import { test, expect } from '@playwright/test';

// Smoke for the CA /alpha-brain-canada/ buying page (GSC: CA host at pos ~16
// for "alpha brain canada" with no dedicated page). Proves the page renders,
// carries the verdict box, links at least one NPN-licensed alternative review,
// discloses that we earn no commission on Alpha Brain (no affiliate deal with
// Onnit: commissionRate "0%", 2026-10-09), links out to Onnit, and is linked
// from the home page and the NPN guide.

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

test.describe('CA /alpha-brain-canada/', () => {
  test('renders h1, verdict box, NPN alternative, disclosure and Onnit link', async ({ page }) => {
    const response = await page.goto('/alpha-brain-canada/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Alpha Brain in Canada');

    const verdict = page.getByTestId('verdict-box');
    await expect(verdict).toBeVisible();
    // Verdict wording now states the dated findings (amazon.ca search, LNHPD licence status), 2026-10-07.
    await expect(verdict).toContainText('We found no Onnit listing on amazon.ca');
    await expect(verdict).toContainText('could not confirm any Canadian retailer stocking Alpha Brain');

    // At least one NPN-licensed alternative review link (AOR Ortho•Mind today).
    await expect(page.locator('main a[href="/aor-ortho-mind-review/"]').first()).toBeVisible();

    // The page's only buy link is the untracked onnit.com link, so the
    // disclosure says we earn no commission, and no commission claim remains.
    const disclosure = page.getByRole('note', { name: 'Affiliate disclosure' });
    await expect(disclosure).toHaveCount(1);
    await expect(disclosure).toContainText("We don't earn a commission on Alpha Brain");
    await expect(page.locator('body')).not.toContainText(/we (may )?earn a commission/i);
    await expect(page.locator('body')).not.toContainText('This page contains affiliate links');
    await expect(page.locator('main a[href^="https://www.onnit.com/"][rel*="sponsored"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/onnit-alpha-brain-review/"]').first()).toBeVisible();
  });

  test('is linked from the home page and the NPN guide', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a[href="/alpha-brain-canada/"]')).toHaveCount(1);
    await page.goto('/npn-licensed-nootropics-canada/');
    await expect(page.locator('main a[href="/alpha-brain-canada/"]')).toHaveCount(1);
  });
});
