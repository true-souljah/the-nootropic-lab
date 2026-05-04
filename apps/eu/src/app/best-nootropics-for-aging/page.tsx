import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsEU } from '@nootropic/data';

const SITE_URL = 'https://eu.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain ${CURRENT_YEAR} (EU): Evidence-Graded Picks for Older Adults`,
  description:
    'Independent EU ranking of nootropics for adults concerned about age-related cognitive changes. EUR pricing, EU storefronts. Phosphatidylserine, Bacopa, citicoline, Lion\'s Mane. NOT a treatment for dementia.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-aging/` },
  openGraph: {
    title: 'Best Nootropics for Aging Brain (EU) — Evidence-Graded',
    description: 'Phosphatidylserine, citicoline, Lion\'s Mane, Bacopa. EU-storefront picks for older European adults.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. Important: unlike the US (where the FDA permits a qualified "may reduce risk of dementia" claim), EFSA has rejected several PS health claims, so EU labels describe PS only in mechanism terms. The underlying clinical evidence is the same — only the on-label language differs.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardised form. Authorised in the EU under Novel Food Regulation (EU) 2015/2283.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Evidence is promising for early age-related changes; not evaluated for dementia treatment. Lion\'s Mane fruiting body has traditional EU food use; mycelium-grain blends face Novel Food scrutiny.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    evidence:
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks at 300mg standardised to 50% bacosides.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Lion\'s Mane (500mg fruiting body at clinical dose), and Bacopa. Four of the most age-relevant ingredients in one open-formula EU product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. €65/mo from an EU distribution centre with no import duties.',
  },
  {
    product: productsEU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Phosphatidylserine (100mg Sharp-PS), Lion\'s Mane (500mg fruiting body), Citicoline (250mg Cognizin) all at clinical doses. Only 2 capsules/day — the easiest pill burden to maintain long-term, which matters more for older adults than ingredient breadth. Caffeine-free. €55/mo from the same EU manufacturer as Mind Lab Pro.',
  },
  {
    product: productsEU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 3,
    whyItsHere:
      'Includes phosphatidylserine, Lion\'s Mane (500mg fruiting body), and Bacopa, plus Ashwagandha (cortisol/stress) and ALCAR (mitochondrial energy). Contains 100mg caffeine — not ideal for stimulant-sensitive older adults. €85/mo and 6 capsules/day are friction; pick this only if you specifically want the broader stack.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Bacopa (250mg, just under the 300mg clinical anchor) plus Lutemax 2020 for screen-related eye strain. Caffeine-free. EU storefront with EUR pricing at €55/mo. Trustpilot 1.9/5 reflects subscription cancellation complaints — review terms carefully before subscribing, especially for older relatives less familiar with online subscription cancellation.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved to prevent or treat dementia or Alzheimer\'s anywhere in the EU. EFSA has not authorised disease-prevention claims for any of these ingredients. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a GP for referral to a neurologist.',
  },
  {
    q: 'Why don\'t EU labels mention the FDA "qualified health claim" for phosphatidylserine?',
    a: 'The US FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly." EFSA reviewed the same evidence and rejected the claim in the EU. The clinical evidence is the same in both jurisdictions; the regulatory threshold for what may be printed on a label differs. EU brands describe PS in mechanism terms (e.g., "supports cell membrane phospholipid composition") rather than outcomes.',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints. There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your GP about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications common in EU prescribing?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing clinician. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with warfarin/anticoagulant regimens; sunflower-derived Sharp-PS GREEN is the alternative. Ginkgo (in BRAINEFFECT) has documented anticoagulant interactions and should be discussed with a clinician.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil, rivastigmine, etc.). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your neurologist. Huperzine A (in some imported nootropic products, though not in our EU-storefront picks above) is itself an acetylcholinesterase inhibitor and stacking is not advised. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks. Lion\'s Mane: 8–16 weeks. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure (online tests are crude but better than subjective recall).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain (EU)"
      pageDescription="Independent EU ranking of nootropics for adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease — and EU brands cannot legally claim otherwise under EFSA Regulation (EC) 1924/2006. For clinical concerns, see your GP for referral to a neurologist."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
    />
  );
}
