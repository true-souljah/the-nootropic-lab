// Writes each record's store price from checked evidence and removes the
// legacy per-currency price fields (site-owner policy 2026-10-09: a price
// shown is one the vendor states on the store the region links to, in that
// store's own currency, never a conversion).
//
//   npx tsx scripts/write-store-prices.ts <evidence.json>
//
// <evidence.json>: { "<region>": [{ id, slug, status, price: { text, amount,
// currency }, pack, supply, finalUrl, checkedAt }] }, one item per record,
// each quote already checked against the saved page text. A record gets
// `storePrice` only when its item is status "ok" with an ISO currency and a
// pack wording; every other record ends with no price (shown as "—"). Every
// live record needs exactly one item (a missing or duplicate item would
// otherwise erase or pick a price silently); discontinued records may have
// none. Nothing is written unless every region passes. Edits touch only the
// price keys (scripts/lib/json-in-place.ts), so a second run changes nothing.
// Each written record must pass storePriceProblems().
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyEdits, members, recordStarts, serialise, type Edit } from './lib/json-in-place';
import { storePriceProblems } from '../packages/data/src/store-price';
import type { Product, StorePrice } from '../packages/data/src/products-us';

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const LEGACY = ['priceMonthlyUSD', 'priceMonthlyEUR', 'priceMonthlyCAD', 'priceMonthlyAUD', 'priceMonthlyJPY', 'priceBasis'];
const DATA = join(__dirname, '..', 'packages', 'data', 'src');

type EvidenceItem = {
  id: string;
  slug: string;
  status: string;
  price: { text: string; amount: number; currency: string } | null;
  pack: string | null;
  supply: string | null;
  directions: string | null;
  finalUrl: string;
  checkedAt: string;
};

const evidencePath = process.argv[2];
if (!evidencePath) throw new Error('usage: write-store-prices.ts <evidence.json>');
const evidence = JSON.parse(readFileSync(evidencePath, 'utf8')) as Record<string, EvidenceItem[]>;
// The evidence file comes from the research pipeline: check its shape before reading it.
if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) throw new Error('evidence must be an object keyed by region');
for (const [region, items] of Object.entries(evidence)) {
  if (!(REGIONS as readonly string[]).includes(region)) throw new Error(`evidence has an unknown region "${region}"`);
  if (!Array.isArray(items)) throw new Error(`evidence.${region} must be an array`);
  for (const e of items) {
    if (!e || typeof e.id !== 'string' || typeof e.slug !== 'string' || typeof e.status !== 'string' || typeof e.finalUrl !== 'string' || typeof e.checkedAt !== 'string') {
      throw new Error(`evidence.${region}: item ${JSON.stringify(e?.id)} lacks id, slug, status, finalUrl or checkedAt`);
    }
  }
}

function storePriceFor(item: EvidenceItem | undefined): StorePrice | null {
  if (!item || item.status !== 'ok' || !item.price || !item.pack) return null;
  if (!/^[A-Z]{3}$/.test(item.price.currency)) return null;
  return {
    amount: item.price.amount,
    currency: item.price.currency,
    text: item.price.text,
    pack: item.pack,
    ...(item.supply ? { supply: item.supply } : {}),
    ...(item.directions ? { directions: item.directions } : {}),
    // The page the price was read from, without affiliate or tracking parameters.
    url: item.finalUrl.replace(/[?#].*$/, ''),
    checkedAt: item.checkedAt,
  };
}

const report: string[] = [];
const outputs: { path: string; src: string; out: string }[] = [];
let written = 0;
for (const region of REGIONS) {
  const path = join(DATA, `products-${region}.json`);
  const src = readFileSync(path, 'utf8');
  const parsed = JSON.parse(src) as Product[];
  const byId = new Map<string, EvidenceItem>();
  for (const e of evidence[region] ?? []) {
    if (byId.has(e.id)) throw new Error(`${region}/${e.id}: duplicate evidence item`);
    byId.set(e.id, e);
  }
  const edits: Edit[] = [];
  recordStarts(src).forEach((start, index) => {
    const list = members(src, start);
    const get = (key: string) => list.find((m) => m.key === key);
    const idMember = get('id')!;
    const id = JSON.parse(src.slice(idMember.valueStart, idMember.valueEnd)) as string;
    const indent = ' '.repeat(idMember.keyStart - src.lastIndexOf('\n', idMember.keyStart) - 1);
    const item = byId.get(id);
    if (!item && !parsed[index].discontinued) throw new Error(`${region}/${id}: no evidence item for a live record`);
    if (item && item.slug !== parsed[index].slug) throw new Error(`${region}/${id}: evidence slug "${item.slug}" ≠ "${parsed[index].slug}"`);
    const sp = storePriceFor(item);
    if (sp) {
      const problems = storePriceProblems({ ...parsed[index], storePrice: sp });
      if (problems.length) throw new Error(`${region}/${id}: ${problems.join('; ')}`);
      written++;
    }
    report.push(`${region}/${id}: ${sp ? `${sp.text} · ${sp.pack}${sp.supply ? ` · ${sp.supply}` : ''}` : `no price (${item ? item.status : 'no evidence'})`}`);

    // The price keys to replace: the legacy fields and any earlier storePrice.
    const priceMembers = list.filter((m) => LEGACY.includes(m.key) || m.key === 'storePrice');
    const prevEnd = (m: (typeof list)[number]) => list[list.indexOf(m) - 1].valueEnd;
    const text = sp ? `"storePrice": ${serialise(sp, indent)}` : null;
    if (priceMembers.length === 0) {
      if (text) {
        const anchor = get('pricingModel');
        if (!anchor) throw new Error(`${region}/${id}: no pricingModel key to place storePrice before`);
        edits.push({ start: anchor.keyStart, end: anchor.keyStart, text: `${text},\n${indent}` });
      }
      return;
    }
    const [first, ...rest] = priceMembers;
    edits.push(text ? { start: first.keyStart, end: first.valueEnd, text } : { start: prevEnd(first), end: first.valueEnd, text: '' });
    for (const m of rest) edits.push({ start: prevEnd(m), end: m.valueEnd, text: '' });
  });
  for (const id of byId.keys()) {
    if (!parsed.some((p) => p.id === id)) throw new Error(`${region}/${id}: evidence item has no product record`);
  }
  const out = applyEdits(src, edits);
  JSON.parse(out); // still valid JSON
  outputs.push({ path, src, out });
}
for (const { path, src, out } of outputs) if (out !== src) writeFileSync(path, out);
console.log(report.join('\n'));
console.log(`\n${written} records carry a store price; the rest show none.`);
