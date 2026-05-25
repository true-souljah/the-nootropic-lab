import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources } from '@nootropic/ui';
import { productsAU, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://au.thenootropiclab.com';
const PAGE_URL = `${SITE_URL}/tga-listed-cognitive-supplements/`;
const auditDateIso = new Date().toISOString().split('T')[0];

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: 'TGA-Listed Cognitive Supplements (Australia): AUST L vs AUST R + Permitted Indications Guide',
  description:
    'Therapeutic goods sold in Australia must be entered in the ARTG with an AUST L (listed) or AUST R (registered) number. Full explainer of TGA listing categories, permitted indications, advertising code compliance, and audit of our Australian catalog.',
  alternates: { canonical: PAGE_URL },
};

interface ListingCategory {
  category: string;
  evidenceBar: string;
  permittedIndications: string;
  example: string;
}

const listingCategories: ListingCategory[] = [
  { category: 'AUST L (Listed)', evidenceBar: 'Lower-risk; pre-cleared ingredients only; manufacturer self-certifies efficacy.', permittedIndications: 'Limited to TGA pre-approved Permitted Indications list. Cannot include serious-form indications.', example: 'AUST L 246877 — Blackmores Brain Active (multi-vitamin + Bacopa stack)' },
  { category: 'AUST L(A) (Listed Assessed)', evidenceBar: 'Listed but with TGA assessment of efficacy claims; intermediate evidentiary bar.', permittedIndications: 'May use intermediate-form indications beyond standard AUST L list, subject to assessment.', example: 'Less common; growing category for premium evidence-graded products' },
  { category: 'AUST R (Registered)', evidenceBar: 'Higher-risk products; full TGA evaluation of safety, quality, and efficacy.', permittedIndications: 'Approved indications based on submitted clinical data. May include serious-form indications.', example: 'Less common for cognitive supplements; more typical for prescription-adjacent products' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'TGA-Listed Cognitive Supplements — Australia',
  description: 'Explainer of the Therapeutic Goods Administration\'s ARTG listing framework (AUST L / AUST L(A) / AUST R) for cognitive supplements, with audit of the Australian nootropic catalog.',
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
  name: 'TGA ARTG Listing Categories — Cognitive Supplements (Australia)',
  description: 'Structured taxonomy of Australian Register of Therapeutic Goods listing categories, with evidentiary bars and permitted-indications scope.',
  url: PAGE_URL,
  keywords: ['TGA', 'AUST L', 'AUST R', 'ARTG', 'cognitive supplements', 'permitted indications', 'Therapeutic Goods Advertising Code'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: listingCategories.map(c => ({
    '@type': 'PropertyValue',
    name: c.category,
    description: `${c.evidenceBar} Permitted indications: ${c.permittedIndications}. Example: ${c.example}`,
    additionalType: 'TGA-listing-category',
  })),
  citation: 'Therapeutic Goods Act 1989 (Cth) + Therapeutic Goods Advertising Code 2021',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'TGA-Listed Cognitive Supplements', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'What is an AUST L number?', a: 'An AUST L number is the unique identifier issued by the Therapeutic Goods Administration when a low-risk listed medicine is entered in the Australian Register of Therapeutic Goods (ARTG). The number appears on the product label, typically as "AUST L XXXXXX". Listed medicines use pre-cleared ingredients and the manufacturer self-certifies that efficacy claims are supported.' },
  { q: 'How do I check an AUST L number?', a: 'Search the ARTG public summary on the TGA website. Enter the AUST L number (or product name); if the listing is current you will see the sponsor (the company holding the listing), the medicinal ingredients, the indications, and the listing status. AUST L listings can be cancelled if the TGA finds the product non-compliant — always verify currency before purchase.' },
  { q: 'What is the difference between AUST L and AUST R?', a: 'AUST L (Listed) covers lower-risk medicines with pre-cleared ingredients and manufacturer self-certified efficacy. AUST R (Registered) covers higher-risk medicines that undergo full TGA evaluation of safety, quality, and efficacy data. Most cognitive supplements are AUST L; AUST R is more typical for prescription-adjacent products. AUST L(A) is an intermediate "Listed Assessed" category for products with TGA-assessed efficacy claims beyond standard AUST L scope.' },
  { q: 'What are "permitted indications"?', a: 'Permitted Indications are the specific health claim phrasings the TGA has pre-approved for AUST L medicines. AUST L sponsors may only make claims drawn from this list. For cognitive supplements, permitted indications include phrasings like "supports mental focus", "supports cognitive function", and "may help relieve symptoms of mild stress". Claims outside this list (e.g. "treats Alzheimer\'s") trigger the higher AUST R category and require full registration.' },
  { q: 'What is the Therapeutic Goods Advertising Code?', a: 'The Therapeutic Goods Advertising Code 2021 governs how listed and registered medicines may be advertised to consumers in Australia. It applies to product copy on websites, social media, retail, and editorial content. The Code prohibits claims of cure, comparisons with prescription drugs, testimonials by health professionals, and other restricted forms. We follow the Code on this site and use AUST L permitted-indication language verbatim where applicable.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function Page() {
  return (
    <LegacyShell>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <span>TGA-Listed Cognitive Supplements</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          TGA-Listed Cognitive Supplements (Australia) — AUST L vs AUST R + Permitted Indications
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Therapeutic goods sold in Australia must be entered in the <strong>Australian Register of Therapeutic
          Goods (ARTG)</strong> with an <strong>AUST L</strong> (listed), <strong>AUST L(A)</strong> (listed
          assessed), or <strong>AUST R</strong> (registered) number. Most cognitive supplements are AUST L. This
          page explains what each category means, how to read AUST numbers on labels, and how the Therapeutic
          Goods Advertising Code 2021 governs claim language for cognitive products.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ARTG listing categories</h2>
          <div className="space-y-4">
            {listingCategories.map(c => (
              <div key={c.category} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">{c.category}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>Evidence bar:</strong> {c.evidenceBar}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>Permitted indications:</strong> {c.permittedIndications}</p>
                <p className="text-xs text-gray-500"><strong>Example:</strong> {c.example}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">How to verify an AUST number</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 leading-relaxed space-y-2">
            <li>Locate the AUST L / AUST L(A) / AUST R number on the product label.</li>
            <li>Open the <a href="https://www.tga.gov.au/resources/artg" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">ARTG public summary search</a>.</li>
            <li>Enter the AUST number; verify sponsor name matches the brand, medicinal ingredients match the label, listing status is "active".</li>
            <li>If the listing is "cancelled" or details do not match, do not purchase.</li>
          </ol>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our Australian catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsAU.length} products</strong> in our Australian catalog. Products are a mix
            of TGA-listed Australian-domiciled brands (Blackmores, Nature&apos;s Own, Swisse) and U.S.-domiciled
            brands available via cross-border channels (iHerb AU warehouse, Amazon AU). Our reviews note the
            AUST number where visible on product labelling. Per-product AUST L surfacing is on our 2026 roadmap.
          </p>
          <p className="text-xs text-gray-500 italic">
            Until per-product AUST surfacing ships, verify each AUST L claim directly via the ARTG link above
            before purchasing.
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
            { type: 'Regulatory', label: 'Therapeutic Goods Act 1989 (Cth)', url: 'https://www.legislation.gov.au/C2004A03952/latest/text' },
            { type: 'Regulatory', label: 'Therapeutic Goods Administration', url: 'https://www.tga.gov.au/' },
            { type: 'Regulatory', label: 'Australian Register of Therapeutic Goods (ARTG) public summary search', url: 'https://www.tga.gov.au/resources/artg' },
            { type: 'Regulatory', label: 'Therapeutic Goods Advertising Code (No.2) 2021', url: 'https://www.legislation.gov.au/F2021L01514/latest/text' },
            { type: 'Regulatory', label: 'TGA — Permitted Indications for listed medicines', url: 'https://www.tga.gov.au/resources/resource/guidance/permissible-indications-listed-medicines' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('au')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Back to home</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </LegacyShell>
  );
}
