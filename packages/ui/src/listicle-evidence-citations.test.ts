import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { CITATIONS, getStrings, productsEU } from '@nootropic/data';
import Listicle, { type ListicleIngredientMechanism } from './templates/Listicle';

// Evidence-card citations (2026-10-15). A "What the evidence actually says"
// card links one study (`citationUrl`, the "Source →" link), but 26 of the 148
// cards also named other studies by PubMed ID in their text, e.g. "(Rogers 2008,
// PubMed 17891480)" or "Foxe 2012 (PubMed 22326943)", which readers could not
// click. Every PMID a card's text names must now be linked from that card, by
// its citationUrl or by an `extraCitations` entry labelled with the study's
// author-year name as the text gives it.

const REPO = join(__dirname, '..', '..', '..');
const IN_TEXT_PMID = /\b(?:PubMed|PMIDs?):? (\d{5,9}(?:(?:, | and )\d{5,9})*)/g;
const PUBMED_URL = /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)\/$/;

interface EvidenceCard {
  file: string;
  name: string;
  evidence: string;
  citationUrl?: string;
  extraCitations: { label: string; url: string }[];
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === 'page.tsx') out.push(p);
  }
  return out;
}

const unquote = (s: string) => s.replace(/\\(.)/g, '$1');

/** The string literal ('…', "…", or `…` without ${}) or `+`-joined literals at `i`, or a loud error. */
function stringAt(file: string, src: string, i: number): string {
  const parts: string[] = [];
  for (;;) {
    while (/\s/.test(src[i] ?? '')) i++;
    const quote = src[i];
    if (quote !== "'" && quote !== '"' && quote !== '`') throw new Error(`${file}: unparsed evidence "${src.slice(i, i + 60)}"`);
    let text = '';
    for (i++; src[i] !== quote; i++) {
      if (i >= src.length) throw new Error(`${file}: unterminated evidence string`);
      if (quote === '`' && src.startsWith('${', i)) throw new Error(`${file}: evidence with a template expression`);
      if (src[i] === '\\') i++;
      text += src[i];
    }
    parts.push(text);
    i++;
    while (/\s/.test(src[i] ?? '')) i++;
    if (src[i] === '+') {
      i++;
      continue;
    }
    if (src[i] !== ',') throw new Error(`${file}: unexpected "${src.slice(i, i + 40)}" after evidence`);
    return parts.join('');
  }
}

/** A page's evidence cards with their text and every link they carry, or a loud error. */
function pageCards(file: string): EvidenceCard[] {
  const rel = relative(REPO, file);
  const src = readFileSync(file, 'utf8');
  const block = src.match(/: ListicleIngredientMechanism\[\] = \[\n([\s\S]*?)\n\];/)?.[1];
  if (!block) throw new Error(`${rel}: no ListicleIngredientMechanism[] array`);
  const entries = block.split(/^ {2}\{\n/m).slice(1);
  return entries.map((entry) => {
    const name = entry.match(/^ {4}name: '((?:\\.|[^'\\])*)',$/m)?.[1];
    const evidenceAt = entry.search(/^ {4}evidence:/m);
    if (name === undefined || evidenceAt < 0) throw new Error(`${rel}: unparsed evidence card "${entry.slice(0, 80)}"`);
    const evidence = stringAt(rel, entry, evidenceAt + '    evidence:'.length);
    const citationUrl = entry.match(/^ {4}citationUrl: '([^']*)',$/m)?.[1];
    const extraBlock = entry.match(/^ {4}extraCitations: \[\n([\s\S]*?)\n {4}\],$/m)?.[1];
    if (/^ {4}extraCitations:/m.test(entry) && extraBlock === undefined) {
      throw new Error(`${rel} "${name}": unparsed extraCitations`);
    }
    const extraCitations = [...(extraBlock ?? '').matchAll(/^ {6}\{ label: '((?:\\.|[^'\\])*)', url: '([^']*)' \},$/gm)].map(
      (m) => ({ label: unquote(m[1]), url: m[2] }),
    );
    const extraLines = (extraBlock ?? '').split('\n').filter((l) => l.trim() !== '').length;
    if (extraLines !== extraCitations.length) {
      throw new Error(`${rel} "${name}": ${extraLines} extraCitations lines, ${extraCitations.length} parsed`);
    }
    return { file: rel, name: unquote(name), evidence, citationUrl, extraCitations };
  });
}

/** PMIDs the text names as "PubMed <id>" / "PMID <id>" (the citations.test.ts pattern). */
function namedPmids(text: string): string[] {
  return [...new Set([...text.matchAll(IN_TEXT_PMID)].flatMap((m) => m[1].split(/, | and /)))];
}

const pmidOf = (url: string | undefined) => (url ? url.match(PUBMED_URL)?.[1] : undefined);

/** PMIDs the card's text names that neither its citationUrl nor its extraCitations link. */
function unlinkedPmids(card: Pick<EvidenceCard, 'evidence' | 'citationUrl' | 'extraCitations'>): string[] {
  const linked = new Set([pmidOf(card.citationUrl), ...card.extraCitations.map((c) => pmidOf(c.url))]);
  return namedPmids(card.evidence).filter((pmid) => !linked.has(pmid));
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pages = readdirSync(join(REPO, 'apps'))
  .map((app) => join(REPO, 'apps', app, 'src', 'app'))
  .filter(existsSync)
  .flatMap((dir) => walk(dir))
  .filter((file) => /: ListicleIngredientMechanism\[\] = \[/.test(readFileSync(file, 'utf8')))
  .sort();
const cards = pages.flatMap(pageCards);
const withExtras = cards.filter((c) => c.extraCitations.length > 0);
const allowed = new Set(CITATIONS.map((c) => c.pmid));

describe('evidence cards link every study their text names by PubMed ID', () => {
  it('the check flags a named PMID that no link points at, and accepts it once linked', () => {
    const card = {
      evidence: 'In a trial (Owen 2008) …; in a controlled trial (Rogers 2008, PubMed 17891480), theanine did not …',
      citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
      extraCitations: [] as { label: string; url: string }[],
    };
    expect(unlinkedPmids(card)).toEqual(['17891480']);
    expect(
      unlinkedPmids({ ...card, extraCitations: [{ label: 'Rogers 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/17891480/' }] }),
    ).toEqual([]);
    expect(unlinkedPmids({ ...card, evidence: 'Pase 2012 (PubMed 22747190)', citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/' })).toEqual([]);
  });

  it('scans all 36 listicle pages and their 148 evidence cards (guards against an empty or partial scan)', () => {
    expect(pages).toHaveLength(36);
    expect(cards).toHaveLength(148);
    expect(cards.filter((c) => namedPmids(c.evidence).length > 0).length).toBeGreaterThanOrEqual(26);
    expect(withExtras.length).toBeGreaterThanOrEqual(26);
    expect(withExtras.reduce((n, c) => n + c.extraCitations.length, 0)).toBeGreaterThanOrEqual(42);
  });

  it('every PMID a card names is linked by its citationUrl or its extraCitations', () => {
    const unlinked = cards.flatMap((c) => unlinkedPmids(c).map((pmid) => `${c.file} "${c.name}": PubMed ${pmid}`));
    expect(
      unlinked,
      'Add an extraCitations entry { label: "<Author Year as the card text names it>", url: "https://pubmed.ncbi.nlm.nih.gov/<PMID>/" } to the card',
    ).toEqual([]);
  });

  it('every extraCitations entry is a PubMed URL for a study the card names, labelled as the text names it', () => {
    const problems: string[] = [];
    for (const c of withExtras) {
      const where = `${c.file} "${c.name}"`;
      const citePmid = pmidOf(c.citationUrl);
      const seen = new Set<string>();
      for (const { label, url } of c.extraCitations) {
        const pmid = pmidOf(url);
        if (!pmid) {
          problems.push(`${where}: "${url}" is not https://pubmed.ncbi.nlm.nih.gov/<PMID>/`);
          continue;
        }
        if (!allowed.has(pmid)) problems.push(`${where}: PMID ${pmid} is not in packages/data/src/citations.ts`);
        if (pmid === citePmid) problems.push(`${where}: ${pmid} duplicates citationUrl`);
        if (seen.has(pmid) || seen.has(label)) problems.push(`${where}: duplicate extraCitations entry ${label} / ${pmid}`);
        seen.add(pmid).add(label);
        if (!/^\p{Lu}[\p{L}'’-]+ \d{4}[a-z]?$/u.test(label)) problems.push(`${where}: label "${label}" is not "Author Year"`);
        // The label must be the name the text gives this very PMID:
        // "Rogers 2008, PubMed 17891480" or "Foxe 2012 (PubMed 22326943)".
        if (!new RegExp(`${escapeRe(label)}(?:, | \\()PubMed ${pmid}\\b`).test(c.evidence)) {
          problems.push(`${where}: text does not name PubMed ${pmid} as "${label}"`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('Listicle renders extraCitations after the Source link', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_REGION', 'eu');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  const en = getStrings('en');
  const mlpEU = productsEU.find((p) => p.slug === 'mind-lab-pro-review')!;
  const render = (ingredientMechanism: ListicleIngredientMechanism[]) =>
    renderToStaticMarkup(
      createElement(Listicle, {
        useCase: 'focus',
        pageTitle: 't',
        pageDescription: 'd',
        heroParagraph: 'h',
        ingredientMechanism,
        picks: [{ product: mlpEU, whyItsHere: 'w', rank: 1 }],
        faqItems: [],
        siteUrl: 'https://example.com',
        uiStrings: en,
      }),
    );
  const sourceLink = (href: string, text: string) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 text-[12.5px] text-ds-accent underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded">${text}</a>`;
  const separator = '<span aria-hidden="true" class="text-[12.5px] text-ds-muted"> · </span>';
  /** The card body after its evidence paragraph, up to the card's closing tag. */
  const cardLinks = (html: string, evidence: string) => {
    const at = html.indexOf(`>${evidence}</p>`);
    expect(at, evidence).toBeGreaterThan(-1);
    const from = at + `>${evidence}</p>`.length;
    return html.slice(from, html.indexOf('</div>', from));
  };

  it('a card without extraCitations renders only its Source link, exactly as before', () => {
    const html = render([
      { name: 'Citicoline', evidence: 'e1', ingredientSlugs: ['citicoline'], citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/15846601/' },
    ]);
    expect(cardLinks(html, 'e1')).toBe(sourceLink('https://pubmed.ncbi.nlm.nih.gov/15846601/', en.listicle.sourceLink));
  });

  it('each extra study is its own link, in the Source link style, labelled with its author-year name', () => {
    const html = render([
      {
        name: 'L-Theanine + Caffeine',
        evidence: 'e2',
        ingredientSlugs: ['l-theanine', 'caffeine'],
        citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
        extraCitations: [
          { label: 'Giesbrecht 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/21040626/' },
          { label: 'Foxe 2012', url: 'https://pubmed.ncbi.nlm.nih.gov/22326943/' },
        ],
      },
    ]);
    expect(cardLinks(html, 'e2')).toBe(
      sourceLink('https://pubmed.ncbi.nlm.nih.gov/18681988/', en.listicle.sourceLink) +
        separator +
        sourceLink('https://pubmed.ncbi.nlm.nih.gov/21040626/', 'Giesbrecht 2010') +
        separator +
        sourceLink('https://pubmed.ncbi.nlm.nih.gov/22326943/', 'Foxe 2012'),
    );
  });

  it('with no citationUrl the first extra link has no leading separator', () => {
    const html = render([
      {
        name: 'Bacopa',
        evidence: 'e3',
        ingredientSlugs: ['bacopa-monnieri'],
        extraCitations: [{ label: 'Calabrese 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/18611150/' }],
      },
    ]);
    expect(cardLinks(html, 'e3')).toBe(sourceLink('https://pubmed.ncbi.nlm.nih.gov/18611150/', 'Calabrese 2008'));
  });
});
