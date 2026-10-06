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

// Operator decision 6 (2026-10-06): Analytics (GA4) and Affiliate attribution
// (Impact.com) are separate purposes. Tracker requests are aborted (above) but
// still observed, so these assert which tracker each choice tries to load.
const GA_RE = /googletagmanager\.com|google-analytics\.com/;
const IMPACT_RE = /impactcdn\.com|impact\.com/;

async function trackerLog(page: import('@playwright/test').Page) {
  const urls: string[] = [];
  page.on('request', (r) => {
    if (GA_RE.test(r.url()) || IMPACT_RE.test(r.url())) urls.push(r.url());
  });
  return {
    ga: () => urls.some((u) => GA_RE.test(u)),
    impact: () => urls.some((u) => IMPACT_RE.test(u)),
    clear: () => urls.splice(0),
  };
}

async function klaroConsents(page: import('@playwright/test').Page) {
  const c = (await page.context().cookies()).find((k) => k.name === 'klaro');
  return c ? (JSON.parse(decodeURIComponent(c.value)) as Record<string, boolean>) : null;
}

/** Configure → set each purpose switch → "Accept selected". */
async function choosePurposes(page: import('@playwright/test').Page, want: { statistics: boolean; affiliate: boolean }) {
  await page.locator('#klaro .cookie-notice .cn-learn-more').click();
  for (const [purpose, on] of Object.entries(want)) {
    const input = page.locator(`#purpose-item-${purpose}`);
    await expect(input).toBeAttached();
    if ((await input.isChecked()) !== on) await page.locator(`label[for="purpose-item-${purpose}"]`).click();
    await expect(input).toBeChecked({ checked: on });
  }
  await page.locator('#klaro .cookie-modal .cm-btn-accept').click();
}

test('Configure shows one switch per purpose, both off by default', async ({ page }) => {
  await page.goto('/');
  await page.locator('#klaro .cookie-notice .cn-learn-more').click();
  await expect(page.locator('#purpose-item-statistics')).not.toBeChecked();
  await expect(page.locator('#purpose-item-affiliate')).not.toBeChecked();
  await expect(page.locator('#klaro .cookie-modal')).toContainText('Analytics');
  await expect(page.locator('#klaro .cookie-modal')).toContainText('Affiliate attribution');
  await expect(page.locator('#klaro .cookie-modal')).not.toContainText('missing translation');
});

for (const [label, want, expectGa, expectImpact] of [
  ['analytics only', { statistics: true, affiliate: false }, true, false],
  ['affiliate attribution only', { statistics: false, affiliate: true }, false, true],
] as const) {
  test(`${label}: loads only that purpose's tracker, on this page and the next`, async ({ page }) => {
    const log = await trackerLog(page);
    await page.goto('/');
    await expect(page.locator('#klaro .cookie-notice .cn-learn-more')).toBeVisible({ timeout: 10_000 });
    expect(log.ga() || log.impact()).toBe(false);
    await choosePurposes(page, want);
    await expect.poll(() => log.ga() === expectGa && log.impact() === expectImpact).toBe(true);
    expect(await klaroConsents(page)).toEqual({ 'google-analytics': want.statistics, 'impact-com': want.affiliate });
    log.clear();
    await page.goto('/best-nootropics/');
    await expect.poll(() => (expectGa ? log.ga() : log.impact())).toBe(true);
    expect(log.ga()).toBe(expectGa);
    expect(log.impact()).toBe(expectImpact);
  });
}

test('Accept all loads both trackers', async ({ page }) => {
  const log = await trackerLog(page);
  await page.goto('/');
  await page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Accept all' }).click();
  await expect.poll(() => log.ga() && log.impact()).toBe(true);
  expect(await klaroConsents(page)).toEqual({ 'google-analytics': true, 'impact-com': true });
});

test('Decline all loads neither tracker, on this page or the next', async ({ page }) => {
  const log = await trackerLog(page);
  await page.goto('/');
  await page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Decline all' }).click();
  await page.goto('/best-nootropics/');
  await page.waitForTimeout(1500);
  expect(log.ga() || log.impact()).toBe(false);
  expect(await klaroConsents(page)).toEqual({ 'google-analytics': false, 'impact-com': false });
});

for (const [purpose, withdrawnCookie, keptCookie] of [
  ['affiliate', 'IR_MPI', '_ga'],
  ['statistics', '_ga', 'IR_MPI'],
] as const) {
  test(`withdrawing only ${purpose} on the same page deletes its cookies, keeps the other purpose, reloads`, async ({ page }) => {
    await page.goto('/');
    await page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Accept all' }).click();
    await page.reload();
    const host = new URL(page.url()).hostname;
    await page.context().addCookies([
      { name: '_ga', value: 'GA1.1.1.1', domain: host, path: '/' },
      { name: 'IR_MPI', value: 'x', domain: host, path: '/' },
    ]);
    const log = await trackerLog(page);
    await page.locator('[data-cookie-settings]').first().click();
    const reloaded = page.waitForEvent('framenavigated');
    await choosePurposes(page, { statistics: purpose !== 'statistics', affiliate: purpose !== 'affiliate' });
    await reloaded;
    await page.waitForLoadState('load');
    const names = (await page.context().cookies()).map((c) => c.name);
    expect(names).not.toContain(withdrawnCookie);
    expect(names).toContain(keptCookie);
    expect(await klaroConsents(page)).toEqual({ 'google-analytics': purpose !== 'statistics', 'impact-com': purpose !== 'affiliate' });
    // After the reload only the purpose still allowed loads its tracker.
    log.clear();
    await page.reload();
    await expect.poll(() => (purpose === 'statistics' ? log.impact() : log.ga())).toBe(true);
    expect(purpose === 'statistics' ? log.ga() : log.impact()).toBe(false);
  });
}

test('the homepage links the cookie and privacy policies', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/cookie-policy/"]').first()).toBeAttached();
  await expect(page.locator('a[href="/privacy-policy/"]').first()).toBeAttached();
});
