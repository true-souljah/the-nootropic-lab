import Link from 'next/link';
import type { Product, Author } from '@nootropic/data';
import { buildPersonAuthorReference } from '@nootropic/data';
import AffiliateDisclosure from './AffiliateDisclosure';
import SchemaOrg from './SchemaOrg';
import { useCaseListPageEnDefaults, tpl } from './templateStrings';
import type { UseCaseListPageStrings } from './templateStrings';

export interface UseCaseFAQ {
  q: string;
  a: string;
}

export interface IngredientMechanism {
  /** Ingredient (or pairing) name */
  name: string;
  /** What the evidence shows for this use case */
  evidence: string;
  /** Citation URL — preferably PubMed or Examine.com */
  citationUrl?: string;
}

export interface UseCasePick {
  product: Product;
  /** Why this product specifically is on the list for this use case */
  whyItsHere: string;
  /** Optional override of position; otherwise array order is used */
  rank?: number;
}

interface Props {
  /** Slug fragment used in URL, e.g. "focus" or "adhd" */
  useCase: string;
  /** H1 / page title without site suffix, e.g. "Best Nootropics for Focus" */
  pageTitle: string;
  /** Meta description */
  pageDescription: string;
  /** Hero paragraph shown above AffiliateDisclosure */
  heroParagraph: string;
  /** Ingredient-mechanism brief — explains which ingredients matter for this use case */
  ingredientMechanism: IngredientMechanism[];
  /** Ordered product picks specific to this use case */
  picks: UseCasePick[];
  /** FAQ items at bottom */
  faqItems: UseCaseFAQ[];
  /** Site URL, e.g. https://thenootropiclab.com (no trailing slash) */
  siteUrl: string;
  /** Editorial author */
  author?: Author;
  /** Optional medical reviewer for YMYL credibility */
  reviewedBy?: { name: string; sameAs?: string[] };
  /** Optional YMYL health disclaimer override; defaults to a generic supplement disclaimer */
  healthDisclaimer?: string;
  /** Where the listicle parent lives, defaults to /best-nootropics */
  listicleHref?: string;
  /** Optional locale-specific overrides for chrome strings (English defaults are used otherwise) */
  strings?: Partial<UseCaseListPageStrings>;
}

export default function UseCaseListPage({
  useCase,
  pageTitle,
  pageDescription,
  heroParagraph,
  ingredientMechanism,
  picks,
  faqItems,
  siteUrl,
  reviewedBy,
  healthDisclaimer,
  listicleHref = '/best-nootropics',
  strings,
}: Props) {
  const s: UseCaseListPageStrings = { ...useCaseListPageEnDefaults, ...strings };
  const currentYear = new Date().getFullYear();
  const slugUrl = `${siteUrl}/best-nootropics-for-${useCase}/`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${pageTitle} ${currentYear}`,
    description: pageDescription,
    datePublished: `${currentYear}-04-30`,
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    ...(reviewedBy && {
      reviewedBy: {
        '@type': 'Person',
        name: reviewedBy.name,
        ...(reviewedBy.sameAs && { sameAs: reviewedBy.sameAs }),
      },
    }),
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
    name: `${pageTitle} ${currentYear}`,
    numberOfItems: picks.length,
    itemListElement: picks.map((p, i) => ({
      '@type': 'ListItem',
      position: p.rank ?? i + 1,
      name: p.product.name,
      url: `${siteUrl}/${p.product.slug}/`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: `${siteUrl}${listicleHref}/` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: slugUrl },
    ],
  };

  const sortedPicks = [...picks].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">{s.home}</a>
          {' / '}
          <a href={`${listicleHref}/`} className="hover:text-green-700">{s.bestNootropics}</a>
          {' / '}
          <span>{pageTitle}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>
            {s.reviewedBy}{' '}
            <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong>
          </span>
          {reviewedBy && (
            <>
              <span>·</span>
              <span>{s.medicallyReviewedBy} <strong className="text-gray-700">{reviewedBy.name}</strong></span>
            </>
          )}
          <span>·</span>
          <span>
            {s.lastUpdated}{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {pageTitle} {currentYear}
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{heroParagraph}</p>

        {/* Health disclaimer — first, prominent */}
        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-6 text-sm text-amber-900">
          <strong className="block mb-1">{s.healthDisclaimer}</strong>
          {healthDisclaimer || s.defaultHealthDisclaimer}
        </aside>

        <AffiliateDisclosure />

        {/* What the evidence says */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{s.whatEvidenceSays}</h2>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">{s.evidenceIntro}</p>
          <div className="space-y-4">
            {ingredientMechanism.map(item => (
              <div key={item.name} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{item.evidence}</p>
                {item.citationUrl && (
                  <a
                    href={item.citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-green-700 underline"
                  >
                    {s.sourceLink}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Picks */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{s.ourPicksFor} {useCase}</h2>
          <p className="text-sm text-gray-500 mb-6">{s.picksIntro}</p>

          <div className="space-y-6">
            {sortedPicks.map((pick, i) => (
              <article
                key={pick.product.slug}
                className={`border rounded-xl p-6 ${i === 0 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-3xl font-black text-gray-300 leading-none shrink-0">#{pick.rank ?? i + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {i === 0 && <span className="editor-badge">{s.topPick}</span>}
                      <span className="text-xs text-gray-500">{pick.product.brand}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pick.product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-green-700">{pick.product.score}</span>
                      <span className="text-gray-400">/10</span>
                      {pick.product.priceMonthlyUSD && (
                        <span className="text-sm text-gray-500 ml-2">${pick.product.priceMonthlyUSD}/mo</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  <strong className="text-gray-900">{s.whyItsHere}</strong> {pick.whyItsHere}
                </p>

                <div className="flex gap-3 flex-wrap">
                  <a
                    href={pick.product.affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-5 py-2 rounded-lg"
                  >
                    {tpl(s.checkProduct, { name: pick.product.name })}
                  </a>
                  <Link
                    href={`/${pick.product.slug}/`}
                    className="bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold px-5 py-2 rounded-lg border border-gray-300"
                  >
                    {s.readFullReview}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.faqHeading}</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology + back link */}
        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-2">{s.howWeChoose}</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {s.howWeChooseBody}{' '}
            <Link href="/methodology/" className="text-green-700 underline">{s.fullMethodology}</Link>.
          </p>
          <Link href={`${listicleHref}/`} className="text-green-700 underline text-sm font-medium">
            {tpl(s.backToBest, { year: currentYear })}
          </Link>
        </section>
      </article>
    </>
  );
}
