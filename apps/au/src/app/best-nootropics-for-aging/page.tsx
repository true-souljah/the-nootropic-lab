import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsAU, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://au.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain Australia ${CURRENT_YEAR}: Evidence-Graded Picks`,
  description:
    'Independent ranking of nootropics for Australian adults concerned about age-related cognitive changes. Phosphatidylserine, Bacopa, citicoline, ginkgo. NOT a treatment for dementia or Alzheimer\'s. TGA Personal Importation Scheme guidance included.',
  alternates: buildAlternates({ regionCode: 'au', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain Australia — Evidence-Graded',
    description:
      'Phosphatidylserine, Bacopa, citicoline, Lion\'s Mane. What the evidence says about age-related cognitive support and what is available to Australian buyers via TGA-listed products vs Personal Importation.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category. PS is not a permitted ingredient in TGA Listed Medicines, so PS-containing products available in Australia (Mind Lab Pro, Performance Lab Mind, Qualia Mind) are imported as food supplements under the Personal Importation Scheme.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardised form most products use. Imported under the Personal Importation Scheme.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Evidence is promising for early age-related changes; not evaluated for dementia treatment. Available in Australia via Mind Lab Pro and Hunter Focus (both fruiting-body extract) under the Personal Importation Scheme.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri & Ginkgo Biloba',
    evidence:
      'Bacopa: multiple RCTs across age groups show memory consolidation benefits, with studies specifically in older adults showing retention and recall improvements after 8–12 weeks at 300mg standardised to 50% bacosides. Ginkgo: cerebral blood flow modulation; modest cognitive benefits in older adults at 120–240mg/day. Both Bacopa and Ginkgo are permitted in TGA Listed Medicines, so Australian seniors have AUST L-listed options at any pharmacy (Blackmores Bio Ginkgoforte 6000, Caruso\'s Ginkgo, Swisse Memory & Focus, Nature\'s Own Brahmi).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsAU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa (150mg), and Lion\'s Mane (500mg fruiting body). Four of the most age-relevant ingredients in one open-formula product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. Ships from the UK to Australia in 7–14 business days as a food supplement.',
  },
  {
    product: productsAU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Phosphatidylserine (100mg Sharp-PS Green at clinical dose) plus citicoline (250mg Cognizin at clinical dose). The two strongest age-relevant ingredients fully dosed in only 2 capsules per day — a major advantage for older Australian adults who already manage multiple daily medications. No caffeine. Ships from the UK to Australia in 14–21 business days.',
  },
  {
    product: productsAU.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes phosphatidylserine (200mg), citicoline, Bacopa (300mg fully dosed), and supporting cofactors. Most complete coverage but the 7-capsule daily protocol can be hard to maintain for older adults — consider whether the breadth justifies the friction. Contains caffeine and Huperzine A: caution for older adults on cholinergic medications like donepezil.',
  },
  {
    product: productsAU.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 4,
    whyItsHere:
      'Cheapest pick at approximately AUD $8/month for a 5-month supply via Amazon.com.au with Prime shipping. Ginkgo Biloba at full clinical dose (120mg). Sensible budget addition for older Australian adults. Ginseng is severely underdosed (10mg vs 200mg clinical). Not a substitute for the multi-ingredient stacks above; more useful as a stack addition or low-cost trial of Ginkgo before committing to a TGA-listed Australian Ginkgo product like Blackmores Bio Ginkgoforte 6000.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved by the TGA to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see your GP for referral to a geriatrician or neurologist.',
  },
  {
    q: 'Are these TGA-listed in Australia?',
    a: 'No. The international multi-ingredient stacks ranked here (Mind Lab Pro, Performance Lab Mind, Qualia Mind) are not TGA-listed therapeutic goods — they import under the TGA Personal Importation Scheme as food supplements. Australian TGA-listed alternatives carrying AUST L numbers are stocked at Chemist Warehouse, Priceline, Amcal, and Blooms: Blackmores Bio Ginkgoforte 6000, Caruso\'s Memory Forte, Swisse Memory & Focus, Nature\'s Own Brahmi 5000mg, and Cenovis Ginkgo Biloba. These typically focus on a single ingredient (Bacopa OR Ginkgo OR fish oil); the stacks above combine multiple ingredients in one formula, which is why they are imported.',
  },
  {
    q: 'When should I start taking these?',
    a: 'The evidence is strongest in 50+ adults with subjective cognitive complaints. There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your GP about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing GP or pharmacist. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin regimens; sunflower-derived PS is the alternative. Ginkgo has documented antiplatelet activity and should be discussed with your prescriber if you take warfarin, aspirin, or other anticoagulants.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil, etc.). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your neurologist or geriatrician. Huperzine A (in Onnit Alpha Brain and Qualia Mind) is itself an acetylcholinesterase inhibitor and stacking is not advised. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks. Lion\'s Mane: 8–16 weeks. Ginkgo: 4–8 weeks. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure (online tests are crude but better than subjective recall).',
  },
  {
    q: 'Should I just buy a TGA-listed Australian product instead of importing?',
    a: 'For a single-ingredient approach (e.g. Ginkgo or Bacopa alone), yes — TGA-listed Australian options are convenient, clearly labelled with AUST L numbers, available at Chemist Warehouse, and integrate cleanly into a Webster pack. For a multi-ingredient stack covering PS + citicoline + Bacopa + Lion\'s Mane in one capsule, the imported options above are the practical route because no equivalent multi-ingredient formula is currently TGA-listed. Many Australian seniors run a hybrid: one TGA-listed Ginkgo or Bacopa from the pharmacy + one imported PS-citicoline stack like Performance Lab Mind.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in Australia"
      pageDescription="Independent ranking of nootropics for Australian adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease. For those, see your GP for referral. Most picks below import under the TGA Personal Importation Scheme; TGA-listed Australian alternatives (Blackmores Bio Ginkgoforte, Caruso's Memory Forte, Swisse Memory & Focus, Nature's Own Brahmi) are noted in the FAQ for buyers who prefer pharmacy-stocked Listed Medicines."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('au')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
