// Derives each region's stored monthly price from the vendor's own one-time
// price quote (site-owner decision 2026-10-08: stored prices follow the
// vendors' stated prices).
//
//   npx tsx scripts/derive-prices-from-vendor-quotes.ts
//
// Input: `vendorTerms.oneTimePrice` on every record of
// packages/data/src/products-<region>.json — the PASS-verified verbatim quote
// imported by scripts/import-vendor-terms.ts. The derivation is the pure
// deriveRegionalMonthlyPrice() in packages/data/src/vendor-price.ts, the same
// function validate-data uses to check every `priceBasis`.
//
// For a record whose quote derives a price in the region's own currency
// (REGION_PROFILES[region].priceField) the script writes that field and a
// `priceBasis` { source, quoteField, monthsOfSupply, checkedAt } right after
// it. It never converts currencies and never assumes a pack size: a quote in
// another currency is listed (NOT REGION CURRENCY), and a quote with several
// prices, a "from" price, no pack/supply statement or contradictory supply
// statements is listed as UNRESOLVED; both leave the stored field untouched.
// Edits are in place (only the changed/added keys move) and idempotent; the
// script fails closed on a record whose existing priceBasis the quote no
// longer supports, and re-checks every written record with
// priceBasisProblems() before saving.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyEdits, members, recordStarts, serialise, type Edit } from './lib/json-in-place';
import { deriveRegionalMonthlyPrice, priceBasisProblems } from '../packages/data/src/vendor-price';
import type { PriceBasis, Product } from '../packages/data/src/products-us';
import type { RegionCode } from '../packages/data/src/regional';

const ROOT = join(__dirname, '..');
const REGIONS: readonly RegionCode[] = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];

type Row = { region: string; slug: string; field: string; old: string; next: string; status: string; detail: string };

const show = (v: unknown) => (v === undefined ? '—' : JSON.stringify(v));

function main(): void {
  const rows: Row[] = [];
  const noQuote: string[] = [];
  let changedValues = 0;
  let basesWritten = 0;
  for (const region of REGIONS) {
    const path = join(ROOT, 'packages', 'data', 'src', `products-${region}.json`);
    const src = readFileSync(path, 'utf8');
    const records = JSON.parse(src) as Product[];
    const starts = recordStarts(src);
    if (starts.length !== records.length) throw new Error(`${region}: scanner found ${starts.length} records, JSON.parse ${records.length}`);
    const edits: Edit[] = [];
    starts.forEach((start, index) => {
      const product = records[index];
      const list = members(src, start);
      const get = (key: string) => list.find((m) => m.key === key);
      const idMember = get('id');
      if (!idMember || JSON.parse(src.slice(idMember.valueStart, idMember.valueEnd)) !== product.id) {
        throw new Error(`${region}: record ${index} scanner/parse mismatch`);
      }
      const indent = ' '.repeat(idMember.keyStart - src.lastIndexOf('\n', idMember.keyStart) - 1);
      const key = `${region}/${product.slug}`;
      const basisMember = get('priceBasis');
      const derivation = deriveRegionalMonthlyPrice(product, region);
      if (!derivation) {
        if (basisMember) throw new Error(`${key}: has priceBasis but no vendorTerms.oneTimePrice quote — review by hand`);
        noQuote.push(key);
        return;
      }
      const old = product[derivation.field];
      if (derivation.status !== 'derived') {
        if (basisMember) throw new Error(`${key}: has priceBasis but its quote no longer derives ${derivation.field} (${derivation.reason}) — review by hand`);
        const detail =
          derivation.status === 'not-region-currency'
            ? `${derivation.reason}. Quote "${derivation.quote}" → ${derivation.currency} ${derivation.amount} / ${derivation.monthsOfSupply} months = ${derivation.currency} ${derivation.monthly}/month (${derivation.supplyBasis})`
            : `${derivation.reason}. Quote "${derivation.quote}"`;
        rows.push({ region, slug: product.slug, field: derivation.field, old: show(old), next: '(unchanged)', status: derivation.status === 'unresolved' ? 'UNRESOLVED' : 'NOT REGION CURRENCY', detail });
        return;
      }

      const basis: PriceBasis = {
        source: 'vendor-one-time',
        quoteField: 'vendorTerms.oneTimePrice',
        monthsOfSupply: derivation.monthsOfSupply,
        checkedAt: derivation.checkedAt,
      };
      const basisText = serialise(basis, indent);
      const fieldMember = get(derivation.field);
      if (fieldMember) {
        if (old !== derivation.monthly) {
          edits.push({ start: fieldMember.valueStart, end: fieldMember.valueEnd, text: JSON.stringify(derivation.monthly) });
          changedValues++;
        }
        if (basisMember) {
          if (src.slice(basisMember.valueStart, basisMember.valueEnd) !== basisText) {
            edits.push({ start: basisMember.valueStart, end: basisMember.valueEnd, text: basisText });
            basesWritten++;
          }
        } else {
          edits.push({ start: fieldMember.valueEnd, end: fieldMember.valueEnd, text: `,\n${indent}"priceBasis": ${basisText}` });
          basesWritten++;
        }
      } else {
        if (basisMember) throw new Error(`${key}: has priceBasis but no ${derivation.field} — review by hand`);
        const lastPrice = [...list].reverse().find((m) => m.key.startsWith('priceMonthly'));
        const pricingModel = get('pricingModel');
        const fieldText = `"${derivation.field}": ${JSON.stringify(derivation.monthly)},\n${indent}"priceBasis": ${basisText}`;
        if (lastPrice) edits.push({ start: lastPrice.valueEnd, end: lastPrice.valueEnd, text: `,\n${indent}${fieldText}` });
        else if (pricingModel) edits.push({ start: pricingModel.keyStart, end: pricingModel.keyStart, text: `${fieldText},\n${indent}` });
        else throw new Error(`${key}: no priceMonthly* or pricingModel key to place ${derivation.field} next to`);
        changedValues++;
        basesWritten++;
      }
      rows.push({
        region,
        slug: product.slug,
        field: derivation.field,
        old: show(old),
        next: JSON.stringify(derivation.monthly),
        status: old === derivation.monthly ? 'CONFIRMED' : 'WRITTEN',
        detail: `Quote "${derivation.quote}" → ${derivation.currency} ${derivation.amount} / ${derivation.monthsOfSupply} month(s) (${derivation.supplyBasis}); checked ${derivation.checkedAt}`,
      });
    });

    const out = applyEdits(src, edits);
    const written = JSON.parse(out) as Product[];
    for (const product of written) {
      if (product.priceBasis === undefined) continue;
      const problems = priceBasisProblems(product, region);
      if (problems.length > 0) throw new Error(`${region}/${product.slug}: written record fails priceBasisProblems: ${problems.join('; ')}`);
    }
    if (out !== src) writeFileSync(path, out);
    console.log(`${region}: ${edits.length} edit(s)${out === src ? ' (unchanged)' : ''}`);
  }

  console.log('\n| region | product | field | old | new | status | basis / reason |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of rows) console.log(`| ${r.region} | ${r.slug} | ${r.field} | ${r.old} | ${r.next} | ${r.status} | ${r.detail.replace(/\|/g, '\\|')} |`);
  const count = (status: string) => rows.filter((r) => r.status === status).length;
  console.log(
    `\n${rows.length} records with a PASS one-time price quote: ${count('WRITTEN')} WRITTEN, ${count('CONFIRMED')} CONFIRMED, ` +
      `${count('NOT REGION CURRENCY')} NOT REGION CURRENCY, ${count('UNRESOLVED')} UNRESOLVED; ` +
      `${changedValues} price value(s) changed, ${basesWritten} priceBasis written.`,
  );
  console.log(`${noQuote.length} records have no PASS one-time price quote (not derived): ${noQuote.join(', ')}`);
  if (rows.length === 0) throw new Error('no record carries vendorTerms.oneTimePrice — nothing was derived');
}

main();
