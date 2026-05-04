import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg } from '@nootropic/ui';

export const metadata: Metadata = {
  title: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
  description:
    'The independent nootropic comparison platform for US buyers. Evidence-graded reviews, clinical dosing audits, and transparent affiliate disclosure.',
  openGraph: {
    title: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
    description: 'Evidence-graded nootropic reviews. Clinical dosing audits. Transparent affiliate disclosure.',
    url: 'https://thenootropiclab.com',
    siteName: 'The Nootropic Lab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
    description: 'Evidence-graded nootropic reviews. Clinical dosing audits. Transparent affiliate disclosure.',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab',
  url: 'https://thenootropiclab.com',
  description: 'Independent cognitive supplement reviews for US buyers.',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: 'https://thenootropiclab.com',
  description: 'Independent cognitive supplement reviews with clinical dosing audits and transparent affiliate disclosure.',
};

const features = [
  {
    icon: '🔬',
    title: 'Clinical dosing audits',
    desc: 'Every product review includes a dosing-vs-evidence table comparing each ingredient to the minimum effective dose from peer-reviewed trials.',
  },
  {
    icon: '✅',
    title: 'NSF & third-party tested',
    desc: 'We prioritise products with independent third-party testing and flag brands with documented BBB or subscription complaints.',
  },
  {
    icon: '⚖️',
    title: 'Subscription transparency',
    desc: "We score every brand on subscription cancellation experience. Trustpilot scores shown inline — including the bad ones.",
  },
];

const quickLinks = [
  {
    href: '/best-nootropics',
    title: `Best Nootropics ${new Date().getFullYear()} (US)`,
    desc: 'Full comparison of top US brands with clinical dosing audit.',
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            US Market · Evidence-Graded · Affiliate-Disclosed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            The Independent US Guide to
            <br />
            <span className="text-green-700">Cognitive Supplements</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            We test every ingredient dose against peer-reviewed clinical trials. No anonymous
            authors. No hidden commissions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/best-nootropics"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Best Nootropics {new Date().getFullYear()} →
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

      {/* Feature grid */}
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

      {/* Quick links */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
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

      {/* Browse by goal */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by goal</h2>
        <p className="text-sm text-gray-500 mb-6">Different ingredients suit different cognitive goals.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/best-nootropics-for-focus/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">For focus</div>
            <div className="text-xs text-gray-500">L-theanine + caffeine, citicoline</div>
          </Link>
          <Link href="/best-nootropics-for-memory/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">For memory</div>
            <div className="text-xs text-gray-500">Bacopa, Lion&apos;s Mane, PS</div>
          </Link>
          <Link href="/best-nootropics-for-studying/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">For studying</div>
            <div className="text-xs text-gray-500">Sustained focus + retention</div>
          </Link>
          <Link href="/best-nootropics-for-aging/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">For aging brain</div>
            <div className="text-xs text-gray-500">PS FDA qualified claim</div>
          </Link>
          <Link href="/best-nootropics-for-adhd/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">ADHD-adjacent focus</div>
            <div className="text-xs text-gray-500">Honest editorial — NOT a substitute for treatment</div>
          </Link>
          <Link href="/natural-adderall-alternatives/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">Natural Adderall alternatives</div>
            <div className="text-xs text-gray-500">No supplement is equivalent — what evidence shows</div>
          </Link>
        </div>
      </section>

      {/* Compare top brands */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare top brands</h2>
        <p className="text-sm text-gray-500 mb-6">Side-by-side dosing audits + verdict.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link href="/mind-lab-pro-vs-alpha-brain/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm">Mind Lab Pro vs Alpha Brain</div>
          </Link>
          <Link href="/mind-lab-pro-vs-qualia-mind/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm">Mind Lab Pro vs Qualia Mind</div>
          </Link>
          <Link href="/alpha-brain-vs-qualia-mind/" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm">Alpha Brain vs Qualia Mind</div>
          </Link>
        </div>
      </section>
    </>
  );
}
