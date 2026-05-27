import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Energy ${CURRENT_YEAR}: Sustained Cognitive Energy Without the Crash`,
  description:
    'Independent ranking of nootropics for sustained cognitive energy. Caffeine + L-theanine, Rhodiola, B-vitamins, citicoline — what actually works without the crash.',
  alternates: buildAlternates({ regionCode: 'us', path: '/best-nootropics-for-energy/' }),
  openGraph: {
    title: 'Best Nootropics for Energy — Evidence-Graded',
    description: 'Sustained cognitive energy without the caffeine crash. What evidence actually shows.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'Caffeine + L-Theanine — the foundation',
    evidence:
      'For sustained cognitive energy, caffeine + L-theanine in a 1:2 to 2:1 ratio is the most-evidence-backed combination. Theanine smooths the focus curve, reduces jitter, and prevents the post-coffee crash. 100–200mg L-theanine + 100mg caffeine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Rhodiola Rosea — fatigue resistance',
    evidence:
      'Adaptogen with documented benefit for mental fatigue and stress-induced exhaustion. Effective at 200–600mg/day standardized to 3% rosavins. Particularly useful for sustained-effort scenarios (long workdays, jet lag, exam season).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22228617/',
  },
  {
    name: 'Citicoline — cognitive demand support',
    evidence:
      'Heavy cognitive workload depletes choline. Citicoline (250–500mg/day) supports phospholipid synthesis and acetylcholine availability. Not a stimulant — but addresses the "running on empty" feeling that comes with extended cognitive work.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/22773333/',
  },
  {
    name: 'B-vitamins (B6, B12, folate)',
    evidence:
      'Methylated B-vitamins are essential cofactors for energy metabolism and neurotransmitter synthesis. Deficiency is a common (and reversible) cause of fatigue. Most quality nootropic stacks include the methylated forms (methyl-B12, methyl-folate).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/23357967/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Caffeine-free design — pair with your own coffee or matcha for the 1:1 L-theanine + caffeine effect. Includes 50mg Rhodiola and methylated B-vitamins (B6, B9, B12) plus citicoline. Best universal energy stack — you control the caffeine source and dose.',
  },
  {
    product: productsUS.find(p => p.slug === 'thesis-nootropics-review')!,
    rank: 2,
    whyItsHere:
      'Their Energy formula is purpose-built around caffeine + L-theanine + Rhodiola at meaningful doses. Personalised approach lets you try Energy in isolation. Subscription pricing is the friction. The most direct "energy supplement" pick in our coverage.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Available in caffeinated and caffeine-free variants. The caffeinated SKU includes 90mg caffeine + 200mg L-theanine — the closest match to the evidence-backed ratio. 28-ingredient breadth includes Rhodiola, citicoline, and B-vitamins. Highest-friction option (7+ caps/day, $139/mo subscription).',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Caffeine-free Classic version available widely at retail. Includes L-theanine and Bacopa. Doesn\'t directly target energy beyond the L-theanine effect, but mainstream availability + lower price than Mind Lab Pro makes it accessible.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'How is "nootropic energy" different from energy drinks?',
    a: 'Energy drinks deliver high-dose caffeine + sugar + sometimes B-vitamins for an acute lift, often followed by a crash. Nootropic stacks layer caffeine (where present) with L-theanine to smooth the curve, plus longer-acting ingredients (Rhodiola, citicoline) that support sustained cognitive output without the spike-and-crash pattern.',
  },
  {
    q: 'Can I just drink coffee with L-theanine?',
    a: 'Yes — and this is the simplest evidence-backed energy stack. 100mg of caffeine (one cup of coffee) + 200mg of L-theanine (capsule) is the most-replicated cognitive-energy combination. The supplements on this page add Rhodiola, citicoline, and B-vitamins on top, which compound the benefit.',
  },
  {
    q: 'Will these help with chronic fatigue?',
    a: 'No. Chronic fatigue (especially Chronic Fatigue Syndrome / ME-CFS) is a clinical condition requiring medical evaluation. Persistent unexplained fatigue could be thyroid dysfunction, anemia, sleep apnea, depression, or other conditions — see a clinician. Supplements may help with normal-spectrum tiredness in healthy adults but are not a treatment for clinical fatigue conditions.',
  },
  {
    q: 'Best caffeine-free energy nootropic?',
    a: 'Rhodiola Rosea at 200–600mg has the most caffeine-free energy evidence — particularly for fatigue under stress. For acute "wake up" without caffeine, the evidence is weaker; consider whether your need is sustained energy (Rhodiola) vs acute alertness (caffeine + L-theanine).',
  },
  {
    q: 'How long until energy nootropics work?',
    a: 'Caffeine + L-theanine: acute (30–60 minutes). Rhodiola: 1–2 weeks. Citicoline + B-vitamins: 2–4 weeks. None require months. If you are not feeling effects within 4 weeks, the supplement is unlikely to be addressing the underlying cause of your fatigue.',
  },
  {
    q: 'Are these safe alongside coffee?',
    a: 'The supplements on this page are designed to be used alongside coffee — most are caffeine-free, and the ones with caffeine list the dose so you can adjust your coffee intake. Total daily caffeine should stay under 400mg for most healthy adults; lower if you are pregnant, breastfeeding, or sensitive to caffeine.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="energy"
      pageTitle="Best Nootropics for Energy"
      pageDescription="Independent ranking of nootropics for sustained cognitive energy. Caffeine + L-theanine, Rhodiola, citicoline."
      heroParagraph="If you want sustained cognitive energy without the spike-and-crash pattern of energy drinks, the answer is layered: caffeine + L-theanine for the acute effect, Rhodiola for fatigue resistance, citicoline + B-vitamins for the underlying cognitive-demand support. This page ranks the products in our coverage that combine these ingredients at evidence-backed doses."
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
