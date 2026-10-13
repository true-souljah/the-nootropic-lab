import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter, scoreTier, SCORE_TIER_TEXT_CLASS, tpl } from '@nootropic/ui';
import { productsJP, jpPrefectures, buildPersonAuthorReference } from '@nootropic/data';

const CURRENT_YEAR = new Date().getFullYear();

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { HUB_LABEL, SITE_URL } from '@/lib/region';
import { priceText } from '@nootropic/ui';

export const dynamicParams = false;

const prefectures = jpPrefectures;

export function generateStaticParams() {
  return prefectures.map(p => ({ prefecture: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}): Promise<Metadata> {
  const { prefecture } = await params;
  const p = prefectures.find(x => x.slug === prefecture);
  if (!p) return {};
  return {
    title: `Best Nootropics in ${p.name} ${CURRENT_YEAR} — Japan Buyer's Guide`,
    description: `Buy nootropics in ${p.name} (${p.nameJa}): MHLW import notes, delivery times, and top-rated stacks.`,
    alternates: buildAlternates({ regionCode: 'jp', path: `/prefectures/${prefecture}/`, availableInRegions: ['jp'] }),
    openGraph: buildOpenGraph({ regionCode: 'jp', path: `/prefectures/${prefecture}/`, title: `Best Nootropics in ${p.name} ${CURRENT_YEAR} — Japan Buyer's Guide`, description: `Buy nootropics in ${p.name} (${p.nameJa}): MHLW import notes, delivery times, and top-rated stacks.` }),
    twitter: buildTwitter({ title: `Best Nootropics in ${p.name} ${CURRENT_YEAR} — Japan Buyer's Guide`, description: `Buy nootropics in ${p.name} (${p.nameJa}): MHLW import notes, delivery times, and top-rated stacks.` }),
  };
}

const topProducts = productsJP.slice().sort((a, b) => b.score - a.score).slice(0, 3);

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const p = prefectures.find(x => x.slug === prefecture);
  if (!p) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics in ${p.name} ${CURRENT_YEAR}`,
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  };

  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6" aria-label={uiStrings.breadcrumb.ariaLabel}>
          <a href="/" className="hover:text-green-700">{uiStrings.breadcrumb.home}</a>
          {' / '}
          <a href="/best-nootropics/" className="hover:text-green-700">{HUB_LABEL}</a>
          {' / '}
          <span>{p.nameJa}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {tpl(uiStrings.geo.bestIn, { place: p.nameJa, year: CURRENT_YEAR })}
        </h1>
        <p className="text-sm text-ds-muted mb-6">{p.nameJa}</p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <p className="text-green-900 leading-relaxed text-sm">{p.note}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-amber-900 mb-2">日本への個人輸入に関する注意</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            Personal import limit: <strong>¥16,000 duty-free</strong> per shipment.
            Order 1 month&apos;s supply at a time from international brands to stay under this limit.
            FANCL BRAINs is a domestic product sold through FANCL&apos;s official Rakuten store, labelled 機能性表示食品 (notification G425).
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {tpl(uiStrings.geo.topPicksFor, { place: p.nameJa })}
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <a
                key={product.slug}
                href={`/${product.slug}/`}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all"
              >
                <span className="text-2xl font-black text-ds-muted shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    {product.caffeineFree && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {uiStrings.productDetail.chips.caffeineFree}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.summary}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>{uiStrings.geo.score}{uiStrings.typography.space}<strong className={SCORE_TIER_TEXT_CLASS[scoreTier(product.score)]}>{`${product.score}/10`}</strong></span>
                    {priceText(product, uiStrings) && <span>{priceText(product, uiStrings)!.short}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="text-sm text-gray-500">
          <a href="/best-nootropics/" className="text-green-700 underline">
            {`← ${HUB_LABEL} ${CURRENT_YEAR}に戻る`}
          </a>
        </div>
      </article>
    </PublicShell>
  );
}
