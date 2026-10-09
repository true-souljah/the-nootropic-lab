import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsJP, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus in Japan ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for focus and attention available in Japan. Each pick must contain a clinically-dosed focus ingredient (L-theanine + caffeine, citicoline, or L-tyrosine). Includes both imported international stacks and domestic FFC (機能性表示食品) brands.',
  alternates: buildAlternates({ regionCode: 'jp', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus in Japan — Evidence-Graded Picks',
    description: 'Clinical-dose audit of every focus pick available in Japan. Imported stacks plus domestic FFC-notified brands.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
    evidence:
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue, with smoother subjective focus than caffeine alone. Effective at 100–200mg L-theanine + 100mg caffeine — the same pairing naturally found in matcha (抹茶), familiar to Japanese consumers.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardized form most international products use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'L-Tyrosine (or NALT)',
    evidence:
      'Precursor to dopamine + norepinephrine. Effective specifically under cognitive load or stress — improves performance on attention tasks during sleep deprivation, multitasking, or cold exposure. Clinical doses 300–500mg as N-acetyl-L-tyrosine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Alpha-GPC',
    evidence:
      'Cholinergic. In a 2024 placebo-controlled crossover RCT in 20 resistance-trained men, a single 315mg or 630mg dose improved Stroop test performance, with no effect on N-Back or Flanker tasks — one small, acute study. Often paired with L-theanine for "calm focus."',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/39683633/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsJP.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design pairs naturally with your morning coffee or matcha for the synergistic effect. Ships from the UK to Japan in 5–20 working days by tracked airmail or 2–7 working days by DHL courier (per mindlabpro.com, checked 2026-09-29), at approximately ¥10,350/month equivalent. The most evidence-backed focus stack available to Japanese buyers.',
  },
  {
    product: productsJP.find(p => p.slug === 'hunter-focus-review')!,
    rank: 2,
    whyItsHere:
      'High-dose stack with 100mg caffeine + 200mg L-theanine in the classic 1:2 ratio for clean stimulated focus, plus 250mg citicoline and 500mg Lion\'s Mane. Note: contains caffeine and the label is in English only — Japanese buyers sensitive to stimulants should pick a caffeine-free option above. 6 capsules/day is a heavy pill burden.',
  },
  {
    product: productsJP.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Caffeine-free stack containing choline (VitaCholine, 250mg), L-tyrosine, and L-theanine at 100mg (clinical dose). L-tyrosine at 250mg is below its clinical anchor. 60-day money-back guarantee — the longest in this Japan review. One-time purchase (no subscription); confirm Japan shipping at checkout. The brand does not publish a delivery estimate for this country; check the estimate at checkout.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Are any of these focus nootropics notified under Japan\'s FFC (機能性表示食品) system?',
    a: 'For the international stacks above (Mind Lab Pro, Hunter Focus, NooCube), no Foods with Function Claims (FFC) notification was found under the product or company name in the Consumer Affairs Agency (CAA, 消費者庁) database (export scanned 2026-10-06). They are bought under the personal-import route. Domestic options like FANCL BRAINs (FFC-notified, G425) and Suntory DHA & EPA + Sesamin EX (no FFC notification found, CAA export scanned 2026-10-06) target memory and brain health rather than acute focus, and are covered on our memory and aging pages.',
  },
  {
    q: 'What is the most evidence-backed nootropic for focus available in Japan?',
    a: 'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence in healthy adults — Owen et al. 2008 and multiple follow-ups. This is the same pairing naturally present in matcha. Citicoline at 250–500mg also has multiple RCTs and is the headline ingredient in our top pick (Mind Lab Pro).',
  },
  {
    q: 'Where can I buy these in Japan?',
    a: 'Mind Lab Pro\'s own FAQ names Japan among its shipping territories; for the other imported brands, confirm Japan shipping and the delivery estimate at checkout. The domestic brands FANCL and Suntory are covered on our memory and aging pages, where both score below our bar for ranked picks.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a same-day effect, look for L-theanine + caffeine; for compounded benefit, plan for 8 weeks of consistent use.',
  },
  {
    q: 'Are focus nootropics safe to take daily?',
    a: 'The ingredients on this page (L-theanine, citicoline, Alpha-GPC, L-tyrosine, Bacopa) are generally regarded as safe for healthy adults at the clinical doses listed. People taking blood-pressure medication, stimulants, thyroid medication, or with bipolar diagnoses should consult a clinician. In Japan, consult your kakaritsuke-i (かかりつけ医) — particularly if you take prescription medication.',
  },
  {
    q: 'Will I have customs issues importing these to Japan?',
    a: 'Japan permits personal-use imports of supplements within MHLW (厚生労働省) guidelines — generally up to a 2-month supply per order, value under approximately ¥16,000. All the picks above are formulated within MHLW-permissible ingredient categories. Modafinil and prescription stimulants are not permitted via personal import.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus in Japan"
      pageDescription="Independent ranking of the best nootropics for focus and attention available in Japan. Each pick must contain a clinically-dosed focus ingredient."
      heroParagraph="If you want to take a supplement to support focus in Japan, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products available to Japanese buyers — imported international stacks bought under Ministry of Health, Labour and Welfare (MHLW) personal-import rules — that contain at least one focus-validated ingredient (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at clinical dose. Domestic brands (FFC-notified FANCL BRAINs, plus Suntory) target memory and brain health rather than acute focus and appear on our memory page."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'FFC-notified cognitive supplements in Japan', href: '/ffc-notified-cognitive-supplements/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('jp')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
