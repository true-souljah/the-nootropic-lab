import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on 3 representative AU routes.
// Twin of jp/eu/latam/ca axe specs. PR-Q37.
//
// AU has no nested locales (en-AU only), so route diversity comes from
// template-shape rather than locale-shape:
//
//   /                                  — AU root home (PublicShell chrome)
//   /best-nootropics/                  — BestOf template with AU catalog
//   /blackmores-brain-active-review/   — ProductDetail with AU-exclusive brand
//
// Why these 3:
//   * Root home exercises the shared chrome (Klaro banner, top nav,
//     CommandPalette mount). The JP-only Klaro contrast bug PR-Q16
//     fixed lived here.
//   * BestOf carries the per-region catalog filter + AUST L badges +
//     AUD pricing. These are the surfaces most likely to land
//     focus-order or contrast regressions.
//   * ProductDetail for Blackmores is the AU-exclusive product page
//     (Blackmores ANZ-only). Carries the TGA regulatory copy callouts.
//
// PR-Q36 #100 brought AU to 6-of-8 covered regions with smoke only.
// This spec extends AU to smoke + axe parity with EU/LATAM/CA/JP.

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

test.describe('AU routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/ (en-AU home) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/best-nootropics/ (AU BestOf) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/best-nootropics/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/blackmores-brain-active-review/ (ProductDetail, AU-exclusive) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/blackmores-brain-active-review/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('AU routes — axe-core informational (logged, not failed)', () => {
  test('/best-nootropics/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/best-nootropics/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/best-nootropics/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
