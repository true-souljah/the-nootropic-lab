import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsSEA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory ${CURRENT_YEAR}: SEA Buyer's Guide`,
  description:
    'Independent ranking of nootropics for memory available to buyers in Singapore, Malaysia, Thailand, Philippines, Indonesia, and Vietnam. Bacopa, Lion\'s Mane, PS, citicoline. Halal + import notes.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory in SEA — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says, plus which products clear customs into SG/MY/TH/PH/ID/VN.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri (Brahmi)',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardized to 50% bacosides. Onset is slow — daily for 8+ weeks. Widely recognised across SEA under the Ayurvedic name "Brahmi" (especially in Malaysia, Indonesia, Thailand) and culturally familiar.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Lion\'s Mane is a familiar functional mushroom in Chinese-heritage SEA food culture (Singapore, Malaysia, parts of Indonesia and Vietnam) — buyers in TCM-aware markets often face less regulatory ambiguity. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'Phospholipid component of brain cell membranes. The US FDA permits a qualified health claim for PS supporting cognitive function in elderly adults. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo. Sunflower-derived PS is preferred over soy-derived for halal-conscious buyers and those concerned about soy allergens.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), AND phosphatidylserine (100mg Sharp-PS at clinical dose) plus Lion\'s Mane fruiting-body extract — four of the four memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Brahmi/Bacopa supplement (widely available across SEA). mindlabpro.com names Singapore, Thailand, the Philippines, Indonesia and Vietnam among its shipping territories (its FAQ, checked 2026-09-29); Malaysia is not named on that partial list, so confirm at checkout. Personal-use import. Halal: no halal certificate shown on the brand\'s pages we fetched (checked 2026-10-07); the brand states pullulan (NutriCaps) capsules.',
  },
  {
    product: productsSEA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine 100mg, Alpha-GPC, citicoline (as Cognizin), and Lion\'s Mane — 31 ingredients in all, the most of any single formula in this review. Loses ground on capsule count (6/day), $139/mo subscription, and contains caffeine. Availability caveat: Qualia does not ship to any SEA country (brand shipping page, checked 2026-09-28), so SEA buyers cannot order it direct.',
  },
  {
    product: productsSEA.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 3,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract from a brand with an ISO-certified in-house lab and a published Certificate of Analysis per batch — the highest transparency in this list. Its 500mg of Lion\'s Mane is half the 1,000mg low end of our Lion\'s Mane reference dose. Lion\'s Mane has cultural acceptance across Chinese-heritage SEA (Singapore, Malaysia) which eases regulatory ambiguity. Lowest customs-exposure of any premium import at $25/mo.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Are these memory nootropics halal-certified?',
    a: 'Imported brands (Mind Lab Pro, Qualia Mind, Nootropics Depot Lion\'s Mane) show no BPJPH (Indonesia), JAKIM (Malaysia) or other halal certificate on the brand pages we fetched (checked 2026-10-07). On capsules, Mind Lab Pro states pullulan (NutriCaps) capsules and Qualia Mind vegetarian (hypromellose) capsules; Nootropics Depot labels its Lion\'s Mane vegan but does not state the capsule shell material. Blackmores (Malaysia) Sdn Bhd holds JAKIM halal certificates for 37 products — none named as a cognitive or nootropic product, and Brain Active is not among them; all expire 30 November 2026 (MYeHALAL directory, checked 2026-10-08). Verify on the specific product label, and consult JAKIM\'s MYeHALAL directory (myehalal.halal.gov.my, searched by company name, with each company\'s certified products listed on its detail page) or the BPJPH register (bpjph.halal.go.id) for the latest status. When uncertain, contact the brand or check the local halal database before purchase.',
  },
  {
    q: 'Which memory nootropics are best via Shopee/Lazada vs cross-border iHerb?',
    a: 'Shopee/Lazada/TikTok Shop: buy from the brand\'s official store where one exists. NatureBell Ginkgo+Ginseng is available on Amazon.sg at a budget price; it is not one of this page\'s picks. Cross-border iHerb: best route for Nootropics Depot Lion\'s Mane and other premium single-ingredient products into Singapore and Malaysia (consolidated warehouses minimise customs friction). Direct from brand: Mind Lab Pro\'s FAQ names Singapore, Thailand, the Philippines, Indonesia and Vietnam among its shipping territories (checked 2026-09-29). Qualia Mind does not ship to any SEA country (brand shipping page, checked 2026-09-28).',
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
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory in SEA"
      pageDescription="Independent ranking of memory nootropics available to buyers across Southeast Asia. Bacopa, Lion's Mane, PS, citicoline."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri (known across SEA as Brahmi) RCTs over 30+ years. This page ranks the products available to SEA buyers that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose. Regulatory status (Singapore’s Health Sciences Authority (HSA), Malaysia’s National Pharmaceutical Regulatory Agency (NPRA), Indonesia’s Badan Pengawas Obat dan Makanan (BPOM), and the Thai and Philippine Food and Drug Administrations (FDA)), distribution route (Shopee, Lazada, TikTok Shop, Watsons, Guardian, Unity, Boots, Mercury Drug, cross-border iHerb), and halal availability (Indonesia’s Badan Penyelenggara Jaminan Produk Halal (BPJPH) and the Department of Islamic Development Malaysia (JAKIM)) noted per pick where known."
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
