import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab Latam — Comparación de Suplementos Cognitivos',
  description:
    'La plataforma independiente de comparación de nootrópicos para compradores en Latinoamérica. Reseñas basadas en evidencia y divulgación completa de afiliados.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab Latam',
  url: 'https://latam.thenootropiclab.com',
  description: 'Independent nootropic reviews for Latin America buyers.',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: 'https://latam.thenootropiclab.com',
  logo: 'https://latam.thenootropiclab.com/logo.png',
  description: 'Independent cognitive supplement reviews with clinical dosing audits and transparent affiliate disclosure.',
};

const features = [
  {
    icon: '🔬',
    title: 'Clinical dosing audits',
    desc: 'Every product review includes a dosing-vs-evidence table comparing each ingredient to the minimum effective dose from peer-reviewed trials.',
  },
  {
    icon: '🌎',
    title: 'Latam shipping verified',
    desc: 'All products ship internationally to Mexico, Brazil, Argentina, Colombia, Chile, and Peru. Customs and import duty notes included for each country.',
  },
  {
    icon: '⚖️',
    title: 'Subscription transparency',
    desc: "We score every brand on subscription cancellation experience. Trustpilot scores shown — including the bad ones.",
  },
];

const quickLinks = [
  {
    href: '/best-nootropics',
    title: 'Best Nootropics in Latam 2026',
    desc: 'Top picks with international shipping to Latin America confirmed.',
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
      <SchemaOrg schema={orgSchema} />

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Latam Market · Evidence-Graded · Affiliate-Disclosed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            The Independent Latam Guide to
            <br />
            <span className="text-green-700">Cognitive Supplements</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            We compare the best nootropic stacks available for Latin American buyers.
            International shipping confirmed. Customs notes for every country.
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
