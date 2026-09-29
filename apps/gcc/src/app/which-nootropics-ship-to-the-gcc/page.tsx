import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AffiliateDisclosure,
  SchemaOrg,
  Sources,
  buildAlternates,
  buildOpenGraph,
  buildTwitter,
  PublicShell,
} from '@nootropic/ui';
import { getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PATH = '/which-nootropics-ship-to-the-gcc/';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Which Nootropic Brands Ship to the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman?';
const DESCRIPTION =
  'Brand by brand, what each nootropic brand in our GCC catalogue says on its own website about delivery to the six Gulf states, checked 29 September 2026, plus the iHerb storefronts and what we could not confirm.';

// Date every brand page below was last checked. Sourced fact sheet:
// nootropics-research/2026-09/p5/gcc-what-ships.json (fetched 2026-09-29).
// Rule: a "does not ship" statement is only made where the brand's own FAQ or
// shipping page says so. Shopify meta.json country lists are never used.
const VERIFIED_ON = '2026-09-29';
const VERIFIED_ON_LABEL = '29 September 2026';

interface BrandRow {
  brand: string;
  reviewSlug: string;
  direct: string;
  sourceLabel: string;
  sourceUrl: string;
  fallback: string;
}

const brandRows: BrandRow[] = [
  {
    brand: 'Mind Lab Pro',
    reviewSlug: 'mind-lab-pro-review',
    direct:
      'Named: Saudi Arabia, the UAE, Qatar and Kuwait appear on the brand’s “partial list of territories we ship to”. Bahrain and Oman are not named on that list, which the page itself calls partial.',
    sourceLabel: 'Mind Lab Pro — Shipping & Returns',
    sourceUrl: 'https://www.mindlabpro.com/pages/shipping-returns',
    fallback: 'Bahrain and Oman: check at checkout.',
  },
  {
    brand: 'NooCube',
    reviewSlug: 'noocube-review',
    direct:
      'Not confirmed. The FAQ gives delivery windows for the UK and for Europe, Canada and Australia, then says “Delivery times elsewhere may vary”. No GCC state is named.',
    sourceLabel: 'NooCube — on-site FAQ',
    sourceUrl: 'https://noocube.com/',
    fallback: 'Check at checkout.',
  },
  {
    brand: 'Qualia Mind',
    reviewSlug: 'qualia-mind-review',
    direct:
      'Not direct. The FAQ limits direct international orders to Canada, the United Kingdom, Ireland, Australia and New Zealand, so Qualia does not ship direct to any GCC state.',
    sourceLabel: 'Qualia — Do we ship internationally?',
    sourceUrl: 'https://www.qualialife.com/faqs/do-we-ship-internationally',
    fallback: 'iHerb, which Qualia’s FAQ names for all other countries.',
  },
  {
    brand: 'Onnit Alpha Brain',
    reviewSlug: 'onnit-alpha-brain-review',
    direct: 'Could not confirm from the brand’s site (checked 2026-09-29). Its FAQ page showed no country list when we checked.',
    sourceLabel: 'Onnit — FAQ',
    sourceUrl: 'https://www.onnit.com/pages/faq',
    fallback: 'Check at checkout.',
  },
  {
    brand: 'Thesis',
    reviewSlug: 'thesis-nootropics-review',
    direct:
      'Could not confirm from the brand’s site (checked 2026-09-29). Its refund policy refers to orders to “other countries outside the US” but names none.',
    sourceLabel: 'Thesis — Refund Policy',
    sourceUrl: 'https://try.takethesis.com/policies/refund-policy',
    fallback: 'Check at checkout.',
  },
  {
    brand: 'Nootropics Depot',
    reviewSlug: 'nootropics-depot-lions-mane',
    direct:
      'Worldwide mail is offered, free on international orders of $200 or more, carried by Asendia. The shipping page names no GCC state.',
    sourceLabel: 'Nootropics Depot — Shipping',
    sourceUrl: 'https://nootropicsdepot.com/shipping/',
    fallback: 'Check at checkout.',
  },
  {
    brand: 'Eu Yan Sang BrainMAX+',
    reviewSlug: 'eu-yan-sang-brainmax-review',
    direct:
      'Not self-service. The Singapore store’s shipping page describes Singapore delivery; international orders go through an email enquiry.',
    sourceLabel: 'Eu Yan Sang Singapore — Shipping and Returns',
    sourceUrl: 'https://www.euyansang.com.sg/en/shipping-and-returns',
    fallback: 'Email the international-enquiry address on that page (comms@euyansang.com).',
  },
];

const iherbStorefronts = [
  { country: 'United Arab Emirates', host: 'ae.iherb.com', countrySlug: 'uae' },
  { country: 'Saudi Arabia', host: 'sa.iherb.com', countrySlug: 'saudi-arabia' },
  { country: 'Qatar', host: 'qa.iherb.com', countrySlug: 'qatar' },
  { country: 'Kuwait', host: 'kw.iherb.com', countrySlug: 'kuwait' },
  { country: 'Bahrain', host: 'bh.iherb.com', countrySlug: 'bahrain' },
  { country: 'Oman', host: 'om.iherb.com', countrySlug: 'oman' },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'gcc', path: PATH, availableInRegions: ['gcc'] }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Which nootropic brands ship to the GCC?',
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
    { '@type': 'ListItem', position: 2, name: 'Countries', item: `${SITE_URL}/countries/` },
    { '@type': 'ListItem', position: 3, name: 'Which nootropics ship to the GCC', item: PAGE_URL },
  ],
};

// Visible Q&A only — no FAQPage JSON-LD (retired portfolio-wide).
const faqs = [
  {
    q: 'Does Mind Lab Pro ship to the UAE and Saudi Arabia?',
    a: 'Mind Lab Pro’s Shipping & Returns page names Saudi Arabia, the United Arab Emirates, Qatar and Kuwait on its list of territories it ships to. Bahrain and Oman are not named, and the page calls the list partial, so for those two states check at checkout.',
  },
  {
    q: 'Can I order Qualia Mind directly from the Gulf?',
    a: 'Not from Qualia’s own shop. Its shipping FAQ lists Canada, the United Kingdom, Ireland, Australia and New Zealand for direct international orders and tells customers in all other countries to order through iHerb.',
  },
  {
    q: 'Why do you not say whether Onnit or Thesis ship to my country?',
    a: 'Because neither brand’s website showed us a list of countries when we checked on 29 September 2026. Thesis’s refund policy mentions orders to other countries outside the US but does not name them. We would rather say “not confirmed” than guess; the brand’s checkout will show whether your address is accepted.',
  },
  {
    q: 'Who pays import duties on an international order?',
    a: 'It depends on the brand. Mind Lab Pro’s terms make the international buyer the Importer of Record, and Nootropics Depot’s shipping page says additional customs duties and fees may apply on international orders. Read the brand’s own terms before you order.',
  },
  {
    q: 'Does a supplement need a halal certificate in the UAE?',
    a: 'To register a dietary supplement as a healthcare product, the Emirates Drug Establishment lists a “Halal certificate issued by certified authorities and organizations” among the required documents. That is a product-registration rule for companies, not a rule about what a person may order from abroad.',
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
          <Link href="/countries/" className="hover:text-green-700">Countries</Link>
          {' / '}
          <span>Which nootropics ship to the GCC</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last verified: <time dateTime={VERIFIED_ON}>{VERIFIED_ON_LABEL}</time></span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Which nootropic brands ship to the GCC?
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          This page records, brand by brand, what each brand in our GCC catalogue says on its own website about
          delivery to the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman. We checked every page on{' '}
          {VERIFIED_ON_LABEL}. Where a brand&apos;s own site does not say, we write &ldquo;not confirmed&rdquo; instead
          of guessing. For our product rankings, see{' '}
          <Link href="/best-nootropics/" className="text-green-700 underline">the best nootropics for the GCC</Link>.
        </p>

        <section
          aria-labelledby="verdict-heading"
          data-testid="verdict-box"
          className="my-8 bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <h2 id="verdict-heading" className="text-xl font-bold text-green-900 mb-3">The short answer</h2>
          <ul className="text-sm text-gray-800 leading-relaxed space-y-2">
            <li>
              <strong>Named by the brand:</strong> Mind Lab Pro&apos;s shipping page names Saudi Arabia, the UAE,
              Qatar and Kuwait.
            </li>
            <li>
              <strong>Not shipped direct:</strong> Qualia Mind&apos;s FAQ limits direct international orders to five
              countries outside the Gulf and points everyone else to iHerb.
            </li>
            <li>
              <strong>Not confirmed:</strong> NooCube, Onnit Alpha Brain and Thesis. Their own sites did not name a
              GCC state when we checked.
            </li>
            <li>
              <strong>Fallback:</strong> iHerb runs localized storefronts for all six GCC states.
            </li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Brand by brand: direct shipping to the GCC</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Each row quotes or summarises the brand&apos;s own FAQ, shipping or policy page. The source link is the
            page we read.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <caption className="sr-only">Direct shipping to the six GCC states, per each brand&apos;s own website, checked {VERIFIED_ON_LABEL}</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Brand</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Direct shipping to the GCC</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Source (brand page, checked {VERIFIED_ON})</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Fallback</th>
                </tr>
              </thead>
              <tbody>
                {brandRows.map(row => (
                  <tr key={row.brand} className="border-t border-gray-200 align-top">
                    <th scope="row" className="text-left p-3 font-semibold">
                      <Link href={`/${row.reviewSlug}/`} className="text-green-700 underline">{row.brand}</Link>
                    </th>
                    <td className="p-3 text-gray-800">{row.direct}</td>
                    <td className="p-3">
                      <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                        {row.sourceLabel}
                      </a>
                    </td>
                    <td className="p-3 text-gray-800">{row.fallback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mt-4">
            Mind Lab Pro&apos;s terms also say its products are shipped worldwide from the United States and the United
            Kingdom, with the international buyer acting as Importer of Record.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">The fallback: iHerb&apos;s GCC storefronts</h2>
          <AffiliateDisclosure />
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            iHerb&apos;s global-shipping page lists a localized storefront for each of the six GCC states. Qualia&apos;s
            own FAQ sends customers outside its five direct-shipping countries to iHerb. We did not check which of our
            catalogue products each storefront stocks, so search the storefront for your product before relying on it.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm list-none p-0 m-0">
            {iherbStorefronts.map(s => (
              <li key={s.host} className="border border-gray-200 rounded-lg p-3">
                <strong className="text-gray-900">{s.country}:</strong>{' '}
                <span className="text-gray-700">{s.host}</span>{' '}
                <span className="text-gray-500">·</span>{' '}
                <Link href={`/countries/${s.countrySlug}/`} className="text-green-700 underline">
                  our {s.country} guide
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What we could not confirm</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-2">
            <li>Whether Mind Lab Pro ships to Bahrain and Oman: they are not named on a list the brand calls partial.</li>
            <li>Whether NooCube delivers to any GCC state: its FAQ says only that delivery times elsewhere may vary.</li>
            <li>Onnit&apos;s and Thesis&apos;s country lists: neither brand&apos;s site showed one when we checked.</li>
            <li>Which of our catalogue products are listed on each iHerb GCC storefront.</li>
            <li>
              Personal-import quantity limits for any GCC state. We could not confirm them against a live official page
              on {VERIFIED_ON_LABEL}, so this page publishes none.
            </li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Customs and registration basics</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            In the UAE, the Emirates Drug Establishment registers dietary supplements as healthcare products, and its
            list of documents for a marketing authorization includes a &ldquo;Halal certificate issued by certified
            authorities and organizations&rdquo;. That applies to companies registering a product, not to a person
            ordering from abroad. Our{' '}
            <Link href="/halal-certified-nootropics/" className="text-green-700 underline">halal-certified nootropics guide</Link>{' '}
            covers certifying bodies and what each brand says about its capsules.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            For duties and fees on a personal order, the brand&apos;s own terms are the first place to look: Nootropics
            Depot says additional customs duties and fees may apply to international orders, and Thesis says it cannot
            take responsibility for delays to orders outside the US caused by individual customs regulations.
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
          heading="Brand and regulator pages we checked"
          sources={[
            ...brandRows.map(row => ({ type: 'Brand page', label: row.sourceLabel, url: row.sourceUrl })),
            { type: 'Brand page', label: 'Mind Lab Pro — Terms & Conditions', url: 'https://www.mindlabpro.com/pages/terms-conditions' },
            { type: 'Retailer', label: 'iHerb — Global shipping', url: 'https://www.iherb.com/info/globalshipping' },
            { type: 'Regulatory', label: 'Emirates Drug Establishment — Issuance of Marketing Authorization for a Healthcare Product', url: 'https://www.ede.gov.ae/en/w/issuance-of-marketing-authorization-for-a-healthcare-product' },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('gcc')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/countries/" className="text-green-700 underline">← All GCC country guides</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </PublicShell>
  );
}
