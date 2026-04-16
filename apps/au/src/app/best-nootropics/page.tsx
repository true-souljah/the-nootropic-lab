import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsAU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Best Nootropics in Australia 2026 — TGA Import Guide',
  description:
    'Top-rated nootropic supplements for Australian buyers. TGA personal import rules, evidence-graded reviews, and clinical dosing audits.',
};

const faqItems = [
  {
    q: 'Are nootropics legal to import into Australia?',
    a: 'Most nootropic supplements can be personally imported into Australia under the TGA Personal Importation Scheme. Individuals may import up to 3 months\' supply for personal use without a permit. Prescription medicines (modafinil, racetams) require a valid prescription. All products we list use TGA-permissible ingredients.',
  },
  {
    q: 'Do I pay GST on supplements imported from overseas?',
    a: 'From July 2018, overseas businesses with turnover above AUD $75,000 must charge GST (10%) on goods under AUD $1,000. Many supplement brands now add GST automatically at checkout for Australian orders.',
  },
  {
    q: 'Which nootropic ships fastest to Australia?',
    a: 'Mind Lab Pro ships from the UK, typically reaching Australian addresses in 7-14 business days. US-based brands take 10-21 days. All brands listed have confirmed Australian shipping.',
  },
];

export default function BestNootropicsAUPage() {
  const winner = productsAU.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Nootropics in Australia 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab AU' },
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

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Nootropic Supplements Australia 2026',
    itemListElement: productsAU.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://au.thenootropiclab.com/${p.slug}`,
    })),
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <StickyCtaBar productName={winner.name} affiliateUrl={winner.affiliateUrl} />

      <article className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-xs text-gray-500">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in Australia 2026:
          <br />
          TGA Import Guide, Evidence-Graded
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          All products listed ship to Australia. We include TGA personal importation rules and
          GST notes so you know exactly what you&apos;ll pay.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-blue-900 mb-2">TGA Personal Import Rules</h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            Under the TGA Personal Importation Scheme, Australians may import up to{' '}
            <strong>3 months&apos; supply</strong> of a therapeutic good for personal use without a
            permit. Products listed as food supplements (not therapeutic goods) have simpler rules.
            When in doubt, check the <strong>TGA Personal Importation website</strong> before ordering.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — Australia 2026</div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Australia Nootropic Comparison 2026</h2>
          <ComparisonTable products={productsAU} market="us" />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Australia Nootropics FAQ</h2>
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
