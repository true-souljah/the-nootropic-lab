import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const SITE_URL = 'https://sea.thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'About The Nootropic Lab SEA',
  description:
    'The Nootropic Lab SEA is an independent cognitive-supplement comparison site for Southeast Asia, Per-country regulatory notes for HSA, NPRA, BPOM, FDA, VFA — Halal certification flagged for ID/MY.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/about/' }),
  openGraph: buildOpenGraph({ regionCode: 'sea', path: '/about/', title: 'About The Nootropic Lab SEA', description: 'The Nootropic Lab SEA is an independent cognitive-supplement comparison site for Southeast Asia, Per-country regulatory notes for HSA, NPRA, BPOM, FDA, VFA — Halal certification flagged for ID/MY.' }),
  twitter: buildTwitter({ title: 'About The Nootropic Lab SEA', description: 'The Nootropic Lab SEA is an independent cognitive-supplement comparison site for Southeast Asia, Per-country regulatory notes for HSA, NPRA, BPOM, FDA, VFA — Halal certification flagged for ID/MY.' }),
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about/`,
  name: 'About The Nootropic Lab SEA',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About The Nootropic Lab SEA</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We are an independent cognitive-supplement comparison site for Southeast Asia. We score every
          product against the same 5-pillar methodology and disclose every commercial relationship.
          Per-country regulatory and shipping notes for Singapore, Malaysia, Indonesia, the Philippines,
          Thailand, and Vietnam are attached to every recommendation.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we do</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We review nootropic supplements for buyers across Southeast Asia. Every review includes a
            clinical dosing audit comparing each ingredient against the minimum effective dose from
            peer-reviewed trials. We score brands across ingredient quality, dosing-vs-evidence, formula
            transparency, value for money, and brand trust — and we tag products by regional availability
            (direct international shipping, Watsons / Guardian / Mannings retail, Shopee / Lazada storefronts,
            and TGA-AU import pathways such as Blackmores and Nature&apos;s Own).
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link href="/methodology" className="text-green-700 underline">Read the full methodology →</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">SEA regulatory landscape</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Each Southeast Asian market has its own regulator with distinct import, labelling, and
            health-claim rules. We surface the relevant authority on every product page so buyers know what
            applies to them:
          </p>
          <ul className="space-y-2 text-gray-700 mb-3">
            <li>
              <strong>Singapore — HSA (Health Sciences Authority).</strong> Most permissive personal-import
              regime in the region; food supplements do not require pre-market approval but health claims are
              tightly controlled.
            </li>
            <li>
              <strong>Malaysia — NPRA (National Pharmaceutical Regulatory Agency).</strong> Domestically sold
              supplements require MAL registration. Imported products for personal use are generally allowed
              within reasonable quantities. <strong>Halal certification (JAKIM)</strong> is effectively
              mandatory for any product positioned for the Muslim majority market.
            </li>
            <li>
              <strong>Indonesia — BPOM (Badan Pengawas Obat dan Makanan).</strong> Most restrictive market for
              commercial sale: BPOM registration is required, and <strong>Halal certification (BPJPH)</strong>{' '}
              is mandatory by law for food and supplement products. Personal imports are permitted in limited
              quantities.
            </li>
            <li>
              <strong>Philippines — FDA Philippines.</strong> CPR (Certificate of Product Registration) required
              for commercial sale. Personal imports tolerated subject to BoC inspection.
            </li>
            <li>
              <strong>Thailand — Thai FDA.</strong> Food supplement registration required for retail sale.
              Personal imports under reasonable quantities are generally cleared.
            </li>
            <li>
              <strong>Vietnam — VFA (Vietnam Food Administration).</strong> Functional-food declaration required
              for commercial channels. Personal imports permitted within customs limits.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Many SEA buyers also access Australian-formulated stacks via the{' '}
            <strong>TGA (Therapeutic Goods Administration) listed-medicine pathway</strong> — products such as
            Blackmores and Nature&apos;s Own are widely distributed through Watsons and Guardian retail across
            the region. Shopee and Lazada are the dominant e-commerce surfaces for both regional and imported
            stacks.
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
              (subscription friction, hidden charges, labelling violations flagged by HSA, NPRA, BPOM, the
              Thai FDA, FDA Philippines, or VFA) are flagged in their reviews even when they pay competitive
              affiliate commissions.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Health disclaimer</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The information on this website is for educational purposes only and is not medical advice.
            Nootropic supplements are not approved by HSA, NPRA, BPOM, the Thai FDA, FDA Philippines, VFA, or
            any other Southeast Asian regulator to diagnose, treat, cure, or prevent any disease. Always
            consult a qualified healthcare professional before starting any supplement regimen, particularly
            if you are pregnant, nursing, taking medication, or have a medical condition. Individual results
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
