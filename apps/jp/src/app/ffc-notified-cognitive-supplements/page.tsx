import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsJP, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://jp.thenootropiclab.com';
const PAGE_URL = `${SITE_URL}/ffc-notified-cognitive-supplements/`;
const auditDateIso = new Date().toISOString().split('T')[0];

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: 'FFC-Notified Cognitive Supplements (Japan) — 機能性表示食品 + FOSHU Framework Guide',
  description:
    'Japan regulates cognitive supplements through Foods with Function Claims (FFC / 機能性表示食品) and Foods for Specified Health Uses (FOSHU). Both require Consumer Affairs Agency notification or approval. Full explainer + audit of our Japanese catalog + the personal-import threshold for non-domestic brands.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/ffc-notified-cognitive-supplements/' }),
  openGraph: buildOpenGraph({ regionCode: 'jp', path: '/ffc-notified-cognitive-supplements/', title: 'FFC-Notified Cognitive Supplements (Japan) — 機能性表示食品 + FOSHU Framework Guide', description: 'Japan regulates cognitive supplements through Foods with Function Claims (FFC / 機能性表示食品) and Foods for Specified Health Uses (FOSHU). Both require Consumer Affairs Agency notification or approval. Full explainer + audit of our Japanese catalog + the personal-import threshold for non-domestic brands.' }),
  twitter: buildTwitter({ title: 'FFC-Notified Cognitive Supplements (Japan) — 機能性表示食品 + FOSHU Framework Guide', description: 'Japan regulates cognitive supplements through Foods with Function Claims (FFC / 機能性表示食品) and Foods for Specified Health Uses (FOSHU). Both require Consumer Affairs Agency notification or approval. Full explainer + audit of our Japanese catalog + the personal-import threshold for non-domestic brands.' }),
};

interface JpRegulatoryCategory {
  category: string;
  categoryJa: string;
  burden: string;
  scope: string;
  examples: string;
}

const jpCategories: JpRegulatoryCategory[] = [
  { category: 'FOSHU (Foods for Specified Health Uses)', categoryJa: '特定保健用食品 (トクホ)', burden: 'Highest evidentiary bar — pre-market approval by the Consumer Affairs Agency based on submitted clinical data.', scope: 'Health-function claims approved on a per-product basis. Display the FOSHU mark on packaging.', examples: 'Specific approved cognitive products are limited; FOSHU is more commonly used for blood-glucose, cholesterol, and intestinal-health products.' },
  { category: 'FFC (Foods with Function Claims)', categoryJa: '機能性表示食品', burden: 'Manufacturer notification system; manufacturer responsible for evidence; submitted to CAA database 60 days before sale.', scope: 'Function claims describing specific health-function effects (memory, attention, fatigue reduction, etc.). Most cognitive nootropic products in Japan use this route.', examples: 'DHC ginkgo extract, Suntory Boltage, FANCL memory-support products, multiple Asahi cognitive products.' },
  { category: 'Foods for Special Dietary Uses', categoryJa: '特別用途食品', burden: 'Approval by Consumer Affairs Agency based on suitability for a specific dietary purpose (e.g. for the elderly, infants, those with specific medical conditions).', scope: 'Distinct system from FOSHU/FFC; less commonly used for cognitive products.', examples: 'Most relevant for elder-care and clinical-nutrition products' },
  { category: 'General foods (no notification)', categoryJa: 'いわゆる健康食品 (ノーマル食品)', burden: 'No regulatory notification required.', scope: 'Cannot make function claims of any kind. Can only describe ingredient content. Imported supplements via personal-import channels generally fall here.', examples: 'Imported brands (Mind Lab Pro, Onnit, Qualia) shipping to Japan via cross-border channels' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'FFC-Notified Cognitive Supplements in Japan — 機能性表示食品 + FOSHU',
  description: 'Explainer of Japan\'s Consumer Affairs Agency notification regime for cognitive supplements, with audit of the Japanese nootropic catalog and personal-import threshold reference.',
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
  name: 'Japan Consumer Affairs Agency Regulatory Categories — Cognitive Supplements',
  description: 'Structured taxonomy of Japan\'s functional-food regulatory categories (FOSHU, FFC, Special Dietary Uses, general foods) as they apply to cognitive supplements.',
  url: PAGE_URL,
  keywords: ['Consumer Affairs Agency', '消費者庁', 'FFC', 'FOSHU', 'cognitive supplements', '機能性表示食品', '特定保健用食品', 'PMD Act'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: jpCategories.map(c => ({
    '@type': 'PropertyValue',
    name: `${c.category} (${c.categoryJa})`,
    description: `Burden: ${c.burden} Scope: ${c.scope} Examples: ${c.examples}`,
    additionalType: 'JP-regulatory-category',
  })),
  citation: 'Health Promotion Act (健康増進法) + Food Labelling Act (食品表示法) + Pharmaceutical and Medical Device Act (医薬品医療機器等法 / PMD Act)',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'FFC-Notified Cognitive Supplements', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'What is FFC (機能性表示食品) and how does it differ from FOSHU?', a: 'FFC (Foods with Function Claims) is a notification system introduced in 2015. The manufacturer is responsible for compiling and submitting scientific evidence supporting function claims to the Consumer Affairs Agency 60 days before sale. CAA does not approve products under FFC — it accepts notifications. FOSHU (特定保健用食品) is the older approval system requiring direct CAA approval based on submitted clinical trials. FFC is faster and used by the majority of newer cognitive supplements in Japan; FOSHU is more commonly used for blood-glucose, cholesterol, and intestinal-health products.' },
  { q: 'How do I verify a product\'s FFC notification?', a: 'Search the Consumer Affairs Agency FFC database (機能性表示食品の届出情報検索) using the product name or notification number. The database returns the notified function claim, recommended intake, scientific basis summary, and notification status. Notifications can be withdrawn or rejected — verify currency before purchase. The notification number typically appears on FFC product packaging.' },
  { q: 'Why does it matter for imported supplements?', a: 'Imported nootropic supplements (Mind Lab Pro, Onnit, Qualia, Hunter Focus) generally do not have FFC or FOSHU status because the FFC notification is per-product per-formulation and applies only to products marketed in Japan. They are sold through personal-import channels and fall under the "general foods" category. Marketing materials that assert cognitive benefits for these products in Japan can run afoul of the Pharmaceutical and Medical Device Act (PMD Act / 薬機法) — claim-language must be carefully framed as ingredient mechanism or consumer experience rather than disease treatment or function claim.' },
  { q: 'What is the ¥16,000 personal-import threshold?', a: 'Japan permits personal importation of supplements up to approximately ¥16,000 worth per shipment without an individual import licence. Beyond this threshold, the importer must obtain personal-use import documentation. In practice this means most one-month supplies of premium nootropic stacks are within the threshold, but multi-month bulk orders may not be. Customs may request import documentation for larger or repeated shipments.' },
  { q: 'Is the PMD Act the same as FDA regulation in the U.S.?', a: 'No. The PMD Act (Pharmaceutical and Medical Device Act, 薬機法, formerly the Pharmaceutical Affairs Law) regulates medicines, medical devices, cosmetics, and quasi-drugs. Foods (including supplements) are regulated under the Food Sanitation Act and the Health Promotion Act. The PMD Act becomes relevant to supplements when marketing claims describe disease treatment, prevention, or pharmacological effects — at that point the product is treated as an unapproved drug, which is a serious regulatory violation.' },
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
          <span>FFC-Notified Cognitive Supplements</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          FFC-Notified Cognitive Supplements in Japan — 機能性表示食品 + FOSHU
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Japan regulates functional foods through two main systems: <strong>FFC (Foods with Function Claims /
          機能性表示食品)</strong> and <strong>FOSHU (Foods for Specified Health Uses / 特定保健用食品)</strong>.
          Cognitive supplements sold in Japan typically use the FFC notification route. Imported brands without
          FFC status fall under "general foods" and cannot make function claims under the Pharmaceutical and
          Medical Device Act (薬機法). This page explains the categories, how to verify FFC status, and the
          ¥16,000 personal-import threshold for non-domestic brands.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Japan&apos;s functional-food categories</h2>
          <div className="space-y-4">
            {jpCategories.map(c => (
              <div key={c.category} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-1">{c.category}</h3>
                <p className="text-sm text-gray-500 mb-2">{c.categoryJa}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>Evidentiary burden:</strong> {c.burden}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2"><strong>Permitted scope:</strong> {c.scope}</p>
                <p className="text-xs text-gray-500"><strong>Examples:</strong> {c.examples}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">How to verify an FFC notification</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 leading-relaxed space-y-2">
            <li>Locate the FFC notification number on the product packaging (typically marked 届出番号).</li>
            <li>Open the <a href="https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/search/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Consumer Affairs Agency FFC database</a>.</li>
            <li>Search by notification number or product name; verify notifier matches the brand and the function claim matches the product label.</li>
            <li>If notification is "withdrawn" (撤回) or "rejected", do not purchase.</li>
          </ol>
        </section>

        <section className="my-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-3">Personal-import threshold for non-domestic brands</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            For imported nootropic brands (Mind Lab Pro, Onnit, Qualia, Hunter Focus, etc.) shipped from
            overseas:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed space-y-1 ml-2">
            <li>Personal-use importation up to approximately <strong>¥16,000 per shipment</strong> is permitted without an individual import licence.</li>
            <li>Shipments exceeding this value may require personal-use import documentation; customs may detain.</li>
            <li>One-month supplies of most premium nootropic stacks fall within the threshold; bulk orders may not.</li>
            <li>Repeated shipments to the same address may be aggregated by customs.</li>
          </ul>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our Japanese catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsJP.length} products</strong> in our Japanese catalog. The mix includes
            FFC-notified domestic brands (DHC, Suntory Wellness, FANCL, Asahi) and imported brands available
            via personal-import channels. Our reviews note FFC notification status where visible on packaging
            and frame imported-brand reviews as consumer experience rather than function claims, in line with
            PMD Act constraints. Per-product FFC field surfacing is on our 2026 roadmap.
          </p>
          <p className="text-xs text-gray-500 italic">
            Until per-product FFC surfacing ships, verify each FFC notification directly via the Consumer
            Affairs Agency database link above before purchasing.
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
            { type: 'Regulatory', label: 'Consumer Affairs Agency (消費者庁) — Foods with Function Claims', url: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/' },
            { type: 'Regulatory', label: 'CAA — FFC notification database (届出情報検索)', url: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_with_function_claims/search/' },
            { type: 'Regulatory', label: 'Consumer Affairs Agency — FOSHU (特定保健用食品)', url: 'https://www.caa.go.jp/policies/policy/food_labeling/foods_for_specified_health_uses/' },
            { type: 'Regulatory', label: 'Pharmaceutical and Medical Device Act (PMD Act / 薬機法)', url: 'https://elaws.e-gov.go.jp/document?lawid=335AC0000000145' },
            { type: 'Regulatory', label: 'Japan Customs — Personal import of pharmaceuticals and supplements', url: 'https://www.customs.go.jp/english/' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('jp')}
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
