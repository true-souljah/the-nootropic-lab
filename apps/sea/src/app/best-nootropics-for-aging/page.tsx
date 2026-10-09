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
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'The US FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly. Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints. The strongest age-related cognitive evidence in this category. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo. Sunflower-derived PS is the preferred form for halal-conscious buyers and those with soy allergies.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    ingredientSlugs: ['citicoline'],
    evidence:
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Cognizin is the standardized form most premium SEA imports use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Mori et al. 2009 — small RCT in older Japanese adults with mild cognitive impairment. 1g/day fruiting-body extract over 16 weeks improved cognitive function scores. Evidence is promising for early age-related changes; not evaluated for dementia treatment. Lion\'s Mane is culturally familiar across Chinese-heritage SEA (Singapore, Malaysia, Vietnam) as a TCM mushroom — older buyers in these markets often have prior cultural exposure.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri (Brahmi)',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks at 300mg standardized to 50% bacosides. Brahmi has deep cultural standing in Ayurvedic traditions across Indonesia, Malaysia, and Thailand — older buyers often recognise it from family medicine cabinets.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
  {
    name: 'Cera-Q (Silk Fibroin Protein) — Asia-developed',
    ingredientSlugs: [],
    evidence:
      'Korean-developed silk fibroin protein hydrolysate. In a 3-week placebo-controlled trial in healthy adults averaging about 55 years (Kang et al. 2018; two of the four authors were affiliated with BrainOn Inc.), doses of 280–600mg/day were tested and memory-quotient gains were reported at doses over 280mg, with a plateau at 400–600mg. Particularly common in Asia-developed memory supplements (Eu Yan Sang BrainMAX+ lists 600mg per sachet). Korea\'s food regulator revoked Cera-Q\'s functional-ingredient recognition in 2017 after its supporting mouse study was retracted for data fabrication; in Korea it is sold as a general food (details in our BrainMAX+ review).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/29462997/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Bacopa, and Lion\'s Mane. Four of the most age-relevant ingredients in one open-formula product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants in tropical heat. mindlabpro.com names Singapore, Thailand, the Philippines, Indonesia and Vietnam among its shipping territories (its FAQ, checked 2026-09-29); Malaysia is not named on that partial list, so confirm at checkout. Personal-use import. Halal: no halal certificate shown on the brand\'s pages we fetched (checked 2026-10-07) — older Muslim buyers in MY/ID should check the certifying body\'s register before buying.',
  },
  {
    product: productsSEA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine 100mg, Alpha-GPC, and Lion\'s Mane plus 28 additional ingredients, the most of any single formula in this review, but the 6-capsule daily protocol can be hard to maintain for older adults — consider whether the breadth justifies that friction. Contains caffeine (100mg/serving) which may be unsuitable for older adults with cardiovascular conditions or hypertension. Availability caveat: Qualia does not ship to any SEA country (brand shipping page, checked 2026-09-28).',
  },
  {
    product: productsSEA.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
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
    a: 'Imported brands (Mind Lab Pro, Qualia Mind, Nootropics Depot Lion\'s Mane) show no BPJPH (Indonesia), JAKIM (Malaysia) or other halal certificate on the brand pages we fetched (checked 2026-10-07). For JAKIM-certified alternatives, verify the specific product on its packaging, or check its manufacturer in JAKIM\'s MYeHALAL directory (myehalal.halal.gov.my), which is searched by company name and lists each company\'s certified products on its detail page. When uncertain, consult your local imam, halal authority, or pharmacist before purchase — older relatives often value this consultation step regardless.',
  },
  {
    q: 'Which are best via Shopee/Lazada/Watsons vs cross-border iHerb for older buyers?',
    a: 'Shopee/Lazada/in-store: buy from the brand\'s official store or in person. This is the right route for older buyers who value in-person pharmacist or shop assistant consultation in their local language (English, Malay, Mandarin, Tagalog, Thai, Vietnamese, Bahasa Indonesia). Cross-border iHerb: best for premium imports (Mind Lab Pro, Nootropics Depot) where lab transparency and ingredient breadth matter more than in-person purchase. Adult children buying for parents often prefer the iHerb route for documentation and re-ordering convenience.',
  },
  {
    q: 'What does the FDA qualified health claim for PS mean?',
    a: 'The US FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly." This is a softer claim than full FDA-approved health claims and reflects evidence quality, not a disease-prevention promise. SEA regulators (HSA, NPRA, BPOM, FDA TH/PH) do not currently grant equivalent claims — products with PS sold across SEA cannot make dementia-prevention statements on local labels.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing clinician. Bacopa/Brahmi and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with certain warfarin/anticoagulant regimens; sunflower-derived PS is the alternative. Ginkgo has documented interactions with anticoagulants — review with your doctor before starting.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks. Lion\'s Mane: 8–16 weeks. Cera-Q: 3 weeks in the one trial we could cite. None are acute-effect ingredients. Track changes over 12 weeks of consistent dosing — ideally with a baseline cognitive measure. For SEA older adults, the simplest baseline is a family member\'s observation: ask them to note any improvements in word retrieval, name recall, or task focus rather than relying on subjective memory of how you felt 12 weeks ago.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain in SEA"
      pageDescription="Independent ranking of nootropics for SEA adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. Most of the supplements on this page have evidence in older adults with subjective cognitive complaints. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease. For those, see a neurologist at NUH/SGH (Singapore), UMMC (Malaysia), Siriraj (Thailand), PGH (Philippines), or your equivalent regional centre. This page ranks imported stacks for SEA buyers, noting where a brand does not ship to the region. Halal status (Indonesia’s Badan Penyelenggara Jaminan Produk Halal (BPJPH) and the Department of Islamic Development Malaysia (JAKIM)), distribution route, and import notes per country (Singapore’s Health Sciences Authority (HSA), Malaysia’s National Pharmaceutical Regulatory Agency (NPRA), Indonesia’s Badan Pengawas Obat dan Makanan (BPOM), and the Thai and Philippine Food and Drug Administrations (FDA)) included where known."
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
