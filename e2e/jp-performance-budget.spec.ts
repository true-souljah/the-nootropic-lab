import { test, expect } from '@playwright/test';

// JP performance budget probe. PR-Q76.
//
// 13th independent axis. First PERFORMANCE-as-accessibility probe.
//
// Why performance is an accessibility axis (CLS specifically):
//
//   Cumulative Layout Shift (CLS) directly affects users with
//   motor + cognitive disabilities most. When content shifts
//   under the cursor or finger after page load:
//     - Motor-impaired users with tremor / spasticity may tap
//       the wrong element after a shift
//     - Cognitive-disability users may lose track of what they
//       were reading when content reorders
//     - Screen-reader users navigating by heading or landmark
//       may have their position invalidated
//
//   Google Core Web Vitals CLS threshold:
//     ≤ 0.1   = Good
//     ≤ 0.25  = Needs improvement
//     > 0.25  = Poor
//
// WCAG 2.2 doesn't formally include CLS but it's recognised by
// WCAG 3.0 working drafts under "stable" outcomes (formerly
// WCAG 2.4.11 Focus Not Obscured-adjacent reasoning).
//
// Probes via PerformanceObserver — the same API browsers use to
// surface CLS to RUM analytics. Different from axe / target-size
// (which probe static DOM state) — this probes DYNAMIC layout
// behavior as the page loads.
//
// Per the Q75 refined model (Category A — substrate doesn't
// enforce → bugs surface): images without explicit width/height
// attributes are the canonical CLS bug source. The substrate
// doesn't enforce image dimensions at the component level. New
// probe category likely surfaces a bug.

// CLS budget per Google Core Web Vitals "Good" threshold.
const CLS_BUDGET = 0.1;

// LCP budget per "Good" threshold (slow mobile baseline).
const LCP_BUDGET_MS = 2500;

interface PerfMetrics {
  cls: number;
  lcp: number | null;
  shifts: Array<{ value: number; hadRecentInput: boolean }>;
}

async function measurePerformance(
  page: import('@playwright/test').Page,
  url: string,
): Promise<PerfMetrics> {
  // Install the observer BEFORE goto so it catches the load
  // sequence start-to-finish.
  await page.addInitScript(() => {
    // @ts-expect-error — attaching globals for the test to read later
    window.__cls = 0;
    // @ts-expect-error
    window.__lcp = null;
    // @ts-expect-error
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // CLS entries are PerformanceLayoutShift type.
        const e = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!e.hadRecentInput) {
          // @ts-expect-error
          window.__cls += e.value;
          // @ts-expect-error
          window.__shifts.push({ value: e.value, hadRecentInput: e.hadRecentInput });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        // @ts-expect-error
        window.__lcp = entries[entries.length - 1].startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  await page.goto(url);
  await page.waitForLoadState('networkidle');
  // Let lazily-loaded images settle.
  await page.waitForTimeout(500);

  return page.evaluate(() => {
    return {
      // @ts-expect-error
      cls: window.__cls as number,
      // @ts-expect-error
      lcp: window.__lcp as number | null,
      // @ts-expect-error
      shifts: window.__shifts as Array<{ value: number; hadRecentInput: boolean }>,
    };
  });
}

test.use({ viewport: { width: 412, height: 915 } }); // Pixel 7 mobile

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

test.describe('JP — performance budget (CLS / LCP as accessibility axis)', () => {
  test(`/best-nootropics-for-focus/ CLS ≤ ${CLS_BUDGET} (Core Web Vitals Good)`, async ({ page }) => {
    const metrics = await measurePerformance(page, '/best-nootropics-for-focus/');
    expect(
      metrics.cls,
      `CLS exceeds budget (${CLS_BUDGET}). Got ${metrics.cls.toFixed(4)}.\n` +
        `Shift events: ${JSON.stringify(metrics.shifts, null, 2)}`,
    ).toBeLessThanOrEqual(CLS_BUDGET);
  });

  test(`/mind-lab-pro-review/ CLS ≤ ${CLS_BUDGET}`, async ({ page }) => {
    const metrics = await measurePerformance(page, '/mind-lab-pro-review/');
    expect(
      metrics.cls,
      `CLS exceeds budget (${CLS_BUDGET}). Got ${metrics.cls.toFixed(4)}.\n` +
        `Shift events: ${JSON.stringify(metrics.shifts, null, 2)}`,
    ).toBeLessThanOrEqual(CLS_BUDGET);
  });

  test(`/ingredients/l-theanine/ CLS ≤ ${CLS_BUDGET}`, async ({ page }) => {
    const metrics = await measurePerformance(page, '/ingredients/l-theanine/');
    expect(
      metrics.cls,
      `CLS exceeds budget (${CLS_BUDGET}). Got ${metrics.cls.toFixed(4)}.\n` +
        `Shift events: ${JSON.stringify(metrics.shifts, null, 2)}`,
    ).toBeLessThanOrEqual(CLS_BUDGET);
  });

  test(`/best-nootropics-for-focus/ LCP ≤ ${LCP_BUDGET_MS}ms (Good)`, async ({ page }) => {
    const metrics = await measurePerformance(page, '/best-nootropics-for-focus/');
    expect(metrics.lcp, 'LCP must be measured').not.toBeNull();
    if (metrics.lcp !== null) {
      expect(
        metrics.lcp,
        `LCP exceeds budget (${LCP_BUDGET_MS}ms). Got ${metrics.lcp.toFixed(0)}ms.`,
      ).toBeLessThanOrEqual(LCP_BUDGET_MS);
    }
  });
});
