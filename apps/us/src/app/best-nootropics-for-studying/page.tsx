import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Studying ${CURRENT_YEAR}: Independent Picks for Students`,
  description:
    'Independent ranking of nootropics for sustained study sessions. Picks judged on focus + memory consolidation + safety profile for daily use.',
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-studying/' }),
  openGraph: {
    title: 'Best Nootropics for Studying — Evidence-Graded',
    description: 'Sustained focus + memory consolidation. What students should actually take, and what to avoid.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine — sustained focus',
    evidence:
      'For sustained study sessions, the L-theanine + caffeine combo is the foundation. Reduces caffeine jitter and post-coffee crash, smooths attention switching. 100–200mg L-theanine + 100mg caffeine, repeated 4–6 hours later if needed.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Bacopa Monnieri — long-term memory consolidation',
    evidence:
      'Critical for retention of studied material. Bacopa improves memory consolidation — what your brain does during sleep with material you studied that day. 300mg standardized to 50% bacosides daily for 8+ weeks. Start at the beginning of the term, not the night before the exam.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline — choline for cognitive demand',
    evidence:
      'Heavy cognitive demand depletes choline. Citicoline at 250–500mg/day supports phospholipid synthesis and acetylcholine availability — the neurotransmitter most associated with attention and learning. Cognizin is the standardized form.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'L-Tyrosine — under-stress performance',
    evidence:
      'Acute exam stress and sleep deprivation deplete catecholamines. Tyrosine supplementation has documented benefit for cognitive performance specifically under stress, sleep loss, or cold. 300–500mg as NALT for short bursts; not for daily continuous use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source you use during study sessions (coffee, matcha, energy drinks). Includes L-theanine, Bacopa, citicoline, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. Take daily through the term for cumulative Bacopa effect.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Most complete study stack: includes everything in Mind Lab Pro plus Alpha-GPC, Rhodiola, and choline-supporting cofactors. The 7+ capsules/day is friction during finals week; the $139/mo subscription is friction for student budgets.',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 3,
    whyItsHere:
      'Caffeine-free Classic version is widely available — useful when you need a study supplement on short notice. Bacopa + L-theanine + Alpha-GPC are present but proprietary blends prevent verifying clinical doses.',
  },
  {
    product: productsUS.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 4,
    whyItsHere:
      'Personalization may suit students with specific patterns (e.g., the "Clarity" formula for focus or "Logic" for analytical work). Subscription model with monthly cost can add up over a semester.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa and citicoline (memory consolidation), start at the beginning of the term — they need 4–8 weeks of daily use to show effect. The night before the exam is too late for Bacopa.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have.',
  },
  {
    q: 'Are these safe for college students?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults. Students taking ADHD medication, antidepressants, or with bipolar diagnoses should consult their prescribing clinician before starting any of these — particularly L-tyrosine and Bacopa, which can interact with several medication classes.',
  },
  {
    q: 'Should I take Adderall instead?',
    a: 'Adderall is prescription-only for ADHD or narcolepsy. Using diverted Adderall (someone else\'s prescription) is illegal in the US and elsewhere, and is associated with cardiovascular and dependence risks. If you suspect you have ADHD, see a campus health clinician for evaluation. Nootropic supplements are not equivalent to Adderall and should not be marketed as such.',
  },
  {
    q: 'How does sleep interact with study supplements?',
    a: 'Sleep is when memory consolidation actually happens. No supplement compensates for chronic sleep deprivation. If you are pulling all-nighters regularly, optimize sleep first; supplements are second-order. L-tyrosine has documented benefit specifically for cognitive performance during acute sleep loss but should not be used as a license to skip sleep.',
  },
  {
    q: 'Is caffeine alone enough for studying?',
    a: 'For most students, caffeine + L-theanine (1:2 ratio) is the most cost-effective focus stack — and the most-evidence-backed. The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline) on top, which compounds for actual retention of studied material over the term.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="studying"
      pageTitle="Best Nootropics for Studying"
      pageDescription="Independent ranking of nootropics for sustained study sessions. Focus + memory consolidation + safety for daily use."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack covers both — acute-effect focus ingredients (L-theanine + caffeine) plus daily-use memory ingredients (Bacopa, citicoline). This page ranks the products that include both."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'FDA framework for nootropic supplements', href: '/are-nootropics-fda-approved/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
