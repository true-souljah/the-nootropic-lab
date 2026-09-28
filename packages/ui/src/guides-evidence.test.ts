import { describe, test, expect } from 'vitest';
import { guides, guidesEs, guideSources } from '@nootropic/data';
import type { Guide } from '@nootropic/data';

// Guards for the 2026-09 guide evidence review (fix/guides-evidence-2026-09).
// Every educational guide renders a Sources block and an "Evidence reviewed"
// date; the sources come only from the fact-check evidence file
// (nootropics-research/2026-09/evidence/guides.json → citationsToAdd).
// The copy guards below stop the corrected claims from regressing when the
// guides are regenerated or re-translated.

const LOCALES: Array<[string, Guide[]]> = [
  ['en', guides],
  ['es', guidesEs],
];

describe('guide sources', () => {
  for (const [locale, list] of LOCALES) {
    test(`${locale}: every guide has ≥3 sources with absolute https URLs and numeric PMIDs`, () => {
      expect(list.length).toBeGreaterThan(0);
      for (const g of list) {
        expect(g.sources.length, `${locale}/${g.slug} source count`).toBeGreaterThanOrEqual(3);
        for (const s of g.sources) {
          expect(s.url, `${locale}/${g.slug} url`).toBeTruthy();
          const u = new URL(s.url);
          expect(u.protocol, `${locale}/${g.slug} ${s.url}`).toBe('https:');
          expect(s.title.trim(), `${locale}/${g.slug} title`).not.toBe('');
          expect(Number.isInteger(s.year), `${locale}/${g.slug} year`).toBe(true);
          if (s.pmid !== undefined) {
            expect(s.pmid, `${locale}/${g.slug} pmid`).toMatch(/^\d+$/);
            expect(s.url, `${locale}/${g.slug} PubMed URL carries its PMID`).toBe(`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`);
          }
        }
      }
    });

    test(`${locale}: every guide carries an ISO evidenceReviewedAt date`, () => {
      for (const g of list) {
        expect(g.evidenceReviewedAt, `${locale}/${g.slug}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(`${g.evidenceReviewedAt}T00:00:00Z`)), `${locale}/${g.slug} valid date`).toBe(false);
      }
    });
  }

  test('Spanish guides cover the same slugs and cite the same sources as English', () => {
    expect(guidesEs.map((g) => g.slug)).toEqual(guides.map((g) => g.slug));
    for (const g of guidesEs) {
      expect(g.sources, g.slug).toBe(guideSources[g.slug]);
    }
    for (const g of guides) {
      expect(g.sources, g.slug).toBe(guideSources[g.slug]);
    }
  });
});

// Corrected claims from the 2026-09 fact-check: each pattern is a sentence
// the evidence review found unsupported, outdated, or commercially biased.
const BANNED: Array<{ slugs: string[] | 'all'; pattern: RegExp; why: string }> = [
  { slugs: ['how-to-stack-nootropics'], pattern: /\b50\s?%/, why: 'invented "reduce choline dose by 50%" instruction' },
  { slugs: ['how-to-stack-nootropics'], pattern: /Lion's Mane 500mg|Phosphatidylserine 100mg/, why: 'stack 3 doses below the trial ranges in the evidence files' },
  { slugs: 'all', pattern: /most robust data|datos más sólidos/i, why: 'microdosing creativity claim contradicted by blinded RCTs' },
  { slugs: 'all', pattern: /most replicable|más replicables/i, why: 'unsupported superlative about L-theanine + caffeine' },
  { slugs: 'all', pattern: /centuries of traditional use|siglos de uso tradicional/i, why: 'traditional use presented as long-term safety data' },
  { slugs: 'all', pattern: /from around age 30|los 30 años/i, why: 'unsourced age-30 PS decline figure' },
  {
    slugs: ['how-to-stack-nootropics', 'natural-vs-synthetic-nootropics', 'nootropics-for-focus-vs-memory'],
    pattern: /Mind Lab Pro|Performance Lab|Nootropics Depot|NooCube|\bThesis\b/,
    why: 'commercial product placement inside educational prose',
  },
];

describe('guide copy guards (2026-09 evidence corrections)', () => {
  for (const [locale, list] of LOCALES) {
    test(`${locale}: corrected claims do not reappear`, () => {
      let scanned = 0;
      for (const g of list) {
        const text = [g.title, g.description, ...g.sections.flatMap((s) => [s.heading, s.content])].join('\n');
        for (const rule of BANNED) {
          if (rule.slugs !== 'all' && !rule.slugs.includes(g.slug)) continue;
          scanned++;
          expect(text, `${locale}/${g.slug}: ${rule.why}`).not.toMatch(rule.pattern);
        }
      }
      expect(scanned).toBeGreaterThan(0);
    });
  }
});
