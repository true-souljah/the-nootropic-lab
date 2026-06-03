import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on 3 US routes that exercise
// templates the JP / EU / LATAM / CA axe specs don't cover:
//
//   /quiz/            — QuizFlow template (5-question funnel, radio
//                       groups, progress indicator, multi-step navigation)
//   /dose-calculator/ — DoseCalculator template (form with sliders +
//                       result panel, dynamic announcements)
//   /shortlist/       — Shortlist template (localStorage-backed compare
//                       cart, table with row toggles, share affordance)
//
// All three are US-only client components; LATAM/CA/EU/JP don't ship them.
//
// Targets WCAG 2.1 Level A + AA and only fails on serious + critical
// violations (moderate + minor reported informationally).
//
// PR-Q21 #85 — extends the same axe-core spec shape from jp/eu/latam/ca.

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

test.describe('US template-unique routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/quiz/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/quiz/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/dose-calculator/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/dose-calculator/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/shortlist/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/shortlist/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('US template-unique routes — axe-core informational (logged, not failed)', () => {
  test('/quiz/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/quiz/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/quiz/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
