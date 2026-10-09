import { test, expect } from '@playwright/test';

// US desktop CLS probe for AppShell pages (2026-10-08).
//
// The *-performance-budget specs only measure at 412 px. At 1440 px the
// AppShell `mode="persistent"` pages measured CLS 0.597 (/best-nootropics/),
// 0.568 (/mind-lab-pro-review/) and 0.167 (/nootropic-comparison/) live —
// "Poor" — while the same pages scored 0 at 412 px. Cause: the static HTML
// shipped without the 240 px sidebar column, and a post-hydration effect
// added it, pushing the whole main column (DIV.min-w-0) right. The desktop
// rail must come from the server-rendered HTML, not from JS after hydration.

const CLS_BUDGET = 0.1; // Core Web Vitals "Good"
const SETTLE_MS = 3000;

const PAGES = ['/best-nootropics/', '/mind-lab-pro-review/', '/nootropic-comparison/'];

interface Shift {
  value: number;
  sources: string[];
}

test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ context }) => {
  // Consent already chosen, so the Klaro banner is not part of the measurement.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

async function measureCls(page: import('@playwright/test').Page, url: string): Promise<{ cls: number; shifts: Shift[] }> {
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number; __shifts: Array<{ value: number; sources: string[] }> };
    w.__cls = 0;
    w.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
          sources?: Array<{ node?: Node | null }>;
        };
        if (e.hadRecentInput) continue;
        w.__cls += e.value;
        w.__shifts.push({
          value: e.value,
          sources: (e.sources ?? []).map((s) => {
            const n = s.node as Element | null | undefined;
            return n && 'tagName' in n ? `${n.tagName}.${(n.getAttribute('class') ?? '').split(' ').slice(0, 3).join('.')}` : '?';
          }),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(SETTLE_MS);

  return page.evaluate(() => {
    const w = window as unknown as { __cls: number; __shifts: Shift[] };
    return { cls: w.__cls, shifts: w.__shifts };
  });
}

test.describe('US — desktop CLS on AppShell pages (1440×900)', () => {
  for (const path of PAGES) {
    test(`${path} CLS ≤ ${CLS_BUDGET} at 1440 px`, async ({ page }) => {
      const { cls, shifts } = await measureCls(page, path);
      expect(
        cls,
        `CLS ${cls.toFixed(4)} exceeds ${CLS_BUDGET}. Shifts: ${JSON.stringify(shifts, null, 2)}`,
      ).toBeLessThanOrEqual(CLS_BUDGET);
      // The fix must keep the desktop rail, not remove it.
      await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
    });

    test(`${path} static HTML already contains the desktop sidebar rail`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      const html = await res.text();
      expect(html, 'server HTML must reserve the 240 px desktop column').toContain('lg:grid-cols-[240px_1fr]');
      expect(html, 'server HTML must render the sidebar nav').toContain('aria-label="Primary"');
    });
  }
});
