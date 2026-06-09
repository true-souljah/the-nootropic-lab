import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { getRegionalHealthDisclaimer, type DisclaimerMarket } from '@nootropic/data';

function findListicleFiles(appRoot: string): string[] {
  if (!existsSync(appRoot)) return [];
  const entries = readdirSync(appRoot, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith('best-nootropics')) continue;
    const pageFile = resolve(appRoot, entry.name, 'page.tsx');
    if (existsSync(pageFile)) results.push(pageFile);
  }
  return results;
}

// Per-listicle-page unit-level cognitive guards. PR-Q91.
//
// Q88 surfaced + fixed 11 cognitive bugs on /best-nootropics-for-
// focus/ across 6 regions. Q89-Q90 introduced the unit-level
// regression guard primitive (for shared disclaimers + product
// catalogs). PR-Q91 extends the primitive to LISTICLE PAGE TSX
// FILES — there are 4-5 listicle variants per region
// (/best-nootropics/, /best-nootropics-for-focus/,
// /best-nootropics-for-studying/, /best-nootropics-for-memory/,
// /best-nootropics-for-aging/) totaling 45 files across 8
// regions.
//
// Q88 only fixed the focus variant per region. The other
// variants share the same editorial-drift risk: heroParagraph /
// whyItsHere / FAQ a strings authored independently per page.
// This test scans every listicle page.tsx source file and
// fails if any canonical regulator acronym appears bare.
//
// Per-page combined check (mirrors Q90 for products):
//   combinedPage = page.tsx source + regional disclaimer
//   for each canonical acronym:
//     if acronym appears in page.tsx source:
//       expect expansion somewhere in combinedPage

interface AcronymCheck {
  acronym: string;
  expansion: string;
}

const REGION_ACRONYMS: Record<DisclaimerMarket, AcronymCheck[]> = {
  us: [
    { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
    { acronym: 'cGMP', expansion: 'current Good Manufacturing Practice' },
  ],
  eu: [{ acronym: 'EFSA', expansion: 'European Food Safety Authority' }],
  ca: [
    { acronym: 'NPN', expansion: 'Natural Product Number' },
    { acronym: 'NHP', expansion: 'Natural Health Product' },
    { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  ],
  au: [
    { acronym: 'TGA', expansion: 'Therapeutic Goods Administration' },
    { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  ],
  jp: [{ acronym: 'MHLW', expansion: 'Ministry of Health, Labour and Welfare' }],
  latam: [
    { acronym: 'ANVISA', expansion: 'Agência Nacional de Vigilância Sanitária' },
    { acronym: 'COFEPRIS', expansion: 'Comisión Federal para la Protección contra Riesgos Sanitarios' },
    { acronym: 'INVIMA', expansion: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos' },
    { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  ],
  gcc: [
    { acronym: 'SFDA', expansion: 'Saudi Food and Drug Authority' },
    { acronym: 'MOHAP', expansion: 'Ministry of Health and Prevention' },
    { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  ],
  sea: [
    { acronym: 'HSA', expansion: 'Health Sciences Authority' },
    { acronym: 'NPRA', expansion: 'National Pharmaceutical Regulatory Agency' },
    { acronym: 'BPOM', expansion: 'Badan Pengawas Obat dan Makanan' },
    { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  ],
};

function hasExpansion(text: string, acronym: string, expansion: string): boolean {
  const acronymPresent = new RegExp(`\\b${acronym}\\b`).test(text);
  if (!acronymPresent) return true;
  const escE = expansion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const inline1 = new RegExp(`\\b${acronym}\\s*\\([^()]*${escE}[^()]*\\)`, 'i');
  const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${acronym}\\s*\\)`, 'i');
  return inline1.test(text) || inline2.test(text);
}

// Strip metadata blocks from the source — they are head-only and
// not rendered in body.innerText (the metadata.title /
// metadata.description / openGraph fields). The accessibility-
// lead review (Q88 condition #6) confirms these are out of scope
// for SC 3.1.4 body content.
function stripMetadata(source: string): string {
  // Remove the entire `export const metadata: Metadata = { ... };` block.
  // Be tolerant of variants (Metadata vs no type annotation).
  return source.replace(
    /export\s+const\s+metadata\s*(?::\s*\w+\s*)?=\s*\{[\s\S]*?\n\};/g,
    '',
  );
}

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const REGIONS: DisclaimerMarket[] = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];

describe('listicle page prose — WCAG 2.2 SC 3.1.4 unit guards (per page per region)', () => {
  for (const region of REGIONS) {
    const disclaimer = getRegionalHealthDisclaimer(region);
    const acronyms = REGION_ACRONYMS[region];

    // Discover all listicle page.tsx files for this region's app.
    const appRoot = resolve(REPO_ROOT, `apps/${region}/src/app`);
    const files = findListicleFiles(appRoot);

    for (const absolutePath of files) {
      const relativePath = absolutePath.slice(REPO_ROOT.length + 1);
      const rawSource = readFileSync(absolutePath, 'utf8');
      const body = stripMetadata(rawSource);
      const combinedPage = body + ' ' + disclaimer;

      for (const { acronym, expansion } of acronyms) {
        const acronymInPage = new RegExp(`\\b${acronym}\\b`).test(body);
        if (!acronymInPage) continue;

        test(`${region}: ${relativePath} — ${acronym} expanded if mentioned in prose`, () => {
          expect(
            hasExpansion(combinedPage, acronym, expansion),
            `${relativePath} mentions "${acronym}" in listicle prose (heroParagraph / whyItsHere ` +
              `/ FAQ / ingredientMechanism etc.) but neither the page source nor the shared regional ` +
              `disclaimer contains an inline expansion to "${expansion}". WCAG 3.1.4 violation.`,
          ).toBe(true);
        });
      }
    }
  }
});
