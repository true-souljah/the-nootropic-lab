import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer, ingredients } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for focus and attention. Each pick must contain a clinically-dosed focus ingredient (L-theanine + caffeine, citicoline, or L-tyrosine).',
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus — Evidence-Graded Picks',
    description: 'Clinical-dose audit of every focus pick. No proprietary blends.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine',
    ingredientSlugs: ['l-theanine', 'caffeine'],
    evidence:
      'In controlled trials in healthy adults, the pair improved attention-switching accuracy (Owen 2008: 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626: 97mg with 40mg) and ratings of mental fatigue (Haskell 2007, PubMed 18006208: 250mg with 150mg). Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone.',
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
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Our citicoline page rates its attention evidence as mixed: the Cochrane review found no evidence of an attention benefit in older adults with chronic cerebral disorders, and the acute attention trial in healthy adults that we cite gave it together with caffeine. Cognizin is a standardized form.',
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
      'Cholinergic. In a 2024 placebo-controlled crossover RCT in 20 resistance-trained men, a single 315mg or 630mg dose improved Stroop test performance, with no effect on N-Back or Flanker tasks — one small, acute study. Often paired with L-theanine for "calm focus."',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/39683633/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline (our citicoline page rates its attention evidence as mixed). Caffeine-free design lets you pair it with your own coffee or matcha if you want caffeine alongside its L-theanine. It has been tested in two University of Leeds studies: a 30-day placebo-controlled study its authors call pseudo-randomised (Hum Psychopharmacol 2023, PubMed 37194920; immediate and delayed recall differed between groups, n=49) and a 60-day placebo-controlled study that found no improvement in choice accuracy or reaction time (Brain Sci 2025, PubMed 40149748).',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground to Mind Lab Pro on capsule count (6/day) and price ($139/mo subscription) but wins on ingredient breadth.',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 3,
    whyItsHere:
      'Contains Alpha-GPC, L-theanine, and Bacopa, but doses are hidden inside proprietary blends. Caffeine-free Classic version is widely available at Whole Foods, Amazon, CVS — accessibility is its strongest pitch for focus buyers.',
  },
  {
    product: productsUS.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Includes choline (VitaCholine), L-tyrosine (250mg, below our 2,000mg reference dose) and L-theanine (100mg) without caffeine. Open formula — doses are disclosed. Marketing-heavy positioning under Wolfson Brands; lower trust score than Mind Lab Pro.',
  },
  {
    product: productsUS.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 5,
    whyItsHere:
      'Personalized via questionnaire — includes a "Clarity" formula targeted at focus with CDP choline (250mg), Lion\'s Mane (500mg) and, in its caffeinated version, caffeine (100mg). Subscription model is the main friction: a 1-month Clarity subscription is $59 a month (one-time purchase $89 plus shipping, checked 9 October 2026).',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for focus?',
    a: 'L-theanine with caffeine: in trials in healthy adults the pair improved attention-switching accuracy (Owen 2008, 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626, 97mg with 40mg), though Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone. Our citicoline page rates its attention evidence as mixed: the acute attention trial in healthy adults that we cite gave it together with caffeine.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Bacopa: 8–12 weeks; most positive trials ran 12 weeks. Lion\'s Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for at least 12 weeks of consistent use before judging.',
  },
  {
    q: 'Are focus nootropics safe to take daily?',
    a: 'The ingredients on this page (L-theanine, citicoline, Alpha-GPC, L-tyrosine, Bacopa) are generally regarded as safe for healthy adults at the clinical doses listed. People taking blood-pressure medication, stimulants, thyroid medication, or with bipolar diagnoses should consult a clinician — L-tyrosine in particular interacts with several drug classes.',
  },
  {
    q: 'Are focus nootropics alternatives to Adderall?',
    a: 'No. Adderall is a Schedule II prescription stimulant for ADHD. Nootropic supplements are not pharmacologically equivalent and should not be marketed as substitutes for prescribed treatment. If you suspect ADHD, see a clinician — supplements may help with focus on the margin but are not a replacement for proper diagnosis and treatment.',
  },
  {
    q: 'What\'s the best caffeine-free focus nootropic?',
    a: 'Mind Lab Pro is purpose-built as caffeine-free. It pairs well with your morning coffee or matcha. If you want zero caffeine entirely, Mind Lab Pro + a separate L-theanine capsule is the simplest evidence-backed stack.',
  },
  {
    q: 'Should I cycle focus nootropics?',
    a: 'Most ingredients on this page do not require cycling. Caffeine builds tolerance, so caffeine-containing stacks may benefit from 2-day breaks per week. Bacopa and citicoline do not show tolerance and are typically taken continuously.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus"
      pageDescription="Independent ranking of the best nootropics for focus and attention. Each pick must contain a clinically-dosed focus ingredient."
      heroParagraph="If you want to take a supplement to support focus, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products in our coverage that contain at least one of these four ingredients: L-theanine + caffeine, citicoline, L-tyrosine or Alpha-GPC."
      ingredientMechanism={ingredientMechanism}
      ingredientPages={ingredients}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'FDA framework for nootropic supplements', href: '/are-nootropics-fda-approved/' }}
      relatedCompares={[
        { label: "Mind Lab Pro vs Alpha Brain", href: '/mind-lab-pro-vs-alpha-brain/' },
        { label: "Mind Lab Pro vs Qualia Mind", href: '/mind-lab-pro-vs-qualia-mind/' },
        { label: "Alpha Brain vs Qualia Mind", href: '/alpha-brain-vs-qualia-mind/' },
        { label: "Mind Lab Pro vs NooCube", href: '/mind-lab-pro-vs-noocube/' },
      ]}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
