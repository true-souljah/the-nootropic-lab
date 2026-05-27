import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaOrg, AffiliateDisclosure, buildAlternates} from '@nootropic/ui';
import { buildPersonAuthorReference } from '@nootropic/data';

const CURRENT_YEAR = new Date().getFullYear();

import { PublicShell } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import { SITE_URL } from '@/lib/region';

export const metadata: Metadata = {
  title: `Best Nootropic Stack for Beginners ${CURRENT_YEAR}: Start Here`,
  description:
    'A no-hype beginner nootropic stack guide. Start with caffeine + L-theanine. Add citicoline if cognitive demand is heavy. Add Bacopa for long-term memory consolidation.',
  alternates: buildAlternates({ regionCode: 'us', path: '/guides/best-nootropic-stack-for-beginners/' }),
  openGraph: {
    title: 'Best Nootropic Stack for Beginners',
    description: 'Start with the most-evidence-backed combination. Layer up only if you respond.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `Best Nootropic Stack for Beginners ${CURRENT_YEAR}`,
  description: 'A no-hype beginner nootropic stack guide.',
  datePublished: `${CURRENT_YEAR}-04-30`,
  dateModified: new Date().toISOString().split('T')[0],
  author: buildPersonAuthorReference(undefined, SITE_URL),
  publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: SITE_URL },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides/` },
    { '@type': 'ListItem', position: 3, name: 'Best Nootropic Stack for Beginners' },
  ],
};

const faqItems = [
  {
    q: 'What is the simplest nootropic stack to start with?',
    a: '100mg caffeine + 200mg L-theanine, taken together once in the morning. The most-evidence-backed cognitive-enhancement combination. Costs ~$8/month total. Try this for 4 weeks before adding anything else.',
  },
  {
    q: 'Should I take a multi-ingredient stack like Mind Lab Pro right away?',
    a: 'Probably not. Multi-ingredient stacks are convenient but make it impossible to know which ingredient is helping. Start with caffeine + L-theanine alone, then add ONE ingredient at a time (Bacopa or citicoline) for 4 weeks each. After 12 weeks of methodical testing, switch to a stack if the convenience justifies giving up the signal.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Caffeine + L-theanine: 30-60 minutes (acute). Citicoline: 2-4 weeks. Bacopa: 8-12 weeks. Lion\'s Mane: 8-16 weeks. Plan for 12 weeks of consistent dosing before judging long-onset ingredients.',
  },
  {
    q: 'Is this safe for healthy adults?',
    a: 'Caffeine + L-theanine, citicoline, and Bacopa are generally regarded as safe for healthy adults at the doses on this page. People taking blood-pressure medication, MAOIs, anticonvulsants, or with bipolar diagnoses should consult a clinician first. Pregnant or breastfeeding individuals should avoid Bacopa.',
  },
  {
    q: 'Why not start with the strongest stack?',
    a: 'Three reasons. (1) You don\'t know which ingredient your physiology responds to until you test in isolation. (2) "Strongest" stacks often include underdosed ingredients that look impressive on the label but don\'t do much. (3) If you have a side effect on a 28-ingredient stack, you have no idea which ingredient caused it.',
  },
  {
    q: 'How much should I budget?',
    a: 'Foundation tier (caffeine + L-theanine): ~$8/month. Add citicoline: +$25/month. Add Bacopa: +$15/month. Total methodical-stack: ~$50/month. Multi-ingredient products like Mind Lab Pro ($69/month) cost more but include all of these plus phosphatidylserine, Rhodiola, and Lion\'s Mane.',
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
    <PublicShell searchItems={searchItems} uiStrings={uiStrings}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {' / '}
          <Link href="/guides/" className="hover:text-green-700">Guides</Link>
          {' / '}
          <span>Best Nootropic Stack for Beginners</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>
            Reviewed by{' '}
            <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong>
          </span>
          <span>·</span>
          <span>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Best Nootropic Stack for Beginners {CURRENT_YEAR}
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          The methodical answer is unsexy: start with caffeine + L-theanine alone for 4 weeks. Add one ingredient at a time. Most people who give up on nootropics gave up on a 28-ingredient stack and never tested anything in isolation.
        </p>

        <AffiliateDisclosure />

        <aside className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-8 text-sm text-amber-900">
          <strong className="block mb-1">Health note</strong>
          This guide is for healthy adults. Talk to a clinician first if you take prescription medication, are pregnant or breastfeeding, or have a diagnosed cognitive or mental-health condition. Nootropic supplements are not approved by the FDA to treat any disease.
        </aside>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tier 1 (weeks 1-4): caffeine + L-theanine</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            This is the most-replicated cognitive-enhancement combination in the literature. L-theanine smooths the focus curve of caffeine, reduces jitter, and prevents the post-coffee crash. The 1:2 ratio (100mg caffeine + 200mg L-theanine) is the standard.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Take it once in the morning with breakfast. Skip on weekends or any day you don&apos;t need a focus boost — caffeine builds tolerance with daily use.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>How to source:</strong> A pharmacy-brand caffeine pill (100mg) + a basic L-theanine capsule (Suntheanine is the standardized form). Total cost: ~$8/month.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>What to evaluate after 4 weeks:</strong> Are you more focused without the jitter? If yes, this is your foundation. If no caffeine response or anxiety dominates, skip caffeine entirely and try the next tier with L-theanine alone.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tier 2 (weeks 5-8): add citicoline</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Citicoline (CDP-Choline) is a choline donor + uridine source. It supports phospholipid synthesis and acetylcholine availability — the neurotransmitter most associated with attention and learning. Multiple RCTs show benefit at 250-500mg/day in healthy adults.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cognizin is the standardized form most products use. Take 250mg with breakfast alongside the caffeine + L-theanine.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>How to source:</strong> Cognizin 250mg standalone capsules (Jarrow, Now Foods, or any brand listing Cognizin specifically). Total cost: ~$25/month at single-ingredient pricing.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>What to evaluate after 4 weeks:</strong> Subjective sense of mental endurance during long cognitive work — that &quot;running on empty&quot; feeling at hour 4 should reduce. Not a dramatic effect; cumulative.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tier 3 (weeks 9-12+): add Bacopa Monnieri for memory</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bacopa is the most-replicated memory ingredient — multiple RCTs show improved memory consolidation after 8-12 weeks at 300mg standardized to 50% bacosides. This is NOT an acute-effect ingredient; the benefit is cumulative and shows in retention of material studied during the dosing window.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Take 300mg with food (Bacopa can cause GI upset on empty stomach). Continue daily for at least 12 weeks before judging.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>How to source:</strong> Standardized to 50% bacosides — read the label. Generic Bacopa at unknown standardization is not the studied compound. Total cost: ~$15/month.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>What to evaluate after 12 weeks:</strong> Information you studied 4 weeks ago should be more accessible than usual. The classic signal is &quot;you only know it worked when you stop taking it and notice the regression.&quot;
          </p>
        </section>

        <section className="my-10 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">When to switch to a multi-ingredient stack</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            After 12 weeks of methodical single-ingredient testing, you&apos;ll know which ingredients your physiology responds to. At that point, the convenience of a pre-formulated stack often outweighs the signal-loss.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            For most beginners who responded to caffeine + L-theanine + citicoline, <Link href="/mind-lab-pro-review/" className="text-green-700 underline">Mind Lab Pro</Link> is the natural step up — it includes both at clinical doses plus Bacopa, phosphatidylserine, Rhodiola, and Lion&apos;s Mane in one capsule.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For more breadth, see our <Link href="/best-nootropics/" className="text-green-700 underline">full Best Nootropics ranking</Link>.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What NOT to start with</h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong className="text-gray-900">Racetams (piracetam, aniracetam):</strong> Sold as &quot;research chemicals&quot; in the US. Regulatory uncertainty + inconsistent quality control. Not for beginners.
            </li>
            <li>
              <strong className="text-gray-900">Modafinil:</strong> Prescription drug. Illegal to import without a prescription. Not a supplement.
            </li>
            <li>
              <strong className="text-gray-900">Phenibut, kratom:</strong> Variable regulatory status; dependence + withdrawal risks. Not nootropics in the conventional sense.
            </li>
            <li>
              <strong className="text-gray-900">28-ingredient megadose stacks:</strong> See above. Convenience over signal.
            </li>
          </ul>
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

        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Related reading</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/best-nootropics-for-focus/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Focus</div>
              <div className="text-xs text-gray-500">L-theanine + caffeine, citicoline, L-tyrosine</div>
            </Link>
            <Link href="/best-nootropics-for-memory/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics for Memory</div>
              <div className="text-xs text-gray-500">Bacopa, Lion&apos;s Mane, phosphatidylserine</div>
            </Link>
            <Link href="/methodology/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Our Methodology</div>
              <div className="text-xs text-gray-500">How we score nootropic supplements</div>
            </Link>
            <Link href="/best-nootropics/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">Best Nootropics {CURRENT_YEAR}</div>
              <div className="text-xs text-gray-500">Full ranked comparison</div>
            </Link>
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
