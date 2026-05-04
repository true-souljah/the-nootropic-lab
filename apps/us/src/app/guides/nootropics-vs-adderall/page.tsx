import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, AffiliateDisclosure } from '@nootropic/ui';
import { getAuthorBySlug, buildPersonAuthorReference } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Nootropics vs Adderall ${CURRENT_YEAR}: An Honest Comparison (NOT Equivalents)`,
  description:
    'Adderall is a Schedule II prescription stimulant. Nootropics are dietary supplements. They are not equivalents. This guide explains the actual differences in mechanism, evidence, and regulation.',
  alternates: { canonical: `${SITE_URL}/guides/nootropics-vs-adderall/` },
  openGraph: {
    title: 'Nootropics vs Adderall — Honest Comparison',
    description: 'Different mechanisms. Different regulation. Different efficacy. Here is what the science actually says.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `Nootropics vs Adderall ${CURRENT_YEAR}: Honest Comparison`,
  description: 'Adderall is a prescription stimulant; nootropics are supplements. They are not equivalents.',
  datePublished: `${CURRENT_YEAR}-04-30`,
  dateModified: new Date().toISOString().split('T')[0],
  author: buildPersonAuthorReference(author, SITE_URL),
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides/` },
    { '@type': 'ListItem', position: 3, name: 'Nootropics vs Adderall' },
  ],
};

const faqItems = [
  {
    q: 'Can a nootropic replace Adderall?',
    a: 'No. Adderall (amphetamine salts) is a Schedule II prescription stimulant for ADHD and narcolepsy with documented clinical efficacy. No dietary supplement matches its pharmacology, efficacy, or DEA scheduling. Anything claiming to be a "natural Adderall replacement" is marketing puffery, not pharmacological equivalence.',
  },
  {
    q: 'Do nootropics work on the same neurotransmitters as Adderall?',
    a: 'Some do, partially. Adderall actively releases dopamine and norepinephrine and inhibits their reuptake. L-tyrosine (a nootropic) is a precursor amino acid for both — it provides building blocks but does not actively release stored neurotransmitter. The mechanisms are fundamentally different even though they touch the same chemistry.',
  },
  {
    q: 'Are nootropics safer than Adderall?',
    a: 'Different risk profiles. Adderall risks: cardiovascular strain, dependence, sleep disruption, appetite suppression, potential misuse. Nootropic risks (the ones on this site): mild GI upset, sleep issues from caffeine, drug interactions for some ingredients (L-tyrosine + MAOIs, for example). Neither is risk-free; clinically managed Adderall under a prescriber is generally well-characterized; supplement risks vary by quality control of the manufacturer.',
  },
  {
    q: 'I have ADHD. What should I do?',
    a: 'See a qualified clinician for evaluation. ADHD is a clinical diagnosis with effective evidence-based treatments — stimulants (Adderall, Vyvanse, Ritalin), non-stimulants (atomoxetine/Strattera, guanfacine), and behavioral support. Supplements may complement (not replace) treatment under clinician supervision. Self-managing suspected ADHD with supplements rather than seeking diagnosis can mean years of suboptimal cognitive function.',
  },
  {
    q: 'I don\'t have ADHD but want focus help. What\'s the cleanest legal option?',
    a: 'Caffeine + L-theanine in a 1:2 ratio (100mg caffeine + 200mg L-theanine) is the most-evidence-backed legal cognitive-enhancement combination, available cheaply at any pharmacy. For longer-term cognitive demand, add citicoline (250-500mg/day). For memory consolidation over study periods, add Bacopa Monnieri. Read our beginner stack guide for the full sequencing.',
  },
  {
    q: 'Is buying Adderall online without a prescription safe?',
    a: 'No, and it is illegal in most jurisdictions. Counterfeit Adderall sold online has been implicated in fentanyl-related deaths (2022-present DEA warnings). If you cannot access a prescriber, that is a signal to find a telehealth ADHD clinician — not to buy unverified pills.',
  },
  {
    q: 'What about modafinil — is that a nootropic?',
    a: 'Modafinil (Provigil) is a prescription wakefulness-promoting medication, not a supplement. Its pharmacology differs from Adderall (different mechanism of action). It is sometimes used off-label for cognitive enhancement under clinician supervision. Online vendors selling modafinil without a prescription are operating in regulatory gray-or-black territory and quality control is inconsistent.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function Page() {
  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <Link href="/guides/" className="hover:text-green-700">Guides</Link>
          {' / '}
          <span>Nootropics vs Adderall</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>
            Reviewed by{' '}
            <Link href={`/authors/${author.slug}/`} className="text-gray-700 hover:text-green-700 underline">
              <strong>{author.name}</strong>
            </Link>
          </span>
          <span>·</span>
          <span>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Nootropics vs Adderall: An Honest Comparison
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Different drug classes. Different mechanisms. Different regulation. Different efficacy. The marketing comparison
          oversimplifies in dangerous ways. Here is what the actual science says.
        </p>

        <AffiliateDisclosure />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-8 text-sm text-amber-900">
          <strong className="block mb-1">Critical disclaimer</strong>
          This guide is not medical advice. Adderall is a Schedule II prescription stimulant for ADHD and narcolepsy.
          No dietary supplement is equivalent. If you suspect you have ADHD, see a qualified clinician for evaluation.
          Misuse of unprescribed stimulants is illegal and dangerous. Counterfeit Adderall sold online has been
          implicated in fentanyl-related deaths.
        </aside>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Side-by-side: regulation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Dimension</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Adderall</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Nootropic supplements</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Drug class</td>
                  <td className="px-3 py-2 text-gray-700">Amphetamine salts (CNS stimulant)</td>
                  <td className="px-3 py-2 text-gray-700">Dietary supplements (botanicals, amino acids, choline donors)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">DEA scheduling</td>
                  <td className="px-3 py-2 text-gray-700">Schedule II (high abuse potential)</td>
                  <td className="px-3 py-2 text-gray-700">Unscheduled — legal OTC</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">FDA approval</td>
                  <td className="px-3 py-2 text-gray-700">Approved for ADHD + narcolepsy</td>
                  <td className="px-3 py-2 text-gray-700">Not approved to treat any disease (DSHEA framework)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Access</td>
                  <td className="px-3 py-2 text-gray-700">Prescription only</td>
                  <td className="px-3 py-2 text-gray-700">Pharmacy, online, retail</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Misuse risk</td>
                  <td className="px-3 py-2 text-gray-700">High — federal controlled substance</td>
                  <td className="px-3 py-2 text-gray-700">Low for ingredients on this site</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Side-by-side: mechanism</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Mechanism</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Adderall</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Nootropics (typical)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Dopamine</td>
                  <td className="px-3 py-2 text-gray-700">Active release + reuptake inhibition</td>
                  <td className="px-3 py-2 text-gray-700">L-tyrosine provides precursor; no active release</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Norepinephrine</td>
                  <td className="px-3 py-2 text-gray-700">Active release + reuptake inhibition</td>
                  <td className="px-3 py-2 text-gray-700">L-tyrosine precursor</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Adenosine antagonism</td>
                  <td className="px-3 py-2 text-gray-700">No</td>
                  <td className="px-3 py-2 text-gray-700">Caffeine — most studied legal mechanism</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Acetylcholine</td>
                  <td className="px-3 py-2 text-gray-700">No direct effect</td>
                  <td className="px-3 py-2 text-gray-700">Citicoline, Alpha-GPC support choline pathway</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Stress / fatigue resistance</td>
                  <td className="px-3 py-2 text-gray-700">Indirect via stimulant effect</td>
                  <td className="px-3 py-2 text-gray-700">Rhodiola Rosea (adaptogen)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-3 italic">
            Even where nootropics touch the same neurotransmitter as Adderall, the mechanism is fundamentally different —
            providing precursors vs actively releasing stored neurotransmitter is not equivalent pharmacology.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Side-by-side: evidence</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Use case</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Adderall</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Best nootropic option</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">ADHD treatment</td>
                  <td className="px-3 py-2 text-gray-700">Strong RCT evidence; first-line treatment</td>
                  <td className="px-3 py-2 text-gray-700">No supplement is FDA-approved for ADHD; weak adjunct evidence at best</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Healthy-adult focus</td>
                  <td className="px-3 py-2 text-gray-700">Off-label; ethical + legal concerns; cognitive enhancement studied but disputed</td>
                  <td className="px-3 py-2 text-gray-700">Caffeine + L-theanine — well-replicated</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">Long-term memory</td>
                  <td className="px-3 py-2 text-gray-700">No specific benefit shown</td>
                  <td className="px-3 py-2 text-gray-700">Bacopa Monnieri — multiple RCTs</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">Sleep deprivation</td>
                  <td className="px-3 py-2 text-gray-700">Short-term effective; not sustainable</td>
                  <td className="px-3 py-2 text-gray-700">L-tyrosine has documented benefit during cognitive load + sleep loss</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">If you suspect you have ADHD</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            See a clinician. Even if Adderall is the wrong fit (cardiovascular contraindications, dependence concerns, side effects),
            there are non-stimulant prescription options (atomoxetine/Strattera, guanfacine) plus behavioral support that supplements
            cannot replace. The cost of years of suboptimal cognitive function from undiagnosed ADHD is much higher than the cost of
            evaluation.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For US readers without a clinician relationship, telehealth ADHD evaluation (Done, Cerebral, ADHD Online) is widely available.
            Vet the provider — choose one that conducts proper diagnostic interviews, not a 5-minute quiz mill.
          </p>
        </section>

        <section className="my-10 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">If you don&apos;t have ADHD but want focus help</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Start with caffeine + L-theanine. It is the most-evidence-backed legal cognitive enhancement combination,
            available at any pharmacy for ~$8/month. See our{' '}
            <Link href="/guides/best-nootropic-stack-for-beginners/" className="text-green-700 underline">
              beginner stack guide
            </Link>{' '}
            for the full sequencing.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For multi-ingredient stacks, see{' '}
            <Link href="/best-nootropics-for-focus/" className="text-green-700 underline">
              Best Nootropics for Focus
            </Link>{' '}
            and our{' '}
            <Link href="/natural-adderall-alternatives/" className="text-green-700 underline">
              honest editorial on natural Adderall alternatives
            </Link>{' '}
            (which does not claim equivalence).
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
