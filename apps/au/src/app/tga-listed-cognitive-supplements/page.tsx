import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell} from '@nootropic/ui';
import { allProductsAU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PAGE_URL = `${SITE_URL}/tga-listed-cognitive-supplements/`;
const auditDateIso = new Date().toISOString().split('T')[0];


export const metadata: Metadata = {
  title: 'TGA-Listed Cognitive Supplements (Australia): AUST L vs AUST R + Permitted Indications Guide',
  description:
    'The TGA says supplying a therapeutic good in Australia in most cases involves entry in the ARTG, shown by an AUST L (listed) or AUST R (registered) number. Explainer of TGA listing categories, permitted indications, the Advertising Code, Personal Importation Scheme limits, Poisons Standard scheduling, and the ARTG status of our Australian catalogue.',
  alternates: buildAlternates({ regionCode: 'au', path: '/tga-listed-cognitive-supplements/', availableInRegions: ['au'] }),
  openGraph: buildOpenGraph({ regionCode: 'au', path: '/tga-listed-cognitive-supplements/', title: 'TGA-Listed Cognitive Supplements (Australia): AUST L vs AUST R + Permitted Indications Guide', description: 'The TGA says supplying a therapeutic good in Australia in most cases involves entry in the ARTG, shown by an AUST L (listed) or AUST R (registered) number. Explainer of TGA listing categories, permitted indications, the Advertising Code, Personal Importation Scheme limits, Poisons Standard scheduling, and the ARTG status of our Australian catalogue.' }),
  twitter: buildTwitter({ title: 'TGA-Listed Cognitive Supplements (Australia): AUST L vs AUST R + Permitted Indications Guide', description: 'The TGA says supplying a therapeutic good in Australia in most cases involves entry in the ARTG, shown by an AUST L (listed) or AUST R (registered) number. Explainer of TGA listing categories, permitted indications, the Advertising Code, Personal Importation Scheme limits, Poisons Standard scheduling, and the ARTG status of our Australian catalogue.' }),
};

interface ListingCategory {
  category: string;
  evidenceBar: string;
  permittedIndications: string;
  example: string;
}

const listingCategories: ListingCategory[] = [
  { category: 'AUST L (Listed)', evidenceBar: 'Lower-risk; pre-cleared ingredients only; manufacturer self-certifies efficacy.', permittedIndications: 'Limited to TGA pre-approved Permitted Indications list. Cannot include serious-form indications.', example: 'Our earlier copy cited AUST L 246877 for Blackmores Brain Active here; 246877 does not resolve (HTTP 404 and no row in either TGA database, checked 2026-10-06). TGA\'s cancellations-by-sponsor database lists two Blackmores Brain Active entries, ARTG 227270 (cancelled 18 September 2014) and ARTG 227319 (cancelled 17 May 2021), and the ARTG search returned no current entry (searched 2026-10-06).' },
  { category: 'AUST L(A) (Listed Assessed)', evidenceBar: 'Listed but with TGA assessment of efficacy claims; intermediate evidentiary bar.', permittedIndications: 'May use intermediate-form indications beyond standard AUST L list, subject to assessment.', example: 'Less common; growing category for premium evidence-graded products' },
  { category: 'AUST R (Registered)', evidenceBar: 'Higher-risk products; full TGA evaluation of safety, quality, and efficacy.', permittedIndications: 'Approved indications based on submitted clinical data. May include serious-form indications.', example: 'Less common for cognitive supplements; more typical for prescription-adjacent products' },
];

// ARTG status of every AU catalogue record (active and discontinued). Every
// record was queried directly on 2026-10-06 in the ARTG search
// (tga.gov.au/resources/artg?keywords=) and in the TGA cancellations-by-sponsor
// database, by product name and by sponsor; the queries quoted below are the
// ones logged in the 2026-10-06 register check. A no-entry result is published
// only as "no matching entry returned for these queries on that date", never
// as "not on the ARTG". Blackmores Brain Active is the only record with ARTG
// history (two sponsor-cancelled entries); do not add an AUST number without
// an ARTG hit.
interface ArtgRow {
  slug: string;
  name: string;
  found: string;
  note: string;
}

const quoteList = (qs: string[]) => qs.map(q => `'${q}'`).join(', ').replace(/, ([^,]*)$/, ' or $1');
const noEntry = (product: string[], sponsor: string[]) =>
  `No matching entry returned for ${quoteList(product)} or sponsor ${quoteList(sponsor)} in the ARTG search or the cancellations-by-sponsor database (tga.gov.au, searched 2026-10-06)`;
const PERFORMANCE_LAB_SPONSOR = ['Performance Lab', 'Opti-Nutra', 'Optinutra'];
const PERFORMANCE_LAB_NOTE = 'Sold direct through performancelab.com; no AUST number shown on the product page.';

const artgRows: ArtgRow[] = [
  { slug: 'mind-lab-pro-review', name: 'Mind Lab Pro', found: noEntry(['Mind Lab Pro'], PERFORMANCE_LAB_SPONSOR), note: 'Sold direct through the brand\'s Australian storefront (au.mindlabpro.com); no AUST number shown on the storefront product page.' },
  { slug: 'noocube-review', name: 'NooCube', found: noEntry(['NooCube'], ['Wolfson Brands', 'Wolfson']), note: 'Sold direct through the brand\'s Australian storefront (noocube.com.au); no AUST number shown on the storefront product page.' },
  { slug: 'performance-lab-mind-review', name: 'Performance Lab Mind', found: noEntry(['Performance Lab Mind'], PERFORMANCE_LAB_SPONSOR), note: 'Sold direct through the brand\'s own storefront; no AUST number shown on the storefront product page.' },
  { slug: 'hunter-focus-review', name: 'Hunter Focus', found: noEntry(['Hunter Focus'], ['Roar Ambition']), note: 'Sold as an international direct-to-consumer import. The single-word query \'Roar\' matched only unrelated products in the 25 results read of each register (87 fuzzy matches in the ARTG search, 28 in the cancellations database).' },
  { slug: 'onnit-alpha-brain-review', name: 'Alpha Brain', found: noEntry(['Alpha Brain', 'Alpha BRAIN Instant'], ['Onnit Labs']), note: 'Sold as an international direct-to-consumer import. \'Alpha Brain\' was searched as a quoted phrase (the unquoted query matched four unrelated brain formulas), and \'Onnit Labs\' matched two unrelated device entries in the ARTG search. The single-word sponsor query \'Onnit\' was inconclusive: the search expands it to "unit" (1,587 fuzzy matches in the ARTG search, 1,407 in the cancellations database), and only the first 25 of each were read.' },
  { slug: 'qualia-mind-review', name: 'Qualia Mind', found: noEntry(['Qualia Mind'], ['Qualia Life Sciences', 'Neurohacker']), note: 'Sold as an international direct-to-consumer import. The single-word query \'Qualia\' matched only "Qualitative" diagnostic assays.' },
  { slug: 'naturebell-ginkgo-ginseng-review', name: 'NatureBell Ginkgo + Ginseng', found: noEntry(['NatureBell Ginkgo Ginseng'], ['NatureBell']), note: 'Sold on Amazon.com.au as an imported supplement. The quoted phrase "Ginkgo Ginseng" returned one ARTG entry (138142, Sharp Mind Advanced Formula, sponsor Pro Ma Systems Aust Pty Ltd), which is not a NatureBell product.' },
  { slug: 'blackmores-brain-active-review', name: 'Blackmores Brain Active', found: 'No current entry returned in the ARTG search (searched 2026-10-06); two cancelled entries, 227270 and 227319, in the cancellations-by-sponsor database', note: 'TGA\'s cancellations-by-sponsor database lists ARTG 227270, cancelled 18 September 2014 under s30(1)(c), sponsor Blackmores Limited, and a second entry, ARTG 227319, cancelled 17 May 2021 (Blackmores Ltd). Our earlier copy cited AUST L 246877; 246877 does not resolve (HTTP 404 and no row in either database, checked 2026-10-06).' },
  { slug: 'performance-lab-caffeine-2-review', name: 'Performance Lab Caffeine 2', found: noEntry(['Performance Lab Caffeine'], PERFORMANCE_LAB_SPONSOR), note: PERFORMANCE_LAB_NOTE },
  { slug: 'pre-lab-pro-review', name: 'Pre Lab Pro', found: noEntry(['Pre Lab Pro'], PERFORMANCE_LAB_SPONSOR), note: `${PERFORMANCE_LAB_NOTE} 'Pre Lab Pro' was searched as a quoted phrase; the unquoted query matched only unrelated products.` },
  { slug: 'performance-lab-energy-review', name: 'Performance Lab Energy', found: noEntry(['Performance Lab Energy'], PERFORMANCE_LAB_SPONSOR), note: PERFORMANCE_LAB_NOTE },
  { slug: 'performance-lab-omega-3-review', name: 'Performance Lab Omega-3', found: noEntry(['Performance Lab Omega-3'], PERFORMANCE_LAB_SPONSOR), note: PERFORMANCE_LAB_NOTE },
];

// Fail the build if the table drifts from the catalogue (a record added,
// removed or renamed without an ARTG check).
{
  const catalogue = new Map(allProductsAU.map(p => [p.slug, p.name]));
  const rowSlugs = new Set(artgRows.map(r => r.slug));
  const drift = [
    ...artgRows.filter(r => catalogue.get(r.slug) !== r.name).map(r => `row ${r.slug}`),
    ...[...catalogue.keys()].filter(slug => !rowSlugs.has(slug)).map(slug => `missing ${slug}`),
    ...(rowSlugs.size !== artgRows.length ? ['duplicate rows'] : []),
  ];
  if (drift.length) {
    throw new Error(`ARTG status table out of sync with products-au.json: ${drift.join(', ')}`);
  }
}

interface ScheduleRow {
  substance: string;
  schedule: string;
  entry: string;
}

// Poisons Standard F2026L01327, the Therapeutic Goods (Poisons Standard—October
// 2026) Instrument 2026: registered 30 September 2026, commenced 1 October 2026
// under its own section 2 table, and repealed the June 2026 instrument
// (section 4). Entry text is the instrument's own wording as extracted on
// 2026-10-08 (research p5, items poisons-*); the text extract drops hyphens,
// which are restored here as printed in the instrument's names.
const scheduleRows: ScheduleRow[] = [
  { substance: 'Phenibut', schedule: 'Schedule 9 — Prohibited Substance', entry: 'PHENIBUT cross reference: BETA-PHENYL-GAMMA-AMINOBUTYRIC ACID (CAS No. 1078-21-3), PHENIBUT HYDROCHLORIDE (CAS No. 3060-41-1), PHENIBUT HYDROBROMIDE (CAS No. 103095-38-1) Schedule 9' },
  { substance: 'Aniracetam, methylphenylpiracetam, nefiracetam, oxiracetam, phenylpiracetam, piracetam (racetams)', schedule: 'Schedule 4 — Prescription Only Medicine (each a separate entry, plus a RACETAMS class entry)', entry: 'ANIRACETAM. … METHYLPHENYLPIRACETAM. … NEFIRACETAM. … OXIRACETAM. … PHENYLPIRACETAM. … PIRACETAM. … RACETAMS except when separately specified in these Schedules. (Schedule 4; each racetam\'s index line reads "cross reference: RACETAMS")' },
  { substance: 'Noopept (listed as omberacetam)', schedule: 'Schedule 4 — Prescription Only Medicine', entry: 'OMBERACETAM. (Schedule 4) … Index: OMBERACETAM cross reference: RACETAMS, NOOPEPT, N-PHENYLACETYL-L-PROLYLGLYCINE ETHYL ESTER Schedule 4' },
  { substance: 'Modafinil and armodafinil', schedule: 'Schedule 4 — Prescription Only Medicine', entry: 'MODAFINIL Schedule 4 … ARMODAFINIL Schedule 4' },
  { substance: 'Huperzine A', schedule: 'No entry found under these names', entry: 'No entry under "huperz", "huperzia" or "huperzine" in the text of the current Poisons Standard (name-level search, checked 2026-10-08).' },
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
  { q: 'What is the difference between AUST L and AUST R?', a: 'AUST L ("listed") medicines have not been assessed by the TGA for efficacy before sale. AUST L(A) ("assessed listed") and AUST R ("registered") medicines undergo pre-market efficacy assessment.' },
  { q: 'What are "permitted indications"?', a: 'Permitted Indications are the specific health claim phrasings the TGA has pre-approved for AUST L medicines. AUST L sponsors may only make claims drawn from this list. Claims outside this list (for example, treating a named disease) push a product into the higher AUST R registration category.' },
  { q: 'What is the Therapeutic Goods Advertising Code?', a: 'The Therapeutic Goods (Therapeutic Goods Advertising Code) Instrument 2021 sets the rules for advertising therapeutic goods to the public in Australia. Restricted representations (references to serious diseases or conditions that need a health professional to diagnose or treat) cannot be used in advertising without the TGA\'s prior approval or permission. Prohibited representations include claims to treat, cure, prevent, diagnose or monitor cancer, sexually transmitted diseases, HIV, hepatitis C or mental illness. AUST L listed medicines may only use claim wording drawn from the TGA\'s pre-approved Permitted Indications list.' },
  { q: 'How much can I import under the Personal Importation Scheme?', a: 'The TGA states: "The import cannot be more than a 3-month supply at the maximum prescribed dose (prescription-only medicines) or dose recommended by the manufacturer (non-prescription medicine). The total quantity imported within any 12-month period must not exceed a 15-month supply." If the medicine is prescription-only in Australia, you must hold a valid Australian prescription or written authority at the time of importation, and the TGA says electronic prescriptions (eScripts) cannot be accepted as that written authority.' },
  { q: 'How is phenibut scheduled in Australia?', a: 'Phenibut is listed in Schedule 9 (Prohibited Substance) of the current Poisons Standard, the Therapeutic Goods (Poisons Standard—October 2026) Instrument 2026 (F2026L01327), which commenced on 1 October 2026 (checked 2026-10-08). The entry also covers beta-phenyl-gamma-aminobutyric acid, phenibut hydrochloride and phenibut hydrobromide.' },
  { q: 'Are racetams, Noopept and modafinil prescription-only in Australia?', a: 'Yes. In the current Poisons Standard (F2026L01327, checked 2026-10-08), piracetam, phenylpiracetam, methylphenylpiracetam, aniracetam, oxiracetam and nefiracetam are each a separate Schedule 4 entry, and a class entry, "RACETAMS except when separately specified in these Schedules", is also Schedule 4. Noopept is listed as omberacetam: the instrument\'s index cross-references NOOPEPT to the Schedule 4 entry OMBERACETAM. Modafinil and armodafinil are Schedule 4 too, which the TGA labels Prescription Only Medicine.' },
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
          <span>TGA-Listed Cognitive Supplements</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last verified: 30 September 2026</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          TGA-Listed Cognitive Supplements (Australia) — AUST L vs AUST R + Permitted Indications
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          The Therapeutic Goods Administration (<abbr title="Therapeutic Goods Administration">TGA</abbr>) says a sponsor
          must obtain pre-market approval before a therapeutic good can be supplied in Australia, and that &ldquo;in most
          cases this involves entry of the product in the <strong>Australian Register of Therapeutic Goods (ARTG)</strong>&rdquo;.
          Entered medicines carry an <strong>AUST L</strong> (listed), <strong>AUST L(A)</strong> (listed
          assessed), or <strong>AUST R</strong> (registered) number. The TGA also states that &ldquo;the inclusion of a
          therapeutic good in the Australian Register of Therapeutic Goods (ARTG) is not an endorsement of that good by
          the Therapeutic Goods Administration (TGA)&rdquo; (<a href="https://www.tga.gov.au/products/regulations-all-products/advertising/specialised-advertising-issues-and-topics/claim-tga-approved-must-not-be-used-advertising" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">TGA, checked 6 October 2026</a>).
          Listed (AUST L) medicines have not been assessed by the TGA for
          efficacy before sale. None of the {artgRows.length} products in our Australian catalogue returned a current
          ARTG entry when we searched on 6 October 2026. This
          page explains what each category means, how to read AUST numbers on labels, and how the Therapeutic
          Goods Advertising Code 2021 governs claim language for cognitive products. It also covers the ARTG
          status of every product in our Australian catalogue, the{' '}
          <a href="#personal-importation" className="text-blue-700 underline">Personal Importation Scheme limits</a>, and{' '}
          <a href="#scheduling" className="text-blue-700 underline">how the current Poisons Standard schedules common nootropic substances</a>.
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

        <section id="artg-lookup" className="my-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">How to verify an AUST number</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 leading-relaxed space-y-2">
            <li>Locate the AUST L / AUST L(A) / AUST R number on the product label.</li>
            <li>Open the <a href="https://www.tga.gov.au/resources/artg" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">ARTG public summary search</a>.</li>
            <li>Enter the AUST number; verify sponsor name matches the brand, medicinal ingredients match the label, listing status is "active".</li>
            <li>If the listing is "cancelled" or details do not match, do not purchase.</li>
          </ol>
        </section>

        <section id="artg-status" className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">ARTG status of the products we review in Australia</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            On 6 October 2026 we queried all {artgRows.length} products in our Australian catalogue directly, by
            product name and by sponsor, in two TGA databases: the ARTG search
            (<code>tga.gov.au/resources/artg?keywords=</code>) and the cancellations-by-sponsor database
            (<code>tga.gov.au/resources/cancellations-by-sponsors?keywords=</code>). None returned a current ARTG
            entry. Blackmores Brain Active is the only one with an ARTG history: two entries, 227270 and 227319, both
            cancelled at the sponsor&apos;s request (in 2014 and 2021). A &ldquo;no matching entry&rdquo; result means
            only that the queries listed returned no matching row on that date; it does not prove a product was never
            entered under another name or sponsor, and the cancellations database covers sponsor-requested
            cancellations only.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <caption className="sr-only">ARTG status of each product in our Australian catalogue, searched 6 October 2026</caption>
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="p-3 border-b border-gray-200">Product</th>
                  <th scope="col" className="p-3 border-b border-gray-200">ARTG entry found?</th>
                  <th scope="col" className="p-3 border-b border-gray-200">Note</th>
                </tr>
              </thead>
              <tbody>
                {artgRows.map(r => (
                  <tr key={r.slug} className="align-top">
                    <th scope="row" className="p-3 border-b border-gray-200 text-left font-semibold">
                      <Link href={`/${r.slug}/`} className="text-green-700 underline">{r.name}</Link>
                    </th>
                    <td className="p-3 border-b border-gray-200 text-gray-700">{r.found}</td>
                    <td className="p-3 border-b border-gray-200 text-gray-700">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 italic mt-3">
            A product bought from overseas without an ARTG entry falls under the Personal Importation Scheme
            rules below. Verify any AUST number yourself with the ARTG search above.
          </p>
        </section>

        <section id="personal-importation" className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">The Personal Importation Scheme</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            In the TGA&apos;s words, the Personal Importation Scheme &ldquo;allows individuals to import therapeutic
            goods not entered in the Australian Register of Therapeutic Goods (ARTG), provided certain conditions
            are met.&rdquo; Products typically arrive by mail or courier from overseas.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-2 mb-3">
            <li>
              <strong>Quantity limits:</strong> &ldquo;The import cannot be more than a 3-month supply at the maximum
              prescribed dose (prescription-only medicines) or dose recommended by the manufacturer (non-prescription
              medicine). The total quantity imported within any 12-month period must not exceed a 15-month supply.&rdquo;
            </li>
            <li>
              <strong>Prescription-only medicines:</strong> &ldquo;If the medicine is prescription-only in Australia, you
              must hold a valid Australian prescription or written authority at the time of importation.&rdquo; The TGA
              adds that electronic prescriptions (eScripts) cannot be accepted as valid written authority for importation.
            </li>
            <li>
              <strong>What an import must not do:</strong> it must not include any vaping products, contain a controlled
              substance, or be prohibited under Australian Customs or quarantine rules. &ldquo;Counterfeit (fake) medicines
              and medical devices are prohibited from being imported under any circumstances.&rdquo;
            </li>
            <li>
              <strong>No TGA evaluation:</strong> &ldquo;Products imported under the Personal Importation Scheme are not
              evaluated by us, meaning their safety, quality and efficacy cannot be guaranteed.&rdquo;
            </li>
          </ul>
          <h3 className="font-bold text-gray-900 mt-5 mb-2">Travellers: a separate Australian Border Force exemption</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The mail-order scheme above is not the same as the Australian Border Force traveller exemption. Under that
            exemption you do not need a permit to bring in most prescription medicines if you arrive as a passenger on a
            ship or aircraft, the medicine is in your accompanied baggage, you carry a letter or copy of your prescription
            written in English, and the quantity does not exceed three months&apos; supply. The ABF lists substances the
            exemption does not cover, which need written permission from the Office of Drug Control: abortifacients,
            yohimbe (yohimbine), aminophenazone/amidopyrine/aminopyrine/dipyrone, amygdalin/laetrile, and hormones and
            peptides carried by athletes and sporting staff.
          </p>
        </section>

        <section id="scheduling" className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How the Poisons Standard schedules common nootropic substances</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Australia classifies medicines and poisons in the Poisons Standard. The current version is the
            Therapeutic Goods (Poisons Standard—October 2026) Instrument 2026 (F2026L01327), registered on
            30 September 2026 and in force from 1 October 2026 under its own commencement provision; it repealed
            the June 2026 instrument (checked 2026-10-08).
            In the TGA&apos;s scheduling table, Schedule 4 is Prescription Only Medicine, Schedule 8 is Controlled Drug
            and Schedule 9 is Prohibited Substance.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <caption className="sr-only">Poisons Standard schedule for common nootropic substances, F2026L01327 (checked 2026-10-08)</caption>
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="p-3 border-b border-gray-200">Substance</th>
                  <th scope="col" className="p-3 border-b border-gray-200">Schedule</th>
                  <th scope="col" className="p-3 border-b border-gray-200">Poisons Standard entry</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map(r => (
                  <tr key={r.substance} className="align-top">
                    <th scope="row" className="p-3 border-b border-gray-200 text-left font-semibold">{r.substance}</th>
                    <td className="p-3 border-b border-gray-200 text-gray-700">{r.schedule}</td>
                    <td className="p-3 border-b border-gray-200 text-gray-600 text-xs">{r.entry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 italic mt-3">
            A name-level search cannot rule out a class or generic entry that captures huperzine A. Separately,
            huperzine A and Huperzia serrata were not found under those names in Schedule 1 of the Therapeutic Goods
            (Permissible Ingredients) Determination (No. 2) 2026, F2026L00707, as compiled 17 September 2026 —
            Compilation No. 1, F2026C00940 (checked 2026-10-08); the TGA says an ingredient not listed in the
            Determination can&apos;t be used in listed or assessed listed medicines. We have also not confirmed how the Personal Importation
            Scheme conditions apply to each Schedule 4 substance, so check with the TGA before importing anything
            prescription-only.
          </p>
        </section>

        <section id="advertising-code" className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What the Advertising Code lets a listed medicine claim</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The Therapeutic Goods (Therapeutic Goods Advertising Code) Instrument 2021 is published on the Federal
            Register of Legislation as{' '}
            <a href="https://www.legislation.gov.au/F2021L01661/latest/text" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">F2021L01661</a>.
            The TGA says the Code ensures advertisements to the public &ldquo;promote their safe and proper use; do not
            mislead or deceive the consumer or create unrealistic expectations about product performance; support
            informed health care choices.&rdquo;
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-2">
            <li>AUST L listed medicines may only use claim wording drawn from the TGA&apos;s pre-approved Permitted Indications list.</li>
            <li>Restricted representations (references to serious diseases or conditions that need a health professional to diagnose or treat) cannot be used in advertising without the TGA&apos;s prior approval or permission.</li>
            <li>Prohibited representations include claims to treat, cure, prevent, diagnose or monitor cancer, sexually transmitted diseases, HIV, hepatitis C or mental illness. Vitamin products also must not be represented as a substitute for good nutrition or a balanced diet.</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            That is why this page describes each product only by its ARTG status and makes no therapeutic claims for it.
          </p>
        </section>

        <section id="where-to-buy" className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Where Australians buy nootropic supplements</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            In pharmacy retail, Chemist Warehouse listed Melrose FutureLab Cognition Nootropics 30 Capsules (a sage and
            bacopa formula) at AUD 24.98 against an RRP of AUD 49.95 when we checked on 30 September 2026. We did not
            check its ARTG entry; look up the AUST number on its label with the ARTG search above.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The imported stacks in our catalogue are sold direct through the brands&apos; own storefronts, such as
            au.mindlabpro.com and noocube.com.au, which makes each order a personal import rather than a purchase of a
            TGA-listed product.
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
            { type: 'Regulatory', label: 'Therapeutic Goods (Therapeutic Goods Advertising Code) Instrument 2021 (F2021L01661)', url: 'https://www.legislation.gov.au/F2021L01661/latest/text' },
            { type: 'Regulatory', label: 'TGA — Permitted Indications for listed medicines', url: 'https://www.tga.gov.au/resources/resource/guidance/permissible-indications-listed-medicines' },
            { type: 'Regulatory', label: 'TGA — Blackmores Brain Active: cancelled under s30(1)(c) (ARTG 227270; checked 2026-10-06)', url: 'https://www.tga.gov.au/resources/cancellations-by-sponsors/blackmores-brain-active-cancelled-under-s301c' },
            { type: 'Regulatory', label: 'TGA — Blackmores Brain Active: cancelled under Section 30(1)(c) of the Act (ARTG 227319; checked 2026-10-06)', url: 'https://www.tga.gov.au/resources/cancellations-by-sponsors/blackmores-brain-active-cancelled-under-section-301c-act' },
            { type: 'Regulatory', label: 'TGA — Cancellations by sponsors database (searched 2026-10-06)', url: 'https://www.tga.gov.au/resources/cancellations-by-sponsors' },
            { type: 'Regulatory', label: 'TGA — Supply a therapeutic good: "In most cases this involves entry of the product in the Australian Register of Therapeutic Goods (ARTG)" (checked 2026-10-06)', url: 'https://www.tga.gov.au/products/regulations-all-products/overview-applying-market-authorisation/supply-therapeutic-good' },
            { type: 'Regulatory', label: 'TGA — The claim \'TGA approved\' must not be used in advertising (ARTG inclusion is not an endorsement; checked 2026-10-06)', url: 'https://www.tga.gov.au/products/regulations-all-products/advertising/specialised-advertising-issues-and-topics/claim-tga-approved-must-not-be-used-advertising' },
            { type: 'Regulatory', label: 'TGA — Personal Importation Scheme', url: 'https://www.tga.gov.au/products/unapproved-therapeutic-goods/access-pathways/personal-importation-scheme' },
            { type: 'Regulatory', label: 'Australian Border Force — Medicines and substances (traveller exemption)', url: 'https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in/categories/medicines-and-substances' },
            { type: 'Regulatory', label: 'TGA — Scheduling basics for medicines and chemicals in Australia', url: 'https://www.tga.gov.au/products/regulations-all-products/ingredients-and-scheduling-medicines-and-chemicals/scheduling-national-classification-system/scheduling-basics-medicines-and-chemicals-australia' },
            { type: 'Regulatory', label: 'Therapeutic Goods (Poisons Standard—October 2026) Instrument 2026 (F2026L01327; in force from 1 October 2026, checked 2026-10-08)', url: 'https://www.legislation.gov.au/F2026L01327/latest/text' },
            { type: 'Regulatory', label: 'Therapeutic Goods (Permissible Ingredients) Determination (No. 2) 2026 (F2026L00707), as compiled 17 September 2026 (Compilation No. 1, F2026C00940; checked 2026-10-08)', url: 'https://www.legislation.gov.au/F2026L00707/latest/text' },
            { type: 'Regulatory', label: 'TGA — Permissible ingredients determination: "If an ingredient isn’t listed in the Determination, it can’t be used in listed or assessed listed medicines." (checked 2026-10-08)', url: 'https://www.tga.gov.au/products/regulations-all-products/ingredients-and-scheduling-medicines-and-chemicals/permissible-ingredients-determination' },
            { type: 'Regulatory', label: 'TGA — Therapeutic Goods Advertising Code Instrument 2021', url: 'https://www.tga.gov.au/resources/legislation/therapeutic-goods-therapeutic-goods-advertising-code-instrument-2021' },
            { type: 'Regulatory', label: 'TGA — Applying the Advertising Code', url: 'https://www.tga.gov.au/products/regulations-all-products/advertising/applying-advertising-code' },
            { type: 'Regulatory', label: 'TGA — Restricted and prohibited representations in advertising', url: 'https://www.tga.gov.au/products/regulations-all-products/advertising/applying-advertising-code/restricted-and-prohibited-representations-advertising' },
            { type: 'Regulatory', label: 'TGA — Understanding the legislative framework for listed medicines', url: 'https://www.tga.gov.au/resources/guidance/understanding-legislative-framework-listed-medicines' },
            { type: 'Retailer', label: 'Chemist Warehouse — Melrose FutureLab Cognition Nootropics 30 Capsules (checked 2026-09-30)', url: 'https://www.chemistwarehouse.com.au/buy/140891/melrose-futurelab-cognition-nootropics-30-capsules' },
            { type: 'Brand', label: 'Mind Lab Pro — Australian storefront (checked 2026-09-30)', url: 'https://au.mindlabpro.com' },
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
    </PublicShell>
  );
}
