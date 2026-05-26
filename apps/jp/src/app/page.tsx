import Link from 'next/link';
import type { Metadata } from 'next';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const SITE_URL = 'https://jp.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

import LegacyShell from "@/components/LegacyShell";

export const metadata: Metadata = {
  title: 'The Nootropic Lab JP — Japan Nootropic Reviews (ノートロピクス)',
  description:
    'Independent cognitive supplement reviews for Japan buyers. MHLW import compliance notes, evidence-graded reviews, and domestic Japanese brands included.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/' }),
  openGraph: buildOpenGraph({ regionCode: 'jp', path: '/', title: 'The Nootropic Lab JP — Japan Nootropic Reviews (ノートロピクス)', description: 'Independent cognitive supplement reviews for Japan buyers. MHLW import compliance notes, evidence-graded reviews, and domestic Japanese brands included.' }),
  twitter: buildTwitter({ title: 'The Nootropic Lab JP — Japan Nootropic Reviews (ノートロピクス)', description: 'Independent cognitive supplement reviews for Japan buyers. MHLW import compliance notes, evidence-graded reviews, and domestic Japanese brands included.' }),
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Nootropic Lab JP',
  url: 'https://jp.thenootropiclab.com',
  description: 'Independent cognitive supplement reviews for Japan buyers.',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Nootropic Lab',
  url: 'https://jp.thenootropiclab.com',
  description: 'Independent cognitive supplement reviews with clinical dosing audits and transparent affiliate disclosure.',
};

const features = [
  {
    icon: '🔬',
    title: 'Clinical dosing audits',
    desc: 'Every product review includes a dosing-vs-evidence table comparing each ingredient to the minimum effective dose from peer-reviewed trials.',
  },
  {
    icon: '🗾',
    title: 'Japan import confirmed',
    desc: 'All international products listed ship directly to Japan. Japanese domestic brands (FANCL, Suntory) available on Amazon Japan.',
  },
  {
    icon: '⚖️',
    title: 'MHLW compliance notes',
    desc: 'We flag products that comply with MHLW personal import guidelines and note the ¥16,000 duty-free threshold for every order.',
  },
];

const quickLinks = [
  {
    href: '/best-nootropics',
    title: `Best Nootropics in Japan ${CURRENT_YEAR}`,
    desc: 'Top picks with Japan shipping confirmed and MHLW import notes.',
  },
  {
    href: '/nootropic-comparison',
    title: 'Interactive Comparison Tool',
    desc: 'Sort and filter every brand including Japanese domestic options.',
  },
  {
    href: '/methodology',
    title: 'Our Methodology',
    desc: 'How we score and review cognitive supplements.',
  },
];

export default function HomePage() {
  return (
    <LegacyShell>
      <SchemaOrg schema={websiteSchema} />
      <SchemaOrg schema={orgSchema} />

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            JP Market · MHLW Import Notes · Affiliate-Disclosed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {"Japan's Independent Guide to"}
            <br />
            <span className="text-green-700">Cognitive Supplements</span>
          </h1>
          <p className="text-base text-gray-400 mb-2">ノートロピクスの独立比較レビュー</p>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            We compare international and Japanese domestic nootropics. Every ingredient dose
            tested against clinical evidence. MHLW import guidelines clearly stated.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/best-nootropics"
              className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Best Nootropics {CURRENT_YEAR} →
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

      <section className="max-w-5xl mx-auto px-4 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by goal</h2>
        <p className="text-sm text-gray-500 mb-6">
          Different ingredients suit different cognitive goals. Each list ranks the products available in Japan — imported stacks plus FFC-notified (機能性表示食品) domestic brands.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/best-nootropics-for-focus" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">Focus</div>
            <div className="text-xs text-gray-500">L-theanine + caffeine, citicoline, L-tyrosine</div>
          </Link>
          <Link href="/best-nootropics-for-memory" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">Memory</div>
            <div className="text-xs text-gray-500">Bacopa, Lion&apos;s Mane (ヤマブシタケ), DHA, PS</div>
          </Link>
          <Link href="/best-nootropics-for-studying" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">Studying</div>
            <div className="text-xs text-gray-500">Sustained focus + memory consolidation for students</div>
          </Link>
          <Link href="/best-nootropics-for-aging" className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 transition-colors">
            <div className="font-semibold text-gray-900 text-sm mb-1">Aging Brain</div>
            <div className="text-xs text-gray-500">FFC-notified DHA + Ginkgo, plus PS and citicoline</div>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16 pt-12">
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
    </LegacyShell>
  );
}
