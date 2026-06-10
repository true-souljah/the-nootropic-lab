import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsSEA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain ${CURRENT_YEAR}: SEA Buyer's Guide`,
  description:
    'Independent ranking of nootropics for SEA adults concerned about age-related cognitive changes. Phosphatidylserine, Bacopa/Brahmi, citicoline. NOT a treatment for dementia.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain in SEA — Evidence-Graded',
    description: 'Phosphatidylserine has the FDA qualified claim. Plus Bacopa/Brahmi, citicoline, Lion\'s Mane, TCM heritage formulas. What the evidence says for SEA buyers.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS) — FDA qualified health claim',
    evidence:
      'The US FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category. Sunflower-derived PS is the preferred form for halal-conscious buyers and those with soy allergies.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardized form most premium SEA imports use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Evidence is promising for early age-related changes; not evaluated for dementia treatment. Lion\'s Mane is culturally familiar across Chinese-heritage SEA (Singapore, Malaysia, Vietnam) as a TCM mushroom — older buyers in these markets often have prior cultural exposure.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri (Brahmi)',
    evidence:
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks at 300mg standardized to 50% bacosides. Brahmi has deep cultural standing in Ayurvedic traditions across Indonesia, Malaysia, and Thailand — older buyers often recognise it from family medicine cabinets.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
  {
    name: 'Cera-Q (Silk Fibroin Protein) — Asia-developed',
    evidence:
      'Korean-developed silk fibroin protein hydrolysate. Clinical trials show inhibition of amyloid-beta aggregation and acetylcholine support, with measurable improvements in memory recall in older adults at 200mg/day. Particularly common in Asia-developed memory supplements (Eu Yan Sang BrainMAX+ uses it at 200mg full clinical dose).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/27097658/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane. Four of the most age-relevant ingredients in one open-formula product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants in tropical heat. UK→SEA shipping 7–14 days with DDP (no customs surprises). Personal-use import. Not BPJPH/JAKIM halal-certified — older Muslim buyers in MY/ID may prefer Blackmores or Eu Yan Sang options.',
  },
  {
    product: productsSEA.find(p => p.slug === 'eu-yan-sang-brainmax-review')!,
    rank: 2,
    whyItsHere:
      'A 145-year-old TCM heritage brand with 200+ stores across Singapore, Malaysia, Hong Kong, and Macau — deep trust among Chinese-heritage older buyers in SEA. Cera-Q (silk fibroin protein, clinically studied for memory in older adults) at 200mg full clinical dose, plus Goji Berry and Chinese Wild Ginseng (TCM tradition for cognitive health). Powder sachet format is friendlier than capsules for older adults with swallowing difficulties. Walk into any Eu Yan Sang store for in-person purchase and pharmacist consultation. Tariffs absorbed on international orders.',
  },
  {
    product: productsSEA.find(p => p.slug === 'blackmores-brain-active-review')!,
    rank: 3,
    whyItsHere:
      'TGA-AU registered, distributed by Blackmores SEA subsidiaries — available in Guardian, Watsons, and Unity pharmacies across SG/MY/TH/PH/ID. The most accessible domestic option for older adults who prefer to buy in person from a familiar pharmacy. Includes Bacopa (Keenmind 160mg), Ginkgo Biloba 80mg, DHA 200mg, and PS 50mg. Doses are below clinical anchors but the trade-off is local pricing, in-pharmacy purchase, and an established Asia-Pacific health brand with 90+ years of trust. Some Blackmores SKUs carry JAKIM halal certification.',
  },
  {
    product: productsSEA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 4,
    whyItsHere:
      'Includes phosphatidylserine 200mg, Bacopa 300mg, Alpha-GPC, Lion\'s Mane, and Uridine plus 23 additional ingredients. Most complete coverage but the 7-capsule daily protocol can be hard to maintain for older adults — consider whether the breadth justifies that friction. Contains caffeine (90mg/serving) which may be unsuitable for older adults with cardiovascular conditions or hypertension. US→SEA shipping 12–18 days; customs scrutiny higher in ID/TH at this price point.',
  },
  {
    product: productsSEA.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 5,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract from a brand with an ISO-certified in-house lab and a published Certificate of Analysis per batch. The right pick if an older buyer wants to test Lion\'s Mane in isolation, possibly stacked with PS or a TCM heritage brand. Lion\'s Mane has cultural acceptance in Chinese-heritage SEA which eases regulatory ambiguity. Lowest customs-exposure premium import at $25/mo. One capsule daily — easiest pill burden of any pick.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved to prevent or treat dementia or Alzheimer\'s. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a neurologist for evaluation. In Singapore: KKH, NUH, SGH have memory clinics. In Malaysia: UMMC, HKL. In Thailand: Siriraj, Chulalongkorn Hospital. Do not delay clinical evaluation by relying on supplements.',
  },
  {
    q: 'Are these halal-certified for older Muslim buyers in MY/ID?',
    a: 'Imported brands (Mind Lab Pro, Qualia Mind, Nootropics Depot Lion\'s Mane) do not carry BPJPH (Indonesia) or JAKIM (Malaysia) halal certification. Halal-friendlier options for older Muslim buyers: certain Blackmores SKUs are JAKIM-certified (verify on the specific product packaging or via verify.halal.gov.my); Nature\'s Own brain supplements should also be checked SKU-by-SKU. Eu Yan Sang BrainMAX+ uses vegetarian capsules but is not formally halal-certified. When uncertain, consult your local imam, halal authority, or pharmacist before purchase — older relatives often value this consultation step regardless.',
  },
  {
    q: 'Which are best via Shopee/Lazada/Watsons vs cross-border iHerb for older buyers?',
    a: 'Shopee/Lazada/in-pharmacy: Blackmores Brain Active and Nature\'s Own Brain Fuel (TGA-AU, in Guardian/Watsons/Unity), plus Eu Yan Sang BrainMAX+ via official store or in-person. These are the right route for older buyers who value in-person pharmacist or shop assistant consultation in their local language (English, Malay, Mandarin, Tagalog, Thai, Vietnamese, Bahasa Indonesia). Cross-border iHerb: best for premium imports (Mind Lab Pro, Qualia Mind, Nootropics Depot) where lab transparency and ingredient breadth matter more than in-person purchase. Adult children buying for parents often prefer the iHerb route for documentation and re-ordering convenience.',
  },
  {
    q: 'What does the FDA qualified health claim for PS mean?',
    a: 'The US FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly." This is a softer claim than full FDA-approved health claims and reflects evidence quality, not a disease-prevention promise. SEA regulators (HSA, NPRA, BPOM, FDA TH/PH, VFA) do not currently grant equivalent claims — products with PS sold across SEA cannot make dementia-prevention statements on local labels.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing clinician. Bacopa/Brahmi and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin/anticoagulant regimens; sunflower-derived PS is the alternative. Ginkgo (in Blackmores Brain Active and Nature\'s Own Brain Fuel) has documented interactions with anticoagulants — review with your doctor before starting.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks. Lion\'s Mane: 8–16 weeks. Cera-Q: 4–8 weeks. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure. For SEA older adults, the simplest baseline is a family member\'s observation: ask them to note any improvements in word retrieval, name recall, or task focus rather than relying on subjective memory of how you felt 12 weeks ago.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in SEA"
      pageDescription="Independent ranking of nootropics for SEA adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. The supplements on this page have evidence specifically in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease. For those, see a neurologist at NUH/SGH (Singapore), UMMC (Malaysia), Siriraj (Thailand), PGH (Philippines), or your equivalent regional centre. This page ranks the options available to SEA buyers — including Asia-developed formulas (Eu Yan Sang BrainMAX+ with Cera-Q) and TGA-AU brands (Blackmores) widely stocked in Watsons, Guardian, and Unity pharmacies across the region. Halal status (BPJPH, JAKIM), distribution route, and import notes per country (HSA SG, NPRA MY, BPOM ID, FDA TH/PH, VFA VN) included where known."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'Halal nootropics in Indonesia (BPJPH)', href: '/halal-nootropics-indonesia-bpjph/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('sea')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
