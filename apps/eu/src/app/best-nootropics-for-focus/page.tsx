import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsEU, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://eu.thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Best Nootropics for Focus ${CURRENT_YEAR} (EU): EU-Compliant Picks at Clinical Doses`,
  description:
    'Independent EU ranking of nootropics for focus and attention. EUR pricing, EU storefronts only, EFSA-aware framing. Each pick contains a clinically-dosed focus ingredient.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-focus/` },
  openGraph: {
    title: 'Best Nootropics for Focus (EU) — Evidence-Graded Picks',
    description: 'EU-storefront focus picks. EUR pricing. EFSA-compliant ingredient framing. No proprietary blends.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
    evidence:
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue, with smoother subjective focus than caffeine alone. Effective at 100–200mg L-theanine + 75–100mg caffeine. EFSA has authorised the alertness/attention claim for caffeine at ≥75mg per serving (Regulation (EU) No 432/2012).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardised form most EU products use. Citicoline has Novel Food authorisation in the EU.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
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
      'Cholinergic — acute focus and reaction-time benefits in human RCTs at 300–600mg, with stronger effect than choline bitartrate. Often paired with L-theanine for "calm focus." Most EU products underdose this ingredient.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18834505/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsEU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses, plus L-tyrosine. Caffeine-free design lets you pair it with your own coffee or matcha for the synergistic effect. Ships from a dedicated EU distribution centre at €65/mo with no import duties — the strongest EU-storefront focus pick in our coverage.',
  },
  {
    product: productsEU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Citicoline (250mg Cognizin) and L-Tyrosine (300mg NALT) both at clinical dose in a 2-capsule serving — the lowest pill burden of any EU-storefront focus stack. Same Opti-Nutra manufacturer as Mind Lab Pro. €55/mo with EUR pricing. Pick this if you want a precision focus stack without the broader memory/mood ingredients.',
  },
  {
    product: productsEU.find(p => p.slug === 'brainzyme-focus-pro-review')!,
    rank: 3,
    whyItsHere:
      'UK-made, FSA + EU-compliant. Combines natural caffeine from matcha (~40mg) and guarana (~20mg) with 100mg L-theanine — a textbook L-theanine + caffeine focus stack at €40/mo. Best value for buyers who want the acute focus effect rather than long-term cognitive support.',
  },
  {
    product: productsEU.find(p => p.slug === 'braineffect-focus-review')!,
    rank: 4,
    whyItsHere:
      'German-made, ships from Berlin with next-day delivery in DACH. 80mg caffeine (above the EFSA 75mg alertness-claim threshold) plus EFSA-recognised Panax Ginseng and Ginkgo Biloba. The default focus pick for DACH buyers who value local manufacturing — but only 14-day money-back, the shortest in this list.',
  },
  {
    product: productsEU.find(p => p.slug === 'noocube-review')!,
    rank: 5,
    whyItsHere:
      'EU storefront with EUR pricing and Lutemax 2020 specifically for screen-worker eye strain. 100mg L-theanine at clinical dose. Alpha-GPC (50mg) is significantly underdosed versus the 300mg clinical anchor. Trustpilot 1.9/5 reflects subscription cancellation complaints — read the cancellation terms before subscribing.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for focus available in the EU?',
    a: 'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence in healthy adults — Owen et al. 2008 and multiple follow-ups. EFSA has authorised the alertness claim for caffeine at ≥75mg per serving. Citicoline at 250–500mg also has multiple RCTs and Novel Food authorisation. Single-ingredient supplements claiming "powerful focus" without these are typically over-marketed.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for 8 weeks of consistent use.',
  },
  {
    q: 'Are these products fully EU-compliant?',
    a: 'Every product on this page has a dedicated EU storefront and uses ingredients with established food-supplement status under EU Directive 2002/46/EC. Health-claim language on labels follows EFSA-authorised claims under Regulation (EC) 1924/2006. Citicoline is authorised under Novel Food Regulation (EU) 2015/2283. We exclude products that use ingredient blends or claims that would not pass EFSA review.',
  },
  {
    q: 'Are focus nootropics safe to take daily?',
    a: 'The ingredients on this page (L-theanine, citicoline, Alpha-GPC, L-tyrosine, caffeine, Panax Ginseng, Ginkgo Biloba) are generally regarded as safe for healthy adults at the clinical doses listed. People taking blood-pressure medication, anticoagulants (Ginkgo interaction), thyroid medication, or with bipolar diagnoses should consult a clinician. EFSA recommends keeping single-serving caffeine intake below 200mg.',
  },
  {
    q: 'What\'s the best caffeine-free focus nootropic in the EU?',
    a: 'Mind Lab Pro and Performance Lab Mind are both purpose-built as caffeine-free and ship from EU distribution centres. They pair well with your morning coffee or matcha. If you want zero caffeine entirely, either of those plus a separate L-theanine capsule is the simplest evidence-backed stack with EUR pricing.',
  },
  {
    q: 'Should I cycle focus nootropics?',
    a: 'Most ingredients on this page do not require cycling. Caffeine builds tolerance, so caffeine-containing stacks (BRAINEFFECT FOCUS, Brainzyme, Hunter Focus) may benefit from 2-day breaks per week. Bacopa and citicoline do not show tolerance and are typically taken continuously.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="focus"
      pageTitle="Best Nootropics for Focus (EU)"
      pageDescription="Independent EU ranking of nootropics for focus and attention. EUR pricing, EU storefronts, EFSA-aware framing."
      heroParagraph="If you want a focus supplement in the EU, the question is not 'which brand?' but 'which ingredient at what dose, from a compliant EU storefront?' This page ranks the products in our coverage that ship from within the EU at EUR pricing, comply with EU Directive 2002/46/EC, and contain at least one focus-validated ingredient (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at or near clinical dose."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('eu')}
    />
  );
}
