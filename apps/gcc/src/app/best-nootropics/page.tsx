import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsGCC, getAuthorBySlug, buildPersonAuthorReference } from '@nootropic/data';

const SITE_URL = 'https://gcc.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const EDITORIAL_AUTHOR = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Best Nootropics in the GCC ${CURRENT_YEAR} — Saudi, UAE, Qatar Buyer's Guide`,
  description:
    'Top nootropic supplements for GCC buyers. Caffeine-free options prioritised. Import and VAT notes for Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman.',
  alternates: { canonical: `${SITE_URL}/best-nootropics/` },
};

const faqItems = [
  {
    q: 'Are nootropics legal in Saudi Arabia and the UAE?',
    a: 'Most nootropic supplements are legal to personally import in Saudi Arabia and the UAE as food supplements. However, you must verify with SFDA (Saudi Arabia) or MOHAP (UAE) before ordering. Stimulant-containing supplements may face restrictions. We prioritise caffeine-free, stimulant-free formulations for the GCC.',
  },
  {
    q: 'Do GCC countries charge VAT on imported supplements?',
    a: 'Saudi Arabia charges 15% VAT on most goods including supplements. UAE and Qatar charge 5% VAT. Kuwait has no VAT currently. Bahrain and Oman charge 5% VAT. Import duties are generally 5% for most supplement categories.',
  },
  {
    q: 'Are the supplements listed porcine-free and halal-friendly?',
    a: 'Mind Lab Pro, Performance Lab Mind, and NooCube do not use porcine-derived ingredients. Some products use bovine-sourced phosphatidylserine instead of soy-derived. Always check the full ingredient list on the brand website for halal certification status.',
  },
];

export default function BestNootropicsGCCPage() {
  const winner = productsGCC.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics in the GCC ${CURRENT_YEAR}`,
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(EDITORIAL_AUTHOR, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
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
    name: `Best Nootropic Supplements GCC ${CURRENT_YEAR}`,
    itemListElement: productsGCC.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/${p.slug}/`,
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
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in the GCC {CURRENT_YEAR}
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Evidence-graded reviews for buyers in Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman.
          Caffeine-free options prioritised. VAT and customs notes per country.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-amber-900 mb-2">GCC Import Note</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            Always verify supplement import status with your local authority (SFDA for Saudi Arabia,
            MOHAP for UAE) before ordering. We recommend caffeine-free formulations for GCC buyers.
            UAE (Dubai) is the fastest delivery hub in the region — typically 5–10 business days from UK/US.
          </p>
        </div>

        <AffiliateDisclosure />

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10 mt-6">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice — GCC {CURRENT_YEAR}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-3">{winner.summary}</p>
          {winner.caffeineFree && (
            <div className="mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                Caffeine-Free
              </span>
            </div>
          )}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GCC Nootropic Comparison {CURRENT_YEAR}</h2>
          <ComparisonTable products={productsGCC} market="us" />
        </section>

        {/* Browse by goal */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by goal</h2>
          <p className="text-sm text-gray-500 mb-6">
            Different ingredients suit different cognitive goals. Each picks list ranks the GCC-available products that contain the right ingredient at clinical dose, with halal status and SFDA/MOHAP registration noted.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <a href="/best-nootropics-for-focus/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Focus</div>
              <div className="text-xs text-gray-500">L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC</div>
            </a>
            <a href="/best-nootropics-for-memory/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Memory</div>
              <div className="text-xs text-gray-500">Bacopa Monnieri, Lion&apos;s Mane, phosphatidylserine</div>
            </a>
            <a href="/best-nootropics-for-studying/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Studying</div>
              <div className="text-xs text-gray-500">Sustained focus + memory consolidation; Ramadan-compatible</div>
            </a>
            <a href="/best-nootropics-for-aging/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Aging Brain</div>
              <div className="text-xs text-gray-500">Phosphatidylserine FDA qualified claim, Bacopa, Lion&apos;s Mane</div>
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">GCC Nootropics FAQ</h2>
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
