import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus ${CURRENT_YEAR} (EU): EU Buyer Picks at Clinical Doses`,
  description:
    'Independent EU ranking of nootropics for focus and attention. EUR pricing, EU storefronts marked, ingredient framing that avoids unauthorised EU health claims. Each pick contains a clinically-dosed focus ingredient.',
  alternates: buildAlternates({ regionCode: 'eu', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus (EU) — Evidence-Graded Picks',
    description: 'EU-storefront focus picks. EUR pricing. Ingredient framing that avoids unauthorised EU health claims. No proprietary blends.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine',
    ingredientSlugs: ['l-theanine', 'caffeine'],
    evidence:
      'In controlled trials in healthy adults, the pair improved attention-switching accuracy (Owen 2008: 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626: 97mg with 40mg) and ratings of mental fatigue (Haskell 2007, PubMed 18006208: 250mg with 150mg). Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone. No caffeine alertness or attention claim is authorised in the EU: the European Food Safety Authority (EFSA) assessed a ≥75mg alertness claim favourably in 2011, but the European Commission never authorised it, and caffeine is not on the Regulation (EU) No 432/2012 list.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
    extraCitations: [
      { label: 'Giesbrecht 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/21040626/' },
      { label: 'Haskell 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/18006208/' },
      { label: 'Foxe 2012', url: 'https://pubmed.ncbi.nlm.nih.gov/22326943/' },
    ],
  },
  {
    name: 'Citicoline (CDP-Choline)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Our citicoline page rates its attention evidence as mixed: the Cochrane review found no evidence of an attention benefit in older adults with chronic cerebral disorders, and the acute attention trial in healthy adults that we cite gave it together with caffeine. Cognizin is a standardised form. Citicoline has Novel Food authorisation in the EU.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/15846601/',
  },
  {
    name: 'L-Tyrosine (or NALT)',
    ingredientSlugs: ['l-tyrosine'],
    evidence:
      'Precursor to dopamine + norepinephrine. Effective specifically under cognitive load or stress — improves performance on attention tasks during sleep deprivation, multitasking, or cold exposure. The stress trials with positive results used plain L-tyrosine at 2g a day or 100–150mg/kg.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Alpha-GPC',
    ingredientSlugs: ['alpha-gpc'],
    evidence:
      'Cholinergic. In a 2024 placebo-controlled crossover RCT in 20 resistance-trained men, a single 315mg or 630mg dose improved Stroop test performance, with no effect on N-Back or Flanker tasks — one small, acute study. Often paired with L-theanine for "calm focus." Most EU products underdose this ingredient.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/39683633/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline (our citicoline page rates its attention evidence as mixed), plus L-tyrosine. Caffeine-free design lets you pair it with your own coffee or matcha if you want caffeine alongside its L-theanine. Priced in euros on the brand\'s EU store, with EU orders shipped from a European depot per the brand — the strongest EU-storefront focus pick in our coverage.',
  },
  {
    product: productsEU.find(p => p.slug === 'brainzyme-focus-pro-review')!,
    rank: 2,
    whyItsHere:
      'Pairs a 350mg Camellia sinensis (matcha) EMT blend that includes L-theanine with 330mg guarana seed, 240mg ginkgo and 230mg L-tyrosine, at €31.75/mo. The label states no caffeine amount and does not split the EMT blend, so the L-theanine dose is not stated.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Lutemax 2020 has mixed evidence for screen eye strain: a 6-month trial in 48 heavy screen users, funded by Lutemax\'s maker, reported less self-rated eye strain, eye fatigue and headache (Stringham 2017), but a 2025 trial of a different lutein/zeaxanthin product found better tear-film measures without any change in self-rated eye strain (Lopresti 2025). No EUR storefront: the UK store (noocube.co.uk) prices in GBP and ships to the UK, Ireland, Spain, Portugal, Greece, Croatia, Poland, Sweden and Denmark, but not to Germany, France or the Netherlands. 100mg L-theanine at clinical dose. Choline (100mg) comes from 250mg VitaCholine choline bitartrate; the current formula no longer contains Alpha-GPC. The noocube.com Trustpilot profile has no reviews yet — read the cancellation terms before subscribing.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for focus available in the EU?',
    a: 'L-theanine with caffeine: in trials in healthy adults the pair improved attention-switching accuracy (Owen 2008, 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626, 97mg with 40mg), though Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone. That is trial evidence, not a label claim: no caffeine alertness claim is authorised in the EU. Our citicoline page rates its attention evidence as mixed: the acute attention trial in healthy adults that we cite gave it together with caffeine. Citicoline has Novel Food authorisation in the EU.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Bacopa: 8–12 weeks; most positive trials ran 12 weeks. Lion\'s Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for at least 12 weeks of consistent use before judging.',
  },
  {
    q: 'Do you verify that these products comply with EU rules?',
    a: 'No. These products are sold as food supplements in the EU, and labelling compliance is the seller\'s responsibility; we do not verify regulatory compliance per product. What we check is whether a product is sold from an EU storefront (every product on this page except NooCube, which is sold from a GBP-priced UK store that does not ship to Germany, France or the Netherlands), its pricing, and that no unauthorised health claim appears in our own copy: health claims on EU food labels are limited to those authorised under Regulation (EC) 1924/2006 after assessment by the European Food Safety Authority (EFSA).',
  },
  {
    q: 'Are focus nootropics safe to take daily?',
    a: 'The ingredients on this page (L-theanine, citicoline, Alpha-GPC, L-tyrosine, caffeine, Panax Ginseng) are generally regarded as safe for healthy adults at the clinical doses listed. People taking blood-pressure medication, anticoagulants, thyroid medication, or with bipolar diagnoses should consult a clinician. EFSA recommends keeping single-serving caffeine intake below 200mg.',
  },
  {
    q: 'What\'s the best caffeine-free focus nootropic in the EU?',
    a: 'Mind Lab Pro is purpose-built as caffeine-free, and EU orders ship from a European depot per the brand. It pairs well with your morning coffee or matcha. If you want zero caffeine entirely, Mind Lab Pro plus a separate L-theanine capsule is the simplest evidence-backed stack with EUR pricing.',
  },
  {
    q: 'Should I cycle focus nootropics?',
    a: 'Most ingredients on this page do not require cycling. Caffeine builds tolerance, so caffeine-containing stacks (Hunter Focus) may benefit from 2-day breaks per week. Bacopa and citicoline do not show tolerance and are typically taken continuously.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus (EU)"
      pageDescription="Independent EU ranking of nootropics for focus and attention. EUR pricing, EU storefronts, ingredient framing that avoids unauthorised EU health claims."
      heroParagraph="If you want a focus supplement in the EU, the question is not 'which brand?' but 'which ingredient at what dose, from which store?' This page ranks the products in our EU coverage, marks which ones ship from an EU storefront at EUR pricing, and includes only products that contain at least one of these ingredients: L-theanine + caffeine, citicoline, L-tyrosine or Alpha-GPC."
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
