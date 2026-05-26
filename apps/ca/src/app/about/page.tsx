import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const SITE_URL = 'https://ca.thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'About The Nootropic Lab Canada',
  description:
    'The Nootropic Lab Canada is an independent cognitive-supplement comparison site Bilingual (en-CA / fr-CA), Health Canada NPN-aware reviews, transparent affiliate disclosure.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/about/' }),
  openGraph: buildOpenGraph({ regionCode: 'ca', path: '/about/', title: 'About The Nootropic Lab Canada', description: 'The Nootropic Lab Canada is an independent cognitive-supplement comparison site Bilingual (en-CA / fr-CA), Health Canada NPN-aware reviews, transparent affiliate disclosure.' }),
  twitter: buildTwitter({ title: 'About The Nootropic Lab Canada', description: 'The Nootropic Lab Canada is an independent cognitive-supplement comparison site Bilingual (en-CA / fr-CA), Health Canada NPN-aware reviews, transparent affiliate disclosure.' }),
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'About The Nootropic Lab Canada',
  inLanguage: ['en-CA', 'fr-CA'],
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About The Nootropic Lab Canada</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are an independent cognitive-supplement comparison site for Canadian buyers. We score every
          product against the same 5-pillar methodology, surface Health Canada NPN status where it exists,
          and disclose every commercial relationship.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We review nootropic supplements for buyers in Canada in both English (en-CA) and French (fr-CA),
            with bilingual product labelling expectations baked into our editorial process. Every review
            includes a clinical dosing audit comparing each ingredient against the minimum effective dose
            from peer-reviewed trials. We score brands across ingredient quality, dosing-vs-evidence, formula
            transparency, value for money, and brand trust.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Read the full methodology →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health Canada &amp; the NPN system</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            In Canada, most nootropic supplements are regulated as Natural Health Products (NHPs) by Health
            Canada under the Natural and Non-prescription Health Products Directorate. Products legally sold
            in Canada should display a <strong>Natural Product Number (NPN)</strong> or, for homeopathic
            preparations, a DIN-HM. We flag products without a Canadian NPN and explain the import path
            (CUSMA/USMCA personal-use orders, customs treatment) for international brands.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are not a pharmacy and do not sell products. We rate the brands we link to and disclose every
            affiliate relationship.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Bilingual labelling &amp; Quebec consumers</h2>
          <p className="text-gray-700 leading-relaxed">
            Federally regulated NHPs sold in Canada must carry bilingual (English / French) labels. For
            Quebec consumers, we publish a French-Canadian (fr-CA) edition at{' '}
            <Link href="/fr" className="text-green-700 underline">/fr</Link> and apply Quebec&apos;s
            Consumer Protection Act and Charter of the French Language standards to our affiliate
            disclosures and price representations.
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
              (subscription friction, hidden charges, regulatory actions, missing NPN) are flagged in their
              reviews even when they pay competitive affiliate commissions.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The information on this website is for educational purposes only and is not medical advice.
            Natural Health Products regulated by Health Canada are not approved to diagnose, treat, cure,
            or prevent any disease unless explicitly authorised on the product&apos;s NPN listing. Always
            consult a qualified healthcare professional before starting any supplement regimen,
            particularly if you are pregnant, nursing, taking medication, or have a medical condition.
            Individual results may vary.
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
