import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain in the GCC ${CURRENT_YEAR}: Halal-Friendly Picks for Saudi, UAE & Gulf Buyers`,
  description:
    'Independent ranking of nootropics for adults concerned about age-related cognitive changes, available in the GCC. Halal status and SFDA/MOHAP registration noted. NOT a treatment for dementia.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain — GCC Buyer\'s Guide',
    description: 'Phosphatidylserine, Bacopa, citicoline, Lion\'s Mane — age-related cognitive support for GCC buyers, with halal and registration notes.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS) — FDA qualified health claim',
    evidence:
      'The FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category. GCC note: most products use soy-derived PS (halal); some use bovine-derived PS (verify halal-slaughter sourcing); sunflower-derived PS is always halal-compliant.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardised form most products use. Synthesised, not animal-derived — halal-compliant.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Mushroom-derived — halal-compliant by default. Evidence is promising for early age-related changes; not evaluated for dementia treatment.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    evidence:
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks at 300mg standardised to 50% bacosides. Plant-derived; halal-compliant.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsGCC.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane. Four of the most age-relevant ingredients in one open-formula product. Plant-based HPMC capsules — no porcine gelatin, halal-friendly. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. Ships from UK to UAE/KSA via Dubai free-zone logistics. Not SFDA/MOHAP-registered: enters as personal-use dietary supplement.',
  },
  {
    product: productsGCC.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine (200mg, well above clinical anchor), Bacopa (300mg at clinical dose), Alpha-GPC, and additional age-relevant cofactors. Plant-based capsules. Most complete coverage but the 7-capsule daily protocol can be hard to maintain for older adults — consider whether the breadth justifies that friction. Caveat: default formula contains caffeine — older adults sensitive to stimulants should request the caffeine-free variant at checkout. Ships from US.',
  },
  {
    product: productsGCC.find(p => p.slug === 'nahdi-brain-boost-review')!,
    rank: 3,
    whyItsHere:
      'SFDA-registered and stocked across 1,100+ Nahdi pharmacy branches in Saudi Arabia. Includes Phosphatidylserine, Ginkgo Biloba, B12, and Zinc — conservative but registered formulation. SAR pricing, halal-compliant, no customs risk, same-day delivery in major Saudi cities. Doses sit below clinical anchors but accessibility is the deciding factor for older Saudi buyers who want a domestic, regulated option.',
  },
  {
    product: productsGCC.find(p => p.slug === 'eu-yan-sang-brainmax-review')!,
    rank: 4,
    whyItsHere:
      'Cera-Q (silk fibroin protein) is clinically studied for memory recall in older adults at 200mg per day — exactly the dose used in BrainMAX+. From a 145-year-old TCM heritage brand based in Singapore. Caffeine-free, plant-based capsules — halal-friendly. Powder sachet format may be easier for older adults than swallowing capsules. Tariffs absorbed by Eu Yan Sang on international orders. Note: silk-derived ingredient; observant buyers concerned about insect-derived sources should be aware. Not SFDA/MOHAP-registered.',
  },
  {
    product: productsGCC.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 5,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract at 500mg from a brand with the strongest third-party Certificate-of-Analysis culture in this review. The right pick if you want to test Lion\'s Mane in isolation, possibly stacked with a phosphatidylserine supplement. Mushroom-derived — halal-compliant. Caffeine-free, plant-based capsules. Ships from US.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a neurologist for evaluation. SFDA and MOHAP do not permit dementia-prevention claims for supplements; if you see one, treat it as a regulatory red flag.',
  },
  {
    q: 'Are these supplements halal?',
    a: 'All five picks use plant-based HPMC or pullulan capsules with no porcine gelatin. The most predictable halal-compliant option for KSA buyers is Nahdi Brain Boost (SFDA-registered). Note on phosphatidylserine: most products use soy-derived PS (halal); some use bovine-derived PS (would need halal-slaughter verification) or sunflower-derived PS (always halal). For Lion\'s Mane (mushroom-derived), halal status is straightforward. For Cera-Q in Eu Yan Sang BrainMAX+ (silk fibroin protein), observant buyers concerned about insect-derived ingredients should verify their personal halal interpretation.',
  },
  {
    q: 'Which of these are SFDA-registered or MOHAP-registered?',
    a: 'Nahdi Brain Boost is SFDA-registered in Saudi Arabia. Life Pharmacy NeuroShield (see the focus page) is MOHAP-registered in the UAE. The international brands (Mind Lab Pro, Qualia Mind, Eu Yan Sang BrainMAX+, Nootropics Depot) are not formally registered with SFDA or MOHAP — they enter the region as personal-use dietary supplements. iHerb\'s Saudi-compliant DC handles import paperwork for many international brands. Marnys Memory Plus (Spain-based) is also widely distributed in GCC pharmacies as an accessible local option, though doses are conservative.',
  },
  {
    q: 'What does the FDA qualified health claim for PS mean?',
    a: 'The FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly." This is a softer claim than full FDA-approved health claims and reflects evidence quality, not a disease-prevention promise. SFDA and MOHAP do not permit equivalent claims on GCC labels.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing clinician. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin/anticoagulant regimens; sunflower-derived PS is the alternative. Older adults on multiple medications should always check with a pharmacist before adding a multi-ingredient stack.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks. Lion\'s Mane: 8–16 weeks. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure (online tests are crude but better than subjective recall).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in the GCC"
      pageDescription="Independent ranking of nootropics for adults concerned about age-related cognitive changes, available in the GCC."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer\'s, or any clinical cognitive disease. For those, see a neurologist. For GCC older buyers, the additional considerations are halal compliance, capsule source (plant-based HPMC/pullulan vs. animal-derived gelatin), SFDA/MOHAP registration, and ease of access without international shipping. This page ranks the age-relevant products available in the GCC — including imported international stacks (Mind Lab Pro, Qualia Mind, Eu Yan Sang BrainMAX+, Nootropics Depot) and locally-regulated domestic options (Nahdi Brain Boost, SFDA-registered). Distribution: BinSina, Aster, Life Pharmacy (UAE); Al-Dawaa, Nahdi (KSA); iHerb Saudi-compliant DC for international imports."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('gcc')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
