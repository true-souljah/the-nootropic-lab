import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab GCC — Independent Cognitive Supplement Reviews',
  description:
    'Independent nootropic reviews for GCC buyers. Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman — evidence-graded with import and VAT notes.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab GCC',
  url: 'https://gcc.thenootropiclab.com',
  description: 'Independent cognitive supplement reviews for GCC buyers.',
};

const features = [
  {
    icon: '🔬',
    title: 'Clinical dosing audits',
    desc: 'Every product review includes a dosing-vs-evidence table comparing each ingredient to the minimum effective dose from peer-reviewed trials.',
  },
  {
    icon: '🌙',
    title: 'Halal-friendly options',
    desc: 'We prioritise caffeine-free, porcine-free formulations suitable for GCC buyers. Ingredient sources clearly noted.',
  },
  {
    icon: '📦',
    title: 'GCC import guidance',
    desc: 'Custom duty and VAT notes for Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman. Verify import status before ordering.',
  },
];

const quickLinks = [
  {
    href: '/best-nootropics',
    title: 'Best Nootropics in the GCC 2026',
    desc: 'Top picks with GCC shipping and customs notes.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Interactive Comparison Tool',
    desc: 'Sort and filter every major brand side-by-side.',
  },
  {
    href: '/methodology',
    title: 'Our Methodology',
    desc: 'How we score and review cognitive supplements.',
  },
];

export default function HomePage() {
  return (
    <>
      <SchemaOrg schema={websiteSchema} />

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            GCC Market · Evidence-Graded · Halal-Friendly Options
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            The Independent GCC Guide to
            <br />
            <span className="text-green-700">Cognitive Supplements</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Evidence-graded nootropic reviews for buyers in Saudi Arabia, UAE, Qatar, Kuwait,
            Bahrain, and Oman. Import guidance and VAT notes included.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/best-nootropics"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Best Nootropics 2026 →
            </Link>
            <Link
              href="/nootropic-comparison"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Compare All Brands
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Why The Nootropic Lab is different
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Start your research</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="block border border-gray-200 rounded-lg p-5 hover:border-green-700 hover:shadow-sm transition-all"
            >
              <div className="font-semibold text-gray-900 mb-1">{l.title}</div>
              <div className="text-sm text-gray-500">{l.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
