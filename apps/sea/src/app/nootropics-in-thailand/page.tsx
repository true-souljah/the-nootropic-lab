import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell } from '@nootropic/ui';
import { getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

// Every factual sentence on this page maps to the sourced fact sheet
// nootropics-research/2026-09/p5/sea-thailand.json (fetched 2026-09-30).
// Shipping statements come only from each brand's own FAQ/shipping page.
// Boots, Watsons and Shopee Thailand listings, the full Category 1-3
// narcotics schedule and phenibut's status under other Thai laws were NOT
// checked — do not add claims about them without a fresh verified fetch.

const PATH = '/nootropics-in-thailand/';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Nootropics in Thailand: Thai FDA Supplement Rules, Personal-Import Limits and Controlled Substances';
const DESCRIPTION =
  'How Thailand regulates nootropic supplements: Thai FDA (อย.) supplement licensing and its ban on cure claims, the personal-import limit for food supplements (15 pieces in total, each up to 3 months\' consumption), kratom\'s legal history, and which brands state on their own pages that they ship to Thailand.';

// Date the facts below were last checked against their sources.
const VERIFIED_ON = '2026-09-30';
const VERIFIED_ON_LABEL = '30 September 2026';

const PERSONAL_IMPORT_URL = 'https://en.fda.moph.go.th/guideline-of-importation-for-personal-use';
const HEALTH_PRODUCTS_IMPORT_URL =
  'https://en.fda.moph.go.th/guideline-of-importation-for-personal-use/bringing-of-health-products-into-the-kingdom-of-thailand-01/';
const KRATOM_URL = 'https://narcotic.fda.moph.go.th/information-about-drugs/kratom';
const PSYCHOTROPIC_LIST_URL =
  'https://en.fda.moph.go.th/media.php?id=801365744163102720&name=PHYCHOlist(update2025.07.2025).pdf';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'sea', path: PATH, availableInRegions: ['sea'] }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Nootropics in Thailand: Thai FDA supplement rules, personal-import limits and controlled substances',
  description: DESCRIPTION,
  datePublished: VERIFIED_ON,
  dateModified: VERIFIED_ON,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  mainEntityOfPage: PAGE_URL,
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Nootropics in Thailand', item: PAGE_URL },
  ],
};

interface ImportRow {
  category: string;
  limit: string;
  sourceUrl: string;
}

// Thai FDA personal-import guidance, quoted from the regulator's English pages.
const importRows: ImportRow[] = [
  {
    category: 'Food supplements',
    limit: '“Total of all items not exceeding 15 pieces”, and “each item has a quantity equivalent to 3 months of consumption by product”.',
    sourceUrl: PERSONAL_IMPORT_URL,
  },
  {
    category: 'Food (general)',
    limit: 'Must not exceed 10 kilograms or liters, and “it must not have been imported before within a period of 3 months”.',
    sourceUrl: PERSONAL_IMPORT_URL,
  },
  {
    category: 'Herbal products',
    limit: 'Quantities for personal use only, “not exceeding 90 days”.',
    sourceUrl: HEALTH_PRODUCTS_IMPORT_URL,
  },
  {
    category: 'Medicines',
    limit: 'The amount necessary for personal use, “up to 30 days”.',
    sourceUrl: HEALTH_PRODUCTS_IMPORT_URL,
  },
];

interface ShippingRow {
  name: string;
  reviewHref: string;
  status: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
}

// Brand-page statements only (fetched 2026-09-30).
const shippingRows: ShippingRow[] = [
  {
    name: 'Mind Lab Pro',
    reviewHref: '/mind-lab-pro-review/',
    status: 'Thailand named',
    detail: 'Its shipping FAQ lists Thailand in its “partial list of territories we ship to”.',
    sourceLabel: 'mindlabpro.com shipping & returns',
    sourceUrl: 'https://www.mindlabpro.com/pages/shipping-returns',
  },
  {
    name: 'NooCube',
    reviewHref: '/noocube-review/',
    status: 'Not confirmed',
    detail: 'Its FAQ gives delivery times for the US, UK, Europe, Canada and Australia and says “delivery times elsewhere may vary”; Thailand is not named.',
    sourceLabel: 'noocube.com FAQ',
    sourceUrl: 'https://noocube.com/',
  },
  {
    name: 'Nootropics Depot',
    reviewHref: '/nootropics-depot-lions-mane/',
    status: 'International shipping stated',
    detail: 'Its page states free international shipping on orders over US$200; the page we checked does not list individual countries, so confirm Thailand at checkout.',
    sourceLabel: 'nootropicsdepot.com Lion’s Mane page',
    sourceUrl: 'https://nootropicsdepot.com/buy-lions-mane/',
  },
  {
    name: 'Qualia Mind',
    reviewHref: '/qualia-mind-review/',
    status: 'Not on its list',
    detail: 'Its international-shipping FAQ lists only Canada, the UK, Ireland, Australia and New Zealand.',
    sourceLabel: 'qualialife.com international-shipping FAQ',
    sourceUrl: 'https://www.qualialife.com/faqs/do-we-ship-internationally',
  },
];

// Visible Q&A only — no FAQPage JSON-LD (retired portfolio-wide).
const faqs = [
  {
    q: 'How many supplements can I bring into Thailand for personal use?',
    a: 'Thai FDA\'s personal-import table sets the food-supplement limit as a total of all items not exceeding 15 pieces, with each item limited to a quantity equivalent to 3 months of consumption. Separate limits apply to herbal products and medicines, so check which category the product you are carrying falls into.',
  },
  {
    q: 'Is kratom still a narcotic in Thailand?',
    a: 'Kratom was a Category 5 narcotic under Thailand\'s 1979 Narcotics Act. The Narcotics Act (No. 8) B.E. 2564 (2021) removed it from that category with effect from 24 August 2021, and it is now governed by the Kratom Plant Act B.E. 2565 (2022), under the Ministry of Justice rather than Thai FDA.',
  },
  {
    q: 'Are modafinil and phenibut on Thailand\'s controlled psychotropic list?',
    a: 'Neither appears by name in Thai FDA\'s Table of Controlled Psychotropic Substances as updated on 25 July 2025. That table covers psychotropic substances only; we did not check the separate narcotics schedule or prescription-medicine rules, so this is not a statement that either substance is unregulated in Thailand.',
  },
  {
    q: 'Does Mind Lab Pro ship to Thailand?',
    a: 'Mind Lab Pro\'s own shipping FAQ names Thailand in its partial list of territories it ships to.',
  },
  {
    q: 'Can a supplement sold in Thailand claim to treat a disease?',
    a: 'Thai FDA\'s public guidance on supplement advertising says that if an advertisement claims a product can cure cancer, it is not a lawful dietary supplement.',
  },
];

export default function Page() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <Link href="/countries/thailand/" className="hover:text-green-700">Thailand</Link>
          {' / '}
          <span>Nootropics in Thailand</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last verified: <time dateTime={VERIFIED_ON}>{VERIFIED_ON_LABEL}</time></span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Nootropics in Thailand: Thai FDA rules, personal-import limits and controlled substances
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          In Thailand, dietary supplements (ผลิตภัณฑ์เสริมอาหาร) are licensed through Thai FDA (อย.). This guide
          covers how those products are licensed, what the regulator says about cure claims, how much you may
          bring in for personal use, what the official controlled-substance lists say about kratom, modafinil and
          phenibut, and which brands state on their own pages that they ship to Thailand. Every factual statement below
          is backed by a source listed at the end of the page.
        </p>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Thai law says about supplements (ผลิตภัณฑ์เสริมอาหาร)</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Thai FDA&apos;s Food Division publishes an official manual for dietary-supplement product licence applications
              (คู่มือการขออนุญาตผลิตภัณฑ์เสริมอาหาร). Since 27 October 2019, licensed producers and importers of dietary
              supplements have also been able to file applications through a &ldquo;1-Day Dietary Supplement&rdquo;
              (ผลิตภัณฑ์เสริมอาหาร 1 วัน) fast-track e-submission process.
            </p>
            <p>
              On advertising, Thai FDA&apos;s public guidance is blunt: if an advertisement says a product can cure cancer,
              it is not a lawful dietary supplement (&ldquo;หากโฆษณาระบุว่าสามารถรักษาโรคมะเร็งได้
              แสดงว่าไม่ใช่ผลิตภัณฑ์เสริมอาหารที่ถูกต้องตามกฎหมาย&rdquo;).
            </p>
            <p>
              We apply the same principle to this page: the products below are described by what they are and where they
              are sold, not by what they might treat.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bringing nootropics into Thailand for personal use</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Thai FDA publishes separate personal-import limits by product category. Food supplements have a limit of 15
              pieces in total across all items, with each item capped at 3 months&apos; consumption. The table quotes the
              regulator&apos;s English-language guidance.
            </p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-200">
              <caption className="text-left text-xs text-gray-500 mb-2">Thai FDA personal-import limits (checked {VERIFIED_ON_LABEL})</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Category</th>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Personal-use limit</th>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Source</th>
                </tr>
              </thead>
              <tbody>
                {importRows.map(row => (
                  <tr key={row.category} className="border-b border-gray-100 align-top">
                    <th scope="row" className="text-left p-3 font-semibold text-gray-900">{row.category}</th>
                    <td className="p-3 text-gray-700">{row.limit}</td>
                    <td className="p-3">
                      <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Thai FDA</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the controlled-substance lists say: kratom, modafinil, phenibut</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Kratom.</strong> According to Thai FDA&apos;s narcotics information page, kratom was a Category 5
              narcotic under the 1979 Narcotics Act. It was removed from that category with effect from 24 August 2021 by
              the Narcotics Act (No. 8) B.E. 2564 (2021), and is now governed by the Kratom Plant Act B.E. 2565 (2022),
              under the Ministry of Justice rather than Thai FDA.
            </p>
            <p>
              <strong>Modafinil and phenibut.</strong> Neither appears by name in Thai FDA&apos;s Table of Controlled
              Psychotropic Substances under the Narcotics Code, as updated on 25 July 2025. The table is organised in 4
              categories.
            </p>
            <p>
              That finding is deliberately narrow. The table covers psychotropic substances only. We did not check the
              separate narcotics schedule in full, prescription-medicine rules, or other Thai laws, so the absence of a
              name from this one table is not a statement that a substance is unregulated in Thailand.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Which brands say they ship to Thailand</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We only report shipping from each brand&apos;s own FAQ or shipping page. For the other products in our
              Southeast Asia catalogue we did not confirm Thailand shipping from a brand page for this guide, so we make
              no claim either way; check at checkout.
            </p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-200">
              <caption className="text-left text-xs text-gray-500 mb-2">Brand-page shipping statements (checked {VERIFIED_ON_LABEL})</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Product</th>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Thailand</th>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">What the brand&apos;s page says</th>
                </tr>
              </thead>
              <tbody>
                {shippingRows.map(row => (
                  <tr key={row.name} className="border-b border-gray-100 align-top">
                    <th scope="row" className="text-left p-3 font-semibold text-gray-900">
                      <Link href={row.reviewHref} className="text-green-700 underline">{row.name}</Link>
                    </th>
                    <td className="p-3 text-gray-700">{row.status}</td>
                    <td className="p-3 text-gray-700">
                      {row.detail}{' '}
                      <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">{row.sourceLabel}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Thais buy nootropics</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Lazada Thailand&apos;s nootropic tag page listed at least one nootropic-labelled product, a Lion&apos;s Mane
              &ldquo;10 Mushroom Complex&rdquo; capsule, when we checked it. For background on that ingredient, see our{' '}
              <Link href="/ingredients/lions-mane/" className="text-green-700 underline">Lion&apos;s Mane ingredient page</Link>.
            </p>
            <p>
              We did not check Boots, Watsons or Shopee Thailand for this guide, so we do not list them. For the buying
              comparison across the region, use our{' '}
              <Link href="/best-nootropics/" className="text-green-700 underline">best nootropics in Southeast Asia roundup</Link>;
              if you are new to the category, start with{' '}
              <Link href="/guides/what-are-nootropics/" className="text-green-700 underline">what nootropics are</Link>.
            </p>
            <p>
              Neighbouring market: our{' '}
              <Link href="/nootropics-in-the-philippines/" className="text-green-700 underline">guide to nootropics in the Philippines</Link>{' '}
              covers FDA Philippines&apos; rules. For halal certification across the region, see the{' '}
              <Link href="/halal-nootropics-indonesia-bpjph/" className="text-green-700 underline">halal nootropics guide</Link>.
            </p>
          </div>
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
          sources={[
            { type: 'Regulator', label: 'Thai FDA Food Division — dietary-supplement licence application manual (คู่มือการขออนุญาตผลิตภัณฑ์เสริมอาหาร)', url: 'https://food.fda.moph.go.th/public-information/supplement-guide/' },
            { type: 'Regulator', label: 'Thai FDA Food Division — e-submission system (1-Day Dietary Supplement process)', url: 'https://food.fda.moph.go.th/e-submission-system/' },
            { type: 'Regulator', label: 'Thai FDA — public guidance on dietary-supplement advertising', url: 'https://www.fda.moph.go.th/news/news1002569' },
            { type: 'Regulator', label: 'Thai FDA — guideline of importation for personal use (quantity table)', url: PERSONAL_IMPORT_URL },
            { type: 'Regulator', label: 'Thai FDA — bringing health products into the Kingdom of Thailand', url: HEALTH_PRODUCTS_IMPORT_URL },
            { type: 'Regulator', label: 'Thai FDA Narcotics Control Division — kratom (พืชกระท่อม)', url: KRATOM_URL },
            { type: 'Regulator', label: 'Thai FDA — Table of Controlled Psychotropic Substances (update 25.07.2025, PDF)', url: PSYCHOTROPIC_LIST_URL },
            { type: 'Retailer', label: 'Lazada Thailand — nootropic tag page', url: 'https://www.lazada.co.th/tag/nootropic/' },
            { type: 'Brand page', label: 'Mind Lab Pro — shipping & returns (territories)', url: 'https://www.mindlabpro.com/pages/shipping-returns' },
            { type: 'Brand page', label: 'NooCube — homepage FAQ (delivery times)', url: 'https://noocube.com/' },
            { type: 'Brand page', label: 'Qualia — do we ship internationally?', url: 'https://www.qualialife.com/faqs/do-we-ship-internationally' },
            { type: 'Brand page', label: 'Nootropics Depot — Lion’s Mane page (shipping policy)', url: 'https://nootropicsdepot.com/buy-lions-mane/' },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health &amp; regulatory note</strong>
          {getRegionalHealthDisclaimer('sea')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/countries/thailand/" className="text-green-700 underline">← Nootropics in Thailand: country page</Link>
          {' · '}
          <Link href="/guides/" className="text-green-700 underline">All guides</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </PublicShell>
  );
}
