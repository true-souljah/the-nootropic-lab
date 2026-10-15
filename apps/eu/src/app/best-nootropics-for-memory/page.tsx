import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Memory ${CURRENT_YEAR} (EU): EU Buyer Picks at Clinical Doses`,
  description:
    'Independent EU ranking of nootropics for memory and recall. Bacopa, Lion\'s Mane, phosphatidylserine, citicoline — what the science says + which products sold to EU buyers deliver them at clinical dose.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/best-nootropics-for-memory/' }),
  openGraph: {
    title: 'Best Nootropics for Memory (EU) — Evidence-Graded',
    description: 'EU-storefront memory picks. EUR pricing. Ingredient framing that avoids unauthorised EU health claims.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Bacopa Monnieri',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'In a systematic review of six randomised trials (Pase 2012, PubMed 22747190), all lasting 12 weeks at 300–450mg extract a day, Bacopa improved 9 of 17 tests of memory free recall. Onset is slow — daily for 8+ weeks. Not an acute-effect ingredient. EFSA has not approved a specific health claim for Bacopa, so EU labels describe it as a botanical food supplement rather than making cognitive claims.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Modulates Nerve Growth Factor (NGF) and may support neurogenesis. Small RCTs (notably Mori et al. 2009 in adults aged 50–80 with mild cognitive impairment) showed higher cognitive function scores than placebo at 3g/day over 16 weeks. Look for fruiting-body extract, not mycelium-on-grain. Lion\'s Mane fruiting body has traditional EU food use; mycelium-grain blends are scrutinised under Novel Food rules.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Phosphatidylserine (PS)',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'Phospholipid component of brain cell membranes. RCTs in older adults at 100–300mg a day report memory benefits, though often only in subgroups (see our phosphatidylserine page). The EU does not authorise US-style qualified claims (the FDA allows only qualified claims that phosphatidylserine \'may reduce the risk of dementia\' or \'cognitive dysfunction in the elderly\', with the disclaimer \'FDA concludes that there is little scientific evidence supporting this claim\'). EFSA\'s 2010 opinion on five phosphatidylserine claims found the substance \'not sufficiently characterised in relation to the claimed effects\' and concluded that \'a cause and effect relationship cannot be established\'; the FDA\'s 2003 review, by contrast, looked at trials in people already diagnosed with dementia or cognitive dysfunction. The trial linked below (Vakhapova et al. 2010) is separate from these regulatory decisions: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Choline donor + uridine source. In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and in a follow-up crossover of 32 of those participants, 2,000mg a day for 2 months improved immediate and delayed recall. Authorised in the EU under Novel Food Regulation (EU) 2015/2283.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes Bacopa, citicoline (250mg Cognizin at clinical dose), Lion\'s Mane (500mg fruiting body, below the 1,000mg reference dose), AND phosphatidylserine (100mg Sharp-PS at clinical dose) — all four memory-evidence ingredients in one open-formula EU-storefront product. Bacopa dose is 150mg (under the 300mg clinical anchor); consider stacking with a separate Bacopa supplement for full effect. Priced in euros on the brand\'s EU store.',
  },
  {
    product: productsEU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 2,
    whyItsHere:
      'Phosphatidylserine (100mg) at clinical dose, plus Lion\'s Mane (500mg, below the 1–1.8g/day used in healthy-adult trials) and Bacopa (300mg; the label does not state its bacoside content). Adds Ashwagandha for stress-related memory. 6 capsules/day is real friction.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Bacopa Monnieri (250mg, just under the 300mg clinical anchor) is its main memory-relevant ingredient. No EUR storefront: the UK store (noocube.co.uk) prices in GBP and ships to the UK, Ireland, Spain, Portugal, Greece, Croatia, Poland, Sweden and Denmark, but not to Germany, France or the Netherlands. The noocube.com Trustpilot profile has no reviews yet — review terms carefully before subscribing.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for memory available in the EU?',
    a: 'Bacopa Monnieri: in a systematic review of six 12-week randomised trials at 300–450mg extract a day (Pase 2012, PubMed 22747190), it improved 9 of 17 tests of memory free recall, and the authors call the research \'in its infancy\'. Citicoline (Cognizin) has Novel Food authorisation in the EU; it improved verbal memory in older adults with inefficient memory in one trial (Spiers 1996, PubMed 8624220). Lion\'s Mane fruiting-body extract has smaller but promising RCT evidence.',
  },
  {
    q: 'How long until memory nootropics work?',
    a: 'Bacopa: 8–12 weeks of daily use; most positive trials ran 12 weeks. Lion\'s Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. Phosphatidylserine: its memory trials ran 15 weeks to 12 months. Citicoline: memory effects were measured after 2–3 months. None of these are acute-effect ingredients. Plan for at least 12 weeks of consistent dosing before judging.',
  },
  {
    q: 'Why don\'t EU labels mention "memory" benefits the way US labels do?',
    a: 'EFSA has not approved most cognitive-outcome claims for these botanicals. Under EU Regulation (EC) 1924/2006, supplement labels can only make health claims that the European Commission has authorised after EFSA assessment. Reputable EU brands describe ingredient mechanism (e.g., "supports phospholipid synthesis") rather than outcome (e.g., "improves memory").',
  },
  {
    q: 'Are memory nootropics safe long-term?',
    a: 'The ingredients on this page have favourable safety profiles in human RCTs at the doses listed. Phosphatidylserine derived from soy may be a concern for soy allergies (sunflower-derived PS like Sharp-PS GREEN is available). Bacopa can cause GI upset in some people; take with food. None of the picks above contains Ginkgo; if you add it separately, it can interact with anticoagulants.',
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
    a: 'No. Bacopa is not an acute-effect ingredient. It is a classic case of "you only know it worked when you stop and notice the regression." This makes it psychologically harder to stick with than acute-effect ingredients (caffeine, L-theanine) — and the trials in the systematic review we cite (Pase 2012) measured memory after 12 weeks.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="memory"
      pageTitle="Best Nootropics for Memory (EU)"
      pageDescription="Independent EU ranking of nootropics for memory and recall, based on clinical evidence. EU storefronts marked."
      heroParagraph="For memory, the Bacopa Monnieri evidence we cite is a systematic review of six 12-week randomised trials (Pase 2012). This page ranks the products in our EU coverage that contain Bacopa, Lion's Mane, phosphatidylserine, or citicoline at or near clinical dose. EU labels describe these ingredients in mechanism terms (under Regulation (EC) No 1924/2006, with claims assessed by the European Food Safety Authority, EFSA); for phosphatidylserine, EFSA's 2010 opinion concluded that 'a cause and effect relationship cannot be established'."
      ingredientMechanism={ingredientMechanism}
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
