import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG 1.4.3 runtime check for the pages whose muted text used Tailwind
// light grays (gray-400 = 2.6:1, gray-300 ≈ 1.5:1 on white) before
// 2026-10-09. Only the color-contrast rule runs here, so unrelated rules
// cannot mask or fail it. Static twin: packages/ui/src/text-contrast-classes.test.ts.

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

async function contrastViolations(page: Page): Promise<string[]> {
  const r = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  return r.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')}: ${n.any[0]?.message ?? ''}`));
}

for (const route of ['/countries/austria/', '/guides/']) {
  test(`${route} has no color-contrast violations`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    expect(await contrastViolations(page)).toEqual([]);
  });
}

