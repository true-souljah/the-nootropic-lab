// Parsers for vendor price and pack wording, shared by the store price
// (store-price.ts) and its tests. Pure functions, unit-tested in
// packages/ui/src/vendor-price.test.ts.
//
// They never guess: parseQuotedPrices reports every price a text states (and
// refuses "from" prices and ambiguous numbers); quoteSupply reads how long a
// pack lasts only from the text's own pack/supply wording plus the label's
// serving size, and refuses when the wording is missing or contradicts itself;
// packServings counts the servings a pack holds (never from a supply length);
// dailyServings reads a daily dose only from directions that state one plainly.
import type { Product } from './products-us';

/** Days in the month a monthly price covers ("1 Month" = 30 servings at one serving a day). */
export const DAYS_PER_MONTH = 30;
/**
 * Servings a day when the vendor's directions state no unambiguous daily dose
 * (dailyServings refuses): `capsulesPerServing` is the per-day serving
 * (Product docs), so the monthly figure assumes one serving a day.
 */
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

/** True when the quote is a "from" / "starting at" minimum rather than a pack's price. */
export function isFromPrice(text: string): boolean {
  return FROM_PRICE.test(text);
}

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

type UnitKind = 'capsule' | 'softgel' | 'tablet' | 'sachet' | 'can' | 'serving' | 'any';
const UNIT_WORDS: ReadonlyArray<[RegExp, UnitKind]> = [
  [/^(?:capsules?|caps|kapseln?|cápsulas?|gélules?|vegicaps|nutricaps|カプセル)$/iu, 'capsule'],
  [/^(?:softgels?|nutrigels?)$/iu, 'softgel'],
  [/^(?:tablets?|tabs|tabletten|錠)$/iu, 'tablet'],
  [/^(?:sachets?|stick packs?|包)$/iu, 'sachet'],
  [/^(?:cans?)$/iu, 'can'],
  [/^(?:servings?|portionen)$/iu, 'serving'],
  [/^(?:count|ct|粒)$/iu, 'any'],
];
const UNIT_COUNT =
  /(\d[\d,]*)\s*[-–]?\s*(capsules?|caps|kapseln?|cápsulas?|gélules?|vegicaps|nutricaps|softgels?|nutrigels?|tablets?|tabs|tabletten|sachets?|stick packs?|cans?|servings?|portionen|count|ct)\b|(\d[\d,]*)\s*(カプセル|錠|包|粒)/giu;
const MONTHS = /(\d+)\s*[-–]?\s*(?:months?|monate?|mes(?:es)?|mois)\b|(\d+)\s*[ヶかカケ箇]月分/giu;
const DAYS = /(\d+)\s*[-–]?\s*days?[\s-]+supply\b|(\d+)\s*日分/giu;
/** Supplement-facts wording with the count after the label: "Servings per container: 30". */
const SERVINGS_PER_CONTAINER = /servings?\s+per\s+container\s*:?\s*(\d+)/giu;
/** A stated delivery cadence ("delivered every 4 weeks"): one pack per that many weeks. */
const WEEKS = /every\s+(\d+)\s+weeks?\b/giu;
const CONTAINERS = /(\d+)\s*(?:units?|bottles?|pouch(?:es)?|containers?|jars?|tubs?|boxes|box|bags?)\b|(\d+)\s*(?:袋|個|本)/giu;

/** Record fields the supply derivation reads. */
export type SupplyFields = Pick<Product, 'servingsPerContainer' | 'capsulesPerServing' | 'form'>;

export type QuoteSupply = { ok: true; monthsOfSupply: number; basis: string } | { ok: false; reason: string };

const EPSILON = 1e-9;
const distinct = (values: number[]) => values.filter((v, i) => values.findIndex((w) => Math.abs(w - v) < EPSILON) === i);
/** `value` rounded half-up to `digits` decimals, without float noise (1.005 → 1.01; plain Math.round gives 1). */
export const roundTo = (value: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(Number((value * f).toPrecision(12))) / f;
};
const fmt = (n: number) => String(roundTo(n, 4));

function formAccepts(kind: UnitKind, form: NonNullable<Product['form']>): boolean {
  if (kind === 'any' || kind === 'serving') return true;
  if (kind === 'capsule' || kind === 'softgel') return form === 'capsule' || form === 'softgel';
  return kind === form;
}

type Refusal = { ok: false; reason: string };
type StatedSupply = { days: number; text: string };
type CountedServings = { servings: number; text: string; perServing: string };
type ContainerCount = { count: number; text: string };

/**
 * Every supply length a text states, in days: months × DAYS_PER_MONTH ("1 Month",
 * "1 MONAT", "1-MONTH SUPPLY"), weeks × 7 ("delivered every 4 weeks"), days
 * ("45-day supply", "30日分"). Refuses a zero length or several different ones.
 */
function readStatedSupply(text: string): { ok: true; stated: StatedSupply[] } | Refusal {
  const stated: StatedSupply[] = [];
  for (const m of text.matchAll(MONTHS)) stated.push({ days: Number(m[1] ?? m[2]) * DAYS_PER_MONTH, text: m[0].trim() });
  for (const m of text.matchAll(DAYS)) stated.push({ days: Number(m[1] ?? m[2]), text: m[0].trim() });
  for (const m of text.matchAll(WEEKS)) stated.push({ days: Number(m[1]) * 7, text: m[0].trim() });
  const days = distinct(stated.map((s) => s.days));
  if (days.some((v) => !(v > 0))) return { ok: false, reason: 'a stated supply is zero' };
  if (days.length > 1) return { ok: false, reason: `several supply lengths (${stated.map((s) => `"${s.text}"`).join(', ')})` };
  return { ok: true, stated };
}

/**
 * The pack counts a text states, in servings: unit counts ("180 capsules",
 * "90 Count", "60 Kapseln", "240粒") over the record's capsulesPerServing and
 * supplement-facts counts ("Servings per container: 30"); plus the container
 * counts ("1 Unit", "1 Pouch") for servingsFromCounts. Refuses an unreadable
 * count, a unit the record's form cannot be, a unit count without
 * capsulesPerServing, and several different pack sizes.
 */
function readPackCounts(text: string, record: SupplyFields): { ok: true; counted: CountedServings[]; containers: ContainerCount[] } | Refusal {
  const form = record.form ?? 'capsule';
  const cps = record.capsulesPerServing;
  const counted: CountedServings[] = [];
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
    counted.push({ servings, text: m[0].trim(), perServing });
  }
  for (const m of text.matchAll(SERVINGS_PER_CONTAINER)) {
    const servings = Number(m[1]);
    if (!(servings > 0)) return { ok: false, reason: `unreadable serving count "${m[0].trim()}"` };
    counted.push({ servings, text: m[0].trim(), perServing: 'one serving each' });
  }
  if (distinct(counted.map((c) => c.servings)).length > 1) return { ok: false, reason: `several pack sizes (${counted.map((c) => `"${c.text}"`).join(', ')})` };
  const containers = [...text.matchAll(CONTAINERS)].map((m) => ({ count: Number(m[1] ?? m[2]), text: m[0].trim() }));
  return { ok: true, counted, containers };
}

/**
 * Servings in the pack from readPackCounts: the unit/serving count when one is
 * stated, else one container count × servingsPerContainer. `byContainer` marks
 * the second rule. Null when the text states no count at all.
 */
function servingsFromCounts(
  counts: { counted: CountedServings[]; containers: ContainerCount[] },
  spc: SupplyFields['servingsPerContainer'],
): { ok: true; servings: number; basis: string; byContainer: boolean } | Refusal | null {
  const { counted, containers } = counts;
  if (counted.length) {
    // "3 bottles, 60 capsules" does not say whether 60 is per bottle or in total.
    const multi = containers.find((c) => c.count > 1);
    if (multi) return { ok: false, reason: `"${counted[0].text}" with "${multi.text}": the quote does not say whether the count is per container or in total` };
    return { ok: true, servings: counted[0].servings, basis: `"${counted[0].text}" at ${counted[0].perServing}`, byContainer: false };
  }
  const containerCounts = distinct(containers.map((c) => c.count));
  if (containerCounts.length > 1) return { ok: false, reason: `several pack counts (${containers.map((c) => `"${c.text}"`).join(', ')})` };
  if (containerCounts.length === 1) {
    if (!(containerCounts[0] > 0)) return { ok: false, reason: `pack count "${containers[0].text}" is zero` };
    if (!(typeof spc === 'number' && spc > 0)) return { ok: false, reason: `"${containers[0].text}" needs servingsPerContainer, which the record lacks` };
    return { ok: true, servings: containerCounts[0] * spc, basis: `"${containers[0].text}" × ${spc} servings`, byContainer: true };
  }
  return null;
}

/**
 * Months of supply the quoted pack represents, from the quote's own pack
 * statements: a unit count ("180 capsules", "90 Count", "60 Kapseln") divided
 * by the record's capsulesPerServing, at `servingsPerDay` servings a day (one,
 * unless the vendor's directions state another daily dose); a stated supply
 * ("1 Month", "1 MONAT", "45-day supply", "30日分"); or, only when neither is
 * stated, a container count ("1 Unit", "1 Pouch") times servingsPerContainer.
 * A unit count and a stated supply must agree. Refuses when the quote states
 * no pack at all — the record's own pack size is never assumed.
 */
export function quoteSupply(text: string, record: SupplyFields, servingsPerDay: number = SERVINGS_PER_DAY): QuoteSupply {
  const supply = readStatedSupply(text);
  if (!supply.ok) return supply;
  const counts = readPackCounts(text, record);
  if (!counts.ok) return counts;
  const aDay = servingsPerDay === 1 ? 'one serving a day' : `${fmt(servingsPerDay)} servings a day`;

  const [stated] = supply.stated;
  const [counted] = counts.counted;
  if (stated && counted) {
    const statedMonths = stated.days / DAYS_PER_MONTH;
    const countedMonths = counted.servings / servingsPerDay / DAYS_PER_MONTH;
    if (Math.abs(statedMonths - countedMonths) > EPSILON) {
      return {
        ok: false,
        reason: `"${counted.text}" at ${counted.perServing} is ${fmt(countedMonths)} months of ${aDay}, but the quote states "${stated.text}"`,
      };
    }
    return { ok: true, monthsOfSupply: roundTo(statedMonths, 4), basis: `"${stated.text}" = "${counted.text}" at ${counted.perServing}, ${aDay}` };
  }
  if (stated) return { ok: true, monthsOfSupply: roundTo(stated.days / DAYS_PER_MONTH, 4), basis: `"${stated.text}"` };

  const pack = servingsFromCounts(counts, record.servingsPerContainer);
  if (!pack) return { ok: false, reason: 'no pack size or supply stated in the quote' };
  if (!pack.ok) return pack;
  const months = pack.servings / servingsPerDay / DAYS_PER_MONTH;
  const rate = !pack.byContainer ? aDay : servingsPerDay === 1 ? 'one a day' : `${fmt(servingsPerDay)} a day`;
  return { ok: true, monthsOfSupply: roundTo(months, 4), basis: `${pack.basis}, ${rate}` };
}

export type PackServings = { ok: true; servings: number; basis: string } | Refusal;

/**
 * Servings in the quoted pack, from the quote's own counts only: a unit count
 * over the label's capsulesPerServing, a "Servings per container" count, or
 * one container count × servingsPerContainer — the same rules quoteSupply
 * applies. Never from a supply length: "30日分" or "1 Month" is a duration,
 * not a count.
 */
export function packServings(text: string, record: SupplyFields): PackServings {
  const counts = readPackCounts(text, record);
  if (!counts.ok) return counts;
  const pack = servingsFromCounts(counts, record.servingsPerContainer);
  if (!pack) return { ok: false, reason: 'no pack count stated in the quote (a supply length is not a count)' };
  if (!pack.ok) return pack;
  return { ok: true, servings: pack.servings, basis: pack.basis };
}

export type StatedSupplyDays = { ok: true; days: number; basis: string } | Refusal;

/** Days a supply wording states: "45-day supply", "1-MONTH SUPPLY" (DAYS_PER_MONTH), "every 4 weeks" (28), "30日分". */
export function statedSupplyDays(text: string): StatedSupplyDays {
  const supply = readStatedSupply(text);
  if (!supply.ok) return supply;
  const [stated] = supply.stated;
  if (!stated) return { ok: false, reason: 'no supply length stated' };
  return { ok: true, days: stated.days, basis: `"${stated.text}"` };
}

/** Use timed to exercise, not to the day: such a product's servings are not days. */
export const EXERCISE_TIMED = /\bbefore\s+(?:exercise|(?:your\s+)?workouts?|training)\b/i;

/**
 * Directions that describe a pattern rather than one fixed daily dose, checked
 * in this order (the first match refuses). Time of day ("in the morning",
 * "with your first meal") is not a frequency and is not listed: such
 * directions simply state no daily frequency.
 */
const NOT_ONE_DAILY_DOSE: ReadonlyArray<[RegExp, string]> = [
  [EXERCISE_TIMED, 'timed to exercise, not to the day'],
  [/\bdays?\s+off\b|\bcycl(?:e|ing)\b|\bon\s*\/\s*off\b/i, 'taken in cycles with days off, not every day'],
  [/\b(?:don['’]t|do\s+not|not|no)\s+(?:take\s+)?more\s+than\b|\bdo\s+not\s+exceed\b|\bmaximum\s+(?:of|dose|daily)\b/i, 'states a maximum, not a dose'],
  [/\bif\s+(?:required|needed|necessary|well[-\s]tolerated)\b|\bas\s+needed\b|\bup\s+to\b|\bgradually\b|\bincrease\b|\badd\s+a(?:\s+further|nother)\b/i, 'the dose is adjusted, not fixed'],
  [/\d+\s*(?:[-–—~〜～]|\s(?:to|or)\s)\s*\d+/u, 'states a dose range, not one dose'],
  [/\btwice\b|\bthrice\b|\b\d+\s*(?:x|times)\s+(?:daily|a\s+day|per\s+day)\b|\d+\s*回/iu, 'repeats the dose during the day'],
];
const DAILY = /\b(?:once\s+)?daily\b|\b(?:once\s+)?(?:a|per|each|every)\s+day\b|1日/iu;
const DAILY_SERVING = /\b(?:your|one|a)\s+daily\s+serving\b/i;
const DOSE = /\btake\s+(\d+)\b(?:\s+(?:[\p{L}-]+\s+){0,2}?(capsules?|capsule\(s\)|caps|softgels?|tablets?|tabs|sachets?|servings?)\b)?/giu;
const DOSE_JA = /1日(?:の目安)?[】\]\s:：]*(\d+)\s*(粒|錠|カプセル|包)/gu;
/** A word after "take N" that names no unit ("take 6 a day"): the count is in the record's own form. */
const NO_UNIT_WORD = /^(?:a|per|each|every|daily|once|with)$/i;

export type DailyServings = { ok: true; perDay: number; basis: string } | Refusal;

/**
 * Label servings a day, read from the vendor's directions (English or
 * Japanese) only when they state one fixed dose and a daily frequency: "Take 4
 * capsules daily" at 4 per serving = 1, "take 6 a day", "your daily serving",
 * "【1日の目安】4粒". Refuses absent directions, exercise timing, cycles,
 * maxima, adjustable doses, ranges, repeated doses, no daily frequency, no or
 * several doses, a unit the record's form cannot be (or an unknown one, e.g.
 * "scoop"), and a dose that is not a whole number of label servings.
 */
export function dailyServings(directions: string | undefined, record: SupplyFields): DailyServings {
  if (!directions?.trim()) return { ok: false, reason: 'no directions stated' };
  const text = directions.normalize('NFKC');
  for (const [re, reason] of NOT_ONE_DAILY_DOSE) if (re.test(text)) return { ok: false, reason };
  if (!DAILY.test(text)) return { ok: false, reason: 'no daily frequency stated' };
  const daily = text.match(DAILY_SERVING);
  if (daily) return { ok: true, perDay: 1, basis: `"${daily[0]}"` };

  const doses = [
    ...[...text.matchAll(DOSE)].map((m) => {
      const word = m[2]?.replace(/\(s\)$/, '');
      const next = word ? undefined : text.slice((m.index ?? 0) + m[0].length).match(/^\s+([\p{L}\p{N}()'’-]+)/u)?.[1];
      return { text: m[0], count: Number(m[1]), word, unknown: next !== undefined && !NO_UNIT_WORD.test(next) ? next : undefined };
    }),
    ...[...text.matchAll(DOSE_JA)].map((m) => ({ text: m[0], count: Number(m[1]), word: m[2], unknown: undefined })),
  ];
  if (doses.length === 0) return { ok: false, reason: 'no dose stated' };
  if (doses.length > 1) return { ok: false, reason: `several doses stated (${doses.map((d) => `"${d.text}"`).join(', ')})` };
  const [dose] = doses;
  if (dose.unknown) return { ok: false, reason: `"${dose.text} ${dose.unknown}" names no capsule, tablet, sachet or serving` };
  if (!(dose.count > 0)) return { ok: false, reason: `"${dose.text}" is not a dose` };

  // A unit word must fit the record's form; without one ("take 6 a day") the count is in the record's own form.
  if (dose.word) {
    const form = record.form ?? 'capsule';
    const kind = UNIT_WORDS.find(([re]) => re.test(dose.word!))?.[1];
    if (!kind) return { ok: false, reason: `"${dose.text}" names no capsule, tablet, sachet or serving` };
    if (!formAccepts(kind, form)) return { ok: false, reason: `directions count ${dose.word} but the record's form is ${form}` };
    if (kind === 'serving') return { ok: true, perDay: dose.count, basis: `"${dose.text}" a day` };
  }
  const cps = record.capsulesPerServing;
  if (!(typeof cps === 'number' && cps > 0)) return { ok: false, reason: `"${dose.text}" needs capsulesPerServing, which the record lacks` };
  const perDay = dose.count / cps;
  if (Math.abs(perDay - Math.round(perDay)) > EPSILON || Math.round(perDay) < 1) {
    return { ok: false, reason: `"${dose.text}" is ${fmt(perDay)} label servings at ${cps} per serving` };
  }
  return { ok: true, perDay: Math.round(perDay), basis: `"${dose.text}" a day at ${cps} per serving` };
}

/** Decimal places of a currency's minor unit, per ISO 4217 as Intl knows it (JPY 0, USD 2, BHD 3). */
export function currencyDigits(currency: string): number {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}
