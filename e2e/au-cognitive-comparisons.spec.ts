import { test, expect } from '@playwright/test';

// AU cognitive-accessibility on COMPARISON pages — extension to
// Q82/Q84 brand-review coverage. PR-Q87.
//
// Comparison pages (head-to-head and 3-way comparators) summarize
// multiple products' regulator stances side-by-side. Editorial
// copy quotes whatItIs / pros / cons across both/all products,
// which means regulator acronyms from any product's data leak
// into the comparison page body.
//
// Per Q83/Q85/Q86 evidence: editorial drift across product copy
// rarely expands regulator acronyms on first occurrence. Comparison
// pages aggregate this drift across multiple products on a single
// page, often producing MULTIPLE unexpanded acronyms per page.

const ABBREVIATIONS = [
  { acronym: 'GMP', expansion: 'Good Manufacturing Practice' },
  { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  { acronym: 'cGMP', expansion: 'current Good Manufacturing Practice' },
  { acronym: 'USP', expansion: 'United States Pharmacopeia' },
  { acronym: 'TGA', expansion: 'Therapeutic Goods Administration' },
];

const COMPARISON_ROUTES = [
  '/blackmores-brain-active-vs-mind-lab-pro/',
];

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

interface ExpansionResult {
  found: boolean;
  via: string;
  match: string;
  acronymPresent: boolean;
}

async function checkExpansion(
  page: import('@playwright/test').Page,
  url: string,
  acronym: string,
  expansion: string,
): Promise<ExpansionResult> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return page.evaluate(
    ({ acronym: a, expansion: e }: { acronym: string; expansion: string }) => {
      const body = document.body.innerText;
      const acronymRe = new RegExp(`\\b${a}\\b`);
      const acronymPresent = acronymRe.test(body);
      if (!acronymPresent) {
        return { found: true, via: 'acronym-absent', match: '', acronymPresent: false };
      }
      const abbrs = document.querySelectorAll('abbr');
      for (const ab of abbrs) {
        const title = ab.getAttribute('title') ?? '';
        const text = (ab.textContent ?? '').trim();
        if (text === a && title.toLowerCase().includes(e.toLowerCase())) {
          return { found: true, via: 'abbr', match: `<abbr title="${title}">${text}</abbr>`, acronymPresent: true };
        }
      }
      const escE = e.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
      const inline1 = new RegExp(`\\b${a}\\s*\\([^()]*${escE}[^()]*\\)`, 'i');
      const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${a}\\s*\\)`, 'i');
      if (inline1.test(body)) {
        return { found: true, via: 'inline-acronym-first', match: '', acronymPresent: true };
      }
      if (inline2.test(body)) {
        return { found: true, via: 'inline-expansion-first', match: '', acronymPresent: true };
      }
      return { found: false, via: 'none', match: '', acronymPresent: true };
    },
    { acronym, expansion },
  );
}

test.describe('AU — WCAG 3.1.4 Abbreviations on comparison pages (content-tail)', () => {
  for (const route of COMPARISON_ROUTES) {
    for (const { acronym, expansion } of ABBREVIATIONS) {
      test(`${route} ${acronym} is expanded if mentioned`, async ({ page }) => {
        const result = await checkExpansion(page, route, acronym, expansion);

        if (!result.acronymPresent) {
          test.skip(true, `${acronym} not mentioned on ${route} — no expansion required`);
          return;
        }

        expect(
          result.found,
          `WCAG 3.1.4 failure on ${route}: ${acronym} appears but is NEVER expanded to "${expansion}" via ` +
            `<abbr title> or inline parenthetical. AT users + cognitive-disability users see the bare ` +
            `acronym without context. Result: ${JSON.stringify(result)}`,
        ).toBe(true);
      });
    }
  }
});
