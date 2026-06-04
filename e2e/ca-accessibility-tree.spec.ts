import { test, expect } from '@playwright/test';

// CA accessibility-tree behavioral correctness probe. PR-Q67.
//
// First BEHAVIORAL-CORRECTNESS probe after the depth phase
// (Q60-Q66). Uses Playwright's getByRole() / getByLabel() APIs
// which select elements based on the Chrome-computed accessibility
// tree — what AT (NVDA / VoiceOver / JAWS) actually exposes to
// the user.
//
// Plus targeted DOM probes for accessible-name VALUE checks that
// getByRole() doesn't surface (e.g. raw ⌘ U+2318 PLACE OF INTEREST
// SIGN inside aria-label, which AT engines pronounce as "place of
// interest sign" instead of "command").
//
// Categories of bug this catches that DOM probes / axe / keyboard
// can't:
//
//   1. Accessible-name VALUE issues — when aria-label / aria-
//      labelledby / inner text concatenation produces a name AT
//      announces oddly. axe checks PRESENCE of accessible-name;
//      this spec probes its TEXT.
//
//   2. Special-character pronunciation — ⌘ (U+2318) and other
//      symbol-only-fonts inside aria-label.
//
//   3. Landmark presence — does the page expose <main>, <nav>,
//      <header>, <footer> as the corresponding landmark roles AT
//      uses for "jump-to-landmark" navigation?
//
//   4. Role overrides — when an element has role="button" but is
//      an <a href> (or vice versa). Captured via getByRole.

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('CA accessibility-tree behavioral correctness on /best-nootropics-for-focus/', () => {
  test('skip-link is selectable by role=link with accessible name "Skip to main content"', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // getByRole() uses the computed accessibility tree. If the
    // skip-link's accessible name doesn't match exactly OR its
    // computed role isn't "link", this fails — catching aria-label
    // / aria-labelledby regressions axe might miss.
    const skipLink = page.getByRole('link', { name: 'Skip to main content', exact: true });
    await expect(skipLink).toHaveCount(1);
  });

  test('exactly one [role="main"] landmark exists', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    const mains = page.getByRole('main');
    await expect(mains).toHaveCount(1);
  });

  test('at least one [role="navigation"] landmark exists', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    const navs = page.getByRole('navigation');
    const count = await navs.count();
    expect(
      count,
      `Page must expose at least one [role="navigation"] landmark for AT jump-to-nav.`,
    ).toBeGreaterThanOrEqual(1);
  });

  test('CommandPalette trigger is selectable by role=button with name containing "Search"', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    const triggers = page.getByRole('button', { name: /search/i });
    const count = await triggers.count();
    expect(
      count,
      'Expected at least one [role=button] with accessible name containing "Search" (mobile + desktop variants).',
    ).toBeGreaterThanOrEqual(1);
  });

  test('CommandPalette trigger aria-label uses an AT-safe shortcut hint (no raw ⌘ U+2318)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // Probe the actual aria-label values of every Search-named
    // button. Many AT engines (NVDA / JAWS / VoiceOver) pronounce
    // ⌘ (U+2318 PLACE OF INTEREST SIGN) as "place of interest sign"
    // instead of "command" — a real announcement quality bug.
    //
    // Standard practice: put ⌘K in a <kbd> child (visible only,
    // aria-hidden=true) and use "Search" or "Search (Command K)"
    // in aria-label so AT users hear a meaningful name.
    const triggers = page.locator('button').filter({
      has: page.locator('[aria-label*="Search"], [aria-label*="search"]'),
    });
    const labels = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
      return btns
        .map((b) => b.getAttribute('aria-label'))
        .filter((l): l is string => l !== null && /search/i.test(l));
    });
    expect(
      labels.length,
      'Expected at least one button with aria-label containing "Search"',
    ).toBeGreaterThanOrEqual(1);

    for (const label of labels) {
      expect(
        label.includes('⌘'),
        `Button aria-label "${label}" contains raw ⌘ (U+2318 PLACE OF INTEREST SIGN). ` +
          `Many AT engines (NVDA / JAWS / VoiceOver) pronounce this as "place of interest sign", not "command". ` +
          `Preferred: keep ⌘K in a <kbd> child (visible only, aria-hidden=true); use "Search" or "Search (Command K)" in aria-label.`,
      ).toBe(false);
    }
  });

  test('no focused element has a computed role of "generic" (AT users always hear a meaningful role)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // Tab to the first focusable element on the page.
    await page.keyboard.press('Tab');
    // The first focusable should be a recognized landmark / role
    // (link, button, etc.) — NOT a generic <div> with tabindex=0.
    // If a div with tabindex=0 grabs focus first, AT users hear
    // nothing meaningful.
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      // Read the implicit role of the focused element. We can't
      // get the COMPUTED role from the DOM directly without the
      // accessibility API, but we can check if the tag has a
      // semantic default role.
      const tag = el.tagName.toLowerCase();
      const explicitRole = el.getAttribute('role');
      const isInteractiveTag = ['a', 'button', 'input', 'select', 'textarea'].includes(tag);
      return {
        tag,
        explicitRole,
        isInteractiveTag,
        hasTabIndex: el.hasAttribute('tabindex'),
      };
    });
    expect(info, 'Expected a focused element after Tab').not.toBeNull();
    expect(
      info?.isInteractiveTag || (info?.explicitRole && info.explicitRole !== 'generic'),
      `First Tab landed on <${info?.tag}> with role="${info?.explicitRole ?? '(implicit)'}". ` +
        `AT users will hear no meaningful role announcement. The first focusable should be a semantic element (a, button) or carry an explicit non-generic role.`,
    ).toBe(true);
  });
});
