import type { RegionCode } from './regional';
import { guides, type Guide, type GuideTranslation } from './guides';
import { guidesEs } from './guides-es';

/**
 * The guides a region's host serves, in that host's language (LATAM: the
 * Spanish translations; every other host: English). Every consumer — guide
 * pages, the guides index, sitemaps and the search index — reads this, so a
 * guide limited to some hosts never leaks a link into the others.
 *
 * Throws at build time when a guide lists 'latam' without a Spanish
 * translation: a partial translation must fail, not ship English on LATAM.
 */
export function guidesForRegion(region: RegionCode): Guide[] {
  return selectGuidesForRegion(guides, guidesEs, region);
}

/** Pure form of guidesForRegion over explicit lists (unit-testable). */
export function selectGuidesForRegion(english: Guide[], spanish: GuideTranslation[], region: RegionCode): Guide[] {
  const onHost = english.filter((g) => g.regions.includes(region));
  if (region !== 'latam') return onHost;
  return onHost.map((g) => {
    const es = spanish.find((t) => t.slug === g.slug);
    if (!es) throw new Error(`guide "${g.slug}" lists 'latam' but has no Spanish translation in guides-es.ts`);
    return { ...es, regions: g.regions };
  });
}

/**
 * Every host that serves /guides/<slug>/, across all variants of that slug (e.g.
 * the US edition and the regionalised edition of the same guide). Guide pages
 * pass this to hreflang, so each variant links the full set of localized
 * alternates — the page is the same topic in every region even when its text is
 * region-specific.
 */
export function guideHosts(slug: string): RegionCode[] {
  const hosts = new Set<RegionCode>();
  for (const g of guides) if (g.slug === slug) for (const r of g.regions) hosts.add(r);
  return [...hosts];
}
