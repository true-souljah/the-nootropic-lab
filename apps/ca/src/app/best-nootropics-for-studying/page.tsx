import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Studying in Canada ${CURRENT_YEAR}: Independent Picks for Students`,
  description:
    'Independent ranking of nootropics for sustained study sessions, available to Canadian university and college students. Picks judged on focus + memory consolidation + safety profile for daily use.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/best-nootropics-for-studying/' }),
  openGraph: {
    title: 'Best Nootropics for Studying in Canada — Evidence-Graded',
    description: 'Sustained focus + memory consolidation. What Canadian students should actually take, and what to avoid.',
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
    product: productsCA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source Canadian students use during study sessions (Tim Hortons, matcha, energy drinks). Includes L-theanine, Bacopa, citicoline, Lion\'s Mane, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. Take daily through the term for cumulative Bacopa effect. Ships UK→Canada in 7–14 business days.',
  },
  {
    product: productsCA.find(p => p.slug === 'hunter-focus-review')!,
    rank: 2,
    whyItsHere:
      'Pre-built caffeine + L-theanine 1:2 stack (100mg caffeine + 200mg L-theanine) means no need to time your coffee around dosing. 250mg citicoline + 500mg Lion\'s Mane support attention and long-term neuroplasticity. Pricier (~CAD $123/mo) and a 6-capsule daily regimen — best for graduate students or working professionals studying part-time.',
  },
  {
    product: productsCA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Most complete study stack: includes Bacopa at full clinical dose plus Alpha-GPC, Rhodiola, choline cofactors, and 90mg caffeine per serving. The 7+ capsules/day is friction during finals week; the CAD $190/mo subscription is friction for student budgets — but for serious test prep over a full semester, the breadth of mechanism coverage is unmatched.',
  },
  {
    product: productsCA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free Classic version is occasionally available at GNC Canada and consistently on Amazon.ca — useful when Canadian students need a study supplement on short notice without waiting for international shipping. Bacopa + L-theanine + Alpha-GPC are present but proprietary blends prevent verifying clinical doses.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa and citicoline (memory consolidation), start at the beginning of the term — they need 4–8 weeks of daily use to show effect. The night before a UofT, McGill, or UBC final is too late for Bacopa.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have.',
  },
  {
    q: 'Are these safe for Canadian college and university students?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults. Students taking ADHD medication (Vyvanse, Concerta, Adderall — all prescription-only in Canada), antidepressants, or with bipolar diagnoses should consult their family doctor or campus clinic before starting any of these — particularly L-tyrosine and Bacopa, which can interact with several medication classes.',
  },
  {
    q: 'Should I take prescription stimulants instead?',
    a: 'Prescription stimulants (Adderall, Vyvanse, Concerta) are Schedule III controlled drugs in Canada and require a physician\'s prescription for ADHD or narcolepsy diagnosis. Using a friend\'s prescription is illegal under the Controlled Drugs and Substances Act and is associated with cardiovascular and dependence risks. If you suspect you have ADHD, see your campus health clinic or family doctor for evaluation. Nootropic supplements are not equivalent to prescription stimulants.',
  },
  {
    q: 'How does sleep interact with study supplements?',
    a: 'Sleep is when memory consolidation actually happens. No supplement compensates for chronic sleep deprivation. If you are pulling all-nighters regularly, optimize sleep first; supplements are second-order. L-tyrosine has documented benefit specifically for cognitive performance during acute sleep loss but should not be used as a license to skip sleep.',
  },
  {
    q: 'Is caffeine alone enough for studying?',
    a: 'For most Canadian students, caffeine + L-theanine (1:2 ratio) is the most cost-effective focus stack — and the most-evidence-backed. You can DIY this with a coffee + a $10 bottle of L-theanine from Amazon.ca. The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline) on top, which compounds for actual retention of studied material over the term.',
  },
  {
    q: 'Where can students buy these in Canada — Shoppers, Costco, or online?',
    a: 'Mind Lab Pro, Hunter Focus, and Qualia Mind are direct-to-consumer only (international shipping to Canadian addresses). Onnit Alpha Brain is sometimes available at GNC Canada and reliably on Amazon.ca. Single-ingredient supplements (L-theanine, Bacopa, Lion\'s Mane) are widely available at Canadian retail — Shoppers Drug Mart, Rexall, and Costco all carry them, generally with NPN-registered Canadian brands.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="studying"
      pageTitle="Best Nootropics for Studying in Canada"
      pageDescription="Independent ranking of nootropics for sustained study sessions, available to Canadian students. Focus + memory consolidation + safety for daily use."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack covers both — acute-effect focus ingredients (L-theanine + caffeine) plus daily-use memory ingredients (Bacopa, citicoline). This page ranks the products available to Canadian buyers that include both."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
