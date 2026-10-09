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
    name: 'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
    evidence:
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue, with smoother subjective focus than caffeine alone. Effective at 100–200mg L-theanine + 75–100mg caffeine. No caffeine alertness or attention claim is authorised in the EU: the European Food Safety Authority (EFSA) assessed a ≥75mg alertness claim favourably in 2011, but the European Commission never authorised it, and caffeine is not on the Regulation (EU) No 432/2012 list.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardised form most EU products use. Citicoline has Novel Food authorisation in the EU.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/8624220/',
  },
  {
    name: 'L-Tyrosine (or NALT)',
    evidence:
      'Precursor to dopamine + norepinephrine. Effective specifically under cognitive load or stress — improves performance on attention tasks during sleep deprivation, multitasking, or cold exposure. Clinical doses 300–500mg as N-acetyl-L-tyrosine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Alpha-GPC',
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
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses, plus L-tyrosine. Caffeine-free design lets you pair it with your own coffee or matcha for the synergistic effect. €65/mo on the brand\'s EU store, with EU orders shipped from a European depot per the brand — the strongest EU-storefront focus pick in our coverage.',
  },
  {
    product: productsEU.find(p => p.slug === 'brainzyme-focus-pro-review')!,
    rank: 2,
    whyItsHere:
      'Pairs a 350mg Camellia sinensis (matcha) EMT blend that includes L-theanine with 330mg guarana seed, 240mg ginkgo and 230mg L-tyrosine, at €31.75/mo. The label states no caffeine amount and does not split the EMT blend, so the L-theanine dose is not stated. Best value for buyers who want the acute focus effect rather than long-term cognitive support.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Lutemax 2020 has mixed evidence for screen eye strain: a 6-month trial in 48 heavy screen users, funded by Lutemax\'s maker, reported less self-rated eye strain, eye fatigue and headache (Stringham 2017), but a 2025 trial of a different lutein/zeaxanthin product found better tear-film measures without any change in self-rated eye strain (Lopresti 2025). No EUR storefront: the UK store (noocube.co.uk) prices in GBP (£54.99/mo) and ships to the UK, Ireland, Spain, Portugal, Greece, Croatia, Poland, Sweden and Denmark, but not to Germany, France or the Netherlands. 100mg L-theanine at clinical dose. Choline (100mg) comes from 250mg VitaCholine choline bitartrate; the current formula no longer contains Alpha-GPC. The noocube.com Trustpilot profile has no reviews yet — read the cancellation terms before subscribing.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for focus available in the EU?',
    a: 'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence in healthy adults — Owen et al. 2008 and multiple follow-ups. That is trial evidence, not a label claim: no caffeine alertness claim is authorised in the EU. Citicoline at 250–500mg also has multiple RCTs and Novel Food authorisation. Single-ingredient supplements claiming "powerful focus" without these are typically over-marketed.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for 8 weeks of consistent use.',
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
      heroParagraph="If you want a focus supplement in the EU, the question is not 'which brand?' but 'which ingredient at what dose, from which store?' This page ranks the products in our EU coverage, marks which ones ship from an EU storefront at EUR pricing, and includes only products that contain at least one focus-validated ingredient (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at or near clinical dose."
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
