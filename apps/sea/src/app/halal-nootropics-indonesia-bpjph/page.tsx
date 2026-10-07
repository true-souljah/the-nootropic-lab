import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell} from '@nootropic/ui';
import { productsSEA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PAGE_URL = `${SITE_URL}/halal-nootropics-indonesia-bpjph/`;
// Fixed dates, never the build date. The BPJPH register was searched for every
// SEA product and manufacturer on 2026-07-20 (commit ea11e74); the page's facts
// were last revised on 2026-10-07 (brand-page halal check + PP 42/2024 dates).
const bpjphSearchDateIso = '2026-07-20';
const pageModifiedIso = '2026-10-07';


export const metadata: Metadata = {
  title: 'Halal Nootropic Supplements in SEA: BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance Guide',
  description:
    'Indonesia requires BPJPH Halal certification for health supplements, imports included, from 18 October 2026 (Government Regulation 42/2024); in Malaysia, Halal certification and marking apply to goods described as Halal. Per-country regulator guide (HSA Singapore, NPRA Malaysia, BPOM Indonesia, FDA Philippines, FDA Thailand), how to verify Halal status in the official registries, and an audit of our SEA catalog.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/halal-nootropics-indonesia-bpjph/', availableInRegions: ['sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/halal-nootropics-indonesia-bpjph/', title: 'Halal Nootropic Supplements in SEA: BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance Guide', description: 'Indonesia requires BPJPH Halal certification for health supplements, imports included, from 18 October 2026 (Government Regulation 42/2024); in Malaysia, Halal certification and marking apply to goods described as Halal. Per-country regulator guide (HSA Singapore, NPRA Malaysia, BPOM Indonesia, FDA Philippines, FDA Thailand), how to verify Halal status in the official registries, and an audit of our SEA catalog.' }),
  twitter: buildTwitter({ title: 'Halal Nootropic Supplements in SEA: BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance Guide', description: 'Indonesia requires BPJPH Halal certification for health supplements, imports included, from 18 October 2026 (Government Regulation 42/2024); in Malaysia, Halal certification and marking apply to goods described as Halal. Per-country regulator guide (HSA Singapore, NPRA Malaysia, BPOM Indonesia, FDA Philippines, FDA Thailand), how to verify Halal status in the official registries, and an audit of our SEA catalog.' }),
};

interface SeaRegulator {
  country: string;
  regulator: string;
  authority: string;
  halalRequirement: string;
  notes: string;
}

const seaRegulators: SeaRegulator[] = [
  { country: 'Indonesia', regulator: 'BPOM', authority: 'Badan Pengawas Obat dan Makanan (Food and Drug Supervisory Agency)', halalRequirement: 'Halal certification becomes MANDATORY for health supplements from 18 October 2026 (BPJPH, UU JPH 2014). Government Regulation (PP) 42/2024, Art. 161(1)(a), places health supplements with herbal and quasi medicines in the phase that runs from 17 October 2021 "sampai dengan tanggal 17 Oktober 2026" (until 17 October 2026), and BPJPH states the obligation applies "mulai 18 Oktober 2026" (from 18 October 2026). Imports are covered: PP 42/2024 Art. 145 reads "Produk luar negeri yang masuk ke Indonesia wajib bersertifikat halal" (foreign products entering Indonesia must be halal-certified). From 18 October 2026, supplements without BPJPH Halal certification cannot legally be distributed to Indonesian consumers.', notes: 'BPOM registration covers safety/efficacy/quality; BPJPH (Halal Product Assurance Agency) handles Halal certification. Note the 17 October 2024 deadline that has already passed covers food and beverage products, NOT health supplements — supplements have their own later deadline.' },
  { country: 'Malaysia', regulator: 'NPRA', authority: 'National Pharmaceutical Regulatory Agency', halalRequirement: 'Halal certification MANDATORY for goods described as Halal. Malaysia\'s WTO notification of the Trade Descriptions (Certification and Marking of Halal) Order 2011 says the Order "imposes for certification and marking of a Halal logo on food, goods as well as services in relation to the food and goods which are intended to be described as halal" (we could not retrieve the primary text from the Attorney General\'s Chambers site). We found no JAKIM statement making certification compulsory for supplements that make no Halal claim.', notes: 'NPRA registration confirms safety/efficacy/quality of pharmaceutical products and supplements. JAKIM (Department of Islamic Development Malaysia) is the Halal certifying body.' },
  { country: 'Singapore', regulator: 'HSA', authority: 'Health Sciences Authority', halalRequirement: 'Halal certification is voluntary — MUIS states that "MUIS Halal Certification is voluntary" (a general statement; supplements are not named) — but expected by the Muslim consumer segment. MUIS (Majlis Ugama Islam Singapura) is the local Halal certifying authority.', notes: 'Singapore regulates supplements as Health Supplements under the Health Products Act. Singapore\'s Health Sciences Authority (HSA) does not subject health supplements to approval or licensing; notification is voluntary (hsa.gov.sg, checked 2026-10-06).' },
  { country: 'Philippines', regulator: 'FDA Philippines', authority: 'Food and Drug Administration', halalRequirement: 'Halal certification optional; relevant primarily for Bangsamoro Autonomous Region in Muslim Mindanao.', notes: 'FDA Philippines registration required for food supplements marketed nationally. PNS (Philippine National Standard) for Halal supplements available.' },
  { country: 'Thailand', regulator: 'FDA Thailand', authority: 'Food and Drug Administration', halalRequirement: 'Halal certification optional; CICOT (Central Islamic Council of Thailand) is the certifying authority for products targeting the Muslim consumer segment.', notes: 'FDA Thailand registration required for supplements; cognitive function claims require additional documentation.' },
  { country: 'Vietnam', regulator: 'MOH', authority: 'Ministry of Health', halalRequirement: 'Halal certification optional; Halal Certification Agency Vietnam (HCA) is the local authority.', notes: 'The Vietnam Food Administration (VFA), under the Ministry of Health, handles product-declaration registration for health-protection foods under Decree 15/2018/NĐ-CP. Cognitive supplement market is smaller; cross-border imports common.' },
];

interface VerifyStep {
  market: string;
  authority: string;
  where: string;
  url: string;
  lookFor: string;
}

// Buyer-facing verification routes. Each entry was exercised against the live registry
// before publication — not merely checked for a 200 — because the two registries differ
// in a way that matters: BPJPH returns per-PRODUCT records, JAKIM's public directory
// returns per-COMPANY records. Telling a reader to "look up the product" on a registry
// that has no product view sends them away thinking they checked something.
const verifySteps: VerifyStep[] = [
  {
    market: 'Indonesia',
    authority: 'BPJPH',
    where: 'Cek Produk Halal — BPJPH certificate search',
    url: 'https://bpjph.halal.go.id/cari/sertifikat',
    lookFor: 'Genuinely per-product. Search by product name (Nama Produk), company (Pelaku Usaha), or certificate number, and results list the individual product, its manufacturer, the certificate number and the issue date. Searching the manufacturer is the more reliable route, since a product may be registered under a name that differs from its retail branding.',
  },
  {
    market: 'Malaysia',
    authority: 'JAKIM',
    where: 'MYeHALAL public directory',
    url: 'https://myehalal.halal.gov.my/portal-halal/v1/index.php?data=ZGlyZWN0b3J5L2luZGV4X2RpcmVjdG9yeTs7Ozs=',
    lookFor: 'Company-level, not product-level: search the manufacturer\'s registered company name and you get its address and certificate expiry date, but not the list of products the certificate covers. Leave the category filter unset — filtering can hide a company that is in fact listed. Because JAKIM certification is per-product and per-premises, a company appearing here does NOT establish that a particular product is certified; for that, ask the manufacturer which certificate covers the product.',
  },
  {
    market: 'Imported products',
    authority: 'JAKIM / BPJPH — foreign certifier lists',
    where: 'JAKIM recognised-body list · BPJPH Lembaga Halal Luar Negeri',
    url: 'https://www.halal.gov.my/index.php?data=bW9kdWxlcy9jb2xsYXBzaWJsZV9jb250ZW50Ozs7Ow==&utama=CB_LIST',
    lookFor: 'A foreign halal logo only carries weight if the destination authority recognises the body that issued it. JAKIM publishes its recognised-body list and has withdrawn recognition before; BPJPH maintains an equivalent register of foreign halal bodies (Lembaga Halal Luar Negeri) at bpjph.halal.go.id/cari/lembaga-halal-luar-negeri. Check the issuer rather than assuming a halal mark transfers between markets.',
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Nootropic Supplements in SEA — BPJPH + JAKIM Mandatory Compliance',
  description: 'Per-country regulator + Halal-certification reference for cognitive supplements sold across Southeast Asia (SG, MY, ID, PH, TH, VN).',
  datePublished: '2026-05-05',
  dateModified: pageModifiedIso,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
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
  citation: 'BPJPH JPH Law 2014 + Government Regulation 42/2024 on the phasing of halal certification obligations, Art. 145 and Art. 161 (Indonesia) + Trade Descriptions (Definition of Halal) Order 2011 and Trade Descriptions (Certification and Marking of Halal) Order 2011, as described in WTO notification G/TBT/N/MYS/27/Rev.1 (Malaysia) + Health Products Act and MUIS Halal certification (Singapore)',
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
  { q: 'Is Halal certification really mandatory in Indonesia?', a: 'Yes, for health supplements from 18 October 2026 — not 2024. Indonesia\'s Halal Product Assurance Law (Undang-Undang Jaminan Produk Halal, UU JPH 2014) makes Halal certification mandatory for food, beverages, medicines, cosmetics and other consumer products, rolled out in phases. Food and beverage products hit their deadline on 17 October 2024. Health supplements (suplemen kesehatan) sit in the phase together with herbal medicines (obat bahan alam) and quasi medicines (obat kuasi) that Government Regulation (PP) 42/2024, Art. 161(1)(a), runs from 17 October 2021 to 17 October 2026, and BPJPH states that these products must be halal-certified "mulai 18 Oktober 2026" (from 18 October 2026). Imported products are included (PP 42/2024, Art. 145). So a supplement without BPJPH certification can still be sold in Indonesia until the phase ends on 17 October 2026, but not from 18 October 2026.' },
  { q: 'What happens to nootropic supplements from 18 October 2026 in Indonesia?', a: 'From that date, health supplements distributed in Indonesia must hold BPJPH Halal certification. BPJPH has said publicly that the October 2026 phase is going ahead, and has been urging manufacturers to map affected ingredients and production processes well in advance rather than treating the date as a soft target. For imported nootropics this matters twice over: the certification requirement applies to the product (PP 42/2024, Art. 145: foreign products entering Indonesia must be halal-certified), and BPJPH has been accrediting overseas halal bodies (Lembaga Halal Luar Negeri) and signing mutual recognition arrangements so foreign certificates can be accepted. Buyers should expect some imported brands to disappear from Indonesian shelves around that date rather than certify.' },
  { q: 'Which nootropics on this site are Halal certified?', a: 'None of them appears in Indonesia\'s BPJPH register — we searched it for every product and every manufacturer on our list, and none returned a certificate. We are not turning that into a claim that these products are "not Halal": a product can hold JAKIM certification in Malaysia, MUIS certification in Singapore, or a certificate from a recognised foreign body, none of which shows up in the Indonesian database. The Malaysian side we cannot settle from public data, because JAKIM\'s directory lists certified companies rather than the products their certificates cover. The reliable answer for any specific product is the certifying authority\'s own registry, and the two work differently: BPJPH\'s Cek Produk Halal search returns individual products with their certificate numbers, while JAKIM\'s public MYeHALAL directory lists certified companies rather than their product ranges. So for Indonesia you can usually settle it yourself; for Malaysia you can confirm the manufacturer holds a certificate, then need to ask which products it covers. Both are free and linked above.' },
  { q: 'Are the capsules the problem, or the ingredients?', a: 'Usually the capsule. Common nootropic actives — citicoline, L-theanine, Bacopa, Lion\'s Mane, Ginkgo — raise no Halal question by themselves. Standard hard capsules are gelatin, which is an animal product: porcine gelatin is not permissible and bovine gelatin is only permissible with Halal slaughter, and labels rarely say which is used. Capsules described as HPMC (hydroxypropyl methylcellulose), pullulan, vegetarian, vegan or cellulose are plant-based and avoid the question; tablets and powders sidestep it too. Softgel shells are gelatin by construction, so they are the format to be most careful with. A plant-based shell is not the same as certification — excipients and processing aids can still carry animal origin — but it removes the most common barrier.' },
  { q: 'What is BPJPH and how does it differ from MUI?', a: 'BPJPH (Badan Penyelenggara Jaminan Produk Halal) is the Halal Product Assurance Agency, a government body under the Ministry of Religious Affairs that issues Halal certificates. MUI (Majelis Ulama Indonesia) is the Indonesian Ulema Council; under the JPH 2014 law, MUI provides the technical fatwa assessment, but the certificate itself is now issued by BPJPH. Pre-2019 certifications were issued by MUI directly; post-2019 they are issued by BPJPH with MUI fatwa backing.' },
  { q: 'How is JAKIM Malaysia different from BPJPH Indonesia?', a: 'JAKIM (Department of Islamic Development Malaysia) certifies Halal compliance for products marketed in Malaysia and is widely recognised internationally as the gold standard. JAKIM certification is required if a product is marketed AS Halal in Malaysia; it is not a precondition for sale of supplements that do not make Halal claims. BPJPH Indonesia is mandatory regardless of whether the product makes Halal claims — for food and beverages that took effect on 17 October 2024, and for health supplements it applies from 18 October 2026.' },
  { q: 'What about HSA notification in Singapore?', a: 'The Health Sciences Authority Singapore regulates supplements as Health Supplements under the Health Products Act. Singapore\'s Health Sciences Authority (HSA) does not subject health supplements to approval or licensing; notification is voluntary (hsa.gov.sg, checked 2026-10-06). Singaporean Muslim consumers expect MUIS (Majlis Ugama Islam Singapura) Halal certification.' },
  { q: 'Does Halal status change this site\'s rankings for ID/MY readers?', a: 'For Indonesian readers, Halal certification becomes a legal requirement for supplements from 18 October 2026 — so a non-certified product recommended today may not be legally distributable there within months. For Malaysian readers, JAKIM certification carries strong consumer-trust weight even where not legally mandatory. We do not adjust scores or rankings for Halal status: every reader sees the same ranking. Where we have checked a product, its review page shows the Halal status we found on the brand\'s own pages, with the date we checked. A brand\'s pages are not a registry, so readers in Indonesia or Malaysia should verify the product in the BPJPH register (bpjph.halal.go.id) or check its manufacturer in JAKIM\'s MYeHALAL directory (myehalal.halal.gov.my) before buying.' },
];

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
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
          <span>Last updated: {new Date(pageModifiedIso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Halal Nootropic Supplements in SEA — BPJPH (Indonesia) + JAKIM (Malaysia) Mandatory Compliance
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Halal certification becomes <strong>mandatory by law</strong> for health supplements sold in
          Indonesia, imports included, from <strong>18 October 2026</strong>, the day after the phase-in under
          Government Regulation 42/2024 ends (BPJPH, UU JPH 2014), and is already required in Malaysia
          (JAKIM) whenever a product is described as Halal. For other SEA markets — Singapore,
          Philippines, Thailand, Vietnam — Halal certification is optional but increasingly expected by the
          Muslim consumer segment. This page is the per-country regulator + Halal-certification reference,
          plus our SEA catalog audit.
        </p>

        <AffiliateDisclosure />

        <section className="my-10 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 text-sm text-red-900">
          <strong className="block mb-1">Notice for Indonesian and Malaysian readers</strong>
          Under Indonesian law (UU JPH 2014 and Government Regulation 42/2024), health supplements, imported
          ones included, must hold BPJPH Halal certification from{' '}
          <strong>18 October 2026</strong> — the day after the phase covering herbal medicines, quasi medicines
          and health supplements closes on 17 October 2026. The 17 October 2024 deadline you may have seen quoted applied to food and
          beverage products, not supplements. In Malaysia, the Trade Descriptions (Definition of Halal) Order 2011
          and the Trade Descriptions (Certification and Marking of Halal) Order 2011 govern goods described as Halal. We do not adjust our rankings for Halal status. Where we have
          checked a product, its review page shows the Halal status we found on the brand&apos;s own pages, with
          the date we checked. Before buying, verify the product in the BPJPH register (bpjph.halal.go.id) or
          check its manufacturer in JAKIM&apos;s MYeHALAL directory (myehalal.halal.gov.my); the steps are below.
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
            We track <strong>{productsSEA.length} products</strong> in our SEA catalog, and{' '}
            <strong>none of them appears in Indonesia&apos;s BPJPH Halal register</strong>. That is an
            audit result, not an absence of effort: on {bpjphSearchDateIso}{' '}we searched the BPJPH certificate
            register for every product on this list and for each product&apos;s manufacturer, and none
            returned a certificate. Two searches looked like matches and were not — a Lion&apos;s Mane
            mushroom powder from an unrelated Indonesian producer, and a truffle product that happens to
            share the Supershrooms name.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We have deliberately not converted that into a claim that these products are &ldquo;not
            Halal&rdquo;. Absence from the Indonesian register is not the same as absence of certification:
            a product may hold JAKIM certification in Malaysia, MUIS certification in Singapore, or a
            certificate issued by a recognised foreign body, none of which appears in BPJPH&apos;s database.
            The Malaysian side we cannot close from public data at all, because JAKIM&apos;s public directory
            lists certified companies rather than the products their certificates cover.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            A worked example of why the distinction matters: Blackmores Ltd holds certificates covering
            close to two hundred products in the BPJPH register, yet a search of that register for
            Blackmores Brain Active returns nothing. A parent company being certified tells you very little
            about the specific product in your hand. That is the gap the steps above are designed to close.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Where capsule source is verifiable but no formal certification exists, we describe the capsule
            type so consumers can make informed decisions. We never fabricate certifications, and we do not
            display a Halal badge on any product until a certificate backs it — which is why no product on
            this site currently shows one. If you are shopping in Indonesia specifically, the practical
            reading of this audit is that the imported cognitive-supplement brands we track have largely not
            gone through BPJPH certification yet, and they would need to before the obligation applies on
            18 October 2026.
          </p>
          <p className="text-xs text-gray-500 italic">
            For Indonesian readers, look for the BPJPH Halal logo on packaging.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How to verify a product&apos;s Halal status yourself</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Because we do not hold verified per-product certification data, the honest answer to
            &ldquo;is this nootropic Halal?&rdquo; is that you should check the certifying authority&apos;s own
            registry rather than trust a logo, a marketplace listing, or us. Both national authorities
            publish a free public search. Each takes under a minute.
          </p>
          <div className="space-y-4">
            {verifySteps.map(v => (
              <div key={v.market} className="border border-gray-200 rounded-xl p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{v.market}</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{v.authority}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  <strong>Where:</strong>{' '}
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline hover:no-underline">
                    {v.where}
                  </a>
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{v.lookFor}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Why the capsule matters more than the formula</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            For most nootropics the active ingredients — citicoline, L-theanine, Bacopa, Lion&apos;s Mane,
            Ginkgo — raise no Halal question on their own. The shell around them usually does. Standard
            hard capsules are made from gelatin, which is an animal product: porcine gelatin is not
            permissible, and bovine gelatin is only permissible if the animal was slaughtered to Halal
            requirements. Manufacturers rarely state which they use on the label.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The practical shortcut is to look for a plant-based shell instead. Capsules described as
            HPMC (hydroxypropyl methylcellulose), pullulan, vegetarian, vegan, or cellulose avoid the
            gelatin question entirely. A tablet or powder sidesteps it too. This is not a substitute
            for certification — excipients, flow agents and processing aids can still carry animal
            origin — but a vegetarian capsule removes the single most common barrier.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Softgels deserve extra care: the shell is gelatin by construction, so a softgel without
            certification or an explicit plant-based claim is the least safe format to assume about.
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
            { type: 'Regulatory', label: 'Government Regulation (PP) 42/2024 on halal product assurance, BPJPH copy — Art. 145 (imports), Art. 161(1)(a) (supplement phase to 17 October 2026)', url: 'https://cmsbl.halal.go.id/uploads/Salinan_PP_Nomor_42_Tahun_2024_tentang_Bidang_Penyelenggaraan_Jaminan_Produk_Halal_ce371e0e1e.pdf' },
            { type: 'Regulatory', label: 'BPJPH — mandatory halal certification "mulai 18 Oktober 2026", incl. health supplements and imports', url: 'https://bpjph.halal.go.id/read/raker-dengan-dpr-kepala-bpjph-pastikan-implementasi-wajib-halal-oktober-2026-sesuai-tahapan' },
            { type: 'Registry', label: 'BPJPH — Cek Produk Halal (per-product certificate search)', url: 'https://bpjph.halal.go.id/cari/sertifikat' },
            { type: 'Registry', label: 'BPJPH — Verifikasi Sertifikat Halal (QR check on a certificate you hold)', url: 'https://bpjph.halal.go.id/sertifikat/sertifikat' },
            { type: 'Registry', label: 'BPJPH — Lembaga Halal Luar Negeri (recognised foreign halal bodies)', url: 'https://bpjph.halal.go.id/cari/lembaga-halal-luar-negeri' },
            { type: 'Registry', label: 'MYeHALAL — JAKIM company-level Halal directory', url: 'https://myehalal.halal.gov.my/portal-halal/v1/index.php?data=ZGlyZWN0b3J5L2luZGV4X2RpcmVjdG9yeTs7Ozs=' },
            { type: 'Registry', label: 'JAKIM — recognised Foreign Halal Certification Bodies', url: 'https://www.halal.gov.my/index.php?data=bW9kdWxlcy9jb2xsYXBzaWJsZV9jb250ZW50Ozs7Ow==&utama=CB_LIST' },
            { type: 'Regulatory', label: 'BPOM (Indonesian Food and Drug Supervisory Agency)', url: 'https://www.pom.go.id/' },
            { type: 'Regulatory', label: 'JAKIM (Department of Islamic Development Malaysia)', url: 'https://www.halal.gov.my/' },
            { type: 'Regulatory', label: 'Malaysia WTO notification G/TBT/N/MYS/27/Rev.1 — Trade Descriptions (Definition of Halal) and (Certification and Marking of Halal) Orders 2011', url: 'https://epingalert.org/en/DOL/GetDocument?dolLink=G/TBTN11/MYS27R1&notificationId=11824' },
            { type: 'Regulatory', label: 'NPRA (National Pharmaceutical Regulatory Agency, Malaysia)', url: 'https://www.npra.gov.my/' },
            { type: 'Regulatory', label: 'HSA Singapore (Health Sciences Authority)', url: 'https://www.hsa.gov.sg/' },
            { type: 'Regulatory', label: 'MUIS (Majlis Ugama Islam Singapura)', url: 'https://www.muis.gov.sg/' },
            { type: 'Regulatory', label: 'MUIS — About Halal certification ("MUIS Halal Certification is voluntary")', url: 'https://www.muis.gov.sg/halal/about/' },
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
