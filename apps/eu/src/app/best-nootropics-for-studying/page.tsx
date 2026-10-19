import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsEU, getRegionalHealthDisclaimer, ingredients } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Studying ${CURRENT_YEAR} (EU): Independent Picks for European Students`,
  description:
    'Independent EU ranking of nootropics for sustained study sessions. EUR pricing, EU storefronts, ingredient framing that avoids unauthorised EU health claims. Picks judged on focus + memory consolidation + safety for daily use.',
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
    ingredientSlugs: ['l-theanine', 'caffeine'],
    evidence:
      'For sustained study sessions, the L-theanine + caffeine combo is the foundation. In the trial linked below (Owen 2008), the pairing improved speed and accuracy on an attention-switching task; in a controlled trial (Rogers 2008, PubMed 17891480), theanine did not significantly reduce caffeine-induced jitteriness. 100–200mg L-theanine + 75–100mg caffeine, repeated 4–6 hours later if needed. No caffeine alertness or attention claim is authorised in the EU: the European Food Safety Authority (EFSA) assessed a ≥75mg alertness claim favourably in 2011, but the European Commission never authorised it.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
    extraCitations: [
      { label: 'Rogers 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/17891480/' },
    ],
  },
  {
    name: 'Bacopa Monnieri — long-term memory consolidation',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'Critical for retention of studied material. Bacopa improves memory consolidation — what your brain does during sleep with material you studied that day. 300mg standardised to 50% bacosides daily for 8+ weeks. Start at the beginning of the term, not the night before the exam.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline — a choline donor',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Citicoline is a choline donor. Our citicoline page rates its attention evidence as mixed and its verbal-memory evidence as moderate (delayed recall improved in one trial in older adults with inefficient memory, Spiers 1996). Cognizin is a standardised form. Authorised in the EU under Novel Food Regulation (EU) 2015/2283.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'L-Tyrosine — under-stress performance',
    ingredientSlugs: ['l-tyrosine'],
    evidence:
      'Acute exam stress and sleep deprivation deplete catecholamines. Tyrosine supplementation has documented benefit for cognitive performance specifically under stress, sleep loss, or cold. The stress trials with positive results used plain L-tyrosine at 2g a day or 100–150mg/kg, for short bursts; not for daily continuous use.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source you use during study sessions (coffee, espresso, matcha). Includes L-theanine, Bacopa, citicoline, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. EUR pricing, with EU orders shipped from a European depot per the brand. Take daily through the term for cumulative Bacopa effect.',
  },
  {
    product: productsEU.find(p => p.slug === 'brainzyme-focus-pro-review')!,
    rank: 2,
    whyItsHere:
      'UK-made and explicitly positioned for university students. A 350mg Camellia sinensis (matcha) EMT blend that includes L-theanine, plus guarana seed, choline, ginkgo and L-tyrosine; the label states no caffeine amount and does not split the blend. It costs €31.75 a month. Lacks long-term memory ingredients (no Bacopa or Lion\'s Mane).',
  },
  {
    product: productsEU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 3,
    whyItsHere:
      '20 ingredients, tied with Brainzyme Focus Pro for the most in this review: Lion\'s Mane, Bacopa, Phosphatidylserine, Ashwagandha and ALCAR, plus 100mg caffeine. 6 capsules/day is significant friction.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa and citicoline, start at the beginning of the term — most positive Bacopa trials ran 12 weeks, and citicoline\'s memory effects were measured after 2–3 months. The night before the exam is too late for Bacopa.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have. EU labels avoid this kind of claim because it would not pass EFSA review.',
  },
  {
    q: 'Are these safe for university students in the EU?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults. Students taking ADHD medication (methylphenidate, lisdexamfetamine), antidepressants, or with bipolar diagnoses should consult their prescribing clinician before starting any of these — particularly L-tyrosine and Bacopa, which can interact with several medication classes.',
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
    a: 'For most students, caffeine + L-theanine is a simple starting point: in Owen 2008 (PubMed 18681988), 50mg caffeine with 100mg L-theanine (a 1:2 ratio) improved speed and accuracy on an attention-switching task. The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline) on top; we cite no trial of them combined with caffeine + L-theanine.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="studying"
      pageTitle="Best Nootropics for Studying (EU)"
      pageDescription="Independent EU ranking of nootropics for sustained study sessions. EU storefronts marked, EUR pricing, evidence-graded."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack covers both — acute-effect focus ingredients (L-theanine + caffeine) plus daily-use memory ingredients (Bacopa, citicoline). This page ranks the EU-storefront products that include both, with EUR pricing."
      ingredientMechanism={ingredientMechanism}
      ingredientPages={ingredients}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'EU-authorised cognitive health claims (assessed by EFSA)', href: '/efsa-approved-cognitive-supplements/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('eu')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
