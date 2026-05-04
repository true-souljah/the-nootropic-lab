import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'onnit-alpha-brain-review');
const productB = productsUS.find(p => p.slug === 'qualia-mind-review');

export const metadata: Metadata = {
  title: `Alpha Brain vs Qualia Mind ${CURRENT_YEAR}: Mainstream Brand vs Premium Megadose`,
  description:
    'Independent comparison of Onnit Alpha Brain vs Qualia Mind. Mainstream retail-distributed nootropic vs premium 28-ingredient stack. Side-by-side dosing audit and verdict.',
  alternates: { canonical: `${SITE_URL}/alpha-brain-vs-qualia-mind/` },
  openGraph: {
    title: 'Alpha Brain vs Qualia Mind — Independent Head-to-Head',
    description: 'Mainstream Onnit nootropic vs premium Qualia megadose. Which makes more sense?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, Alpha Brain or Qualia Mind?',
    a:
      'They occupy different market positions. Alpha Brain is mainstream — sold at Whole Foods, Amazon, CVS, Vitamin Shoppe — with broad media credibility (Joe Rogan equity partner). Qualia Mind is premium-positioned with 28 ingredients and a doctor-formulated narrative. Alpha Brain hides doses in proprietary blends; Qualia Mind discloses each ingredient. If you prioritize transparency, Qualia wins. If you prioritize accessibility and lower price, Alpha Brain.',
  },
  {
    q: 'Why does Qualia Mind cost so much more?',
    a:
      'Qualia Mind one-time is $159/month vs Alpha Brain at ~$67-80/month. Qualia\'s pricing reflects (a) 28-ingredient formulation cost, (b) trademarked extracts (e.g. SmartSeed, RealLionsMane), (c) direct-to-consumer-only distribution. Alpha Brain has scale economies through retail distribution.',
  },
  {
    q: 'Are both safe to take daily?',
    a:
      'Both use food-grade ingredients generally regarded as safe for healthy adults. Onnit Alpha Brain has documented user reports of nausea, hot flashes, and unusually vivid dreams (likely from the Huperzine A acetylcholinesterase inhibition). Qualia Mind\'s wider ingredient panel raises polypharmacy concerns — discuss with a clinician if you take prescription medications.',
  },
  {
    q: 'Which has a better money-back guarantee?',
    a:
      'Both offer 100-day money-back guarantees on first orders, though Onnit\'s implementation has documented friction (FTC actions historically focused on subscription cancellation). Qualia\'s 100-day guarantee is paired with subscription pricing that auto-converts after the introductory month — read the fine print.',
  },
  {
    q: 'Do either work for ADHD?',
    a:
      'Neither is approved for ADHD. They are dietary supplements, not pharmaceuticals. Some ingredients (L-tyrosine, citicoline, Bacopa) have weak evidence for attention-adjacent benefits but should not replace prescribed ADHD treatment. Always consult a clinician.',
  },
  {
    q: 'Can I buy them at the same retailer?',
    a:
      'Alpha Brain is widely available — Whole Foods, Amazon, Vitamin Shoppe, CVS, Sprouts, GNC. Qualia Mind is direct-to-consumer through neurohacker.com plus a few specialty retailers. If retail availability matters, Alpha Brain wins decisively.',
  },
];

const whoIsForA = [
  'Want a brand at Whole Foods, Amazon, CVS, Vitamin Shoppe',
  'Prefer the lower price point with autoship discount',
  'Don\'t mind proprietary blends',
  'Like the Onnit ecosystem (Joe Rogan, kettlebells, etc.)',
];

const whoIsForB = [
  'Want every ingredient and dose disclosed',
  'Believe in 28-ingredient broad-spectrum cognitive support',
  'Are willing to take 7+ capsules per day',
  'Are comfortable with $139/mo subscription pricing for the breadth',
];

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHeadPage
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
    />
  );
}
