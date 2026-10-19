import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HeadToHead, buildAlternates} from "@nootropic/ui";
import { searchItems, uiStrings } from "@/lib/search";
import type { HeadToHeadFAQ } from '@nootropic/ui';
import { productsUS, getRegionalHealthDisclaimer, sitemapDate } from '@nootropic/data';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/region';

const CURRENT_YEAR = new Date().getFullYear();

const productA = productsUS.find(p => p.slug === 'mind-lab-pro-review');
const productB = productsUS.find(p => p.slug === 'noocube-review');


export const metadata: Metadata = {
  title: `Mind Lab Pro vs NooCube ${CURRENT_YEAR}: Open Formula Comparison`,
  description:
    'Independent comparison of Mind Lab Pro vs NooCube — both open-formula nootropics. Side-by-side ingredient dosing, pricing, brand-trust scoring, and verdict.',
  alternates: buildAlternates({ regionCode: 'us', path: '/mind-lab-pro-vs-noocube/', availableInRegions: ['us'] }),
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
      'Both disclose every ingredient dose openly — the differentiator is brand trust. Mind Lab Pro has been tested in two University of Leeds studies — a 30-day placebo-controlled study its authors call pseudo-randomised (PubMed 37194920) and a 60-day placebo-controlled study that found no improvement in choice accuracy or reaction time (PubMed 40149748) — and carries a 30-day Performance Promise. NooCube is part of the Wolfson Brands portfolio with affiliate-marketing-heavy positioning. Mind Lab Pro is the stronger pick for transparency-minded buyers; NooCube competes on price and bundle offers.',
  },
  {
    q: 'Are both caffeine-free?',
    a:
      'Yes. Both Mind Lab Pro and NooCube are explicitly caffeine-free. Pair either with your own coffee or matcha for the L-theanine + caffeine effect.',
  },
  {
    q: 'Why is Mind Lab Pro more expensive?',
    a:
      'Mind Lab Pro: $69/month at full price. NooCube: $64.99 for a single one-month bottle, or $55.24 a month on its 15%-off subscription (noocube.com, checked 7 October 2026). The price gap reflects (a) trademarked extracts (Cognizin citicoline, Sharp-PS phosphatidylserine), (b) the direct-to-consumer model of Performance Lab Group Ltd (UK), the company mindlabpro.com\'s terms name, vs Wolfson\'s aggregator portfolio.',
  },
  {
    q: 'Which has better third-party testing?',
    a:
      'Mind Lab Pro is Clean Label Project certified: the Clean Label Project certificate for Performance Lab Group lists Mind Lab Pro from December 2022, and the certificate was reissued in April 2026. Labdoor scores Mind Lab Pro 99.5/100 but marks that certification as expired. ConsumerLab says a product under the Mind Lab Pro brand was approved in its Quality Certification Program, but the report is paywalled, so we cannot tell which product was tested. NooCube\'s homepage says the brand has paid for third-party testing and that each small batch is made in a GMP (Good Manufacturing Practice) certified facility, but it names no testing body (all checked 19 October 2026). Of the two, Mind Lab Pro is the one with a current certification we could check on the certifier\'s own site.',
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
  'Want a formula tested in two placebo-controlled University of Leeds studies (the 60-day one found no improvement in choice accuracy or reaction time)',
  'Want a product with a current Clean Label Project certification',
  'Are willing to pay premium for trademarked extracts (Cognizin, Sharp-PS)',
];

const whoIsForB = [
  'Want a similar open-formula option at lower per-month price',
  'Are comfortable with a 60-day refund window',
  'Don\'t mind the Wolfson Brands portfolio positioning',
  'Want to evaluate price-per-bundle (not just per-month)',
];

const verdictParagraph =
  'Both are open-formula products — neither hides doses behind proprietary blends. The differentiator is brand trust signals: Mind Lab Pro has two University of Leeds studies behind it (the 60-day one found no improvement in choice accuracy or reaction time) and a current Clean Label Project certification; NooCube carries a 60-day refund window and lower per-bottle pricing on bundles. Mind Lab Pro is the one of the two whose formula has been tested, though weakly: the authors of the 30-day study call it pseudo-randomised. For price-conscious open-formula buyers, NooCube is a fair second.';

export default function Page() {
  if (!productA || !productB) notFound();
  return (
    <HeadToHead
      productA={productA}
      productB={productB}
      siteUrl={SITE_URL}
      verdictParagraph={verdictParagraph}
      faqItems={faqItems}
      whoIsForA={whoIsForA}
      whoIsForB={whoIsForB}
      healthDisclaimer={getRegionalHealthDisclaimer('us')}
      searchItems={searchItems}
      uiStrings={uiStrings}
      updated={sitemapDate(sitemap(), '/mind-lab-pro-vs-noocube/')}
    />
  );
}
