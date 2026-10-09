import type { Metadata } from 'next';
import { SchemaOrg, EditorialStandardsSection, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { buildPersonAuthorReference, pillarWeightPercent } from '@nootropic/data';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'How We Review Nootropics — Our Methodology (EU Edition)',
  description:
    'The Nootropic Lab EU scoring methodology: 5-pillar framework, EU health-claim checks on our own copy, clinical dosing audit process, and affiliate disclosure.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/methodology/' }),
  openGraph: buildOpenGraph({ regionCode: 'eu', path: '/methodology/', title: 'How We Review Nootropics — Our Methodology (EU Edition)', description: 'The Nootropic Lab EU scoring methodology: 5-pillar framework, EU health-claim checks on our own copy, clinical dosing audit process, and affiliate disclosure.' }),
  twitter: buildTwitter({ title: 'How We Review Nootropics — Our Methodology (EU Edition)', description: 'The Nootropic Lab EU scoring methodology: 5-pillar framework, EU health-claim checks on our own copy, clinical dosing audit process, and affiliate disclosure.' }),
};

const pillars = [
  { num: '01', title: `Ingredient quality (${pillarWeightPercent('ingredients')}%)`, desc: 'We assess whether each ingredient has peer-reviewed human clinical trial evidence for cognitive benefits. Proprietary blends with hidden doses are penalised.' },
  { num: '02', title: `Dosing vs. clinical evidence (${pillarWeightPercent('dosing')}%)`, desc: "Dosing is the share of a product's ingredients with a reference dose on our ingredient pages whose label-stated daily amount meets that page's minimum. An amount the label hides (a share of a proprietary blend) or states on a different basis (such as a dried-herb equivalent instead of the extract) counts as not met. Ingredients with no reference page are listed but not scored." },
  { num: '03', title: `Formula transparency (${pillarWeightPercent('transparency')}%)`, desc: 'Full disclosure of all ingredient doses scores highest. "Matrix" blends or ingredients without standardisation data reduce scores.' },
  { num: '04', title: `Value for money (${pillarWeightPercent('value')}%)`, desc: 'Price per serving (in EUR) divided by the number of clinical-dose ingredients.' },
  { num: '05', title: `Brand trust (${pillarWeightPercent('trust')}%)`, desc: 'Composite of Trustpilot score (50%), BBB/Trustpilot EU complaint volume, subscription cancellation transparency, and third-party testing documentation.' },
];

export default function MethodologyEUPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How We Review Nootropics — Methodology (EU)',
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab EU', url: SITE_URL },
  };

  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Methodology</h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          The Nootropic Lab uses a 5-pillar scoring framework applied consistently to every product.
          No brand pays for a review or influences our scores.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5-Pillar Scoring Framework</h2>
          <div className="space-y-4">
            {pillars.map(p => (
              <div key={p.num} className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                <div className="text-3xl font-black text-green-200 shrink-0 leading-none pt-1">{p.num}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-4">
            Our best-nootropics guides rank only products scoring 7.0/10 or more; the bar was 7.5 until
            9 October 2026 and was set to 7.0 when the dosing pillar became computed from label doses,
            which lowered scores by about a point overall.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">EU Rules and What We Check</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Food supplements sold in the EU fall under the rules below. We keep our own copy within
            the EU-authorised health claims and mark which products are sold from an EU storefront;
            we do not verify each product&apos;s regulatory compliance, which is the seller&apos;s
            responsibility.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-3">
            <li><strong>Directive 2002/46/EC</strong> — food supplement ingredient safety</li>
            <li><strong>Regulation (EC) 1924/2006</strong> — only EU-authorised health claims (assessed by EFSA)</li>
            <li><strong>Regulation (EU) 2015/2283</strong> — Novel Food authorisation status</li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed">
            The EU storefront mark is a separate label: it shows that a product is sold through a
            dedicated EU storefront priced in EUR, and no pillar score is adjusted for it. Pillar
            scores, including Value for Money, are editorial ratings recorded for each product. Not
            every product in our EU coverage has a euro price on record; NooCube, for example, has
            no EU storefront and is listed with its US-dollar price only.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Disclosure</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Nootropic Lab earns affiliate commissions when readers purchase products through our links.
            This does not influence our editorial scores or rankings. All affiliate relationships are
            disclosed on every page where they apply.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Content on The Nootropic Lab is for informational purposes only and does not constitute medical
            advice. Always consult a qualified healthcare professional before taking any supplement.
          </p>
        </section>
        <EditorialStandardsSection />
      </article>
    </PublicShell>
  );
}
