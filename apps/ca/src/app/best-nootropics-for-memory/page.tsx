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
      'Phospholipid component of brain cell membranes. The US FDA permits a qualified health claim for PS supporting cognitive function in elderly adults; Health Canada\'s Phosphatidylserine monograph (27 February 2026) lists one use, "Helps support cognitive/brain health/function", at "300 milligrams of Phosphatidylserine, per day" for adults 18 years and older, with no memory claim (Natural Health Products Ingredients Database (NHPID), checked 2026-10-08). Most RCT evidence is in 50–80-year-olds at 100–300mg/day. The trial linked below (Vakhapova et al. 2010) is not the basis of the FDA or Health Canada claims: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'Ginkgo Biloba',
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
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), Lion\'s Mane (500mg fruiting body at clinical dose), AND phosphatidylserine (100mg at clinical dose) — four of the five memory-evidence ingredients in one open formula. Bacopa dose is 150mg (under the 300mg clinical anchor) so consider stacking with a separate Bacopa supplement for full effect. Ships UK→Canada.',
  },
  {
    product: productsCA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes citicoline, phosphatidylserine 100mg, AND Lion\'s Mane — the most complete memory-ingredient stack of any product available to Canadian buyers. Loses ground on capsule count (6/day), price (CAD ~$190/mo subscription), and on US-domiciled order tracking. For memory specifically, the breadth justifies the trade-off if you can tolerate the daily friction.',
  },
  {
    product: productsCA.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 3,
    whyItsHere:
      'Budget-priced — CAD ~$7/month, listed on amazon.ca. Delivers Ginkgo Biloba at the full clinical dose (120mg, 50:1 extract). Single-mechanism (cerebral blood flow), not a complete memory stack. At most a cheap addition alongside Mind Lab Pro, or an entry-point trial. No NPN (Natural Product Number) found for NatureBell Ginkgo + Ginseng in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07); check the listing or label for an eight-digit NPN.',
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
    q: 'What is the most evidence-backed nootropic for memory available in Canada?',
    a: 'Bacopa Monnieri at 300mg standardized to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. Phosphatidylserine has the strongest age-related memory claim and Mind Lab Pro delivers 100mg at clinical dose. Citicoline at 250–500mg has good evidence for older adults.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. Ginkgo: 4–8 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
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
    a: 'The evidence is strongest specifically in older adults with subjective cognitive complaints — not in clinically diagnosed dementia or Alzheimer\'s. If you or a family member is experiencing significant memory changes, see a Canadian neurologist or your family doctor. Supplements are not a treatment for dementia.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products (common at Canadian retail like Costco-sized mushroom blends) contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Mind Lab Pro\'s label states fruiting body; Hunter Focus\'s label lists organic Lion\'s Mane mushroom without naming the part used. Read labels carefully and prefer products that disclose β-glucan percentage.',
  },
  {
    q: 'Will Bacopa make me feel anything?',
    a: 'No. Bacopa is not an acute-effect ingredient. It is a classic case of "you only know it worked when you stop and notice the regression." This makes it psychologically harder to stick with than acute-effect ingredients (caffeine, L-theanine) — but the cumulative memory benefit at 8–12 weeks is the most replicated finding in nootropics.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory in Canada"
      pageDescription="Independent ranking of the best nootropics for memory and recall available to Canadian buyers, based on clinical evidence."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs over 30+ years. This page ranks the products available to Canadian buyers (licensed by Health Canada with a Natural Product Number (NPN), or imported for personal use) that contain Bacopa, Lion's Mane, phosphatidylserine, citicoline, or Ginkgo at or near clinical dose."
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
