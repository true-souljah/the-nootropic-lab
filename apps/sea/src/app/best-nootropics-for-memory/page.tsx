import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsSEA, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://sea.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Best Nootropics for Memory ${CURRENT_YEAR}: SEA Buyer's Guide`,
  description:
    'Independent ranking of nootropics for memory available to buyers in Singapore, Malaysia, Thailand, Philippines, Indonesia, and Vietnam. Bacopa, Lion\'s Mane, PS, citicoline. Halal + import notes.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-memory/` },
  openGraph: {
    title: 'Best Nootropics for Memory in SEA — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says, plus which products clear customs into SG/MY/TH/PH/ID/VN.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri (Brahmi)',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardized to 50% bacosides. Onset is slow — daily for 8+ weeks. Widely recognised across SEA under the Ayurvedic name "Brahmi" (especially in Malaysia, Indonesia, Thailand) and culturally familiar.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Lion\'s Mane is a familiar functional mushroom in Chinese-heritage SEA food culture (Singapore, Malaysia, parts of Indonesia and Vietnam) — buyers in TCM-aware markets often face less regulatory ambiguity. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. The US FDA permits a qualified health claim for PS supporting cognitive function in elderly adults. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. Sunflower-derived PS is preferred over soy-derived for halal-conscious buyers and those concerned about soy allergens.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), AND phosphatidylserine (100mg Sharp-PS at clinical dose) plus Lion\'s Mane fruiting-body extract — four of the four memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Brahmi/Bacopa supplement (widely available across SEA). UK→SEA shipping 7–14 days. Personal-use import. Not BPJPH/JAKIM halal-certified.',
  },
  {
    product: productsSEA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes Bacopa at the full 300mg clinical dose, phosphatidylserine 200mg, Alpha-GPC, and Uridine Monophosphate — the most complete memory-ingredient stack in one product available to SEA buyers. Loses ground on capsule count (7+/day), $139/mo subscription, and contains caffeine. US→SEA shipping 12–18 days. Indonesian and Thai buyers should be especially mindful of customs thresholds at this declared value.',
  },
  {
    product: productsSEA.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract from a brand with an ISO-certified in-house lab and a published Certificate of Analysis per batch — the highest transparency in this list. The right pick if you want to test Lion\'s Mane in isolation. Lion\'s Mane has cultural acceptance across Chinese-heritage SEA (Singapore, Malaysia) which eases regulatory ambiguity. Lowest customs-exposure of any premium import at $25/mo. Pair with Brahmi or Mind Lab Pro for full memory coverage.',
  },
  {
    product: productsSEA.find(p => p.slug === 'eu-yan-sang-brainmax-review')!,
    rank: 4,
    whyItsHere:
      'A 145-year-old TCM heritage brand with 200+ retail stores across Singapore, Malaysia, Hong Kong, and Macau. Cera-Q (silk fibroin protein, clinically studied for memory and recall) at 200mg full clinical dose, plus Goji Berry and Chinese Wild Ginseng. Walk into any Eu Yan Sang store in SG/MY for in-person purchase — zero import risk, deep brand trust across Chinese-heritage communities. Ships internationally from Singapore with tariffs absorbed. Vegetarian capsules. Note: not currently halal-certified — verify if required.',
  },
  {
    product: productsSEA.find(p => p.slug === 'blackmores-brain-active-review')!,
    rank: 5,
    whyItsHere:
      'TGA-AU registered, distributed by Blackmores SEA subsidiaries, available in Guardian, Watsons, and Unity pharmacies across SG/MY/TH/PH/ID — the most accessible domestic option with zero import risk. Uses Bacopa (Keenmind branded extract) 160mg, Ginkgo Biloba 80mg, DHA 200mg, PS 50mg. Doses are below clinical anchors but the trade-off is local pricing, in-pharmacy purchase, and an established Asia-Pacific health brand. Some Blackmores SKUs carry JAKIM halal certification — check the specific product label.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Are these memory nootropics halal-certified?',
    a: 'Imported brands (Mind Lab Pro, Qualia Mind, Nootropics Depot Lion\'s Mane) do not carry BPJPH (Indonesia) or JAKIM (Malaysia) halal certification. Capsules are gelatin-based with vendor disclosure varying. For halal-certified options: some Blackmores SKUs carry JAKIM certification — verify on the specific product label, and consult the JAKIM halal verification portal (verify.halal.gov.my) or BPJPH portal (halal.go.id) for the latest status. Eu Yan Sang BrainMAX+ uses vegetarian capsules and is positioned for Chinese-heritage buyers but is not halal-certified. When uncertain, contact the brand or check the local halal database before purchase.',
  },
  {
    q: 'Which memory nootropics are best via Shopee/Lazada vs cross-border iHerb?',
    a: 'Shopee/Lazada/TikTok Shop: Blackmores Brain Active and Nature\'s Own Brain Fuel (TGA-AU brands with reliable local-marketplace supply) plus the Eu Yan Sang official store on Shopee SG/MY. NatureBell Ginkgo+Ginseng is available on Amazon.sg as a budget option. Cross-border iHerb: best route for Nootropics Depot Lion\'s Mane and other premium single-ingredient products into Singapore and Malaysia (consolidated warehouses minimise customs friction). Direct from brand: Mind Lab Pro and Qualia Mind ship DDP into SEA — no customs surprises but slower delivery.',
  },
  {
    q: 'What is the most evidence-backed nootropic for memory?',
    a: 'Bacopa Monnieri at 300mg standardized to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. SEA buyers have an advantage: Bacopa is widely available locally as "Brahmi" in Ayurvedic and traditional supplement aisles across MY/ID/SG. Phosphatidylserine has the FDA qualified health claim for cognitive function in elderly. Citicoline has good evidence for older adults with age-related memory complaints.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging — start at the beginning of the academic term, fiscal year, or before a major project rather than the night before.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. In SEA, fresh Lion\'s Mane mushroom is sometimes available at TCM dispensaries and wet markets in SG and MY — culinary use does not match supplement-grade extract dosing. For supplements, prefer products that disclose β-glucan percentage and use the fruiting body (Nootropics Depot, Mind Lab Pro both qualify).',
  },
  {
    q: 'Will Brahmi/Bacopa make me feel anything immediately?',
    a: 'No. Bacopa is not an acute-effect ingredient. It is a classic case of "you only know it worked when you stop and notice the regression." The cumulative memory benefit at 8–12 weeks is the most replicated finding in nootropics. Bacopa can cause mild GI upset in some people; take with food (a common SEA practice anyway — most traditional preparations recommend with rice or after meals).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="memory"
      pageTitle="Best Nootropics for Memory in SEA"
      pageDescription="Independent ranking of memory nootropics available to buyers across Southeast Asia. Bacopa, Lion's Mane, PS, citicoline."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri (known across SEA as Brahmi) RCTs over 30+ years. This page ranks the products available to SEA buyers that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose. Regulatory status (HSA SG, NPRA MY, BPOM ID, FDA TH/PH, VFA VN), distribution route (Shopee, Lazada, TikTok Shop, Watsons, Guardian, Unity, Boots, Mercury Drug, cross-border iHerb), and halal availability (BPJPH, JAKIM) noted per pick where known."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      author={author}
    />
  );
}
