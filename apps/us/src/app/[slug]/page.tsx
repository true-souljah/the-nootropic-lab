import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AffiliateDisclosure, SchemaOrg, StickyCtaBar } from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return productsUS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productsUS.find(p => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} Review 2026 — Independent Score & Ingredient Audit`,
    description: `Independent review of ${product.name}. Score: ${product.score}/10. Clinical dosing audit, pros and cons, and full affiliate disclosure.`,
  };
}

const pillarLabels: Record<string, string> = {
  ingredients: 'Ingredient quality',
  dosing: 'Dosing vs. clinical evidence',
  transparency: 'Formula transparency',
  value: 'Value for money',
  trust: 'Brand trust',
};

export default async function ProductReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productsUS.find(p => p.slug === slug);
  if (!product) notFound();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: String(product.score), bestRating: '10' },
      author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
      reviewBody: product.summary,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.score),
      bestRating: '10',
      ratingCount: '1',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thenootropiclab.com' },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: 'https://thenootropiclab.com/best-nootropics' },
      { '@type': 'ListItem', position: 3, name: `${product.name} Review` },
    ],
  };

  return (
    <>
      <SchemaOrg schema={productSchema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <StickyCtaBar productName={product.name} affiliateUrl={product.affiliateUrl} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href="/best-nootropics" className="hover:text-green-700">Best Nootropics</a>
          {' / '}
          <span>{product.name} Review</span>
        </nav>

        {/* Author + date */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.editorChoice && (
              <span className="editor-badge">Editor&apos;s Choice 2026</span>
            )}
            <span className="text-xs text-gray-500">{product.brand}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {product.name} Review 2026
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-green-700">{product.score}</span>
            <span className="text-gray-400 text-lg">/10</span>
            <div className="flex gap-1">
              {product.bestFor.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.summary}</p>

        <AffiliateDisclosure />

        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-lg p-4 mb-8 text-sm">
          <div className="font-semibold text-gray-700 mb-2">In this review</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#what-is-it" className="hover:text-green-700">What is {product.name}?</a></li>
            <li><a href="#how-it-works" className="hover:text-green-700">How does it work?</a></li>
            <li><a href="#what-to-expect" className="hover:text-green-700">What to expect</a></li>
            <li><a href="#dosing-audit" className="hover:text-green-700">Clinical Dosing Audit</a></li>
            <li><a href="#score-breakdown" className="hover:text-green-700">Score Breakdown</a></li>
            <li><a href="#pros-cons" className="hover:text-green-700">Pros &amp; Cons</a></li>
            <li><a href="#alternatives" className="hover:text-green-700">Similar Alternatives</a></li>
          </ul>
        </nav>

        {/* Quick specs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8">
          {product.priceMonthlyUSD && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-0.5">Price / month</div>
              <div className="font-bold text-gray-900">${product.priceMonthlyUSD}</div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Capsules / serving</div>
            <div className="font-bold text-gray-900">{product.capsulesPerServing}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Money-back</div>
            <div className="font-bold text-gray-900">{product.moneyBackDays} days</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Trustpilot</div>
            <div className="font-bold text-gray-900">
              {product.trustpilotScore}/5
              <span className="text-xs text-gray-400 font-normal ml-1">
                ({product.trustpilotCount.toLocaleString()})
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Caffeine</div>
            <div className="font-bold text-gray-900">{product.caffeineFree ? 'Free' : 'Contains caffeine'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Servings</div>
            <div className="font-bold text-gray-900">{product.servingsPerContainer}/container</div>
          </div>
        </div>

        {/* What is it / How it works / What to expect */}
        <section className="mb-8 space-y-6">
          <div>
            <h2 id="what-is-it" className="text-xl font-bold text-gray-900 mb-2">What is {product.name}?</h2>
            <p className="text-gray-700 leading-relaxed">{product.whatItIs}</p>
          </div>
          <div>
            <h2 id="how-it-works" className="text-xl font-bold text-gray-900 mb-2">How does it work?</h2>
            <p className="text-gray-700 leading-relaxed">{product.howItWorks}</p>
          </div>
          <div>
            <h2 id="what-to-expect" className="text-xl font-bold text-gray-900 mb-2">What to expect</h2>
            <p className="text-gray-700 leading-relaxed">{product.whatToExpect}</p>
          </div>
        </section>

        {/* Clinical dosing audit */}
        <section className="mb-8">
          <h2 id="dosing-audit" className="text-xl font-bold text-gray-900 mb-4">Clinical Dosing Audit</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Ingredient</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Product dose</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Clinical dose</th>
                  <th className="px-3 py-2 font-semibold text-gray-700 text-center">Adequate</th>
                </tr>
              </thead>
              <tbody>
                {product.ingredientDosages.map((ing, i) => (
                  <tr key={ing.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium">{ing.name}</td>
                    <td className="px-3 py-2 text-gray-700">{ing.doseInProduct}</td>
                    <td className="px-3 py-2 text-gray-700">{ing.clinicalDose}</td>
                    <td className="px-3 py-2 text-center">
                      {ing.adequatelyDosed
                        ? <span className="text-green-600 font-bold">✓</span>
                        : <span className="text-red-500 font-bold">✗</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Score breakdown */}
        <section className="mb-8">
          <h2 id="score-breakdown" className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
          <div className="space-y-3">
            {(Object.entries(product.scoreBreakdown) as [string, number][]).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{pillarLabels[key]}</span>
                  <span className="font-semibold text-gray-900">{val}/10</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${val * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hero ingredients */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Key Ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {product.heroIngredients.map(ing => (
              <span key={ing} className="bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full border border-green-200">
                {ing}
              </span>
            ))}
          </div>
        </section>

        {/* Pros / Cons */}
        <section className="mb-8">
          <h2 id="pros-cons" className="text-xl font-bold text-gray-900 mb-4">Pros &amp; Cons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-3">Pros</h3>
              <ul className="space-y-2">
                {product.pros.map(pro => (
                  <li key={pro} className="flex gap-2 text-sm text-green-800">
                    <span className="shrink-0">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-semibold text-red-900 mb-3">Cons</h3>
              <ul className="space-y-2">
                {product.cons.map(con => (
                  <li key={con} className="flex gap-2 text-sm text-red-800">
                    <span className="shrink-0">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Similar Alternatives */}
        <section id="alternatives" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Alternatives</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {productsUS
              .filter(p => p.slug !== product.slug)
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map(alt => (
                <a
                  key={alt.slug}
                  href={`/${alt.slug}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-gray-900 text-sm mb-1">{alt.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{alt.brand}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-bold text-sm">{alt.score}/10</span>
                    {alt.priceMonthlyUSD && (
                      <span className="text-xs text-gray-500">${alt.priceMonthlyUSD}/mo</span>
                    )}
                  </div>
                </a>
              ))}
          </div>
        </section>

        {/* Explore Ingredients */}
        <section className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold text-green-900 text-sm">Want to understand the ingredients?</div>
              <div className="text-xs text-green-800">Explore our evidence-graded ingredient database with clinical dosing guides.</div>
            </div>
            <a href="/ingredients" className="text-sm font-semibold text-green-700 hover:text-green-600 shrink-0">
              Browse Ingredients →
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Affiliate disclosure: we earn a commission if you purchase via the link below.
            This does not affect our score.
          </p>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg text-base transition-colors"
          >
            {product.priceMonthlyUSD
              ? `Check Current Price ($${product.priceMonthlyUSD}/mo) →`
              : 'Check Current Price →'}
          </a>
        </div>

        <div className="text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            ← Back to Best Nootropics 2026
          </a>
        </div>
      </article>
    </>
  );
}
