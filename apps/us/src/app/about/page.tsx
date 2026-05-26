import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'About The Nootropic Lab',
  description:
    'The Nootropic Lab is an independent cognitive-supplement comparison site. Evidence-graded reviews, clinical dosing audits, transparent affiliate disclosure.',
  alternates: buildAlternates({ regionCode: 'us', path: '/about/' }),
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'About The Nootropic Lab',
  publisher: {
    '@type': 'Organization',
    name: 'The Nootropic Lab',
    url: SITE_URL,
  },
};

export default function AboutPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={aboutSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About The Nootropic Lab</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are an independent cognitive-supplement comparison site. We score every product against the
          same 5-pillar methodology. We disclose every commercial relationship.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We review nootropic supplements for buyers in 8 markets — US, EU, UK, Canada, Australia, Japan,
            LATAM, GCC, and Southeast Asia. Every review includes a clinical dosing audit comparing each
            ingredient against the minimum effective dose from peer-reviewed trials. We score brands across
            ingredient quality, dosing-vs-evidence, formula transparency, value for money, and brand trust.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Read the full methodology →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who we are</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab is an independent editorial team focused on evidence-graded comparison
            content in regulated verticals (financial services, supplements, prediction markets). Every
            review follows the same 5-pillar scoring methodology and disclosure framework — no paid
            placements, no hidden commissions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Editorial independence</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>No paid placements.</strong> We do not accept payment in exchange for reviews,
              rankings, or favorable scores.
            </li>
            <li>
              <strong>Affiliate links are disclosed.</strong> When you purchase a product through our
              outbound links, we may earn a commission at no extra cost to you. Affiliate relationships do
              not affect our editorial scores or rankings.
            </li>
            <li>
              <strong>We score the bad alongside the good.</strong> Brands with documented complaints
              (subscription friction, hidden charges, FTC actions) are flagged in their reviews even when
              they pay competitive affiliate commissions.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The information on this website is for educational purposes only and is not medical advice.
            Nootropic supplements are not approved by the FDA to diagnose, treat, cure, or prevent any
            disease. Always consult a qualified healthcare professional before starting any supplement
            regimen, particularly if you are pregnant, nursing, taking medication, or have a medical
            condition. Individual results may vary.
          </p>
        </section>

        <section className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Want to reach us?</h2>
          <p className="text-sm text-gray-700 mb-3">
            Editorial corrections, partnership inquiries, and reader feedback all go through{' '}
            <Link href="/contact/" className="text-green-700 underline">our contact page</Link>.
          </p>
        </section>
      </article>
    </PublicShell>
  );
}
