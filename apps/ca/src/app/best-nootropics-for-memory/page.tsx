import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://ca.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Memory in Canada ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for memory and recall available to Canadian buyers. Each pick contains at least one ingredient with peer-reviewed memory evidence at clinical dose.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-memory/` },
  openGraph: {
    title: 'Best Nootropics for Memory in Canada — Evidence-Graded',
    description: 'Bacopa, Lion\'s Mane, Phosphatidylserine — what the science says + which products actually deliver them at clinical dose to Canadian buyers.',
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
      'Phospholipid component of brain cell membranes. The US FDA permits a qualified health claim for PS supporting cognitive function in elderly adults; Health Canada NPN monographs recognise PS for memory support. Most RCT evidence is in 50–80-year-olds at 100–300mg/day.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'Ginkgo Biloba',
    evidence:
      'Improves cerebral blood flow via vasodilation and platelet-activating factor inhibition. Health Canada has issued NPN-monograph approval for Ginkgo Biloba 120mg standardized extracts for memory support. Evidence in healthy adults is mixed but favourable in older adults with subjective complaints.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/12815182/',
  },
];

const picks: UseCasePick[] = [
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
      'Includes Bacopa at full 300mg clinical dose, citicoline, phosphatidylserine 200mg, AND Lion\'s Mane — the most complete memory-ingredient stack of any product available to Canadian buyers. Loses ground on capsule count (7+/day), price (CAD ~$190/mo subscription), and on US-domiciled order tracking. For memory specifically, the breadth justifies the trade-off if you can tolerate the daily friction.',
  },
  {
    product: productsCA.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 3,
    whyItsHere:
      'Phosphatidylserine 100mg (Sharp-PS Green) + Citicoline 250mg (Cognizin) at clinical doses — the two best-evidenced membrane-and-choline mechanisms for memory. Does not include Bacopa or Lion\'s Mane, so pair with a separate Bacopa supplement for full memory-stack coverage. Only 2 capsules per day.',
  },
  {
    product: productsCA.find(p => p.slug === 'naturebell-ginkgo-ginseng-review')!,
    rank: 4,
    whyItsHere:
      'The budget pick — CAD ~$7/month from Amazon.ca with Prime shipping anywhere in Canada. Delivers Ginkgo Biloba at the full Health Canada-monograph clinical dose (120mg, 50:1 extract). Single-mechanism (cerebral blood flow), not a complete memory stack. Best as a cheap addition alongside Mind Lab Pro or Performance Lab Mind, or as an entry-point trial. Not Health Canada NPN-registered (imported as personal-use).',
  },
  {
    product: productsCA.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 5,
    whyItsHere:
      'Contains Bacopa, Lion\'s Mane, and Huperzine A (an acetylcholinesterase inhibitor with weak memory evidence). Proprietary blends mean you cannot verify Bacopa is at the 300mg clinical dose. Mainstream availability via Amazon.ca and occasional GNC Canada distribution is its strongest feature for memory buyers who want retail access.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for memory available in Canada?',
    a: 'Bacopa Monnieri at 300mg standardized to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults — Qualia Mind delivers this dose. Phosphatidylserine has the strongest age-related memory claim and Mind Lab Pro / Performance Lab Mind both deliver 100mg at clinical dose. Citicoline at 250–500mg has good evidence for older adults.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. Ginkgo: 4–8 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
  },
  {
    q: 'Are memory nootropics regulated by Health Canada?',
    a: 'All CA-domiciled natural health products carry an NPN (Natural Product Number) issued by Health Canada that confirms safety, quality, and permitted health claims. Cross-border imports (Mind Lab Pro, Qualia Mind, Performance Lab Mind, Hunter Focus) do not carry an NPN — they enter as personal-use supplements. Bacopa, Ginkgo, Lion\'s Mane, and PS all have Health Canada NPN monographs that domestic Canadian brands can register against.',
  },
  {
    q: 'Are memory nootropics safe long-term?',
    a: 'The ingredients on this page have favorable safety profiles in human RCTs at the doses listed. Phosphatidylserine derived from soy may be a concern for soy allergies (sunflower-derived PS is available — Performance Lab Mind uses Sharp-PS Green, which is sunflower-sourced). Bacopa can cause GI upset in some people; take with food.',
  },
  {
    q: 'Will these help with age-related memory loss?',
    a: 'The evidence is strongest specifically in older adults with subjective cognitive complaints — not in clinically diagnosed dementia or Alzheimer\'s. If you or a family member is experiencing significant memory changes, see a Canadian neurologist or your family doctor. Supplements are not a treatment for dementia.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products (common at Canadian retail like Costco-sized mushroom blends) contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. Mind Lab Pro and Hunter Focus both use fruiting body. Read labels carefully and prefer products that disclose β-glucan percentage.',
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
      pageTitle="Best Nootropics for Memory in Canada"
      pageDescription="Independent ranking of the best nootropics for memory and recall available to Canadian buyers, based on clinical evidence."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs over 30+ years. This page ranks the products available to Canadian buyers (Health Canada NPN-registered or shipped cross-border) that contain Bacopa, Lion's Mane, phosphatidylserine, citicoline, or Ginkgo at or near clinical dose."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
    />
  );
}
