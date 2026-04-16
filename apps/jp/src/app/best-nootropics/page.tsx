import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsJP } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Best Nootropics in Japan 2026 (日本) — MHLW Import Guide',
  description:
    'Top nootropic supplements for Japan buyers. International brands with Japan shipping + domestic FANCL and Suntory options. MHLW import compliance notes.',
};

const faqItems = [
  {
    q: 'What is the duty-free import limit for supplements in Japan?',
    a: 'Japan allows personal imports duty-free up to ¥16,000 in value. Orders above this threshold may attract customs duties (typically 0–6.5% plus 10% consumption tax). To stay under the limit, order no more than 1 month\'s supply at a time from international brands.',
  },
  {
    q: 'Are racetams or modafinil legal in Japan?',
    a: 'Racetams (piracetam, aniracetam) are unregulated in Japan but are not widely sold domestically. Modafinil is a prescription drug in Japan. We only recommend products using MHLW-permissible ingredients.',
  },
  {
    q: 'What is the difference between FANCL BRAINs and Mind Lab Pro?',
    a: 'FANCL BRAINs is a Japanese domestic brand, MHLW-compliant, available on Amazon Japan without import issues. Mind Lab Pro is an international premium stack with higher clinical doses but requires international ordering. For first-time buyers, FANCL is lower-risk; for maximum efficacy, Mind Lab Pro leads our ranking.',
  },
];

export default function BestNootropicsJPPage() {
  const winner = productsJP.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Nootropics in Japan 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab JP' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <StickyCtaBar productName={winner.name} affiliateUrl={winner.affiliateUrl} />

      <article className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-xs text-gray-500">
          Last updated: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Best Nootropics in Japan 2026
        </h1>
        <p className="text-base text-gray-400 mb-4">日本向けノートロピクス比較 2026</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-amber-900 mb-2">Japan Buyer&apos;s Note</h2>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• All international products listed ship directly to Japan.</li>
            <li>• Japanese domestic brands (FANCL, Suntory) available on <strong>Amazon Japan</strong> — no customs.</li>
            <li>• International brands ship from UK or USA — allow 7–14 business days.</li>
            <li>• Stay under <strong>¥16,000</strong> per order to avoid customs duties.</li>
          </ul>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — Japan 2026</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {winner.caffeineFree && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                MHLW Import Compliant
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              Ships to Japan
            </span>
          </div>
          <a
            href={winner.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Check Price (${winner.priceMonthlyUSD}/mo USD) →
          </a>
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Japan Nootropic Comparison 2026</h2>
          <p className="text-sm text-gray-500 mb-4">
            Prices in USD. Green badge = caffeine-free (MHLW import compliant). Amazon Japan links for domestic brands.
          </p>
          <ComparisonTable products={productsJP} market="us" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Japan Nootropics FAQ</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Reading */}
        <section className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Recommended Reading</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="/guides/what-are-nootropics" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">What Are Nootropics?</div>
              <div className="text-xs text-gray-500">A beginner&apos;s guide to cognitive supplements</div>
            </a>
            <a href="/guides/how-to-stack-nootropics" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">How to Stack Nootropics</div>
              <div className="text-xs text-gray-500">Combine ingredients safely for better results</div>
            </a>
            <a href="/ingredients" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Ingredient Database</div>
              <div className="text-xs text-gray-500">Evidence-graded profiles for 15 key nootropics</div>
            </a>
            <a href="/guides/nootropics-for-focus-vs-memory" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Focus vs. Memory</div>
              <div className="text-xs text-gray-500">Which nootropics work best for your goal?</div>
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
