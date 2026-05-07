import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsJP, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://jp.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain in Japan ${CURRENT_YEAR}: Evidence-Graded Picks`,
  description:
    'Independent ranking of nootropics for adults in Japan concerned about age-related cognitive changes. FFC-notified domestic options (FANCL BRAINs, Suntory) plus phosphatidylserine and citicoline international stacks. NOT a treatment for dementia or Alzheimer\'s.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-aging/` },
  openGraph: {
    title: 'Best Nootropics for Aging Brain in Japan — Evidence-Graded',
    description: 'Domestic FFC-notified DHA + Ginkgo plus international Phosphatidylserine and citicoline picks. Japan\'s aging-population context.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'DHA — Japan\'s most-notified FFC ingredient for older adults',
    evidence:
      'DHA dominates the Japanese FFC supplement market for adults 50+, with claims around memory support and cognitive function maintenance. Multiple Japanese clinical trials in middle-aged and older adults at 500mg+/day across 12+ weeks. The cultural and regulatory anchor for aging-brain supplementation in Japan.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22932089/',
  },
  {
    name: 'Phosphatidylserine (PS) — FDA qualified health claim',
    evidence:
      'The FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. Used in both domestic FANCL BRAINs (50mg) and international Performance Lab Mind (100mg Sharp-PS).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Lion\'s Mane (ヤマブシタケ)',
    evidence:
      'Mori et al. 2009 — a foundational small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. The Lion\'s Mane evidence base for aging brains was established in Japan; evidence is promising for early age-related changes but is not a dementia treatment.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardized form used in Mind Lab Pro and Performance Lab Mind. Not currently a notified FFC ingredient in Japan.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsJP.find(p => p.slug === 'fancl-brains-review')!,
    rank: 1,
    whyItsHere:
      'The leading domestic Japanese option for aging adults. FFC-notified (機能性表示食品) with cognitive claims filed with the Consumer Affairs Agency. Combines DHA (300mg), Ginkgo Biloba (60mg), and Phosphatidylserine (50mg) — three age-relevant mechanisms in one Japanese-language-labelled product. Available at every Matsumoto Kiyoshi, Welcia, and Sundrug nationwide plus Amazon Japan with Prime delivery. Trusted FANCL brand familiar to the target demographic. ¥7,500/month.',
  },
  {
    product: productsJP.find(p => p.slug === 'suntory-dha-epa-sesamin-review')!,
    rank: 2,
    whyItsHere:
      'Japan\'s best-selling FFC-notified omega-3 brain supplement (over 30 million bottles sold) — Suntory Wellness, a household name backed by the ¥2.7 trillion Suntory Group. 400mg DHA + 100mg EPA + 20mg sesamin. Foundational structural support for aging brains; widely advertised on Japanese television and trusted across the 60+ demographic. ¥4,800/month — the most affordable pick in this Japan review.',
  },
  {
    product: productsJP.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 3,
    whyItsHere:
      'Includes phosphatidylserine, citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane (the ingredient with Japanese RCT evidence) in one open-formula product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. Best for Japanese adults already comfortable with international online ordering and willing to pay ¥10,350/month equivalent for broader ingredient coverage.',
  },
  {
    product: productsJP.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 4,
    whyItsHere:
      'Minimalist 4-ingredient stack with 100mg Sharp-PS phosphatidylserine and 250mg Cognizin citicoline at clinical dose. Only 2 capsules per day — the lowest pill burden in this Japan review, important for older adults who already manage multiple prescriptions. Caffeine-free. Ships from the UK in 10–14 days.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Will these prevent dementia (認知症) or Alzheimer\'s?',
    a: 'No. No supplement — Japanese FFC-notified or otherwise — is approved to prevent or treat dementia (認知症) or Alzheimer\'s disease. The ingredients on this page have evidence for age-related cognitive support in healthy older adults, distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a Japanese neurologist (神経内科) for evaluation. The MHLW Long-Term Care Insurance system (介護保険) provides screening and support resources.',
  },
  {
    q: 'What does FFC notification (機能性表示食品) actually mean?',
    a: 'Japan\'s Food with Function Claims system requires manufacturers to notify the Consumer Affairs Agency (消費者庁) of the cognitive claim and the supporting evidence. It is more rigorous than US "structure-function claims" but less than the EU\'s health-claim authorization system. FANCL BRAINs and Suntory DHA & EPA + Sesamin EX are both notified. The notification reflects evidence quality but is not a disease-prevention promise.',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints (もの忘れの自覚). There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your kakaritsuke-i (かかりつけ医) about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside Japanese prescription medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing doctor. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with warfarin/anticoagulant regimens; sunflower-derived PS is the alternative. For older adults on multiple medications, bring the supplement label to your next pharmacist (薬剤師) consultation — Japanese pharmacy chains offer this service free.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil / アリセプト). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your neurologist. Huperzine A is itself an acetylcholinesterase inhibitor and stacking with donepezil (アリセプト) is not advised. None of the four picks above contain Huperzine A. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'Where can my elderly parents buy these in Japan?',
    a: 'FANCL BRAINs and Suntory DHA & EPA + Sesamin EX are available at every major drugstore chain (Matsumoto Kiyoshi, Welcia, Sundrug, Sugi Pharmacy) — no online ordering required. Both are also on Amazon Japan with Prime same-day delivery. Mind Lab Pro and Performance Lab Mind require ordering from international websites with English checkout — typically a barrier for older buyers without English proficiency. Stick with FFC-notified domestic options for this demographic unless a younger family member can manage the international order.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in Japan"
      pageDescription="Independent ranking of nootropics for adults in Japan concerned about age-related cognitive changes."
      heroParagraph="Japan has the world's oldest population by median age, and age-related cognitive support is one of the largest functional supplement categories under the FFC (機能性表示食品) framework. Domestic FFC-notified brands (FANCL BRAINs, Suntory DHA & EPA + Sesamin EX) target this demographic via DHA, Ginkgo, and Phosphatidylserine and are available in every Matsumoto Kiyoshi, Welcia, and Sundrug nationwide. International stacks add Lion's Mane (the evidence base established in Japan via Mori et al. 2009) and clinical-dose citicoline. These supplements have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia (認知症), Alzheimer's, or any clinical cognitive disease. For those, see a Japanese neurologist."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('jp')}
    />
  );
}
