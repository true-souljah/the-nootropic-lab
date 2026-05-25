import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg } from '@nootropic/ui';

const SITE_URL = 'https://eu.thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'About The Nootropic Lab EU',
  description:
    'The Nootropic Lab EU is an independent cognitive-supplement comparison site for European buyers, EUR pricing, EU regulatory compliance, transparent affiliate disclosure.',
  alternates: { canonical: `${SITE_URL}/about/` },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'About The Nootropic Lab EU',
  publisher: {
    '@type': 'Organization',
    name: 'The Nootropic Lab EU',
    url: SITE_URL,
  },
};

export default function AboutPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={aboutSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About The Nootropic Lab EU</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are an independent cognitive-supplement comparison site built specifically for buyers
          across the 27 EU member states. We score every product against the same 5-pillar
          methodology, verify EU regulatory compliance, and disclose every commercial relationship.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We review nootropic supplements for buyers in all 27 EU member states, with localised
            coverage in English, German, French, and Portuguese. Every product in our comparison
            table has a dedicated EU storefront (EUR pricing, no import duties) and has been checked
            against{' '}
            <strong>EU Directive 2002/46/EC</strong> on food supplements,{' '}
            <strong>Regulation (EC) 1924/2006</strong> on EFSA-authorised health claims, and{' '}
            <strong>Regulation (EU) 2015/2283</strong> on Novel Food authorisation. Every review
            includes a clinical dosing audit comparing each ingredient against the minimum effective
            dose from peer-reviewed trials.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Read the full methodology →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who we are</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab EU is editorially independent.{' '}
            <strong>The Nootropic Lab</strong> is an independent editorial team building
            evidence-graded comparison sites in regulated verticals (financial services, supplements,
            prediction markets). Editorial is led by The Nootropic Lab Editorial Team. Every review carries a named
            author byline — no anonymous content.{' '}
            Meet the editor.
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
              outbound links, we may earn a commission at no extra cost to you. Affiliate
              relationships do not affect our editorial scores or rankings.
            </li>
            <li>
              <strong>We score the bad alongside the good.</strong> Brands with documented complaints
              (subscription friction, hidden charges, regulatory actions) are flagged in their
              reviews even when they pay competitive affiliate commissions.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The information on this website is for educational purposes only and is not medical
            advice. Nootropic supplements are regulated as food supplements in the EU under
            Directive 2002/46/EC and are not intended to diagnose, treat, cure, or prevent any
            disease. Health claims used on this site are limited to those authorised by the European
            Food Safety Authority (EFSA) under Regulation (EC) 1924/2006. Always consult a qualified
            healthcare professional before starting any supplement regimen, particularly if you are
            pregnant, nursing, taking medication, or have a medical condition. Individual results
            may vary.
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
