import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ, Source } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer, sitemapDate } from '@nootropic/data';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'qualia-mind-review');


export const metadata: Metadata = {
  title: `Mind Lab Pro vs Qualia Mind ${CURRENT_YEAR}: 11 Ingredients vs 31 — Which Wins?`,
  description:
    'Qualia Mind vs Mind Lab Pro: 6 capsules a day with 100 mg caffeine vs 2 caffeine-free, a 31- vs 11-ingredient formula, $159 vs $69. Doses side by side and our verdict.',
  alternates: buildAlternates({ regionCode: 'us', path: '/mind-lab-pro-vs-qualia-mind/', availableInRegions: ['us'] }),
  openGraph: {
    title: 'Mind Lab Pro vs Qualia Mind — Independent Head-to-Head',
    description: 'Lean open formula vs 31-ingredient stack. Which approach actually delivers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Qualia Mind vs Mind Lab Pro: which is better?',
    a:
      'Mind Lab Pro takes a lean, 11-ingredient open-formula approach with every dose disclosed. Qualia Mind takes a 31-ingredient broad-spectrum approach. Both are caffeine-free if you choose the right Qualia variant. Mind Lab Pro is easier to evaluate ingredient-by-ingredient. Qualia Mind throws more compounds at the brain but at a higher per-month cost.',
  },
  {
    q: 'Why does Qualia Mind have so many ingredients?',
    a:
      'Qualia Mind 2.0\'s Supplement Facts panel has 31 entries per 6-capsule serving; Qualia\'s own product page describes it as a blend of 32 ingredients (both checked October 2026). Qualia Mind\'s formulation philosophy is layered — they include cholinergics, adaptogens, amino acids, and choline donors all in one stack. The argument for: synergistic effects across multiple cognitive pathways. The argument against: polypharmacy makes it hard to attribute any benefit (or side effect) to a specific ingredient, and several inclusions are at trace doses.',
  },
  {
    q: 'Is Qualia Mind worth the price?',
    a:
      'Qualia Mind is $159 as a one-time purchase, or $39 for the first subscription shipment and then $139 per shipment every 4 weeks (qualialife.com, checked 9 October 2026). Mind Lab Pro is $69/month flat. If you respond well to choline donors and adaptogens specifically, Qualia\'s breadth might justify the cost. If you prefer a tighter, evidence-graded formula, Mind Lab Pro\'s value is stronger.',
  },
  {
    q: 'Are both caffeine-free?',
    a:
      'Mind Lab Pro is fully caffeine-free. Qualia Mind has both a caffeine-free and a caffeinated variant — check the label of the SKU you\'re buying.',
  },
  {
    q: 'How many capsules per day?',
    a:
      'Mind Lab Pro: 2 capsules/day standard. Qualia Mind: 6 capsules/day for the standard regimen, which is high friction for daily use. Qualia\'s own directions are to take it 5 days on, then 2 days off, each week.',
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
  'Want a formula tested in two placebo-controlled University of Leeds studies (the 60-day one found no improvement in choice accuracy or reaction time)',
];

const whoIsForB = [
  'Believe broad-spectrum coverage beats lean formulation',
  'Don\'t mind 6 capsules/day or the higher price',
  'Specifically want adaptogens + cholinergics together in one stack',
  'Are willing to commit to subscription pricing for the introductory rate',
];

const verdictParagraph =
  `Mind Lab Pro scores ${productA?.score ?? 'higher'}/10; Qualia Mind scores ${productB?.score ?? 'lower'}/10. ` +
  'Mind Lab Pro\'s lean 11-ingredient open formula scores stronger on transparency and value. ' +
  'Qualia Mind\'s 31-ingredient formula scores stronger on ingredient breadth but loses points on value, ' +
  'capsule count, and the difficulty of evaluating individual contributions. ' +
  `Mind Lab Pro is ${productA?.capsulesPerServing} caffeine-free capsules a day at $69 a month. ` +
  `Qualia Mind 2.0 is ${productB?.capsulesPerServing} capsules a day with 100 mg caffeine per serving ` +
  '(Qualia also sells a separate caffeine-free version), at $159 one-time or $39 for the first subscription ' +
  'shipment, then $139 every 4 weeks (qualialife.com, checked 9 October 2026).';

const sources: Source[] = [
  {
    type: 'Clinical trial',
    label:
      'Abbott-Imboden C, Gonzalez Y, Utley A (2023). Efficacy of the nootropic supplement Mind Lab Pro on memory in adults: Double blind, placebo-controlled study. Hum Psychopharmacol 38(4):e2872. PubMed 37194920',
    url: 'https://pubmed.ncbi.nlm.nih.gov/37194920/',
  },
  {
    type: 'Clinical trial',
    label:
      'O\'Reilly D, Bolam J, Delis I, Utley A (2025). Effect of a Plant-Based Nootropic Supplement on Perceptual Decision-Making and Brain Network Interdependencies: A Randomised, Double-Blinded, and Placebo-Controlled Study. Brain Sci 15(3):226. PubMed 40149748 (60 days of Mind Lab Pro, per its methods)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/40149748/',
  },
  { type: 'Brand', label: 'Mind Lab Pro product page', url: 'https://www.mindlabpro.com/products/mind-lab-pro' },
  { type: 'Brand', label: 'Qualia Mind 2.0 product page and Supplement Facts', url: 'https://www.qualialife.com/shop/qualia-mind' },
  { type: 'Brand', label: 'Qualia Mind Caffeine Free product page', url: 'https://www.qualialife.com/shop/qualia-mind-caffeine-free' },
];

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
      updated={sitemapDate(sitemap(), '/mind-lab-pro-vs-qualia-mind/')}
      sources={sources}
      relatedLinks={[
        { href: '/mind-lab-pro-vs-noocube/', title: 'Mind Lab Pro vs NooCube', meta: 'Two caffeine-free, 2-capsule formulas compared' },
        { href: '/alpha-brain-vs-qualia-mind/', title: 'Alpha Brain vs Qualia Mind', meta: 'Qualia Mind against Onnit\'s Alpha Brain' },
      ]}
    />
  );
}
