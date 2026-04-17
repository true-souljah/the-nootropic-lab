import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsJP } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'ノートロピクス比較 — 日本向け全ブランド比較表',
  description:
    '日本で購入可能なすべての主要ノートロピクスブランドを横並びで比較。スコア、価格、カフェイン含有量、返金保証、Trustpilot評価でフィルタリング。',
  alternates: {
    languages: {
      'en-JP': '/nootropic-comparison',
      'ja-JP': '/ja/hikaku',
    },
  },
};

export default function JaHikakuPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '2026年 日本向け最高のノートロピクスサプリメント',
    itemListElement: productsJP.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://jp.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <div lang="ja">
      <SchemaOrg schema={itemListSchema} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          ノートロピクス比較ツール — 日本
        </h1>
        <p className="text-gray-600 mb-6">
          日本で購入可能なすべての主要ブランドを横並びで比較します。スコア、価格、返金保証で並べ替え。
          カフェインフリーでフィルタリングできます。
        </p>
        <AffiliateDisclosure />
        <div className="mt-8">
          <ComparisonTable products={productsJP} market="us" />
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <a href="/nootropic-comparison" className="text-green-700 underline">
            🇬🇧 English version: Nootropic Comparison Tool — Japan
          </a>
        </div>
      </div>
    </div>
  );
}
