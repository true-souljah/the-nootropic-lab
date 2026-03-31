import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsSEA } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Best Nootropics in Southeast Asia 2026 — SEA Buyer\'s Guide',
  description:
    'Top nootropic supplements for SEA buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — regulatory notes and shipping confirmed.',
};

const faqItems = [
  {
    q: 'Are nootropics regulated differently across SEA countries?',
    a: 'Yes. Singapore (HSA) and Malaysia (NPRA) have the most structured supplement import frameworks. Singapore is the safest entry point — HSA allows personal import of most food supplements. Indonesia (BPOM) is the most restrictive. Thailand, Philippines, and Vietnam allow personal imports but formal registration is required for commercial sale.',
  },
  {
    q: 'Which SEA country has the fastest delivery?',
    a: 'Singapore receives international shipments from the UK and US in 5–10 business days — the fastest hub in SEA. Malaysia and Thailand follow at 7–14 days. Indonesia and Vietnam can take 14–21 days due to customs processing.',
  },
  {
    q: 'Is Mind Lab Pro popular in Singapore?',
    a: 'Yes. Mind Lab Pro has a significant following among Singapore\'s professional and expat community. It is frequently ordered directly from the Opti-Nutra website with delivery to Singapore addresses in approximately 7 business days.',
  },
];

export default function BestNootropicsSEAPage() {
  const winner = productsSEA.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Nootropics in Southeast Asia 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab SEA' },
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
          Best Nootropics in Southeast Asia 2026
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Evidence-graded nootropic reviews for buyers in Singapore, Malaysia, Thailand, Philippines,
          Indonesia, and Vietnam. Regulatory import notes for each country included.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-blue-900 mb-2">SEA Regulatory Note</h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            Products listed are imported as personal-use food supplements. Singapore (HSA) and
            Malaysia (NPRA) have the most transparent import frameworks. Indonesia (BPOM) requires
            registration for commercial sale but permits personal imports. Always verify current
            rules with your national authority before ordering.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — SEA 2026</div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">SEA Nootropic Comparison 2026</h2>
          <ComparisonTable products={productsSEA} market="us" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">SEA Nootropics FAQ</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
