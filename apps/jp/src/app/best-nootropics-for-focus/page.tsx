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
    'Independent ranking of the best nootropics for focus and attention available in Japan. Each pick must contain a clinically-dosed focus ingredient (L-theanine + caffeine, citicoline, or L-tyrosine). Includes both international stacks shipping to Japan and domestic FFC (機能性表示食品) brands.',
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
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardized form most international products use. Not currently a notified FFC ingredient in Japan.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
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
      'Cholinergic — acute focus and reaction-time benefits in human RCTs at 300–600mg, with stronger effect than choline bitartrate. Often paired with L-theanine for "calm focus."',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18834505/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsJP.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design pairs naturally with your morning coffee or matcha for the synergistic effect. Ships from the UK or US to Japan in 7–14 days at approximately ¥10,350/month equivalent. The most evidence-backed focus stack available to Japanese buyers.',
  },
  {
    product: productsJP.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Minimalist 4-ingredient stack centered on 250mg Cognizin citicoline plus 100mg Sharp-PS phosphatidylserine — both at clinical dose. Caffeine-free, only 2 capsules per serving (lowest pill burden in this Japan review). Ships from the UK in 10–14 days. Best for buyers who want premium patented ingredients without the broad multi-ingredient blends.',
  },
  {
    product: productsJP.find(p => p.slug === 'hunter-focus-review')!,
    rank: 3,
    whyItsHere:
      'High-dose stack with 100mg caffeine + 200mg L-theanine in the classic 1:2 ratio for clean stimulated focus, plus 250mg citicoline and 500mg Lion\'s Mane. Note: contains caffeine and the label is in English only — Japanese buyers sensitive to stimulants should pick a caffeine-free option above. 6 capsules/day is a heavy pill burden.',
  },
  {
    product: productsJP.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free stack containing Alpha-GPC, L-tyrosine, and L-theanine at 100mg (clinical dose). Some ingredients (Alpha-GPC at 50mg, L-tyrosine at 250mg) are below clinical anchors. 60-day money-back guarantee — the longest in this Japan review. Ships internationally in 10–14 days with one-time purchase (no subscription).',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Are any of these focus nootropics notified under Japan\'s FFC (機能性表示食品) system?',
    a: 'No — the international stacks above (Mind Lab Pro, Performance Lab Mind, Hunter Focus, NooCube) are not notified under Japan\'s Food with Function Claims framework administered by the Consumer Affairs Agency (消費者庁). They ship under the personal-import route. Domestic FFC-notified options like FANCL BRAINs and Suntory DHA & EPA + Sesamin EX target memory and brain health rather than acute focus, and are covered on our memory and aging pages.',
  },
  {
    q: 'What is the most evidence-backed nootropic for focus available in Japan?',
    a: 'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence in healthy adults — Owen et al. 2008 and multiple follow-ups. This is the same pairing naturally present in matcha. Citicoline at 250–500mg also has multiple RCTs and is the headline ingredient in our top two picks (Mind Lab Pro and Performance Lab Mind).',
  },
  {
    q: 'Where can I buy these in Japan?',
    a: 'All four picks above ship directly from the UK or US to Japan via the manufacturer website — typically 7–14 business days. None are stocked in Matsumoto Kiyoshi (マツモトキヨシ), Welcia (ウエルシア), or Sundrug (サンドラッグ) pharmacy chains, which carry only domestic FFC-notified supplements. For pharmacy-shelf options, see our memory and aging pages featuring FANCL and Suntory.',
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
    a: 'Japan permits personal-use imports of supplements within MHLW (厚生労働省) guidelines — generally up to a 2-month supply per order, value under approximately ¥16,000. All four picks above are formulated within MHLW-permissible ingredient categories. Modafinil and prescription stimulants are not permitted via personal import.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus in Japan"
      pageDescription="Independent ranking of the best nootropics for focus and attention available in Japan. Each pick must contain a clinically-dosed focus ingredient."
      heroParagraph="If you want to take a supplement to support focus in Japan, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products available to Japanese buyers — international stacks shipping under Ministry of Health, Labour and Welfare (MHLW) personal-import rules — that contain at least one focus-validated ingredient (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at clinical dose. Domestic FFC-notified brands (FANCL, Suntory) target memory and brain health rather than acute focus and appear on our memory page."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('jp')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
