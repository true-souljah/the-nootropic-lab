import type { Product } from './products-us';

/**
 * Regional overlay — the data behind the "In <region>" block that makes the
 * shared guide and ingredient templates region-specific.
 *
 * Why (2026-09 audit): the six English hosts served byte-identical guide and
 * ingredient pages under hreflang, and Google de-duplicated the regional
 * copies (CA what-are-nootropics 361 → 1 impressions in a month). The block
 * derives region facts from data the repo already holds (licence status,
 * local price, local buyer's guides, the audited per-market disclaimer) and
 * leaves room for authored notes with primary-source citations.
 */

export type RegionCode = 'us' | 'eu' | 'ca' | 'au' | 'jp' | 'latam' | 'gcc' | 'sea';

export type LocalPriceField =
  | 'priceMonthlyUSD'
  | 'priceMonthlyEUR'
  | 'priceMonthlyCAD'
  | 'priceMonthlyAUD'
  | 'priceMonthlyJPY';

export interface RegionLabels {
  /** "in Canada" — appended to titles when the page has regional substance. */
  inRegion: string;
  /** Section heading template; `{name}` is replaced with the ingredient or "Nootropics". */
  heading: string;
  availability: string;
  noProducts: string;
  licence: string;
  price: string;
  perMonth: string;
  guides: string;
  regulatoryNote: string;
  sources: string;
  /** Word used for guide pages in the heading template, e.g. "Nootropics". */
  genericSubject: string;
}

export interface RegionProfile {
  code: RegionCode;
  name: string;
  currency: string;
  /** Intl locale used to format the local price. */
  priceLocale: string;
  priceField: LocalPriceField;
  /** Short regulator label shown next to licence status. */
  regulator: string;
  geoHub: { path: string; label: string };
  labels: RegionLabels;
}

const EN = (inRegion: string, geo: string): RegionLabels => ({
  inRegion,
  heading: `{name} ${inRegion}`,
  availability: `Products ${inRegion}`,
  noProducts: `None of the stacks we have audited currently ship ${inRegion}.`,
  licence: 'Status',
  price: 'Local price',
  perMonth: '/month',
  guides: geo,
  regulatoryNote: 'Regulatory note',
  sources: 'Sources',
  genericSubject: 'Nootropics',
});

export const REGION_PROFILES: Record<RegionCode, RegionProfile> = {
  us: {
    code: 'us', name: 'United States', currency: 'USD', priceLocale: 'en-US', priceField: 'priceMonthlyUSD',
    regulator: 'FDA (DSHEA dietary supplement)',
    geoHub: { path: '/best-nootropics/', label: 'Best nootropics in the US' },
    labels: EN('in the United States', 'US buyer\'s guides'),
  },
  eu: {
    code: 'eu', name: 'European Union', currency: 'EUR', priceLocale: 'en-IE', priceField: 'priceMonthlyEUR',
    regulator: 'EU food supplement (Reg. 1924/2006 claims)',
    geoHub: { path: '/countries/', label: 'Country guides' },
    labels: EN('in the EU', 'EU country guides'),
  },
  ca: {
    code: 'ca', name: 'Canada', currency: 'CAD', priceLocale: 'en-CA', priceField: 'priceMonthlyCAD',
    regulator: 'Health Canada (NPN)',
    geoHub: { path: '/provinces/', label: 'Province guides' },
    labels: EN('in Canada', 'Province guides'),
  },
  au: {
    code: 'au', name: 'Australia', currency: 'AUD', priceLocale: 'en-AU', priceField: 'priceMonthlyAUD',
    regulator: 'TGA (AUST L)',
    geoHub: { path: '/states/', label: 'State & territory guides' },
    labels: EN('in Australia', 'State & territory guides'),
  },
  jp: {
    code: 'jp', name: 'Japan', currency: 'JPY', priceLocale: 'ja-JP', priceField: 'priceMonthlyJPY',
    regulator: 'Consumer Affairs Agency (FFC)',
    geoHub: { path: '/prefectures/', label: 'Prefecture guides' },
    labels: EN('in Japan', 'Prefecture guides'),
  },
  latam: {
    code: 'latam', name: 'América Latina', currency: 'EUR', priceLocale: 'es-419', priceField: 'priceMonthlyEUR',
    regulator: 'ANVISA / COFEPRIS / INVIMA',
    geoHub: { path: '/countries/', label: 'Guías por país' },
    labels: {
      inRegion: 'en América Latina',
      heading: '{name} en América Latina',
      availability: 'Productos disponibles en América Latina',
      noProducts: 'Ninguno de los stacks que hemos auditado envía actualmente a América Latina.',
      licence: 'Estado',
      price: 'Precio local',
      perMonth: '/mes',
      guides: 'Guías por país',
      regulatoryNote: 'Nota regulatoria',
      sources: 'Fuentes',
      genericSubject: 'Nootrópicos',
    },
  },
  gcc: {
    code: 'gcc', name: 'GCC', currency: 'EUR', priceLocale: 'en-AE', priceField: 'priceMonthlyEUR',
    regulator: 'SFDA / Dubai Municipality',
    geoHub: { path: '/countries/', label: 'Country guides' },
    labels: EN('in the Gulf', 'GCC country guides'),
  },
  sea: {
    code: 'sea', name: 'Southeast Asia', currency: 'EUR', priceLocale: 'en-SG', priceField: 'priceMonthlyEUR',
    regulator: 'HSA / NPRA / BPOM / FDA PH / Thai FDA',
    geoHub: { path: '/countries/', label: 'Country guides' },
    labels: EN('in Southeast Asia', 'SEA country guides'),
  },
};

export interface LicenceStatus {
  label: string;
  tone: 'good' | 'neutral' | 'warn';
}

/**
 * Region-specific licence / import status derived from the product record.
 * Returns null when the region has no licence concept on the record (the
 * block then shows availability and price only). Never invents a status.
 */
export function licenceStatus(product: Product, region: RegionCode): LicenceStatus | null {
  switch (region) {
    case 'ca':
      if (!product.npnStatus) return null;
      return product.npnStatus.status === 'licensed'
        ? { label: product.npnStatus.npn ? `NPN ${product.npnStatus.npn}` : 'NPN licensed', tone: 'good' }
        : { label: 'Personal import (PIP)', tone: 'neutral' };
    case 'au':
      return product.austl
        ? { label: `AUST L ${product.austl}`, tone: 'good' }
        : { label: 'Personal Importation Scheme', tone: 'neutral' };
    case 'jp':
      if (!product.ffcStatus) return null;
      return product.ffcStatus.notified
        ? { label: product.ffcStatus.notificationNumber ? `FFC 届出 ${product.ffcStatus.notificationNumber}` : 'FFC notified', tone: 'good' }
        : { label: 'Imported (not FFC-notified)', tone: 'neutral' };
    case 'eu':
      if (product.euCompliance === 'compliant') return { label: product.euStorefront ? 'EU storefront' : 'EU compliant', tone: 'good' };
      if (product.euCompliance === 'reformulated') return { label: 'Reformulated for the EU', tone: 'warn' };
      return { label: 'Compliance unverified', tone: 'neutral' };
    case 'sea': {
      const halal = (product as Product & { halalCertified?: boolean }).halalCertified;
      if (halal === true) return { label: 'Halal certified', tone: 'good' };
      if (halal === false) return { label: 'No halal certification', tone: 'neutral' };
      return null;
    }
    default:
      return null;
  }
}

export interface LocalPrice {
  amount: number;
  currency: string;
  locale: string;
}

/** Local monthly price from the region's own price field; null when absent. */
export function localPrice(product: Product, region: RegionCode): LocalPrice | null {
  const profile = REGION_PROFILES[region];
  const amount = product[profile.priceField];
  if (typeof amount !== 'number' || !(amount > 0)) return null;
  return { amount, currency: profile.currency, locale: profile.priceLocale };
}

export interface RegionalSource {
  label: string;
  url: string;
}

/**
 * Authored regional note for one guide or ingredient. Every note carries the
 * primary sources it was checked against; the UI renders them. Notes without
 * sources are rejected by the data check.
 */
export interface RegionalNote {
  summary: string;
  sections?: { heading: string; content: string }[];
  faqs?: { question: string; answer: string }[];
  sources: RegionalSource[];
}

export interface RegionalNotes {
  guides: Record<string, RegionalNote>;
  ingredients: Record<string, RegionalNote>;
}

const EMPTY: RegionalNotes = { guides: {}, ingredients: {} };

/**
 * Authored notes per region. Populated region by region in follow-up PRs;
 * the derived block renders without them.
 */
export const REGIONAL_NOTES: Record<RegionCode, RegionalNotes> = {
  us: EMPTY, eu: EMPTY, ca: EMPTY, au: EMPTY, jp: EMPTY, latam: EMPTY, gcc: EMPTY, sea: EMPTY,
};

export function regionalGuideNote(region: RegionCode, slug: string): RegionalNote | undefined {
  return REGIONAL_NOTES[region].guides[slug];
}

export function regionalIngredientNote(region: RegionCode, slug: string): RegionalNote | undefined {
  return REGIONAL_NOTES[region].ingredients[slug];
}

/**
 * Title qualifier: only when the page has regional substance — at least one
 * product available in the region, or an authored note. A bare "in Canada"
 * on a page with nothing Canadian on it would be the thin-page version of
 * the problem this module fixes.
 */
export function regionalTitleQualifier(region: RegionCode, productCount: number, note?: RegionalNote): string {
  if (productCount > 0 || note) return ` ${REGION_PROFILES[region].labels.inRegion}`;
  return '';
}

/** Validation used by the data check: every authored note must cite a source. */
export function validateRegionalNotes(notes: Record<RegionCode, RegionalNotes> = REGIONAL_NOTES): string[] {
  const problems: string[] = [];
  for (const [region, r] of Object.entries(notes)) {
    for (const kind of ['guides', 'ingredients'] as const) {
      for (const [slug, note] of Object.entries(r[kind])) {
        if (!note.summary?.trim()) problems.push(`${region}/${kind}/${slug}: empty summary`);
        if (!note.sources?.length) problems.push(`${region}/${kind}/${slug}: no sources`);
        for (const s of note.sources ?? []) {
          if (!/^https?:\/\//.test(s.url)) problems.push(`${region}/${kind}/${slug}: bad source url ${s.url}`);
        }
      }
    }
  }
  return problems;
}
