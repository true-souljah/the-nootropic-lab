import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://gcc.thenootropiclab.com';
const PAGE_URL = `${SITE_URL}/halal-certified-nootropics/`;
const auditDateIso = new Date().toISOString().split('T')[0];

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: 'Halal-Certified Cognitive Supplements (GCC): Capsule Source, Certifying Authorities & SFDA Status',
  description:
    'GCC consumers expect Halal-certified supplements. Capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. Full guide to Halal certifying authorities accepted in Saudi Arabia, UAE, and the broader GCC, plus audit of our nootropic catalog.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/halal-certified-nootropics/', availableInRegions: ['gcc'] }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/halal-certified-nootropics/', title: 'Halal-Certified Cognitive Supplements (GCC): Capsule Source, Certifying Authorities & SFDA Status', description: 'GCC consumers expect Halal-certified supplements. Capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. Full guide to Halal certifying authorities accepted in Saudi Arabia, UAE, and the broader GCC, plus audit of our nootropic catalog.' }),
  twitter: buildTwitter({ title: 'Halal-Certified Cognitive Supplements (GCC): Capsule Source, Certifying Authorities & SFDA Status', description: 'GCC consumers expect Halal-certified supplements. Capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. Full guide to Halal certifying authorities accepted in Saudi Arabia, UAE, and the broader GCC, plus audit of our nootropic catalog.' }),
};

interface HalalAuthority {
  authority: string;
  country: string;
  recognisedIn: string;
  notes: string;
}

const halalAuthorities: HalalAuthority[] = [
  { authority: 'JAKIM (Department of Islamic Development Malaysia)', country: 'Malaysia', recognisedIn: 'Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman, Indonesia (recognised), worldwide reference standard', notes: 'Widely regarded as the most rigorous Halal-certifying authority globally. Many international supplement manufacturers seek JAKIM certification specifically because of its broad acceptance.' },
  { authority: 'MUI (Indonesian Ulema Council) / BPJPH', country: 'Indonesia', recognisedIn: 'Indonesia (mandatory under federal law), UAE, GCC widely', notes: 'Since 2024, BPJPH (Halal Product Assurance Agency) issues certificates with technical assessment by MUI. Mandatory for products sold in Indonesia.' },
  { authority: 'Halal Council of Britain (HFA / HMC)', country: 'United Kingdom', recognisedIn: 'UAE, Saudi Arabia (case-by-case), GCC widely, EU markets', notes: 'Common certifier for UK-domiciled supplement brands shipping to GCC.' },
  { authority: 'IFANCA (Islamic Food and Nutrition Council of America)', country: 'United States', recognisedIn: 'Saudi Arabia (case-by-case), UAE, GCC widely', notes: 'Common certifier for U.S.-domiciled supplement brands. Recognition in individual GCC countries varies.' },
  { authority: 'GAC (Gulf Accreditation Center) approved bodies', country: 'GCC', recognisedIn: 'GCC-wide via mutual recognition', notes: 'GAC accredits Halal-certifying bodies for GCC mutual recognition. Products certified by GAC-accredited bodies are recognised across the six GCC member states.' },
  { authority: 'SFDA-approved local certifiers', country: 'Saudi Arabia', recognisedIn: 'Saudi Arabia primarily', notes: 'For products sold in Saudi pharmacies and major retailers, SFDA may require certification by an SFDA-recognised body.' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal-Certified Cognitive Supplements in the GCC',
  description: 'Guide to Halal certifying authorities recognised in the GCC, capsule-shell composition, and SFDA registration status for cognitive supplements.',
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
  name: 'Halal-Certifying Authorities Recognised in the GCC — Cognitive Supplements',
  description: 'Structured reference of Halal-certifying authorities accepted by Gulf Cooperation Council member states for dietary supplements.',
  url: PAGE_URL,
  keywords: ['Halal', 'GCC', 'Saudi Arabia', 'UAE', 'JAKIM', 'MUI', 'BPJPH', 'IFANCA', 'cognitive supplements', 'SFDA', 'capsule source'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: halalAuthorities.map(a => ({
    '@type': 'PropertyValue',
    name: a.authority,
    description: `Country of origin: ${a.country}. Recognised in: ${a.recognisedIn}. Notes: ${a.notes}`,
    additionalType: 'Halal-certifying-authority',
  })),
  citation: 'Saudi Food and Drug Authority + GCC Standardization Organization (GSO) + Indonesian Halal Product Assurance Agency (BPJPH)',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Halal-Certified Nootropics', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'Why does Halal certification matter for nootropic supplements?', a: 'Two reasons. First, capsule shells: gelatin capsules are typically derived from porcine or bovine sources, and Halal compliance requires either bovine gelatin from Halal-slaughtered animals or plant-based alternatives (HPMC, pullulan). Most supplement brands using vegetable capsules are Halal-friendly even without formal certification. Second, ingredients: alcohol extracts, certain emulsifiers, and some animal-derived ingredients require verification. Formal Halal certification confirms both elements have been audited.' },
  { q: 'What is HPMC and is it Halal?', a: 'HPMC (hydroxypropyl methylcellulose) is a plant-derived capsule material made from cellulose. It is intrinsically Halal-friendly and Vegan-friendly, requiring no animal sourcing audit. Most premium Western nootropic brands (Mind Lab Pro, NooCube, Performance Lab) use HPMC vegetable capsules. We surface capsule-source information in our reviews where it is verifiable from manufacturer documentation.' },
  { q: 'Which Halal authority is most widely recognised in the GCC?', a: 'JAKIM Malaysia is the most widely recognised internationally. Saudi Arabia\'s SFDA accepts certifications from a list of approved bodies including JAKIM, IFANCA, and GAC-accredited regional certifiers. UAE accepts JAKIM, MUI Indonesia, Halal Council of Britain, and IFANCA. For products sold across multiple GCC countries, JAKIM certification is the safest bet for broad acceptance.' },
  { q: 'Can I trust a "Halal" claim without third-party certification?', a: 'A formal certification mark from a recognised authority (JAKIM, MUI, IFANCA, etc.) carries the most weight. Manufacturer self-declarations of "Halal" or "suitable for Halal diet" without third-party certification are weaker signals. We surface formal certifications where verifiable and never fabricate certifications. For products without formal certification but using HPMC capsules and no alcohol/animal extracts, we describe the ingredient and capsule source so consumers can make informed decisions.' },
  { q: 'What is SFDA and how does it differ from Halal certification?', a: 'The Saudi Food and Drug Authority regulates safety, efficacy, and quality of supplements sold in Saudi Arabia. SFDA registration confirms regulatory clearance to sell — separate from Halal certification, which addresses religious dietary compliance. A product may be SFDA-registered without Halal certification (and vice versa, in theory). Premium supplements sold in Saudi pharmacies typically hold both.' },
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
          <span>Halal-Certified Nootropics</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Halal-Certified Cognitive Supplements in the GCC
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          GCC consumers preference Halal-certified supplements. Two factors determine Halal compliance for
          nootropic supplements: <strong>capsule shell composition</strong> (gelatin requires Halal-slaughter
          provenance; HPMC vegetable cellulose is intrinsically Halal-friendly) and <strong>ingredient
          sourcing</strong> (alcohol extracts and animal-derived ingredients require verification). This page
          covers the certifying authorities accepted in Saudi Arabia, UAE, and the broader GCC, capsule-source
          taxonomy, and the SFDA + Halal trust signals we surface in our reviews.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Capsule shell taxonomy</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-green-300 rounded-xl p-5 bg-green-50">
              <h3 className="font-bold text-green-900 mb-2">✓ HPMC / Pullulan (plant-based)</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hydroxypropyl methylcellulose (HPMC) and pullulan are plant-derived capsule materials.
                Intrinsically Halal-friendly and Vegan-friendly. No animal sourcing audit required. Common in
                premium Western brands.
              </p>
            </div>
            <div className="border border-amber-300 rounded-xl p-5 bg-amber-50">
              <h3 className="font-bold text-amber-900 mb-2">⚠ Bovine gelatin</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Halal-compliant only when from Halal-slaughtered cattle. Requires formal certification to
                verify. In the absence of certification, treat as not-verified-Halal.
              </p>
            </div>
            <div className="border border-red-300 rounded-xl p-5 bg-red-50">
              <h3 className="font-bold text-red-900 mb-2">✗ Porcine gelatin</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Not Halal under any framework. Some U.S.-domiciled supplement brands use porcine gelatin
                without prominent labelling — verify capsule-source on the supplement-facts panel before
                purchasing.
              </p>
            </div>
            <div className="border border-gray-300 rounded-xl p-5 bg-gray-50">
              <h3 className="font-bold text-gray-900 mb-2">— Tablet (no capsule)</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Tablets bypass the capsule-source question but may use binders/coatings derived from animal
                sources. Halal certification still recommended for full assurance.
              </p>
            </div>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recognised Halal-certifying authorities</h2>
          <div className="space-y-4">
            {halalAuthorities.map(a => (
              <div key={a.authority} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-1">{a.authority}</h3>
                <p className="text-xs text-gray-500 mb-2"><strong>Origin:</strong> {a.country}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>Recognised in:</strong> {a.recognisedIn}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{a.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our GCC catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsGCC.length} products</strong> in our GCC catalog. Where Halal certification
            is verifiable from manufacturer documentation, we surface the certifying authority. Where capsule
            source is verifiable but no formal certification exists, we describe the capsule type so consumers
            can make informed decisions. We never fabricate certifications. Per-product Halal field surfacing
            is on our 2026 roadmap.
          </p>
          <p className="text-xs text-gray-500 italic">
            Until per-product Halal surfacing ships, verify each Halal claim directly with the certifying
            authority before purchasing.
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
          heading="Regulatory + certifying-body sources"
          sources={[
            { type: 'Regulatory', label: 'Saudi Food and Drug Authority (SFDA)', url: 'https://www.sfda.gov.sa/en' },
            { type: 'Regulatory', label: 'GCC Standardization Organization (GSO)', url: 'https://www.gso.org.sa/' },
            { type: 'Regulatory', label: 'JAKIM (Department of Islamic Development Malaysia) — Halal Hub', url: 'https://www.halal.gov.my/' },
            { type: 'Regulatory', label: 'BPJPH (Halal Product Assurance Agency, Indonesia)', url: 'https://bpjph.halal.go.id/' },
            { type: 'Regulatory', label: 'IFANCA (Islamic Food and Nutrition Council of America)', url: 'https://www.ifanca.org/' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('gcc')}
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
