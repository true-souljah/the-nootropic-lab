import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter, PublicShell } from '@nootropic/ui';
import { getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

// Every factual sentence on this page maps to the sourced fact sheet
// nootropics-research/2026-09/p5/sea-philippines.json (fetched 2026-09-30);
// the Nootropics Depot shipping row maps to sea-thailand.json (same brand page).
// Shipping statements come only from each brand's own FAQ/shipping page.
// Lazada PH (CAPTCHA), Mercury Drug and Shopee listings, and the status of
// Supershrooms' licence number in the FDA Verification Portal, were NOT
// verified — do not add claims about them without a fresh verified fetch.

const PATH = '/nootropics-in-the-philippines/';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Nootropics in the Philippines: FDA Registration, "No Approved Therapeutic Claims" and Personal-Import Limits';
const DESCRIPTION =
  'How the Philippines regulates nootropic supplements: FDA Philippines\' Certificate of Product Registration, the mandatory "NO APPROVED THERAPEUTIC CLAIMS" label, FDA Advisory 2023-2179 on an unregistered "Brain Booster Nootropics" product, the 500-gram personal-import limit and the PHP 10,000 de minimis threshold.';

// Date the facts below were last checked against their sources.
const VERIFIED_ON = '2026-09-30';
const VERIFIED_ON_LABEL = '30 September 2026';

const FDA_FAQ_URL = 'https://www.fda.gov.ph/faqs/';
const FDA_VERIFICATION_PORTAL_URL = 'https://verification.fda.gov.ph/';
const ADVISORY_2025_1552_URL =
  'https://www.fda.gov.ph/fda-advisory-no-2025-1552-public-health-warning-against-the-advertisement-promotion-marketing-and-use-of-food-dietary-supplements-for-therapeutic-purposes-and-indications/';
const ADVISORY_2023_2179_URL =
  'https://www.fda.gov.ph/fda-advisory-no-2023-2179-public-health-warning-against-the-purchase-and-consumption-of-the-unregistered-food-supplement-lx-nutrition-brain-booster-nootropics-dietary-supplement-no-approved-ther/';
const JOINT_CIRCULAR_URL = 'https://philippine-embassy.de/bringing-regulated-products-for-personal-use-into-the-philippines/';
const DE_MINIMIS_URL = 'https://customs.gov.ph/wp-content/uploads/2023/01/CAO-2-2016-ONAR-DE-MINIMIS.pdf';
const DDB_LIST_URL = 'https://ddb.gov.ph/wp-content/uploads/2025/08/Updated-Lists-of-controlled-substances-as-of-July-2025.pdf';
const SUPERSHROOMS_FAQ_URL = 'https://supershrooms.ph/pages/frequently-asked-questions';
const WATSONS_MEMO_PLUS_URL = 'https://www.watsons.com.ph/memo-plus-memo-plus-gold-dietary-supplement-sold-per-piece/p/BP_10045563';
const SOUTHSTAR_MEMO_PLUS_URL = 'https://southstardrug.com.ph/products/memo-plus-gold-capsule-30s';

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
  headline: 'Nootropics in the Philippines: FDA registration, "No Approved Therapeutic Claims" and personal-import limits',
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
    { '@type': 'ListItem', position: 2, name: 'Nootropics in the Philippines', item: PAGE_URL },
  ],
};

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
    status: 'Philippines named',
    detail: 'Its shipping FAQ lists the Philippines in its “partial list of territories we ship to”.',
    sourceLabel: 'mindlabpro.com shipping & returns',
    sourceUrl: 'https://www.mindlabpro.com/pages/shipping-returns',
  },
  {
    name: 'NooCube',
    reviewHref: '/noocube-review/',
    status: 'Not confirmed',
    detail: 'Its FAQ says “delivery times elsewhere may vary” and that products are dispatched from its closest warehouse in the USA, UK or Europe; the Philippines is not named.',
    sourceLabel: 'noocube.com FAQ',
    sourceUrl: 'https://noocube.com/',
  },
  {
    name: 'Nootropics Depot',
    reviewHref: '/nootropics-depot-lions-mane/',
    status: 'International shipping stated',
    detail: 'Its page states free international shipping on orders over US$200; the page we checked does not list individual countries, so confirm the Philippines at checkout.',
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
    q: 'What does "No approved therapeutic claims" on a supplement label mean?',
    a: 'FDA Advisory No. 2025-1552 states that food and dietary supplements must bear the label statement "NO APPROVED THERAPEUTIC CLAIMS", together with a precautionary statement on children, pregnant and lactating women where applicable. Advertising must also carry a Filipino-language reminder that the product is not a medicine and should not be used to treat any kind of disease.',
  },
  {
    q: 'How do I check whether a supplement is registered with FDA Philippines?',
    a: 'FDA Philippines directs consumers to its Verification Portal at verification.fda.gov.ph to check whether a food product or food supplement has been registered.',
  },
  {
    q: 'How much in supplements can I bring into the Philippines?',
    a: 'Under Joint Circular No. 1 of 22 June 2015 (Department of Health, FDA and Bureau of Customs), vitamins, supplements and health supplements intended as maintenance medicine may be brought in up to 500 grams total without prior FDA clearance. Separately, Bureau of Customs CAO No. 02-2016 sets the de minimis value at PHP 10,000 (FCA or FOB) or below, under which no duties or taxes are collected.',
  },
  {
    q: 'Is modafinil on the Philippines\' dangerous-drugs list?',
    a: 'Modafinil, phenibut, kratom and mitragynine do not appear by name in the Dangerous Drugs Board\'s Updated Lists of Scheduled Controlled Substances as of 6 July 2025. That list covers dangerous drugs and controlled precursors only; it does not settle whether a substance needs a prescription under FDA Philippines\' separate drug rules.',
  },
  {
    q: 'Does Mind Lab Pro ship to the Philippines?',
    a: 'Mind Lab Pro\'s own shipping FAQ names the Philippines in its partial list of territories it ships to.',
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
          <Link href="/countries/philippines/" className="hover:text-green-700">Philippines</Link>
          {' / '}
          <span>Nootropics in the Philippines</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last verified: <time dateTime={VERIFIED_ON}>{VERIFIED_ON_LABEL}</time></span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Nootropics in the Philippines: FDA registration, &ldquo;No Approved Therapeutic Claims&rdquo; and personal-import limits
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          FDA Philippines&apos; Advisory No. 2023-2179 warned the public not to purchase or consume
          &ldquo;LX Nutrition Brain Booster Nootropics Dietary Supplement&rdquo; because it was an unregistered food
          supplement. This guide explains the registration rules behind that warning, what the mandatory label statement
          means, how much you may bring in for personal use, and what the official lists say about controlled substances.
          Every factual statement below is backed by a source listed at the end of the page.
        </p>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">FDA Philippines&apos; registration rules for food supplements</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FDA Philippines states that processed food products, including food supplements, manufactured or distributed
              for trade must have a Certificate of Product Registration (CPR) before they are sold, offered for sale,
              distributed or promoted, under R.A. 9711 and A.O. 2014-0029.
            </p>
            <p>
              To check whether a food product or food supplement is registered, FDA Philippines points consumers to its{' '}
              <a href={FDA_VERIFICATION_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Verification Portal</a>.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">&ldquo;NO APPROVED THERAPEUTIC CLAIMS&rdquo;: the mandatory label statement</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FDA Advisory No. 2025-1552 states that food and dietary supplements must comply with strict labelling
              requirements, such as bearing the statement &ldquo;NO APPROVED THERAPEUTIC CLAIMS&rdquo; and the precautionary
              statement on children, pregnant and lactating women.
            </p>
            <p>
              The same advisory sets a mandatory Filipino-language advertising disclaimer:
            </p>
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
              &ldquo;MAHALAGANG PAALALA: ANG [NAME OF PRODUCT] AY HINDI GAMOT AT HINDI DAPAT GAMITING PANGGAMOT SA ANUMANG
              URI NG SAKIT.&rdquo;
            </blockquote>
            <p>
              In English: the product is not a medicine and should not be used to treat any kind of disease. We follow the
              same rule on this page, describing products by what they contain and where they are sold, not by what they
              might treat.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The regulator has already acted on a &ldquo;nootropics&rdquo; product</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              FDA Advisory No. 2023-2179 told the public &ldquo;NOT TO PURCHASE AND CONSUME the unregistered food
              supplement&rdquo; LX Nutrition Brain Booster Nootropics Dietary Supplement. The advisory turned on
              registration: the product had no Certificate of Product Registration.
            </p>
            <p>
              The practical lesson for buyers: before relying on any supplement sold in the Philippines, search its name
              in the FDA Verification Portal.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bringing nootropics into the Philippines for personal use</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Quantity.</strong> Joint Circular No. 1 of 22 June 2015, issued by the Department of Health, FDA and
              the Bureau of Customs, allows travellers to bring in &ldquo;Vitamins: supplements: health supplements intended
              as maintenance medicine: 500 grams total&rdquo; without prior FDA clearance, as reproduced on
              philippine-embassy.de.
            </p>
            <p>
              <strong>Duties and taxes.</strong> Bureau of Customs CAO No. 02-2016 states: &ldquo;The law sets the De
              Minimis Value at Php 10,000.00 (Ten Thousand Pesos) FCA or FOB or below.&rdquo; Imports at or below that value
              are not charged duties or taxes.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What the controlled-substance list says: modafinil, phenibut, kratom</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Modafinil, phenibut, kratom and mitragynine do not appear by name in the Dangerous Drugs Board&apos;s
              &ldquo;Updated Lists of Scheduled Controlled Substances&rdquo; as of 6 July 2025, which covers dangerous drugs
              and controlled precursors and essential chemicals.
            </p>
            <p>
              That finding is deliberately narrow. The list covers the Dangerous Drugs Board&apos;s schedules only. It does
              not establish whether a substance such as modafinil needs a prescription under FDA Philippines&apos; separate
              drug rules, which we did not check, so it is not a statement that any of these substances is unregulated.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Two Philippine products in our catalogue</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Memo Plus Gold.</strong> The Watsons Philippines listing states that each tablet contains 125 mg of
              Bacopa monnieri extract and 250 mg of dicalcium phosphate as an excipient. Southstar Drug&apos;s online store
              also lists it, describing it as a herbal food supplement formulated with Bacopa monnieri extract. See our{' '}
              <Link href="/memo-plus-gold-review/" className="text-green-700 underline">Memo Plus Gold review</Link> and the{' '}
              <Link href="/ingredients/bacopa-monnieri/" className="text-green-700 underline">Bacopa monnieri ingredient page</Link>.
            </p>
            <p>
              <strong>Supershrooms Focus Nootropic.</strong> Supershrooms&apos; FAQ states: &ldquo;Our products are
              manufactured in a GMP &amp; ISO certified facility, which is registered with the US FDA. Our FDA License No. is
              CFRR-NCR-FI/W-703236.&rdquo; We note one observation: the FAQ describes the registration as a US FDA one, while
              the licence number follows the format used by FDA Philippines&apos; Center for Food Regulation and Research
              (CFRR). We could not look the number up in the FDA Verification Portal for this guide, so we make no finding on
              its status; you can search it there yourself. See our{' '}
              <Link href="/supershrooms-focus-nootropic-review/" className="text-green-700 underline">Supershrooms Focus Nootropic review</Link>.
            </p>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Which international brands say they ship to the Philippines</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We only report shipping from each brand&apos;s own FAQ or shipping page. For the other imported products in
              our Southeast Asia catalogue we did not confirm Philippines shipping from a brand page for this guide, so we
              make no claim either way; check at checkout.
            </p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-200">
              <caption className="text-left text-xs text-gray-500 mb-2">Brand-page shipping statements (checked {VERIFIED_ON_LABEL})</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Product</th>
                  <th scope="col" className="text-left p-3 border-b border-gray-200">Philippines</th>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Filipinos buy nootropics</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The retail listings we confirmed for this guide are Memo Plus Gold on{' '}
              <a href={WATSONS_MEMO_PLUS_URL} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Watsons Philippines</a>{' '}
              and on{' '}
              <a href={SOUTHSTAR_MEMO_PLUS_URL} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Southstar Drug</a>.
              We could not load Lazada Philippines&apos; listing (it returned an anti-bot check), and we did not check
              Mercury Drug or Shopee, so we do not list them.
            </p>
            <p>
              For the buying comparison across the region, use our{' '}
              <Link href="/best-nootropics/" className="text-green-700 underline">best nootropics in Southeast Asia roundup</Link>;
              if you are new to the category, start with{' '}
              <Link href="/guides/what-are-nootropics/" className="text-green-700 underline">what nootropics are</Link>.
              Neighbouring market: our{' '}
              <Link href="/nootropics-in-thailand/" className="text-green-700 underline">guide to nootropics in Thailand</Link>.
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
            { type: 'Regulator', label: 'FDA Philippines — FAQs (Certificate of Product Registration; verification)', url: FDA_FAQ_URL },
            { type: 'Registry', label: 'FDA Philippines — Verification Portal', url: FDA_VERIFICATION_PORTAL_URL },
            { type: 'Regulator', label: 'FDA Philippines — Advisory No. 2025-1552 (supplement labelling and advertising)', url: ADVISORY_2025_1552_URL },
            { type: 'Regulator', label: 'FDA Philippines — Advisory No. 2023-2179 (unregistered "Brain Booster Nootropics" product)', url: ADVISORY_2023_2179_URL },
            { type: 'Government notice', label: 'Joint Circular No. 1 (2015) — bringing regulated products for personal use into the Philippines (philippine-embassy.de)', url: JOINT_CIRCULAR_URL },
            { type: 'Regulator', label: 'Bureau of Customs — CAO No. 02-2016, de minimis value (PDF)', url: DE_MINIMIS_URL },
            { type: 'Regulator', label: 'Dangerous Drugs Board — Updated Lists of Scheduled Controlled Substances, as of July 2025 (PDF)', url: DDB_LIST_URL },
            { type: 'Brand page', label: 'Supershrooms — frequently asked questions', url: SUPERSHROOMS_FAQ_URL },
            { type: 'Retailer', label: 'Watsons Philippines — Memo Plus Gold listing', url: WATSONS_MEMO_PLUS_URL },
            { type: 'Retailer', label: 'Southstar Drug — Memo Plus Gold listing', url: SOUTHSTAR_MEMO_PLUS_URL },
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
          <Link href="/countries/philippines/" className="text-green-700 underline">← Nootropics in the Philippines: country page</Link>
          {' · '}
          <Link href="/guides/" className="text-green-700 underline">All guides</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </PublicShell>
  );
}
