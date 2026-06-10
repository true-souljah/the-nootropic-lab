import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Studying ${CURRENT_YEAR} (EU): Independent Picks for European Students`,
  description:
    'Independent EU ranking of nootropics for sustained study sessions. EUR pricing, EU storefronts, EFSA-compliant ingredients. Picks judged on focus + memory consolidation + safety for daily use.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/best-nootropics-for-studying/' }),
  openGraph: {
    title: 'Best Nootropics for Studying (EU) — Evidence-Graded',
    description: 'Sustained focus + memory consolidation. What European students should actually take.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine — sustained focus',
    evidence:
      'For sustained study sessions, the L-theanine + caffeine combo is the foundation. Reduces caffeine jitter and post-coffee crash, smooths attention switching. 100–200mg L-theanine + 75–100mg caffeine, repeated 4–6 hours later if needed. EFSA has authorised the alertness/attention claim for caffeine at ≥75mg per serving.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Bacopa Monnieri — long-term memory consolidation',
    evidence:
      'Critical for retention of studied material. Bacopa improves memory consolidation — what your brain does during sleep with material you studied that day. 300mg standardised to 50% bacosides daily for 8+ weeks. Start at the beginning of the term, not the night before the exam.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline — choline for cognitive demand',
    evidence:
      'Heavy cognitive demand depletes choline. Citicoline at 250–500mg/day supports phospholipid synthesis and acetylcholine availability — the neurotransmitter most associated with attention and learning. Cognizin is the standardised form. Authorised in the EU under Novel Food Regulation (EU) 2015/2283.',
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
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source you use during study sessions (coffee, espresso, matcha). Includes L-theanine, Bacopa, citicoline, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. EU distribution centre + EUR pricing (€65/mo). Take daily through the term for cumulative Bacopa effect.',
  },
  {
    product: productsEU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Citicoline (250mg) + L-Tyrosine (300mg NALT) at clinical doses, plus Lion\'s Mane and Phosphatidylserine. Only 2 capsules/day — the lowest pill burden in this list, useful during finals when you forget everything. €55/mo with EUR pricing. No Bacopa, so stack with one for full memory-consolidation coverage.',
  },
  {
    product: productsEU.find(p => p.slug === 'brainzyme-focus-pro-review')!,
    rank: 3,
    whyItsHere:
      'UK-made and explicitly positioned for university students. Natural caffeine from matcha + guarana paired with 100mg L-theanine — smooth study-session focus without the synthetic-caffeine crash. €40/mo is the lowest price on this list. Lacks long-term memory ingredients (no Bacopa or Lion\'s Mane), so best for acute study sessions rather than term-long retention.',
  },
  {
    product: productsEU.find(p => p.slug === 'braineffect-focus-review')!,
    rank: 4,
    whyItsHere:
      'German-made with 80mg caffeine (above the EFSA 75mg alertness-claim threshold), Panax Ginseng, Ginkgo Biloba, and Bacopa (200mg, under the clinical anchor). Strong DACH-region pick with next-day delivery from Berlin. Only 14-day money-back, so try a single box first.',
  },
  {
    product: productsEU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 5,
    whyItsHere:
      'The most complete study stack in EU coverage: Lion\'s Mane, Bacopa, Phosphatidylserine, Ashwagandha (stress resilience for exam season), ALCAR, plus 100mg caffeine. €85/mo and 6 capsules/day are significant friction — pick this if you want maximum ingredient breadth and can absorb the cost and pill burden.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa and citicoline (memory consolidation), start at the beginning of the term — they need 4–8 weeks of daily use to show effect. The night before the exam is too late for Bacopa.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have. EU labels avoid this kind of claim because it would not pass EFSA review.',
  },
  {
    q: 'Are these safe for university students in the EU?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults. Students taking ADHD medication (methylphenidate, lisdexamfetamine), antidepressants, or with bipolar diagnoses should consult their prescribing clinician before starting any of these — particularly L-tyrosine, Ginkgo, and Bacopa, which can interact with several medication classes.',
  },
  {
    q: 'Should I take methylphenidate (Ritalin/Concerta) instead?',
    a: 'Methylphenidate is prescription-only for ADHD across the EU. Using diverted prescription stimulants (someone else\'s prescription) is illegal in every EU member state and is associated with cardiovascular and dependence risks. If you suspect you have ADHD, see a GP for evaluation and referral to a psychiatrist. Nootropic supplements are not equivalent to methylphenidate and EU brands cannot legally market them as such.',
  },
  {
    q: 'How does sleep interact with study supplements?',
    a: 'Sleep is when memory consolidation actually happens. No supplement compensates for chronic sleep deprivation. If you are pulling all-nighters regularly, optimise sleep first; supplements are second-order. L-tyrosine has documented benefit specifically for cognitive performance during acute sleep loss but should not be used as a license to skip sleep.',
  },
  {
    q: 'Is caffeine alone enough for studying?',
    a: 'For most students, caffeine + L-theanine (1:2 ratio) is the most cost-effective focus stack — and the most-evidence-backed. Espresso (~75mg) plus a 200mg L-theanine capsule replicates the studied dose for under €0.50. The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline) on top, which compounds for actual retention of studied material over the term.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="studying"
      pageTitle="Best Nootropics for Studying (EU)"
      pageDescription="Independent EU ranking of nootropics for sustained study sessions. EU-compliant, EUR-priced, evidence-graded."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack covers both — acute-effect focus ingredients (L-theanine + caffeine) plus daily-use memory ingredients (Bacopa, citicoline). This page ranks the EU-storefront products that include both, with EUR pricing and EFSA-compliant labelling."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'EFSA-approved cognitive supplement framework', href: '/efsa-approved-cognitive-supplements/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('eu')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
