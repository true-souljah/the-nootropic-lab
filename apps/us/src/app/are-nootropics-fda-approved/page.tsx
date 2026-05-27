import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';

const PAGE_URL = `${SITE_URL}/are-nootropics-fda-approved/`;
const auditDateIso = new Date().toISOString().split('T')[0];

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'Are Nootropics FDA Approved? DSHEA Framework, Structure-Function Claims & What FDA Approval Actually Means',
  description:
    'The FDA does not approve dietary supplements before market. Under DSHEA (1994), nootropic supplements operate in a different regulatory category from drugs. Full explainer + audit of every product in our US catalog against the DSHEA structure-function claim framework.',
  alternates: buildAlternates({ regionCode: 'us', path: '/are-nootropics-fda-approved/', availableInRegions: ['us'] }),
  openGraph: buildOpenGraph({ regionCode: 'us', path: '/are-nootropics-fda-approved/', title: 'Are Nootropics FDA Approved? DSHEA Framework, Structure-Function Claims & What FDA Approval Actually Means', description: 'The FDA does not approve dietary supplements before market. Under DSHEA (1994), nootropic supplements operate in a different regulatory category from drugs. Full explainer + audit of every product in our US catalog against the DSHEA structure-function claim framework.' }),
  twitter: buildTwitter({ title: 'Are Nootropics FDA Approved? DSHEA Framework, Structure-Function Claims & What FDA Approval Actually Means', description: 'The FDA does not approve dietary supplements before market. Under DSHEA (1994), nootropic supplements operate in a different regulatory category from drugs. Full explainer + audit of every product in our US catalog against the DSHEA structure-function claim framework.' }),
};

const dsheaCompliantClaims = [
  { claim: 'Supports cognitive function', allowed: true, reason: 'Structure-function claim — describes how the ingredient affects normal body function. Allowed under DSHEA when followed by the FDA disclaimer.' },
  { claim: 'May help maintain focus and concentration', allowed: true, reason: 'Structure-function — "maintain" and "support" language is DSHEA-permitted.' },
  { claim: 'Promotes healthy memory function', allowed: true, reason: 'Structure-function — "healthy" qualifier signals normal-function support, not disease.' },
  { claim: 'Treats Alzheimer\'s disease', allowed: false, reason: 'Disease claim — implies treatment of a recognized medical condition. Triggers FDA drug classification under FDCA Section 201(g).' },
  { claim: 'Prevents dementia', allowed: false, reason: 'Disease claim — implies disease prevention. Drug-class language; would require FDA pre-market approval.' },
  { claim: 'Cures ADHD without prescription', allowed: false, reason: 'Disease + drug-replacement claim — multiple violations of DSHEA structure-function framework.' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Are Nootropics FDA Approved? DSHEA Framework Explained',
  description: 'Explainer of how the FDA regulates nootropic supplements under the Dietary Supplement Health and Education Act of 1994 (DSHEA), with structure-function vs disease-claim taxonomy.',
  datePublished: '2026-05-05',
  dateModified: auditDateIso,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-paragraph', '.faq-question'] },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'DSHEA Structure-Function vs Disease Claim Taxonomy — Nootropic Supplements',
  description: 'Structured taxonomy of supplement claim types permitted under the U.S. Dietary Supplement Health and Education Act of 1994 (DSHEA), with example phrasings and regulatory rationale.',
  url: PAGE_URL,
  keywords: ['DSHEA', 'FDA', 'dietary supplements', 'structure-function claims', 'nootropics', 'NDI notification', 'GMP'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: dsheaCompliantClaims.map(c => ({
    '@type': 'PropertyValue',
    name: c.claim,
    description: c.reason,
    additionalType: c.allowed ? 'DSHEA-permitted' : 'Disease-claim-prohibited',
  })),
  citation: 'Dietary Supplement Health and Education Act of 1994, Pub. L. No. 103-417, 108 Stat. 4325',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Are Nootropics FDA Approved?', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'Does the FDA approve nootropic supplements?', a: 'No. The FDA does not approve dietary supplements before they reach market. Under the Dietary Supplement Health and Education Act of 1994 (DSHEA), supplements are regulated as food, not drugs. Manufacturers are responsible for ensuring their products are safe and properly labelled before selling. The FDA only takes action against unsafe or misbranded products after they enter the market.' },
  { q: 'What does "FDA registered" mean for a supplement?', a: 'A facility may be "FDA registered" — meaning the manufacturing facility is registered with the FDA and subject to GMP inspection under 21 CFR Part 111. This is not the same as FDA approval of the product itself. Many supplement marketing pages conflate the two; we flag this distinction in our reviews.' },
  { q: 'What is a "structure-function" claim?', a: 'A structure-function claim describes how a supplement ingredient affects the normal structure or function of the body, without claiming to diagnose, treat, cure, or prevent disease. Example: "supports cognitive function" is structure-function. "Treats Alzheimer\'s" is a disease claim and is not permitted on supplement labels without FDA drug approval.' },
  { q: 'What is the FDA disclaimer required on supplements?', a: 'Per DSHEA Section 6 and 21 CFR 101.93(c), products making structure-function claims must include the disclaimer: "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease." This disclaimer must appear on labels and in advertising.' },
  { q: 'What is NDI notification?', a: 'New Dietary Ingredient (NDI) notification is a pre-market notification requirement for ingredients introduced to the U.S. supplement market after October 15, 1994. Manufacturers must notify the FDA at least 75 days before marketing the product, providing safety information. The FDA does not "approve" the NDI but may object if safety concerns are raised. Several common nootropic ingredients (citicoline, certain mushroom extracts, novel peptides) have NDI notifications on file.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <span>Are Nootropics FDA Approved?</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Are Nootropics FDA Approved? The DSHEA Framework Explained
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          The short answer is <strong>no</strong>: the U.S. Food and Drug Administration does not approve dietary
          supplements — including nootropics — before they reach market. Under the Dietary Supplement Health and
          Education Act of 1994 (DSHEA), supplements are regulated as a category distinct from drugs. This page
          explains what that means in practice, what claims a supplement may legally make, and how to read the
          regulatory status of any nootropic product before purchasing.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How DSHEA actually works</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            DSHEA established that dietary supplements are regulated under the Federal Food, Drug, and Cosmetic
            Act as a category of food, not as drugs. Three consequences follow:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-2 ml-2">
            <li><strong>No pre-market approval.</strong> Manufacturers are responsible for ensuring safety and accurate labelling before selling. The FDA can act after market entry if a product is shown to be unsafe or misbranded.</li>
            <li><strong>No drug-like claims.</strong> Supplements may make "structure-function" claims describing how an ingredient affects the body, but cannot claim to diagnose, treat, cure, or prevent disease. Disease claims trigger drug classification under FDCA Section 201(g) and require full FDA drug approval.</li>
            <li><strong>GMP requirements apply.</strong> Per 21 CFR Part 111, supplement manufacturing facilities must follow Current Good Manufacturing Practice. Facilities are subject to FDA inspection. "FDA-registered facility" means the facility is registered for inspection — it does not mean the product is FDA-approved.</li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Permitted vs prohibited claims under DSHEA</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Example claim</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Status</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Why</th>
                </tr>
              </thead>
              <tbody>
                {dsheaCompliantClaims.map((c, i) => (
                  <tr key={c.claim} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium italic">"{c.claim}"</td>
                    <td className="px-3 py-2">
                      {c.allowed ? (
                        <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide bg-green-100 text-green-800 px-2 py-0.5 rounded">✓ DSHEA-permitted</span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide bg-red-100 text-red-800 px-2 py-0.5 rounded">✗ Disease claim</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700 leading-relaxed">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-3">The required FDA disclaimer</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Any nootropic supplement making structure-function claims must include the following statement on its
            label and in advertising, per <strong>21 CFR 101.93(c)</strong>:
          </p>
          <blockquote className="text-sm text-amber-900 italic font-medium border-l-4 border-amber-400 bg-white p-3 my-3 leading-relaxed">
            "These statements have not been evaluated by the Food and Drug Administration. This product is not
            intended to diagnose, treat, cure, or prevent any disease."
          </blockquote>
          <p className="text-xs text-gray-600 leading-relaxed">
            We require that disclaimer to appear (in some form) on every supplement we cover for the U.S. market.
            Products without it are flagged in our reviews.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our US catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsUS.length} products</strong> in our U.S. catalog. Each is evaluated against
            DSHEA structure-function claim alignment, GMP-facility status (where verifiable), and NDI notification
            history (where applicable). Our editorial reviews flag products whose marketing language drifts into
            disease-claim territory.
          </p>
          <p className="text-xs text-gray-500 italic">
            Per-product DSHEA-claim audit is part of each review&apos;s 5-pillar transparency pillar; see the methodology page for the full framework.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="faq-question font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <Sources
          defaultOpen
          heading="Regulatory sources"
          sources={[
            { type: 'Regulatory', label: 'Dietary Supplement Health and Education Act of 1994 (DSHEA) — Public Law 103-417', url: 'https://www.fda.gov/regulatory-information/selected-amendments-fdc-act/dietary-supplement-health-and-education-act-1994' },
            { type: 'Regulatory', label: 'FDA — Dietary Supplements Overview', url: 'https://www.fda.gov/food/dietary-supplements' },
            { type: 'Regulatory', label: '21 CFR Part 111 — Current Good Manufacturing Practice for dietary supplements', url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-111' },
            { type: 'Regulatory', label: '21 CFR 101.93 — Structure-function claim labelling requirements', url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-F/section-101.93' },
            { type: 'Regulatory', label: 'FDA — New Dietary Ingredient (NDI) Notification process', url: 'https://www.fda.gov/food/dietary-supplements/new-dietary-ingredients-ndi-notification-process' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health disclaimer</strong>
          {getRegionalHealthDisclaimer('us')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Back to home</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
          {' · '}
          <Link href="/best-nootropics/" className="text-green-700 underline">Best Nootropics</Link>
        </div>
      </article>
    </PublicShell>
  );
}
