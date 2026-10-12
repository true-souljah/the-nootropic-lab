import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsGCC, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain in the GCC ${CURRENT_YEAR}: Saudi, UAE & Gulf Picks with Capsule & Halal-Certificate Notes`,
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
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'The FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo. GCC note: PS source (soy, sunflower or bovine) is not stated by every brand — check the label.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    ingredientSlugs: ['citicoline'],
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardised form most products use. Synthesised, not animal-derived.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Mushroom-derived. Evidence is promising for early age-related changes; not evaluated for dementia treatment.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks at 300mg standardised to 50% bacosides. Plant-derived.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsGCC.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane. Four of the most age-relevant ingredients in one open-formula product. Pullulan (NutriCaps) capsules, suitable for vegans per the brand (checked 2026-10-07). Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. mindlabpro.com names Saudi Arabia, the UAE, Qatar and Kuwait among its shipping territories (its FAQ, checked 2026-09-29); Bahrain and Oman are not named on that partial list, so confirm at checkout. We have not verified a product registration with the Saudi Food and Drug Authority (SFDA) or the Ministry of Health and Prevention (MOHAP).',
  },
  {
    product: productsGCC.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine (100mg, the low end of the clinical range), Alpha-GPC, and additional age-relevant cofactors. Vegetarian capsules (hypromellose), per the brand (checked 2026-10-07). Its 31 ingredients are the most of any single formula in this review, but the 6-capsule daily protocol can be hard to maintain for older adults — consider whether the breadth justifies that friction. Caveat: default formula contains caffeine — older adults sensitive to stimulants should choose the caffeine-free variant where offered. Qualia does not ship to any GCC state (brand shipping page, checked 2026-09-28).',
  },
  {
    product: productsGCC.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract at 500mg from a brand with the strongest third-party Certificate-of-Analysis culture in this review. The right pick if you want to test Lion\'s Mane in isolation, possibly stacked with a phosphatidylserine supplement. Mushroom-derived; no halal certificate shown on the brand\'s page we fetched (checked 2026-10-07). Caffeine-free; labelled vegan on the brand\'s product page, which does not state the capsule shell material. Ships from US.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a neurologist for evaluation. SFDA and MOHAP do not permit dementia-prevention claims for supplements; if you see one, treat it as a regulatory red flag.',
  },
  {
    q: 'Are these supplements halal?',
    a: 'On capsules, Mind Lab Pro states pullulan (NutriCaps) capsules and Qualia Mind vegetarian (hypromellose) capsules; Nootropics Depot labels its Lion\'s Mane vegan but does not state the capsule shell material (checked 2026-10-07). Note on phosphatidylserine: PS source (soy, sunflower or bovine) is not stated by every brand — check the label. Lion\'s Mane is mushroom-derived.',
  },
  {
    q: 'Which of these are SFDA-registered or MOHAP-registered?',
    a: 'We have not verified an SFDA or MOHAP registration for any of the picks on this page. The international brands (Mind Lab Pro, Qualia Mind, Nootropics Depot) enter the region as personal-use dietary supplements. iHerb\'s Saudi-compliant DC handles import paperwork for many international brands. Marnys Memory Plus (Spain-based) is also widely distributed in GCC pharmacies as an accessible local option, though doses are conservative.',
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
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. Most of the supplements on this page have evidence in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer\'s, or any clinical cognitive disease. For those, see a neurologist. For GCC older buyers, the additional considerations are halal compliance, capsule source (plant-based HPMC/pullulan vs. animal-derived gelatin), SFDA/MOHAP registration, and ease of access without international shipping. This page ranks age-relevant products for GCC buyers — imported international stacks such as Mind Lab Pro and Qualia Mind, with each pick noting whether the brand ships to the GCC. Distribution: BinSina, Aster, Life Pharmacy (UAE); Al-Dawaa, Nahdi (KSA); iHerb Saudi-compliant DC for international imports."
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
