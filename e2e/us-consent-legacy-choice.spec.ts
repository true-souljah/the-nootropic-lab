import { test, expect, type Page } from '@playwright/test';

// Operator decision 8 + addendum (2026-10-08): a consent choice stored before
// Analytics and Affiliate attribution became separate purposes (PR #302,
// 2026-10-06) is not a per-purpose choice.
//
// Klaro stored that choice in the `klaro` cookie as {"google-analytics":…,
// "impact-com":…} and #302 kept the cookie and the JSON shape, so on
// origin/main a pre-split "Accept" loaded GA and Impact with no banner. Now:
//   - an unmarked (`klaro`) record that grants anything → banner, nothing
//     loads, the record and the GA / Impact cookies are deleted;
//   - an unmarked record that grants nothing → carried forward as every
//     purpose declined, in the marked record, without asking again;
//   - a marked record (klaroConfig.storageName) → honoured as is.
// Runtime counterpart of packages/ui/src/consent-record.test.ts. Tracker
// requests are aborted (never reach Google / Impact) but still observed.

const LEGACY = 'klaro';
const MARKED = 'klaro-consent';
const GA_RE = /googletagmanager\.com|google-analytics\.com/;
const IMPACT_RE = /impactcdn\.com|impact\.com/;
const enc = (o: Record<string, boolean>) => encodeURIComponent(JSON.stringify(o));

test.beforeEach(async ({ context }) => {
  await context.route(/googletagmanager\.com|google-analytics\.com|impactcdn\.com|impact\.com/, (r) => r.abort());
});

function trackerLog(page: Page) {
  const urls: string[] = [];
  page.on('request', (r) => {
    if (GA_RE.test(r.url()) || IMPACT_RE.test(r.url())) urls.push(r.url());
  });
  return {
    ga: () => urls.some((u) => GA_RE.test(u)),
    impact: () => urls.some((u) => IMPACT_RE.test(u)),
    any: () => urls.length > 0,
  };
}

async function seed(page: Page, cookies: Record<string, string>) {
  const host = '127.0.0.1';
  await page.context().addCookies(Object.entries(cookies).map(([name, value]) => ({ name, value, domain: host, path: '/' })));
}

async function stored(page: Page) {
  const all = await page.context().cookies();
  const read = (name: string) => {
    const c = all.find((k) => k.name === name);
    return c ? (JSON.parse(decodeURIComponent(c.value)) as Record<string, boolean>) : null;
  };
  return { legacy: read(LEGACY), marked: read(MARKED), names: all.map((c) => c.name) };
}

const notice = (page: Page) => page.locator('#klaro .cookie-notice:not(.cookie-notice-hidden)');
/** Klaro has mounted (its root renders whether or not the notice shows). */
const klaroMounted = (page: Page) => expect(page.locator('#klaro .klaro')).toBeAttached({ timeout: 10_000 });

const FAKE_TRACKER_COOKIES = { _ga: 'GA1.1.111.222', _ga_TESTPROBE1: 'GS1.1.1', IR_12345: 'x', IR_gbd: '127.0.0.1' };

for (const [label, record] of [
  ['accept all', { 'google-analytics': true, 'impact-com': true }],
  ['analytics only', { 'google-analytics': true, 'impact-com': false }],
  ['affiliate only', { 'google-analytics': false, 'impact-com': true }],
] as const) {
  test(`pre-split "${label}" is no choice: banner, nothing loads, record and tracker cookies deleted`, async ({ page }) => {
    const log = trackerLog(page);
    await seed(page, { [LEGACY]: enc(record), ...FAKE_TRACKER_COOKIES });
    await page.goto('/');
    await expect(notice(page).getByRole('button', { name: 'Accept all' })).toBeVisible({ timeout: 10_000 });
    await expect(notice(page).getByRole('button', { name: 'Decline all' })).toBeVisible();
    await page.waitForTimeout(2000);
    expect(log.any()).toBe(false);
    const s = await stored(page);
    expect(s.legacy).toBeNull();
    expect(s.marked).toBeNull();
    for (const name of Object.keys(FAKE_TRACKER_COOKIES)) expect(s.names).not.toContain(name);
  });
}

for (const [label, record] of [
  ['decline all', { 'google-analytics': false, 'impact-com': false }],
  // Saved before Impact.com was added (cloudflare-insights was removed later).
  ['decline all, pre-Impact config', { 'cloudflare-insights': false, 'google-analytics': false }],
] as const) {
  test(`pre-split "${label}" carries forward as every purpose declined, without asking again`, async ({ page }) => {
    const log = trackerLog(page);
    await seed(page, { [LEGACY]: enc(record) });
    await page.goto('/');
    await klaroMounted(page);
    await page.waitForTimeout(2000);
    await expect(notice(page)).toHaveCount(0);
    expect(log.any()).toBe(false);
    const s = await stored(page);
    expect(s.legacy).toBeNull();
    expect(s.marked).toEqual({ 'google-analytics': false, 'impact-com': false });
    // The next page keeps the refusal.
    await page.goto('/best-nootropics/');
    await klaroMounted(page);
    await page.waitForTimeout(1500);
    await expect(notice(page)).toHaveCount(0);
    expect(log.any()).toBe(false);
  });
}

for (const [label, record, wantGa, wantImpact] of [
  ['accept all', { 'google-analytics': true, 'impact-com': true }, true, true],
  ['analytics only', { 'google-analytics': true, 'impact-com': false }, true, false],
  ['affiliate only', { 'google-analytics': false, 'impact-com': true }, false, true],
] as const) {
  test(`a per-purpose record ("${label}") is honoured as is`, async ({ page }) => {
    const log = trackerLog(page);
    await seed(page, { [MARKED]: enc(record) });
    await page.goto('/');
    await expect.poll(() => (wantGa ? log.ga() : log.impact()), { timeout: 10_000 }).toBe(true);
    await page.waitForTimeout(1500);
    expect(log.ga()).toBe(wantGa);
    expect(log.impact()).toBe(wantImpact);
    await expect(notice(page)).toHaveCount(0);
    expect((await stored(page)).marked).toEqual(record);
  });
}

test('after the re-ask, the new choice is stored in the per-purpose record', async ({ page }) => {
  const log = trackerLog(page);
  await seed(page, { [LEGACY]: enc({ 'google-analytics': true, 'impact-com': true }) });
  await page.goto('/');
  await notice(page).getByRole('button', { name: 'Accept all' }).click();
  await expect.poll(() => log.ga() && log.impact()).toBe(true);
  const s = await stored(page);
  expect(s.marked).toEqual({ 'google-analytics': true, 'impact-com': true });
  expect(s.legacy).toBeNull();
});
