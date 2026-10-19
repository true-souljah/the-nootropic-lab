import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory in Canada ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for memory and recall available to Canadian buyers. Each pick contains at least one ingredient with peer-reviewed memory evidence at clinical dose.',
  alternates: buildAlternates({ regionCode: 'ca', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory in Canada — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says + which products actually deliver them at clinical dose to Canadian buyers.',
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
      'Extracts raised Nerve Growth Factor (NGF) in cell and animal studies; we found no human trial that measured NGF. Small RCTs (notably Mori et al. 2009 in adults aged 50–80 with mild cognitive impairment) showed higher cognitive function scores than placebo at 3g/day over 16 weeks. Evidence is promising but smaller than for Bacopa. Look for fruiting-body extract, not mycelium-on-grain.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'Phospholipid component of brain cell membranes. The US FDA allows phosphatidylserine only qualified claims that it \'may reduce the risk of dementia\' or \'cognitive dysfunction in the elderly\', each followed by \'FDA concludes that there is little scientific evidence supporting this claim\' (FDA letter, 13 May 2003). Health Canada\'s Phosphatidylserine monograph (27 February 2026) lists one use, "Helps support cognitive/brain health/function", at "300 milligrams of Phosphatidylserine, per day" for adults 18 years and older, with no memory claim (Natural Health Products Ingredients Database (NHPID), checked 2026-10-08). RCTs in older adults at 100–300mg a day report memory benefits, though often only in subgroups (see our phosphatidylserine page). The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA or Health Canada claims: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Choline donor + uridine source. In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and in a follow-up crossover of 32 of those participants, 2,000mg a day for 2 months improved immediate and delayed recall.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'Ginkgo Biloba',
    ingredientSlugs: ['ginkgo-biloba'],
    evidence:
      'Proposed to work via cerebral blood flow (vasodilation) and platelet-activating factor inhibition. Health Canada\'s Ginkgo monograph (25 July 2025) allows "Helps to enhance memory in adults" and "Helps to enhance cognitive function in adults" at "80 - 240 milligrams of extract, per day", "standardized to 22-27% flavonoid glycosides and 5-7% terpene lactones", for adults 18 years and older (NHPID, checked 2026-10-08), but a 2026 network meta-analysis of 29 RCTs in healthy adults (Tiemtad et al.) found that high-dose Bacopa (600mg/day or more) improved working memory more than both Ginkgo doses and placebo and gave greater short-term memory benefits, with no significant differences in attention or processing speed, so the trial evidence does not single out Ginkgo as a memory enhancer.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/41678913/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsCA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), Lion\'s Mane (500mg fruiting body, below the 1,000mg reference dose), AND phosphatidylserine (100mg at clinical dose) — four of the five memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Bacopa supplement for full effect. Ships UK→Canada.',
  },
  {
    product: productsCA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes citicoline, phosphatidylserine 100mg, AND Lion\'s Mane — 31 ingredients in all, the most of any single formula in this review. Loses ground on capsule count (6/day), price (US$139 per 4-week subscription shipment), and on US-domiciled order tracking. For memory specifically, the breadth justifies the trade-off if you can tolerate the daily friction.',
  },
  {
    product: productsCA.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 3,
    whyItsHere:
      'Delivers Ginkgo Biloba at the full clinical dose (500mg of a 12:1 extract, standardised to 120mg flavone glycosides). Single-mechanism (cerebral blood flow), not a complete memory stack. At most an addition alongside Mind Lab Pro, or an entry-point trial. No NPN (Natural Product Number) found for NatureBell Ginkgo + Ginseng in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07); check the listing or label for an eight-digit NPN.',
  },
  {
    product: productsCA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Contains Bacopa and Huperzine A (an acetylcholinesterase inhibitor with weak memory evidence). The label states 100mg Bacopa, a third of the 300mg clinical dose. Its former Health Canada licence, NPN 80041968, is listed as Discontinued in the LNHPD (checked 2026-10-07), and we found no Onnit listing on amazon.ca\'s first page of search results that day, so confirm Canadian delivery at checkout.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for memory available in Canada?',
    a: 'Bacopa Monnieri: in a systematic review of six 12-week randomized trials at 300–450mg extract a day (Pase 2012, PubMed 22747190), it improved 9 of 17 tests of memory free recall, and the authors call the research \'in its infancy\'. Phosphatidylserine is in Mind Lab Pro at 100mg per serving; the single-ingredient phosphatidylserine trials on our ingredient page used 100–300mg a day. Citicoline improved verbal memory in older adults with inefficient memory in one trial (Spiers 1996, PubMed 8624220).',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use; most positive trials ran 12 weeks. Lion\'s Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. Phosphatidylserine: its memory trials ran 15 weeks to 12 months. Citicoline: memory effects were measured after 2–3 months. Ginkgo: positive dementia trials ran 22–26 weeks. Apart from small acute effects of Lion\'s Mane in pilot trials, none of these are acute-effect ingredients. Plan for at least 12 weeks of consistent dosing before judging, and longer for phosphatidylserine (15 weeks or more) and ginkgo (22–26 weeks).',
  },
  {
    q: 'Are memory nootropics regulated by Health Canada?',
    a: 'Health Canada states that "All natural health products (NHPs) sold in Canada require a product licence before being marketed", and a licensed product\'s label bears an eight-digit NPN (Natural Product Number). We found no NPN for Mind Lab Pro, Qualia Mind or Hunter Focus in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07); a licence can be held under another name, so look for an eight-digit NPN on the label; without one, a consumer\'s only route is personal importation, which Health Canada\'s GUI-0116 limits to "no more than a 90-day supply or a single course of treatment, whichever is less".',
  },
  {
    q: 'Are memory nootropics safe long-term?',
    a: 'The ingredients on this page have favorable safety profiles in human RCTs at the doses listed. Phosphatidylserine derived from soy may be a concern for soy allergies (sunflower-derived PS is available — check the label source). Bacopa can cause GI upset in some people; take with food.',
  },
  {
    q: 'Will these help with age-related memory loss?',
    a: 'Some of the supplements on this page have trial evidence in older adults, often only in subgroups: PS-DHA in older adults with memory complaints, citicoline in those with relatively inefficient memories, and Lion\'s Mane in mild cognitive impairment. If you or a family member is experiencing significant memory changes, see a Canadian neurologist or your family doctor. Supplements are not a treatment for dementia.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products (common at Canadian retail like Costco-sized mushroom blends) contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Mind Lab Pro\'s label states fruiting body; Hunter Focus\'s label lists organic Lion\'s Mane mushroom without naming the part used. Read labels carefully and prefer products that disclose β-glucan percentage.',
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
      pageTitle="Best Nootropics for Memory in Canada"
      pageDescription="Independent ranking of the best nootropics for memory and recall available to Canadian buyers, based on clinical evidence."
      heroParagraph="For memory, the Bacopa Monnieri evidence we cite is a systematic review of six 12-week randomized trials (Pase 2012). This page ranks the products available to Canadian buyers (licensed by Health Canada with a Natural Product Number (NPN), or imported for personal use) that contain Bacopa, Lion's Mane, phosphatidylserine, citicoline, or Ginkgo at or near clinical dose."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'NPN-licensed nootropics in Canada', href: '/npn-licensed-nootropics-canada/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
