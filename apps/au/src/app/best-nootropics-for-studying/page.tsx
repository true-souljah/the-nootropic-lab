import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle } from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsAU, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://au.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Studying Australia ${CURRENT_YEAR}: Independent Picks for Australian Students`,
  description:
    'Independent ranking of nootropics for sustained study sessions available to Australian university students. Picks judged on focus + memory consolidation + safety profile. TGA Personal Importation Scheme rules included.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-studying/` },
  openGraph: {
    title: 'Best Nootropics for Studying Australia — Evidence-Graded',
    description:
      'Sustained focus + memory consolidation. What Australian students should actually take, what the TGA rules allow, and what to avoid.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine — sustained focus',
    evidence:
      'For sustained study sessions, the L-theanine + caffeine combo is the foundation. Reduces caffeine jitter and post-coffee crash, smooths attention switching. 100–200mg L-theanine + 100mg caffeine, repeated 4–6 hours later if needed. Both are TGA-permitted ingredients.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Bacopa Monnieri — long-term memory consolidation',
    evidence:
      'Critical for retention of studied material. Bacopa improves memory consolidation — what your brain does during sleep with material you studied that day. 300mg standardised to 50% bacosides daily for 8+ weeks. Start at the beginning of the semester, not the night before the exam. TGA-permitted; available as standalone TGA-listed products at any Australian pharmacy (Blackmores Brahmi, Caruso\'s Memory Forte, Nature\'s Own Brahmi).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline — choline for cognitive demand',
    evidence:
      'Heavy cognitive demand depletes choline. Citicoline at 250–500mg/day supports phospholipid synthesis and acetylcholine availability — the neurotransmitter most associated with attention and learning. Cognizin is the standardised form. Imported under the Personal Importation Scheme.',
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
    product: productsAU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design pairs perfectly with whatever caffeine source Australian students use during study sessions (long blacks, energy drinks, matcha). Includes L-theanine, Bacopa, citicoline, and L-tyrosine — covers all four study-relevant mechanisms in one open formula. Take daily through the semester for cumulative Bacopa effect. Ships from the UK to Australia in 7–14 business days; pay AUD $107/mo equivalent in USD at checkout.',
  },
  {
    product: productsAU.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Most complete study stack: includes everything in Mind Lab Pro plus Alpha-GPC, Rhodiola, and choline-supporting cofactors with Bacopa fully dosed at 300mg. The 7+ capsules/day is friction during exam block; the AUD $215/mo subscription is significant friction for Australian student budgets (cheaper to buy a Mind Lab Pro + standalone TGA-listed Bacopa stack).',
  },
  {
    product: productsAU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 3,
    whyItsHere:
      'Citicoline (250mg Cognizin) + phosphatidylserine (100mg Sharp-PS Green) + L-tyrosine (300mg Ajipure). Only 2 capsules per day — the lowest pill burden if you want to keep your study routine simple. No Bacopa — pair with a TGA-listed Bacopa product from Chemist Warehouse for memory-consolidation coverage across the semester.',
  },
  {
    product: productsAU.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free Classic version is internationally well-known. Bacopa + L-theanine + Alpha-GPC are present but proprietary blends prevent verifying clinical doses. NSF Certified for Sport — relevant if you compete in drug-tested university sport. 90-day money-back is the most generous in this category.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'When should I start taking nootropics for studying?',
    a: 'For acute-effect ingredients (L-theanine + caffeine), 30 minutes before a study session. For Bacopa and citicoline (memory consolidation), start at the beginning of the semester — they need 4–8 weeks of daily use to show effect. The night before the exam is too late for Bacopa.',
  },
  {
    q: 'Will nootropics make me smarter?',
    a: 'No. Nootropics do not increase IQ or change underlying cognitive capacity. They support specific mechanisms — focus stamina, memory consolidation, stress resilience — that allow you to study more effectively for longer with the cognitive capacity you already have.',
  },
  {
    q: 'What is the cheapest evidence-backed study stack for Australian students?',
    a: 'L-theanine + caffeine is the most cost-effective foundation: a TGA-listed L-theanine product (Blackmores L-Theanine, Swisse Calm L-Theanine) at AUD $20/month + your usual coffee. Add a TGA-listed Bacopa product (Caruso\'s Memory Forte, Nature\'s Own Brahmi 5000mg, Blackmores Brahmi) for ~AUD $25/month for memory consolidation. Total around AUD $45/month — under half the price of a single international stack and fully TGA-listed at any Australian pharmacy. Pair with normal sleep and exam prep.',
  },
  {
    q: 'Are these safe for Australian university students?',
    a: 'The ingredients on this page are generally regarded as safe for healthy adults. Students taking ADHD medication (dexamphetamine, methylphenidate), antidepressants, or with bipolar diagnoses should consult their prescribing clinician before starting any of these — particularly L-tyrosine and Bacopa, which can interact with several medication classes.',
  },
  {
    q: 'Should I take dexamphetamine or modafinil instead?',
    a: 'Dexamphetamine is a Schedule 8 prescription stimulant for ADHD and narcolepsy. Modafinil is Schedule 4 prescription-only for narcolepsy. Using diverted prescription stimulants (someone else\'s script) is illegal in Australia and is associated with cardiovascular and dependence risks. If you suspect you have ADHD, see your GP or a campus health service for evaluation. Nootropic supplements are not equivalent to dexamphetamine or modafinil and should not be marketed as such.',
  },
  {
    q: 'How does sleep interact with study supplements?',
    a: 'Sleep is when memory consolidation actually happens. No supplement compensates for chronic sleep deprivation. If you are pulling all-nighters regularly, optimise sleep first; supplements are second-order. L-tyrosine has documented benefit specifically for cognitive performance during acute sleep loss but should not be used as a license to skip sleep.',
  },
  {
    q: 'Where can Australian students buy these?',
    a: 'TGA-listed single-ingredient options (L-theanine, Bacopa, ginkgo, fish oil) are stocked at Chemist Warehouse, Priceline, Amcal, Blooms, Coles, Woolworths, and ePharmacy. The international multi-ingredient stacks ranked above ship direct from the manufacturer to Australian addresses under the TGA Personal Importation Scheme — order from the brand website, allow 7–21 business days, and expect 10% GST added at checkout.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="studying"
      pageTitle="Best Nootropics for Studying in Australia"
      pageDescription="Independent ranking of nootropics for sustained study sessions available to Australian students. Focus + memory consolidation + safety for daily use."
      heroParagraph="Studying combines two distinct cognitive demands: sustained focus during study sessions and memory consolidation between them. The best study stack covers both — acute-effect focus ingredients (L-theanine + caffeine) plus daily-use memory ingredients (Bacopa, citicoline). This page ranks the products available to Australian students. Note that L-theanine and Bacopa are TGA-permitted and stocked at any Australian pharmacy as TGA-listed Listed Medicines; the multi-ingredient international stacks below import under the Personal Importation Scheme."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('au')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
