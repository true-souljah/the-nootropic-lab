import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Prose must agree with the stored guarantee and pricing model (2026-10-07).
// The vendor-terms import corrected moneyBackDays and pricingModel from the
// vendors' own pages (scripts/import-vendor-terms.ts); the review copy kept
// stating the old values ("90-day money-back" for Onnit's 30-day guarantee,
// "Subscription only" for Thesis, "No money-back guarantee" for FANCL). A
// value change is not done while prose still states the old value.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REPO = join(__dirname, '..', '..', '..');
const REGIONS: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const PROSE_FIELDS = ['summary', 'whatItIs', 'howItWorks', 'whatToExpect', 'pros', 'cons'] as const;

/**
 * An N-day guarantee: "30-day money-back", "100-day money-back guarantee",
 * "Strict 30-day guarantee", "60-day refund", "90-day return policy", and the
 * es/pt/fr/de/ja forms ("garantía de 30 días", "30 Tage Geld-zurück", "90日間返金保証").
 */
const N_DAY_GUARANTEE =
  /(\d+)[- ]?days?\s+(?:money[- ]?back|(?:satisfaction\s+)?guarantee|refund|return (?:policy|window))|(?:garant[íi]a|reembolso|devoluci[óo]n|devolução|garantie|remboursement)\s+(?:de\s+)?(\d+)\s*(?:d[íi]as|jours)|(\d+)\s*(?:d[íi]as|jours)\s+(?:de\s+)?(?:garant[íi]a|garantie|reembolso|remboursement)|(\d+)[- ]?Tage\S*\s+(?:Geld-zurück|Garantie)|(\d+)日間?(?:の)?(?:返金|返品)/gi;
/** The day count of an N_DAY_GUARANTEE match, whichever form matched. */
const matchDays = (m: RegExpMatchArray): number => Number(m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5]);
/** "No money-back guarantee" stated on a record that has one. */
const NO_GUARANTEE = /\bno (?:money[- ]?back|refund|satisfaction) guarantee/i;
/** Prose saying only a subscription is sold. */
const SUBSCRIPTION_ONLY = /subscription[- ]only|cannot purchase a one-time/i;
/** Prose saying no subscription is sold. */
const ONE_TIME_ONLY = /one-time purchase model|\(no subscription\)/i;

function prose(p: Product): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const field of PROSE_FIELDS) {
    const value = p[field] as unknown;
    if (typeof value === 'string') out.push([field, value]);
    else if (Array.isArray(value)) value.forEach((v, i) => typeof v === 'string' && out.push([`${field}[${i}]`, v]));
  }
  return out;
}

describe('product prose agrees with moneyBackDays and pricingModel', () => {
  const records = Object.entries(REGIONS).flatMap(([region, products]) => products.map((p) => ({ region, p })));

  test('the scan covers every region and finds guarantee wording (non-empty input)', () => {
    expect(records.length).toBeGreaterThanOrEqual(70);
    const mentions = records.flatMap(({ p }) => prose(p).flatMap(([, text]) => [...text.matchAll(N_DAY_GUARANTEE)]));
    expect(mentions.length).toBeGreaterThanOrEqual(30);
  });

  test('an N-day money-back / guarantee / refund in prose equals the record’s moneyBackDays (none when it is null or 0)', () => {
    const wrong: string[] = [];
    for (const { region, p } of records) {
      const days = p.moneyBackDays;
      for (const [field, text] of prose(p)) {
        for (const m of text.matchAll(N_DAY_GUARANTEE)) {
          if (days === null || days <= 0 || matchDays(m) !== days) {
            wrong.push(`${region}/${p.id}.${field}: "${m[0]}" but moneyBackDays is ${days}`);
          }
        }
        if (days !== null && days > 0 && NO_GUARANTEE.test(text)) {
          wrong.push(`${region}/${p.id}.${field}: says there is no guarantee but moneyBackDays is ${days}`);
        }
      }
    }
    expect(wrong).toEqual([]);
  });

  test('prose does not contradict the pricing model', () => {
    const wrong: string[] = [];
    for (const { region, p } of records) {
      for (const [field, text] of prose(p)) {
        if (p.pricingModel !== 'subscription' && SUBSCRIPTION_ONLY.test(text)) {
          wrong.push(`${region}/${p.id}.${field}: subscription-only wording but pricingModel is ${p.pricingModel}`);
        }
        if (p.pricingModel !== 'one-time' && ONE_TIME_ONLY.test(text)) {
          wrong.push(`${region}/${p.id}.${field}: one-time-only wording but pricingModel is ${p.pricingModel}`);
        }
      }
    }
    expect(wrong).toEqual([]);
  });
});

describe('app pages state each product’s guarantee length as stored', () => {
  // Words that start a product name but also appear on their own in copy
  // ("Alpha-GPC", "Lion's Mane", "mind"), so they never identify a product.
  const AMBIGUOUS = new Set(['Mind', 'Alpha', "Lion's", 'Performance', 'Pre', 'Eu', 'Memo']);
  function aliases(p: Product): string[] {
    const first = p.name.split(/\s+/)[0];
    return [p.name, p.brand.replace(/\s*\(.*\)$/, ''), ...(first.length >= 4 && !AMBIGUOUS.has(first) ? [first] : [])];
  }
  /** Products named in `text`, with the index of each mention. */
  function mentions(text: string, products: Product[]): Array<{ p: Product; at: number }> {
    const out: Array<{ p: Product; at: number }> = [];
    for (const p of products) {
      for (const alias of aliases(p)) {
        const re = new RegExp(`(?<![\\w-])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'g');
        for (const m of text.matchAll(re)) out.push({ p, at: m.index ?? 0 });
      }
    }
    return out;
  }
  /**
   * The product an "N-day money-back" phrase is about: the nearest product
   * named before it in its sentence, else the first named after it in that
   * sentence, else the nearest `slug === '…'` listing entry or name in the
   * six lines above. Undefined when the copy names none.
   */
  function productFor(lines: string[], i: number, at: number, products: Product[]): Product | undefined {
    const line = lines[i];
    const starts = [...line.slice(0, at).matchAll(/[.!?](?=\s|['"`]|$)/g)].map((m) => (m.index ?? 0) + 1);
    const sentenceStart = starts.length ? starts[starts.length - 1] : 0;
    const endMatch = /[.!?](?=\s|['"`]|$)/.exec(line.slice(at));
    const sentenceEnd = endMatch ? at + endMatch.index : line.length;
    const before = mentions(line.slice(sentenceStart, at), products).sort((a, b) => b.at - a.at)[0];
    if (before) return before.p;
    // A product named after the phrase as a comparison ("longer than Mind Lab Pro's") is not its subject.
    const tail = line.slice(at, sentenceEnd);
    const after = mentions(tail, products)
      .filter((x) => !/\b(?:than|vs\.?|versus)\s+$/i.test(tail.slice(0, x.at)))
      .sort((a, b) => a.at - b.at)[0];
    if (after) return after.p;
    for (let j = i; j >= Math.max(0, i - 6); j--) {
      const text = j === i ? line.slice(0, at) : lines[j];
      const slug = [...text.matchAll(/slug === '([^']+)'/g)].pop()?.[1];
      const bySlug = slug ? products.find((p) => p.slug === slug) : undefined;
      if (bySlug) return bySlug;
      const named = mentions(text, products).sort((a, b) => b.at - a.at)[0];
      if (named) return named.p;
    }
    return undefined;
  }

  function walk(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
      if (name === 'node_modules' || name === '.next' || name === 'out') continue;
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path, out);
      else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(path);
    }
    return out;
  }
  const appFiles = readdirSync(join(REPO, 'apps'))
    .filter((app) => existsSync(join(REPO, 'apps', app, 'src')))
    .flatMap((app) => walk(join(REPO, 'apps', app, 'src')));
  const lengths = new Set(
    Object.values(REGIONS).flatMap((products) => products.map((p) => p.moneyBackDays).filter((d): d is number => d !== null && d > 0)),
  );

  test('scans a non-empty source set', () => {
    expect(appFiles.length).toBeGreaterThan(100);
    expect(lengths.size).toBeGreaterThan(2);
  });

  test('every "N-day money-back / guarantee / refund" on an app page matches the product it is about', () => {
    const stale: string[] = [];
    let checked = 0;
    for (const file of appFiles) {
      const region = relative(join(REPO, 'apps'), file).split(/[/\\]/)[0];
      const products = REGIONS[region] ?? [];
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        for (const m of line.matchAll(N_DAY_GUARANTEE)) {
          checked++;
          const n = matchDays(m);
          const p = productFor(lines, i, m.index ?? 0, products);
          const ok = p ? p.moneyBackDays === n : lengths.has(n);
          if (!ok) stale.push(`${relative(REPO, file)}:${i + 1}: "${m[0]}" (${p ? `${p.id} moneyBackDays ${p.moneyBackDays}` : 'no product named'})`);
        }
      });
    }
    expect(checked).toBeGreaterThan(5);
    expect(stale).toEqual([]);
  });

  test('every rendered moneyBackDays goes through guaranteeDays / guaranteeDaysValue (0 never shows as "0 days")', () => {
    // A raw `${p.moneyBackDays}`, `{p.moneyBackDays}` or `moneyBackDays ?? ''`
    // prints "0 days" / "0" for a record with no guarantee. Sorting, scoring
    // and the Pricing-tab label may read the number directly.
    const files = [...walk(join(REPO, 'packages', 'ui', 'src')), ...appFiles];
    expect(files.length).toBeGreaterThan(150);
    const raw: string[] = [];
    for (const file of files) {
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        if (/\$\{[^}]*moneyBackDays[^}]*\}|moneyBackDays\s*\?\?\s*''|\{\s*[\w.]*\.moneyBackDays\s*\}/.test(line)) {
          raw.push(`${relative(REPO, file)}:${i + 1}`);
        }
      });
    }
    expect(raw).toEqual([]);
  });
});
