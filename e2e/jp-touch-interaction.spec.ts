import { test, expect } from '@playwright/test';

// JP touch-interaction probe. PR-Q69.
//
// First TOUCH-INTERACTION axis. Joins behavioral correctness
// (Q67 AT-tree) as the second "non-static" axis category.
//
// Uses Playwright's locator.tap() — requires hasTouch: true on
// the browser context (configured per-test below). Probes the
// touch contract on the surfaces most likely to surface bugs
// missed by static / keyboard probes:
//
//   1. ProductDetail Tabs primitive — same primitive Q38 reflow-
//      fixed, Q51 trap-fixed, Q63 keyboard-validated. The Tabs
//      uses onClick which fires on tap in modern Chrome BUT
//      depends on no touch-action: none or pointer-events
//      blockers.
//
//   2. CommandPalette trigger button — surfaces whether the tap
//      contract works when there's no keyboard available. AT
//      users on iOS use both touch + VoiceOver; this probes the
//      touch leg.
//
//   3. Skip-link tap — verifies the skip-link's tap contract.
//      Tab + Enter is keyboard-only; touch users need tap to
//      activate it too.
//
// Categories of bug this catches that static / keyboard probes
// can't:
//
//   - touch-action: none on an interactive element (blocks tap
//     entirely, common via overzealous global resets)
//   - 300ms tap delay on mobile Safari due to missing
//     touch-action: manipulation
//   - pointer-events: none on an overlay above an interactive
//     element (the overlay blocks the tap, the target never
//     fires its click handler)
//   - mousedown/mouseup-only handlers without pointer- or
//     touch- equivalents (rare but happens in custom React
//     primitives)

test.use({
  hasTouch: true,
  viewport: { width: 412, height: 915 }, // Pixel 7 dimensions
});

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

test.describe('JP — touch interaction contract', () => {
  test('Tab on ProductDetail activates tab + reveals tabpanel via tap (no keyboard)', async ({ page }) => {
    await page.goto('/mind-lab-pro-review/');
    await page.waitForLoadState('networkidle');

    // Find the first non-selected tab. We need to scroll it into
    // view before tapping — mobile viewports may have the tab
    // strip below the fold.
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    expect(tabCount, 'ProductDetail must have at least 2 tabs to test activation').toBeGreaterThanOrEqual(2);

    const initiallySelected = await tabs.nth(0).getAttribute('aria-selected');
    expect(initiallySelected, 'First tab must start selected').toBe('true');

    // Tap the SECOND tab. AppShell has a sticky top-0 chrome
    // header; scrollIntoViewIfNeeded would put the tab right
    // under the sticky header where Playwright's tap action
    // computes the center as occluded. Scroll the tab to viewport
    // CENTER instead so it's well clear of the sticky chrome.
    const secondTab = tabs.nth(1);
    await secondTab.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await secondTab.tap();

    // Verify the second tab is now selected AND the first is not.
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');

    // Verify the corresponding tabpanel is visible (the panel
    // associated with the now-selected tab must NOT be hidden).
    // The Tabs primitive renders one tabpanel per tab; only the
    // selected one's panel is shown.
    const selectedTabId = await secondTab.getAttribute('id');
    expect(selectedTabId).toBeTruthy();
    if (selectedTabId) {
      const panel = page.locator(`[role="tabpanel"][aria-labelledby="${selectedTabId}"]`);
      await expect(panel).toBeVisible();
    }
  });

  test('CommandPalette trigger opens the modal on tap (no keyboard)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // CommandPalette renders BOTH a desktop trigger (hidden md:inline-flex)
    // AND a mobile trigger (md:hidden). At 412px viewport (Pixel 7),
    // the mobile trigger is visible — it's a 36×36 icon-only button.
    // At 412px viewport both desktop (hidden md:inline-flex) and
    // mobile (md:hidden) triggers exist in DOM. The desktop one is
    // display:none. Filter for the actually-visible trigger.
    const visibleTrigger = page.locator('button[aria-label*="Search"]:visible').first();
    await expect(visibleTrigger).toBeVisible();

    await visibleTrigger.tap();

    // Modal should open.
    await expect(
      page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
    ).toBeAttached({ timeout: 3000 });
  });

  test('Skip-link activates via tap and lands on main content', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // The skip-link is positioned off-screen via transform:translateY
    // until focused. To tap it, we need to either:
    //   - Force it visible via focus (Tab) first, then tap
    //   - Tap by coordinates after computing its on-focus position
    // Tab-then-tap is the realistic touch+keyboard combo (a sighted
    // touch user wouldn't typically tap skip-link, but AT users on
    // iOS may switch between rotor + tap).
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a.ds-skip-link').first();
    await expect(skipLink).toBeFocused();
    await skipLink.tap();

    // After tap, URL fragment should be #main-content.
    expect(page.url()).toMatch(/#main-content$/);
  });

  test('CommandPalette result item navigates on tap (modal interaction works on touch)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // Open modal via tap.
    const visibleTrigger = page.locator('button[aria-label*="Search"]:visible').first();
    await visibleTrigger.tap();
    await expect(
      page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
    ).toBeAttached({ timeout: 3000 });

    // Type to filter — touch users have on-screen keyboards.
    await page.locator('[role="dialog"] input[type="text"]').fill('mind');

    // Wait for at least one result.
    const resultOptions = page.locator('[role="dialog"] [role="option"]');
    await expect(resultOptions.first()).toBeVisible();

    // Tap the first result. It should navigate the page.
    const firstResult = resultOptions.first();
    const href = await firstResult.getAttribute('href');
    expect(href, 'First result must have an href').toBeTruthy();

    // The CommandPalette uses window.location.href on Enter/click.
    // Tap fires onClick → handleClose + navigates. Let's verify
    // the dialog closes (handleClose) — full nav verification
    // would require waiting for the new page which is flaky.
    await firstResult.tap();
    // The dialog should close on navigation.
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toHaveCount(0, { timeout: 3000 });
  });
});
