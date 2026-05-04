import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg } from '@nootropic/ui';

const SITE_URL = 'https://au.thenootropiclab.com';

export const metadata: Metadata = {
  title: 'About The Nootropic Lab AU',
  description:
    'The Nootropic Lab AU is an independent cognitive-supplement comparison site for Australian buyers, Evidence-graded reviews, TGA Personal Importation Scheme guidance, and transparent affiliate disclosure.',
  alternates: { canonical: `${SITE_URL}/about/` },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'About The Nootropic Lab AU',
  publisher: {
    '@type': 'Organization',
    name: 'The Nootropic Lab',
    url: SITE_URL,
  },
};

export default function AboutPage() {
  return (
    <>
      <SchemaOrg schema={aboutSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About The Nootropic Lab AU</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are an independent cognitive-supplement comparison site for Australian buyers. We score
          every product against the same 5-pillar methodology, flag whether it is TGA-listed (with its
          AUST L number where applicable), and disclose every commercial relationship.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We review nootropic supplements for buyers across Australia &mdash; New South Wales,
            Victoria, Queensland, Western Australia, South Australia, Tasmania, the ACT, and the
            Northern Territory. Every review includes a clinical dosing audit comparing each
            ingredient against the minimum effective dose from peer-reviewed trials. We score brands
            across ingredient quality, dosing-vs-evidence, formula transparency, value for money, and
            brand trust.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Read the full methodology →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Australian regulatory context</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            In Australia, complementary medicines (including most cognitive supplements) are regulated
            by the <strong>Therapeutic Goods Administration (TGA)</strong>. Products legally sold in
            Australia &mdash; including those stocked at <strong>Chemist Warehouse</strong>, Priceline,
            and other Australian retailers &mdash; are typically <em>listed</em> on the Australian
            Register of Therapeutic Goods (ARTG) and carry an <strong>AUST L</strong> number on the
            label. We surface AUST L numbers in reviews where they apply, alongside the manufacturer
            and any third-party testing documentation.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For products not listed on the ARTG, Australian residents may legally import them under
            the <strong>TGA Personal Importation Scheme</strong> &mdash; up to a 3-month supply for
            personal use, without a permit, provided the substance is not a Schedule 4 (prescription)
            or Schedule 8 (controlled) drug. Our country-and-state-specific reviews call out whether
            a product is TGA-listed, available via Australian retailers, or only available via
            personal import.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who we are</h2>
          <p className="text-gray-700 leading-relaxed">
            The Nootropic Lab is editorially independent.{' '}
            <strong>The Nootropic Lab</strong> is an independent editorial team building evidence-graded
            comparison sites in regulated verticals (financial services, supplements, prediction markets).
            Editorial is led by The Nootropic Lab Editorial Team. Every review carries a named author byline &mdash; no
            anonymous content. Meet the editor.
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
              outbound links, we may earn a commission at no extra cost to you. Affiliate relationships
              do not affect our editorial scores or rankings.
            </li>
            <li>
              <strong>We score the bad alongside the good.</strong> Brands with documented complaints
              (subscription friction, hidden charges, ACCC actions, TGA advertising breaches) are
              flagged in their reviews even when they pay competitive affiliate commissions.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The information on this website is for educational purposes only and is not medical advice.
            Nootropic supplements are not approved by the TGA to diagnose, treat, cure, or prevent any
            disease. Always consult a qualified healthcare professional &mdash; ideally one registered
            with the Australian Health Practitioner Regulation Agency (AHPRA) &mdash; before starting
            any supplement regimen, particularly if you are pregnant, nursing, taking medication, or
            have a medical condition. Individual results may vary.
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
    </>
  );
}
