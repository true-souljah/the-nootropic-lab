import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell} from '@nootropic/ui';
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';

const SITE_URL = 'https://ca.thenootropiclab.com';
const PAGE_URL = `${SITE_URL}/npn-licensed-nootropics-canada/`;
const auditDateIso = new Date().toISOString().split('T')[0];


export const metadata: Metadata = {
  title: 'NPN-Licensed Nootropics in Canada: Health Canada NHP Framework + Verification Guide',
  description:
    'Natural Health Products in Canada must hold an NPN (Natural Product Number) issued by Health Canada to be legally sold. Full explainer of NHP regulations, NPN verification process, and audit of nootropic products in our Canadian catalog.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/npn-licensed-nootropics-canada/', availableInRegions: ['ca'] }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: '/npn-licensed-nootropics-canada/', title: 'NPN-Licensed Nootropics in Canada: Health Canada NHP Framework + Verification Guide', description: 'Natural Health Products in Canada must hold an NPN (Natural Product Number) issued by Health Canada to be legally sold. Full explainer of NHP regulations, NPN verification process, and audit of nootropic products in our Canadian catalog.' }),
  twitter: buildTwitter({ title: 'NPN-Licensed Nootropics in Canada: Health Canada NHP Framework + Verification Guide', description: 'Natural Health Products in Canada must hold an NPN (Natural Product Number) issued by Health Canada to be legally sold. Full explainer of NHP regulations, NPN verification process, and audit of nootropic products in our Canadian catalog.' }),
};

interface NhpEvidenceCategory {
  category: string;
  description: string;
  example: string;
}

const nhpEvidenceCategories: NhpEvidenceCategory[] = [
  { category: 'Category I — Compendial monograph', description: 'Product matches an existing Health Canada Natural Health Products Ingredient Database (NHPID) monograph. Lowest evidentiary burden — pre-cleared ingredients at standard doses.', example: 'Ginkgo biloba 120 mg standardised extract for cognitive support' },
  { category: 'Category II — Traditional use', description: 'Product supported by published evidence of traditional use within a recognised herbal tradition (e.g. Traditional Chinese Medicine, Ayurveda) for the proposed indication.', example: 'Bacopa monnieri standardised extract for memory support, citing Ayurvedic traditional use' },
  { category: 'Category III — Modern scientific evidence', description: 'Product supported by published peer-reviewed clinical trials (RCTs, meta-analyses) demonstrating efficacy at the proposed dose for the proposed indication.', example: 'Citicoline 250 mg/day for attention based on RCT evidence' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'NPN-Licensed Nootropics in Canada — Health Canada NHP Framework',
  description: 'Explainer of the Natural Health Products Regulations and NPN licensing in Canada, with audit of the Canadian nootropic catalog.',
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
  name: 'Health Canada NHP Evidence Categories — Nootropic Supplements',
  description: 'Structured taxonomy of evidence categories accepted by Health Canada under the Natural Health Products Regulations, with worked examples for cognitive supplements.',
  url: PAGE_URL,
  keywords: ['Health Canada', 'NPN', 'Natural Health Products', 'NHPR', 'cognitive supplements', 'NHPID', 'evidence category'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: nhpEvidenceCategories.map(c => ({
    '@type': 'PropertyValue',
    name: c.category,
    description: `${c.description} Example: ${c.example}`,
    additionalType: 'NHP-evidence-category',
  })),
  citation: 'Natural Health Products Regulations (SOR/2003-196) under the Food and Drugs Act',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'NPN-Licensed Nootropics', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'What is an NPN?', a: 'A Natural Product Number (NPN) is the eight-digit identifier Health Canada issues to natural health products that have been assessed for safety, efficacy, and quality under the Natural Health Products Regulations. Products with an NPN can be legally sold in Canada and have passed pre-market review. The number appears on the product label, typically near the medicinal-ingredient declaration.' },
  { q: 'How do I verify an NPN?', a: 'Search the Licensed Natural Health Products Database (LNHPD) on the Health Canada website. Enter the eight-digit NPN; if the product is currently licensed, you will see the licence holder, product name, recommended use, dose, and approved medicinal ingredients. Always verify NPN before purchasing premium-priced products — counterfeit NPNs occasionally appear on grey-market listings.' },
  { q: 'Is a product without an NPN illegal in Canada?', a: 'For products marketed and sold in Canada as natural health products, yes — selling without an NPN is non-compliant with the Natural Health Products Regulations. Products imported through cross-border channels (Amazon US shipping to Canada, iHerb cross-border, direct-to-consumer US brands) may not hold an NPN. They are not necessarily unsafe, but they have not been pre-market reviewed by Health Canada. Personal-use importation is permitted in limited quantities.' },
  { q: 'Are all NPN-licensed products equally evidence-backed?', a: 'No. Health Canada accepts three evidence categories: compendial monograph, traditional use, and modern scientific evidence. A product with NPN status under "traditional use" has met a different evidentiary bar than one cleared under "modern scientific evidence". Our reviews note the evidence basis for the cognitive claim where this can be inferred from the product\'s authorised statements.' },
  { q: 'Can I import US nootropics for personal use?', a: 'Health Canada permits personal importation of small quantities of natural health products from the U.S. for personal use, subject to limits (typically a 90-day supply). Customs may detain shipments containing controlled substances or ingredients prohibited in Canada. Cross-border purchases from major retailers (iHerb, Amazon US) generally clear customs without issue, but the imported product is not Health Canada licensed and any safety claims should be evaluated independently.' },
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
          <span>NPN-Licensed Nootropics</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          NPN-Licensed Nootropics in Canada — Health Canada NHP Framework
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Natural health products sold in Canada must hold a <strong>Natural Product Number (NPN)</strong> issued
          by Health Canada under the Natural Health Products Regulations (SOR/2003-196). NPN licensing means the
          product has been pre-market assessed for safety, efficacy, and quality. This page explains what NPN
          status actually verifies, how to look up any NPN in the Health Canada database, and how to interpret
          the difference between NPN-licensed products and cross-border imports.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What an NPN actually verifies</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Health Canada&apos;s NPN review confirms three things:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-2 ml-2">
            <li><strong>Safety</strong> — ingredients have known safety profiles at the proposed dose for the proposed duration of use; no contraindicated combinations.</li>
            <li><strong>Efficacy</strong> — the medicinal-claim language is supported by an accepted evidence category (compendial monograph, traditional use, or modern scientific evidence).</li>
            <li><strong>Quality</strong> — manufacturer holds a Site Licence; manufacturing follows Good Manufacturing Practice.</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            What NPN does <strong>not</strong> verify: comparative effectiveness vs other products, dose
            optimisation against the latest clinical evidence, or third-party batch testing. NPN is a regulatory
            floor, not a quality ceiling.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Canada NHP evidence categories</h2>
          <div className="space-y-4">
            {nhpEvidenceCategories.map(c => (
              <div key={c.category} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">{c.category}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.description}</p>
                <p className="text-xs text-gray-500"><strong>Example:</strong> <em>{c.example}</em></p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">How to verify an NPN in 60 seconds</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 leading-relaxed space-y-2">
            <li>Locate the eight-digit NPN on the product label (typically near the medicinal-ingredient declaration).</li>
            <li>Open the <a href="https://health-products.canada.ca/lnhpd-bdpsnh/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Licensed Natural Health Products Database (LNHPD)</a>.</li>
            <li>Enter the NPN in the search box and verify: licence-holder name matches the brand, product name matches, the listed medicinal ingredients match the product label.</li>
            <li>If anything does not match, the NPN may be counterfeit or for a different formulation. Do not purchase.</li>
          </ol>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our Canadian catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsCA.length} products</strong> in our Canadian catalog. Products are a mix
            of Canadian-domiciled brands (NPN-licensed where shown on label) and U.S.-domiciled brands available
            via cross-border channels (Amazon US, iHerb, direct-to-consumer). Our reviews note the regulatory
            status visible from product labelling at the time of review. Per-product NPN field surfacing is on
            our 2026 roadmap.
          </p>
          <p className="text-xs text-gray-500 italic">
            Until per-product NPN surfacing ships, verify each NPN-claimed product directly via the LNHPD link
            above before purchasing.
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
            { type: 'Regulatory', label: 'Natural Health Products Regulations (SOR/2003-196)', url: 'https://laws-lois.justice.gc.ca/eng/regulations/sor-2003-196/' },
            { type: 'Regulatory', label: 'Health Canada — Natural Health Products', url: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/natural-non-prescription.html' },
            { type: 'Regulatory', label: 'Licensed Natural Health Products Database (LNHPD)', url: 'https://health-products.canada.ca/lnhpd-bdpsnh/' },
            { type: 'Regulatory', label: 'Health Canada — Natural Health Products Ingredients Database (NHPID)', url: 'http://webprod.hc-sc.gc.ca/nhpid-bdipsn/search-rechercheReq.do' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('ca')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Back to home</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </PublicShell>
  );
}
