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
      'Clinical-dose audit of every focus pick available in Australia. Personal Importation Scheme rules included. No proprietary blends.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: ListicleIngredientMechanism[] = [
  {
    name: 'L-Theanine + Caffeine',
    ingredientSlugs: ['l-theanine', 'caffeine'],
    evidence:
      'In controlled trials in healthy adults, the pair improved attention-switching accuracy (Owen 2008: 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626: 97mg with 40mg) and ratings of mental fatigue (Haskell 2007, PubMed 18006208: 250mg with 150mg). Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone. Both are permitted ingredients in TGA-listed therapeutic goods: theanine as an active ingredient, and caffeine as an active ingredient only for oral use in adults when the medicine consists principally of other designated active ingredients (Therapeutic Goods (Permissible Ingredients) Determination (No. 2) 2026, F2026L00707, as compiled 17 September 2026 — Compilation No. 1, F2026C00940 — Schedule 1 items 4911 and 1054; checked 2026-10-08).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    ingredientSlugs: ['citicoline'],
    evidence:
      'Choline donor + uridine source that supports phospholipid synthesis and acetylcholine production. Our citicoline page rates its attention evidence as mixed: the Cochrane review found no evidence of an attention benefit in older adults with chronic cerebral disorders, and the acute attention trial in healthy adults that we cite gave it together with caffeine. Cognizin is a standardised form. In Australia, citicoline-containing products are typically imported under the Personal Importation Scheme rather than TGA-listed.',
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
      'Cholinergic. In a 2024 placebo-controlled crossover RCT in 20 resistance-trained men, a single 315mg or 630mg dose improved Stroop test performance, with no effect on N-Back or Flanker tasks — one small, acute study. Often paired with L-theanine for "calm focus." Not found under the names alpha-GPC, choline alfoscerate, glycerylphosphorylcholine or glycerophosphocholine in Schedule 1 of the Permissible Ingredients Determination (checked 2026-10-08).',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/39683633/',
  },
];

const picks: ListiclePick[] = [
  {
    product: productsAU.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design lets you pair it with your own coffee or matcha if you want caffeine alongside its L-theanine. Ships directly to Australian addresses in 3–6 working days from the brand\'s Australian depot, or 7–14 working days when shipped from the UK (per mindlabpro.com, checked 2026-09-29).',
  },
  {
    product: productsAU.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground to Mind Lab Pro on capsule count (6/day) and price (US$139 per 4-week subscription shipment, charged in US dollars) but wins on ingredient breadth. Contains caffeine.',
  },
  {
    product: productsAU.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 3,
    whyItsHere:
      'Contains Alpha-GPC, L-theanine, and Bacopa, but doses are hidden inside proprietary blends. Caffeine-free Classic version. Most internationally recognised nootropic brand for Australian buyers, National Sanitation Foundation (NSF) Certified for Sport — relevant for drug-tested Australian athletes. Sold direct to Australian buyers by the brand; check the delivery estimate for Australia at checkout.',
  },
  {
    product: productsAU.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Includes choline (100mg, from 250mg VitaCholine choline bitartrate), L-tyrosine (250mg), L-theanine (100mg) without caffeine, plus Lutemax 2020 lutein/zeaxanthin, whose evidence for screen eye strain is mixed: a 6-month trial in 48 heavy screen users, funded by Lutemax\'s maker, reported less self-rated eye strain, eye fatigue and headache (Stringham 2017), but a 2025 trial of a different lutein/zeaxanthin product found better tear-film measures without any change in self-rated eye strain (Lopresti 2025). Open formula. The noocube.com Trustpilot profile has no reviews yet — verify subscription cancellation terms before ordering. Delivery to Australia is quoted as within 10 business days (per noocube.com, checked 2026-09-29).',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for focus?',
    a: 'L-theanine with caffeine: in trials in healthy adults the pair improved attention-switching accuracy (Owen 2008, 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626, 97mg with 40mg), though Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone. Our citicoline page rates its attention evidence as mixed: the acute attention trial in healthy adults that we cite gave it together with caffeine. Single-ingredient supplements claiming "powerful focus" without these are typically over-marketed.',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for 8 weeks of consistent use.',
  },
  {
    q: 'Are these focus nootropics TGA-listed in Australia?',
    a: 'None of the international focus stacks listed on this page (Mind Lab Pro, NooCube, Qualia Mind, Alpha Brain) returned an entry when we searched the Australian Register of Therapeutic Goods (ARTG) and the TGA cancellations database by product and sponsor name on 2026-10-06; they are sold direct to Australian buyers by their brands. The TGA Personal Importation Scheme permits Australian residents to import up to a 3-month supply for personal use. TGA-listed Australian brands (Blackmores, Caruso\'s, Swisse, Nature\'s Own, Cenovis) generally focus on broader memory and brain-health formulas (ginkgo, fish oil, B-vitamins) rather than the focus-specific stacks ranked here. We will add TGA-listed picks as their formulas evolve to include clinically-dosed focus ingredients.',
  },
  {
    q: 'Where can I buy these in Australia?',
    a: 'The picks on this page are sold direct by their brands, which ship to Australia via the Personal Importation Scheme. Order direct from the manufacturer. Delivery estimates vary by brand; check the estimate for Australia at checkout.',
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
      heroParagraph="If you want to take a supplement to support focus, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products available to Australian buyers that contain at least one of the four focus-validated ingredients (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at clinical dose. None of these picks returned an Australian Register of Therapeutic Goods (ARTG) entry when we searched the Therapeutic Goods Administration (TGA) databases on 2026-10-06 — they are sold direct to Australian buyers by their brands."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'TGA-listed cognitive supplements in Australia', href: '/tga-listed-cognitive-supplements/' }}
      relatedCompares={[
        { label: "Blackmores Brain Active vs Mind Lab Pro", href: '/blackmores-brain-active-vs-mind-lab-pro/' },
      ]}
      healthDisclaimer={getRegionalHealthDisclaimer('au')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
