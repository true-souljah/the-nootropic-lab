import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'qualia-mind-review');

export const metadata: Metadata = {
  title: `Mind Lab Pro vs Qualia Mind ${CURRENT_YEAR}: 11 Ingredients vs 28 — Which Wins?`,
  description:
    'Independent comparison of Mind Lab Pro vs Qualia Mind. Open 11-ingredient formula vs 28-ingredient megadose. Side-by-side dosing, price, and verdict.',
  alternates: { canonical: `${SITE_URL}/mind-lab-pro-vs-qualia-mind/` },
  openGraph: {
    title: 'Mind Lab Pro vs Qualia Mind — Independent Head-to-Head',
    description: 'Lean open formula vs 28-ingredient megadose. Which approach actually delivers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, Mind Lab Pro or Qualia Mind?',
    a:
      'Mind Lab Pro takes a lean, 11-ingredient open-formula approach with every dose disclosed. Qualia Mind takes a 28-ingredient megadose approach. Both are caffeine-free if you choose the right Qualia variant. Mind Lab Pro is easier to evaluate ingredient-by-ingredient. Qualia Mind throws more compounds at the brain but at a higher per-month cost.',
  },
  {
    q: 'Why does Qualia Mind have so many ingredients?',
    a:
      'Qualia Mind\'s formulation philosophy is layered — they include cholinergics, adaptogens, amino acids, and choline donors all in one stack. The argument for: synergistic effects across multiple cognitive pathways. The argument against: polypharmacy makes it hard to attribute any benefit (or side effect) to a specific ingredient, and several inclusions are at trace doses.',
  },
  {
    q: 'Is Qualia Mind worth the price?',
    a:
      'Qualia Mind one-time is $159/month, with subscription pricing of $39 first order then $139/month. Mind Lab Pro is $69/month flat. If you respond well to choline donors and adaptogens specifically, Qualia\'s breadth might justify the cost. If you prefer a tighter, evidence-graded formula, Mind Lab Pro\'s value is stronger.',
  },
  {
    q: 'Are both caffeine-free?',
    a:
      'Mind Lab Pro is fully caffeine-free. Qualia Mind has both a caffeine-free and a caffeinated variant — check the label of the SKU you\'re buying.',
  },
  {
    q: 'How many capsules per day?',
    a:
      'Mind Lab Pro: 2 capsules/day standard. Qualia Mind: up to 7 capsules/day for the standard regimen, which is high friction for daily use. Some users cycle 5 days on / 2 days off.',
  },
  {
    q: 'Are these alternatives to Adderall?',
    a:
      'No. Both are dietary supplements regulated under DSHEA. Adderall is a Schedule II prescription stimulant. Always consult a clinician for ADHD treatment.',
  },
];

const whoIsForA = [
  'Want a tight, evidence-graded formula with every dose disclosed',
  'Prefer 2-capsule daily simplicity',
  'Are budget-conscious at $69/month',
  'Care about peer-reviewed efficacy data over megadose breadth',
];

const whoIsForB = [
  'Believe broad-spectrum coverage beats lean formulation',
  'Don\'t mind 7+ capsules/day or the higher price',
  'Specifically want adaptogens + cholinergics together in one stack',
  'Are willing to commit to subscription pricing for the introductory rate',
];

const verdictParagraph =
  `Mind Lab Pro scores ${productA?.score ?? 'higher'}/10; Qualia Mind scores ${productB?.score ?? 'lower'}/10. ` +
  'Mind Lab Pro\'s lean 11-ingredient open formula scores stronger on transparency and value. ' +
  'Qualia Mind\'s 28-ingredient megadose scores stronger on ingredient breadth but loses points on value, ' +
  'capsule count, and the difficulty of evaluating individual contributions.';

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
