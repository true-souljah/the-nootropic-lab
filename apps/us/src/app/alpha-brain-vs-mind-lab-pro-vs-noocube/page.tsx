import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ThreeWayComparisonPage } from '@nootropic/ui';
import type { ThreeWayFAQ } from '@nootropic/ui';
import { productsUS, getAuthorBySlug } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();
const author = getAuthorBySlug('stephan-kulik')!;

const productA = productsUS.find(p => p.slug === 'onnit-alpha-brain-review');
const productB = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productC = productsUS.find(p => p.slug === 'noocube-review');

export const metadata: Metadata = {
  title: `Alpha Brain vs Mind Lab Pro vs NooCube ${CURRENT_YEAR}: 3-Way Comparison`,
  description:
    'Independent 3-way comparison of Onnit Alpha Brain, Mind Lab Pro, and NooCube. Side-by-side ingredient dosing, score breakdown, price, and verdict.',
  alternates: { canonical: `${SITE_URL}/alpha-brain-vs-mind-lab-pro-vs-noocube/` },
  openGraph: {
    title: 'Alpha Brain vs Mind Lab Pro vs NooCube — 3-Way Comparison',
    description: 'Three of the most-asked-about US nootropics. Side-by-side dosing audit + verdict.',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: ThreeWayFAQ[] = [
  {
    q: 'Which of the three is best?',
    a: 'Mind Lab Pro scores highest in our editorial audit (9.2/10) — fully open formula, every dose disclosed, multiple peer-reviewed RCTs. Alpha Brain is the most accessible (sold at Whole Foods, CVS, Vitamin Shoppe) and lowest-priced when on autoship. NooCube is between them on price with a fully open formula but less third-party verification than Mind Lab Pro.',
  },
  {
    q: 'Are all three caffeine-free?',
    a: 'Mind Lab Pro and NooCube are fully caffeine-free. Alpha Brain Classic is caffeine-free; Onnit\'s Black Label and Instant variants include other ingredients you should check the label for.',
  },
  {
    q: 'Which has the best transparency?',
    a: 'Mind Lab Pro and NooCube are tied — both disclose every ingredient at its exact dose. Alpha Brain hides several active ingredient doses inside proprietary blends ("Onnit Flow Blend", "Onnit Focus Blend", "Onnit Fuel Blend"), which is a significant transparency gap.',
  },
  {
    q: 'Pricing?',
    a: 'NooCube: ~$55/mo single bottle, lower with bundles. Alpha Brain: ~$67/mo with 15% autoship discount, ~$80/mo one-time. Mind Lab Pro: $69/mo flat, no autoship pressure. NooCube has the lowest entry price; Mind Lab Pro the most predictable; Alpha Brain the cheapest if committed to autoship (with documented cancellation friction).',
  },
  {
    q: 'Which has the strongest brand-trust signals?',
    a: 'Mind Lab Pro: Clean Label Project + Lab Door + Consumer Lab third-party verifications, multiple Leeds RCTs. Alpha Brain: NSF certified, IGEN Non-GMO, Joe Rogan equity partner provides media credibility. NooCube: GMP-certified manufacturing, 60-day refund window, but parent Wolfson Brands portfolio has affiliate-marketing-heavy positioning. Mind Lab Pro wins on independent verification.',
  },
  {
    q: 'Are these alternatives to Adderall?',
    a: 'No. All three are dietary supplements regulated under DSHEA. Adderall is a Schedule II prescription stimulant. Always consult a clinician for ADHD treatment.',
  },
];

const whoIsForA = [
  'Want a brand at Whole Foods, Amazon, CVS, Vitamin Shoppe',
  'Like the Onnit ecosystem (Joe Rogan, kettlebells)',
  'Are comfortable with proprietary blends',
  'Want lowest price via autoship (read cancellation guide first)',
];

const whoIsForB = [
  'Want every ingredient and dose disclosed',
  'Care about peer-reviewed product-specific RCT evidence',
  'Want Clean Label / Consumer Lab third-party verification',
  'Prefer no autoship — manual reorder only',
];

const whoIsForC = [
  'Want similar open-formula option at lower per-month price than Mind Lab Pro',
  'Are comfortable with Wolfson Brands portfolio positioning',
  'Want a 60-day refund window (longer than Mind Lab Pro\'s 30)',
  'Prefer multi-bottle bundle pricing',
];

const verdictParagraph =
  'Mind Lab Pro earns the top score (9.2/10) on transparency, evidence base, and editorial-audit pillar coverage. NooCube (8.5/10) is a fair open-formula alternative at lower per-month cost. Alpha Brain (7.8/10) leads on accessibility and brand recognition but loses points on proprietary blends and documented subscription friction. If you can only pick one, Mind Lab Pro for transparency-priority buyers, NooCube for budget-priority buyers with similar values, Alpha Brain for retail-availability-priority buyers.';

export default function Page() {
  if (!productA || !productB || !productC) notFound();
  return (
    <ThreeWayComparisonPage
      productA={productA}
      productB={productB}
      productC={productC}
      siteUrl={SITE_URL}
      author={author}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
      whoIsForC={whoIsForC}
    />
  );
}
