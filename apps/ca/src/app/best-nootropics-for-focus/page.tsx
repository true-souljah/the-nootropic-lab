import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Listicle, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { ListicleFAQ, ListicleIngredientMechanism, ListiclePick } from "@nootropic/ui";
import { productsCA, getRegionalHealthDisclaimer } from '@nootropic/data';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();


export const metadata: Metadata = {
  title: `Best Nootropics for Focus in Canada ${CURRENT_YEAR}: Independent Picks Backed by Clinical Evidence`,
  description:
    'Independent ranking of the best nootropics for focus and attention available to Canadian buyers. Each pick must contain a clinically-dosed focus ingredient (L-theanine + caffeine, citicoline, or L-tyrosine).',
  alternates: buildAlternates({ regionCode: 'ca', path: '/best-nootropics-for-focus/' }),
  openGraph: {
    title: 'Best Nootropics for Focus in Canada — Evidence-Graded Picks',
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
    product: productsCA.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Open formula with 100mg L-theanine + 250mg Cognizin citicoline at clinically-validated doses. Caffeine-free design lets Canadian buyers pair it with their own coffee or matcha if they want caffeine alongside its L-theanine. Ships from the UK directly to Canadian addresses. It has been tested in two University of Leeds studies: a 30-day placebo-controlled study its authors call pseudo-randomised (Hum Psychopharmacol 2023, PubMed 37194920; immediate and delayed recall differed between groups, n=49) and a 60-day placebo-controlled study that found no improvement in choice accuracy or reaction time (Brain Sci 2025, PubMed 40149748).',
  },
  {
    product: productsCA.find(p => p.slug === 'hunter-focus-review')!,
    rank: 2,
    whyItsHere:
      'Pre-built caffeine + L-theanine 1:2 stack (100mg caffeine + 200mg L-theanine), plus 250mg citicoline and 500mg Lion\'s Mane. Ships to Canada; check the delivery estimate for Canada at checkout.',
  },
  {
    product: productsCA.find(p => p.slug === 'qualia-mind-review')!,
    rank: 3,
    whyItsHere:
      'Includes citicoline, Alpha-GPC, L-theanine, and L-tyrosine — covers nearly every evidence-backed focus mechanism. Loses ground to Mind Lab Pro on capsule count (6/day), price (US$139 per 4-week subscription shipment), and on Canadian buyers paying in USD with potential customs scrutiny on larger orders. Wins on ingredient breadth.',
  },
  {
    product: productsCA.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Includes choline (100mg, from 250mg VitaCholine choline bitartrate), Bacopa, and L-theanine 100mg at clinical dose, but no caffeine. It also contains Lutemax 2020, whose evidence for screen eye strain is mixed: a 6-month trial in 48 heavy screen users, funded by Lutemax\'s maker, reported less self-rated eye strain, eye fatigue and headache (Stringham 2017), but a 2025 trial of a different lutein/zeaxanthin product found better tear-film measures without any change in self-rated eye strain (Lopresti 2025). Open formula. The noocube.com Trustpilot profile has no reviews yet — verify subscription cancellation terms before ordering.',
  },
];

const faqItems: ListicleFAQ[] = [
  {
    q: 'Which nootropic ingredients have trial evidence for focus available in Canada?',
    a: 'L-theanine with caffeine: in trials in healthy adults the pair improved attention-switching accuracy (Owen 2008, 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626, 97mg with 40mg), though Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone. Our citicoline page rates its attention evidence as mixed: the acute attention trial in healthy adults that we cite gave it together with caffeine. Among CA-shippable products, Mind Lab Pro delivers citicoline at clinical dose; Qualia Mind and Hunter Focus both pre-build caffeine + L-theanine (100mg + 200mg).',
  },
  {
    q: 'How long does it take a focus nootropic to work?',
    a: 'Acute-effect ingredients (L-theanine, caffeine, Alpha-GPC, L-tyrosine) work within 30–60 minutes. Longer-onset ingredients (Bacopa, Lion\'s Mane) need 4–12 weeks. If you want a tonight-effect, look for L-theanine + caffeine; for compounded benefit, plan for 8 weeks of consistent use.',
  },
  {
    q: 'Are these focus nootropics regulated by Health Canada?',
    a: 'Health Canada states that "All natural health products (NHPs) sold in Canada require a product licence before being marketed", and a licensed product\'s label bears an eight-digit NPN (Natural Product Number). We found no NPN for Mind Lab Pro in Health Canada\'s Licensed Natural Health Products Database (LNHPD) (full register export searched, 2026-10-07); a licence can be held under another name, so look for an eight-digit NPN on the label; without one, a consumer\'s only route is personal importation, which Health Canada\'s GUI-0116 limits to "no more than a 90-day supply or a single course of treatment, whichever is less". Check the label for an NPN and look it up in the LNHPD.',
  },
  {
    q: 'Are focus nootropics safe to take daily?',
    a: 'The ingredients on this page (L-theanine, citicoline, Alpha-GPC, L-tyrosine, Bacopa) are generally regarded as safe for healthy adults at the clinical doses listed. People taking blood-pressure medication, stimulants, thyroid medication, or with bipolar diagnoses should consult a clinician — L-tyrosine in particular interacts with several drug classes.',
  },
  {
    q: 'Are focus nootropics alternatives to prescription stimulants in Canada?',
    a: 'No. Prescription stimulants (Adderall, Vyvanse, Concerta) are Schedule III controlled drugs in Canada and require a physician\'s prescription for ADHD diagnosis. Nootropic supplements are not pharmacologically equivalent and should not be marketed as substitutes for prescribed treatment. If you suspect ADHD, talk to your family doctor — supplements may help with focus on the margin but are not a replacement for diagnosis and treatment.',
  },
  {
    q: 'What is the best caffeine-free focus nootropic for Canadian buyers?',
    a: 'Mind Lab Pro is purpose-built as caffeine-free and is our top CA pick. It pairs well with your morning coffee or matcha if you want to add caffeine yourself.',
  },
  {
    q: 'Where can I buy focus nootropics in Canada — in a store or online?',
    a: 'The premium picks on this page (Mind Lab Pro, Hunter Focus, Qualia Mind) are sold direct by their brands and shipped to Canadian addresses; confirm Canadian delivery at checkout. Onnit Alpha Brain\'s Health Canada licence, NPN 80041968, is listed as Discontinued in the LNHPD (checked 2026-10-07), and we found no Onnit listing on amazon.ca\'s first page of search results that day. Whatever you buy in a Canadian store, look for an eight-digit NPN on the label; the LNHPD lets you check it.',
  },
];

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <Listicle
      useCase="focus"
      pageTitle="Best Nootropics for Focus in Canada"
      pageDescription="Independent ranking of the best nootropics for focus and attention available to Canadian buyers. Each pick must contain a clinically-dosed focus ingredient."
      heroParagraph="If you want to take a supplement to support focus, the question is not 'which brand?' but 'which ingredient at what dose?' This page ranks the products in our Canadian coverage that contain at least one of the four focus-validated ingredients (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC) at clinical dose. Health Canada NPN status is noted where applicable."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      regulatoryPillar={{ label: 'NPN-licensed nootropics in Canada', href: '/npn-licensed-nootropics-canada/' }}
      relatedCompares={[
        { label: "AOR Ortho•Mind vs Mind Lab Pro", href: '/aor-ortho-mind-vs-mind-lab-pro/' },
      ]}
      healthDisclaimer={getRegionalHealthDisclaimer('ca')}
      searchItems={searchItems}
      uiStrings={uiStrings}
    />
  );
}
