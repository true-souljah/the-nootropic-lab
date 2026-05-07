import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHeadPage } from '@nootropic/ui';
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer } from '@nootropic/data';

const SITE_URL = 'https://thenootropiclab.com';
const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'noocube-review');

export const metadata: Metadata = {
  title: `Mind Lab Pro vs NooCube ${CURRENT_YEAR}: Open Formula Comparison`,
  description:
    'Independent comparison of Mind Lab Pro vs NooCube — both open-formula nootropics. Side-by-side ingredient dosing, pricing, brand-trust scoring, and verdict.',
  alternates: { canonical: `${SITE_URL}/mind-lab-pro-vs-noocube/` },
  openGraph: {
    title: 'Mind Lab Pro vs NooCube — Open Formula Comparison',
    description: 'Two open-formula nootropics, very different brand positioning. Which actually delivers?',
    type: 'article',
  },
  twitter: { card: 'summary' },
};

const faqItems: HeadToHeadFAQ[] = [
  {
    q: 'Which is better, Mind Lab Pro or NooCube?',
    a:
      'Both disclose every ingredient dose openly — the differentiator is brand trust. Mind Lab Pro is backed by multiple peer-reviewed RCTs (University of Leeds) and a 30-day Performance Promise. NooCube is part of the Wolfson Brands portfolio with affiliate-marketing-heavy positioning. Mind Lab Pro is the safer pick for transparency-minded buyers; NooCube competes on price and bundle offers.',
  },
  {
    q: 'Are both caffeine-free?',
    a:
      'Yes. Both Mind Lab Pro and NooCube are explicitly caffeine-free. Pair either with your own coffee or matcha for the L-theanine + caffeine effect.',
  },
  {
    q: 'Why is Mind Lab Pro more expensive?',
    a:
      'Mind Lab Pro: $69/month at full price. NooCube: ~$55/month single bottle, lower per-bottle pricing on multi-pack bundles. The price gap reflects (a) Mind Lab Pro\'s peer-reviewed clinical research investment, (b) trademarked extracts (Cognizin citicoline, Sharp-PS phosphatidylserine), (c) UK-based Opti-Nutra\'s direct-to-consumer model vs Wolfson\'s aggregator portfolio.',
  },
  {
    q: 'Which has better third-party testing?',
    a:
      'Mind Lab Pro publishes Clean Label Project certification + Lab Door + Consumer Lab independent verifications. NooCube discloses GMP-certified manufacturing but third-party testing details are less prominent on their public site. For Clean Label transparency, Mind Lab Pro wins.',
  },
  {
    q: 'Is NooCube a scam?',
    a:
      'No — NooCube is a real product with disclosed ingredients and a 60-day money-back guarantee. The skepticism around the Wolfson Brands portfolio relates to aggressive affiliate marketing and bundle-discount funnels (BUY 3 GET 2 FREE patterns) more than product quality. Read the ingredient list and pricing carefully; the product itself is legitimate.',
  },
  {
    q: 'Are these alternatives to Adderall?',
    a:
      'No. Both are dietary supplements regulated under DSHEA. Adderall is a Schedule II prescription stimulant. Always consult a clinician for ADHD treatment.',
  },
];

const whoIsForA = [
  'Want peer-reviewed RCT evidence (Mind Lab Pro has multiple)',
  'Care about Clean Label + Consumer Lab third-party verification',
  'Prefer no autoship pressure — manual reorder only',
  'Are willing to pay premium for trademarked extracts (Cognizin, Sharp-PS)',
];

const whoIsForB = [
  'Want a similar open-formula option at lower per-month price',
  'Are comfortable with a 60-day refund window',
  'Don\'t mind the Wolfson Brands portfolio positioning',
  'Want to evaluate price-per-bundle (not just per-month)',
];

const verdictParagraph =
  'Both are open-formula products — neither hides doses behind proprietary blends. The differentiator is brand trust signals: Mind Lab Pro carries peer-reviewed RCT evidence and Clean Label / Consumer Lab third-party testing; NooCube carries a 60-day refund window and lower per-bottle pricing on bundles. For evidence-graded buyers, Mind Lab Pro wins. For price-conscious open-formula buyers, NooCube is a fair second.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHeadPage
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
    />
  );
}
