// Single source of truth for region URLs and hreflang codes. Used by every
// page's metadata export so Google sees a consistent `<link rel="alternate">`
// set across the 8 region apps.

export const REGIONS = {
  us: { siteUrl: 'https://thenootropiclab.com', hreflang: 'en-US' },
  eu: { siteUrl: 'https://eu.thenootropiclab.com', hreflang: 'en-GB' },
  ca: { siteUrl: 'https://ca.thenootropiclab.com', hreflang: 'en-CA' },
  au: { siteUrl: 'https://au.thenootropiclab.com', hreflang: 'en-AU' },
  jp: { siteUrl: 'https://jp.thenootropiclab.com', hreflang: 'ja-JP' },
  latam: { siteUrl: 'https://latam.thenootropiclab.com', hreflang: 'es-419' },
  gcc: { siteUrl: 'https://gcc.thenootropiclab.com', hreflang: 'en-AE' },
  sea: { siteUrl: 'https://sea.thenootropiclab.com', hreflang: 'en-SG' },
} as const;

export type RegionCode = keyof typeof REGIONS;

export interface BuildAlternatesParams {
  /** The region the current page is in. */
  regionCode: RegionCode;
  /** Path relative to siteUrl. Must start with `/` and (by convention) end with `/`. */
  path: string;
  /**
   * Region codes where this exact path exists. Defaults to all 8 regions —
   * use this for pages that exist in every region (homepage, best-nootropics,
   * ingredients/[slug], etc.). Pass an explicit subset for region-only pages
   * like `/anmat-disposicion-2105-2022-prohibidos` (latam only) or US state
   * `/[slug]/best-nootropics` pages (us only).
   */
  availableInRegions?: readonly RegionCode[];
}

export interface AlternatesOutput {
  canonical: string;
  languages: Record<string, string>;
}

/**
 * Build a Next.js `Metadata.alternates` value (canonical + hreflang map) from
 * the region the page lives in and the page's path. Emits one `<link
 * rel="alternate" hreflang>` entry per region where the page exists, plus an
 * `x-default` entry pointing to US (the primary domain) when US is available,
 * else to the canonical itself.
 *
 * Always emits a self-canonical pointing to the current region's URL.
 */
export function buildAlternates({
  regionCode,
  path,
  availableInRegions,
}: BuildAlternatesParams): AlternatesOutput {
  const regions = availableInRegions ?? (Object.keys(REGIONS) as RegionCode[]);
  const canonical = `${REGIONS[regionCode].siteUrl}${path}`;

  const languages: Record<string, string> = {};
  for (const r of regions) {
    languages[REGIONS[r].hreflang] = `${REGIONS[r].siteUrl}${path}`;
  }
  languages['x-default'] = regions.includes('us')
    ? `${REGIONS.us.siteUrl}${path}`
    : canonical;

  return { canonical, languages };
}

export interface BuildOpenGraphParams {
  regionCode: RegionCode;
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
}

export interface OpenGraphOutput {
  title: string;
  description: string;
  url: string;
  siteName: string;
  type: 'website' | 'article';
  images: string[];
}

/**
 * Build a Next.js `Metadata.openGraph` value. Uses the page's title +
 * description verbatim, sets the canonical URL for `url`, and a shared
 * siteName across the network. `type` defaults to `website`; pass `article`
 * for guides and editorial content.
 *
 * The `images` array points at the region's static `opengraph-image` route
 * (Next.js generates this PNG at build time from `apps/{region}/src/app/
 * opengraph-image.tsx`). We set this explicitly because Next.js's
 * automatic file-based metadata merging only fires for inline `openGraph:
 * { ... }` literals, not for objects returned from a helper call.
 */
export function buildOpenGraph({
  regionCode,
  path,
  title,
  description,
  type = 'website',
}: BuildOpenGraphParams): OpenGraphOutput {
  return {
    title,
    description,
    url: `${REGIONS[regionCode].siteUrl}${path}`,
    siteName: 'The Nootropic Lab',
    type,
    images: [`${REGIONS[regionCode].siteUrl}/opengraph-image`],
  };
}

export interface BuildTwitterParams {
  title: string;
  description: string;
  /**
   * Twitter card type. Defaults to `summary_large_image` now that
   * per-region `opengraph-image.tsx` files generate the required image at
   * build time.
   */
  card?: 'summary' | 'summary_large_image';
}

export interface TwitterOutput {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
}

export function buildTwitter({
  title,
  description,
  card = 'summary_large_image',
}: BuildTwitterParams): TwitterOutput {
  return { card, title, description };
}
