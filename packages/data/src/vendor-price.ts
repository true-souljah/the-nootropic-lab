// Monthly price derived from the vendor's own one-time price quote
// (`Product.vendorTerms.oneTimePrice`, a PASS-verified verbatim quote).
//
// Site-owner decision 2026-10-08: stored monthly prices follow the vendors'
// own stated prices. scripts/derive-prices-from-vendor-quotes.ts writes
// `priceMonthly<CUR>` + `priceBasis` with deriveRegionalMonthlyPrice(), and
// scripts/validate-data.ts checks every record with priceBasisProblems(), so a
// stored price and its quote cannot drift apart. Pure functions, unit-tested in
// packages/ui/src/vendor-price.test.ts.
//
// The derivation never guesses. It refuses (status "unresolved") when the
// quote holds several prices, a "from" price, no currency marker, an
// ambiguous number, or no pack/supply statement, and when the quote's own
// supply statements disagree with each other or with the record. It never
// converts currencies: a price is written only into the region's own price
// field (REGION_PROFILES[region].priceField) and only when the quote states
// that currency.
import type { Product } from './products-us';
import { REGION_PROFILES, type LocalPriceField, type RegionCode } from './regional';

export type { PriceBasis } from './products-us';

/** Days in the month a monthly price covers ("1 Month" = 30 servings at one serving a day). */
export const DAYS_PER_MONTH = 30;
/** `capsulesPerServing` is the per-day serving (Product docs); no record states another frequency. */
export const SERVINGS_PER_DAY = 1;

/** A price in a quote. `currency` is an ISO 4217 code, or "$" for a dollar sign that names no country. */
export interface QuotedPrice {
  currency: string;
  amount: number;
  /** The price as written in the quote. */
  text: string;
}

const ISO_CODES = ['USD', 'EUR', 'CAD', 'AUD', 'JPY', 'SGD', 'PHP', 'GBP', 'NZD', 'HKD', 'MYR', 'THB', 'IDR', 'AED', 'SAR', 'MXN', 'BRL'];
const PREFIX_CURRENCY: Readonly<Record<string, string>> = {
  'US$': 'USD', 'CA$': 'CAD', 'C$': 'CAD', 'AU$': 'AUD', 'A$': 'AUD', 'S$': 'SGD', 'NZ$': 'NZD', 'HK$': 'HKD',
  $: '$', '€': 'EUR', '£': 'GBP', '¥': 'JPY', '￥': 'JPY', '₱': 'PHP',
};
const SUFFIX_CURRENCY: Readonly<Record<string, string>> = { '€': 'EUR', '円': 'JPY' };
const AMOUNT = String.raw`\d[\d.,]*\d|\d`;
const PRICE = new RegExp(
  String.raw`(US\$|CA\$|C\$|AU\$|A\$|S\$|NZ\$|HK\$|\$|€|£|¥|￥|₱|\b(?:${ISO_CODES.join('|')})\b)\s?(${AMOUNT})` +
    String.raw`|(${AMOUNT})\s?(€|円|\b(?:${ISO_CODES.join('|')})\b)`,
  'gu',
);
/** "from" / "starting at" prices are minimums, not the price of a pack. */
const FROM_PRICE = /(?:^|[\s(|])(?:from|starting at|ab|desde|à partir de)\s+\S*\d|[～〜]/iu;

function groupedOk(digits: string, sep: string): boolean {
  const groups = digits.split(sep);
  return /^\d{1,3}$/.test(groups[0]) && groups.slice(1).every((g) => /^\d{3}$/.test(g));
}

/**
 * The number a price string means, or null when it is ambiguous. One kind of
 * separator: three digits after it = thousands ("1,680", "5,479"), one or two
 * = decimals ("31,75", "69.00"). Both kinds: the last one is the decimal
 * separator ("1.234,56", "1,234.56").
 */
export function parseAmount(raw: string): number | null {
  if (!/^\d[\d.,]*$/.test(raw)) return null;
  const hasComma = raw.includes(',');
  const hasDot = raw.includes('.');
  let whole = raw;
  let fraction = '';
  if (hasComma && hasDot) {
    const decimal = raw.lastIndexOf(',') > raw.lastIndexOf('.') ? ',' : '.';
    const thousands = decimal === ',' ? '.' : ',';
    const parts = raw.split(decimal);
    if (parts.length !== 2 || !/^\d{1,2}$/.test(parts[1]) || !groupedOk(parts[0], thousands)) return null;
    whole = parts[0].split(thousands).join('');
    fraction = parts[1];
  } else if (hasComma || hasDot) {
    const sep = hasComma ? ',' : '.';
    const parts = raw.split(sep);
    if (parts.length === 2 && /^\d{1,2}$/.test(parts[1])) {
      whole = parts[0];
      fraction = parts[1];
    } else if (groupedOk(raw, sep)) {
      whole = parts.join('');
    } else {
      return null;
    }
  }
  const value = Number(fraction ? `${whole}.${fraction}` : whole);
  return Number.isFinite(value) ? value : null;
}

/** Every currency-marked price in a quote, in order; `problems` lists numbers that could not be read. */
export function parseQuotedPrices(text: string): { prices: QuotedPrice[]; problems: string[] } {
  const prices: QuotedPrice[] = [];
  const problems: string[] = [];
  for (const m of text.matchAll(PRICE)) {
    const [whole, prefix, prefixAmount, suffixAmount, suffix] = m;
    const raw = prefixAmount ?? suffixAmount;
    const currency = prefix !== undefined ? (PREFIX_CURRENCY[prefix] ?? prefix) : (SUFFIX_CURRENCY[suffix] ?? suffix);
    const amount = parseAmount(raw);
    if (amount === null || !(amount > 0)) problems.push(`ambiguous price "${whole.trim()}"`);
    else prices.push({ currency, amount, text: whole.trim() });
  }
  return { prices, problems };
}

type UnitKind = 'capsule' | 'softgel' | 'tablet' | 'sachet' | 'serving' | 'any';
const UNIT_WORDS: ReadonlyArray<[RegExp, UnitKind]> = [
  [/^(?:capsules?|caps|kapseln?|cápsulas?|gélules?|vegicaps|nutricaps|カプセル)$/iu, 'capsule'],
  [/^(?:softgels?|nutrigels?)$/iu, 'softgel'],
  [/^(?:tablets?|tabs|tabletten|錠)$/iu, 'tablet'],
  [/^(?:sachets?|stick packs?|包)$/iu, 'sachet'],
  [/^(?:servings?|portionen)$/iu, 'serving'],
  [/^(?:count|ct|粒)$/iu, 'any'],
];
const UNIT_COUNT =
  /(\d[\d,]*)\s*[-–]?\s*(capsules?|caps|kapseln?|cápsulas?|gélules?|vegicaps|nutricaps|softgels?|nutrigels?|tablets?|tabs|tabletten|sachets?|stick packs?|servings?|portionen|count|ct)\b|(\d[\d,]*)\s*(カプセル|錠|包|粒)/giu;
const MONTHS = /(\d+)\s*[-–]?\s*(?:months?|monate?|mes(?:es)?|mois)\b|(\d+)\s*[ヶかカケ箇]月分/giu;
const DAYS = /(\d+)\s*[-–]?\s*days?[\s-]+supply\b|(\d+)\s*日分/giu;
const CONTAINERS = /(\d+)\s*(?:units?|bottles?|pouch(?:es)?|containers?|jars?|tubs?|boxes|box|bags?)\b|(\d+)\s*(?:袋|個|本)/giu;

/** Record fields the supply derivation reads. */
export type SupplyFields = Pick<Product, 'servingsPerContainer' | 'capsulesPerServing' | 'form'>;

export type QuoteSupply = { ok: true; monthsOfSupply: number; basis: string } | { ok: false; reason: string };

const EPSILON = 1e-9;
const distinct = (values: number[]) => values.filter((v, i) => values.findIndex((w) => Math.abs(w - v) < EPSILON) === i);
const roundTo = (value: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(Number((value * f).toPrecision(12))) / f;
};
const fmt = (n: number) => String(roundTo(n, 4));

function formAccepts(kind: UnitKind, form: NonNullable<Product['form']>): boolean {
  if (kind === 'any' || kind === 'serving') return true;
  if (kind === 'capsule' || kind === 'softgel') return form === 'capsule' || form === 'softgel';
  return kind === form;
}

/**
 * Months of supply the quoted pack represents, from the quote's own pack
 * statements: a unit count ("180 capsules", "90 Count", "60 Kapseln") divided
 * by the record's capsulesPerServing (one serving a day); a stated supply
 * ("1 Month", "1 MONAT", "45-day supply", "30日分"); or, only when neither is
 * stated, a container count ("1 Unit", "1 Pouch") times servingsPerContainer.
 * A unit count and a stated supply must agree. Refuses when the quote states
 * no pack at all — the record's own pack size is never assumed.
 */
export function quoteSupply(text: string, record: SupplyFields): QuoteSupply {
  const form = record.form ?? 'capsule';
  const cps = record.capsulesPerServing;
  const spc = record.servingsPerContainer;

  const stated: { months: number; text: string }[] = [];
  for (const m of text.matchAll(MONTHS)) stated.push({ months: Number(m[1] ?? m[2]), text: m[0].trim() });
  for (const m of text.matchAll(DAYS)) stated.push({ months: Number(m[1] ?? m[2]) / DAYS_PER_MONTH, text: m[0].trim() });
  const statedMonths = distinct(stated.map((s) => s.months));
  if (statedMonths.some((v) => !(v > 0))) return { ok: false, reason: 'a stated supply is zero' };
  if (statedMonths.length > 1) return { ok: false, reason: `several supply lengths (${stated.map((s) => `"${s.text}"`).join(', ')})` };

  const counted: { months: number; text: string; perServing: string }[] = [];
  for (const m of text.matchAll(UNIT_COUNT)) {
    const count = Number((m[1] ?? m[3]).replace(/,/g, ''));
    const word = m[2] ?? m[4];
    const kind = UNIT_WORDS.find(([re]) => re.test(word))?.[1];
    if (!kind || !(count > 0)) return { ok: false, reason: `unreadable unit count "${m[0].trim()}"` };
    if (!formAccepts(kind, form)) return { ok: false, reason: `quote counts ${word} but the record's form is ${form}` };
    let servings = count;
    let perServing = 'one serving each';
    if (kind !== 'serving') {
      if (!(typeof cps === 'number' && cps > 0)) return { ok: false, reason: `"${m[0].trim()}" needs capsulesPerServing, which the record lacks` };
      servings = count / cps;
      perServing = `${cps} per serving`;
    }
    counted.push({ months: servings / SERVINGS_PER_DAY / DAYS_PER_MONTH, text: m[0].trim(), perServing });
  }
  const countedMonths = distinct(counted.map((c) => c.months));
  if (countedMonths.length > 1) return { ok: false, reason: `several pack sizes (${counted.map((c) => `"${c.text}"`).join(', ')})` };

  if (statedMonths.length === 1 && countedMonths.length === 1) {
    if (Math.abs(statedMonths[0] - countedMonths[0]) > EPSILON) {
      return {
        ok: false,
        reason: `"${counted[0].text}" at ${counted[0].perServing} is ${fmt(countedMonths[0])} months of one serving a day, but the quote states "${stated[0].text}"`,
      };
    }
    return { ok: true, monthsOfSupply: roundTo(statedMonths[0], 4), basis: `"${stated[0].text}" = "${counted[0].text}" at ${counted[0].perServing}, one serving a day` };
  }
  if (statedMonths.length === 1) return { ok: true, monthsOfSupply: roundTo(statedMonths[0], 4), basis: `"${stated[0].text}"` };

  const containers: { count: number; text: string }[] = [];
  for (const m of text.matchAll(CONTAINERS)) containers.push({ count: Number(m[1] ?? m[2]), text: m[0].trim() });
  const containerCounts = distinct(containers.map((c) => c.count));
  if (countedMonths.length === 1) {
    // "3 bottles, 60 capsules" does not say whether 60 is per bottle or in total.
    const multi = containers.find((c) => c.count > 1);
    if (multi) return { ok: false, reason: `"${counted[0].text}" with "${multi.text}": the quote does not say whether the count is per container or in total` };
    return { ok: true, monthsOfSupply: roundTo(countedMonths[0], 4), basis: `"${counted[0].text}" at ${counted[0].perServing}, one serving a day` };
  }
  if (containerCounts.length > 1) return { ok: false, reason: `several pack counts (${containers.map((c) => `"${c.text}"`).join(', ')})` };
  if (containerCounts.length === 1) {
    if (!(containerCounts[0] > 0)) return { ok: false, reason: `pack count "${containers[0].text}" is zero` };
    if (!(typeof spc === 'number' && spc > 0)) return { ok: false, reason: `"${containers[0].text}" needs servingsPerContainer, which the record lacks` };
    const months = (containerCounts[0] * spc) / SERVINGS_PER_DAY / DAYS_PER_MONTH;
    return { ok: true, monthsOfSupply: roundTo(months, 4), basis: `"${containers[0].text}" × ${spc} servings, one a day` };
  }
  return { ok: false, reason: 'no pack size or supply stated in the quote' };
}

/** Decimal places of a currency's monthly price (yen has none). */
export function currencyDigits(currency: string): number {
  return currency === 'JPY' ? 0 : 2;
}

export type QuoteMonthly =
  | { ok: true; price: QuotedPrice; monthsOfSupply: number; monthly: number; supplyBasis: string }
  | { ok: false; price?: QuotedPrice; reason: string };

/**
 * The one price in the quote and its per-month amount (in the quote's
 * currency, rounded to the currency's minor unit), or why none can be given.
 */
export function monthlyPriceFromQuote(text: string, record: SupplyFields): QuoteMonthly {
  const { prices, problems } = parseQuotedPrices(text);
  if (problems.length > 0) return { ok: false, reason: problems.join('; ') };
  const unique = prices.filter((p, i) => prices.findIndex((q) => q.currency === p.currency && q.amount === p.amount) === i);
  if (unique.length === 0) return { ok: false, reason: 'no currency-marked price in the quote' };
  if (unique.length > 1) return { ok: false, reason: `several prices (${unique.map((p) => p.text).join(', ')})` };
  const price = unique[0];
  if (FROM_PRICE.test(text)) return { ok: false, price, reason: `"${price.text}" is a "from"/"starting at" price, not the price of a pack` };
  const supply = quoteSupply(text, record);
  if (!supply.ok) return { ok: false, price, reason: supply.reason };
  const monthly = roundTo(price.amount / supply.monthsOfSupply, currencyDigits(price.currency));
  return { ok: true, price, monthsOfSupply: supply.monthsOfSupply, monthly, supplyBasis: supply.basis };
}

/** Hosts of non-US dollar storefronts: a bare "$" there is not USD. */
const NON_US_DOLLAR_HOST = /\.(?:ca|au|nz|sg|hk|tw)$/i;
const DOLLAR_CURRENCIES = new Set(['USD', 'CAD', 'AUD', 'SGD', 'NZD', 'HKD']);

/** True when a bare "$" on this quote page can be read as USD: a US-region record on a page that is not a non-US dollar storefront. */
function bareDollarIsUSD(region: RegionCode, url: string): boolean {
  if (region !== 'us' || !URL.canParse(url)) return false;
  return !NON_US_DOLLAR_HOST.test(new URL(url).hostname);
}

export type PriceDerivation =
  | {
      status: 'derived';
      field: LocalPriceField;
      currency: string;
      amount: number;
      monthsOfSupply: number;
      monthly: number;
      supplyBasis: string;
      quote: string;
      checkedAt: string;
    }
  | {
      /** The quote yields a monthly price, but not in the currency of the region's price field. */
      status: 'not-region-currency';
      field: LocalPriceField;
      currency: string;
      amount: number;
      monthsOfSupply: number;
      monthly: number;
      supplyBasis: string;
      quote: string;
      reason: string;
    }
  | { status: 'unresolved'; field: LocalPriceField; quote: string; reason: string };

/**
 * The monthly price for the region's own price field derived from the
 * record's `vendorTerms.oneTimePrice` quote, or null when the record has no
 * such quote. A bare "$" is read as USD only on a US-region record whose quote
 * page is not a non-US dollar storefront; anywhere else it names no currency.
 */
export function deriveRegionalMonthlyPrice(
  product: Pick<Product, 'vendorTerms' | 'servingsPerContainer' | 'capsulesPerServing' | 'form'>,
  region: RegionCode,
): PriceDerivation | null {
  const term = product.vendorTerms?.oneTimePrice;
  if (!term) return null;
  const profile = REGION_PROFILES[region];
  const field = profile.priceField;
  const quote = term.text;
  const result = monthlyPriceFromQuote(quote, product);
  let currency = result.price?.currency;
  let currencyNote = '';
  if (currency === '$') {
    if (bareDollarIsUSD(region, term.url)) currency = 'USD';
    else if (DOLLAR_CURRENCIES.has(profile.currency)) {
      return { status: 'unresolved', field, quote, reason: `the quote's bare "$" does not say which dollar (region prices in ${profile.currency})${result.ok ? '' : `; ${result.reason}`}` };
    } else currencyNote = 'bare "$" (dollar, country not stated)';
  }
  if (!result.ok) {
    const foreign = currency && currency !== profile.currency ? `; quote currency ${currencyNote || currency} is not ${profile.currency}` : '';
    return { status: 'unresolved', field, quote, reason: `${result.reason}${foreign}` };
  }
  const derived = { field, currency: currency!, amount: result.price.amount, monthsOfSupply: result.monthsOfSupply, monthly: result.monthly, supplyBasis: result.supplyBasis, quote };
  if (currency !== profile.currency) {
    return { status: 'not-region-currency', ...derived, reason: `quote currency ${currencyNote || currency} is not the region's ${profile.currency}; no conversion` };
  }
  return { status: 'derived', ...derived, checkedAt: product.vendorTerms!.checkedAt };
}

const PRICE_BASIS_KEYS = ['source', 'quoteField', 'monthsOfSupply', 'checkedAt'];

/**
 * Why the record's price disagrees with its vendor quote ([] when it agrees).
 * With `priceBasis`: its shape must be exact, the quote must still derive a
 * price for the region's field, and the stored price, months of supply and
 * checkedAt must equal the derivation. Without `priceBasis`: a quote that
 * derives a region price is a problem too (run the derive script), so a new
 * quote cannot sit beside a stale price.
 */
export function priceBasisProblems(product: Product, region: RegionCode): string[] {
  const derivation = deriveRegionalMonthlyPrice(product, region);
  const basis: unknown = product.priceBasis;
  if (basis === undefined) {
    if (derivation?.status === 'derived') {
      return [`vendorTerms.oneTimePrice derives ${derivation.field} ${derivation.monthly} but the record has no priceBasis (run scripts/derive-prices-from-vendor-quotes.ts)`];
    }
    return [];
  }
  if (basis === null || typeof basis !== 'object' || Array.isArray(basis)) return ['priceBasis is not an object'];
  const b = basis as Record<string, unknown>;
  const problems: string[] = [];
  for (const key of Object.keys(b)) if (!PRICE_BASIS_KEYS.includes(key)) problems.push(`priceBasis has an unknown key "${key}"`);
  if (b.source !== 'vendor-one-time') problems.push(`priceBasis.source is not "vendor-one-time": ${JSON.stringify(b.source)}`);
  if (b.quoteField !== 'vendorTerms.oneTimePrice') problems.push(`priceBasis.quoteField is not "vendorTerms.oneTimePrice": ${JSON.stringify(b.quoteField)}`);
  if (!derivation) return [...problems, 'priceBasis is set but the record has no vendorTerms.oneTimePrice quote'];
  if (derivation.status !== 'derived') return [...problems, `priceBasis is set but the quote derives no ${derivation.field}: ${derivation.reason}`];
  const stored = product[derivation.field];
  if (stored !== derivation.monthly) problems.push(`${derivation.field} is ${JSON.stringify(stored)} but the quote "${derivation.quote}" derives ${derivation.monthly} (${derivation.supplyBasis})`);
  if (b.monthsOfSupply !== derivation.monthsOfSupply) problems.push(`priceBasis.monthsOfSupply is ${JSON.stringify(b.monthsOfSupply)} but the quote derives ${derivation.monthsOfSupply}`);
  if (b.checkedAt !== derivation.checkedAt) problems.push(`priceBasis.checkedAt is ${JSON.stringify(b.checkedAt)} but vendorTerms.checkedAt is ${derivation.checkedAt}`);
  return problems;
}
