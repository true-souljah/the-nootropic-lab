import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';

// Shared by the e2e/<region>-axe-palette.spec.ts guards (not a spec itself:
// playwright.config.ts collects *.spec.ts only).
//
// No other axe spec opens the command palette, so its result options were
// never scanned: until 2026-10-19 each option's aria-label ("Mind Lab Pro,
// score 7.5 out of 10 — …") left out its visible tile letter, score pill and
// "↵" key cap, which axe-core 4.14's label-content-name-mismatch (WCAG 2.5.3
// Label in Name) flags. These specs open the palette, type a query that
// returns product, ingredient and guide rows, check each option's computed
// name, and run axe over the open dialog: label-content-name-mismatch
// enabled explicitly (on by default in 4.14 via its wcag21a tag; the explicit
// enable keeps it on if a future version tags it experimental again) on top
// of axe's default rule set.

export interface PaletteCase {
  /** Route on this host. */
  path: string;
  /** How the palette opens: the Ctrl+K shortcut, or a click on the header trigger named `trigger`. */
  open: 'shortcut' | { trigger: string };
  /** Typed into the search field; returns product, ingredient and guide rows on this host. */
  query: string;
}

const RULE = 'label-content-name-mismatch';
const SERIOUSNESS = ['serious', 'critical'];
const DIALOG = '[role="dialog"][aria-modal="true"]:not(#klaro-cookie-notice)';

function summarize(results: Result[]): string {
  if (results.length === 0) return 'none';
  return results
    .map((r) => {
      const nodes = r.nodes
        .slice(0, 4)
        .map((n) => `  - ${JSON.stringify(n.target)}: ${n.html.slice(0, 160)}`)
        .join('\n');
      return `[${r.impact}] ${r.id}: ${r.help} (${r.nodes.length} node(s))\n${nodes}`;
    })
    .join('\n\n');
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function openPalette(page: Page, open: PaletteCase['open']): Promise<void> {
  const dialog = page.locator(DIALOG);
  await page.waitForLoadState('networkidle');
  // The shortcut listener and the trigger's onClick attach on hydration,
  // which can land after networkidle under full-suite load (PR-Q48/Q66).
  // Retry until the dialog is open; act only while it is closed, because the
  // shortcut toggles the palette.
  await expect(async () => {
    if ((await dialog.count()) === 0) {
      if (open === 'shortcut') await page.keyboard.press('Control+K');
      else await page.getByRole('button', { name: open.trigger, exact: true }).click({ timeout: 1000 });
    }
    await expect(dialog).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 15_000, intervals: [100, 250, 500, 1000] });
}

/** One test per case: open the palette, type the query, check the option names, run axe. */
export function paletteAxeSuite(host: string, cases: PaletteCase[]): void {
  test.describe(`${host} command palette — options named with their visible text (WCAG 2.5.3), axe on the open dialog`, () => {
    // Same declined-consent cookie as the keyboard specs, so the Klaro notice
    // does not take focus while the palette opens.
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

    for (const c of cases) {
      const how = c.open === 'shortcut' ? 'Ctrl+K' : `the "${c.open.trigger}" trigger`;
      test(`${c.path}: opened with ${how}, "${c.query}" — product, ingredient and guide options pass axe`, async ({ page }) => {
        await page.goto(c.path);
        await openPalette(page, c.open);
        const dialog = page.locator(DIALOG);
        await dialog.getByRole('textbox').pressSequentially(c.query);
        const options = dialog.getByRole('listbox').getByRole('option');
        await expect(options.first()).toBeVisible();

        // What each option shows: its title (the first text of the title
        // line), its score pill, its link.
        const rows = await options.evaluateAll((els) =>
          els.map((el) => ({
            href: el.getAttribute('href') ?? '',
            title: (el.querySelector('.font-semibold')?.firstChild?.textContent ?? '').trim(),
            pill: el.querySelector('[role="img"]')?.textContent?.trim() ?? null,
          })),
        );
        const products = rows.filter((r) => r.pill !== null);
        expect(products.length, `"${c.query}" returns product rows`).toBeGreaterThan(0);
        expect(rows.filter((r) => r.href.startsWith('/ingredients/')).length, `"${c.query}" returns ingredient rows`).toBeGreaterThan(0);
        expect(rows.filter((r) => r.href.startsWith('/guides/')).length, `"${c.query}" returns guide rows`).toBeGreaterThan(0);

        // The computed name starts with the visible title; a product's also
        // carries its score as "x/10".
        for (const [i, row] of rows.entries()) {
          expect(row.title, `${row.href}: title`).not.toBe('');
          await expect.soft(options.nth(i), `${row.href}: name starts with "${row.title}"`).toHaveAccessibleName(new RegExp(`^${escapeRegExp(row.title)}`));
          if (row.pill !== null) {
            await expect.soft(options.nth(i), `${row.href}: name contains "${row.pill}/10"`).toHaveAccessibleName(new RegExp(escapeRegExp(`${row.pill}/10`)));
          }
        }

        // The active row fades to its highlight (transition-colors). Let every
        // transition finish so axe measures the colors users see, not a
        // mid-fade background (that made color-contrast pass or fail by timing).
        await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
        const results = await new AxeBuilder({ page })
          .include(DIALOG)
          .options({ rules: { [RULE]: { enabled: true } } })
          .analyze();
        const ran = [...results.passes, ...results.violations, ...results.incomplete, ...results.inapplicable].some((r) => r.id === RULE);
        expect(ran, `${RULE} ran`).toBe(true);
        const mismatch = [...results.violations, ...results.incomplete].filter((r) => r.id === RULE);
        expect(mismatch, summarize(mismatch)).toEqual([]);
        const blockers = results.violations.filter((v) => SERIOUSNESS.includes(v.impact ?? 'minor'));
        expect(blockers, summarize(blockers)).toEqual([]);
        const advisory = results.violations.filter((v) => !SERIOUSNESS.includes(v.impact ?? 'minor'));
        // eslint-disable-next-line no-console
        console.log(`${host} ${c.path} palette "${c.query}": ${rows.length} options (${products.length} products), ${advisory.length} advisory violation(s)${advisory.map((v) => ` [${v.impact}] ${v.id}`).join('')}`);
      });
    }
  });
}
