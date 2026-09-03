import Link from 'next/link';
import SchemaOrg from '../SchemaOrg';
import PublicShell from './PublicShell';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

/**
 * GeoIndexPage — hub page for a region's programmatic geo guides
 * (/prefectures/, /states/, /provinces/, /countries/).
 *
 * Why this exists (2026-09 audit): every geo page was reachable only from
 * sitemap.ts. No page on any host linked to them, so Google reported the
 * newer ones as "URL is unknown" for months. This hub gives each geo page
 * an inbound link and is itself linked from the region home page.
 */

export interface GeoIndexItem {
  slug: string;
  name: string;
  /** Optional secondary label, e.g. the native-script name. */
  note?: string;
}

export interface GeoIndexLink {
  href: string;
  label: string;
  note?: string;
}

/**
 * Map geo data rows to hub links. Hrefs always carry the trailing slash
 * (every region app exports with `trailingSlash: true`; a slash-less href
 * costs a 308 on click and splits the URL in GSC reports).
 */
export function buildGeoIndexLinks(items: readonly GeoIndexItem[], basePath: string): GeoIndexLink[] {
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return items.map((item) => ({
    href: `${base}/${item.slug}/`,
    label: item.name,
    ...(item.note ? { note: item.note } : {}),
  }));
}

export interface GeoIndexPageProps {
  title: string;
  intro: string;
  /** e.g. '/prefectures' — used for hrefs and the CollectionPage url. */
  basePath: string;
  items: readonly GeoIndexItem[];
  /** Absolute site origin, e.g. 'https://jp.thenootropiclab.com'. */
  siteUrl: string;
  /** Breadcrumb: label + href of the region's best-of hub. */
  hubLabel: string;
  hubHref?: string;
  homeLabel?: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

export default function GeoIndexPage({
  title,
  intro,
  basePath,
  items,
  siteUrl,
  hubLabel,
  hubHref = '/best-nootropics/',
  homeLabel = 'Home',
  searchItems,
  uiStrings,
}: GeoIndexPageProps) {
  const links = buildGeoIndexLinks(items, basePath);
  const pageUrl = `${siteUrl}${links.length ? links[0].href.slice(0, links[0].href.indexOf('/', 1) + 1) : basePath}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: intro,
    url: pageUrl,
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: links.map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: l.label,
        url: `${siteUrl}${l.href}`,
      })),
    },
  };

  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={schema} />
      <article className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-green-700">{homeLabel}</Link>
          {' / '}
          <Link href={hubHref} className="hover:text-green-700">{hubLabel}</Link>
          {' / '}
          <span aria-current="page">{title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">{intro}</p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm mb-1">{l.label}</div>
                {l.note && <div className="text-xs text-gray-500">{l.note}</div>}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </PublicShell>
  );
}
