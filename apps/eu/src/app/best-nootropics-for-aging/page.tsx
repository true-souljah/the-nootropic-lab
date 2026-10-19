import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsEU, getRegionalHealthDisclaimer, ingredients } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Aging Brain ${CURRENT_YEAR} (EU): Evidence-Graded Picks for Older Adults`,
  description:
    'Independent EU ranking of nootropics for adults concerned about age-related cognitive changes. EUR pricing, EU storefronts. Phosphatidylserine, Bacopa, citicoline, Lion\'s Mane. NOT a treatment for dementia.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/best-nootropics-for-aging/' }),
  openGraph: {
    title: 'Best Nootropics for Aging Brain (EU) — Evidence-Graded',
    description: 'Phosphatidylserine, citicoline, Lion\'s Mane, Bacopa. EU-storefront picks for older European adults.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Phosphatidylserine (PS)',
    ingredientSlugs: ['phosphatidylserine'],
    evidence:
      'Phospholipid component of brain cell membranes. RCTs in older adults at 100–300mg a day report memory benefits, though often only in subgroups. Important: in the US, the FDA allows only qualified claims that phosphatidylserine \'may reduce the risk of dementia\' or \'cognitive dysfunction in the elderly\', with the disclaimer \'FDA concludes that there is little scientific evidence supporting this claim\'. EFSA\'s 2010 opinion on five phosphatidylserine claims found the substance \'not sufficiently characterised in relation to the claimed effects\' and concluded that \'a cause and effect relationship cannot be established\'; the FDA\'s 2003 review, by contrast, looked at trials in people already diagnosed with dementia or cognitive dysfunction. The trial linked below (Vakhapova et al. 2010) is separate from these regulatory decisions: in an exploratory 15-week RCT of 157 non-demented older adults with memory complaints, PS-DHA improved immediate verbal recall versus placebo.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/20523044/',
  },
  {
    name: 'Citicoline (CDP-Choline) — older-adult memory',
    ingredientSlugs: ['citicoline'],
    evidence:
      'In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and in a follow-up crossover of 32 of those participants, 2,000mg a day for 2 months improved immediate and delayed recall. Cognizin is a standardised form. Authorised in the EU under Novel Food Regulation (EU) 2015/2283.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'Lion\'s Mane (Hericium erinaceus)',
    ingredientSlugs: ['lions-mane'],
    evidence:
      'Mori et al. 2009 — small RCT in Japanese adults aged 50–80 with mild cognitive impairment. 3g/day over 16 weeks improved cognitive function scores compared with placebo. Evidence is promising for early age-related changes; not evaluated for dementia treatment. Lion\'s Mane fruiting body has traditional EU food use; mycelium-grain blends face Novel Food scrutiny.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18844328/',
  },
  {
    name: 'Bacopa Monnieri',
    ingredientSlugs: ['bacopa-monnieri'],
    evidence:
      'In a systematic review of six 12-week trials (Pase 2012, PubMed 22747190), Bacopa improved 9 of 17 memory free-recall tests; in adults aged 65 and over (Calabrese 2008, PubMed 18611150), 300mg a day for 12 weeks improved delayed word recall after controlling for baseline cognitive deficit.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22747190/',
    extraCitations: [
      { label: 'Calabrese 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/18611150/' },
    ],
  },
];

const picks: ListiclePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes phosphatidylserine (100mg Sharp-PS at clinical dose), citicoline (250mg Cognizin at clinical dose), Lion\'s Mane (500mg fruiting body, below the 1,000mg reference dose), and Bacopa. Four of the most age-relevant ingredients in one open-formula EU product. Caffeine-free — no cardiovascular load for older adults sensitive to stimulants. Priced in euros on the brand\'s EU store; EU orders ship from a European depot per the brand.',
  },
  {
    product: productsEU.find(p => p.slug === 'hunter-focus-review')!,
    rank: 2,
    whyItsHere:
      'Includes phosphatidylserine, Lion\'s Mane (500mg), and Bacopa, plus Ashwagandha (cortisol/stress) and ALCAR (mitochondrial energy). Contains 100mg caffeine — not ideal for stimulant-sensitive older adults. 6 capsules/day is friction.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Bacopa (250mg, just under the 300mg clinical anchor) plus Lutemax 2020, which has mixed evidence for screen eye strain: a 6-month trial in 48 heavy screen users, funded by Lutemax\'s maker, reported less self-rated eye strain, eye fatigue and headache (Stringham 2017), but a 2025 trial of a different lutein/zeaxanthin product found better tear-film measures without any change in self-rated eye strain (Lopresti 2025). Caffeine-free. No EUR storefront: the UK store (noocube.co.uk) prices in GBP and ships to the UK, Ireland, Spain, Portugal, Greece, Croatia, Poland, Sweden and Denmark, but not to Germany, France or the Netherlands. The noocube.com Trustpilot profile has no reviews yet — review terms carefully before subscribing, especially for older relatives less familiar with online subscription cancellation.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Will these prevent dementia or Alzheimer\'s?',
    a: 'No. No supplement is approved to prevent or treat dementia or Alzheimer\'s anywhere in the EU. EFSA has not authorised disease-prevention claims for any of these ingredients. The ingredients on this page have evidence for age-related cognitive support in healthy older adults — distinct from disease prevention. If you or a family member is experiencing significant memory changes, see a GP for referral to a neurologist.',
  },
  {
    q: 'Why don\'t EU labels mention the FDA "qualified health claim" for phosphatidylserine?',
    a: 'The US FDA allows phosphatidylserine to carry a qualified claim that "Very limited and preliminary scientific research suggests that phosphatidylserine may reduce the risk of dementia in the elderly", which must be followed by "FDA concludes that there is little scientific evidence supporting this claim." The same wording applies to cognitive dysfunction in the elderly (FDA letter, 13 May 2003). EFSA\'s 2010 opinion on five phosphatidylserine claims found the substance \'not sufficiently characterised in relation to the claimed effects\' and concluded that \'a cause and effect relationship cannot be established\'; the FDA\'s 2003 review, by contrast, looked at trials in people already diagnosed with dementia or cognitive dysfunction.',
  },
  {
    q: 'When should I start taking these?',
    a: 'Some of the supplements on this page have trial evidence in older adults, often only in subgroups: PS-DHA in older adults with memory complaints, citicoline in those with relatively inefficient memories, and Lion\'s Mane in mild cognitive impairment. There is no benefit shown to starting in your 30s or 40s purely as "prevention." Talk with your GP about cognitive concerns before starting any supplement, especially if you take prescription medications.',
  },
  {
    q: 'Are these safe alongside blood-pressure or cholesterol medications common in EU prescribing?',
    a: 'Generally yes for the ingredients on this page, but talk to your prescribing clinician. Bacopa and Lion\'s Mane have minimal known drug interactions. Phosphatidylserine derived from soy could interact with warfarin/anticoagulant regimens; sunflower-derived Sharp-PS GREEN is the alternative. None of the picks above contains Ginkgo; if you add it separately, it has documented anticoagulant interactions and should be discussed with a clinician.',
  },
  {
    q: 'I take a cholinesterase inhibitor (donepezil, rivastigmine, etc.). Should I avoid certain ingredients?',
    a: 'Yes — discuss with your neurologist. Huperzine A (in some imported nootropic products, though not in our EU-storefront picks above) is itself an acetylcholinesterase inhibitor and stacking is not advised. Citicoline is a different mechanism (choline donor) and is sometimes used alongside cholinesterase inhibitors under clinician supervision, but combine only with medical input.',
  },
  {
    q: 'How long until I notice anything?',
    a: 'Phosphatidylserine: its memory trials ran 15 weeks to 12 months. Citicoline: memory effects were measured after 2–3 months. Bacopa: 8–12 weeks; most positive trials ran 12 weeks. Lion\'s Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. Apart from small acute effects of Lion\'s Mane in pilot trials, none are acute-effect ingredients. Track changes over at least 12 weeks of consistent dosing, and longer for phosphatidylserine (15 weeks or more) — ideally with a baseline cognitive measure (online tests are crude but better than subjective recall).',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="aging"
      pageTitle="Best Nootropics for Aging Brain (EU)"
      pageDescription="Independent EU ranking of nootropics for adults concerned about age-related cognitive changes."
      heroParagraph="Age-related cognitive change is normal — memory recall slows, processing speed reduces. Some of the supplements on this page have trial evidence in older adults, often only in subgroups: PS-DHA in older adults with memory complaints, citicoline in those with relatively inefficient memories, and Lion's Mane in mild cognitive impairment. They are NOT treatments for dementia, Alzheimer's, or any clinical cognitive disease — and EU brands cannot legally claim otherwise under Regulation (EC) No 1924/2006 (with claims assessed by the European Food Safety Authority, EFSA). For clinical concerns, see your GP for referral to a neurologist."
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
