import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// US axe template-route DEPTH extension. PR-Q60.
//
// Companion to e2e/us-axe-a11y.spec.ts (PR-Q21 — Quiz / DoseCalculator
// / Shortlist) and every region's axe spec (Q37/Q41/Q42 — Home /
// BestOf / regulatory pillar).
//
// After the 8-axis universal-coverage milestone (PR-Q59), the natural
// next move is DEPTH — extend coverage beyond /best-nootropics-for-
// focus/ and the already-probed template-unique routes to the
// remaining template surfaces no axe spec touches:
//
//   /mind-lab-pro-review/                    — ProductDetail
//                                              (tab strip — PR-Q38
//                                              territory + IngredientGrid
//                                              + ReviewsTab + PricingTab)
//   /alpha-brain-vs-qualia-mind/             — HeadToHead (2-way
//                                              comparison table +
//                                              side-by-side sections)
//   /alpha-brain-vs-mind-lab-pro-vs-noocube/ — ThreeWay (3-way
//                                              comparison table with
//                                              extra column density)
//   /ingredients/l-theanine/                 — IngredientDetail
//                                              (ScoreBar + mechanism
//                                              explainer + source
//                                              citations)
//
// All four templates ship across all 8 region apps via @nootropic/ui.
// Surfacing axe violations on US first follows the canonical pattern
// — US's Listicle/BestOf etc. served as the reference for every
// other region's spec. If this PR surfaces a portfolio-wide WCAG bug
// (mirroring Q37/Q38/Q41/Q51/Q58), the fix benefits every region.
//
// Targets WCAG 2.1 Level A + AA. Fails only on serious + critical.

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

test.describe('US template-depth extension — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/mind-lab-pro-review/ (ProductDetail) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/mind-lab-pro-review/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/alpha-brain-vs-qualia-mind/ (HeadToHead) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/alpha-brain-vs-qualia-mind/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/alpha-brain-vs-mind-lab-pro-vs-noocube/ (ThreeWay) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/alpha-brain-vs-mind-lab-pro-vs-noocube/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/ingredients/l-theanine/ (IngredientDetail) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/ingredients/l-theanine/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('US template-depth extension — axe-core informational (logged, not failed)', () => {
  test('/mind-lab-pro-review/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/mind-lab-pro-review/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/mind-lab-pro-review/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
