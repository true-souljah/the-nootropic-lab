import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { euCountries, productsEU } from '@nootropic/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return euCountries.map(c => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = euCountries.find(x => x.slug === country);
  if (!c) return {};
  return {
    title: `Best Nootropics in ${c.name} 2026 — EU Buyer's Guide`,
    description: `Buy nootropics in ${c.name}: EU-compliant products, EUR pricing, regulatory notes, and shipping info for ${c.name} residents.`,
  };
}

const topProducts = productsEU
  .slice()
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = euCountries.find(x => x.slug === country);
  if (!c) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics in ${c.name} 2026`,
    description: `Guide to buying nootropics in ${c.name}. EU compliance, EUR pricing, and top-rated stacks.`,
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eu.thenootropiclab.com' },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics EU', item: 'https://eu.thenootropiclab.com/best-nootropics' },
      { '@type': 'ListItem', position: 3, name: `Best Nootropics in ${c.name}` },
    ],
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href="/best-nootropics" className="hover:text-green-700">Best Nootropics EU</a>
          {' / '}
          <span>{c.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Best Nootropics in {c.name} 2026
        </h1>
        <p className="text-sm text-gray-500 mb-8">{c.nativeName} &nbsp;·&nbsp; Currency: {c.currency}</p>

        {/* Regulatory note */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Regulatory Framework</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-900 leading-relaxed text-sm">{c.regulatoryNote}</p>
          </div>
        </section>

        {/* Shipping note */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Buying &amp; Shipping to {c.name}
          </h2>
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-700 leading-relaxed text-sm">{c.shippingNote}</p>
            {c.currency !== 'EUR' && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Currency note:</strong> Products are priced in EUR on EU storefronts.
                  Your bank or payment provider will convert to {c.currency} at checkout.
                  Check current exchange rates before ordering.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Top picks */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Picks for {c.name} Buyers
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            All products below have EU storefronts and ship to {c.name}. Scores are from our
            independent editorial review.
          </p>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <a
                key={p.slug}
                href={`/${p.slug}`}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all"
              >
                <span className="text-2xl font-black text-gray-300 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    {p.editorChoice && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Editor&apos;s Choice
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.summary}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Score: <strong className="text-green-700">{p.score}/10</strong></span>
                    {p.priceMonthlyEUR && <span>€{p.priceMonthlyEUR}/mo</span>}
                    <span>{p.euStorefront ? '✓ EU storefront' : 'Ships to EU'}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-gray-900 mb-2">Full EU Comparison</h2>
          <p className="text-sm text-gray-600 mb-3">
            See all 6 EU-reviewed nootropic stacks ranked and compared side by side.
          </p>
          <a
            href="/nootropic-comparison"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
          >
            View Full Comparison →
          </a>
        </div>

        <div className="text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            ← Back to Best Nootropics EU 2026
          </a>
        </div>
      </article>
    </>
  );
}
