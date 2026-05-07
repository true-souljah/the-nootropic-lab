import Link from 'next/link';
import SchemaOrg from './SchemaOrg';

interface Props {
  /** Site root URL, no trailing slash, e.g. https://thenootropiclab.com */
  siteUrl: string;
  /** Region label shown in the page heading (e.g. "Global", "European Union", "Saudi Arabia + GCC") */
  marketLabel: string;
  /** Contact email displayed and used for inquiries */
  contactEmail: string;
  /** Optional region-specific notes — e.g. EU pages can reference TMG §5; CA pages can reference CASL */
  regionNote?: string;
}

/**
 * Anonymity-preserving Imprint / "About the publisher" page.
 *
 * Per the 2026-05-04 author rollback, the site does not disclose a named legal
 * operator. This page exists to satisfy reader and regulator expectations for
 * a contactable publisher, in particular EU's Impressumspflicht (TMG §5
 * equivalent). All copy is editorial-entity scoped and contains no Person
 * references.
 */
export default function ImprintPage({ siteUrl, marketLabel, contactEmail, regionNote }: Props) {
  const pageUrl = `${siteUrl}/imprint/`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: pageUrl,
    name: 'Imprint — The Nootropic Lab',
    publisher: {
      '@type': 'Organization',
      name: 'The Nootropic Lab',
      url: siteUrl,
      email: contactEmail,
    },
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Imprint</h1>
        <p className="text-sm text-gray-500 mb-8">
          Information about the publisher of this site — {marketLabel}.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Publisher</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>The Nootropic Lab Editorial Team</strong>
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            The Nootropic Lab is an independent editorial publication that reviews cognitive supplements
            using a transparent five-pillar methodology. We operate as an editorial collective and do not
            disclose individual contributors by name. Reviews are produced collaboratively by editors with
            backgrounds in pharmacology, evidence synthesis, and consumer-product analysis.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We do not accept payment for reviews, do not feature sponsored placements, and disclose every
            commercial relationship via our affiliate-link policy. See our{' '}
            <Link href="/methodology/" className="text-green-700 underline">methodology</Link> for the full
            scoring framework.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Editorial corrections, regulatory inquiries, partnership requests:
          </p>
          <p className="text-gray-700 leading-relaxed">
            <a href={`mailto:${contactEmail}`} className="text-green-700 underline font-medium">
              {contactEmail}
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            We aim to respond to substantive editorial corrections within 5 business days and to update or
            retract incorrect content within 10 business days of verification.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Editorial standards</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
            <li>Every product review applies the same five-pillar scoring framework.</li>
            <li>Ingredient doses are evaluated against minimum effective doses from peer-reviewed human clinical trials (PubMed-indexed).</li>
            <li>Affiliate disclosure renders at the top of every commercial page, before the first call-to-action.</li>
            <li>Catalog products (entries based on public product information) and hands-on tested products are visually distinguished by a badge.</li>
            <li>Region-specific regulatory disclaimers are surfaced on every commercial page (DSHEA, EFSA, TGA, NPN, FFC, ANMAT, SFDA, BPJPH/JAKIM, etc.).</li>
            <li>Errors are corrected promptly and transparently. We never delete or quietly edit factual claims after publication.</li>
          </ul>
        </section>

        {regionNote && (
          <section className="mb-10 bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-gray-900 mb-2">Regional note</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{regionNote}</p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Affiliate relationships</h2>
          <p className="text-gray-700 leading-relaxed">
            This site contains affiliate links. When a reader clicks through and purchases, we may receive a
            commission at no additional cost to the reader. Affiliate relationships do not influence
            editorial scores or ranking position. Read the full disclosure on each commercial page or in our{' '}
            <Link href="/cookie-policy/" className="text-green-700 underline">cookie policy</Link>.
          </p>
        </section>

        <p className="text-xs text-gray-500 mt-12">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </article>
    </>
  );
}
