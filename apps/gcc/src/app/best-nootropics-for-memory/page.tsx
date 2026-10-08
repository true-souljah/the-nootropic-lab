import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory in the GCC ${CURRENT_YEAR}: Saudi, UAE & Gulf Picks with Capsule & Halal-Certificate Notes`,
  description:
    'Independent ranking of the best memory nootropics available in the GCC. Halal status, SFDA/MOHAP registration, and capsule sources disclosed for each pick.',
  alternates: buildAlternates({ regionCode: 'gcc', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory — GCC Buyer\'s Guide',
    description: 'Bacopa, Lion\'s Mane, phosphatidylserine — clinically-dosed memory picks for GCC buyers, with halal and registration notes.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardised to 50% bacosides. Onset is slow — daily for 8+ weeks. Plant-derived. Widely used in Ayurvedic medicine and increasingly available in GCC pharmacies.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Mushroom-derived. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. The FDA permits a qualified health claim for PS supporting cognitive function in elderly adults. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo. GCC note: PS source (soy, sunflower or bovine) is not stated by every brand — check the label.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Synthesised, not animal-derived.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsGCC.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), AND phosphatidylserine (100mg Sharp-PS at clinical dose) — three of the four memory-evidence ingredients in one open formula. Plus Lion\'s Mane fruiting-body extract at 500mg. Pullulan (NutriCaps) capsules, suitable for vegans per the brand (checked 2026-10-07). Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Bacopa supplement for full effect. mindlabpro.com names Saudi Arabia, the UAE, Qatar and Kuwait among its shipping territories (its FAQ, checked 2026-09-29); Bahrain and Oman are not named on that partial list, so confirm at checkout.',
  },
  {
    product: productsGCC.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes Bacopa (300mg at clinical dose), phosphatidylserine (200mg, well above clinical anchor), Alpha-GPC, and additional memory cofactors — the most complete memory-ingredient stack in this review. Vegetarian capsules (hypromellose), per the brand (checked 2026-10-07). Caveat: contains caffeine in default formula — choose the caffeine-free variant where offered. 7+ capsules/day and the $159 USD list price are real friction points. We have not verified a product registration with the Saudi Food and Drug Authority (SFDA) or the Ministry of Health and Prevention (MOHAP), and Qualia does not ship to any GCC state (brand shipping page, checked 2026-09-28).',
  },
  {
    product: productsGCC.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract at 500mg from a brand with the strongest third-party Certificate-of-Analysis culture in this review. Mushroom-derived; no halal certificate shown on the brand\'s page we fetched (checked 2026-10-07). Single-ingredient profile may also clear GCC customs more easily than multi-ingredient stacks. Caffeine-free; labelled vegan on the brand\'s product page, which does not state the capsule shell material. Pair with Mind Lab Pro or a separate Bacopa supplement for full memory-stack coverage. Ships from US.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Are these supplements halal?',
    a: 'On capsules, Mind Lab Pro states pullulan (NutriCaps) capsules and Qualia Mind vegetarian (hypromellose) capsules; Nootropics Depot labels its Lion\'s Mane vegan but does not state the capsule shell material. None of these brands (Mind Lab Pro, Qualia Mind, Nootropics Depot) shows a halal certificate on its pages (checked 2026-10-07), so observant buyers should verify each brand\'s latest ingredient sourcing. Note on phosphatidylserine: PS source (soy, sunflower or bovine) is not stated by every brand — check the label.',
  },
  {
    q: 'Which of these are SFDA-registered or MOHAP-registered?',
    a: 'We have not verified an SFDA or MOHAP registration for any of the picks on this page. The international brands here (Mind Lab Pro, Qualia Mind, Nootropics Depot) enter the region as personal-use dietary supplements. Verify import status with your local authority before ordering. iHerb\'s Saudi-compliant DC handles import paperwork for many international supplements.',
  },
  {
    q: 'What is the most evidence-backed nootropic for memory?',
    a: 'Bacopa Monnieri at 300mg standardised to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. Phosphatidylserine has the FDA qualified health claim for cognitive function in elderly. Citicoline has good evidence for older adults with age-related memory complaints. Cera-Q (the silk fibroin protein in Eu Yan Sang BrainMAX+) is a newer ingredient whose memory evidence is one citable 3-week trial by maker-affiliated authors, and Korea\'s regulator revoked its functional-ingredient recognition in 2017 after its supporting study was retracted, so BrainMAX+ is not among our picks.',
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
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory in the GCC"
      pageDescription="Independent ranking of the best memory nootropics available in the GCC, with halal status and SFDA/MOHAP registration noted per pick."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs spanning 30+ years, plus phosphatidylserine\'s FDA qualified health claim. For GCC buyers, the question is not just \'does it work?\' but \'is it halal?\', \'is it SFDA or MOHAP registered?\', and \'is the capsule plant-based or animal-derived?\'. This page ranks memory products for buyers in Saudi Arabia, the UAE, Qatar, Kuwait, Bahrain, and Oman — imported international brands (Mind Lab Pro, Qualia Mind, Nootropics Depot), with each pick noting whether the brand ships to the GCC. Distribution: BinSina, Aster, Life Pharmacy (UAE); Al-Dawaa, Nahdi (KSA); iHerb Saudi-compliant DC for many international imports."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'Halal-certified nootropics in the GCC', href: '/halal-certified-nootropics/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('gcc')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
