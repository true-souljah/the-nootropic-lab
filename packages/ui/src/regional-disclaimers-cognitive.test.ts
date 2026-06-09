import { describe, test, expect } from 'vitest';
import { getRegionalHealthDisclaimer, type DisclaimerMarket } from '@nootropic/data';

// Regression guard for WCAG 2.2 SC 3.1.4 Abbreviations (Level AAA)
// on the shared regional health disclaimer text. PR-Q89.
//
// Per the Q88 "render-order matters" refinement: the regional
// disclaimer renders in a `<aside role="note">` BEFORE most other
// body content on Listicle pages, and on ProductDetail / BestOf
// templates it likewise appears in early DOM order. If a
// regulator acronym is bare in the disclaimer, every page that
// renders the disclaimer leaks the bug — much higher blast
// radius than any single page's whatItIs / summary string.
//
// This unit test pins the canonical expansion technique
// (technique G102 — first-mention inline parenthetical) per
// region. If the disclaimer is edited and a regulator acronym is
// reintroduced bare without expansion, this test fails fast — in
// the package unit run, before the playwright e2e even starts.

interface DisclaimerCheck {
  market: DisclaimerMarket;
  acronyms: Array<{ acronym: string; expansion: string }>;
}

const CHECKS: DisclaimerCheck[] = [
  {
    market: 'eu',
    acronyms: [{ acronym: 'EFSA', expansion: 'European Food Safety Authority' }],
  },
  {
    market: 'au',
    acronyms: [{ acronym: 'TGA', expansion: 'Therapeutic Goods Administration' }],
  },
  {
    market: 'ca',
    acronyms: [{ acronym: 'NPN', expansion: 'Natural Product Number' }],
  },
  {
    market: 'jp',
    acronyms: [{ acronym: 'PMD', expansion: 'Pharmaceuticals and Medical Devices' }],
  },
  {
    market: 'latam',
    acronyms: [
      { acronym: 'ANVISA', expansion: 'Agência Nacional de Vigilância Sanitária' },
      { acronym: 'COFEPRIS', expansion: 'Comisión Federal para la Protección contra Riesgos Sanitarios' },
      { acronym: 'INVIMA', expansion: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos' },
    ],
  },
  {
    market: 'gcc',
    acronyms: [
      { acronym: 'SFDA', expansion: 'Saudi Food and Drug Authority' },
      { acronym: 'MOHAP', expansion: 'Ministry of Health and Prevention' },
    ],
  },
  {
    market: 'sea',
    acronyms: [
      { acronym: 'HSA', expansion: 'Health Sciences Authority' },
      { acronym: 'NPRA', expansion: 'National Pharmaceutical Regulatory Agency' },
      { acronym: 'BPOM', expansion: 'Badan Pengawas Obat dan Makanan' },
      { acronym: 'BPJPH', expansion: 'Badan Penyelenggara Jaminan Produk Halal' },
      { acronym: 'JAKIM', expansion: 'Jabatan Kemajuan Islam Malaysia' },
    ],
  },
];

function findExpansion(text: string, acronym: string, expansion: string): boolean {
  const acronymPresent = new RegExp(`\\b${acronym}\\b`).test(text);
  if (!acronymPresent) return true;
  const escE = expansion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const inline1 = new RegExp(`\\b${acronym}\\s*\\([^()]*${escE}[^()]*\\)`, 'i');
  const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${acronym}\\s*\\)`, 'i');
  return inline1.test(text) || inline2.test(text);
}

describe('regional disclaimers — WCAG 2.2 SC 3.1.4 Abbreviations (regression guard)', () => {
  for (const { market, acronyms } of CHECKS) {
    const disclaimer = getRegionalHealthDisclaimer(market);
    for (const { acronym, expansion } of acronyms) {
      test(`${market}: ${acronym} is expanded if present`, () => {
        expect(
          findExpansion(disclaimer, acronym, expansion),
          `${market} disclaimer mentions "${acronym}" without inline expansion to "${expansion}". ` +
            `WCAG 3.1.4 violation propagates to every page that renders the regional disclaimer ` +
            `(Listicle, BrandReview, BestOf, ProductDetail). Disclaimer text: ${disclaimer}`,
        ).toBe(true);
      });
    }
  }
});
