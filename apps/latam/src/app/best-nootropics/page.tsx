import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsLatam } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Best Nootropics in Latin America 2026 — Latam Buyer\'s Guide',
  description:
    'Top nootropic supplements for Latin American buyers. International shipping confirmed for Mexico, Brazil, Argentina, Colombia, Chile, Peru.',
};

const faqItems = [
  {
    q: '¿Son legales los nootrópicos en Latinoamérica?',
    a: 'La mayoría de los suplementos nootrópicos son legales en Latinoamérica como suplementos alimenticios. La regulación varía por país: COFEPRIS en México, ANVISA en Brasil, ANMAT en Argentina, INVIMA en Colombia, ISP en Chile y DIGEMID en Perú. Los productos que recomendamos usan ingredientes permitidos en todos los mercados.',
  },
  {
    q: 'How long does shipping to Latin America take?',
    a: 'International brands typically ship from the US or UK, reaching most Latam countries in 7–21 business days depending on customs. Brazil tends to have the longest delays due to Receita Federal inspections. Colombia and Chile are generally fastest (7–12 days).',
  },
  {
    q: 'Are import duties charged on supplement orders?',
    a: 'Brazil charges up to 60% import tax on supplements — the highest in Latam. Mexico is typically duty-free under $50 USD. Argentina, Colombia, Chile, and Peru charge between 6–20% depending on product classification. Ordering a 1-month supply keeps you well within personal import allowances.',
  },
];

export default function BestNootropicsLatamPage() {
  const winner = productsLatam.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Nootropics in Latin America 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab Latam' },
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in Latin America 2026
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          International shipping confirmed for Mexico, Brazil, Argentina, Colombia, Chile, and Peru.
          Customs and import tax notes included for each country.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-amber-900 mb-2">Latam Import Note</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            Import duties vary significantly by country. <strong>Brazil</strong> applies the highest
            import tax (up to 60%). <strong>Mexico</strong> is the most import-friendly. We recommend
            ordering 1 month&apos;s supply at a time to stay within personal import limits.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — Latam 2026</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Latam Nootropic Comparison 2026</h2>
          <ComparisonTable products={productsLatam} market="us" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ — Nootrópicos en Latam</h2>
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
