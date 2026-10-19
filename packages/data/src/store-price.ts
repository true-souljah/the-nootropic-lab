// The price a reader sees: the store this region links to, as the vendor
// states it, in the store's own currency.
//
// Site-owner policy 2026-10-09: only prices a vendor actually states, never a
// currency conversion. Display: the pack price with what it covers
// ("US$79.95 · 90 Count"), plus "≈ US$53.30/mo" only where the pack's supply
// can be read from the vendor's own words (a stated supply such as
// "45-day supply" or "1 Month", or a pack count with the label's serving size,
// one serving a day — the rules #341 approved, in vendor-price.ts quoteSupply).
// Cost per serving (pack price ÷ the servings its own count states) and per
// day (÷ a stated supply length, or × the directions' daily dose) follow the
// same rule: only from the vendor's words, refused when they are missing or
// disagree.
// Every derived figure is worked out at render time from the stored verbatim
// text, in the same currency, so nothing derived is stored that could drift.
import type { Product, StorePrice } from './products-us';
import {
  parseQuotedPrices,
  quoteSupply,
  packServings,
  statedSupplyDays,
  dailyServings,
  currencyDigits,
  isFromPrice,
  roundTo,
  DAYS_PER_MONTH,
  SERVINGS_PER_DAY,
  EXERCISE_TIMED,
  type PackServings,
} from './vendor-price';

export type { StorePrice } from './products-us';

export interface Money {
  amount: number;
  currency: string;
}

/** Money in the reader's locale, keeping the cents a vendor states (US$79.95, not US$80). */
export function formatMoney(money: Money, locale: string): string {
  const digits = Number.isInteger(money.amount) ? 0 : currencyDigits(money.currency);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(money.amount);
  } catch {
    return `${money.currency} ${money.amount}`;
  }
}

/**
 * Language of a store price's verbatim words (`pack`, `supply`, `directions`):
 * the record's `lang`, else English — the record states `lang` only when the
 * store's words are not English ("de", "ja"). Pages mark these words with it
 * where their own language differs (WCAG 3.1.2).
 */
export function storePriceLang(sp: Pick<StorePrice, 'lang'>): string {
  return sp.lang ?? 'en';
}

export type StoreSupply = { ok: true; monthsOfSupply: number; basis: string } | { ok: false; reason: string };

/** Record fields the store-price derivations read. */
type SupplyProduct = Pick<Product, 'storePrice' | 'servingsPerContainer' | 'capsulesPerServing' | 'form'>;

/** The vendor's supply and pack wording as one quote, read alike by storeSupply and servingsInPack. */
const storeQuote = (sp: StorePrice): string => [sp.supply, sp.pack].filter(Boolean).join(' | ');

/** How many months one pack lasts, read from the vendor's own supply/pack wording. */
export function storeSupply(product: SupplyProduct): StoreSupply {
  const sp = product.storePrice;
  if (!sp) return { ok: false, reason: 'no store price' };
  if (!sp.supply && sp.directions && EXERCISE_TIMED.test(sp.directions)) {
    return { ok: false, reason: `the vendor says to take it ${sp.directions.match(EXERCISE_TIMED)![0]}, so a serving is not a day` };
  }
  // A daily dose the directions state plainly sets the servings a day; otherwise one a day.
  const daily = dailyServings(sp.directions, product);
  return quoteSupply(storeQuote(sp), product, daily.ok ? daily.perDay : SERVINGS_PER_DAY);
}

/** Servings in the store's pack, from the vendor's own count (never from a supply length). */
export function servingsInPack(product: SupplyProduct): PackServings {
  const sp = product.storePrice;
  if (!sp) return { ok: false, reason: 'no store price' };
  return packServings(storeQuote(sp), product);
}

/** An amount rounded half-up to the currency's minor unit (64.95 / 30 → 2.17; JPY to whole yen). */
export function roundMoney(amount: number, currency: string): number {
  return roundTo(amount, currencyDigits(currency));
}

/** A derived store price (same currency as the pack price) with its basis, or why there is none. */
export type StoreUnitPrice = ({ ok: true; basis: string } & Money) | { ok: false; reason: string };

function unitPrice(amount: number, currency: string, basis: string): StoreUnitPrice {
  const rounded = roundMoney(amount, currency);
  if (!(rounded > 0)) return { ok: false, reason: `rounds to zero in ${currency}` };
  return { ok: true, amount: rounded, currency, basis };
}

/** The store price per serving: pack price ÷ the servings the vendor's pack count states. */
export function perServingStorePrice(product: SupplyProduct): StoreUnitPrice {
  const sp = product.storePrice;
  if (!sp) return { ok: false, reason: 'no store price' };
  const pack = servingsInPack(product);
  if (!pack.ok) return pack;
  return unitPrice(sp.amount / pack.servings, sp.currency, `${pack.basis} = ${roundTo(pack.servings, 4)} servings`);
}

/**
 * The store price per day, from either vendor statement: (A) a stated supply
 * length (`storePrice.supply`: "45-day supply", "1-MONTH SUPPLY" = 30 days,
 * "30日分") → price ÷ days; (B) directions with one plain daily dose → price ×
 * servings a day ÷ servings in the pack. Both present → they must agree within
 * one minor unit (the figure is A's). Refused whenever storeSupply refuses: a
 * pack whose own wording does not add up has no per-month figure, and no
 * per-day one either.
 */
export function perDayStorePrice(product: SupplyProduct): StoreUnitPrice {
  const sp = product.storePrice;
  if (!sp) return { ok: false, reason: 'no store price' };
  const supply = storeSupply(product);
  if (!supply.ok) return supply;
  const sources: { amount: number; basis: string }[] = [];
  const refused: string[] = [];
  const stated = sp.supply ? statedSupplyDays(sp.supply) : { ok: false as const, reason: 'no supply length stated' };
  if (stated.ok) sources.push({ amount: sp.amount / stated.days, basis: `${stated.basis} = ${stated.days} days` });
  else refused.push(`supply: ${stated.reason}`);
  const daily = dailyServings(sp.directions, product);
  const pack = servingsInPack(product);
  if (!daily.ok) refused.push(`directions: ${daily.reason}`);
  else if (!pack.ok) refused.push(`pack: ${pack.reason}`);
  else sources.push({ amount: (sp.amount * daily.perDay) / pack.servings, basis: `${daily.basis} = ${daily.perDay} of ${roundTo(pack.servings, 4)} servings` });
  if (sources.length === 0) return { ok: false, reason: refused.join('; ') };
  const minorUnit = 10 ** -currencyDigits(sp.currency);
  if (sources.length === 2 && Math.abs(sources[0].amount - sources[1].amount) > minorUnit + 1e-9) {
    return { ok: false, reason: `supply and directions disagree (${sources.map((s) => s.basis).join(' vs ')})` };
  }
  return unitPrice(sources[0].amount, sp.currency, sources.map((s) => s.basis).join('; '));
}

/** The store price per month (same currency), or null when the pack's supply is not stated. */
export function monthlyStorePrice(product: SupplyProduct): (Money & { basis: string }) | null {
  const sp = product.storePrice;
  if (!sp) return null;
  const supply = storeSupply(product);
  if (!supply.ok) return null;
  const digits = currencyDigits(sp.currency);
  const factor = 10 ** digits;
  // Supplies are whole days (20 servings = 20/30 months); dividing by the
  // 4-decimal months would shave a cent (CA$79 → 118.49 instead of 118.50).
  const days = supply.monthsOfSupply * DAYS_PER_MONTH;
  const months = Math.abs(days - Math.round(days)) < 0.01 ? Math.round(days) / DAYS_PER_MONTH : supply.monthsOfSupply;
  return {
    amount: Math.round((sp.amount / months) * factor) / factor,
    currency: sp.currency,
    basis: supply.basis,
  };
}

/** One currency across these products' store prices, or null when they mix currencies (no conversion). */
export function sharedCurrency(products: Pick<Product, 'storePrice'>[]): string | null {
  const currencies = new Set(products.flatMap((p) => (p.storePrice ? [p.storePrice.currency] : [])));
  return currencies.size === 1 ? [...currencies][0] : null;
}

const ISO_CURRENCY = /^[A-Z]{3}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Currencies a store may print as a bare "$". */
const DOLLAR_CURRENCIES = new Set(['USD', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD', 'MXN']);
const STORE_PRICE_KEYS: (keyof StorePrice)[] = ['amount', 'currency', 'text', 'pack', 'supply', 'directions', 'lang', 'url', 'checkedAt'];

/** A real calendar date in YYYY-MM-DD form (2026-02-31 is not). */
function isIsoDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** An https URL with a host ("https://" alone is not). */
function isHttpsUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' && u.hostname.length > 0;
  } catch {
    return false;
  }
}

/** Why a record's store price is malformed or disagrees with its own verbatim text ([] when it is sound). */
export function storePriceProblems(product: Product): string[] {
  const sp: unknown = product.storePrice;
  if (sp === undefined) return [];
  if (sp === null || typeof sp !== 'object' || Array.isArray(sp)) return ['storePrice is not an object'];
  const s = sp as Record<string, unknown>;
  const problems: string[] = [];
  for (const key of Object.keys(s)) if (!STORE_PRICE_KEYS.includes(key as keyof StorePrice)) problems.push(`storePrice has an unknown key "${key}"`);
  if (typeof s.amount !== 'number' || !(s.amount > 0)) problems.push('storePrice.amount must be a positive number');
  if (typeof s.currency !== 'string' || !ISO_CURRENCY.test(s.currency)) problems.push(`storePrice.currency must be an ISO 4217 code: ${JSON.stringify(s.currency)}`);
  for (const key of ['text', 'pack'] as const) if (typeof s[key] !== 'string' || !(s[key] as string).trim()) problems.push(`storePrice.${key} must be the vendor's verbatim text`);
  if (s.lang !== undefined && (typeof s.lang !== 'string' || !/^[a-z]{2}(?:-[A-Z]{2})?$/.test(s.lang) || s.lang.split('-')[0] === 'en')) {
    problems.push(`storePrice.lang, when set, must be a non-English BCP-47 language such as "de": ${JSON.stringify(s.lang)}`);
  }
  for (const key of ['supply', 'directions'] as const) {
    if (s[key] !== undefined && (typeof s[key] !== 'string' || !(s[key] as string).trim())) problems.push(`storePrice.${key}, when set, must be verbatim text`);
  }
  if (typeof s.url !== 'string' || !isHttpsUrl(s.url)) problems.push('storePrice.url must be an https URL');
  else if (/[?#]/.test(s.url)) problems.push('storePrice.url must carry no query or fragment (an evidence link, not a tracking link)');
  if (typeof s.checkedAt !== 'string' || !isIsoDate(s.checkedAt)) problems.push('storePrice.checkedAt must be an ISO date');
  if (typeof s.text === 'string' && typeof s.amount === 'number') {
    // The stored amount must be the one price the verbatim text states (currency marks may be bare in the text).
    const { prices } = parseQuotedPrices(s.text);
    if (prices.length !== 1) problems.push(`storePrice.text must state exactly one price: "${s.text}"`);
    else if (Math.abs(prices[0].amount - s.amount) > 1e-9) problems.push(`storePrice.amount ${s.amount} is not the price in its text "${s.text}" (${prices[0].amount})`);
    else if (typeof s.currency === 'string' && prices[0].currency !== '$' && prices[0].currency !== s.currency) {
      problems.push(`storePrice.currency ${s.currency} contradicts its text "${s.text}" (${prices[0].currency})`);
    } else if (typeof s.currency === 'string' && prices[0].currency === '$' && !DOLLAR_CURRENCIES.has(s.currency)) {
      problems.push(`storePrice.currency ${s.currency} is not a dollar currency, but its text "${s.text}" states a bare "$"`);
    }
    if (isFromPrice(s.text)) problems.push(`storePrice.text is a "from" price, not the price of a pack: "${s.text}"`);
  }
  return problems;
}
