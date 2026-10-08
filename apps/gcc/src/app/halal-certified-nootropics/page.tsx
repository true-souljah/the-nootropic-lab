import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell} from '@nootropic/ui';
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PAGE_URL = `${SITE_URL}/halal-certified-nootropics/`;
const auditDateIso = new Date().toISOString().split('T')[0];


export const metadata: Metadata = {
  title: 'Halal-Certified Cognitive Supplements (GCC): Capsule Source, Certifying Authorities & SFDA Status',
  description:
    'GCC consumers expect Halal-certified supplements. Capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. Guide to Halal certifying authorities and what we could confirm about their recognition in the GCC, plus audit of our nootropic catalog.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/halal-certified-nootropics/', availableInRegions: ['gcc'] }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/halal-certified-nootropics/', title: 'Halal-Certified Cognitive Supplements (GCC): Capsule Source, Certifying Authorities & SFDA Status', description: 'GCC consumers expect Halal-certified supplements. Capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. Guide to Halal certifying authorities and what we could confirm about their recognition in the GCC, plus audit of our nootropic catalog.' }),
  twitter: buildTwitter({ title: 'Halal-Certified Cognitive Supplements (GCC): Capsule Source, Certifying Authorities & SFDA Status', description: 'GCC consumers expect Halal-certified supplements. Capsule shells (gelatin vs HPMC vegetable cellulose) are a meaningful differentiator. Guide to Halal certifying authorities and what we could confirm about their recognition in the GCC, plus audit of our nootropic catalog.' }),
};

interface HalalAuthority {
  authority: string;
  country: string;
  recognisedIn: string;
  notes: string;
}

// Recognition is stated only where a fetched official page supports it
// (nootropics-research/2026-09/p5/gcc-halal.json, re-checked 2026-10-05).
const RECOGNITION_NOT_CONFIRMED = 'Not confirmed in our 2026-10-05 check';

const halalAuthorities: HalalAuthority[] = [
  { authority: 'JAKIM (Department of Islamic Development Malaysia)', country: 'Malaysia', recognisedIn: RECOGNITION_NOT_CONFIRMED, notes: 'Malaysian certifier. Its acceptance by individual GCC regulators was not confirmed.' },
  { authority: 'MUI (Indonesian Ulema Council) / BPJPH', country: 'Indonesia', recognisedIn: RECOGNITION_NOT_CONFIRMED, notes: 'Since 2024, BPJPH (Halal Product Assurance Agency) issues certificates with technical assessment by MUI. Mandatory for food and beverages since 17 October 2024; for health supplements the phase-in ends 17 October 2026 and the obligation applies from 18 October 2026, imports included (Government Regulation 42/2024, Art. 145 and 161; BPJPH).' },
  { authority: 'Halal Food Authority (HFA) / Halal Monitoring Committee (HMC)', country: 'United Kingdom', recognisedIn: RECOGNITION_NOT_CONFIRMED, notes: 'Two separate UK halal certifiers: HFA describes itself as a UK halal certification body (halalfoodauthority.com), and HMC is a registered charity in England and Wales offering halal food certification (halalhmc.org), both checked 2026-10-05. Their acceptance by individual GCC regulators was not confirmed.' },
  { authority: 'IFANCA (Islamic Food and Nutrition Council of America)', country: 'United States', recognisedIn: RECOGNITION_NOT_CONFIRMED, notes: 'U.S.-based certifier. Its acceptance by individual GCC regulators was not confirmed.' },
  { authority: 'Halal certification bodies accredited by the GCC Accreditation Center (GAC)', country: 'GCC', recognisedIn: RECOGNITION_NOT_CONFIRMED, notes: 'GAC states on gac.org.sa (checked 2026-10-05) that it provides accreditation services for halal certification bodies according to the GCC Standardization Organization (GSO) standard GSO 2055-2:2021. Which bodies GAC has accredited, and how each GCC state treats their certificates, was not confirmed.' },
  { authority: 'SFDA-approved local certifiers', country: 'Saudi Arabia', recognisedIn: RECOGNITION_NOT_CONFIRMED, notes: 'The Saudi Halal Center runs halal.gov.sa; its certification requirements could not be read in our 2026-10-05 check because the site is script-rendered.' },
  { authority: 'MoIAT Halal National Mark (UAE Ministry of Industry and Advanced Technology)', country: 'United Arab Emirates', recognisedIn: 'United Arab Emirates (national conformity mark)', notes: 'Issued by the Department of Conformity at the UAE Ministry of Industry and Advanced Technology under Cabinet Decree 10/2014, as a national conformity mark for products, services and production systems.' },
];

// Verified 2026-09-29 against each brand's own page (fact sheet:
// nootropics-research/2026-09/p5/gcc-halal.json); the rows dated 2026-10-07
// were re-checked that day (p5/halal-evidence.json). "No halal certificate is
// claimed" means none was found on that page, not that the product is not halal.
const AUDIT_CHECKED_ON = '29 September 2026';

interface CapsuleAuditRow {
  slug: string;
  name: string;
  format: string;
  halalClaim: string;
  sourceLabel: string;
  sourceUrl: string;
}

const capsuleAudit: CapsuleAuditRow[] = [
  { slug: 'mind-lab-pro-review', name: 'Mind Lab Pro', format: 'NutriCaps capsules made from pullulan (fermented tapioca), marketed as vegan.', halalClaim: 'No halal certificate is claimed on the brand’s page.', sourceLabel: 'mindlabpro.com — Ingredients', sourceUrl: 'https://www.mindlabpro.com/pages/ingredients' },
  { slug: 'noocube-review', name: 'NooCube', format: 'The brand says “Now Suitable for Vegetarians” and that its magnesium stearate “was upgraded to vegetable magnesium stearate derived from plants”. The capsule material is not named on the brand’s homepage (checked 2026-10-07).', halalClaim: 'No halal certificate is claimed on the brand’s page (checked 2026-10-07).', sourceLabel: 'noocube.com', sourceUrl: 'https://noocube.com/' },
  { slug: 'qualia-mind-review', name: 'Qualia Mind', format: 'Serving size “6 Vegetarian Capsules”; hypromellose is listed in “Other Ingredients” (brand product page, checked 2026-10-07).', halalClaim: 'No halal certificate is claimed on the brand’s page (checked 2026-10-07).', sourceLabel: 'qualialife.com — Qualia Mind', sourceUrl: 'https://www.qualialife.com/shop/qualia-mind' },
  { slug: 'onnit-alpha-brain-review', name: 'Onnit Alpha Brain', format: 'The brand says “The original Alpha BRAIN® formula is vegetarian but not vegan.” The capsule material is not named on the product page (checked 2026-10-07).', halalClaim: 'No halal certificate is claimed on the brand’s pages (checked 2026-10-07).', sourceLabel: 'onnit.com — Alpha Brain', sourceUrl: 'https://www.onnit.com/products/alpha-brain-90-ct' },
  { slug: 'thesis-nootropics-review', name: 'Thesis', format: 'The brand’s FAQ says “All our ingredients are vegan and free from gluten, eggs, and nuts”, without a certified-vegan guarantee. The capsule material is not named on the Clarity product page (checked 2026-10-07).', halalClaim: 'No halal certificate is claimed on the brand’s pages (checked 2026-10-07).', sourceLabel: 'takethesis.com — Clarity', sourceUrl: 'https://takethesis.com/products/clarity' },
  { slug: 'nootropics-depot-lions-mane', name: 'Nootropics Depot Lion’s Mane', format: 'The product page carries “LACTOSE FREE”, “GLUTEN FREE”, “NON-GMO” and “VEGAN” badges. The capsule material is not named on the product page (checked 2026-10-07).', halalClaim: 'No halal certificate is claimed on the brand’s page (checked 2026-10-07).', sourceLabel: 'nootropicsdepot.com — Lion’s Mane 8:1 Extract capsules', sourceUrl: 'https://nootropicsdepot.com/lions-mane-mushroom-capsules-8-1-extract' },
  { slug: 'eu-yan-sang-brainmax-review', name: 'Eu Yan Sang BrainMAX+', format: 'Sold as 3g sachets (30 per box), not capsules, so there is no capsule shell.', halalClaim: 'BrainMAX+ is not among the 77 items in the Singapore store’s “Halal Certified” category, and its product page has no halal text (checked 2026-10-07).', sourceLabel: 'euyansang.com.sg — BrainMAX+', sourceUrl: 'https://www.euyansang.com.sg/en/brainmax-888842543107.html' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal-Certified Cognitive Supplements in the GCC',
  description: 'Guide to Halal certifying authorities and what we could confirm about their recognition in the GCC, capsule-shell composition, and SFDA registration status for cognitive supplements.',
  datePublished: '2026-05-05',
  dateModified: auditDateIso,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Halal-Certifying Authorities and GCC Recognition — Cognitive Supplements',
  description: 'Structured reference of Halal-certifying authorities and what we could confirm about their acceptance by Gulf Cooperation Council member states for dietary supplements.',
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
  { q: 'Why does Halal certification matter for nootropic supplements?', a: 'Two reasons. First, capsule shells: NOW Foods, a brand that sells halal-certified supplements, says its halal gelatin capsules use bovine- or fish-derived gelatin, never porcine; plant-based shells (HPMC, pullulan) avoid the gelatin question. Second, ingredients: alcohol used as a carrier in flavourings and some animal-derived additives, such as L-cysteine, need verification. Formal Halal certification confirms both elements have been audited.' },
  { q: 'What is HPMC and is it Halal?', a: 'HPMC (hydroxypropyl methylcellulose) is a plant-derived capsule material made from cellulose. Because it is plant-derived, the shell itself involves no animal sourcing. Not every plant-based capsule is HPMC: Mind Lab Pro uses pullulan capsules (NutriCaps), and most other brands in our GCC catalogue do not name their capsule material on their product pages (see the audit above). We surface capsule-source information where it is verifiable from manufacturer documentation.' },
  { q: 'Which Halal authority is most widely recognised in the GCC?', a: 'We could not confirm from an official page which foreign certifying bodies each GCC state accepts (2026-10-05 check). In the UAE, the Ministry of Industry and Advanced Technology (MoIAT) cites Cabinet Decree 10/2014, under which establishments must obtain halal certificates from certification bodies registered by the ministry. Check with the regulator in your state before relying on a particular certificate.' },
  { q: 'Can I trust a "Halal" claim without third-party certification?', a: 'A formal certification mark from a third-party certifying body carries more weight. Manufacturer self-declarations of "Halal" or "suitable for Halal diet" without third-party certification are weaker signals. We surface formal certifications where verifiable and never fabricate certifications. For products without formal certification but using HPMC capsules and no alcohol/animal extracts, we describe the ingredient and capsule source so consumers can make informed decisions.' },
  { q: 'What is SFDA and how does it differ from Halal certification?', a: 'The Saudi Food and Drug Authority regulates safety, efficacy, and quality of supplements sold in Saudi Arabia. SFDA registration confirms regulatory clearance to sell — separate from Halal certification, which addresses religious dietary compliance. A product may be SFDA-registered without Halal certification (and vice versa, in theory).' },
  { q: 'Is taking a nootropic permissible at all?', a: 'A fatwa published on islamweb.net (fatwa No. 354190, on taking nootropics) states that “the basic principle is that it is permissible to use every useful thing unless there is a reason to forbid it, such as if it causes harm”, and leaves the assessment of benefit and harm to medical specialists. It does not address whether a particular product’s ingredients or capsule meet halal requirements, which is the certification question this page covers. We report what the fatwa says; this page is not a religious ruling.' },
  { q: 'Is a vegetarian capsule the same as a halal-certified one?', a: 'No. “Vegetarian” or “vegan” describes where the ingredients come from; halal certification is a separate audit by a certifying body. NooCube and Onnit describe their products as vegetarian, and Mind Lab Pro markets its capsules as vegan, but none of those brand pages claims a halal certificate.' },
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
          GCC buyers ask two separate questions: is taking a nootropic permissible at all, and does a specific
          product meet halal requirements? For the second, two factors matter: <strong>capsule shell
          composition</strong> (gelatin requires Halal-slaughter provenance; HPMC vegetable cellulose is
          plant-derived) and <strong>ingredient sourcing</strong> (alcohol extracts and
          animal-derived ingredients require verification). This page covers what a published fatwa says on the
          first question, the main certifying authorities and what we could confirm about their recognition in the GCC, capsule-source
          taxonomy, and what each brand in our GCC catalogue says about its capsules. For our rankings, see{' '}
          <Link href="/best-nootropics/" className="text-green-700 underline">the best nootropics for the GCC</Link>.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Is it permissible to take a nootropic at all?</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            A fatwa published on{' '}
            <a href="https://www.islamweb.net/en/fatwa/354190/taking-nootropics-smart-drugs" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">islamweb.net (fatwa No. 354190)</a>{' '}
            states that &ldquo;the basic principle is that it is permissible to use every useful thing unless there is
            a reason to forbid it, such as if it causes harm&rdquo;, and leaves the assessment of benefit and harm to
            medical specialists.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The fatwa does not address whether a particular product&apos;s ingredients or capsule meet halal requirements.
            That is a separate, product-level question, and it is what the rest of this page covers. We report what
            the fatwa says; this page is not a religious ruling.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Capsule shell taxonomy</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-green-300 rounded-xl p-5 bg-green-50">
              <h3 className="font-bold text-green-900 mb-2">✓ HPMC / Pullulan (plant-based)</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hydroxypropyl methylcellulose (HPMC) and pullulan are plant-derived capsule materials, so the
                shell itself involves no animal sourcing. In the audit below, Mind Lab Pro states pullulan
                capsules and Qualia Mind lists hypromellose (HPMC).
              </p>
            </div>
            <div className="border border-amber-300 rounded-xl p-5 bg-amber-50">
              <h3 className="font-bold text-amber-900 mb-2">⚠ Bovine gelatin</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Needs Halal-slaughter provenance, which only formal certification can verify. In the absence
                of certification, treat as not-verified-Halal.
              </p>
            </div>
            <div className="border border-red-300 rounded-xl p-5 bg-red-50">
              <h3 className="font-bold text-red-900 mb-2">✗ Porcine gelatin</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                NOW Foods, a brand that sells halal-certified supplements, says in its halal FAQ (see Sources):
                &ldquo;Our halal gelatin-encapsulated supplements use either bovine- or fish-derived gelatin,
                never porcine.&rdquo; Check the capsule source on the supplement-facts panel before purchasing.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Halal-certifying authorities and what we could confirm</h2>
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

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">GSO 2055-1 and GSO 2055-2: product standard vs certifier standard</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The GCC Standardization Organization publishes two halal standards. <strong>GSO 2055-1:2015</strong>,
            &ldquo;Halal Food – Part 1: General Requirements&rdquo;, defines the general requirements for halal food
            along the chain, including receiving, preparation, packaging, labelling and halal food service.{' '}
            <strong>GSO 2055-2:2021</strong>, &ldquo;General Requirements for Halal Certification Bodies&rdquo;, sets
            the requirements for the bodies that certify products as halal.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            In short, 2055-1 covers what halal means for the product and 2055-2 covers who may certify it. GSO sells
            the full text of 2055-1 rather than publishing it free, and its store listing shows a revision in progress.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ingredient watch-outs beyond the capsule</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-2">
            <li>
              <strong>Gelatin source.</strong> NOW Foods, a brand that sells halal-certified supplements, says its
              halal gelatin capsules use bovine- or fish-derived gelatin, never porcine.
            </li>
            <li>
              <strong>L-cysteine (E920).</strong> A halal-diet guide from Ingredicheck notes that this additive
              &ldquo;can be synthesised, or derived from human hair, duck feathers, or hog (pig) hair&rdquo;, and states
              that pork-derived L-cysteine is haram.
            </li>
            <li>
              <strong>Alcohol in flavourings.</strong> The same guide notes that alcohol &ldquo;is routinely used as a
              carrier solvent in natural and artificial flavourings and never disclosed as such on the ingredient
              list&rdquo;.
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            We have not checked the full Supplement Facts panel of each product in our catalogue against these
            watch-outs; the audit below covers capsule material and the brands&apos; own halal claims.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our GCC catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsGCC.length} products</strong> in our GCC catalog. On {AUDIT_CHECKED_ON} we
            checked each brand&apos;s own product or ingredients page for its capsule material and for any halal
            certificate claim; rows marked &ldquo;checked 2026-10-07&rdquo; were re-checked on 7 October 2026.
            &ldquo;No halal certificate is claimed&rdquo; means we found none on that page, not that
            the product is not halal. We never fabricate certifications.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <caption className="sr-only">Capsule material and halal-certificate claims per product, from each brand&apos;s own page, checked {AUDIT_CHECKED_ON} (re-checked 2026-10-07 where a row says so)</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Product</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Capsule or format</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Halal certificate</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Source</th>
                </tr>
              </thead>
              <tbody>
                {capsuleAudit.map(row => (
                  <tr key={row.slug} className="border-t border-gray-200 align-top">
                    <th scope="row" className="text-left p-3 font-semibold">
                      <Link href={`/${row.slug}/`} className="text-green-700 underline">{row.name}</Link>
                    </th>
                    <td className="p-3 text-gray-800">{row.format}</td>
                    <td className="p-3 text-gray-800">{row.halalClaim}</td>
                    <td className="p-3">
                      <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                        {row.sourceLabel}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mt-4">
            &ldquo;Vegetarian&rdquo; or &ldquo;vegan&rdquo; on a label is not a halal certificate. Even Mind Lab Pro&apos;s
            own blog, answering &ldquo;Are nootropics halal?&rdquo;, says that for specific halal compliance &ldquo;you
            would need to check individual nootropic ingredients and manufacturing processes with appropriate
            certification authorities&rdquo;.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Whether each of these brands delivers to your country is a separate question; see{' '}
            <Link href="/which-nootropics-ship-to-the-gcc/" className="text-green-700 underline">which nootropic brands ship to the GCC</Link>.
          </p>
          <p className="text-xs text-gray-500 italic mt-3">
            Verify any halal claim directly with the certifying authority before purchasing.
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
            { type: 'Regulatory', label: 'UAE Ministry of Industry and Advanced Technology — Halal National Mark', url: 'https://moiat.gov.ae/en/programs/halal' },
            { type: 'Regulatory', label: 'GSO 2055-1:2015 — Halal Food, Part 1: General Requirements (GSO store)', url: 'https://www.gso.org.sa/store/standards/GSO:693304/GSO%202055-1:2015?lang=en' },
            { type: 'Regulatory', label: 'GSO 2055-2:2021 — General Requirements for Halal Certification Bodies (GSO store)', url: 'https://www.gso.org.sa/store/standards/GSO:790738/GSO%202055-2:2021?lang=en' },
            { type: 'Religious', label: 'islamweb.net — Fatwa No. 354190 on taking nootropics', url: 'https://www.islamweb.net/en/fatwa/354190/taking-nootropics-smart-drugs' },
            { type: 'Brand page', label: 'NOW Foods — Halal certification FAQs', url: 'https://www.nowfoods.com/healthy-living/FAQs/halal-certification-faqs' },
            { type: 'Editorial', label: 'Ingredicheck — Halal diet guide: pork-derived E-numbers and alcohol in flavourings', url: 'https://www.ingredicheck.app/blog/halal-diet-guide-pork-derived-e-numbers-alcohol-in-flavourings-and-certification-marks-explained' },
            { type: 'Brand page', label: 'Mind Lab Pro blog — Are nootropics ethical?', url: 'https://www.mindlabpro.com/blogs/nootropics/are-nootropics-ethical' },
            { type: 'Brand page', label: 'Thesis FAQ — Are your ingredients allergen-free and/or vegan?', url: 'https://thesis.applied.guide/hc/en-us/are-your-ingredients-allergen-free-andor-vegan' },
            { type: 'Brand page', label: 'Eu Yan Sang Singapore — Halal Certified category (77 items, checked 2026-10-07)', url: 'https://www.euyansang.com.sg/en/halal-2/?sz=500&start=0' },
            ...capsuleAudit.map(row => ({ type: 'Brand page', label: row.sourceLabel, url: row.sourceUrl })),
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
    </PublicShell>
  );
}
