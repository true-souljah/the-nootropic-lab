import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://gcc.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Memory in the GCC ${CURRENT_YEAR}: Halal-Friendly Picks for Saudi, UAE & Gulf Buyers`,
  description:
    'Independent ranking of the best memory nootropics available in the GCC. Halal status, SFDA/MOHAP registration, and capsule sources disclosed for each pick.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-memory/` },
  openGraph: {
    title: 'Best Nootropics for Memory — GCC Buyer\'s Guide',
    description: 'Bacopa, Lion\'s Mane, phosphatidylserine — clinically-dosed memory picks for GCC buyers, with halal and registration notes.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardised to 50% bacosides. Onset is slow — daily for 8+ weeks. Plant-derived; halal-compliant. Widely used in Ayurvedic medicine and increasingly available in GCC pharmacies.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Mushroom-derived — halal by default. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. The FDA permits a qualified health claim for PS supporting cognitive function in elderly adults. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. GCC note: PS is most commonly soy-derived (halal-friendly); some products use bovine-sourced PS — verify the source if observing strict halal slaughter requirements. Sunflower-derived PS is also available.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Synthesised, not animal-derived — halal-compliant.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsGCC.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), AND phosphatidylserine (100mg Sharp-PS at clinical dose) — three of the four memory-evidence ingredients in one open formula. Plus Lion\'s Mane fruiting-body extract at 500mg. Plant-based HPMC capsules — no porcine gelatin, halal-friendly. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Bacopa supplement for full effect. Ships from UK to UAE/KSA via Dubai free-zone logistics.',
  },
  {
    product: productsGCC.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes Bacopa (300mg at clinical dose), phosphatidylserine (200mg, well above clinical anchor), Alpha-GPC, and additional memory cofactors — the most complete memory-ingredient stack in this review. Plant-based capsules. Caveat: contains caffeine in default formula — request the caffeine-free variant at checkout. 7+ capsules/day and $139/mo USD are real friction points. Not SFDA/MOHAP-registered; ships from US.',
  },
  {
    product: productsGCC.find(p => p.slug === 'eu-yan-sang-brainmax-review')!,
    rank: 3,
    whyItsHere:
      'Cera-Q (silk fibroin protein) is clinically studied for memory recall and learning at 200mg — exactly the dose used in Eu Yan Sang BrainMAX+. Combined with Goji Berry and Chinese Wild Ginseng. From a 145-year-old TCM heritage brand based in Singapore. Caffeine-free, plant-based capsules — halal-friendly. Tariffs absorbed by Eu Yan Sang on international orders. Note: silk fibroin sourcing uses cocoons; observant buyers concerned about insect-derived ingredients should be aware. Not SFDA/MOHAP-registered.',
  },
  {
    product: productsGCC.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 4,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract at 500mg from a brand with the strongest third-party Certificate-of-Analysis culture in this review. Mushroom-derived — halal-compliant. Single-ingredient profile may also clear GCC customs more easily than multi-ingredient stacks. Caffeine-free, plant-based capsules. Pair with Mind Lab Pro or a separate Bacopa supplement for full memory-stack coverage. Ships from US.',
  },
  {
    product: productsGCC.find(p => p.slug === 'nahdi-brain-boost-review')!,
    rank: 5,
    whyItsHere:
      'SFDA-registered and stocked across 1,100+ Nahdi pharmacy branches in Saudi Arabia (and online via nahdi.sa). Includes Phosphatidylserine, Ginkgo Biloba, B12, and Zinc. SAR pricing — no currency conversion or customs risk. Halal-compliant. Doses are below clinical anchors for the cognitive ingredients, but this is the most accessible memory-support pick for KSA buyers who want same-day delivery from a domestic, regulated brand.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Are these supplements halal?',
    a: 'All five picks on this page use plant-based HPMC or pullulan capsules with no porcine gelatin. None of the imported brands (Mind Lab Pro, Qualia Mind, Eu Yan Sang BrainMAX+, Nootropics Depot) carry formal halal certification (HALAL India, JAKIM, MUI, ESMA), so observant buyers should verify each brand\'s latest ingredient sourcing. Nahdi Brain Boost is SFDA-registered with halal-compliant sourcing as standard. Note on phosphatidylserine: most products use soy-derived PS (halal); some use bovine-derived PS (would need halal-slaughter verification) or sunflower-derived PS (always halal).',
  },
  {
    q: 'Which of these are SFDA-registered or MOHAP-registered?',
    a: 'Nahdi Brain Boost is SFDA-registered in Saudi Arabia and stocked across 1,100+ Nahdi pharmacies. Life Pharmacy NeuroShield (not on this list — see the focus page) is MOHAP-registered in the UAE. The international brands here (Mind Lab Pro, Qualia Mind, Eu Yan Sang BrainMAX+, Nootropics Depot) are not formally registered with SFDA or MOHAP and enter the region as personal-use dietary supplements. Verify import status with your local authority before ordering. iHerb\'s Saudi-compliant DC handles import paperwork for many international supplements.',
  },
  {
    q: 'What is the most evidence-backed nootropic for memory?',
    a: 'Bacopa Monnieri at 300mg standardised to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. Phosphatidylserine has the FDA qualified health claim for cognitive function in elderly. Citicoline has good evidence for older adults with age-related memory complaints. Cera-Q (in Eu Yan Sang BrainMAX+) is a newer ingredient with promising clinical data specifically on memory recall.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Read labels carefully and prefer products that disclose β-glucan percentage and use the fruiting body — Nootropics Depot publishes a Certificate of Analysis per batch.',
  },
  {
    q: 'Is Marnys Memory Plus a good GCC option?',
    a: 'Marnys Memory Plus is a Spain-based brand widely distributed in GCC pharmacies (often Aster and Life Pharmacy in the UAE; some Al-Dawaa branches in KSA). It contains Ginkgo, Phosphatidylserine, and B-vitamins at conservative doses. It is a reasonable accessible local-pharmacy option, but the doses sit below clinical anchors for the core cognitive ingredients. We have not yet completed a full editorial review of Marnys Memory Plus — when we do it will appear in our coverage with a full dosing audit.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="memory"
      pageTitle="Best Nootropics for Memory in the GCC"
      pageDescription="Independent ranking of the best memory nootropics available in the GCC, with halal status and SFDA/MOHAP registration noted per pick."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs spanning 30+ years, plus phosphatidylserine\'s FDA qualified health claim. For GCC buyers, the question is not just \'does it work?\' but \'is it halal?\', \'is it SFDA or MOHAP registered?\', and \'is the capsule plant-based or animal-derived?\'. This page ranks the products available to buyers in Saudi Arabia, the UAE, Qatar, Kuwait, Bahrain, and Oman — including imported international brands (Mind Lab Pro, Qualia Mind, Eu Yan Sang BrainMAX+, Nootropics Depot) and locally-regulated domestic options (Nahdi Brain Boost, SFDA-registered). Distribution: BinSina, Aster, Life Pharmacy (UAE); Al-Dawaa, Nahdi (KSA); iHerb Saudi-compliant DC for many international imports."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('gcc')}
    />
  );
}
