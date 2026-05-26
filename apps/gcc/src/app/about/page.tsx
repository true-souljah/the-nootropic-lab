import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, buildAlternates} from '@nootropic/ui';

const SITE_URL = 'https://gcc.thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'About The Nootropic Lab GCC',
  description:
    'The Nootropic Lab GCC is an independent cognitive-supplement comparison site for buyers in Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman. Operated by . Evidence-graded reviews, clinical dosing audits, transparent affiliate disclosure.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/about/' }),
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'About The Nootropic Lab GCC',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About The Nootropic Lab GCC</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are an independent cognitive-supplement comparison site for buyers in the Gulf Cooperation Council
          (GCC) region. We score every product against the same 5-pillar methodology and disclose every
          commercial relationship.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We review nootropic supplements for buyers across the GCC — Saudi Arabia, the UAE, Qatar, Kuwait,
            Bahrain, and Oman. Every review includes a clinical dosing audit comparing each ingredient against
            the minimum effective dose from peer-reviewed trials. We score brands across ingredient quality,
            dosing-vs-evidence, formula transparency, value for money, and brand trust.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Read the full methodology →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">GCC-specific compliance &amp; sourcing notes</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Selling and importing supplements in the Gulf region carries region-specific obligations that
            buyers should verify before ordering. We surface the following in every product review where it
            applies:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>SFDA registration (Saudi Arabia).</strong> The Saudi Food and Drug Authority maintains
              the registration register for dietary and herbal supplements sold in the Kingdom. Many
              international nootropic stacks are not formally SFDA-registered and enter as personal-use
              imports. We flag SFDA status where known and recommend buyers verify directly with SFDA before
              ordering.
            </li>
            <li>
              <strong>Halal certification.</strong> Halal status is a primary purchase factor for many GCC
              consumers. We note when a product carries third-party halal certification (e.g., JAKIM, MUI,
              ESMA-recognised certifiers) versus when it is only halal-friendly by ingredient composition but
              uncertified.
            </li>
            <li>
              <strong>Capsule source disclosure.</strong> Capsule shells are a frequent oversight. Bovine and
              porcine gelatin shells are common in Western formulations; HPMC (hydroxypropyl methylcellulose,
              plant-based) shells are halal-neutral. We disclose capsule type — HPMC vs gelatin, and gelatin
              source where vendors publish it.
            </li>
            <li>
              <strong>Arabic labelling.</strong> GCC Standardisation Organisation (GSO) regulations require
              Arabic-language labelling for products formally distributed through GCC retail channels. Most
              direct-from-brand international shipments arrive in English-only labelling, which is acceptable
              for personal-use imports but not for resale.
            </li>
            <li>
              <strong>GCC pharmacy chain availability.</strong> Where products are stocked by regional pharmacy
              chains — BinSina (UAE), Aster (UAE/regional), Life Pharmacy (UAE), Al-Dawaa (Saudi Arabia),
              Nahdi (Saudi Arabia) — we note it. Pharmacy availability is a strong signal of formal regional
              compliance.
            </li>
          </ul>
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
              (subscription friction, hidden charges, regulator actions) are flagged in their reviews even
              when they pay competitive affiliate commissions.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The information on this website is for educational purposes only and is not medical advice.
            Nootropic supplements are not approved by SFDA, MOHAP, or any GCC-state health authority to
            diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional
            before starting any supplement regimen, particularly if you are pregnant, nursing, taking
            medication, or have a medical condition. Verify import status with your local authority before
            ordering. Individual results may vary.
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
