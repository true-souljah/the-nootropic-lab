import type { Metadata } from 'next';
import { ComparisonTable, AffiliateDisclosure, StickyCtaBar, SchemaOrg } from '@nootropic/ui';
import { productsUS, buildPersonAuthorReference } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics ${CURRENT_YEAR}: Expert-Tested & Ranked for Focus, Memory and Energy`,
  description: `Independent comparison of the best nootropic supplements in ${CURRENT_YEAR}. Every ingredient audited against clinical trials. Transparent scoring and affiliate disclosure.`,
  alternates: { canonical: `${SITE_URL}/best-nootropics/` },
};

const faqItems = [
  {
    q: `What is the best nootropic supplement in ${CURRENT_YEAR}?`,
    a: `Based on our clinical dosing audit, Mind Lab Pro is the best overall nootropic in ${CURRENT_YEAR}. It contains 11 clinically-backed ingredients at effective doses, is caffeine-free, and ships worldwide.`,
  },
  {
    q: 'Are nootropics safe?',
    a: 'Most mainstream nootropic supplements use food-grade ingredients that are generally safe for healthy adults. Always consult a healthcare professional before starting any supplement.',
  },
  {
    q: 'How long does it take for nootropics to work?',
    a: "Some ingredients like L-theanine have acute effects within 30–60 minutes. Others like Bacopa Monnieri and Lion's Mane require 4–12 weeks of consistent use for measurable cognitive effects.",
  },
];

export default function BestNootropicsUSPage() {
  const winner = productsUS.find(p => p.editorChoice)!;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics ${CURRENT_YEAR}: Expert-Tested & Ranked`,
    datePublished: '2026-01-15',
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, SITE_URL),
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
    name: `Best Nootropic Supplements ${CURRENT_YEAR}`,
    itemListElement: productsUS.map((p, i) => ({
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
          Best Nootropics {CURRENT_YEAR}: Expert-Tested &amp; Ranked for Focus, Memory and Energy
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          We reviewed {productsUS.length} nootropic supplements, auditing every ingredient dose
          against peer-reviewed clinical trials. Below is our ranked comparison with full scoring
          breakdown and subscription transparency ratings.
        </p>

        <AffiliateDisclosure />

        <div className="mb-8">
          <a href="#comparison-table" className="text-green-700 underline text-sm font-medium">
            → Jump to comparison table
          </a>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-10">
          <div className="editor-badge mb-2 inline-block">Editor&apos;s Choice {CURRENT_YEAR}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{winner.summary}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {winner.pros.slice(0, 3).map(pro => (
              <span key={pro} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                ✓ {pro}
              </span>
            ))}
          </div>
          <a
            href={winner.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors"
          >
            Check Current Price (${winner.priceMonthlyUSD}/mo) →
          </a>
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{CURRENT_YEAR} Nootropic Comparison — US</h2>
          <p className="text-sm text-gray-500 mb-4">
            Sort by score, price, money-back guarantee, or Trustpilot rating.
          </p>
          <ComparisonTable products={productsUS} market="us" />
        </section>

        {/* Browse by goal */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by goal</h2>
          <p className="text-sm text-gray-500 mb-6">
            Different ingredients suit different cognitive goals. Each picks list ranks the products in our coverage that contain the right ingredient at clinical dose.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <div className="text-xs text-gray-500">Sustained focus + memory consolidation</div>
            </a>
            <a href="/best-nootropics-for-aging/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Aging Brain</div>
              <div className="text-xs text-gray-500">Phosphatidylserine FDA qualified claim, plus PS, Bacopa, Lion&apos;s Mane</div>
            </a>
            <a href="/best-nootropics-for-adhd/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Nootropics for ADHD-Adjacent Focus</div>
              <div className="text-xs text-gray-500">Honest editorial: NOT a substitute for prescription treatment</div>
            </a>
            <a href="/natural-adderall-alternatives/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Natural Adderall Alternatives</div>
              <div className="text-xs text-gray-500">No supplement is equivalent. What the science actually shows.</div>
            </a>
          </div>
        </section>

        {/* Compare top brands */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare top brands head-to-head</h2>
          <p className="text-sm text-gray-500 mb-6">
            Side-by-side clinical dosing audits + score breakdowns + verdict for the most-asked-about brand pairs.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <a href="/mind-lab-pro-vs-alpha-brain/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Mind Lab Pro vs Alpha Brain</div>
              <div className="text-xs text-gray-500">Open formula vs proprietary blends</div>
            </a>
            <a href="/mind-lab-pro-vs-qualia-mind/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Mind Lab Pro vs Qualia Mind</div>
              <div className="text-xs text-gray-500">11 ingredients vs 28 megadose</div>
            </a>
            <a href="/alpha-brain-vs-qualia-mind/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Alpha Brain vs Qualia Mind</div>
              <div className="text-xs text-gray-500">Mainstream brand vs premium megadose</div>
            </a>
          </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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
