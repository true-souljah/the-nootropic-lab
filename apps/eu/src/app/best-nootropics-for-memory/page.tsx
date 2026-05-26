import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://eu.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory ${CURRENT_YEAR} (EU): EU-Compliant Picks at Clinical Doses`,
  description:
    'Independent EU ranking of nootropics for memory and recall. Bacopa, Lion\'s Mane, phosphatidylserine, citicoline — what the science says + which EU-storefront products deliver them at clinical dose.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory (EU) — Evidence-Graded',
    description: 'EU-storefront memory picks. EUR pricing. EFSA-aware ingredient framing.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    evidence:
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks at 300mg standardised to 50% bacosides. Onset is slow — daily for 8+ weeks. Not an acute-effect ingredient. EFSA has not approved a specific health claim for Bacopa, so EU labels describe it as a botanical food supplement rather than making cognitive claims.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in older adults with mild cognitive impairment) showed memory improvements at 1g/day fruiting-body extract over 16 weeks. Look for fruiting-body extract, not mycelium-on-grain. Lion\'s Mane fruiting body has traditional EU food use; mycelium-grain blends are scrutinised under Novel Food rules.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    evidence:
      'Phospholipid component of brain cell membranes. Most RCT evidence is in 50–80-year-olds at 100–300mg/day. The EU does not authorise the US-style "may reduce risk of dementia" qualified claim — EFSA has rejected several PS health claims, so EU labels describe PS in mechanism rather than outcome terms.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. RCTs in older adults with age-related memory complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks. Authorised in the EU under Novel Food Regulation (EU) 2015/2283.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), Lion\'s Mane (500mg fruiting body at clinical dose), AND phosphatidylserine (100mg Sharp-PS at clinical dose) — all four memory-evidence ingredients in one open-formula EU-storefront product. Bacopa dose is 150mg (under the 300mg clinical anchor); consider stacking with a separate Bacopa supplement for full effect. €65/mo with EUR pricing.',
  },
  {
    product: productsEU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Three of the four memory ingredients at clinical dose: Lion\'s Mane (500mg fruiting body), Phosphatidylserine (100mg Sharp-PS), Citicoline (250mg Cognizin). No Bacopa, but everything else is precisely dosed. Only 2 capsules/day at €55/mo. Same Opti-Nutra manufacturer as Mind Lab Pro.',
  },
  {
    product: productsEU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 3,
    whyItsHere:
      'Lion\'s Mane (500mg fruiting body) and Phosphatidylserine (100mg) both at clinical dose, plus Bacopa (200mg, under the 300mg clinical anchor). Adds Ashwagandha for stress-related memory. Premium €85/mo and 6 capsules/day are real friction; pick this if you specifically want the broader stack.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Bacopa Monnieri (250mg, just under the 300mg clinical anchor) is its main memory-relevant ingredient. EU storefront with EUR pricing at €55/mo. Trustpilot 1.9/5 reflects subscription cancellation complaints — review terms carefully before subscribing.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for memory available in the EU?',
    a: 'Bacopa Monnieri at 300mg standardised to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults. Citicoline (Cognizin) has Novel Food authorisation in the EU and good evidence for older adults with age-related memory complaints. Lion\'s Mane fruiting-body extract has smaller but promising RCT evidence.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use. Lion\'s Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. None of these are acute-effect ingredients. Plan for at least 8 weeks of consistent dosing before judging.',
  },
  {
    q: 'Why don\'t EU labels mention "memory" benefits the way US labels do?',
    a: 'EFSA has not approved most cognitive-outcome claims for these botanicals. Under EU Regulation (EC) 1924/2006, supplement labels can only make health claims that EFSA has authorised. Reputable EU brands describe ingredient mechanism (e.g., "supports phospholipid synthesis") rather than outcome (e.g., "improves memory"). The underlying ingredient evidence is the same — only the on-label language differs.',
  },
  {
    q: 'Are memory nootropics safe long-term?',
    a: 'The ingredients on this page have favourable safety profiles in human RCTs at the doses listed. Phosphatidylserine derived from soy may be a concern for soy allergies (sunflower-derived PS like Sharp-PS GREEN is available). Bacopa can cause GI upset in some people; take with food. Ginkgo (in BRAINEFFECT) can interact with anticoagulants.',
  },
  {
    q: 'Will these help with age-related memory loss?',
    a: 'The evidence is strongest specifically in older adults with subjective cognitive complaints — not in clinically diagnosed dementia or Alzheimer\'s. If you or a family member is experiencing significant memory changes, see a neurologist (in most EU member states this requires a GP referral). Supplements are not a treatment for dementia and EU brands cannot legally market them as such.',
  },
  {
    q: 'Lion\'s Mane: fruiting body or mycelium?',
    a: 'Fruiting body. Most clinical research uses fruiting-body extract. Mycelium-on-grain products contain a high percentage of grain (oats, brown rice) by weight and lower beta-glucan content. In the EU, mycelium-on-grain is also under increased Novel Food scrutiny. Read labels carefully and prefer products that disclose β-glucan percentage and use the fruiting body.',
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
      pageTitle="Best Nootropics for Memory (EU)"
      pageDescription="Independent EU ranking of nootropics for memory and recall, based on clinical evidence. EU storefronts only."
      heroParagraph="Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs over 30+ years. This page ranks the EU-storefront products in our coverage that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose. EU labels describe these ingredients in mechanism terms (per EFSA Regulation (EC) 1924/2006) — the underlying clinical evidence is the same as in the US."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('eu')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
