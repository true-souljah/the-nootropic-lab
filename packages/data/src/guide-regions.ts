import type { RegionCode } from './regional';
import { guides, type Guide } from './guides';
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
  const onHost = guides.filter((g) => g.regions.includes(region));
  if (region !== 'latam') return onHost;
  return onHost.map((g) => {
    const es = guidesEs.find((t) => t.slug === g.slug);
    if (!es) throw new Error(`guide "${g.slug}" lists 'latam' but has no Spanish translation in guides-es.ts`);
    return { ...es, regions: g.regions };
  });
}
