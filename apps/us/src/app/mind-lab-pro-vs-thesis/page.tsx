import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'thesis-nootropics-review');

export const metadata: Metadata = {
  title: `Mind Lab Pro vs Thesis ${CURRENT_YEAR}: Universal Formula vs Personalised Stack`,
  description:
    'Independent comparison of Mind Lab Pro vs Thesis Nootropics. One universal formula vs personalised quiz-based stack — which approach works for you?',
  alternates: { canonical: `${SITE_URL}/mind-lab-pro-vs-thesis/` },
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
      'Different philosophies. Mind Lab Pro takes a single universal formula approach — same 11 ingredients for everyone, every dose disclosed, $69/month. Thesis takes a personalisation approach — 4-week trial pack of 4 different formulas (Energy, Clarity, Logic, Motivation), then you pick which works for you, $59/month per formula. Universal formulas have more replication evidence; personalisation has stronger user-experience data.',
  },
  {
    q: 'Is Thesis personalisation evidence-based?',
    a:
      'The personalisation is questionnaire-based, not biomarker-based. There\'s no genetic test, no neurochemistry profile — just self-reported preferences and goals. The questionnaire matches you to one of 4 pre-formulated stacks. This is closer to a recommendation engine than to true personalised medicine. For some users this lowers decision friction; for evidence-graded buyers, the lack of objective personalisation signal is a limitation.',
  },
  {
    q: 'How does Thesis pricing compare?',
    a:
      'Thesis: 4-week starter kit $119, then $59/month per formula. If you take multiple formulas across the week (their suggested approach), monthly cost can exceed $100. Mind Lab Pro: $69/month flat. Thesis is more expensive long-term unless you stick with a single formula.',
  },
  {
    q: 'Are both caffeine-free?',
    a:
      'Mind Lab Pro is fully caffeine-free. Thesis varies by formula — Energy includes caffeine, Clarity / Logic / Motivation are caffeine-free. Check each formula\'s label.',
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
  'Are willing to pay $59-$119+/month for the personalisation flow',
  'Prefer caffeinated and caffeine-free formula options to mix and match',
];

const verdictParagraph =
  'Mind Lab Pro\'s single-universal-formula approach has stronger replication evidence (multiple RCTs published). Thesis\'s personalised-quiz approach has stronger user-experience data and lower friction for newcomers. For evidence-graded buyers prioritizing peer-reviewed data, Mind Lab Pro wins. For buyers who value try-multiple-formulas convenience, Thesis is fair.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHeadPage
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
    />
  );
}
