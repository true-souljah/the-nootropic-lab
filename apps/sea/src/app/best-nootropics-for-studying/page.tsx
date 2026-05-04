import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsSEA } from '@nootropic/data';

const SITE_URL = 'https://sea.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Studying ${CURRENT_YEAR}: SEA Student Guide`,
  description:
    'Independent ranking of nootropics for SEA students — NUS, NTU, UM, UI, Chula, Mahidol, UP. Sustained focus + memory consolidation, halal + import notes per pick.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-studying/` },
  openGraph: {
    title: 'Best Nootropics for Studying in SEA — Evidence-Graded',
    description: 'Sustained focus + memory consolidation for SEA students. What works, what to avoid, and how to actually get it.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine — sustained focus',
    evidence:
      'For sustained study sessions, the L-theanine + caffeine combo is the foundation. Reduces caffeine jitter and post-coffee crash, smooths attention switching. 100–200mg L-theanine + 100mg caffeine, repeated 4–6 hours later if needed. Caffeine is trivially available across SEA from kopi-O (Singapore/Malaysia), cà phê sữa đá (Vietnam), kopi tubruk (Indonesia), or kape (Philippines).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Bacopa Monnieri (Brahmi) — long-term memory consolidation',
    evidence:
      'Critical for retention of studied material. Bacopa improves memory consolidation — what your brain does during sleep with material you studied that day. 300mg standardized to 50% bacosides daily for 8+ weeks. Start at the beginning of the semester — for NUS/NTU buyers in week 1, not week 12 before finals. Widely sold across SEA under "Brahmi" branding.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline — choline for cognitive demand',
    evidence:
      'Heavy cognitive demand depletes choline. Citicoline at 250–500mg/day supports phospholipid synthesis and acetylcholine availability — the neurotransmitter most associated with attention and learning. Cognizin is the standardized form most premium imports use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'L-Tyrosine — under-stress performance',
    evidence:
      'Acute exam stress, sleep deprivation (a SEA student staple during finals weeks), and tropical heat all deplete catecholamines. Tyrosine supplementation has documented benefit for cognitive performance specifically under stress, sleep loss, or heat exposure. 300–500mg as NALT for short bursts during exam periods; not for daily continuous use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source you use during study sessions (kopi, matcha, RTD coffee from 7-Eleven, energy drinks). Includes L-theanine, Bacopa, citicoline, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. Take daily through the semester for cumulative Bacopa effect. UK→SEA shipping 7–14 days. Singapore is fastest. Personal-use import. At USD $69/mo it stretches student budgets — split across 2 months by taking every other day if cost-constrained.',
  },
  {
    product: productsSEA.find(p => p.slug === 'noocube-review')!,
    rank: 2,
    whyItsHere:
      'Lutemax 2020 at clinical 20mg specifically reduces digital eye strain — directly relevant for SEA students doing 6+ hour Zoom lectures, online tutorials, and screen-heavy revision. L-theanine 100mg present for calm focus. Bacopa and Alpha-GPC are present but underdosed. UK→SEA shipping ~10–18 days. At USD $59/mo it is the most cost-conscious premium import option for students.',
  },
  {
    product: productsSEA.find(p => p.slug === 'eu-yan-sang-brainmax-review')!,
    rank: 3,
    whyItsHere:
      'For SG/MY students who want a domestic option from a trusted heritage brand: Cera-Q silk fibroin protein (clinically studied for memory and learning) at 200mg full clinical dose, plus TCM-traditional Goji Berry and Wild Ginseng. Walk into any Eu Yan Sang store on campus or in your local mall. Powder sachet format is convenient for hostel and library use. Vegetarian capsules. Same-day delivery in Singapore.',
  },
  {
    product: productsSEA.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 4,
    whyItsHere:
      'The cheapest legitimate brain supplement in this list at ~SGD $7/month (~$5 USD) for a 5-month supply via Amazon.sg. Ginkgo Biloba at full clinical dose (120mg). Ginseng underdosed. The right pick for first-year university students testing whether nootropics do anything for them before committing to a premium stack. 60-day money-back guarantee.',
  },
  {
    product: productsSEA.find(p => p.slug === 'natures-own-brain-fuel-review')!,
    rank: 5,
    whyItsHere:
      'TGA-AU registered, available on Lazada and Shopee plus brick-and-mortar Watsons/Guardian/Unity pharmacies across SEA. Includes iron — useful for SEA student populations where dietary iron deficiency is common, particularly women. ~SGD $24/mo. Ginkgo and Brahmi doses are below clinical anchors but the combination of low cost, no customs risk, and pharmacy-accessibility makes it a sensible everyday option for sustained-use students.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Are these student-friendly nootropics halal-certified?',
    a: 'For Muslim students in Indonesia, Malaysia, southern Thailand, southern Philippines, and Brunei: imported brands (Mind Lab Pro, NooCube, Qualia Mind, Onnit Alpha Brain) do not carry BPJPH or JAKIM halal certification — gelatin capsules are typically animal-derived without halal disclosure. Halal-friendlier options: some Blackmores SKUs carry JAKIM certification (verify the specific product), Eu Yan Sang BrainMAX+ uses vegetarian capsules (not halal-certified but no porcine concern), and single-ingredient L-theanine or Brahmi from Halal-certified local brands on Lazada/Shopee. Check verify.halal.gov.my (Malaysia) or halal.go.id (Indonesia) for current status before ordering.',
  },
  {
    q: 'Which are best for SEA students via Shopee/Lazada vs cross-border iHerb?',
    a: 'For students on a budget who want to avoid customs and credit-card cross-border fees: Nature\'s Own Brain Fuel and Blackmores Brain Active on Lazada/Shopee (both Watsons/Guardian-stocked, local-currency), plus NatureBell Ginkgo+Ginseng on Amazon.sg (~SGD $7/mo). For premium stacks: cross-border iHerb to Singapore is the most reliable route for Mind Lab Pro, NooCube, and Nootropics Depot products — typical delivery 5–10 days into SG, slightly longer to other capitals. Direct-from-brand (Opti-Nutra DDP shipping) eliminates customs surprises but takes 10–14 days.',
  },
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa/Brahmi and citicoline (memory consolidation), start at the beginning of the semester — they need 4–8 weeks of daily use to show effect. Mugging the night before NUS finals week is too late for Bacopa. Plan ahead.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have. They do not replace good sleep, nutrition, or actual study time.',
  },
  {
    q: 'Are these safe for university students in SEA?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults. Students taking ADHD medication, antidepressants, or with bipolar diagnoses should consult their prescribing clinician before starting any of these — particularly L-tyrosine and Bacopa, which can interact with several medication classes. SEA-specific note: prescription stimulants (modafinil, methylphenidate) are tightly controlled across the region — Singapore (HSA Class 3) and Malaysia (Poisons Act) require valid local prescriptions. Do not import or share controlled stimulants — penalties are severe.',
  },
  {
    q: 'How does sleep interact with study supplements in tropical climates?',
    a: 'Sleep is when memory consolidation actually happens. No supplement compensates for chronic sleep deprivation. Heat and humidity in tropical SEA make sleep quality harder — air conditioning, blackout curtains, and 22–24°C bedrooms matter more than any supplement. If you are pulling all-nighters regularly, optimise sleep first; supplements are second-order. L-tyrosine has documented benefit for cognitive performance during acute sleep loss but should not be used as a license to skip sleep.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="studying"
      pageTitle="Best Nootropics for Studying in SEA"
      pageDescription="Independent ranking of nootropics for sustained study sessions across Southeast Asia. Focus + memory consolidation + safety for daily use."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack covers both — acute-effect focus ingredients (L-theanine + caffeine) plus daily-use memory ingredients (Bacopa/Brahmi, citicoline). This page ranks the products available to SEA students that include both, with notes on price (rupiah, ringgit, baht, peso, dong), distribution (Shopee, Lazada, TikTok Shop, Watsons, Guardian, Unity, Boots, Mercury Drug, cross-border iHerb), regulatory import status (HSA SG, NPRA MY, BPOM ID, FDA TH/PH, VFA VN), and halal certification (BPJPH, JAKIM) where known."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
    />
  );
}
