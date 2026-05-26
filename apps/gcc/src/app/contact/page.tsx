import type { Metadata } from 'next';
import { SchemaOrg, buildAlternates, buildOpenGraph, buildTwitter} from '@nootropic/ui';

const SITE_URL = 'https://gcc.thenootropiclab.com';

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";

export const metadata: Metadata = {
  title: 'Contact The Nootropic Lab GCC',
  description:
    'Editorial corrections, partnership inquiries, reader feedback. Reach The Nootropic Lab GCC editorial team.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/contact/' }),
  openGraph: buildOpenGraph({ regionCode: 'gcc', path: '/contact/', title: 'Contact The Nootropic Lab GCC', description: 'Editorial corrections, partnership inquiries, reader feedback. Reach The Nootropic Lab GCC editorial team.' }),
  twitter: buildTwitter({ title: 'Contact The Nootropic Lab GCC', description: 'Editorial corrections, partnership inquiries, reader feedback. Reach The Nootropic Lab GCC editorial team.' }),
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: `${SITE_URL}/contact/`,
  name: 'Contact The Nootropic Lab GCC',
};

export default function ContactPage() {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={contactSchema} />

      <article className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact us</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We read every email. Choose the right address below so your message gets to the right person.
        </p>

        <div className="space-y-6">
          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Editorial corrections</h2>
            <p className="text-sm text-gray-700 mb-2">
              Spotted a factual error in a review? Found an outdated price or a discontinued SKU? We
              update content based on documented corrections.
            </p>
            <a
              href="mailto:editorial@thenootropiclab.com?subject=Correction%20request"
              className="inline-block text-green-700 underline text-sm font-medium"
            >
              editorial@thenootropiclab.com
            </a>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Reader feedback &amp; story tips</h2>
            <p className="text-sm text-gray-700 mb-2">
              Had an experience with a brand we cover? Want to share a subscription cancellation horror
              story? We use reader-survey data in our brand-trust scoring.
            </p>
            <a
              href="mailto:readers@thenootropiclab.com?subject=Reader%20feedback"
              className="inline-block text-green-700 underline text-sm font-medium"
            >
              readers@thenootropiclab.com
            </a>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Partnership &amp; affiliate inquiries</h2>
            <p className="text-sm text-gray-700 mb-2">
              Brand or affiliate-network outreach. Note: we do not accept paid placements, and affiliate
              relationships do not affect our editorial scores.
            </p>
            <a
              href="mailto:partnerships@thenootropiclab.com?subject=Partnership%20inquiry"
              className="inline-block text-green-700 underline text-sm font-medium"
            >
              partnerships@thenootropiclab.com
            </a>
          </section>
        </div>

        <section className="mt-10 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Editorial</h2>
          <p className="text-sm text-gray-700">
            The Nootropic Lab is editorially independent. For legal correspondence, contact{' '}
            <a href="mailto:legal@thenootropiclab.com" className="text-green-700 underline">
              legal@thenootropiclab.com
            </a>.
          </p>
        </section>
      </article>
    </PublicShell>
  );
}
