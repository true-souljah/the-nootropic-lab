import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseListPage } from '@nootropic/ui';
import type { UseCaseFAQ, IngredientMechanism, UseCasePick } from '@nootropic/ui';
import { productsUS, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

export const metadata: Metadata = {
  title: `Best Nootropics for ADHD-Adjacent Focus ${CURRENT_YEAR}: Independent Picks (NOT a Substitute for Medical Treatment)`,
  description:
    'Independent ranking of nootropics that support attention in adults whose ADHD-like focus difficulties are clinically managed. NOT a replacement for prescription stimulants. Always consult a clinician.',
  alternates: { canonical: `${SITE_URL}/best-nootropics-for-adhd/` },
  openGraph: {
    title: 'Nootropics for ADHD-Adjacent Focus — What the Evidence Says',
    description: 'Honest editorial: supplements are not a substitute for ADHD treatment. Here is what they may help with on the margin.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const ingredientMechanism: IngredientMechanism[] = [
  {
    name: 'L-Tyrosine (and NALT)',
    evidence:
      'Precursor to dopamine and norepinephrine — the same neurotransmitter systems targeted by ADHD stimulants (Adderall, Ritalin). Tyrosine does NOT replicate stimulant effects but may modestly support attention under cognitive load or stress. Studied at 300–500mg as NALT or 1500–2000mg as free tyrosine.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/26424423/',
  },
  {
    name: 'Bacopa Monnieri',
    evidence:
      'Multiple RCTs in adults (and a smaller body of evidence in children with ADHD) show modest improvements in attention, memory consolidation, and impulse control after 12+ weeks at 300mg standardized to 50% bacosides. Onset is slow — this is not an acute-effect ingredient.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/24252493/',
  },
  {
    name: 'Citicoline (CDP-Choline)',
    evidence:
      'Choline donor + uridine source. A 2008 RCT in adolescent males (Silveri et al.) showed attention improvements at 250–500mg/day. Generally well-tolerated; potentially complementary to ADHD medication under clinician supervision.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18834505/',
  },
  {
    name: 'L-Theanine + Caffeine',
    evidence:
      'Smooths the focus-and-jitter profile of caffeine. People who need caffeine for focus but find it makes them anxious or shaky often respond better to a 1:2 to 2:1 L-theanine/caffeine ratio. Not specific to ADHD but useful for the caffeine-using subset.',
    citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
  },
];

const picks: UseCasePick[] = [
  {
    product: productsUS.find(p => p.slug === 'mind-lab-pro-review')!,
    rank: 1,
    whyItsHere:
      'Includes citicoline at the clinically-studied dose (250mg Cognizin), Bacopa, L-theanine, and L-tyrosine — four ingredients with attention-adjacent evidence. Caffeine-free, so it does not stack stimulant burden on top of any prescribed ADHD medication. Open formula lets your clinician evaluate every dose.',
  },
  {
    product: productsUS.find(p => p.slug === 'qualia-mind-review')!,
    rank: 2,
    whyItsHere:
      'Broad-spectrum stack with citicoline, Alpha-GPC, L-tyrosine, and Bacopa. Higher capsule count (7+/day) and price ($139/mo subscription) are friction. Not advisable to combine with prescription stimulants without clinician input — too many neurotransmitter-active ingredients.',
  },
  {
    product: productsUS.find(p => p.slug === 'onnit-alpha-brain-review')!,
    rank: 3,
    whyItsHere:
      'Contains Bacopa and L-theanine but proprietary blends hide several doses, making it harder for a clinician to evaluate. The Joe Rogan / mainstream brand recognition makes it the supplement people most often ask about — included for transparency.',
  },
  {
    product: productsUS.find(p => p.slug === 'noocube-review')!,
    rank: 4,
    whyItsHere:
      'Open formula including L-tyrosine and Alpha-GPC. Lower price than Mind Lab Pro. Marketing-heavy positioning, but the formula is reasonable for ADHD-adjacent focus support.',
  },
];

const faqItems: UseCaseFAQ[] = [
  {
    q: 'Can nootropics replace Adderall or other ADHD medication?',
    a: 'No. Adderall, Vyvanse, and Ritalin are prescription stimulants with documented efficacy for ADHD. Nootropic supplements are not pharmacologically equivalent and should not be marketed as substitutes. If you have or suspect ADHD, work with a qualified clinician on diagnosis and treatment. Supplements may complement (not replace) treatment under clinician supervision.',
  },
  {
    q: 'Are any nootropics FDA-approved for ADHD?',
    a: 'No. No dietary supplement is FDA-approved for ADHD. The supplements on this page are sold under DSHEA as foods, not drugs, and cannot legally claim to treat ADHD. The most you can say is that some ingredients have evidence for attention-adjacent benefits in healthy adults.',
  },
  {
    q: 'I take Adderall. Is it safe to add a nootropic?',
    a: 'Discuss with your prescribing clinician. L-tyrosine in particular acts on the same dopamine pathway as stimulant ADHD medication and could compound effects. Bacopa and citicoline are generally well-tolerated alongside stimulants but interactions vary. Do not combine without clinician input.',
  },
  {
    q: 'What about kids with ADHD?',
    a: 'This page is written for adults. Pediatric ADHD treatment must be managed by a child psychiatrist or pediatrician. Some Bacopa and Omega-3 RCTs have been conducted in children, but supplement use in pediatric ADHD should never be self-directed.',
  },
  {
    q: 'How long until I notice an effect?',
    a: 'L-tyrosine and L-theanine + caffeine work acutely (30–60 minutes). Citicoline shows benefit within a few weeks. Bacopa requires 8–12 weeks of consistent dosing. If you do not notice anything after 12 weeks of consistent use, the supplement is unlikely to be the right one for your physiology.',
  },
  {
    q: 'What about racetams (piracetam, aniracetam)?',
    a: 'Racetams have some evidence for attention and cognition but are not regulated as supplements in the US — they are sold as "research chemicals." We do not include them in our editorial picks because of regulatory uncertainty and inconsistent quality control across vendors.',
  },
];

const ymylDisclaimer =
  'IMPORTANT: This page is not medical advice. ADHD is a clinical diagnosis that requires evaluation by a qualified healthcare professional. Nootropic supplements are not approved by the FDA to treat ADHD or any disease, and they are not equivalent to prescription stimulants like Adderall, Vyvanse, or Ritalin. The supplements on this page may help with attention-adjacent benefits in healthy adults, but they are not a substitute for proper ADHD diagnosis and treatment. Always consult a clinician before adding a supplement to any treatment regimen.';

export default function Page() {
  if (picks.some(p => !p.product)) notFound();
  return (
    <UseCaseListPage
      useCase="adhd"
      pageTitle="Best Nootropics for ADHD-Adjacent Focus"
      pageDescription="Independent ranking of nootropics that may support attention. NOT a replacement for prescription ADHD medication. Always consult a clinician."
      heroParagraph="If you have ADHD or suspect you do, the right step is a clinical evaluation — not a supplement. This page covers what the evidence says about nootropic ingredients with attention-adjacent benefits, ranks the products in our coverage that contain them at clinical dose, and explains the limits clearly. Read the disclaimer first."
      ingredientMechanism={ingredientMechanism}
      picks={picks}
      faqItems={faqItems}
      siteUrl={SITE_URL}
      author={author}
      healthDisclaimer={ymylDisclaimer}
    />
  );
}
