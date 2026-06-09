import { test, expect } from '@playwright/test';

// LATAM cognitive-accessibility on LISTICLE page — extension to
// Q82/Q84/Q87 brand-review + comparison coverage. PR-Q88.
//
// /best-nootropics-for-focus/ is the Listicle template, which
// renders the `summary` field from EVERY top-ranked product
// (typically 5-7 products on a single page). Q82-Q86 fixed
// `whatItIs` strings; Q87 fixed `pros` strings; but `summary`
// strings were never directly probed.
//
// Per Q83/Q85/Q86 evidence: editorial drift across product
// summary fields rarely expands regulator acronyms on first
// occurrence. The Listicle page aggregates this drift across
// multiple products on a single page, often producing
// MULTIPLE unexpanded acronyms per page.

const ABBREVIATIONS = [
  { acronym: 'GMP', expansion: 'Good Manufacturing Practice' },
  { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  { acronym: 'cGMP', expansion: 'current Good Manufacturing Practice' },
  { acronym: 'USP', expansion: 'United States Pharmacopeia' },
  { acronym: 'ANVISA', expansion: 'Agência Nacional de Vigilância Sanitária' },
  { acronym: 'COFEPRIS', expansion: 'Comisión Federal para la Protección contra Riesgos Sanitarios' },
  { acronym: 'INVIMA', expansion: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos' },
];

const LISTICLE_ROUTES = [
  '/best-nootropics-for-focus/',
];

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

test.describe('LATAM — WCAG 3.1.4 Abbreviations on listicle pages (content-tail)', () => {
  for (const route of LISTICLE_ROUTES) {
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
