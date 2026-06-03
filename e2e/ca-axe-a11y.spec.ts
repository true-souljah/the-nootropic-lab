import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on 3 representative CA
// routes (one EN-locale homepage + two fr-CA nested-locale routes).
// Twin of jp/eu/latam axe specs.
//
// Why this spec exists: the JP-only axe coverage (added in PR-Q6) caught
// the Klaro contrast bug PR-Q16 fixed — that bug existed on every region
// but only JP detected it. PR-Q19 brings axe to LATAM + CA, closing the
// blind spot across 4 of the 8 region apps.
//
// Routes selected:
//   /                              — CA en-CA home (root chrome)
//   /fr/meilleurs-nootropiques/    — CA fr-CA listicle (nested locale)
//   /fr/comparer/                  — CA fr-CA comparator (nested locale)

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

test.describe('CA routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/ (en-CA home) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/fr/meilleurs-nootropiques/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/fr/meilleurs-nootropiques/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/fr/comparer/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/fr/comparer/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('CA routes — axe-core informational (logged, not failed)', () => {
  test('/fr/meilleurs-nootropiques/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/fr/meilleurs-nootropiques/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/fr/meilleurs-nootropiques/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
