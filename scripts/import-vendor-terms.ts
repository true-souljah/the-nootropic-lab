// Imports the vendor-stated terms shown on the review page's Pricing tab.
//
//   npx tsx scripts/import-vendor-terms.ts
//
// Source: packages/data/evidence/vendor-terms-2026-10/*.verified.json, copied
// verbatim from nootropics-research/2026-10-design/pricing/ (research run
// 2026-10-07; each quote machine-checked by verify_quotes.py as a substring of
// the page at its url). Shape: { <region>: [{ id, slug, checkedAt, shipping,
// cancellation, oneTimePrice, guaranteeDays }] }, each field either
// { value, quote, url, verify: { status } } or { value: null, reason }.
//
// For every evidence record the script writes `vendorTerms` on the matching
// record (same region, id and slug) of packages/data/src/products-<region>.json:
//   - only fields whose verify.status is "PASS";
//   - `text` is the verbatim `quote` (never the researcher's paraphrased `value`;
//     `note`, `reason` and the unverified `extraQuotes` are not imported);
//   - `lang` is the quote's language, from the page's host (QUOTE_LANG_BY_HOST);
//   - `fragments` (the quote split on " | ") only for evidence files whose
//     manifest.json entry says " | " joins separate page fragments, so the tab
//     renders each on its own line; elsewhere a " | " is page text and stays.
// It then applies the moneyBackDays / pricingModel corrections listed below,
// each backed by a PASS quote. Deterministic and idempotent; the JSON files are
// edited in place (only the added/changed keys move — no re-serialisation, so
// the existing formatting such as "4.0" and the missing final newlines stay).
// Fails closed on an unmatched record, a malformed PASS field, or a stored
// value that is neither the correction's `from` nor its `to`.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const EVIDENCE_DIR = join(ROOT, 'packages', 'data', 'evidence', 'vendor-terms-2026-10');
/** Evidence files and how each uses " | " (packages/data/evidence/vendor-terms-2026-10/manifest.json). */
const MANIFEST = JSON.parse(readFileSync(join(EVIDENCE_DIR, 'manifest.json'), 'utf8')) as {
  files: Record<string, { pipe: 'literal' | 'joins-fragments' }>;
};
const EVIDENCE_FILES = Object.keys(MANIFEST.files);
const FRAGMENT_SEPARATOR = ' | ';
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
type Region = (typeof REGIONS)[number];

/** Evidence field → `vendorTerms` key, in render order. */
const FIELD_MAP = [
  ['shipping', 'shipping'],
  ['cancellation', 'cancellation'],
  ['oneTimePrice', 'oneTimePrice'],
  ['guaranteeDays', 'guarantee'],
] as const;

/** Hosts whose quotes are not in English. Every other host's quotes are English. */
const QUOTE_LANG_BY_HOST: Readonly<Record<string, string>> = {
  'www.fancl.co.jp': 'ja',
  // Brainzyme's German storefront: "1 MONAT: 2 Packs, 60 Kapseln | 31,75 €".
  'www.brainzyme.de': 'de',
};

type Correction = {
  key: `${Region}/${string}`;
  field: 'moneyBackDays' | 'pricingModel';
  from: number | string | null;
  to: number | string | null;
  /** The PASS quote that states the corrected value (verbatim from the evidence). */
  quote: string;
  url: string;
};

// moneyBackDays = a satisfaction money-back guarantee that covers opened/used
// product. Unopened-only returns or "no refund" → null (rendered "—"); a
// different vendor-stated length → the vendor's length.
// pricingModel = what the vendor's page offers ('one-time' | 'subscription' | 'both').
const CORRECTIONS: readonly Correction[] = [
  // Onnit Alpha Brain: vendor states a 30-day guarantee (stored 90).
  ...(['us', 'ca'] as const).map((r): Correction => ({
    key: `${r}/alpha-brain`, field: 'moneyBackDays', from: 90, to: 30,
    quote: '30-day money back guarantee', url: 'https://www.onnit.com/products/alpha-brain-90-ct',
  })),
  ...(['au', 'sea', 'gcc', 'latam'] as const).map((r): Correction => ({
    key: `${r}/alpha-brain`, field: 'moneyBackDays', from: 90, to: 30,
    quote: 'The 30 Day Money Back Guarantee applies to your first-time purchase of any Onnit supplement.',
    url: 'https://help.onnit.com/en-US/30-day-money-back-guarantee-6327406',
  })),
  // Nootropics Depot: unopened-product returns only.
  {
    key: 'us/nootropics-depot-lions-mane', field: 'moneyBackDays', from: 30, to: null,
    quote: 'Nootropics Depot accepts returns of unopened product within 30 days of its delivery date. We do not accept returns or exchanges for opened and/or used product.',
    url: 'https://support.nootropicsdepot.com/article/28-product-returns-policy',
  },
  ...(['gcc', 'latam', 'sea'] as const).map((r): Correction => ({
    key: `${r}/nootropics-depot-lions-mane`, field: 'moneyBackDays', from: 30, to: null,
    quote: 'Nootropics Depot accepts returns of unopened product within 30 days of its delivery date.',
    url: 'https://support.nootropicsdepot.com/article/28-product-returns-policy',
  })),
  // Hunter Focus (Roar Ambition / Hunter Evolve): returns only of unused,
  // unopened, sealed product (30 days USA/Canada, 14 days elsewhere).
  {
    key: 'us/hunter-focus', field: 'moneyBackDays', from: 90, to: null,
    quote: 'Have you received your order within the last 30 days for USA/Canada or within 14 days for UK & the rest of the world, are your products unused, unopened, still sealed and the product packaging undamaged?',
    url: 'https://www.hunterevolve.com/en-us/shipping-returns',
  },
  {
    key: 'ca/hunter-focus', field: 'moneyBackDays', from: 30, to: null,
    quote: 'Have you received your order within the last 30 days for USA/Canada or within 14 days for UK & the rest of the world, are your products unused, unopened, still sealed and the product packaging undamaged?',
    url: 'https://www.roarambition.com/en-ca/policies/refund-policy',
  },
  {
    key: 'eu/hunter-focus', field: 'moneyBackDays', from: 30, to: null,
    quote: 'Have you received your order within the last 30 days for USA/Canada or within 14 days for UK & the rest of the world, are your products unused, unopened, still sealed and the product packaging undamaged?',
    url: 'https://www.roarambition.com/policies/refund-policy',
  },
  // AU and JP records quote the window part of the same sentence; its
  // "unused, unopened, still sealed" condition is PASS in the us/ca/eu records above.
  {
    key: 'au/hunter-focus', field: 'moneyBackDays', from: 30, to: null,
    quote: 'within the last 30 days for USA/Canada or within 14 days for UK & the rest of the world',
    url: 'https://www.roarambition.com/en-us/policies/refund-policy',
  },
  {
    key: 'jp/hunter-focus', field: 'moneyBackDays', from: 30, to: null,
    quote: 'within the last 30 days for USA/Canada or within 14 days for UK & the rest of the world',
    url: 'https://www.hunterevolve.com/en-us/shipping-returns',
  },
  // BrainMD: refunds only for unopened product.
  {
    key: 'us/brainmd-brain-memory-power-boost', field: 'moneyBackDays', from: 30, to: null,
    quote: 'Return unopened products within 60 days of purchase for a full refund of the purchase price (less original and return shipping costs).',
    url: 'https://brainmd.com/policies/refund-policy',
  },
  // Brainzyme: 365-day satisfaction refund (stored 30).
  {
    key: 'eu/brainzyme-focus-pro', field: 'moneyBackDays', from: 30, to: 365,
    quote: 'If you are not satisfied, simply return all items within 365 days for a full refund or exchange.',
    url: 'https://www.brainzyme.com/policies/refund-policy',
  },
  // FANCL: returns within 90 days of arrival even after opening if not
  // satisfied, "（一部商品を除く）" (some products excepted) — stored 0.
  {
    key: 'jp/fancl-brains', field: 'moneyBackDays', from: 0, to: 90,
    quote: '商品にご満足いただけない場合、商品到着後90日以内であれば開封後でも返送料当社負担で返品を承ります。（一部商品を除く）',
    url: 'https://www.fancl.co.jp/help/guide_1_4.html',
  },
  // Eu Yan Sang BrainMAX+: the product page states no refunds. The GCC record
  // links the same Singapore store; this quote is PASS in the sea record.
  ...(['sea', 'gcc'] as const).map((r): Correction => ({
    key: `${r}/eu-yan-sang-brainmax`, field: 'moneyBackDays', from: 0, to: null,
    quote: 'Expiry: May 2027 (No Refund / Exchange Allowed)',
    url: 'https://www.euyansang.com.sg/en/brainmax-888842543107.html',
  })),
  // Qualia Mind: "Purchase this time only" sits beside "Subscribe & Save".
  ...(['us', 'ca', 'au', 'sea'] as const).map((r): Correction => ({
    key: `${r}/qualia-mind`, field: 'pricingModel', from: 'subscription', to: 'both',
    quote: '$159.00 $39.00 first shipment, $139.00 thereafter Subscribe & Save 75% Purchase this time only',
    url: 'https://www.qualialife.com/shop/qualia-mind',
  })),
  ...(['gcc', 'latam'] as const).map((r): Correction => ({
    key: `${r}/qualia-mind`, field: 'pricingModel', from: 'subscription', to: 'both',
    quote: '$159.00 $39.00 first shipment, $139.00 thereafter | Subscribe & Save 75% | Purchase this time only',
    url: 'https://www.qualialife.com/shop/qualia-mind',
  })),
  // Thesis: one-time purchase offered beside the subscription. The us
  // record's own quote shows the subscription price; this one-time quote is
  // PASS on the same page in the gcc/latam/sea records.
  ...(['us', 'gcc', 'latam', 'sea'] as const).map((r): Correction => ({
    key: `${r}/thesis`, field: 'pricingModel', from: 'subscription', to: 'both',
    quote: 'One time purchase, $129',
    url: 'https://takethesis.com/products/clarity',
  })),
  // AOR Ortho•Mind: the product page offers a subscription (stored 'one-time').
  {
    key: 'ca/aor-ortho-mind', field: 'pricingModel', from: 'one-time', to: 'both',
    quote: 'If you decide a subscription is not for you, it can be cancelled after 2 renewals.',
    url: 'https://aor.ca/product/ortho-mind/',
  },
];

// ---------------------------------------------------------------------------
// Evidence

interface EvidenceField {
  value: unknown;
  quote?: string;
  url?: string;
  verify?: { status: string };
}
interface EvidenceRecord {
  id: string;
  slug: string;
  checkedAt: string;
  [field: string]: unknown;
}
interface Term {
  text: string;
  fragments?: string[];
  url: string;
  lang: string;
}
type VendorTerms = { checkedAt: string } & Partial<Record<(typeof FIELD_MAP)[number][1], Term>>;

function quoteLang(url: string, text: string): string {
  const lang = QUOTE_LANG_BY_HOST[new URL(url).hostname] ?? 'en';
  const hasJapanese = /[぀-ヿ一-鿿]/.test(text);
  if (hasJapanese !== (lang === 'ja')) {
    throw new Error(`quote language mismatch (${lang}) for ${url}: ${text}`);
  }
  return lang;
}

function termsFor(record: EvidenceRecord, where: string, joinsFragments: boolean): VendorTerms | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.checkedAt)) throw new Error(`${where}: checkedAt is not an ISO date: ${record.checkedAt}`);
  const terms: VendorTerms = { checkedAt: record.checkedAt };
  let count = 0;
  for (const [from, to] of FIELD_MAP) {
    const field = record[from] as EvidenceField | undefined;
    if (!field || field.verify?.status !== 'PASS') continue;
    const { quote, url } = field;
    if (typeof quote !== 'string' || quote.trim() === '' || typeof url !== 'string' || new URL(url).protocol !== 'https:') {
      throw new Error(`${where}.${from}: PASS field without a quote or https url`);
    }
    const fragments = joinsFragments && quote.includes(FRAGMENT_SEPARATOR) ? quote.split(FRAGMENT_SEPARATOR) : undefined;
    if (fragments?.some((f) => f.trim() === '')) throw new Error(`${where}.${from}: empty fragment in "${quote}"`);
    terms[to] = { text: quote, ...(fragments ? { fragments } : {}), url, lang: quoteLang(url, quote) };
    count++;
  }
  return count > 0 ? terms : null;
}

function passQuoteExists(evidence: Map<string, EvidenceRecord>, quote: string, url: string): boolean {
  for (const record of evidence.values()) {
    for (const [from] of FIELD_MAP) {
      const field = record[from] as EvidenceField | undefined;
      if (field?.verify?.status === 'PASS' && field.quote === quote && field.url === url) return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// In-place JSON editing: locate value spans with a minimal scanner so a change
// touches only its own key.

function skipWs(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

function stringEnd(s: string, i: number): number {
  if (s[i] !== '"') throw new Error(`expected a string at ${i}`);
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') j++;
    else if (s[j] === '"') return j + 1;
  }
  throw new Error(`unterminated string at ${i}`);
}

function valueEnd(s: string, i: number): number {
  const c = s[i];
  if (c === '"') return stringEnd(s, i);
  if (c === '{' || c === '[') {
    const close = c === '{' ? '}' : ']';
    let j = skipWs(s, i + 1);
    if (s[j] === close) return j + 1;
    for (;;) {
      if (c === '{') {
        j = skipWs(s, stringEnd(s, j));
        if (s[j] !== ':') throw new Error(`expected ':' at ${j}`);
        j = skipWs(s, j + 1);
      }
      j = skipWs(s, valueEnd(s, j));
      if (s[j] === ',') j = skipWs(s, j + 1);
      else if (s[j] === close) return j + 1;
      else throw new Error(`expected ',' or '${close}' at ${j}`);
    }
  }
  const m = /^(-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null)/.exec(s.slice(i, i + 40));
  if (!m) throw new Error(`unexpected token at ${i}`);
  return i + m[0].length;
}

interface Member {
  key: string;
  keyStart: number;
  valueStart: number;
  valueEnd: number;
}

/** Top-level members of the object starting at `start`. */
function members(s: string, start: number): Member[] {
  const list: Member[] = [];
  let j = skipWs(s, start + 1);
  if (s[j] === '}') return list;
  for (;;) {
    const keyStart = j;
    const keyEnd = stringEnd(s, j);
    const key = JSON.parse(s.slice(j, keyEnd)) as string;
    j = skipWs(s, keyEnd);
    if (s[j] !== ':') throw new Error(`expected ':' at ${j}`);
    const valueStart = skipWs(s, j + 1);
    const end = valueEnd(s, valueStart);
    list.push({ key, keyStart, valueStart, valueEnd: end });
    j = skipWs(s, end);
    if (s[j] === ',') j = skipWs(s, j + 1);
    else if (s[j] === '}') return list;
    else throw new Error(`expected ',' or '}' at ${j}`);
  }
}

/** Start offsets of the objects in the top-level array. */
function recordStarts(s: string): number[] {
  let j = skipWs(s, 0);
  if (s[j] !== '[') throw new Error('products file is not a JSON array');
  const starts: number[] = [];
  j = skipWs(s, j + 1);
  while (s[j] !== ']') {
    starts.push(j);
    j = skipWs(s, valueEnd(s, j));
    if (s[j] === ',') j = skipWs(s, j + 1);
  }
  return starts;
}

/** `value` as indented JSON whose continuation lines sit at `indent`. */
function serialise(value: unknown, indent: string): string {
  return JSON.stringify(value, null, 2).replace(/\n/g, `\n${indent}`);
}

type Edit = { start: number; end: number; text: string };

function applyEdits(s: string, edits: Edit[]): string {
  let out = s;
  for (const e of [...edits].sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

// ---------------------------------------------------------------------------

function main(): void {
  const evidence = new Map<Region, Map<string, EvidenceRecord>>();
  const joinsFragments = new Map<Region, boolean>();
  for (const file of EVIDENCE_FILES) {
    const pipe = MANIFEST.files[file].pipe;
    if (pipe !== 'literal' && pipe !== 'joins-fragments') throw new Error(`manifest.json: ${file} has an unknown pipe mode "${pipe}"`);
    const data = JSON.parse(readFileSync(join(EVIDENCE_DIR, file), 'utf8')) as Record<string, EvidenceRecord[]>;
    for (const [region, records] of Object.entries(data)) {
      if (!(REGIONS as readonly string[]).includes(region)) throw new Error(`${file}: unknown region "${region}"`);
      if (evidence.has(region as Region)) throw new Error(`${file}: region "${region}" appears in two evidence files`);
      joinsFragments.set(region as Region, pipe === 'joins-fragments');
      const byId = new Map<string, EvidenceRecord>();
      for (const record of records) {
        if (byId.has(record.id)) throw new Error(`${file}: duplicate ${region}/${record.id}`);
        byId.set(record.id, record);
      }
      evidence.set(region as Region, byId);
    }
  }
  const allEvidence = new Map<string, EvidenceRecord>();
  for (const [region, byId] of evidence) for (const [id, record] of byId) allEvidence.set(`${region}/${id}`, record);

  for (const c of CORRECTIONS) {
    if (!passQuoteExists(allEvidence, c.quote, c.url)) throw new Error(`correction ${c.key} ${c.field}: its quote is not a PASS quote at ${c.url}`);
  }

  let written = 0;
  let termCount = 0;
  let corrected = 0;
  for (const region of REGIONS) {
    const path = join(ROOT, 'packages', 'data', 'src', `products-${region}.json`);
    const src = readFileSync(path, 'utf8');
    const byId = evidence.get(region) ?? new Map<string, EvidenceRecord>();
    const productIds = new Set<string>();
    const edits: Edit[] = [];
    for (const start of recordStarts(src)) {
      const list = members(src, start);
      const get = (key: string) => list.find((m) => m.key === key);
      const idMember = get('id');
      const slugMember = get('slug');
      if (!idMember || !slugMember) throw new Error(`${region}: record at offset ${start} has no id or slug`);
      const id = JSON.parse(src.slice(idMember.valueStart, idMember.valueEnd)) as string;
      const slug = JSON.parse(src.slice(slugMember.valueStart, slugMember.valueEnd)) as string;
      const indent = ' '.repeat(idMember.keyStart - src.lastIndexOf('\n', idMember.keyStart) - 1);
      productIds.add(id);

      const record = byId.get(id);
      if (record) {
        if (record.slug !== slug) throw new Error(`${region}/${id}: evidence slug "${record.slug}" ≠ product slug "${slug}"`);
        const terms = termsFor(record, `${region}/${id}`, joinsFragments.get(region) === true);
        const existing = get('vendorTerms');
        if (terms) {
          termCount += Object.keys(terms).length - 1;
          written++;
          const text = serialise(terms, indent);
          if (existing) edits.push({ start: existing.valueStart, end: existing.valueEnd, text });
          else {
            const last = list[list.length - 1];
            edits.push({ start: last.valueEnd, end: last.valueEnd, text: `,\n${indent}"vendorTerms": ${text}` });
          }
        } else if (existing) {
          throw new Error(`${region}/${id}: has vendorTerms but no PASS evidence — remove it by hand after review`);
        }
      }

      for (const c of CORRECTIONS.filter((x) => x.key === `${region}/${id}`)) {
        const m = get(c.field);
        if (!m) throw new Error(`${c.key}: no ${c.field} key`);
        const current = JSON.parse(src.slice(m.valueStart, m.valueEnd)) as unknown;
        if (current === c.to) continue;
        if (current !== c.from) throw new Error(`${c.key} ${c.field}: stored ${JSON.stringify(current)}, expected ${JSON.stringify(c.from)}`);
        edits.push({ start: m.valueStart, end: m.valueEnd, text: JSON.stringify(c.to) });
        corrected++;
      }
    }
    for (const id of byId.keys()) {
      if (!productIds.has(id)) throw new Error(`${region}/${id}: evidence record has no product record`);
    }
    for (const c of CORRECTIONS) {
      const [r, id] = c.key.split('/');
      if (r === region && !productIds.has(id)) throw new Error(`${c.key}: correction target not found`);
    }
    const out = applyEdits(src, edits);
    JSON.parse(out); // still valid JSON
    if (out !== src) writeFileSync(path, out);
    console.log(`${region}: ${edits.length} edit(s)${out === src ? ' (unchanged)' : ''}`);
  }
  console.log(`vendorTerms on ${written} records (${termCount} terms); ${corrected} stored-field correction(s) applied.`);
}

main();
