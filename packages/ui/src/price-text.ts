import {
  formatMoney,
  monthlyStorePrice,
  perServingStorePrice,
  perDayStorePrice,
  type LocalPrice,
  type Money,
  type Product,
  type UIStrings,
} from '@nootropic/data';

// Every price on the site is written through here (site-owner policy
// 2026-10-09): the vendor's pack price in the store's own currency with what
// it covers, plus "≈ …/mo" only where the pack's supply is stated. Never a
// conversion, never a bare per-month figure the vendor's words don't support.
// Per-serving and per-day figures follow the same rule (store-price.ts); every
// derived figure carries "≈", only the vendor's pack price is bare.

export interface PriceText {
  /** The pack price, e.g. "US$79.95". */
  pack: string;
  /** What the pack price buys, verbatim from the vendor ("90 Count"). */
  packText: string;
  /** Language of `packText` when it is not English ("de", "ja"); null for English. */
  packLang: string | null;
  /** "≈ US$53.30/mo", or null when the supply is not stated. */
  monthly: string | null;
  /** The shortest honest form: the monthly figure when there is one, else "US$79.95 · 90 Count". */
  short: string;
  /** The per-month amount for sorting and filtering within one currency; null without a stated supply. */
  monthlyMoney: Money | null;
  /** "≈ US$2.30/serving", or null when the pack's serving count is not stated. */
  perServing: string | null;
  perServingMoney: Money | null;
  /** "≈ US$2.17/day", or null when neither a supply length nor a plain daily dose is stated. */
  perDay: string | null;
  perDayMoney: Money | null;
}

type PriceStrings = Pick<UIStrings, 'priceLocale' | 'productDetail'>;

/** A regional block's price (regional.ts localPrice) in its shortest honest form. */
export function localPriceShort(lp: LocalPrice, monthUnit: string): string {
  return lp.monthly ? `≈ ${formatMoney(lp.monthly, lp.locale)}/${monthUnit}` : `${formatMoney(lp.pack, lp.locale)} · ${lp.packText}`;
}

/** The locale prices are written in on this host. */
export function priceLocaleOf(strings: PriceStrings): string {
  return strings.priceLocale ?? strings.productDetail.dateLocale;
}

/** The record's store price as display text; null when the record has no store price. */
export function priceText(
  product: Pick<Product, 'storePrice' | 'servingsPerContainer' | 'capsulesPerServing' | 'form'>,
  strings: PriceStrings,
): PriceText | null {
  const sp = product.storePrice;
  if (!sp) return null;
  const locale = priceLocaleOf(strings);
  const pack = formatMoney(sp, locale);
  const { stats } = strings.productDetail;
  const m = monthlyStorePrice(product);
  const monthly = m ? `≈ ${formatMoney(m, locale)}/${stats.monthUnit}` : null;
  const s = perServingStorePrice(product);
  const d = perDayStorePrice(product);
  return {
    pack,
    packText: sp.pack,
    packLang: sp.lang ?? null,
    monthly,
    short: monthly ?? `${pack} · ${sp.pack}`,
    monthlyMoney: m && { amount: m.amount, currency: m.currency },
    perServing: s.ok ? `≈ ${formatMoney(s, locale)}/${stats.perServingUnit}` : null,
    perServingMoney: s.ok ? { amount: s.amount, currency: s.currency } : null,
    perDay: d.ok ? `≈ ${formatMoney(d, locale)}/${stats.perDayUnit}` : null,
    perDayMoney: d.ok ? { amount: d.amount, currency: d.currency } : null,
  };
}
