import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsCA } from '@nootropic/data';

const SITE_URL = 'https://ca.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain & Memory in Canada ${CURRENT_YEAR}: Evidence-Graded Picks`,
  description:
    'Independent ranking of nootropics for Canadian adults concerned about age-related cognitive changes. Phosphatidylserine, Bacopa, citicoline, Ginkgo. NOT a treatment for dementia or Alzheimer\'s.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-aging/` },
  openGraph: {
    title: 'Best Nootropics for Aging Brain in Canada — Evidence-Graded',
    description: 'Phosphatidylserine, Bacopa, citicoline, Lion\'s Mane, Ginkgo — what the evidence says about age-related cognitive support for Canadian buyers.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'The US FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Health Canada NPN monograph also recognises PS for memory support in older adults. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardized form most products use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Evidence is promising for early age-related changes; not evaluated for dementia treatment.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    evidence:
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks at 300mg standardized to 50% bacosides. Health Canada NPN monograph recognises Bacopa for memory support.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
  {
    name: 'Ginkgo Biloba',
    evidence:
      'Improves cerebral blood flow via vasodilation. Health Canada has an NPN monograph for Ginkgo Biloba 120mg standardized extracts for memory support. Evidence is mixed in healthy younger adults but more favourable in older adults with subjective complaints. Often combined with Panax Ginseng in TCM-inspired formulas.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/12815182/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsCA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane (500mg fruiting body). Four of the most age-relevant ingredients in one open-formula product. Caffeine-free — no cardiovascular load for older Canadian adults sensitive to stimulants. Ships UK→Canada reliably.',
  },
  {
    product: productsCA.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Phosphatidylserine 100mg (Sharp-PS Green, sunflower-derived — important for soy-allergic Canadians) + Citicoline 250mg (Cognizin) at clinical doses. The two best-evidenced age-cognitive ingredients in only 2 capsules per day — the lowest pill burden of any pick on this page, which matters for older adults managing multiple supplements or medications.',
  },
  {
    product: productsCA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes phosphatidylserine 200mg, citicoline, Bacopa at full clinical dose, and Lion\'s Mane plus 25 additional ingredients. Most complete coverage but the 7-capsule daily protocol can be hard to maintain for older adults — and the 90mg caffeine per serving rules it out for caffeine-sensitive seniors. Consider whether the breadth justifies that friction.',
  },
  {
    product: productsCA.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 4,
    whyItsHere:
      'Budget pick at CAD ~$7/month. Delivers Ginkgo Biloba at the full Health Canada-monograph clinical dose (120mg, 50:1 extract) — the single best-supported age-cognitive ingredient outside the premium stacks. Available at Shoppers Drug Mart-tier price points via Amazon.ca with Prime shipping. Single-mechanism (cerebral blood flow); pair with a PS supplement for fuller coverage. Not Health Canada NPN-registered.',
  },
  {
    product: productsCA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 5,
    whyItsHere:
      'Contains Bacopa, Lion\'s Mane, and Huperzine A. CAUTION for older Canadian adults: Huperzine A is itself an acetylcholinesterase inhibitor — do NOT stack with prescription cholinesterase inhibitors (donepezil/Aricept, rivastigmine/Exelon, galantamine/Reminyl) commonly prescribed by Canadian neurologists for early Alzheimer\'s. Discuss with your prescribing doctor first.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved by Health Canada or the US FDA to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see your family doctor for a referral to a Canadian neurologist or memory clinic for evaluation.',
  },
  {
    q: 'What does the FDA qualified health claim for PS mean for Canadian buyers?',
    a: 'The US FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly." This is a softer claim than full FDA-approved health claims. Health Canada\'s own NPN monograph for PS recognises memory support claims for older adults at 100–300mg/day; a CA-domiciled NPN-registered PS supplement carries this Health Canada-permitted claim.',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints. There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your family doctor about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing physician. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin/anticoagulant regimens; sunflower-derived PS (used in Performance Lab Mind\'s Sharp-PS Green) is the alternative. Ginkgo can mildly increase bleeding risk — discuss with your doctor if you are on anticoagulants.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil/Aricept, rivastigmine/Exelon). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your Canadian neurologist or family doctor. Huperzine A (in Onnit Alpha Brain) is itself an acetylcholinesterase inhibitor and stacking is not advised. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks. Lion\'s Mane: 8–16 weeks. Ginkgo: 4–8 weeks. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure.',
  },
  {
    q: 'Can I buy these at Shoppers Drug Mart, Rexall, or Costco in Canada?',
    a: 'For premium multi-ingredient stacks (Mind Lab Pro, Performance Lab Mind, Qualia Mind, Hunter Focus): no — these are direct-to-consumer only and ship internationally to Canadian addresses. For single ingredients (PS, Bacopa, Ginkgo, Lion\'s Mane): yes — Shoppers, Rexall, and Costco all carry NPN-registered Canadian brands of these single ingredients. NatureBell Ginkgo+Ginseng is available on Amazon.ca with Prime shipping.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in Canada"
      pageDescription="Independent ranking of nootropics for Canadian adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease. For those, see your family doctor or a Canadian neurologist via Health Canada-funded referral."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
    />
  );
}
