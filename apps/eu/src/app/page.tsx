import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'NootropicGuide EU — Independent Cognitive Supplement Reviews for Europe',
  description:
    'The independent nootropic comparison platform for EU buyers. EUR pricing, EU-compliant products, and full regulatory guidance.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NootropicGuide EU',
  url: 'https://eu.thenootropiclab.com',
  description: 'Independent cognitive supplement reviews for EU buyers.',
};

const features = [
  {
    icon: '🔬',
    title: 'Clinical dosing audits',
    desc: 'Every product review includes a dosing-vs-evidence table comparing each ingredient to the minimum effective dose from peer-reviewed trials.',
  },
  {
    icon: '🇪🇺',
    title: 'EU compliance verified',
    desc: 'We check every product against EU Directive 2002/46/EC and EFSA health claim Regulation (EC) 1924/2006. No US-only formulas recommended.',
  },
  {
    icon: '💶',
    title: 'EUR pricing & EU shipping',
    desc: 'Only products with dedicated EU storefronts are featured — no import duties, EUR pricing, and local shipping.',
  },
];

const quickLinks = [
  {
    href: '/best-nootropics',
    title: 'Best Nootropics 2026 (EU)',
    desc: 'Full EU comparison with clinical dosing audit and EUR prices.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Interactive Comparison Tool',
    desc: 'Sort and filter every EU-available brand side-by-side.',
  },
  {
    href: '/methodology',
    title: 'Our Methodology',
    desc: 'How we score and review cognitive supplements.',
  },
];

export default function EUHomePage() {
  return (
    <>
      <SchemaOrg schema={websiteSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            EU Market · EUR Pricing · EU-Compliant Products
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            The Independent EU Guide to
            <br />
            <span className="text-green-700">Cognitive Supplements</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            We review nootropics specifically for European buyers. EUR pricing, EU regulatory
            compliance, and no hidden import costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/best-nootropics"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Best Nootropics EU 2026 →
            </Link>
            <Link
              href="/nootropic-comparison"
              className="bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              Compare All EU Brands
            </Link>
          </div>
          <div className="mt-4 flex gap-4 justify-center text-sm text-gray-500">
            <Link href="/de/beste-nootropika" className="text-green-700 underline">
              🇩🇪 Deutsch
            </Link>
            <Link href="/fr/meilleurs-nootropiques" className="text-green-700 underline">
              🇫🇷 Français
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Built for European buyers
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

      {/* Quick links */}
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
