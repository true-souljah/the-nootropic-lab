import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsCA } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Best Nootropics in Canada 2026 — Canadian Buyer\'s Guide',
  description:
    'Top-rated nootropic supplements for Canadian buyers. Canadian shipping confirmed, evidence-graded reviews, and full clinical dosing audit.',
};

const faqItems = [
  {
    q: 'Are nootropics legal in Canada?',
    a: 'Most nootropic supplements are legal in Canada as Natural Health Products (NHPs) regulated by Health Canada. Products with an NPN (Natural Product Number) have been reviewed for safety. Some compounds (e.g. racetams, modafinil) are prescription-only. All products we recommend use Health Canada-permissible ingredients.',
  },
  {
    q: 'Do I pay customs duties on nootropics ordered from the US or UK?',
    a: 'Orders under CAD $150 from the US typically enter duty-free under CUSMA/USMCA. UK orders may attract duties after Brexit changes. Products shipped from within North America are your safest bet for avoiding import delays.',
  },
  {
    q: 'Which nootropic ships fastest to Canada?',
    a: 'Mind Lab Pro and Performance Lab Mind both ship directly to Canada from their UK/EU warehouses, typically arriving in 5-10 business days. US-based brands like Alpha Brain ship from domestic US warehouses to Canada in 3-7 days.',
  },
];

export default function BestNootropicsCAPage() {
  const winner = productsCA.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Nootropics in Canada 2026',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab CA' },
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
    name: 'Best Nootropic Supplements Canada 2026',
    itemListElement: productsCA.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://ca.thenootropiclab.com/${p.slug}`,
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
          {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in Canada 2026
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          All products listed below ship directly to Canada. We verify Canadian availability,
          Health Canada NHP status where applicable, and note import duties for each brand.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-green-900 mb-2">Canada Buyer&apos;s Note</h2>
          <p className="text-sm text-green-800 leading-relaxed">
            Canadian buyers benefit from CUSMA/USMCA — orders under CAD $150 from the US typically
            enter duty-free. UK brands like Mind Lab Pro and Performance Lab ship internationally
            with standard delivery of 5-10 business days.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="mb-8">
          <a href="#comparison-table" className="text-green-700 underline text-sm font-medium">
            → Jump to Canada comparison table
          </a>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — Canada 2026</div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Canada Nootropic Comparison 2026</h2>
          <p className="text-sm text-gray-500 mb-4">
            Prices in USD (international brands price in USD for Canadian orders).
          </p>
          <ComparisonTable products={productsCA} market="us" />
        </section>

        <section className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How we score nootropics</h2>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            Each product is scored across 5 pillars: ingredient quality, dosing vs. clinical
            evidence, formula transparency, value for money, and brand trust.
          </p>
          <a href="/methodology" className="text-green-700 underline text-sm font-medium">
            Read our full methodology →
          </a>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Canada Nootropics FAQ</h2>
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
