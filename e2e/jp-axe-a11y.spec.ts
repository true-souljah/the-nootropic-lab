import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on the 3 JP routes that
// already have Playwright smoke coverage. Targets WCAG 2.1 Level A + AA
// (the existing portfolio target) and only fails on serious + critical
// violations. moderate + minor issues are reported for visibility but
// don't fail CI — those are the kind of nits the manual
// accessibility-agents:accessibility-lead review historically caught.
//
// This is the automated complement to the manual a11y reviews that ran
// on every audit-remediation PR. Catches a real subset (color contrast,
// missing labels, duplicate IDs, missing alt, role mismatches, etc.)
// without replacing the judgment-call reviews.

const SERIOUSNESS = ['serious', 'critical'] as const;

async function runAxe(page: Page, url: string): Promise<AxeResults> {
  await page.goto(url);
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

function blockingViolations(results: AxeResults): Result[] {
  return results.violations.filter((v) =>
    SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
  );
}

function summarize(violations: Result[]): string {
  if (violations.length === 0) return '0 blocking violations';
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 3)
        .map((n) => `  - ${JSON.stringify(n.target)}: ${n.html.slice(0, 100)}`)
        .join('\n');
      return `[${v.impact}] ${v.id}: ${v.description}\n${nodes}`;
    })
    .join('\n\n');
}

test.describe('JP routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/ja/yakkan-shoumei/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/ja/yakkan-shoumei/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/fancl-brains-review/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/fancl-brains-review/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/ingredients/l-theanine/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/ingredients/l-theanine/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('JP routes — axe-core informational (logged, not failed)', () => {
  // These tests INFORM about moderate+minor issues but never fail CI.
  // They serve as a hint to operators about a11y polish opportunities
  // without blocking PR merges.
  test('/ja/yakkan-shoumei/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/ja/yakkan-shoumei/');
    const advisory = results.violations.filter((v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]));
    // eslint-disable-next-line no-console
    console.log(`/ja/yakkan-shoumei/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
    // No assertion — always passes.
  });
});
