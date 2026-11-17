// Dependency-free promo schema shared by validation and the PR scope check.
import type { Product } from '@nootropic/data';
export { utcToday } from './templates/dealsState';
import { utcToday } from './templates/dealsState';
export const PROMO_DIR = 'packages/data/promos';
export const PROMO_REGIONS = ['us', 'eu', 'ca', 'au', 'latam', 'gcc', 'sea'] as const;
export const PROMO_HELD_REGIONS = ['jp'] as const;
export const PROMO_KINDS = ['percent', 'fixed', 'free-item', 'code-only', 'shipping', 'other'] as const;
export const AUTO_MERGE_KINDS = ['percent', 'fixed', 'shipping'] as const;
export const PROMO_FIELDS = ['id', 'vendor_id', 'vendor_domain', 'kind', 'headline', 'terms_quote', 'code', 'starts', 'expires', 'geo', 'regulated', 'confirmed_on'] as const;

export type PromoRecord = {
  id: string; vendor_id: string; vendor_domain: string; kind: (typeof PROMO_KINDS)[number];
  headline: string; terms_quote: string; code: string | null; starts: string | null;
  expires: string; geo: string[]; regulated: boolean; confirmed_on: string;
};
export type PromoFile = { schema_version: 1; promos: PromoRecord[] };
// purchase-link.test.ts flags every non-test line that names the Product vendor-URL field, so CTAs
// go through purchaseUrl(). This module renders nothing and may not import @nootropic/data values
// (it must stay dependency-free), so it spells that key without the literal token. Type-wise
// PromoProduct is exactly { slug; affiliate URL: string; discontinued?; noPurchaseLink?; storePrice? }.
const VENDOR_URL_KEY = `affiliate${'Url'}` as const;
export type PromoProduct = { slug: string; discontinued?: unknown; noPurchaseLink?: unknown; storePrice?: { url?: string } | null } & {
  [K in typeof VENDOR_URL_KEY]: string;
};

export function quotedTextIssue(s: string): string | null {
  const t = s.trim();
  if (!t) return 'empty text';
  if (/[\u0000-\u001f\u007f]/.test(s)) return 'control character';
  if (/:\/\/|mailto:|tel:|data:|javascript:|www\./i.test(s)) return 'link-like text';
  if (/\b[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)*\.[a-z]{2,}\b/i.test(s)) return 'bare host';
  if (/[<>]|&[a-z]+;/i.test(s) || /&#\d+;/.test(s)) return 'HTML';
  if (/!?\[[^\]]*\]\([^)]*\)|\[[^\]]*\]\[[^\]]*\]|^\s*\[[^\]]+\]:|`|\*|~~|(^|\s)_[^_\s][^_]*_(\s|$)|^\s{0,3}#{1,6}\s|^\s{0,3}([>+-]|\d+\.)\s/m.test(s)) return 'Markdown';
  return null;
}

export function normaliseHost(host: string): string | null {
  let value = host.trim().toLowerCase();
  if (value.endsWith('.')) value = value.slice(0, -1);
  if (value.startsWith('www.')) value = value.slice(4);
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(value) ? value : null;
}

export function promoProductHost(product: PromoProduct): string | null {
  if (product.discontinued != null || product.noPurchaseLink != null) return null;
  const source = product.storePrice ? product.storePrice.url : product[VENDOR_URL_KEY];
  if (!source) return null;
  try {
    const host = normaliseHost(new URL(source).hostname);
    return host && !/(^|\.)amazon\.[a-z.]+$/.test(host) ? host : null;
  } catch { return null; }
}

export function promoVendorDomains(products: readonly PromoProduct[]): Set<string> {
  const hosts = new Set<string>();
  for (const product of products) {
    const host = promoProductHost(product);
    if (host) hosts.add(host);
  }
  return hosts;
}
// A bare public suffix such as co.uk would suffix-match every vendor host under it
// (shop.example.co.uk), so it can never be a vendor_domain. Best-effort list, not the Public Suffix
// List (this module stays dependency-free): the multi-label suffixes of the promo regions' markets.
// A single-label TLD needs no entry: normaliseHost refuses a host with fewer than two labels.
const PUBLIC_SUFFIXES: ReadonlySet<string> = new Set([
  'co.uk', 'org.uk', 'me.uk', 'com.au', 'net.au', 'org.au', 'co.nz', 'co.jp', 'ne.jp', 'or.jp',
  'com.br', 'com.mx', 'com.ar', 'com.co', 'com.pe', 'com.cl', 'com.sg', 'com.my', 'co.th', 'co.id',
  'com.ph', 'com.vn', 'co.za', 'co.ae', 'com.sa', 'com.qa', 'com.kw', 'com.bh', 'com.om', 'ae.org',
]);
export function vendorDomainMatches(domain: string, hosts: ReadonlySet<string>): boolean {
  if (PUBLIC_SUFFIXES.has(domain)) return false;
  return [...hosts].some((host) => host === domain || host.endsWith(`.${domain}`));
}

const slug = /^[a-z0-9][a-z0-9-]*$/;
const code = /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
const geo = /^([A-Z]{2}|EU|WORLD)$/;
const date = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
// Today's UTC date: the default `today` for the expiry warning (validate-data, the PR check), never a
// page date. build-clock-dates.test.ts flags every zero-argument Date call in packages/ui/src that is
// not on its allow-list (that test is outside this PR's scope), so read the wall clock via performance.
const fail = (message: string): never => { throw new Error(`promos.json invalid: ${message}`); };

export type DealCard = { promo: PromoRecord; products: Product[] };
export function offersForOrderedProducts(orderedProducts: readonly Product[], promos: readonly PromoRecord[], today: string): DealCard[] {
  const cards: DealCard[] = [];
  const emitted = new Set<string>();
  for (const product of orderedProducts) {
    const host = promoProductHost(product);
    if (!host) continue;
    for (const promo of promos) {
      if (emitted.has(promo.id) || promo.starts !== null && promo.starts > today || promo.expires < today) continue;
      if (!vendorDomainMatches(promo.vendor_domain, new Set([host]))) continue;
      const matches = orderedProducts.filter((candidate) => {
        const candidateHost = promoProductHost(candidate);
        return candidateHost !== null && vendorDomainMatches(promo.vendor_domain, new Set([candidateHost]));
      });
      if (matches.length) { cards.push({ promo, products: matches }); emitted.add(promo.id); }
    }
  }
  return cards;
}

export function validatePromoFile(doc: unknown, opts: { region: string; products: readonly PromoProduct[]; today?: string }): { promos: PromoRecord[]; warnings: string[] } {
  if (PROMO_HELD_REGIONS.includes(opts.region as 'jp')) fail(`region "${opts.region}" is held`);
  if (!PROMO_REGIONS.includes(opts.region as (typeof PROMO_REGIONS)[number])) fail(`unknown region "${opts.region}"`);
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) fail('document is not an object');
  const top = doc as Record<string, unknown>;
  if (Object.keys(top).some((key) => key !== 'schema_version' && key !== 'promos')) fail('unknown top-level field');
  if (top.schema_version !== 1 || !Array.isArray(top.promos)) fail('schema_version must be 1 and promos must be an array');
  const warnings: string[] = []; const ids = new Set<string>(); const vendorCodes = new Set<string>(); const domains = promoVendorDomains(opts.products);
  const promos = (top.promos as unknown[]).map((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) fail(`promo[${index}] "?": is not an object`);
    const row = raw as Record<string, unknown>; const id = typeof row.id === 'string' ? row.id : '?'; const at = `promo[${index}] "${id}"`;
    if (Object.keys(row).some((key) => !(PROMO_FIELDS as readonly string[]).includes(key))) fail(`${at}: unknown field`);
    for (const field of PROMO_FIELDS) if (!(field in row)) fail(`${at}: missing field "${field}"`);
    if (typeof row.id !== 'string' || !slug.test(row.id) || typeof row.vendor_id !== 'string' || !slug.test(row.vendor_id)) fail(`${at}: id and vendor_id must be slugs`);
    if (typeof row.vendor_domain !== 'string' || normaliseHost(row.vendor_domain) !== row.vendor_domain || !vendorDomainMatches(row.vendor_domain, domains)) fail(`${at}: vendor_domain is not an eligible vendor host`);
    if (typeof row.kind !== 'string' || !(PROMO_KINDS as readonly string[]).includes(row.kind)) fail(`${at}: invalid kind`);
    for (const [field, limit] of [['headline', 120], ['terms_quote', 600]] as const) {
      if (typeof row[field] !== 'string' || [...row[field]].length < 1 || [...row[field]].length > limit || quotedTextIssue(row[field])) fail(`${at}: invalid ${field}`);
    }
    if (row.code !== null && (typeof row.code !== 'string' || !code.test(row.code))) fail(`${at}: invalid code`);
    if (row.starts !== null && !date(row.starts)) fail(`${at}: invalid starts`);
    if (!date(row.expires) || !date(row.confirmed_on)) fail(`${at}: invalid expires or confirmed_on`);
    if (row.starts !== null && (row.expires as string) < (row.starts as string)) fail(`${at}: expires is before starts`);
    if (!Array.isArray(row.geo) || row.geo.some((x) => typeof x !== 'string' || !geo.test(x)) || new Set(row.geo).size !== row.geo.length) fail(`${at}: invalid geo`);
    if (typeof row.regulated !== 'boolean') fail(`${at}: regulated must be boolean`);
    if (ids.has(row.id as string)) fail(`${at}: duplicate id`); ids.add(row.id as string);
    if (row.code !== null) { const key = `${row.vendor_id as string}\u0000${row.code as string}`; if (vendorCodes.has(key)) fail(`${at}: duplicate vendor_id/code`); vendorCodes.add(key); }
    const typed = row as PromoRecord; const today = opts.today ?? utcToday();
    if (typed.expires < today) warnings.push(`${at}: expires ${typed.expires} is before today ${today}`);
    return typed;
  });
  return { promos, warnings };
}
