import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for focus and attention. Each pick must contain a clinically-dosed focus ingredient (L-theanine + caffeine, citicoline, or L-tyrosine).',
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus — Evidence-Graded Picks',
    description: 'Clinical-dose audit of every focus pick. No proprietary blends, no anonymous bylines.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
    evidence:
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue, with smoother subjective focus than caffeine alone. Effective at 100–200mg L-theanine + 100mg caffeine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardized form most products use.',
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
      'Cholinergic — acute focus and reaction-time benefits in human RCTs at 300–600mg, with stronger effect than choline bitartrate. Often paired with L-theanine for "calm focus."',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18834505/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design lets you pair it with your own coffee or matcha for the synergistic effect. The only nootropic in our coverage with multiple peer-reviewed RCTs (University of Leeds).',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground to Mind Lab Pro on capsule count (7+/day) and price ($139/mo subscription) but wins on ingredient breadth.',
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
      'Includes Alpha-GPC, L-tyrosine, L-theanine. Open formula — doses are disclosed. Marketing-heavy positioning under Wolfson Brands; lower trust score than Mind Lab Pro but solid focus-ingredient coverage.',
  },
  {
    product: productsUS.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 5,
    whyItsHere:
      'Personalized via questionnaire — includes a "Clarity" formula specifically targeted at focus with L-theanine, caffeine, and Alpha-GPC. Subscription model is the main friction; pricing is $59/month per formula.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'What is the most evidence-backed nootropic for focus?',
    a: 'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence in healthy adults — Owen et al. 2008 and multiple follow-ups. Citicoline at 250–500mg also has multiple RCTs. Single-ingredient supplements claiming "powerful focus" without these are typically over-marketed.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for 8 weeks of consistent use.',
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
      heroParagraph="If you want to take a supplement to support focus, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products in our coverage that contain at least one of the four focus-validated ingredients (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at clinical dose."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
