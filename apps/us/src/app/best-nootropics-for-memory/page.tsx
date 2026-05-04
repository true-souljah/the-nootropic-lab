import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsUS, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Best Nootropics for Memory ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for memory and recall. Each pick contains at least one ingredient with peer-reviewed memory evidence at clinical dose.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-memory/` },
  openGraph: {
    title: 'Best Nootropics for Memory — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says + which products actually deliver them at clinical dose.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardized to 50% bacosides. Onset is slow — daily for 8+ weeks. Not an acute-effect ingredient.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Evidence is promising but smaller than for Bacopa. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. The FDA permits a qualified health claim for PS supporting cognitive function in elderly adults. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. Less-strong evidence for memory in healthy younger adults.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), AND phosphatidylserine (100mg at clinical dose) — three of the four memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Bacopa supplement for full effect.',
  },
  {
    product: productsUS.find(p => p.slug === 'nootropics-depot-lions-mane')!,
    rank: 2,
    whyItsHere:
      'Single-ingredient Lion\'s Mane fruiting-body extract from a brand with strong third-party CoA testing reputation. The right choice if you want to test Lion\'s Mane in isolation. Not a "daily nootropic" — pair with Bacopa or Mind Lab Pro for memory-stack coverage.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes Bacopa, citicoline, phosphatidylserine, AND Lion\'s Mane — the most complete memory-ingredient stack in one product. Loses ground on capsule count (7+/day) and price ($139/mo subscription). For memory specifically, the breadth justifies the trade-off if you can tolerate the daily friction.',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Contains Bacopa and Huperzine A (an acetylcholinesterase inhibitor with weak memory evidence). Proprietary blends mean you cannot verify Bacopa is at the 300mg clinical dose. Mainstream availability is its strongest feature for memory buyers.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for memory?',
    a: 'Bacopa Monnieri at 300mg standardized to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. Phosphatidylserine has the FDA qualified health claim for cognitive function in elderly. Citicoline has good evidence for older adults with age-related memory complaints.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
  },
  {
    q: 'Are memory nootropics safe long-term?',
    a: 'The ingredients on this page have favorable safety profiles in human RCTs at the doses listed. Phosphatidylserine derived from soy may be a concern for soy allergies (sunflower-derived PS is available). Bacopa can cause GI upset in some people; take with food.',
  },
  {
    q: 'Will these help with age-related memory loss?',
    a: 'The evidence is strongest specifically in older adults with subjective cognitive complaints — not in clinically diagnosed dementia or Alzheimer\'s. If you or a family member is experiencing significant memory changes, see a neurologist. Supplements are not a treatment for dementia.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Read labels carefully and prefer products that disclose β-glucan percentage and use the fruiting body.',
  },
  {
    q: 'Will Bacopa make me feel anything?',
    a: 'No. Bacopa is not an acute-effect ingredient. It is a classic case of "you only know it worked when you stop and notice the regression." This makes it psychologically harder to stick with than acute-effect ingredients (caffeine, L-theanine) — but the cumulative memory benefit at 8–12 weeks is the most replicated finding in nootropics.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="memory"
      pageTitle="Best Nootropics for Memory"
      pageDescription="Independent ranking of the best nootropics for memory and recall, based on clinical evidence."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs over 30+ years. This page ranks the products in our coverage that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      author={author}
    />
  );
}
