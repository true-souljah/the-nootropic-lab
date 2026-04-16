import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

export const metadata: Metadata = {
  title: 'Best Nootropics in Europe 2026: EU-Compliant, EUR-Priced, Evidence-Graded',
  description:
    'The only nootropic comparison platform built for EU buyers. EUR pricing, EU regulatory compliance status (Directive 2002/46/EC), and full ingredient dosing audit.',
  alternates: {
    languages: {
      'de-DE': '/de/beste-nootropika',
      'fr-FR': '/fr/meilleurs-nootropiques',
    },
  },
};

const faqItems = [
  {
    q: 'Are nootropics legal in the EU?',
    a: 'Most nootropic supplements are legal in the EU as food supplements under Directive 2002/46/EC. However, some compounds (e.g. racetams, modafinil) are prescription-only or restricted in specific EU member states. All products we recommend use EFSA-permissible ingredients.',
  },
  {
    q: 'Which nootropic is best for EU buyers?',
    a: 'Mind Lab Pro is our top pick for EU buyers. It has a dedicated EU storefront with EUR pricing, ships from within the EU to avoid customs, and the formula is fully compliant with EU Directive 2002/46/EC.',
  },
  {
    q: 'Do I need to pay customs duties on nootropics ordered from the US?',
    a: 'Yes — if ordered from a US store, EU buyers may be charged import duties and VAT. We only recommend products with dedicated EU storefronts in our EU comparison table to avoid this.',
  },
];

export default function BestNootropicsEUPage() {
  const winner = productsEU.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Nootropics in Europe 2026: EU-Compliant, EUR-Priced, Evidence-Graded',
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab EU' },
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
    name: 'Best Nootropic Supplements Europe 2026',
    itemListElement: productsEU.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://eu.thenootropiclab.com/${p.slug}`,
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
          {new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in Europe 2026:
          <br />
          EU-Compliant, EUR-Priced, Evidence-Graded
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          This page is built specifically for EU buyers. Every product shown has an EU storefront
          (EUR pricing, no import tax) and has been checked against EU Directive 2002/46/EC and
          EFSA health claim Regulation (EC) 1924/2006.
        </p>

        {/* EU regulatory context box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-blue-900 mb-2">EU Regulatory Context</h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            Nootropic supplements are regulated as food supplements in the EU under{' '}
            <strong>Directive 2002/46/EC</strong>. Health claims must comply with{' '}
            <strong>Regulation (EC) 1924/2006</strong> using EFSA-approved claims only. Novel Food
            ingredients require authorisation under <strong>Regulation (EU) 2015/2283</strong>.
            All products rated{' '}
            <span className="eu-badge-green px-1 rounded text-xs font-semibold">EU Compliant</span>{' '}
            in our table use ingredients with established EU food supplement status.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="mb-8">
          <a href="#comparison-table" className="text-green-700 underline text-sm font-medium">
            → Jump to EU comparison table
          </a>
        </div>

        {/* Editor's Choice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — EU 2026</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="eu-badge-green px-2 py-0.5 rounded text-xs font-semibold">
              EU Compliant
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              EUR pricing
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              Ships from EU
            </span>
          </div>
          <a
            href={winner.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Check EU Price (€{winner.priceMonthlyEUR}/mo) →
          </a>
        </div>

        {/* Table */}
        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">EU Nootropic Comparison 2026</h2>
          <p className="text-sm text-gray-500 mb-4">
            Prices in EUR. EU Compliance column: green = fully compliant, amber = EU-reformulated,
            red = verify before ordering.
          </p>
          <ComparisonTable products={productsEU} market="eu" />
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

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">EU Nootropics FAQ</h2>
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
