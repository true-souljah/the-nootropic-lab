import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CITATIONS } from '@nootropic/data';

// PubMed citation allow-list gate (2026-10-06). The PubMed audit of every
// citationUrl found 8 of the 135 cited PMIDs pointed at unrelated papers (e.g.
// a cadmium phytostabilisation study cited for citicoline, a tonsil-cancer
// radiotherapy paper for B-vitamins). Every PMID a page cites must now be in
// packages/data/src/citations.ts with its real PubMed title, so a mistyped or
// unverified PMID fails CI instead of shipping.

const REPO = join(__dirname, '..', '..', '..');
const PMID_URL = /(?:pubmed\.ncbi\.nlm\.nih\.gov\/|ncbi\.nlm\.nih\.gov\/pubmed\/)(\d+)/g;

// PMIDs the audit found pointing at the wrong paper, plus the retracted Cera-Q
// mouse study (24043122). None may be re-added to the allow-list or cited.
const KNOWN_WRONG = [
  '22932089', // eEF-2 kinase in cancer, cited for DHA
  '22773333', // cadmium phytostabilisation, cited for citicoline
  '18834505', // ISSN nutrient-timing position stand, cited for Alpha-GPC / citicoline
  '12815182', // rat skeletal-muscle lipoprotein lipase, cited for Ginkgo
  '29097913', // PET imaging of FSHR in tumours, cited for Lutemax
  '27097658', // bacterial bistability, cited for Cera-Q
  '29580657', // editorial, cited for saffron
  '23357967', // tonsil carcinoma radiotherapy, cited for B-vitamins
  '24043122', // retracted (data fabrication) silk-fibroin mouse study
];
// PR #304 (fix/dosing-anchors-alcar-dha-2026-10) replaces these two on the
// pages; until it merges they are still cited here, so the page scan allows
// them. Remove this allowance once #304 is on main.
const PENDING_PR_304 = new Set(['22932089', '22773333']);

function walk(dir: string, keep: (name: string) => boolean, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, keep, out);
    else if (keep(name)) out.push(p);
  }
  return out;
}

const apps = readdirSync(join(REPO, 'apps')).filter((app) => existsSync(join(REPO, 'apps', app, 'src', 'app')));
const pageFiles = apps.flatMap((app) => walk(join(REPO, 'apps', app, 'src', 'app'), (n) => n === 'page.tsx'));

interface Occurrence {
  file: string;
  pmid: string;
}
const occurrences: Occurrence[] = pageFiles.flatMap((f) =>
  [...readFileSync(f, 'utf8').matchAll(PMID_URL)].map((m) => ({ file: relative(REPO, f), pmid: m[1] })),
);
const allowed = new Set(CITATIONS.map((c) => c.pmid));

describe('PubMed citations — allow-list', () => {
  it('scans a non-empty page set (guards against a silently empty glob)', () => {
    expect(apps.length).toBeGreaterThanOrEqual(8);
    expect(pageFiles.length).toBeGreaterThan(100);
    expect(occurrences.length).toBeGreaterThanOrEqual(100);
  });

  it('allow-list entries are well-formed and unique', () => {
    expect(CITATIONS.length).toBeGreaterThan(100);
    const seen = new Set<string>();
    for (const c of CITATIONS) {
      expect(c.pmid, JSON.stringify(c)).toMatch(/^\d+$/);
      expect(seen.has(c.pmid), `duplicate PMID ${c.pmid}`).toBe(false);
      seen.add(c.pmid);
      expect(c.title.trim(), `${c.pmid} title`).not.toBe('');
      expect(c.firstAuthor.trim(), `${c.pmid} firstAuthor`).not.toBe('');
      expect(Number.isInteger(c.year) && c.year >= 1950 && c.year <= 2100, `${c.pmid} year ${c.year}`).toBe(true);
    }
  });

  it('every PMID cited by a page is in the allow-list', () => {
    const unknown = occurrences
      .filter((o) => !allowed.has(o.pmid) && !PENDING_PR_304.has(o.pmid))
      .map((o) => `${o.file}: ${o.pmid}`);
    expect(
      unknown,
      'Unknown PMID: open its PubMed record, confirm the paper supports the sentence that cites it, then add it to packages/data/src/citations.ts with its real title',
    ).toEqual([]);
  });
});

describe('PubMed citations — known-wrong PMIDs stay out', () => {
  it('no known-wrong PMID is in the allow-list', () => {
    expect(KNOWN_WRONG.filter((p) => allowed.has(p))).toEqual([]);
  });

  it('no known-wrong PMID is cited in app or package source', () => {
    const sources = [
      ...apps.flatMap((app) => walk(join(REPO, 'apps', app, 'src'), (n) => /\.(tsx?|json|mdx?)$/.test(n))),
      ...readdirSync(join(REPO, 'packages'))
        .filter((pkg) => existsSync(join(REPO, 'packages', pkg, 'src')))
        .flatMap((pkg) =>
          walk(join(REPO, 'packages', pkg, 'src'), (n) => /\.(tsx?|json|mdx?)$/.test(n) && !/\.test\.tsx?$/.test(n)),
        ),
    ];
    expect(sources.length).toBeGreaterThan(200);
    const offenders: string[] = [];
    for (const f of sources) {
      const text = readFileSync(f, 'utf8');
      for (const pmid of KNOWN_WRONG) {
        if (PENDING_PR_304.has(pmid)) continue;
        if (new RegExp(`\\b${pmid}\\b`).test(text)) offenders.push(`${relative(REPO, f)}: ${pmid}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
