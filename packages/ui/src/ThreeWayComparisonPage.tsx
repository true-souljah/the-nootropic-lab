import Link from 'next/link';
import type { Product, Author } from '@nootropic/data';
import { buildPersonAuthorReference } from '@nootropic/data';
import AffiliateDisclosure from './AffiliateDisclosure';
import SchemaOrg from './SchemaOrg';

export interface ThreeWayFAQ {
  q: string;
  a: string;
}

interface Props {
  productA: Product;
  productB: Product;
  productC: Product;
  siteUrl: string;
  author: Author;
  /** Optional override of the auto-computed verdict */
  verdictParagraph?: string;
  faqItems: ThreeWayFAQ[];
  /** "Choose A if you..." bullets */
  whoIsForA: string[];
  whoIsForB: string[];
  whoIsForC: string[];
  listicleHref?: string;
  formatPrice?: (product: Product) => string;
}

function defaultPriceFormat(p: Product) {
  if (p.priceMonthlyUSD) return `$${p.priceMonthlyUSD}`;
  if (p.priceMonthlyEUR) return `€${p.priceMonthlyEUR}`;
  if (p.priceMonthlyCAD) return `C$${p.priceMonthlyCAD}`;
  if (p.priceMonthlyAUD) return `A$${p.priceMonthlyAUD}`;
  if (p.priceMonthlyJPY) return `¥${p.priceMonthlyJPY.toLocaleString()}`;
  return 'Varies';
}

export default function ThreeWayComparisonPage({
  productA,
  productB,
  productC,
  siteUrl,
  author,
  verdictParagraph,
  faqItems,
  whoIsForA,
  whoIsForB,
  whoIsForC,
  listicleHref = '/best-nootropics',
  formatPrice = defaultPriceFormat,
}: Props) {
  const currentYear = new Date().getFullYear();
  const products = [productA, productB, productC];
  const winner = products.reduce((best, p) => (p.score > best.score ? p : best), products[0]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${productA.name} vs ${productB.name} vs ${productC.name} ${currentYear}: 3-Way Clinical Dosing Audit`,
    datePublished: `${currentYear}-04-30`,
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(author, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
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
    name: `${productA.name} vs ${productB.name} vs ${productC.name} 3-way comparison`,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${siteUrl}/${p.slug}/`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: `${siteUrl}${listicleHref}/` },
      { '@type': 'ListItem', position: 3, name: `${productA.name} vs ${productB.name} vs ${productC.name}` },
    ],
  };

  // Build a 3-way unified ingredient table
  type Row = {
    name: string;
    aDose: string | null;
    aAdequate: boolean | null;
    bDose: string | null;
    bAdequate: boolean | null;
    cDose: string | null;
    cAdequate: boolean | null;
    clinicalDose: string;
  };
  const allIngredients = new Map<string, Row>();
  const seed = (key: 'a' | 'b' | 'c', product: Product) => {
    for (const ing of product.ingredientDosages) {
      let row = allIngredients.get(ing.name);
      if (!row) {
        row = {
          name: ing.name,
          aDose: null,
          aAdequate: null,
          bDose: null,
          bAdequate: null,
          cDose: null,
          cAdequate: null,
          clinicalDose: ing.clinicalDose,
        };
        allIngredients.set(ing.name, row);
      }
      if (key === 'a') {
        row.aDose = ing.doseInProduct;
        row.aAdequate = ing.adequatelyDosed;
      } else if (key === 'b') {
        row.bDose = ing.doseInProduct;
        row.bAdequate = ing.adequatelyDosed;
      } else {
        row.cDose = ing.doseInProduct;
        row.cAdequate = ing.adequatelyDosed;
      }
    }
  };
  seed('a', productA);
  seed('b', productB);
  seed('c', productC);
  const ingredientRows = Array.from(allIngredients.values());

  const computedVerdict = verdictParagraph ??
    `${winner.name} earns the highest score (${winner.score}/10) of the three. ` +
    'See the dosing audit + score breakdown below for the full reasoning.';

  const renderDose = (dose: string | null, adequate: boolean | null) =>
    dose ? (
      <>
        {dose}{' '}
        {adequate ? (
          <span className="text-green-600 font-bold">✓</span>
        ) : (
          <span className="text-red-500 font-bold">✗</span>
        )}
      </>
    ) : (
      <span className="text-gray-400">—</span>
    );

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href={`${listicleHref}/`} className="hover:text-green-700">Best Nootropics</a>
          {' / '}
          <span>{productA.name} vs {productB.name} vs {productC.name}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>
            Reviewed by{' '}
            <Link href={`/authors/${author.slug}/`} className="text-gray-700 hover:text-green-700 underline">
              <strong>{author.name}</strong>
            </Link>
          </span>
          <span>·</span>
          <span>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {productA.name} vs {productB.name} vs {productC.name}
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Three-way clinical-dose comparison using the same 5-pillar methodology applied to every review on this site.
        </p>

        <AffiliateDisclosure />

        <section className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 my-8">
          <div className="editor-badge mb-2 inline-block">Verdict</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{winner.name} wins on score</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{computedVerdict}</p>
          <div className="flex gap-2 flex-wrap">
            {products.map((p, i) => (
              <a
                key={p.slug}
                href={p.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className={`text-sm font-bold px-4 py-2 rounded-lg ${
                  p === winner
                    ? 'bg-green-700 hover:bg-green-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300'
                }`}
              >
                Check {p.name} ({formatPrice(p)}/mo) →
              </a>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick specs three-way</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Spec</th>
                  {products.map(p => (
                    <th key={p.slug} className="px-3 py-2 font-semibold text-gray-700">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Score</td>
                  {products.map(p => (
                    <td key={p.slug} className="px-3 py-2 font-bold text-green-700">{p.score}/10</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Price / month</td>
                  {products.map(p => (
                    <td key={p.slug} className="px-3 py-2 text-gray-700">{formatPrice(p)}</td>
                  ))}
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Caffeine-free</td>
                  {products.map(p => (
                    <td key={p.slug} className="px-3 py-2 text-gray-700">{p.caffeineFree ? 'Yes' : 'No'}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Capsules / serving</td>
                  {products.map(p => (
                    <td key={p.slug} className="px-3 py-2 text-gray-700">{p.capsulesPerServing}</td>
                  ))}
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Money-back</td>
                  {products.map(p => (
                    <td key={p.slug} className="px-3 py-2 text-gray-700">{p.moneyBackDays} days</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Trustpilot</td>
                  {products.map(p => (
                    <td key={p.slug} className="px-3 py-2 text-gray-700">
                      {p.trustpilotScore
                        ? `${p.trustpilotScore}/5 (${p.trustpilotCount?.toLocaleString() ?? 'n/a'})`
                        : 'Not tracked'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Clinical dosing audit</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Each disclosed ingredient dose vs. minimum effective dose. Ingredients hidden inside proprietary blends
            cannot be evaluated.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Ingredient</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Clinical dose</th>
                  {products.map(p => (
                    <th key={p.slug} className="px-3 py-2 font-semibold text-gray-700">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ingredientRows.map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium">{row.name}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{row.clinicalDose}</td>
                    <td className="px-3 py-2 text-gray-700">{renderDose(row.aDose, row.aAdequate)}</td>
                    <td className="px-3 py-2 text-gray-700">{renderDose(row.bDose, row.bAdequate)}</td>
                    <td className="px-3 py-2 text-gray-700">{renderDose(row.cDose, row.cAdequate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            Clinical-dose anchors sourced from PubMed-indexed human RCTs and Examine.com syntheses. See our{' '}
            <Link href="/methodology/" className="text-green-700 underline">methodology</Link>.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Score breakdown across 5 pillars</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id}>
                <div className="font-bold text-gray-900 mb-3">{p.name} — {p.score}/10</div>
                <div className="space-y-2 text-sm">
                  {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between mb-1 text-gray-700 text-xs">
                        <span className="capitalize">{k}</span>
                        <span className="font-semibold">{v}/10</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${v * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who is each one for?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { p: productA, who: whoIsForA },
              { p: productB, who: whoIsForB },
              { p: productC, who: whoIsForC },
            ].map(({ p, who }) => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">Choose {p.name} if you...</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {who.map(line => <li key={line}>· {line}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Read the individual reviews</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {products.map(p => (
              <Link
                key={p.slug}
                href={`/${p.slug}/`}
                className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm mb-1">{p.name} review</div>
                <div className="text-xs text-gray-500">Score: {p.score}/10 · Full clinical dosing audit</div>
              </Link>
            ))}
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-10">
          <Link href={`${listicleHref}/`} className="text-green-700 underline">
            ← Back to Best Nootropics {currentYear}
          </Link>
        </div>
      </article>
    </>
  );
}
