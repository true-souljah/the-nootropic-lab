import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell} from '@nootropic/ui';
import { productsSEA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PAGE_URL = `${SITE_URL}/halal-nootropics-indonesia-bpjph/`;
const auditDateIso = new Date().toISOString().split('T')[0];


export const metadata: Metadata = {
  title: 'Halal Nootropic Supplements in SEA: BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance Guide',
  description:
    'Halal certification is mandatory for supplements marketed to consumers in Indonesia (BPJPH federal law) and Malaysia (JAKIM federal law). Full guide to per-country regulators (HSA Singapore, NPRA Malaysia, BPOM Indonesia, FDA Philippines, FDA Thailand) + audit of our SEA catalog.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/halal-nootropics-indonesia-bpjph/', availableInRegions: ['sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/halal-nootropics-indonesia-bpjph/', title: 'Halal Nootropic Supplements in SEA: BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance Guide', description: 'Halal certification is mandatory for supplements marketed to consumers in Indonesia (BPJPH federal law) and Malaysia (JAKIM federal law). Full guide to per-country regulators (HSA Singapore, NPRA Malaysia, BPOM Indonesia, FDA Philippines, FDA Thailand) + audit of our SEA catalog.' }),
  twitter: buildTwitter({ title: 'Halal Nootropic Supplements in SEA: BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance Guide', description: 'Halal certification is mandatory for supplements marketed to consumers in Indonesia (BPJPH federal law) and Malaysia (JAKIM federal law). Full guide to per-country regulators (HSA Singapore, NPRA Malaysia, BPOM Indonesia, FDA Philippines, FDA Thailand) + audit of our SEA catalog.' }),
};

interface SeaRegulator {
  country: string;
  regulator: string;
  authority: string;
  halalRequirement: string;
  notes: string;
}

const seaRegulators: SeaRegulator[] = [
  { country: 'Indonesia', regulator: 'BPOM', authority: 'Badan Pengawas Obat dan Makanan (Food and Drug Supervisory Agency)', halalRequirement: 'Halal certification MANDATORY (BPJPH federal law, JPH 2014). Products without Halal certification cannot legally be marketed to Indonesian consumers.', notes: 'BPOM registration covers safety/efficacy/quality. BPJPH (Halal Product Assurance Agency) handles Halal certification. Both required for legal sale to Indonesian consumers as of October 2024.' },
  { country: 'Malaysia', regulator: 'NPRA', authority: 'National Pharmaceutical Regulatory Agency', halalRequirement: 'JAKIM Halal certification MANDATORY for products marketed as Halal-compliant. Products without certification can be sold but cannot make Halal claims.', notes: 'NPRA registration confirms safety/efficacy/quality of pharmaceutical products and supplements. JAKIM (Department of Islamic Development Malaysia) is the Halal certifying body.' },
  { country: 'Singapore', regulator: 'HSA', authority: 'Health Sciences Authority', halalRequirement: 'Halal certification optional but expected by Muslim consumer segment. MUIS (Majlis Ugama Islam Singapura) is the local Halal certifying authority.', notes: 'Singapore regulates supplements as Health Supplements under the Health Products Act. HSA notification typically required for products making health claims.' },
  { country: 'Philippines', regulator: 'FDA Philippines', authority: 'Food and Drug Administration', halalRequirement: 'Halal certification optional; relevant primarily for Bangsamoro Autonomous Region in Muslim Mindanao.', notes: 'FDA Philippines registration required for food supplements marketed nationally. PNS (Philippine National Standard) for Halal supplements available.' },
  { country: 'Thailand', regulator: 'FDA Thailand', authority: 'Food and Drug Administration', halalRequirement: 'Halal certification optional; CICOT (Central Islamic Council of Thailand) is the certifying authority for products targeting the Muslim consumer segment.', notes: 'FDA Thailand registration required for supplements; cognitive function claims require additional documentation.' },
  { country: 'Vietnam', regulator: 'MOH', authority: 'Ministry of Health', halalRequirement: 'Halal certification optional; Halal Certification Agency Vietnam (HCA) is the local authority.', notes: 'Vietnam Food Administration handles supplement registration. Cognitive supplement market is smaller; cross-border imports common.' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Nootropic Supplements in SEA — BPJPH + JAKIM Mandatory Compliance',
  description: 'Per-country regulator + Halal-certification reference for cognitive supplements sold across Southeast Asia (SG, MY, ID, PH, TH, VN).',
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
  name: 'SEA Per-Country Regulator + Halal Certification Reference — Cognitive Supplements',
  description: 'Structured per-country reference of supplement regulators and Halal-certification requirements across the six major SEA markets (SG, MY, ID, PH, TH, VN).',
  url: PAGE_URL,
  keywords: ['SEA', 'Southeast Asia', 'Halal', 'BPJPH', 'JAKIM', 'BPOM', 'HSA', 'NPRA', 'FDA Philippines', 'FDA Thailand', 'MUIS', 'CICOT', 'cognitive supplements'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: seaRegulators.map(r => ({
    '@type': 'PropertyValue',
    name: `${r.country} — ${r.regulator}`,
    description: `Authority: ${r.authority}. Halal requirement: ${r.halalRequirement} Notes: ${r.notes}`,
    additionalType: 'SEA-supplement-regulator',
  })),
  citation: 'BPJPH JPH Law 2014 (Indonesia) + Trade Descriptions (Halal Definition) Order 2011 (Malaysia) + Health Products Act (Singapore)',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Halal Nootropics SEA', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'Is Halal certification really mandatory in Indonesia?', a: 'Yes. Indonesia\'s Halal Product Assurance Law (Undang-Undang Jaminan Produk Halal, UU JPH 2014) made Halal certification mandatory for food, beverages, drugs, cosmetics, and other consumer products marketed to Indonesian consumers. The implementation timeline rolled out in stages; for food and beverages including supplements, the mandatory phase took effect on 17 October 2024. Products without BPJPH-issued Halal certification cannot legally be marketed to Indonesian consumers.' },
  { q: 'What is BPJPH and how does it differ from MUI?', a: 'BPJPH (Badan Penyelenggara Jaminan Produk Halal) is the Halal Product Assurance Agency, a government body under the Ministry of Religious Affairs that issues Halal certificates. MUI (Majelis Ulama Indonesia) is the Indonesian Ulema Council; under the JPH 2014 law, MUI provides the technical fatwa assessment, but the certificate itself is now issued by BPJPH. Pre-2019 certifications were issued by MUI directly; post-2019 they are issued by BPJPH with MUI fatwa backing.' },
  { q: 'How is JAKIM Malaysia different from BPJPH Indonesia?', a: 'JAKIM (Department of Islamic Development Malaysia) certifies Halal compliance for products marketed in Malaysia and is widely recognised internationally as the gold standard. JAKIM certification is required if a product is marketed AS Halal in Malaysia; it is not a precondition for sale of supplements that do not make Halal claims. BPJPH Indonesia is mandatory for ALL food/beverage/supplement sales as of 2024, regardless of whether the product makes Halal claims.' },
  { q: 'What about HSA notification in Singapore?', a: 'The Health Sciences Authority Singapore regulates supplements as Health Supplements under the Health Products Act. While HSA does not require pre-market approval for general health supplements, it does require notification for products making specific health claims and reserves enforcement powers against unsafe or misbranded products. Singaporean Muslim consumers expect MUIS (Majlis Ugama Islam Singapura) Halal certification.' },
  { q: 'Why does this site weight Halal-certified products higher for ID/MY traffic?', a: 'For Indonesian readers, Halal certification is a legal requirement — recommending a non-certified product to ID traffic would be recommending a product that cannot legally be sold to that consumer. For Malaysian readers, JAKIM certification carries strong consumer-trust weight even where not legally mandatory. We surface Halal status on every product card and weight Halal-certified products higher in listicle ranking when serving ID/MY traffic, where verifiable from manufacturer documentation.' },
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
          <span>Halal Nootropics SEA</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Halal Nootropic Supplements in SEA — BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Halal certification is <strong>mandatory under federal law</strong> for supplements marketed to
          consumers in Indonesia (BPJPH, since October 2024) and Malaysia (JAKIM, when products are marketed
          as Halal). For other SEA markets — Singapore, Philippines, Thailand, Vietnam — Halal certification
          is optional but increasingly expected by the Muslim consumer segment. This page is the per-country
          regulator + Halal-certification reference, plus our SEA catalog audit.
        </p>

        <AffiliateDisclosure />

        <section className="my-10 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 text-sm text-red-900">
          <strong className="block mb-1">Notice for Indonesian and Malaysian readers</strong>
          Per Indonesian law (UU JPH 2014, mandatory implementation October 2024) and Malaysian Trade
          Descriptions (Halal Definition) Order 2011, supplements marketed to ID/MY consumers must hold
          appropriate Halal certification. We weight Halal-certified products higher in our SEA listicle
          ranking when serving ID/MY traffic, and surface Halal status on every product card where verifiable.
          If you are uncertain about a product&apos;s Halal status, verify directly with the certifying authority
          before purchase.
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Per-country regulators + Halal requirements</h2>
          <div className="space-y-4">
            {seaRegulators.map(r => (
              <div key={r.country} className="border border-gray-200 rounded-xl p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{r.country}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{r.regulator}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{r.authority}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>Halal requirement:</strong> {r.halalRequirement}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{r.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our SEA catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsSEA.length} products</strong> in our SEA catalog. Where Halal certification
            is verifiable from manufacturer documentation, we surface the certifying authority. Where capsule
            source is verifiable but no formal certification exists, we describe the capsule type so consumers
            can make informed decisions. We never fabricate certifications. Per-product Halal field surfacing
            and per-country regulator status is on our 2026 roadmap.
          </p>
          <p className="text-xs text-gray-500 italic">
            Until per-product Halal + regulator surfacing ships, verify each Halal claim directly with the
            certifying authority before purchasing. For Indonesian readers, look for the BPJPH Halal logo on
            packaging.
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
            { type: 'Regulatory', label: 'BPJPH (Halal Product Assurance Agency, Indonesia)', url: 'https://bpjph.halal.go.id/' },
            { type: 'Regulatory', label: 'BPOM (Indonesian Food and Drug Supervisory Agency)', url: 'https://www.pom.go.id/' },
            { type: 'Regulatory', label: 'JAKIM (Department of Islamic Development Malaysia)', url: 'https://www.halal.gov.my/' },
            { type: 'Regulatory', label: 'NPRA (National Pharmaceutical Regulatory Agency, Malaysia)', url: 'https://www.npra.gov.my/' },
            { type: 'Regulatory', label: 'HSA Singapore (Health Sciences Authority)', url: 'https://www.hsa.gov.sg/' },
            { type: 'Regulatory', label: 'MUIS (Majlis Ugama Islam Singapura)', url: 'https://www.muis.gov.sg/' },
            { type: 'Regulatory', label: 'FDA Philippines', url: 'https://www.fda.gov.ph/' },
            { type: 'Regulatory', label: 'FDA Thailand', url: 'https://www.fda.moph.go.th/' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('sea')}
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
