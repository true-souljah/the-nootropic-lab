import { describe, test, expect } from 'vitest';
import {
  productsUS,
  productsEU,
  productsCA,
  productsAU,
  productsJP,
  productsLatam,
  productsGCC,
  productsSEA,
  getRegionalHealthDisclaimer,
  type DisclaimerMarket,
  type Product,
} from '@nootropic/data';

// Per-product unit-level cognitive guards. PR-Q90.
//
// Q89 introduced unit-level guards on the shared regional
// disclaimers (regional-disclaimers-cognitive.test.ts) to catch
// regressions ~5ms-per-region instead of ~30s-per-page in the
// e2e probe. This file extends the same primitive to per-product
// editorial copy.
//
// What this catches:
//   - whatItIs / summary / pros / cons / howItWorks / whatToExpect
//     fields that mention a canonical region-regulator acronym
//     without inline expansion — locking in the 76+ cognitive
//     bug fixes from PR-Q82 through PR-Q88.
//
// Why this is needed in addition to e2e:
//   - e2e is page-level; if disclaimer happens to expand the
//     acronym, e2e passes even if product copy is bare.
//   - Future disclaimer edit could break that anchor → e2e
//     suddenly fails on dozens of pages.
//   - Unit guard catches the latent risk in product copy now,
//     before disclaimer drift turns it into a real regression.
//
// The check is conservative: per product, if the acronym appears
// in editorial copy AND the expansion does NOT appear anywhere
// in either editorial OR the regional disclaimer, fail.

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
  jp: [
    { acronym: 'MHLW', expansion: 'Ministry of Health, Labour and Welfare' },
  ],
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

function productEditorial(p: Product): string {
  return [
    p.whatItIs ?? '',
    p.summary ?? '',
    p.howItWorks ?? '',
    p.whatToExpect ?? '',
    ...(p.pros ?? []),
    ...(p.cons ?? []),
  ].join(' ');
}

function hasExpansion(text: string, acronym: string, expansion: string): boolean {
  const acronymPresent = new RegExp(`\\b${acronym}\\b`).test(text);
  if (!acronymPresent) return true;
  const escE = expansion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const inline1 = new RegExp(`\\b${acronym}\\s*\\([^()]*${escE}[^()]*\\)`, 'i');
  const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${acronym}\\s*\\)`, 'i');
  return inline1.test(text) || inline2.test(text);
}

const REGIONS: Array<[DisclaimerMarket, Product[]]> = [
  ['us', productsUS],
  ['eu', productsEU],
  ['ca', productsCA],
  ['au', productsAU],
  ['jp', productsJP],
  ['latam', productsLatam],
  ['gcc', productsGCC],
  ['sea', productsSEA],
];

describe('product editorial copy — WCAG 2.2 SC 3.1.4 unit guards (per-product per-region)', () => {
  for (const [region, products] of REGIONS) {
    const disclaimer = getRegionalHealthDisclaimer(region);
    const acronyms = REGION_ACRONYMS[region];

    for (const product of products) {
      const editorial = productEditorial(product);
      // The rendered page is (roughly) the product editorial + the
      // regional disclaimer. If the expansion lives in EITHER, the
      // probe passes — which mirrors what the e2e cognitive probes
      // see on the rendered page.
      const combinedPage = editorial + ' ' + disclaimer;

      for (const { acronym, expansion } of acronyms) {
        const acronymInEditorial = new RegExp(`\\b${acronym}\\b`).test(editorial);
        if (!acronymInEditorial) continue;

        test(`${region}: ${product.slug} — ${acronym} expanded if mentioned in editorial copy`, () => {
          expect(
            hasExpansion(combinedPage, acronym, expansion),
            `${region} product "${product.slug}" mentions "${acronym}" in editorial copy ` +
              `(whatItIs / summary / pros / cons / howItWorks / whatToExpect) but neither the ` +
              `product copy nor the shared regional disclaimer contains an inline expansion to ` +
              `"${expansion}". WCAG 3.1.4 violation. Editorial copy excerpt: "${editorial.slice(0, 200)}..."`,
          ).toBe(true);
        });
      }
    }
  }
});
