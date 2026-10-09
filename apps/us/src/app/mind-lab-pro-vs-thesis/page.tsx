import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'thesis-nootropics-review');


export const metadata: Metadata = {
  title: `Mind Lab Pro vs Thesis ${CURRENT_YEAR}: Universal Formula vs Personalised Stack`,
  description:
    'Independent comparison of Mind Lab Pro vs Thesis Nootropics. One universal formula vs personalised quiz-based stack — which approach works for you?',
  alternates: buildAlternates({ regionCode: 'us', path: '/mind-lab-pro-vs-thesis/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'Mind Lab Pro vs Thesis — Universal vs Personalised',
    description: 'Lean universal formula vs questionnaire-based personalisation. Which actually delivers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, Mind Lab Pro or Thesis?',
    a:
      'Different philosophies. Mind Lab Pro takes a single universal formula approach — same 11 ingredients for everyone, every dose disclosed, $69/month. Thesis takes a personalisation approach — 4-week trial pack of different formulas, then you pick which works for you; on its Clarity page a subscription is $59 for the first order, then $79 a month; its site sells four formulas (Clarity, Motivation, Stress Reset and Neuroprotection, checked 8 October 2026). Universal formulas have more replication evidence; personalisation has stronger user-experience data.',
  },
  {
    q: 'Is Thesis personalisation evidence-based?',
    a:
      'The personalisation is questionnaire-based, not biomarker-based. There\'s no genetic test, no neurochemistry profile — just self-reported preferences and goals. The questionnaire matches you to one of 4 pre-formulated stacks. This is closer to a recommendation engine than to true personalised medicine. For some users this lowers decision friction; for evidence-graded buyers, the lack of objective personalisation signal is a limitation.',
  },
  {
    q: 'How does Thesis pricing compare?',
    a:
      'Thesis (Clarity page, checked 7 October 2026): $129 for a one-time 1-month supply, or $59 for the first subscription order, then $79 a month. Mind Lab Pro: $69/month flat. After the first month Thesis costs more than Mind Lab Pro even on a single formula, and more again if you subscribe to several.',
  },
  {
    q: 'Are both caffeine-free?',
    a:
      'Mind Lab Pro is fully caffeine-free. Thesis varies by formula — Motivation contains 150mg caffeine per two-capsule serving; Clarity, Stress Reset and Neuroprotection are sold with or without caffeine (100mg in the caffeinated versions). Check each formula\'s label.',
  },
  {
    q: 'Which has better subscription transparency?',
    a:
      'Mind Lab Pro: no autoship — every order is manual reorder. Thesis: subscription model is the default; cancellation requires logging into account. Mind Lab Pro wins on subscription friction; Thesis wins on convenience for committed users.',
  },
  {
    q: 'Are these alternatives to Adderall?',
    a:
      'No. Both are dietary supplements regulated under DSHEA. Always consult a clinician for ADHD treatment.',
  },
];

const whoIsForA = [
  'Want a single universal formula with peer-reviewed RCT evidence',
  'Prefer no autoship — manual reorder only',
  'Are budget-conscious at $69/month flat',
  'Don\'t want to manage a quiz-based selection process',
];

const whoIsForB = [
  'Want to try multiple formulas before committing (4-week starter)',
  'Like the Thesis ecosystem (quiz-driven recommendations, formula switching)',
  'Are willing to pay $79 a month or more after a $59 first order for the personalisation flow',
  'Prefer caffeinated and caffeine-free formula options to mix and match',
];

const verdictParagraph =
  'Mind Lab Pro\'s single-universal-formula approach has stronger replication evidence (multiple RCTs published). Thesis\'s personalised-quiz approach has stronger user-experience data and lower friction for newcomers. For evidence-graded buyers prioritizing peer-reviewed data, Mind Lab Pro wins. For buyers who value try-multiple-formulas convenience, Thesis is fair.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHead
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
