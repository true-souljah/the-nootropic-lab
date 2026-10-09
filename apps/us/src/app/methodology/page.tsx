import type { Metadata } from 'next';
import { SchemaOrg, EditorialStandardsSection, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';
import { buildPersonAuthorReference, pillarWeightPercent } from '@nootropic/data';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: 'How We Review Nootropics — Our Methodology',
  description:
    'The Nootropic Lab scoring methodology: 5-pillar framework, clinical dosing audit process, conflict of interest policy, and affiliate disclosure.',
  alternates: buildAlternates({ regionCode: 'us', path: '/methodology/' }),
  openGraph: buildOpenGraph({ regionCode: 'us', path: '/methodology/', title: 'How We Review Nootropics — Our Methodology', description: 'The Nootropic Lab scoring methodology: 5-pillar framework, clinical dosing audit process, conflict of interest policy, and affiliate disclosure.' }),
  twitter: buildTwitter({ title: 'How We Review Nootropics — Our Methodology', description: 'The Nootropic Lab scoring methodology: 5-pillar framework, clinical dosing audit process, conflict of interest policy, and affiliate disclosure.' }),
};

const pillars = [
  { num: '01', title: `Ingredient quality (${pillarWeightPercent('ingredients')}%)`, desc: 'We assess whether each ingredient has peer-reviewed human clinical trial evidence for cognitive benefits. Proprietary blends with hidden doses are penalised.' },
  { num: '02', title: `Dosing vs. clinical evidence (${pillarWeightPercent('dosing')}%)`, desc: "Dosing is the share of a product's ingredients with a reference dose on our ingredient pages whose label-stated daily amount meets that page's minimum. An amount the label hides (a share of a proprietary blend) or states on a different basis (such as a dried-herb equivalent instead of the extract) counts as not met. Ingredients with no reference page are listed but not scored." },
  { num: '03', title: `Formula transparency (${pillarWeightPercent('transparency')}%)`, desc: 'Full disclosure of all ingredient doses scores highest. "Matrix" blends or ingredients without standardisation data reduce scores.' },
  { num: '04', title: `Value for money (${pillarWeightPercent('value')}%)`, desc: 'Price per serving divided by the number of clinical-dose ingredients.' },
  { num: '05', title: `Brand trust (${pillarWeightPercent('trust')}%)`, desc: 'Composite of Trustpilot score (50%), BBB complaint volume, subscription cancellation transparency, and third-party testing documentation.' },
];

export default function MethodologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How We Review Nootropics — Methodology',
    author: buildPersonAuthorReference(undefined, SITE_URL),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
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
