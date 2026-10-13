import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory ${CURRENT_YEAR} (incl. Nootropics Depot)`,
  description:
    "Best nootropics for memory, ranked by clinical evidence - including Mind Lab Pro, with Nootropics Depot Lion's Mane also considered. Which picks hit clinical dose?",
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says + which products actually deliver them at clinical dose.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'In a systematic review of six randomized trials (Pase 2012, PubMed 22747190), all lasting 12 weeks at 300–450mg extract a day, Bacopa improved 9 of 17 tests of memory free recall. Onset is slow — daily for 8+ weeks. Not an acute-effect ingredient.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Evidence is promising but smaller than for Bacopa. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'Phospholipid component of brain cell membranes. The FDA allows phosphatidylserine only qualified claims that it \'may reduce the risk of dementia\' or \'cognitive dysfunction in the elderly\', each followed by \'FDA concludes that there is little scientific evidence supporting this claim\' (FDA letter, 13 May 2003). RCTs in older adults at 100–300mg a day report memory benefits, though often only in subgroups (see our phosphatidylserine page). Less-strong evidence for memory in healthy younger adults. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA claim: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Choline donor + uridine source. In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and in a follow-up crossover of 32 of those participants, 2,000mg a day for 2 months improved immediate and delayed recall.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
];

const picks: ListiclePick[] = [
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
      'Single-ingredient Lion\'s Mane fruiting-body extract from a brand with strong third-party CoA testing reputation. One 500mg capsule is half the 1,000mg low end of our Lion\'s Mane reference dose.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes citicoline, phosphatidylserine, AND Lion\'s Mane — 31 ingredients in all, the most of any single formula in this review. Loses ground on capsule count (6/day) and price ($139 per 4-week subscription shipment). For memory specifically, the breadth justifies the trade-off if you can tolerate the daily friction.',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Contains Bacopa and Huperzine A (an acetylcholinesterase inhibitor with weak memory evidence). The label states 100mg Bacopa, a third of the 300mg clinical dose. Mainstream availability is its strongest feature for memory buyers.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for memory?',
    a: 'Bacopa Monnieri: in a systematic review of six 12-week randomized trials at 300–450mg extract a day (Pase 2012, PubMed 22747190), it improved 9 of 17 tests of memory free recall, and the authors call the research \'in its infancy\'. For phosphatidylserine, the FDA allows only a qualified claim that it \'may reduce the risk of cognitive dysfunction in the elderly\', followed by \'FDA concludes that there is little scientific evidence supporting this claim\' (FDA letter, 13 May 2003). Citicoline improved verbal memory in older adults with inefficient memory in one trial (Spiers 1996, PubMed 8624220).',
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
    a: 'No. Bacopa is not an acute-effect ingredient. It is a classic case of "you only know it worked when you stop and notice the regression." This makes it psychologically harder to stick with than acute-effect ingredients (caffeine, L-theanine) — and the trials in the systematic review we cite (Pase 2012) measured memory after 12 weeks.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory"
      pageDescription="Independent ranking of the best nootropics for memory and recall, based on clinical evidence."
      heroParagraph="For memory, the Bacopa Monnieri evidence we cite is a systematic review of six 12-week randomized trials (Pase 2012). This page ranks the products in our coverage that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose."
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
