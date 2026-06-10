import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsAU, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus Australia ${CURRENT_YEAR}: TGA-Aware Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for focus available to Australian buyers. Each pick must contain a clinically-dosed focus ingredient (L-theanine + caffeine, citicoline, or L-tyrosine). TGA Personal Importation Scheme guidance included.',
  alternates: buildAlternates({ regionCode: 'au', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus Australia — Evidence-Graded',
    description:
      'Clinical-dose audit of every focus pick available in Australia. Personal Importation Scheme rules included. No proprietary blends, no anonymous bylines.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
    evidence:
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue, with smoother subjective focus than caffeine alone. Effective at 100–200mg L-theanine + 100mg caffeine. Both are permitted ingredients in TGA-listed therapeutic goods.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day. Cognizin is the standardised form most products use. In Australia, citicoline-containing products are typically imported under the Personal Importation Scheme rather than TGA-listed.',
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
      'Cholinergic — acute focus and reaction-time benefits in human RCTs at 300–600mg, with stronger effect than choline bitartrate. Often paired with L-theanine for "calm focus." Not in the TGA permitted-ingredients list for Listed Medicines, so Alpha-GPC products are imported under the Personal Importation Scheme.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18834505/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsAU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design lets you pair it with your own coffee or matcha for the synergistic effect. Ships from the UK directly to Australian addresses in 7–14 business days under the Personal Importation Scheme as a food supplement.',
  },
  {
    product: productsAU.find(p => p.slug === 'performance-lab-mind-review')!,
    rank: 2,
    whyItsHere:
      'Minimalist 4-ingredient formula with citicoline (250mg Cognizin), phosphatidylserine (100mg Sharp-PS Green), L-tyrosine (300mg Ajipure), and Maritime Pine Bark. Only 2 capsules per day — the lowest pill burden of any premium pick. Ships from the UK to Australia in 14–21 business days. Personal Importation Scheme food supplement.',
  },
  {
    product: productsAU.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground to Mind Lab Pro on capsule count (7+/day) and price (AUD $215/mo subscription) but wins on ingredient breadth. Contains caffeine. Note: Huperzine A in this formula may attract TGA scrutiny if therapeutic claims are attached.',
  },
  {
    product: productsAU.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 4,
    whyItsHere:
      'Contains Alpha-GPC, L-theanine, and Bacopa, but doses are hidden inside proprietary blends. Caffeine-free Classic version. Most internationally recognised nootropic brand for Australian buyers, National Sanitation Foundation (NSF) Certified for Sport — relevant for drug-tested Australian athletes. Ships from the US to Australia in 10–18 business days as a food supplement.',
  },
  {
    product: productsAU.find(p => p.slug === 'noocube-review')!,
    rank: 5,
    whyItsHere:
      'Includes Alpha-GPC, L-tyrosine, L-theanine, plus Lutemax 2020 lutein/zeaxanthin for screen-fatigue reduction — a relevant angle for Australian remote and office workers. Open formula. Trustpilot score is very low (1.9/5) — verify subscription cancellation terms before ordering. Ships from the UK/EU to Australia in 14–21 business days.',
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
    q: 'Are these focus nootropics TGA-listed in Australia?',
    a: 'No. The international focus stacks listed on this page (Mind Lab Pro, Performance Lab Mind, NooCube, Qualia Mind, Alpha Brain, Hunter Focus) are not TGA-listed therapeutic goods. They are imported under the TGA Personal Importation Scheme as food supplements — which permits Australian residents to import up to a 3-month supply for personal use. TGA-listed Australian brands (Blackmores, Caruso\'s, Swisse, Nature\'s Own, Cenovis) generally focus on broader memory and brain-health formulas (ginkgo, fish oil, B-vitamins) rather than the focus-specific stacks ranked here. We will add TGA-listed picks as their formulas evolve to include clinically-dosed focus ingredients.',
  },
  {
    q: 'Where can I buy these in Australia?',
    a: 'These products are not stocked at Chemist Warehouse, Priceline, Amcal, or Blooms — Australian pharmacy chains carry only TGA-listed therapeutic goods. The picks on this page are direct-to-consumer brands that ship to Australia via the Personal Importation Scheme. Order direct from the manufacturer. Delivery takes 7–21 business days depending on origin (UK is fastest).',
  },
  {
    q: 'Do I pay GST on these imports?',
    a: 'Yes. Since July 2018, overseas businesses with annual turnover above AUD $75,000 must charge 10% GST on goods under AUD $1,000 sold to Australian addresses. Most international supplement brands now add GST automatically at checkout.',
  },
  {
    q: 'Are focus nootropics alternatives to dexamphetamine or methylphenidate?',
    a: 'No. Dexamphetamine (Aspen, Adderall-equivalent) and methylphenidate (Ritalin, Concerta) are Schedule 8 prescription stimulants for ADHD. Nootropic supplements are not pharmacologically equivalent and should not be marketed as substitutes for prescribed treatment. If you suspect ADHD, see your GP for referral to a psychiatrist or paediatrician — supplements may help with focus on the margin but are not a replacement for proper diagnosis and treatment.',
  },
  {
    q: 'Should I cycle focus nootropics?',
    a: 'Most ingredients on this page do not require cycling. Caffeine builds tolerance, so caffeine-containing stacks (Hunter Focus, Qualia Mind) may benefit from 2-day breaks per week. Bacopa and citicoline do not show tolerance and are typically taken continuously.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus in Australia"
      pageDescription="Independent ranking of the best nootropics for focus and attention available to Australian buyers. Each pick must contain a clinically-dosed focus ingredient. TGA Personal Importation Scheme guidance included."
      heroParagraph="If you want to take a supplement to support focus, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products available to Australian buyers that contain at least one of the four focus-validated ingredients (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at clinical dose. None of these picks are Therapeutic Goods Administration (TGA) listed therapeutic goods — they ship to Australia under the TGA Personal Importation Scheme as food supplements."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'TGA-listed cognitive supplements in Australia', href: '/tga-listed-cognitive-supplements/' }}
      healthDisclaimer={getRegionalHealthDisclaimer('au')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
