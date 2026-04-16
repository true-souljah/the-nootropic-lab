import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'How We Review Nootropics — Our Methodology',
  description:
    'The Nootropic Lab scoring methodology: 5-pillar framework, clinical dosing audit process, conflict of interest policy, and affiliate disclosure.',
};

const pillars = [
  { num: '01', title: 'Ingredient quality (20%)', desc: 'We assess whether each ingredient has peer-reviewed human clinical trial evidence for cognitive benefits. Proprietary blends with hidden doses are penalised.' },
  { num: '02', title: 'Dosing vs. clinical evidence (20%)', desc: 'For each active ingredient, we compare the product dose to the minimum effective dose from published clinical trials (sourced from PubMed). Underdosed ingredients are flagged.' },
  { num: '03', title: 'Formula transparency (20%)', desc: 'Full disclosure of all ingredient doses scores highest. "Matrix" blends or ingredients without standardisation data reduce scores.' },
  { num: '04', title: 'Value for money (20%)', desc: 'Price per serving divided by the number of clinical-dose ingredients.' },
  { num: '05', title: 'Brand trust (20%)', desc: 'Composite of Trustpilot score (50%), BBB complaint volume, subscription cancellation transparency, and third-party testing documentation.' },
];

export default function MethodologyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How We Review Nootropics — Methodology',
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab' },
  };

  return (
    <>
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
      </article>
    </>
  );
}
