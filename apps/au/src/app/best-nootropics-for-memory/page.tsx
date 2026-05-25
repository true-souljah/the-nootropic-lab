import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsAU, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://au.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory Australia ${CURRENT_YEAR}: TGA-Aware Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for memory and recall available to Australian buyers. Each pick contains at least one ingredient with peer-reviewed memory evidence at clinical dose. Personal Importation Scheme guidance included.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-memory/` },
  openGraph: {
    title: 'Best Nootropics for Memory Australia — Evidence-Graded',
    description:
      'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says, which products available in Australia actually deliver them at clinical dose, and how the TGA rules apply.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardised to 50% bacosides. Onset is slow — daily for 8+ weeks. Not an acute-effect ingredient. Bacopa is permitted in TGA Listed Medicines, so several Australian brands (Blackmores, Caruso\'s, Nature\'s Own) sell standalone Bacopa products under AUST L numbers.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Evidence is promising but smaller than for Bacopa. Look for fruiting-body extract, not mycelium-on-grain. Available in Australia via international stacks (Mind Lab Pro, Hunter Focus) imported under the Personal Importation Scheme.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. Less-strong evidence for memory in healthy younger adults. PS is not a permitted ingredient for therapeutic claims in TGA Listed Medicines, so PS-containing products available in Australia (Mind Lab Pro, Performance Lab Mind, Qualia Mind) are imported as food supplements.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardised form. Imported under the Personal Importation Scheme.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsAU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), phosphatidylserine (100mg Sharp-PS at clinical dose), AND Lion\'s Mane fruiting-body extract (500mg) — four of the four memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate TGA-listed Bacopa product (Blackmores, Caruso\'s) for full bacopa effect. Ships from the UK to Australia in 7–14 business days.',
  },
  {
    product: productsAU.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes Bacopa (300mg at clinical dose), citicoline, phosphatidylserine (200mg), AND a comprehensive cholinergic stack — the most complete memory-ingredient stack in one product available to Australian buyers. Loses ground on capsule count (7+/day) and price (AUD $215/mo). For memory specifically, the breadth justifies the trade-off if you can tolerate the daily friction. Ships from the US to Australia in 10–18 business days. Note: contains Huperzine A and caffeine.',
  },
  {
    product: productsAU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 3,
    whyItsHere:
      'Phosphatidylserine (100mg Sharp-PS Green at clinical dose) plus citicoline (250mg Cognizin at clinical dose) — both memory-evidence ingredients fully dosed. No Bacopa or Lion\'s Mane, so pair with a TGA-listed Bacopa product (Blackmores Brahmi, Caruso\'s Memory Forte) for fuller memory coverage. 2 capsules/day is the lowest pill burden of any memory pick.',
  },
  {
    product: productsAU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 4,
    whyItsHere:
      'Lion\'s Mane fruiting-body extract at the full 500mg clinical dose, plus citicoline (250mg) — the only AU-shippable stack with Lion\'s Mane fully dosed alongside cholinergic support. No Bacopa or PS. Premium pricing (AUD $140/mo). Contains caffeine. The right choice if you want a Lion\'s Mane focus on memory rather than the broader Mind Lab Pro stack.',
  },
  {
    product: productsAU.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 5,
    whyItsHere:
      'Contains Bacopa and Huperzine A (an acetylcholinesterase inhibitor with weak memory evidence). Proprietary blends mean you cannot verify Bacopa is at the 300mg clinical dose. Mainstream international availability is its strongest feature for Australian memory buyers. Ships from the US to Australia in 10–18 business days.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for memory?',
    a: 'Bacopa Monnieri at 300mg standardised to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. Phosphatidylserine has good evidence for memory in older adults. Citicoline has good evidence for older adults with age-related memory complaints.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
  },
  {
    q: 'Are these memory nootropics TGA-listed in Australia?',
    a: 'No — the international stacks ranked here (Mind Lab Pro, Performance Lab Mind, Qualia Mind, Hunter Focus, Alpha Brain) are not TGA-listed. They ship to Australia under the TGA Personal Importation Scheme as food supplements. Australian TGA-listed memory products are typically standalone Bacopa, ginkgo, or fish-oil formulas: Blackmores Bio Ginkgoforte, Caruso\'s Memory Forte, Swisse Memory & Focus, Nature\'s Own Brahmi, Cenovis Ginkgo Biloba. These carry AUST L numbers and are sold at Chemist Warehouse, Priceline, Amcal, and Blooms. The trade-off: TGA-listed Australian products typically focus on a single ingredient (Bacopa OR ginkgo OR fish oil) rather than the multi-ingredient stacks ranked above.',
  },
  {
    q: 'Should I combine a TGA-listed Bacopa with an imported stack?',
    a: 'It is a common Australian strategy — particularly for Mind Lab Pro buyers wanting full Bacopa dose. Mind Lab Pro\'s 150mg Bacopa is half the clinical dose, so adding a TGA-listed standalone Bacopa product (Blackmores Brahmi 5500mg, Caruso\'s Memory Forte) brings total Bacopa to clinical level. Always check the bacoside concentration on the label — 50% bacosides at 300mg total is the clinical anchor. Talk to a pharmacist if you are taking other medications.',
  },
  {
    q: 'Are memory nootropics safe long-term?',
    a: 'The ingredients on this page have favourable safety profiles in human RCTs at the doses listed. Phosphatidylserine derived from soy may be a concern for soy allergies (sunflower-derived PS is available). Bacopa can cause GI upset in some people; take with food.',
  },
  {
    q: 'Will these help with age-related memory loss?',
    a: 'The evidence is strongest specifically in older adults with subjective cognitive complaints — not in clinically diagnosed dementia or Alzheimer\'s. If you or a family member is experiencing significant memory changes, see your GP for referral. Supplements are not a treatment for dementia.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Mind Lab Pro and Hunter Focus both use fruiting-body extract — verify on the label of any Lion\'s Mane product before ordering.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory in Australia"
      pageDescription="Independent ranking of nootropics for memory and recall available to Australian buyers, based on clinical evidence and TGA Personal Importation rules."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs over 30+ years. This page ranks the products available to Australian buyers that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose. None of the multi-ingredient stacks below are TGA-listed therapeutic goods; they import under the Personal Importation Scheme. TGA-listed Australian options for single-ingredient Bacopa or ginkgo are noted in the FAQ."
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
