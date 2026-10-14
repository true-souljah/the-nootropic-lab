import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain & Memory ${CURRENT_YEAR}: Evidence-Graded Picks`,
  description:
    'Independent ranking of nootropics for adults concerned about age-related cognitive changes. Phosphatidylserine, Bacopa, citicoline. NOT a treatment for dementia or Alzheimer\'s.',
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain — Evidence-Graded',
    description: 'Phosphatidylserine has the FDA qualified claim. Plus Bacopa, citicoline, Lion\'s Mane. What the evidence says about age-related cognitive support.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS) — FDA qualified health claim',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'The FDA allows phosphatidylserine only qualified claims that it \'may reduce the risk of dementia\' or \'cognitive dysfunction in the elderly\', each followed by \'FDA concludes that there is little scientific evidence supporting this claim\' (FDA letter, 13 May 2003). RCTs in older adults at 100–300mg a day report memory benefits, though often only in subgroups (see our phosphatidylserine page). The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    ingredientSlugs: ['citicoline'],
    evidence:
      'In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and in a follow-up crossover of 32 of those participants, 2,000mg a day for 2 months improved immediate and delayed recall. Cognizin is a standardized form.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Mori et al. 2009 — small RCT in Japanese adults aged 50–80 with mild cognitive impairment. 3g/day over 16 weeks improved cognitive function scores compared with placebo. Evidence is promising for early age-related changes; not evaluated for dementia treatment.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'In a systematic review of six 12-week trials (Pase 2012, PubMed 22747190), Bacopa improved 9 of 17 memory free-recall tests; in adults aged 65 and over (Calabrese 2008, PubMed 18611150), 300mg a day for 12 weeks improved delayed word recall after controlling for baseline cognitive deficit.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane. Four of the most age-relevant ingredients in one open-formula product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine, citicoline, and Lion\'s Mane plus additional ingredients: 31 in all, the most of any single formula in this review, but the 6-capsule daily protocol can be hard to maintain for older adults — consider whether the breadth justifies that friction.',
  },
  {
    product: productsUS.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract from a brand with strong third-party CoA testing. One 500mg capsule is half the 1,000mg low end of our Lion\'s Mane reference dose.',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Contains Bacopa and Huperzine A (acetylcholinesterase inhibitor — caution for older adults on cholinergic medications like donepezil). Proprietary blends prevent dose verification. Mainstream retail availability is its strongest feature.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a neurologist for evaluation.',
  },
  {
    q: 'What does the FDA qualified health claim for PS mean?',
    a: 'The FDA allows phosphatidylserine to carry a qualified claim that "Very limited and preliminary scientific research suggests that phosphatidylserine may reduce the risk of dementia in the elderly", which must be followed by "FDA concludes that there is little scientific evidence supporting this claim." The same wording applies to cognitive dysfunction in the elderly (FDA letter, 13 May 2003). This is a softer claim than full FDA-approved health claims and reflects evidence quality, not a disease-prevention promise.',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints. There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your primary care clinician about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing clinician. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin/anticoagulant regimens; sunflower-derived PS is the alternative.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil, etc.). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your neurologist. Huperzine A (in Onnit Alpha Brain) is itself an acetylcholinesterase inhibitor and stacking is not advised. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: its memory trials ran 15 weeks to 12 months. Citicoline: memory effects were measured after 2–3 months. Bacopa: 8–12 weeks; most positive trials ran 12 weeks. Lion\'s Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure (online tests are crude but better than subjective recall).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain"
      pageDescription="Independent ranking of nootropics for adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease. For those, see a neurologist."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'FDA framework for nootropic supplements', href: '/are-nootropics-fda-approved/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
