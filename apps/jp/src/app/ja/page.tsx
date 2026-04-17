import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab JP — 日本向けノートロピクス独立比較レビュー',
  description:
    '日本の購入者向けの認知機能サプリメント独立比較レビュー。臨床投与量監査、厚生労働省輸入ガイドライン、透明なアフィリエイト開示。',
  alternates: {
    languages: {
      'en-JP': '/',
      'ja-JP': '/ja',
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab JP',
  url: 'https://jp.thenootropiclab.com/ja',
  description: '日本の購入者向けの認知機能サプリメント独立比較レビュー。',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: 'https://jp.thenootropiclab.com/ja',
  description: '臨床投与量監査と透明なアフィリエイト開示による認知機能サプリメントの独立比較レビュー。',
};

const features = [
  {
    icon: '🔬',
    title: '臨床投与量監査',
    desc: '各製品レビューには、各成分を査読済み試験の最低有効量と比較した投与量対エビデンス表が含まれています。',
  },
  {
    icon: '🗾',
    title: '日本への発送確認済み',
    desc: '掲載されているすべての海外製品は日本に直接発送されます。日本国内ブランド（ファンケル、サントリー）はAmazon Japanでご購入いただけます。',
  },
  {
    icon: '⚖️',
    title: '厚生労働省 輸入に関する注意',
    desc: '厚生労働省の個人輸入ガイドラインに準拠した製品を示し、すべての注文における免税上限¥16,000を明記しています。',
  },
];

const quickLinks = [
  {
    href: '/ja/best-nootropics',
    title: '2026年 日本向け最高のノートロピクス',
    desc: '日本への発送確認済みおよび厚生労働省輸入注意を含むトップ製品。',
  },
  {
    href: '/ja/hikaku',
    title: 'インタラクティブ比較ツール',
    desc: '日本国内オプションを含むすべてのブランドを並べ替え・フィルタリング。',
  },
  {
    href: '/methodology',
    title: '評価方法',
    desc: '認知機能サプリメントのスコアリングとレビュー方法。',
  },
];

export default function JaHomePage() {
  return (
    <div lang="ja">
      <SchemaOrg schema={websiteSchema} />
      <SchemaOrg schema={orgSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            日本市場・厚生労働省輸入注意・アフィリエイト開示済み
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            日本向け独立ガイド
            <br />
            <span className="text-green-700">認知機能サプリメント</span>
          </h1>
          <p className="text-base text-gray-400 mb-2">日本向け独立系認知機能サプリメントレビュー</p>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            海外および国内のノートロピクスを比較します。すべての成分の投与量を臨床エビデンスと照合。
            厚生労働省の輸入ガイドラインを明確に記載。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ja/best-nootropics"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              最高のノートロピクス 2026 →
            </Link>
            <Link
              href="/ja/hikaku"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              全ブランドを比較
            </Link>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <Link href="/" className="text-green-700 underline">
              🇯🇵 English version
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          The Nootropic Lab JPが選ばれる理由
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">リサーチを始める</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block border border-gray-200 rounded-lg p-5 hover:border-green-700 hover:shadow-sm transition-all"
            >
              <div className="font-semibold text-gray-900 mb-1">{l.title}</div>
              <div className="text-sm text-gray-500">{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
