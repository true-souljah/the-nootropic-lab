import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter, PublicShell } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();
const PUBLISHED_DATE = '2026-05-29';

const META_TITLE = `${CURRENT_YEAR}年 薬監証明とは — ノートロピクス個人輸入の完全ガイド`;
const META_DESCRIPTION = '日本での認知機能サプリメント個人輸入における薬監証明（やっかんしょうめい）の制度、¥16,000の関税免税上限、申請手続き、機能性表示食品（FFC）との違いを解説。';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'jp', path: '/ja/yakkan-shoumei/', availableInRegions: ['jp'] }),
  openGraph: buildOpenGraph({
    regionCode: 'jp',
    path: '/ja/yakkan-shoumei/',
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: 'article',
  }),
  twitter: buildTwitter({ title: META_TITLE, description: META_DESCRIPTION }),
};

const faqItems = [
  {
    q: '薬監証明とは何ですか？',
    a: '薬監証明（やっかんしょうめい）は、医薬品、医薬部外品、医療機器などを業務目的ではなく個人使用目的で日本に輸入する際に、地方厚生局から発行される輸入確認証明書です。個人使用範囲を超える数量や、処方薬成分を含む製品を輸入する場合に必要となります。',
  },
  {
    q: '一般的なサプリメントの輸入に薬監証明は必要ですか？',
    a: '医薬品成分を含まない通常のサプリメント（食品扱い）の個人輸入では、原則として薬監証明は必要ありません。ただし、輸入量や成分によっては必要となる場合があるため、必ず最寄りの地方厚生局にご確認ください。',
  },
  {
    q: '¥16,000の上限は薬監証明と関係がありますか？',
    a: '¥16,000は税関の「少額輸入貨物の簡易税率制度」における関税および消費税の免税上限であり、薬監証明制度とは別の規定です。本ガイドでは両制度の違いを解説しています。',
  },
  {
    q: '薬監証明と機能性表示食品（FFC）の違いは？',
    a: '薬監証明は厚生労働省管轄の輸入許可制度です。一方、機能性表示食品（FFC）は消費者庁管轄の国内販売制度で、日本国内のメーカーが機能性を表示して販売する際に届出を行う制度です。FANCL BRAINsなどの国内ブランドはFFC制度のもとで販売されています。',
  },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: '日本', item: `${SITE_URL}/ja/` },
    { '@type': 'ListItem', position: 3, name: '薬監証明ガイド' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: META_TITLE,
  description: META_DESCRIPTION,
  inLanguage: 'ja',
  datePublished: PUBLISHED_DATE,
  dateModified: PUBLISHED_DATE,
  author: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function YakkanShoumeiPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={breadcrumbSchema} />
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <article className="max-w-4xl mx-auto px-4 py-10" lang="ja">
        <nav className="text-xs text-gray-500 mb-6" aria-label="パンくずリスト">
          <Link href="/" className="hover:text-green-700">ホーム</Link>
          {' / '}
          <Link href="/ja/best-nootropics" className="hover:text-green-700">日本</Link>
          {' / '}
          <span>薬監証明ガイド</span>
        </nav>

        <div className="mb-2 text-xs text-gray-500">
          公開日: {CURRENT_YEAR}年5月29日
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          薬監証明とは — ノートロピクス個人輸入の完全ガイド
        </h1>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          海外のノートロピクス（認知機能サプリメント）を日本に個人輸入する際、製品の種類や輸入量によっては薬監証明（やっかんしょうめい）の取得が必要となる場合があります。本ガイドでは、薬監証明制度の概要、税関の¥16,000関税免税ルール、申請手続き、そして機能性表示食品（FFC）制度との違いについて、{CURRENT_YEAR}年時点の情報に基づいて解説します。
        </p>

        <AffiliateDisclosure />

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">薬監証明制度の概要</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            薬監証明とは、医薬品、医薬部外品、化粧品、医療機器、または再生医療等製品を業務目的ではなく個人使用目的で日本に輸入する際に、地方厚生局が発行する輸入確認証明書です。輸入者（受取人）が個人使用範囲を超える数量を輸入する場合や、処方薬成分を含む製品を輸入する場合に必要となります。
          </p>
          <p className="text-gray-700 leading-relaxed">
            根拠法は「医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律」（薬機法、旧薬事法）です。輸入の確認手続きは、厚生労働省および各地方厚生局が管轄しています。詳細は厚生労働省の公式情報をご確認ください。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">税関の¥16,000関税免税ルール（薬監証明とは別制度）</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            個人使用目的での海外通販において、商品の課税価格（FOB価格に運送料等を加えた価格）の合計が¥16,666以下（おおむね¥16,000）の場合、税関の「少額輸入貨物の簡易税率制度」により関税および消費税が免税となります。これは税関（財務省）が管轄する制度であり、薬監証明制度とは別の規定です。
          </p>
          <p className="text-gray-700 leading-relaxed">
            一般的なノートロピクスサプリメント（医薬品成分を含まないもの）の場合、月額¥10,000〜¥15,000程度の単発注文であれば、税関の関税免税上限内に収まり、薬監証明も不要なケースが多いです。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">薬監証明が必要となる主なケース</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            一般的に、以下のいずれかに該当する場合は薬監証明の取得が必要となることがあります：
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-3">
            <li>個人使用範囲を超える数量の輸入（医薬品は通常2ヶ月分、化粧品は通常標準サイズで24個まで等、品目によって基準が異なります）</li>
            <li>処方薬成分を含む製品の輸入</li>
            <li>業務目的または転売目的での輸入</li>
            <li>同一輸入者による継続的・大量の輸入</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            ノートロピクス分野で特に注意が必要な成分には、モダフィニル、メチルフェニデート（リタリン）、一部のラセタム類などがあります。これらは日本では処方薬または規制対象の場合があり、当サイトでは推奨していません。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">薬監証明の申請手続き</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            薬監証明の申請は、輸入者（個人）が居住地を管轄する地方厚生局に対して行います。主な提出書類は以下の通りです：
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-3">
            <li>輸入確認申請書</li>
            <li>製品の成分表（英語可、日本語訳が必要な場合あり）</li>
            <li>注文書または購入確認メールの写し</li>
            <li>個人使用目的であることを示す説明書</li>
            <li>本人確認書類の写し</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            申請から証明書発行までの所要期間は地方厚生局および申請内容により異なります。最新の必要書類および処理期間については、必ず居住地を管轄する地方厚生局に直接お問い合わせください。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">薬監証明と機能性表示食品（FFC）の違い</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            薬監証明と機能性表示食品（FFC）は、しばしば混同される異なる制度です：
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-3">
            <li><strong>薬監証明</strong>: 海外製品を個人輸入する際の輸入確認制度（厚生労働省管轄）</li>
            <li><strong>機能性表示食品（FFC）</strong>: 日本国内で販売される食品の機能性表示について、製造者が消費者庁に届出を行う制度（消費者庁管轄）</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            国内ブランドのFANCL BRAINsやSuntory製品などは、機能性表示食品制度のもとで販売されており、薬監証明は必要ありません。詳しくは{' '}
            <Link href="/ffc-notified-cognitive-supplements" className="text-green-700 underline">機能性表示食品ガイド</Link>
            {' '}をご覧ください。
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">ノートロピクス購入における実践的な推奨事項</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            海外ノートロピクスを日本に輸入する場合の実践的な推奨事項：
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 mb-3">
            <li>初回注文は1ヶ月分（または¥16,000以下）に抑え、関税免税上限内に収める</li>
            <li>長期使用を予定する場合は、複数回に分けて少額注文を継続することで手続きを簡素化</li>
            <li>処方薬成分（モダフィニル、リタリンなど）を含む製品は避ける</li>
            <li>国内ブランド（FANCL BRAINs、Suntory）を選択すれば、輸入手続きや関税の問題を回避できる</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            当サイトの{' '}
            <Link href="/ja/best-nootropics" className="text-green-700 underline">日本向けノートロピクスランキング</Link>
            {' '}では、製品品質に加えて輸入の簡便さや国内入手可能性も評価軸としています。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 mb-2">免責事項</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            本ページは教育目的の情報提供であり、法的助言、医学的助言、または公式な輸入規制の解釈を構成するものではありません。最新の輸入規制、申請手続き、必要書類、所要期間の詳細については、必ず厚生労働省、地方厚生局、および税関の公式情報をご確認のうえ、ご自身の責任でご判断ください。本ページの情報は{CURRENT_YEAR}年時点のものです。
          </p>
        </section>
      </article>
    </PublicShell>
  );
}
