import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain & Memory in Canada ${CURRENT_YEAR}: Evidence-Graded Picks`,
  description:
    'Independent ranking of nootropics for Canadian adults concerned about age-related cognitive changes. Phosphatidylserine, Bacopa, citicoline, Ginkgo. NOT a treatment for dementia or Alzheimer\'s.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain in Canada — Evidence-Graded',
    description: 'Phosphatidylserine, Bacopa, citicoline, Lion\'s Mane, Ginkgo — what the evidence says about age-related cognitive support for Canadian buyers.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'The US FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Health Canada NPN monograph also recognises PS for memory support in older adults. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA or Health Canada claims: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardized form most products use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
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
      'Proposed to work via cerebral blood flow (vasodilation). Health Canada has an NPN monograph for Ginkgo Biloba 120mg standardized extracts for memory support, but a 2026 network meta-analysis of 29 RCTs in healthy adults (Tiemtad et al.) found that high-dose Bacopa (600mg/day or more) improved working memory more than both Ginkgo doses and placebo and gave greater short-term memory benefits, with no significant differences in attention or processing speed, so the trial evidence does not single out Ginkgo as a memory enhancer. Often combined with Panax Ginseng in TCM-inspired formulas.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/41678913/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsCA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane (500mg fruiting body). Four of the most age-relevant ingredients in one open-formula product. Caffeine-free — no cardiovascular load for older Canadian adults sensitive to stimulants. Ships UK→Canada reliably.',
  },
  {
    product: productsCA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine 100mg, citicoline, and Lion\'s Mane plus 28 additional ingredients. Most complete coverage but the 6-capsule daily protocol can be hard to maintain for older adults — and the 100mg caffeine per serving rules it out for caffeine-sensitive seniors. Consider whether the breadth justifies that friction.',
  },
  {
    product: productsCA.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 3,
    whyItsHere:
      'Budget pick at CAD ~$7/month. Delivers Ginkgo Biloba at the full clinical dose (120mg, 50:1 extract), though a 2026 network meta-analysis in healthy adults found high-dose Bacopa improved working memory more than either Ginkgo dose (see the Ginkgo entry above). Listed on amazon.ca. Single-mechanism (cerebral blood flow); pair with a PS supplement for fuller coverage. No NPN (Natural Product Number) found for NatureBell Ginkgo + Ginseng in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07).',
  },
  {
    product: productsCA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Contains Bacopa, Lion\'s Mane, and Huperzine A. CAUTION for older Canadian adults: Huperzine A is itself an acetylcholinesterase inhibitor — do NOT stack with prescription cholinesterase inhibitors (donepezil/Aricept, rivastigmine/Exelon, galantamine/Reminyl) commonly prescribed by Canadian neurologists for early Alzheimer\'s. Discuss with your prescribing doctor first.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved by Health Canada or the US FDA to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see your family doctor for a referral to a Canadian neurologist or memory clinic for evaluation.',
  },
  {
    q: 'What does the FDA qualified health claim for PS mean for Canadian buyers?',
    a: 'The US FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly." This is a softer claim than full FDA-approved health claims. In Canada, what a PS product may claim is set by its Health Canada product licence. We have not reviewed Health Canada\'s phosphatidylserine monograph for this page, so read the recommended use printed on the label of a product that carries an eight-digit NPN (Natural Product Number).',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints. There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your family doctor about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing physician. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin/anticoagulant regimens; sunflower-derived PS is the alternative. Ginkgo can mildly increase bleeding risk — discuss with your doctor if you are on anticoagulants.',
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
    q: 'Can I buy these in a Canadian store?',
    a: 'The premium multi-ingredient stacks (Mind Lab Pro, Qualia Mind, Hunter Focus) are sold direct by their brands and ship internationally to Canadian addresses; we found no NPN (Natural Product Number) for any of them in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07). For single-ingredient PS, Bacopa, Ginkgo or Lion\'s Mane bought in a store, look for an eight-digit NPN on the label; the LNHPD lets you check it. NatureBell Ginkgo + Ginseng is listed on amazon.ca.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in Canada"
      pageDescription="Independent ranking of nootropics for Canadian adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease. For those, see your family doctor or a Canadian neurologist via Health Canada-funded referral."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'NPN-licensed nootropics in Canada', href: '/npn-licensed-nootropics-canada/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
