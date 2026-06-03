import { test, expect } from '@playwright/test';

// Regression guard for WCAG 4.1.3 Status Messages (Level AA):
//
//   "In content implemented using markup languages, status messages can
//   be programmatically determined through role or properties such that
//   they can be presented to the user by assistive technologies without
//   receiving focus."
//
// Targets CommandPalette (the ⌘K SearchModal trigger that mounts on
// every public chrome surface across all 8 region apps via FPHeader).
// Before PR-Q28 (#92), the modal showed filtered-result counts and a
// "No results for {query}" empty state visibly but had no aria-live
// region — screen reader users got no announcement of either the count
// change OR the no-results state when typing.
//
// PR-Q28 added a `<LiveRegion>` (role="status" aria-live="polite"
// aria-atomic="true") mounted persistently inside the modal dialog,
// sibling to the listbox. Its `message` prop updates on each query
// change with one of:
//   - '' when query is empty (dialog open is its own announcement)
//   - 'N result(s)' when results are present
//   - 'No results for {capped query}' when no results, query capped at
//     40 chars + … (U+2026) to prevent paste-attack readouts.
//
// This spec verifies the live region is wired correctly + that its
// message updates fire under the same keyboard interactions users do.
//
// 6th independent WCAG coverage axis on the US Playwright project —
// joins axe (Q21), keyboard (Q22), reduced-motion (Q23), reflow
// (Q24-Q26), and target size (Q27).

test.beforeEach(async ({ context }) => {
  // Skip Klaro banner so its consent dialog doesn't steal focus from
  // the search modal.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

async function openPaletteWithKey(page: import('@playwright/test').Page) {
  await page.goto('/best-nootropics-for-focus/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Control+K');
  // The SearchModal dialog should be in the DOM and focused.
  await expect(
    page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
  ).toBeAttached();
}

function liveRegion(page: import('@playwright/test').Page) {
  // The LiveRegion primitive renders <div role="status" aria-live="polite"
  // aria-atomic="true">{message}</div>. Multiple `role="status"` elements
  // may live on the page (Skeleton uses it for loading); narrow to the
  // one with aria-live="polite" AND aria-atomic="true" AND a descendant
  // of the open SearchModal dialog.
  return page.locator(
    '[role="dialog"]:not(#klaro-cookie-notice) [role="status"][aria-live="polite"][aria-atomic="true"]',
  );
}

test.describe('US — WCAG 4.1.3 Status Messages on CommandPalette ⌘K', () => {
  test('live region exists in the modal dialog (persistent, not gated on truthiness)', async ({ page }) => {
    await openPaletteWithKey(page);
    const region = liveRegion(page);
    // Must be ATTACHED (regardless of message content) — AT requires
    // the region to exist BEFORE the mutation fires to announce it.
    await expect(region).toHaveCount(1);
    // Empty initial query → empty message body.
    await expect(region).toHaveText('');
  });

  test('typing a query that matches results announces the count', async ({ page }) => {
    await openPaletteWithKey(page);
    const region = liveRegion(page);
    await page.keyboard.type('mind');
    // SearchModal filters on substring match. "mind" is a common stem
    // across Mind Lab Pro, Qualia Mind, etc. — at least 2 results
    // expected. The probe is robust to exact count (the search index
    // changes as the product catalog grows).
    await expect(region).toHaveText(/^\d+ results?$/);
  });

  test('typing a query with NO matches announces the "No results" string', async ({ page }) => {
    await openPaletteWithKey(page);
    const region = liveRegion(page);
    await page.keyboard.type('xyzqq');
    await expect(region).toHaveText('No results for xyzqq');
  });

  test('a long pasted query is capped at 40 chars + … in the announcement', async ({ page }) => {
    await openPaletteWithKey(page);
    const region = liveRegion(page);
    // 60-char query of all-x's so the "No results" branch fires.
    const longQuery = 'x'.repeat(60);
    await page.keyboard.type(longQuery);
    const expected = `No results for ${'x'.repeat(40)}…`;
    await expect(region).toHaveText(expected);
  });

  test('clearing the input silences the live region (no spurious "0 results" announcement)', async ({ page }) => {
    await openPaletteWithKey(page);
    const region = liveRegion(page);
    await page.keyboard.type('mind');
    await expect(region).not.toHaveText('');
    // Clear via the input locator — Playwright's `.fill('')` triggers the
    // React onChange handler reliably across platforms (Control+A is
    // OS-specific: macOS uses Cmd+A, Linux/Windows uses Ctrl+A).
    await page
      .locator('[role="dialog"]:not(#klaro-cookie-notice) input[type="text"]')
      .fill('');
    await expect(region).toHaveText('');
  });
});
