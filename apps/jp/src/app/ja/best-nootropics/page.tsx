import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, CookieSettingsBar, NoPurchaseLinkNotice, SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsJP, getStrings, purchaseUrl } from '@nootropic/data';

const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `${CURRENT_YEAR}年 日本向け最高のノートロピクス — 厚生労働省輸入ガイド`,
  description:
    '日本の購入者向けトップノートロピクスサプリメント。日本発送対応の海外ブランドとファンケル・サントリーの国内オプション。厚生労働省輸入コンプライアンス注意事項。',
  alternates: buildAlternates({ regionCode: 'jp', path: '/ja/best-nootropics/', availableInRegions: ['jp'] }),
  openGraph: buildOpenGraph({ regionCode: 'jp', path: '/ja/best-nootropics/', title: `${CURRENT_YEAR}年 日本向け最高のノートロピクス — 厚生労働省輸入ガイド`, description: '日本の購入者向けトップノートロピクスサプリメント。日本発送対応の海外ブランドとファンケル・サントリーの国内オプション。厚生労働省輸入コンプライアンス注意事項。' }),
  twitter: buildTwitter({ title: `${CURRENT_YEAR}年 日本向け最高のノートロピクス — 厚生労働省輸入ガイド`, description: '日本の購入者向けトップノートロピクスサプリメント。日本発送対応の海外ブランドとファンケル・サントリーの国内オプション。厚生労働省輸入コンプライアンス注意事項。' }),
};

const faqItems = [
  {
    q: '日本のサプリメント免税輸入上限はいくらですか？',
    a: '日本では¥16,000以下の個人輸入が免税となります。この上限を超える注文には通関税（通常0〜6.5%＋消費税10%）がかかる場合があります。上限内に収めるため、海外ブランドは1ヶ月分以下のご注文をお勧めします。',
  },
  {
    q: 'ラセタムやモダフィニルは日本で合法ですか？',
    a: '2019年1月1日以降、ピラセタム、アニラセタム、オキシラセタム、プラミラセタム、レベチラセタム、ビンポセチン、アドラフィニルを含む指定25成分は、数量にかかわらず、医師の処方せんや指示がなければ個人輸入が原則禁止されています（静岡県の案内による）。詳しくは下記リンクの英語解説ページをご覧ください。モダフィニルは日本では処方薬です。当サイトでは厚生労働省が許可する成分を使用した製品のみを推奨しています。',
  },
  {
    q: 'ファンケル BRAINsとMind Lab Proの違いは何ですか？',
    a: 'ファンケル BRAINsは日本国内の製品で、ファンケル公式楽天市場店で販売されており、機能性表示食品（届出番号 G425）と表示されています。Mind Lab Proは海外のプレミアムスタックで、シチコリン、ホスファチジルセリン、L-テアニンの3成分が当サイトの基準用量を満たしますが、海外からの注文が必要です。初めての方にはファンケルがリスクが低く、最大の効果を求める方にはMind Lab Proが当サイトのランキング1位です。',
  },
];

export default function JaBestNootropicsPage() {
  const winner = productsJP.find(p => p.editorChoice)!;
  // No sticky bar and a notice in place of the CTA when the edition shows no
  // purchase link for the pick (Product.noPurchaseLink).
  const winnerUrl = purchaseUrl(winner);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${CURRENT_YEAR}年 日本向け最高のノートロピクス`,
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab 編集チーム' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab JP' },
  };


  return (
    <div lang="ja">
      <SchemaOrg schema={articleSchema} />
      {winnerUrl !== null && (
        <StickyCtaBar
          productName={winner.name}
          href={winnerUrl}
          pickLabel="編集部のおすすめ第1位："
          ctaLabel="価格を確認 →"
          ariaLabel="おすすめ第1位"
        />
      )}

      <article className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-xs text-gray-500">
          最終更新: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {CURRENT_YEAR}年 日本向け最高のノートロピクス
        </h1>
        <p className="text-base text-gray-400 mb-4">{CURRENT_YEAR}年 日本向けノートロピクスガイド — 厚生労働省輸入情報</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-amber-900 mb-2">厚生労働省 輸入に関する注意</h2>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Mind Lab Proは公式FAQで配送先の一つとして日本を挙げています。その他の海外ブランドについては、購入手続きの際に日本への配送可否をご確認ください。</li>
            <li>• ファンケル BRAINsは<strong>ファンケル公式楽天市場店</strong>で販売されています（機能性表示食品・届出番号 G425）。</li>
            <li>• 通関税を避けるため1注文あたり<strong>¥16,000</strong>以下でご注文ください（<a href="/ja/yakkan-shoumei/" className="text-green-700 underline">薬監証明制度の詳細</a>）。</li>
          </ul>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">編集者の選択 — Japan {CURRENT_YEAR}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {winner.caffeineFree && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                厚生労働省輸入準拠
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              日本へ発送
            </span>
          </div>
          {winnerUrl === null ? (
            <NoPurchaseLinkNotice product={winner} strings={getStrings('ja').noPurchaseLink} />
          ) : (
            <a
              href={winnerUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {`現在の価格を確認 ($${winner.priceMonthlyUSD}/月 USD) →`}
            </a>
          )}
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{CURRENT_YEAR}年 日本ノートロピクス比較</h2>
          <p className="text-sm text-gray-500 mb-4">
            価格は円表示。緑バッジ = カフェインフリー（厚生労働省輸入準拠）。
          </p>
          <ComparisonTable products={productsJP} market="jp" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">よくある質問</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            個人輸入が制限されている成分の詳細（英語）：{' '}
            <a href="/japanese-brain-supplements/" className="text-green-700 underline">Japanese brain supplements — FFC-notified products vs. imported nootropics</a>
          </p>
        </section>

        {/* Recommended Reading */}
        <section className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">おすすめ記事</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="/guides/what-are-nootropics/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">ノートロピクスとは？</div>
              <div className="text-xs text-gray-500">認知機能サプリメントの初心者ガイド</div>
            </a>
            <a href="/guides/how-to-stack-nootropics/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">ノートロピクスのスタック方法</div>
              <div className="text-xs text-gray-500">より良い効果のために安全に成分を組み合わせる</div>
            </a>
            <a href="/ingredients/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">成分データベース</div>
              <div className="text-xs text-gray-500">15種類の主要ノートロピクス成分のエビデンス評価プロファイル</div>
            </a>
            <a href="/guides/nootropics-for-focus-vs-memory/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">集中力 vs. 記憶力</div>
              <div className="text-xs text-gray-500">あなたの目標に最適なノートロピクスは？</div>
            </a>
          </div>
        </section>

        <div className="mt-10 text-sm text-gray-500">
          <a href="/best-nootropics/" className="text-green-700 underline">
            🇬🇧 English version: Best Nootropics in Japan {CURRENT_YEAR}
          </a>
        </div>
      </article>
      <CookieSettingsBar
        label={getStrings('ja').cookie.settings}
        privacyLabel={getStrings('ja').footer.about.privacy}
        cookiePolicyLabel={getStrings('ja').footer.about.cookies}
      />
    </div>
  );
}
