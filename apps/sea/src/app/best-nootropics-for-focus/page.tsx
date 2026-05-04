import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsSEA, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://sea.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Best Nootropics for Focus ${CURRENT_YEAR}: SEA Buyer's Guide`,
  description:
    'Independent ranking of nootropics for focus available to buyers in Singapore, Malaysia, Thailand, Philippines, Indonesia, and Vietnam. Regulatory + halal notes per pick.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-focus/` },
  openGraph: {
    title: 'Best Nootropics for Focus in SEA — Evidence-Graded',
    description: 'Clinical-dose audit of every focus pick. Shopee, Lazada, Watsons, Guardian + cross-border iHerb routes confirmed.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
    evidence:
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue, with smoother subjective focus than caffeine alone. Effective at 100–200mg L-theanine + 100mg caffeine. Caffeine is easy to source across SEA from local coffee culture (kopi-O, Vietnamese drip, kape) — pair with a caffeine-free L-theanine product.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardized form most premium SEA imports use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'L-Tyrosine (or NALT)',
    evidence:
      'Precursor to dopamine + norepinephrine. Effective specifically under cognitive load or stress — improves performance on attention tasks during sleep deprivation, multitasking, or the heat/humidity stress common in tropical SEA work environments. Clinical doses 300–500mg as N-acetyl-L-tyrosine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Lutemax 2020 (Lutein + Zeaxanthin) — screen-eye focus',
    evidence:
      'Particularly relevant in SEA tech hubs (Singapore, KL, Bangkok, Manila, HCMC) where screen-heavy work is the norm. Clinical trials at 20mg show reduced digital eye strain and end-of-day cognitive fatigue. Not a classic "focus" ingredient — a screen-fatigue mitigator.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/29097913/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design lets you pair it with kopi, matcha, or Vietnamese drip for the synergistic effect. Ships UK→SEA in 7–14 days (fastest to Singapore). Imported as personal-use supplement — not registered with HSA, NPRA, BPOM, FDA TH/PH, or DAV. Halal status: not BPJPH/JAKIM-certified — verify acceptability for ID/MY buyers.',
  },
  {
    product: productsSEA.find(p => p.slug === 'noocube-review')!,
    rank: 2,
    whyItsHere:
      'Includes Lutemax 2020 at the clinical 20mg dose plus L-theanine 100mg — the most relevant focus formula for SEA screen-workers in Singapore, KL, Bangkok, and Manila tech roles. Alpha-GPC and Huperzine doses are below clinical anchors. UK→SEA shipping ~10–18 days. Personal-use import. Not halal-certified by JAKIM/BPJPH; capsules are typically gelatin (animal-derived) — confirm with vendor before MY/ID purchase.',
  },
  {
    product: productsSEA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground on capsule count (7+/day), $139/mo subscription, and a contains-caffeine formula (ID buyers in observance may prefer caffeine-free). US→SEA shipping 12–18 days. Indonesian and Thai buyers should watch customs thresholds given the high declared value.',
  },
  {
    product: productsSEA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free Classic version + NSF Certified for Sport (relevant for Singapore/Malaysian competitive athletes subject to anti-doping). Bacopa, Alpha-GPC, and L-theanine present but doses hidden in proprietary blends. Strong global brand recognition makes it easier to research locally in English and Bahasa. US→SEA shipping 12–18 days as personal-use supplement.',
  },
  {
    product: productsSEA.find(p => p.slug === 'natures-own-brain-fuel-review')!,
    rank: 5,
    whyItsHere:
      'TGA-AU registered (Sanofi-owned), the most accessible domestic option with no import risk for buyers who want to avoid customs altogether. Available on Shopee, Lazada, and at Watsons/Guardian/Unity pharmacies across SG, MY, TH, PH, ID. Ginkgo and Brahmi (Bacopa) are present but well below clinical doses — treat as a budget entry point or daily maintenance, not a premium focus stack. Halal status varies by SKU; check the local label.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Are these focus nootropics halal-certified?',
    a: 'None of the imported brands on this list (Mind Lab Pro, NooCube, Qualia Mind, Onnit Alpha Brain, Thesis) carry BPJPH (Indonesia) or JAKIM (Malaysia) halal certification. Capsules are typically gelatin-based (often bovine, occasionally porcine — vendor disclosure varies). Buyers in Indonesia and Malaysia who require halal certification should look at TGA-AU domestic options like Blackmores and Nature\'s Own (some SKUs are halal-certified — check the specific label) or Eu Yan Sang BrainMAX+ (TCM-based, vegetarian capsule). Always verify the current halal status on the product packaging or with the brand directly before purchase.',
  },
  {
    q: 'Which focus nootropics are best via Shopee/Lazada vs cross-border iHerb?',
    a: 'For Shopee/Lazada/TikTok Shop in SG/MY/TH/PH/ID: Blackmores Brain Active and Nature\'s Own Brain Fuel are the two TGA-AU brands with reliable local-marketplace supply (no customs risk, local-currency pricing). For cross-border ordering of premium imports (Mind Lab Pro, Qualia Mind, Alpha Brain), iHerb is currently the most reliable route with consolidated shipping into SG and MY warehouses; for Indonesia and Vietnam, ordering direct from the brand sites with DDP shipping (Mind Lab Pro / Opti-Nutra) avoids customs surprises. Singapore receives all routes the fastest (5–10 business days).',
  },
  {
    q: 'What is the most evidence-backed focus nootropic available in SEA?',
    a: 'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence — Owen et al. 2008 and multiple follow-ups. The cheapest path: any single-ingredient L-theanine capsule (widely available on Lazada/Shopee/iHerb under $10) paired with your local kopi or Vietnamese drip coffee. Citicoline at 250–500mg also has multiple RCTs and is best accessed in SEA via Mind Lab Pro (Cognizin form, 250mg).',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a same-day effect, look for L-theanine + caffeine; for compounded benefit over a study term or work quarter, plan for 8 weeks of consistent use.',
  },
  {
    q: 'Are focus nootropics safe to take daily in tropical SEA climates?',
    a: 'The ingredients on this page (L-theanine, citicoline, Alpha-GPC, L-tyrosine, Bacopa) are generally regarded as safe for healthy adults at the clinical doses listed. Tropical heat increases dehydration risk — caffeine-containing stacks (Qualia Mind, coffee-paired protocols) require extra water intake. Adults taking blood-pressure medication, stimulants, thyroid medication, or with bipolar diagnoses should consult a clinician — L-tyrosine in particular interacts with several drug classes.',
  },
  {
    q: 'What is the regulatory status of imported nootropics across SEA?',
    a: 'Singapore (HSA) and Malaysia (NPRA) have the most transparent personal-import frameworks for food supplements — typically a 1–3 month personal supply is permitted without registration. Thailand (FDA TH), Philippines (FDA PH), and Vietnam (DAV/VFA) allow personal imports but with stricter customs scrutiny. Indonesia (BPOM) is the most restrictive — formal registration is required for commercial sale and personal-import shipments above certain values may face customs holds. Always verify current rules with your national authority before ordering.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="focus"
      pageTitle="Best Nootropics for Focus in SEA"
      pageDescription="Independent ranking of nootropics for focus and attention available across Southeast Asia."
      heroParagraph="If you want to take a supplement to support focus across SEA — whether you're in a Singapore office, a KL co-working space, a Bangkok creative studio, a Manila call centre, or working remote from Bali — the question is not 'which brand?' but 'which ingredient at what dose, and how do I get it through customs?' This page ranks the products available to SEA buyers that contain at least one of the focus-validated ingredients (L-theanine + caffeine, citicoline, L-tyrosine, Lutemax 2020) at clinical dose. Regulatory status (HSA SG, NPRA MY, BPOM ID, FDA TH/PH, VFA VN) and halal availability (BPJPH, JAKIM) noted per pick where known."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      author={author}
    />
  );
}
