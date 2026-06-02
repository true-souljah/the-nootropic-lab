import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on the 3 EU nested-locale
// landing pages. Twin of e2e/jp-axe-a11y.spec.ts.
//
// Targets WCAG 2.1 Level A + AA and only fails on serious + critical
// violations (moderate + minor reported informationally).
//
// Why this spec exists now: pre-PR-Q14 the Klaro consent banner never
// actually mounted in production, so a latent contrast bug in
// klaro-overrides.css went undetected for the lifetime of the
// override file. PR-Q14 made Klaro mount and the JP axe spec caught
// the failure on /ja/*. PR-Q16 fixed the contrast. Extending axe
// coverage to /de/, /fr/, /pt/ here means any future contrast or
// landmark regression on these routes — Klaro-related or otherwise —
// gets caught before it ships.

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

test.describe('EU nested-locale landings — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/de/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/de/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/fr/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/fr/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/pt/ has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/pt/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('EU nested-locale landings — axe-core informational (logged, not failed)', () => {
  test('/de/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/de/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/de/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
