import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ingredients, getStrings } from '@nootropic/data';
import type { Ingredient, Locale } from '@nootropic/data';

// Guards for the 2026-09 PubMed evidence review of the ingredient pages
// (fix/ingredients-evidence-2026-09). Every ingredient cites sources taken
// only from its evidence snapshot in packages/data/evidence/ingredients-2026-09/
// (copied from nootropics-research/2026-09/evidence/<slug>.json): a status-200
// `studies[]` entry, or a `safetySignals[]` entry with a PMID (whose PubMed
// title/year are recorded on the signal), so safety claims carry their source.
// The copy guards stop the removed phantom citations and unsupported claims
// from returning when the pages are regenerated.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const EVIDENCE_DIR = join(__dirname, '..', '..', 'data', 'evidence', 'ingredients-2026-09');

interface EvidenceStudy {
  pmid: string | null;
  title: string;
  year: number;
  design: string;
  pubmedUrl: string;
  status: number;
}
interface EvidenceFile {
  slug: string;
  studies: EvidenceStudy[];
  safetySignals: Array<string | SafetySignal>;
}
interface SafetySignal {
  signal: string;
  pmid: string | null;
  url?: string | null;
  /** PubMed title, required when the signal's PMID is cited as a source. */
  title?: string;
  /** PubMed publication year, required when the signal's PMID is cited as a source. */
  year?: number;
}

function loadEvidence(slug: string): EvidenceFile {
  return JSON.parse(readFileSync(join(EVIDENCE_DIR, `${slug}.json`), 'utf8')) as EvidenceFile;
}

/** All reader-visible copy of an ingredient, excluding the verbatim source metadata. */
function copyOf(ing: Ingredient): string {
  const { sources: _sources, ...rest } = ing;
  return JSON.stringify(rest);
}

describe('ingredient sources', () => {
  test('the ingredient list is non-empty and every slug has an evidence snapshot', () => {
    expect(ingredients.length).toBeGreaterThanOrEqual(19);
    for (const ing of ingredients) {
      expect(existsSync(join(EVIDENCE_DIR, `${ing.slug}.json`)), `${ing.slug} evidence file`).toBe(true);
      expect(loadEvidence(ing.slug).slug).toBe(ing.slug);
    }
  });

  test('every ingredient has ≥3 sources with absolute https URLs and numeric PMIDs', () => {
    for (const ing of ingredients) {
      expect(ing.sources.length, `${ing.slug} source count`).toBeGreaterThanOrEqual(3);
      for (const s of ing.sources) {
        expect(new URL(s.url).protocol, `${ing.slug} ${s.url}`).toBe('https:');
        expect(s.title.trim(), `${ing.slug} title`).not.toBe('');
        expect(Number.isInteger(s.year), `${ing.slug} year`).toBe(true);
        if (s.pmid !== undefined) {
          expect(s.pmid, `${ing.slug} pmid`).toMatch(/^\d+$/);
          expect(s.url, `${ing.slug} PubMed URL carries its PMID`).toBe(`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`);
        }
      }
      const urls = ing.sources.map((s) => s.url);
      expect(new Set(urls).size, `${ing.slug} duplicate source URLs`).toBe(urls.length);
    }
  });

  test('no source is absent from its evidence JSON; PubMed metadata is copied verbatim', () => {
    for (const ing of ingredients) {
      const ev = loadEvidence(ing.slug);
      const studies = new Map(ev.studies.filter((st) => st.status === 200 && st.pmid).map((st) => [st.pmid as string, st]));
      const safetyUrls = new Set(
        ev.safetySignals.flatMap((sig) => (typeof sig === 'object' && sig.url ? [sig.url] : [])),
      );
      const safetyPmids = new Map(
        ev.safetySignals.flatMap((sig): Array<[string, SafetySignal]> =>
          typeof sig === 'object' && sig.pmid && /^\d+$/.test(sig.pmid) ? [[sig.pmid, sig]] : [],
        ),
      );
      for (const s of ing.sources) {
        if (s.pmid === undefined) {
          expect(safetyUrls.has(s.url), `${ing.slug}: non-PubMed source ${s.url} must come from safetySignals`).toBe(true);
          continue;
        }
        const st = studies.get(s.pmid);
        if (st === undefined) {
          const sig = safetyPmids.get(s.pmid);
          expect(sig, `${ing.slug}: PMID ${s.pmid} is neither a status-200 study nor a safety-signal PMID in the evidence JSON`).toBeDefined();
          expect(sig!.title, `${ing.slug}: safety signal ${s.pmid} lacks a PubMed title`).toBeTruthy();
          expect(sig!.year, `${ing.slug}: safety signal ${s.pmid} lacks a PubMed year`).toBeTypeOf('number');
          expect(s.title, `${ing.slug} ${s.pmid} title`).toBe(sig!.title);
          expect(s.year, `${ing.slug} ${s.pmid} year`).toBe(sig!.year);
          expect(s.url, `${ing.slug} ${s.pmid} url`).toBe(sig!.url);
          continue;
        }
        expect(s.title, `${ing.slug} ${s.pmid} title`).toBe(st!.title);
        expect(s.year, `${ing.slug} ${s.pmid} year`).toBe(st!.year);
        expect(s.url, `${ing.slug} ${s.pmid} url`).toBe(st!.pubmedUrl);
        if (s.design !== undefined) expect(s.design, `${ing.slug} ${s.pmid} design`).toBe(st!.design);
      }
    }
  });

  test('every ingredient carries the ISO evidence-review date', () => {
    for (const ing of ingredients) {
      expect(ing.evidenceReviewedAt, ing.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Round-trip so impossible calendar dates (e.g. 2026-02-31) cannot slip through.
      expect(new Date(`${ing.evidenceReviewedAt}T00:00:00Z`).toISOString().slice(0, 10), ing.slug).toBe(ing.evidenceReviewedAt);
    }
  });

  test('per-effect study counts never exceed the number of cited sources', () => {
    for (const ing of ingredients) {
      for (const e of ing.humanEffects) {
        if (e.studies === undefined) continue;
        expect(Number.isInteger(e.studies) && e.studies >= 0, `${ing.slug} / ${e.effect}`).toBe(true);
        expect(e.studies, `${ing.slug} / ${e.effect}`).toBeLessThanOrEqual(ing.sources.length);
      }
    }
  });
});

// Citations and claims the 2026-09 review could not trace to any PubMed
// record (no-evidence-found) or found contradicted by the cited trials.
const BANNED: Array<{ slugs: string[] | 'all'; pattern: RegExp; why: string }> = [
  { slugs: 'all', pattern: /LAMA II|\bLAMA\b/, why: 'nonexistent "LAMA/LAMA II" Lutemax trial' },
  { slugs: 'all', pattern: /Kennedy et al\.? \(?2017/, why: 'nonexistent Kennedy 2017 oat-straw blood-flow study' },
  { slugs: 'all', pattern: /Shevtsov/, why: 'misdated/misattributed "Shevtsov 2009" Rhodiola citation' },
  { slugs: 'all', pattern: /2012 Swedish/, why: 'nonexistent 2012 Swedish burnout RCT (real trial: Olsson 2008, 28 days)' },
  { slugs: 'all', pattern: /5 days on|5 on \/ 2 off|5\/2 cycling/i, why: 'untested huperzine "5 on / 2 off" cycling rule' },
  { slugs: 'all', pattern: /2020 (study|pilot RCT) found/, why: 'untraceable 2020 Lion\'s Mane nerve-regeneration / pilot claims' },
  { slugs: 'all', pattern: /menopausal women/i, why: 'unverified Lion\'s Mane menopausal-women RCTs' },
  { slugs: 'all', pattern: /2012 trial in elderly/, why: 'untraceable 2012 elderly Pycnogenol trial' },
  { slugs: 'all', pattern: /fMRI studies confirm|frontal lobe ATP/, why: 'untraceable citicoline fMRI/ATP claim' },
  { slugs: 'all', pattern: /Blood-thinning interaction possible/, why: 'unsubstantiated PS anticoagulant interaction' },
  { slugs: 'all', pattern: /Crook et al|Cenacchi|Secades|Zhang et al/, why: 'citations not re-verified with a PMID' },
  { slugs: 'all', pattern: /~18% greater/, why: 'untraceable citicoline vs choline bitartrate figure' },
  { slugs: 'all', pattern: /2021 observational study/, why: 'unlocated alpha-GPC cardiovascular study' },
  { slugs: 'all', pattern: /minimal tolerance development/i, why: 'unsupported "minimal tolerance" claim (no methylliberine tolerance study exists)' },
  { slugs: 'all', pattern: /over 400 clinical trials|gold-standard (studies|trials)/, why: 'unverified trial-count marketing claims' },
  { slugs: ['l-theanine', 'caffeine'], pattern: /2:1|1:2 ratio|eliminates jitteriness/, why: 'ratio/jitteriness claims contradicted by the trials (Rogers 2007; ~1:1–1.6:1 used)' },
  { slugs: ['lutemax-2020'], pattern: /"effect":"Digital Eye Strain"|Reduced digital eye strain|reduces eye fatigue|Most users report reduced/i, why: 'untested digital eye-strain claim' },
  { slugs: ['lutemax-2020'], pattern: /Lutemax 2020 (daily|improved|significantly)|matching the .* protocol/, why: 'implying Lutemax 2020 was the tested material in the cognition trials' },
  { slugs: ['zynamite'], pattern: /Zynamite \+ luteolin \(Dynamine\)|300mg Zynamite acutely improved/, why: 'contradicted Zynamite claims (Dodd 2024 null at 300mg)' },
  { slugs: ['l-tyrosine'], pattern: /reduces negative mood/i, why: 'contradicted tyrosine mood claim (Deijen 1994/1999 found no mood effect)' },
];

describe('ingredient copy guards (2026-09 evidence review)', () => {
  for (const rule of BANNED) {
    test(`no ${rule.why}`, () => {
      const targets = rule.slugs === 'all' ? ingredients : ingredients.filter((i) => (rule.slugs as string[]).includes(i.slug));
      expect(targets.length).toBeGreaterThan(0);
      for (const ing of targets) {
        expect(copyOf(ing), `${ing.slug}: ${rule.why}`).not.toMatch(rule.pattern);
      }
    });
  }

  const bySlug = (slug: string): Ingredient => {
    const ing = ingredients.find((i) => i.slug === slug);
    expect(ing, slug).toBeDefined();
    return ing!;
  };
  const side = (slug: string) => bySlug(slug).sideEffects.join(' ');

  test('safety signals from the review are disclosed', () => {
    expect(side('dha-omega-3')).toMatch(/atrial fibrillation/i);
    expect(side('dha-omega-3')).toMatch(/34612056/);
    expect(side('ashwagandha')).toMatch(/liver/i);
    expect(side('ashwagandha')).toMatch(/Denmark/);
    expect(side('caffeine')).toMatch(/pregnan[a-z]*.*200mg/i);
    expect(side('caffeine')).toMatch(/panic/i);
    expect(side('ginkgo-biloba')).toMatch(/warfarin/i);
    expect(side('bacopa-monnieri')).toMatch(/cramps|nausea/i);
    expect(side('acetyl-l-carnitine')).toMatch(/manic|mania/i);
    expect(side('acetyl-l-carnitine')).toMatch(/ADHD/);
    expect(side('l-tyrosine')).toMatch(/theoretical.*no clinical reports found/i);
    expect(side('rhodiola-rosea')).toMatch(/theoretical.*no clinical reports found/i);
    expect(side('dynamine')).toMatch(/manufacturer/i);
    expect(bySlug('dynamine').studySummary).toMatch(/negligible effect on objective cognitive tests/);
  });

  test('doses follow the trial ranges', () => {
    expect(bySlug('acetyl-l-carnitine').clinicalDose).toMatch(/^1500/);
    expect(bySlug('dynamine').clinicalDose).toMatch(/100–150mg/);
    expect(bySlug('dha-omega-3').clinicalDose).toMatch(/900mg–1\.2g/);
    expect(bySlug('lions-mane').clinicalDose).toMatch(/1–1\.8g.*3g/);
    expect(bySlug('l-tyrosine').clinicalDose).toMatch(/mg\/kg/);
  });

  test('anchor-trial funding is disclosed', () => {
    expect(bySlug('lions-mane').studySummary).toMatch(/Hokuto/);
    expect(bySlug('maritime-pine-bark').studySummary).toMatch(/Horphag|Irvine3/);
    expect(bySlug('maritime-pine-bark').studySummary).toMatch(/very low certainty/);
    expect(bySlug('zynamite').studySummary).toMatch(/Nektium/);
    expect(bySlug('lutemax-2020').studySummary).toMatch(/OmniActive/);
    expect(bySlug('lutemax-2020').studySummary).toMatch(/Abbott Nutrition/);
    expect(bySlug('phosphatidylserine').studySummary).toMatch(/IFF/);
  });
});

describe('ingredient evidence UI strings', () => {
  const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
  test('every locale has the Sources heading and evidence-review label', () => {
    for (const locale of ALL_LOCALES) {
      const s = getStrings(locale).ingredientEvidence;
      expect(s.sources, `${locale} sources`).toBeTruthy();
      expect(s.evidenceReviewed, `${locale} evidenceReviewed`).toBeTruthy();
    }
    for (const locale of ['es', 'ja', 'pt', 'de'] as Locale[]) {
      const s = getStrings(locale).ingredientEvidence;
      expect(s.evidenceReviewed, `${locale} evidenceReviewed is translated`).not.toBe(getStrings('en').ingredientEvidence.evidenceReviewed);
      expect(s.sources, `${locale} sources is translated`).not.toBe('Sources');
    }
  });

  test('the ingredient page passes the localized expand hint to <Sources>', () => {
    // Without expandLabel, Sources falls back to its English "expand" default on every locale.
    const src = readFileSync(join(__dirname, 'templates', 'IngredientDetail.tsx'), 'utf8');
    expect(src).toContain('expandLabel={uiStrings?.guide.expand');
    for (const locale of ALL_LOCALES) {
      expect(getStrings(locale).guide.expand, `${locale} guide.expand`).toBeTruthy();
    }
    for (const locale of ['es', 'ja', 'pt', 'de'] as Locale[]) {
      expect(getStrings(locale).guide.expand, `${locale} guide.expand is translated`).not.toBe('expand');
    }
  });
});
