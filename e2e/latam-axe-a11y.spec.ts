import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on 3 representative LATAM
// routes. Twin of e2e/jp-axe-a11y.spec.ts and e2e/eu-axe-a11y.spec.ts.
//
// Targets WCAG 2.1 Level A + AA and only fails on serious + critical
// violations (moderate + minor reported informationally).
//
// Why this spec exists: the JP-only axe coverage (added in PR-Q6) caught
// the Klaro contrast bug that PR-Q16 fixed — that bug existed on every
// region but only JP detected it. Extending axe coverage to LATAM, CA,
// and EU (PR-Q17 added EU, PR-Q19 adds LATAM + CA) closes that blind
// spot across the 4 currently-tested regions.
//
// Routes selected to mirror the LATAM smoke coverage in latam-guides:
//   / — home page (root, FPHeader + FPFooter + Klaro overlay)
//   /best-nootropics-for-focus/ — Listicle template with breadcrumb
//   /guides/ — PublicShell-backed guide hub

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

test.describe('LATAM routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/best-nootropics-for-focus/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/best-nootropics-for-focus/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/guides/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/guides/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('LATAM routes — axe-core informational (logged, not failed)', () => {
  test('/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
