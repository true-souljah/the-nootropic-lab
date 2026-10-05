import type { Metadata } from 'next';
import Link from 'next/link';
import { AffiliateDisclosure, SchemaOrg, Sources, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';

const PAGE_URL = `${SITE_URL}/efsa-approved-cognitive-supplements/`;
const auditDateIso = new Date().toISOString().split('T')[0];

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'EU-Authorised Cognitive Health Claims for Supplements: The Register-Checked List (Caffeine Is Not on It)',
  description:
    'Under Regulation (EC) No 1924/2006, only health claims authorised by the European Commission (after EFSA assessment) may appear on supplement labels in the EU. Very few cognitive claims are on the list, and no caffeine claim is. Every row checked against the EU register + audit of our EU catalog.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/efsa-approved-cognitive-supplements/', availableInRegions: ['eu'] }),
  openGraph: buildOpenGraph({ regionCode: 'eu', path: '/efsa-approved-cognitive-supplements/', title: 'EU-Authorised Cognitive Health Claims for Supplements: The Register-Checked List (Caffeine Is Not on It)', description: 'Under Regulation (EC) No 1924/2006, only health claims authorised by the European Commission (after EFSA assessment) may appear on supplement labels in the EU. Very few cognitive claims are on the list, and no caffeine claim is. Every row checked against the EU register + audit of our EU catalog.' }),
  twitter: buildTwitter({ title: 'EU-Authorised Cognitive Health Claims for Supplements: The Register-Checked List (Caffeine Is Not on It)', description: 'Under Regulation (EC) No 1924/2006, only health claims authorised by the European Commission (after EFSA assessment) may appear on supplement labels in the EU. Very few cognitive claims are on the list, and no caffeine claim is. Every row checked against the EU register + audit of our EU catalog.' }),
};

interface EfsaClaim {
  ingredient: string;
  claim: string;
  conditions: string;
  status: 'authorised' | 'not-authorised' | 'on-hold-botanical' | 'rejected';
  source: string;
}

// Every row is checked against the European Commission's EU Register of nutrition and
// health claims (policy-items API, foodDomain=nut, authorisationType=nut_auth). Conditions
// of use and EFSA Journal references follow the register entry named in `source`.
const efsaCognitiveClaims: EfsaClaim[] = [
  { ingredient: 'Iodine', claim: 'Iodine contributes to normal cognitive function', conditions: "Food must be at least a 'source of' iodine as defined in the Annex to Regulation (EC) No 1924/2006", status: 'authorised', source: 'EFSA Journal 2010;8(10):1800 · EU register POL-HC-6385' },
  { ingredient: 'Iron', claim: 'Iron contributes to normal cognitive function', conditions: "Food must be at least a 'source of' iron as defined in the Annex to Regulation (EC) No 1924/2006", status: 'authorised', source: 'EFSA Journal 2009;7(9):1215 · EU register POL-HC-6390' },
  { ingredient: 'Iron (children)', claim: 'Iron contributes to normal cognitive development of children', conditions: "Food must be at least a 'source of' iron as defined in the Annex to Regulation (EC) No 1924/2006 (Article 14 children's development claim)", status: 'authorised', source: 'EFSA question Q-2008-325 · EU register POL-HC-6273' },
  { ingredient: 'Pantothenic acid (Vitamin B5)', claim: 'Pantothenic acid contributes to normal mental performance', conditions: "Food must be at least a 'source of' pantothenic acid as defined in the Annex to Regulation (EC) No 1924/2006", status: 'authorised', source: 'EFSA Journal 2009;7(9):1218 and 2010;8(10):1758 · EU register POL-HC-6433' },
  { ingredient: 'Vitamin B12', claim: 'Vitamin B12 contributes to normal psychological function', conditions: "Food must be at least a 'source of' vitamin B12 as defined in the Annex to Regulation (EC) No 1924/2006", status: 'authorised', source: 'EFSA Journal 2010;8(10):4114 · EU register POL-HC-6485' },
  { ingredient: 'Zinc', claim: 'Zinc contributes to normal cognitive function', conditions: "Food must be at least a 'source of' zinc as defined in the Annex to Regulation (EC) No 1924/2006", status: 'authorised', source: 'EFSA Journal 2009;7(9):1229 · EU register POL-HC-6533' },
  { ingredient: 'Docosahexaenoic acid (DHA)', claim: 'DHA contributes to maintenance of normal brain function', conditions: 'Food must contain at least 40 mg of DHA per 100 g and per 100 kcal; the consumer must be told that the beneficial effect is obtained with a daily intake of 250 mg of DHA', status: 'authorised', source: 'EFSA Journal 2011;9(4):2078 and 2010;8(10):1734 · EU register POL-HC-6366' },
  { ingredient: 'Caffeine', claim: 'Increased alertness (at least 75 mg caffeine per serving)', conditions: 'Assessed favourably by EFSA in 2011, but never authorised by the European Commission: the EU register lists no authorised caffeine claim', status: 'not-authorised', source: 'EFSA Journal 2011;9(4):2054 · not on the EU list of authorised claims' },
  { ingredient: 'Caffeine', claim: 'Increased attention', conditions: 'Assessed by EFSA in the same 2011 opinion; never authorised by the European Commission', status: 'not-authorised', source: 'EFSA Journal 2011;9(4):2054 · not on the EU list of authorised claims' },
  { ingredient: 'Caffeine', claim: 'Caffeine helps to increase alertness (for intakes between 40 mg and 75 mg per serving)', conditions: 'Article 13(5) application; EFSA found a cause-and-effect relationship had not been established at these doses', status: 'rejected', source: 'Refused by Commission Regulation (EU) 2016/1411 · EFSA question Q-2013-00399, EFSA Journal 2014;12(2):3574 · EU register POL-HC-8450' },
  { ingredient: 'Bacopa monnieri', claim: '(various proposed memory/cognitive claims)', conditions: 'Botanical health claim', status: 'on-hold-botanical', source: 'Article 13 botanicals on hold pending re-evaluation' },
  { ingredient: 'Ginkgo biloba', claim: '(various proposed memory/circulation claims)', conditions: 'Botanical health claim', status: 'on-hold-botanical', source: 'Article 13 botanicals on hold pending re-evaluation' },
  { ingredient: 'Rhodiola rosea', claim: '(various proposed cognitive/stress claims)', conditions: 'Botanical health claim', status: 'on-hold-botanical', source: 'Article 13 botanicals on hold pending re-evaluation' },
  { ingredient: 'Phosphatidylserine', claim: 'Memory and cognitive-performance claims (e.g. "May improve memory in the elderly")', conditions: 'Proposed but not authorised', status: 'rejected', source: 'EFSA Journal 2010;8(10):1749 · EU register POL-HC-7749, POL-HC-7750, POL-HC-7751 (non-authorised)' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'EU-Authorised Cognitive Health Claims for Supplements',
  description: 'The EU-authorised (EFSA-assessed) cognitive-claim list under Regulation (EC) No 1924/2006, checked against the EU register, with conditions of use, plus caffeine claims that were never authorised, on-hold botanicals and refused claims.',
  datePublished: '2026-05-05',
  dateModified: auditDateIso,
  author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: SITE_URL },
};

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'EU-Authorised (EFSA-Assessed) Health Claims for Cognitive Function',
  description: 'Subset of the EU Register of Nutrition and Health Claims pertaining to cognitive function, mental performance, and nervous-system support.',
  url: PAGE_URL,
  keywords: ['EFSA', 'EU Health Claims', 'Regulation 1924/2006', 'cognitive supplements', 'authorised health claims', 'Article 13', 'botanicals on hold'],
  isAccessibleForFree: true,
  license: 'https://creativecommons.org/licenses/by/4.0/',
  creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
  variableMeasured: efsaCognitiveClaims.map(c => ({
    '@type': 'PropertyValue',
    name: `${c.ingredient} — ${c.claim}`,
    description: `Conditions of use: ${c.conditions}. Source: ${c.source}`,
    additionalType: c.status,
  })),
  citation: 'Regulation (EC) No 1924/2006 + EU Register of Nutrition and Health Claims Made on Foods',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'EU-Authorised Cognitive Health Claims', item: PAGE_URL },
  ],
};

const faqs = [
  { q: 'What is Regulation (EC) No 1924/2006?', a: 'Regulation (EC) No 1924/2006 governs nutrition and health claims made on foods sold in the EU, including dietary supplements. It established the principle that only health claims authorised by the European Commission (after scientific assessment by the European Food Safety Authority, EFSA) and listed in the EU Register may appear on product labels and in advertising. Unauthorised claims are prohibited regardless of evidence base.' },
  { q: 'Why are so few cognitive claims authorised?', a: 'EFSA applies a high evidentiary bar: claims must be supported by generally accepted human scientific evidence under the conditions of use proposed. For cognitive function, only a handful of nutrients (iodine, iron, pantothenic acid, vitamin B12, zinc and docosahexaenoic acid) carry authorised claims; the European Commission then decides which assessed claims to authorise. Caffeine shows the difference: EFSA assessed a 75 mg alertness claim favourably in 2011, but the Commission never added any caffeine claim to the authorised list, and in 2016 it refused a 40–75 mg alertness claim (Regulation (EU) 2016/1411). Botanical ingredients (Bacopa, Ginkgo, Rhodiola, Phosphatidylserine) have either been rejected or remain "on hold" pending re-evaluation of the Article 13 botanical claim list, which has not been completed since the regulation entered force.' },
  { q: 'What does "on hold" mean for botanical claims?', a: 'When Regulation 1924/2006 was implemented, the European Commission decided to evaluate health claims for botanicals separately from non-botanical claims. That evaluation was suspended in 2010 and has not been completed. Botanical health claims (Bacopa, Ginkgo, Rhodiola, etc.) are in regulatory limbo: not authorised, but not formally rejected. Some Member States permit traditional-use language pending the EU-level decision.' },
  { q: 'Can a supplement that contains Bacopa make any cognitive claim in the EU?', a: 'Not under the harmonised EU framework. Member-state-level traditional-use language may be permitted under THMP (Traditional Herbal Medicinal Products) Directive 2004/24/EC for products registered as traditional herbal medicines. Most cognitive supplements in the EU sidestep this by using ingredient-mechanism descriptions ("contains 250 mg Bacopa monnieri standardised to 50% bacosides") rather than health claims about what the ingredient does for cognition.' },
  { q: 'What does this mean for our editorial framing on EU pages?', a: 'On EU pages we describe ingredient mechanisms studied in clinical trials and avoid asserting label-grade cognitive claims for ingredients without an EU-authorised claim. That includes caffeine: no caffeine alertness, attention or concentration claim is on the EU list of authorised claims, so we describe the trial evidence for caffeine rather than presenting it as an authorised claim. For Bacopa, Lion\'s Mane, Citicoline and similar, our copy describes the published clinical evidence rather than asserting health claims.' },
];


const statusLabels: Record<string, { label: string; cls: string }> = {
  'authorised': { label: 'Authorised', cls: 'bg-green-100 text-green-800' },
  'not-authorised': { label: 'Assessed, not authorised', cls: 'bg-red-100 text-red-800' },
  'on-hold-botanical': { label: 'On hold (botanical)', cls: 'bg-amber-100 text-amber-800' },
  'rejected': { label: 'Refused', cls: 'bg-red-100 text-red-800' },
};

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
          <span>EU-Authorised Cognitive Health Claims</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Reviewed by <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          EU-Authorised Cognitive Health Claims for Supplements
        </h1>

        <p id="hero-paragraph" className="text-lg text-gray-600 mb-6 leading-relaxed">
          Under <strong>Regulation (EC) No 1924/2006</strong>, only health claims authorised by the European
          Commission and listed in the EU Register may appear on supplement labels in the EU. The European Food
          Safety Authority (EFSA) assesses the science; the Commission decides. The authorised list for cognitive
          function is <strong>short</strong>: iodine, iron, pantothenic acid, vitamin B12, zinc and
          docosahexaenoic acid (DHA). <strong>Caffeine is not on it</strong>: EFSA assessed a 75&nbsp;mg alertness
          claim favourably in 2011, but the Commission never authorised any caffeine claim, and it refused a
          40–75&nbsp;mg alertness claim in Regulation (EU) 2016/1411. Every row below is checked against the EU
          register. Most of the well-known nootropic ingredients
          (Bacopa, Ginkgo, Rhodiola, Phosphatidylserine, Lion&apos;s Mane) sit on the on-hold botanical list or
          have been rejected. This page is the full reference.
        </p>

        <AffiliateDisclosure />

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cognitive claims: EU-authorised, not authorised, on hold and refused</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Ingredient</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Claim</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Conditions</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Status</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Reference</th>
                </tr>
              </thead>
              <tbody>
                {efsaCognitiveClaims.map((c, i) => (
                  <tr key={`${c.ingredient}-${c.claim}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium">{c.ingredient}</td>
                    <td className="px-3 py-2 text-xs text-gray-700 italic">"{c.claim}"</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{c.conditions}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${statusLabels[c.status].cls}`}>
                        {statusLabels[c.status].label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">{c.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            Statuses, conditions of use and EFSA Journal references are checked against the European
            Commission&apos;s EU Register of nutrition and health claims (POL-HC codes are register entry IDs).
            The botanical rows are not listed in the register as authorised or refused. The register changes when
            the Commission adopts new authorisations or refusals.
          </p>
        </section>

        <section className="my-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-3">What this means for product copy in the EU</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            A supplement sold in the EU may use the authorised claims above when conditions of use are met, but
            cannot extend cognitive claims to ingredients without authorised claims (e.g. caffeine, Bacopa,
            Lion&apos;s Mane). Product copy that asserts cognitive benefits for non-authorised ingredients is in breach of
            Regulation 1924/2006 and may attract enforcement action by the competent national authority.
            Compliant product copy describes the ingredient and its mechanism without making a health claim.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Audit of our EU catalog</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We track <strong>{productsEU.length} products</strong> in our EU catalog. Editorial copy on this site
            describes ingredient mechanisms studied in clinical trials and does not assert label-grade health
            claims. Our reviews flag products whose marketing material uses cognitive claim language not
            authorised in the EU — this is informational for the reader, not a regulatory determination.
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
            { type: 'Regulatory', label: 'Regulation (EC) No 1924/2006 — Nutrition and health claims made on foods', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32006R1924' },
            { type: 'Regulatory', label: 'EU Register of Nutrition and Health Claims Made on Foods', url: 'https://ec.europa.eu/food/safety/labelling-and-nutrition/nutrition-and-health-claims/eu-register-health-and-nutrition-claims_en' },
            { type: 'Regulatory', label: 'European Commission — EU Register of nutrition and health claims, register data (policy-items API)', url: 'https://ec.europa.eu/food/food-feed-portal/backend/api/policy-items?foodDomain=nut&authorisationType=nut_auth' },
            { type: 'Regulatory', label: 'Commission Regulation (EU) 2016/1411 refusing to authorise certain health claims made on foods (includes the 40–75 mg caffeine alertness claim, register entry POL-HC-8450)', url: 'https://eur-lex.europa.eu/eli/reg/2016/1411/oj' },
            { type: 'Regulatory', label: 'EFSA Journal 2011;9(4):2054 — caffeine and increased alertness / increased attention (Article 13(1) opinion)', url: 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2011.2054' },
            { type: 'Regulatory', label: 'EFSA — Health claims', url: 'https://www.efsa.europa.eu/en/topics/topic/health-claims' },
            { type: 'Regulatory', label: 'Directive 2004/24/EC on Traditional Herbal Medicinal Products (THMP)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004L0024' },
            { type: 'Editorial', label: 'The Nootropic Lab — Methodology', url: `${SITE_URL}/methodology/` },
          ]}
        />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mt-10 text-sm text-amber-900">
          <strong className="block mb-1">Health & regulatory note</strong>
          {getRegionalHealthDisclaimer('eu')}
        </aside>

        <div className="text-sm text-gray-500 mt-10">
          <Link href="/" className="text-green-700 underline">← Back to home</Link>
          {' · '}
          <Link href="/methodology/" className="text-green-700 underline">Methodology</Link>
          {' · '}
          <Link href="/best-nootropics/" className="text-green-700 underline">Best Nootropics EU</Link>
        </div>
      </article>
    </PublicShell>
  );
}
