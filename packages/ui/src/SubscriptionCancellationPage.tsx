import Link from 'next/link';
import type { Author } from '@nootropic/data';
import { buildPersonAuthorReference } from '@nootropic/data';
import SchemaOrg from './SchemaOrg';

export interface CancellationStep {
  /** Short title shown in the step header */
  title: string;
  /** Detailed instruction body */
  body: string;
  /** Optional URL the user needs to visit for this step */
  linkUrl?: string;
  linkLabel?: string;
}

export interface CancellationFAQ {
  q: string;
  a: string;
}

interface Props {
  /** Brand display name, e.g. "Onnit" */
  brandName: string;
  /** Product slug in the products array, e.g. "onnit-alpha-brain-review" — used for review cross-link */
  productReviewSlug?: string;
  /** URL slug for this cancellation page, e.g. "cancel-onnit-subscription" (no leading slash) */
  pageSlug: string;
  /** Site URL (no trailing slash) */
  siteUrl: string;
  /** Editorial author */
  author: Author;
  /** SEO title */
  pageTitle: string;
  /** SEO description */
  pageDescription: string;
  /** Hero paragraph at top — context on why people are cancelling, brand-specific friction */
  heroParagraph: string;
  /** Numbered steps to actually cancel */
  steps: CancellationStep[];
  /** Estimated total time in minutes for the full cancellation flow */
  totalTimeMinutes: number;
  /** Common gotchas / what to watch for */
  watchouts: string[];
  /** Brand-specific FAQs */
  faqItems: CancellationFAQ[];
  /** Optional FTC complaint URL or escalation path */
  ftcComplaintNote?: string;
}

export default function SubscriptionCancellationPage({
  brandName,
  productReviewSlug,
  pageSlug,
  siteUrl,
  author,
  pageTitle,
  pageDescription,
  heroParagraph,
  steps,
  totalTimeMinutes,
  watchouts,
  faqItems,
  ftcComplaintNote,
}: Props) {
  const currentYear = new Date().getFullYear();
  const pageUrl = `${siteUrl}/${pageSlug}/`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: pageTitle,
    description: pageDescription,
    totalTime: `PT${totalTimeMinutes}M`,
    author: buildPersonAuthorReference(author, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.body,
      ...(s.linkUrl && { url: s.linkUrl }),
    })),
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: `${siteUrl}/best-nootropics/` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: pageUrl },
    ],
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href="/best-nootropics/" className="hover:text-green-700">Best Nootropics</a>
          {' / '}
          <span>How to cancel {brandName}</span>
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

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{pageTitle}</h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{heroParagraph}</p>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Total time</div>
            <div className="font-bold text-gray-900">~{totalTimeMinutes} min</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Steps</div>
            <div className="font-bold text-gray-900">{steps.length}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">FTC Click-to-Cancel</div>
            <div className="font-bold text-green-700">Required since 2024</div>
          </div>
        </div>

        {/* FTC framing */}
        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-8 text-sm text-amber-900">
          <strong className="block mb-1">FTC Click-to-Cancel rule</strong>
          As of 2024, the Federal Trade Commission requires subscription cancellation to be at least as easy as
          signup. If you encounter friction below — forced phone calls, hidden cancel links, retention pop-ups
          designed to confuse — you can file a complaint at{' '}
          <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="underline">
            reportfraud.ftc.gov
          </a>.
        </aside>

        {/* Steps */}
        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to cancel — step by step</h2>
          <ol className="space-y-6">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-green-700 text-white font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{step.body}</p>
                  {step.linkUrl && (
                    <a
                      href={step.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm text-green-700 underline font-medium"
                    >
                      {step.linkLabel || 'Open link'} →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Watchouts */}
        <section className="my-10 bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="text-xl font-bold text-red-900 mb-3">Watch out for</h2>
          <ul className="space-y-2">
            {watchouts.map(item => (
              <li key={item} className="flex gap-2 text-sm text-red-800">
                <span className="shrink-0">⚠</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {ftcComplaintNote && (
          <section className="my-10 bg-gray-50 rounded-xl p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-2">If cancellation fails</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{ftcComplaintNote}</p>
          </section>
        )}

        {/* FAQ */}
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

        {/* Editorial framing + cross-links */}
        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-2">
            Why we publish cancellation guides
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Subscription transparency is the 5th pillar of our scoring methodology. Brands that make
            cancellation hard get penalised in our reviews — and we publish the cancellation steps so the
            friction can&apos;t be hidden. Read{' '}
            <Link href="/methodology/" className="text-green-700 underline">our full methodology</Link>.
          </p>
          {productReviewSlug && (
            <Link
              href={`/${productReviewSlug}/`}
              className="text-sm font-semibold text-green-700 underline"
            >
              Read our full {brandName} review →
            </Link>
          )}
        </section>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/best-nootropics/" className="text-green-700 underline">
            ← Back to Best Nootropics {currentYear}
          </Link>
        </div>
      </article>
    </>
  );
}
