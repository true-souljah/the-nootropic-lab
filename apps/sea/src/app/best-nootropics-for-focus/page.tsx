import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsSEA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus ${CURRENT_YEAR}: SEA Buyer's Guide`,
  description:
    'Independent ranking of nootropics for focus available to buyers in Singapore, Malaysia, Thailand, Philippines, Indonesia, and Vietnam. Regulatory + halal notes per pick.',
  alternates: buildAlternates({ regionCode: 'sea', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus in SEA — Evidence-Graded',
    description: 'Clinical-dose audit of every focus pick. Shopee, Lazada, Watsons, Guardian + cross-border iHerb routes confirmed.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
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
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
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
      'Particularly relevant in SEA tech hubs (Singapore, KL, Bangkok, Manila, HCMC) where screen-heavy work is the norm, but the screen-use evidence is mixed. In a 6-month trial in 48 heavy screen users funded by Lutemax\'s maker (Stringham 2017), 24mg/day of the Lutemax 2020 formulation reduced self-rated eye strain, eye fatigue and headache and improved sleep versus placebo. In a 6-month RCT in 70 adults using screens more than 6 hours a day (Lopresti & Smith 2025), 10mg lutein + 2mg zeaxanthin isomers (Lute-gen, not Lutemax 2020) improved tear production, tear-film stability and glare (photo-stress) recovery versus placebo, but self-rated visual fatigue, sleep and attention did not differ from placebo. Neither trial found a focus or attention benefit (Stringham 2017 did not measure attention): an eye-health ingredient, not a focus one.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/39963662/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsSEA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design lets you pair it with kopi, matcha, or Vietnamese drip for the synergistic effect. mindlabpro.com names Singapore, Thailand, the Philippines, Indonesia and Vietnam among its shipping territories (its FAQ, checked 2026-09-29); Malaysia is not named on that partial list, so confirm at checkout. Imported as personal-use supplement — we have not verified a local product registration with the National Pharmaceutical Regulatory Agency (NPRA) in Malaysia, the Thai FDA, FDA Philippines, the Badan Pengawas Obat dan Makanan (BPOM) in Indonesia or the Vietnam Food Administration (VFA). Halal: no halal certificate shown on the brand\'s pages we fetched (checked 2026-10-07); the brand states pullulan (NutriCaps) capsules — verify acceptability for ID/MY buyers.',
  },
  {
    product: productsSEA.find(p => p.slug === 'noocube-review')!,
    rank: 2,
    whyItsHere:
      'Includes Lutemax 2020 (20mg) plus L-theanine 100mg; the lutein/zeaxanthin evidence is for eye comfort in heavy screen users, not attention, so its focus case rests on the theanine and the rest of the formula. The current formula uses choline from VitaCholine and no longer contains Alpha-GPC or Huperzine A; Bacopa is below its clinical anchor. noocube.com ships to Singapore, Malaysia, Thailand and the Philippines; it does not list Indonesia or Vietnam. noocube.com does not publish delivery times for these countries; check the estimate at checkout. Personal-use import. Halal: no halal certificate shown on the brand\'s pages we fetched (checked 2026-10-07); the brand says the product is suitable for vegetarians but does not state the capsule shell material — confirm with the vendor before MY/ID purchase.',
  },
  {
    product: productsSEA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground on capsule count (6/day), $139/mo subscription, and a contains-caffeine formula (ID buyers in observance may prefer caffeine-free). Availability caveat: Qualia does not ship to any SEA country (brand shipping page, checked 2026-09-28), so SEA buyers cannot order it direct.',
  },
  {
    product: productsSEA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free Classic version + National Sanitation Foundation (NSF) Certified for Sport (relevant for Singapore/Malaysian competitive athletes subject to anti-doping). Bacopa, Alpha-GPC, and L-theanine present but doses hidden in proprietary blends. Strong global brand recognition makes it easier to research locally in English and Bahasa. Ships from the US as a personal-use supplement; no published SEA delivery estimate.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Are these focus nootropics halal-certified?',
    a: 'None of the imported brands on this page (Mind Lab Pro, NooCube, Qualia Mind, Onnit Alpha Brain) shows a BPJPH (Indonesia), JAKIM (Malaysia) or other halal certificate on the brand\'s pages we fetched (checked 2026-10-07). On capsules, the brands state: Mind Lab Pro uses pullulan (NutriCaps) capsules and is suitable for vegans; Qualia Mind uses vegetarian capsules (hypromellose); NooCube says it is suitable for vegetarians and Alpha Brain that it is vegetarian but not vegan, but neither states the capsule shell material. For buyers in Indonesia and Malaysia who require halal certification: Blackmores (Malaysia) Sdn Bhd holds JAKIM halal certificates for 37 products — none named as a cognitive or nootropic product, and Brain Active is not among them; all expire 30 November 2026 (MYeHALAL directory, checked 2026-10-08). Eu Yan Sang BrainMAX+ is sold as 3 g sachets, so there is no capsule shell, but its product page has no halal text and it is not among the 77 items in Eu Yan Sang Singapore\'s Halal Certified category (checked 2026-10-07); Eu Yan Sang (Singapore) Pte Ltd holds JAKIM certificates for 25 other products, including three ginkgo items, but not BrainMAX+ (MYeHALAL, checked 2026-10-08). Always verify the current halal status on the product packaging or with the brand directly before purchase.',
  },
  {
    q: 'Which focus nootropics are best via Shopee/Lazada vs cross-border iHerb?',
    a: 'For Shopee/Lazada/TikTok Shop in SG/MY/TH/PH/ID: Alpha Brain has a live Lazada Singapore listing (checked 2026-09-28), but it scores below our bar for ranked picks (listed under Also considered above). For cross-border ordering of premium imports (Mind Lab Pro, Alpha Brain), iHerb is currently the most reliable route with consolidated shipping into SG and MY warehouses. Direct from Mind Lab Pro: the brand\'s FAQ names Singapore, Thailand, the Philippines, Indonesia and Vietnam among its shipping territories (checked 2026-09-29), with rest-of-world orders shipped from its UK depot. Qualia Mind does not ship to any SEA country (brand shipping page, checked 2026-09-28).',
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
    a: 'Imported supplements are regulated nationally: by the Health Sciences Authority (HSA) in Singapore, the National Pharmaceutical Regulatory Agency (NPRA) in Malaysia, the Thai Food and Drug Administration (Thai FDA), the Food and Drug Administration of the Philippines (FDA Philippines), the Badan Pengawas Obat dan Makanan (BPOM) in Indonesia and the Vietnam Food Administration (VFA, Cục An toàn thực phẩm) under Vietnam’s Ministry of Health. Malaysia’s NPRA says its registration requirements do not apply to products a traveller brings in personal luggage for their own or their family’s use, in a quantity not exceeding one month’s use by one person; rules for posted parcels, and for the other countries, were not confirmed from an official page in our 2026-10-05 check, so confirm with your national authority or customs before ordering. Import duties and customs clearance are the buyer’s responsibility.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus in SEA"
      pageDescription="Independent ranking of nootropics for focus and attention available across Southeast Asia."
      heroParagraph="If you want to take a supplement to support focus across SEA — whether you're in a Singapore office, a KL co-working space, a Bangkok creative studio, a Manila call centre, or working remote from Bali — the question is not 'which brand?' but 'which ingredient at what dose, and how do I get it through customs?' This page ranks the products available to SEA buyers that contain at least one of the focus-validated ingredients (L-theanine + caffeine, citicoline, L-tyrosine, Lutemax 2020) at clinical dose. Regulatory status (Singapore’s Health Sciences Authority (HSA), Malaysia’s National Pharmaceutical Regulatory Agency (NPRA), Indonesia’s Badan Pengawas Obat dan Makanan (BPOM), and the Thai and Philippine Food and Drug Administrations (FDA)) and halal availability (Indonesia’s Badan Penyelenggara Jaminan Produk Halal (BPJPH) and the Department of Islamic Development Malaysia (JAKIM)) noted per pick where known."
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
