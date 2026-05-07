import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Natural Adderall Alternatives ${CURRENT_YEAR}: An Honest Editorial (NOT Equivalents)`,
  description:
    'No supplement is equivalent to Adderall. This is an honest editorial about which over-the-counter nootropics share any mechanism with prescription stimulants and what the evidence actually shows.',
  alternates: { canonical: `${SITE_URL}/natural-adderall-alternatives/` },
  openGraph: {
    title: 'Natural Adderall Alternatives — Honest Editorial',
    description: 'No supplement replaces Adderall. Here is what the science actually says about over-the-counter focus options.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'L-Tyrosine (and NALT) — partial dopamine pathway overlap',
    evidence:
      'L-tyrosine is the precursor amino acid to dopamine and norepinephrine — the same neurotransmitters Adderall manipulates. Critical caveat: tyrosine supplementation provides building blocks, while Adderall actively releases stored dopamine and inhibits its reuptake. The mechanisms differ fundamentally. Tyrosine has documented benefit specifically under acute stress, sleep deprivation, or cold exposure (300–500mg as NALT, or 1500–2000mg free).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Caffeine + L-Theanine — stimulant adjacency',
    evidence:
      'Caffeine is the most-studied legal cognitive enhancer and works via adenosine antagonism (a different pathway than Adderall). Pairing with L-theanine smooths the focus curve and reduces jitter. This is the closest "feels-stimulant-but-isn\'t-amphetamine" combination available without prescription. 100–200mg L-theanine + 100mg caffeine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Rhodiola Rosea — stress + fatigue resistance',
    evidence:
      'Adaptogen with documented benefit for fatigue, mental performance, and stress resistance. Doesn\'t share Adderall\'s mechanism but addresses one common reason people seek a focus boost: chronic fatigue. 200–600mg standardized to 3% rosavins.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22228617/',
  },
  {
    name: 'Citicoline — choline pathway',
    evidence:
      'Choline donor + uridine source. No mechanistic overlap with Adderall, but RCTs show attention benefits in healthy adults at 250–500mg/day, and good tolerability profile alongside other ingredients.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design — most useful when you want to add it to your own coffee for the L-theanine + caffeine + citicoline + tyrosine effect together. Includes 175mg L-tyrosine (below clinical dose for acute stress, but additive when paired with tyrosine-rich diet) and 250mg Cognizin citicoline. Open formula, peer-reviewed RCTs, 30-day money-back.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes both citicoline and L-tyrosine plus Alpha-GPC and Rhodiola — covers the broadest spectrum of "Adderall-adjacent" mechanisms in a single product. Caveat: 7+ capsules/day and $139/month makes it the highest-friction option. Available with caffeinated and caffeine-free SKUs.',
  },
  {
    product: productsUS.find(p => p.slug === 'noocube-review')!,
    rank: 3,
    whyItsHere:
      'Open formula with L-tyrosine and Alpha-GPC. Caffeine-free. Lower price than Mind Lab Pro but parent company\'s broader product portfolio is affiliate-marketing-heavy — read editorial scoring carefully.',
  },
  {
    product: productsUS.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 4,
    whyItsHere:
      'Personalized via questionnaire — their "Energy" formula leans on the caffeine + L-theanine combo, while "Clarity" includes Alpha-GPC and L-tyrosine. Subscription model is the friction.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Are any supplements actually equivalent to Adderall?',
    a: 'No. Adderall is a Schedule II prescription stimulant containing amphetamine salts. No over-the-counter supplement matches its pharmacology, efficacy for ADHD, or DEA scheduling. Anything claiming to be a "natural Adderall" is either marketing puffery or a misbranded supplement and should be treated with skepticism.',
  },
  {
    q: 'Then why does this page exist?',
    a: 'Because hundreds of thousands of people search for "natural Adderall alternatives" every month. Most of the top-ranking pages overpromise. We wrote this to be the honest editorial: explain what the ingredients with any mechanistic adjacency to stimulants actually do, what the evidence shows, and what the limits are.',
  },
  {
    q: 'I have ADHD. What should I do?',
    a: 'See a clinician. ADHD is a clinical diagnosis and the first-line treatment is behavioral/educational support plus, where appropriate, prescription medication. If you cannot access stimulant medication, atomoxetine (Strattera) is a non-stimulant prescription option. Supplements are at best complementary and never a replacement.',
  },
  {
    q: 'I do not have ADHD but I want focus help. Are these safe?',
    a: 'The ingredients on this page (L-tyrosine, citicoline, L-theanine + caffeine, Rhodiola) are generally regarded as safe for healthy adults at the clinical doses listed. People taking blood-pressure medication, MAOIs, thyroid medication, or with bipolar diagnoses should consult a clinician before starting tyrosine or Rhodiola — both can interact with several drug classes.',
  },
  {
    q: 'What about modafinil?',
    a: 'Modafinil (Provigil) is a prescription wakefulness-promoting medication, not a supplement. It is sometimes used off-label for cognitive enhancement but is a regulated drug — illegal to import or use without a prescription in most jurisdictions. Online vendors selling modafinil directly are operating in regulatory gray-or-black territory and quality control is inconsistent.',
  },
  {
    q: 'What about caffeine pills, then?',
    a: 'Caffeine alone is the most-studied legal cognitive enhancer. 100–200mg of caffeine + 100–200mg of L-theanine is the simplest evidence-backed focus stack, available cheaply at any pharmacy. The supplements on this page add other mechanisms on top, but caffeine + L-theanine is the foundation.',
  },
];

const adderallDisclaimer =
  'CRITICAL: Adderall is a Schedule II prescription stimulant for ADHD and narcolepsy. NO dietary supplement is equivalent. Supplements sold as "natural Adderall alternatives" are marketing claims, not pharmacological equivalents. If you have or suspect ADHD, see a qualified clinician — supplements may help with focus on the margin in healthy adults but are not a substitute for proper diagnosis and treatment. Misuse of unprescribed stimulants is illegal and dangerous.';

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="natural-adderall-alternatives"
      pageTitle="Natural Adderall Alternatives — Honest Editorial"
      pageDescription="No supplement is equivalent to Adderall. This page covers what the evidence actually shows about over-the-counter ingredients with any mechanistic adjacency to prescription stimulants."
      heroParagraph="There is no over-the-counter substitute for Adderall. This page exists because the search query is high-volume and the existing top-ranking pages are misleading. Below: an honest review of which supplement ingredients share any mechanism with prescription stimulants, what the clinical evidence actually shows, and which products in our coverage contain them at clinical dose."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={adderallDisclaimer}
    />
  );
}
