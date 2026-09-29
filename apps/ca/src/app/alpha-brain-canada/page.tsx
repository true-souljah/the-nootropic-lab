import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AffiliateDisclosure,
  SchemaOrg,
  Sources,
  TrackedAffiliateLink,
  buildAlternates,
  buildOpenGraph,
  buildTwitter,
  PublicShell,
} from '@nootropic/ui';
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { searchItems, uiStrings } from '@/lib/search';
import { SITE_URL } from '@/lib/region';

const PATH = '/alpha-brain-canada/';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Alpha Brain in Canada: How to Buy It, What It Costs, and NPN-Licensed Alternatives';
const DESCRIPTION =
  'Onnit ships Alpha Brain to Canada from onnit.com, priced in US dollars only. Current USD list prices, what to expect on duties and GST/HST, where to buy, and the Health Canada NPN-licensed alternatives in our Canadian catalogue.';

// Date the facts below were last checked against their sources.
const VERIFIED_ON = '2026-09-28';
const VERIFIED_ON_LABEL = '28 September 2026';

// USD list prices read from Onnit's Shopify store feed on VERIFIED_ON:
//   https://www.onnit.com/products.json?limit=250
//   .products[handle == "alpha-brain-30-ct"].variants[0].price  → "34.95"
//   .products[handle == "alpha-brain-60-ct"].variants[0].price  → "57.95"
//   .products[handle == "alpha-brain-90-ct"].variants[0].price  → "79.95"
// Cross-checked the same day against the product pages below (embedded
// "price":3495 / 5795 / 7995 cents). Update all three together.
const onnitPrices = [
  { size: '30 capsules', usd: '34.95', url: 'https://www.onnit.com/products/alpha-brain-30-ct' },
  { size: '60 capsules', usd: '57.95', url: 'https://www.onnit.com/products/alpha-brain-60-ct' },
  { size: '90 capsules', usd: '79.95', url: 'https://www.onnit.com/products/alpha-brain-90-ct' },
];

const alphaBrain = productsCA.find(p => p.slug === 'onnit-alpha-brain-review');
// Only records whose npnStatus is `licensed` — Health Canada has issued an NPN.
const npnLicensed = productsCA.filter(p => p.npnStatus?.status === 'licensed');
const alphaBrainLicensed = alphaBrain?.npnStatus?.status === 'licensed';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates({ regionCode: 'ca', path: PATH, availableInRegions: ['ca'] }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: PATH, title: TITLE, description: DESCRIPTION }),
  twitter: buildTwitter({ title: TITLE, description: DESCRIPTION }),
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Alpha Brain in Canada: how to buy it, what it costs, and NPN-licensed alternatives',
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
    { '@type': 'ListItem', position: 2, name: 'Alpha Brain in Canada', item: PAGE_URL },
  ],
};

// Visible Q&A only — no FAQPage JSON-LD (retired portfolio-wide).
const faqs = [
  {
    q: 'Can I buy Alpha Brain in Canada?',
    a: 'Yes, by ordering from onnit.com. Onnit lists Canada among the countries its store ships to, and checkout is in US dollars. We could not confirm any Canadian retailer stocking Alpha Brain.',
  },
  {
    q: 'Is there a Canadian (CAD) Onnit store?',
    a: 'Not that we could find. Onnit’s store is configured in USD, and there is no separate Canadian storefront. Your card issuer converts the USD charge to Canadian dollars.',
  },
  {
    q: 'Will I pay duties or taxes on an Onnit order?',
    a: 'Possibly. Cross-border orders may attract customs duties, GST/HST and courier brokerage fees, which depend on the order value, the carrier and your province. We do not estimate these amounts; the Canada Border Services Agency publishes guidance on importing by mail or courier and a duty and taxes estimator.',
  },
  {
    q: 'Does Alpha Brain have a Health Canada NPN?',
    a: alphaBrainLicensed
      ? `Our catalogue record lists Alpha Brain as NPN-licensed${alphaBrain?.npnStatus?.npn ? ` (NPN ${alphaBrain.npnStatus.npn})` : ''}. Verify it on the Licensed Natural Health Products Database before buying.`
      : 'Our Canadian catalogue record lists no NPN for Alpha Brain; it reaches Canadian buyers as a personal import from the US. You can check its current status on Health Canada’s Licensed Natural Health Products Database (LNHPD).',
  },
  {
    q: 'What does “directed only to U.S. consumers” on onnit.com mean?',
    a: 'It is a legal disclaimer in the footer of Onnit’s website. It is not a shipping restriction: Onnit’s store still lists Canada as a shipping destination.',
  },
];

export default function Page() {
  if (!alphaBrain) notFound();

  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <span>Alpha Brain in Canada</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last verified: <time dateTime={VERIFIED_ON}>{VERIFIED_ON_LABEL}</time></span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Alpha Brain in Canada: how to buy it, what it costs, and NPN-licensed alternatives
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Alpha Brain is a US product sold from a US-dollar store. This page collects what a Canadian buyer needs
          before ordering it: whether it ships, what it costs, what to expect at the border, and which
          Health Canada NPN-licensed alternatives exist, checked against Onnit&apos;s store data and Canadian
          government sources. For the formula, dosing and
          evidence, read our full <Link href="/onnit-alpha-brain-review/" className="text-green-700 underline">Alpha Brain review</Link>.
        </p>

        <section
          aria-labelledby="verdict-heading"
          data-testid="verdict-box"
          className="my-8 bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <h2 id="verdict-heading" className="text-xl font-bold text-green-900 mb-3">The short answer</h2>
          <ul className="text-sm text-gray-800 leading-relaxed space-y-2">
            <li><strong>Ships to Canada?</strong> Yes, from onnit.com, with checkout in US dollars only.</li>
            <li><strong>Canadian retailers?</strong> We could not confirm any Canadian retailer stocking Alpha Brain.</li>
            <li>
              <strong>NPN-licensed alternatives?</strong>{' '}
              {npnLicensed.length > 0
                ? <>Yes: {npnLicensed.map((p, i) => (
                    <span key={p.slug}>
                      {i > 0 && ', '}
                      <Link href={`/${p.slug}/`} className="text-green-700 underline">{p.name}</Link>
                    </span>
                  ))} {npnLicensed.length === 1 ? 'holds' : 'hold'} a Health Canada NPN in our catalogue.</>
                : 'None in our Canadian catalogue at the moment.'}
            </li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Does Onnit ship to Canada?</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Yes. Onnit&apos;s store configuration (<a href="https://www.onnit.com/meta.json" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">onnit.com/meta.json</a>)
            lists Canada (&ldquo;CA&rdquo;) among the countries it ships to, and sets the store currency to USD.
            There is no Canadian storefront, so you pay in US dollars and your card issuer handles the conversion.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The footer of onnit.com says the site is &ldquo;directed only to U.S. consumers&rdquo;. That is a legal
            disclaimer about who the website is addressed to, not a shipping restriction. For what it means for
            returns or guarantees on an order shipped to Canada, check Onnit&apos;s own terms before you buy.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What Alpha Brain costs in Canada</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Onnit prices Alpha Brain in US dollars only. These are the list prices on Onnit&apos;s store for the
            capsule version, before any subscription discount, shipping, duties or taxes:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <caption className="sr-only">Alpha Brain capsule list prices on onnit.com, in US dollars</caption>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Size</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Onnit list price (USD)</th>
                  <th scope="col" className="text-left p-3 font-semibold text-gray-900">Source</th>
                </tr>
              </thead>
              <tbody>
                {onnitPrices.map(row => (
                  <tr key={row.size} className="border-t border-gray-200">
                    <td className="p-3 text-gray-800">{row.size}</td>
                    <td className="p-3 text-gray-800">US${row.usd}</td>
                    <td className="p-3">
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                        Onnit product page ({row.size})
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">Prices checked on {VERIFIED_ON_LABEL}. Onnit changes prices and runs promotions; the price at checkout is the one that counts.</p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Duties, GST/HST and brokerage</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Cross-border orders may attract customs duties, GST/HST and courier brokerage fees on top of the USD
            price. What you pay depends on the order value, the carrier and your province, so we do not publish an
            estimate. The Canada Border Services Agency explains how duty and taxes are collected on{' '}
            <a href="https://www.cbsa-asfc.gc.ca/import/postal-postale/dtytx-drttx-eng.html" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">goods imported by mail or courier</a>{' '}
            and offers a{' '}
            <a href="https://www.cbsa-asfc.gc.ca/travel-voyage/dte-acl/est-cal-eng.html" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">duty and taxes estimator</a>.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Where to buy Alpha Brain in Canada</h2>
          <AffiliateDisclosure />
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            <strong>onnit.com</strong> is the one source we could verify. Orders ship from the US and are charged
            in USD.
          </p>
          <p className="mb-4">
            <TrackedAffiliateLink
              product={alphaBrain}
              surface="best_of_ca"
              className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-5 py-3 rounded-lg"
            >
              Check Alpha Brain on onnit.com
            </TrackedAffiliateLink>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            We searched amazon.ca, walmart.ca and gnc.ca and could not confirm any Canadian retailer stocking Alpha
            Brain. That does not mean none exists; if you find one, check that the listing is sold by a
            reputable seller and that the lot and expiry date are printed on the bottle.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">NPN-licensed alternatives available in Canada</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Natural health products sold in Canada must hold a Natural Product Number (NPN) issued by Health
            Canada. {alphaBrainLicensed
              ? 'Our catalogue record lists Alpha Brain as NPN-licensed.'
              : 'Our catalogue record lists no NPN for Alpha Brain; it reaches Canadian buyers as a personal import.'}{' '}
            If an NPN-licensed product matters to you, these are the products in our Canadian catalogue whose
            record carries a Health Canada NPN:
          </p>
          {npnLicensed.length > 0 ? (
            <ul className="space-y-3">
              {npnLicensed.map(p => (
                <li key={p.slug} className="border border-gray-200 rounded-lg p-4">
                  <Link href={`/${p.slug}/`} className="font-semibold text-green-700 underline">
                    {p.name} review
                  </Link>
                  <span className="text-sm text-gray-600">
                    {' '}· {p.brand}{p.npnStatus?.npn ? ` · NPN ${p.npnStatus.npn}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-700">None in our Canadian catalogue at the moment.</p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed mt-4">
            Verify any NPN yourself on the{' '}
            <a href="https://health-products.canada.ca/lnhpd-bdpsnh/" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Licensed Natural Health Products Database (LNHPD)</a>.
            For what an NPN does and does not verify, see our{' '}
            <Link href="/npn-licensed-nootropics-canada/" className="text-green-700 underline">guide to NPN-licensed nootropics in Canada</Link>,
            and for a head-to-head of a licensed and an imported formula, read{' '}
            <Link href="/aor-ortho-mind-vs-mind-lab-pro/" className="text-green-700 underline">AOR Ortho•Mind vs Mind Lab Pro</Link>.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-gray-600 my-8">
          <strong>Last verified:</strong> <time dateTime={VERIFIED_ON}>{VERIFIED_ON_LABEL}</time> (Onnit shipping
          countries and USD prices, CBSA pages, catalogue NPN records).
        </p>

        <Sources
          defaultOpen
          heading="Sources"
          sources={[
            { type: 'Retailer', label: 'Onnit store configuration: ships_to_countries and currency (meta.json)', url: 'https://www.onnit.com/meta.json' },
            { type: 'Retailer', label: 'Onnit: Alpha BRAIN (30 ct) product page', url: 'https://www.onnit.com/products/alpha-brain-30-ct' },
            { type: 'Retailer', label: 'Onnit: Alpha BRAIN (60 ct) product page', url: 'https://www.onnit.com/products/alpha-brain-60-ct' },
            { type: 'Retailer', label: 'Onnit: Alpha BRAIN (90 ct) product page', url: 'https://www.onnit.com/products/alpha-brain-90-ct' },
            { type: 'Regulatory', label: 'CBSA: Importing by mail or courier, paying duty and/or taxes', url: 'https://www.cbsa-asfc.gc.ca/import/postal-postale/dtytx-drttx-eng.html' },
            { type: 'Regulatory', label: 'CBSA: Estimate duty and taxes', url: 'https://www.cbsa-asfc.gc.ca/travel-voyage/dte-acl/est-cal-eng.html' },
            { type: 'Regulatory', label: 'Licensed Natural Health Products Database (LNHPD)', url: 'https://health-products.canada.ca/lnhpd-bdpsnh/' },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('ca')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Back to home</Link>
          {' · '}
          <Link href="/onnit-alpha-brain-review/" className="text-green-700 underline">Alpha Brain review</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
        </div>
      </article>
    </PublicShell>
  );
}
